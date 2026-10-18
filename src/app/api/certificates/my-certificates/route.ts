import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getSessionState, requireBearerUser, assertAccountReady } from '@/lib/server-auth';

export async function GET(request: Request) {
  try {
    // Nunca aceptar un uid del cliente: la identidad proviene exclusivamente de la sesión verificada.
    let uid: string;
    if (request.headers.get('authorization')?.startsWith('Bearer ')) {
      try {
        const user = await requireBearerUser(request);
        uid = user.uid;
      }
      catch { return NextResponse.json({ error: 'No autorizado.' }, { status: 401 }); }
    } else {
      const session = await getSessionState();
      if (session.estado === 'no-disponible') return NextResponse.json({ error: 'Servicio de autenticación no disponible.' }, { status: 503 });
      if (session.estado !== 'ok') return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
      try { assertAccountReady(session.user); } catch { return NextResponse.json({ error: 'Crea tu contraseña personal antes de continuar.' }, { status: 401 }); }
      uid = session.user.uid;
    }

    // 1. Obtener todos los certificados emitidos (micro, diplomas y master)
    const certsSnap = await adminDb
      .collection('certificates')
      .where('uid', '==', uid)
      .get();

    const certificates = certsSnap.docs.map(doc => doc.data());

    // 2. Obtener progreso académico por módulo (combina sin pérdida la nomenclatura nueva y legada)
    const progressSnap = await adminDb
      .collection('academic_progress')
      .where('uid', '==', uid)
      .get();

    const progress: Record<string, { completedClasses: string[]; passedPractices: string[] }> = {};
    progressSnap.docs.forEach(doc => {
      const data = doc.data();
      if (data.moduleId) {
        const existing = progress[data.moduleId] || { completedClasses: [], passedPractices: [] };
        const mergedClasses = Array.from(new Set([...existing.completedClasses, ...(data.completedClasses || [])]));
        progress[data.moduleId] = {
          completedClasses: mergedClasses,
          passedPractices: existing.passedPractices,
        };
      }
    });

    const practiceSnap = await adminDb.collection('practice_records').where('uid','==',uid).get();
    for (const doc of practiceSnap.docs) {
      const data=doc.data();
      if (!data.moduleId || !data.aprobada || !(data.validationVersion>=requiredPracticeValidationVersion(String(data.practiceKey)))) continue;
      const record=progress[data.moduleId] ||= {completedClasses:[],passedPractices:[]};
      if (!record.passedPractices.includes(data.practiceKey)) record.passedPractices.push(data.practiceKey);
    }

    // 3. Obtener evaluaciones de exámenes orales (prioriza aprobadas y puntajes superiores)
    const evalSnap = await adminDb
      .collection('evaluations')
      .where('uid', '==', uid)
      .get();

    const evaluations: Record<string, { score: number; passed: boolean; completedAt: string }> = {};
    evalSnap.docs.forEach(doc => {
      const data = doc.data();
      if (data.moduleId) {
        const existing = evaluations[data.moduleId];
        const currentPassed = !!data.passed && data.validationVersion===2;
        const currentScore = data.score || 0;
        const currentCompletedAt = data.completedAt || '';

        if (!existing || (!existing.passed && currentPassed) || (existing.passed === currentPassed && currentScore > existing.score)) {
          evaluations[data.moduleId] = {
            score: currentScore,
            passed: currentPassed,
            completedAt: currentCompletedAt || existing?.completedAt || '',
          };
        }
      }
    });

    return NextResponse.json({
      certificates,
      progress,
      evaluations,
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (err) {
    console.error('Error en /api/certificates/my-certificates:', err);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
import { requiredPracticeValidationVersion } from '@/lib/strict-practice-keys';
