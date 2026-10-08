'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCompany } from '@/hooks/useCompany';
import { ShieldAlert, UserCheck, Shield, ChevronDown } from 'lucide-react';
import SAPMenuBar from './SAPMenuBar';
import SAPToolBar from './SAPToolBar';
import SAPModulesTree from './SAPModulesTree';
import SAPWindowManager from './SAPWindowManager';
import SimuladorAIAdvisor from '../simulador/SimuladorAIAdvisor';

export type SAPRole = 'super' | 'ventas' | 'compras' | 'contabilidad' | 'almacen';

export interface SAPRoleDefinition {
  id: SAPRole;
  label: string;
  prefix: string;
  department: string;
  description: string;
  allowedModuleKeys: string[];
}

export const SAP_ROLES: Record<SAPRole, SAPRoleDefinition> = {
  super: {
    id: 'super',
    label: 'Superusuario (manager)',
    prefix: 'super.',
    department: 'Dirección General / IT',
    description: 'Acceso total y sin restricciones a todos los módulos y definiciones de SAP Business One.',
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
  const { userProfile, currentUser } = useAuth();
  const company = useCompany();
  
  const [windows, setWindows] = useState<Window[]>([]);
  const [windowCount, setWindowCount] = useState(0);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [activeRole, setActiveRole] = useState<SAPRole>('super');
  const [unauthorizedModal, setUnauthorizedModal] = useState<{
    screenName: string;
    moduleKey: string;
    moduleName: string;
    suggestedRole: SAPRole;
  } | null>(null);

  const modules = Object.values(catalog.modules || {});
  const baseEmail = userProfile?.email || currentUser?.email || 'estudiante@sap.ec';
  const currentRoleDef = SAP_ROLES[activeRole];
  const simulatedEmail = `${currentRoleDef.prefix}${baseEmail}`;
  const companyTitle = company.data.profile?.companyName || 'B1 Center';

  const isModuleAuthorized = (moduleKey?: string): boolean => {
    if (!moduleKey || activeRole === 'super') return true;
    const allowed = currentRoleDef.allowedModuleKeys;
    if (allowed.includes('*')) return true;
    return allowed.includes(moduleKey);
  };

  const getSuggestedRoleForModule = (moduleKey: string): SAPRole => {
    for (const [rKey, rDef] of Object.entries(SAP_ROLES)) {
      if (rKey !== 'super' && rDef.allowedModuleKeys.includes(moduleKey)) {
        return rKey as SAPRole;
      }
    }
    return 'super';
  };

  const createWindow = (screenId: string, screenName: string, moduleKey?: string) => {
    // Verificación de autorizaciones por perfil SAP B1
    if (moduleKey && !isModuleAuthorized(moduleKey)) {
      const targetMod = catalog.modules[moduleKey];
      setUnauthorizedModal({
        screenName,
        moduleKey,
        moduleName: targetMod?.name || moduleKey,
        suggestedRole: getSuggestedRoleForModule(moduleKey),
      });
      return;
    }

    const newWindow: Window = {
      id: `window-${windowCount}`,
      title: screenName,
      screenId,
      x: 50 + (windowCount % 8) * 30,
      y: 50 + (windowCount % 8) * 30,
      width: 820,
      height: 560,
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
      prev.map(w => (w.id === id ? { ...w, width: 840, height: 580 } : w))
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
  };

  const handleToolAction = (action: string) => {
    console.log('Tool action:', action);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-900 overflow-hidden font-[Tahoma,Arial,sans-serif]">
      {/* Barra de Título Superior de SAP Business One con Selector de Roles */}
      <div className="bg-gradient-to-r from-[#0a246a] via-[#1e3a5f] to-[#0a246a] text-white px-3 py-1.5 flex flex-wrap items-center justify-between border-b border-[#3b5998] shadow-md text-xs">
        <div className="flex items-center gap-2">
          <span className="rounded bg-gradient-to-b from-[#1f6fc5] to-[#0a3d8f] px-2 py-0.5 text-[11px] font-black italic tracking-wider text-white shadow">SAP</span>
          <div>
            <h1 className="text-xs font-bold leading-none">SAP Business One 10.0 (HANA) — {companyTitle}</h1>
            <p className="text-[10px] text-blue-200 mt-0.5">Empresa autorizada en Supabase · Base de datos en tiempo real</p>
          </div>
        </div>

        {/* Identidad de Usuario SAP B1 con Roles */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#081a4d]/80 border border-blue-400/30 px-2.5 py-1 rounded shadow-inner">
            <Shield className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span className="text-[11px] text-blue-200">Usuario SAP:</span>
            <select
              aria-label="Perfil de usuario SAP Business One"
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value as SAPRole)}
              className="bg-[#0e2c7a] text-white font-semibold text-[11px] rounded border border-blue-300/40 px-2 py-0.5 outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              {Object.values(SAP_ROLES).map(r => (
                <option key={r.id} value={r.id}>
                  {r.prefix}{baseEmail} ({r.label})
                </option>
              ))}
            </select>
          </div>

          <div className="hidden sm:block text-right text-[11px] text-blue-100">
            <span className="bg-blue-950/60 border border-blue-800 px-2 py-0.5 rounded text-[10px]">
              {windows.length} ventana(s) abierta(s)
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Menú Principal */}
      <SAPMenuBar onActionClick={handleMenuAction} />

      {/* Barra de Herramientas */}
      <SAPToolBar onActionClick={handleToolAction} />

      {/* Área Central: Menú de Módulos (Árbol) y Escritorio de Ventanas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Árbol Lateral de Módulos SAP */}
        <SAPModulesTree modules={modules} onScreenSelect={createWindow} />

        {/* Gestor de Ventanas Flotantes */}
        <SAPWindowManager
          windows={windows}
          onWindowClose={closeWindow}
          onWindowMinimize={minimizeWindow}
          onWindowMaximize={maximizeWindow}
          onWindowFocus={focusWindow}
          onWindowMove={moveWindow}
        />
      </div>

      {/* Barra de Estado Inferior */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white text-[11px] px-3 py-1 flex items-center justify-between border-t border-gray-600">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Conectado a Supabase (PostgreSQL / HANA)
          </span>
          <span className="text-gray-300">| Perfil activo: <strong>{currentRoleDef.department}</strong></span>
        </div>
        <div className="text-gray-400">
          <span>F1 Ayuda | Shift+F2 Búsqueda | Ctrl+S Guardar</span>
        </div>
      </div>

      {/* Modal de Advertencia de Autorizaciones SAP B1 */}
      {unauthorizedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#ECE9D8] border-2 border-[#0A246A] shadow-2xl rounded-sm p-4 font-[Tahoma,Arial,sans-serif] text-[11px] text-[#222]">
            <div className="flex items-center gap-2 bg-[#0A246A] text-white px-2 py-1 font-bold -mx-4 -mt-4 mb-3">
              <span>SAP Business One — Mensaje del Sistema</span>
            </div>
            <div className="flex gap-3 items-start my-2">
              <ShieldAlert className="w-8 h-8 text-[#A12622] shrink-0" aria-hidden="true" />
              <div className="space-y-1.5">
                <p className="font-bold text-[#A12622] text-xs">Autorización insuficiente (Código SAP #1320-04)</p>
                <p>
                  El usuario actual <strong>{simulatedEmail}</strong> ({currentRoleDef.label}) no tiene autorización para acceder a <strong>{unauthorizedModal.screenName}</strong> en el módulo <em>{unauthorizedModal.moduleName}</em>.
                </p>
                <p className="text-[#555] bg-white p-2 border border-[#d5dde8] rounded-sm">
                  ℹ️ <strong>Concepto Clave SAP B1:</strong> Las empresas configuran perfiles para que cada empleado solo opere las áreas de su competencia (Ventas no puede registrar Asientos contables ni compras).
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
