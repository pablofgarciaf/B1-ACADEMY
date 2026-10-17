'use strict';
const crypto = require('node:crypto');
const zlib = require('node:zlib');

const DAY = 86400000;
const RETENTION = Object.freeze({
  service_quotas: { field: 'expiresAt', days: 0 },
  certificate_verification_limits: { field: 'expiresAt', days: 0 },
  certificate_verification_requests: { field: 'expiresAt', days: 0 },
  exam_sessions: { field: 'createdAt', days: 730 },
  business_leads: { field: 'createdAt', days: 365 },
});

function millis(value) {
  if (value && typeof value.toMillis === 'function') return value.toMillis();
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return value;
  return typeof value === 'string' ? Date.parse(value) : NaN;
}

function expired(collection, data, now = Date.now()) {
  const rule = RETENTION[collection];
  if (!rule || data.retentionHold === true) return false;
  const time = millis(data[rule.field]);
  // Reject malformed/future timestamps. Never infer an expiry from missing data.
  if (!Number.isFinite(time) || time <= 0 || time > now) return false;
  return time + rule.days * DAY <= now;
}

function encode(value) {
  if (value === null) return { t: 'null' };
  if (value instanceof Date) return { t: 'date', v: value.toISOString() };
  if (Buffer.isBuffer(value) || value instanceof Uint8Array) return { t: 'bytes', v: Buffer.from(value).toString('base64') };
  if (typeof value?.toDate === 'function' && Number.isInteger(value.seconds)) return { t: 'timestamp', s: value.seconds, n: value.nanoseconds };
  if (value?.constructor?.name === 'GeoPoint') return { t: 'geo', a: value.latitude, o: value.longitude };
  if (value?.constructor?.name === 'DocumentReference') return { t: 'reference', v: value.path };
  if (Array.isArray(value)) return { t: 'array', v: value.map(encode) };
  if (typeof value === 'number') return { t: 'number', v: Number.isFinite(value) ? value : String(value) };
  if (typeof value === 'string' || typeof value === 'boolean') return { t: typeof value, v: value };
  if (typeof value === 'object') return { t: 'map', v: Object.fromEntries(Object.entries(value).map(([k, v]) => [k, encode(v)])) };
  throw new Error('Unsupported backup data type');
}

function decode(node, db, types) {
  switch (node.t) {
    case 'null': return null;
    case 'date': return new Date(node.v);
    case 'bytes': return Buffer.from(node.v, 'base64');
    case 'timestamp': return new types.Timestamp(node.s, node.n);
    case 'geo': return new types.GeoPoint(node.a, node.o);
    case 'reference': return db.doc(node.v);
    case 'array': return node.v.map(v => decode(v, db, types));
    case 'map': return Object.fromEntries(Object.entries(node.v).map(([k, v]) => [k, decode(v, db, types)]));
    case 'number': return Number(node.v);
    case 'string': case 'boolean': return node.v;
    default: throw new Error('Invalid backup value');
  }
}

function seal(payload, key) {
  if (!Buffer.isBuffer(key) || key.length !== 32) throw new Error('A 32-byte encryption key is required');
  const plain = Buffer.from(JSON.stringify(payload));
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(Buffer.from('academy-backup-v1'));
  return Buffer.from(JSON.stringify({ format: 'academy-backup-v1', iv: iv.toString('base64'),
    tag: null, data: null, ...(() => {
      const data = Buffer.concat([cipher.update(zlib.gzipSync(plain)), cipher.final()]);
      return { data: data.toString('base64'), tag: cipher.getAuthTag().toString('base64') };
    })() }));
}

function unseal(encrypted, key) {
  const envelope = JSON.parse(encrypted.toString());
  if (envelope.format !== 'academy-backup-v1') throw new Error('Unsupported backup format');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(envelope.iv, 'base64'));
  decipher.setAAD(Buffer.from(envelope.format));
  decipher.setAuthTag(Buffer.from(envelope.tag, 'base64'));
  const compressed = Buffer.concat([decipher.update(Buffer.from(envelope.data, 'base64')), decipher.final()]);
  return JSON.parse(zlib.gunzipSync(compressed).toString());
}

async function cleanRetention(db, { now = Date.now(), limit = 2000, dryRun = true } = {}) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 20000) throw new Error('Invalid retention limit');
  const result = {};
  for (const collection of Object.keys(RETENTION)) {
    let after; let scanned = 0; let deleted = 0;
    // Document-ID pagination works even when native TTL/field indexes are unavailable.
    while (scanned < limit) {
      let query = db.collection(collection).orderBy('__name__').limit(Math.min(100, limit - scanned));
      if (after) query = query.startAfter(after);
      const page = await query.get();
      if (page.empty) break;
      for (const doc of page.docs) {
        scanned++;
        if (!expired(collection, doc.data(), now)) continue;
        if (dryRun) { deleted++; continue; }
        // Check again inside a transaction: an operator may have set a hold meanwhile.
        const removed = await db.runTransaction(async tx => {
          const current = await tx.get(doc.ref);
          if (!current.exists || !expired(collection, current.data(), now)) return false;
          tx.delete(doc.ref); return true;
        });
        if (removed) deleted++;
      }
      after = page.docs.at(-1);
      if (page.size < 100) break;
    }
    result[collection] = { scanned, [dryRun ? 'eligible' : 'deleted']: deleted, complete: scanned < limit };
  }
  return result;
}

module.exports = { DAY, RETENTION, millis, expired, encode, decode, seal, unseal, cleanRetention };
