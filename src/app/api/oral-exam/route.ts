import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { requireBearerUser } from '@/lib/server-auth';
import { getModuleById } from '@/lib/curriculum-data';
import {
  EXAM_BANK, EXAM_DURATION_MS, EXAM_QUESTIONS_PER_ATTEMPT, MAX_ATTEMPTS_PER_DAY, MIN_ANSWER_WORDS,
  PASS_MIN_PER_QUESTION, PASS_TOTAL, POINTS_PER_QUESTION, type ExamQuestion,
} from '@/lib/exam-bank';
import { evaluateAnswer, EvaluatorUnavailableError, type QuestionResult } from '@/lib/exam-evaluator';

export const runtime = 'nodejs';

const requestSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('start'), moduleId: z.string().min(1).max(80) }),
  z.object({ action: z.literal('answer'), examId: z.string().uuid(), answer: z.string().trim().min(1).max(6000) }),
]);

interface ExamSession {
  uid: string; moduleId: string; questionOrder: number[]; answers: string[]; results: QuestionResult[];
  status: 'in_progress' | 'passed' | 'failed' | 'expired'; createdAt: number; expiresAt: number;
}

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
    if (parsed.data.action === 'start') {
      const courseModule = getModuleById(parsed.data.moduleId);
      const bank = EXAM_BANK[parsed.data.moduleId];
      if (!courseModule || !bank) return NextResponse.json({ error: 'Este módulo aún no tiene examen.' }, { status: 404 });

      // Requisito: todas las clases del módulo completadas (validado en el servidor, no en el navegador).
      const progress = await adminDb.collection('academic_progress').doc(`${user.uid}_${courseModule.id}`).get();
      const completed = new Set<string>(progress.data()?.completedClasses ?? []);
      const pending = courseModule.classes.filter((c) => !completed.has(c.id));
      if (pending.length > 0) {
        return NextResponse.json({ error: `Te faltan ${pending.length} clase(s) por completar: ${pending.map((c) => c.title).join(', ')}.` }, { status: 403 });
      }

      const previous = await sessions().where('uid', '==', user.uid).where('moduleId', '==', courseModule.id).get();
      const docs = previous.docs.map((d) => ({ id: d.id, ...(d.data() as ExamSession) }));
      const active = docs.find((s) => s.status === 'in_progress' && s.expiresAt > Date.now());
      if (active) return NextResponse.json({ examId: active.id, ...questionPayload(bank, active), resumed: true });
      const lastDay = docs.filter((s) => s.createdAt > Date.now() - 24 * 60 * 60_000).length;
      if (lastDay >= MAX_ATTEMPTS_PER_DAY) {
        return NextResponse.json({ error: `Alcanzaste el máximo de ${MAX_ATTEMPTS_PER_DAY} intentos en 24 horas. Repasa las clases y vuelve mañana.` }, { status: 429 });
      }

      const now = Date.now();
      const order = shuffle(bank.map((_, i) => i)).slice(0, EXAM_QUESTIONS_PER_ATTEMPT);
      const session: ExamSession = {
        uid: user.uid, moduleId: courseModule.id, questionOrder: order, answers: [], results: [],
        status: 'in_progress', createdAt: now, expiresAt: now + EXAM_DURATION_MS,
      };
      const examId = randomUUID();
      await sessions().doc(examId).set(session);
      return NextResponse.json({ examId, ...questionPayload(bank, session), resumed: false });
    }

    // ── Respuesta ──
    const ref = sessions().doc(parsed.data.examId);
    const snapshot = await ref.get();
    const session = snapshot.data() as ExamSession | undefined;
    if (!session || session.uid !== user.uid) return NextResponse.json({ error: 'Examen inexistente.' }, { status: 404 });
    if (session.status !== 'in_progress') return NextResponse.json({ error: 'Este examen ya terminó.' }, { status: 409 });
    if (Date.now() > session.expiresAt) {
      await ref.update({ status: 'expired' });
      return NextResponse.json({ error: 'Se agotó el tiempo del examen. Cuenta como intento no aprobado.' }, { status: 410 });
    }

    const words = parsed.data.answer.split(/\s+/).filter(Boolean).length;
    if (words < MIN_ANSWER_WORDS) {
      return NextResponse.json({ error: `Desarrolla más tu respuesta (mínimo ${MIN_ANSWER_WORDS} palabras; llevas ${words}). Explica el porqué, no solo el qué.` }, { status: 400 });
    }

    const bank = EXAM_BANK[session.moduleId];
    const item = bank[session.questionOrder[session.answers.length]];
    const result = await evaluateAnswer(item.question, item.rubric, parsed.data.answer, POINTS_PER_QUESTION);
    session.answers.push(parsed.data.answer);
    session.results.push(result);

    const finished = session.answers.length >= session.questionOrder.length;
    if (!finished) {
      await ref.update({ answers: session.answers, results: session.results });
      return NextResponse.json({ result, next: questionPayload(bank, session), finished: false });
    }

    const total = session.results.reduce((sum, r) => sum + r.score, 0);
    const weakest = Math.min(...session.results.map((r) => r.score));
    const passed = total >= PASS_TOTAL && weakest >= PASS_MIN_PER_QUESTION;
    session.status = passed ? 'passed' : 'failed';
    await ref.update({ answers: session.answers, results: session.results, status: session.status, total });
    await adminDb.collection('evaluations').doc(parsed.data.examId).set({
      uid: user.uid, moduleId: session.moduleId, score: total, weakestQuestion: weakest, passed, completedAt: new Date().toISOString(),
    });
    return NextResponse.json({
      result, finished: true, passed, total, weakest,
      summary: session.results.map((r, i) => ({ question: bank[session.questionOrder[i]].question, score: r.score, missing: r.missing })),
    });
  } catch (error) {
    if (error instanceof EvaluatorUnavailableError) {
      // No se guarda nada: el estudiante puede reenviar la misma respuesta sin perder la pregunta.
      return NextResponse.json({ error: 'El evaluador no está disponible en este momento. Tu respuesta no se perdió: vuelve a enviarla en unos segundos.' }, { status: 503 });
    }
    return NextResponse.json({ error: 'No se pudo procesar el examen.' }, { status: 500 });
  }
}
