import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb, fieldValue } from '@/lib/firebase-admin';
import { requireBearerUser } from '@/lib/server-auth';
import { getModuleById } from '@/lib/curriculum-data';
import { coincide, practicaAprobada } from '@/lib/practice-check';
import { camposEsperados, clavePractica } from '@/lib/practice-registry';
import { readCompany } from '@/lib/company-server';

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
  conectada: z.boolean().optional(),
});

/** ¿La empresa del estudiante tiene algún registro creado o modificado por él en los últimos 20 minutos? */
async function registroReciente(uid: string): Promise<boolean> {
  const empresa = await readCompany(uid);
  const desde = Date.now() - 20 * 60 * 1000;
  return Object.values(empresa).some((valor) =>
    Array.isArray(valor) && valor.some((r) => {
      const e = r as { createdBy?: string; updatedAt?: string; createdAt?: string };
      return e.createdBy === uid && Date.parse(e.updatedAt ?? e.createdAt ?? '') >= desde;
    }),
  );
}

export async function POST(request: Request) {
  let uid: string;
  try {
    uid = (await requireBearerUser(request)).uid;
  } catch {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 });
  const { moduleId, classId, slideIndex, valores, intentos, vioSolucion, conectada = false } = parsed.data;

  if (!getModuleById(moduleId)?.classes.some((c) => c.id === classId)) {
    return NextResponse.json({ error: 'Clase inválida.' }, { status: 400 });
  }
  const campos = camposEsperados(classId, slideIndex);
  if (!campos || (!conectada && campos.length !== valores.length)) {
    return NextResponse.json({ error: 'Práctica inválida.' }, { status: 400 });
  }

  let correctos: number;
  let total = campos.length;
  if (conectada) {
    // Práctica en la empresa del estudiante: no se cree al navegador; se verifica en Supabase que haya
    // un registro guardado por él en los últimos 20 minutos.
    total = 1;
    correctos = (await registroReciente(uid)) ? 1 : 0;
  } else {
    correctos = campos.filter((c, i) => coincide(valores[i], c.valor)).length;
  }
  const aprobada = practicaAprobada(correctos, total, { valores, intentos, vioSolucion, conectada });

  try {
    // Registro de cada práctica completada (aprobada o no): qué escribió el estudiante y cuándo.
    // Una ficha por práctica, que se actualiza en cada intento: queda guardado aunque cambie de dispositivo.
    await adminDb.collection('practice_records').doc(`${uid}_${classId}_${slideIndex}`).set({
      uid, moduleId, classId, slideIndex,
      campos: conectada
        ? valores.map((v) => ({ etiqueta: 'registro en la empresa', valor: v }))
        : campos.map((c, i) => ({ etiqueta: c.etiqueta, valor: valores[i] ?? '' })),
      correctos, total, aprobada, intentos, vioSolucion, conectada,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
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
  return NextResponse.json({ aprobada, correctos, total });
}
