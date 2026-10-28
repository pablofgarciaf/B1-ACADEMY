'use client';

import React, { useMemo, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { round, today, usd } from '@/lib/company-calculations';
import { Screen, Field, inputClass, buttonClass } from './FinixControls';
import { ParaPensar } from './AnalysisBlocks';
import type { CommandData } from '@/lib/company-commands';
import {
  Boxes,
  Receipt,
  PieChart,
  Paperclip,
  ArrowRight,
  FolderOpen,
  Eye,
  Trash2,
  FileSpreadsheet,
  Plus,
  Ship,
  CheckCircle2
} from 'lucide-react';

/** Conceptos típicos de una importación en Ecuador / SAP B1. */
const CONCEPTOS_BASE = [
  'Flete internacional marítimo/aéreo',
  'Seguro de transporte internacional',
  'Arancel ad valorem (SENAE)',
  'FODINFA 0,5 %',
  'Impuesto a la Salida de Divisas (ISD 5 %)',
  'Honorarios agente de aduana',
  'Transporte y flete terrestre local',
  'Almacenaje y bodegaje portuario'
];

export default function LandedCostScreen() {
  const c = useCompany();
  const [type, setType] = useState<CommandData<'landedCostType'>>({
    name: '',
    expenseAccount: '605000',
    updatesStock: true,
    allocation: 'weight',
    updatesLastPurchase: true,
    fixedAmount: 0
  });

  const concepts = [...new Set([...CONCEPTOS_BASE, ...(c.data.profile?.landedCostTypes ?? []).map(t => t.name)])];

  const recepciones = useMemo(() => c.data.purchaseOrders.filter(d =>
    (d.docType === 'goods_receipt' || (d.docType === 'vendor_invoice' && !d.baseDocumentId)) &&
    c.data.stockMovements.some(m => m.reference === d.id && m.quantity > 0)
  ), [c.data]);

  const [doc, setDoc] = useState('');
  const [fecha, setFecha] = useState(today());
  const [docDate, setDocDate] = useState(today());
  const [reparto, setReparto] = useState<'value' | 'quantity'>('value');
  const [pago, setPago] = useState<'2.1.01' | '1.1.01'>('2.1.01');
  const [activeTab, setActiveTab] = useState<'articulos' | 'costes' | 'resumen' | 'anexos'>('articulos');

  const [costos, setCostos] = useState([
    { concept: CONCEPTOS_BASE[0], amount: 450 },
    { concept: CONCEPTOS_BASE[1], amount: 120 },
    { concept: CONCEPTOS_BASE[2], amount: 280 },
  ]);

  const [attachments, setAttachments] = useState<Array<{ id: string; path: string; fileName: string; date: string; user: string }>>([
    { id: 'att-lc-1', path: 'C:\\SAP_Attachments\\Importaciones\\BL_Facturas\\', fileName: 'bill_of_lading_maersk_0091.pdf', date: today(), user: 'manager' }
  ]);
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);

  const seleccionado = recepciones.find(d => d.id === doc);
  const totalCostos = round(costos.reduce((s, x) => s + (x.amount || 0), 0));
  const valorMercaderia = seleccionado?.subtotal ?? 0;
  const totalLiquidacionCIF = round(valorMercaderia + totalCostos);

  const registrar = async () => {
    if (!doc) {
      alert('Seleccione la recepción de mercancías de importación.');
      return;
    }
    if (totalCostos <= 0) {
      alert('Ingrese al menos un gasto de importación.');
      return;
    }
    try {
      await c.save({
        action: 'landedCost',
        data: {
          documentId: doc,
          date: fecha,
          allocation: reparto,
          paymentAccount: pago,
          costs: costos.filter(x => x.amount > 0)
        }
      });
      alert('Costes en destino prorrateados y contabilizados exitosamente.');
      setCostos([{ concept: CONCEPTOS_BASE[0], amount: 0 }]);
      setActiveTab('resumen');
    } catch {
      /* error visible */
    }
  };

  const handleAddAttachment = () => {
    const fileName = prompt('Ingrese el nombre de la póliza de seguro, arancel o BL:', 'DAU_Liquidacion_Aduanera.pdf');
    if (!fileName) return;
    setAttachments(prev => [
      ...prev,
      {
        id: `att-${Date.now()}`,
        path: 'C:\\SAP_Attachments\\Importaciones\\',
        fileName,
        date: today(),
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
    <Screen title="Costes en destino / Importaciones (OIPF / IPF1)">
      {/* Cabecera Oficial SAP B1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#f8fafc] p-3 rounded border border-[#cbd5e1]">
        <div>
          <label className="text-[11px] font-semibold text-[#475569] block mb-0.5">N° Coste en Destino</label>
          <input
            readOnly
            className={`${inputClass} bg-[#f1f5f9] font-mono font-semibold text-[#1e293b]`}
            value={`LC-${(c.data.landedCosts.length + 1).toString().padStart(5, '0')}`}
          />
        </div>
        <Field label="Recepción de Mercancías Base" required>
          <select
            className={inputClass}
            value={doc}
            onChange={e => setDoc(e.target.value)}
          >
            <option value="">Seleccione recepción de compra...</option>
            {recepciones.map(d => (
              <option key={d.id} value={d.id}>
                {d.docNumber} · {d.cardName} · {usd(d.subtotal)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Fecha de contabilización" required>
          <input
            type="date"
            className={inputClass}
            value={fecha}
            onChange={e => setFecha(e.target.value)}
          />
        </Field>
        <Field label="Fecha de documento">
          <input
            type="date"
            className={inputClass}
            value={docDate}
            onChange={e => setDocDate(e.target.value)}
          />
        </Field>

        <Field label="Criterio de Reparto">
          <select
            className={inputClass}
            value={reparto}
            onChange={e => setReparto(e.target.value as 'value' | 'quantity')}
          >
            <option value="value">Valor monetario (Ad Valorem)</option>
            <option value="quantity">Cantidad física de unidades</option>
          </select>
        </Field>
        <Field label="Forma de Pago de Gastos">
          <select
            className={inputClass}
            value={pago}
            onChange={e => setPago(e.target.value as '2.1.01' | '1.1.01')}
          >
            <option value="2.1.01">A crédito · Cuentas por pagar forwarder (2.1.01)</option>
            <option value="1.1.01">De contado · Caja/Bancos (1.1.01)</option>
          </select>
        </Field>
        <Field label="Moneda de Liquidación">
          <input
            readOnly
            className={`${inputClass} bg-[#f8fafc] font-semibold text-[#1e293b]`}
            value="USD — Dólares de importación"
          />
        </Field>
        <div className="flex items-center pt-5">
          <span className="text-xs text-[#64748b]">
            {seleccionado ? (
              <span className="text-[#16a34a] font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                Mercadería FOB: {usd(valorMercaderia)}
              </span>
            ) : (
              'Seleccione documento base'
            )}
          </span>
        </div>
      </div>

      {/* Selector de Pestañas Oficiales */}
      <div className="flex border-b border-[#cbd5e1] gap-1 bg-[#e2e8f0]/40 p-1 rounded-t">
        <button
          type="button"
          onClick={() => setActiveTab('articulos')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-t transition-all flex items-center gap-1.5 ${
            activeTab === 'articulos'
              ? 'bg-white text-[#0055A5] border-t-2 border-t-[#0055A5] shadow-sm'
              : 'text-[#475569] hover:bg-white/60'
          }`}
        >
          <Boxes className="h-3 w-3" />
          Artículos Importados ({seleccionado?.lines?.length ?? 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('costes')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-t transition-all flex items-center gap-1.5 ${
            activeTab === 'costes'
              ? 'bg-white text-[#0055A5] border-t-2 border-t-[#0055A5] shadow-sm'
              : 'text-[#475569] hover:bg-white/60'
          }`}
        >
          <Receipt className="h-3 w-3" />
          Costes y Aranceles ({costos.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('resumen')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-t transition-all flex items-center gap-1.5 ${
            activeTab === 'resumen'
              ? 'bg-white text-[#0055A5] border-t-2 border-t-[#0055A5] shadow-sm'
              : 'text-[#475569] hover:bg-white/60'
          }`}
        >
          <PieChart className="h-3 w-3" />
          Resumen Total y Liquidación
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

      {/* TAB 1: ARTÍCULOS IMPORTADOS */}
      {activeTab === 'articulos' && (
        <div className="space-y-3">
          {seleccionado ? (
            <div className="overflow-x-auto border border-[#cbd5e1] rounded bg-white shadow-inner">
              <table className="min-w-full text-xs text-left border-collapse">
                <thead className="bg-[#f1f5f9] text-[#475569] font-semibold border-b border-[#cbd5e1]">
                  <tr>
                    <th className="p-2 w-10 text-center">#</th>
                    <th className="p-2">Código Artículo</th>
                    <th className="p-2">Descripción</th>
                    <th className="p-2 w-24 text-right">Cantidad</th>
                    <th className="p-2 w-28 text-right">Precio FOB ($)</th>
                    <th className="p-2 w-28 text-right">Total FOB ($)</th>
                    <th className="p-2 w-32 text-right">Gasto Prorrateado ($)</th>
                    <th className="p-2 w-32 text-right">Nuevo Costo Unit. ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {seleccionado.lines.map((l, i) => {
                    const lineFob = l.quantity * l.price;
                    const proporcion = valorMercaderia > 0 ? (reparto === 'value' ? lineFob / valorMercaderia : l.quantity / seleccionado.lines.reduce((s, x) => s + x.quantity, 0)) : 0;
                    const gastoAsignado = totalCostos * proporcion;
                    const nuevoCostoUnit = (lineFob + gastoAsignado) / Math.max(1, l.quantity);
                    return (
                      <tr key={i} className="hover:bg-[#f8fafc]">
                        <td className="p-2 text-center text-[#94a3b8] font-mono">{i + 1}</td>
                        <td className="p-2 font-mono font-semibold text-[#0055A5] flex items-center gap-1">
                          <span>{l.itemCode}</span>
                          <button
                            type="button"
                            title="Flecha dorada: Ver maestro del artículo"
                            className="text-[#f59e0b] hover:text-[#d97706]"
                            onClick={() => alert(`Datos maestros del artículo importado: ${l.itemCode}`)}
                          >
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </td>
                        <td className="p-2 font-medium text-[#1e293b]">{l.description}</td>
                        <td className="p-2 text-right font-mono font-semibold">{l.quantity}</td>
                        <td className="p-2 text-right font-mono">{usd(l.price)}</td>
                        <td className="p-2 text-right font-mono font-bold text-[#1e293b]">{usd(lineFob)}</td>
                        <td className="p-2 text-right font-mono text-[#0284c7] font-semibold">{usd(gastoAsignado)}</td>
                        <td className="p-2 text-right font-mono font-bold text-[#16a34a]">{usd(nuevoCostoUnit)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-[#94a3b8] bg-white rounded border border-[#cbd5e1]">
              Seleccione una recepción de compra en la cabecera para cargar los artículos a costear.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COSTES Y ARANCELES */}
      {activeTab === 'costes' && (
        <div className="space-y-4 bg-white p-4 rounded border border-[#cbd5e1]">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0055A5]">
              Gastos de Aduana, Flete, Seguro e Impuestos Arancelarios
            </h4>
            <span className="text-xs text-[#64748b]">Total Costes: <strong>{usd(totalCostos)}</strong></span>
          </div>

          <div className="overflow-x-auto border border-[#cbd5e1] rounded">
            <table className="min-w-full text-xs text-left border-collapse">
              <thead className="bg-[#f1f5f9] text-[#475569] font-semibold border-b border-[#cbd5e1]">
                <tr>
                  <th className="p-2 w-10 text-center">#</th>
                  <th className="p-2 min-w-[240px]">Concepto de Gasto</th>
                  <th className="p-2 w-36 text-right">Monto ($)</th>
                  <th className="p-2 min-w-[140px]">Método Reparto</th>
                  <th className="p-2 w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {costos.map((x, i) => (
                  <tr key={i} className="hover:bg-[#f8fafc]">
                    <td className="p-2 text-center text-[#94a3b8] font-mono">{i + 1}</td>
                    <td className="p-1">
                      <select
                        className={inputClass}
                        value={x.concept}
                        onChange={e =>
                          setCostos(v =>
                            v.map((y, j) =>
                              j === i
                                ? {
                                    ...y,
                                    concept: e.target.value,
                                    amount: c.data.profile?.landedCostTypes?.find(t => t.name === e.target.value)?.fixedAmount || y.amount
                                  }
                                : y
                            )
                          )
                        }
                      >
                        {concepts.map(k => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-1">
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        className={`${inputClass} text-right font-semibold`}
                        value={x.amount}
                        onChange={e =>
                          setCostos(v =>
                            v.map((y, j) => (j === i ? { ...y, amount: Number(e.target.value) } : y))
                          )
                        }
                      />
                    </td>
                    <td className="p-2 text-[#64748b]">
                      {reparto === 'value' ? 'Por valor FOB' : 'Por cantidad física'}
                    </td>
                    <td className="p-1 text-center">
                      <button
                        type="button"
                        className="text-[#ef4444] hover:text-[#b91c1c] disabled:opacity-20 p-1"
                        disabled={costos.length === 1}
                        onClick={() => setCostos(v => v.filter((_, j) => j !== i))}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`${buttonClass} flex items-center gap-1`}
              disabled={costos.length >= 12}
              onClick={() =>
                setCostos(v => [
                  ...v,
                  { concept: CONCEPTOS_BASE[Math.min(v.length, CONCEPTOS_BASE.length - 1)], amount: 0 }
                ])
              }
            >
              <Plus className="h-3.5 w-3.5" />
              Añadir Gasto de Importación
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: RESUMEN TOTAL Y LIQUIDACIÓN */}
      {activeTab === 'resumen' && (
        <div className="space-y-4 bg-white p-4 rounded border border-[#cbd5e1]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 rounded bg-[#f8fafc] border border-[#cbd5e1] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0055A5] block">
                Valoración Económica
              </span>
              <div className="flex justify-between text-xs">
                <span className="text-[#64748b]">Mercadería FOB:</span>
                <span className="font-mono font-semibold">{usd(valorMercaderia)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#64748b]">Gastos y Aranceles:</span>
                <span className="font-mono font-semibold text-[#0284c7]">{usd(totalCostos)}</span>
              </div>
              <div className="border-t pt-1 flex justify-between text-xs font-bold">
                <span>Costo Total CIF:</span>
                <span className="font-mono text-[#16a34a]">{usd(totalLiquidacionCIF)}</span>
              </div>
            </div>

            <div className="p-3 rounded bg-[#f8fafc] border border-[#cbd5e1] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0055A5] block">
                Incidencia de Gastos
              </span>
              <p className="text-xs text-[#64748b]">
                Los costes de importación representan un{' '}
                <strong className="text-[#1e293b]">
                  {valorMercaderia > 0 ? ((totalCostos / valorMercaderia) * 100).toFixed(1) : 0}%
                </strong>{' '}
                adicional sobre el valor de factura del proveedor en el extranjero.
              </p>
              <p className="text-[11px] text-[#64748b]">
                Se actualizarán las capas de inventario y el costo estándar del maestro de artículos.
              </p>
            </div>

            <div className="p-3 rounded bg-[#f8fafc] border border-[#cbd5e1] space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0055A5] block">
                  Asiento Contable de Costeo
                </span>
                <span className="text-[11px] text-[#64748b] block">
                  Debe: 1.1.05 Inventario (Mayor valor) | Haber: 2.1.01 / 1.1.01 Acreedores varios
                </span>
              </div>
              <button
                type="button"
                className={`${buttonClass} font-bold w-full`}
                disabled={c.saving || !doc || totalCostos <= 0}
                onClick={registrar}
              >
                Prorratear y Contabilizar en Firme
              </button>
            </div>
          </div>

          {/* Historial de Costeos Registrados */}
          <div className="space-y-2 border-t pt-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0055A5]">
              Costeos de Importación Registrados en el Sistema
            </h4>
            <div className="overflow-x-auto border border-[#cbd5e1] rounded">
              <table className="min-w-full text-xs text-left border-collapse">
                <thead className="bg-[#f1f5f9] text-[#475569] font-semibold border-b border-[#cbd5e1]">
                  <tr>
                    <th className="p-2">Número</th>
                    <th className="p-2">Recepción</th>
                    <th className="p-2">Fecha</th>
                    <th className="p-2 text-right">Total Gastos</th>
                    <th className="p-2 text-right">A Inventario</th>
                    <th className="p-2 text-right">A Costo Ventas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {c.data.landedCosts.map((l, idx) => (
                    <tr key={idx} className="hover:bg-[#f8fafc]">
                      <td className="p-2 font-mono font-semibold text-[#0055A5]">{l.landedCostNumber}</td>
                      <td className="p-2 font-mono">{l.documentNumber}</td>
                      <td className="p-2 text-[#64748b]">{l.date}</td>
                      <td className="p-2 text-right font-mono font-bold">{usd(l.total)}</td>
                      <td className="p-2 text-right font-mono text-[#16a34a]">{usd(l.lines.reduce((s, x) => s + x.toInventory, 0))}</td>
                      <td className="p-2 text-right font-mono text-[#dc2626]">{usd(l.lines.reduce((s, x) => s + x.toCostOfSales, 0))}</td>
                    </tr>
                  ))}
                  {c.data.landedCosts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-[#94a3b8]">
                        No hay costes en destino contabilizados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ANEXOS (BLs, Aranceles y Liquidaciones) */}
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
                  alert('Seleccione un anexo para visualizar.');
                  return;
                }
                const att = attachments.find(a => a.id === selectedAttachment);
                alert(`Visualizando anexo de importación: ${att?.fileName}`);
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

      <ParaPensar
        clave={`b1_costos_${c.data.profile?.uid ?? 'anon'}`}
        preguntas={[
          'Un producto importado no cuesta lo que dice la factura del proveedor: hay que sumar flete, seguro, arancel, FODINFA, el ISD del 5 %, el agente de aduana… Si no se suman, el costo queda subvaluado y el margen parece mayor de lo que es.',
          '¿En qué casos es preferible prorratear por peso en lugar de por valor?',
          '¿Cómo afecta al flujo de caja el pago anticipado de aranceles frente al crédito del proveedor de mercadería?'
        ]}
      />
    </Screen>
  );
}
