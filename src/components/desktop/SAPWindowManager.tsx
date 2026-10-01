'use client';

import React, { useState, useCallback } from 'react';
import { X, Minus, Square } from 'lucide-react';

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
            {/* Title Bar */}
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 flex items-center justify-between cursor-grab active:cursor-grabbing select-none"
              onMouseDown={(e) => handleMouseDown(e, window.id)}
            >
              <span className="text-sm font-semibold truncate">{window.title}</span>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => onWindowMinimize(window.id)}
                  className="hover:bg-blue-700 p-1 rounded transition"
                  title="Minimizar"
                >
                  <Minus size={14} />
                </button>
                <button
                  onClick={() => onWindowMaximize(window.id)}
                  className="hover:bg-blue-700 p-1 rounded transition"
                  title="Maximizar"
                >
                  <Square size={14} />
                </button>
                <button
                  onClick={() => onWindowClose(window.id)}
                  className="hover:bg-red-600 p-1 rounded transition"
                  title="Cerrar"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Window Content */}
            <div className="flex-1 overflow-auto bg-gray-50 p-4">
              <div className="text-center text-gray-500 text-sm">
                <p>Pantalla: {window.screenId}</p>
                <p className="mt-2">Contenido del módulo SAP B1</p>
              </div>
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
