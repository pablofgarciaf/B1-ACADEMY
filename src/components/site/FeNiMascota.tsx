'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * FeNi AI (Fénix Rojo), la mascota inteligente de Finix ERP: se arrastra, se pega al borde más cercano y recuerda su posición.
 */
const TAM = 60;
const MARGEN = 14;
const CLAVE = 'feni_pos_v1';

type Pos = { x: number; y: number };

function posInicial(pathname: string): Pos {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const enAula = pathname.startsWith('/mi-aula/');
  return { x: enAula ? MARGEN : w - TAM - MARGEN, y: h - TAM - MARGEN - (enAula ? 8 : 0) };
}

function acotar(p: Pos): Pos {
  return {
    x: Math.min(Math.max(MARGEN, p.x), window.innerWidth - TAM - MARGEN),
    y: Math.min(Math.max(MARGEN + 60, p.y), window.innerHeight - TAM - MARGEN),
  };
}

export default function FeNiMascota({ onAbrir }: { onAbrir: (lado: 'izq' | 'der') => void }) {
  const pathname = usePathname();
  const [pos, setPos] = useState<Pos | null>(null);
  const [arrastrando, setArrastrando] = useState(false);
  const inicio = useRef<{ px: number; py: number; x: number; y: number; movido: boolean } | null>(null);

  useEffect(() => {
    let guardada: Record<string, Pos> = {};
    try { guardada = JSON.parse(localStorage.getItem(CLAVE) ?? '{}'); } catch { /* sin almacenamiento */ }
    const zona = pathname.startsWith('/mi-aula/') ? 'aula' : 'sitio';
    setPos(acotar(guardada[zona] ?? posInicial(pathname)));
    const alRedimensionar = () => setPos((p) => (p ? acotar(p) : p));
    window.addEventListener('resize', alRedimensionar);
    return () => window.removeEventListener('resize', alRedimensionar);
  }, [pathname]);

  const guardar = useCallback((p: Pos) => {
    const zona = pathname.startsWith('/mi-aula/') ? 'aula' : 'sitio';
    try {
      const actual = JSON.parse(localStorage.getItem(CLAVE) ?? '{}') as Record<string, Pos>;
      localStorage.setItem(CLAVE, JSON.stringify({ ...actual, [zona]: p }));
    } catch { /* sin almacenamiento */ }
  }, [pathname]);

  const iniciar = (cx: number, cy: number) => {
    if (!pos) return;
    inicio.current = { px: cx, py: cy, x: pos.x, y: pos.y, movido: false };
    setArrastrando(true);
  };

  const mover = useCallback((cx: number, cy: number) => {
    const ini = inicio.current;
    if (!ini) return;
    const dx = cx - ini.px;
    const dy = cy - ini.py;
    if (Math.hypot(dx, dy) > 4) ini.movido = true;
    setPos(acotar({ x: ini.x + dx, y: ini.y + dy }));
  }, []);

  const soltar = useCallback(() => {
    if (!inicio.current) return;
    const fueClick = !inicio.current.movido;
    inicio.current = null;
    setArrastrando(false);
    setPos((actual) => {
      if (!actual) return actual;
      const pegado: Pos = {
        x: actual.x + TAM / 2 < window.innerWidth / 2 ? MARGEN : window.innerWidth - TAM - MARGEN,
        y: actual.y,
      };
      guardar(pegado);
      if (fueClick) onAbrir(pegado.x < window.innerWidth / 2 ? 'izq' : 'der');
      return pegado;
    });
  }, [guardar, onAbrir]);

  useEffect(() => {
    if (!arrastrando) return;
    const onMove = (e: MouseEvent) => mover(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) mover(t.clientX, t.clientY);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', soltar);
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchend', soltar);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', soltar);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchend', soltar);
    };
  }, [arrastrando, mover, soltar]);

  if (!pos) return null;

  return (
    <button
      type="button"
      data-testid="feni-mascota"
      aria-label="Abrir asistente inteligente FeNi AI"
      onMouseDown={(e) => { e.preventDefault(); iniciar(e.clientX, e.clientY); }}
      onTouchStart={(e) => { const t = e.touches[0]; if (t) iniciar(t.clientX, t.clientY); }}
      className="fixed z-40 touch-none select-none rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 active:scale-95"
      style={{ left: `${pos.x}px`, top: `${pos.y}px`, width: `${TAM}px`, height: `${TAM}px` }}
    >
      <FeNiCara tam={TAM} flotar={!arrastrando} />
    </button>
  );
}

// Re-exportamos para compatibilidad con código existente
export { FeNiMascota as FiniMascota, FeNiMascota as SapiMascota, FeNiMascota as FeniMascota };

/** Dibujo de FeNi (Fénix Rojo de Inteligencia ERP Finix). */
export function FeNiCara({ tam, flotar = true }: { tam: number; flotar?: boolean }) {
  const id = `feni${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <svg width={tam} height={tam} viewBox="0 0 64 64" className={flotar ? 'sapi-flotar' : ''} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EF4444" />
          <stop offset="0.5" stopColor="#DC2626" />
          <stop offset="1" stopColor="#991B1B" />
        </linearGradient>
        <linearGradient id={`${id}-wing`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F59E0B" />
          <stop offset="0.6" stopColor="#EF4444" />
          <stop offset="1" stopColor="#B91C1C" />
        </linearGradient>
        <linearGradient id={`${id}-crest`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#DC2626" />
          <stop offset="0.5" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#FDE047" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#EF4444" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* Sombra suave */}
      <ellipse cx="32" cy="59" rx="16" ry="3.5" fill="#000" opacity="0.3" />

      {/* Cresta de fuego del Fénix */}
      <path d="M 32 8 C 30 2, 24 4, 26 12 C 28 10, 31 11, 32 14 Z" fill={`url(#${id}-crest)`} />
      <path d="M 32 6 C 34 -1, 40 1, 38 10 C 36 8, 33 9, 32 14 Z" fill={`url(#${id}-crest)`} />
      <path d="M 32 5 C 31 -3, 33 -3, 32 5 Z" fill="#FEF08A" />

      {/* Cuerpo esférico del Fénix */}
      <circle cx="32" cy="34" r="23" fill={`url(#${id}-body)`} filter={`url(#${id}-glow)`} />

      {/* Alas laterales de fuego */}
      <path d="M 11 34 C 7 30, 4 38, 8 45 C 11 40, 12 36, 11 34 Z" fill={`url(#${id}-wing)`} />
      <path d="M 53 34 C 57 30, 60 38, 56 45 C 53 40, 52 36, 53 34 Z" fill={`url(#${id}-wing)`} />

      {/* Pecho dorado resplandeciente */}
      <ellipse cx="32" cy="39" rx="13" ry="14" fill="#F59E0B" opacity="0.9" />
      <ellipse cx="32" cy="39" rx="9" ry="10" fill="#FDE047" opacity="0.85" />

      {/* Ojos grandes expresivos de Fénix */}
      <ellipse cx="24" cy="29" rx="5" ry="6.5" fill="#FFFFFF" />
      <ellipse cx="40" cy="29" rx="5" ry="6.5" fill="#FFFFFF" />
      <circle cx="25" cy="29" r="3.2" fill="#1C1917" />
      <circle cx="39" cy="29" r="3.2" fill="#1C1917" />
      <circle cx="23.5" cy="27" r="1.3" fill="#FFFFFF" />
      <circle cx="37.5" cy="27" r="1.3" fill="#FFFFFF" />

      {/* Pico de ave dorado / naranja */}
      <polygon points="32,32 29,37 35,37" fill="#F97316" />
      <polygon points="32,38 30,37 34,37" fill="#EA580C" />

      {/* Mejillas ruborizadas */}
      <circle cx="18" cy="36" r="3" fill="#FCA5A5" opacity="0.6" />
      <circle cx="46" cy="36" r="3" fill="#FCA5A5" opacity="0.6" />

      {/* Pluma de la cola inferior */}
      <path d="M 32 57 C 30 63, 27 61, 29 55 Z" fill="#DC2626" />
      <path d="M 32 57 C 34 63, 37 61, 35 55 Z" fill="#DC2626" />
      <path d="M 32 57 C 31 64, 33 64, 32 57 Z" fill="#F59E0B" />
    </svg>
  );
}

export { FeNiCara as FiniCara };
