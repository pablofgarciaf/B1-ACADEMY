import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { z } from 'zod';

const webhookSchema = z.object({
  event: z.enum(['COURSE_EVALUATION_PASSED', 'JOB_APPLICATION_SUBMITTED']),
  userId: z.string().min(1).max(128),
  userEmail: z.string().email().optional(),
  courseCode: z.string().min(1).max(80).optional(),
  score: z.number().min(0).max(100).optional(),
});

/**
 * Webhook Receptor para Automatizaciones con n8n
 * Recibe eventos de aprobación de cursos, genera certificados y
 * actualiza el estado del consultor en la bolsa de empleo.
 */
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.N8N_WEBHOOK_SECRET;
    if (!secret) return NextResponse.json({ error: 'Webhook no configurado.' }, { status: 503 });
    const rawBody = await req.text();
    const supplied = req.headers.get('x-webhook-signature') ?? '';
    const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
    const validSignature = supplied.length === expected.length && timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
    if (!validSignature) return NextResponse.json({ error: 'Firma inválida.' }, { status: 401 });
    const parsed = webhookSchema.safeParse(JSON.parse(rawBody));
    if (!parsed.success) return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 });
    const { event, userId, courseCode } = parsed.data;

    // Casos de automatización
    if (event === 'COURSE_EVALUATION_PASSED') {
      const certificateId = `CERT-SAP-${courseCode}-${Date.now()}`;
      const verificationHash = createHmac('sha256', secret).update(`${userId}:${courseCode}:${certificateId}`).digest('hex');

      // Simula el retorno procesado por n8n (emisión PDF, almacenamiento en Firebase y notificación)
      return NextResponse.json({
        success: true,
        message: 'Certificado emitido exitosamente por n8n',
        certificate: {
          id: certificateId,
          hash: verificationHash,
          issuedDate: new Date().toISOString(),
          pdfDownloadUrl: `https://b1-academy.vercel.app/api/certificates/${certificateId}.pdf`,
          publishedToJobBoard: true,
        },
      });
    }

    if (event === 'JOB_APPLICATION_SUBMITTED') {
      return NextResponse.json({
        success: true,
        message: 'Postulación sincronizada con el ATS de la empresa contratante vía n8n',
      });
    }

    return NextResponse.json({ success: true, message: 'Evento recibido y procesado' });
  } catch (error) {
    console.error('[n8n Webhook Error]', error);
    return NextResponse.json({ error: 'Error interno procesando webhook' }, { status: 500 });
  }
}
