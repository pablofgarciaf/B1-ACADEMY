#!/usr/bin/env node
'use strict';
// Local operator tool: no HTTP endpoint, client bundle, or cloud upload.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { RETENTION, encode, decode, seal, unseal, cleanRetention } = require('./data-protection.cjs');
const ROOT = path.resolve(__dirname, '..');
const TABLES = ['sim_companies', 'sim_entities', 'sim_requests', 'sim_audit_events'];

function outsideRepo(target) {
  const relative = path.relative(ROOT, path.resolve(target));
  if (!relative || (!relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative))) throw new Error('Storage must be outside the repository');
  return path.resolve(target);
}

function envFile(file) {
  // Node's native parser preserves escaped private keys; values never go to stdout.
  if (file && fs.existsSync(file)) process.loadEnvFile(file);
}

function firebase() {
  const { initializeApp, cert } = require('firebase-admin/app');
  const { getFirestore } = require('firebase-admin/firestore');
  const { getAuth } = require('firebase-admin/auth');
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  if (!projectId || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || !process.env.FIREBASE_ADMIN_PRIVATE_KEY) throw new Error('Firebase credentials missing');
  const app = initializeApp({ credential: cert({ projectId, clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n') }) }, `protection-${crypto.randomUUID()}`);
  const db = getFirestore(app);
  // HTTPS transport also works on Windows networks that block native gRPC.
  db.settings({ preferRest: true });
  return { db, auth: getAuth(app), projectId };
}

async function firestoreSnapshot(db) {
  const documents = [];
  const walk = async collection => {
    // listDocuments includes missing parents that still have subcollections.
    const refs = await collection.listDocuments();
    for (let start = 0; start < refs.length; start += 100) {
      const batch = refs.slice(start, start + 100);
      const docs = await db.getAll(...batch);
      for (let i = 0; i < batch.length; i++) {
        if (docs[i].exists) documents.push({ path: docs[i].ref.path, data: encode(docs[i].data()) });
        for (const child of await batch[i].listCollections()) await walk(child);
      }
    }
  };
  for (const collection of await db.listCollections()) await walk(collection);
  return documents.sort((a, b) => a.path.localeCompare(b.path));
}

async function authSnapshot(auth) {
  const users = []; let page;
  do {
    const result = await auth.listUsers(1000, page);
    for (const user of result.users) users.push(user.toJSON());
    page = result.pageToken;
  } while (page);
  return users;
}

function supabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (process.env.SIMULADOR_DB !== 'supabase') return null;
  if (!url || !key || key.startsWith('sb_publishable_')) throw new Error('Simulator backup credentials missing');
  return { url, headers: { apikey: key, ...(key.startsWith('eyJ') ? { Authorization: `Bearer ${key}` } : {}) } };
}

async function readTable(config, table, columns = '*') {
  if (!TABLES.includes(table)) throw new Error('Unknown simulator table');
  const order = { sim_companies: 'uid', sim_entities: 'uid,collection,id', sim_requests: 'uid,request_id', sim_audit_events: 'uid,version' }[table];
  const rows = [];
  for (let offset = 0; ; offset += 500) {
    const url = `${config.url}/rest/v1/${table}?select=${columns}&order=${order}&offset=${offset}&limit=500`;
    const response = await fetch(url, { headers: config.headers, signal: AbortSignal.timeout(60000) });
    if (!response.ok) throw Object.assign(new Error('Simulator backup request failed'), { code: `HTTP_${response.status}` });
    const page = await response.json();
    if (!Array.isArray(page)) throw new Error('Invalid simulator backup response');
    rows.push(...page);
    if (page.length < 500) break;
  }
  return rows;
}

async function simulatorSnapshot(config) {
  if (!config) return null;
  const before = await readTable(config, 'sim_companies', 'uid,version');
  const tables = {};
  for (const table of TABLES) tables[table] = await readTable(config, table);
  const after = await readTable(config, 'sim_companies', 'uid,version');
  if (JSON.stringify(before) !== JSON.stringify(after) || JSON.stringify(tables.sim_companies.map(c => ({ uid: c.uid, version: c.version }))) !== JSON.stringify(after)) {
    throw new Error('Simulator changed during backup; retry during a quiet period');
  }
  return { project: new URL(config.url).hostname.split('.')[0], tables };
}

function validateSnapshot(snapshot) {
  if (snapshot.schema !== 1 || !snapshot.projectId || !Array.isArray(snapshot.firestore) || !Array.isArray(snapshot.users)) throw new Error('Invalid backup manifest');
  const paths = new Set();
  for (const doc of snapshot.firestore) {
    if (typeof doc.path !== 'string' || doc.path.split('/').length % 2 !== 0 || paths.has(doc.path)) throw new Error('Invalid document path');
    paths.add(doc.path);
  }
  if (snapshot.simulator) {
    const tables = snapshot.simulator.tables;
    for (const name of TABLES) if (!Array.isArray(tables[name])) throw new Error('Incomplete simulator backup');
    const companies = new Set(tables.sim_companies.map(c => c.uid));
    for (const name of TABLES.slice(1)) for (const row of tables[name]) if (!companies.has(row.uid)) throw new Error('Orphan simulator data');
  }
  return { firestoreDocuments: paths.size, authUsers: snapshot.users.length,
    simulatorRows: snapshot.simulator ? Object.fromEntries(TABLES.map(name => [name, snapshot.simulator.tables[name].length])) : null };
}

async function backup(directory, key, source) {
  const snapshot = { schema: 1, createdAt: new Date().toISOString(), projectId: source.projectId,
    consistency: 'logical-document-snapshot-with-simulator-version-check',
    firestore: await firestoreSnapshot(source.db), users: await authSnapshot(source.auth), simulator: await simulatorSnapshot(supabaseConfig()) };
  const counts = validateSnapshot(snapshot);
  const encrypted = seal(snapshot, key);
  const name = `academy-${snapshot.createdAt.replace(/[:.]/g, '-')}.enc`;
  const destination = path.join(directory, name);
  fs.writeFileSync(`${destination}.pending`, encrypted, { mode: 0o600, flag: 'wx' });
  const verified = unseal(fs.readFileSync(`${destination}.pending`), key);
  if (JSON.stringify(verified) !== JSON.stringify(snapshot)) throw new Error('Backup round-trip failed');
  fs.renameSync(`${destination}.pending`, destination);
  fs.writeFileSync(`${destination}.sha256`, `${crypto.createHash('sha256').update(encrypted).digest('hex')}\n`, { mode: 0o600 });
  // Expire only our own completed encrypted snapshots, after a new backup was verified.
  for (const entry of fs.readdirSync(directory)) {
    if (!/^academy-\d{4}-\d{2}-\d{2}T[\d-]+Z\.enc$/.test(entry)) continue;
    const old = path.join(directory, entry);
    if (fs.statSync(old).mtimeMs < Date.now() - 30 * 86400000) {
      fs.unlinkSync(old); if (fs.existsSync(`${old}.sha256`)) fs.unlinkSync(`${old}.sha256`);
    }
  }
  return { file: name, ...counts, verified: true };
}

async function restoreFirestore(snapshot, target, targetProject) {
  if (!targetProject || snapshot.projectId === targetProject) throw new Error('Restore requires a different isolated Firebase project');
  const { Timestamp, GeoPoint } = require('firebase-admin/firestore');
  // A target must be empty: recovery never overwrites users or accounting records.
  if ((await target.listCollections()).length) throw new Error('Restore target must be empty');
  for (let i = 0; i < snapshot.firestore.length; i += 200) {
    const batch = target.batch();
    for (const doc of snapshot.firestore.slice(i, i + 200)) batch.create(target.doc(doc.path), decode(doc.data, target, { Timestamp, GeoPoint }));
    await batch.commit();
  }
  const restored = await firestoreSnapshot(target);
  if (JSON.stringify(restored) !== JSON.stringify(snapshot.firestore)) throw new Error('Restored Firestore verification failed');
  return { verified: true, documents: restored.length };
}

async function restoreSimulator(snapshot, config, targetProject) {
  if (!snapshot.simulator || !config) throw new Error('Simulator backup and target credentials are required');
  const target = new URL(config.url).hostname.split('.')[0];
  if (!targetProject || targetProject !== target || snapshot.simulator.project === target) throw new Error('Restore requires a different isolated simulator project');
  for (const table of TABLES) if ((await readTable(config, table)).length) throw new Error('Simulator restore target must be empty');
  for (const table of TABLES) {
    const rows = snapshot.simulator.tables[table];
    for (let start = 0; start < rows.length; start += 100) {
      const response = await fetch(`${config.url}/rest/v1/${table}`, { method: 'POST', headers: {
        ...config.headers, 'Content-Type': 'application/json', Prefer: 'return=minimal',
      }, body: JSON.stringify(rows.slice(start, start + 100)), signal: AbortSignal.timeout(60000) });
      if (!response.ok) throw Object.assign(new Error('Simulator restore failed'), { code: `HTTP_${response.status}` });
    }
  }
  for (const table of TABLES) {
    // Object key order is not material; compare canonical JSON recursively.
    const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
      ? Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])])) : value;
    if (JSON.stringify(canonical(await readTable(config, table))) !== JSON.stringify(canonical(snapshot.simulator.tables[table]))) throw new Error('Restored simulator verification failed');
  }
  return { verified: true, tables: TABLES.length };
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';
  const option = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
  if (command === 'help') {
    console.log('Commands: backup | retention [--apply] | run | verify --file FILE | restore-firestore --file FILE --isolated-project ID | restore-simulator --file FILE --isolated-simulator-project ID\nRequired: --env FILE --directory PRIVATE_EXTERNAL_DIR --key PRIVATE_KEY_FILE'); return;
  }
  const directory = outsideRepo(option('--directory') || '');
  const keyFile = outsideRepo(option('--key') || '');
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  const statusFile = path.join(directory, 'last-run.json');
  const lock = path.join(directory, '.run-lock');
  // An active lock is never removed automatically; operators inspect interrupted runs.
  const descriptor = fs.openSync(lock, 'wx', 0o600);
  try {
    envFile(option('--env'));
    const key = fs.readFileSync(keyFile);
    if (key.length !== 32) throw new Error('Invalid backup key');
    let result;
    if (['verify', 'restore-firestore', 'restore-simulator'].includes(command)) {
      const file = outsideRepo(option('--file') || '');
      const snapshot = unseal(fs.readFileSync(file), key);
      const counts = validateSnapshot(snapshot);
      if (command === 'restore-firestore' && process.env.FIREBASE_ADMIN_PROJECT_ID !== option('--isolated-project')) throw new Error('Target project mismatch');
      result = command === 'verify' ? { ...counts, verified: true } : command === 'restore-simulator'
        ? await restoreSimulator(snapshot, supabaseConfig(), option('--isolated-simulator-project'))
        : await restoreFirestore(snapshot, firebase().db, option('--isolated-project'));
    } else if (command === 'backup' || command === 'retention' || command === 'run') {
      const source = firebase(); result = {};
      // Always back up before a scheduled retention pass. An unsuccessful backup aborts deletion.
      if (command !== 'retention') result.backup = await backup(directory, key, source);
      if (command !== 'backup') result.retention = await cleanRetention(source.db, { dryRun: command === 'retention' && !args.includes('--apply'), limit: 20000 });
    } else throw new Error('Unknown command');
    const status = { ok: true, command, completedAt: new Date().toISOString(), result };
    fs.writeFileSync(statusFile, JSON.stringify(status, null, 2), { mode: 0o600 });
    console.log(JSON.stringify(status));
  } catch (error) {
    // Provider errors may contain data or URLs. Only a code is written to operator status.
    const status = { ok: false, command, failedAt: new Date().toISOString(), error: String(error.code || 'PROTECTION_OPERATION_FAILED') };
    fs.writeFileSync(statusFile, JSON.stringify(status, null, 2), { mode: 0o600 });
    console.error(JSON.stringify(status)); process.exitCode = 1;
  } finally { fs.closeSync(descriptor); fs.unlinkSync(lock); }
}

module.exports = { outsideRepo, validateSnapshot, firestoreSnapshot, restoreFirestore, restoreSimulator, readTable };
if (require.main === module) main().catch(error => { console.error(JSON.stringify({ ok: false, error: String(error.code || 'CONFIGURATION_FAILED') })); process.exitCode = 1; });
