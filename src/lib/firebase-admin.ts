import 'server-only';

import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  try {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const credential = (projectId && clientEmail && privateKey)
      ? cert({ projectId, clientEmail, privateKey })
      : undefined;
    return initializeApp(credential ? { credential } : undefined);
  } catch (error) {
    console.error('Firebase Admin Initialization Error:', error instanceof Error ? error.message : error);
    return null;
  }
}

const adminApp = getAdminApp();

export const adminAuth = adminApp ? getAuth(adminApp) : null as unknown as ReturnType<typeof getAuth>;
export const adminDb = adminApp ? getFirestore(adminApp) : null as unknown as ReturnType<typeof getFirestore>;

