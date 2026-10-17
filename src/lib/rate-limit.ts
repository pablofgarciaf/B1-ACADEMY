import 'server-only';
import { createHash } from 'crypto';
import { adminDb } from './firebase-admin';

/** Only trust the address supplied by the hosting proxy, never a visitor header. */
export function clientAddress(request: Request): string {
  if (process.env.VERCEL === '1' || process.env.TRUST_PROXY_HEADERS === 'true') {
    return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim().slice(0, 100) || 'shared';
  }
  return 'shared';
}

/** Shared quota. A missing database fails closed; no per-process fallback. */
export async function consumeQuota(scope: string, actor: string, max: number, windowMs: number, now = Date.now()) {
  const window = Math.floor(now / windowMs);
  const id = createHash('sha256').update(`${scope}:${actor}:${window}`).digest('hex');
  const resetAt = (window + 1) * windowMs;
  const ref = adminDb.collection('service_quotas').doc(id);
  const allowed = await adminDb.runTransaction(async tx => {
    const snap = await tx.get(ref);
    const count = Number(snap.data()?.count || 0);
    if (count >= max) return false;
    tx.set(ref, { count: count + 1, expiresAt: new Date(resetAt + 86400_000) });
    return true;
  });
  return { allowed, retryAfter: Math.max(1, Math.ceil((resetAt - now) / 1000)) };
}
