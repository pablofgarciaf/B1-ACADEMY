import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb, fieldValue } from '@/lib/firebase-admin';
import { requireBearerUser } from '@/lib/server-auth';
import { getModuleById } from '@/lib/curriculum-data';
import { practicasDelModulo } from '@/lib/practice-registry';
import { buildStudentDocId, getStudentDisplayName } from '@/lib/student-doc';
import { readAcademicProgress } from '@/lib/academic-progress';
import { hasInitializedCompany } from '@/lib/company-server';
import { moduloInduccionCompleto, MODULO_INDUCCION } from '@/lib/requisitos-aula';
const schema = z.object({ moduleId: z.string().min(1).max(80), classId: z.string().min(1).max(120) });
export async function GET(request: Request) {
  try {
    const user = await requireBearerUser(request);
    const moduleId = new URL(request.url).searchParams.get('moduleId') ?? '';
    if (!getModuleById(moduleId)) return NextResponse.json({ error: 'Módulo inválido.' }, { status: 400 });
    return NextResponse.json({ ...await readAcademicProgress(user.uid, moduleId, getStudentDisplayName(user.profile,user.email), user.email), requiredPractices: practicasDelModulo(moduleId) }, { headers: { 'Cache-Control':'no-store' } });
  } catch { return NextResponse.json({ error:'No autorizado.' },{status:401}); }
}
export async function POST(request: Request) {
  try {
    const user = await requireBearerUser(request);
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({error:'Solicitud inválida.'},{status:400});
    const {moduleId,classId}=parsed.data;
    const mod=getModuleById(moduleId);
    if (!mod?.classes.some(c=>c.id===classId)) return NextResponse.json({error:'Clase inválida.'},{status:400});
    if (!await hasInitializedCompany(user.uid)) return NextResponse.json({error:'Completa la preparación de tu empresa.'},{status:403});
    const name=getStudentDisplayName(user.profile,user.email);
    if (moduleId!==MODULO_INDUCCION && moduleId!=='mod-ventas' && !await moduloInduccionCompleto(user.uid,user.profile.role,name,user.email)) return NextResponse.json({error:'Completa primero la inducción.'},{status:403});
    const progress=await readAcademicProgress(user.uid,moduleId,name,user.email);
    const required=practicasDelModulo(moduleId).filter(p=>p.startsWith(classId+'#'));
    if (!required.length || required.some(p=>!progress.passedPractices.includes(p))) return NextResponse.json({error:'Completa las prácticas evaluadas de esta clase antes de finalizarla.'},{status:403});
    await adminDb.collection('academic_progress').doc(buildStudentDocId(moduleId,user.uid)).set({uid:user.uid,moduleId,studentName:name,studentEmail:user.email,completedClasses:fieldValue().arrayUnion(classId),updatedAt:new Date().toISOString()},{merge:true});
    return NextResponse.json({success:true});
  } catch { return NextResponse.json({error:'No se pudo registrar el progreso.'},{status:400}); }
}
