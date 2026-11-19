'use client';

import { useState } from 'react';
import { coincide, type IntentoPractica } from '@/lib/practice-check';
import type { StepGuide } from '@/components/simulator/FinixInteractiveSimulator';
import type { WorkshopField } from '@/lib/aula/workshop-types';

export default function CaseWorkshop({ guide, onComplete }: {
  guide: StepGuide;
  onComplete: (attempt: IntentoPractica) => void;
}) {
  const fields = (guide.campos ?? []) as WorkshopField[];
  const [values, setValues] = useState(() => fields.map(() => ''));
  const [checked, setChecked] = useState<boolean[] | null>(null);
  const [attempts, setAttempts] = useState(0);
  return (
    <form className="mx-auto max-w-3xl space-y-5 rounded-xl border border-slate-600 bg-slate-900 p-5 text-slate-100"
      onSubmit={event => {
        event.preventDefault();
        const next = attempts + 1;
        const results = fields.map((field, index) => coincide(values[index], field.valor, field.etiqueta));
        setAttempts(next);
        setChecked(results);
        if (results.every(Boolean)) onComplete({ valores: values, intentos: next, vioSolucion: false });
      }}>
      <p className="text-sm text-sky-200">Taller de aplicación: razona y responde. Este caso registra evidencia académica; no crea documentos operativos en la empresa.</p>
      {guide.expected_output && <p className="text-sm"><strong>Criterio de éxito:</strong> {guide.expected_output} Todas las respuestas deben ser correctas.</p>}
      {fields.map((field, index) => {
        const inputId = `case-answer-${index}`;
        const feedbackId = `${inputId}-feedback`;
        return <div key={field.etiqueta} className="space-y-2">
          <label htmlFor={inputId} className="block font-semibold">{index + 1}. {field.etiqueta}</label>
          {field.opciones ? <select id={inputId} required value={values[index]} aria-describedby={feedbackId}
            aria-invalid={checked?.[index] === false} className="w-full rounded border border-slate-500 bg-slate-950 p-3"
            onChange={event => setValues(previous => previous.map((value, i) => i === index ? event.target.value : value))}>
            <option value="">Selecciona tu respuesta</option>
            {field.opciones.map(option => <option key={option}>{option}</option>)}
          </select> : <input id={inputId} required maxLength={500} value={values[index]} autoComplete="off"
            aria-describedby={feedbackId} aria-invalid={checked?.[index] === false}
            className="w-full rounded border border-slate-500 bg-slate-950 p-3"
            onChange={event => setValues(previous => previous.map((value, i) => i === index ? event.target.value : value))} />}
          <div id={feedbackId} className="text-sm">
            {checked && <p className={checked[index] ? 'text-emerald-300' : 'text-amber-300'}>{checked[index] ? 'Criterio correcto.' : 'Revisa este criterio y vuelve a intentarlo.'}</p>}
            {field.pista && <details><summary className="cursor-pointer text-sky-300">Ver pista</summary><p>{field.pista}</p></details>}
          </div>
        </div>;
      })}
      <p role="status" aria-live="polite" className="text-sm">{checked ? `${checked.filter(Boolean).length} de ${fields.length} criterios correctos.` : 'Completa el caso antes de enviar.'}</p>
      <button type="submit" className="rounded-lg bg-amber-400 px-5 py-3 font-bold text-slate-950">Comprobar respuestas</button>
    </form>
  );
}
