import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Mapa de usuarios para traducir UIDs a nombre y correo
    const usersSnap = await adminDb.collection('usuarios').get();
    const userMap: Record<string, { name: string; email: string; role: string }> = {};
    usersSnap.docs.forEach(doc => {
      const d = doc.data();
      userMap[doc.id] = {
        name: d.displayName || d.name || 'Estudiante',
        email: d.email || '',
        role: d.role || 'estudiante',
      };
    });

    // 2. Progreso de clases
    const progressSnap = await adminDb.collection('academic_progress').get();
    const progress = progressSnap.docs.map(doc => {
      const d = doc.data();
      const u = userMap[d.uid] || { name: 'Desconocido', email: 'Desconocido', role: '' };
      return {
        id: doc.id,
        uid: d.uid,
        estudiante: u.name,
        correo: u.email,
        modulo: d.moduleId,
        clasesCompletadas: d.completedClasses || [],
        totalClases: (d.completedClasses || []).length,
        practicasAprobadas: d.passedPractices || [],
        totalPracticas: (d.passedPractices || []).length,
        ultimaActualizacion: d.updatedAt || null,
      };
    });

    // 3. Exámenes e Intentos (para ver quién está bloqueado)
    const attemptsSnap = await adminDb.collection('exam_attempts').get();
    const intentosExamen = attemptsSnap.docs.map(doc => {
      const d = doc.data();
      const u = userMap[d.uid] || { name: 'Desconocido', email: 'Desconocido', role: '' };
      const arr = Array.isArray(d.attempts) ? d.attempts : [];
      return {
        id: doc.id,
        uid: d.uid,
        estudiante: u.name,
        correo: u.email,
        modulo: d.moduleId || doc.id.split('_')[1] || 'mod-1',
        intentosConsumidos: arr.length,
        bloqueado: arr.length >= 3,
        ultimoIntento: arr.length > 0 ? new Date(Math.max(...arr)).toLocaleString('es-EC') : 'Sin intentos',
      };
    });

    return NextResponse.json({
      exito: true,
      resumen: {
        totalUsuarios: Object.keys(userMap).length,
        totalModulosConProgreso: progress.length,
        totalIntentosExamen: intentosExamen.length,
      },
      alumnosConIntentosBloqueados: intentosExamen.filter(i => i.bloqueado),
      todosLosIntentosDeExamen: intentosExamen,
      progresoDetallado: progress,
      usuariosRegistrados: Object.entries(userMap).map(([uid, info]) => ({ uid, ...info })),
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error al consultar' }, { status: 500 });
  }
}
