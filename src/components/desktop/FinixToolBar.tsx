'use client';

import React from 'react';
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Printer,
  Settings,
} from 'lucide-react';

interface FinixToolBarProps {
  onActionClick?: (action: string) => void;
}

export default function FinixToolBar({ onActionClick }: FinixToolBarProps) {
  const tools = [
    { id: 'add', icon: Plus, label: 'Añadir (Ctrl+A)', tooltip: 'Crear nuevo documento' },
    { id: 'search', icon: Search, label: 'Buscar (Ctrl+F)', tooltip: 'Buscar registro' },
    { id: 'separator1', type: 'separator' },
    { id: 'first', icon: ChevronsLeft, label: 'Primero', tooltip: 'Ir al primer registro' },
    { id: 'previous', icon: ChevronLeft, label: 'Anterior', tooltip: 'Registro anterior' },
    { id: 'next', icon: ChevronRight, label: 'Siguiente', tooltip: 'Siguiente registro' },
    { id: 'last', icon: ChevronsRight, label: 'Último', tooltip: 'Ir al último registro' },
    { id: 'separator2', type: 'separator' },
    { id: 'print', icon: Printer, label: 'Imprimir (Ctrl+P)', tooltip: 'Imprimir documento' },
    { id: 'settings', icon: Settings, label: 'Parametrizaciones', tooltip: 'Configuración de formulario' },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-50 border-b border-gray-300 flex items-center h-10 px-2 gap-1">
      {tools.map((tool) => {
        if (tool.type === 'separator') {
          return <div key={tool.id} className="w-px h-6 bg-gray-300 mx-1" />;
        }

        const IconComponent = tool.icon as React.ComponentType<{ size: number; className?: string }>;

        return (
          <button
            key={tool.id}
            onClick={() => onActionClick?.(tool.id)}
            className="p-2 hover:bg-blue-100 rounded transition group relative"
            title={tool.tooltip}
          >
            <IconComponent size={18} className="text-gray-700 group-hover:text-blue-700" />

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
              {tool.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export { FinixToolBar as SAPToolBar };
