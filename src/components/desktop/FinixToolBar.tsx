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
  ArrowUpDown,
  ArrowUpRight,
  ArrowDownRight,
  Network,
  Scale,
  LayoutTemplate,
  Settings,
  Mail,
  Eye,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';

interface FinixToolBarProps {
  onActionClick?: (action: string) => void;
  onSearch?: (query: string) => void;
  onSearchByModel?: () => void;
}

export default function FinixToolBar({ onActionClick, onSearch, onSearchByModel }: FinixToolBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
    else if (onActionClick) onActionClick(`search_query:${searchQuery}`);
  };

  return (
    <div className="bg-[#f0f0f0] border-b border-[#c8c8c8] flex items-center justify-between h-[30px] px-1.5 select-none text-[11px] font-[Tahoma,Arial,sans-serif]">
      {/* Grupo Izquierdo de Iconos SAP B1 (Idéntico a Captura Oficial GenPyme Imagen 4) */}
      <div className="flex items-center gap-0.5 overflow-x-auto">
        {/* 1. Vista preliminar */}
        <button
          type="button"
          onClick={() => onActionClick?.('preview')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Vista preliminar del documento"
        >
          <Eye size={15} className="text-[#2b579a]" />
        </button>

        {/* 2. Imprimir */}
        <button
          type="button"
          onClick={() => onActionClick?.('print')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Imprimir documento (Ctrl+P)"
        >
          <Printer size={15} className="text-[#333]" />
        </button>

        {/* 3. Correo electrónico */}
        <button
          type="button"
          onClick={() => onActionClick?.('email')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Enviar por correo electrónico"
        >
          <Mail size={15} className="text-[#555]" />
        </button>

        {/* 4. SMS */}
        <button
          type="button"
          onClick={() => onActionClick?.('sms')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Enviar SMS"
        >
          <MessageSquare size={15} className="text-[#0284c7]" />
        </button>

        {/* 5. Fax */}
        <button
          type="button"
          onClick={() => onActionClick?.('fax')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Enviar por Fax"
        >
          <Printer size={15} className="text-[#64748b]" />
        </button>

        {/* 6. MS Excel */}
        <button
          type="button"
          onClick={() => onActionClick?.('excel')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Exportar a MS Excel"
        >
          <FileSpreadsheet size={15} className="text-[#107c41]" />
        </button>

        {/* 7. MS Word */}
        <button
          type="button"
          onClick={() => onActionClick?.('word')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Exportar a MS Word"
        >
          <FileText size={15} className="text-[#185abd]" />
        </button>

        {/* 8. PDF */}
        <button
          type="button"
          onClick={() => onActionClick?.('pdf')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Exportar a PDF"
        >
          <FileText size={15} className="text-[#d9381e]" />
        </button>

        {/* 9. Bloquear pantalla */}
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

        {/* 10. Modo Buscar (Prismáticos amarillos) */}
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

        {/* 11. Modo Crear / Añadir (Hoja con asterisco azul) */}
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

        {/* 12-15. Navegación de registros */}
        <button
          type="button"
          onClick={() => onActionClick?.('first')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Primer registro de datos (|◀)"
        >
          <ChevronsLeft size={15} className="text-[#444]" />
        </button>
        <button
          type="button"
          onClick={() => onActionClick?.('previous')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Registro anterior (◀)"
        >
          <ChevronLeft size={15} className="text-[#444]" />
        </button>
        <button
          type="button"
          onClick={() => onActionClick?.('next')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Registro siguiente (▶)"
        >
          <ChevronRight size={15} className="text-[#444]" />
        </button>
        <button
          type="button"
          onClick={() => onActionClick?.('last')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Último registro de datos (▶|)"
        >
          <ChevronsRight size={15} className="text-[#444]" />
        </button>

        {/* Separador */}
        <div className="w-[1px] h-4 bg-[#b8b8b8] mx-1" />

        {/* 16. Actualizar / Refrescar */}
        <button
          type="button"
          onClick={() => onActionClick?.('refresh')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Actualizar / Refrescar datos (F5)"
        >
          <RefreshCw size={14} className="text-[#0284c7]" />
        </button>

        {/* 17. Filtrar tabla */}
        <button
          type="button"
          onClick={() => onActionClick?.('filter')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Filtrar tabla"
        >
          <Filter size={14} className="text-[#555]" />
        </button>

        {/* 18. Clasificar tabla (Ordenar A-Z) */}
        <button
          type="button"
          onClick={() => onActionClick?.('sort')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Clasificar tabla / Ordenar"
        >
          <ArrowUpDown size={14} className="text-[#475569]" />
        </button>

        {/* Separador */}
        <div className="w-[1px] h-4 bg-[#b8b8b8] mx-1" />

        {/* 19. Documento base (Flecha naranja arriba) */}
        <button
          type="button"
          onClick={() => onActionClick?.('base_document')}
          className="p-1 hover:bg-[#fff7ed] hover:border-[#f97316] border border-transparent rounded-xs transition text-[#333]"
          title="Documento base"
        >
          <ArrowUpRight size={15} className="text-[#ea580c] stroke-[2.5]" />
        </button>

        {/* 20. Documento de destino (Flecha naranja abajo) */}
        <button
          type="button"
          onClick={() => onActionClick?.('target_document')}
          className="p-1 hover:bg-[#fff7ed] hover:border-[#f97316] border border-transparent rounded-xs transition text-[#333]"
          title="Documento de destino"
        >
          <ArrowDownRight size={15} className="text-[#ea580c] stroke-[2.5]" />
        </button>

        {/* 21. Mapa de relaciones */}
        <button
          type="button"
          onClick={() => onActionClick?.('relationship_map')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Mapa de relaciones del documento"
        >
          <Network size={14} className="text-[#0284c7]" />
        </button>

        {/* 22. Asiento contable preliminar */}
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

        {/* 23. Diseñador de layout */}
        <button
          type="button"
          onClick={() => onActionClick?.('layout_designer')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Diseñador de Layout / Plantillas de impresión"
        >
          <LayoutTemplate size={14} className="text-[#0284c7]" />
        </button>

        {/* 24. Parametrizaciones de Formulario */}
        <button
          type="button"
          onClick={() => onActionClick?.('settings')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition flex items-center gap-1 text-[#333]"
          title="Parametrizaciones de formulario (activar/ocultar columnas)"
        >
          <Settings size={14} className="text-[#d97706]" />
        </button>

        {/* Separador */}
        <div className="w-[1px] h-4 bg-[#b8b8b8] mx-1" />

        {/* 25. Ayuda contextual */}
        <button
          type="button"
          onClick={() => onActionClick?.('help')}
          className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
          title="Ayuda de SAP Business One (F1)"
        >
          <HelpCircle size={14} className="text-[#0284c7]" />
        </button>
      </div>

      {/* Cuadro de Búsqueda Rápida de Documentos (Idéntico a Imagen 4) */}
      <form onSubmit={handleSearchSubmit} className="flex items-center gap-1">
        <div className="relative flex items-center">
          <span className="absolute left-1.5 text-gray-400 text-[10px]">🔎</span>
          <input
            type="text"
            placeholder="Buscar datos maestros y documentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-[21px] w-44 sm:w-56 pl-5 pr-1.5 text-[11px] bg-white border border-[#999] rounded-xs text-[#222] placeholder:text-gray-400 focus:outline-none focus:border-[#0055a5] focus:bg-[#fffde7]"
          />
        </div>
        <button
          type="submit"
          className="h-[21px] px-2 bg-[#d4d0c8] hover:bg-[#e8e4dc] border border-[#808080] text-[#222] font-semibold text-[10.5px] rounded-xs transition active:scale-95 cursor-pointer whitespace-nowrap"
        >
          Buscar
        </button>
        <button
          type="button"
          onClick={() => {
            if (onSearchByModel) onSearchByModel();
            else if (onActionClick) onActionClick('search_by_model');
          }}
          className="h-[21px] px-2 bg-[#d4d0c8] hover:bg-[#e8e4dc] border border-[#808080] text-[#222] font-semibold text-[10.5px] rounded-xs transition active:scale-95 cursor-pointer whitespace-nowrap"
        >
          Búsqueda por modelo
        </button>
      </form>
    </div>
  );
}
