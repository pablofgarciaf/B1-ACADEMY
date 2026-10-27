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
          {onSwitchToClassic && (
            <button
              onClick={onSwitchToClassic}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:border-[#0854a0] transition active:scale-95 shadow-sm"
              title="Cambiar a la visualización de escritorio clásico de Business One"
            >
              <Monitor className="w-3.5 h-3.5 text-[#0854a0]" />
              <span className="hidden sm:inline">Modo Clásico</span>
            </button>
          )}

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
                <FinixScreenRenderer screenId={activeScreen.id} screenName={activeScreen.name} />
              </div>
            </div>
          </div>
        ) : (
          /* ── 3.B LAUNCHPAD TILES & KPIS (Home de SAP Fiori) ─────────────────── */
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            {/* Banner de Bienvenida y Sociedad */}
            <div className={`p-6 rounded-3xl border shadow-sm relative overflow-hidden ${
              isDark
                ? 'bg-gradient-to-r from-[#17253d] via-[#131e33] to-[#17253d] border-slate-800 text-white'
                : 'bg-gradient-to-r from-blue-50/80 via-white to-sky-50/80 border-blue-100 text-slate-900'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0854a0]/10 border border-[#0854a0]/20 text-[11px] font-bold text-[#0854a0] dark:text-[#38bdf8]">
                    <span>✨ Sistema Fiori 2026</span>
                    <span>·</span>
                    <span>Sociedad Activa</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    {companyName}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Navegación basada en roles, mosaicos interactivos y transacciones empresariales en tiempo real.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {onSwitchToClassic && (
                    <button
                      onClick={onSwitchToClassic}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white hover:border-[#0854a0] transition-all active:scale-95 shadow-sm"
                    >
                      <Monitor className="w-4 h-4 text-[#0854a0]" />
                      <span>Cambiar a SAP Clásico</span>
                    </button>
                  )}
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <span>🏠 Salir al Campus</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* SECCIÓN 1: MOSAICOS KPI (KPI Tiles en tiempo real) */}
            {activeSpace === 'home' && !searchQuery && (
              <section aria-labelledby="kpis-title" className="space-y-3">
                <h3 id="kpis-title" className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Métricas Operativas Fiori (Tiempo Real)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* KPI 1: Facturas Abiertas */}
                  <div
                    onClick={() => openApp({ id: 'SAL004', name: 'Factura de Clientes' })}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:border-[#0854a0] group ${
                      isDark ? 'bg-[#152033] border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold">Facturas Abiertas</span>
                      <DollarSign className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        {kpis.facturasAbiertasCount}
                      </span>
                      <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                        ${kpis.facturasAbiertasTotal.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-[#0854a0] transition">
                      <span>Ver documentos</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* KPI 2: Pedidos de Venta */}
                  <div
                    onClick={() => openApp({ id: 'SAL002', name: 'Pedido de Venta' })}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:border-[#0854a0] group ${
                      isDark ? 'bg-[#152033] border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold">Pedidos de Venta</span>
                      <ShoppingCart className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        {kpis.pedidosVentaCount}
                      </span>
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" /> En curso
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-[#0854a0] transition">
                      <span>Gestionar pedidos</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* KPI 3: Clientes Registrados */}
                  <div
                    onClick={() => openApp({ id: 'EC-CUSTOMERS', name: 'Ficha de Cliente (BP)' })}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:border-[#0854a0] group ${
                      isDark ? 'bg-[#152033] border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold">Interlocutores (Clientes)</span>
                      <Users className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        {kpis.clientesCount}
                      </span>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {kpis.articulosCount} artículos
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-[#0854a0] transition">
                      <span>Directorio comercial</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* KPI 4: Asientos de Diario */}
                  <div
                    onClick={() => openApp({ id: 'FIN001', name: 'Asientos Contables' })}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:border-[#0854a0] group ${
                      isDark ? 'bg-[#152033] border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold">Libro Diario Contable</span>
                      <FileText className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        {kpis.asientosCount}
                      </span>
                      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                        Asientos cuadrados
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-[#0854a0] transition">
                      <span>Nuevo comprobante</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* SECCIÓN 2: MOSAICOS ESTÁNDAR POR MÓDULOS (Fiori Tiles) */}
            <div className="space-y-8">
              {filteredModules.map((module) => {
                const Icon = MODULE_ICONS[module.key] || MODULE_ICONS.default;
                return (
                  <section key={module.key} className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                      <Icon className="w-4 h-4 text-[#0854a0] dark:text-[#38bdf8]" />
                      <h3 className="text-sm font-bold tracking-tight">
                        {module.name}
                      </h3>
                      <span className="text-[11px] text-slate-600 dark:text-slate-300">
                        ({module.screens.length} aplicaciones)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {module.screens.map((screen) => (
                        <div
                          key={screen.id}
                          onClick={() => openApp(screen)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:border-[#0854a0] hover:-translate-y-0.5 active:scale-95 group flex flex-col justify-between min-h-[120px] ${
                            isDark
                              ? 'bg-[#152033] border-slate-800 text-white'
                              : 'bg-white border-slate-200 text-slate-900'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[#0854a0] dark:text-[#38bdf8]">
                                {screen.id}
                              </span>
                              <Icon className="w-4 h-4 text-slate-400 group-hover:text-[#0854a0] transition" />
                            </div>
                            <h4 className="text-sm font-bold mt-2.5 leading-snug line-clamp-2">
                              {screen.name}
                            </h4>
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                            <span>{screen.type || 'Transacción'}</span>
                            <span className="text-[#0854a0] dark:text-[#38bdf8] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                              Abrir <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ── 4. ASISTENTE JOULE / ADVISOR LATERAL (Modal / Drawer) ─────────────── */}
      {showAdvisor && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 z-50 shadow-2xl animate-in slide-in-from-right duration-200 bg-white dark:bg-[#111927] border-l border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-blue-600 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="font-bold text-sm">SAP Joule · Asistente IA</span>
            </div>
            <button
              onClick={() => setShowAdvisor(false)}
              className="p-1 rounded hover:bg-white/20 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <SimuladorAIAdvisor
              currentScreen={activeScreen?.name || 'Fiori Launchpad'}
              currentModule={activeScreen?.module || 'SAP Fiori Launchpad'}
              isOpen={true}
            />
          </div>
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
