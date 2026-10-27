'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCompany } from '@/hooks/useCompany';
import {
  Search,
  Bell,
  Sparkles,
  HelpCircle,
  ArrowLeft,
  Monitor,
  LayoutGrid,
  FileText,
  DollarSign,
  ShoppingCart,
  Package,
  Factory,
  Building2,
  Users,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Shield,
  Layers,
  Wrench,
  X,
  ExternalLink,
} from 'lucide-react';
import FinixScreenRenderer from '@/components/finix-screens/FinixScreenRenderer';
import { FinixUIThemeContext } from '@/components/finix-screens/FinixControls';
import SimuladorAIAdvisor from '../simulador/SimuladorAIAdvisor';
import { FINIX_ROLES, type FinixRole, type FinixRoleDefinition } from './FinixDesktopShell';
import {
  LISTA_SIETE_EMPRESAS,
  EMPRESA_PRIVADA,
  empresaActiva,
  cambiarEmpresaActiva,
  type EmpresaSlot,
} from '@/lib/firestore-company';
import { levelNames } from '@/lib/company-defaults';

interface ScreenItem {
  id: string;
  name: string;
  type?: string;
  module?: string;
}

interface ModuleItem {
  key: string;
  name: string;
  icon?: string;
  screens: ScreenItem[];
}

interface Catalog {
  modules: Record<string, ModuleItem>;
  metadata?: {
    total_screens: number;
    total_modules: number;
  };
}

interface FioriDesktopShellProps {
  catalog: Catalog;
  onExit?: () => void;
  onSwitchToClassic?: () => void;
}

const MODULE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  '01_Finanzas': DollarSign,
  '02_Ventas': ShoppingCart,
  '03_Compras': Package,
  '04_Inventario': Factory,
  '05_Produccion': Wrench,
  'ecuador': Building2,
  'default': Layers,
};

const FREQUENT_APPS = [
  {
    id: 'SAL002',
    name: 'Pedido de Venta',
    module: '02_Ventas',
    category: 'Ventas',
    badgeColor: 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/60 text-[#0055A5] dark:text-[#38bdf8]',
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20 text-[#0070d2] dark:text-[#38bdf8]',
    icon: ShoppingCart,
    description: 'Gestión de cotizaciones y emisión de pedidos comerciales',
  },
  {
    id: 'SAL004',
    name: 'Factura de Clientes & SRI',
    module: '02_Ventas',
    category: 'SRI Ecuador',
    badgeColor: 'border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    icon: FileText,
    description: 'Facturación electrónica autorizada y cuentas por cobrar',
  },
  {
    id: 'PUR002',
    name: 'Pedido de Compra',
    module: '03_Compras',
    category: 'Compras',
    badgeColor: 'border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400',
    icon: Package,
    description: 'Aprovisionamiento de mercaderías y órdenes a proveedores',
  },
  {
    id: 'EC-CUSTOMERS',
    name: 'Interlocutores Comerciales',
    module: '02_Ventas',
    category: 'Socios (BP)',
    badgeColor: 'border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300',
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400',
    icon: Users,
    description: 'Directorio de clientes, proveedores y condiciones de crédito',
  },
  {
    id: 'INV001',
    name: 'Maestro de Artículos',
    module: '04_Inventario',
    category: 'Inventario',
    badgeColor: 'border-teal-200 dark:border-teal-900 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300',
    iconBg: 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400',
    icon: Factory,
    description: 'Catálogo de ítems, listas de precios y niveles de stock',
  },
  {
    id: 'PUR003',
    name: 'Entrada de Mercancías (GRPO)',
    module: '03_Compras',
    category: 'Bodega',
    badgeColor: 'border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300',
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400',
    icon: CheckCircle2,
    description: 'Recepción en almacén e incremento de inventario físico',
  },
  {
    id: 'FIN001',
    name: 'Libro Diario & Asientos',
    module: '01_Finanzas',
    category: 'Finanzas',
    badgeColor: 'border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300',
    iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
    icon: DollarSign,
    description: 'Contabilización manual y cuadre estricto de partida doble',
  },
  {
    id: 'EC-RETENTION',
    name: 'Retenciones SRI & ATS',
    module: 'ecuador',
    category: 'Tributación',
    badgeColor: 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200',
    iconBg: 'bg-slate-500/10 dark:bg-slate-500/20 text-slate-700 dark:text-slate-300',
    icon: Building2,
    description: 'Retenciones de IVA y Renta con liquidación SRI',
  },
];

export default function FioriDesktopShell({
  catalog,
  onExit,
  onSwitchToClassic,
}: FioriDesktopShellProps) {
  const { userProfile, currentUser } = useAuth();
  const company = useCompany();

  // Estado de navegación
  const [activeSpace, setActiveSpace] = useState<string>('home');
  const [activeScreen, setActiveScreen] = useState<ScreenItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRole, setActiveRole] = useState<FinixRole>('super');
  const [showAdvisor, setShowAdvisor] = useState(false);
  const [showMissionsModal, setShowMissionsModal] = useState(false);
  const [themeFlavor, setThemeFlavor] = useState<'morning_horizon' | 'evening_horizon'>('morning_horizon');
  const [activeSlot, setActiveSlot] = useState<EmpresaSlot>('curso');

  useEffect(() => {
    setActiveSlot(empresaActiva());
    const onSlotChange = () => setActiveSlot(empresaActiva());
    window.addEventListener('finix-company-changed', onSlotChange);
    return () => window.removeEventListener('finix-company-changed', onSlotChange);
  }, []);

  const companies = userProfile?.privateAccountingEnabled ? [...LISTA_SIETE_EMPRESAS, EMPRESA_PRIVADA] : LISTA_SIETE_EMPRESAS;
  const isPrivate = activeSlot === 'privado';

  const handleSelectCompany = (slotId: EmpresaSlot) => {
    setActiveSlot(slotId);
    cambiarEmpresaActiva(slotId);
    void company.refresh();
  };

  const modules = useMemo(() => Object.values(catalog.modules || {}), [catalog]);
  const currentRoleDef = FINIX_ROLES[activeRole];
  const companyName = company.data.profile?.companyName || 'Finix Center';

  // Cálculos de KPIs en tiempo real desde Firestore
  const kpis = useMemo(() => {
    const data = company.data;
    const facturasAbiertas = (data.salesOrders || []).filter(o => o.docType === 'invoice' && o.status === 'open');
    const totalFacturasAbiertas = facturasAbiertas.reduce((sum, f) => sum + (f.total || 0), 0);
    const pedidosVenta = (data.salesOrders || []).filter(o => o.docType === 'order');
    const ordenesCompra = (data.purchaseOrders || []).filter(o => o.status === 'open');
    const totalClientes = (data.customers || []).length;
    const totalArticulos = (data.items || []).length;
    const totalAsientos = (data.journalEntries || []).length;

    return {
      facturasAbiertasCount: facturasAbiertas.length,
      facturasAbiertasTotal: totalFacturasAbiertas,
      pedidosVentaCount: pedidosVenta.length,
      ordenesCompraCount: ordenesCompra.length,
      clientesCount: totalClientes,
      articulosCount: totalArticulos,
      asientosCount: totalAsientos,
    };
  }, [company.data]);

  // Lista de apps filtradas por búsqueda, espacio activo y rol
  const filteredModules = useMemo(() => {
    let mods = modules;
    if (activeRole !== 'super') {
      const allowed = currentRoleDef.allowedModuleKeys;
      if (!allowed.includes('*')) {
        mods = mods.filter(m => allowed.includes(m.key));
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return mods
        .map(m => ({
          ...m,
          screens: m.screens.filter(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)),
        }))
        .filter(m => m.screens.length > 0);
    }
    if (activeSpace === 'home') return mods;
    return mods.filter(m => m.key === activeSpace);
  }, [modules, activeSpace, searchQuery, activeRole, currentRoleDef]);

  const openApp = (screen: ScreenItem) => {
    setActiveScreen(screen);
  };

  const closeApp = () => {
    setActiveScreen(null);
  };

  const isDark = themeFlavor === 'evening_horizon';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 select-none ${
      isDark ? 'bg-[#0f1724] text-slate-100' : 'bg-[#f5f6f8] text-slate-800'
    }`}>
      {/* ── 1. SAP SHELL BAR OFICIAL (Fiori Horizon) ────────────────────────────── */}
      <header className={`h-12 border-b flex items-center justify-between px-3 sm:px-4 z-40 sticky top-0 shadow-sm ${
        isDark
          ? 'bg-[#152033] border-slate-800 text-white'
          : 'bg-[#ffffff] border-slate-200 text-slate-900'
      }`}>
        {/* Izquierda: Logo y Título de Sociedad */}
        <div className="flex items-center gap-3">
          <button
            onClick={closeApp}
            className="flex items-center gap-2 hover:opacity-80 transition active:scale-95 group"
            title="Ir al inicio de SAP Fiori"
          >
            <div className="h-7 px-2 rounded-md bg-[#0854a0] text-white flex items-center justify-center font-black text-xs tracking-wider shadow-inner">
              SAP
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold leading-none tracking-tight">Fiori Launchpad</span>
              <span className="text-[10px] text-slate-600 dark:text-slate-300 font-medium truncate max-w-[180px]">
                {companyName}
              </span>
            </div>
          </button>

          {/* Selector de modo Clásico / Fiori */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-0.5 shadow-inner">
            {onSwitchToClassic && (
              <button
                type="button"
                onClick={onSwitchToClassic}
                className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 py-0.5 rounded text-[11px] font-semibold transition active:scale-95 cursor-pointer"
                title="Cambiar a la visualización de escritorio clásico de Business One"
              >
                <span>💻</span>
                <span>Modo Clásico</span>
              </button>
            )}
            <button
              type="button"
              className="flex items-center gap-1 bg-[#0854a0] text-white px-2.5 py-0.5 rounded text-[11px] font-bold shadow-sm"
              title="Modo Fiori Launchpad activo"
            >
              <span>✨</span>
              <span>Modo Fiori</span>
            </button>
          </div>

          {/* Selector de Sociedad Activa */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2 py-0.5 rounded-lg text-xs">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Sociedad:</span>
            <select
              value={activeSlot}
              onChange={(e) => handleSelectCompany(e.target.value as EmpresaSlot)}
              className="bg-transparent text-slate-900 dark:text-white font-bold text-xs outline-none cursor-pointer"
            >
              {companies.map((emp) => (
                <option key={emp.id} value={emp.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {emp.icon} {emp.shortName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Centro: Buscador Universal Fiori */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar apps, clientes, pedidos o transacciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-8 pr-8 py-1.5 rounded-full text-xs border outline-none transition-all ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-400 focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8]'
                  : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-500 focus:bg-white focus:border-[#0854a0] focus:ring-1 focus:ring-[#0854a0]'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-800 dark:hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Derecha: Asistente Joule, Notificaciones, Selector de Tema y Perfil */}
        <div className="flex items-center gap-2">
          {/* Asistente Joule / Copilot */}
          <button
            onClick={() => setShowAdvisor(!showAdvisor)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition active:scale-95 ${
              showAdvisor
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100'
            }`}
            title="Abrir Asistente Inteligente Fiori Joule"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Joule</span>
          </button>

          {/* Toggle Modo Oscuro / Claro */}
          <button
            onClick={() => setThemeFlavor(isDark ? 'morning_horizon' : 'evening_horizon')}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={isDark ? 'Cambiar a tema Morning Horizon (Claro)' : 'Cambiar a tema Evening Horizon (Oscuro)'}
          >
            <span className="text-xs">{isDark ? '☀️' : '🌙'}</span>
          </button>

          {/* Misiones y XP */}
          {company.data.profile && !isPrivate && (
            <button
              onClick={() => setShowMissionsModal(true)}
              className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-bold transition hover:bg-amber-100 active:scale-95"
              title="Ver misiones y XP acumulado"
            >
              <span>⭐</span>
              <span>{company.data.profile.xp} XP</span>
              <span className="text-[10px] opacity-75">Nv. {company.data.profile.level}</span>
            </button>
          )}

          {/* Selector de Rol */}
          <div className="hidden md:flex items-center">
            <select
              aria-label="Perfil de usuario Finix ERP"
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value as FinixRole)}
              className={`text-[11px] font-semibold rounded-lg px-2 py-1 border outline-none cursor-pointer ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-slate-100 border-slate-300 text-slate-900'
              }`}
            >
              {Object.values(FINIX_ROLES).map(r => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Panel Docente */}
          {userProfile && ['teacher', 'docente'].includes(userProfile.role) && (
            <Link
              href="/simulador/admin"
              className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100"
            >
              👨‍🏫 Docente
            </Link>
          )}

          {/* Avatar del Usuario */}
          <div
            className="h-8 w-8 rounded-full bg-[#0854a0] text-white flex items-center justify-center font-bold text-xs shadow-inner cursor-pointer"
            title={`${userProfile?.displayName || userProfile?.email || 'Usuario'} (${currentRoleDef.department})`}
          >
            {(userProfile?.displayName || userProfile?.name || 'U').charAt(0).toUpperCase()}
          </div>

          {/* Principal */}
          <Link
            href="/"
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Ir a la página principal"
          >
            🏠
          </Link>

          {/* Salir al Campus */}
          {onExit && (
            <button
              onClick={onExit}
              className="flex text-[11px] font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
              title="Volver al Aula / Campus"
            >
              Salir
            </button>
          )}
        </div>
      </header>

      {/* ── 2. BARRA DE ESPACIOS (Spaces & Pages Navigation) ──────────────────── */}
      {!activeScreen && (
        <nav className={`border-b px-4 flex items-center gap-1 overflow-x-auto shrink-0 scrollbar-none ${
          isDark ? 'bg-[#121b2b] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <button
            onClick={() => setActiveSpace('home')}
            className={`px-3.5 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeSpace === 'home'
                ? 'border-[#0854a0] text-[#0854a0] dark:text-[#38bdf8] dark:border-[#38bdf8]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Mi Inicio (My Home)</span>
          </button>

          {modules
            .filter((m) => {
              if (activeRole === 'super') return true;
              return currentRoleDef.allowedModuleKeys.includes('*') || currentRoleDef.allowedModuleKeys.includes(m.key);
            })
            .map((m) => {
            const Icon = MODULE_ICONS[m.key] || MODULE_ICONS.default;
            const isActive = activeSpace === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setActiveSpace(m.key)}
                className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-[#0854a0] text-[#0854a0] dark:text-[#38bdf8] dark:border-[#38bdf8] font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.name.split('·')[0].split('&')[0].trim()}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* ── 3. CONTENIDO: LAUNCHPAD O PANTALLA OPERATIVA FIORI ────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {activeScreen ? (
          /* ── 3.A PANTALLA OPERATIVA FIORI (List Report / Object Page) ───────── */
          <div className="w-full h-full flex flex-col">
            {/* Cabecera de la Aplicación Fiori */}
            <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 shadow-sm ${
              isDark ? 'bg-[#152033] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={closeApp}
                  className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition active:scale-95 flex items-center gap-1 text-xs font-semibold"
                  title="Volver a la cuadrícula de aplicaciones"
                >
                  <ArrowLeft className="w-4 h-4 text-[#0854a0]" />
                  <span>Mi Inicio</span>
                </button>

                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                    <span>Fiori Launchpad</span>
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                    <span>Transacción SAP</span>
                  </div>
                  <h1 className="text-base sm:text-lg font-bold leading-tight">
                    {activeScreen.name} <span className="text-xs font-mono font-normal text-slate-600 dark:text-slate-300">({activeScreen.id})</span>
                  </h1>
                </div>
              </div>

              {/* Botón de cambio rápido en la barra de app */}
              <div className="flex items-center gap-2">
                {onSwitchToClassic && (
                  <button
                    onClick={onSwitchToClassic}
                    className="px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 hover:border-[#0854a0] transition"
                  >
                    Ver en Modo Clásico
                  </button>
                )}
                <button
                  onClick={closeApp}
                  className="p-1 rounded text-slate-600 hover:text-slate-800 dark:hover:text-white"
                  title="Cerrar aplicación"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenedor del componente real */}
            <div className="flex-1 p-3 sm:p-5 overflow-auto">
              <div className={`max-w-7xl mx-auto rounded-2xl border shadow-lg overflow-hidden ${
                isDark ? 'bg-[#131d2e] border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <FinixUIThemeContext.Provider value="fiori">
                  <div className="finix-fiori-mode">
                    <FinixScreenRenderer screenId={activeScreen.id} screenName={activeScreen.name} />
                  </div>
                </FinixUIThemeContext.Provider>
              </div>
            </div>
          </div>
        ) : (
          /* ── 3.B LAUNCHPAD TILES & KPIS (Home de SAP Fiori) ─────────────────── */
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            {/* Banner de Bienvenida y Sociedad Horizon */}
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm relative overflow-hidden ${
              isDark
                ? 'bg-gradient-to-r from-[#17253d] via-[#131e33] to-[#17253d] border-slate-800 text-white'
                : 'bg-gradient-to-r from-blue-50/90 via-sky-50/50 to-indigo-50/80 border-blue-100 text-slate-900'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0055A5]/10 border border-[#0055A5]/20 text-xs font-bold text-[#0055A5] dark:text-[#38bdf8]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>SAP Fiori Horizon 2026</span>
                    <span>·</span>
                    <span>Sociedad Activa</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {companyName}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                    Acceso empresarial unificado: transacciones en tiempo real, catálogo de aplicaciones por rol y copiloto inteligente Joule integrado.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {onSwitchToClassic && (
                    <button
                      onClick={onSwitchToClassic}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white hover:border-[#0055A5] transition-all active:scale-95 shadow-xs"
                      title="Cambiar a la visualización clásica de ventanas SAP B1"
                    >
                      <Monitor className="w-4 h-4 text-[#0055A5]" />
                      <span>Cambiar a SAP Clásico</span>
                    </button>
                  )}
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 text-xs font-semibold hover:bg-white dark:hover:bg-slate-800 transition"
                  >
                    <span>🏠 Salir al Campus</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* VISTA 1: BÚSQUEDA ACTIVA */}
            {searchQuery.trim() ? (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                      Resultados de búsqueda: &quot;{searchQuery}&quot;
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Mostrando aplicaciones coincidentes en todos los módulos
                    </p>
                  </div>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-bold text-[#0055A5] dark:text-[#38bdf8] hover:underline"
                  >
                    Limpiar búsqueda
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredModules.flatMap((m) =>
                    m.screens.map((screen) => {
                      const Icon = MODULE_ICONS[m.key] || MODULE_ICONS.default;
                      return (
                        <div
                          key={screen.id}
                          onClick={() => openApp(screen)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:border-[#0055A5] hover:-translate-y-0.5 active:scale-95 group flex flex-col justify-between min-h-[130px] ${
                            isDark ? 'bg-[#152033] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#0055A5] dark:text-[#38bdf8]">
                                {screen.id}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-400">{m.name.split('·')[0].trim()}</span>
                            </div>
                            <h4 className="text-sm font-bold mt-2 leading-snug line-clamp-2">
                              {screen.name}
                            </h4>
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                            <span>{screen.type || 'Transacción'}</span>
                            <span className="text-[#0055A5] dark:text-[#38bdf8] font-bold flex items-center gap-0.5">
                              Abrir <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </section>
            ) : activeSpace !== 'home' ? (
              /* VISTA 2: ESPACIO ESPECÍFICO SELECCIONADO (Ventas, Compras, etc.) */
              <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveSpace('home')}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-[#0055A5] transition flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-[#0055A5]" />
                      <span>Volver a Mi Inicio</span>
                    </button>
                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                        {modules.find((m) => m.key === activeSpace)?.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Catálogo de aplicaciones operativas y de control
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {filteredModules.find((m) => m.key === activeSpace)?.screens.length || 0} aplicaciones
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {(filteredModules.find((m) => m.key === activeSpace)?.screens || []).map((screen) => {
                    const modKey = activeSpace;
                    const Icon = MODULE_ICONS[modKey] || MODULE_ICONS.default;
                    return (
                      <div
                        key={screen.id}
                        onClick={() => openApp(screen)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:border-[#0055A5] hover:-translate-y-0.5 active:scale-95 group flex flex-col justify-between min-h-[130px] ${
                          isDark ? 'bg-[#152033] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#0055A5] dark:text-[#38bdf8]">
                              {screen.id}
                            </span>
                            <Icon className="w-4 h-4 text-slate-400 group-hover:text-[#0055A5] transition" />
                          </div>
                          <h4 className="text-sm font-bold mt-2 leading-snug line-clamp-2">
                            {screen.name}
                          </h4>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                          <span>{screen.type || 'Transacción'}</span>
                          <span className="text-[#0055A5] dark:text-[#38bdf8] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                            Abrir <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : (
              /* VISTA 3: MI INICIO OFICIAL FIORI HORIZON (KPIS + FAVORITOS + ESPACIOS) */
              <>
                {/* 1. SECCIÓN: MOSAICOS ANALÍTICOS KPI */}
                <section aria-labelledby="kpis-title" className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 id="kpis-title" className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      Métricas Operativas en Tiempo Real
                    </h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Sincronizado
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* KPI 1: Facturas Abiertas */}
                    <div
                      onClick={() => openApp({ id: 'SAL004', name: 'Factura de Clientes' })}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:border-[#0055A5] group ${
                        isDark ? 'bg-[#152033] border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold">Facturas Abiertas</span>
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                          <DollarSign className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                          {kpis.facturasAbiertasCount}
                        </span>
                        <span className="text-xs font-medium text-amber-600 dark:text-amber-400 font-mono">
                          ${kpis.facturasAbiertasTotal.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-[#0055A5] transition">
                        <span>Ver documentos por cobrar</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>

                    {/* KPI 2: Pedidos de Venta */}
                    <div
                      onClick={() => openApp({ id: 'SAL002', name: 'Pedido de Venta' })}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:border-[#0055A5] group ${
                        isDark ? 'bg-[#152033] border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold">Pedidos de Venta</span>
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-[#0070d2] flex items-center justify-center">
                          <ShoppingCart className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                          {kpis.pedidosVentaCount}
                        </span>
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3" /> En gestión activa
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-[#0055A5] transition">
                        <span>Gestionar pedidos</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>

                    {/* KPI 3: Clientes Registrados */}
                    <div
                      onClick={() => openApp({ id: 'EC-CUSTOMERS', name: 'Ficha de Cliente (BP)' })}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:border-[#0055A5] group ${
                        isDark ? 'bg-[#152033] border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold">Interlocutores (Clientes)</span>
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                          <Users className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                          {kpis.clientesCount}
                        </span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {kpis.articulosCount} artículos en stock
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-[#0055A5] transition">
                        <span>Directorio comercial</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>

                    {/* KPI 4: Asientos de Diario */}
                    <div
                      onClick={() => openApp({ id: 'FIN001', name: 'Asientos Contables' })}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:border-[#0055A5] group ${
                        isDark ? 'bg-[#152033] border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold">Libro Diario Contable</span>
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                          <FileText className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                          {kpis.asientosCount}
                        </span>
                        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                          Asientos cuadrados
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-[#0055A5] transition">
                        <span>Nuevo comprobante</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* 2. SECCIÓN: MIS APLICACIONES FRECUENTES (VIBRANT HORIZON TILES) */}
                <section aria-labelledby="frequent-title" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 id="frequent-title" className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        Mis Aplicaciones Frecuentes
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Transacciones clave para la operación diaria de la empresa
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-[#0055A5] dark:text-[#38bdf8]">
                      8 aplicaciones fijadas
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {FREQUENT_APPS.map((app) => {
                      const Icon = app.icon;
                      return (
                        <div
                          key={app.id}
                          onClick={() => openApp({ id: app.id, name: app.name, module: app.module })}
                          className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-lg hover:border-[#0055A5] hover:-translate-y-1 active:scale-95 group flex flex-col justify-between min-h-[160px] ${
                            isDark
                              ? 'bg-[#152033] border-slate-800 text-white'
                              : 'bg-white border-slate-200 text-slate-900'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${app.badgeColor}`}>
                                {app.category}
                              </span>
                              <span className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-[#0055A5] transition">
                                {app.id}
                              </span>
                            </div>

                            <div className="mt-3 flex items-start gap-3">
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${app.iconBg}`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold leading-tight group-hover:text-[#0055A5] dark:group-hover:text-[#38bdf8] transition">
                                  {app.name}
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug line-clamp-2">
                                  {app.description}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                            <span className="font-medium">SAP Horizon</span>
                            <span className="text-[#0055A5] dark:text-[#38bdf8] font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                              Abrir <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* 3. SECCIÓN: EXPLORAR POR ESPACIOS DE TRABAJO */}
                <section aria-labelledby="spaces-title" className="space-y-4">
                  <div>
                    <h3 id="spaces-title" className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      Explorar por Espacios de Trabajo
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Selecciona un departamento para ver su catálogo completo de aplicaciones
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {modules
                      .filter((m) => {
                        if (activeRole === 'super') return true;
                        return currentRoleDef.allowedModuleKeys.includes('*') || currentRoleDef.allowedModuleKeys.includes(m.key);
                      })
                      .map((mod) => {
                        const Icon = MODULE_ICONS[mod.key] || MODULE_ICONS.default;
                        return (
                          <div
                            key={mod.key}
                            onClick={() => setActiveSpace(mod.key)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:border-[#0055A5] active:scale-95 group flex items-center justify-between gap-4 ${
                              isDark ? 'bg-[#152033] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0055A5] dark:text-[#38bdf8] flex items-center justify-center shrink-0">
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-xs sm:text-sm font-bold leading-tight group-hover:text-[#0055A5] dark:group-hover:text-[#38bdf8] transition">
                                  {mod.name.split('·')[0].split('&')[0].trim()}
                                </h4>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                  {mod.screens.length} aplicaciones disponibles
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0055A5] group-hover:translate-x-1 transition-all" />
                          </div>
                        );
                      })}
                  </div>
                </section>
              </>
            )}
          </div>
        )}
      </main>

      {/* ── 4. ASISTENTE JOULE / COPILOTO INTELIGENTE FIORI ─────────────────────── */}
      {showAdvisor && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] z-50 shadow-2xl animate-in slide-in-from-right duration-200 bg-white dark:bg-[#111927] border-l border-slate-200 dark:border-slate-800 flex flex-col">
          <SimuladorAIAdvisor
            currentScreen={activeScreen?.name || 'Fiori Launchpad'}
            currentModule={activeScreen?.module || 'SAP Fiori Launchpad'}
            isOpen={true}
            embedded={true}
            theme="fiori"
            hideFloatingButton={true}
            onClose={() => setShowAdvisor(false)}
          />
        </div>
      )}

      {/* ── 5. MODAL DE MISIONES Y XP ────────────────────────────────────────── */}
      {showMissionsModal && !isPrivate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-lg rounded-2xl border p-5 shadow-2xl space-y-4 ${
            isDark ? 'bg-[#152033] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <h3 className="font-bold text-base">Misiones y Registro de XP</h3>
              </div>
              <button
                onClick={() => setShowMissionsModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="max-h-72 overflow-y-auto space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Misiones asignadas</h4>
              {(!company.data.missions || company.data.missions.length === 0) ? (
                <p className="text-xs text-slate-500">No tienes misiones asignadas en esta empresa.</p>
              ) : (
                company.data.missions.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm font-semibold">{m.title}</strong>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        m.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {m.status === 'completed' ? 'Completada' : 'Pendiente'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{m.description}</p>
                    {m.status !== 'completed' && (
                      <button
                        disabled={company.saving}
                        onClick={async () => {
                          try {
                            await company.save({ action: 'missionComplete', data: { id: m.id } });
                          } catch {
                            /* error */
                          }
                        }}
                        className="px-3 py-1 bg-[#0854a0] hover:bg-[#063e77] text-white text-xs font-bold rounded-lg transition active:scale-95 disabled:opacity-50"
                      >
                        {company.saving ? 'Guardando...' : 'Marcar entregada'}
                      </button>
                    )}
                  </div>
                ))
              )}

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-2">Historial de XP verificado</h4>
              <div className="space-y-1">
                {(company.data.profile?.xpHistory || []).map((e) => (
                  <div key={e.key} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-300">{e.label}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">+{e.points} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
