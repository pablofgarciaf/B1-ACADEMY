import { BookOpen, Briefcase, GraduationCap, type LucideIcon } from 'lucide-react';

/**
 * Barra de navegación inferior para celulares.
 * Orden visual: [Iniciar/Cerrar sesión, Mi Aula] [WhatsApp centro] [Manuales, Bolsa de empleo].
 * El primer botón de sesión lo resuelve el componente según el estado de autenticación.
 */
export type MobileNavLink = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const MOBILE_NAV_IZQUIERDA: MobileNavLink[] = [
  { label: 'Mi Aula', href: '/mi-aula', icon: GraduationCap },
];

export const MOBILE_NAV_DERECHA: MobileNavLink[] = [
  { label: 'Manuales', href: '/manuales', icon: BookOpen },
  { label: 'Bolsa de empleo', href: '/bolsa-empleo', icon: Briefcase },
];

const MENSAJE_WHATSAPP = 'Hola, quiero información sobre B1 Academy.';

/**
 * URL de WhatsApp con el número público configurado en NEXT_PUBLIC_CONTACT_PHONE.
 * Devuelve null si no hay un número válido: no mostramos un botón que lleve a un número falso.
 */
export function whatsappUrl(): string | null {
  const numero = (process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '').replace(/\D/g, '');
  if (numero.length < 7) return null;
  return `https://wa.me/${numero}?text=${encodeURIComponent(MENSAJE_WHATSAPP)}`;
}

/**
 * TODO(human): decide qué pantallas ocultan la barra en móvil.
 * La lista actual es una propuesta: pantallas a pantalla completa, formularios y exámenes.
 * Considera si /login debe mostrarla, si las lecciones con video de Mi Aula deben tenerla, y si /simulador la necesita.
 */
const RUTAS_SIN_BARRA: RegExp[] = [
  /^\/simulador(\/|$)/,
  /^\/admin(\/|$)/,
  /^\/login(\/|$)/,
  /^\/change-password(\/|$)/,
  /^\/manuales\/[^/]+/,
  /^\/mi-aula\/[^/]+\/oral-exam(\/|$)/,
];

export function ocultaMobileNav(pathname: string): boolean {
  return RUTAS_SIN_BARRA.some((patron) => patron.test(pathname));
}

export function esRutaActiva(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}
