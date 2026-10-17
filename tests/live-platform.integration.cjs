// Opt-in integration against the deployed site. Creates only disposable synthetic identities.
// RUN_LIVE_PLATFORM_TESTS=1 node --test tests/live-platform.integration.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID, randomBytes, createHash } = require('node:crypto');

test('plataforma publicada: sesión, aislamiento, persistencia, auditoría y barreras académicas reales', {
  skip: process.env.RUN_LIVE_PLATFORM_TESTS !== '1' && 'Prueba remota solo por ejecución explícita', timeout: 240000,
}, async () => {
  require('@next/env').loadEnvConfig(process.cwd());
  const { initializeApp, cert, deleteApp } = require('firebase-admin/app');
  const { getAuth } = require('firebase-admin/auth');
  const { getFirestore } = require('firebase-admin/firestore');
  const base = (process.env.LIVE_PLATFORM_URL || 'https://b1-academy.vercel.app').replace(/\/$/, '');
  assert.ok(['https://b1-academy.vercel.app', 'http://localhost:4317'].includes(base), 'Destino de pruebas no autorizado');
  const app = initializeApp({ credential: cert({ projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n') }) }, `qa-${randomUUID()}`);
  const auth = getAuth(app), db = getFirestore(app); db.settings({ preferRest: true });
  const prefix = `qa_${randomBytes(10).toString('hex')}`;
  const uids = [`${prefix}_a`, `${prefix}_b`];
  const identities = [], created = [];
  const checks = [];
  const request = async (route, actor, body, slot = 'curso', cookie) => {
    const response = await fetch(base + route, { method: body === undefined ? 'GET' : 'POST',
      headers: { ...(actor ? { Authorization: `Bearer ${actor.token}` } : {}), 'X-Empresa': slot,
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...(cookie ? { Cookie: cookie } : {}) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }), redirect: 'manual', signal: AbortSignal.timeout(60000) });
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('json') ? await response.json() : await response.text();
    return { response, data };
  };
  const command = (actor, action, data, slot = 'curso', requestId = randomUUID()) =>
    request('/api/finix/company', actor, { requestId, command: { action, data } }, slot);
  const expectStatus = (result, status, name) => { assert.equal(result.response.status, status, name); checks.push(name); };
  try {
    for (const uid of uids) {
      const email = `${uid}@example.test`;
      await auth.createUser({ uid, email, password: randomBytes(24).toString('base64url'), emailVerified: true }); created.push(uid);
      await db.collection('usuarios').doc(uid).set({ uid, email, name: 'Alumno ficticio de prueba', displayName: 'Alumno ficticio de prueba',
        role: 'estudiante', status: 'active', passwordChanged: true, passwordSecurityVersion: 2, syntheticTest: true });
      const customToken = await auth.createCustomToken(uid);
      const signed = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: customToken, returnSecureToken: true }), signal: AbortSignal.timeout(30000) });
      assert.equal(signed.status, 200, 'Autenticación de identidad sintética');
      const session = await signed.json(); identities.push({ uid, token: session.idToken });
    }
    const [a, b] = identities;
    expectStatus(await request('/api/finix/company'), 401, 'Contabilidad anónima denegada');
    expectStatus(await request('/api/finix/company', a, undefined, 'privado'), 403, 'Permiso privado obligatorio');
    expectStatus(await command(a, 'initializeTraining', {}), 200, 'Preparación académica persistida');
    const academic = await request('/api/finix/company', a);
    expectStatus(academic, 200, 'Lectura académica autenticada');
    assert.equal(academic.data.profile.uid, a.uid);
    assert.ok(academic.data.chartOfAccounts.length > 100, 'Catálogo global persistido');
    expectStatus(await request(`/api/finix/company?uid=${a.uid}`, b), 403, 'Otra identidad no puede consultar la empresa');
    expectStatus(await request('/api/finix/company', a, undefined, '../curso'), 403, 'Slot inválido no cae en el aula');
    await db.collection('usuarios').doc(a.uid).update({ privateAccountingEnabled: true });
    expectStatus(await command(a, 'initialize', { companyName: 'Empresa privada ficticia de pruebas' }, 'privado'), 200, 'Inicialización privada autorizada');
    const privateRead = await request('/api/finix/company', a, undefined, 'privado');
    expectStatus(privateRead, 200, 'Empresa privada persistida');
    assert.equal(privateRead.data.profile.usage, 'private'); assert.equal(privateRead.data.profile.ruc, '');
    assert.equal(privateRead.data.bankAccounts.length, 0); assert.equal(privateRead.data.journalEntries.length, 0);
    assert.ok(privateRead.data.chartOfAccounts.length > 100, 'Catálogo global también en empresa privada');
    expectStatus(await command(a, 'initializeTraining', {}, 'privado'), 403, 'Siembra académica en privada denegada');
    expectStatus(await request(`/api/finix/company?uid=${a.uid}__privado`, b), 403, 'Privada ajena denegada');
    expectStatus(await request('/api/finix/company', b, undefined, 'privado'), 403, 'Permiso del otro propietario no se hereda');
    const sameRequest = randomUUID();
    const journal = { date: '2023-01-01', dueDate: '2023-01-01', memo: 'Apertura ficticia', reference: 'QA',
      lines: [{ accountCode: '1.1.01', debit: 100, credit: 0, description: '', costCenter: '' },
        { accountCode: '3.01', debit: 0, credit: 100, description: '', costCenter: '' }] };
    expectStatus(await command(a, 'journal', journal, 'privado', sameRequest), 200, 'Asiento privado persistido');
    expectStatus(await command(a, 'journal', journal, 'privado', sameRequest), 200, 'Reintento idempotente');
    const reread = await request('/api/finix/company', a, undefined, 'privado');
    assert.equal(reread.data.journalEntries.length, 1, 'Sin asientos duplicados');
    const audit = await request('/api/finix/company/audit?verify=1', a, undefined, 'privado');
    expectStatus(audit, 200, 'Verificación de trazabilidad real'); assert.equal(audit.data.valid, true); assert.ok(audit.data.checked >= 2);
    const practice = await request('/api/practice', a, { moduleId: 'mod-ventas', classId: 'mod-ventas-c1', slideIndex: 2,
      valores: ['respuesta inventada'], intentos: 1, vioSolucion: false, conectada: true });
    expectStatus(practice, 200, 'Práctica falsa evaluada'); assert.equal(practice.data.aprobada, false);
    expectStatus(await request('/api/progress', a, { moduleId: 'mod-ventas', classId: 'mod-ventas-c1' }), 403, 'Clase sin prácticas no se completa');
    expectStatus(await request('/api/oral-exam', a, { action: 'start', moduleId: 'mod-ventas' }), 403, 'Examen sin requisitos denegado');
    expectStatus(await request('/api/lesson-data?classId=mod1-c1', a), 200, 'Primera clase disponible tras preparar empresa');
    const privateAdvisor = await request('/api/simulador/advisor', a, { messages: [{ role: 'user', content: 'Consulta ficticia' }],
      currentScreen: 'menu', currentModule: 'finanzas', companySlot: 'privado', companyName: 'Empresa ficticia' }, 'privado');
    expectStatus(privateAdvisor, 403, 'Asistente externo desactivado en privada');
    const cookieResponse = await request('/api/auth/session', a, { idToken: a.token });
    expectStatus(cookieResponse, 200, 'Sesión web autenticada');
    const setCookie = cookieResponse.response.headers.get('set-cookie');
    assert.match(setCookie, /HttpOnly/i); assert.match(setCookie, /SameSite=Lax/i);
    const cookie = setCookie.split(';')[0];
    expectStatus(await request('/mi-aula', null, undefined, 'curso', cookie), 200, 'Aula renderizada con sesión real');
    expectStatus(await request('/simulador', null, undefined, 'curso', cookie), 200, 'Simulador renderizado con sesión real');
    const ownCerts = await request(`/api/certificates/my-certificates?uid=${b.uid}`, a);
    expectStatus(ownCerts, 200, 'Certificados de la sesión propia');
    assert.equal(ownCerts.data.certificates.length, 0);
    console.log(JSON.stringify({ checksPassed: checks.length, checks, syntheticOnly: true }));
  } finally {
    // Delete only namespaces created by this invocation, never unrelated rows or identities.
    const config = { url: process.env.SUPABASE_URL?.replace(/\/$/, ''), key: process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY };
    for (const uid of created) {
      assert.ok(uid.startsWith(prefix + '_'));
      if (config.url && config.key) for (const companyId of [uid, `${uid}__privado`]) {
        const removed = await fetch(`${config.url}/rest/v1/sim_companies?uid=eq.${companyId}`, { method: 'DELETE', headers: {
          apikey: config.key, ...(config.key.startsWith('eyJ') ? { Authorization: `Bearer ${config.key}` } : {}) }, signal: AbortSignal.timeout(30000) });
        assert.ok(removed.ok, 'Limpieza de empresa sintética');
      }
      for (const collection of ['practice_records', 'academic_progress', 'practice_evidence_claims', 'exam_sessions', 'evaluations', 'certificates']) {
        const found = await db.collection(collection).where('uid', '==', uid).get();
        for (const doc of found.docs) await doc.ref.delete();
      }
      // Exam attempt IDs are deterministic, and never owned by a real student here.
      await db.collection('exam_attempts').doc(`${uid}_mod-ventas`).delete();
      for (const companyId of [uid, `${uid}__privado`]) await db.recursiveDelete(db.collection('finixCompanies').doc(companyId));
      await db.recursiveDelete(db.collection('usuarios').doc(uid));
      for (const minutes of [10, 15]) for (const window of [Math.floor(Date.now() / (minutes * 60000)), Math.floor(Date.now() / (minutes * 60000)) - 1]) {
        for (const scope of ['advisor', 'tts']) await db.collection('service_quotas').doc(createHash('sha256').update(`${scope}:${uid}:${window}`).digest('hex')).delete();
      }
      await auth.deleteUser(uid);
      assert.equal((await db.collection('usuarios').doc(uid).get()).exists, false);
    }
    await deleteApp(app);
    console.log('Identidades y empresas sintéticas retiradas.');
  }
});
