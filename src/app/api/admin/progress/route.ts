import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getSessionUser, isAdmin, requireBearerUser } from '@/lib/server-auth';

export async function GET(request: Request) {
  try {
    let actor = await getSessionUser();
    if (!actor) {
      try { actor = await requireBearerUser(request); } catch {}
    }
    if (!actor || !isAdmin(actor.profile)) {
      return NextResponse.json({ error: 'Prohibido. Requiere privilegios de administrador.' }, { status: 403 });
    }

    // 1. Obtener todos los usuarios registrados
    const usersSnap = await adminDb.collection('usuarios').limit(500).get();
    const users = usersSnap.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        email: data.email || '',
        name: data.displayName || data.name || 'Estudiante',
        role: data.role || 'estudiante',
        cedula: data.cedula || '',
        status: data.status || 'active',
        createdAt: data.createdAt || null,
        passwordChanged: !!data.passwordChanged,
      };
    });

    // 2. Obtener todo el progreso académico registrado
    const progressSnap = await adminDb.collection('academic_progress').limit(1000).get();
    const progressMap: Record<string, { completedClasses: string[]; moduleId: string; uid: string }> = {};
    progressSnap.docs.forEach(doc => {
      const d = doc.data();
      const key = `${d.uid}_${d.moduleId}`;
      progressMap[key] = {
        completedClasses: d.completedClasses || [],
        moduleId: d.moduleId || '',
        uid: d.uid || '',
      };
    });

    // 3. Obtener prácticas aprobadas
    const practicesSnap = await adminDb.collection('practice_records').where('aprobada', '==', true).limit(2000).get();
    const practicesMap: Record<string, string[]> = {};
    practicesSnap.docs.forEach(doc => {
      const d = doc.data();
      const key = `${d.uid}_${d.moduleId}`;
      if (!practicesMap[key]) practicesMap[key] = [];
      if (d.practiceKey && !practicesMap[key].includes(d.practiceKey)) {
        practicesMap[key].push(d.practiceKey);
      }
    });

    // 4. Obtener intentos de examen
    const attemptsSnap = await adminDb.collection('exam_attempts').limit(1000).get();
    const attemptsMap: Record<string, { attemptsCount: number; lastAttempt: number | null }> = {};
    attemptsSnap.docs.forEach(doc => {
      const d = doc.data();
      const attempts = Array.isArray(d.attempts) ? d.attempts : [];
      attemptsMap[doc.id] = {
        attemptsCount: attempts.length,
        lastAttempt: attempts.length > 0 ? Math.max(...attempts) : null,
      };
    });

    // 5. Consolidar por estudiante
    const studentsWithProgress = users.map(user => {
      const modulesProgress: Record<string, { classesCompleted: number; practicesCount: number; isExamBlocked: boolean; attempts: number }> = {};
      
      // Chequear módulos principales (ej. mod-1 a mod-9 y mod-ventas)
      ['mod-1', 'mod-2', 'mod-3', 'mod-4', 'mod-5', 'mod-6', 'mod-7', 'mod-8', 'mod-9', 'mod-ventas'].forEach(mId => {
        const progKey = `${user.uid}_${mId}`;
        const p = progressMap[progKey];
        const pr = practicesMap[progKey] || [];
        const attDocId = `${user.uid}_${mId}`;
        const att = attemptsMap[attDocId];
        
        modulesProgress[mId] = {
          classesCompleted: p?.completedClasses?.length || 0,
          practicesCount: pr.length,
          isExamBlocked: (att?.attemptsCount || 0) >= 3,
          attempts: att?.attemptsCount || 0,
        };
      });

      return {
        ...user,
        modulesProgress,
      };
    });

    return NextResponse.json({
      totalUsers: users.length,
      students: studentsWithProgress,
    });
  } catch (error) {
    console.error('Error en /api/admin/progress:', error);
    return NextResponse.json({ error: 'Error al consultar avances académicos.' }, { status: 500 });
  }
}

// Desbloquear examen de un estudiante eliminando o reseteando sus intentos
export async function POST(request: Request) {
  try {
    const { uid, moduleId } = await request.json();
    if (!uid || !moduleId) {
      return NextResponse.json({ error: 'Faltan parámetros uid o moduleId.' }, { status: 400 });
    }

    const docId = `${uid}_${moduleId}`;
    await adminDb.collection('exam_attempts').doc(docId).set({
      uid,
      attempts: [],
      activeId: null,
      unlockedAt: new Date().toISOString(),
    }, { merge: true });

    return NextResponse.json({ success: true, message: `Examen de ${moduleId} desbloqueado exitosamente para el estudiante.` });
  } catch (error) {
    console.error('Error al desbloquear examen:', error);
    return NextResponse.json({ error: 'No se pudo desbloquear el examen.' }, { status: 500 });
  }
}
