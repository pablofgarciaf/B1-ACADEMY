import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    let uid = '';

    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = await adminAuth.verifyIdToken(token);
        uid = decoded.uid;
      } catch {
        // token no válido
      }
    }

    // Si viene uid por query param (para respaldo de sesión)
    const { searchParams } = new URL(request.url);
    const paramUid = searchParams.get('uid');
    if (!uid && paramUid) {
      uid = paramUid;
    }

    if (!uid) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
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
      uid,
      certificates,
      progress,
      evaluations,
    });
  } catch (err) {
    console.error('Error en /api/certificates/my-certificates:', err);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
