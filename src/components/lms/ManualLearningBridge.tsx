'use client';
import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { manualLearningPath, lessonHref } from '@/lib/manual-learning-path';
import { MANUAL_CASES } from '@/lib/manual-cases';
import { MANUAL_LABS, manualLabKey } from '@/lib/manual-labs';
const ManualSandbox=dynamic(()=>import('./ManualSandbox'),{ssr:false,loading:()=> <p>Preparando demostración…</p>});
export default function ManualLearningBridge({manualId}:{manualId:string}) {
 const {manual,modules}=manualLearningPath(manualId);const {currentUser}=useAuth();
 const key=manualLabKey(manualId),scenario=MANUAL_CASES[key];
 const [showAula,setShowAula]=useState(false);const [showReason,setShowReason]=useState(false);
 const [reason,setReason]=useState('');
 return <section className="h-full overflow-y-auto p-3 sm:p-4 space-y-4 text-slate-200">
  <header><h3 className="font-bold text-white">{manual?.title}</h3><p className="mt-2 text-sm">Practica el tema con datos ficticios. Aquí no se registra progreso ni se emiten constancias.</p></header>
  {scenario&&<section className="rounded-xl border border-sky-500/40 bg-sky-950/30 p-3 space-y-3">
    <h4 className="font-bold text-sky-200">Caso para explorar</h4><p>{scenario[0]}</p>
    <label className="block text-sm">Antes de probar, explica qué harías y qué resultado esperas<textarea value={reason} onChange={e=>setReason(e.target.value)} className="mt-2 block min-h-20 w-full rounded bg-slate-900 p-2 text-white border border-slate-600"/></label>
    <button type="button" className="rounded bg-sky-700 px-3 py-2 text-sm" onClick={()=>setShowReason(v=>!v)}>{showReason?'Ocultar explicación':'Comparar mi razonamiento'}</button>
    {showReason&&<p className="text-sm text-sky-100" role="status">{scenario[2]}</p>}
  </section>}
  {MANUAL_LABS[key]&&<ManualSandbox key={manualId} manualId={manualId}/>}
  {!MANUAL_LABS[key]&&<p className="text-xs text-amber-200">Este tema se trabaja aquí como caso guiado. El formulario completo de SAP no está reproducido en esta demostración.</p>}
  <button type="button" className="rounded border border-slate-600 px-3 py-2 text-sm" onClick={()=>setShowAula(v=>!v)}>{showAula?'Ocultar clases':'Abrir prácticas evaluadas en Mi Aula'}</button>
  {showAula&&modules.map(module=><article key={module.id} className="rounded-xl border border-slate-700 p-3"><h4 className="font-bold">{module.title}</h4><ul className="mt-3 space-y-2">{module.classes.map(lesson=><li key={lesson.id}><Link className="block rounded border border-slate-700 px-3 py-2 text-sm hover:bg-sky-950" href={currentUser?lessonHref(module.id,lesson.id):'/login?next='+encodeURIComponent(lessonHref(module.id,lesson.id))}>{lesson.title}</Link></li>)}</ul></article>)}
  <p className="text-xs text-slate-400">Solo Mi Aula guarda operaciones y valida prácticas para la constancia por módulo. Este laboratorio utiliza una empresa temporal independiente.</p>
 </section>;
}
