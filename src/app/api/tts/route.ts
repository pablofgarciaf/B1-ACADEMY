import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/server-auth';
import { synthesize, TTS_MAX_CHARS } from '@/lib/tts';

export const runtime = 'nodejs';

const schema = z.object({ text: z.string().trim().min(1).max(TTS_MAX_CHARS) });

// Límite por estudiante: el servicio de voz es externo y no debe usarse como proxy abierto.
const WINDOW_MS = 10 * 60_000;
const MAX_REQUESTS = 200;
const usage = new Map<string, { count: number; resetAt: number }>();

function allow(uid: string) {
  const now = Date.now();
  const current = usage.get(uid);
  if (!current || current.resetAt <= now) {
    usage.set(uid, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (current.count >= MAX_REQUESTS) return false;
  current.count += 1;
  return true;
}

export async function POST(request: Request) {
  const user = await getSessionUser().catch(() => null);
  if (!user) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  if (!allow(user.uid)) return NextResponse.json({ error: 'Demasiadas solicitudes de voz.' }, { status: 429 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Texto inválido.' }, { status: 400 });

  try {
    const audio = await synthesize(parsed.data.text);
    return new NextResponse(new Uint8Array(audio), {
      headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'private, max-age=86400' },
    });
  } catch {
    return NextResponse.json({ error: 'Servicio de voz no disponible.' }, { status: 503 });
  }
}
