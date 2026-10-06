/**
 * Datos legales del responsable del tratamiento (LOPDP Ecuador).
 * ⚠️ COMPLETAR antes de producción los campos vacíos: las páginas legales muestran "[pendiente]" mientras falten.
 * Un solo lugar para que Privacidad, Términos, Cookies y el pie de página digan lo mismo.
 */
export const LEGAL = {
  marca: 'B1 Academy',
  razonSocial: '', // COMPLETAR: nombre completo de la persona natural o razón social de la empresa responsable
  ruc: '', // COMPLETAR: RUC del responsable
  direccion: '', // COMPLETAR: dirección física en Ecuador
  ciudad: '', // COMPLETAR: ciudad (define la jurisdicción de los Términos), p. ej. Quito
  correoPrivacidad: '', // COMPLETAR: correo para ejercer derechos de datos personales
  whatsapp: '+593 98 399 2549',
  sitio: 'https://b1-academy.vercel.app',
  version: '1.0',
  vigenciaDesde: '5 de octubre de 2026',
} as const;

/** Versión de las políticas que el usuario acepta; si cambia, se vuelve a pedir el consentimiento. */
export const POLITICAS_VERSION = `${LEGAL.version}-2026-10`;

export function dato(valor: string): string {
  return valor.trim() || '[pendiente]';
}

/** Correo como entidades HTML (protección anti-scraping exigida por el estándar del proyecto). */
export function correoOfuscado(correo: string): string {
  return Array.from(correo).map((c) => `&#${c.codePointAt(0)};`).join('');
}
