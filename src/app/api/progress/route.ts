import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb, fieldValue } from '@/lib/firebase-admin';
import { requireBearerUser } from '@/lib/server-auth';
import { getModuleById } from '@/lib/curriculum-data';
import { practicasDelModulo } from '@/lib/practice-registry';
import { buildStudentDocId } from '@/lib/student-doc';

const schema = z.object({ moduleId: z.string().min(1).max(80), classId: z.string().min(1).max(120) });

export async function GET(request: Request) {
  try {
    const user = await requireBearerUser(request);
    const moduleId = new URL(request.url).searchParams.get('moduleId') ?? '';
    if (!getModuleById(moduleId)) return NextResponse.json({ error: 'Módulo inválido.' }, { status: 400 });

    const studentName = user.profile.displayName || user.profile.name || user.email;
    const docId = buildStudentDocId(moduleId, studentName, user.email);

    const [newDocSnap, legacyDocSnap] = await Promise.all([
      adminDb.collection('academic_progress').doc(docId).get(),
      adminDb.collection('academic_progress').doc(`${user.uid}_${moduleId}`).get(),
    ]);

    const newData = newDocSnap.exists ? newDocSnap.data() : undefined;
    const legacyData = legacyDocSnap.exists ? legacyDocSnap.data() : undefined;

    // Combinación retrocompatible para asegurar que ningún progreso previo se pierda
    const completedClasses = Array.from(new Set([
      ...(legacyData?.completedClasses ?? []),
      ...(newData?.completedClasses ?? []),
    ]));
    const passedPractices = Array.from(new Set([
      ...(legacyData?.passedPractices ?? []),
      ...(newData?.passedPractices ?? []),
    ]));

    return NextResponse.json({
      completedClasses,
      passedPractices,
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

    const studentName = user.profile.displayName || user.profile.name || user.email;
    const docId = buildStudentDocId(parsed.data.moduleId, studentName, user.email);
    const docRef = adminDb.collection('academic_progress').doc(docId);

    // Si el documento nuevo aún no existe, migrar progreso previo para mantener coherencia
    const currentDoc = await docRef.get();
    if (!currentDoc.exists) {
      const legacyDoc = await adminDb.collection('academic_progress').doc(`${user.uid}_${parsed.data.moduleId}`).get();
      if (legacyDoc.exists) {
        const legacyData = legacyDoc.data();
        await docRef.set({
          uid: user.uid,
          studentName,
          studentEmail: user.email,
          moduleId: parsed.data.moduleId,
          completedClasses: legacyData?.completedClasses ?? [],
          passedPractices: legacyData?.passedPractices ?? [],
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }
    }

    await docRef.set({
      uid: user.uid,
      studentName,
      studentEmail: user.email,
      moduleId: parsed.data.moduleId,
      completedClasses: fieldValue().arrayUnion(parsed.data.classId),
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'No autorizado.' }, { status: 401 }); }
}
