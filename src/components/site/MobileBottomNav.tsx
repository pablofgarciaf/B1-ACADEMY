'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogIn, LogOut, MessageCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  MOBILE_NAV_DERECHA,
  MOBILE_NAV_IZQUIERDA,
  esRutaActiva,
  ocultaMobileNav,
  whatsappUrl,
  type MobileNavLink,
} from '@/lib/mobile-nav';

const CLASE_ENLACE = 'flex h-16 min-w-0 flex-col items-center justify-center gap-1 px-1 text-[10px] font-semibold leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-finix-blue';

function EnlaceInterno({ link, activo }: { link: MobileNavLink; activo: boolean }) {
  const Icono = link.icon;
  return (
    <Link
      href={link.href}
      aria-current={activo ? 'page' : undefined}
      className={`${CLASE_ENLACE} ${activo ? 'text-finix-blue dark:text-sky-400' : 'text-slate-500 dark:text-slate-400 hover:text-finix-blue dark:hover:text-sky-300'}`}
    >
      <Icono className="h-5 w-5" aria-hidden="true" />
      <span className="line-clamp-2 text-center">{link.label}</span>
    </Link>
  );
}

function BotonWhatsApp({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="relative flex h-16 min-w-0 flex-col items-center justify-end pb-1.5 text-[10px] font-semibold leading-tight text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-finix-blue dark:text-emerald-400"
    >
      <span className="absolute -top-6 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-600/30 ring-4 ring-white transition-transform active:scale-95 dark:ring-[#0b1320]">
        <MessageCircle className="h-7 w-7" aria-hidden="true" />
      </span>
      <span>WhatsApp</span>
    </a>
  );
}

/**
 * Primera columna: iniciar sesión si no hay usuario, cerrar sesión si lo hay.
 * No esperamos a AuthContext: si la carga se atasca, el botón de login debe seguir visible.
 */
function BotonSesion({ pathname, sesionActiva, onCerrar }: { pathname: string; sesionActiva: boolean; onCerrar: () => void }) {
  if (sesionActiva) {
    return (
      <button
        type="button"
        onClick={onCerrar}
        className={`${CLASE_ENLACE} text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300`}
      >
        <LogOut className="h-5 w-5" aria-hidden="true" />
        <span className="line-clamp-2 text-center">Cerrar sesión</span>
      </button>
    );
  }
  const activo = esRutaActiva(pathname, '/login');
  return (
    <Link
      href="/login"
      aria-current={activo ? 'page' : undefined}
      className={`${CLASE_ENLACE} ${activo ? 'text-finix-blue dark:text-sky-400' : 'text-slate-500 dark:text-slate-400 hover:text-finix-blue dark:hover:text-sky-300'}`}
    >
      <LogIn className="h-5 w-5" aria-hidden="true" />
      <span className="line-clamp-2 text-center">Iniciar sesión</span>
    </Link>
  );
}

/**
 * Barra inferior fija, solo en móvil (md:hidden). Se monta una vez en el layout raíz.
 * El espaciador final evita que el último contenido de la página quede tapado por la barra.
 */
export function MobileBottomNav() {
  const pathname = usePathname();
  const { userProfile, logout } = useAuth();
  if (ocultaMobileNav(pathname)) return null;

  const wa = whatsappUrl();
  const totalColumnas = 1 + MOBILE_NAV_IZQUIERDA.length + MOBILE_NAV_DERECHA.length + 1;

  return (
    <>
      <nav
        data-mobile-bottom-nav
        aria-label="Navegación principal"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1320]/95 md:hidden"
      >
        <div
          className="mx-auto grid max-w-md items-start px-2"
          style={{ gridTemplateColumns: `repeat(${totalColumnas}, minmax(0, 1fr))` }}
        >
          <BotonSesion
            pathname={pathname}
            sesionActiva={!!userProfile}
            onCerrar={() => void logout()}
          />
          {MOBILE_NAV_IZQUIERDA.map((link) => (
            <EnlaceInterno key={link.href} link={link} activo={esRutaActiva(pathname, link.href)} />
          ))}
          <BotonWhatsApp url={wa} />
          {MOBILE_NAV_DERECHA.map((link) => (
            <EnlaceInterno key={link.href} link={link} activo={esRutaActiva(pathname, link.href)} />
          ))}
        </div>
      </nav>
      <div aria-hidden="true" className="h-[calc(4rem+env(safe-area-inset-bottom))] md:hidden" />
    </>
  );
}
