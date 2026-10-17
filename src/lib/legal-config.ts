/**
 * Datos legales del responsable del tratamiento (LOPDP Ecuador).
 * ⚠️ COMPLETAR antes de producción los campos vacíos: las páginas legales muestran "[pendiente]" mientras falten.
 * Un solo lugar para que Privacidad, Términos, Cookies y el pie de página digan lo mismo.
 */
import { SITE_URL } from './site-url';

export const LEGAL = {
  marca: 'Finix Academy',
  razonSocial: process.env.NEXT_PUBLIC_LEGAL_NAME?.trim() || '',
  ruc: process.env.NEXT_PUBLIC_LEGAL_RUC?.trim() || '',
  direccion: process.env.NEXT_PUBLIC_LEGAL_ADDRESS?.trim() || '',
  ciudad: process.env.NEXT_PUBLIC_LEGAL_CITY?.trim() || '',
  correoPrivacidad: process.env.NEXT_PUBLIC_PRIVACY_EMAIL?.trim() || '',
  whatsapp: process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || '',
  sitio: SITE_URL,
  version: '2.0',
  vigenciaDesde: '16 de octubre de 2026',
} as const;

export const legalConfigured = Boolean(LEGAL.razonSocial && /^\d{13}$/.test(LEGAL.ruc) && LEGAL.direccion && LEGAL.ciudad && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(LEGAL.correoPrivacidad));

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
