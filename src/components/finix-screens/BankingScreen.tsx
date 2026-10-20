'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { round, today, usd } from '@/lib/company-calculations';
import type { CommandData } from '@/lib/company-commands';
import { Screen, Table, Field, inputClass, buttonClass, Navigation, SaveButton, NumberInput } from './FinixControls';
import BancaEnLinea from './BancaEnLinea';
export default function BankingScreen() {
  const c = useCompany(); const blank = (): CommandData<'bank'> => ({ bankAccountId: c.data.bankAccounts[0]?.id ?? '', date: today(), type: 'deposit', amount: 0, paymentMethod: 'transfer', counterpartAccount: '3.01', reference: '', documentId: '' });
  const blankWorkflow = (): CommandData<'bankWorkflow'> => ({workflowType:'statement',bankName:'Banco Pichincha',accountName:'Cta Corriente 210001',active:true,date:today(),reference:'',currency:'USD',openingBalance:0,closingBalance:0,amount:0,paymentMethod:'Transferencia',executionName:'',paymentClass:'Pago',documentNumber:'',partnerCode:'',accountType:'Proveedor',sourceAccount:'',destinationAccount:'',fileFormat:'CSV separado por coma',fileName:'',valueDate:today(),journalNumber:'',journalDate:today(),statementNumber:'',statementDate:today(),selected:false,reserveTransactions:false,preventReconciliation:false,routeCode:'',routeName:'',series:''});
  const [data, setData] = useState(blank); const [index, setIndex] = useState(-1); const [bank, setBank] = useState(''); const [statement, setStatement] = useState<Record<string, number>>({});
  const [workflow,setWorkflow]=useState(blankWorkflow);
  const rows = c.data.bankTransactions.filter(t => !bank || t.bankAccountId === bank); const reset = () => { setData(blank()); setIndex(-1); };
  const invoices = [...c.data.salesOrders, ...c.data.purchaseOrders].filter(d => (data.type === 'deposit' ? d.docType === 'invoice' : ['vendor_invoice', 'debit_note', 'credit_note'].includes(d.docType)) && d.status === 'open');
  const sign = (type: string, value: number) => type === 'deposit' ? value : -value;
  return <Screen title="Bancos · Cobros, pagos y conciliación">
    {!c.data.bankAccounts.length && <p>Registra las cuentas del propietario en Administración → Inicialización antes de operar bancos.</p>}
    <Table headers={[c.data.profile?.usage==='private'?'Cuenta privada':'Cuenta ficticia', 'Banco', 'Número', 'Saldo']} rows={c.data.bankAccounts.map(a => [a.name, a.bankName, a.accountNumber, usd(a.balance)])} />
    <Navigation count={rows.length} index={index} onNew={reset} onSelect={i => {
      setIndex(i);
      const r = rows[i];
      if (r) {
        setData({
          bankAccountId: r.bankAccountId ?? 'BAN-1',
          date: r.date ?? today(),
          type: (r.type as 'deposit' | 'payment') ?? 'deposit',
          amount: r.amount ?? 0,
          paymentMethod: r.paymentMethod ?? 'transfer',
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
        <Field label="Medio de pago"><select className={inputClass} value={data.paymentMethod} onChange={e=>setData(d=>({...d,paymentMethod:e.target.value as 'transfer'|'card'|'cash'|'check'}))}><option value="transfer">Transferencia</option><option value="card">Tarjeta de crédito</option><option value="cash">Efectivo</option><option value="check">Cheque</option></select></Field>
        <Field label="Fecha" required>
          <input type="date" required className={inputClass} value={data.date ?? today()} onChange={e => setData(d => ({ ...d, date: e.target.value }))} />
        </Field>
        <Field label="Importe" required>
          <NumberInput ariaLabel="Importe" required min={0.01} value={data.amount ?? 0} onChange={val => setData(d => ({ ...d, amount: val }))} />
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
            <Field label="Descuento %"><NumberInput ariaLabel="Descuento" min={0} max={100} value={data.discountPercent ?? 0} onChange={val => setData(d => ({...d,discountPercent:val,amount:Math.max(0.01,round(saldo - (saldo*val/100) - (d.retentionIR??0) - (d.retentionIVA??0)))}))} /></Field>
            <Field label="Retención de renta que te hizo el cliente (USD)"><NumberInput ariaLabel="Retención de renta" min={0} value={data.retentionIR ?? 0} onChange={val => reajusta(val, data.retentionIVA ?? 0)} /></Field>
            <Field label="Retención de IVA que te hizo el cliente (USD)"><NumberInput ariaLabel="Retención de IVA" min={0} value={data.retentionIVA ?? 0} onChange={val => reajusta(data.retentionIR ?? 0, val)} /></Field>
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
        <NumberInput key="statement" ariaLabel={'Importe banco ' + t.transactionId} disabled={c.saving} value={value ?? 0} onChange={val => setStatement(s => ({ ...s, [t.id]: val }))} />,
        usd(book - value),
        <button key="reconcile" className={buttonClass} disabled={c.saving || (!t.reconciled && Math.abs(book - value) > 0.001)} onClick={async () => { try { await c.save({ action: 'reconcile', data: { id: t.id, statementAmount: value, reconciled: !t.reconciled } }); } catch { /* Provider error. */ } }}>{t.reconciled ? 'Desmarcar conciliada' : 'Conciliar'}</button>
      ];
    })} />
    <p>Diferencia total libro / banco: {usd(rows.reduce((s, t) => s + sign(t.type, t.amount) - (statement[t.id] ?? t.statementAmount ?? 0), 0))}</p>
    <details className="mt-5 border border-[#999] bg-white p-3">
      <summary className="cursor-pointer font-semibold">Procesos bancarios: extracto, conciliación y lotes</summary>
      <p className="mt-2 text-[#555]">Guarda el extracto, la conciliación o la ejecución de pagos como evidencia del proceso. No altera saldos: los cobros y pagos se registran arriba.</p>
      <form className="mt-3 grid gap-2 sm:grid-cols-3" onSubmit={async e=>{e.preventDefault(); await c.save({action:'bankWorkflow',data:workflow});setWorkflow(blankWorkflow());}}>
        <Field label="Proceso"><select className={inputClass} value={workflow.workflowType} onChange={e=>setWorkflow(w=>({...w,workflowType:e.target.value as CommandData<'bankWorkflow'>['workflowType']}))}><option value="statement">Extracto bancario</option><option value="reconciliation">Conciliación</option><option value="payment_run">Lote de pagos</option><option value="payment_method">Vía de pago</option><option value="card_deposit">Depósito de tarjetas</option></select></Field>
        {([['Banco','bankName'],['Cuenta','accountName'],['Referencia','reference'],['N.º documento','documentNumber'],['Socio','partnerCode'],['N.º extracto','statementNumber'],['N.º partida','journalNumber'],['Nombre ejecución','executionName'],['Formato','fileFormat'],['Archivo','fileName'],['Vía de pago','routeCode'],['Serie','series']] as const).map(([label,key])=><Field key={key} label={label}><input className={inputClass} value={workflow[key]} onChange={e=>setWorkflow(w=>({...w,[key]:e.target.value}))}/></Field>)}
        {([['Fecha','date'],['Fecha extracto','statementDate'],['Fecha partida','journalDate'],['Fecha valor','valueDate']] as const).map(([label,key])=><Field key={key} label={label}><input type="date" className={inputClass} value={workflow[key]} onChange={e=>setWorkflow(w=>({...w,[key]:e.target.value}))}/></Field>)}
        {([['Saldo inicial','openingBalance'],['Saldo final','closingBalance'],['Importe','amount']] as const).map(([label,key])=><Field key={key} label={label}><NumberInput ariaLabel={label} value={workflow[key]} onChange={v=>setWorkflow(w=>({...w,[key]:v}))}/></Field>)}
        <Field label="Moneda"><input className={inputClass} value={workflow.currency} onChange={e=>setWorkflow(w=>({...w,currency:e.target.value}))}/></Field>
        <SaveButton />
      </form>
    </details>
    {c.data.profile?.usage!=='private' && <BancaEnLinea />}
  </Screen>;
}
