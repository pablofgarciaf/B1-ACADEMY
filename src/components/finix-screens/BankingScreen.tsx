'use client';

import React, { useState, useMemo } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { round, today, usd } from '@/lib/company-calculations';
import type { CommandData } from '@/lib/company-commands';
import { inputClass, buttonClass, NumberInput } from './FinixControls';
import BancaEnLinea from './BancaEnLinea';

const FALLBACK_CUSTOMERS = [
  { cardCode: 'C20000', name: 'Maxi-Teq S.A.', ruc: '1792048572001' },
  { cardCode: 'C20001', name: 'TechSolutions Cía. Ltda.', ruc: '1791834921001' },
  { cardCode: 'C20002', name: 'CompuMundo Ecuador', ruc: '1792241903001' },
  { cardCode: 'C20003', name: 'Corporación Andina S.A.', ruc: '1790099001001' },
];

const FALLBACK_VENDORS = [
  { cardCode: 'V10000', name: 'Dell Ecuador S.A.', ruc: '1791349281001' },
  { cardCode: 'V10001', name: 'HP Importaciones Cía. Ltda.', ruc: '1792194829001' },
  { cardCode: 'V10002', name: 'Lenovo Andina', ruc: '1792849182001' },
];

export default function BankingScreen() {
  const c = useCompany();
  const [activeTab, setActiveTab] = useState<'recibidos' | 'efectuados' | 'conciliacion' | 'banco_linea'>('recibidos');

  // Partners
  const rawCustomers = c.data.customers;
  const customers = rawCustomers && rawCustomers.length > 0 ? rawCustomers : FALLBACK_CUSTOMERS;
  const rawVendors = c.data.vendors;
  const vendors = rawVendors && rawVendors.length > 0 ? rawVendors : FALLBACK_VENDORS;

  // Selected partner for incoming / outgoing
  const [selectedCustomerCode, setSelectedCustomerCode] = useState<string>(customers[0]?.cardCode || 'C20000');
  const [selectedVendorCode, setSelectedVendorCode] = useState<string>(vendors[0]?.cardCode || 'V10000');

  // Payment form state
  const [paymentDate, setPaymentDate] = useState<string>(today());
  const [selectedInvoices, setSelectedInvoices] = useState<Record<string, { selected: boolean; amountToPay: number }>>({});
  const [reference, setReference] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'card' | 'cash' | 'check'>('transfer');
  const [selectedBankAccountId, setSelectedBankAccountId] = useState<string>(c.data.bankAccounts[0]?.id || 'BAN-1');
  const [showMeansOfPaymentModal, setShowMeansOfPaymentModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Reconciliation state
  const [selectedBankForReconcile, setSelectedBankForReconcile] = useState<string>('');
  const [statement, setStatement] = useState<Record<string, number>>({});

  // Active customer / vendor
  const currentCustomer = customers.find(x => x.cardCode === selectedCustomerCode);
  const currentVendor = vendors.find(x => x.cardCode === selectedVendorCode);

  // Invoices for incoming payments (Customer sales invoices that are open)
  const openCustomerInvoices = useMemo(() => {
    return c.data.salesOrders.filter(
      d => d.docType === 'invoice' && d.cardCode === selectedCustomerCode && d.status !== 'closed'
    );
  }, [c.data.salesOrders, selectedCustomerCode]);

  // Invoices for outgoing payments (Vendor purchase invoices that are open)
  const openVendorInvoices = useMemo(() => {
    return c.data.purchaseOrders.filter(
      d => d.docType === 'vendor_invoice' && d.cardCode === selectedVendorCode && d.status !== 'closed'
    );
  }, [c.data.purchaseOrders, selectedVendorCode]);

  // Calculate total to pay for selected documents
  const totalIncomingAmount = useMemo(() => {
    let sum = 0;
    for (const doc of openCustomerInvoices) {
      const item = selectedInvoices[doc.id];
      if (item?.selected) {
        sum += item.amountToPay;
      }
    }
    return round(sum);
  }, [openCustomerInvoices, selectedInvoices]);

  const totalOutgoingAmount = useMemo(() => {
    let sum = 0;
    for (const doc of openVendorInvoices) {
      const item = selectedInvoices[doc.id];
      if (item?.selected) {
        sum += item.amountToPay;
      }
    }
    return round(sum);
  }, [openVendorInvoices, selectedInvoices]);

  const handleToggleInvoice = (docId: string, fullPendingAmount: number) => {
    setSelectedInvoices(prev => {
      const curr = prev[docId];
      if (curr?.selected) {
        return { ...prev, [docId]: { selected: false, amountToPay: 0 } };
      }
      return { ...prev, [docId]: { selected: true, amountToPay: fullPendingAmount } };
    });
  };

  const handleInvoiceAmountChange = (docId: string, val: number) => {
    setSelectedInvoices(prev => ({
      ...prev,
      [docId]: { selected: val > 0, amountToPay: val },
    }));
  };

  // Submit Incoming Payment (Pagos Recibidos)
  const handleSaveIncoming = async (e: React.FormEvent) => {
    e.preventDefault();
    const docIds = Object.keys(selectedInvoices).filter(id => selectedInvoices[id]?.selected);
    const amount = totalIncomingAmount;
    if (amount <= 0 && docIds.length === 0) {
      setStatusMsg('Selecciona al menos una factura abierta para registrar el cobro.');
      return;
    }
    try {
      await c.save({
        action: 'bank',
        data: {
          bankAccountId: selectedBankAccountId || c.data.bankAccounts[0]?.id || 'BAN-1',
          date: paymentDate,
          type: 'deposit',
          amount: amount > 0 ? amount : 100,
          paymentMethod,
          counterpartAccount: '1.1.02.01',
          reference: reference || `Cobro cliente ${selectedCustomerCode}`,
          documentId: docIds[0] || '',
        },
      });
      setSelectedInvoices({});
      setReference('');
      setStatusMsg('¡Pago Recibido contabilizado con éxito en SAP Business One!');
      setTimeout(() => setStatusMsg(null), 4000);
    } catch {
      /* Handled by company provider */
    }
  };

  // Submit Outgoing Payment (Pagos Efectuados)
  const handleSaveOutgoing = async (e: React.FormEvent) => {
    e.preventDefault();
    const docIds = Object.keys(selectedInvoices).filter(id => selectedInvoices[id]?.selected);
    const amount = totalOutgoingAmount;
    if (amount <= 0 && docIds.length === 0) {
      setStatusMsg('Selecciona al menos una factura de proveedor para pagar.');
      return;
    }
    try {
      await c.save({
        action: 'bank',
        data: {
          bankAccountId: selectedBankAccountId || c.data.bankAccounts[0]?.id || 'BAN-1',
          date: paymentDate,
          type: 'payment',
          amount: amount > 0 ? amount : 100,
          paymentMethod,
          counterpartAccount: '2.1.01.01',
          reference: reference || `Pago proveedor ${selectedVendorCode}`,
          documentId: docIds[0] || '',
        },
      });
      setSelectedInvoices({});
      setReference('');
      setStatusMsg('¡Pago Efectuado contabilizado con éxito en SAP Business One!');
      setTimeout(() => setStatusMsg(null), 4000);
    } catch {
      /* Handled */
    }
  };

  // Reconciliation data
  const reconcileRows = c.data.bankTransactions.filter(
    t => !selectedBankForReconcile || t.bankAccountId === selectedBankForReconcile
  );
  const sign = (type: string, value: number) => (type === 'deposit' ? value : -value);

  return (
    <div className="w-full flex flex-col font-[Tahoma,Arial,sans-serif] text-[11px] text-[#222] bg-[#f0f4f7] select-text">
      {/* ── BARRA SUPERIOR DE PESTAÑAS CANÓNICAS DE BANCOS ── */}
      <div className="bg-[#e4ebf2] border-b border-[#a8bccf] px-3 pt-1.5 flex items-center justify-between shrink-0 select-none shadow-xs">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('recibidos')}
            className={`px-3 py-1 text-xs font-bold rounded-t-xs border-t-2 border-x transition-all cursor-pointer ${
              activeTab === 'recibidos'
                ? 'bg-white text-[#003366] border-t-[#0055a5] border-x-[#a8bccf] border-b-white -mb-px shadow-xs'
                : 'bg-[#e2edf4] text-[#475569] border-transparent hover:bg-white/70'
            }`}
          >
            📥 Pagos Recibidos (Cobros)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('efectuados')}
            className={`px-3 py-1 text-xs font-bold rounded-t-xs border-t-2 border-x transition-all cursor-pointer ${
              activeTab === 'efectuados'
                ? 'bg-white text-[#003366] border-t-[#0055a5] border-x-[#a8bccf] border-b-white -mb-px shadow-xs'
                : 'bg-[#e2edf4] text-[#475569] border-transparent hover:bg-white/70'
            }`}
          >
            📤 Pagos Efectuados (Proveedores)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('conciliacion')}
            className={`px-3 py-1 text-xs font-bold rounded-t-xs border-t-2 border-x transition-all cursor-pointer ${
              activeTab === 'conciliacion'
                ? 'bg-white text-[#003366] border-t-[#0055a5] border-x-[#a8bccf] border-b-white -mb-px shadow-xs'
                : 'bg-[#e2edf4] text-[#475569] border-transparent hover:bg-white/70'
            }`}
          >
            ⚖️ Conciliación Bancaria
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('banco_linea')}
            className={`px-3 py-1 text-xs font-bold rounded-t-xs border-t-2 border-x transition-all cursor-pointer ${
              activeTab === 'banco_linea'
                ? 'bg-white text-[#003366] border-t-[#0055a5] border-x-[#a8bccf] border-b-white -mb-px shadow-xs'
                : 'bg-[#e2edf4] text-[#475569] border-transparent hover:bg-white/70'
            }`}
          >
            🏦 Banca en Línea
          </button>
        </div>

        <div className="flex items-center gap-2 pb-1 text-[10.5px]">
          <span className="text-gray-500 font-mono">Gestión de Bancos · SAP Business One</span>
        </div>
      </div>

      {/* Alerta de notificación flotante o inline */}
      {statusMsg && (
        <div className="mx-3 mt-2 p-2 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xs font-bold text-xs flex items-center justify-between shadow-2xs">
          <span>✅ {statusMsg}</span>
          <button type="button" onClick={() => setStatusMsg(null)} className="text-emerald-700 hover:text-emerald-950 font-black">
            ×
          </button>
        </div>
      )}

      {/* ── CONTENIDO PRINCIPAL POR PESTAÑA ── */}
      <div className="p-3 sm:p-4 space-y-3">
        {/* ════════════════════════════════════════════════════════════════════════
            PESTAÑA 1: PAGOS RECIBIDOS (Cobros de Clientes)
           ════════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'recibidos' && (
          <form onSubmit={handleSaveIncoming} className="space-y-3">
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
                        setSelectedInvoices({});
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
                    {c.data.bankAccounts.map(a => (
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
                      onClick={() => setShowMeansOfPaymentModal(true)}
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
                <div className="p-6 text-center text-gray-500 bg-[#f8fafc] border border-dashed border-[#b8c9d9] rounded-xs">
                  <span className="text-xl block mb-1">📄</span>
                  <p className="font-semibold text-xs text-[#003366]">No hay facturas abiertas para este cliente.</p>
                  <p className="text-[10.5px] text-gray-500">
                    Crea primero una <strong>Factura de deudores</strong> en el módulo de Ventas para poder cobrarla aquí.
                  </p>
                </div>
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
                                onChange={() => handleToggleInvoice(inv.id, pending)}
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
                                onChange={val => handleInvoiceAmountChange(inv.id, val)}
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
                  disabled={c.saving || totalIncomingAmount <= 0}
                  className="px-5 py-1.5 bg-[#0070d2] hover:bg-[#005bb5] border border-[#004b96] text-white font-bold text-xs rounded-xs shadow-sm hover:shadow active:scale-95 disabled:opacity-50 cursor-pointer transition-all"
                >
                  {c.saving ? 'Procesando…' : 'Crear Pago Recibido'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoices({})}
                  className="px-4 py-1.5 bg-[#f0f2f5] hover:bg-white border border-[#9fb4c7] text-[#1d2d3e] font-semibold text-xs rounded-xs shadow-2xs active:scale-95 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>

              <span className="text-[10.5px] text-gray-500 font-mono">
                Impacto contable: Banco (+) / Clientes (−)
              </span>
            </div>
          </form>
        )}

        {/* ════════════════════════════════════════════════════════════════════════
            PESTAÑA 2: PAGOS EFECTUADOS (Pagos a Proveedores)
           ════════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'efectuados' && (
          <form onSubmit={handleSaveOutgoing} className="space-y-3">
            {/* Cabecera Oficial de Pagos Efectuados */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-[#f8fafc] border border-[#c1d1e0] rounded-xs p-3 shadow-2xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-4 text-xs font-bold text-[#003366] pb-1 border-b border-[#cbd9e7]">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="outgoingType" defaultChecked className="accent-[#0055a5]" />
                    <span>Proveedor</span>
                  </label>
                  <label className="flex items-center gap-1 opacity-50 cursor-not-allowed">
                    <input type="radio" name="outgoingType" disabled />
                    <span>Cliente</span>
                  </label>
                  <label className="flex items-center gap-1 opacity-50 cursor-not-allowed">
                    <input type="radio" name="outgoingType" disabled />
                    <span>Cuenta de mayor</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-1 font-semibold text-[#1e293b] mb-0.5">
                    <span className="w-3.5 h-3.5 bg-[#f0ab00] rounded-2xs text-white text-[9px] font-black flex items-center justify-center shadow-2xs">
                      ▶
                    </span>
                    <span>Código de proveedor:</span>
                  </label>
                  <div className="flex gap-1.5 items-center">
                    <select
                      className="flex-1 border border-[#9fb4c7] bg-white px-2 py-1 text-[11px] font-bold text-[#003366] rounded-xs shadow-inner cursor-pointer"
                      value={selectedVendorCode}
                      onChange={e => {
                        setSelectedVendorCode(e.target.value);
                        setSelectedInvoices({});
                      }}
                    >
                      {vendors.map(v => (
                        <option key={v.cardCode} value={v.cardCode}>
                          {v.cardCode} · {v.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="text-[10.5px] text-[#475569] font-medium">Nombre de proveedor</label>
                  <input
                    type="text"
                    readOnly
                    className="col-span-2 border border-[#b8c9d9] bg-[#f1f5f9] px-2 py-0.5 text-[11px] text-gray-800 font-semibold rounded-xs"
                    value={currentVendor?.name || 'Proveedor'}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="text-[10.5px] text-[#475569] font-medium">Referencia / Glosa</label>
                  <input
                    type="text"
                    className="col-span-2 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] text-[#1e293b] rounded-xs focus:bg-[#fffde7] focus:outline-1 focus:outline-[#0055a5] shadow-inner"
                    placeholder="Pago factura proveedor #FP-9901"
                    value={reference}
                    onChange={e => setReference(e.target.value)}
                  />
                </div>
              </div>

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
                  <label className="text-[10.5px] text-[#475569] font-medium">Cuenta bancaria origen</label>
                  <select
                    className="col-span-2 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] text-[#003366] font-semibold rounded-xs"
                    value={selectedBankAccountId}
                    onChange={e => setSelectedBankAccountId(e.target.value)}
                  >
                    {c.data.bankAccounts.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.bankName} - {usd(a.balance)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="text-[10.5px] text-[#475569] font-medium">Medio de pago</label>
                  <div className="col-span-2 flex items-center gap-2">
                    <select
                      className="flex-1 border border-[#9fb4c7] bg-white px-2 py-0.5 text-[11px] text-[#1e293b] rounded-xs"
                      value={paymentMethod}
                      onChange={e => setPaymentMethod(e.target.value as any)}
                    >
                      <option value="transfer">Transferencia Bancaria</option>
                      <option value="check">Cheque</option>
                      <option value="cash">Efectivo</option>
                      <option value="card">Tarjeta</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setShowMeansOfPaymentModal(true)}
                      className="px-2.5 py-1 bg-gradient-to-b from-[#ffd25a] to-[#f0ab00] hover:brightness-105 border border-[#c48a00] text-[#1d2d3e] font-extrabold text-[10.5px] rounded-xs shadow-2xs flex items-center gap-1 active:scale-95 cursor-pointer"
                    >
                      <span>💰</span>
                      <span>Medios</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Matriz de Facturas de Proveedores */}
            <div className="bg-white border border-[#a6b8cc] rounded-xs p-3 shadow-xs space-y-2">
              <div className="flex items-center justify-between border-b border-[#cbd9e7] pb-1.5">
                <h4 className="font-bold text-[#003366] text-xs">
                  Facturas pendientes de pago a {currentVendor?.name} ({openVendorInvoices.length})
                </h4>
                <span className="text-[10px] text-gray-500">
                  Selecciona la casilla [x] para incluir la factura en el pago efectuado.
                </span>
              </div>

              {openVendorInvoices.length === 0 ? (
                <div className="p-6 text-center text-gray-500 bg-[#f8fafc] border border-dashed border-[#b8c9d9] rounded-xs">
                  <span className="text-xl block mb-1">📄</span>
                  <p className="font-semibold text-xs text-[#003366]">No hay facturas pendientes para este proveedor.</p>
                  <p className="text-[10.5px] text-gray-500">
                    Crea primero una <strong>Factura de proveedor</strong> en el módulo de Compras.
                  </p>
                </div>
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
                        <th className="p-1.5 border-r border-[#c2d3e3] w-28 text-right text-red-700">Saldo a Pagar</th>
                        <th className="p-1.5 w-32 text-right">Pago Total (USD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d4e1ed]">
                      {openVendorInvoices.map((inv) => {
                        const pending = round(inv.total - (inv.paidAmount || 0));
                        const isSelected = Boolean(selectedInvoices[inv.id]?.selected);
                        const payVal = selectedInvoices[inv.id]?.amountToPay ?? pending;
                        return (
                          <tr key={inv.id} className={isSelected ? 'bg-[#fffde7]' : 'hover:bg-[#f7fafc]'}>
                            <td className="p-1.5 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleInvoice(inv.id, pending)}
                                className="w-4 h-4 accent-[#0055a5] cursor-pointer"
                              />
                            </td>
                            <td className="p-1.5 font-mono font-bold text-[#003366] border-r border-[#d4e1ed]">
                              {inv.docNumber || inv.id}
                            </td>
                            <td className="p-1.5 text-center font-bold text-gray-600 border-r border-[#d4e1ed]">
                              FP (Fact. Prov.)
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
                                ariaLabel={`Monto a pagar factura prov ${inv.docNumber}`}
                                disabled={!isSelected}
                                min={0.01}
                                max={pending}
                                value={isSelected ? payVal : 0}
                                onChange={val => handleInvoiceAmountChange(inv.id, val)}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <div className="flex items-center gap-3 bg-[#f0f4f9] border border-[#0055a5] px-4 py-2 rounded-xs">
                  <span className="font-bold text-gray-700 text-xs">Importe Total del Pago:</span>
                  <span className="font-mono text-base font-extrabold text-[#0055a5]">
                    {usd(totalOutgoingAmount)} USD
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-[#c1d1e0]">
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={c.saving || totalOutgoingAmount <= 0}
                  className="px-5 py-1.5 bg-[#0070d2] hover:bg-[#005bb5] border border-[#004b96] text-white font-bold text-xs rounded-xs shadow-sm hover:shadow active:scale-95 disabled:opacity-50 cursor-pointer transition-all"
                >
                  {c.saving ? 'Procesando…' : 'Crear Pago Efectuado'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoices({})}
                  className="px-4 py-1.5 bg-[#f0f2f5] hover:bg-white border border-[#9fb4c7] text-[#1d2d3e] font-semibold text-xs rounded-xs shadow-2xs active:scale-95 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>

              <span className="text-[10.5px] text-gray-500 font-mono">
                Impacto contable: Proveedores (−) / Banco (−)
              </span>
            </div>
          </form>
        )}

        {/* ════════════════════════════════════════════════════════════════════════
            PESTAÑA 3: CONCILIACIÓN BANCARIA Y EXTRACTOS
           ════════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'conciliacion' && (
          <div className="space-y-3">
            {/* Cuentas Bancarias Registradas */}
            <div className="bg-white border border-[#a6b8cc] rounded-xs p-3 shadow-xs space-y-2">
              <h4 className="font-bold text-[#003366] text-xs">Cuentas Bancarias de la Empresa</h4>
              <div className="overflow-x-auto border border-[#b4c4d4] rounded-xs">
                <table className="w-full border-collapse text-left text-[11px]">
                  <thead className="bg-[#e4ebf3] font-bold text-[#1e293b] border-b border-[#a8bccf]">
                    <tr>
                      <th className="p-1.5">Nombre de Cuenta</th>
                      <th className="p-1.5">Institución Bancaria</th>
                      <th className="p-1.5">Número de Cuenta</th>
                      <th className="p-1.5 text-right">Saldo en Libros (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d4e1ed]">
                    {c.data.bankAccounts.map(acc => (
                      <tr key={acc.id} className="hover:bg-[#fffde7]">
                        <td className="p-1.5 font-bold text-[#003366]">{acc.name}</td>
                        <td className="p-1.5">{acc.bankName}</td>
                        <td className="p-1.5 font-mono text-gray-700">{acc.accountNumber}</td>
                        <td className="p-1.5 text-right font-mono font-bold text-emerald-800">{usd(acc.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Filtro y Reconciliación */}
            <div className="bg-white border border-[#a6b8cc] rounded-xs p-3 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <label className="font-bold text-xs text-[#003366]">Filtrar por cuenta:</label>
                  <select
                    className="border border-[#9fb4c7] px-2 py-1 text-[11px] rounded-xs bg-white"
                    value={selectedBankForReconcile}
                    onChange={e => setSelectedBankForReconcile(e.target.value)}
                  >
                    <option value="">Todas las cuentas</option>
                    {c.data.bankAccounts.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.bankName})
                      </option>
                    ))}
                  </select>
                </div>

                <span className="text-[10.5px] text-gray-600">
                  {reconcileRows.length} movimiento(s) registrado(s)
                </span>
              </div>

              {/* Tabla de Movimientos y Diferencias */}
              <div className="overflow-x-auto border border-[#b4c4d4] rounded-xs">
                <table className="w-full border-collapse text-left text-[11px]">
                  <thead className="bg-[#e4ebf3] font-bold text-[#1e293b] border-b border-[#a8bccf]">
                    <tr>
                      <th className="p-1.5 w-24">Fecha</th>
                      <th className="p-1.5 min-w-36">Referencia</th>
                      <th className="p-1.5 w-28 text-right">Saldo Libro</th>
                      <th className="p-1.5 w-32 text-right">Importe Extracto</th>
                      <th className="p-1.5 w-28 text-right">Diferencia</th>
                      <th className="p-1.5 w-24 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d4e1ed]">
                    {reconcileRows.map(t => {
                      const book = sign(t.type, t.amount);
                      const value = statement[t.id] ?? t.statementAmount ?? 0;
                      const diff = book - value;
                      return (
                        <tr key={t.id} className="hover:bg-[#fffde7]">
                          <td className="p-1.5 font-mono">{t.date}</td>
                          <td className="p-1.5 font-medium">{t.reference || t.transactionId}</td>
                          <td className="p-1.5 text-right font-mono font-bold text-[#003366]">{usd(book)}</td>
                          <td className="p-1.5 text-right font-mono">
                            <NumberInput
                              ariaLabel={`Importe banco ${t.transactionId}`}
                              value={value}
                              onChange={val => setStatement(s => ({ ...s, [t.id]: val }))}
                            />
                          </td>
                          <td className="p-1.5 text-right font-mono font-bold text-gray-700">{usd(diff)}</td>
                          <td className="p-1.5 text-center">
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await c.save({
                                    action: 'reconcile',
                                    data: { id: t.id, statementAmount: value, reconciled: !t.reconciled },
                                  });
                                } catch {}
                              }}
                              className={`px-2 py-0.5 rounded-xs font-bold text-[10px] cursor-pointer shadow-2xs transition active:scale-95 ${
                                t.reconciled
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}
                            >
                              {t.reconciled ? '✓ Conciliada' : 'Conciliar'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════════
            PESTAÑA 4: BANCA EN LÍNEA (Ecuador)
           ════════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'banco_linea' && (
          <div className="bg-white border border-[#a6b8cc] rounded-xs p-3 shadow-xs">
            <BancaEnLinea />
          </div>
        )}
      </div>

      {/* ── MODAL OFICIAL: MEDIOS DE PAGO (SAQUITO DE DINERO 💰) ── */}
      {showMeansOfPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#ECE9D8] border-2 border-[#0A246A] shadow-2xl rounded-sm p-3 font-[Tahoma,Arial,sans-serif] text-[11px] text-[#222]">
            <div className="flex items-center justify-between bg-[#0A246A] text-white px-2 py-1 font-bold -mx-3 -mt-3 mb-3">
              <span className="flex items-center gap-1.5">
                <span>💰</span>
                <span>Medios de Pago — SAP Business One</span>
              </span>
              <button
                type="button"
                onClick={() => setShowMeansOfPaymentModal(false)}
                className="text-white hover:text-red-300 font-black text-sm"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 bg-white p-3 border border-[#808080] rounded-xs shadow-inner">
              <div className="flex border-b border-[#a8bccf] gap-1 pb-1">
                {(['transfer', 'check', 'card', 'cash'] as const).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`px-3 py-1 font-bold text-xs rounded-xs border transition ${
                      paymentMethod === m
                        ? 'bg-[#0055a5] text-white border-[#003366]'
                        : 'bg-[#f0f4f8] text-[#334455] border-[#b0c4de] hover:bg-white'
                    }`}
                  >
                    {m === 'transfer' ? 'Transferencia' : m === 'check' ? 'Cheque' : m === 'card' ? 'Tarjeta' : 'Efectivo'}
                  </button>
                ))}
              </div>

              {paymentMethod === 'transfer' && (
                <div className="space-y-2 text-[11px]">
                  <p className="text-gray-600 font-semibold">Datos de la Transferencia Bancaria:</p>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-gray-700">Cuenta de Mayor:</label>
                    <span className="col-span-2 font-mono font-bold text-[#003366]">1.1.01.01 - Banco Matriz</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-gray-700">Fecha de Transferencia:</label>
                    <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} className="col-span-2 border p-1 rounded-xs" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-gray-700">Importe Total:</label>
                    <span className="col-span-2 font-mono text-base font-extrabold text-[#0055a5]">
                      {usd(activeTab === 'recibidos' ? totalIncomingAmount : totalOutgoingAmount)} USD
                    </span>
                  </div>
                </div>
              )}

              {paymentMethod === 'check' && (
                <div className="space-y-2 text-[11px]">
                  <p className="text-gray-600 font-semibold">Datos del Cheque:</p>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-gray-700">Banco Emisor:</label>
                    <input type="text" defaultValue="Banco Pichincha" className="col-span-2 border p-1 rounded-xs" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-gray-700">Nº de Cheque:</label>
                    <input type="text" defaultValue="004812" className="col-span-2 border p-1 rounded-xs font-mono" />
                  </div>
                </div>
              )}

              {paymentMethod === 'cash' && (
                <div className="space-y-2 text-[11px]">
                  <p className="text-gray-600 font-semibold">Cobro / Pago en Efectivo:</p>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-gray-700">Cuenta de Caja:</label>
                    <span className="col-span-2 font-mono font-bold text-[#003366]">1.1.01.03 - Caja General</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-2 text-[11px]">
                  <p className="text-gray-600 font-semibold">Datos de la Tarjeta:</p>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <label className="text-gray-700">Operadora:</label>
                    <input type="text" defaultValue="Visa / Mastercard" className="col-span-2 border p-1 rounded-xs" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-[#808080]">
              <button
                type="button"
                onClick={() => setShowMeansOfPaymentModal(false)}
                className="px-4 py-1 bg-[#0A246A] hover:bg-[#1E3A5F] text-white font-bold text-xs rounded-xs active:scale-95 cursor-pointer shadow-sm"
              >
                Fijar (OK)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
