import { initializeApp } from 'firebase/app';
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
const db = getFirestore(app);

const SUPERADMIN_EMAIL = 'pablofgarciaf@gmail.com';

async function testFirestore() {
  console.log(`📂 [Firestore Test] Guardando en 'usuarios/${SUPERADMIN_EMAIL}'...`);
  const userDocRef = doc(db, 'usuarios', SUPERADMIN_EMAIL);
  
  const superadminData = {
    uid: 'super-pablo-1721790721',
    email: SUPERADMIN_EMAIL,
    name: 'Pablo F. García',
    displayName: 'Pablo F. García',
    cedula: '1721790721',
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

  await setDoc(userDocRef, superadminData, { merge: true });
  console.log(`✅ [Firestore Success] Documento creado exitosamente en 'usuarios/${SUPERADMIN_EMAIL}'!`);

  const snap = await getDoc(userDocRef);
  console.log(`📖 [Firestore Read]:`, snap.data());
  process.exit(0);
}

testFirestore().catch(e => {
  console.error(`❌ [Firestore Test Error]:`, e);
  process.exit(1);
});
