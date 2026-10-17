import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb, fieldValue } from '@/lib/firebase-admin';
import { requireBearerUser } from '@/lib/server-auth';
import { getModuleById } from '@/lib/curriculum-data';
import { coincide } from '@/lib/practice-check';
import { camposEsperados, clavePractica, guiaPublicada } from '@/lib/practice-registry';
import { readCompany, readCompanyAudit, hasInitializedCompany } from '@/lib/company-server';
import { buildStudentDocId, getStudentDisplayName } from '@/lib/student-doc';
import { pantallaConectada } from '@/lib/practica-conectada';
import { camposConsulta, obtenerMision,salesWriteMatches } from '@/lib/sales-learning';
import { operationFor, validPracticeEvent } from '@/lib/practice-contract';

const schema=z.object({moduleId:z.string().max(80),classId:z.string().max(120),slideIndex:z.number().int().min(1).max(200),
  valores:z.array(z.string().max(500)).min(1).max(12),intentos:z.number().int().min(1).max(500),vioSolucion:z.boolean(),
  evidence:z.object({requestId:z.string().uuid(),action:z.string().max(80),result:z.string().max(200)}).optional()});
export async function POST(request:Request){
  let user;try{user=await requireBearerUser(request);}catch{return NextResponse.json({error:'Inicia sesión.'},{status:401});}
  const parsed=schema.safeParse(await request.json().catch(()=>null));
  if(!parsed.success)return NextResponse.json({error:'Práctica inválida.'},{status:400});
  const d=parsed.data,uid=user.uid,key=clavePractica(d.classId,d.slideIndex);
  if(!getModuleById(d.moduleId)?.classes.some(c=>c.id===d.classId))return NextResponse.json({error:'Clase inválida.'},{status:400});
  try{
    if(!await hasInitializedCompany(uid))return NextResponse.json({error:'Completa la preparación de tu empresa.'},{status:403});
    const guide=guiaPublicada(d.classId,d.slideIndex),screen=pantallaConectada(guide);
    let fields=camposEsperados(d.classId,d.slideIndex);
    if(!fields)return NextResponse.json({error:'Esta lámina no tiene práctica evaluada.'},{status:400});
    const mission=obtenerMision(d.classId,d.slideIndex);
    let valid=false,total=fields.length,correct=0;
    if(screen?.clave==='consultaAcademica'){
      fields=camposConsulta(await readCompany(uid),key);
      if(!fields)return NextResponse.json({error:'Faltan documentos de las misiones anteriores para realizar esta consulta.'},{status:409});
      total=fields.length;
    }
    const connected=Boolean(screen && screen.clave!=='consultaAcademica');
    if(connected){
      total=1;
      if(d.evidence){
        const event=(await readCompanyAudit(uid,100)).find(e=>e.requestId===d.evidence!.requestId);
        const actions=mission?.expectedAction?[mission.expectedAction]:operationFor(screen!);
        valid=validPracticeEvent(event,uid,d.evidence.requestId,d.evidence.result,actions,mission?.expectedDocType??(screen?.clave==='documento'?screen.docType:undefined));
        if(valid&&mission&&event)valid=salesWriteMatches(await readCompany(uid),event,key);
      }
      correct=valid?1:0;
    }else{
      correct=fields.length===d.valores.length?fields.filter((f,i)=>coincide(d.valores[i],f.valor,f.etiqueta)).length:0;
      valid=correct===fields.length;
    }
    const approved=valid&&!d.vioSolucion;
    await adminDb.runTransaction(async tx=>{
      const claim=d.evidence?adminDb.collection('practice_evidence_claims').doc(`${uid}_${d.evidence.requestId}`):null;
      const previous=claim?await tx.get(claim):null;
      if(approved&&previous?.exists&&previous.data()?.practiceKey!==key)throw new Error('EVIDENCE_ALREADY_USED');
      tx.set(adminDb.collection('practice_records').doc(`${uid}_${d.classId}_${d.slideIndex}`),{uid,moduleId:d.moduleId,classId:d.classId,slideIndex:d.slideIndex,practiceKey:key,studentName:getStudentDisplayName(user.profile,user.email),
        valores:d.valores,correctos:correct,total,aprobada:approved,validationVersion:2,conectada:connected,vioSolucion:d.vioSolucion,intentos:d.intentos,
        evidenceRequestId:d.evidence?.requestId??'',updatedAt:new Date().toISOString()});
      if(approved){
        if(claim&&!previous?.exists)tx.create(claim,{uid,practiceKey:key});
        tx.set(adminDb.collection('academic_progress').doc(buildStudentDocId(d.moduleId,uid)),{uid,moduleId:d.moduleId,passedPractices:fieldValue().arrayUnion(key),updatedAt:new Date().toISOString()},{merge:true});
      }
    });
    return NextResponse.json({aprobada:approved,correctos:correct,total});
  }catch(error){return NextResponse.json({error:error instanceof Error&&error.message==='EVIDENCE_ALREADY_USED'?'Esa operación ya se utilizó para otra práctica.':'No pudimos validar la práctica. Revisa la misión y vuelve a intentarlo.'},{status:409});}
}
