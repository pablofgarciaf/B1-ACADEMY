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
      aria-label="Abrir a SAPI, tu asistente de SAP Business One (puedes arrastrarlo)"
      title="Toca para preguntar · Arrástrame si estorbo"
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
        // Al soltar se pega al borde lateral más cercano.
        const pegada = acotar({ x: pos.x + TAM / 2 < window.innerWidth / 2 ? MARGEN : window.innerWidth, y: pos.y });
        setPos(pegada);
        guardar(pegada);
      }}
      // Posición dinámica (coordenadas de arrastre): no es expresable con clases de Tailwind.
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

/** Dibujo del robot Sapi (reutilizado por el chat y por la guía del simulador). */
export function SapiCara({ tam, flotar = true }: { tam: number; flotar?: boolean }) {
  // Cada instancia necesita su propio id de degradado (puede haber varias en la página).
  const id = `sapi${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`; // sin ":" para que url(#id) sea válido
  return (
    <svg width={tam} height={tam} viewBox="0 0 64 64" className={flotar ? 'sapi-flotar' : ''} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC24D" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <ellipse cx="32" cy="60" rx="14" ry="3" fill="#000" opacity="0.18" />
      <line x1="32" y1="8" x2="32" y2="15" stroke="#0B3D91" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="7" r="4" fill="#4C9BE8" className="sapi-antena" />
      <rect x="9" y="14" width="46" height="40" rx="15" fill={`url(#${id})`} stroke="#B45309" strokeWidth="1.5" />
      <rect x="15" y="22" width="34" height="20" rx="9" fill="#0B3D91" />
      <g className="sapi-ojos">
        <ellipse cx="25" cy="32" rx="4" ry="4.5" fill="#7DD3FC" />
        <ellipse cx="39" cy="32" rx="4" ry="4.5" fill="#7DD3FC" />
        <circle cx="26.2" cy="30.6" r="1.3" fill="#fff" />
        <circle cx="40.2" cy="30.6" r="1.3" fill="#fff" />
      </g>
      <path d="M26 47 Q32 51 38 47" fill="none" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />
      <circle cx="15" cy="45" r="2.6" fill="#FB7185" opacity="0.6" />
      <circle cx="49" cy="45" r="2.6" fill="#FB7185" opacity="0.6" />
    </svg>
  );
}
