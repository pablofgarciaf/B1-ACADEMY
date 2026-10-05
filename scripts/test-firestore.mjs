// Comprobación de lectura. Requiere Application Default Credentials y TEST_USER_UID.
import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const uid = process.env.TEST_USER_UID;
if (!uid) throw new Error('Define TEST_USER_UID.');
const app = getApps()[0] ?? initializeApp({ credential: applicationDefault() });
const snapshot = await getFirestore(app).collection('usuarios').doc(uid).get();
console.log(snapshot.exists ? 'Perfil encontrado.' : 'Perfil no encontrado.');

