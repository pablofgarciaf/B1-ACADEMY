'use client';

import React, { useState, useMemo } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { round, today } from '@/lib/company-calculations';
import BancaEnLinea from './BancaEnLinea';
import BankingIncomingTab from './BankingIncomingTab';
import BankingOutgoingTab from './BankingOutgoingTab';
import BankingReconciliationTab from './BankingReconciliationTab';
import BankingMeansModal from './BankingMeansModal';

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

  const handleGeneratePracticeCustomerInvoice = async () => {
    await c.save({
      action: 'sales',
      data: {
        docType: 'invoice',
        document: {
          date: today(),
          dueDate: today(),
          cardCode: selectedCustomerCode,
          reference: 'Práctica Tesorería',
          comments: 'Factura generada para práctica de Cobros y Tesorería',
          baseDocumentId: '',
          lines: [
            {
              itemCode: 'A00001',
              description: 'Laptop Profesional Dell Latitude (Práctica Tesorería)',
              quantity: 1,
              unit: 'UND',
              price: 890,
              discount: 0,
              taxRate: 15,
              warehouseCode: '01',
            }
          ]
        }
      }
    });
  };

  const handleGeneratePracticeVendorInvoice = async () => {
    await c.save({
      action: 'purchase',
      data: {
        docType: 'vendor_invoice',
        document: {
          date: today(),
          dueDate: today(),
          cardCode: selectedVendorCode,
          reference: 'Práctica Pago Proveedores',
          comments: 'Factura recibida de proveedor para práctica de Pagos Efectuados',
          baseDocumentId: '',
          lines: [
            {
              itemCode: 'A00001',
              description: 'Laptop Dell Latitude 3420 (Práctica Pago Proveedor)',
              quantity: 2,
              unit: 'UND',
              price: 600,
              discount: 0,
              taxRate: 15,
              warehouseCode: '01',
            }
          ]
        }
      }
    });
  };

  // Reconciliation data
  const reconcileRows = c.data.bankTransactions.filter(
    t => !selectedBankForReconcile || t.bankAccountId === selectedBankForReconcile
  );

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
        {activeTab === 'recibidos' && (
          <BankingIncomingTab
            customers={customers}
            selectedCustomerCode={selectedCustomerCode}
            setSelectedCustomerCode={setSelectedCustomerCode}
            currentCustomer={currentCustomer}
            reference={reference}
            setReference={setReference}
            paymentDate={paymentDate}
            setPaymentDate={setPaymentDate}
            selectedBankAccountId={selectedBankAccountId}
            setSelectedBankAccountId={setSelectedBankAccountId}
            bankAccounts={c.data.bankAccounts}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            onOpenMeansModal={() => setShowMeansOfPaymentModal(true)}
            openCustomerInvoices={openCustomerInvoices}
            selectedInvoices={selectedInvoices}
            onToggleInvoice={handleToggleInvoice}
            onInvoiceAmountChange={handleInvoiceAmountChange}
            totalIncomingAmount={totalIncomingAmount}
            onSave={handleSaveIncoming}
            onGeneratePracticeInvoice={handleGeneratePracticeCustomerInvoice}
            saving={c.saving}
            statusMsg={statusMsg}
            onResetInvoices={() => setSelectedInvoices({})}
          />
        )}

        {activeTab === 'efectuados' && (
          <BankingOutgoingTab
            vendors={vendors}
            selectedVendorCode={selectedVendorCode}
            setSelectedVendorCode={setSelectedVendorCode}
            currentVendor={currentVendor}
            reference={reference}
            setReference={setReference}
            paymentDate={paymentDate}
            setPaymentDate={setPaymentDate}
            selectedBankAccountId={selectedBankAccountId}
            setSelectedBankAccountId={setSelectedBankAccountId}
            bankAccounts={c.data.bankAccounts}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            onOpenMeansModal={() => setShowMeansOfPaymentModal(true)}
            openVendorInvoices={openVendorInvoices}
            selectedInvoices={selectedInvoices}
            onToggleInvoice={handleToggleInvoice}
            onInvoiceAmountChange={handleInvoiceAmountChange}
            totalOutgoingAmount={totalOutgoingAmount}
            onSave={handleSaveOutgoing}
            onGeneratePracticeInvoice={handleGeneratePracticeVendorInvoice}
            saving={c.saving}
            statusMsg={statusMsg}
            onResetInvoices={() => setSelectedInvoices({})}
          />
        )}

        {activeTab === 'conciliacion' && (
          <BankingReconciliationTab
            bankAccounts={c.data.bankAccounts}
            selectedBankForReconcile={selectedBankForReconcile}
            setSelectedBankForReconcile={setSelectedBankForReconcile}
            reconcileRows={reconcileRows}
            statement={statement}
            setStatement={setStatement}
            onReconcile={async (id, statementAmount, reconciled) => {
              try {
                await c.save({
                  action: 'reconcile',
                  data: { id, statementAmount, reconciled },
                });
              } catch {}
            }}
          />
        )}

        {activeTab === 'banco_linea' && (
          <div className="bg-white border border-[#a6b8cc] rounded-xs p-3 shadow-xs">
            <BancaEnLinea />
          </div>
        )}
      </div>

      {/* ── MODAL OFICIAL: MEDIOS DE PAGO (SAQUITO DE DINERO 💰) ── */}
      {showMeansOfPaymentModal && (
        <BankingMeansModal
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          paymentDate={paymentDate}
          setPaymentDate={setPaymentDate}
          amount={activeTab === 'recibidos' ? totalIncomingAmount : totalOutgoingAmount}
          onClose={() => setShowMeansOfPaymentModal(false)}
        />
      )}
    </div>
  );
}
