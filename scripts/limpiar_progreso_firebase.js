/**
 * Script de Limpieza Completa de Registros Artificiales en Firebase
 * SAP Academy - B1 Academy
 *
 * Borra academic_progress, evaluations y certificates generados indebidamente
 * para el usuario objetivo (pablofgarciaf@gmail.com).
 */

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// 1. Cargar variables de entorno de .env.local
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

function getEnv(key) {
  const match = envContent.match(new RegExp(`^${key}=["']?([^"'\\r\\n]+)["']?`, 'm'));
  return match ? match[1] : process.env[key];
}

const projectId = getEnv('FIREBASE_ADMIN_PROJECT_ID') || 'sup-academy';
const clientEmail = getEnv('FIREBASE_ADMIN_CLIENT_EMAIL');
let privateKey = getEnv('FIREBASE_ADMIN_PRIVATE_KEY');

if (!privateKey) {
  const pkMatch = envContent.match(/FIREBASE_ADMIN_PRIVATE_KEY="([\s\S]*?)"\r?\n/);
  if (pkMatch) privateKey = pkMatch[1];
}

if (privateKey) {
  privateKey = privateKey.replace(/\\n/g, '\n');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

const auth = admin.auth();
const db = admin.firestore();

async function main() {
  const targetEmail = process.argv[2] || 'pablofgarciaf@gmail.com';
  console.log(`\n======================================================`);
  console.log(`  B1 ACADEMY - PURGA DE REGISTROS ARTIFICIALES EN FIREBASE  `);
  console.log(`  Objetivo: ${targetEmail}`);
  console.log(`======================================================\n`);

  let user;
  try {
    user = await auth.getUserByEmail(targetEmail);
    console.log(`✓ Usuario en Auth: UID = ${user.uid}`);
  } catch (err) {
    const snap = await db.collection('users').where('email', '==', targetEmail).limit(1).get();
    if (!snap.empty) {
      user = { uid: snap.docs[0].id };
      console.log(`✓ Usuario en Firestore: UID = ${user.uid}`);
    } else {
      console.error(`✗ No se encontró usuario ${targetEmail}`);
      process.exit(1);
    }
  }

  const uid = user.uid;

  // 1. Borrar academic_progress
  console.log(`\n[1/3] Purgando colección 'academic_progress'...`);
  const progressSnap = await db.collection('academic_progress').where('uid', '==', uid).get();
  console.log(`Encontrados ${progressSnap.size} registros de progreso académico.`);
  for (const doc of progressSnap.docs) {
    await doc.ref.delete();
  }
  console.log(`✓ Todos los documentos de academic_progress eliminados.`);

  // 2. Borrar evaluations
  console.log(`\n[2/3] Purgando colección 'evaluations'...`);
  const evalSnap = await db.collection('evaluations').where('uid', '==', uid).get();
  console.log(`Encontrados ${evalSnap.size} registros de evaluaciones.`);
  for (const doc of evalSnap.docs) {
    await doc.ref.delete();
  }
  console.log(`✓ Todos los documentos de evaluations eliminados.`);

  // 3. Borrar certificates
  console.log(`\n[3/3] Purgando colección 'certificates'...`);
  const certSnap = await db.collection('certificates').where('uid', '==', uid).get();
  console.log(`Encontrados ${certSnap.size} certificados emitidos.`);
  for (const doc of certSnap.docs) {
    await doc.ref.delete();
  }
  console.log(`✓ Todos los certificados eliminados.`);

  // 4. Borrar archivo local si existe
  const localReport = path.join(__dirname, '../docs/CERTIFICADOS_EMITIDOS_PABLO.json');
  if (fs.existsSync(localReport)) {
    fs.unlinkSync(localReport);
    console.log(`✓ Eliminado reporte local docs/CERTIFICADOS_EMITIDOS_PABLO.json`);
  }

  const fakeScript = path.join(__dirname, '../scripts/aprobar_alumno_y_certificar.js');
  if (fs.existsSync(fakeScript)) {
    fs.unlinkSync(fakeScript);
    console.log(`✓ Eliminado script obsoleto scripts/aprobar_alumno_y_certificar.js`);
  }

  console.log(`\n======================================================`);
  console.log(`  ¡PURGA COMPLETADA CON ÉXITO! BASE DE DATOS LIMPIA   `);
  console.log(`======================================================\n`);
}

main().catch(err => {
  console.error('Error durante la purga:', err);
  process.exit(1);
});
