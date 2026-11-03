'use client';

import React, { useState } from 'react';
import type { SimuladorSAPProps } from '@/types/kb-simulator';
import {
  Home, Users, ShoppingCart, TrendingUp, Package, Factory,
  DollarSign, Landmark, BarChart2, Wrench, Briefcase,
  FileSearch, Shield, ChevronLeft, ChevronRight, Plus,
  RefreshCw, X, Search, Printer, Download, ExternalLink,
  Tag, BookOpen, Monitor,
} from 'lucide-react';

// ── Module sidebar config ──────────────────────────────────────────────────
const MODULES = [
  { key: 'Inicio',              label: 'Inicio',              Icon: Home },
  { key: 'Socios de Negocios',  label: 'Socios de Neg.',      Icon: Users },
  { key: 'Compras',             label: 'Compras',             Icon: ShoppingCart },
  { key: 'Ventas',              label: 'Ventas',              Icon: TrendingUp },
  { key: 'Inventario',          label: 'Inventario',          Icon: Package },
  { key: 'Producción',          label: 'Producción',          Icon: Factory },
  { key: 'Finanzas',            label: 'Finanzas',            Icon: DollarSign },
  { key: 'Bancos',              label: 'Bancos',              Icon: Landmark },
  { key: 'Informes',            label: 'Informes',            Icon: BarChart2 },
  { key: 'Servicios',           label: 'Servicios',           Icon: Briefcase },
  { key: 'Proyectos',           label: 'Proyectos',           Icon: FileSearch },
  { key: 'Herramientas',        label: 'Herramientas',        Icon: Wrench },
  { key: 'Administración',      label: 'Administración',      Icon: Shield },
] as const;

const PROCESO_TO_MODULE: Record<string, string> = {
  '00_Navegacion':         'Inicio',
  '01_Ventas':             'Ventas',
  '02_Compras':            'Compras',
  '03_Bancos':             'Bancos',
  '04_Finanzas':           'Finanzas',
  '05_Maestros':           'Socios de Negocios',
  '06_Produccion':         'Producción',
  '07_MRP':                'Producción',
  '08_CRM_Oportunidades':  'Socios de Negocios',
  '09_Servicios':          'Servicios',
  '10_Proyectos':          'Proyectos',
  '11_DTW_Migracion':      'Herramientas',
  '12_Query_Manager':      'Informes',
  '13_Autorizaciones':     'Administración',
};

// ── Consejo contextual basado en etiquetas ─────────────────────────────────
function getConsejo(etiquetas: string[]): string {
  if (etiquetas.includes('pedido-compra'))    return 'En SAP B1, el Pedido de Compra genera automáticamente un compromiso contable y actualiza el nivel de stock comprometido. Verifica siempre el almacén destino antes de confirmar.';
  if (etiquetas.includes('pedido-venta'))     return 'El Pedido de Venta reserva stock en el almacén asignado al cliente. Si el artículo no tiene stock suficiente, aparecerá una advertencia en rojo.';
  if (etiquetas.includes('factura-venta'))    return 'La Factura de Deudores genera el asiento contable automáticamente: Debe → Cuenta Cliente, Haber → Cuenta Ingresos + IVA Ventas.';
  if (etiquetas.includes('factura-compra'))   return 'La Factura de Acreedores registra la obligación de pago. El asiento es: Debe → Gasto/Activo + IVA Compras, Haber → Cuenta Proveedor.';
  if (etiquetas.includes('asiento-contable')) return 'Los asientos manuales en B1 requieren que el total de Debe = Haber. Usa el campo "Notas" para documentar el motivo del asiento.';
  if (etiquetas.includes('conciliacion'))     return 'La conciliación bancaria en SAP B1 compara movimientos del extracto externo contra los pagos registrados en el sistema.';
  if (etiquetas.includes('datos-maestros'))   return 'Los datos maestros (artículos, socios) son la base del sistema. Un error en el maestro se propaga a todos los documentos que lo usan.';
  if (etiquetas.includes('mrp'))              return 'El MRP de SAP B1 genera Recomendaciones de Pedido basadas en stock mínimo, demanda prevista y tiempo de entrega del proveedor.';
  if (etiquetas.includes('autorizaciones'))   return 'El módulo de Autorizaciones permite definir jerarquías de aprobación para documentos que superen ciertos montos o condiciones.';
  if (etiquetas.includes('informes'))         return 'SAP B1 ofrece Crystal Reports integrado. Puedes personalizar cualquier informe o crear nuevos con el Query Manager.';
  return 'Navega por cada pantalla con los botones de toolbar. Usa F3 para buscar registros y Ctrl+A para añadir un documento nuevo en SAP Business One.';
}

// ── Sub-componentes ────────────────────────────────────────────────────────

function WindowControls() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E] cursor-not-allowed" title="Cerrar" />
      <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] cursor-not-allowed" title="Minimizar" />
      <div className="w-3 h-3 rounded-full bg-[#28CA41] border border-[#1AAB29] cursor-not-allowed" title="Maximizar" />
    </div>
  );
}

function SapB1Logo() {
  return (
    <div className="flex items-center gap-2">
      {/* SAP star logo approximation */}
      <svg width="18" height="18" viewBox="0 0 18 18" className="shrink-0">
        <circle cx="9" cy="9" r="8" fill="white" />
        <text x="9" y="13" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1B4F8A" fontFamily="Arial">SAP</text>
      </svg>
      <span className="text-white font-semibold text-sm tracking-wide">SAP Business One</span>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function B1SimulatorView({
  cards,
  proceso,
  procesoNombre,
  step,
  onStep,
  onComplete,
}: SimuladorSAPProps) {
  const [imgError, setImgError] = useState(false);

  const card = cards[step] ?? null;
  const total = cards.length;
  const activeModule = PROCESO_TO_MODULE[proceso] ?? 'Inicio';
  const progress = total > 0 ? ((step + 1) / total) * 100 : 0;

  const goNext = () => {
    if (step < total - 1) { setImgError(false); onStep(step + 1); }
    else onComplete();
  };
  const goPrev = () => {
    if (step > 0) { setImgError(false); onStep(step - 1); }
  };

  const imgSrc = card ? `/api/kb/image?p=${encodeURIComponent(card.archivo)}` : '';
  const videoHref = card?.video
    ? `https://youtube.com/watch?v=${card.video}${card.segundo != null ? `&t=${card.segundo}s` : ''}`
    : null;

  // ── Empty state
  if (total === 0) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#F0F0F0' }}>
        {/* Title bar */}
        <div className="h-8 flex items-center justify-between px-3" style={{ background: '#1B4F8A' }}>
          <div className="flex items-center gap-3">
            <WindowControls />
            <SapB1Logo />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-500">
          <div className="text-center space-y-4">
            <Monitor className="w-16 h-16 mx-auto text-slate-300" />
            <p className="text-lg font-medium">Sin pantallas disponibles</p>
            <p className="text-sm">No hay capturas para <strong>{procesoNombre}</strong> en SAP Business One.</p>
            <button
              onClick={onComplete}
              className="mt-4 px-4 py-2 text-sm rounded text-white"
              style={{ background: '#1B4F8A' }}
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col select-none" style={{ background: '#F0F0F0', fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '13px' }}>

      {/* ── 1. Title Bar ─────────────────────────────────────────────── */}
      <div
        className="h-9 flex items-center justify-between px-3 shrink-0"
        style={{ background: 'linear-gradient(180deg, #2860A8 0%, #1B4F8A 100%)' }}
      >
        <div className="flex items-center gap-3">
          <WindowControls />
          <SapB1Logo />
          <span className="text-white/60 text-xs hidden sm:inline">|</span>
          <span className="text-white/80 text-xs hidden sm:inline">{procesoNombre}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/70 text-xs">
            Paso <span className="text-white font-bold">{step + 1}</span> de <span className="text-white font-bold">{total}</span>
          </span>
        </div>
      </div>

      {/* ── 2. Menu Bar ───────────────────────────────────────────────── */}
      <div
        className="h-7 flex items-center px-2 gap-1 shrink-0 border-b"
        style={{ background: '#E8E8E8', borderColor: '#C0C0C0' }}
      >
        {['Archivo', 'Editar', 'Ver', 'Datos', 'Ir a', 'Herramientas', 'Ventana', 'Ayuda'].map(m => (
          <button
            key={m}
            className="px-2.5 py-0.5 text-xs hover:bg-[#1B4F8A] hover:text-white rounded transition-colors"
            style={{ color: '#333' }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* ── 3. Toolbar ────────────────────────────────────────────────── */}
      <div
        className="h-9 flex items-center px-2 gap-1 shrink-0 border-b"
        style={{ background: '#E4E4E4', borderColor: '#B8B8B8' }}
      >
        {/* SAP B1 action buttons */}
        <div className="flex items-center gap-1 mr-3">
          {[
            { Icon: Plus,        label: 'Añadir' },
            { Icon: RefreshCw,   label: 'Actualizar' },
            { Icon: X,           label: 'Cancelar' },
            { Icon: Search,      label: 'Buscar' },
            { Icon: Printer,     label: 'Imprimir' },
            { Icon: Download,    label: 'Exportar' },
          ].map(({ Icon, label }) => (
            <button
              key={label}
              title={label}
              className="flex flex-col items-center justify-center w-9 h-7 rounded border text-[10px] hover:bg-white transition-colors"
              style={{ background: '#EDEDED', borderColor: '#C0C0C0', color: '#555' }}
            >
              <Icon className="w-3.5 h-3.5 mb-0.5" style={{ color: '#1B4F8A' }} />
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-400 mx-1" />

        {/* Navigation */}
        <div className="flex items-center gap-1 ml-1">
          <button
            onClick={goPrev}
            disabled={step === 0}
            className="flex items-center gap-1 px-2 py-1 rounded border text-xs disabled:opacity-40 hover:bg-white transition-colors"
            style={{ background: '#EDEDED', borderColor: '#C0C0C0', color: '#1B4F8A' }}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Anterior
          </button>
          <button
            onClick={goNext}
            className="flex items-center gap-1 px-2 py-1 rounded border text-xs hover:bg-white transition-colors"
            style={{ background: '#1B4F8A', borderColor: '#1B4F8A', color: 'white' }}
          >
            {step < total - 1 ? 'Siguiente' : 'Finalizar'}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── 4. Progress bar ───────────────────────────────────────────── */}
      <div className="h-1.5 bg-gray-200 shrink-0">
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${progress}%`, background: '#1B4F8A' }}
        />
      </div>

      {/* ── 5. Main layout ────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Module sidebar */}
        <aside
          className="w-44 shrink-0 flex flex-col overflow-y-auto"
          style={{ background: '#1B4F8A', borderRight: '1px solid #154080' }}
        >
          <div className="px-2 py-2 text-white/50 text-[10px] uppercase tracking-widest font-bold border-b border-white/10">
            Módulos
          </div>
          {MODULES.map(({ key, label, Icon }) => {
            const isActive = key === activeModule;
            return (
              <button
                key={key}
                className="flex items-center gap-2 px-3 py-2 text-left transition-colors w-full"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                  borderLeft: isActive ? '3px solid #7EB8F5' : '3px solid transparent',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
                }}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs leading-tight">{label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content area */}
        <main className="flex-1 flex overflow-hidden" style={{ background: '#FAFAFA' }}>

          {/* Screenshot area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Document header bar */}
            <div
              className="px-4 py-2 border-b flex items-center justify-between shrink-0"
              style={{ background: '#F5F5F5', borderColor: '#DEDEDE' }}
            >
              <div>
                <span className="text-xs font-semibold" style={{ color: '#1B4F8A' }}>
                  {card?.titulo || procesoNombre}
                </span>
                <span className="text-[10px] text-gray-400 ml-2">
                  — {procesoNombre}
                </span>
              </div>
              {card?.etiquetas?.length ? (
                <div className="flex items-center gap-1 flex-wrap max-w-xs justify-end">
                  {card.etiquetas.slice(0, 4).map(e => (
                    <span
                      key={e}
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px]"
                      style={{ background: '#EBF3FF', color: '#1B4F8A', border: '1px solid #BDDAFF' }}
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {e}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Screenshot */}
            <div className="flex-1 flex items-center justify-center overflow-auto p-4" style={{ background: 'white' }}>
              {card && !imgError ? (
                <img
                  src={imgSrc}
                  alt={card.titulo || 'Pantalla SAP B1'}
                  onError={() => setImgError(true)}
                  className="max-w-full max-h-full object-contain shadow-md border border-gray-200 rounded"
                  style={{ maxHeight: 'calc(100vh - 280px)' }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                  <Monitor className="w-16 h-16" />
                  <p className="text-sm">Pantalla no disponible</p>
                </div>
              )}
            </div>
          </div>

          {/* Guide panel */}
          <aside
            className="w-72 shrink-0 flex flex-col border-l overflow-y-auto"
            style={{ background: '#F2F6FB', borderColor: '#D0DDED' }}
          >
            {/* Header */}
            <div
              className="px-3 py-2 border-b shrink-0"
              style={{ background: '#1B4F8A', borderColor: '#154080' }}
            >
              <div className="flex items-center gap-2 text-white">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wide">Guía del Consultor</span>
              </div>
            </div>

            {card && (
              <div className="flex-1 p-3 space-y-3 text-[12px]">

                {/* Screen title */}
                <div
                  className="rounded p-2 border"
                  style={{ background: '#EBF3FF', borderColor: '#B8D5F9' }}
                >
                  <p className="font-bold text-xs" style={{ color: '#1B4F8A' }}>
                    {card.titulo || 'Pantalla SAP B1'}
                  </p>
                  {card.fecha && (
                    <p className="text-[10px] text-gray-400 mt-0.5">Captura: {card.fecha}</p>
                  )}
                </div>

                {/* Texto OCR */}
                {card.texto?.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Texto detectado en pantalla:
                    </p>
                    <div
                      className="rounded border p-2 space-y-0.5"
                      style={{ background: 'white', borderColor: '#DDE8F5' }}
                    >
                      {card.texto.slice(0, 10).map((line, i) => (
                        <p key={i} className="text-[11px] text-gray-600 leading-snug">
                          {line}
                        </p>
                      ))}
                      {card.texto.length > 10 && (
                        <p className="text-[10px] text-gray-400 mt-1">
                          +{card.texto.length - 10} líneas más…
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Consejo */}
                <div
                  className="rounded border p-2.5"
                  style={{ background: '#FFFBEB', borderColor: '#F0D080' }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#92700A' }}>
                    💡 Consejo SAP
                  </p>
                  <p className="text-[11px] leading-relaxed" style={{ color: '#604000' }}>
                    {getConsejo(card.etiquetas)}
                  </p>
                </div>

                {/* YouTube link */}
                {videoHref && (
                  <a
                    href={videoHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[11px] rounded p-2 border transition-colors hover:bg-red-50"
                    style={{ background: '#FFF5F5', borderColor: '#FFCCCC', color: '#CC0000' }}
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    Ver en YouTube {card.segundo != null ? `(seg. ${card.segundo})` : ''}
                  </a>
                )}

                {/* Step counter */}
                <div className="pt-2 border-t" style={{ borderColor: '#D0DDED' }}>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                    <span>Progreso del proceso</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${progress}%`, background: '#1B4F8A' }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <button
                      onClick={goPrev}
                      disabled={step === 0}
                      className="px-2 py-1 text-[11px] rounded border disabled:opacity-40 hover:bg-white transition-colors"
                      style={{ borderColor: '#1B4F8A', color: '#1B4F8A', background: 'transparent' }}
                    >
                      ← Anterior
                    </button>
                    <button
                      onClick={goNext}
                      className="px-2 py-1 text-[11px] rounded text-white transition-colors"
                      style={{ background: '#1B4F8A' }}
                    >
                      {step < total - 1 ? 'Siguiente →' : 'Finalizar ✓'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </main>
      </div>

      {/* ── 6. Status Bar ─────────────────────────────────────────────── */}
      <div
        className="h-5 flex items-center px-3 gap-4 shrink-0 border-t"
        style={{ background: '#D4D4D4', borderColor: '#AAAAAA', fontSize: '10px', color: '#444' }}
      >
        <span>Empresa: EMPRESA DEMO</span>
        <span style={{ color: '#888' }}>|</span>
        <span>Usuario: SAP</span>
        <span style={{ color: '#888' }}>|</span>
        <span>Sistema: B1 10.0</span>
        <span style={{ color: '#888' }}>|</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          Conexión: OK
        </span>
        <span className="ml-auto" style={{ color: '#888' }}>
          {card?.modulo ?? ''}
        </span>
      </div>
    </div>
  );
}
