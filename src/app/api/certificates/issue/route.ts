import { createHmac } from 'crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { requireBearerUser } from '@/lib/server-auth';
import { getModuleById } from '@/lib/curriculum-data';
import { practicasDelModulo } from '@/lib/practice-registry';

const schema = z.object({ moduleId: z.string().min(1).max(80) });

export async function POST(request: Request) {
  try {
    const user = await requireBearerUser(request);
    const secret = process.env.CERTIFICATE_SIGNING_SECRET;
    if (!secret) return NextResponse.json({ error: 'Emisión no configurada.' }, { status: 503 });
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Módulo inválido.' }, { status: 400 });
    const courseModule = getModuleById(parsed.data.moduleId);
    if (!courseModule) return NextResponse.json({ error: 'Módulo inválido.' }, { status: 400 });
    // Un módulo sin clases publicadas no puede certificar ("todas las clases" sería verdadero con cero clases).
    if (!courseModule.classes.length) return NextResponse.json({ error: 'Este módulo aún no está disponible.' }, { status: 403 });

    const [progress, evaluations] = await Promise.all([
      adminDb.collection('academic_progress').doc(`${user.uid}_${courseModule.id}`).get(),
      adminDb.collection('evaluations').where('uid', '==', user.uid).where('moduleId', '==', courseModule.id).where('passed', '==', true).limit(1).get(),
    ]);
    const completed = new Set<string>(progress.data()?.completedClasses ?? []);
    if (!courseModule.classes.every((item) => completed.has(item.id)) || evaluations.empty) {
      return NextResponse.json({ error: 'Aún no cumples los requisitos de emisión.' }, { status: 403 });
    }
    // Además de las clases y la evaluación, cada práctica del simulador debe estar aprobada (calificada en /api/practice).
    const passed = new Set<string>(progress.data()?.passedPractices ?? []);
    const pendientes = practicasDelModulo(courseModule.id).filter((clave) => !passed.has(clave));
    if (pendientes.length) {
      return NextResponse.json({ error: `Te faltan ${pendientes.length} práctica(s) del simulador por aprobar en este módulo.` }, { status: 403 });
    }
    const issuedAt = new Date().toISOString();
    const digest = createHmac('sha256', secret).update(`${user.uid}:${courseModule.id}:${issuedAt}`).digest('hex').slice(0, 20).toUpperCase();
    const code = `B1-${courseModule.id.toUpperCase()}-${digest}`;
    // Nombre del certificado y del titular congelados al emitir: la página pública /verificar/<código> solo lee este documento.
    const holderName = (user.profile.displayName || user.profile.name || '').trim().slice(0, 120);
    await adminDb.collection('certificates').doc(code).set({
      code, uid: user.uid, moduleId: courseModule.id, issuedAt, status: 'valid',
      title: courseModule.certificateTitle, holderName,
    });
    return NextResponse.json({ code });
  } catch {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }
}
