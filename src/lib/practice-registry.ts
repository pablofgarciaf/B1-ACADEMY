import LECCIONES_AULA from '@/content/aula/lecciones.json';
import { getModuleById } from '@/lib/curriculum-data';

/** Solo para el servidor: las prácticas evaluadas de cada clase publicada, con sus valores esperados. */
interface CampoEsperado { etiqueta: string; valor: string }
interface SyncPublicado { slide_index: number; step_guide: { campos?: CampoEsperado[] } | null }

const LECCIONES = LECCIONES_AULA as unknown as Record<string, { syncData: SyncPublicado[] }>;

/** Clave única de una práctica: "<claseId>#<lámina>". */
export const clavePractica = (classId: string, slideIndex: number) => `${classId}#${slideIndex}`;

/** Campos esperados de la práctica en esa lámina, o null si la lámina no es una práctica evaluada. */
export function camposEsperados(classId: string, slideIndex: number): CampoEsperado[] | null {
  const lamina = LECCIONES[classId]?.syncData.find((s) => s.slide_index === slideIndex);
  const campos = lamina?.step_guide?.campos;
  return campos?.length ? campos : null;
}

/** Todas las prácticas evaluadas que exige el certificado de un módulo. */
export function practicasDelModulo(moduleId: string): string[] {
  const modulo = getModuleById(moduleId);
  if (!modulo) return [];
  return modulo.classes.flatMap((clase) =>
    (LECCIONES[clase.id]?.syncData ?? [])
      .filter((s) => s.step_guide?.campos?.length)
      .map((s) => clavePractica(clase.id, s.slide_index)),
  );
}
