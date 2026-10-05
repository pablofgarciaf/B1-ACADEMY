// Actualización explícita por UID. Requiere Application Default Credentials.
import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const uid = process.env.TARGET_USER_UID;
if (!uid) throw new Error('Define TARGET_USER_UID.');
const app = getApps()[0] ?? initializeApp({ credential: applicationDefault() });
await getFirestore(app).collection('usuarios').doc(uid).set({ passwordChanged: true, updatedAt: new Date().toISOString() }, { merge: true });
console.log('Perfil actualizado correctamente:', uid);
