'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SAPMenuBarProps {
  onActionClick?: (action: string) => void;
}

export default function SAPMenuBar({ onActionClick }: SAPMenuBarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const menus = {
    archivo: [
      { label: 'Nuevo', shortcut: 'Ctrl+N' },
      { label: 'Abrir', shortcut: 'Ctrl+O' },
      { label: 'Guardar', shortcut: 'Ctrl+S' },
      { label: 'Guardar Como...', shortcut: 'Ctrl+Shift+S' },
      { label: '-' },
      { label: 'Salir', shortcut: 'Alt+F4' },
    ],
    edicion: [
      { label: 'Deshacer', shortcut: 'Ctrl+Z' },
      { label: 'Rehacer', shortcut: 'Ctrl+Y' },
      { label: '-' },
      { label: 'Cortar', shortcut: 'Ctrl+X' },
      { label: 'Copiar', shortcut: 'Ctrl+C' },
      { label: 'Pegar', shortcut: 'Ctrl+V' },
      { label: '-' },
      { label: 'Buscar', shortcut: 'Ctrl+F' },
    ],
    ver: [
      { label: 'Barra de Herramientas' },
      { label: 'Barra de Estado' },
      { label: '-' },
      { label: 'Refrescar', shortcut: 'F5' },
      { label: 'Pantalla Completa', shortcut: 'F11' },
    ],
    datos: [
      { label: 'Añadir Registro', shortcut: 'Ctrl+A' },
      { label: 'Duplicar Registro', shortcut: 'Ctrl+D' },
      { label: 'Eliminar Registro', shortcut: 'Supr' },
      { label: '-' },
      { label: 'Buscar Registro', shortcut: 'Ctrl+F' },
      { label: 'Filtrar', shortcut: 'Ctrl+Shift+F' },
    ],
    ira: [
      { label: 'Primero', shortcut: 'Ctrl+Inicio' },
      { label: 'Anterior', shortcut: 'Ctrl+Arriba' },
      { label: 'Siguiente', shortcut: 'Ctrl+Abajo' },
      { label: 'Último', shortcut: 'Ctrl+Fin' },
    ],
    herramientas: [
      { label: 'Generador de Reportes' },
      { label: 'Query Manager' },
      { label: 'Importador de Datos' },
      { label: 'Exportador de Datos' },
      { label: '-' },
      { label: 'Parametrizaciones' },
    ],
    ventana: [
      { label: 'Cascada' },
      { label: 'Mosaico Horizontal' },
      { label: 'Mosaico Vertical' },
      { label: '-' },
      { label: 'Cerrar Todo' },
    ],
    ayuda: [
      { label: 'Ayuda de SAP B1', shortcut: 'F1' },
      { label: 'Acerca de SAP B1' },
    ],
  };

  const handleMenuClick = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  return (
    <>
      {/* Menu Bar */}
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-300 flex items-center h-7">
        {Object.entries(menus).map(([menuName, items]) => (
          <div key={menuName} className="relative">
            <button
              onClick={() => handleMenuClick(menuName)}
              className="px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-blue-200 transition capitalize"
            >
              {menuName === 'ira' ? 'Ir a' : menuName.charAt(0).toUpperCase() + menuName.slice(1)}
            </button>

            {/* Dropdown Menu */}
            {openMenu === menuName && (
              <div className="absolute top-full left-0 bg-white border border-gray-300 shadow-lg z-50 min-w-56">
                {items.map((item, idx) => (
                  <div key={idx}>
                    {item.label === '-' ? (
                      <div className="h-px bg-gray-200 my-1" />
                    ) : (
                      <button
                        onClick={() => {
                          onActionClick?.(item.label);
                          setOpenMenu(null);
                        }}
                        className="w-full text-left px-4 py-1.5 text-xs text-gray-700 hover:bg-blue-500 hover:text-white transition flex justify-between items-center"
                      >
                        <span>{item.label}</span>
                        {'shortcut' in item && item.shortcut && (
                          <span className="text-gray-400 hover:text-white text-[10px]">{item.shortcut}</span>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Click outside to close menu */}
      {openMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpenMenu(null)}
        />
      )}
    </>
  );
}
