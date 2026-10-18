'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import type { LegalDetails } from '@/lib/legal-config';

const fields: {key:keyof LegalDetails;label:string;optional?:boolean}[] = [
  {key:'razonSocial',label:'Nombre o razón social del responsable'}, {key:'direccion',label:'Dirección pública'},
  {key:'ciudad',label:'Ciudad'}, {key:'correoPrivacidad',label:'Correo para privacidad y solicitudes'},
  {key:'ruc',label:'RUC',optional:true}, {key:'whatsapp',label:'Teléfono público',optional:true},
  {key:'sitio',label:'Dominio oficial (https://...)',optional:true},
];
const empty:LegalDetails={razonSocial:'',direccion:'',ciudad:'',correoPrivacidad:'',ruc:'',whatsapp:'',sitio:''};
export default function LegalConfigurationPage() {
  const {currentUser}=useAuth();
  const [details,setDetails]=useState<LegalDetails>(empty);
  const [ready,setReady]=useState(false),[missing,setMissing]=useState<string[]>([]),[busy,setBusy]=useState(false),[message,setMessage]=useState('Cargando configuración…'),[confirmed,setConfirmed]=useState(false);
  useEffect(()=>{
    if(!currentUser)return;
    let active=true;
    void (async()=>{try{const token=await currentUser.getIdToken();const response=await fetch('/api/admin/legal',{headers:{Authorization:`Bearer ${token}`},cache:'no-store'});const body=await response.json();if(!response.ok)throw Error(body.error||'No se pudo consultar la configuración. La captación permanece cerrada.');if(active){setDetails(Object.fromEntries(fields.map(f=>[f.key,body.legal[f.key]||''])) as LegalDetails);setReady(body.ready);setMissing(body.missing);setMessage('');}}catch(error){if(active)setMessage(error instanceof Error?error.message:'No se pudo cargar.');}})();
    return ()=>{active=false;};
  },[currentUser]);
  async function save(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();if(!currentUser||busy||!confirmed)return;setBusy(true);setMessage('');
    try{const token=await currentUser.getIdToken();const response=await fetch('/api/admin/legal',{method:'PUT',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(details)});const body=await response.json();if(!response.ok)throw Error(body.error||'No se pudo guardar.');setReady(body.ready);setMissing(body.missing);setMessage(body.ready?'Configuración publicada. Inscripciones y solicitudes habilitadas.':'Borrador guardado. Completa los campos pendientes para habilitar la captación.');window.dispatchEvent(new Event('academy:legal-updated'));setConfirmed(false);}catch(error){setMessage(error instanceof Error?error.message:'No se pudo guardar.');}finally{setBusy(false);}
  }
  return <main className="mx-auto max-w-3xl px-4 py-10 text-slate-900 dark:text-white">
    <Link href="/admin" className="text-sky-500 underline">Volver a administración</Link>
    <h1 className="mt-5 text-3xl font-bold">Configuración para recibir inscripciones</h1>
    <section className="my-6 rounded-2xl border p-5" aria-label="Estado de captación">
      <h2 className="font-bold">{ready?'Inscripciones y solicitudes habilitadas':'Pendiente: inscripciones y solicitudes cerradas'}</h2>
      {missing.length>0&&<p className="mt-2">Falta: {missing.join(', ')}.</p>}
      <p className="mt-2 text-sm">El RUC y el dominio oficial pueden añadirse después. Estos datos se publican en los avisos de privacidad y contacto. Si no se puede verificar la configuración, la recepción de datos se cierra temporalmente.</p>
    </section>
    <form onSubmit={save} className="space-y-5">
      {fields.map(field=><label key={field.key} className="block font-medium">{field.label}{field.optional?' (opcional)':''}<input type={field.key==='correoPrivacidad'?'email':field.key==='sitio'?'url':'text'} maxLength={field.key==='direccion'?250:field.key==='ruc'?13:254} value={details[field.key]} onChange={event=>{setDetails({...details,[field.key]:event.target.value});setConfirmed(false);}} className="mt-2 w-full rounded-xl border bg-white p-3 text-slate-900 dark:bg-slate-900 dark:text-white"/></label>)}
      <label className="flex gap-3"><input type="checkbox" checked={confirmed} onChange={event=>setConfirmed(event.target.checked)} className="mt-1 h-5 w-5"/><span>Confirmo que estos datos públicos son reales y estoy autorizado para publicarlos. Si los cambio, los visitantes deberán aceptar nuevamente el aviso actualizado.</span></label>
      <button disabled={!confirmed||busy} className="min-h-12 rounded-xl bg-sky-600 px-6 py-3 font-bold text-white disabled:opacity-50">{busy?'Guardando…':'Guardar y publicar estos datos'}</button>
      <p role="status" className="rounded-xl p-3">{message}</p>
    </form>
    <p className="mt-8 text-sm">El dominio también debe conectarse en el alojamiento para que funcione. Esta pantalla no configura DNS ni claves del SRI. <Link href="/privacidad" className="text-sky-500 underline">Revisar aviso publicado</Link></p>
  </main>;
}
