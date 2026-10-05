// Promueve una cuenta existente. Requiere Application Default Credentials.
import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const email = process.env.ADMIN_EMAIL;
if (!email) throw new Error('Define ADMIN_EMAIL. Este script no acepta contraseñas.');
const app = getApps()[0] ?? initializeApp({ credential: applicationDefault() });
const auth = getAuth(app);
const account = await auth.getUserByEmail(email.toLowerCase());
await auth.setCustomUserClaims(account.uid, { role: 'super' });
await getFirestore(app).collection('usuarios').doc(account.uid).set({
  uid: account.uid, email: account.email, name: account.displayName || 'Administrador',
  displayName: account.displayName || 'Administrador', cedula: '', role: 'super',
  status: 'active', passwordChanged: true, updatedAt: new Date().toISOString(),
}, { merge: true });
console.log('Cuenta promovida correctamente:', account.uid);

