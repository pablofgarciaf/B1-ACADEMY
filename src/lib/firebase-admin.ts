import 'server-only';

import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function getCredential() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    try {
      return cert({ projectId, clientEmail, privateKey });
    } catch (error) {
      // Llave mal pegada en el hosting: no se tumba el sitio entero; las rutas que dependan de Admin fallarán controladamente.
      console.error('FIREBASE_ADMIN_PRIVATE_KEY inválida:', error instanceof Error ? error.message : error);
    }
  } else {
    console.error('Faltan variables FIREBASE_ADMIN_* en el entorno; Firebase Admin queda sin credenciales propias.');
  }

  return applicationDefault();
}

const adminApp = getApps()[0] ?? initializeApp({ credential: getCredential() });

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);

