import { createHmac } from 'crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { requireBearerUser } from '@/lib/server-auth';
import { getModuleById } from '@/lib/curriculum-data';
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
    const studentDocId = buildStudentDocId(courseModule.id, studentName, user.email);

    // 1. Obtener progreso con combinación retrocompatible
    const [progressSnap, legacyProgressSnap] = await Promise.all([
      adminDb.collection('academic_progress').doc(studentDocId).get(),
      adminDb.collection('academic_progress').doc(`${user.uid}_${courseModule.id}`).get(),
    ]);

    const progData = progressSnap.exists ? progressSnap.data() : undefined;
    const legacyProgData = legacyProgressSnap.exists ? legacyProgressSnap.data() : undefined;

    const completed = new Set<string>([
      ...(progData?.completedClasses ?? []),
      ...(legacyProgData?.completedClasses ?? []),
    ]);

    // 2. Obtener evaluación aprobada (por doc legible o por query uid + moduleId)
    let evalPassed = false;
    const evalSnap = await adminDb.collection('evaluations').doc(studentDocId).get();
    if (evalSnap.exists && evalSnap.data()?.passed) {
      evalPassed = true;
    } else {
      const evalQuery = await adminDb
        .collection('evaluations')
        .where('uid', '==', user.uid)
        .where('moduleId', '==', courseModule.id)
        .where('passed', '==', true)
        .limit(1)
        .get();
      if (!evalQuery.empty) evalPassed = true;
    }

    if (!courseModule.classes.every((item) => completed.has(item.id)) || !evalPassed) {
      return NextResponse.json({ error: 'Aún no cumples los requisitos de emisión.' }, { status: 403 });
    }

    // Además de las clases y la evaluación, cada práctica del simulador debe estar aprobada (calificada en /api/practice).
    const passed = new Set<string>([
      ...(progData?.passedPractices ?? []),
      ...(legacyProgData?.passedPractices ?? []),
    ]);
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
      title: courseModule.certificateTitle,
      holderName,
    });

    return NextResponse.json({ code });
  } catch {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }
}
