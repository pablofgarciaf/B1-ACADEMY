'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, GraduationCap, Laptop, Sparkles, CheckCircle2 } from 'lucide-react';
import { manualLearningPath, lessonHref } from '@/lib/manual-learning-path';
import { getManualSimulatorConfig, type SimulatorArchetype } from '@/lib/manual-simulator-registry';
import { CompanyContext, type CompanyContextValue } from '@/hooks/useCompany';
import { emptyCompany, type Customer, type Vendor, type Item } from '@/lib/firestore-types';
import type { CompanyCommand } from '@/lib/company-commands';

// Pantallas funcionales para la muestra interactiva
import CockpitScreen from '@/components/finix-screens/CockpitScreen';
import SalesOrderForm from '@/components/finix-screens/SalesOrderForm';
import PurchaseOrderForm from '@/components/finix-screens/PurchaseOrderForm';
import ItemMasterForm from '@/components/finix-screens/ItemMasterForm';
import JournalEntryForm from '@/components/finix-screens/JournalEntryForm';
import BankingScreen from '@/components/finix-screens/BankingScreen';
import QueryManagerScreen from '@/components/finix-screens/QueryManagerScreen';

const MODULOS_EXPLORADOR_SAP = [
  {
    nombre: 'Gestión & Inicialización',
    icono: '⚙️',
    ruta: 'Gestión > Inicialización del sistema',
    tablas: 'OADM, USR1',
    descripcion: 'Parametrizaciones de la empresa, monedas, series de numeración y Cockpit Fiori.',
  },
  {
    nombre: 'Finanzas & Contabilidad',
    icono: '📊',
    ruta: 'Finanzas > Plan de cuentas / Asiento',
    tablas: 'OACT, OJDT, JDT1',
    descripcion: 'Plan de cuentas, asientos automáticos y manuales, estados financieros e impuestos.',
  },
  {
    nombre: 'Socios de Negocios (CRM)',
    icono: '👥',
    ruta: 'Socios de negocios > Datos maestros',
    tablas: 'OCRD, CRD1',
    descripcion: 'Fichas de clientes y proveedores, condiciones de pago, listas de precios asignadas y límites de crédito.',
  },
  {
    nombre: 'Ventas — Clientes (Order to Cash)',
    icono: '🛍️',
    ruta: 'Ventas > Oferta > Pedido > Entrega > Factura',
    tablas: 'OQUT, ORDR, ODLN, OINV',
    descripcion: 'Ciclo comercial completo de ventas, trazabilidad con mapa de relaciones y emisión tributaria.',
  },
  {
    nombre: 'Compras — Proveedores (Procure to Pay)',
    icono: '📦',
    ruta: 'Compras > Pedido > Entrada mercancías > Factura',
    tablas: 'OPOR, OPDN, OPCH',
    descripcion: 'Abastecimiento de stock, costos de importación y facturación de compra.',
  },
  {
    nombre: 'Gestión de Bancos & Tesorería',
    icono: '🏦',
    ruta: 'Gestión de bancos > Pagos recibidos / efectuados',
    tablas: 'ORCT, OVPM, OBNK',
    descripcion: 'Cobros a clientes, pagos a proveedores, cheques y conciliación bancaria.',
  },
  {
    nombre: 'Inventario & Almacén',
    icono: '🏷️',
    ruta: 'Inventario > Datos maestros artículo / Traslado',
    tablas: 'OITM, ITM1, OWTR',
    descripcion: 'Catálogo de artículos, métodos de valoración (Promedio/FIFO), stock por almacén y recuentos.',
  },
  {
    nombre: 'Producción & Planificación MRP',
    icono: '🏭',
    ruta: 'Producción > Lista de materiales / Orden fabricación',
    tablas: 'OITT, OWOR, OMRX',
    descripcion: 'Fórmulas de ensamble (BOM), órdenes de producción y asistente de reposición de materiales.',
  },
];

export default function ManualLearningBridge({ manualId }: { manualId: string }) {
  const { manual, modules } = manualLearningPath(manualId);
  const { currentUser } = useAuth();
  const simConfig = getManualSimulatorConfig(manualId);

  const [vista, setVista] = useState<'simulador' | 'aula'>('simulador');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Estado demo precargado para que cualquier pantalla interactiva responda en memoria sin tocar Supabase ni Firebase
  const mockContextValue: CompanyContextValue = useMemo(() => {
    const base = emptyCompany();
    if (base.profile) {
      base.profile.companyName = 'Innovatech Solutions Cía. Ltda. (Empresa Demo SAP B1)';
      base.profile.ruc = '1792456789001';
    }
    base.customers = [
      { id: 'c1', cardCode: 'C20000', name: 'Maxi-Teq S.A.', ruc: '1799999999001', city: 'Quito', kind: 'customer', active: true, currency: 'USD', paymentTermsDays: 30, creditLimit: 10000, group: 'Nacional' },
      { id: 'c2', cardCode: 'C20001', name: 'TechSolutions del Ecuador', ruc: '1792222222001', city: 'Guayaquil', kind: 'customer', active: true, currency: 'USD', paymentTermsDays: 15, creditLimit: 5000, group: 'Nacional' },
    ] as unknown as Customer[];
    base.vendors = [
      { id: 'v1', cardCode: 'V10000', name: 'Dell Ecuador Cía. Ltda.', ruc: '1791111111001', city: 'Quito', active: true, currency: 'USD', paymentTermsDays: 30, creditLimit: 20000, group: 'Tecnología' },
      { id: 'v2', cardCode: 'V10001', name: 'HP Importaciones Mayoristas', ruc: '1793333333001', city: 'Cuenca', active: true, currency: 'USD', paymentTermsDays: 30, creditLimit: 15000, group: 'Tecnología' },
    ] as unknown as Vendor[];
    base.items = [
      { id: 'i1', itemCode: 'A00001', name: 'Laptop Dell Latitude 3420 Core i5', type: 'inventory', group: 'Equipos', purchaseUnit: 'UND', salesUnit: 'UND', price: 1200, purchasePrice: 850, active: true, costingMethod: 'average', standardCost: 850, minStock: 5, maxStock: 50, reorderPoint: 10 },
      { id: 'i2', itemCode: 'A00002', name: 'Laptop HP ProBook 440 G8', type: 'inventory', group: 'Equipos', purchaseUnit: 'UND', salesUnit: 'UND', price: 1100, purchasePrice: 780, active: true, costingMethod: 'average', standardCost: 780, minStock: 5, maxStock: 50, reorderPoint: 10 },
      { id: 'i3', itemCode: 'A00003', name: 'Monitor Lenovo ThinkVision 24"', type: 'inventory', group: 'Periféricos', purchaseUnit: 'UND', salesUnit: 'UND', price: 280, purchasePrice: 190, active: true, costingMethod: 'average', standardCost: 190, minStock: 10, maxStock: 100, reorderPoint: 20 },
    ] as unknown as Item[];

    return {
      data: base,
      loading: false,
      saving: false,
      error: '',
      notice: '',
      refresh: async () => {},
      save: async (command: CompanyCommand) => {
        setFeedback(`✓ Acción registrada en el simulador de muestra: ${command.action}. Este entorno interactivo es de exploración y práctica libre.`);
        return `DEMO-${Date.now().toString(36).toUpperCase()}`;
      },
    };
  }, []);

  const renderSimuladorPorArquetipo = (arch: SimulatorArchetype) => {
    switch (arch) {
      case 'cockpit':
        return <CockpitScreen />;
      case 'sales':
        return <SalesOrderForm docType="order" />;
      case 'procurement':
        return <PurchaseOrderForm docType="purchase_order" />;
      case 'item_master':
      case 'pricing':
        return <ItemMasterForm />;
      case 'journal_entry':
        return <JournalEntryForm />;
      case 'banking':
        return <BankingScreen />;
      case 'query':
        return <QueryManagerScreen />;
      default:
        return (
          <div className="p-3 bg-white rounded border border-[#a9b7c8] space-y-3">
            <div className="border-b border-gray-200 pb-2">
              <h4 className="font-bold text-[#003366] text-xs sm:text-sm">
                🗺️ Explorador del Menú de SAP Business One (Módulos Principales)
              </h4>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Haz clic en cualquier módulo para conocer su ruta de acceso, funcionalidad y tablas relacionales del motor SAP:
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MODULOS_EXPLORADOR_SAP.map((mod, i) => (
                <div key={i} className="p-2.5 rounded border border-[#cdd6e1] bg-[#f8fafc] hover:bg-[#eef5fc] transition-all">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#003366]">
                    <span>{mod.icono}</span>
                    <span>{mod.nombre}</span>
                  </div>
                  <p className="text-[10.5px] text-[#4a6b8e] font-mono mt-1 font-semibold">
                    📍 {mod.ruta}
                  </p>
                  <p className="text-[10.5px] text-gray-700 mt-1 leading-snug">
                    {mod.descripcion}
                  </p>
                  <p className="text-[9.5px] text-slate-500 font-mono mt-1.5 pt-1 border-t border-gray-200">
                    Tablas SAP: <strong>{mod.tablas}</strong>
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0F172A] text-slate-200 overflow-hidden">
      {/* Selector de pestañas: Simulador de Muestra vs Práctica de Mi Aula */}
      <div className="shrink-0 flex items-center justify-between border-b border-slate-700 bg-slate-900/90 px-3 py-1.5 gap-2">
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setVista('simulador')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              vista === 'simulador'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <Laptop size={13} />
            <span>Simulador de Muestra</span>
          </button>
          <button
            type="button"
            onClick={() => setVista('aula')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              vista === 'aula'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <GraduationCap size={13} />
            <span>Práctica del Módulo ({modules.length})</span>
          </button>
        </div>

        <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
          SAP Business One v10.0
        </span>
      </div>

      {/* Contenido según pestaña */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-2 sm:p-3">
        {vista === 'simulador' ? (
          <div className="space-y-3">
            {/* Banner pedagógico del simulador de muestra */}
            <div className="rounded-lg border border-sky-400/30 bg-gradient-to-r from-sky-950/60 to-slate-900/80 p-3 text-xs space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="font-bold text-sky-300 flex items-center gap-1.5 text-xs sm:text-sm">
                  <Sparkles size={14} className="text-amber-400" />
                  <span>{simConfig.title}</span>
                </span>
                {simConfig.defaultTable && (
                  <span className="text-[10px] font-mono bg-sky-900/60 text-sky-200 px-2 py-0.5 rounded border border-sky-700/50">
                    Tabla: {simConfig.defaultTable}
                  </span>
                )}
              </div>
              <p className="text-slate-300 leading-relaxed text-[11.5px]">
                {simConfig.scenarioGoal || simConfig.theoreticalSummary || 'Explora este formulario interactivo de SAP Business One. Puedes probar los campos, desplegables y botones con total libertad para aprender qué presionar y cuándo.'}
              </p>
              <div className="flex items-center gap-2 text-[10.5px] text-amber-300/90 font-medium pt-0.5">
                <span>💡 Modo interactivo de muestra:</span>
                <span>No guarda en bases de datos externas; es 100% didáctico y seguro para experimentar.</span>
              </div>
            </div>

            {feedback && (
              <div className="rounded bg-emerald-950/70 border border-emerald-500/40 p-2 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
                <span>{feedback}</span>
              </div>
            )}

            {/* Pantalla interactiva real envuelta en MockCompanyProvider */}
            <CompanyContext.Provider value={mockContextValue}>
              <div className="rounded border border-slate-700 bg-[#ECE9D8] text-slate-900 overflow-hidden shadow-xl min-h-[300px]">
                {renderSimuladorPorArquetipo(simConfig.archetype)}
              </div>
            </CompanyContext.Provider>

            {/* Enlace para ir al aula si desea certificar */}
            {modules.length > 0 && (
              <div className="rounded-lg border border-slate-700 bg-slate-900/80 p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-white block">¿Quieres registrar tu avance oficial?</span>
                  <span className="text-slate-400 text-[11px]">Realiza la práctica evaluada en tu aula para obtener tu constancia del módulo.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setVista('aula')}
                  className="px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all active:scale-95 text-xs flex items-center gap-1.5"
                >
                  <span>Ver clases en Mi Aula</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Vista de Mi Aula */
          <div className="space-y-4">
            <div className="rounded-xl border border-sky-400/30 bg-sky-400/10 p-3.5">
              <p className="text-xs uppercase tracking-widest text-sky-300 font-bold">Del manual a la práctica</p>
              <h3 className="mt-1 text-sm sm:text-base font-bold text-white">{manual?.title ?? 'Elige tu módulo de aprendizaje'}</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Selecciona una clase a continuación para entrar a tu empresa de pruebas en Mi Aula, cumplir las misiones y registrar tu calificación.
              </p>
            </div>

            {modules.map(module => (
              <article key={module.id} className="rounded-xl border border-slate-700 bg-slate-900/70 p-3.5 space-y-2.5">
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">{module.title}</h4>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">{module.description}</p>
                </div>
                <ul className="space-y-1.5">
                  {module.classes.map(lesson => (
                    <li key={lesson.id}>
                      <Link
                        href={currentUser ? lessonHref(module.id, lesson.id) : '/login?next=' + encodeURIComponent(lessonHref(module.id, lesson.id))}
                        className="flex items-center justify-between gap-2 rounded-lg border border-slate-700/80 bg-slate-800/40 px-3 py-2 text-xs text-slate-200 hover:bg-sky-400/15 hover:border-sky-400 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400"
                      >
                        <span className="font-medium">{lesson.number}. {lesson.title}</span>
                        <ArrowRight size={14} className="shrink-0 text-sky-400" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}

            {!modules.length && (
              <div className="p-4 text-center">
                <Link className="text-sky-300 underline text-xs" href="/mi-aula">
                  Explorar todos los módulos en Mi Aula →
                </Link>
              </div>
            )}

            <div className="rounded-lg border border-emerald-400/25 bg-emerald-500/5 p-3 text-xs">
              <h4 className="flex items-center gap-1.5 font-bold text-emerald-300">
                <GraduationCap size={16} />
                <span>Constancia oficial por módulo completado</span>
              </h4>
              <p className="mt-1 text-[11px] text-slate-300 leading-relaxed">
                Los manuales son material de consulta. La constancia se obtiene en Mi Aula al completar las clases, las prácticas requeridas y la evaluación del módulo.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
