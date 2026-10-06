import 'server-only';
import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Firma de textos narrables sin sesión (manuales públicos).
 * El servidor firma los guiones que el propio sitio publica; /api/tts solo acepta, sin sesión,
 * textos con firma válida. Así la voz no puede usarse como proxy abierto para cualquier texto.
 */
function secreto() {
  return process.env.TTS_SIGNING_SECRET || process.env.CERTIFICATE_SIGNING_SECRET || '';
}

function normalizar(texto: string) {
  return texto.trim().replace(/\s+/g, ' ');
}

export function firmarTexto(texto: string): string | undefined {
  const s = secreto();
  if (!s) return undefined;
  return createHmac('sha256', s).update(normalizar(texto)).digest('hex').slice(0, 32);
}

export function firmaValida(texto: string, firma: string | undefined): boolean {
  const esperada = firmarTexto(texto);
  if (!esperada || !firma || firma.length !== esperada.length) return false;
  return timingSafeEqual(Buffer.from(esperada), Buffer.from(firma));
}
