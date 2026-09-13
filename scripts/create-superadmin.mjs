import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCWJ-ixvgHv10nFIphFTOEAazaC3q1W0NU",
  authDomain: "sup-academy.firebaseapp.com",
  projectId: "sup-academy",
  storageBucket: "sup-academy.firebasestorage.app",
  messagingSenderId: "907012228058",
  appId: "1:907012228058:web:a4c39e52af15cfc811b6e3",
  measurementId: "G-G2QTCW6XY2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const SUPERADMIN_EMAIL = 'pablofgarciaf@gmail.com';
const SUPERADMIN_PASS = '1721790721';
const SUPERADMIN_CEDULA = '1721790721';
const SUPERADMIN_NAME = 'Pablo F. García';

async function createSuperadmin() {
  console.log(`🚀 [SUP-ACADEMY] Inicializando creación de Superadmin: ${SUPERADMIN_EMAIL}...`);
  let userUid = '';

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, SUPERADMIN_EMAIL, SUPERADMIN_PASS);
    userUid = userCredential.user.uid;
    console.log(`✅ [Firebase Auth] Usuario creado exitosamente con UID: ${userUid}`);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log(`ℹ️ [Firebase Auth] El correo ya existe. Autenticando para sincronizar credenciales...`);
      try {
        const signCred = await signInWithEmailAndPassword(auth, SUPERADMIN_EMAIL, SUPERADMIN_PASS);
        userUid = signCred.user.uid;
        console.log(`✅ [Firebase Auth] Sesión iniciada con éxito. UID: ${userUid}`);
      } catch (signErr) {
        console.warn(`⚠️ [Firebase Auth] Contraseña actual distinta. Si necesitas resetearla puedes hacerlo vía consola o panel.`);
        userUid = 'superadmin-pablo';
      }
    } else {
      console.error(`❌ [Firebase Auth Error]:`, error.message);
      throw error;
    }
  }

  // Crear / Actualizar documento en la colección 'usuarios'
  console.log(`📂 [Firestore] Registrando perfil en colección 'usuarios/${SUPERADMIN_EMAIL}'...`);
  const userDocRef = doc(db, 'usuarios', SUPERADMIN_EMAIL);
  
  const superadminData = {
    uid: userUid,
    email: SUPERADMIN_EMAIL,
    name: SUPERADMIN_NAME,
    displayName: SUPERADMIN_NAME,
    cedula: SUPERADMIN_CEDULA,
    role: 'super',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignedTracks: [
      'sap-b1-core',
      'sri-localizacion',
      'heinsohn-nomina',
      'heinsohn-rrhh',
      'verticales-ecuador'
    ],
    overallProgressPercent: 100,
    averageGrade: 100,
    isEligibleForJobs: true,
    bio: 'Director General & Super Administrador de SAP Academy • Ecosistema Heinsohn Ecuador'
  };

  try {
    await setDoc(userDocRef, superadminData, { merge: true });
    console.log(`🎉 [Firestore] ¡Documento de Superadmin guardado con éxito en 'usuarios/${SUPERADMIN_EMAIL}'!`);
    console.log(`📋 Datos guardados:`, JSON.stringify(superadminData, null, 2));
  } catch (dbErr) {
    console.error(`❌ [Firestore Error]:`, dbErr.message);
    throw dbErr;
  }

  console.log(`\n✨ ¡PROCESO COMPLETADO SATISFACTORIAMENTE!`);
  console.log(`👉 Correo: ${SUPERADMIN_EMAIL}`);
  console.log(`👉 Contraseña / Cédula: ${SUPERADMIN_PASS}`);
  console.log(`👉 Rol en Firestore: 'super'`);
  process.exit(0);
}

createSuperadmin().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
