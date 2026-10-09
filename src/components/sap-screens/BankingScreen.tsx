'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { round, today, usd } from '@/lib/company-calculations';
import type { CommandData } from '@/lib/company-commands';
import { Screen, Table, Field, inputClass, buttonClass, Navigation, SaveButton } from './SAPControls';
import BancaEnLinea from './BancaEnLinea';
export default function BankingScreen() {
  const c = useCompany(); const blank = (): CommandData<'bank'> => ({ bankAccountId: 'BAN-1', date: today(), type: 'deposit', amount: 0, counterpartAccount: '3.01', reference: '', documentId: '' });
  const [data, setData] = useState(blank); const [index, setIndex] = useState(-1); const [bank, setBank] = useState(''); const [statement, setStatement] = useState<Record<string, number>>({});
  const rows = c.data.bankTransactions.filter(t => !bank || t.bankAccountId === bank); const reset = () => { setData(blank()); setIndex(-1); };
  const invoices = [...c.data.salesOrders, ...c.data.purchaseOrders].filter(d => (data.type === 'deposit' ? d.docType === 'invoice' : ['vendor_invoice', 'debit_note', 'credit_note'].includes(d.docType)) && d.status === 'open');
  const sign = (type: string, value: number) => type === 'deposit' ? value : -value;
  return <Screen title="Bancos · Cobros, pagos y conciliación">
    <Table headers={['Cuenta ficticia', 'Banco', 'Número', 'Saldo']} rows={c.data.bankAccounts.map(a => [a.name, a.bankName, a.accountNumber, usd(a.balance)])} />
    <Navigation count={rows.length} index={index} onNew={reset} onSelect={i => {
      setIndex(i);
      const r = rows[i];
      if (r) {
        setData({
          bankAccountId: r.bankAccountId ?? 'BAN-1',
          date: r.date ?? today(),
          type: (r.type as 'deposit' | 'payment') ?? 'deposit',
          amount: r.amount ?? 0,
          counterpartAccount: r.counterpartAccount ?? '3.01',
          reference: r.reference ?? '',
          documentId: r.documentId ?? ''
        });
      }
    }} />
    <form className="space-y-3" onSubmit={async e => { e.preventDefault(); try { await c.save({ action: 'bank', data }); reset(); } catch { /* Provider error. */ } }}>
      <fieldset disabled={c.saving || index >= 0} className="grid gap-2 sm:grid-cols-3">
        <Field label="Cuenta bancaria" required>
          <select className={inputClass} value={data.bankAccountId ?? ''} onChange={e => setData(d => ({ ...d, bankAccountId: e.target.value }))}>
            {c.data.bankAccounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </Field>
        <Field label="Tipo">
          <select className={inputClass} value={data.type ?? 'deposit'} onChange={e => setData(d => ({ ...d, type: e.target.value as 'deposit' | 'payment', documentId: '' }))}>
            <option value="deposit">Depósito / cobro</option>
            <option value="payment">Pago</option>
          </select>
        </Field>
        <Field label="Fecha" required>
          <input type="date" required className={inputClass} value={data.date ?? today()} onChange={e => setData(d => ({ ...d, date: e.target.value }))} />
        </Field>
        <Field label="Importe" required>
          <input type="number" min="0.01" step="0.01" required className={inputClass} value={data.amount ?? 0} onChange={e => setData(d => ({ ...d, amount: Number(e.target.value) }))} />
        </Field>
        <Field label="Documento a liquidar / devolución NC">
          <select className={inputClass} value={data.documentId ?? ''} onChange={e => { const doc = invoices.find(d => d.id === e.target.value); setData(d => ({ ...d, documentId: e.target.value, amount: doc ? doc.total - doc.paidAmount : d.amount })); }}>
            <option value="">Sin factura</option>
            {invoices.map(d => <option key={d.id} value={d.id}>{d.docNumber} · {d.cardName}</option>)}
          </select>
        </Field>
        <Field label="Contrapartida sin factura">
          <select className={inputClass} disabled={Boolean(data.documentId)} value={data.counterpartAccount ?? '3.01'} onChange={e => setData(d => ({ ...d, counterpartAccount: e.target.value }))}>
            {c.data.chartOfAccounts.filter(a => a.postable && a.code !== '1.1.02').map(a => <option key={a.id} value={a.code}>{a.code} · {a.name}</option>)}
          </select>
        </Field>
        <Field label="Referencia">
          <input className={inputClass} value={data.reference ?? ''} onChange={e => setData(d => ({ ...d, reference: e.target.value }))} />
        </Field>
        {data.type === 'deposit' && data.documentId && (() => {
          const doc = invoices.find(x => x.id === data.documentId);
          const saldo = doc ? round(doc.total - doc.paidAmount) : 0;
          const reajusta = (ir: number, iva: number) => setData(d => ({ ...d, retentionIR: ir, retentionIVA: iva, amount: Math.max(0.01, round(saldo - ir - iva)) }));
          return <>
            <Field label="Retención de renta que te hizo el cliente (USD)"><input type="number" min="0" step="0.01" className={inputClass} value={data.retentionIR ?? 0} onChange={e => reajusta(Number(e.target.value), data.retentionIVA ?? 0)} /></Field>
            <Field label="Retención de IVA que te hizo el cliente (USD)"><input type="number" min="0" step="0.01" className={inputClass} value={data.retentionIVA ?? 0} onChange={e => reajusta(data.retentionIR ?? 0, Number(e.target.value))} /></Field>
            <p className="sm:col-span-3 text-[#555]">Si el cliente es agente de retención, te entrega un comprobante de retención y paga solo la diferencia. El importe se ajusta solo; las retenciones quedan como crédito tributario (cuentas 1.1.10 y 1.1.11).</p>
          </>;
        })()}
      </fieldset>
      <SaveButton disabled={index >= 0} />
    </form>
    <Field label="Estado de cuenta / Conciliación">
      <select className={inputClass} value={bank ?? ''} onChange={e => { setBank(e.target.value); reset(); }}>
        <option value="">Todas las cuentas</option>
        {c.data.bankAccounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
      </select>
    </Field>
    <Table headers={['Fecha', 'Referencia', 'Libro', 'Banco (+/−)', 'Diferencia', 'Conciliación']} rows={rows.map(t => {
      const book = sign(t.type, t.amount);
      const value = statement[t.id] ?? t.statementAmount ?? 0;
      return [
        t.date,
        t.reference || t.transactionId,
        usd(book),
        <input key="statement" aria-label={'Importe banco ' + t.transactionId} className={inputClass} type="number" step="0.01" value={value ?? 0} disabled={c.saving} onChange={e => setStatement(s => ({ ...s, [t.id]: Number(e.target.value) }))} />,
        usd(book - value),
        <button key="reconcile" className={buttonClass} disabled={c.saving || (!t.reconciled && Math.abs(book - value) > 0.001)} onClick={async () => { try { await c.save({ action: 'reconcile', data: { id: t.id, statementAmount: value, reconciled: !t.reconciled } }); } catch { /* Provider error. */ } }}>{t.reconciled ? 'Desmarcar conciliada' : 'Conciliar'}</button>
      ];
    })} />
    <p>Diferencia total libro / banco: {usd(rows.reduce((s, t) => s + sign(t.type, t.amount) - (statement[t.id] ?? t.statementAmount ?? 0), 0))}</p>
    <BancaEnLinea />
  </Screen>;
}
