// Script: fix_pablo_firestore.mjs
// Patches Pablo's Firestore document to remove stale fields and add passwordChanged:true
// Run: node fix_pablo_firestore.mjs

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, deleteField } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCWJ-ixvgHv10nFIphFTOEAazaC3q1W0NU",
  authDomain: "sup-academy.firebaseapp.com",
  projectId: "sup-academy",
  storageBucket: "sup-academy.firebasestorage.app",
  messagingSenderId: "907012228058",
  appId: "1:907012228058:web:a4c39e52af15cfc811b6e3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const email = 'pablofgarciaf@gmail.com';
const ref = doc(db, 'usuarios', email);

await updateDoc(ref, {
  passwordChanged: true,
  isEligibleForJobs: deleteField(),
  overallProgressPercent: deleteField(),
  averageGrade: deleteField(),
  assignedTracks: ['sap-b1-core', 'sap-loc-ec', 'heinsohn-nomina', 'heinsohn-rrhh', 'verticales-ecuador']
});

console.log('Firestore document patched successfully for', email);
process.exit(0);
