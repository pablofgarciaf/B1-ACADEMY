'use client';
import { useEffect, useState } from 'react';
import { POLITICAS_VERSION } from './legal-config';
type PublicConfig = { ready:boolean; available:boolean; policyVersion:string };
export function useLegalConfiguration() {
  const [config,setConfig] = useState<PublicConfig>({ready:true,available:true,policyVersion:POLITICAS_VERSION});
  useEffect(()=>{
    let active=true;
    const refresh=async()=>{
      try {const response=await fetch('/api/public/legal',{cache:'no-store'});const body=await response.json();if(active) setConfig({ready:response.ok&&body.ready===true,available:response.ok,policyVersion:typeof body.policyVersion==='string'?body.policyVersion:POLITICAS_VERSION});}
      catch {if(active)setConfig(c=>({...c,ready:false,available:false}));}
    };
    void refresh();window.addEventListener('focus',refresh);window.addEventListener('academy:legal-updated',refresh);
    return ()=>{active=false;window.removeEventListener('focus',refresh);window.removeEventListener('academy:legal-updated',refresh);};
  },[]);
  return {...config,publicIntakeAvailable:config.available&&config.ready};
}
