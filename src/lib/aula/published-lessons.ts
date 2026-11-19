import original from '@/content/aula/lecciones.json';
import { OPERATIONAL_WORKSHOPS } from './operational-workshops';
import { caseSlide, type PublishedLesson } from './workshop-types';

/** Fuente publicada común a la entrega de clases, requisitos y evaluación del servidor. */
const lessons = structuredClone(original) as Record<string, PublishedLesson>;

// La clase de salida laboral heredaba íntegramente la narración de beneficios de mod6-c2.
// Conservamos la numeración histórica; la nueva evaluación utiliza nuevas claves al final.
const exitLesson = lessons['mod5-c3'];
const exitNarration = [
  'Esta clase estudia la evaluación de desempeño y el expediente de salida del personal. Practicarás la identificación de soportes, el control de pendientes y la conciliación de una liquidación académica con importes previamente revisados.',
  'Al terminar podrás separar evaluación de desempeño, decisión laboral, liquidación y cierre de accesos. Comprobarás los soportes de cada etapa y conciliarás los importes del caso sin sustituir la revisión laboral del responsable.',
  'La evaluación de desempeño documenta objetivos, resultados observables, retroalimentación y un plan de mejora. Una calificación no determina por sí sola una causal de terminación ni una indemnización. Cada decisión requiere su propia justificación y revisión.',
  'El expediente de salida comienza con una fecha y una decisión documentada. Talento Humano revisa la causal y los soportes aplicables, confirma saldos pendientes y coordina devolución de equipos, entrega del trabajo y cierre de accesos.',
  'Antes de preparar una liquidación, identifica remuneraciones pendientes, beneficios acumulados, vacaciones y descuentos respaldados. En los talleres usarás importes suministrados para practicar la conciliación; no se calculará una liquidación legal real.',
  'El cálculo del neto debe reconciliar conceptos a pagar y descuentos autorizados. Conserva la hoja de cálculo revisada y vincula la aprobación del responsable al pago. Un saldo numéricamente correcto no sustituye los soportes del expediente.',
  'La devolución de activos y la entrega de responsabilidades tienen responsables y fechas. Registra cualquier pendiente y su seguimiento. No declares el expediente completo si falta un soporte necesario, aunque el pago ya se haya efectuado.',
  'El cierre de accesos se coordina con la fecha efectiva de salida y los responsables del sistema. Desactivar una cuenta o un empleado conserva su historial. No se borran documentos anteriores ni movimientos contables para cerrar una relación laboral.',
  'El criterio de cierre reúne decisión revisada, importes conciliados, evidencia del pago, documentación laboral y entrega de activos. Los casos siguientes permiten comprobar estas decisiones; no tramitan actas ni envían datos a una autoridad.',
  'Resuelve los dos talleres de aplicación: primero identifica los pendientes y responsables de un expediente incompleto; después calcula el neto con los importes dados y decide si existen evidencias suficientes para cerrar. Debes acertar todos los criterios.',
];
exitLesson.syncData = exitNarration.map((script_text, index) => ({
  slide_index: index + 1, script_text, step_guide: null, presentation: 'text',
}));

for (const [classId, workshops] of Object.entries(OPERATIONAL_WORKSHOPS)) {
  const lesson = lessons[classId];
  for (const workshop of workshops) {
    lesson.syncData.push(caseSlide(workshop, lesson.syncData.length + 1));
    // Los talleres se muestran como texto; la imagen de respaldo mantiene el contrato de láminas.
    lesson.images.push(lesson.images.at(-1)!);
  }
}

export default lessons;
