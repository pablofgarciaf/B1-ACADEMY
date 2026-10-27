'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCompany } from '@/hooks/useCompany';
import { ShieldAlert, Shield, LogOut, Info, X } from 'lucide-react';
import { empresaActiva } from '@/lib/firestore-company';
import FinixMenuBar from './FinixMenuBar';
import FinixToolBar from './FinixToolBar';
import FinixModulesTree from './FinixModulesTree';
import FinixWindowManager, { Window } from './FinixWindowManager';
import SimuladorAIAdvisor from '../simulador/SimuladorAIAdvisor';

export type FinixRole = 'super' | 'ventas' | 'compras' | 'contabilidad' | 'almacen';

export interface FinixRoleDefinition {
  id: FinixRole;
  label: string;
  prefix: string;
  department: string;
  description: string;
  allowedModuleKeys: string[];
}

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
  onExit?: () => void;
  onSwitchToFiori?: () => void;
}

export default function FinixDesktopShell({ catalog, onExit, onSwitchToFiori }: FinixDesktopShellProps) {
  const { userProfile, currentUser } = useAuth();
  const company = useCompany();
  const [windows, setWindows] = useState<Window[]>([]);
  const [windowCount, setWindowCount] = useState(0);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [activeRole, setActiveRole] = useState<FinixRole>('super');
  const [themeMode, setThemeMode] = useState<'finix_horizon' | 'finix_fiori_3_dark' | 'classic'>('finix_horizon');
  const [activeSlot, setActiveSlot] = useState<string>('curso');
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'info' | 'success' | 'warn' } | null>(null);

  const showToast = (text: string, type: 'info' | 'success' | 'warn' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev));
    }, 4000);
  };

  useEffect(() => {
    setActiveSlot(empresaActiva());
    const onSlotChange = () => setActiveSlot(empresaActiva());
    window.addEventListener('finix-company-changed', onSlotChange);
    return () => {
      window.removeEventListener('finix-company-changed', onSlotChange);
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
      return;
    }

    const resolvedMod = moduleKey
      ? modules.find(m => m.key === moduleKey)
      : modules.find(m => m.screens.some(s => s.id === screenId));

    const newWindow: Window = {
      id: `win-${Date.now()}`,
      title: screenName,
      screenId,
      moduleKey: resolvedMod?.key || moduleKey,
      moduleName: resolvedMod?.name,
      x: 0,
      y: 0,
      width: 1000,
      height: 700,
      minimized: false,
      maximized: true,
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
    switch (action) {
      // ── Archivo ───────────────────────────────────────────
      case 'Nuevo':
        createWindow('SAL002', 'Pedido de Venta', '02_Ventas');
        showToast('Abriendo nuevo Pedido de Venta...', 'info');
        break;
      case 'Abrir':
        createWindow('FIN001', 'Asientos Contables (Diario)', '01_Finanzas');
        showToast('Abriendo Asientos Contables...', 'info');
        break;
      case 'Guardar':
        showToast('Documento y cambios guardados en el servidor Finix Cloud.', 'success');
        break;
      case 'Guardar Como...':
        showToast('Copia del documento generada exitosamente.', 'success');
        break;
      case 'Salir':
        if (onExit) onExit();
        else window.location.href = '/simulador';
        break;

      // ── Edición ───────────────────────────────────────────
      case 'Deshacer':
        showToast('Deshacer: no hay acciones previas en el historial local.', 'info');
        break;
      case 'Rehacer':
        showToast('Rehacer: última acción restablecida.', 'info');
        break;
      case 'Cortar':
      case 'Copiar':
      case 'Pegar':
        showToast(`Operación de portapapeles: ${action}`, 'info');
        break;
      case 'Buscar':
        createWindow('SAL006', 'Socios de Negocio (Clientes / Proveedores)', '02_Ventas');
        break;

      // ── Ver ───────────────────────────────────────────────
      case 'Barra de Herramientas':
        showToast('Barra de herramientas estándar activa.', 'info');
        break;
      case 'Barra de Estado':
        showToast('Barra de estado de conexión activa en tiempo real.', 'info');
        break;
      case 'Refrescar':
        void company.refresh();
        showToast('Datos de la empresa y motor contable refrescados.', 'success');
        break;
      case 'Pantalla Completa':
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
          showToast('Modo pantalla completa activado.', 'info');
        } else {
          document.exitFullscreen().catch(() => {});
          showToast('Modo pantalla completa desactivado.', 'info');
        }
        break;

      // ── Datos ─────────────────────────────────────────────
      case 'Añadir Registro':
        createWindow('SAL002', 'Pedido de Venta', '02_Ventas');
        showToast('Creando nuevo registro de documento.', 'info');
        break;
      case 'Duplicar Registro':
        showToast('Registro duplicado en modo borrador para edición.', 'info');
        break;
      case 'Eliminar Registro':
        showToast('Operación restringida: Los registros contables y fiscales están protegidos.', 'warn');
        break;
      case 'Buscar Registro':
        createWindow('SAL006', 'Socios de Negocio (Clientes / Proveedores)', '02_Ventas');
        break;
      case 'Filtrar':
        createWindow('INV005', 'Consulta de Disponibilidad de Artículos', '04_Inventario');
        break;

      // ── Ir a ──────────────────────────────────────────────
      case 'Primero':
      case 'Anterior':
      case 'Siguiente':
      case 'Último':
        showToast(`Navegación de registros: ${action}`, 'info');
        break;

      // ── Herramientas ──────────────────────────────────────
      case 'Generador de Reportes':
        createWindow('RPT001', 'Generador de Reportes y Layouts', '09_Reportes');
        break;
      case 'Query Manager':
        createWindow('QRY001', 'Query Manager (Consultas SQL)', '10_Consultas');
        break;
      case 'Importador de Datos':
        createWindow('UTL002', 'Importador de Datos Masivos', '12_Herramientas');
        break;
      case 'Exportador de Datos':
        createWindow('UTL003', 'Exportador de Datos y Balances', '12_Herramientas');
        break;
      case 'Parametrizaciones':
        createWindow('ADM001', 'Inicialización y Parametrizaciones del Sistema', '11_Admin');
        break;

      // ── Ventana ───────────────────────────────────────────
      case 'Cascada':
        setWindows(prev =>
          prev.map((w, idx) => ({
            ...w,
            x: 40 + idx * 30,
            y: 30 + idx * 30,
            minimized: false,
            maximized: false,
          }))
        );
        showToast('Ventanas ordenadas en cascada.', 'info');
        break;
      case 'Mosaico Horizontal': {
        const activeWins = windows.filter(w => !w.minimized);
        if (activeWins.length === 0) break;
        const h = Math.floor(600 / activeWins.length);
        setWindows(prev =>
          prev.map(w => {
            const index = activeWins.findIndex(aw => aw.id === w.id);
            if (index === -1) return w;
            return {
              ...w,
              x: 20,
              y: 20 + index * h,
              width: 860,
              height: Math.max(h - 10, 200),
              maximized: false,
            };
          })
        );
        showToast('Ventanas ordenadas en mosaico horizontal.', 'info');
        break;
      }
      case 'Mosaico Vertical': {
        const activeWins = windows.filter(w => !w.minimized);
        if (activeWins.length === 0) break;
        const wWidth = Math.floor(900 / activeWins.length);
        setWindows(prev =>
          prev.map(w => {
            const index = activeWins.findIndex(aw => aw.id === w.id);
            if (index === -1) return w;
            return {
              ...w,
              x: 20 + index * wWidth,
              y: 20,
              width: Math.max(wWidth - 10, 300),
              height: 580,
              maximized: false,
            };
          })
        );
        showToast('Ventanas ordenadas en mosaico vertical.', 'info');
        break;
      }
      case 'Cerrar Todo':
        setWindows([]);
        showToast('Todas las ventanas fueron cerradas.', 'info');
        break;

      // ── Ayuda ─────────────────────────────────────────────
      case 'Ayuda de Finix ERP':
        window.dispatchEvent(new CustomEvent('feni-abrir'));
        showToast('Asistente FeNi activado. Pregúntame sobre cualquier proceso.', 'info');
        break;
      case 'Acerca de Finix ERP':
        setShowAboutModal(true);
        break;

      default:
        showToast(`Acción ejecutada: ${action}`, 'info');
        break;
    }
  };

  const handleToolAction = (toolId: string) => {
    switch (toolId) {
      case 'add':
        createWindow('SAL002', 'Pedido de Venta', '02_Ventas');
        showToast('Creando nuevo documento de venta...', 'info');
        break;
      case 'search':
        createWindow('SAL006', 'Socios de Negocio (Clientes)', '02_Ventas');
        showToast('Búsqueda de socios de negocio...', 'info');
        break;
      case 'first':
      case 'previous':
      case 'next':
      case 'last':
        showToast(`Navegación de registros: ${toolId}`, 'info');
        break;
      case 'print':
        window.print();
        break;
      case 'settings':
        createWindow('ADM001', 'Inicialización y Parametrizaciones del Sistema', '11_Admin');
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full h-full flex-1 flex flex-col bg-[#e8ecf2] font-[Tahoma,Arial,sans-serif] text-xs overflow-hidden select-none">
      {/* Barra de Título Superior de Finix ERP */}
      <div className="bg-gradient-to-r from-[#001833] via-[#002b5c] to-[#0055A5] text-white px-3 py-1 flex items-center justify-between border-b border-[#001833] shadow-md z-30">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#001833] border border-blue-400/40 px-2 py-0.5 rounded shadow-inner">
            <span className="text-amber-400 text-xs">🐦‍🔥</span>
            <span className="font-black text-amber-400 text-xs tracking-wider">Finix</span>
          </div>
          <div>
            <h1 className="text-xs font-bold leading-none">Finix ERP (Cloud 2026) — {companyTitle}</h1>
          </div>
        </div>

        {/* Identidad de Usuario Finix ERP con Roles, Selector de Sociedad y Selector de Temas */}
        <div className="flex items-center gap-3">
          {/* Selector de Tema Corporativo UI5 */}
          <div className="flex items-center gap-1.5 bg-[#081a4d]/80 border border-blue-400/30 px-2 py-1 rounded shadow-inner">
            <span className="text-[10.5px] text-amber-300 font-bold">Tema:</span>
            <select
              aria-label="Selector de Tema Corporativo Finix ERP"
              value={themeMode}
              onChange={(e) => setThemeMode(e.target.value as 'finix_horizon' | 'finix_fiori_3_dark' | 'classic')}
              className="bg-[#0e2c7a] text-white font-semibold text-[10.5px] rounded border border-blue-300/40 px-2 py-0.5 outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              <option value="finix_horizon">✨ Finix Horizon (Claro)</option>
              <option value="finix_fiori_3_dark">🌙 Finix Obsidian (Oscuro)</option>
              <option value="classic">💻 Finix Enterprise (Metálico)</option>
            </select>
          </div>

          {onSwitchToFiori && (
            <button
              type="button"
              onClick={onSwitchToFiori}
              className="flex items-center gap-1.5 bg-[#0055A5] hover:bg-[#0070D2] text-white border border-blue-300/50 px-2.5 py-1 rounded text-[11px] font-bold transition-all active:scale-95 shadow-sm"
              title="Cambiar a la vista moderna de SAP Fiori Launchpad"
            >
              <span>✨</span>
              <span>Modo SAP Fiori</span>
            </button>
          )}

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

          {/* Botón Salir al Campus / Dashboard Principal */}
          <button
            type="button"
            onClick={() => {
              if (onExit) onExit();
              else window.location.href = '/campus';
            }}
            className="flex items-center gap-1.5 bg-red-950/80 hover:bg-red-800 text-red-100 hover:text-white border border-red-500/50 px-2.5 py-1 rounded text-[11px] font-bold transition-all active:scale-95 shadow-sm"
            title="Salir del Simulador y volver al Campus / Panel Principal"
          >
            <LogOut className="w-3.5 h-3.5 text-red-300" aria-hidden="true" />
            <span>Salir al Campus</span>
          </button>

          <Link
            href="/"
            className="flex items-center gap-1 bg-[#0e2c7a] hover:bg-[#1a42a0] border border-blue-300/40 text-white px-2 py-1 rounded text-[11px] font-semibold transition-all active:scale-95 shadow-sm"
            title="Ir a la Página Principal del Sitio Web"
          >
            <span>🏠</span>
            <span>Principal</span>
          </Link>

          <div className="flex gap-1">
            <button
              type="button"
              className="w-6 h-6 bg-[#0e2c7a] hover:bg-[#1a42a0] border border-blue-300/40 text-white rounded text-xs flex items-center justify-center transition-all active:scale-95"
              onClick={() => {
                if (onExit) onExit();
                else window.location.href = '/simulador';
              }}
              title="Volver al Panel Principal de Prácticas"
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
        <div className="flex-1 min-w-0 h-full relative overflow-hidden flex flex-col bg-gradient-to-br from-[#cde7f0] via-[#e2f2f7] to-[#d4ebf3]">
          <div className="flex-1 min-h-0 relative overflow-hidden">
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
        </div>
      </div>

      {/* Barra de Estado Inferior Auténtica de SAP Business One (3 Paneles Encastrados) */}
      <div className="bg-[#e0e8f0] text-[#1e293b] text-[11px] px-2 py-0.5 flex items-center justify-between border-t border-[#9aaec0] shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] font-[Tahoma,Arial,sans-serif] shrink-0 select-none">
        {/* Panel 1: Mensajes del Sistema y Alertas (Encastrado) */}
        <div className="flex-1 min-w-0 mr-1 bg-[#f4f7fa] border border-[#a4b8cc] px-2 py-0.5 rounded-xs flex items-center gap-2 overflow-hidden shadow-[inset_1px_1px_1px_rgba(0,0,0,0.1)]">
          {toastMessage ? (
            <span className={`inline-flex items-center gap-1.5 font-bold truncate ${
              toastMessage.type === 'success' ? 'text-emerald-700' : toastMessage.type === 'warn' ? 'text-amber-800' : 'text-blue-800'
            }`}>
              <span>{toastMessage.type === 'success' ? '🟩' : toastMessage.type === 'warn' ? '🟧' : 'ℹ️'}</span>
              <span className="truncate">{toastMessage.text}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-emerald-800 text-[10.5px] truncate">
              <span className="w-2 h-2 bg-emerald-600 rounded-2xs inline-block shadow-xs shrink-0" />
              <span className="truncate font-medium">Operación finalizada con éxito · Para ayuda, pulse F1</span>
            </span>
          )}
        </div>

        {/* Panel 2: Sociedad y Usuario Activo (Encastrado) */}
        <div className="w-64 shrink-0 mr-1 bg-[#f4f7fa] border border-[#a4b8cc] px-2 py-0.5 rounded-xs flex items-center justify-between text-[10.5px] text-[#334455] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.1)] truncate">
          <span className="font-bold truncate text-[#003366]">{companyTitle}</span>
          <span className="text-gray-500 font-mono text-[9.5px]">manager</span>
        </div>

        {/* Panel 3: Fecha, Hora e Identificador Oficial SAP B1 (Encastrado) */}
        <div className="w-60 shrink-0 bg-[#f4f7fa] border border-[#a4b8cc] px-2 py-0.5 rounded-xs flex items-center justify-between text-[10.5px] text-[#334455] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.1)]">
          <span className="font-mono text-[10px] text-gray-700">{systemTime}</span>
          <span className="inline-flex items-center gap-1 font-bold text-[10px] text-[#004080] tracking-tight">
            <span className="px-1 py-0.2 bg-[#0055a5] text-white rounded-xs text-[8.5px] font-black">SAP</span>
            <span>Business One</span>
          </span>
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

      {/* Modal Acerca de Finix ERP */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border-2 border-[#0055A5] shadow-2xl rounded-sm p-5 font-[Tahoma,Arial,sans-serif] text-xs text-[#222]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🐦‍🔥</span>
                <div>
                  <h2 className="text-sm font-bold text-[#002b5c]">Finix ERP (Cloud 2026)</h2>
                  <p className="text-[10px] text-gray-500">Versión 26.4.1 (Ecuador NIIF & SRI Edition)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-[11px] text-gray-700">
              <p><strong>Sociedad Activa:</strong> {companyTitle}</p>
              <p><strong>Entorno:</strong> Simulación interactiva empresarial en tiempo real con motor de doble partida contable.</p>
              <p><strong>Normativa:</strong> NIIF para PYMES y Resoluciones SRI Ecuador (Comprobantes 01, 07, ATS).</p>
              <p><strong>Desarrollado por:</strong> B1 Academy · Plataforma de Alto Rendimiento Empresarial.</p>
              <div className="bg-blue-50 border border-blue-200 p-2.5 rounded text-[10.5px] text-blue-900 mt-2">
                💡 Todas las operaciones comerciales, de inventario y tesorería impactan directamente los libros contables y financieros de su empresa en el simulador.
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="px-4 py-1.5 bg-[#0055A5] text-white font-bold hover:bg-[#003d75] rounded text-xs active:scale-95 transition-all shadow-sm"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 right-6 z-50 flex items-center gap-2 px-3.5 py-2 bg-slate-900/95 border border-blue-400 text-white rounded shadow-2xl animate-in slide-in-from-bottom-2 duration-200 text-xs">
          <span className="text-sm">
            {toastMessage.type === 'success' ? '✅' : toastMessage.type === 'warn' ? '⚠️' : 'ℹ️'}
          </span>
          <span className="font-medium">{toastMessage.text}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Asistente IA */}
      {(() => {
        if (activeSlot === 'privado' || company.data.profile?.usage === 'private') return null;
        const activeWin = windows.find(w => w.focused) || windows[windows.length - 1];
        const activeScreenTitle = activeWin ? activeWin.title : 'Dashboard';
        const activeModuleTitle = activeWin?.moduleName
          || (activeWin?.moduleKey && catalog.modules[activeWin.moduleKey]?.name)
          || 'General';
        return (
          <SimuladorAIAdvisor
            currentScreen={activeScreenTitle}
            currentModule={activeModuleTitle}
            isOpen={false}
          />
        );
      })()}
    </div>
  );
}

