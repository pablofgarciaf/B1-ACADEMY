'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * SAPI, la mascota del asistente: se arrastra, se pega al borde más cercano y recuerda su posición.
 * En Mi Aula arranca abajo a la izquierda (sobre el temario) para no tapar el simulador ni "Añadir".
 */
const TAM = 60;
const MARGEN = 14;
const CLAVE = 'sapi_pos_v1';

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

export default function SapiMascota({ onAbrir }: { onAbrir: (lado: 'izq' | 'der') => void }) {
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
    } catch { /* sin almacenamiento: la posición vale solo para esta visita */ }
  }, [pathname]);

  if (!pos) return null;

  return (
    <button
      type="button"
      aria-label="Abrir a @Fini AI, tu asistente Fénix de SAP Business One (puedes arrastrarlo)"
      title="Toca para consultar a @Fini AI · Arrástrame si estorbo"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        inicio.current = { px: e.clientX, py: e.clientY, x: pos.x, y: pos.y, movido: false };
      }}
      onPointerMove={(e) => {
        const i = inicio.current;
        if (!i) return;
        const dx = e.clientX - i.px;
        const dy = e.clientY - i.py;
        if (!i.movido && Math.hypot(dx, dy) < 6) return;
        i.movido = true;
        setArrastrando(true);
        setPos(acotar({ x: i.x + dx, y: i.y + dy }));
      }}
      onPointerUp={() => {
        const i = inicio.current;
        inicio.current = null;
        setArrastrando(false);
        if (!i?.movido) { onAbrir(pos.x + TAM / 2 < window.innerWidth / 2 ? 'izq' : 'der'); return; }
        const pegada = acotar({ x: pos.x + TAM / 2 < window.innerWidth / 2 ? MARGEN : window.innerWidth, y: pos.y });
        setPos(pegada);
        guardar(pegada);
      }}
      style={{ left: pos.x, top: pos.y }}
      className={`fixed z-50 touch-none select-none rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/60 ${
        arrastrando ? 'cursor-grabbing scale-110' : 'cursor-grab transition-[left,top] duration-300 ease-out hover:scale-105'
      }`}
    >
      <SapiCara tam={TAM} flotar={!arrastrando} />
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" aria-hidden="true" />
    </button>
  );
}

/** Dibujo de Fini (Fénix Rojo de Inteligencia ERP). */
export function SapiCara({ tam, flotar = true }: { tam: number; flotar?: boolean }) {
  const id = `fini${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
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
          <stop offset="0" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#FDE047" />
        </linearGradient>
      </defs>
      {/* Sombra */}
      <ellipse cx="32" cy="60" rx="14" ry="3" fill="#000" opacity="0.2" />
      {/* Cresta Fénix de Fuego */}
      <path d="M32 4 C28 10, 24 6, 26 16 C29 12, 32 14, 32 16 C32 14, 35 12, 38 16 C40 6, 36 10, 32 4 Z" fill={`url(#${id}-crest)`} />
      {/* Cuerpo Principal Fénix */}
      <circle cx="32" cy="34" r="20" fill={`url(#${id}-body)`} stroke="#7F1D1D" strokeWidth="1.5" />
      {/* Alas del Fénix */}
      <path d="M14 34 C6 24, 4 36, 12 44 C16 42, 16 38, 14 34 Z" fill={`url(#${id}-wing)`} />
      <path d="M50 34 C58 24, 60 36, 52 44 C48 42, 48 38, 50 34 Z" fill={`url(#${id}-wing)`} />
      {/* Pico de Oro */}
      <polygon points="32,35 27,42 37,42" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
      {/* Ojos Brillantes */}
      <ellipse cx="24" cy="30" rx="3.5" ry="4" fill="#FFFFFF" />
      <ellipse cx="40" cy="30" rx="3.5" ry="4" fill="#FFFFFF" />
      <circle cx="24.5" cy="30" r="2" fill="#0F172A" />
      <circle cx="40.5" cy="30" r="2" fill="#0F172A" />
      <circle cx="25.5" cy="28.8" r="0.8" fill="#FFF" />
      <circle cx="41.5" cy="28.8" r="0.8" fill="#FFF" />
      {/* Pecho dorado */}
      <path d="M26 44 C28 48, 36 48, 38 44 C36 50, 28 50, 26 44 Z" fill="#F59E0B" opacity="0.9" />
    </svg>
  );
}
