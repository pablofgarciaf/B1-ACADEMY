'use client';
/**
 * SapGuiSimulatorView — Classic SAP GUI (S/4HANA / ECC) visual simulator
 * Uses real KB screenshots with the unmistakable grey Windows-era SAP chrome.
 */
import React, { useState } from 'react';
import type { SimuladorSAPProps } from '@/types/kb-simulator';

// ── Transaction code map ──────────────────────────────────────────────────────
const TCODE: Record<string, string> = {
  '00_Navegacion':        'S000',
  '01_Ventas':            'VA01',
  '02_Compras':           'ME21N',
  '03_Bancos':            'FF7A',
  '04_Finanzas':          'FB50',
  '05_Maestros':          'MM01',
  '06_Produccion':        'CO01',
  '07_MRP':               'MD01',
  '08_CRM_Oportunidades': 'CRM_UI',
  '09_Servicios':         'IW31',
  '10_Proyectos':         'CJ20N',
  '11_DTW_Migracion':     'SM30',
  '12_Query_Manager':     'SQ01',
  '13_Autorizaciones':    'SU01',
};

// ── Inline SVG: classic Windows-style toolbar button ─────────────────────────
function TbarBtn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <button
      title={title}
      className="flex flex-col items-center justify-center w-8 h-8 border border-t-white border-l-white border-b-[#808080] border-r-[#808080] bg-[#D4D0C8] hover:bg-[#E4E0D8] active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white text-[10px] leading-none select-none"
      style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}
    >
      {children}
    </button>
  );
}

// ── SAP toolbar icon sets ────────────────────────────────────────────────────
const TOOLBAR_ICONS = [
  { title: 'Anterior (F3)', icon: '◀' },
  { title: 'Salir (Shift+F3)', icon: '✕' },
  { title: 'Cancelar (F12)', icon: '⊗' },
  { title: 'Guardar (Ctrl+S)', icon: '💾' },
  { title: 'Imprimir (Ctrl+P)', icon: '🖨' },
  { title: 'Buscar (Ctrl+F)', icon: '🔍' },
  { title: 'Nuevo (F5)', icon: '📄' },
];

export default function SapGuiSimulatorView({
  cards,
  proceso,
  procesoNombre,
  step,
  onStep,
  onComplete,
}: SimuladorSAPProps) {
  const [guideOpen, setGuideOpen] = useState(true);
  const [tcodeInput, setTcodeInput] = useState(TCODE[proceso] ?? 'S000');

  if (!cards.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ECE9D8]">
        <p className="text-[#333]" style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}>
          No hay pantallas disponibles para este proceso.
        </p>
      </div>
    );
  }

  const card    = cards[Math.min(step, cards.length - 1)];
  const total   = cards.length;
  const tcode   = TCODE[proceso] ?? 'S000';
  const imgUrl  = `/api/kb/image?p=${encodeURIComponent(card.archivo)}`;
  const guideLines = card.texto.slice(0, 8);

  const goNext = () => {
    if (step < total - 1) onStep(step + 1);
    else onComplete();
  };
  const goPrev = () => { if (step > 0) onStep(step - 1); };

  // Truncate step title for sidebar
  const shortTitle = (t: string, n = 30) => t.length > n ? t.slice(0, n) + '…' : t;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#ECE9D8', fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '12px' }}
    >
      {/* ── Title Bar — auténtico SAP GUI 7.x Windows-chrome ─────────────── */}
      <div
        className="flex items-center justify-between px-1 select-none shrink-0"
        style={{
          background: 'linear-gradient(180deg,#4A90D9 0%,#2E6DBD 40%,#1A5AAF 100%)',
          height: '22px',
          borderBottom: '1px solid #1246A0',
        }}
      >
        {/* Left: 16×16 SAP logo + app title */}
        <div className="flex items-center gap-1.5 min-w-0">
          {/* SAP diamond icon (genuine 16-pixel badge) */}
          <svg width="16" height="16" viewBox="0 0 16 16" className="shrink-0">
            <rect width="16" height="16" rx="2" fill="#0070D2" />
            <text x="8" y="12" textAnchor="middle" fontFamily="Arial" fontWeight="900" fontSize="8" fill="#fff" letterSpacing="0">SAP</text>
          </svg>
          <span
            className="text-white text-[11px] font-normal truncate"
            style={{ fontFamily: 'Tahoma, Arial, sans-serif', textShadow: '0 1px 1px rgba(0,0,0,0.4)', maxWidth: '400px' }}
          >
            {card.titulo || procesoNombre} — SAP GUI 7.60
          </span>
        </div>
        {/* Right: authentic Windows-style title-bar buttons */}
        <div className="flex items-center shrink-0 ml-1">
          {[
            { sym: '─', label: 'Minimizar', w: 22 },
            { sym: '□', label: 'Restaurar', w: 22 },
            { sym: '✕', label: 'Cerrar',    w: 24 },
          ].map(({ sym, label, w }) => (
            <div
              key={label}
              title={label}
              className="flex items-center justify-center text-white text-[11px] font-bold cursor-pointer hover:brightness-125"
              style={{
                width: w,
                height: 22,
                background: sym === '✕'
                  ? 'linear-gradient(180deg,#D94040 0%,#B52020 100%)'
                  : 'linear-gradient(180deg,#5C9CE0 0%,#3A7EC8 100%)',
                borderLeft: '1px solid rgba(255,255,255,0.18)',
                fontFamily: 'Tahoma, Arial, sans-serif',
                fontSize: sym === '✕' ? '12px' : '11px',
              }}
            >
              {sym}
            </div>
          ))}
        </div>
      </div>

      {/* ── Menu Bar ──────────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-0 shrink-0 border-b border-[#808080]"
        style={{ background: '#D4D0C8', height: '22px', paddingLeft: '2px' }}
      >
        {['Sistema', 'Editar', 'Favoritos', 'Ir a', 'Extras', 'Entorno', 'Ayuda'].map(m => (
          <span
            key={m}
            className="px-2 py-0.5 hover:bg-[#003A8C] hover:text-white cursor-default select-none text-[12px]"
            style={{ color: '#000' }}
          >
            {m}
          </span>
        ))}
      </div>

      {/* ── Standard Toolbar ──────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-1 shrink-0 px-1 border-b border-[#808080]"
        style={{ background: '#D4D0C8', height: '32px' }}
      >
        {/* Transaction code box */}
        <input
          value={tcodeInput}
          onChange={e => setTcodeInput(e.target.value)}
          className="w-24 px-1 text-[12px] border border-t-[#808080] border-l-[#808080] border-b-white border-r-white bg-white outline-none"
          style={{ fontFamily: 'Courier New, monospace', height: '20px' }}
          title="Código de transacción"
        />
        {/* Enter button: green checkmark */}
        <TbarBtn title="Enter (F8)">
          <span className="text-green-700 font-bold text-sm">✔</span>
        </TbarBtn>
        {/* Separator */}
        <div className="w-px h-6 bg-[#808080] mx-0.5" />
        {/* Icon buttons */}
        {TOOLBAR_ICONS.map(b => (
          <TbarBtn key={b.title} title={b.title}>
            <span>{b.icon}</span>
          </TbarBtn>
        ))}
        {/* Separator */}
        <div className="w-px h-6 bg-[#808080] mx-0.5" />
        {/* Step navigation in toolbar style */}
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-[11px] text-[#333] mr-1">Paso {step + 1}/{total}</span>
          <TbarBtn title="Pantalla anterior">
            <span className="text-[#003A8C] font-bold">‹</span>
          </TbarBtn>
          <TbarBtn title="Pantalla siguiente">
            <span className="text-[#003A8C] font-bold">›</span>
          </TbarBtn>
        </div>
      </div>

      {/* ── Main Area: Sidebar + Content ──────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — IMG tree style ─────────────────────────────────── */}
        <div
          className="w-48 shrink-0 flex flex-col border-r border-[#808080] overflow-y-auto"
          style={{ background: '#003366', minWidth: '170px' }}
        >
          {/* Header */}
          <div
            className="px-2 py-1.5 text-white text-[11px] font-bold border-b border-[#1a5591] select-none"
            style={{ background: '#002244' }}
          >
            {procesoNombre}
          </div>
          {/* Steps list */}
          {cards.map((c, idx) => {
            const done    = idx < step;
            const current = idx === step;
            return (
              <button
                key={c.id}
                onClick={() => onStep(idx)}
                className="w-full text-left px-2 py-1.5 text-[11px] border-b border-[#1a4477] hover:bg-[#1a5591] transition-colors select-none"
                style={{
                  background: current ? '#ffffff' : done ? '#0a3060' : 'transparent',
                  color:      current ? '#003366' : done ? '#6699bb' : '#c8d8e8',
                  fontWeight: current ? 'bold' : 'normal',
                }}
              >
                <span className="mr-1">{done ? '✓ ' : current ? '▶ ' : '  '}</span>
                {shortTitle(c.titulo || `Pantalla ${idx + 1}`)}
              </button>
            );
          })}
        </div>

        {/* Content area ──────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white relative">
          {/* Screenshot area */}
          <div className="flex-1 overflow-auto relative flex items-start justify-center p-2">
            {/* Classic scrollbar flair (right edge) */}
            <div
              className="absolute right-0 top-0 bottom-0 w-4 border-l border-[#808080] flex flex-col items-center"
              style={{ background: '#D4D0C8' }}
            >
              <div className="w-4 h-4 border border-t-white border-l-white border-b-[#808080] border-r-[#808080] flex items-center justify-center text-[8px] bg-[#D4D0C8] mt-0 cursor-pointer">▲</div>
              <div className="flex-1" style={{ background: '#C0C0C0' }} />
              <div className="w-4 h-6 border border-t-white border-l-white border-b-[#808080] border-r-[#808080] bg-[#D4D0C8] cursor-pointer" />
              <div className="flex-1" style={{ background: '#C0C0C0' }} />
              <div className="w-4 h-4 border border-t-white border-l-white border-b-[#808080] border-r-[#808080] flex items-center justify-center text-[8px] bg-[#D4D0C8] cursor-pointer">▼</div>
            </div>

            {/* The actual screenshot */}
            <div className="mr-5 w-full max-w-4xl">
              {/* Window-within-a-window: SAP document area header */}
              <div
                className="flex items-center justify-between px-2 py-0.5 border border-[#808080] mb-0 select-none"
                style={{ background: '#003A8C', color: 'white', fontSize: '11px' }}
              >
                <span>{card.titulo || `Transacción ${tcode}`}</span>
                <span className="opacity-70 text-[10px]">Tx: {tcode} | {card.modulo}</span>
              </div>
              {/* Screenshot image */}
              <div className="border border-[#808080] border-t-0 relative overflow-hidden">
                {/* Blue highlight bar (classic SAP "active field" indicator) */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: '#0050FF' }}
                />
                <img
                  src={imgUrl}
                  alt={card.titulo || `Pantalla ${step + 1}`}
                  className="w-full object-contain block"
                  style={{ maxHeight: '55vh', minHeight: '200px', background: '#fff' }}
                  loading="lazy"
                />
                {/* Overlaid step badge */}
                <div
                  className="absolute top-3 right-2 px-2 py-0.5 text-[11px] font-bold text-white border"
                  style={{ background: '#003A8C', borderColor: '#0070D2' }}
                >
                  {step + 1} / {total}
                </div>
              </div>
            </div>
          </div>

          {/* Guide panel (collapsible, bottom) ─────────────────────────── */}
          <div className="shrink-0 border-t-2 border-[#003366]">
            {/* Panel header / toggle */}
            <div
              className="flex items-center justify-between px-3 py-1 cursor-pointer select-none"
              style={{ background: '#003366', color: 'white' }}
              onClick={() => setGuideOpen(o => !o)}
            >
              <span className="text-[11px] font-bold">
                🔵 Paso {step + 1} de {total}: {card.titulo || `Pantalla ${step + 1}`}
              </span>
              <div className="flex items-center gap-3">
                {/* Prev / Next buttons */}
                <button
                  onClick={e => { e.stopPropagation(); goPrev(); }}
                  disabled={step === 0}
                  className="px-3 py-0.5 text-[11px] border border-white/40 hover:bg-white/20 disabled:opacity-40"
                >
                  ◀ Anterior
                </button>
                <button
                  onClick={e => { e.stopPropagation(); goNext(); }}
                  className="px-3 py-0.5 text-[11px] border border-white/40 hover:bg-white/20 font-bold"
                  style={{ background: step === total - 1 ? '#006600' : undefined }}
                >
                  {step === total - 1 ? '✓ Completar' : 'Siguiente ▶'}
                </button>
                <span className="text-[11px] opacity-70">{guideOpen ? '▼' : '▲'}</span>
              </div>
            </div>

            {guideOpen && (
              <div
                className="px-4 py-3 overflow-y-auto"
                style={{
                  background:  '#FFFACD',
                  borderTop:   '1px solid #003A8C',
                  maxHeight:   '180px',
                }}
              >
                {/* Etiquetas */}
                {card.etiquetas.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {card.etiquetas.map(t => (
                      <span
                        key={t}
                        className="px-1.5 py-0.5 text-[10px] text-white rounded-none"
                        style={{ background: '#003A8C', fontFamily: 'Tahoma, Arial, sans-serif' }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* OCR text lines */}
                {guideLines.length > 0 ? (
                  <ul className="space-y-0.5 text-[11px] text-[#333] list-disc list-inside">
                    {guideLines.map((ln, i) => (
                      <li key={i}>{ln}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-[#666] italic">
                    Observa la pantalla y sigue las instrucciones del formador.
                  </p>
                )}

                {/* Video link */}
                {card.video && (
                  <a
                    href={`https://www.youtube.com/watch?v=${card.video}${card.segundo != null ? `&t=${card.segundo}s` : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-[11px] text-[#003A8C] underline hover:text-[#0050FF]"
                  >
                    ▶ Ver captura original en YouTube
                  </a>
                )}

                {/* Origen */}
                <p className="mt-2 text-[10px] text-[#888]">
                  Origen: {card.origen} {card.fecha ? `· ${card.fecha}` : ''}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Status Bar ────────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between shrink-0 px-2 border-t border-[#808080] select-none"
        style={{ background: '#D4D0C8', height: '20px' }}
      >
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="w-3 h-3 rounded-full bg-green-600 inline-block border border-green-800" />
          <span>ERP S/4HANA — Sistema Productivo</span>
        </div>
        <div className="text-[11px] text-[#333] font-mono">{tcode}</div>
        <div className="text-[11px] text-[#555]">Tiempo resp.: 0.021 s | Servidor: sap-prod-01</div>
      </div>
    </div>
  );
}
