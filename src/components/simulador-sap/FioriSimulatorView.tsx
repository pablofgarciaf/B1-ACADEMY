"use client";

/**
 * FioriSimulatorView — SAP Fiori Launchpad + Object Page step simulator
 * Visual identity: dark-blue shell header (#354A5E), white content, #0070F2 accent
 * No @ui5/webcomponents-react — pure Tailwind + inline styles
 */

import React, { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  Settings,
  HelpCircle,
  User,
  ChevronRight,
  ChevronLeft,
  Play,
  Check,
  ShoppingCart,
  DollarSign,
  Users,
  BarChart2,
  Package,
  Wrench,
  Layers,
  Activity,
  Briefcase,
  Home,
  ExternalLink,
  Tag,
  FileText,
  AlertCircle,
} from "lucide-react";
import type { SimuladorSAPProps, KBCard } from "@/types/kb-simulator";

// ─── helpers ────────────────────────────────────────────────────────────────

const PROCESO_APP: Record<string, { name: string; icon: React.ReactNode; color: string }> = {
  "00_Navegacion":        { name: "SAP Launchpad / Home",               icon: <Home size={28} />,       color: "#354A5E" },
  "01_Ventas":            { name: "Sales Order Management",             icon: <ShoppingCart size={28} />,color: "#0070F2" },
  "02_Compras":           { name: "Purchase Order Processing",          icon: <Package size={28} />,     color: "#188B30" },
  "03_Bancos":            { name: "Cash Management",                    icon: <DollarSign size={28} />,  color: "#0070F2" },
  "04_Finanzas":          { name: "Financial Accounting",               icon: <BarChart2 size={28} />,   color: "#C0399F" },
  "05_Maestros":          { name: "Master Data Governance",             icon: <Users size={28} />,       color: "#7B5EA7" },
  "06_Produccion":        { name: "Production Planning",                icon: <Activity size={28} />,    color: "#E9730C" },
  "07_MRP":               { name: "Material Requirements Planning",     icon: <Layers size={28} />,      color: "#188B30" },
  "08_CRM_Oportunidades": { name: "CRM - Opportunity Management",       icon: <Briefcase size={28} />,   color: "#0070F2" },
  "09_Servicios":         { name: "Service Management",                 icon: <Wrench size={28} />,      color: "#E9730C" },
  "10_Proyectos":         { name: "Project Management",                 icon: <FileText size={28} />,    color: "#7B5EA7" },
  "11_DTW_Migracion":     { name: "DTW / Data Migration",              icon: <Layers size={28} />,      color: "#354A5E" },
  "12_Query_Manager":     { name: "Query Manager",                     icon: <Search size={28} />,      color: "#188B30" },
  "13_Autorizaciones":    { name: "Authorization Management",          icon: <Users size={28} />,       color: "#C0399F" },
};

const LAUNCHPAD_TILES = [
  { name: "Sales Order Mgmt",   icon: <ShoppingCart size={24} />, color: "#0070F2", count: "12" },
  { name: "Purchase Orders",    icon: <Package size={24} />,       color: "#188B30", count: "5" },
  { name: "Financial Postings", icon: <BarChart2 size={24} />,     color: "#C0399F", count: "3" },
  { name: "Cash Management",    icon: <DollarSign size={24} />,    color: "#E9730C", count: "8" },
  { name: "Master Data",        icon: <Users size={24} />,         color: "#7B5EA7", count: "21" },
  { name: "My Tasks",           icon: <Activity size={24} />,      color: "#354A5E", count: "2" },
];

function imgUrl(archivo: string): string {
  return `/api/kb/image?p=${encodeURIComponent(archivo)}`;
}

function ytUrl(video: string, segundo: number | null): string {
  return `https://www.youtube.com/watch?v=${video}${segundo ? `&t=${segundo}s` : ""}`;
}

// ─── Shell Header ────────────────────────────────────────────────────────────

function FioriShell({ appName }: { appName: string }) {
  return (
    <header
      className="flex items-center justify-between px-3 text-white shrink-0"
      style={{ height: 44, background: "#354A5E" }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
          <Menu size={18} />
        </button>
        <div className="flex items-center gap-2">
          {/* SAP logo text */}
          <span
            className="font-black italic text-sm px-1.5 py-0.5 rounded-sm leading-none"
            style={{ background: "#fff", color: "#009DE0" }}
          >
            SAP
          </span>
          <span className="text-sm font-medium hidden sm:block">{appName}</span>
        </div>
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-1">
        <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
          <Search size={16} />
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded transition-colors relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#E9730C]" />
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
          <Settings size={16} />
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
          <HelpCircle size={16} />
        </button>
        <button
          className="ml-1 w-7 h-7 rounded-full flex items-center justify-center border border-white/40"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          <User size={14} />
        </button>
      </div>
    </header>
  );
}

// ─── Launchpad intro view ────────────────────────────────────────────────────

function LaunchpadView({ onEnter, procesoNombre }: { onEnter: () => void; procesoNombre: string }) {
  return (
    <div className="flex-1 overflow-auto bg-[#f2f4f7] p-6">
      {/* Group header */}
      <div className="mb-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#404448]">
          My Home
        </span>
      </div>

      {/* Tiles grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
        {LAUNCHPAD_TILES.map((tile, i) => (
          <div
            key={i}
            onClick={i === 0 ? onEnter : undefined}
            className={`flex flex-col justify-between rounded-lg p-3 text-white select-none transition-transform hover:scale-105 ${i === 0 ? "cursor-pointer ring-2 ring-white/60 shadow-lg" : "cursor-default opacity-80"}`}
            style={{ background: tile.color, minHeight: "9rem", minWidth: "9rem" }}
          >
            <div>{tile.icon}</div>
            <div>
              <div className="text-xs font-semibold leading-snug">{tile.name}</div>
              {tile.count && (
                <div className="mt-1 text-xs opacity-80">{tile.count} items</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-4 py-8">
        <p className="text-[#32363A] font-medium text-lg">
          Iniciar simulación: <span style={{ color: "#0070F2" }}>{procesoNombre}</span>
        </p>
        <button
          onClick={onEnter}
          className="flex items-center gap-2 px-6 py-2.5 rounded text-white text-sm font-semibold shadow hover:opacity-90 transition-opacity"
          style={{ background: "#0070F2" }}
        >
          <Play size={15} />
          Comenzar proceso
        </button>
      </div>
    </div>
  );
}

// ─── Progress stepper ────────────────────────────────────────────────────────

function Stepper({
  total,
  current,
  onStep,
}: {
  total: number;
  current: number;
  onStep: (n: number) => void;
}) {
  // show at most 9 steps; use first/last + neighbours
  const MAX = 9;
  const indices: number[] = [];
  if (total <= MAX) {
    for (let i = 0; i < total; i++) indices.push(i);
  } else {
    indices.push(0);
    const lo = Math.max(1, current - 3);
    const hi = Math.min(total - 2, current + 3);
    if (lo > 1) indices.push(-1); // ellipsis
    for (let i = lo; i <= hi; i++) indices.push(i);
    if (hi < total - 2) indices.push(-2); // ellipsis
    indices.push(total - 1);
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {indices.map((idx, pos) => {
        if (idx < 0)
          return (
            <span key={`e${pos}`} className="text-[#404448] text-sm px-1">
              …
            </span>
          );
        const done = idx < current;
        const active = idx === current;
        return (
          <React.Fragment key={idx}>
            {pos > 0 && indices[pos - 1] >= 0 && (
              <div
                className="h-px w-4 shrink-0"
                style={{ background: done || active ? "#0070F2" : "#D1D4D7" }}
              />
            )}
            <button
              onClick={() => onStep(idx)}
              title={`Paso ${idx + 1}`}
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all border"
              style={{
                background: active ? "#0070F2" : done ? "#404448" : "#fff",
                color: active || done ? "#fff" : "#32363A",
                borderColor: active ? "#0070F2" : done ? "#404448" : "#6A6D70",
              }}
            >
              {done ? <Check size={12} /> : idx + 1}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Object Page (single step) ───────────────────────────────────────────────

function ObjectPage({
  card,
  stepIdx,
  total,
  procesoNombre,
  appName,
  onPrev,
  onNext,
  onStepClick,
  onComplete,
}: {
  card: KBCard;
  stepIdx: number;
  total: number;
  procesoNombre: string;
  appName: string;
  onPrev: () => void;
  onNext: () => void;
  onStepClick: (n: number) => void;
  onComplete: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex-1 overflow-auto bg-[#f2f4f7]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      {/* Breadcrumb bar */}
      <div className="bg-white border-b border-[#E5E5E5] px-4 py-2 flex items-center gap-1 text-xs" style={{ color: "#354A5E" }}>
        <Home size={12} />
        <ChevronRight size={12} className="text-[#404448]" />
        <span>{appName}</span>
        <ChevronRight size={12} className="text-[#404448]" />
        <span className="font-semibold truncate max-w-xs">{card.titulo || "Pantalla"}</span>
      </div>

      {/* Progress bar */}
      <div className="bg-white border-b border-[#E5E5E5] px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <Stepper total={total} current={stepIdx} onStep={onStepClick} />
          <span className="text-xs text-[#404448] shrink-0">
            Paso {stepIdx + 1} de {total} · <span style={{ color: "#0070F2" }}>{procesoNombre}</span>
          </span>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={onPrev}
            disabled={stepIdx === 0}
            className="px-3 py-1.5 rounded border text-xs font-semibold transition-all disabled:opacity-40"
            style={{ borderColor: "#0070F2", color: "#0070F2", background: "transparent" }}
          >
            <span className="flex items-center gap-1"><ChevronLeft size={13} /> Anterior</span>
          </button>
          {stepIdx < total - 1 ? (
            <button
              onClick={onNext}
              className="px-3 py-1.5 rounded text-xs font-semibold text-white transition-all"
              style={{ background: "#0070F2" }}
            >
              <span className="flex items-center gap-1">Siguiente <ChevronRight size={13} /></span>
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="px-3 py-1.5 rounded text-xs font-semibold text-white transition-all"
              style={{ background: "#188B30" }}
            >
              <span className="flex items-center gap-1"><Check size={13} /> Completar</span>
            </button>
          )}
        </div>
      </div>

      {/* Object Header */}
      <div className="bg-white border-b border-[#E5E5E5] px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: "#32363A" }}>
              {card.titulo || `Pantalla ${stepIdx + 1}`}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#404448" }}>
              {procesoNombre} · {card.modulo}
            </p>
          </div>
          {card.etiquetas.length > 0 && (
            <div className="flex flex-wrap gap-1.5 max-w-xs justify-end">
              {card.etiquetas.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs font-medium"
                  style={{ background: "#0070F2" }}
                >
                  <Tag size={9} />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Two-column content */}
      <div className="flex gap-4 p-4 items-start">
        {/* Screenshot section */}
        <div className="flex-1 bg-white rounded border border-[#E5E5E5] overflow-hidden shadow-sm">
          <div className="px-4 py-2 border-b border-[#E5E5E5]">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#404448" }}>
              Pantalla SAP
            </span>
          </div>
          <div className="p-3 flex items-center justify-center bg-[#F7F7F7] min-h-64">
            {imgError ? (
              <div className="flex flex-col items-center gap-2 py-8 text-[#404448]">
                <AlertCircle size={32} />
                <span className="text-sm">Imagen no disponible</span>
              </div>
            ) : (
              <img
                src={imgUrl(card.archivo)}
                alt={card.titulo || "Pantalla SAP"}
                onError={() => setImgError(true)}
                className="max-w-full max-h-[480px] object-contain rounded shadow"
              />
            )}
          </div>
        </div>

        {/* Guide panel */}
        <div className="w-72 shrink-0 space-y-3">
          {/* What does this screen do */}
          <div className="bg-white rounded border border-[#E5E5E5] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#0070F2" }}>
              ¿Qué hace esta pantalla?
            </p>
            <p className="text-sm" style={{ color: "#32363A", lineHeight: 1.6 }}>
              {card.titulo
                ? `Esta pantalla muestra: "${card.titulo}".`
                : "Pantalla del proceso SAP."}{" "}
              {card.texto.slice(0, 2).join(" · ")}
            </p>
          </div>

          {/* OCR text */}
          {card.texto.length > 0 && (
            <div className="bg-white rounded border border-[#E5E5E5] p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#404448" }}>
                Texto detectado (OCR)
              </p>
              <ul className="space-y-1">
                {card.texto.slice(0, 8).map((line, i) => (
                  <li
                    key={i}
                    className="text-xs py-1 px-2 rounded"
                    style={{
                      background: i === 0 ? "#E8F3FF" : "#F7F7F7",
                      color: "#32363A",
                      fontFamily: "monospace",
                    }}
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Video link */}
          {card.video && (
            <a
              href={ytUrl(card.video, card.segundo)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded border text-xs font-medium transition-colors hover:bg-[#E8F3FF] bg-white shadow-sm"
              style={{ borderColor: "#0070F2", color: "#0070F2" }}
            >
              <Play size={14} className="shrink-0" />
              Ver video original
              <ExternalLink size={11} className="ml-auto shrink-0 opacity-60" />
            </a>
          )}

          {/* Step info */}
          <div
            className="p-3 rounded text-xs"
            style={{ background: "#F0F4F8", color: "#404448", border: "1px solid #D0D3D6" }}
          >
            <span className="font-semibold" style={{ color: "#32363A" }}>
              Origen:
            </span>{" "}
            {card.origen}
            {card.fecha && (
              <>
                {" · "}
                <span className="font-semibold" style={{ color: "#32363A" }}>Fecha:</span> {card.fecha}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState({ procesoNombre }: { procesoNombre: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 bg-[#f2f4f7] p-8">
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="58" fill="#E8F3FF" stroke="#0070F2" strokeWidth="2" />
        <rect x="35" y="38" width="50" height="44" rx="4" fill="#fff" stroke="#0070F2" strokeWidth="1.5" />
        <line x1="43" y1="52" x2="77" y2="52" stroke="#D1D4D7" strokeWidth="2" />
        <line x1="43" y1="60" x2="77" y2="60" stroke="#D1D4D7" strokeWidth="2" />
        <line x1="43" y1="68" x2="63" y2="68" stroke="#D1D4D7" strokeWidth="2" />
        <circle cx="80" cy="80" r="16" fill="#0070F2" />
        <line x1="80" y1="74" x2="80" y2="81" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="80" cy="84.5" r="1.5" fill="#fff" />
      </svg>
      <div className="text-center space-y-1">
        <p className="font-semibold text-lg" style={{ color: "#32363A" }}>
          No hay pantallas disponibles
        </p>
        <p className="text-sm" style={{ color: "#404448" }}>
          No se encontraron capturas para el proceso{" "}
          <strong>{procesoNombre}</strong> en el sistema Fiori.
        </p>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function FioriSimulatorView({
  cards,
  proceso,
  procesoNombre,
  step,
  onStep,
  onComplete,
}: SimuladorSAPProps) {
  const appInfo = PROCESO_APP[proceso] ?? { name: procesoNombre, icon: <Home size={28} />, color: "#0070F2" };
  const appName = appInfo.name;

  // Detect if the first card is Launchpad → show intro tiles
  const isLaunchpadIntro =
    step === 0 && cards.length > 0 && cards[0].modulo.startsWith("FIORI_Launchpad");

  const [passedLaunchpad, setPassedLaunchpad] = useState(false);
  const showLaunchpad = isLaunchpadIntro && !passedLaunchpad;

  const card = cards[step] as KBCard | undefined;

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ fontFamily: '"72", Arial, Helvetica, sans-serif', background: "#f2f4f7" }}
    >
      <FioriShell appName={appName} />

      {cards.length === 0 ? (
        <EmptyState procesoNombre={procesoNombre} />
      ) : showLaunchpad ? (
        <LaunchpadView
          procesoNombre={procesoNombre}
          onEnter={() => setPassedLaunchpad(true)}
        />
      ) : card ? (
        <ObjectPage
          card={card}
          stepIdx={step}
          total={cards.length}
          procesoNombre={procesoNombre}
          appName={appName}
          onPrev={() => onStep(Math.max(0, step - 1))}
          onNext={() => onStep(Math.min(cards.length - 1, step + 1))}
          onStepClick={onStep}
          onComplete={onComplete}
        />
      ) : null}
    </div>
  );
}
