'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie, ShieldCheck } from 'lucide-react';
import { POLITICAS_VERSION } from '@/lib/legal-config';

/**
 * Consentimiento de cookies conforme a la LOPDP (Ecuador):
 * - Google Tag Manager / Analytics NO se carga hasta que el visitante acepta la analítica.
 * - "Rechazar" tiene la misma visibilidad que "Aceptar".
 * - Se guarda la decisión con versión de políticas y fecha (constancia del consentimiento).
 * - Retirar el consentimiento borra las cookies de analítica.
 */

const COOKIE = 'b1_consent';
const EVENTO_ABRIR = 'b1:configurar-cookies';

interface Decision { v: string; analitica: boolean; fecha: string }

function leerDecision(): Decision | null {
  const fila = document.cookie.split('; ').find((c) => c.startsWith(`${COOKIE}=`));
  if (!fila) return null;
  try {
    const d = JSON.parse(decodeURIComponent(fila.slice(COOKIE.length + 1))) as Decision;
    return d.v === POLITICAS_VERSION ? d : null; // políticas nuevas → se vuelve a preguntar
  } catch {
    return null;
  }
}

function guardarDecision(analitica: boolean) {
  const d: Decision = { v: POLITICAS_VERSION, analitica, fecha: new Date().toISOString() };
  const seguro = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(d))}; Max-Age=${60 * 60 * 24 * 365}; Path=/; SameSite=Lax${seguro}`;
}

function borrarCookiesAnalitica() {
  const dominio = window.location.hostname;
  const partes = dominio.split('.');
  const raiz = partes.length > 2 ? `.${partes.slice(-2).join('.')}` : dominio;
  document.cookie.split('; ').map((c) => c.split('=')[0]).filter((n) => n.startsWith('_ga')).forEach((n) => {
    for (const d of ['', `; Domain=${dominio}`, `; Domain=.${dominio}`, `; Domain=${raiz}`]) {
      document.cookie = `${n}=; Max-Age=0; Path=/${d}`;
    }
  });
}

declare global {
  interface Window { dataLayer?: unknown[] }
}

function cargarAnalitica(gtmId: string) {
  if (!/^GTM-[A-Z0-9]{4,}$/.test(gtmId) || gtmId === 'GTM-SAPACADEMY') return; // sin ID real no se carga nada
  if (document.getElementById('gtm-script')) return;
  window.dataLayer = window.dataLayer || [];
  // gtag oficial: Consent Mode exige que se empuje el objeto `arguments`, no un arreglo.
  function gtag(..._args: unknown[]) { window.dataLayer!.push(arguments); }
  // Consent Mode v2: concedido solo lo que el usuario aceptó (analítica); publicidad siempre denegada.
  gtag('consent', 'default', {
    analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  });
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const s = document.createElement('script');
  s.id = 'gtm-script';
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
  document.head.appendChild(s);
}

export default function CookieConsent({ gtmId }: { gtmId: string }) {
  const [visible, setVisible] = useState(false);
  const [configurando, setConfigurando] = useState(false);
  const [analitica, setAnalitica] = useState(false);

  useEffect(() => {
    const d = leerDecision();
    if (!d) setVisible(true);
    else {
      setAnalitica(d.analitica);
      if (d.analitica) cargarAnalitica(gtmId);
    }
    const abrir = () => {
      setAnalitica(leerDecision()?.analitica ?? false);
      setConfigurando(true);
      setVisible(true);
    };
    window.addEventListener(EVENTO_ABRIR, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR, abrir);
  }, [gtmId]);

  const decidir = useCallback((acepta: boolean) => {
    const antes = leerDecision()?.analitica ?? false;
    guardarDecision(acepta);
    setVisible(false);
    setConfigurando(false);
    if (acepta) cargarAnalitica(gtmId);
    else if (antes) {
      // Retiro del consentimiento: se borran las cookies y se recarga para descargar el script de analítica.
      borrarCookiesAnalitica();
      window.location.reload();
    }
  }, [gtmId]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookies-titulo"
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-5"
    >
      <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0e1620] shadow-2xl p-5 sm:p-6 text-slate-800 dark:text-slate-100">
        <div className="flex items-start gap-3">
          <Cookie className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="min-w-0">
            <h2 id="cookies-titulo" className="text-base font-bold">Tu privacidad en B1 Academy</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Usamos cookies necesarias para que inicies sesión. Con tu permiso, también usamos cookies de analítica de Google para mejorar el
              campus. No usamos cookies publicitarias. Más información en la{' '}
              <Link href="/cookies" className="text-sap-blue underline">Política de cookies</Link> y la{' '}
              <Link href="/privacidad" className="text-sap-blue underline">Política de privacidad</Link>.
            </p>
          </div>
        </div>

        {configurando && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 dark:bg-white/5 p-3">
              <div>
                <p className="text-sm font-semibold flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" aria-hidden="true" /> Necesarias</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Sesión, seguridad y preferencias. Siempre activas.</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Siempre</span>
            </div>
            <label className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 dark:bg-white/5 p-3 cursor-pointer">
              <div>
                <p className="text-sm font-semibold">Analítica</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Estadísticas de uso con Google Analytics.</p>
              </div>
              <input
                type="checkbox"
                checked={analitica}
                onChange={(e) => setAnalitica(e.target.checked)}
                className="w-5 h-5 accent-sap-blue"
                aria-label="Permitir cookies de analítica"
              />
            </label>
          </div>
        )}

        <div className="mt-5 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          {configurando ? (
            <button onClick={() => decidir(analitica)} className="px-5 py-2.5 rounded-xl bg-sap-blue text-white text-sm font-bold hover:opacity-90 active:scale-95 transition-all">
              Guardar mi elección
            </button>
          ) : (
            <>
              <button onClick={() => decidir(false)} className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-white/20 text-sm font-bold hover:bg-slate-100 dark:hover:bg-white/10 active:scale-95 transition-all">
                Rechazar
              </button>
              <button onClick={() => setConfigurando(true)} className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-white/20 text-sm font-bold hover:bg-slate-100 dark:hover:bg-white/10 active:scale-95 transition-all">
                Configurar
              </button>
              <button onClick={() => decidir(true)} className="px-5 py-2.5 rounded-xl bg-sap-blue text-white text-sm font-bold hover:opacity-90 active:scale-95 transition-all">
                Aceptar todo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** Botón para reabrir el panel de cookies (pie de página y Política de cookies). */
export function BotonConfigurarCookies({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(EVENTO_ABRIR))} className={className}>
      Configurar cookies
    </button>
  );
}
