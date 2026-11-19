export interface WorkshopField {
  etiqueta: string;
  valor: string;
  pista?: string;
  opciones?: string[];
}

export interface WorkshopGuide {
  title: string;
  menu_path: string;
  action_type: string;
  instructions: string[];
  campos: WorkshopField[];
  expected_output?: string;
}

export interface WorkshopSlide {
  slide_index: number;
  script_text: string;
  step_guide: WorkshopGuide | null;
  presentation?: 'text';
}

export interface PublishedLesson {
  images: string[];
  syncData: WorkshopSlide[];
  quizQuestions: unknown[];
  references?: { title: string; url: string }[];
}

export interface CaseWorkshop {
  title: string;
  scenario: string;
  fields: WorkshopField[];
  outcome: string;
}

export const answer = (etiqueta: string, valor: string, pista: string, opciones?: string[]): WorkshopField =>
  ({ etiqueta, valor, pista, ...(opciones ? { opciones } : {}) });

export function caseSlide(workshop: CaseWorkshop, index: number): WorkshopSlide {
  return {
    slide_index: index,
    presentation: 'text',
    script_text: workshop.scenario,
    step_guide: {
      title: workshop.title,
      menu_path: 'Mi Aula > Taller de aplicación',
      action_type: 'caso',
      instructions: [
        'Lee el caso y resuelve cada decisión o cálculo con los datos indicados.',
        'Usa las pistas si lo necesitas. Los importes se expresan con dos decimales y sin separador de miles.',
        'Envía tus respuestas para comprobarlas. Puedes corregir los criterios pendientes y volver a intentarlo.',
      ],
      campos: workshop.fields,
      expected_output: workshop.outcome,
    },
  };
}
