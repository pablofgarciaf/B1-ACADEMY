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

import type { FinixRole } from './FinixDesktopShell';

interface FinixToolBarProps {
  onActionClick?: (action: string) => void;
  onSearch?: (query: string) => void;
  onSearchByModel?: () => void;
  /** Rol activo para filtrar los botones visibles */
  activeRole?: FinixRole;
}

/**
 * Botones visibles por rol. 'super' o ausencia = todos.
 * Los botones no listados se ocultan completamente.
 */
const ROLE_BUTTONS: Record<string, string[]> = {
  ventas: [
    'preview', 'print', 'email', 'sms', 'fax', 'excel', 'word', 'pdf', 'lock',
    'search', 'add',
    'first', 'previous', 'next', 'last',
    'refresh', 'filter', 'sort',
    'base_document', 'target_document', 'relationship_map',
    'help',
  ],
  compras: [
    'print', 'email', 'excel', 'pdf', 'lock',
    'search', 'add',
    'first', 'previous', 'next', 'last',
    'refresh', 'filter', 'sort',
    'base_document', 'target_document', 'relationship_map',
    'help',
  ],
  contabilidad: [
    'preview', 'print', 'email', 'excel', 'word', 'pdf', 'lock',
    'search', 'add',
    'first', 'previous', 'next', 'last',
    'refresh', 'filter', 'sort',
    'base_document', 'target_document', 'relationship_map',
    'journal_preview', 'layout_designer', 'settings',
    'help',
  ],
  almacen: [
    'print', 'excel', 'pdf',
    'search', 'add',
    'first', 'previous', 'next', 'last',
    'refresh', 'filter', 'sort',
    'help',
  ],
};

export default function FinixToolBar({ onActionClick, onSearch, onSearchByModel, activeRole = 'super' }: FinixToolBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  /** Devuelve true si el botón debe mostrarse para el rol activo */
  const show = (action: string): boolean => {
    if (activeRole === 'super') return true;
    const allowed = ROLE_BUTTONS[activeRole];
    return allowed ? allowed.includes(action) : true;
  };

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
        {show('preview') && (
          <button type="button" onClick={() => onActionClick?.('preview')}
            className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
            title="Vista preliminar del documento">
            <Eye size={15} className="text-[#2b579a]" />
          </button>
        )}

        {/* 2. Imprimir */}
        {show('print') && (
          <button type="button" onClick={() => onActionClick?.('print')}
            className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
            title="Imprimir documento (Ctrl+P)">
            <Printer size={15} className="text-[#333]" />
          </button>
        )}

        {/* 3. Correo electrónico */}
        {show('email') && (
          <button type="button" onClick={() => onActionClick?.('email')}
            className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
            title="Enviar por correo electrónico">
            <Mail size={15} className="text-[#555]" />
          </button>
        )}

        {/* 4. SMS */}
        {show('sms') && (
          <button type="button" onClick={() => onActionClick?.('sms')}
            className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
            title="Enviar SMS">
            <MessageSquare size={15} className="text-[#0284c7]" />
          </button>
        )}

        {/* 5. Fax */}
        {show('fax') && (
          <button type="button" onClick={() => onActionClick?.('fax')}
            className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
            title="Enviar por Fax">
            <Printer size={15} className="text-[#64748b]" />
          </button>
        )}

        {/* 6. MS Excel */}
        {show('excel') && (
          <button type="button" onClick={() => onActionClick?.('excel')}
            className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
            title="Exportar a MS Excel">
            <FileSpreadsheet size={15} className="text-[#107c41]" />
          </button>
        )}

        {/* 7. MS Word */}
        {show('word') && (
          <button type="button" onClick={() => onActionClick?.('word')}
            className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
            title="Exportar a MS Word">
            <FileText size={15} className="text-[#185abd]" />
          </button>
        )}

        {/* 8. PDF */}
        {show('pdf') && (
          <button type="button" onClick={() => onActionClick?.('pdf')}
            className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
            title="Exportar a PDF">
            <FileText size={15} className="text-[#d9381e]" />
          </button>
        )}

        {/* 9. Bloquear pantalla */}
        {show('lock') && (
          <button type="button" onClick={() => onActionClick?.('lock')}
            className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
            title="Bloquear pantalla">
            <Lock size={15} className="text-[#777]" />
          </button>
        )}

        {/* Separador grupo exportación */}
        <div className="w-[1px] h-4 bg-[#b8b8b8] mx-1" />

        {/* 10. Modo Buscar */}
        {show('search') && (
          <button type="button" onClick={() => onActionClick?.('search')}
            className="p-1 hover:bg-[#fff9d9] hover:border-[#d49b00] border border-transparent rounded-xs transition flex items-center gap-0.5 text-[#333]"
            title="Modo Buscar (Ctrl+F) — Buscar documentos o socios de negocio">
            <div className="w-4 h-4 rounded-xs bg-[#ffe885] border border-[#d49b00] flex items-center justify-center">
              <Search size={11} className="text-[#7a5200] stroke-[2.5]" />
            </div>
          </button>
        )}

        {/* 11. Modo Crear */}
        {show('add') && (
          <button type="button" onClick={() => onActionClick?.('add')}
            className="p-1 hover:bg-[#e6f4ea] hover:border-[#34a853] border border-transparent rounded-xs transition flex items-center gap-0.5 text-[#333]"
            title="Modo Crear (Ctrl+A) — Añadir nuevo documento">
            <div className="w-4 h-4 rounded-xs bg-white border border-[#4285f4] flex items-center justify-center">
              <Plus size={12} className="text-[#1a73e8] stroke-[3]" />
            </div>
          </button>
        )}

        {/* Separador grupo acciones */}
        <div className="w-[1px] h-4 bg-[#b8b8b8] mx-1" />

        {/* 12-15. Navegación de registros */}
        {show('first') && (
          <button type="button" onClick={() => onActionClick?.('first')}
            className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
            title="Primer registro de datos (|◀)">
            <ChevronsLeft size={15} className="text-[#444]" />
          </button>
        )}
        {show('previous') && (
          <button type="button" onClick={() => onActionClick?.('previous')}
            className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
            title="Registro anterior (◀)">
            <ChevronLeft size={15} className="text-[#444]" />
          </button>
        )}
        {show('next') && (
          <button type="button" onClick={() => onActionClick?.('next')}
            className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
            title="Registro siguiente (▶)">
            <ChevronRight size={15} className="text-[#444]" />
          </button>
        )}
        {show('last') && (
          <button type="button" onClick={() => onActionClick?.('last')}
            className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
            title="Último registro de datos (▶|)">
            <ChevronsRight size={15} className="text-[#444]" />
          </button>
        )}

        {/* Separador navegación */}
        <div className="w-[1px] h-4 bg-[#b8b8b8] mx-1" />

        {/* 16. Refrescar */}
        {show('refresh') && (
          <button type="button" onClick={() => onActionClick?.('refresh')}
            className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
            title="Actualizar / Refrescar datos (F5)">
            <RefreshCw size={14} className="text-[#0284c7]" />
          </button>
        )}

        {/* 17. Filtrar */}
        {show('filter') && (
          <button type="button" onClick={() => onActionClick?.('filter')}
            className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
            title="Filtrar tabla">
            <Filter size={14} className="text-[#555]" />
          </button>
        )}

        {/* 18. Ordenar */}
        {show('sort') && (
          <button type="button" onClick={() => onActionClick?.('sort')}
            className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
            title="Clasificar tabla / Ordenar">
            <ArrowUpDown size={14} className="text-[#475569]" />
          </button>
        )}

        {/* Separador docs relacionados */}
        {(show('base_document') || show('target_document') || show('relationship_map') || show('journal_preview')) && (
          <div className="w-[1px] h-4 bg-[#b8b8b8] mx-1" />
        )}

        {/* 19. Documento base */}
        {show('base_document') && (
          <button type="button" onClick={() => onActionClick?.('base_document')}
            className="p-1 hover:bg-[#fff7ed] hover:border-[#f97316] border border-transparent rounded-xs transition text-[#333]"
            title="Documento base">
            <ArrowUpRight size={15} className="text-[#ea580c] stroke-[2.5]" />
          </button>
        )}

        {/* 20. Documento destino */}
        {show('target_document') && (
          <button type="button" onClick={() => onActionClick?.('target_document')}
            className="p-1 hover:bg-[#fff7ed] hover:border-[#f97316] border border-transparent rounded-xs transition text-[#333]"
            title="Documento de destino">
            <ArrowDownRight size={15} className="text-[#ea580c] stroke-[2.5]" />
          </button>
        )}

        {/* 21. Mapa de relaciones */}
        {show('relationship_map') && (
          <button type="button" onClick={() => onActionClick?.('relationship_map')}
            className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
            title="Mapa de relaciones del documento">
            <Network size={14} className="text-[#0284c7]" />
          </button>
        )}

        {/* 22. Asiento contable (solo contabilidad/super) */}
        {show('journal_preview') && (
          <button type="button" onClick={() => onActionClick?.('journal_preview')}
            className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
            title="Previsualizar asiento contable preliminar">
            <Scale size={14} className="text-[#7c3aed]" />
          </button>
        )}

        {/* Separador configuración */}
        {(show('layout_designer') || show('settings')) && (
          <div className="w-[1px] h-4 bg-[#b8b8b8] mx-1" />
        )}

        {/* 23. Diseñador de layout */}
        {show('layout_designer') && (
          <button type="button" onClick={() => onActionClick?.('layout_designer')}
            className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
            title="Diseñador de Layout / Plantillas de impresión">
            <LayoutTemplate size={14} className="text-[#0284c7]" />
          </button>
        )}

        {/* 24. Parametrizaciones */}
        {show('settings') && (
          <button type="button" onClick={() => onActionClick?.('settings')}
            className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition flex items-center gap-1 text-[#333]"
            title="Parametrizaciones de formulario (activar/ocultar columnas)">
            <Settings size={14} className="text-[#d97706]" />
          </button>
        )}

        {/* Separador ayuda */}
        <div className="w-[1px] h-4 bg-[#b8b8b8] mx-1" />

        {/* 25. Ayuda contextual */}
        {show('help') && (
          <button type="button" onClick={() => onActionClick?.('help')}
            className="p-1 hover:bg-[#e0e8f0] hover:border-[#70a0d0] border border-transparent rounded-xs transition text-[#333]"
            title="Ayuda de SAP Business One (F1)">
            <HelpCircle size={14} className="text-[#0284c7]" />
          </button>
        )}
      </div>

      {/* Cuadro de Búsqueda Rápida de Documentos (Idéntico a Imagen 4) */}
      <form onSubmit={handleSearchSubmit} className="flex items-center gap-1">
        <div className="relative flex items-center">
          <span className="absolute left-1.5 text-gray-400 text-[10px]">🔎</span>
          <input
            id="sap-quick-search-input"
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
