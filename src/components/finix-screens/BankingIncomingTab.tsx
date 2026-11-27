"use client";

import React from 'react';
import { round, usd } from '@/lib/company-calculations';
import { NumberInput } from './FinixControls';
import VirtualTeacherInvoiceBanner from './VirtualTeacherInvoiceBanner';

interface BankingIncomingTabProps {
  customers: { cardCode: string; name: string }[];
  selectedCustomerCode: string;
  setSelectedCustomerCode: (code: string) => void;
  currentCustomer?: { cardCode: string; name: string };
  reference: string;
  setReference: (ref: string) => void;
  paymentDate: string;
  setPaymentDate: (d: string) => void;
  selectedBankAccountId: string;
  setSelectedBankAccountId: (id: string) => void;
  bankAccounts: { id: string; name: string; bankName: string; balance: number }[];
  paymentMethod: 'transfer' | 'card' | 'cash' | 'check';
  setPaymentMethod: (m: 'transfer' | 'card' | 'cash' | 'check') => void;
  onOpenMeansModal: () => void;
  openCustomerInvoices: any[];
  selectedInvoices: Record<string, { selected: boolean; amountToPay: number }>;
  onToggleInvoice: (docId: string, fullPendingAmount: number) => void;
  onInvoiceAmountChange: (docId: string, val: number) => void;
  totalIncomingAmount: number;
  onSave: (e: React.FormEvent) => void;
  onGeneratePracticeInvoice: () => Promise<void>;
  saving: boolean;
  statusMsg: string | null;
  onResetInvoices: () => void;
}

export default function BankingIncomingTab({
  customers,
  selectedCustomerCode,
  setSelectedCustomerCode,
  currentCustomer,
  reference,
  setReference,
  paymentDate,
  setPaymentDate,
  selectedBankAccountId,
  setSelectedBankAccountId,
  bankAccounts,
  paymentMethod,
  setPaymentMethod,
  onOpenMeansModal,
  openCustomerInvoices,
  selectedInvoices,
  onToggleInvoice,
  onInvoiceAmountChange,
  totalIncomingAmount,
  onSave,
  onGeneratePracticeInvoice,
  saving,
  statusMsg,
  onResetInvoices
}: BankingIncomingTabProps) {
  return (
    <form onSubmit={onSave} className="space-y-3">
      {/* Cabecera Oficial de Pagos Recibidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-[#f8fafc] border border-[#c1d1e0] rounded-xs p-3 shadow-2xs">
        {/* Columna Izquierda: Socio y Datos de Cobro */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-4 text-xs font-bold text-[#003366] pb-1 border-b border-[#cbd9e7]">
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="incomingType" defaultChecked className="accent-[#0055a5]" />
              <span>Cliente</span>
            </label>
            <label className="flex items-center gap-1 opacity-50 cursor-not-allowed">
              <input type="radio" name="incomingType" disabled />
              <span>Proveedor</span>
            </label>
            <label className="flex items-center gap-1 opacity-50 cursor-not-allowed">
              <input type="radio" name="incomingType" disabled />
              <span>Cuenta de mayor</span>
            </label>
          </div>

          <div>
            <label className="flex items-center gap-1 font-semibold text-[#1e293b] mb-0.5">
              <span className="w-3.5 h-3.5 bg-[#f0ab00] rounded-2xs text-white text-[9px] font-black flex items-center justify-center shadow-2xs">
                ▶
              </span>
              <span>Código de cliente:</span>
            </label>
            <div className="flex gap-1.5 items-center">
              <select
                className="flex-1 border border-[#9fb4c7] bg-white px-2 py-1 text-[11px] font-bold text-[#003366] rounded-xs shadow-inner cursor-pointer"
                value={selectedCustomerCode}
                onChange={e => {
                  setSelectedCustomerCode(e.target.value);
                  onResetInvoices();
                }}
              >
                {customers.map(c => (
                  <option key={c.cardCode} value={c.cardCode}>
                    {c.cardCode} · {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 items-center">
            <label className="text-[10.5px] text-[#475569] font-medium">Nombre de cliente</label>
            <input
              type="text"
              readOnly
              className="col-span-2 border border-[#b8c9d9] bg-[#f1f5f9] px-2 py-0.5 text-[11px] text-gray-800 font-semibold rounded-xs"
              value={currentCustomer?.name || 'Cliente'}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 items-center">
            <label className="text-[10.5px] text-[#475569] font-medium">Referencia / Glosa</label>
            <input
              type="text"
              className="col-span-2 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] text-[#1e293b] rounded-xs focus:bg-[#fffde7] focus:outline-1 focus:outline-[#0055a5] shadow-inner"
              placeholder="Transferencia Banco Pichincha #092817"
              value={reference}
              onChange={e => setReference(e.target.value)}
            />
          </div>
        </div>

        {/* Columna Derecha: Numeración & Fecha */}
        <div className="space-y-1.5">
          <div className="grid grid-cols-3 gap-2 items-center">
            <label className="text-[10.5px] text-[#475569] font-medium">Nº de documento</label>
            <span className="col-span-2 font-mono font-bold text-[11px] px-2 py-0.5 bg-white border border-[#9fb4c7] rounded-xs text-[#003366] shadow-inner">
              Automático (Serie Principal)
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 items-center">
            <label className="text-[10.5px] text-[#1e293b] font-semibold">
              F. Contabilización <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              required
              className="col-span-2 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] text-[#1e293b] rounded-xs focus:bg-[#fffde7] focus:outline-1 focus:outline-[#0055a5] shadow-inner"
              value={paymentDate}
              onChange={e => setPaymentDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 items-center">
            <label className="text-[10.5px] text-[#475569] font-medium">Cuenta bancaria destino</label>
            <select
              className="col-span-2 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] text-[#003366] font-semibold rounded-xs"
              value={selectedBankAccountId}
              onChange={e => setSelectedBankAccountId(e.target.value)}
            >
              {bankAccounts.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.bankName} - {usd(a.balance)})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2 items-center">
            <label className="text-[10.5px] text-[#475569] font-medium">Medio de cobro</label>
            <div className="col-span-2 flex items-center gap-2">
              <select
                className="flex-1 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] text-[#1e293b] rounded-xs"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as any)}
              >
                <option value="transfer">Transferencia Bancaria</option>
                <option value="card">Tarjeta de Crédito / Débito</option>
                <option value="cash">Efectivo (Caja General)</option>
                <option value="check">Cheque</option>
              </select>

              <button
                type="button"
                onClick={onOpenMeansModal}
                className="px-2.5 py-1 bg-gradient-to-b from-[#ffd25a] to-[#f0ab00] hover:brightness-105 border border-[#c48a00] text-[#1d2d3e] font-extrabold text-[10.5px] rounded-xs shadow-2xs flex items-center gap-1 active:scale-95 cursor-pointer"
                title="Abrir ventana oficial de Medios de Pago de SAP Business One"
              >
                <span>💰</span>
                <span>Medios</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Matriz de Facturas Abiertas del Cliente */}
      <div className="bg-white border border-[#a6b8cc] rounded-xs p-3 shadow-xs space-y-2">
        <div className="flex items-center justify-between border-b border-[#cbd9e7] pb-1.5">
          <h4 className="font-bold text-[#003366] text-xs">
            Documentos pendientes de cobro para {currentCustomer?.name} ({openCustomerInvoices.length})
          </h4>
          <span className="text-[10px] text-gray-500">
            Selecciona la casilla [x] para incluir la factura en este pago.
          </span>
        </div>

        {openCustomerInvoices.length === 0 ? (
          <VirtualTeacherInvoiceBanner
            type="customer"
            partnerCode={selectedCustomerCode}
            partnerName={currentCustomer?.name || 'Cliente seleccionado'}
            onGenerate={onGeneratePracticeInvoice}
          />
        ) : (
          <div className="overflow-x-auto border border-[#b4c4d4] rounded-xs">
            <table className="w-full border-collapse text-left text-[11px]">
              <thead className="bg-[#e4ebf3] font-bold text-[#1e293b] border-b border-[#a8bccf]">
                <tr>
                  <th className="p-1.5 w-10 text-center">Sel.</th>
                  <th className="p-1.5 border-r border-[#c2d3e3] w-28">Nº Documento</th>
                  <th className="p-1.5 border-r border-[#c2d3e3] w-20 text-center">Clase</th>
                  <th className="p-1.5 border-r border-[#c2d3e3] w-24">Fecha Venc.</th>
                  <th className="p-1.5 border-r border-[#c2d3e3] w-28 text-right">Total Factura</th>
                  <th className="p-1.5 border-r border-[#c2d3e3] w-28 text-right text-red-700">Saldo Pendiente</th>
                  <th className="p-1.5 w-32 text-right">Pago Total (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4e1ed]">
                {openCustomerInvoices.map((inv) => {
                  const pending = round(inv.total - (inv.paidAmount || 0));
                  const isSelected = Boolean(selectedInvoices[inv.id]?.selected);
                  const payVal = selectedInvoices[inv.id]?.amountToPay ?? pending;
                  return (
                    <tr key={inv.id} className={isSelected ? 'bg-[#fffde7]' : 'hover:bg-[#f7fafc]'}>
                      <td className="p-1.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleInvoice(inv.id, pending)}
                          className="w-4 h-4 accent-[#0055a5] cursor-pointer"
                        />
                      </td>
                      <td className="p-1.5 font-mono font-bold text-[#003366] border-r border-[#d4e1ed]">
                        {inv.docNumber || inv.id}
                      </td>
                      <td className="p-1.5 text-center font-bold text-gray-600 border-r border-[#d4e1ed]">
                        RF (Factura)
                      </td>
                      <td className="p-1.5 font-mono text-gray-700 border-r border-[#d4e1ed]">
                        {inv.dueDate || inv.date}
                      </td>
                      <td className="p-1.5 text-right font-mono border-r border-[#d4e1ed]">
                        {usd(inv.total)}
                      </td>
                      <td className="p-1.5 text-right font-mono font-bold text-red-700 border-r border-[#d4e1ed]">
                        {usd(pending)}
                      </td>
                      <td className="p-1.5 text-right font-mono font-bold">
                        <NumberInput
                          ariaLabel={`Monto a pagar factura ${inv.docNumber}`}
                          disabled={!isSelected}
                          min={0.01}
                          max={pending}
                          value={isSelected ? payVal : 0}
                          onChange={val => onInvoiceAmountChange(inv.id, val)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Resumen del Total Cobrado */}
        <div className="flex justify-end pt-2">
          <div className="flex items-center gap-3 bg-[#f0f4f9] border border-[#0055a5] px-4 py-2 rounded-xs">
            <span className="font-bold text-gray-700 text-xs">Importe Total del Cobro:</span>
            <span className="font-mono text-base font-extrabold text-[#0055a5]">
              {usd(totalIncomingAmount)} USD
            </span>
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center justify-between pt-1 border-t border-[#c1d1e0]">
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={saving || totalIncomingAmount <= 0}
            className="px-5 py-1.5 bg-[#0070d2] hover:bg-[#005bb5] border border-[#004b96] text-white font-bold text-xs rounded-xs shadow-sm hover:shadow active:scale-95 disabled:opacity-50 cursor-pointer transition-all"
          >
            {saving ? 'Procesando…' : 'Crear Pago Recibido'}
          </button>
          <button
            type="button"
            onClick={onResetInvoices}
            className="px-4 py-1.5 bg-[#f0f2f5] hover:bg-white border border-[#9fb4c7] text-[#1d2d3e] font-semibold text-xs rounded-xs shadow-2xs active:scale-95 cursor-pointer"
          >
            Cancelar
          </button>
        </div>

        {statusMsg && (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-300 text-blue-900 rounded-xs text-[11px] font-semibold animate-in fade-in">
            <span>ℹ️</span>
            <span>{statusMsg}</span>
          </div>
        )}
      </div>
    </form>
  );
}
