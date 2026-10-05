import { createHmac } from 'crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { requireBearerUser } from '@/lib/server-auth';
import { getModuleById } from '@/lib/curriculum-data';

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

    const [progress, evaluations] = await Promise.all([
      adminDb.collection('academic_progress').doc(`${user.uid}_${courseModule.id}`).get(),
      adminDb.collection('evaluations').where('uid', '==', user.uid).where('moduleId', '==', courseModule.id).where('passed', '==', true).limit(1).get(),
    ]);
    const completed = new Set<string>(progress.data()?.completedClasses ?? []);
    if (!courseModule.classes.every((item) => completed.has(item.id)) || evaluations.empty) {
      return NextResponse.json({ error: 'Aún no cumples los requisitos de emisión.' }, { status: 403 });
    }
    const issuedAt = new Date().toISOString();
    const digest = createHmac('sha256', secret).update(`${user.uid}:${courseModule.id}:${issuedAt}`).digest('hex').slice(0, 20).toUpperCase();
    const code = `B1-${courseModule.id.toUpperCase()}-${digest}`;
    await adminDb.collection('certificates').doc(code).set({ code, uid: user.uid, moduleId: courseModule.id, issuedAt, status: 'valid' });
    return NextResponse.json({ code });
  } catch {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }
}
