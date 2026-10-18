import { readLegalConfiguration } from '@/lib/legal-config-server';
import { createHmac } from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

const schema = z.object({
  code: z.string().trim().toUpperCase().regex(/^B1-[A-Z0-9-]{4,60}$/),
  requesterName: z.string().trim().min(2).max(100),
  requesterEmail: z.union([z.literal(''), z.string().trim().email().max(254)]).transform(value => value.toLowerCase()),
  requesterPhone: z.union([z.literal(''), z.string().trim().regex(/^\+?[0-9 ()-]{7,24}$/)]).refine(v => !v || (v.replace(/\D/g,'').length>=7 && v.replace(/\D/g,'').length<=15), 'Revisa el teléfono.'),
  privacyAccepted: z.literal(true),
  policyVersion: z.string().min(1).max(100),
  marketingAccepted: z.boolean(),
}).refine(value => !!(value.requesterEmail || value.requesterPhone), { message: 'Indica un correo o teléfono.' });

const responseHeaders = { 'Cache-Control': 'no-store, private', 'X-Robots-Tag': 'noindex, nofollow' };
const DAY_MS = 24 * 60 * 60 * 1000;

function privateKey(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('hex');
}

export async function POST(request: Request) {
  const config = await readLegalConfiguration();
  if(!config.available || !config.ready)return NextResponse.json({error:'La verificación estará disponible pronto.'},{status:503});
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Completa el código, nombre, un medio de contacto y el aviso de privacidad.' }, { status: 400, headers: responseHeaders });

  if (parsed.data.policyVersion !== config.policyVersion) return NextResponse.json({error:'El aviso de privacidad cambió. Actualiza la página y vuelve a aceptarlo.'},{status:409,headers:responseHeaders});
  const secret = process.env.CERTIFICATE_SIGNING_SECRET;
  if (!secret) return NextResponse.json({ error: 'La verificación no está disponible temporalmente.' }, { status: 503, headers: responseHeaders });

  // Vercel sustituye este encabezado y evita que el cliente falsifique la IP. Fuera de Vercel
  // usamos una sola cuota compartida, en lugar de confiar en encabezados arbitrarios.
  const ip = process.env.VERCEL === '1'
    ? (request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim()
    : 'untrusted-proxy';
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Guayaquil', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const { code, requesterName, requesterEmail, requesterPhone, marketingAccepted } = parsed.data;
  const ipHash = privateKey(`ip:${ip}`, secret);
  const contactHash = privateKey(`contact:${requesterEmail || requesterPhone.replace(/[^+0-9]/g, '')}`, secret);
  const ipLimit = adminDb.collection('certificate_verification_limits').doc(`${day}_ip_${ipHash}`);
  const contactLimit = adminDb.collection('certificate_verification_limits').doc(`${day}_contact_${contactHash}`);
  const certificate = adminDb.collection('certificates').doc(code);
  const inquiry = adminDb.collection('certificate_verification_requests').doc();

  try {
    const result = await adminDb.runTransaction(async transaction => {
      const [ipSnap, contactSnap, certSnap] = await Promise.all([
        transaction.get(ipLimit), transaction.get(contactLimit), transaction.get(certificate),
      ]);
      const ipCount = Number(ipSnap.data()?.count ?? 0);
      const contactCount = Number(contactSnap.data()?.count ?? 0);
      if (ipCount >= 30 || contactCount >= 5) return { limited: true as const };

      transaction.set(ipLimit, { count: ipCount + 1, day, expiresAt: new Date(Date.now() + 2 * DAY_MS) });
      transaction.set(contactLimit, { count: contactCount + 1, day, expiresAt: new Date(Date.now() + 2 * DAY_MS) });
      transaction.create(inquiry, {
        requesterName, requesterEmail: requesterEmail || null, requesterPhone: requesterPhone || null,
        code, queriedAt: new Date(),
        privacyNoticeVersion: config.policyVersion, privacyAccepted: true,
        marketingAccepted,
        result: certSnap.exists ? (certSnap.data()?.status === 'valid' ? 'valid' : 'revoked') : 'not_found',
        ipHash, expiresAt: new Date(Date.now() + 30 * DAY_MS),
      });
      if (!certSnap.exists) return { limited: false as const, certificate: null };
      const data = certSnap.data()!;
      return {
        limited: false as const,
        certificate: {
          code,
          status: data.status === 'valid' ? 'valid' : 'revoked',
          title: String(data.title || 'Certificado de competencia').slice(0, 180),
          holderName: String(data.holderName || '').slice(0, 120),
          issuedAt: String(data.issuedAt || ''),
        },
      };
    });
    if (result.limited) return NextResponse.json({ error: 'Se alcanzó el límite diario de consultas. Inténtalo mañana.' }, { status: 429, headers: responseHeaders });
    return NextResponse.json({ certificate: result.certificate }, { headers: responseHeaders });
  } catch (error) {
    console.error('[certificates/verify] Error al verificar:', error);
    return NextResponse.json({ error: 'La verificación no está disponible temporalmente.' }, { status: 503, headers: responseHeaders });
  }
}
