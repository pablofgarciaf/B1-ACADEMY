import 'server-only';
import { createHmac, hkdfSync, timingSafeEqual } from 'crypto';

/**
 * Firma de textos narrables sin sesión (manuales públicos).
 * El servidor firma los guiones que el propio sitio publica; /api/tts solo acepta, sin sesión,
 * textos con firma válida. Así la voz no puede usarse como proxy abierto para cualquier texto.
 */
/** Claves posibles, en orden de preferencia. */
function secretos(): string[] {
  const explicit = [process.env.TTS_SIGNING_SECRET, process.env.CERTIFICATE_SIGNING_SECRET]
    .filter((s): s is string => !!s);
  if (explicit.length) return explicit;
  // Clave con propósito separado y estable entre compilación y servidor.
  // Compatibilidad con el alojamiento existente; no se transmite la credencial.
  const adminKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n').trim();
  return adminKey ? [Buffer.from(hkdfSync('sha256', adminKey, 'finix-academy', 'public-narration-signing/v1', 32)).toString('hex')] : [];
}

function normalizar(texto: string) {
  return texto.trim().replace(/\s+/g, ' ');
}

function hmac(secreto: string, texto: string) {
  return createHmac('sha256', secreto).update(normalizar(texto)).digest('hex').slice(0, 32);
}

export function firmarTexto(texto: string): string | undefined {
  const [s] = secretos();
  return s ? hmac(s, texto) : undefined;
}

/**
 * Acepta la firma hecha con cualquiera de las claves configuradas: la página se firma al compilar y
 * /api/tts valida en ejecución; si alguien añade una variable en Vercel sin recompilar, la voz no se cae.
 */
export function firmaValida(texto: string, firma: string | undefined): boolean {
  if (!firma || !/^[a-f0-9]{32}$/.test(firma)) return false;
  return secretos().some((s) => timingSafeEqual(Buffer.from(hmac(s, texto)), Buffer.from(firma)));
}
