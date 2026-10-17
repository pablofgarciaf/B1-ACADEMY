import { readAcademicProgress } from '@/lib/academic-progress';
import { randomUUID, createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { requireBearerUser } from '@/lib/server-auth';
import { getModuleById } from '@/lib/curriculum-data';
import { practicasDelModulo } from '@/lib/practice-registry';
import { buildStudentDocId, getStudentDisplayName } from '@/lib/student-doc';
import { hasInitializedCompany } from '@/lib/company-server';
import { moduloInduccionCompleto, MODULO_INDUCCION } from '@/lib/requisitos-aula';
import {
  EXAM_BANK, EXAM_DURATION_MS, EXAM_QUESTIONS_PER_ATTEMPT, MAX_ATTEMPTS_PER_DAY, MIN_ANSWER_WORDS,
  PASS_MIN_PER_QUESTION, PASS_TOTAL, POINTS_PER_QUESTION, type ExamQuestion,
} from '@/lib/exam-bank';
import { evaluateAnswer, EvaluatorUnavailableError, type QuestionResult } from '@/lib/exam-evaluator';

export const runtime = 'nodejs';

const requestSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('start'), moduleId: z.string().min(1).max(80) }),
  z.object({ action: z.literal('answer'), examId: z.string().uuid(), questionNumber:z.number().int().min(1).max(10), answer: z.string().trim().min(1).max(6000) }),
]);

interface ExamSession {
  uid: string; moduleId: string; questionOrder: number[]; answers: string[]; results: QuestionResult[];
  status: 'in_progress' | 'passed' | 'failed' | 'expired'; createdAt: number; expiresAt: number;
  bankHash: string;
}
const bankHash = (bank: ExamQuestion[]) => createHash('sha256').update(JSON.stringify(bank)).digest('hex');

const sessions = () => adminDb.collection('exam_sessions');

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function questionPayload(bank: ExamQuestion[], session: ExamSession) {
  const index = session.answers.length;
  return {
    questionNumber: index + 1,
    totalQuestions: session.questionOrder.length,
    question: bank[session.questionOrder[index]].question,
    expiresAt: session.expiresAt,
  };
}

export async function POST(request: Request) {
  let user;
  try { user = await requireBearerUser(request); } catch { return NextResponse.json({ error: 'No autorizado.' }, { status: 401 }); }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 });

  try {
    const studentName = getStudentDisplayName(user.profile, user.email);

    if (parsed.data.action === 'start') {
      const courseModule = getModuleById(parsed.data.moduleId);
      const bank = EXAM_BANK[parsed.data.moduleId];
      if (!courseModule || !bank) return NextResponse.json({ error: 'Este módulo aún no tiene examen.' }, { status: 404 });

      // Requisito indispensable: la empresa B1 Center debe estar inicializada
      const tieneEmpresa = await hasInitializedCompany(user.uid);
      if (!tieneEmpresa) {
        return NextResponse.json({ error: 'Debes crear tu empresa de práctica B1 Center en el Paso 0 antes de rendir el examen.' }, { status: 403 });
      }

      // Requisito: el módulo 1 (inducción) es obligatorio para todos los demás módulos
      if (courseModule.id !== MODULO_INDUCCION && courseModule.id !== 'mod-ventas' && !(await moduloInduccionCompleto(user.uid, user.profile.role, studentName, user.email))) {
        return NextResponse.json({ error: 'Completa primero el Módulo 1 (inducción) para acceder al examen de este módulo.' }, { status: 403 });
      }

      // Requisito: todas las clases del módulo completadas y todas las prácticas aprobadas (validado en el servidor).
      const progress=await readAcademicProgress(user.uid,courseModule.id,studentName,user.email);
      const completed=new Set(progress.completedClasses);
      const pending = courseModule.classes.filter((c) => !completed.has(c.id));
      if (pending.length > 0) {
        return NextResponse.json({ error: `Te faltan ${pending.length} clase(s) por completar: ${pending.map((c) => c.title).join(', ')}.` }, { status: 403 });
      }

      const passedPractices = new Set<string>(progress.passedPractices);
      const pendingPractices = practicasDelModulo(courseModule.id).filter((p) => !passedPractices.has(p));
      if (pendingPractices.length > 0) {
        return NextResponse.json({ error: `Te faltan ${pendingPractices.length} práctica(s) del simulador por aprobar en este módulo antes de iniciar el examen oral.` }, { status: 403 });
      }

      const now=Date.now(),examId=randomUUID();
      const session:ExamSession={uid:user.uid,moduleId:courseModule.id,bankHash:bankHash(bank),questionOrder:shuffle(bank.map((_,i)=>i)).slice(0,EXAM_QUESTIONS_PER_ATTEMPT),answers:[],results:[],status:'in_progress',createdAt:now,expiresAt:now+EXAM_DURATION_MS};
      const quotaRef=adminDb.collection('exam_attempts').doc(buildStudentDocId(courseModule.id,user.uid));
      const opened=await adminDb.runTransaction(async tx=>{
        const quota=await tx.get(quotaRef),data=quota.data();
        const active=data?.activeId?await tx.get(sessions().doc(data.activeId)):null;
        const current=active?.data() as ExamSession|undefined;
        if(current?.uid===user.uid&&current.status==='in_progress'&&current.expiresAt>now&&current.bankHash===session.bankHash)return {id:active!.id,session:current,resumed:true};
        const attempts=(data?.attempts??[]).filter((n:number)=>n>now-86400_000);
        if(attempts.length>=MAX_ATTEMPTS_PER_DAY)throw new Error('EXAM_QUOTA');
        tx.create(sessions().doc(examId),session);tx.set(quotaRef,{uid:user.uid,attempts:[...attempts,now],activeId:examId});
        return {id:examId,session,resumed:false};
      });
      return NextResponse.json({examId:opened.id,...questionPayload(bank,opened.session),resumed:opened.resumed});
    }
    const answerRequest=parsed.data;
    const words=answerRequest.answer.split(/\s+/).filter(Boolean).length;
    if(words<MIN_ANSWER_WORDS)return NextResponse.json({error:'Desarrolla tu respuesta con al menos '+MIN_ANSWER_WORDS+' palabras.'},{status:400});
    const ref=sessions().doc(answerRequest.examId),reservation=randomUUID();
    const session=await adminDb.runTransaction(async tx=>{
      const snap=await tx.get(ref),current=snap.data() as (ExamSession&{processing?:string;processingUntil?:number})|undefined;
      if(!current||current.uid!==user.uid)throw new Error('EXAM_NOT_FOUND');
      if(current.bankHash!==bankHash(EXAM_BANK[current.moduleId]??[]))throw new Error('EXAM_CONTENT_CHANGED');
      if(current.status!=='in_progress'||current.answers.length!==answerRequest.questionNumber-1)throw new Error('EXAM_STALE');
      if(current.expiresAt<Date.now())throw new Error('EXAM_EXPIRED');
      if(current.processing && (current.processingUntil??0)>Date.now())throw new Error('EXAM_BUSY');
      tx.update(ref,{processing:reservation,processingUntil:Date.now()+120_000});return current;
    });
    const bank=EXAM_BANK[session.moduleId],item=bank[session.questionOrder[session.answers.length]];
    let result:QuestionResult;
    try{result=await evaluateAnswer(item.question,item.rubric,answerRequest.answer,POINTS_PER_QUESTION);}
    catch(error){await adminDb.runTransaction(async tx=>{const snap=await tx.get(ref);if(snap.data()?.processing===reservation)tx.update(ref,{processing:'',processingUntil:0});});throw error;}
    session.answers.push(answerRequest.answer);session.results.push(result);
    const finished=session.answers.length>=session.questionOrder.length;
    const total=session.results.reduce((sum,r)=>sum+r.score,0),weakest=Math.min(...session.results.map(r=>r.score));
    const passed=finished&&total>=PASS_TOTAL&&weakest>=PASS_MIN_PER_QUESTION;
    await adminDb.runTransaction(async tx=>{
      const snap=await tx.get(ref),current=snap.data();
      if(current?.processing!==reservation || current.answers.length!==answerRequest.questionNumber-1)throw new Error('EXAM_STALE');
      tx.update(ref,{answers:session.answers,results:session.results,status:finished?(passed?'passed':'failed'):'in_progress',total,processing:'',processingUntil:0});
      if(finished)tx.set(adminDb.collection('evaluations').doc(buildStudentDocId(session.moduleId,user.uid)),{uid:user.uid,moduleId:session.moduleId,studentName,studentEmail:user.email,score:total,weakestQuestion:weakest,passed,validationVersion:2,completedAt:new Date().toISOString(),examId:answerRequest.examId},{merge:true});
    });
    return NextResponse.json(finished?{result,finished:true,passed,total,weakest,summary:session.results.map((r,i)=>({question:bank[session.questionOrder[i]].question,score:r.score,missing:r.missing}))}:{result,finished:false,next:questionPayload(bank,session)});
  } catch (error) {
    const message=error instanceof Error?error.message:'';
    if(message==='EXAM_QUOTA')return NextResponse.json({error:'Alcanzaste el límite de intentos en 24 horas.'},{status:429});
    if(message==='EXAM_NOT_FOUND')return NextResponse.json({error:'Examen inexistente.'},{status:404});
    if(message==='EXAM_EXPIRED')return NextResponse.json({error:'Se agotó el tiempo del examen.'},{status:410});
    if(message==='EXAM_CONTENT_CHANGED')return NextResponse.json({error:'El temario del examen se actualizó. Inicia un nuevo intento para responder la versión vigente.'},{status:409});
    if(message==='EXAM_BUSY'||message==='EXAM_STALE')return NextResponse.json({error:'La pregunta está siendo procesada o ya fue respondida. Reanuda el examen para sincronizarlo.'},{status:409});
    if (error instanceof EvaluatorUnavailableError) {
      // No se guarda nada: el estudiante puede reenviar la misma respuesta sin perder la pregunta.
      return NextResponse.json({ error: 'El evaluador no está disponible en este momento. Tu respuesta no se perdió: vuelve a enviarla en unos segundos.' }, { status: 503 });
    }
    return NextResponse.json({ error: 'No se pudo procesar el examen.' }, { status: 500 });
  }
}
