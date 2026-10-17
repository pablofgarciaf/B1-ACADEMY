'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { camposConsulta } from '@/lib/sales-learning';
import { coincide, type IntentoPractica } from '@/lib/practice-check';

export default function PracticeQuery({missionId,onCompleta}:{missionId:string;onCompleta:(v:IntentoPractica)=>void}){
  const c=useCompany(),fields=camposConsulta(c.data,missionId);
  const [values,setValues]=useState<string[]>([]),[error,setError]=useState(''),[done,setDone]=useState(false);
  if(c.loading)return <p className="p-5">Consultando tu empresa…</p>;
  if(!fields)return <p role="alert" className="p-5">Completa primero los documentos de las misiones anteriores para realizar esta consulta.</p>;
  return <div className="space-y-4 p-5"><h3 className="font-bold">Consulta de tu empresa</h3><p>Lee los datos actuales y registra los resultados. Esta actividad no modifica tus documentos.</p>
    <dl className="grid gap-2 rounded border bg-white p-3">{fields.map(f=><div key={f.etiqueta} className="flex justify-between gap-3"><dt>{f.etiqueta}</dt><dd className="font-bold">{f.valor}</dd></div>)}</dl>
    <form className="space-y-3" onSubmit={e=>{e.preventDefault();if(fields.every((f,i)=>coincide(values[i]||'',f.valor,f.etiqueta))){setDone(true);setError('');onCompleta({valores:values,intentos:1,vioSolucion:false});}else setError('Revisa los datos de la consulta.');}}>
      {fields.map((f,i)=><label className="block" key={f.etiqueta}>{f.etiqueta}<input required disabled={done} className="ml-3 rounded border bg-white p-2" value={values[i]||''} onChange={e=>setValues(v=>{const n=[...v];n[i]=e.target.value;return n;})}/></label>)}
      {error&&<p role="alert">{error}</p>}<button disabled={done} className="rounded bg-blue-700 px-4 py-2 text-white">{done?'Lectura comprobada':'Comprobar lectura'}</button>
    </form></div>;
}
