'use client';

import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  Search,
} from 'lucide-react';

interface Module {
  key: string;
  name: string;
  icon: string;
  screens: Array<{ id: string; name: string }>;
}

interface FinixModulesTreeProps {
  modules: Module[];
  onScreenSelect: (screenId: string, screenName: string, moduleKey?: string) => void;
}

// Iconografía oficial de módulos SAP B1
const SAP_MODULE_ICONS: Record<string, string> = {
  '01_Finanzas': '📈',
  '02_Ventas': '🏷️',
  '03_Compras': '🛒',
  '04_Inventario': '📦',
  '05_Produccion': '⚙️',
  '06_MRP': '📋',
  '07_Bancos': '💲',
  '08_Servicios': '🔧',
  '09_Reportes': '📊',
  '10_Consultas': '🗄️',
  '11_Admin': '📁',
  '12_Herramientas': '🛠️',
  '12_Oportunidades': '🎯',
  '13_CRM': '👥',
  'ecuador': '🇪🇨',
  'default': '📁',
};

export default function FinixModulesTree({ modules, onScreenSelect }: FinixModulesTreeProps) {
  // Por defecto, abrimos Ventas, Compras y Bancos
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(['02_Ventas', '03_Compras', '07_Bancos'])
  );
  const [activeTab, setActiveTab] = useState<'modulos' | 'arrastrar'>('modulos');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleModule = (moduleKey: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleKey)) {
      newExpanded.delete(moduleKey);
    } else {
      newExpanded.add(moduleKey);
    }
    setExpandedModules(newExpanded);
  };

  const filteredModules = modules.map(module => ({
    ...module,
    screens: module.screens.filter(screen =>
      screen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      screen.id.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(module => module.screens.length > 0 || !searchTerm);

  return (
    <aside aria-label="Menú principal de módulos" className="w-[240px] shrink-0 h-full bg-[#f4f7f9] border-r border-[#b8c9d4] flex flex-col font-[Tahoma,Arial,sans-serif] text-[11px] select-none shadow-sm">
      {/* Pestañas Superiores de SAP B1: Módulos | Arrastrar y vincular */}
      <div className="flex bg-[#e2ecf2] border-b border-[#b8c9d4] pt-1 px-1 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('modulos')}
          className={`px-3 py-1 text-[11px] font-bold rounded-t-xs border-t border-x cursor-pointer transition ${
            activeTab === 'modulos'
              ? 'bg-[#ffffff] text-[#003366] border-[#b8c9d4] border-b-transparent shadow-xs'
              : 'bg-[#d2e2ec] text-[#445566] border-transparent hover:bg-[#e0edf5]'
          }`}
        >
          Módulos
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('arrastrar')}
          className={`px-3 py-1 text-[11px] font-normal rounded-t-xs border-t border-x cursor-pointer transition ${
            activeTab === 'arrastrar'
              ? 'bg-[#ffffff] text-[#003366] border-[#b8c9d4] border-b-transparent shadow-xs'
              : 'bg-[#d2e2ec] text-[#445566] border-transparent hover:bg-[#e0edf5]'
          }`}
        >
          Arrastrar y vincular
        </button>
      </div>

      {/* Buscador Rápido de Transacciones */}
      <div className="p-1.5 bg-[#ffffff] border-b border-[#d8e3ea]">
        <div className="relative flex items-center">
          <Search size={12} className="absolute left-2 text-gray-400" />
          <input
            type="text"
            placeholder="Filtrar menú..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-6 pr-2 py-0.5 text-[11px] bg-[#f8fafc] border border-[#cbd5e1] rounded-xs text-[#1e293b] focus:outline-none focus:border-[#0055a5] focus:bg-white"
          />
        </div>
      </div>

      {/* Árbol de Carpetas y Transacciones Oficiales */}
      <div className="flex-1 overflow-y-auto bg-white p-1">
        {filteredModules.map((module) => {
          const isExpanded = expandedModules.has(module.key);
          const iconChar = SAP_MODULE_ICONS[module.key] || '📁';

          return (
            <div key={module.key} className="mb-0.5">
              {/* Encabezado del Módulo con Icono y Flechita */}
              <button
                type="button"
                onClick={() => toggleModule(module.key)}
                className={`w-full text-left px-1.5 py-1 rounded-xs flex items-center gap-1.5 cursor-pointer transition-colors ${
                  isExpanded ? 'bg-[#eef4f9] text-[#003366] font-bold' : 'hover:bg-[#f0f6fa] text-[#222]'
                }`}
              >
                <span className="text-[12px]">{iconChar}</span>
                <span className="truncate flex-1">{module.name}</span>
                <span className="text-[9px] text-[#6688aa] font-bold">
                  {isExpanded ? '▼' : '►'}
                </span>
              </button>

              {/* Sub-elementos con guión estilo oficial SAP B1 */}
              {isExpanded && (
                <div className="pl-5 pr-1 py-0.5 space-y-0.5 border-l border-dotted border-[#cbd5e1] ml-3 mt-0.5">
                  {module.screens.map((screen) => (
                    <button
                      type="button"
                      key={screen.id}
                      onClick={() => onScreenSelect(screen.id, screen.name, module.key)}
                      className="w-full text-left px-1.5 py-1 rounded-xs hover:bg-[#e1effa] hover:text-[#0055a5] text-[#333] transition-colors flex items-center gap-1.5 cursor-pointer group"
                      title={`${screen.name} (${screen.id})`}
                    >
                      <span className="text-gray-400 group-hover:text-[#0055a5] text-[10px]">—</span>
                      <span className="truncate flex-1 text-[11px]">{screen.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
