import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { z } from 'zod';
import {adminDb} from '@/lib/firebase-admin';

const webhookSchema = z.object({
  event: z.enum(['COURSE_EVALUATION_PASSED', 'JOB_APPLICATION_SUBMITTED']),
  userId: z.string().min(1).max(128),
  userEmail: z.string().email().optional(),
  courseCode: z.string().min(1).max(80).optional(),
  score: z.number().min(0).max(100).optional(),
});

/**
 * Webhook Receptor para Automatizaciones con n8n
 * Registra eventos firmados para revisión. La recepción no emite certificados
 * ni declara ejecutadas automatizaciones posteriores.
 */
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.N8N_WEBHOOK_SECRET;
    if (!secret) return NextResponse.json({ error: 'Webhook no configurado.' }, { status: 503 });
    const rawBody = await req.text();
    if (rawBody.length > 12000) return NextResponse.json({error:'Payload demasiado extenso.'},{status:413});
    const supplied = req.headers.get('x-webhook-signature') ?? '';
    const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
    const validSignature = /^[a-f0-9]{64}$/.test(supplied) && timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
    if (!validSignature) return NextResponse.json({ error: 'Firma inválida.' }, { status: 401 });
    let body: unknown;
    try { body = JSON.parse(rawBody); } catch { return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 }); }
    const parsed = webhookSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 });
    const id=createHmac('sha256',secret).update(rawBody).digest('hex');
    const ref=adminDb.collection('automation_events').doc(id);
    const fresh=await adminDb.runTransaction(async tx=>{const previous=await tx.get(ref);if(previous.exists)return false;tx.create(ref,{...parsed.data,status:'pending_review',receivedAt:new Date().toISOString()});return true;});
    return NextResponse.json({received:true,id,status:'pending_review',completed:false,duplicate:!fresh},{status:202});
  } catch (error) {
    console.error('[n8n Webhook Error]', error);
    return NextResponse.json({ error: 'Error interno procesando webhook' }, { status: 500 });
  }
}
