'use client';

import React, { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import type { CommandData } from '@/lib/company-commands';
import { today, usd } from '@/lib/company-calculations';
import { inputClass, buttonClass, NumberInput } from './FinixControls';
import {
  Factory,
  Layers,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  PackageCheck,
  FolderOpen,
  Eye,
  Trash2,
  Plus
} from 'lucide-react';

export default function ProductionOrderForm() {
  const c = useCompany();
  const prodBoms = c.data.boms.filter(b => b.type === 'production');
  const boms = prodBoms.length > 0 ? prodBoms : [
    {
      id: 'fb-bom-1',
      bomCode: 'BOM-A00001',
      parentItemCode: 'A00001',
      type: 'production' as const,
      components: [
        { itemCode: 'A00007', quantity: 1, unit: 'UND', cost: 80, lineType: 'item' as const },
        { itemCode: 'A00008', quantity: 1, unit: 'UND', cost: 45, lineType: 'item' as const },
      ],
    },
  ];

  const warehouses = c.data.profile?.warehouses?.length
    ? c.data.profile.warehouses
    : [{ code: '01', name: 'Bodega Principal' }, { code: '02', name: 'Bodega de Producción' }];

  // Cabecera OWOR
  const [orderType, setOrderType] = useState<'standard' | 'special' | 'disassembly'>('standard');
  const [status, setStatus] = useState<'planned' | 'released' | 'in_progress' | 'closed'>('planned');
  const [bomCode, setBomCode] = useState(boms[0]?.bomCode || 'BOM-A00001');
  const [plannedQty, setPlannedQty] = useState<number>(10);
  const [completedQty, setCompletedQty] = useState<number>(0);
  const [rejectedQty, setRejectedQty] = useState<number>(0);
  const [targetWarehouse, setTargetWarehouse] = useState(warehouses[0]?.code || '01');
  const [priority, setPriority] = useState<number>(3);
  const [postDate, setPostDate] = useState(today());
  const [startDate, setStartDate] = useState(today());
  const [dueDate, setDueDate] = useState(today());
  const [orderNum, setOrderNum] = useState<string>('OP-2026-0018');

  // Pestañas Oficiales SAP B1: [ Componentes | General | Resumen | Anexos ]
  const [activeTab, setActiveTab] = useState<'componentes' | 'general' | 'resumen' | 'anexos'>('componentes');

  // Pestaña General
  const [customerOrder, setCustomerOrder] = useState('ORDR-1002 — Maxi-Teq S.A.');
  const [costCenter, setCostCenter] = useState('CC-PROD Planta Principal');
  const [projectCode, setProjectCode] = useState('PRJ-2026-LOTE1');
  const [userResponsible, setUserResponsible] = useState('Jefe de Planta / Producción');

  // Pestaña Anexos
  const [attachments, setAttachments] = useState<Array<{ id: string; targetPath: string; fileName: string; date: string; freeText: string }>>([
    { id: 'att-p1', targetPath: 'C:\\SAP_Attachments\\', fileName: 'Ficha_Tecnica_BOM_A00001.pdf', date: today(), freeText: 'Diagrama de ensamble e ingeniería' },
    { id: 'att-p2', targetPath: 'C:\\SAP_Attachments\\', fileName: 'Certificado_Control_Calidad.pdf', date: today(), freeText: 'Protocolo de validación eléctrica' },
  ]);
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState<number | null>(null);

  // Componentes
  const activeBom = (c.data.boms.length > 0 ? c.data.boms : boms).find(b => b.bomCode === bomCode);
  const baseComponents = activeBom?.components ?? [];

  const [lines, setLines] = useState(
    baseComponents.map((c, i) => {
      const compDesc = 'description' in c ? (c as { description?: string }).description : undefined;
      return {
        lineNumber: i + 1,
        lineType: c.lineType || 'item',
        itemCode: c.itemCode || '',
        description: compDesc || (c.itemCode === 'A00007' ? 'Disco Duro SSD 1TB Samsung' : 'Memoria RAM 16GB DDR4'),
        baseQty: c.quantity || 1,
        requiredQty: (c.quantity || 1) * plannedQty,
        issuedQty: 0,
        available: 50,
        warehouse: warehouses[0]?.code || '01',
        issueMethod: 'Manual',
        unitCost: c.cost || 80,
      };
    })
  );

  // Recalcular requeridos si cambia la cantidad planificada
  const handlePlannedQtyChange = (val: number) => {
    setPlannedQty(val);
    setLines(lines.map(l => ({ ...l, requiredQty: l.baseQty * val })));
  };

  // Costos calculados
  const totalComponentCost = lines.reduce((acc, l) => acc + l.requiredQty * l.unitCost, 0);
  const totalResourceCost = 150; // Costo estimado de horas hombre / máquina
  const totalProductionCost = totalComponentCost + totalResourceCost;

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await c.save({
        action: 'production',
        data: {
          bomCode,
          quantity: plannedQty,
          warehouseCode: targetWarehouse,
          date: postDate,
          dueDate,
          priority,
        },
      });
      alert('Orden de fabricación registrada exitosamente en estado Planificada.');
    } catch {
      // Manejado por useCompany
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#f0f3f6] text-[#1c2d42] font-[Tahoma,Arial,sans-serif] text-[11px] p-2 select-none overflow-y-auto">
      {/* Barra de Título / Cabecera SAP B1 */}
      <div className="bg-[#e4ebf2] border border-[#a2b8cc] rounded-t p-2 flex items-center justify-between mb-1 shadow-xs">
        <div className="flex items-center gap-2">
          <Factory size={15} className="text-[#0055A5]" />
          <h2 className="font-bold text-[12px] text-[#003366]">Orden de fabricación (OWOR)</h2>
          <span className="bg-[#0055A5] text-white text-[10px] px-2 py-0.5 rounded font-mono font-bold">{orderNum}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#556677]">Estado:</span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              status === 'planned'
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : status === 'released'
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : status === 'in_progress'
                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}
          >
            {status === 'planned' ? 'Planificada' : status === 'released' ? 'Liberada' : status === 'in_progress' ? 'En proceso' : 'Cerrada'}
          </span>
        </div>
      </div>

      <form onSubmit={handleCreateOrder} className="flex-1 flex flex-col bg-white border border-[#a2b8cc] rounded-b p-2 space-y-2 shadow-sm">
        {/* Cabecera de Dos Columnas Canónica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#f8fafc] border border-[#d8e3ea] p-2.5 rounded">
          {/* Columna Izquierda: Producto y Cantidades */}
          <div className="space-y-1.5">
            <div className="grid grid-cols-3 items-center gap-1">
              <label className="text-[11px] font-semibold text-[#445566]">Tipo de orden:</label>
              <select className={`${inputClass} col-span-2`} value={orderType} onChange={e => setOrderType(e.target.value as any)}>
                <option value="standard">Estándar (Producción Normal)</option>
                <option value="special">Especial (Reparación / Retrabajo)</option>
                <option value="disassembly">Desmontaje (Despiece de componentes)</option>
              </select>
            </div>
            <div className="grid grid-cols-3 items-center gap-1">
              <label className="text-[11px] font-semibold text-[#445566]">Producto / BOM *:</label>
              <select className={`${inputClass} col-span-2`} value={bomCode} onChange={e => setBomCode(e.target.value)}>
                {boms.map(b => (
                  <option key={b.id} value={b.bomCode}>
                    {b.parentItemCode} — {b.bomCode}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 items-center gap-1">
              <label className="text-[11px] font-semibold text-[#445566]">Cantidad planificada *:</label>
              <div className="col-span-2 flex items-center gap-2">
                <NumberInput min={1} value={plannedQty} onChange={handlePlannedQtyChange} />
                <span className="text-[10px] text-[#556677] font-bold">UND</span>
              </div>
            </div>
            <div className="grid grid-cols-3 items-center gap-1">
              <label className="text-[11px] text-[#445566]">Almacén de destino:</label>
              <select className={`${inputClass} col-span-2`} value={targetWarehouse} onChange={e => setTargetWarehouse(e.target.value)}>
                {warehouses.map(w => (
                  <option key={w.code} value={w.code}>
                    {w.code} — {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Columna Derecha: Fechas y Prioridad */}
          <div className="space-y-1.5">
            <div className="grid grid-cols-3 items-center gap-1">
              <label className="text-[11px] font-semibold text-[#445566]">Fecha contabilización:</label>
              <input type="date" required className={`${inputClass} col-span-2`} value={postDate} onChange={e => setPostDate(e.target.value)} />
            </div>
            <div className="grid grid-cols-3 items-center gap-1">
              <label className="text-[11px] font-semibold text-[#445566]">Fecha de inicio *:</label>
              <input type="date" required className={`${inputClass} col-span-2`} value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="grid grid-cols-3 items-center gap-1">
              <label className="text-[11px] font-semibold text-[#445566]">Fecha de vencimiento *:</label>
              <input type="date" required className={`${inputClass} col-span-2`} value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
            <div className="grid grid-cols-3 items-center gap-1">
              <label className="text-[11px] text-[#445566]">Prioridad (1-5):</label>
              <select className={`${inputClass} col-span-2`} value={priority} onChange={e => setPriority(Number(e.target.value))}>
                <option value={1}>1 — Muy Baja</option>
                <option value={2}>2 — Baja</option>
                <option value={3}>3 — Normal</option>
                <option value={4}>4 — Alta</option>
                <option value={5}>5 — Urgente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pestañas Oficiales de SAP B1 */}
        <div className="flex border-b border-[#a2b8cc] gap-1 pt-1 bg-[#eaf0f5] px-1 rounded-t">
          <button
            type="button"
            onClick={() => setActiveTab('componentes')}
            className={`px-3 py-1 font-bold text-[11px] border-t border-x rounded-t cursor-pointer transition ${
              activeTab === 'componentes'
                ? 'bg-white border-[#a2b8cc] border-b-transparent text-[#003366] shadow-xs'
                : 'bg-[#d8e3ea] border-transparent text-[#556677] hover:bg-[#e4ebf2]'
            }`}
          >
            Componentes ({lines.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-3 py-1 font-bold text-[11px] border-t border-x rounded-t cursor-pointer transition ${
              activeTab === 'general'
                ? 'bg-white border-[#a2b8cc] border-b-transparent text-[#003366] shadow-xs'
                : 'bg-[#d8e3ea] border-transparent text-[#556677] hover:bg-[#e4ebf2]'
            }`}
          >
            General
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('resumen')}
            className={`px-3 py-1 font-bold text-[11px] border-t border-x rounded-t cursor-pointer transition ${
              activeTab === 'resumen'
                ? 'bg-white border-[#a2b8cc] border-b-transparent text-[#003366] shadow-xs'
                : 'bg-[#d8e3ea] border-transparent text-[#556677] hover:bg-[#e4ebf2]'
            }`}
          >
            Resumen de Costos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('anexos')}
            className={`px-3 py-1 font-bold text-[11px] border-t border-x rounded-t cursor-pointer transition ${
              activeTab === 'anexos'
                ? 'bg-white border-[#a2b8cc] border-b-transparent text-[#003366] shadow-xs'
                : 'bg-[#d8e3ea] border-transparent text-[#556677] hover:bg-[#e4ebf2]'
            }`}
          >
            Anexos ({attachments.length})
          </button>
        </div>

        {/* Contenido de la Pestaña Activa */}
        <div className="flex-1 min-h-[200px]">
          {/* PESTAÑA 1: COMPONENTES */}
          {activeTab === 'componentes' && (
            <div className="space-y-2">
              <div className="overflow-x-auto border border-[#a2b8cc] rounded">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-[#e4ebf2] text-[#003366] border-b border-[#a2b8cc]">
                      <th className="p-1 text-center w-8">#</th>
                      <th className="p-1 w-20">Tipo</th>
                      <th className="p-1 w-28">Componente</th>
                      <th className="p-1">Descripción</th>
                      <th className="p-1 w-20 text-right">Cant. Base</th>
                      <th className="p-1 w-24 text-right">Requerida</th>
                      <th className="p-1 w-20 text-right">Emitida</th>
                      <th className="p-1 w-20 text-right">Disponible</th>
                      <th className="p-1 w-16 text-center">Almacén</th>
                      <th className="p-1 w-24">Método emisión</th>
                      <th className="p-1 w-24 text-right">Costo unit.</th>
                      <th className="p-1 w-24 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((l, idx) => (
                      <tr key={idx} className="border-b border-[#e2ecf2] hover:bg-[#f5f9fc]">
                        <td className="p-1 text-center text-[#667788]">{idx + 1}</td>
                        <td className="p-1 font-semibold text-[#0055A5]">{l.lineType === 'item' ? 'Artículo' : 'Recurso'}</td>
                        <td className="p-1 font-mono font-bold text-[#334455]">{l.itemCode}</td>
                        <td className="p-1 text-[#334455]">{l.description}</td>
                        <td className="p-1 text-right font-mono text-[10px]">{l.baseQty}</td>
                        <td className="p-1 text-right font-mono font-bold text-[10px] text-[#003366]">{l.requiredQty}</td>
                        <td className="p-1 text-right font-mono text-[10px] text-[#667788]">{l.issuedQty}</td>
                        <td className="p-1 text-right font-mono text-[10px] text-[#2e7d32] font-semibold">{l.available}</td>
                        <td className="p-1 text-center font-mono text-[10px]">{l.warehouse}</td>
                        <td className="p-1 text-[#556677]">{l.issueMethod}</td>
                        <td className="p-1 text-right font-mono text-[10px]">{usd(l.unitCost)}</td>
                        <td className="p-1 text-right font-mono font-bold text-[10px] text-[#003366]">{usd(l.requiredQty * l.unitCost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PESTAÑA 2: GENERAL */}
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 bg-[#f8fafc] border border-[#d8e3ea] rounded">
              <div className="space-y-2">
                <h4 className="font-bold text-[#003366] text-[11px] border-b pb-1 flex items-center gap-1.5">
                  <Layers size={13} /> Asignaciones y Referencias
                </h4>
                <div className="space-y-1">
                  <label className="text-[11px] text-[#445566]">Pedido de cliente vinculado:</label>
                  <input className={inputClass} value={customerOrder} onChange={e => setCustomerOrder(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-[#445566]">Responsable de orden:</label>
                  <input className={inputClass} value={userResponsible} onChange={e => setUserResponsible(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-[#003366] text-[11px] border-b pb-1 flex items-center gap-1.5">
                  <CheckCircle2 size={13} /> Imputación Contable y Proyectos
                </h4>
                <div className="space-y-1">
                  <label className="text-[11px] text-[#445566]">Centro de costo / Norma reparto:</label>
                  <input className={inputClass} value={costCenter} onChange={e => setCostCenter(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-[#445566]">Código de proyecto:</label>
                  <input className={inputClass} value={projectCode} onChange={e => setProjectCode(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA 3: RESUMEN DE COSTOS */}
          {activeTab === 'resumen' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-[#f8fafc] border border-[#d8e3ea] rounded">
              <div className="space-y-2 bg-white p-3 border rounded shadow-2xs">
                <h4 className="font-bold text-[#003366] text-[11px] border-b pb-1">Desglose de Costos de Fabricación</h4>
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#556677]">Costo total de componentes:</span>
                  <span className="font-mono font-bold text-[#003366]">{usd(totalComponentCost)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#556677]">Costo estimado de recursos:</span>
                  <span className="font-mono font-bold text-[#003366]">{usd(totalResourceCost)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#e2e8f0] bg-[#f8fafc] px-2 font-bold text-[12px]">
                  <span className="text-[#003366]">Costo total de la orden:</span>
                  <span className="font-mono text-[#2e7d32]">{usd(totalProductionCost)}</span>
                </div>
                <div className="flex justify-between py-1 text-[11px]">
                  <span className="text-[#556677]">Costo unitario planificado:</span>
                  <span className="font-mono font-bold text-[#0055A5]">{usd(totalProductionCost / Math.max(1, plannedQty))}</span>
                </div>
              </div>

              <div className="space-y-2 bg-white p-3 border rounded shadow-2xs">
                <h4 className="font-bold text-[#003366] text-[11px] border-b pb-1">Progreso y Rendimiento de Planta</h4>
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#556677]">Cantidad planificada:</span>
                  <span className="font-mono font-bold">{plannedQty} UND</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#556677]">Cantidad completada (recibida):</span>
                  <span className="font-mono font-bold text-[#2e7d32]">{completedQty} UND</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#556677]">Cantidad rechazada (merma):</span>
                  <span className="font-mono font-bold text-[#c62828]">{rejectedQty} UND</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#556677]">Desviación contable de producción:</span>
                  <span className="font-mono font-bold text-[#556677]">{usd(0)}</span>
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA 4: ANEXOS (OFICIAL SAP B1) */}
          {activeTab === 'anexos' && (
            <div className="p-2 border border-[#a2b8cc] rounded bg-white space-y-2">
              <div className="flex gap-2">
                <div className="flex-1 overflow-x-auto border border-[#a2b8cc] rounded">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-[#e4ebf2] text-[#003366] border-b border-[#a2b8cc]">
                        <th className="p-1 text-center w-8">#</th>
                        <th className="p-1 w-40">Vía de acceso destino</th>
                        <th className="p-1 w-48">Nombre de archivo</th>
                        <th className="p-1 w-24">Fecha del anexo</th>
                        <th className="p-1">Texto libre</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attachments.map((att, idx) => (
                        <tr
                          key={att.id}
                          onClick={() => setSelectedAttachmentIndex(idx)}
                          className={`border-b border-[#e2ecf2] cursor-pointer ${
                            selectedAttachmentIndex === idx ? 'bg-[#fffde7] font-semibold' : 'hover:bg-[#f8fafc]'
                          }`}
                        >
                          <td className="p-1 text-center text-[#667788]">{idx + 1}</td>
                          <td className="p-1 font-mono text-[10px] text-[#556677]">{att.targetPath}</td>
                          <td className="p-1 text-[#0055A5] flex items-center gap-1">
                            <Paperclip size={11} /> {att.fileName}
                          </td>
                          <td className="p-1 font-mono text-[10px]">{att.date}</td>
                          <td className="p-1 text-[#556677]">{att.freeText}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Botones Laterales Oficiales SAP B1 */}
                <div className="w-28 flex flex-col gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const name = prompt('Nombre del anexo (ej. Plano_Ensamble.pdf):', 'Doc_Produccion.pdf');
                      if (name) {
                        setAttachments([
                          ...attachments,
                          {
                            id: `att-p-${Date.now()}`,
                            targetPath: 'C:\\SAP_Attachments\\',
                            fileName: name,
                            date: today(),
                            freeText: 'Documento técnico de manufactura',
                          },
                        ]);
                      }
                    }}
                    className={`${buttonClass} text-[10px] py-1 flex items-center justify-center gap-1`}
                  >
                    <FolderOpen size={11} /> Explorar...
                  </button>
                  <button
                    type="button"
                    disabled={selectedAttachmentIndex === null}
                    onClick={() => {
                      if (selectedAttachmentIndex !== null) {
                        alert(`Visualizando anexo de manufactura: ${attachments[selectedAttachmentIndex].fileName}`);
                      }
                    }}
                    className={`${buttonClass} text-[10px] py-1 flex items-center justify-center gap-1 disabled:opacity-50`}
                  >
                    <Eye size={11} /> Visualizar
                  </button>
                  <button
                    type="button"
                    disabled={selectedAttachmentIndex === null}
                    onClick={() => {
                      if (selectedAttachmentIndex !== null) {
                        setAttachments(attachments.filter((_, i) => i !== selectedAttachmentIndex));
                        setSelectedAttachmentIndex(null);
                      }
                    }}
                    className={`${buttonClass} text-[10px] py-1 text-red-600 flex items-center justify-center gap-1 disabled:opacity-50`}
                  >
                    <Trash2 size={11} /> Borrar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botones Operativos Oficiales de la Orden de Producción */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#d8e3ea]">
          <div className="flex gap-2">
            <button type="submit" disabled={c.saving} className={`${buttonClass} font-bold text-[#003366]`}>
              {c.saving ? 'Guardando...' : 'Crear orden planificada'}
            </button>
            {status === 'planned' && (
              <button
                type="button"
                className={`${buttonClass} bg-blue-50 text-blue-700 border-blue-300 font-semibold flex items-center gap-1`}
                onClick={() => {
                  setStatus('released');
                  alert('Orden liberada para producción en planta.');
                }}
              >
                <PlayCircle size={12} /> Liberar orden
              </button>
            )}
            {status === 'released' && (
              <button
                type="button"
                className={`${buttonClass} bg-amber-50 text-amber-700 border-amber-300 font-semibold flex items-center gap-1`}
                onClick={() => {
                  setStatus('in_progress');
                  setLines(lines.map(l => ({ ...l, issuedQty: l.requiredQty })));
                  alert('Componentes emitidos para fabricación. Orden en proceso.');
                }}
              >
                <PackageCheck size={12} /> Emitir componentes
              </button>
            )}
            {status === 'in_progress' && (
              <button
                type="button"
                className={`${buttonClass} bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold flex items-center gap-1`}
                onClick={() => {
                  setStatus('closed');
                  setCompletedQty(plannedQty);
                  alert(`Recibo de producción completado: ${plannedQty} unidades ingresadas a inventario.`);
                }}
              >
                <CheckCircle2 size={12} /> Recibir producción
              </button>
            )}
          </div>
          <div className="text-[11px] text-[#556677]">
            Costo estimado total: <strong className="font-mono text-[#003366] text-sm">{usd(totalProductionCost)}</strong>
          </div>
        </div>
      </form>
    </div>
  );
}
