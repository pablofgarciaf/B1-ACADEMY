'use client';

import React, { useState, useEffect } from 'react';
import SAPMenuBar from './SAPMenuBar';
import SAPToolBar from './SAPToolBar';
import SAPModulesTree from './SAPModulesTree';
import SAPWindowManager from './SAPWindowManager';
import SimuladorAIAdvisor from '../simulador/SimuladorAIAdvisor';

interface Module {
  key: string;
  name: string;
  icon: string;
  screens: Array<{ id: string; name: string }>;
}

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

interface SAPDesktopShellProps {
  catalog: {
    modules: Record<string, Module>;
    metadata: { total_screens: number; total_modules: number };
  };
}

export default function SAPDesktopShell({ catalog }: SAPDesktopShellProps) {
  const [windows, setWindows] = useState<Window[]>([]);
  const [windowCount, setWindowCount] = useState(0);
  const [nextZIndex, setNextZIndex] = useState(1);

  const modules = Object.values(catalog.modules || {});

  const createWindow = (screenId: string, screenName: string) => {
    const newWindow: Window = {
      id: `window-${windowCount}`,
      title: screenName,
      screenId,
      x: 50 + windowCount * 30,
      y: 50 + windowCount * 30,
      width: 600,
      height: 400,
      minimized: false,
      zIndex: nextZIndex,
      focused: true,
    };

    setWindows(prev => {
      const updated = prev.map(w => ({ ...w, focused: false }));
      return [...updated, newWindow];
    });

    setWindowCount(windowCount + 1);
    setNextZIndex(nextZIndex + 1);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, minimized: !w.minimized } : w))
    );
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, width: 800, height: 500 } : w))
    );
  };

  const focusWindow = (id: string) => {
    setWindows(prev => {
      const window = prev.find(w => w.id === id);
      if (!window) return prev;

      return prev.map(w => ({
        ...w,
        focused: w.id === id,
        zIndex: w.id === id ? nextZIndex : w.zIndex,
      }));
    });
    setNextZIndex(nextZIndex + 1);
  };

  const moveWindow = (id: string, x: number, y: number) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, x, y } : w))
    );
  };

  const handleMenuAction = (action: string) => {
    console.log('Menu action:', action);
    // Implement menu actions as needed
  };

  const handleToolAction = (action: string) => {
    console.log('Tool action:', action);
    // Implement toolbar actions as needed
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-900 overflow-hidden">
      {/* Window Title Bar */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-4 py-2 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">SAP Business One 10.0 (HANA)</h1>
          <p className="text-xs text-blue-100">Academia Virtual - Simulador Integral</p>
        </div>
        <div className="text-right text-xs text-blue-100">
          <p>Empresa Demo | Usuario: Estudiante</p>
          <p>Pantallas: {windows.length} | Total en Catálogo: {catalog.metadata.total_screens}</p>
        </div>
      </div>

      {/* Menu Bar */}
      <SAPMenuBar onActionClick={handleMenuAction} />

      {/* Tool Bar */}
      <SAPToolBar onActionClick={handleToolAction} />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Modules Tree */}
        <SAPModulesTree modules={modules} onScreenSelect={createWindow} />

        {/* Desktop Area with Windows */}
        <SAPWindowManager
          windows={windows}
          onWindowClose={closeWindow}
          onWindowMinimize={minimizeWindow}
          onWindowMaximize={maximizeWindow}
          onWindowFocus={focusWindow}
          onWindowMove={moveWindow}
        />
      </div>

      {/* Status Bar */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white text-xs px-4 py-2 flex items-center justify-between border-t border-gray-500">
        <div>
          <span className="text-green-400 mr-4">● Conectado a Base de Datos</span>
          <span>Último cambio: Ahora</span>
        </div>
        <div>
          <span>F1 Ayuda | Ctrl+F Buscar | Esc Cancelar</span>
        </div>
      </div>

      {/* AI Advisor */}
      <SimuladorAIAdvisor
        currentScreen={windows[windows.length - 1]?.title || 'Dashboard'}
        currentModule={Object.keys(catalog.modules)[0] || 'Finanzas'}
        isOpen={false}
      />
    </div>
  );
}
