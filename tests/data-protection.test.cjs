const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { DAY, expired, encode, decode, seal, unseal, cleanRetention } = require('../operations/data-protection.cjs');
const { outsideRepo, validateSnapshot, restoreFirestore } = require('../operations/protect-data.cjs');
const types = require('firebase-admin/firestore');

test('retención elimina solo vencidos explícitos, conserva cuentas/contabilidad y respeta bloqueo legal', () => {
  const now = Date.parse('2026-10-17T00:00:00Z');
  assert.equal(expired('service_quotas', { expiresAt: new Date(now - 1) }, now), true);
  assert.equal(expired('certificate_verification_requests', { expiresAt: types.Timestamp.fromMillis(now + DAY) }, now), false);
  assert.equal(expired('service_quotas', { expiresAt: new Date(now - DAY), retentionHold: true }, now), false);
  for (const invalid of [undefined, 'bad-date', 0, {}, '2099-01-01']) assert.equal(expired('service_quotas', { expiresAt: invalid }, now), false);
  assert.equal(expired('exam_sessions', { createdAt: now - 729 * DAY }, now), false);
  assert.equal(expired('exam_sessions', { createdAt: now - 731 * DAY }, now), true);
  assert.equal(expired('business_leads', { createdAt: new Date(now - 366 * DAY).toISOString() }, now), true);
  for (const collection of ['usuarios', 'academic_progress', 'certificates', 'finixCompanies', 'sim_audit_events']) assert.equal(expired(collection, { expiresAt: new Date(now - DAY), createdAt: 1 }, now), false);
});

test('respaldo cifrado rechaza clave incorrecta o alteración y restaura todos los tipos Firestore', () => {
  const reference = { constructor: { name: 'DocumentReference' }, path: 'usuarios/synthetic' };
  const value = { null: null, bool: true, number: 15.25, infinity: Infinity, nan: NaN, text: 'Español',
    timestamp: new types.Timestamp(1234, 5678), geo: new types.GeoPoint(-0.18, -78.46), bytes: Buffer.from([0, 255]),
    array: ['x', { t: 'user-data', v: [1] }], reference };
  const key = crypto.randomBytes(32); const encoded = encode(value);
  const encrypted = seal({ encoded }, key);
  assert.doesNotMatch(encrypted.toString(), /Español|usuarios/);
  const restored = decode(unseal(encrypted, key).encoded, { doc: p => ({ path: p }) }, types);
  assert.equal(restored.timestamp.isEqual(value.timestamp), true);
  assert.equal(restored.geo.isEqual(value.geo), true);
  assert.deepEqual(restored.bytes, value.bytes); assert.equal(restored.reference.path, reference.path);
  assert.ok(Number.isNaN(restored.nan)); assert.equal(restored.infinity, Infinity); assert.deepEqual(restored.array, value.array);
  assert.throws(() => unseal(encrypted, crypto.randomBytes(32)));
  const tampered = JSON.parse(encrypted.toString()); const data = Buffer.from(tampered.data, 'base64'); data[0] ^= 1; tampered.data = data.toString('base64');
  assert.throws(() => unseal(Buffer.from(JSON.stringify(tampered)), key));
});

test('restauración prohíbe producción o destino con datos y detecta respaldos incompletos', async () => {
  assert.throws(() => outsideRepo(process.cwd()));
  const snapshot = { schema: 1, projectId: 'production', firestore: [], users: [] };
  await assert.rejects(restoreFirestore(snapshot, {}, 'production'), /different isolated/);
  await assert.rejects(restoreFirestore(snapshot, { listCollections: async () => [{}] }, 'test-project'), /must be empty/);
  assert.throws(() => validateSnapshot({ ...snapshot, simulator: { tables: { sim_companies: [] } } }), /Incomplete/);
  assert.throws(() => validateSnapshot({ ...snapshot, firestore: [{ path: 'invalid', data: {} }] }), /Invalid document/);
});

test('retención comprueba de nuevo la fecha antes de borrar y modo previo no escribe', async () => {
  const now = Date.now(); let deletes = 0; let reads = 0;
  const stale = { id: 'probe', ref: { id: 'probe' }, data: () => ({ expiresAt: new Date(now - DAY) }) };
  const db = { collection: name => ({ orderBy: () => ({ limit: () => ({ get: async () => name === 'service_quotas' ? { empty: false, size: 1, docs: [stale] } : { empty: true, docs: [] } }) }) }),
    runTransaction: async fn => fn({ get: async () => { reads++; return { exists: true, data: () => ({ expiresAt: new Date(now - DAY), retentionHold: true }) }; }, delete: () => { deletes++; } }) };
  const dry = await cleanRetention(db, { now }); assert.equal(dry.service_quotas.eligible, 1); assert.equal(reads, 0);
  const applied = await cleanRetention(db, { now, dryRun: false }); assert.equal(applied.service_quotas.deleted, 0); assert.equal(deletes, 0); assert.equal(reads, 1);
});
