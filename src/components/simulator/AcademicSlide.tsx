/** The visible lesson and its narration share one published source. */
export default function AcademicSlide({ script, title, index }: { script: string; title: string; index: number }) {
  const paragraphs = script.split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚ¿¡])/).filter(Boolean);
  return (
    <article className="w-full self-stretch overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-5 pb-28 sm:p-10 sm:pb-28 text-slate-100 cursor-text" onClick={e => e.stopPropagation()}>
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold tracking-widest uppercase text-amber-300">Finix Academy · Laboratorio comercial · {index}</p>
        <h2 className="mt-4 text-xl sm:text-3xl font-bold leading-tight">{title}</h2>
        <div className="mt-6 space-y-4 text-base sm:text-lg leading-relaxed text-slate-200 select-text">
          {paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
        </div>
        <div className="mt-8 border-t border-white/10 pt-4 text-sm text-slate-400">Caso educativo con datos de laboratorio. Comprueba los resultados de cada operación antes de continuar.</div>
      </div>
    </article>
  );
}
