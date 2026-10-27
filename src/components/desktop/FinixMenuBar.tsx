'use client';

import React, { useState } from 'react';

interface FinixMenuBarProps {
  onActionClick?: (action: string) => void;
  onOpenModulesTree?: () => void;
}

export default function FinixMenuBar({ onActionClick, onOpenModulesTree }: FinixMenuBarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const menus: Record<string, { label: string; shortcut?: string }[]> = {
    archivo: [
      { label: 'Nuevo documento', shortcut: 'Ctrl+N' },
      { label: 'Abrir', shortcut: 'Ctrl+O' },
      { label: 'Guardar', shortcut: 'Ctrl+S' },
      { label: 'Guardar como...', shortcut: 'Ctrl+Shift+S' },
      { label: '-' },
      { label: 'Cerrar documento', shortcut: 'Ctrl+F4' },
      { label: '-' },
      { label: 'Salir de Finix ERP', shortcut: 'Alt+F4' },
    ],
    edicion: [
      { label: 'Deshacer', shortcut: 'Ctrl+Z' },
      { label: 'Rehacer', shortcut: 'Ctrl+Y' },
      { label: '-' },
      { label: 'Cortar', shortcut: 'Ctrl+X' },
      { label: 'Copiar', shortcut: 'Ctrl+C' },
      { label: 'Pegar', shortcut: 'Ctrl+V' },
      { label: '-' },
      { label: 'Seleccionar todo', shortcut: 'Ctrl+E' },
    ],
    visualizar: [
      { label: 'Barra de herramientas' },
      { label: 'Barra de estado' },
      { label: 'Menú principal (Módulos)', shortcut: 'Ctrl+0' },
      { label: '-' },
      { label: 'Refrescar datos', shortcut: 'F5' },
      { label: 'Pantalla completa', shortcut: 'F11' },
    ],
    datos: [
      { label: 'Añadir registro', shortcut: 'Ctrl+A' },
      { label: 'Buscar registro', shortcut: 'Ctrl+F' },
      { label: '-' },
      { label: 'Primer registro de datos', shortcut: 'Ctrl+Inicio' },
      { label: 'Registro anterior', shortcut: 'Ctrl+PgUp' },
      { label: 'Registro siguiente', shortcut: 'Ctrl+PgDn' },
      { label: 'Último registro de datos', shortcut: 'Ctrl+Fin' },
      { label: '-' },
      { label: 'Filtrar tabla...', shortcut: 'Ctrl+Shift+F' },
    ],
    pasara: [
      { label: 'Pestaña Contenido', shortcut: 'Alt+1' },
      { label: 'Pestaña Logística', shortcut: 'Alt+2' },
      { label: 'Pestaña Finanzas', shortcut: 'Alt+3' },
      { label: 'Pestaña Anexos', shortcut: 'Alt+4' },
      { label: '-' },
      { label: 'Asiento contable preliminar' },
      { label: 'Mapa de relaciones del documento' },
    ],
    modulos: [
      { label: 'Gestión' },
      { label: 'Finanzas' },
      { label: 'Oportunidades' },
      { label: 'Ventas - Clientes' },
      { label: 'Compras - Proveedores' },
      { label: 'Socios de Negocios' },
      { label: 'Gestión de Bancos' },
      { label: 'Inventario' },
      { label: 'Producción' },
      { label: 'Informes' },
    ],
    herramientas: [
      { label: 'Parametrizaciones de formulario' },
      { label: 'Diseñador de layouts e informes' },
      { label: '-' },
      { label: 'Query Manager (Consultas SQL)' },
      { label: 'Registro de modificaciones (Log de auditoría)' },
    ],
    ventana: [
      { label: 'Cascada' },
      { label: 'Mosaico horizontal' },
      { label: 'Mosaico vertical' },
      { label: '-' },
      { label: 'Cerrar todas las ventanas' },
    ],
    ayuda: [
      { label: 'Ayuda de Finix ERP (Tutor FeNi)', shortcut: 'F1' },
      { label: 'Manuales oficiales de SAP B1' },
      { label: '-' },
      { label: 'Acerca de Finix ERP Cloud' },
    ],
  };

  const menuTitles: Record<string, string> = {
    archivo: 'Archivo',
    edicion: 'Editar',
    visualizar: 'Visualizar',
    datos: 'Datos',
    pasara: 'Pasar a',
    modulos: 'Módulos',
    herramientas: 'Herramientas',
    ventana: 'Ventana',
    ayuda: 'Ayuda',
  };

  const handleMenuClick = (menuKey: string) => {
    setOpenMenu(openMenu === menuKey ? null : menuKey);
  };

  return (
    <>
      <div className="bg-[#f0f0f0] border-b border-[#d0d0d0] flex items-center h-[22px] px-1 select-none font-[Tahoma,Arial,sans-serif] text-[11px] text-[#222]">
        {Object.entries(menus).map(([menuKey, items]) => (
          <div key={menuKey} className="relative">
            <button
              type="button"
              onClick={() => handleMenuClick(menuKey)}
              className={`px-2.5 py-0.5 text-[11px] font-normal rounded-xs transition-colors cursor-pointer ${
                openMenu === menuKey
                  ? 'bg-[#3399ff] text-white'
                  : 'hover:bg-[#e5f1fb] hover:text-[#000]'
              }`}
            >
              {menuTitles[menuKey] || menuKey}
            </button>

            {/* Menú desplegable estilo clásico SAP */}
            {openMenu === menuKey && (
              <div className="absolute top-full left-0 bg-[#f9f9f9] border border-[#7f9db9] shadow-md z-50 min-w-56 py-0.5 font-[Tahoma,Arial,sans-serif] text-[11px]">
                {items.map((item, idx) => (
                  <div key={idx}>
                    {item.label === '-' ? (
                      <div className="h-[1px] bg-[#d0d0d0] my-1 mx-2" />
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (menuKey === 'visualizar' && item.label.includes('Menú principal')) {
                            onOpenModulesTree?.();
                          }
                          onActionClick?.(item.label);
                          setOpenMenu(null);
                        }}
                        className="w-full text-left px-4 py-1 text-[11px] text-[#222] hover:bg-[#3399ff] hover:text-white transition-colors flex justify-between items-center cursor-pointer"
                      >
                        <span>{item.label}</span>
                        {item.shortcut && (
                          <span className="text-[#888] group-hover:text-white text-[10px] ml-4 font-mono">
                            {item.shortcut}
                          </span>
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

      {openMenu && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setOpenMenu(null)}
        />
      )}
    </>
  );
}
