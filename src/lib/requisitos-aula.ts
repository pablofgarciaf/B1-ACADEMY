import 'server-only';
import { adminDb } from '@/lib/firebase-admin';
import { getModuleById } from '@/lib/curriculum-data';

/** Módulo de inducción: obligatorio antes de cualquier otro módulo de Mi Aula. */
export const MODULO_INDUCCION = 'mod-1';
const ROLES_SIN_REQUISITO = new Set(['super', 'admin', 'docente']);

/** ¿El estudiante ya completó todas las clases del Módulo 1? (docentes y administradores no lo necesitan) */
export async function moduloInduccionCompleto(uid: string, role?: string): Promise<boolean> {
  if (role && ROLES_SIN_REQUISITO.has(role)) return true;
  const clases = getModuleById(MODULO_INDUCCION)?.classes ?? [];
  if (!clases.length) return true;
  const doc = await adminDb.collection('academic_progress').doc(`${uid}_${MODULO_INDUCCION}`).get();
  const hechas = new Set<string>(doc.data()?.completedClasses ?? []);
  return clases.every((c) => hechas.has(c.id));
}
