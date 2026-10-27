'use client';

import React from 'react';
import FinixScreenRenderer from '@/components/finix-screens/FinixScreenRenderer';
import { FinixUIThemeContext } from '@/components/finix-screens/FinixControls';

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
  themeMode?: 'finix_horizon' | 'finix_fiori_3_dark' | 'classic' | 'fiori';
  onWindowClose: (id: string) => void;
  onWindowMinimize?: (id: string) => void;
  onWindowMaximize?: (id: string) => void;
  onWindowFocus: (id: string) => void;
  onWindowMove?: (id: string, x: number, y: number) => void;
}

export default function FinixWindowManager({
  windows,
  onWindowClose,
  onWindowFocus,
}: FinixWindowManagerProps) {
  const activeWindow = windows.find(w => w.focused) || windows[windows.length - 1];

  // Lienzo oficial de escritorio SAP Business One (Gradiente Cyan-Teal idéntico a GenPyme)
  const sapDesktopBg = 'bg-gradient-to-br from-[#cde7f0] via-[#e2f2f7] to-[#d4ebf3]';

  return (
    <div
      id="window-container"
      className={`relative w-full h-full ${sapDesktopBg} overflow-hidden flex flex-col select-none`}
    >
      {/* Barra de Pestañas de Ventanas Abiertas */}
      {windows.length > 0 && (
        <div className="bg-[#d2e2ec]/90 backdrop-blur-xs border-b border-[#b0c4de] flex items-center px-2 pt-1 gap-1 overflow-x-auto shrink-0 font-[Tahoma,Arial,sans-serif]">
          {windows.map((win) => {
            const isActive = activeWindow && activeWindow.id === win.id;
            return (
              <div
                key={win.id}
                onClick={() => onWindowFocus(win.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-t-md cursor-pointer border-t border-x transition-all ${
                  isActive
                    ? 'bg-white text-[#003366] font-bold border-[#9fb4c7] shadow-xs -mb-px'
                    : 'bg-[#e2edf4] text-[#445566] border-transparent hover:bg-white/70'
                }`}
                title={win.title}
              >
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#0070d2]' : 'bg-slate-400'}`} />
                <span className="truncate max-w-[170px]">{win.title}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onWindowClose(win.id);
                  }}
                  className="w-4 h-4 rounded hover:bg-red-500 hover:text-white flex items-center justify-center text-[11px] text-slate-500 transition cursor-pointer ml-1"
                  title="Cerrar ventana (×)"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Contenedor Principal: La ventana MDI activa con acabado profesional Fiori / Horizon */}
      <div className="flex-1 w-full h-full min-h-0 overflow-hidden flex flex-col p-2 sm:p-4">
        {activeWindow ? (
          <div className="w-full h-full max-w-6xl mx-auto flex flex-col overflow-hidden bg-white border border-slate-300 rounded-xl shadow-2xl animate-in fade-in duration-150">
            {/* Barra de Título Fiori / SAP B1 con Estilo Horizon */}
            <div className="bg-gradient-to-r from-[#002b5c] via-[#004b96] to-[#0055A5] text-white flex items-center justify-between px-3.5 py-2 select-none shrink-0 shadow-xs">
              <div className="flex items-center gap-2 truncate">
                <span className="bg-white/15 px-2 py-0.5 rounded text-[11px] font-bold text-white flex items-center gap-1 shadow-inner">
                  <span>📄</span>
                  <span>{activeWindow.screenId}</span>
                </span>
                <span className="text-xs sm:text-sm font-bold text-white truncate tracking-wide">
                  {activeWindow.title}
                </span>
                {activeWindow.moduleName && (
                  <span className="hidden sm:inline-block bg-blue-300/20 text-blue-100 text-[10px] px-2 py-0.5 rounded border border-blue-300/30 font-medium">
                    {activeWindow.moduleName}
                  </span>
                )}
              </div>

              {/* Botones de Control de Ventana */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="w-5 h-5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[10px] font-bold flex items-center justify-center rounded transition active:scale-95 cursor-pointer"
                  title="Minimizar ventana"
                >
                  _
                </button>
                <button
                  type="button"
                  className="w-5 h-5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[10px] font-bold flex items-center justify-center rounded transition active:scale-95 cursor-pointer"
                  title="Maximizar ventana"
                >
                  □
                </button>
                <button
                  type="button"
                  onClick={() => onWindowClose(activeWindow.id)}
                  className="w-5 h-5 bg-red-600/90 hover:bg-red-600 border border-red-400 text-white text-[12px] font-black flex items-center justify-center rounded transition active:scale-95 cursor-pointer shadow-xs ml-1"
                  title="Cerrar ventana (×)"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Contenido Funcional con Tema Fiori Moderno y Scroll Fluido */}
            <div className="flex-1 min-h-0 overflow-y-auto bg-slate-50/40 p-2 sm:p-4">
              <FinixUIThemeContext.Provider value="fiori">
                <div className="finix-fiori-mode">
                  <FinixScreenRenderer
                    screenId={activeWindow.screenId}
                    screenName={activeWindow.title}
                  />
                </div>
              </FinixUIThemeContext.Provider>
            </div>
          </div>
        ) : (
          /* Estado Vacío: Lienzo Oficial de SAP Business One */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none">
            <div className="bg-white/80 backdrop-blur-md border border-[#b8c9d4] rounded-xl p-6 shadow-xl max-w-md text-left">
              <div className="flex items-center justify-between border-b border-[#cbd5e1] pb-2 mb-3">
                <span className="text-xs font-bold text-[#0a246a] tracking-wide">
                  Información de conexión
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-[#0055a5] text-white rounded">
                  SAP Business One
                </span>
              </div>
              <p className="text-[11px] text-gray-700 leading-relaxed mb-2">
                Conectada aplicación para <strong>B1 Center S.A.S.</strong> (Matriz).
              </p>
              <p className="text-[10.5px] text-gray-500 mb-4">
                Selecciona una transacción en el menú <strong>Módulos</strong> (a la izquierda) para abrir la ventana de trabajo correspondiente: Oferta de ventas, Pedido de venta, Factura de deudores, etc.
              </p>
              <div className="bg-[#f0f7fa] border border-[#bae6fd] p-2.5 text-[10.5px] text-[#0369a1] rounded-lg">
                💡 <strong>Consejo SAP B1:</strong> Puedes usar <code>Ctrl+F</code> para buscar registros o <code>Ctrl+A</code> para crear un documento nuevo en cualquier momento.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
