// Configuration presence only. Never print credentials, addresses or contact values.
require('@next/env').loadEnvConfig(process.cwd());
const required=['NEXT_PUBLIC_SITE_URL','NEXT_PUBLIC_LEGAL_NAME','NEXT_PUBLIC_LEGAL_RUC','NEXT_PUBLIC_LEGAL_ADDRESS','NEXT_PUBLIC_LEGAL_CITY','NEXT_PUBLIC_PRIVACY_EMAIL','FIREBASE_ADMIN_PROJECT_ID','FIREBASE_ADMIN_CLIENT_EMAIL','FIREBASE_ADMIN_PRIVATE_KEY','CERTIFICATE_SIGNING_SECRET','TTS_SIGNING_SECRET','NEXT_PUBLIC_GTM_ID'];
const missing=required.filter(name=>!process.env[name]?.trim());
if(process.env.NEXT_PUBLIC_SITE_URL&&!/^https:\/\//.test(process.env.NEXT_PUBLIC_SITE_URL))missing.push('NEXT_PUBLIC_SITE_URL: requiere HTTPS');
if(process.env.NEXT_PUBLIC_GTM_ID&&!/^GTM-[A-Z0-9]{4,}$/.test(process.env.NEXT_PUBLIC_GTM_ID))missing.push('NEXT_PUBLIC_GTM_ID: formato inválido');
if(process.env.NEXT_PUBLIC_GTM_ID==='GTM-FINIXACADEMY')missing.push('NEXT_PUBLIC_GTM_ID: sustituir muestra');
if(process.env.NEXT_PUBLIC_LEGAL_RUC&&!/^\d{13}$/.test(process.env.NEXT_PUBLIC_LEGAL_RUC))missing.push('NEXT_PUBLIC_LEGAL_RUC: formato inválido');
if(process.env.NEXT_PUBLIC_PRIVACY_EMAIL&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.NEXT_PUBLIC_PRIVACY_EMAIL))missing.push('NEXT_PUBLIC_PRIVACY_EMAIL: formato inválido');
if(process.env.AUTH_POLICY_EPOCH&&!Number.isFinite(Date.parse(process.env.AUTH_POLICY_EPOCH)))missing.push('AUTH_POLICY_EPOCH: fecha inválida');
console.log(JSON.stringify({configurationReady:!missing.length,pending:missing,externalChecks:['Despliegue de reglas e índices/TTL Firestore','Migración de auditoría Supabase si se utiliza','Dos cuentas de ensayo y aislamiento cruzado','Recuperación de correo y recepción de solicitudes','Eventos en el contenedor real y atribución de campaña','Dominio, HTTPS y redirecciones']},null,2));
process.exitCode=missing.length?1:0;
