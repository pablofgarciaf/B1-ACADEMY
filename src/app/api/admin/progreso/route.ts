import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

// Caché en memoria para evitar sobrefacturación en Firebase (TTL: 60s)
let cachedData: any = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const forceRefresh = url.searchParams.get('refresh') === 'true';
    const now = Date.now();

    if (!forceRefresh && cachedData && (now - lastCacheTime < CACHE_TTL_MS)) {
      return NextResponse.json({ ...cachedData, fromCache: true });
    }
    // 1. Mapa de usuarios para traducir UIDs a nombre y correo
    const usersSnap = await adminDb.collection('usuarios').get();
    const userMap: Record<string, { 
      name: string; 
      email: string; 
      role: string; 
      cedula?: string; 
      phone?: string; 
      status?: string;
      createdAt?: string;
      assignedTracks?: string[];
    }> = {};
    usersSnap.docs.forEach(doc => {
      const d = doc.data();
      userMap[doc.id] = {
        name: d.displayName || d.name || 'Estudiante',
        email: d.email || '',
        role: d.role || 'estudiante',
        cedula: d.cedula || d.dni || d.identification || '',
        phone: d.phone || d.telefono || '',
        status: d.status || 'active',
        createdAt: d.createdAt || null,
        assignedTracks: d.assignedTracks || [],
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

    // 3. Evaluaciones oficiales completadas
    const evaluationsSnap = await adminDb.collection('evaluations').get();
    const evalMap: Record<string, { score: number; passed: boolean; completedAt: string }> = {};
    evaluationsSnap.docs.forEach(doc => {
      const d = doc.data();
      const key = `${d.uid}_${d.moduleId}`;
      evalMap[key] = {
        score: d.score || 0,
        passed: d.passed === true,
        completedAt: d.completedAt || '',
      };
    });

    // 4. Exámenes e Intentos (con nota real y estado de aprobación)
    const attemptsSnap = await adminDb.collection('exam_attempts').get();
    const intentosExamen = attemptsSnap.docs.map(doc => {
      const d = doc.data();
      const u = userMap[d.uid] || { name: 'Desconocido', email: 'Desconocido', role: '' };
      const arr = Array.isArray(d.attempts) ? d.attempts : [];
      const modulo = d.moduleId || doc.id.split('_')[1] || 'mod-1';
      const evalData = evalMap[`${d.uid}_${modulo}`] || evalMap[`${d.uid}_${doc.id}`];

      const passed = evalData ? evalData.passed : false;
      const score = evalData ? evalData.score : null;

      return {
        id: doc.id,
        uid: d.uid,
        estudiante: u.name,
        correo: u.email,
        modulo,
        intentosConsumidos: arr.length,
        bloqueado: !passed && arr.length >= 3,
        aprobado: passed,
        calificacion: score,
        ultimoIntento: evalData?.completedAt 
          ? new Date(evalData.completedAt).toLocaleString('es-EC') 
          : (arr.length > 0 ? new Date(Math.max(...arr)).toLocaleString('es-EC') : 'Sin intentos'),
      };
    });

    const responsePayload = {
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
    };

    cachedData = responsePayload;
    lastCacheTime = Date.now();

    return NextResponse.json(responsePayload);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error al consultar' }, { status: 500 });
  }
}
