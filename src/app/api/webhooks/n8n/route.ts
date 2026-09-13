import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook Receptor para Automatizaciones con n8n
 * Recibe eventos de aprobación de cursos, genera certificados y
 * actualiza el estado del consultor en la bolsa de empleo.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, userId, userEmail, courseCode, score } = body;

    // Validación básica de payload
    if (!event || !userId) {
      return NextResponse.json(
        { error: 'Payload incompleto. Se requiere event y userId' },
        { status: 400 }
      );
    }

    console.log(`[n8n Webhook] Recibido evento: ${event} para usuario ${userId} en curso ${courseCode}`);

    // Casos de automatización
    if (event === 'COURSE_EVALUATION_PASSED') {
      const certificateId = `CERT-SAP-${courseCode}-${Date.now()}`;
      const verificationHash = `sha256-${Math.random().toString(36).substring(2, 12)}`;

      // Simula el retorno procesado por n8n (emisión PDF, almacenamiento en Firebase y notificación)
      return NextResponse.json({
        success: true,
        message: 'Certificado emitido exitosamente por n8n',
        certificate: {
          id: certificateId,
          hash: verificationHash,
          issuedDate: new Date().toISOString(),
          pdfDownloadUrl: `https://sapacademy.es/api/certificates/${certificateId}.pdf`,
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
