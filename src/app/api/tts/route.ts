import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser, assertAccountReady } from '@/lib/server-auth';
import { synthesize, TTS_MAX_CHARS } from '@/lib/tts';
import { clientAddress, consumeQuota } from '@/lib/rate-limit';
import { firmaValida } from '@/lib/tts-firma';

export const runtime = 'nodejs';

const schema = z.object({ text: z.string().trim().min(1).max(TTS_MAX_CHARS), firma: z.string().max(64).optional() });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Texto inválido.' }, { status: 400 });

  // Sin sesión solo se narran guiones firmados por el sitio (manuales públicos); con sesión, cualquier texto del aula.
  const firmado = firmaValida(parsed.data.text, parsed.data.firma);
  const user = firmado ? null : await getSessionUser().catch(() => null);
  if (!firmado && !user) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  if (user) { try { assertAccountReady(user); } catch { return NextResponse.json({ error: 'Completa la seguridad de tu cuenta.' }, { status: 401 }); } }
  try {
    const quota=await consumeQuota('tts',user?.uid ?? clientAddress(request),200,10*60_000);
    if (!quota.allowed) return NextResponse.json({error:'Demasiadas solicitudes de voz.'},{status:429,headers:{'Retry-After':String(quota.retryAfter)}});
    const audio = await synthesize(parsed.data.text);
    return new NextResponse(new Uint8Array(audio), {
      headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'private, max-age=86400' },
    });
  } catch {
    return NextResponse.json({ error: 'Servicio de voz no disponible.' }, { status: 503 });
  }
}
