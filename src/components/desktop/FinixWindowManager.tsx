'use client';

import React from 'react';
import FinixScreenRenderer from '@/components/finix-screens/FinixScreenRenderer';

export interface Window {
  id: string;
  title: string;
  screenId: string;
  moduleKey?: string;
  moduleName?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized?: boolean;
  zIndex: number;
  focused: boolean;
}

interface FinixWindowManagerProps {
  windows: Window[];
  themeMode?: 'finix_horizon' | 'finix_fiori_3_dark' | 'classic';
  onWindowClose: (id: string) => void;
  onWindowMinimize?: (id: string) => void;
  onWindowMaximize?: (id: string) => void;
  onWindowFocus: (id: string) => void;
  onWindowMove?: (id: string, x: number, y: number) => void;
}

export default function FinixWindowManager({
  windows,
  themeMode = 'finix_horizon',
  onWindowClose,
  onWindowFocus,
}: FinixWindowManagerProps) {
  // Encontrar la ventana activa (focused), o la última abierta
  const activeWindow = windows.find(w => w.focused) || windows[windows.length - 1];

  const containerBg =
    themeMode === 'finix_horizon'
      ? 'bg-[#e8ecf2]'
      : themeMode === 'finix_fiori_3_dark'
      ? 'bg-[#0c121c]'
      : 'bg-[#334155]';

  const windowHeaderBg =
    themeMode === 'finix_horizon'
      ? 'bg-gradient-to-r from-[#0f2744] via-[#163860] to-[#0f2744] border-b border-[#0d1f35]'
      : themeMode === 'finix_fiori_3_dark'
      ? 'bg-gradient-to-r from-[#17212e] to-[#0f1722] border-b border-[#243347]'
      : 'bg-gradient-to-r from-[#003366] to-[#0055A5] border-b border-[#002244]';

  const windowContentBg =
    themeMode === 'finix_fiori_3_dark'
      ? 'bg-[#151d28] text-slate-100'
      : themeMode === 'finix_horizon'
      ? 'bg-[#fafbfc] text-slate-900'
      : 'bg-[#ECE9D8] text-slate-900';

  const tabsBarBg =
    themeMode === 'finix_fiori_3_dark'
      ? 'bg-[#111927] border-b border-[#243347]'
      : 'bg-[#dce3ec] border-b border-[#c2cedc]';

  return (
    <div
      id="window-container"
      className={`relative w-full h-full ${containerBg} overflow-hidden flex flex-col transition-colors duration-200 select-none`}
    >
      {/* Barra de Pestañas estilo VS Code / Navegador Cloud */}
      {windows.length > 0 && (
        <div className={`${tabsBarBg} flex items-center px-1 pt-1 gap-1 overflow-x-auto shrink-0 select-none`}>
          {windows.map((win) => {
            const isActive = activeWindow && activeWindow.id === win.id;
            return (
              <div
                key={win.id}
                onClick={() => onWindowFocus(win.id)}
                className={`group flex items-center gap-2 px-3 py-1.5 text-xs rounded-t cursor-pointer border-t-2 transition-all ${
                  isActive
                    ? themeMode === 'finix_fiori_3_dark'
                      ? 'bg-[#151d28] text-white border-blue-400 font-semibold shadow-sm'
                      : 'bg-[#fafbfc] text-slate-900 border-[#0055A5] font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 border-transparent hover:bg-white/40 hover:text-slate-900'
                }`}
                title={win.title}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-blue-500' : 'bg-slate-400'}`} />
                <span className="truncate max-w-[160px]">{win.title}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onWindowClose(win.id);
                  }}
                  className="w-4 h-4 rounded hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center text-[11px] text-slate-400 transition"
                  title="Cerrar pestaña (×)"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Contenedor Principal: La ventana activa ocupa el 100% a tamaño completo */}
      <div className="relative flex-1 w-full h-full min-h-0 overflow-hidden flex flex-col">
        {activeWindow ? (
          <div className="w-full h-full flex flex-col overflow-hidden">
            {/* Barra de Título: SOLO botón Cerrar (x), sin minimizar ni maximizar */}
            <div
              className={`flex items-center justify-between px-3 ${windowHeaderBg} text-white select-none shrink-0 h-8 shadow-sm`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-amber-400 text-xs">🐦‍🔥</span>
                <span className="text-xs text-blue-100 font-bold truncate tracking-wide">
                  {activeWindow.title}
                </span>
                {activeWindow.moduleName && (
                  <span className="text-[10px] text-blue-300/80 font-normal">
                    · {activeWindow.moduleName}
                  </span>
                )}
              </div>

              {/* Botón Único de Cierre (x) */}
              <button
                type="button"
                onClick={() => onWindowClose(activeWindow.id)}
                className="w-5 h-5 bg-[#dc2626] hover:bg-red-500 rounded-sm text-[12px] text-white font-extrabold flex items-center justify-center transition-all active:scale-95 shadow-sm"
                title="Cerrar pestaña (×)"
              >
                ×
              </button>
            </div>

            {/* Contenido Funcional de la Pantalla con Scroll Interno Completo */}
            <div className={`flex-1 min-h-0 overflow-auto ${windowContentBg}`}>
              <FinixScreenRenderer
                screenId={activeWindow.screenId}
                screenName={activeWindow.title}
              />
            </div>
          </div>
        ) : (
          /* Estado Vacío cuando no hay ventanas abiertas */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none text-slate-500">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/20 border border-blue-500/20 flex items-center justify-center mb-4 shadow-inner">
              <span className="text-3xl">🐦‍🔥</span>
            </div>
            <h2 className="text-base font-bold text-slate-700 dark:text-slate-200 mb-1">
              Escritorio de Finix ERP Cloud
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4">
              Selecciona una transacción o módulo en el menú lateral izquierdo para abrir su pantalla de trabajo.
            </p>
            <div className="text-[11px] text-slate-400 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded shadow-sm">
              💡 Cada pantalla se abre en pestañas superiores a tamaño completo para máxima visibilidad.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
