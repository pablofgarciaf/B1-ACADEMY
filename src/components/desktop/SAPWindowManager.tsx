'use client';

import React, { useState } from 'react';
import { X, Minus, Square } from 'lucide-react';
import SAPScreenRenderer from '@/components/sap-screens/SAPScreenRenderer';

export interface Window {
  id: string;
  title: string;
  screenId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized?: boolean;
  zIndex: number;
  focused: boolean;
}

interface SAPWindowManagerProps {
  windows: Window[];
  onWindowClose: (id: string) => void;
  onWindowMinimize: (id: string) => void;
  onWindowMaximize: (id: string) => void;
  onWindowFocus: (id: string) => void;
  onWindowMove: (id: string, x: number, y: number) => void;
}

export default function SAPWindowManager({
  windows,
  onWindowClose,
  onWindowMinimize,
  onWindowMaximize,
  onWindowFocus,
  onWindowMove,
}: SAPWindowManagerProps) {
  const [draggingWindow, setDraggingWindow] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, windowId: string) => {
    if ((e.target as HTMLElement).closest('button')) return;

    const win = windows.find(w => w.id === windowId);
    if (!win || win.maximized) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDraggingWindow(windowId);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    onWindowFocus(windowId);
  };

  React.useEffect(() => {
    if (!draggingWindow) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = document.getElementById('window-container');
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      let newX = e.clientX - containerRect.left - dragOffset.x;
      let newY = e.clientY - containerRect.top - dragOffset.y;

      newX = Math.max(0, Math.min(newX, containerRect.width - 200));
      newY = Math.max(0, Math.min(newY, containerRect.height - 80));

      onWindowMove(draggingWindow, newX, newY);
    };

    const handleMouseUp = () => {
      setDraggingWindow(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingWindow, dragOffset, onWindowMove]);

  return (
    <div
      id="window-container"
      className="relative w-full h-full bg-[#334155] overflow-hidden flex flex-col"
    >
      {/* Contenedor de Ventanas */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {windows.map((win) => (
          !win.minimized && (
            <div
              key={win.id}
              className={`absolute bg-[#f7f8fa] border border-[#7f93ab] shadow-2xl flex flex-col transition-all duration-75 ${
                win.maximized ? 'inset-0 w-full h-full rounded-none' : 'rounded-sm'
              }`}
              style={{
                left: win.maximized ? 0 : `${win.x}px`,
                top: win.maximized ? 0 : `${win.y}px`,
                width: win.maximized ? '100%' : `${win.width}px`,
                height: win.maximized ? '100%' : `${win.height}px`,
                zIndex: win.focused ? 1000 + win.zIndex : win.zIndex,
                cursor: draggingWindow === win.id ? 'grabbing' : 'auto',
              }}
              onMouseDown={() => onWindowFocus(win.id)}
            >
              {/* Barra de Título Única de la Ventana en SAP B1 */}
              <div
                className="flex items-center justify-between px-2.5 bg-gradient-to-b from-[#1e2a3a] to-[#0f172a] text-white select-none cursor-grab active:cursor-grabbing shrink-0 border-b border-[#0d1b2a]"
                style={{ height: '30px' }}
                onMouseDown={(e) => handleMouseDown(e, win.id)}
              >
                <span className="text-xs text-blue-100 font-bold truncate tracking-wide">
                  {win.title}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => { e.stopPropagation(); onWindowMinimize(win.id); }}
                    className="w-5 h-5 bg-[#eab308] hover:bg-yellow-400 rounded-sm text-[10px] text-slate-950 font-extrabold flex items-center justify-center transition-all active:scale-95 shadow-sm"
                    title="Minimizar a la barra inferior"
                  >
                    _
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => { e.stopPropagation(); onWindowMaximize(win.id); }}
                    className="w-5 h-5 bg-[#16a34a] hover:bg-emerald-500 rounded-sm text-[10px] text-white font-extrabold flex items-center justify-center transition-all active:scale-95 shadow-sm"
                    title={win.maximized ? 'Restaurar tamaño' : 'Maximizar al área disponible'}
                  >
                    {win.maximized ? '❐' : '□'}
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => { e.stopPropagation(); onWindowClose(win.id); }}
                    className="w-5 h-5 bg-[#dc2626] hover:bg-red-500 rounded-sm text-[11px] text-white font-extrabold flex items-center justify-center transition-all active:scale-95 shadow-sm"
                    title="Cerrar ventana (×)"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Contenido funcional de la ventana */}
              <div className="flex-1 overflow-auto bg-[#ECE9D8]">
                <SAPScreenRenderer
                  screenId={win.screenId}
                  screenName={win.title}
                />
              </div>
            </div>
          )
        ))}
      </div>

      {/* Taskbar de ventanas minimizadas */}
      {windows.some(w => w.minimized) && (
        <div className="h-9 bg-[#1e293b] border-t border-[#475569] flex items-center px-2 gap-2 overflow-x-auto shrink-0">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Minimizadas:</span>
          {windows
            .filter(w => w.minimized)
            .map((win) => (
              <button
                key={`taskbar-${win.id}`}
                onClick={() => {
                  onWindowMinimize(win.id);
                  onWindowFocus(win.id);
                }}
                className="px-3 py-1 bg-[#334155] hover:bg-[#475569] text-white text-xs font-semibold rounded border border-[#64748b] truncate max-w-xs transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Square className="w-3 h-3 text-amber-400" />
                {win.title}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
