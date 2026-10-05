import 'server-only';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

/** Voz oficial de SAP Academy: la misma de los videos de los manuales (manual 1.1). */
export const ACADEMY_VOICE = 'es-MX-JorgeNeural';
export const TTS_MAX_CHARS = 1500;

const CACHE_LIMIT = 400;
const cache = new Map<string, Buffer>();
const inflight = new Map<string, Promise<Buffer>>();

function remember(key: string, audio: Buffer) {
  cache.delete(key);
  cache.set(key, audio);
  if (cache.size > CACHE_LIMIT) cache.delete(cache.keys().next().value as string);
}

async function generate(text: string): Promise<Buffer> {
  const tts = new MsEdgeTTS();
  try {
    await tts.setMetadata(ACADEMY_VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const { audioStream } = tts.toStream(text);
    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) chunks.push(chunk as Buffer);
    const audio = Buffer.concat(chunks);
    if (audio.length === 0) throw new Error('El servicio de voz devolvió audio vacío.');
    return audio;
  } finally {
    tts.close();
  }
}

/** MP3 con la voz de Jorge. Cachea en memoria y une peticiones simultáneas del mismo texto. */
export async function synthesize(text: string): Promise<Buffer> {
  const key = text.trim();
  const hit = cache.get(key);
  if (hit) {
    remember(key, hit);
    return hit;
  }
  const pending = inflight.get(key);
  if (pending) return pending;

  const job = (async () => {
    let lastError: unknown;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const audio = await generate(key);
        remember(key, audio);
        return audio;
      } catch (error) {
        lastError = error;
        await new Promise((resolve) => setTimeout(resolve, 600 * attempt));
      }
    }
    throw lastError;
  })().finally(() => inflight.delete(key));

  inflight.set(key, job);
  return job;
}
