/** Stable UID keys for new academic records. Name-based IDs are read only for verified legacy ownership. */

export function sanitizeForDocId(text: string): string {
  if (!text) return 'estudiante';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar tildes y diacríticos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'estudiante';
}

/**
 * Genera el identificador único legible del documento en Firestore
 * con la estructura: `${modulo}_${nombre_estudiante}`.
 * 
 * Ejemplos:
 * - `legacyStudentDocId('mod-1', 'Nombre de prueba', 'student@example.test')` -> `'mod-1_pablo_garcia'`
 * - `legacyStudentDocId('mod-ventas', '', 'student@example.test')` -> `'mod-ventas_carlos'`
 */
export function legacyStudentDocId(moduleId: string, studentName?: string, email?: string): string {
  const safeModule = (moduleId || 'modulo').trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '_');
  const rawName = (studentName || '').trim() || (email ? email.split('@')[0] : 'estudiante');
  const safeStudent = sanitizeForDocId(rawName);
  return `${safeModule}_${safeStudent}`;
}

/**
 * Obtiene el nombre preferido legible del estudiante a partir de su perfil o correo.
 */
export function getStudentDisplayName(profile?: { displayName?: string; name?: string } | null, email?: string): string {
  const name = profile?.displayName?.trim() || profile?.name?.trim();
  if (name) return name;
  if (email) return email.split('@')[0];
  return 'Estudiante';
}

/** Identidad estable: los nombres nunca son claves de autorización. */
export function buildStudentDocId(moduleId: string, uid: string): string {
  if (!uid || uid.includes('/') || !moduleId || moduleId.includes('/')) throw new Error('Identidad académica inválida.');
  return uid + '_' + moduleId;
}
export function ownedAcademicData(data: Record<string, any> | undefined, uid: string, moduleId: string) {
  return data?.uid === uid && data?.moduleId === moduleId ? data : undefined;
}
