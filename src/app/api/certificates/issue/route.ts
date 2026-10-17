import { readAcademicProgress } from '@/lib/academic-progress';
import { createHmac } from 'crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { requireBearerUser } from '@/lib/server-auth';
import { getModuleById, moduleMinutes } from '@/lib/curriculum-data';
import { practicasDelModulo } from '@/lib/practice-registry';
import { buildStudentDocId, getStudentDisplayName } from '@/lib/student-doc';

const schema = z.object({ moduleId: z.string().min(1).max(80) });

export async function POST(request: Request) {
  try {
    const user = await requireBearerUser(request);
    const secret = process.env.CERTIFICATE_SIGNING_SECRET;
    if (!secret) return NextResponse.json({ error: 'Emisión no configurada.' }, { status: 503 });
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Módulo inválido.' }, { status: 400 });
    const courseModule = getModuleById(parsed.data.moduleId);
    if (!courseModule) return NextResponse.json({ error: 'Módulo inválido.' }, { status: 400 });
    // Un módulo sin clases publicadas no puede certificar ("todas las clases" sería verdadero con cero clases).
    if (!courseModule.classes.length) return NextResponse.json({ error: 'Este módulo aún no está disponible.' }, { status: 403 });

    const studentName = getStudentDisplayName(user.profile, user.email);
    const studentDocId = buildStudentDocId(courseModule.id, user.uid);

    const progress=await readAcademicProgress(user.uid,courseModule.id,studentName,user.email);
    const completed=new Set(progress.completedClasses);

    // 2. Obtener evaluación aprobada (por doc legible o por query uid + moduleId)
    let evalPassed = false;
    let score: number | undefined;
    const evalSnap = await adminDb.collection('evaluations').doc(studentDocId).get();
    if (evalSnap.exists && evalSnap.data()?.uid === user.uid && evalSnap.data()?.moduleId === courseModule.id && evalSnap.data()?.passed && evalSnap.data()?.validationVersion===2) {
      evalPassed = true;
      score = Number(evalSnap.data()?.score);
    } else {
      const evalQuery = await adminDb
        .collection('evaluations')
        .where('uid', '==', user.uid)
        .where('moduleId', '==', courseModule.id)
        .where('passed', '==', true)
        .where('validationVersion', '==', 2)
        .limit(1)
        .get();
      const validEvaluation = evalQuery.docs.find(d=>d.data().validationVersion===2);
      if (validEvaluation) { evalPassed = true; score = Number(validEvaluation.data().score); }
    }

    if (!courseModule.classes.every((item) => completed.has(item.id)) || !evalPassed) {
      return NextResponse.json({ error: 'Aún no cumples los requisitos de emisión.' }, { status: 403 });
    }

    // Además de las clases y la evaluación, cada práctica del simulador debe estar aprobada (calificada en /api/practice).
    const passed = new Set<string>(progress.passedPractices);
    const pendientes = practicasDelModulo(courseModule.id).filter((clave) => !passed.has(clave));
    if (pendientes.length) {
      return NextResponse.json({ error: `Te faltan ${pendientes.length} práctica(s) del simulador por aprobar en este módulo.` }, { status: 403 });
    }

    const issuedAt = new Date().toISOString();
    const digest = createHmac('sha256', secret).update(`${user.uid}:${courseModule.id}:${issuedAt}`).digest('hex').slice(0, 20).toUpperCase();
    const code = `B1-${courseModule.id.toUpperCase()}-${digest}`;

    // Nombre del certificado y del titular congelados al emitir: la página pública /verificar/<código> solo lee este documento.
    const holderName = (user.profile.displayName || user.profile.name || '').trim().slice(0, 120);
    await adminDb.collection('certificates').doc(code).set({
      code,
      uid: user.uid,
      studentName,
      studentEmail: user.email,
      moduleId: courseModule.id,
      issuedAt,
      status: 'valid',
      validationVersion:2,
      ...(Number.isFinite(score) ? {scorePercent: score} : {}),
      estimatedHours: Math.round(moduleMinutes(courseModule) / 60 * 100) / 100,
      title: courseModule.certificateTitle,
      holderName,
    });

    return NextResponse.json({ code });
  } catch {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }
}
