'use client';
import { useEffect, useState, useContext } from 'react';
import { CompanyContext } from '@/hooks/useCompany';
import { Field, inputClass } from './FinixControls';

/** Lectura automática de un informe: frases que enseñan a interpretar los números. */
export function Lectura({ titulo = 'Lectura del informe', frases }: { titulo?: string; frases: string[] }) {
  return (
    <section className="space-y-1 border border-[#999] bg-white p-2">
      <h3 className="font-bold text-[#003366]">{titulo}</h3>
      {frases.length ? <ul className="list-disc space-y-1 pl-5">{frases.map(f => <li key={f}>{f}</li>)}</ul> : <p>Sin observaciones para este período.</p>}
    </section>
  );
}

/** Preguntas de criterio + espacio para la respuesta del estudiante (se guarda en su navegador). */
export function ParaPensar({ preguntas, clave }: { preguntas: string[]; clave: string }) {
  const ephemeral=useContext(CompanyContext)?.ephemeral;
  const [texto, setTexto] = useState('');
  useEffect(() => { if(ephemeral)return; try { setTexto(localStorage.getItem(clave) ?? ''); } catch { setTexto(''); } }, [clave,ephemeral]);
  const guardar = (v: string) => { setTexto(v); try { if(!ephemeral)localStorage.setItem(clave, v); } catch { /* sin almacenamiento */ } };
  return (
    <section className="space-y-2 border border-[#999] bg-white p-2">
      <h3 className="font-bold text-[#003366]">🤔 Para pensar como gerente</h3>
      <ol className="list-decimal space-y-1 pl-5">{preguntas.map(p => <li key={p}>{p}</li>)}</ol>
      <Field label="Tu respuesta">
        <textarea className={`${inputClass} min-h-24`} value={texto} onChange={e => guardar(e.target.value)} placeholder="Escribe tu análisis y la decisión que tomarías…" />
      </Field>
      <p className="text-[#555]">{ephemeral ? 'Respuesta temporal; se descarta al salir.' : 'Se guarda en este navegador para conversar con tu docente.'}</p>
    </section>
  );
}
