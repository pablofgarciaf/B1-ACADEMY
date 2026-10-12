/**
 * Utilidad unificada para la nomenclatura y formato de documentos en Firestore
 * según el estándar del proyecto: `${modulo}_${nombre_estudiante}`.
 * 
 * Permite evitar tablas infinitas de identificadores crudos (hashes) y asegura
 * que tanto `academic_progress` como `evaluations` tengan documentos limpios,
 * legibles y ordenados por módulo y estudiante.
 */

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
 * - `buildStudentDocId('mod-1', 'Pablo García', 'pablo@ejemplo.com')` -> `'mod-1_pablo_garcia'`
 * - `buildStudentDocId('mod-ventas', '', 'carlos@empresa.com')` -> `'mod-ventas_carlos'`
 */
export function buildStudentDocId(moduleId: string, studentName?: string, email?: string): string {
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
