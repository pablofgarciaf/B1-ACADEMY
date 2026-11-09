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

/** Número público de la academia (Ecuador, +593). NEXT_PUBLIC_CONTACT_PHONE, si existe, lo reemplaza. */
const NUMERO_POR_DEFECTO = '593983992549';

/**
 * URL de WhatsApp. Siempre devuelve un enlace: con número lleva al chat;
 * sin número abre WhatsApp sin destinatario para no dejar el botón muerto.
 */
export function whatsappUrl(): string {
  const numero = (process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '').replace(/\D/g, '') || NUMERO_POR_DEFECTO;
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
