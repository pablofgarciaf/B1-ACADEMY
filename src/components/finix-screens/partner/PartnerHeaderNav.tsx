'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, Search, Users } from 'lucide-react';

interface PartnerHeaderNavProps {
  vendor: boolean;
  formMode: 'create' | 'edit' | 'search';
  selectedIndex: number;
  totalRecords: number;
  list: Array<{ cardCode: string; name: string }>;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
  onSelectIndex: (index: number) => void;
  onNew: () => void;
  onToggleSearch?: () => void;
}

export default function PartnerHeaderNav({
  vendor,
  formMode,
  selectedIndex,
  totalRecords,
  list,
  onFirst,
  onPrev,
  onNext,
  onLast,
  onSelectIndex,
  onNew,
  onToggleSearch,
}: PartnerHeaderNavProps) {
  return (
    <div className="bg-[#e4ebf3] border border-[#a6b8cc] rounded-t-xs px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
      <div className="flex items-center gap-2">
        <span className="text-[#0055a5] text-sm font-bold">👤</span>
        <span className="font-bold text-xs text-[#0a246a]">
          {vendor
            ? 'Datos Maestros de Interlocutores Comerciales — Proveedor (OCRD)'
            : 'Datos Maestros de Interlocutores Comerciales — Cliente / Lead (OCRD)'}
        </span>
        <span className="ml-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#fffde7] text-[#8a5d00] border border-[#e0c46c]">
          {formMode === 'create'
            ? 'Modo Crear'
            : formMode === 'search'
            ? 'Modo Buscar'
            : 'Modo Visualizar / Actualizar'}
        </span>
      </div>

      {/* Controles de Navegación y Salto Rápido */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Selector rápido directo de socio */}
        {list.length > 0 && (
          <select
            value={selectedIndex >= 0 ? selectedIndex : ''}
            onChange={(e) => {
              const val = e.target.value;
              if (val !== '') onSelectIndex(Number(val));
              else onNew();
            }}
            className="border border-[#9fb4c7] bg-white px-2 py-0.5 text-[10.5px] rounded-xs font-medium text-[#003366] max-w-[190px] truncate"
            title="Abrir socio directamente por código o nombre"
          >
            <option value="">➕ [Nuevo registro]</option>
            {list.map((p, idx) => (
              <option key={p.cardCode} value={idx}>
                {p.cardCode} · {p.name}
              </option>
            ))}
          </select>
        )}

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={onFirst}
            disabled={totalRecords === 0}
            className="p-1 bg-white hover:bg-slate-100 border border-[#b8c9d4] rounded-xs disabled:opacity-40 cursor-pointer shadow-2xs"
            title="Primer registro"
          >
            <ChevronsLeft size={13} />
          </button>
          <button
            type="button"
            onClick={onPrev}
            disabled={selectedIndex <= 0}
            className="p-1 bg-white hover:bg-slate-100 border border-[#b8c9d4] rounded-xs disabled:opacity-40 cursor-pointer shadow-2xs"
            title="Registro anterior"
          >
            <ChevronLeft size={13} />
          </button>
          <span className="text-[10.5px] px-1.5 font-mono text-gray-600">
            {selectedIndex >= 0 ? `${selectedIndex + 1} / ${totalRecords}` : `Nuevo (${totalRecords} regs)`}
          </span>
          <button
            type="button"
            onClick={onNext}
            disabled={selectedIndex < 0 || selectedIndex >= totalRecords - 1}
            className="p-1 bg-white hover:bg-slate-100 border border-[#b8c9d4] rounded-xs disabled:opacity-40 cursor-pointer shadow-2xs"
            title="Registro siguiente"
          >
            <ChevronRight size={13} />
          </button>
          <button
            type="button"
            onClick={onLast}
            disabled={totalRecords === 0}
            className="p-1 bg-white hover:bg-slate-100 border border-[#b8c9d4] rounded-xs disabled:opacity-40 cursor-pointer shadow-2xs"
            title="Último registro"
          >
            <ChevronsRight size={13} />
          </button>
        </div>

        {onToggleSearch && (
          <button
            type="button"
            onClick={onToggleSearch}
            className={`px-2 py-0.5 ${
              formMode === 'search'
                ? 'bg-[#d49b00] text-white hover:bg-[#b88600]'
                : 'bg-white hover:bg-slate-100 text-[#003366] border border-[#b8c9d4]'
            } rounded-xs font-bold text-[10.5px] flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95 transition`}
            title="Cambiar a Modo Buscar (Ctrl+F)"
          >
            <Search size={11} />
            <span>Buscar</span>
          </button>
        )}

        <button
          type="button"
          onClick={onNew}
          className="px-2 py-0.5 bg-[#0070d2] text-white hover:bg-[#005bb5] rounded-xs font-bold text-[10.5px] flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95 transition"
          title="Crear nuevo interlocutor (Ctrl+A)"
        >
          <Plus size={11} />
          <span>Nuevo</span>
        </button>
      </div>
    </div>
  );
}
