// Configuration presence and public readiness only. Never print credentials or contact values.
require('@next/env').loadEnvConfig(process.cwd());
const required=['FIREBASE_ADMIN_PROJECT_ID','FIREBASE_ADMIN_CLIENT_EMAIL','FIREBASE_ADMIN_PRIVATE_KEY','CERTIFICATE_SIGNING_SECRET'];
const missing=required.filter(name=>!process.env[name]?.trim());
const optionalPending=[];
if(!process.env.NEXT_PUBLIC_SITE_URL?.trim()||process.env.NEXT_PUBLIC_SITE_URL.includes('.vercel.app'))optionalPending.push('Dominio oficial y conexión DNS pendientes');
if(!process.env.NEXT_PUBLIC_GTM_ID?.trim())optionalPending.push('Contenedor real de analítica y atribución pendiente');
if(process.env.NEXT_PUBLIC_SITE_URL&&!/^https:\/\//.test(process.env.NEXT_PUBLIC_SITE_URL))missing.push('NEXT_PUBLIC_SITE_URL: requiere HTTPS');
if(process.env.NEXT_PUBLIC_GTM_ID&&(!/^GTM-[A-Z0-9]{4,}$/.test(process.env.NEXT_PUBLIC_GTM_ID)||process.env.NEXT_PUBLIC_GTM_ID==='GTM-FINIXACADEMY'))missing.push('NEXT_PUBLIC_GTM_ID: sustituir muestra o corregir formato');
if(process.env.AUTH_POLICY_EPOCH&&!Number.isFinite(Date.parse(process.env.AUTH_POLICY_EPOCH)))missing.push('AUTH_POLICY_EPOCH: fecha inválida');
(async()=>{
 let publicIntakeReady=false,legalStatus='No verificado';
 try {const url=new URL('/api/public/legal',process.env.NEXT_PUBLIC_SITE_URL||'https://b1-academy.vercel.app');const response=await fetch(url,{signal:AbortSignal.timeout(10000)});const config=await response.json();publicIntakeReady=response.ok&&config.available===true&&config.ready===true;legalStatus=publicIntakeReady?'Datos públicos configurados':'Completar datos reales en Administración > Configuración';}catch{legalStatus='No se pudo verificar la configuración publicada';}
 console.log(JSON.stringify({backendConfigurationReady:!missing.length,publicIntakeReady,legalStatus,pending:missing,optionalPending,notes:['RUC y dominio no son requisitos del formulario de configuración.','La voz admite firma derivada de la clave administrativa cuando no existe clave dedicada.'],externalChecks:['Reglas de acceso publicadas y aislamiento entre cuentas','Auditoría persistida y prueba de recuperación de respaldo','Retención programada verificada; TTL nativo solo si está habilitado','Recorrido de inscripción, aprendizaje y emisión de constancia','Recepción de solicitudes y eventos reales de conversión']},null,2));
 process.exitCode=missing.length||!publicIntakeReady?1:0;
})();
