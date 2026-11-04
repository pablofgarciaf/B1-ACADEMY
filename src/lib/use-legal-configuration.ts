'use client';
import { useEffect, useState } from 'react';
import { POLITICAS_VERSION } from './legal-config';
type PublicConfig = { ready:boolean; available:boolean; policyVersion:string };
export function useLegalConfiguration() {
  // Inicio en false/'' para que CookieConsent NO evalúe la cookie hasta que el servidor
  // confirme la policyVersion real (que incluye un hash de Firestore). Si se inicializa con
  // POLITICAS_VERSION y el servidor agrega ".{hash}", la cookie no coincide → banner eterno.
  const [config,setConfig] = useState<PublicConfig>({ready:false,available:false,policyVersion:''});
  useEffect(()=>{
    let active=true;
    const refresh=async()=>{
      try {const response=await fetch('/api/public/legal',{cache:'no-store'});const body=await response.json();if(active) setConfig({ready:response.ok&&body.ready===true,available:response.ok,policyVersion:typeof body.policyVersion==='string'?body.policyVersion:POLITICAS_VERSION});}
      catch {if(active)setConfig(c=>({...c,ready:false,available:false}));}
    };
    void refresh();window.addEventListener('academy:legal-updated',refresh);
    return ()=>{active=false;window.removeEventListener('academy:legal-updated',refresh);};
  },[]);
  return {...config,publicIntakeAvailable:config.available&&config.ready};
}
