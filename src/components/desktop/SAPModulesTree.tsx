'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Search,
  DollarSign,
  ShoppingCart,
  Package,
  Box,
  Zap,
  TrendingUp,
  Building2,
  Briefcase,
  BarChart3,
  Code2,
  Settings,
  Wrench,
  Folder,
} from 'lucide-react';

interface Module {
  key: string;
  name: string;
  icon: string;
  screens: Array<{ id: string; name: string }>;
}

interface SAPModulesTreeProps {
  modules: Module[];
  onScreenSelect: (screenId: string, screenName: string) => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  DollarSign,
  ShoppingCart,
  Package,
  Box,
  Zap,
  TrendingUp,
  Building2,
  Briefcase,
  BarChart3,
  Code2,
  Settings,
  Wrench,
  Folder,
};

export default function SAPModulesTree({ modules, onScreenSelect }: SAPModulesTreeProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
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
    <div className="w-64 h-full bg-white border-r border-gray-300 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-bold text-gray-700 mb-3">MENÚ PRINCIPAL</h2>
        <div className="relative">
          <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Modules Tree */}
      <div className="flex-1 overflow-y-auto">
        {filteredModules.map((module) => {
          const isExpanded = expandedModules.has(module.key);
          const IconComponent = iconMap[module.icon] || Folder;

          return (
            <div key={module.key} className="border-b border-gray-100 last:border-0">
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.key)}
                className="w-full px-3 py-2 text-left text-xs font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  {isExpanded ? (
                    <ChevronDown size={14} className="text-gray-600" />
                  ) : (
                    <ChevronRight size={14} className="text-gray-600" />
                  )}
                </div>
                <IconComponent size={14} className="text-blue-600" />
                <span className="truncate">{module.name}</span>
              </button>

              {/* Screens */}
              {isExpanded && (
                <div className="bg-gray-50 py-1">
                  {module.screens.map((screen) => (
                    <button
                      key={screen.id}
                      onClick={() => onScreenSelect(screen.id, screen.name)}
                      className="w-full text-left px-8 py-1.5 text-xs text-gray-600 hover:bg-blue-100 hover:text-blue-800 transition"
                    >
                      <span className="truncate block">
                        <span className="text-gray-400 text-[10px]">[{screen.id}]</span> {screen.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50 text-[10px] text-gray-500">
        <p className="text-center">SAP Business One 10.0</p>
      </div>
    </div>
  );
}
