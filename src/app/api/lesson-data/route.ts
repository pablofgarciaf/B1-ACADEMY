import { NextResponse } from 'next/server';
import { OFFICIAL_SYLLABUS } from '@/lib/curriculum-data';
import { requireBearerUser } from '@/lib/server-auth';
import { MODULO_INDUCCION, moduloInduccionCompleto } from '@/lib/requisitos-aula';
import { hasInitializedCompany } from '@/lib/company-server';
import LECCIONES_AULA from '@/content/aula/lecciones.json';

export async function GET(req: Request) {
  try {
    const actor = await requireBearerUser(req);
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');

    if (!classId) {
      return NextResponse.json({ error: 'Parámetro classId requerido' }, { status: 400 });
    }

    // Buscar la clase en el curriculum oficial
    let foundClass = null;
    let foundModule = null;
    for (const mod of OFFICIAL_SYLLABUS) {
      const cls = mod.classes.find(c => c.id === classId);
      if (cls) {
        foundClass = cls;
        foundModule = mod;
        break;
      }
    }

    if (!foundClass || !foundModule) {
      return NextResponse.json({ error: `Clase ${classId} no encontrada` }, { status: 404 });
    }

    // Paso 0 infranqueable: nadie puede acceder a ninguna clase si no ha inicializado su empresa B1 Center
    const tieneEmpresa = await hasInitializedCompany(actor.uid);
    if (!tieneEmpresa) {
      return NextResponse.json(
        { error: 'Debes crear tu empresa de práctica B1 Center en el Paso 0 antes de iniciar la clase.' },
        { status: 403 }
      );
    }

    // El Módulo 1 (inducción) es requisito de todos los demás (a excepción de la ruta comercial rápida tras crear la empresa)
    if (foundModule.id !== MODULO_INDUCCION && foundModule.id !== 'mod-ventas' && !(await moduloInduccionCompleto(actor.uid, actor.profile.role, actor.profile.displayName || actor.profile.name, actor.email))) {
      return NextResponse.json({ error: 'Completa primero el Módulo 1 para acceder a este módulo.' }, { status: 403 });
    }

    // Contenido publicado de Mi Aula (clases completas con prácticas evaluadas) tiene prioridad.
    const publicada = (LECCIONES_AULA as Record<string, { images: string[]; syncData: unknown[]; quizQuestions: unknown[]; references?: { title: string; url: string }[] }>)[classId];
    if (publicada) {
      return NextResponse.json({
        classId,
        title: foundClass.title,
        category: foundModule.badge,
        number: foundClass.number,
        totalSlides: publicada.syncData.length,
        images: publicada.images,
        syncData: publicada.syncData,
        quizQuestions: publicada.quizQuestions,
        references: publicada.references ?? [],
      });
    }

    // No publicar una clase motivacional o material antiguo de otro módulo como si fuera formación completa.
    return NextResponse.json({ error: 'Esta clase no tiene contenido publicado. Contacta con Academy.' }, { status: 503 });

  } catch {
    return NextResponse.json({ error: 'No autorizado o contenido no disponible.' }, { status: 401 });
  }
}
