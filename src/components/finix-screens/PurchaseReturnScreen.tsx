'use client';

import React, { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { today, usd } from '@/lib/company-calculations';
import type { CommandData } from '@/lib/company-commands';
import { Screen, Field, inputClass, buttonClass } from './FinixControls';
import {
  FileText,
  Truck,
  CreditCard,
  Paperclip,
  ArrowRight,
  FolderOpen,
  Eye,
  Trash2,
  FileSpreadsheet,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export default function PurchaseReturnScreen() {
  const c = useCompany();
  const blank = (): CommandData<'purchaseReturn'> => ({
    kind: 'request',
    date: today(),
    vendorCode: '',
    baseDocumentId: '',
    itemCode: '',
    quantity: 1,
    price: 0,
    warehouseCode: c.data.profile?.warehouses[0]?.code ?? '01',
    reason: 'Producto no cumple especificaciones de calidad',
    rma: 'RMA-2026-001',
    withoutQuantity: false
  });

  const [d, setD] = useState(blank);
  const [activeTab, setActiveTab] = useState<'contenido' | 'logistica' | 'finanzas' | 'anexos'>('contenido');
  const [carrier, setCarrier] = useState('Servientrega / Transporte Terrestre');
  const [guiaNumber, setGuiaNumber] = useState('001-002-000456123');
  const [paymentAccount, setPaymentAccount] = useState('2.1.01');

  const [attachments, setAttachments] = useState<Array<{ id: string; path: string; fileName: string; date: string; user: string }>>([
    { id: 'att-ret-1', path: 'C:\\SAP_Attachments\\DevolucionesCompras\\', fileName: 'informe_no_conformidad_calidad.pdf', date: today(), user: 'manager' }
  ]);
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);

  const sources = c.data.purchaseOrders.filter(doc =>
    doc.cardCode === d.vendorCode &&
    doc.docType === (d.kind === 'goods_return' ? 'goods_receipt' : 'vendor_invoice')
  );

  const item = c.data.items.find(i => i.itemCode === d.itemCode);
  const baseSubtotal = d.quantity * d.price;
  const iva = d.kind === 'credit_note' ? baseSubtotal * 0.15 : 0;
  const totalOperacion = baseSubtotal + iva;

  const handleAddAttachment = () => {
    const fileName = prompt('Ingrese el nombre de la evidencia técnica o foto de producto devuelto:', `Evidencia_Devolucion_${d.rma || 'RMA'}.pdf`);
    if (!fileName) return;
    setAttachments(prev => [
      ...prev,
      {
        id: `att-${Date.now()}`,
        path: 'C:\\SAP_Attachments\\DevolucionesCompras\\',
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

  const purchaseReturnsList = c.data.profile?.purchaseReturns ?? [];

  return (
    <Screen title="Devoluciones y notas de crédito de proveedores (OPDN / ORPC)">
      {/* Cabecera Oficial SAP B1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#f8fafc] p-3 rounded border border-[#cbd5e1]">
        <Field label="Tipo de Operación" required>
          <select
            className={inputClass}
            value={d.kind}
            onChange={e =>
              setD(v => ({
                ...v,
                kind: e.target.value as typeof d.kind,
                withoutQuantity: e.target.value === 'value_credit',
                baseDocumentId: ''
              }))
            }
          >
            <option value="request">Solicitud de devolución (RMA Autorización)</option>
            <option value="goods_return">Devolución física de mercancía (Salida de stock)</option>
            <option value="credit_note">Nota de crédito / Abono de proveedor</option>
            <option value="value_credit">Abono financiero de valor (Sin movimiento de stock)</option>
          </select>
        </Field>

        <Field label="Proveedor" required>
          <select
            required
            className={inputClass}
            value={d.vendorCode}
            onChange={e => setD(v => ({ ...v, vendorCode: e.target.value, baseDocumentId: '' }))}
          >
            <option value="">Seleccione el proveedor...</option>
            {c.data.vendors.filter(v => v.active).map(v => (
              <option key={v.id} value={v.cardCode}>
                {v.cardCode} — {v.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Fecha del Documento" required>
          <input
            required
            type="date"
            className={inputClass}
            value={d.date}
            onChange={e => setD(v => ({ ...v, date: e.target.value }))}
          />
        </Field>

        {d.kind !== 'request' ? (
          <Field label="Documento Base de Sustento" required>
            <select
              required
              className={inputClass}
              value={d.baseDocumentId}
              onChange={e => setD(v => ({ ...v, baseDocumentId: e.target.value }))}
            >
              <option value="">Seleccione documento fuente...</option>
              {sources.map(doc => (
                <option key={doc.id} value={doc.id}>
                  {doc.docNumber} — {usd(doc.subtotal)} ({doc.date})
                </option>
              ))}
            </select>
          </Field>
        ) : (
          <Field label="Número RMA del Proveedor" required>
            <input
              required
              className={inputClass}
              value={d.rma}
              onChange={e => setD(v => ({ ...v, rma: e.target.value }))}
              placeholder="Ej.: RMA-PROV-9981"
            />
          </Field>
        )}
      </div>

      {/* Selector de Pestañas Oficiales */}
      <div className="flex border-b border-[#cbd5e1] gap-1 bg-[#e2e8f0]/40 p-1 rounded-t">
        <button
          type="button"
          onClick={() => setActiveTab('contenido')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-t transition-all flex items-center gap-1.5 ${
            activeTab === 'contenido'
              ? 'bg-white text-[#0055A5] border-t-2 border-t-[#0055A5] shadow-sm'
              : 'text-[#475569] hover:bg-white/60'
          }`}
        >
          <FileText className="h-3 w-3" />
          Contenido de la Devolución
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('logistica')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-t transition-all flex items-center gap-1.5 ${
            activeTab === 'logistica'
              ? 'bg-white text-[#0055A5] border-t-2 border-t-[#0055A5] shadow-sm'
              : 'text-[#475569] hover:bg-white/60'
          }`}
        >
          <Truck className="h-3 w-3" />
          Logística y Despacho
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('finanzas')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-t transition-all flex items-center gap-1.5 ${
            activeTab === 'finanzas'
              ? 'bg-white text-[#0055A5] border-t-2 border-t-[#0055A5] shadow-sm'
              : 'text-[#475569] hover:bg-white/60'
          }`}
        >
          <CreditCard className="h-3 w-3" />
          Finanzas y Cuentas
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

      {/* TAB 1: CONTENIDO */}
      {activeTab === 'contenido' && (
        <form
          className="space-y-3"
          onSubmit={async e => {
            e.preventDefault();
            if (!d.vendorCode || !d.itemCode || d.quantity <= 0) {
              alert('Complete los campos obligatorios del proveedor, artículo y cantidad.');
              return;
            }
            await c.save({ action: 'purchaseReturn', data: d });
            alert('Operación de devolución registrada exitosamente en el sistema.');
            setD(blank());
          }}
        >
          <div className="overflow-x-auto border border-[#cbd5e1] rounded bg-white shadow-inner">
            <table className="min-w-full text-xs text-left border-collapse">
              <thead className="bg-[#f1f5f9] text-[#475569] font-semibold border-b border-[#cbd5e1]">
                <tr>
                  <th className="p-2 w-10 text-center">#</th>
                  <th className="p-2 min-w-[200px]">Artículo *</th>
                  <th className="p-2 min-w-[180px]">Descripción</th>
                  <th className="p-2 w-28">Almacén</th>
                  <th className="p-2 w-28 text-right">{d.withoutQuantity ? 'Unidades Cálculo' : 'Cantidad *'}</th>
                  <th className="p-2 w-28 text-right">Precio Unit. ($)</th>
                  <th className="p-2 w-28 text-right">Subtotal ($)</th>
                  <th className="p-2 w-24 text-right">IVA (15%)</th>
                  <th className="p-2 w-28 text-right">Total ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                <tr className="hover:bg-[#f8fafc]">
                  <td className="p-2 text-center text-[#94a3b8] font-mono">1</td>
                  <td className="p-1">
                    <div className="flex items-center gap-1">
                      <select
                        required
                        className={inputClass}
                        value={d.itemCode}
                        onChange={e => {
                          const it = c.data.items.find(i => i.itemCode === e.target.value);
                          setD(v => ({
                            ...v,
                            itemCode: e.target.value,
                            price: it?.purchasePrice ?? 0
                          }));
                        }}
                      >
                        <option value="">Seleccione artículo...</option>
                        {c.data.items
                          .filter(i => i.active && i.type === 'inventory')
                          .map(i => (
                            <option key={i.id} value={i.itemCode}>
                              {i.itemCode} — {i.name}
                            </option>
                          ))}
                      </select>
                      {d.itemCode && (
                        <button
                          type="button"
                          title="Flecha dorada: Ver maestro"
                          className="text-[#f59e0b] hover:text-[#d97706] p-0.5"
                          onClick={() => alert(`Maestro del artículo: ${d.itemCode}`)}
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="p-2 font-medium text-[#334155] truncate max-w-[180px]">
                    {item?.name ?? '—'}
                  </td>
                  <td className="p-1">
                    <select
                      className={inputClass}
                      value={d.warehouseCode}
                      onChange={e => setD(v => ({ ...v, warehouseCode: e.target.value }))}
                    >
                      {c.data.profile?.warehouses.map(w => (
                        <option key={w.code} value={w.code}>{w.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-1">
                    <input
                      required
                      type="number"
                      min={0.001}
                      step="0.001"
                      className={`${inputClass} text-right font-semibold`}
                      value={d.quantity}
                      onChange={e => setD(v => ({ ...v, quantity: Number(e.target.value) }))}
                    />
                  </td>
                  <td className="p-1">
                    <input
                      required
                      type="number"
                      min={0.01}
                      step="0.01"
                      className={`${inputClass} text-right font-semibold`}
                      value={d.price}
                      onChange={e => setD(v => ({ ...v, price: Number(e.target.value) }))}
                    />
                  </td>
                  <td className="p-2 text-right font-mono font-bold text-[#1e293b]">
                    {usd(baseSubtotal)}
                  </td>
                  <td className="p-2 text-right font-mono text-[#64748b]">
                    {usd(iva)}
                  </td>
                  <td className="p-2 text-right font-mono font-bold text-[#0055A5]">
                    {usd(totalOperacion)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded border bg-[#f8fafc] border-[#cbd5e1]">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[11px] text-[#64748b] block">Base Imponible</span>
                <span className="text-sm font-bold font-mono text-[#1e293b]">{usd(baseSubtotal)}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#64748b] block">IVA Recuperable</span>
                <span className="text-sm font-bold font-mono text-[#0055A5]">{usd(iva)}</span>
              </div>
              <div className="border-l border-[#cbd5e1] pl-4">
                <span className="text-[11px] text-[#64748b] block">Total de Devolución / Abono</span>
                <span className="text-base font-bold font-mono text-[#16a34a]">{usd(totalOperacion)}</span>
              </div>
            </div>

            <button
              type="submit"
              className={`${buttonClass} font-bold`}
              disabled={c.saving || !d.vendorCode || !d.itemCode || d.quantity <= 0}
            >
              Registrar Operación Oficial
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: LOGÍSTICA */}
      {activeTab === 'logistica' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded border border-[#cbd5e1]">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0055A5] border-b pb-1">
              Despacho Físico y Transporte
            </h4>
            <Field label="Transportista Asignado">
              <input
                className={inputClass}
                value={carrier}
                onChange={e => setCarrier(e.target.value)}
              />
            </Field>
            <Field label="N° Guía de Remisión de Salida">
              <input
                className={inputClass}
                value={guiaNumber}
                onChange={e => setGuiaNumber(e.target.value)}
              />
            </Field>
            <Field label="Motivo de la Devolución">
              <select
                className={inputClass}
                value={d.reason}
                onChange={e => setD(v => ({ ...v, reason: e.target.value }))}
              >
                <option value="Producto no cumple especificaciones de calidad">No cumple especificaciones técnicas de calidad</option>
                <option value="Mercadería dañada en tránsito">Mercadería dañada durante el transporte</option>
                <option value="Error de despacho del proveedor">Error de despacho / Artículo equivocado</option>
                <option value="Exceso de pedido / Acuerdo comercial">Exceso de compra / Acuerdo de recompra</option>
              </select>
            </Field>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0055A5] border-b pb-1">
              Dirección de Devolución
            </h4>
            <Field label="Dirección de Destino (Bodega Proveedor)">
              <textarea
                rows={3}
                className={`${inputClass} resize-none`}
                defaultValue="Av. Panamericana Norte Km 14.5, Complejo Industrial Bodega 4B, Guayaquil, Ecuador"
              />
            </Field>
            <div className="p-2.5 rounded bg-[#f1f5f9] text-[11px] text-[#334155] border border-[#e2e8f0]">
              <strong>Control de Inventario:</strong> Si la operación es <em>Devolución física</em>, se emitirá una salida de stock inmediata del almacén seleccionado ({d.warehouseCode}) reduciendo el inventario disponible.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FINANZAS */}
      {activeTab === 'finanzas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded border border-[#cbd5e1]">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0055A5] border-b pb-1">
              Condición de Abono y Compensación
            </h4>
            <Field label="Cuenta de Abono">
              <select
                className={inputClass}
                value={paymentAccount}
                onChange={e => setPaymentAccount(e.target.value)}
              >
                <option value="2.1.01">2.1.01 · Cuentas por pagar comerciales (Crédito a favor)</option>
                <option value="1.1.01">1.1.01 · Caja / Bancos (Reembolso en efectivo/transferencia)</option>
              </select>
            </Field>
            <Field label="Condición de Pago">
              <input
                readOnly
                className={`${inputClass} bg-[#f8fafc]`}
                value="Inmediata · Acreditación en cuenta corriente"
              />
            </Field>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0055A5] border-b pb-1">
              Asiento Contable de Abono
            </h4>
            <div className="p-3 rounded bg-[#f8fafc] border border-[#cbd5e1] text-xs space-y-1">
              <p className="font-semibold text-[#1e293b]">Estructura del Asiento en Proveedores:</p>
              <p>• <strong>Debe:</strong> 2.1.01 Proveedores locales ({usd(totalOperacion)})</p>
              <p>• <strong>Haber:</strong> 1.1.05 Inventario / Ajuste ({usd(baseSubtotal)})</p>
              {iva > 0 && <p>• <strong>Haber:</strong> 1.1.07 IVA Compras Crédito Tributario ({usd(iva)})</p>}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ANEXOS */}
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
                alert(`Visualizando evidencia de devolución: ${att?.fileName}`);
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

      {/* Historial de Devoluciones y Abonos Registrados */}
      <div className="space-y-2 border-t pt-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0055A5]">
          Historial de Devoluciones y Abonos Registrados
        </h4>
        <div className="overflow-x-auto border border-[#cbd5e1] rounded">
          <table className="min-w-full text-xs text-left border-collapse">
            <thead className="bg-[#f1f5f9] text-[#475569] font-semibold border-b border-[#cbd5e1]">
              <tr>
                <th className="p-2">Número</th>
                <th className="p-2">Tipo</th>
                <th className="p-2">Proveedor</th>
                <th className="p-2">Fecha</th>
                <th className="p-2">Artículo</th>
                <th className="p-2 text-right">Cantidad</th>
                <th className="p-2 text-right">Base ($)</th>
                <th className="p-2 text-right">IVA ($)</th>
                <th className="p-2 text-center">Asiento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {purchaseReturnsList.map((r, idx) => (
                <tr key={idx} className="hover:bg-[#f8fafc]">
                  <td className="p-2 font-mono font-semibold text-[#0055A5]">{r.id}</td>
                  <td className="p-2 text-xs font-medium">{r.kind}</td>
                  <td className="p-2 font-mono">{r.vendorCode}</td>
                  <td className="p-2 text-[#64748b]">{r.date}</td>
                  <td className="p-2">{r.itemCode}</td>
                  <td className="p-2 text-right font-mono">{r.withoutQuantity ? 'Sin mov.' : r.quantity}</td>
                  <td className="p-2 text-right font-mono font-bold">{usd(r.subtotal)}</td>
                  <td className="p-2 text-right font-mono">{usd(r.tax)}</td>
                  <td className="p-2 text-center font-mono text-xs text-[#0284c7]">{r.journalEntryId || 'Solicitud'}</td>
                </tr>
              ))}
              {purchaseReturnsList.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-[#94a3b8]">
                    No hay devoluciones o abonos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Screen>
  );
}
