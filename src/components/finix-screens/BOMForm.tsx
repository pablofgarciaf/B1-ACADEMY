'use client';

import React, { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import type { CommandData } from '@/lib/company-commands';
import { usd } from '@/lib/company-calculations';
import { Screen, Field, Navigation, SaveButton, inputClass, buttonClass, NumberInput } from './FinixControls';
import { Paperclip, Plus, Trash2, ArrowRight, FolderOpen, Eye, Factory, FileSpreadsheet } from 'lucide-react';

export default function BOMForm() {
  const c = useCompany();
  const blank = (): CommandData<'bom'> => ({
    parentItemCode: '',
    type: 'production',
    level: 1,
    baseQuantity: 1,
    warehouseCode: c.data.profile?.warehouses?.[0]?.code ?? '01',
    components: [
      { lineType: 'item', itemCode: '', quantity: 1, unit: 'UND', cost: 0, warehouseCode: c.data.profile?.warehouses?.[0]?.code ?? '01' }
    ]
  });

  const [data, setData] = useState(blank);
  const [index, setIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState<'componentes' | 'general' | 'anexos'>('componentes');
  const [priceList, setPriceList] = useState('01 - Lista Base de Costos');
  const [distRule, setDistRule] = useState('CC-PROD-PLANTA');
  const [project, setProject] = useState('PRJ-ENSAMBLE-2026');
  const [leadTimeDays, setLeadTimeDays] = useState(2);
  const [techComments, setTechComments] = useState('Hoja de ruta estándar para ensamble y control de calidad.');
  const [attachments, setAttachments] = useState<Array<{ id: string; path: string; fileName: string; date: string; user: string }>>([
    { id: 'att-bom-1', path: 'C:\\SAP_Attachments\\Produccion\\Planos\\', fileName: 'plano_despiece_tecnico_v2.pdf', date: '2026-10-15', user: 'ingenieria' }
  ]);
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);

  const reset = () => {
    setIndex(-1);
    setData(blank());
    setActiveTab('componentes');
  };

  const inventoryItems = c.data.items.filter(i => i.type === 'inventory');
  const items = inventoryItems.length > 0 ? inventoryItems : [
    { id: 'fb-1', itemCode: 'A00001', name: 'Laptop Ensamblada B1', type: 'inventory', purchaseUnit: 'UND', purchasePrice: 500 },
    { id: 'fb-2', itemCode: 'A00007', name: 'Disco Duro SSD 1TB Samsung', type: 'inventory', purchaseUnit: 'UND', purchasePrice: 80 },
    { id: 'fb-3', itemCode: 'A00008', name: 'Memoria RAM 16GB DDR4', type: 'inventory', purchaseUnit: 'UND', purchasePrice: 45 },
  ];

  const resources = ((c.data.profile as unknown as Record<string, unknown>)?.resources as { codigo: string; nombre: string; costoPorHora?: number; unidad?: string; activo?: boolean }[] | undefined)?.filter(resource => resource.activo !== false) ?? [
    { codigo: 'REC-MO-01', nombre: 'Técnico Especialista en Ensamble', costoPorHora: 12.5, unidad: 'Horas', activo: true },
    { codigo: 'REC-MAQ-01', nombre: 'Banco de Pruebas y Diagnóstico', costoPorHora: 8.0, unidad: 'Horas', activo: true },
  ];

  const warehouses = c.data.profile?.warehouses?.length ? c.data.profile.warehouses : [{ code: '01', name: 'Bodega Central' }, { code: '02', name: 'Bodega Materias Primas' }];

  const totalCost = data.components.reduce((s, l) => s + (l.quantity || 0) * (l.cost || 0), 0);
  const parentItem = items.find(i => i.itemCode === data.parentItemCode);

  const handleAddAttachment = () => {
    const fileName = prompt('Ingrese el nombre del archivo para adjuntar a la lista de materiales:', 'especificacion_ingenieria.pdf');
    if (!fileName) return;
    setAttachments(prev => [
      ...prev,
      {
        id: `att-${Date.now()}`,
        path: 'C:\\SAP_Attachments\\Produccion\\',
        fileName,
        date: new Date().toISOString().slice(0, 10),
        user: 'manager'
      }
    ]);
  };

  const handleDeleteAttachment = () => {
    if (!selectedAttachment) {
      alert('Seleccione un anexo para borrar.');
      return;
    }
    setAttachments(prev => prev.filter(a => a.id !== selectedAttachment));
    setSelectedAttachment(null);
  };

  return (
    <Screen title="Lista de materiales / Estructura del producto (OITT)">
      {/* Barra de Navegación Oficial SAP B1 */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#cbd5e1] pb-2">
        <Navigation
          count={c.data.boms.length}
          index={index}
          onNew={reset}
          onSelect={i => {
            setIndex(i);
            const b = c.data.boms[i];
            if (b) {
              setData({
                parentItemCode: b.parentItemCode ?? '',
                level: b.level ?? 1,
                baseQuantity: b.baseQuantity ?? 1,
                warehouseCode: b.warehouseCode ?? '01',
                type: b.type ?? 'production',
                components: (b.components ?? []).map(comp => ({
                  lineNumber: comp.lineNumber,
                  lineType: comp.lineType ?? 'item',
                  itemCode: comp.itemCode ?? '',
                  description: comp.description,
                  quantity: comp.quantity ?? 1,
                  unit: comp.unit ?? 'UND',
                  cost: comp.cost ?? 0,
                  warehouseCode: comp.warehouseCode ?? b.warehouseCode ?? '01'
                }))
              });
            }
          }}
        />
        <div className="text-xs text-[#64748b]">
          <span className="font-semibold text-[#1e293b]">
            {data.parentItemCode ? `BOM Padre: ${data.parentItemCode}` : 'Modo Creación (Nueva Lista de Materiales)'}
          </span>
          {' · '}
          <span>Tipo: {data.type?.toUpperCase()}</span>
          {' · '}
          <span>{data.components.length} componentes</span>
        </div>
      </div>

      <form
        className="space-y-3"
        onSubmit={async e => {
          e.preventDefault();
          if (!data.parentItemCode) {
            alert('Debe seleccionar el artículo superior o padre para la lista de materiales.');
            return;
          }
          try {
            await c.save({ action: 'bom', data });
            reset();
          } catch {
            /* Provider error */
          }
        }}
      >
        <fieldset disabled={c.saving || index >= 0} className="space-y-3">
          {/* Cabecera Oficial OITT */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#f8fafc] p-3 rounded border border-[#cbd5e1]">
            <div className="md:col-span-2">
              <label className="text-[11px] font-semibold text-[#475569] block mb-0.5">
                N° de Artículo Padre (Producto Terminado) *
              </label>
              <div className="flex items-center gap-1.5">
                <select
                  required
                  className={inputClass}
                  value={data.parentItemCode ?? ''}
                  onChange={e => setData(d => ({ ...d, parentItemCode: e.target.value }))}
                >
                  <option value="">Seleccione el producto a fabricar...</option>
                  {items.map(i => (
                    <option key={i.id} value={i.itemCode}>
                      {i.itemCode} — {i.name}
                    </option>
                  ))}
                </select>
                {data.parentItemCode && (
                  <button
                    type="button"
                    title="Flecha dorada: Ver datos maestros del producto padre"
                    className="text-[#f59e0b] hover:text-[#d97706] p-1"
                    onClick={() => alert(`Datos maestros del artículo padre: ${data.parentItemCode} (${parentItem?.name})`)}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <Field label="Tipo de Lista de Materiales" required>
              <select
                className={inputClass}
                value={data.type ?? 'production'}
                onChange={e => setData(d => ({ ...d, type: e.target.value as CommandData<'bom'>['type'] }))}
              >
                <option value="production">Producción (Fabricación interna)</option>
                <option value="sales">Ventas (Kit comercial / Paquete)</option>
                <option value="assembly">Montaje (Ensamble en despacho)</option>
                <option value="template">Plantilla / Modelo</option>
              </select>
            </Field>

            <Field label="Cantidad Base">
              <NumberInput
                min={0.0001}
                value={data.baseQuantity ?? 1}
                onChange={value => setData(current => ({ ...current, baseQuantity: value }))}
              />
            </Field>

            <Field label="Almacén de Ingreso PT">
              <select
                className={inputClass}
                value={data.warehouseCode ?? '01'}
                onChange={event => setData(current => ({ ...current, warehouseCode: event.target.value }))}
              >
                {warehouses.map(w => (
                  <option key={w.code} value={w.code}>{w.code} · {w.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Lista de Precios Base">
              <select
                className={inputClass}
                value={priceList}
                onChange={e => setPriceList(e.target.value)}
              >
                <option value="01">01 · Lista Base de Costos</option>
                <option value="02">02 · Mayoristas</option>
                <option value="03">03 · Público General</option>
              </select>
            </Field>

            <Field label="Norma de Reparto / CC">
              <input
                className={inputClass}
                value={distRule}
                onChange={e => setDistRule(e.target.value)}
              />
            </Field>

            <Field label="Proyecto">
              <input
                className={inputClass}
                value={project}
                onChange={e => setProject(e.target.value)}
              />
            </Field>
          </div>

          {/* Selector de Pestañas Oficiales */}
          <div className="flex border-b border-[#cbd5e1] gap-1 bg-[#e2e8f0]/40 p-1 rounded-t">
            <button
              type="button"
              onClick={() => setActiveTab('componentes')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-t transition-all flex items-center gap-1.5 ${
                activeTab === 'componentes'
                  ? 'bg-white text-[#0055A5] border-t-2 border-t-[#0055A5] shadow-sm'
                  : 'text-[#475569] hover:bg-white/60'
              }`}
            >
              <Factory className="h-3 w-3" />
              Componentes y Recursos ({data.components.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('general')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-t transition-all ${
                activeTab === 'general'
                  ? 'bg-white text-[#0055A5] border-t-2 border-t-[#0055A5] shadow-sm'
                  : 'text-[#475569] hover:bg-white/60'
              }`}
            >
              General e Ingeniería
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('anexos')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-t transition-all flex items-center gap-1.5 ${
                activeTab === 'anexos'
                  ? 'bg-white text-[#0055A5] border-t-2 border-t-[#0055A5] shadow-sm'
                  : 'text-[#475569] hover:bg-white/60'
              }`}
            >
              <Paperclip className="h-3 w-3" />
              Anexos ({attachments.length})
            </button>
          </div>

          {/* TAB 1: COMPONENTES Y RECURSOS */}
          {activeTab === 'componentes' && (
            <div className="space-y-2">
              <div className="overflow-x-auto border border-[#cbd5e1] rounded bg-white shadow-inner">
                <table className="min-w-full text-xs text-left border-collapse">
                  <thead className="bg-[#f1f5f9] text-[#475569] font-semibold border-b border-[#cbd5e1]">
                    <tr>
                      <th className="p-2 w-10 text-center">#</th>
                      <th className="p-2 w-28">Tipo</th>
                      <th className="p-2 min-w-[200px]">Código *</th>
                      <th className="p-2 min-w-[200px]">Descripción</th>
                      <th className="p-2 w-24 text-right">Cantidad *</th>
                      <th className="p-2 w-20 text-center">UM</th>
                      <th className="p-2 w-28">Almacén</th>
                      <th className="p-2 w-32">Método Emisión</th>
                      <th className="p-2 w-28 text-right">Costo Unit. ($)</th>
                      <th className="p-2 w-28 text-right">Total ($)</th>
                      <th className="p-2 w-10 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    {data.components.map((line, i) => {
                      const lineTotal = (line.quantity || 0) * (line.cost || 0);
                      return (
                        <tr key={i} className="hover:bg-[#f8fafc] transition-colors">
                          <td className="p-2 text-center text-[#94a3b8] font-mono">{i + 1}</td>
                          <td className="p-1">
                            <select
                              className={inputClass}
                              value={line.lineType ?? 'item'}
                              onChange={event =>
                                setData(current => ({
                                  ...current,
                                  components: current.components.map((component, index) =>
                                    index === i
                                      ? {
                                          ...component,
                                          lineType: event.target.value as 'item' | 'resource',
                                          itemCode: '',
                                          description: undefined,
                                          cost: 0,
                                          unit: event.target.value === 'resource' ? 'Horas' : 'UND'
                                        }
                                      : component
                                  )
                                }))
                              }
                            >
                              <option value="item">Artículo</option>
                              <option value="resource">Recurso (MO)</option>
                            </select>
                          </td>
                          <td className="p-1">
                            <div className="flex items-center gap-1">
                              <select
                                aria-label={`Componente ${i + 1}`}
                                required
                                className={inputClass}
                                value={line.itemCode ?? ''}
                                onChange={e => {
                                  const resource = resources.find(candidate => candidate.codigo === e.target.value);
                                  const article = items.find(candidate => candidate.itemCode === e.target.value);
                                  const isResource = line.lineType === 'resource';
                                  setData(d => ({
                                    ...d,
                                    components: d.components.map((l, j) =>
                                      j === i
                                        ? {
                                            ...l,
                                            itemCode: e.target.value,
                                            description: isResource ? resource?.nombre ?? e.target.value : article?.name ?? e.target.value,
                                            unit: isResource ? resource?.unidad ?? 'Horas' : article?.purchaseUnit ?? 'UND',
                                            cost: isResource ? resource?.costoPorHora ?? 0 : article?.purchasePrice ?? 0
                                          }
                                        : l
                                    )
                                  }));
                                }}
                              >
                                <option value="">Seleccionar...</option>
                                {line.lineType === 'resource'
                                  ? resources.map(resource => (
                                      <option key={resource.codigo} value={resource.codigo}>
                                        {resource.codigo} · {resource.nombre}
                                      </option>
                                    ))
                                  : items
                                      .filter(item => item.itemCode !== data.parentItemCode)
                                      .map(item => (
                                        <option key={item.id} value={item.itemCode}>
                                          {item.itemCode} · {item.name}
                                        </option>
                                      ))}
                              </select>
                              {line.itemCode && (
                                <button
                                  type="button"
                                  title="Flecha dorada: Ver maestro"
                                  className="text-[#f59e0b] hover:text-[#d97706] p-0.5"
                                  onClick={() => alert(`Detalles del componente: ${line.itemCode}`)}
                                >
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="p-2 font-medium text-[#334155] truncate max-w-[200px]" title={line.description ?? line.itemCode}>
                            {line.description ?? line.itemCode ?? '—'}
                          </td>
                          <td className="p-1">
                            <NumberInput
                              ariaLabel={`Cantidad ${i + 1}`}
                              required
                              min={0.000001}
                              value={line.quantity ?? 1}
                              onChange={val =>
                                setData(d => ({
                                  ...d,
                                  components: d.components.map((l, j) => (j === i ? { ...l, quantity: val } : l))
                                }))
                              }
                            />
                          </td>
                          <td className="p-2 text-center text-[#64748b] font-mono">
                            {line.unit ?? 'UND'}
                          </td>
                          <td className="p-1">
                            <select
                              className={inputClass}
                              disabled={line.lineType === 'resource'}
                              value={line.warehouseCode ?? data.warehouseCode ?? '01'}
                              onChange={event =>
                                setData(current => ({
                                  ...current,
                                  components: current.components.map((component, index) =>
                                    index === i ? { ...component, warehouseCode: event.target.value } : component
                                  )
                                }))
                              }
                            >
                              {warehouses.map(warehouse => (
                                <option key={warehouse.code} value={warehouse.code}>
                                  {warehouse.code}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-1">
                            <select
                              className={inputClass}
                              defaultValue="backflush"
                            >
                              <option value="backflush">Notificación (Backflush)</option>
                              <option value="manual">Manual</option>
                            </select>
                          </td>
                          <td className="p-1">
                            <NumberInput
                              ariaLabel={`Costo ${i + 1}`}
                              min={0}
                              value={line.cost ?? 0}
                              onChange={val =>
                                setData(d => ({
                                  ...d,
                                  components: d.components.map((l, j) => (j === i ? { ...l, cost: val } : l))
                                }))
                              }
                            />
                          </td>
                          <td className="p-2 text-right font-mono font-semibold text-[#1e293b]">
                            {usd(lineTotal)}
                          </td>
                          <td className="p-1 text-center">
                            <button
                              type="button"
                              disabled={data.components.length === 1}
                              className="text-[#ef4444] hover:text-[#b91c1c] disabled:opacity-20 p-1"
                              title="Eliminar fila"
                              onClick={() =>
                                setData(d => ({
                                  ...d,
                                  components: d.components.filter((_, j) => i !== j)
                                }))
                              }
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Botones de control de matriz */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={`${buttonClass} flex items-center gap-1`}
                    onClick={() =>
                      setData(d => ({
                        ...d,
                        components: [
                          ...d.components,
                          { lineType: 'item', itemCode: '', quantity: 1, unit: 'UND', cost: 0, warehouseCode: d.warehouseCode }
                        ]
                      }))
                    }
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Añadir Componente (Artículo)
                  </button>
                  <button
                    type="button"
                    className="px-2.5 py-1 text-xs font-semibold bg-[#e0f2fe] text-[#0369a1] hover:bg-[#bae6fd] rounded border border-[#7dd3fc] transition-all flex items-center gap-1"
                    onClick={() =>
                      setData(d => ({
                        ...d,
                        components: [
                          ...d.components,
                          { lineType: 'resource', itemCode: 'REC-MO-01', description: 'Técnico Especialista', quantity: 1, unit: 'Horas', cost: 12.5, warehouseCode: d.warehouseCode }
                        ]
                      }))
                    }
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Añadir Recurso / Mano de Obra
                  </button>
                </div>
                <div className="text-xs text-[#64748b]">
                  {data.components.length} componentes definidos
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GENERAL E INGENIERÍA */}
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded border border-[#cbd5e1]">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0055A5] border-b pb-1">
                  Parámetros de Fabricación y Tiempos
                </h4>
                <Field label="Tiempo de entrega estimado (Lead Time en días)">
                  <input
                    type="number"
                    min={0}
                    className={inputClass}
                    value={leadTimeDays}
                    onChange={e => setLeadTimeDays(Number(e.target.value))}
                  />
                </Field>
                <Field label="Método de cálculo de costos">
                  <select className={inputClass} defaultValue="standard">
                    <option value="standard">Precio Estándar (Componentes + Recursos)</option>
                    <option value="average">Promedio Ponderado de Componentes</option>
                    <option value="fifo">Primera Entrada, Primera Salida (FIFO)</option>
                  </select>
                </Field>
                <Field label="Estatus de Ingeniería">
                  <select className={inputClass} defaultValue="approved">
                    <option value="approved">Aprobado para Producción</option>
                    <option value="prototype">Prototipo / En Evaluación</option>
                    <option value="obsolete">Obsoleto / Bloqueado</option>
                  </select>
                </Field>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0055A5] border-b pb-1">
                  Notas de Ingeniería y Control de Calidad
                </h4>
                <Field label="Observaciones técnicas para planta">
                  <textarea
                    rows={4}
                    className={`${inputClass} resize-none`}
                    value={techComments}
                    onChange={e => setTechComments(e.target.value)}
                    placeholder="Instrucciones específicas de montaje, tolerancias mecánicas..."
                  />
                </Field>
                <div className="p-2.5 rounded bg-[#f1f5f9] text-[11px] text-[#334155] border border-[#e2e8f0]">
                  <strong>Integración con MRP:</strong> La lista de materiales tipo Producción será explotada automáticamente por el Asistente de Planificación de Necesidades de Materiales (MRP) para generar pedidos de compra y órdenes de fabricación.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ANEXOS (Planos y Documentación Técnica) */}
          {activeTab === 'anexos' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded border border-[#cbd5e1]">
              <div className="md:col-span-3 overflow-x-auto border border-[#cbd5e1] rounded">
                <table className="min-w-full text-xs text-left border-collapse">
                  <thead className="bg-[#f1f5f9] text-[#475569] font-semibold border-b border-[#cbd5e1]">
                    <tr>
                      <th className="p-2 w-10 text-center">#</th>
                      <th className="p-2">Ruta de Destino</th>
                      <th className="p-2">Nombre de Archivo</th>
                      <th className="p-2 w-28">Fecha Anexo</th>
                      <th className="p-2 w-28">Usuario</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    {attachments.map((att, i) => (
                      <tr
                        key={att.id}
                        onClick={() => setSelectedAttachment(att.id)}
                        className={`cursor-pointer transition-colors ${
                          selectedAttachment === att.id ? 'bg-[#e0f2fe] font-semibold' : 'hover:bg-[#f8fafc]'
                        }`}
                      >
                        <td className="p-2 text-center text-[#94a3b8]">{i + 1}</td>
                        <td className="p-2 text-[#64748b] font-mono text-[11px]">{att.path}</td>
                        <td className="p-2 text-[#0055A5] flex items-center gap-1.5">
                          <FileSpreadsheet className="h-3.5 w-3.5 text-[#0284c7]" />
                          {att.fileName}
                        </td>
                        <td className="p-2 text-[#64748b]">{att.date}</td>
                        <td className="p-2 text-[#64748b]">{att.user}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Botones de acción lateral de Anexos */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleAddAttachment}
                  className={`${buttonClass} flex items-center justify-center gap-1.5 w-full font-semibold`}
                >
                  <FolderOpen className="h-3.5 w-3.5" />
                  Explorar...
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedAttachment) {
                      alert('Seleccione un plano de la lista para visualizar.');
                      return;
                    }
                    const att = attachments.find(a => a.id === selectedAttachment);
                    alert(`Visualizando plano técnico: ${att?.fileName}`);
                  }}
                  className={`${buttonClass} flex items-center justify-center gap-1.5 w-full`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Visualizar
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAttachment}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-white text-[#ef4444] border border-[#fca5a5] hover:bg-[#fef2f2] flex items-center justify-center gap-1.5 w-full transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Borrar Anexo
                </button>
              </div>
            </div>
          )}
        </fieldset>

        {/* Resumen de Costo de Producción y Botones */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded border bg-[#f8fafc] border-[#cbd5e1]">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[11px] text-[#64748b] block">Costo Estimado de Fabricación</span>
              <span className="text-base font-bold font-mono text-[#0055A5]">{usd(totalCost)}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#64748b] block">Cantidad Base</span>
              <span className="text-sm font-semibold font-mono text-[#1e293b]">{data.baseQuantity ?? 1} UND</span>
            </div>
            <div>
              <span className="text-[11px] text-[#64748b] block">Costo Unitario Resultante</span>
              <span className="text-sm font-semibold font-mono text-[#1e293b]">
                {usd(totalCost / Math.max(0.0001, data.baseQuantity ?? 1))} / UND
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SaveButton disabled={index >= 0 || !data.parentItemCode} label="Actualizar / Crear BOM" />
            <button
              type="button"
              className={buttonClass}
              disabled={c.saving}
              onClick={reset}
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </Screen>
  );
}
