import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb, fieldValue } from '@/lib/firebase-admin';
import { requireBearerUser } from '@/lib/server-auth';
import { getModuleById } from '@/lib/curriculum-data';
import { practicasDelModulo } from '@/lib/practice-registry';

const schema = z.object({ moduleId: z.string().min(1).max(80), classId: z.string().min(1).max(120) });

export async function GET(request: Request) {
  try {
    const user = await requireBearerUser(request);
    const moduleId = new URL(request.url).searchParams.get('moduleId') ?? '';
    if (!getModuleById(moduleId)) return NextResponse.json({ error: 'Módulo inválido.' }, { status: 400 });
    const snapshot = await adminDb.collection('academic_progress').doc(`${user.uid}_${moduleId}`).get();
    const data = snapshot.exists ? snapshot.data() : undefined;
    return NextResponse.json({
      completedClasses: data?.completedClasses ?? [],
      passedPractices: data?.passedPractices ?? [],
      requiredPractices: practicasDelModulo(moduleId),
    });
  } catch { return NextResponse.json({ error: 'No autorizado.' }, { status: 401 }); }
}

export async function POST(request: Request) {
  try {
    const user = await requireBearerUser(request);
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 });
    const courseModule = getModuleById(parsed.data.moduleId);
    if (!courseModule?.classes.some((item) => item.id === parsed.data.classId)) {
      return NextResponse.json({ error: 'Clase inválida.' }, { status: 400 });
    }
    await adminDb.collection('academic_progress').doc(`${user.uid}_${parsed.data.moduleId}`).set({
      uid: user.uid,
      moduleId: parsed.data.moduleId,
      completedClasses: fieldValue().arrayUnion(parsed.data.classId),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'No autorizado.' }, { status: 401 }); }
}
