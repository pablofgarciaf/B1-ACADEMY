'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { manualLearningPath, lessonHref } from '@/lib/manual-learning-path';
import { MANUAL_CASES } from '@/lib/manual-cases';
import { MANUAL_LABS, manualLabKey } from '@/lib/manual-labs';
import { Sparkles, Compass, CheckCircle2, ChevronDown, ChevronUp, BookOpen, ExternalLink, Info } from 'lucide-react';

const ManualSandbox = dynamic(() => import('./ManualSandbox'), {
  ssr: false,
  loading: () => (
    <div className="p-8 text-center text-slate-400">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
      <p className="text-xs">Cargando entorno del simulador...</p>
    </div>
  ),
});

const RUTAS_SAP: Record<string, string> = {
  order: 'Ventas - Clientes > Pedido de Cliente',
  invoice: 'Ventas - Clientes > Factura de Clientes',
  credit_note: 'Ventas - Clientes > Nota de Crédito de Clientes',
  purchase_order: 'Compras - Proveedores > Pedido de Compra',
  purchase_request: 'Compras - Proveedores > Solicitud de Compra',
  goods_receipt: 'Compras - Proveedores > Entrada de Mercancías (GRPO)',
  vendor_invoice: 'Compras - Proveedores > Factura de Proveedores',
  customer: 'Socios de Negocios > Datos Maestros de Socio',
  item: 'Inventario > Datos Maestros de Artículo',
  transfer: 'Inventario > Transferencia de Stock',
  count: 'Inventario > Operaciones de Inventario > Recuento de Stock',
  prices: 'Inventario > Listas de Precios',
  discounts: 'Inventario > Precios Especiales por Volumen',
  bom: 'Producción > Lista de Materiales (BOM)',
  production: 'Producción > Orden de Fabricación',
  accounts: 'Finanzas > Plan de Cuentas',
  journal: 'Finanzas > Asiento Contable',
  bank: 'Gestión de Bancos > Pagos Efectuados / Recibidos',
  cockpit: 'Menú Principal > Cockpit / Fiori Launchpad',
  opportunity: 'CRM > Oportunidades de Venta',
  mrp: 'Planificación (MRP) > Asistente MRP',
  landed: 'Compras > Precios de Entrega (Costos de Importación)',
  settings: 'Gestión > Inicialización del Sistema > Parametrizaciones',
  users: 'Gestión > Definición > General > Usuarios',
  series: 'Gestión > Inicialización > Numeración de Documentos',
};

export default function ManualLearningBridge({ manualId }: { manualId: string }) {
  const { manual, modules } = manualLearningPath(manualId);
  const { currentUser } = useAuth();
  const key = manualLabKey(manualId);
  const scenario = MANUAL_CASES[key];
  const screen = MANUAL_LABS[key];
  const rutaSugerida = (screen && RUTAS_SAP[screen]) || 'SAP Business One > Menú Operativo';

  const [showAula, setShowAula] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <section className="h-full overflow-y-auto p-3 sm:p-4 space-y-4 text-slate-200">
      {/* Encabezado Pedagógico */}
      <header className="rounded-xl bg-gradient-to-r from-[#141e2a] to-[#0e1722] border border-blue-500/20 p-3.5 shadow-sm">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-blue-500/20 text-blue-400">
              <Compass size={16} />
            </span>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Laboratorio Práctico de Aprendizaje
            </span>
          </div>
          <span className="text-[10.5px] font-mono text-blue-200/80 bg-blue-950/60 border border-blue-500/30 px-2 py-0.5 rounded">
            Ruta SAP: {rutaSugerida}
          </span>
        </div>
        <h3 className="font-bold text-white text-sm sm:text-base leading-snug">
          {manual?.title || 'Práctica de Simulación'}
        </h3>
        <p className="mt-1 text-xs text-slate-300 leading-relaxed">
          Practica libremente en este entorno interactivo con datos de muestra. Puedes registrar operaciones,
          consultar registros y alternar entre el diseño Fiori moderno y el clásico de SAP B1.
        </p>
      </header>

      {/* Guía Paso a Paso para Completar el Ejercicio */}
      <section className="rounded-xl border border-sky-500/30 bg-[#0d1622] p-3.5 space-y-3 shadow-md">
        <div className="flex items-center justify-between gap-2 border-b border-sky-500/20 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">🎯</span>
            <h4 className="font-bold text-xs sm:text-sm text-sky-200">
              Guía Paso a Paso del Laboratorio
            </h4>
          </div>
          <span className="text-[10px] text-sky-300/80 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-500/30">
            Demostración Guiada
          </span>
        </div>

        {scenario && (
          <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/20 text-xs text-slate-200">
            <span className="font-bold text-amber-300 block mb-1">📌 Situación de Negocio:</span>
            <p className="leading-relaxed">{scenario[0]}</p>
          </div>
        )}

        {/* Pasos a Seguir en el Simulador */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-300 block">
            📋 Procedimiento en la pantalla del simulador:
          </span>
          <ol className="grid sm:grid-cols-2 gap-2 text-xs">
            <li className="flex items-start gap-2 bg-[#121c2a] p-2 rounded-lg border border-slate-700/60">
              <span className="shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                1
              </span>
              <span className="text-slate-200">
                <strong>Socio de Negocios:</strong> Escribe el código o presiona <code>[...]</code> para buscar al cliente o proveedor en el catálogo.
              </span>
            </li>
            <li className="flex items-start gap-2 bg-[#121c2a] p-2 rounded-lg border border-slate-700/60">
              <span className="shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                2
              </span>
              <span className="text-slate-200">
                <strong>Detalle de Líneas:</strong> Selecciona el artículo desde el buscador <code>[...]</code> y define la cantidad deseada.
              </span>
            </li>
            <li className="flex items-start gap-2 bg-[#121c2a] p-2 rounded-lg border border-slate-700/60">
              <span className="shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                3
              </span>
              <span className="text-slate-200">
                <strong>Validación de Precios:</strong> Observa cómo el sistema calcula precios sugeridos, IVA y totales en tiempo real.
              </span>
            </li>
            <li className="flex items-start gap-2 bg-[#121c2a] p-2 rounded-lg border border-slate-700/60">
              <span className="shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                4
              </span>
              <span className="text-slate-200">
                <strong>Registrar Operación:</strong> Pulsa el botón principal (Añadir / Crear) para procesar el documento en la base de datos de prueba.
              </span>
            </li>
          </ol>
        </div>

        {/* Chips de Datos Rápidos de Prueba */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              🏷️ Datos de prueba recomendados:
            </span>
            <span className="text-[10px] text-slate-500">Haz clic o copia estos valores</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
            <div className="p-1.5 rounded bg-slate-900 border border-slate-700 flex flex-col justify-between">
              <span className="text-[9px] uppercase text-slate-400 font-semibold">Socio Sugerido</span>
              <span className="font-mono font-bold text-amber-300 text-[11px] select-all">C20000 · Maxi-Teq</span>
            </div>
            <div className="p-1.5 rounded bg-slate-900 border border-slate-700 flex flex-col justify-between">
              <span className="text-[9px] uppercase text-slate-400 font-semibold">Artículo</span>
              <span className="font-mono font-bold text-sky-300 text-[11px] select-all">A00001 · Laptop</span>
            </div>
            <div className="p-1.5 rounded bg-slate-900 border border-slate-700 flex flex-col justify-between">
              <span className="text-[9px] uppercase text-slate-400 font-semibold">Cantidad</span>
              <span className="font-mono font-bold text-emerald-300 text-[11px] select-all">1 unidad</span>
            </div>
            <div className="p-1.5 rounded bg-slate-900 border border-slate-700 flex flex-col justify-between">
              <span className="text-[9px] uppercase text-slate-400 font-semibold">Almacén</span>
              <span className="font-mono font-bold text-white text-[11px] select-all">01 - Principal</span>
            </div>
          </div>
        </div>

        {/* Explicación Técnica y Criterio Pedagógico */}
        {scenario && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowExplanation(v => !v)}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-sky-950/40 hover:bg-sky-950/60 border border-sky-500/20 text-xs font-semibold text-sky-200 transition-all active:scale-[0.99]"
            >
              <span className="flex items-center gap-1.5">
                <Info size={14} className="text-amber-400" />
                <span>¿Por qué se parametriza así en SAP? (Criterio Técnico)</span>
              </span>
              {showExplanation ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showExplanation && (
              <div className="mt-2 p-3 rounded-lg bg-[#0a121c] border border-sky-500/30 text-xs text-sky-100 leading-relaxed animate-in fade-in duration-200">
                {scenario[2]}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Simulador Interactivo Sandbox */}
      <section className="rounded-xl border border-slate-700/80 bg-[#0e1620] overflow-hidden shadow-xl">
        {screen ? (
          <div className="p-2 sm:p-3">
            <ManualSandbox key={manualId} manualId={manualId} />
          </div>
        ) : (
          <div className="p-6 text-center text-slate-400 space-y-2">
            <BookOpen className="w-10 h-10 text-amber-500/50 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">Tema Conceptual y Metodológico</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Este manual cubre políticas y criterios de parametrización. Para realizar prácticas con calificación
              oficial y constancia curricular, ingresa a Mi Aula.
            </p>
          </div>
        )}
      </section>

      {/* Enlace y Acceso a Mi Aula Virtual */}
      <div className="rounded-xl border border-slate-800 bg-[#0b1017] p-3 space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-400" />
              <span>Prácticas Oficiales y Certificación</span>
            </h5>
            <p className="text-[11px] text-slate-400">
              Solo Mi Aula guarda tus operaciones en Supabase y valida tu avance para emitir la constancia del módulo.
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-all active:scale-95"
            onClick={() => setShowAula(v => !v)}
          >
            <span>{showAula ? 'Ocultar clases' : 'Ver clases relacionadas en Mi Aula'}</span>
            {showAula ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>

        {showAula && (
          <div className="pt-2 border-t border-slate-800 space-y-3">
            {modules.map(module => (
              <article key={module.id} className="rounded-lg border border-slate-800 bg-slate-900/50 p-2.5">
                <h6 className="font-bold text-xs text-amber-300 mb-2">{module.title}</h6>
                <ul className="space-y-1.5">
                  {module.classes.map(lesson => (
                    <li key={lesson.id}>
                      <Link
                        className="flex items-center justify-between rounded-md border border-slate-700/60 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-blue-950/40 hover:text-white hover:border-blue-500/40 transition-all"
                        href={currentUser ? lessonHref(module.id, lesson.id) : '/login?next=' + encodeURIComponent(lessonHref(module.id, lesson.id))}
                      >
                        <span className="truncate">{lesson.title}</span>
                        <ExternalLink size={12} className="text-slate-500 shrink-0 ml-2" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
