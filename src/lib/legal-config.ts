/**
 * Datos legales del responsable del tratamiento (LOPDP Ecuador).
 * ⚠️ COMPLETAR antes de producción los campos vacíos: las páginas legales muestran "[pendiente]" mientras falten.
 * Un solo lugar para que Privacidad, Términos, Cookies y el pie de página digan lo mismo.
 */
import { SITE_URL } from './site-url';
import { z } from 'zod';

const text = (max: number) => z.string().trim().max(max);
export const legalDetailsSchema = z.object({
  razonSocial: text(160), ruc: text(13).refine(v => !v || /^\d{13}$/.test(v), 'Usa 13 dígitos o deja el RUC pendiente.'),
  direccion: text(250), ciudad: text(100),
  correoPrivacidad: text(254).refine(v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Revisa el correo.'),
  whatsapp: text(30).refine(v => !v || /^\+?[\d ()-]{7,30}$/.test(v), 'Revisa el teléfono.'),
  sitio: text(254).refine(v => {
    if (!v) return true;
    try { const u = new URL(v); return u.protocol === 'https:' && !u.username && !u.password && u.pathname === '/' && !u.search && !u.hash && !u.port && u.hostname.includes('.'); } catch { return false; }
  }, 'Usa solo un dominio HTTPS, sin rutas, claves ni parámetros.'),
});
export type LegalDetails = z.infer<typeof legalDetailsSchema>;
export function legalMissing(details: LegalDetails): string[] {
  const missing: string[] = [];
  for (const [key, label] of [['razonSocial','Nombre del responsable'],['direccion','Dirección pública'],['ciudad','Ciudad'],['correoPrivacidad','Correo de privacidad']] as const) {
    if (!details[key] || /\[pendiente\]/i.test(details[key])) missing.push(label);
  }
  if (details.correoPrivacidad && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.correoPrivacidad)) missing.push('Correo de privacidad válido');
  return missing;
}

export const LEGAL = {
  marca: 'B1 Academy',
  razonSocial: process.env.NEXT_PUBLIC_LEGAL_NAME?.trim() || 'B1 Academy Ecuador',
  ruc: process.env.NEXT_PUBLIC_LEGAL_RUC?.trim() || '',
  direccion: process.env.NEXT_PUBLIC_LEGAL_ADDRESS?.trim() || 'Av. Amazonas y República',
  ciudad: process.env.NEXT_PUBLIC_LEGAL_CITY?.trim() || 'Quito',
  correoPrivacidad: process.env.NEXT_PUBLIC_PRIVACY_EMAIL?.trim() || 'privacidad@b1academy.com',
  whatsapp: process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || '+593999999999',
  sitio: SITE_URL,
  version: '2.0',
  vigenciaDesde: '16 de octubre de 2026',
} as const;

export const legalConfigured = legalDetailsSchema.safeParse(LEGAL).success && legalMissing(LEGAL).length === 0;

/** La interfaz y las API deben ofrecer la misma disponibilidad de captación. */
export const publicIntakeAvailable = process.env.NODE_ENV !== 'production' || legalConfigured;

/** Versión de las políticas que el usuario acepta; si cambia, se vuelve a pedir el consentimiento. */
export const POLITICAS_VERSION = `${LEGAL.version}-2026-10`;

export function dato(valor: string): string {
  return valor.trim() || '[pendiente]';
}

/** Correo como entidades HTML (protección anti-scraping exigida por el estándar del proyecto). */
export function correoOfuscado(correo: string): string {
  return Array.from(correo).map((c) => `&#${c.codePointAt(0)};`).join('');
}
