'use client';

import React, { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { today, usd } from '@/lib/company-calculations';
import { Screen, Field, inputClass, buttonClass } from './FinixControls';
import {
  TrendingUp,
  FileText,
  History,
  Paperclip,
  ArrowRight,
  FolderOpen,
  Eye,
  Trash2,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

export default function StockRevaluationScreen() {
  const c = useCompany();
  const [itemCode, setItemCode] = useState('');
  const [date, setDate] = useState(today());
  const [docDate, setDocDate] = useState(today());
  const [cost, setCost] = useState(0);
  const [reason, setReason] = useState('Ajuste de costo estándar por variación de mercado');
  const [revalMethod, setRevalMethod] = useState<'price' | 'inventory'>('price');
  const [revalAccount, setRevalAccount] = useState('605002');
  const [refAudit, setRefAudit] = useState('AUD-VAL-2026');
  const [activeTab, setActiveTab] = useState<'articulos' | 'general' | 'historico' | 'anexos'>('articulos');

  const [attachments, setAttachments] = useState<Array<{ id: string; path: string; fileName: string; date: string; user: string }>>([
    { id: 'att-rev-1', path: 'C:\\SAP_Attachments\\Inventarios\\Revalorizaciones\\', fileName: 'informe_tasacion_perito_costos.pdf', date: today(), user: 'manager' }
  ]);
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);

  const item = c.data.items.find(i => i.itemCode === itemCode);
  const stocks = c.data.warehouseStock.filter(s => s.itemCode === itemCode);
  const quantity = stocks.reduce((sum, s) => sum + s.quantity, 0);
  const currentValue = stocks.reduce((sum, s) => sum + s.value, 0);
  const oldUnitCost = item?.standardCost ?? (quantity > 0 ? currentValue / quantity : item?.purchasePrice ?? 0);
  const totalDifference = quantity * cost - currentValue;

  const handleAddAttachment = () => {
    const fileName = prompt('Ingrese el nombre del informe de revalorización:', `Sustento_Revalorizacion_${itemCode || 'General'}.pdf`);
    if (!fileName) return;
    setAttachments(prev => [
      ...prev,
      {
        id: `att-${Date.now()}`,
        path: 'C:\\SAP_Attachments\\Inventarios\\',
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

  const revaluationsHistory = c.data.profile?.stockRevaluations ?? [];

  return (
    <Screen title="Revalorización de inventario (MRV / OMRV)">
      {/* Cabecera Oficial de Revalorización */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#f8fafc] p-3 rounded border border-[#cbd5e1]">
        <div>
          <label className="text-[11px] font-semibold text-[#475569] block mb-0.5">N° Documento</label>
          <input
            readOnly
            className={`${inputClass} bg-[#f1f5f9] font-mono font-semibold text-[#1e293b]`}
            value={`MRV-${(revaluationsHistory.length + 1).toString().padStart(5, '0')}`}
          />
        </div>
        <Field label="Fecha de contabilización" required>
          <input
            required
            type="date"
            className={inputClass}
            value={date}
            onChange={e => setDate(e.target.value)}
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
        <Field label="Método de revalorización">
          <select
            className={inputClass}
            value={revalMethod}
            onChange={e => setRevalMethod(e.target.value as 'price' | 'inventory')}
          >
            <option value="price">Modificación del precio</option>
            <option value="inventory">Débito / Crédito de inventario</option>
          </select>
        </Field>

        <Field label="Cuenta de contrapartida">
          <select
            className={inputClass}
            value={revalAccount}
            onChange={e => setRevalAccount(e.target.value)}
          >
            <option value="605002">6.05.02 · Diferencias de valoración de existencias</option>
            <option value="402008">4.02.08 · Ganancia por revalorización de activos</option>
          </select>
        </Field>
        <div className="md:col-span-2 lg:col-span-3">
          <Field label="Motivo de la revalorización" required>
            <input
              required
              minLength={3}
              className={inputClass}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Justificación técnica o pericial de la variación de costo..."
            />
          </Field>
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
          <TrendingUp className="h-3 w-3" />
          Artículos a Revalorizar
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-t transition-all flex items-center gap-1.5 ${
            activeTab === 'general'
              ? 'bg-white text-[#0055A5] border-t-2 border-t-[#0055A5] shadow-sm'
              : 'text-[#475569] hover:bg-white/60'
          }`}
        >
          <FileText className="h-3 w-3" />
          General y Auditoría
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('historico')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-t transition-all flex items-center gap-1.5 ${
            activeTab === 'historico'
              ? 'bg-white text-[#0055A5] border-t-2 border-t-[#0055A5] shadow-sm'
              : 'text-[#475569] hover:bg-white/60'
          }`}
        >
          <History className="h-3 w-3" />
          Histórico de Revalorizaciones ({revaluationsHistory.length})
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

      {/* TAB 1: ARTÍCULOS A REVALORIZAR */}
      {activeTab === 'articulos' && (
        <form
          className="space-y-3"
          onSubmit={async e => {
            e.preventDefault();
            if (!itemCode || cost <= 0) {
              alert('Seleccione un artículo y defina el nuevo costo unitario.');
              return;
            }
            await c.save({
              action: 'stockRevalue',
              data: {
                itemCode,
                date,
                newCost: cost,
                reason
              }
            });
            alert(`Artículo ${itemCode} revalorizado exitosamente. Asiento contable emitido.`);
          }}
        >
          <div className="overflow-x-auto border border-[#cbd5e1] rounded bg-white shadow-inner">
            <table className="min-w-full text-xs text-left border-collapse">
              <thead className="bg-[#f1f5f9] text-[#475569] font-semibold border-b border-[#cbd5e1]">
                <tr>
                  <th className="p-2 w-10 text-center">#</th>
                  <th className="p-2 min-w-[200px]">Artículo *</th>
                  <th className="p-2 min-w-[180px]">Descripción</th>
                  <th className="p-2 w-28 text-right">Existencias</th>
                  <th className="p-2 w-32 text-right">Costo Actual ($)</th>
                  <th className="p-2 w-32 text-right">Nuevo Costo ($) *</th>
                  <th className="p-2 w-28 text-right">Dif. Unit. ($)</th>
                  <th className="p-2 w-32 text-right">Impacto Total ($)</th>
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
                        value={itemCode}
                        onChange={e => {
                          const code = e.target.value;
                          setItemCode(code);
                          const it = c.data.items.find(i => i.itemCode === code);
                          setCost(it?.standardCost ?? it?.purchasePrice ?? 0);
                        }}
                      >
                        <option value="">Seleccione el artículo...</option>
                        {c.data.items
                          .filter(i => i.active && i.type === 'inventory')
                          .map(i => (
                            <option key={i.id} value={i.itemCode}>
                              {i.itemCode} — {i.name}
                            </option>
                          ))}
                      </select>
                      {itemCode && (
                        <button
                          type="button"
                          title="Flecha dorada: Ver datos maestros del artículo"
                          className="text-[#f59e0b] hover:text-[#d97706] p-0.5"
                          onClick={() => alert(`Datos maestros del artículo: ${itemCode}`)}
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="p-2 text-[#334155] font-medium truncate max-w-[180px]">
                    {item?.name ?? '—'}
                  </td>
                  <td className="p-2 text-right font-mono font-semibold text-[#1e293b]">
                    {quantity} UND
                  </td>
                  <td className="p-2 text-right font-mono text-[#64748b]">
                    {usd(oldUnitCost)}
                  </td>
                  <td className="p-1">
                    <input
                      required
                      type="number"
                      min={0.01}
                      step="0.01"
                      className={`${inputClass} text-right font-bold`}
                      value={cost}
                      onChange={e => setCost(Number(e.target.value))}
                    />
                  </td>
                  <td className="p-2 text-right font-mono font-bold">
                    <span className={cost - oldUnitCost > 0 ? 'text-[#16a34a]' : cost - oldUnitCost < 0 ? 'text-[#dc2626]' : 'text-[#64748b]'}>
                      {cost - oldUnitCost > 0 ? `+${usd(cost - oldUnitCost)}` : usd(cost - oldUnitCost)}
                    </span>
                  </td>
                  <td className="p-2 text-right font-mono font-bold text-sm">
                    <span className={totalDifference > 0 ? 'text-[#16a34a]' : totalDifference < 0 ? 'text-[#dc2626]' : 'text-[#64748b]'}>
                      {totalDifference > 0 ? `+${usd(totalDifference)}` : usd(totalDifference)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded border bg-[#f8fafc] border-[#cbd5e1]">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[11px] text-[#64748b] block">Valor Actual en Bodega</span>
                <span className="text-sm font-bold font-mono text-[#1e293b]">{usd(currentValue)}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#64748b] block">Nuevo Valor Revalorizado</span>
                <span className="text-sm font-bold font-mono text-[#0055A5]">{usd(quantity * cost)}</span>
              </div>
              <div className="border-l border-[#cbd5e1] pl-4">
                <span className="text-[11px] text-[#64748b] block">Ajuste Contable a Generar</span>
                <span className={`text-base font-bold font-mono ${totalDifference >= 0 ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                  {totalDifference >= 0 ? `+${usd(totalDifference)} (Ganancia)` : `${usd(totalDifference)} (Pérdida)`}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className={`${buttonClass} font-bold`}
              disabled={c.saving || !itemCode || cost <= 0}
            >
              Revalorizar y Contabilizar Asiento
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: GENERAL Y AUDITORÍA */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded border border-[#cbd5e1]">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0055A5] border-b pb-1">
              Información de Auditoría y Control
            </h4>
            <Field label="Referencia de Auditoría Interna">
              <input
                className={inputClass}
                value={refAudit}
                onChange={e => setRefAudit(e.target.value)}
              />
            </Field>
            <Field label="Tipo de Documento Fuente">
              <input
                readOnly
                className={`${inputClass} bg-[#f8fafc]`}
                value="OMRV · Documento oficial de revalorización SAP B1"
              />
            </Field>
            <Field label="Usuario responsable">
              <input
                readOnly
                className={`${inputClass} bg-[#f8fafc]`}
                value="manager (Auditor de Costos)"
              />
            </Field>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0055A5] border-b pb-1">
              Impacto en Costos y Capas FIFO
            </h4>
            <p className="text-xs text-[#64748b] leading-relaxed">
              La revalorización de inventario actualiza el costo estándar en el maestro de artículos (`OITM.AvgPrice`) y recalcula las capas de existencias en todos los almacenes donde se encuentre registrado.
            </p>
            <div className="p-2.5 rounded bg-[#f1f5f9] text-[11px] text-[#334155] border border-[#e2e8f0] flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-[#0284c7] shrink-0 mt-0.5" />
              <span>
                <strong>Importante:</strong> El asiento automático acreditará o debitará la cuenta de inventario (1.1.05) con contrapartida en la cuenta de resultados seleccionada en la cabecera.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HISTÓRICO DE REVALORIZACIONES */}
      {activeTab === 'historico' && (
        <div className="space-y-3 bg-white p-4 rounded border border-[#cbd5e1]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0055A5] border-b pb-1">
            Registro Histórico de Revalorizaciones
          </h4>
          <div className="overflow-x-auto border border-[#cbd5e1] rounded">
            <table className="min-w-full text-xs text-left border-collapse">
              <thead className="bg-[#f1f5f9] text-[#475569] font-semibold border-b border-[#cbd5e1]">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">Artículo</th>
                  <th className="p-2">Fecha</th>
                  <th className="p-2 text-right">Costo Anterior</th>
                  <th className="p-2 text-right">Nuevo Costo</th>
                  <th className="p-2 text-right">Variación Total</th>
                  <th className="p-2 text-center">Asiento Contable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {revaluationsHistory.map((r, idx) => (
                  <tr key={idx} className="hover:bg-[#f8fafc]">
                    <td className="p-2 font-mono font-semibold text-[#0055A5]">{r.id}</td>
                    <td className="p-2 font-medium text-[#1e293b]">{r.itemCode}</td>
                    <td className="p-2 text-[#64748b]">{r.date}</td>
                    <td className="p-2 text-right font-mono">{usd(r.oldCost)}</td>
                    <td className="p-2 text-right font-mono font-bold text-[#0055A5]">{usd(r.newCost)}</td>
                    <td className="p-2 text-right font-mono font-bold">
                      <span className={r.valueChange >= 0 ? 'text-[#16a34a]' : 'text-[#dc2626]'}>
                        {r.valueChange >= 0 ? `+${usd(r.valueChange)}` : usd(r.valueChange)}
                      </span>
                    </td>
                    <td className="p-2 text-center font-mono text-xs text-[#0284c7]">
                      {r.journalEntryId || 'Automático'}
                    </td>
                  </tr>
                ))}
                {revaluationsHistory.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-[#94a3b8]">
                      No hay registros históricos de revalorización en esta empresa.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ANEXOS (Informes Periciales y Resoluciones) */}
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
                alert(`Visualizando anexo de revalorización: ${att?.fileName}`);
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
    </Screen>
  );
}
