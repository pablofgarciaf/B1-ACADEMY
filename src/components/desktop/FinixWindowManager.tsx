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
  themeMode = 'classic',
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
        <div className="bg-[#d2e2ec] border-b border-[#b0c4de] flex items-center px-2 pt-1 gap-1 overflow-x-auto shrink-0 font-[Tahoma,Arial,sans-serif]">
          {windows.map((win) => {
            const isActive = activeWindow && activeWindow.id === win.id;
            return (
              <div
                key={win.id}
                onClick={() => onWindowFocus(win.id)}
                className={`flex items-center gap-1.5 px-3 py-1 text-[11px] rounded-t-xs cursor-pointer border-t border-x transition-all ${
                  isActive
                    ? 'bg-white text-[#003366] font-bold border-[#b0c4de] shadow-xs'
                    : 'bg-[#e2edf4] text-[#445566] border-transparent hover:bg-white/60'
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
                  className="w-3.5 h-3.5 rounded hover:bg-red-500 hover:text-white flex items-center justify-center text-[10px] text-slate-500 transition cursor-pointer"
                  title="Cerrar ventana (×)"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Contenedor Principal: La ventana MDI activa enmarcada y centrada */}
      <div className="flex-1 w-full h-full min-h-0 overflow-hidden flex flex-col p-2 sm:p-3">
        {activeWindow ? (
          <div className="w-full h-full max-w-6xl mx-auto flex flex-col overflow-hidden bg-white border border-[#9aaab7] rounded-sm shadow-xl animate-in fade-in duration-150">
            {/* Barra de Título Oficial de Ventana SAP B1 */}
            <div className="bg-[#e8ecf0] border-b border-[#c2ceda] text-[#1e293b] flex items-center justify-between px-3 py-1 select-none shrink-0 h-7 font-[Tahoma,Arial,sans-serif]">
              <div className="flex items-center gap-2 truncate">
                <span className="text-[#0055a5] text-xs font-bold">📄</span>
                <span className="text-xs text-[#0a246a] font-bold truncate">
                  {activeWindow.title}
                </span>
                {activeWindow.moduleName && (
                  <span className="text-[10px] text-gray-500 font-normal">
                    ({activeWindow.moduleName})
                  </span>
                )}
              </div>

              {/* Botones de Control de Ventana SAP B1: Minimizar, Maximizar, Cerrar */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="w-4 h-4 bg-[#e0e8f0] hover:bg-[#c8d8e8] border border-[#a8b8c8] text-[#333] text-[9px] font-bold flex items-center justify-center rounded-xs transition active:scale-95 cursor-pointer"
                  title="Minimizar ventana"
                >
                  _
                </button>
                <button
                  type="button"
                  className="w-4 h-4 bg-[#e0e8f0] hover:bg-[#c8d8e8] border border-[#a8b8c8] text-[#333] text-[9px] font-bold flex items-center justify-center rounded-xs transition active:scale-95 cursor-pointer"
                  title="Maximizar ventana"
                >
                  □
                </button>
                <button
                  type="button"
                  onClick={() => onWindowClose(activeWindow.id)}
                  className="w-4 h-4 bg-[#dc2626] hover:bg-red-600 border border-red-800 text-white text-[11px] font-black flex items-center justify-center rounded-xs transition active:scale-95 cursor-pointer shadow-xs ml-1"
                  title="Cerrar ventana (×)"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Contenido Funcional con Scroll Interno Limpio */}
            <div className="flex-1 min-h-0 overflow-y-auto bg-white p-2.5 sm:p-4">
              <FinixScreenRenderer
                screenId={activeWindow.screenId}
                screenName={activeWindow.title}
              />
            </div>
          </div>
        ) : (
          /* Estado Vacío: Lienzo Oficial de SAP Business One */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none">
            <div className="bg-white/70 backdrop-blur-xs border border-[#b8c9d4] rounded-sm p-6 shadow-md max-w-md text-left">
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
                Selecciona una transacción en el menú <strong>Módulos</strong> (a la izquierda) para abrir la ventana de trabajo correspondiente: Oferta de ventas, Orden de venta, Factura de deudores, etc.
              </p>
              <div className="bg-[#f0f7fa] border border-[#bae6fd] p-2 text-[10px] text-[#0369a1] rounded">
                💡 <strong>Consejo SAP B1:</strong> Puedes usar <code>Ctrl+F</code> para buscar registros o <code>Ctrl+A</code> para crear un documento nuevo en cualquier momento.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
