'use client';

import { CheckCircle2, ArrowRight } from 'lucide-react';

interface AulaCompletedViewProps {
  progressError: string | null;
  lessonSaved: boolean;
  isLastClassInModule: boolean;
  practiceNotice: string | null;
  onRetrySave: () => void;
  onNextClass?: () => void;
  hasNextClass: boolean;
}

export default function AulaCompletedView({
  progressError,
  lessonSaved,
  isLastClassInModule,
  practiceNotice,
  onRetrySave,
  onNextClass,
  hasNextClass
}: AulaCompletedViewProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
        <CheckCircle2 className="w-12 h-12 text-emerald-400" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">¡Misión Completada con Éxito!</h3>
      <p className="text-sm text-gray-300 max-w-md leading-relaxed mb-4" role="status">
        {progressError || (lessonSaved ? (isLastClassInModule ? 'Módulo terminado con éxito. Puedes acceder ahora a la Evaluación con Tutor IA.' : 'Progreso y prácticas guardadas. Puedes continuar a la siguiente clase cuando estés listo.') : 'Guardando tu progreso en Finix ERP...')}
      </p>

      {hasNextClass && lessonSaved && onNextClass && (
        <button
          onClick={onNextClass}
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 text-sm shadow-lg shadow-amber-500/30 transition active:scale-95 cursor-pointer"
        >
          <span>Continuar a la siguiente lección</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {progressError && (
        <button
          onClick={onRetrySave}
          className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-slate-950 font-bold active:scale-95"
        >
          Reintentar guardado
        </button>
      )}

      {practiceNotice && (
        <p className="mt-3 max-w-md text-xs text-amber-300 bg-amber-950/40 border border-amber-500/30 p-2.5 rounded-lg" role="status">
          {practiceNotice}
        </p>
      )}
    </div>
  );
}
