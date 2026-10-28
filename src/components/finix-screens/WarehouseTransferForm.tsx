'use client';

import React, { useState, useEffect } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { today, usd } from '@/lib/company-calculations';
import { inputClass, buttonClass, NumberInput } from './FinixControls';
import {
  ArrowLeftRight,
  Boxes,
  Truck,
  Paperclip,
  Search,
  Plus,
  Trash2,
  Eye,
  FolderOpen
} from 'lucide-react';

export default function WarehouseTransferForm() {
  const c = useCompany();
  const warehouses = c.data.profile?.warehouses?.length
    ? c.data.profile.warehouses
    : [
        { code: '01', name: 'Bodega Principal' },
        { code: '02', name: 'Bodega Sucursal Norte' },
        { code: '03', name: 'Bodega Cuarentena' },
      ];

  const items = c.data.items.filter(item => item.active && item.type === 'inventory');

  // Cabecera OWTR
  const [docNum, setDocNum] = useState<string>('TR-2026-0042');
  const [fromWarehouse, setFromWarehouse] = useState(warehouses[0]?.code ?? '01');
  const [toWarehouse, setToWarehouse] = useState(warehouses[1]?.code ?? '02');
  const [postingDate, setPostingDate] = useState(today());
  const [docDate, setDocDate] = useState(today());
  const [taxDate, setTaxDate] = useState(today());
  const [priceList, setPriceList] = useState('Lista 1 — Costo Promedio');
  const [salesEmployee, setSalesEmployee] = useState('Responsable de Bodega');
  const [comments, setComments] = useState('Transferencia interna para abastecimiento de sucursal');

  // Pestañas Oficiales SAP B1: [ Contenido | Logística | Anexos ]
  const [activeTab, setActiveTab] = useState<'contenido' | 'logistica' | 'anexos'>('contenido');

  // Matriz de Líneas (WTR1)
  const [lines, setLines] = useState([
    {
      itemCode: items[0]?.itemCode || 'A00001',
      description: items[0]?.name || 'Laptop Ensamblada B1',
      fromWhs: warehouses[0]?.code ?? '01',
      toWhs: warehouses[1]?.code ?? '02',
      quantity: 5,
      unit: 'UND',
      available: 45,
      unitCost: 500,
    },
    {
      itemCode: items[1]?.itemCode || 'A00007',
      description: items[1]?.name || 'Disco Duro SSD 1TB Samsung',
      fromWhs: warehouses[0]?.code ?? '01',
      toWhs: warehouses[1]?.code ?? '02',
      quantity: 10,
      unit: 'UND',
      available: 80,
      unitCost: 80,
    },
  ]);

  // Logística
  const [shipToAddress, setShipToAddress] = useState('Av. Amazonas N24-100 y Colón, Quito');
  const [fromAddress, setFromAddress] = useState('Parque Industrial Sur, Vía Tambillo Km 5');
  const [carrier, setCarrier] = useState('Logística y Carga Express S.A.');
  const [driverName, setDriverName] = useState('Carlos Mendoza');
  const [licensePlate, setLicensePlate] = useState('PBA-4821');

  // Anexos
  const [attachments, setAttachments] = useState<Array<{ id: string; targetPath: string; fileName: string; date: string; freeText: string }>>([
    { id: 'att-1', targetPath: 'C:\\SAP_Attachments\\', fileName: 'Guia_Remision_TR42.pdf', date: today(), freeText: 'Guía de remisión electrónica autorizada por SRI' },
    { id: 'att-2', targetPath: 'C:\\SAP_Attachments\\', fileName: 'Checklist_Despacho_Fisico.xlsx', date: today(), freeText: 'Acta de entrega-recepción bodega sur' },
  ]);
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState<number | null>(null);

  // Totales
  const totalUnits = lines.reduce((acc, l) => acc + (Number(l.quantity) || 0), 0);
  const totalValue = lines.reduce((acc, l) => acc + (Number(l.quantity) || 0) * (Number(l.unitCost) || 0), 0);

  const addLine = () => {
    setLines([
      ...lines,
      {
        itemCode: '',
        description: '',
        fromWhs: fromWarehouse,
        toWhs: toWarehouse,
        quantity: 1,
        unit: 'UND',
        available: 0,
        unitCost: 0,
      },
    ]);
  };

  const updateLine = (idx: number, patch: Partial<(typeof lines)[0]>) => {
    setLines(lines.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
  };

  const removeLine = (idx: number) => {
    if (lines.length > 1) {
      setLines(lines.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fromWarehouse === toWarehouse) {
      alert('El almacén de origen y el almacén de destino no pueden ser iguales.');
      return;
    }
    try {
      await c.save({
        action: 'transfer',
        data: {
          from: fromWarehouse,
          to: toWarehouse,
          date: postingDate,
          lines: lines.map(l => ({ itemCode: l.itemCode, quantity: l.quantity })),
        },
      });
      alert('Transferencia de stock contabilizada exitosamente en el sistema.');
    } catch {
      // Manejado por useCompany
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#f0f3f6] text-[#1c2d42] font-[Tahoma,Arial,sans-serif] text-[11px] p-2 select-none overflow-y-auto">
      {/* Barra de Título / Cabecera SAP B1 */}
      <div className="bg-[#e4ebf2] border border-[#a2b8cc] rounded-t p-2 flex items-center justify-between mb-1 shadow-xs">
        <div className="flex items-center gap-2">
          <ArrowLeftRight size={15} className="text-[#0055A5]" />
          <h2 className="font-bold text-[12px] text-[#003366]">Transferencia de stock (OWTR)</h2>
          <span className="bg-[#0055A5] text-white text-[10px] px-2 py-0.5 rounded font-mono font-bold">{docNum}</span>
        </div>
        <div className="text-[10px] text-[#556677] flex items-center gap-3">
          <span>Estado: <strong className="text-[#2e7d32]">Abierto</strong></span>
          <span>Período: <strong className="font-mono">{postingDate.slice(0, 7)}</strong></span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col bg-white border border-[#a2b8cc] rounded-b p-2 space-y-2 shadow-sm">
        {/* Cabecera de Dos Columnas Canónica de SAP B1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#f8fafc] border border-[#d8e3ea] p-2.5 rounded">
          {/* Columna Izquierda: Almacenes e Interlocutor */}
          <div className="space-y-1.5">
            <div className="grid grid-cols-3 items-center gap-1">
              <label className="text-[11px] font-semibold text-[#445566]">De almacén *:</label>
              <select
                className={`${inputClass} col-span-2`}
                value={fromWarehouse}
                onChange={e => {
                  setFromWarehouse(e.target.value);
                  setLines(lines.map(l => ({ ...l, fromWhs: e.target.value })));
                }}
              >
                {warehouses.map(w => (
                  <option key={w.code} value={w.code}>
                    {w.code} — {w.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 items-center gap-1">
              <label className="text-[11px] font-semibold text-[#445566]">A almacén *:</label>
              <select
                className={`${inputClass} col-span-2`}
                value={toWarehouse}
                onChange={e => {
                  setToWarehouse(e.target.value);
                  setLines(lines.map(l => ({ ...l, toWhs: e.target.value })));
                }}
              >
                {warehouses.map(w => (
                  <option key={w.code} value={w.code}>
                    {w.code} — {w.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 items-center gap-1">
              <label className="text-[11px] text-[#445566]">Lista de precios:</label>
              <select className={`${inputClass} col-span-2`} value={priceList} onChange={e => setPriceList(e.target.value)}>
                <option>Lista 1 — Costo Promedio Ponderado</option>
                <option>Lista 2 — PVP Venta Mayorista</option>
                <option>Lista 3 — Último Precio Determinado</option>
              </select>
            </div>
            <div className="grid grid-cols-3 items-center gap-1">
              <label className="text-[11px] text-[#445566]">Empleado almacén:</label>
              <input className={`${inputClass} col-span-2`} value={salesEmployee} onChange={e => setSalesEmployee(e.target.value)} />
            </div>
          </div>

          {/* Columna Derecha: Fechas y Numeración */}
          <div className="space-y-1.5">
            <div className="grid grid-cols-3 items-center gap-1">
              <label className="text-[11px] font-semibold text-[#445566]">Fecha contabilización *:</label>
              <input type="date" required className={`${inputClass} col-span-2`} value={postingDate} onChange={e => setPostingDate(e.target.value)} />
            </div>
            <div className="grid grid-cols-3 items-center gap-1">
              <label className="text-[11px] font-semibold text-[#445566]">Fecha de documento *:</label>
              <input type="date" required className={`${inputClass} col-span-2`} value={docDate} onChange={e => setDocDate(e.target.value)} />
            </div>
            <div className="grid grid-cols-3 items-center gap-1">
              <label className="text-[11px] text-[#445566]">Fecha de traslado:</label>
              <input type="date" className={`${inputClass} col-span-2`} value={taxDate} onChange={e => setTaxDate(e.target.value)} />
            </div>
            <div className="grid grid-cols-3 items-center gap-1">
              <label className="text-[11px] text-[#445566]">Nº de referencia:</label>
              <input className={`${inputClass} col-span-2`} value={docNum} onChange={e => setDocNum(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Pestañas Oficiales de SAP B1 */}
        <div className="flex border-b border-[#a2b8cc] gap-1 pt-1 bg-[#eaf0f5] px-1 rounded-t">
          <button
            type="button"
            onClick={() => setActiveTab('contenido')}
            className={`px-3 py-1 font-bold text-[11px] border-t border-x rounded-t cursor-pointer transition ${
              activeTab === 'contenido'
                ? 'bg-white border-[#a2b8cc] border-b-transparent text-[#003366] shadow-xs'
                : 'bg-[#d8e3ea] border-transparent text-[#556677] hover:bg-[#e4ebf2]'
            }`}
          >
            Contenido
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('logistica')}
            className={`px-3 py-1 font-bold text-[11px] border-t border-x rounded-t cursor-pointer transition ${
              activeTab === 'logistica'
                ? 'bg-white border-[#a2b8cc] border-b-transparent text-[#003366] shadow-xs'
                : 'bg-[#d8e3ea] border-transparent text-[#556677] hover:bg-[#e4ebf2]'
            }`}
          >
            Logística
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
        <div className="flex-1 min-h-[180px]">
          {/* PESTAÑA 1: CONTENIDO */}
          {activeTab === 'contenido' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#445566] bg-[#f8fafc] p-1.5 border border-[#e2e8f0] rounded">
                <div className="flex items-center gap-2">
                  <span>Clase de resumen: <strong>Sin resumen</strong></span>
                  <span className="text-[#a2b8cc]">|</span>
                  <span>Modo: <strong>Transferencia de almacén directa</strong></span>
                </div>
                <button type="button" onClick={addLine} className={`${buttonClass} text-[10px] py-0.5 px-2 flex items-center gap-1`}>
                  <Plus size={12} /> Añadir fila
                </button>
              </div>

              <div className="overflow-x-auto border border-[#a2b8cc] rounded">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-[#e4ebf2] text-[#003366] border-b border-[#a2b8cc]">
                      <th className="p-1 text-center w-8">#</th>
                      <th className="p-1 w-32">Número de artículo *</th>
                      <th className="p-1">Descripción del artículo</th>
                      <th className="p-1 w-24">De almacén</th>
                      <th className="p-1 w-24">A almacén</th>
                      <th className="p-1 w-20 text-right">Cantidad *</th>
                      <th className="p-1 w-14 text-center">UM</th>
                      <th className="p-1 w-20 text-right">Disponible</th>
                      <th className="p-1 w-24 text-right">Costo unitario</th>
                      <th className="p-1 w-24 text-right">Total</th>
                      <th className="p-1 w-8 text-center">✕</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line, idx) => (
                      <tr key={idx} className="border-b border-[#e2ecf2] hover:bg-[#f5f9fc]">
                        <td className="p-1 text-center text-[#667788]">{idx + 1}</td>
                        <td className="p-1">
                          <select
                            className={inputClass}
                            value={line.itemCode}
                            onChange={e => {
                              const it = items.find(it => it.itemCode === e.target.value);
                              updateLine(idx, {
                                itemCode: e.target.value,
                                description: it?.name || '',
                                unit: it?.inventoryUnit || 'UND',
                                unitCost: it?.purchasePrice || 0,
                                available: 50,
                              });
                            }}
                          >
                            <option value="">Seleccionar...</option>
                            {items.map(it => (
                              <option key={it.id} value={it.itemCode}>
                                {it.itemCode}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-1">
                          <input
                            className={inputClass}
                            value={line.description}
                            onChange={e => updateLine(idx, { description: e.target.value })}
                          />
                        </td>
                        <td className="p-1">
                          <select
                            className={inputClass}
                            value={line.fromWhs}
                            onChange={e => updateLine(idx, { fromWhs: e.target.value })}
                          >
                            {warehouses.map(w => (
                              <option key={w.code} value={w.code}>
                                {w.code}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-1">
                          <select
                            className={inputClass}
                            value={line.toWhs}
                            onChange={e => updateLine(idx, { toWhs: e.target.value })}
                          >
                            {warehouses.map(w => (
                              <option key={w.code} value={w.code}>
                                {w.code}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-1">
                          <NumberInput
                            min={0.0001}
                            value={line.quantity}
                            onChange={val => updateLine(idx, { quantity: val })}
                          />
                        </td>
                        <td className="p-1 text-center font-mono text-[10px] text-[#556677]">{line.unit}</td>
                        <td className="p-1 text-right font-mono text-[10px] text-[#2e7d32] font-semibold">{line.available}</td>
                        <td className="p-1 text-right font-mono text-[10px]">{usd(line.unitCost)}</td>
                        <td className="p-1 text-right font-mono font-bold text-[10px] text-[#003366]">
                          {usd(line.quantity * line.unitCost)}
                        </td>
                        <td className="p-1 text-center">
                          <button
                            type="button"
                            disabled={lines.length <= 1}
                            onClick={() => removeLine(idx)}
                            className="text-red-500 hover:text-red-700 disabled:opacity-20 cursor-pointer"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PESTAÑA 2: LOGÍSTICA */}
          {activeTab === 'logistica' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 bg-[#f8fafc] border border-[#d8e3ea] rounded">
              <div className="space-y-2">
                <h4 className="font-bold text-[#003366] text-[11px] border-b pb-1 flex items-center gap-1.5">
                  <Boxes size={13} /> Puntos de Despacho y Entrega
                </h4>
                <div className="space-y-1">
                  <label className="text-[11px] text-[#445566]">Dirección de salida (Origen):</label>
                  <input className={inputClass} value={fromAddress} onChange={e => setFromAddress(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-[#445566]">Dirección de recepción (Destino):</label>
                  <input className={inputClass} value={shipToAddress} onChange={e => setShipToAddress(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#003366] text-[11px] border-b pb-1 flex items-center gap-1.5">
                  <Truck size={13} /> Datos del Transportista / Guía
                </h4>
                <div className="space-y-1">
                  <label className="text-[11px] text-[#445566]">Empresa de transporte:</label>
                  <input className={inputClass} value={carrier} onChange={e => setCarrier(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-[#445566]">Conductor asignado:</label>
                    <input className={inputClass} value={driverName} onChange={e => setDriverName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#445566]">Placa del vehículo:</label>
                    <input className={inputClass} value={licensePlate} onChange={e => setLicensePlate(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA 3: ANEXOS (OFICIAL SAP B1) */}
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
                      const name = prompt('Nombre del archivo anexo (ej. Guia_Transporte.pdf):', 'Documento_Anexo.pdf');
                      if (name) {
                        setAttachments([
                          ...attachments,
                          {
                            id: `att-${Date.now()}`,
                            targetPath: 'C:\\SAP_Attachments\\',
                            fileName: name,
                            date: today(),
                            freeText: 'Documento adjunto por el usuario',
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
                        alert(`Visualizando anexo: ${attachments[selectedAttachmentIndex].fileName}`);
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

        {/* Pie de Documento SAP B1 */}
        <div className="pt-2 border-t border-[#d8e3ea] grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
          <div className="space-y-1">
            <label className="text-[10px] text-[#556677]">Comentarios:</label>
            <input className={inputClass} value={comments} onChange={e => setComments(e.target.value)} />
          </div>
          <div className="flex flex-col items-end gap-1 text-right">
            <div className="text-[11px] text-[#445566]">
              Unidades a trasladar: <strong className="text-[#003366] text-sm">{totalUnits}</strong>
            </div>
            <div className="text-[11px] text-[#445566]">
              Valorización estimada: <strong className="text-[#2e7d32] text-sm font-mono">{usd(totalValue)}</strong>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-2 pt-2 border-t border-[#d8e3ea]">
          <button type="submit" disabled={c.saving || fromWarehouse === toWarehouse} className={`${buttonClass} font-bold text-[#003366]`}>
            {c.saving ? 'Contabilizando...' : 'Crear transferencia'}
          </button>
          <button
            type="button"
            onClick={() => {
              setLines([{ itemCode: '', description: '', fromWhs: fromWarehouse, toWhs: toWarehouse, quantity: 1, unit: 'UND', available: 0, unitCost: 0 }]);
            }}
            className={buttonClass}
          >
            Cancelar / Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}
