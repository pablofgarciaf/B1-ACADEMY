'use client';

import React, { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { mrp, today, usd } from '@/lib/company-calculations';
import { Field, inputClass, SaveButton, Screen, Table, buttonClass } from './FinixControls';
import {
  Calendar,
  Layers,
  Warehouse,
  FileSpreadsheet,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Play,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Check,
  Package,
} from 'lucide-react';

export default function MRPScreen() {
  const c = useCompany();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [vendorCode, setVendor] = useState('');
  const [run, setRun] = useState({
    scenario: 'MRP_2026_PLAN',
    scenarioDescription: 'Planificación trimestral de compras y producción industrial',
    startDate: today(),
    endDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 45);
      return d.toISOString().slice(0, 10);
    })(),
    level: 'Almacén' as 'Almacén' | 'Empresa',
    warehouseCode: '01',
    itemCodes: [] as string[],
    itemFilterMode: 'all' as 'all' | 'selected',
    selectedItemGroup: 'all',
    horizon: 45,
    bucketSize: 'days' as 'days' | 'weeks' | 'months',
    includePurchases: true,
    includeProduction: true,
    includeSales: true,
    includeForecasts: true,
    considerMinStock: true,
    excludeWarehouses: '',
  });

  const [statusMsg, setStatusMsg] = useState<{ tipo: 'ok' | 'err'; texto: string } | null>(null);

  const rows = mrp(c.data, {
    includeSales: run.includeSales,
    includePurchases: run.includePurchases,
    includeProduction: run.includeProduction,
    includeForecasts: run.includeForecasts,
    warehouseCode: run.level === 'Almacén' ? run.warehouseCode : undefined,
    excludeWarehouses: run.excludeWarehouses ? run.excludeWarehouses.split(',').map(s => s.trim()) : undefined,
    startDate: run.startDate,
    endDate: run.endDate,
  });

  const pedidosAbiertos = c.data.salesOrders.filter(d => d.docType === 'order' && d.status === 'open');
  const bomsActivas = c.data.boms.filter(b => b.type === 'production');
  const faltantes = rows.filter(r => r.shortage > 0);
  const tieneFaltantes = faltantes.length > 0;

  const ejecutarEscenario = async () => {
    setStatusMsg(null);
    try {
      await c.save({
        action: 'mrpRun',
        data: {
          scenario: run.scenario,
          startDate: run.startDate,
          endDate: run.endDate,
          level: run.level,
          warehouseCode: run.warehouseCode,
          itemCodes: run.itemCodes,
          horizon: run.horizon,
          includePurchases: run.includePurchases,
          includeProduction: run.includeProduction,
          includeSales: run.includeSales,
          includeForecasts: run.includeForecasts,
          excludeWarehouses: run.excludeWarehouses.split(',').map(v => v.trim()).filter(Boolean),
        },
      });
      setCurrentStep(6);
      setStatusMsg({
        tipo: 'ok',
        texto: '✓ Escenario de MRP ejecutado con éxito. Se generaron las recomendaciones de reaprovisionamiento.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo ejecutar MRP';
      setStatusMsg({ tipo: 'err', texto: `Error: ${msg}` });
    }
  };

  const generarCompraAutomatica = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorCode) return;
    setStatusMsg(null);
    try {
      await c.save({ action: 'mrp', data: { vendorCode, date: today() } });
      setStatusMsg({
        tipo: 'ok',
        texto: '✓ Solicitud de compra MRP generada automáticamente en SAP Business One con éxito.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al procesar MRP';
      setStatusMsg({ tipo: 'err', texto: `Error: ${msg}` });
    }
  };

  const pasos = [
    { num: 1, title: 'Escenario', desc: 'Selección o creación de escenario' },
    { num: 2, title: 'Horizonte/Fechas', desc: 'Ventana temporal y periodicidad' },
    { num: 3, title: 'Artículos', desc: 'Filtro de productos y componentes' },
    { num: 4, title: 'Almacenes', desc: 'Fuentes de inventario y stock' },
    { num: 5, title: 'Demanda', desc: 'Documentos de demanda y oferta' },
    { num: 6, title: 'Recomendaciones', desc: 'Resultados y órdenes generadas' },
  ];

  return (
    <Screen title="Asistente de Planificación de Necesidades (MRP Wizard) · SAP Business One">
      <div className="space-y-3">
        {/* Banner explicativo del Asistente MRP */}
        <div className="border-l-4 border-[#0055A5] bg-white p-3 rounded-r-xs shadow-xs text-xs">
          <p className="text-gray-700">
            El <strong>Asistente de MRP de SAP Business One</strong> simula las necesidades de compras y fabricación calculando la demanda
            de pedidos de venta abiertos y la explosión de listas de materiales (BOM), deduciendo el stock disponible en almacén y las compras en tránsito.
          </p>
        </div>

        {/* ── BARRA DE PROGRESO DE 6 PASOS DEL ASISTENTE MRP ── */}
        <div className="bg-[#f0f4f8] border border-[#cbd8e5] p-2 rounded-xs">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-1">
            {pasos.map(p => {
              const isActive = currentStep === p.num;
              const isPast = currentStep > p.num;
              return (
                <button
                  key={p.num}
                  type="button"
                  onClick={() => setCurrentStep(p.num)}
                  className={`flex flex-col text-left p-1.5 rounded-xs border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white border-[#0055a5] shadow-xs text-[#003366]'
                      : isPast
                      ? 'bg-[#e7f1f9] border-[#b0c8dc] text-gray-700 hover:bg-white'
                      : 'bg-[#f7fafc] border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        isActive
                          ? 'bg-[#0055a5] text-white'
                          : isPast
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-300 text-gray-700'
                      }`}
                    >
                      {isPast ? <Check size={10} /> : p.num}
                    </span>
                    <span>Paso {p.num}</span>
                  </div>
                  <span className="text-[10px] font-medium truncate mt-0.5">{p.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── CONTENIDO DEL ASISTENTE POR PASO ── */}
        <div className="bg-white border border-[#a6b8cc] rounded-xs p-4 shadow-xs min-h-[300px]">
          {/* PASO 1: SELECCIÓN DE ESCENARIO */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <h3 className="font-bold text-[#003366] text-sm flex items-center gap-2">
                  <Play size={16} className="text-[#0055a5]" />
                  Paso 1: Selección o Definición del Escenario MRP
                </h3>
                <p className="text-gray-500 text-xs">
                  Define los parámetros base del escenario para simular diferentes demandas sin alterar datos reales de inventario.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-3">
                  <Field label="Nombre del Escenario *" required>
                    <input
                      required
                      type="text"
                      className={`${inputClass} font-mono font-bold text-[#003366]`}
                      value={run.scenario}
                      onChange={e => setRun(v => ({ ...v, scenario: e.target.value }))}
                      placeholder="Ej. MRP_2026_Q1"
                    />
                  </Field>
                  <Field label="Descripción del Escenario">
                    <textarea
                      className={`${inputClass} min-h-20`}
                      value={run.scenarioDescription}
                      onChange={e => setRun(v => ({ ...v, scenarioDescription: e.target.value }))}
                    />
                  </Field>
                </div>

                <div className="border border-gray-200 bg-[#f8fafc] p-3 rounded-xs space-y-2 text-xs">
                  <span className="font-bold text-[#003366] block">Opciones del Escenario en SAP B1</span>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                    <input type="radio" checked readOnly name="escenarioTipo" />
                    <span>Crear nuevo escenario de simulación</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-400">
                    <input type="radio" disabled name="escenarioTipo" />
                    <span>Cargar escenario existente guardado</span>
                  </label>
                  <div className="mt-3 pt-2 border-t border-gray-200 text-gray-500 text-[11px]">
                    Los resultados de este asistente se almacenan en el perfil empresarial de forma no destructiva.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: HORIZONTE DE PLANIFICACIÓN Y FECHAS */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <h3 className="font-bold text-[#003366] text-sm flex items-center gap-2">
                  <Calendar size={16} className="text-[#0055a5]" />
                  Paso 2: Horizonte de Planificación y Fechas del MRP
                </h3>
                <p className="text-gray-500 text-xs">
                  Define el rango de fechas en el que SAP B1 analizará la demanda de clientes y las reposiciones de compras.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <Field label="Fecha de Inicio del Horizonte *" required>
                  <input
                    required
                    type="date"
                    className={inputClass}
                    value={run.startDate}
                    onChange={e => setRun(v => ({ ...v, startDate: e.target.value }))}
                  />
                </Field>
                <Field label="Fecha de Fin del Horizonte *" required>
                  <input
                    required
                    type="date"
                    className={inputClass}
                    value={run.endDate}
                    onChange={e => setRun(v => ({ ...v, endDate: e.target.value }))}
                  />
                </Field>
                <Field label="Longitud del Horizonte (Días)">
                  <input
                    type="number"
                    min={1}
                    max={365}
                    className={`${inputClass} font-mono`}
                    value={run.horizon}
                    onChange={e => setRun(v => ({ ...v, horizon: Number(e.target.value) }))}
                  />
                </Field>
              </div>

              <div className="border border-gray-200 bg-[#f8fafc] p-3 rounded-xs text-xs space-y-2">
                <span className="font-bold text-[#003366] block">Periodicidad del cubo temporal (Time Bucket)</span>
                <div className="flex gap-4">
                  {[
                    { id: 'days', label: 'Días laborables' },
                    { id: 'weeks', label: 'Semanas' },
                    { id: 'months', label: 'Meses' },
                  ].map(b => (
                    <label key={b.id} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="bucketSize"
                        value={b.id}
                        checked={run.bucketSize === b.id}
                        onChange={() => setRun(v => ({ ...v, bucketSize: b.id as typeof run.bucketSize }))}
                      />
                      <span>{b.label}</span>
                    </label>
                  ))}
                </div>
                <p className="text-[11px] text-gray-500 pt-1">
                  SAP agrupará las órdenes de compra recomendadas según la periodicidad seleccionada respetando el tiempo de espera (lead time) de cada proveedor.
                </p>
              </div>
            </div>
          )}

          {/* PASO 3: SELECCIÓN DE ARTÍCULOS */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <h3 className="font-bold text-[#003366] text-sm flex items-center gap-2">
                  <Package size={16} className="text-[#0055a5]" />
                  Paso 3: Artículos a Incluir en la Explosión de Necesidades
                </h3>
                <p className="text-gray-500 text-xs">
                  Filtra por grupos o selecciona manualmente los artículos que serán sometidos al cálculo MRP.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <span className="font-bold text-[#003366]">Modo de selección de artículos</span>
                  <div className="flex gap-4 mb-2">
                    <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                      <input
                        type="radio"
                        name="itemMode"
                        checked={run.itemFilterMode === 'all'}
                        onChange={() => setRun(v => ({ ...v, itemFilterMode: 'all', itemCodes: [] }))}
                      />
                      <span>Todos los artículos activos ({c.data.items.length})</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                      <input
                        type="radio"
                        name="itemMode"
                        checked={run.itemFilterMode === 'selected'}
                        onChange={() => setRun(v => ({ ...v, itemFilterMode: 'selected' }))}
                      />
                      <span>Selección manual específica</span>
                    </label>
                  </div>

                  {run.itemFilterMode === 'selected' && (
                    <Field label="Selecciona uno o más artículos (Ctrl + clic)">
                      <select
                        multiple
                        className={`${inputClass} min-h-36 font-mono`}
                        value={run.itemCodes}
                        onChange={e =>
                          setRun(v => ({
                            ...v,
                            itemCodes: Array.from(e.target.selectedOptions, opt => opt.value),
                          }))
                        }
                      >
                        {c.data.items.map(it => (
                          <option key={it.itemCode} value={it.itemCode}>
                            {it.itemCode} · {it.name} [{it.planningMethod === 'production' ? 'Fabricar' : 'Comprar'}]
                          </option>
                        ))}
                      </select>
                    </Field>
                  )}
                </div>

                <div className="border border-gray-200 bg-[#f8fafc] p-3 rounded-xs text-xs space-y-2">
                  <span className="font-bold text-[#003366] block">Resumen de Catálogo en MRP</span>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Artículos de Compra: <strong>{c.data.items.filter(i => i.planningMethod === 'buy').length}</strong></li>
                    <li>• Artículos de Producción: <strong>{c.data.items.filter(i => i.planningMethod === 'production').length}</strong></li>
                    <li>• Estructuras BOM registradas: <strong>{bomsActivas.length}</strong></li>
                  </ul>
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 mt-2">
                    💡 Si un artículo terminado tiene BOM de producción, el MRP generará automáticamente necesidades para sus componentes hijos.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASO 4: ALMACENES Y FUENTES DE INVENTARIO */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <h3 className="font-bold text-[#003366] text-sm flex items-center gap-2">
                  <Warehouse size={16} className="text-[#0055a5]" />
                  Paso 4: Almacenes y Fuentes de Inventario
                </h3>
                <p className="text-gray-500 text-xs">
                  Especifica si la planificación se realiza por almacén individual o consolidada a nivel de toda la empresa.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-3">
                  <Field label="Nivel de Planificación">
                    <select
                      className={inputClass}
                      value={run.level}
                      onChange={e => setRun(v => ({ ...v, level: e.target.value as 'Almacén' | 'Empresa' }))}
                    >
                      <option value="Almacén">Por almacén específico</option>
                      <option value="Empresa">Consolidado para toda la empresa</option>
                    </select>
                  </Field>

                  {run.level === 'Almacén' && (
                    <Field label="Almacén Principal a Planificar">
                      <select
                        className={inputClass}
                        value={run.warehouseCode}
                        onChange={e => setRun(v => ({ ...v, warehouseCode: e.target.value }))}
                      >
                        {(c.data.profile?.warehouses ?? []).map(w => (
                          <option key={w.code} value={w.code}>
                            {w.code} · {w.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                  )}

                  <Field label="Excluir almacenes (Códigos separados por coma)">
                    <input
                      className={inputClass}
                      value={run.excludeWarehouses}
                      placeholder="Ej. 02, 03"
                      onChange={e => setRun(v => ({ ...v, excludeWarehouses: e.target.value }))}
                    />
                  </Field>
                </div>

                <div className="border border-gray-200 bg-[#f8fafc] p-3 rounded-xs text-xs space-y-2">
                  <span className="font-bold text-[#003366] block">Políticas de Stock Mínimo</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={run.considerMinStock}
                      onChange={e => setRun(v => ({ ...v, considerMinStock: e.target.checked }))}
                    />
                    <span>Considerar nivel de stock mínimo de seguridad</span>
                  </label>
                  <p className="text-[11px] text-gray-500">
                    Si el stock proyectado cae por debajo del stock mínimo configurado en el dato maestro (OITM), el MRP generará una recomendación para restablecerlo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PASO 5: DOCUMENTOS DE DEMANDA */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <h3 className="font-bold text-[#003366] text-sm flex items-center gap-2">
                  <FileSpreadsheet size={16} className="text-[#0055a5]" />
                  Paso 5: Documentos de Demanda y Fuentes de Suministro
                </h3>
                <p className="text-gray-500 text-xs">
                  Selecciona qué fuentes de documentos comerciales e industriales se incluirán en el cálculo de necesidades.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="border border-gray-200 p-3 rounded-xs bg-[#f8fafc] space-y-3">
                  <span className="font-bold text-[#003366] block border-b border-gray-200 pb-1">
                    Fuentes de Demanda (Requerimientos)
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={run.includeSales}
                      onChange={e => setRun(v => ({ ...v, includeSales: e.target.checked }))}
                    />
                    <span>Incluir pedidos de clientes abiertos (SAL002) — ({pedidosAbiertos.length} docs)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={run.includeProduction}
                      onChange={e => setRun(v => ({ ...v, includeProduction: e.target.checked }))}
                    />
                    <span>Incluir órdenes de fabricación y componentes de BOM</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={run.includeForecasts}
                      onChange={e => setRun(v => ({ ...v, includeForecasts: e.target.checked }))}
                    />
                    <span>Incluir pronósticos y previsiones comerciales</span>
                  </label>
                </div>

                <div className="border border-gray-200 p-3 rounded-xs bg-[#f8fafc] space-y-3">
                  <span className="font-bold text-[#003366] block border-b border-gray-200 pb-1">
                    Fuentes de Suministro (Oferta en camino)
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={run.includePurchases}
                      onChange={e => setRun(v => ({ ...v, includePurchases: e.target.checked }))}
                    />
                    <span>Incluir solicitudes y pedidos de compra abiertos (PUR001/002)</span>
                  </label>
                  <p className="text-[11px] text-gray-500">
                    Deduce las compras ya confirmadas que están por llegar para evitar duplicar órdenes de aprovisionamiento.
                  </p>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  type="button"
                  onClick={ejecutarEscenario}
                  className="px-4 py-2 bg-[#0055a5] hover:bg-[#004080] text-white font-bold rounded-xs shadow-xs text-xs flex items-center gap-1.5 ml-auto cursor-pointer"
                >
                  <Play size={14} /> Ejecutar Simulación MRP
                </button>
              </div>
            </div>
          )}

          {/* PASO 6: RECOMENDACIONES Y RESULTADOS DEL MRP */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-[#003366] text-sm flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    Paso 6: Resultados y Recomendaciones de Aprovisionamiento
                  </h3>
                  <p className="text-gray-500 text-xs">
                    Matriz de explosión de necesidades netas con recomendaciones automáticas de órdenes de compra y fabricación.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-gray-600 hover:text-black flex items-center gap-1 border border-gray-300 px-2 py-1 rounded cursor-pointer"
                >
                  <RotateCcw size={12} /> Modificar parámetros
                </button>
              </div>

              {/* Indicadores rápidos */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="bg-blue-50 border border-blue-200 p-2.5 rounded text-xs">
                  <span className="text-blue-700 font-bold block">Demanda de Pedidos de Venta:</span>
                  <span className="text-lg font-bold text-blue-950 font-mono">{pedidosAbiertos.length} documento(s)</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded text-xs">
                  <span className="text-amber-700 font-bold block">Estructuras BOM Procesadas:</span>
                  <span className="text-lg font-bold text-amber-950 font-mono">{bomsActivas.length} BOM(s)</span>
                </div>
                <div
                  className={`border p-2.5 rounded text-xs ${
                    tieneFaltantes ? 'bg-red-50 border-red-300' : 'bg-emerald-50 border-emerald-300'
                  }`}
                >
                  <span className={`font-bold block ${tieneFaltantes ? 'text-red-700' : 'text-emerald-700'}`}>
                    {tieneFaltantes ? 'Faltantes Críticos Netos:' : 'Estado de Cobertura:'}
                  </span>
                  <span className={`text-lg font-bold font-mono ${tieneFaltantes ? 'text-red-950' : 'text-emerald-950'}`}>
                    {tieneFaltantes ? `${faltantes.length} artículo(s) con déficit` : '100% Cubierto'}
                  </span>
                </div>
              </div>

              {/* Matriz canónica de resultados MRP */}
              <div className="border border-[#b0c2d4] rounded-xs overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#e9edf2] text-[#003366] border-b border-[#b0c2d4] font-bold text-[11px]">
                    <tr>
                      <th className="p-2 border-r border-[#cbd8e5]">Código de Artículo</th>
                      <th className="p-2 border-r border-[#cbd8e5]">Descripción</th>
                      <th className="p-2 border-r border-[#cbd8e5] text-right">Requerido Total</th>
                      <th className="p-2 border-r border-[#cbd8e5] text-right">Stock Disponible</th>
                      <th className="p-2 border-r border-[#cbd8e5] text-right">En Camino</th>
                      <th className="p-2 border-r border-[#cbd8e5] text-right">Faltante Neto</th>
                      <th className="p-2 text-center">Recomendación SAP B1</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, idx) => {
                      const item = c.data.items.find(i => i.itemCode === r.itemCode);
                      const isShort = r.shortage > 0;
                      return (
                        <tr
                          key={r.itemCode}
                          className={`border-b border-gray-100 ${
                            isShort ? 'bg-red-50/40' : idx % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]'
                          }`}
                        >
                          <td className="p-2 border-r border-[#cbd8e5] font-mono font-bold text-[#003366]">
                            {r.itemCode}
                          </td>
                          <td className="p-2 border-r border-[#cbd8e5] text-gray-700">
                            {item?.name || 'Artículo'}
                          </td>
                          <td className="p-2 border-r border-[#cbd8e5] text-right font-mono font-semibold">
                            {r.required}
                          </td>
                          <td className="p-2 border-r border-[#cbd8e5] text-right font-mono text-gray-600">
                            {r.available}
                          </td>
                          <td className="p-2 border-r border-[#cbd8e5] text-right font-mono text-gray-600">
                            {r.onOrder}
                          </td>
                          <td className="p-2 border-r border-[#cbd8e5] text-right font-mono font-bold">
                            {isShort ? (
                              <span className="text-red-600">-{r.shortage}</span>
                            ) : (
                              <span className="text-emerald-700">0</span>
                            )}
                          </td>
                          <td className="p-2 text-center">
                            {isShort ? (
                              <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded">
                                {item?.planningMethod === 'production' ? 'Generar Orden Producción' : 'Generar Solicitud Compra'} ({r.shortage} u)
                              </span>
                            ) : (
                              <span className="text-emerald-700 text-[10px] font-medium">✓ Stock suficiente</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Formulario de Generación Automática de Solicitud de Compra */}
              {tieneFaltantes ? (
                <form
                  className="p-3 bg-[#f8fafc] border border-gray-300 rounded-xs space-y-2"
                  onSubmit={generarCompraAutomatica}
                >
                  <span className="font-bold text-[#003366] text-xs block">
                    Ejecutar Recomendación: Generar Solicitud de Compra MRP Automática
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                    <Field label="Proveedor sugerido para emitir solicitud de aprovisionamiento" required>
                      <select
                        required
                        className={inputClass}
                        value={vendorCode}
                        onChange={e => setVendor(e.target.value)}
                      >
                        <option value="">-- Seleccionar Proveedor --</option>
                        {c.data.vendors.map(v => (
                          <option key={v.id} value={v.cardCode}>
                            {v.cardCode} · {v.name} ({v.city})
                          </option>
                        ))}
                      </select>
                    </Field>
                    <SaveButton
                      disabled={!tieneFaltantes}
                      label="Generar Solicitud de Compra MRP (PUR001)"
                    />
                  </div>
                </form>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900">
                  ✓ <strong>Sin requerimientos pendientes:</strong> Todo el inventario está cubierto para el horizonte seleccionado.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mensaje de estado */}
        {statusMsg && (
          <div
            className={`p-2 rounded text-xs font-semibold ${
              statusMsg.tipo === 'ok'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-red-100 text-red-900 border border-red-300'
            }`}
          >
            {statusMsg.texto}
          </div>
        )}

        {/* ── BOTONES DE NAVEGACIÓN INFERIOR DEL WIZARD (ATRÁS / SIGUIENTE) ── */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className={`px-3 py-1.5 border rounded text-xs font-medium flex items-center gap-1 cursor-pointer ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white hover:bg-slate-100 text-gray-700 border-gray-300'
            }`}
          >
            <ChevronLeft size={14} /> Atrás
          </button>

          <span className="text-xs text-gray-500 font-mono">
            Paso {currentStep} de 6 — {pasos[currentStep - 1].title}
          </span>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => Math.min(6, prev + 1))}
              className="px-4 py-1.5 bg-[#0055a5] hover:bg-[#004080] text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              Siguiente <ChevronRight size={14} />
            </button>
          ) : currentStep === 5 ? (
            <button
              type="button"
              onClick={ejecutarEscenario}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              Ejecutar MRP <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-gray-700 border border-gray-300 rounded text-xs font-medium cursor-pointer"
            >
              Reiniciar Asistente
            </button>
          )}
        </div>
      </div>
    </Screen>
  );
}
