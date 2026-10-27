'use client';

import React, { useState } from 'react';
import {
  Printer,
  FileText,
  FileSpreadsheet,
  Lock,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  Filter,
  Scale,
  Settings,
  Mail,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

interface FinixToolBarProps {
  onActionClick?: (action: string) => void;
  onSearch?: (query: string) => void;
}

export default function FinixToolBar({ onActionClick, onSearch }: FinixToolBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
    else if (onActionClick) onActionClick(`search_query:${searchQuery}`);
  };

  return (
    <div className="bg-[#f0f0f0] border-b border-[#c8c8c8] flex items-center justify-between h-[30px] px-1.5 select-none text-[11px] font-[Tahoma,Arial,sans-serif]">
      {/* Grupo Izquierdo de Iconos SAP B1 */}
      <div className="flex items-center gap-0.5 overflow-x-auto">
        {/* Documentos & Impresión */}
        <button
          type="button"
          onClick={() => onActionClick?.('preview')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Vista preliminar del documento"
        >
          <Eye size={15} className="text-[#2b579a]" />
        </button>
        <button
          type="button"
          onClick={() => onActionClick?.('print')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Imprimir documento (Ctrl+P)"
        >
          <Printer size={15} className="text-[#333]" />
        </button>
        <button
          type="button"
          onClick={() => onActionClick?.('email')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Enviar por correo electrónico"
        >
          <Mail size={15} className="text-[#555]" />
        </button>
        <button
          type="button"
          onClick={() => onActionClick?.('excel')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Exportar a MS Excel"
        >
          <FileSpreadsheet size={15} className="text-[#107c41]" />
        </button>
        <button
          type="button"
          onClick={() => onActionClick?.('pdf')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Exportar a PDF"
        >
          <FileText size={15} className="text-[#d9381e]" />
        </button>
        <button
          type="button"
          onClick={() => onActionClick?.('lock')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Bloquear pantalla"
        >
          <Lock size={15} className="text-[#777]" />
        </button>

        {/* Separador */}
        <div className="w-[1px] h-4 bg-[#b8b8b8] mx-1" />

        {/* Modos Buscar y Crear (Prismáticos y Hoja con asterisco) */}
        <button
          type="button"
          onClick={() => onActionClick?.('search')}
          className="p-1 hover:bg-[#fff9d9] hover:border-[#d49b00] border border-transparent rounded-xs transition flex items-center gap-0.5 text-[#333]"
          title="Modo Buscar (Ctrl+F) — Buscar documentos o socios de negocio"
        >
          <div className="w-4 h-4 rounded-xs bg-[#ffe885] border border-[#d49b00] flex items-center justify-center">
            <Search size={11} className="text-[#7a5200] stroke-[2.5]" />
          </div>
        </button>
        <button
          type="button"
          onClick={() => onActionClick?.('add')}
          className="p-1 hover:bg-[#e6f4ea] hover:border-[#34a853] border border-transparent rounded-xs transition flex items-center gap-0.5 text-[#333]"
          title="Modo Crear (Ctrl+A) — Añadir nuevo documento"
        >
          <div className="w-4 h-4 rounded-xs bg-white border border-[#4285f4] flex items-center justify-center">
            <Plus size={12} className="text-[#1a73e8] stroke-[3]" />
          </div>
        </button>

        {/* Separador */}
        <div className="w-[1px] h-4 bg-[#b8b8b8] mx-1" />

        {/* Navegación de registros */}
        <button
          type="button"
          onClick={() => onActionClick?.('first')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Primer registro de datos"
        >
          <ChevronsLeft size={15} className="text-[#444]" />
        </button>
        <button
          type="button"
          onClick={() => onActionClick?.('previous')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Registro anterior"
        >
          <ChevronLeft size={15} className="text-[#444]" />
        </button>
        <button
          type="button"
          onClick={() => onActionClick?.('next')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Registro siguiente"
        >
          <ChevronRight size={15} className="text-[#444]" />
        </button>
        <button
          type="button"
          onClick={() => onActionClick?.('last')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Último registro de datos"
        >
          <ChevronsRight size={15} className="text-[#444]" />
        </button>

        {/* Separador */}
        <div className="w-[1px] h-4 bg-[#b8b8b8] mx-1" />

        {/* Actualizar, Filtrar y Asiento Contable Preliminar */}
        <button
          type="button"
          onClick={() => onActionClick?.('refresh')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Actualizar / Refrescar datos (F5)"
        >
          <RefreshCw size={14} className="text-[#0284c7]" />
        </button>
        <button
          type="button"
          onClick={() => onActionClick?.('filter')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Filtrar tabla"
        >
          <Filter size={14} className="text-[#555]" />
        </button>
        <button
          type="button"
          onClick={() => onActionClick?.('journal_preview')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Previsualizar asiento contable preliminar"
        >
          <Scale size={14} className="text-[#7c3aed]" />
        </button>

        {/* Separador */}
        <div className="w-[1px] h-4 bg-[#b8b8b8] mx-1" />

        {/* Parametrizaciones de Formulario */}
        <button
          type="button"
          onClick={() => onActionClick?.('settings')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition flex items-center gap-1 text-[#333]"
          title="Parametrizaciones de formulario (activar/ocultar columnas)"
        >
          <Settings size={14} className="text-[#d97706]" />
        </button>
      </div>

      {/* Cuadro de Búsqueda Rápida de Documentos (Estilo SAP B1 Web Client) */}
      <form onSubmit={handleSearchSubmit} className="flex items-center gap-1">
        <div className="relative flex items-center">
          <span className="absolute left-1.5 text-gray-400 text-[10px]">🔎</span>
          <input
            type="text"
            placeholder="Buscar datos maestros y documentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-[20px] w-48 sm:w-64 pl-5 pr-1.5 text-[11px] bg-white border border-[#999] rounded-xs text-[#222] placeholder:text-gray-400 focus:outline-none focus:border-[#0055a5] focus:bg-[#fffde7]"
          />
        </div>
        <button
          type="submit"
          className="h-[20px] px-2 bg-[#d4d0c8] hover:bg-[#e8e4dc] border border-[#808080] text-[#222] font-semibold text-[10.5px] rounded-xs transition active:scale-95 cursor-pointer"
        >
          Buscar
        </button>
      </form>
    </div>
  );
}
