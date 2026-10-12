import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getSessionState, requireBearerUser } from '@/lib/server-auth';

export async function GET(request: Request) {
  try {
    // Nunca aceptar un uid del cliente: la identidad proviene exclusivamente de la sesión verificada.
    let uid: string;
    if (request.headers.get('authorization')?.startsWith('Bearer ')) {
      try { uid = (await requireBearerUser(request)).uid; }
      catch { return NextResponse.json({ error: 'No autorizado.' }, { status: 401 }); }
    } else {
      const session = await getSessionState();
      if (session.estado === 'no-disponible') return NextResponse.json({ error: 'Servicio de autenticación no disponible.' }, { status: 503 });
      if (session.estado !== 'ok') return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
      uid = session.user.uid;
    }

    // 1. Obtener todos los certificados emitidos (micro, diplomas y master)
    const certsSnap = await adminDb
      .collection('certificates')
      .where('uid', '==', uid)
      .get();

    const certificates = certsSnap.docs.map(doc => doc.data());

    // 2. Obtener progreso académico por módulo
    const progressSnap = await adminDb
      .collection('academic_progress')
      .where('uid', '==', uid)
      .get();

    const progress: Record<string, { completedClasses: string[]; passedPractices: string[] }> = {};
    progressSnap.docs.forEach(doc => {
      const data = doc.data();
      if (data.moduleId) {
        progress[data.moduleId] = {
          completedClasses: data.completedClasses || [],
          passedPractices: data.passedPractices || [],
        };
      }
    });

    // 3. Obtener evaluaciones de exámenes orales
    const evalSnap = await adminDb
      .collection('evaluations')
      .where('uid', '==', uid)
      .get();

    const evaluations: Record<string, { score: number; passed: boolean; completedAt: string }> = {};
    evalSnap.docs.forEach(doc => {
      const data = doc.data();
      if (data.moduleId) {
        evaluations[data.moduleId] = {
          score: data.score || 0,
          passed: !!data.passed,
          completedAt: data.completedAt || '',
        };
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
