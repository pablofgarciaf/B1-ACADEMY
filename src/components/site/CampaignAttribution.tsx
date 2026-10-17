'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {analyticsAllowed,captureCampaign} from '@/lib/conversions';
export default function CampaignAttribution(){
  const path=usePathname();
  useEffect(()=>{const update=()=>{if(analyticsAllowed(document.cookie))captureCampaign(window.location.href);else {try{sessionStorage.removeItem('finix:campaign');}catch{}} };update();window.addEventListener('finix:consent',update);return()=>window.removeEventListener('finix:consent',update);},[path]);
  return null;
}
