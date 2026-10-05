'use client';

import React, { useState, useCallback } from 'react';
import { X, Minus, Square } from 'lucide-react';
import SAPScreenRenderer from '@/components/sap-screens/SAPScreenRenderer';

interface Window {
  id: string;
  title: string;
  screenId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
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

    const window = windows.find(w => w.id === windowId);
    if (!window) return;

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

      newX = Math.max(0, Math.min(newX, containerRect.width - 300));
      newY = Math.max(0, Math.min(newY, containerRect.height - 100));

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
      className="relative w-full h-full bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden"
    >
      {/* Windows Rendering */}
      {windows.map((window) => (
        !window.minimized && (
          <div
            key={window.id}
            className="absolute bg-white border border-gray-300 shadow-xl rounded-sm flex flex-col"
            style={{
              left: `${window.x}px`,
              top: `${window.y}px`,
              width: `${window.width}px`,
              height: `${window.height}px`,
              zIndex: window.focused ? 1000 + window.zIndex : window.zIndex,
              cursor: draggingWindow === window.id ? 'grabbing' : 'auto',
            }}
            onMouseDown={() => onWindowFocus(window.id)}
          >
            {/* Drag Handle — barra de control de ventana */}
            <div
              className="flex items-center justify-between px-2 bg-[#1E2A3A] select-none cursor-grab active:cursor-grabbing shrink-0 border-b border-[#0D1B2A]"
              style={{ height: '28px' }}
              onMouseDown={(e) => handleMouseDown(e, window.id)}
            >
              <span className="text-[11px] text-blue-200 truncate font-semibold">{window.title}</span>
              <div className="flex gap-1">
                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); onWindowMinimize(window.id); }}
                  className="w-5 h-5 bg-yellow-500 hover:bg-yellow-300 rounded text-[9px] text-yellow-900 font-bold flex items-center justify-center transition-colors"
                  title="Minimizar"
                >
                  _
                </button>
                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); onWindowMaximize(window.id); }}
                  className="w-5 h-5 bg-green-600 hover:bg-green-400 rounded text-[9px] text-white font-bold flex items-center justify-center transition-colors"
                  title="Maximizar"
                >
                  □
                </button>
                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); onWindowClose(window.id); }}
                  className="w-5 h-5 bg-red-600 hover:bg-red-400 rounded text-[9px] text-white font-bold flex items-center justify-center transition-colors"
                  title="Cerrar (×)"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Contenido — réplica visual de la pantalla SAP */}
            <div className="flex-1 overflow-hidden">
              <SAPScreenRenderer
                screenId={window.screenId}
                screenName={window.title}
              />
            </div>
          </div>
        )
      ))}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-r from-gray-700 to-gray-600 border-t border-gray-500 flex items-center px-2 gap-2 overflow-x-auto">
        {windows
          .filter(w => w.minimized)
          .map((window) => (
            <button
              key={`taskbar-${window.id}`}
              onClick={() => {
                onWindowMinimize(window.id);
                onWindowFocus(window.id);
              }}
              className="px-3 py-2 bg-gray-500 hover:bg-gray-400 text-white text-xs rounded truncate max-w-xs transition"
            >
              {window.title}
            </button>
          ))}
      </div>
    </div>
  );
}
