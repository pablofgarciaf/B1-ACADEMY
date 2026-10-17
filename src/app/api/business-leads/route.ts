import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { adminDb } from '@/lib/firebase-admin';
import { businessLeadSchema } from '@/lib/business-lead';
import { clientAddress, consumeQuota } from '@/lib/rate-limit';
import { legalConfigured, POLITICAS_VERSION } from '@/lib/legal-config';

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production' && !legalConfigured) {
    return NextResponse.json({ error: 'Las solicitudes están temporalmente cerradas. Intenta más tarde.' }, { status: 503 });
  }
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: 'Origen no permitido.' }, { status: 403 });
  if (Number(request.headers.get('content-length')) > 12000) return NextResponse.json({ error: 'Solicitud demasiado extensa.' }, { status: 413 });
  const parsed = businessLeadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Revisa los campos y proporciona un correo o teléfono.' }, { status: 400 });
  try {
    const data = parsed.data;
    const contact = createHash('sha256').update(data.email || data.phone || '').digest('hex');
    const payloadHash = createHash('sha256').update(JSON.stringify(data)).digest('hex');
    const ref = adminDb.collection('business_leads').doc(data.requestId);
    // An idempotent retry returns no personal information. It neither rewrites consent nor duplicates the lead.
    const existing = await ref.get();
    if (existing.exists) {
      if (existing.data()?.payloadHash !== payloadHash) return NextResponse.json({ error: 'Solicitud incompatible. Inicia una nueva solicitud para cambiar los datos.' }, { status: 409 });
      return NextResponse.json({ id: data.requestId, status: 'received' });
    }
    const quota = await consumeQuota('business-leads', clientAddress(request), 5, 3600_000);
    if (!quota.allowed) return NextResponse.json({ error: 'Has enviado varias solicitudes. Intenta más tarde.' }, { status: 429, headers: { 'Retry-After': String(quota.retryAfter) } });
    const { requestId, website: _website, privacyAccepted: _accepted, ...fields } = data;
    const created = await adminDb.runTransaction(async tx => {
      const previous = await tx.get(ref);
      if (previous.exists) {
        if (previous.data()?.payloadHash !== payloadHash) throw new Error('ID_CONFLICT');
        return false;
      }
      tx.create(ref, { ...fields, contactHash: contact, payloadHash, privacyVersion: POLITICAS_VERSION, privacyAcceptedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(), status: 'new', deliveryStatus: 'pending_review' });
      return true;
    });
    return NextResponse.json({ id: requestId, status: 'received' }, { status: created ? 201 : 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'ID_CONFLICT') return NextResponse.json({ error: 'Solicitud incompatible.' }, { status: 409 });
    return NextResponse.json({ error: 'No pudimos registrar la solicitud. Tus datos siguen en el formulario; vuelve a intentarlo.' }, { status: 503 });
  }
}
