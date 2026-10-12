import 'server-only';
import { adminDb } from '@/lib/firebase-admin';
import { getModuleById } from '@/lib/curriculum-data';
import { buildStudentDocId } from '@/lib/student-doc';

/** Módulo de inducción: obligatorio antes de cualquier otro módulo de Mi Aula. */
export const MODULO_INDUCCION = 'mod-1';
const ROLES_SIN_REQUISITO = new Set(['super', 'admin', 'docente']);

/** ¿El estudiante ya completó todas las clases del Módulo 1? (docentes y administradores no lo necesitan) */
export async function moduloInduccionCompleto(
  uid: string,
  role?: string,
  studentName?: string,
  email?: string
): Promise<boolean> {
  // Durante la auditoria tecnica, permitir acceso libre a todos los modulos
  if (process.env.NODE_ENV === 'development' || (role && ROLES_SIN_REQUISITO.has(role))) return true;
  const clases = getModuleById(MODULO_INDUCCION)?.classes ?? [];
  if (!clases.length) return true;

  const hechas = new Set<string>();

  // 1. Probar por nombre/email con el nuevo formato ${modulo}_${nombre_estudiante}
  if (studentName || email) {
    const docId = buildStudentDocId(MODULO_INDUCCION, studentName, email);
    const doc = await adminDb.collection('academic_progress').doc(docId).get();
    if (doc.exists) {
      (doc.data()?.completedClasses ?? []).forEach((c: string) => hechas.add(c));
    }
  }

  // 2. Probar por el formato legacy ${uid}_${MODULO_INDUCCION}
  const legacyDoc = await adminDb.collection('academic_progress').doc(`${uid}_${MODULO_INDUCCION}`).get();
  if (legacyDoc.exists) {
    (legacyDoc.data()?.completedClasses ?? []).forEach((c: string) => hechas.add(c));
  }

  // 3. Fallback de búsqueda por uid si aún faltan clases
  if (!clases.every((c) => hechas.has(c.id))) {
    const snap = await adminDb.collection('academic_progress')
      .where('uid', '==', uid)
      .where('moduleId', '==', MODULO_INDUCCION)
      .get();
    snap.docs.forEach((doc) => {
      (doc.data()?.completedClasses ?? []).forEach((c: string) => hechas.add(c));
    });
  }

  return clases.every((c) => hechas.has(c.id));
}
