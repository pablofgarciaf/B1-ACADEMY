import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb, fieldValue } from '@/lib/firebase-admin';
import { requireBearerUser } from '@/lib/server-auth';
import { getModuleById } from '@/lib/curriculum-data';
import { coincide, practicaAprobada } from '@/lib/practice-check';
import { camposEsperados, clavePractica } from '@/lib/practice-registry';

/**
 * Califica en el servidor una práctica del simulador de Mi Aula.
 * El navegador envía lo que escribió el estudiante; aquí se compara contra la clase publicada,
 * así el certificado solo cuenta prácticas realmente resueltas.
 */
const schema = z.object({
  moduleId: z.string().min(1).max(80),
  classId: z.string().min(1).max(120),
  slideIndex: z.number().int().min(1).max(200),
  valores: z.array(z.string().max(200)).min(1).max(12),
  intentos: z.number().int().min(1).max(500),
  vioSolucion: z.boolean(),
});

export async function POST(request: Request) {
  let uid: string;
  try {
    uid = (await requireBearerUser(request)).uid;
  } catch {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 });
  const { moduleId, classId, slideIndex, valores, intentos, vioSolucion } = parsed.data;

  if (!getModuleById(moduleId)?.classes.some((c) => c.id === classId)) {
    return NextResponse.json({ error: 'Clase inválida.' }, { status: 400 });
  }
  const campos = camposEsperados(classId, slideIndex);
  if (!campos || campos.length !== valores.length) {
    return NextResponse.json({ error: 'Práctica inválida.' }, { status: 400 });
  }

  const correctos = campos.filter((c, i) => coincide(valores[i], c.valor)).length;
  const aprobada = practicaAprobada(correctos, campos.length, { valores, intentos, vioSolucion });

  try {
    if (aprobada) {
      await adminDb.collection('academic_progress').doc(`${uid}_${moduleId}`).set({
        uid,
        moduleId,
        passedPractices: fieldValue().arrayUnion(clavePractica(classId, slideIndex)),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }
  } catch {
    return NextResponse.json({ error: 'No se pudo guardar la práctica.' }, { status: 503 });
  }
  return NextResponse.json({ aprobada, correctos, total: campos.length });
}
