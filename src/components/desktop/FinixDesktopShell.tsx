'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCompany } from '@/hooks/useCompany';
import { ShieldAlert, Shield, Building2 } from 'lucide-react';
import { LISTA_SIETE_EMPRESAS, empresaActiva, cambiarEmpresaActiva } from '@/lib/firestore-company';
import FinixMenuBar from './FinixMenuBar';
import FinixToolBar from './FinixToolBar';
import FinixModulesTree from './FinixModulesTree';
import FinixWindowManager, { Window } from './FinixWindowManager';
import SimuladorAIAdvisor from '../simulador/SimuladorAIAdvisor';

export type FinixRole = 'super' | 'ventas' | 'compras' | 'contabilidad' | 'almacen';
export type SAPRole = FinixRole;

export interface FinixRoleDefinition {
  id: FinixRole;
  label: string;
  prefix: string;
  department: string;
  description: string;
  allowedModuleKeys: string[];
}
export type SAPRoleDefinition = FinixRoleDefinition;

export const FINIX_ROLES: Record<FinixRole, FinixRoleDefinition> = {
  super: {
    id: 'super',
    label: 'Superusuario (manager)',
    prefix: 'super.',
    department: 'Dirección General / IT',
    description: 'Acceso total y sin restricciones a todos los módulos y definiciones de Finix ERP.',
    allowedModuleKeys: ['*'],
  },
  ventas: {
    id: 'ventas',
    label: 'Ejecutivo de Ventas',
    prefix: 'ventas.',
    department: 'Comercial & CRM',
    description: 'Acceso a Ofertas, Pedidos, Facturación de Clientes y Oportunidades CRM.',
    allowedModuleKeys: ['02_Ventas', '13_CRM', '08_Servicios', '09_Reportes'],
  },
  compras: {
    id: 'compras',
    label: 'Comprador / Abastecimiento',
    prefix: 'compras.',
    department: 'Logística & Compras',
    description: 'Acceso a Solicitudes de Compra, Pedidos, Recepciones y Costos de Importación.',
    allowedModuleKeys: ['03_Compras', '09_Reportes'],
  },
  contabilidad: {
    id: 'contabilidad',
    label: 'Contador General',
    prefix: 'contabilidad.',
    department: 'Finanzas & Contabilidad',
    description: 'Libros contables, asientos, tesorería, activos fijos, cierres e impuestos SRI.',
    allowedModuleKeys: ['01_Finanzas', '07_Bancos', '10_Consultas', 'ecuador', '09_Reportes'],
  },
  almacen: {
    id: 'almacen',
    label: 'Jefe de Bodega / Inventario',
    prefix: 'almacen.',
    department: 'Operaciones & Producción',
    description: 'Inventario físico, artículos, transferencias, recetas BOM y manufactura.',
    allowedModuleKeys: ['04_Inventario', '05_Produccion', '06_MRP', '09_Reportes'],
  },
};
export const SAP_ROLES = FINIX_ROLES;

interface Module {
  key: string;
  name: string;
  icon: string;
  screens: Array<{ id: string; name: string }>;
}

interface FinixDesktopShellProps {
  catalog: {
    modules: Record<string, Module>;
    metadata: { total_screens: number; total_modules: number };
  };
}
export type SAPDesktopShellProps = FinixDesktopShellProps;

export default function FinixDesktopShell({ catalog }: FinixDesktopShellProps) {
  const { userProfile, currentUser } = useAuth();
  const company = useCompany();
  const [windows, setWindows] = useState<Window[]>([]);
  const [windowCount, setWindowCount] = useState(0);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [activeRole, setActiveRole] = useState<FinixRole>('super');
  const [themeMode, setThemeMode] = useState<'sap_horizon' | 'sap_fiori_3_dark' | 'classic'>('sap_horizon');
  const [activeSlot, setActiveSlot] = useState<string>('curso');
  useEffect(() => {
    setActiveSlot(empresaActiva());
    const onSlotChange = () => setActiveSlot(empresaActiva());
    window.addEventListener('finix-company-changed', onSlotChange);
    window.addEventListener('sap-company-changed', onSlotChange);
    return () => {
      window.removeEventListener('finix-company-changed', onSlotChange);
      window.removeEventListener('sap-company-changed', onSlotChange);
    };
  }, []);
  const [unauthorizedModal, setUnauthorizedModal] = useState<{
    screenName: string;
    moduleKey: string;
    moduleName: string;
    suggestedRole: FinixRole;
  } | null>(null);

  const [systemTime, setSystemTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(now.toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const modules = Object.values(catalog.modules || {});
  const baseEmail = userProfile?.email || currentUser?.email || 'estudiante@finix.ec';
  const currentRoleDef = FINIX_ROLES[activeRole];
  const simulatedEmail = `${currentRoleDef.prefix}${baseEmail}`;
  const companyTitle = company.data.profile?.companyName || 'Finix Center';

  const isModuleAuthorized = (moduleKey?: string): boolean => {
    if (!moduleKey || activeRole === 'super') return true;
    const allowed = currentRoleDef.allowedModuleKeys;
    if (allowed.includes('*')) return true;
    return allowed.includes(moduleKey);
  };

  const getSuggestedRoleForModule = (moduleKey?: string): FinixRole => {
    if (!moduleKey) return 'super';
    for (const [rKey, rDef] of Object.entries(FINIX_ROLES) as [FinixRole, FinixRoleDefinition][]) {
      if (rDef.allowedModuleKeys.includes(moduleKey)) return rKey;
    }
    return 'super';
  };

  const createWindow = (screenId: string, screenName: string, moduleKey?: string) => {
    // Verificación de autorizaciones por rol Finix ERP
    if (!isModuleAuthorized(moduleKey)) {
      const mod = modules.find(m => m.key === moduleKey);
      setUnauthorizedModal({
        screenName,
        moduleKey: moduleKey || 'Módulo',
        moduleName: mod?.name || moduleKey || 'Módulo',
        suggestedRole: getSuggestedRoleForModule(moduleKey),
      });
      return;
    }

    const existingWindow = windows.find(w => w.screenId === screenId);
    if (existingWindow) {
      focusWindow(existingWindow.id);
      if (existingWindow.minimized) {
        minimizeWindow(existingWindow.id);
      }
      return;
    }

    const baseOffset = (windowCount % 5) * 30;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const defaultWidth = isMobile ? Math.min(window.innerWidth - 20, 800) : 900;
    const defaultHeight = isMobile ? Math.min(window.innerHeight - 150, 600) : 620;

    const newWindow: Window = {
      id: `win-${Date.now()}`,
      title: screenName,
      screenId,
      x: isMobile ? 5 : 80 + baseOffset,
      y: isMobile ? 5 : 40 + baseOffset,
      width: defaultWidth,
      height: defaultHeight,
      minimized: false,
      maximized: false,
      zIndex: nextZIndex,
      focused: true,
    };

    setWindows(prev => [
      ...prev.map(w => ({ ...w, focused: false })),
      newWindow,
    ]);
    setWindowCount(prev => prev + 1);
    setNextZIndex(prev => prev + 1);
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
      prev.map(w => (w.id === id ? { ...w, maximized: !w.maximized } : w))
    );
  };

  const focusWindow = (id: string) => {
    setWindows(prev =>
      prev.map(w => ({
        ...w,
        focused: w.id === id,
        zIndex: w.id === id ? nextZIndex : w.zIndex,
      }))
    );
    setNextZIndex(prev => prev + 1);
  };

  const moveWindow = (id: string, x: number, y: number) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, x, y } : w))
    );
  };

  const handleMenuAction = (action: string) => {
    if (action.includes('Salir')) {
      window.location.href = '/simulador';
    } else if (action.includes('Cerrar Todo')) {
      setWindows([]);
    } else if (action.includes('Añadir')) {
      createWindow('OINV', 'Factura de Clientes', '02_Ventas');
    }
  };

  const handleToolAction = (toolId: string) => {
    if (toolId === 'add') {
      createWindow('OJDT', 'Asiento Contable', '01_Finanzas');
    } else if (toolId === 'search') {
      createWindow('OCRD', 'Datos Maestros de Socio', '02_Ventas');
    } else if (toolId === 'print') {
      window.print();
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-[#e8ecf2] font-[Tahoma,Arial,sans-serif] text-xs overflow-hidden select-none">
      {/* Barra de Título Superior de Finix ERP */}
      <div className="bg-gradient-to-r from-[#001833] via-[#002b5c] to-[#0055A5] text-white px-3 py-1 flex items-center justify-between border-b border-[#001833] shadow-md z-30">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#001833] border border-blue-400/40 px-2 py-0.5 rounded shadow-inner">
            <span className="text-amber-400 text-xs">🐦‍🔥</span>
            <span className="font-black text-amber-400 text-xs tracking-wider">Finix</span>
          </div>
          <div>
            <h1 className="text-xs font-bold leading-none">Finix ERP (Cloud 2026) — {companyTitle}</h1>
            <p className="text-[10px] text-blue-200 mt-0.5">Empresa autorizada en Supabase · Motor contable en tiempo real</p>
          </div>
        </div>

        {/* Identidad de Usuario Finix ERP con Roles, Selector de Sociedad y Selector de Temas */}
        <div className="flex items-center gap-3">
          {/* Selector de Sociedad / Empresa entre las 7 empresas del usuario */}
          <div className="flex items-center gap-1.5 bg-[#081a4d]/80 border border-blue-400/30 px-2 py-1 rounded shadow-inner">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span className="text-[10.5px] text-emerald-300 font-bold">Sociedad:</span>
            <select
              aria-label="Selector de Sociedad / Empresa Finix ERP"
              value={activeSlot}
              disabled={company.saving}
              onChange={(e) => {
                setActiveSlot(e.target.value);
                cambiarEmpresaActiva(e.target.value);
              }}
              className="bg-[#0e2c7a] text-white font-semibold text-[10.5px] rounded border border-blue-300/40 px-2 py-0.5 outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer max-w-[200px] truncate"
            >
              {LISTA_SIETE_EMPRESAS.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.icon} {emp.shortName}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Tema Corporativo UI5 */}
          <div className="flex items-center gap-1.5 bg-[#081a4d]/80 border border-blue-400/30 px-2 py-1 rounded shadow-inner">
            <span className="text-[10.5px] text-amber-300 font-bold">Tema:</span>
            <select
              aria-label="Selector de Tema Corporativo Finix ERP"
              value={themeMode}
              onChange={(e) => setThemeMode(e.target.value as 'sap_horizon' | 'sap_fiori_3_dark' | 'classic')}
              className="bg-[#0e2c7a] text-white font-semibold text-[10.5px] rounded border border-blue-300/40 px-2 py-0.5 outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              <option value="sap_horizon">✨ Finix Horizon (Claro)</option>
              <option value="sap_fiori_3_dark">🌙 Finix Obsidian (Oscuro)</option>
              <option value="classic">💻 Finix Enterprise (Metálico)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#081a4d]/80 border border-blue-400/30 px-2.5 py-1 rounded shadow-inner">
            <Shield className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span className="text-[11px] text-blue-200">Usuario Finix:</span>
            <select
              aria-label="Perfil de usuario Finix ERP"
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value as FinixRole)}
              className="bg-[#0e2c7a] text-white font-semibold text-[11px] rounded border border-blue-300/40 px-2 py-0.5 outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              {Object.values(FINIX_ROLES).map(r => (
                <option key={r.id} value={r.id}>
                  {r.prefix}{baseEmail} ({r.label})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-1">
            <button
              type="button"
              className="w-5 h-5 bg-[#0e2c7a] hover:bg-[#1a42a0] border border-blue-300/40 text-white rounded text-[11px] flex items-center justify-center transition-all active:scale-95"
              onClick={() => window.location.href = '/simulador'}
              title="Volver al Panel de Prácticas"
            >
              ⌂
            </button>
          </div>
        </div>
      </div>

      {/* Barra de Menú Principal */}
      <FinixMenuBar onActionClick={handleMenuAction} />

      {/* Barra de Herramientas */}
      <FinixToolBar onActionClick={handleToolAction} />

      {/* Área Central: Menú de Módulos (Árbol) y Escritorio de Ventanas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Árbol Lateral de Módulos Finix */}
        <FinixModulesTree modules={modules} onScreenSelect={createWindow} />

        {/* Gestor de Ventanas Flotantes ocupando la sección derecha */}
        <div className={`flex-1 min-w-0 h-full relative overflow-hidden flex flex-col transition-colors duration-200 ${
          themeMode === 'sap_horizon' ? 'bg-[#e8ecf2]' : themeMode === 'sap_fiori_3_dark' ? 'bg-[#0c121c]' : 'bg-[#334155]'
        }`}>
          <div className="flex-1 relative overflow-hidden">
            <FinixWindowManager
              windows={windows}
              themeMode={themeMode}
              onWindowClose={closeWindow}
              onWindowMinimize={minimizeWindow}
              onWindowMaximize={maximizeWindow}
              onWindowFocus={focusWindow}
              onWindowMove={moveWindow}
            />
          </div>

          {/* Dock de Ventanas Abiertas y Minimizadas en Finix ERP */}
          {windows.length > 0 && (
            <div className="bg-[#1e293b] border-t border-[#475569] px-2 py-1 flex items-center gap-1.5 overflow-x-auto shrink-0 z-20">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider px-1">Dock Finix:</span>
              {windows.map((win) => (
                <button
                  key={win.id}
                  type="button"
                  onClick={() => {
                    if (win.minimized) {
                      minimizeWindow(win.id);
                    }
                    focusWindow(win.id);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-t transition-all border ${
                    win.focused && !win.minimized
                      ? 'bg-[#0055A5] text-white border-blue-400 font-semibold shadow-sm'
                      : win.minimized
                      ? 'bg-amber-950/80 text-amber-200 border-amber-500/50 hover:bg-amber-900/90'
                      : 'bg-[#0f172a] text-gray-300 border-gray-700 hover:bg-[#1e293b]'
                  }`}
                  title={win.minimized ? 'Hacer clic para restaurar ventana minimizada' : 'Hacer clic para enfocar ventana'}
                >
                  <span className={`w-2 h-2 rounded-full ${win.minimized ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                  <span className="truncate max-w-[150px] font-medium">{win.title}</span>
                  {win.minimized && <span className="text-[9px] bg-amber-800 text-amber-100 px-1 rounded font-bold">Minimizado</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Barra de Estado Inferior Limpia */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white text-[11px] px-3 py-1 flex items-center justify-between border-t border-gray-600">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Conectado a Supabase (PostgreSQL / Finix Cloud Engine)
          </span>
          <span className="text-gray-300">| Perfil activo: <strong>{currentRoleDef.department}</strong></span>
        </div>
        <div className="flex items-center gap-4 text-gray-300 font-mono text-[10px]">
          <span>{systemTime}</span>
          <span>F1 Ayuda | Shift+F2 Búsqueda | Ctrl+S Guardar</span>
        </div>
      </div>

      {/* Modal de Advertencia de Autorizaciones Finix ERP */}
      {unauthorizedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#ECE9D8] border-2 border-[#0A246A] shadow-2xl rounded-sm p-4 font-[Tahoma,Arial,sans-serif] text-[11px] text-[#222]">
            <div className="flex items-center gap-2 bg-[#0A246A] text-white px-2 py-1 font-bold -mx-4 -mt-4 mb-3">
              <span>Finix ERP — Mensaje del Sistema</span>
            </div>
            <div className="flex gap-3 items-start my-2">
              <ShieldAlert className="w-8 h-8 text-[#A12622] shrink-0" aria-hidden="true" />
              <div className="space-y-1.5">
                <p className="font-bold text-[#A12622] text-xs">Autorización insuficiente (Código Finix #1320-04)</p>
                <p>
                  El usuario actual <strong>{simulatedEmail}</strong> ({currentRoleDef.label}) no tiene autorización para acceder a <strong>{unauthorizedModal.screenName}</strong> en el módulo <em>{unauthorizedModal.moduleName}</em>.
                </p>
                <p className="text-[#555] bg-white p-2 border border-[#d5dde8] rounded-sm">
                  ℹ️ <strong>Concepto Clave Finix ERP:</strong> Las empresas configuran perfiles para que cada empleado solo opere las áreas de su competencia.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-2 mt-4 pt-2 border-t border-[#999]">
              <button
                type="button"
                className="px-3 py-1 bg-[#0A246A] text-white font-bold hover:bg-[#1E3A5F] rounded-sm active:scale-95 transition-all"
                onClick={() => {
                  setActiveRole(unauthorizedModal.suggestedRole);
                  setUnauthorizedModal(null);
                }}
              >
                Cambiar a usuario {unauthorizedModal.suggestedRole}
              </button>
              <button
                type="button"
                className="px-3 py-1 bg-[#0A246A] text-white font-bold hover:bg-[#1E3A5F] rounded-sm active:scale-95 transition-all"
                onClick={() => {
                  setActiveRole('super');
                  setUnauthorizedModal(null);
                }}
              >
                Acceder como Superusuario (manager)
              </button>
              <button
                type="button"
                className="px-3 py-1 bg-[#D4D0C8] border border-[#808080] hover:bg-white rounded-sm active:scale-95 transition-all"
                onClick={() => setUnauthorizedModal(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Asistente IA */}
      <SimuladorAIAdvisor
        currentScreen={windows[windows.length - 1]?.title || 'Dashboard'}
        currentModule={Object.keys(catalog.modules)[0] || 'Finanzas'}
        isOpen={true}
      />
    </div>
  );
}

export { FinixDesktopShell as SAPDesktopShell };
