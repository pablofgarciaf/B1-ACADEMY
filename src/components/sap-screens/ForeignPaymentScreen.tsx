'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { round, today, usd } from '@/lib/company-calculations';
import type { CommandData } from '@/lib/company-commands';
import { ISD_TARIFAS } from '@/lib/sri-catalogo';
import { Screen, Field, Table, inputClass, buttonClass } from './SAPControls';

/** Pagos al exterior: calcula el Impuesto a la Salida de Divisas (ISD) y lo contabiliza como gasto o crédito tributario. */
export default function ForeignPaymentScreen() {
  const c = useCompany();
  const blank = (): CommandData<'foreignPayment'> => ({ date: today(), bankAccountId: c.data.bankAccounts[0]?.id ?? 'BAN-1', concept: '', destination: 'servicio', vendorCode: '', amount: 0, tarifa: '5', imputacion: 'gasto', reference: '' });
  const [d, setD] = useState(blank);
  const tarifa = ISD_TARIFAS.find(t => t.id === d.tarifa) ?? ISD_TARIFAS[0];
  const isd = round(d.amount * tarifa.rate / 100);
  const banco = c.data.bankAccounts.find(b => b.id === d.bankAccountId);
  const importacion = d.destination === 'importacion';
  const historial = c.data.taxRuns.filter(r => r.kind === 'isd');

  return (
    <Screen title="Pagos al exterior · Impuesto a la Salida de Divisas (ISD)">
      <p>El ISD se paga sobre el valor que sale del país. Tarifa general 5 %; en 2026 hay tarifas diferenciadas para beneficiarios (2,5 % sector productivo, 0 % sector farmacéutico). Es <strong>crédito tributario</strong> solo si el pago es por importación de materias primas, insumos o bienes de capital; en los demás pagos es <strong>gasto</strong>.</p>
      <form className="space-y-3" onSubmit={async e => { e.preventDefault(); try { await c.save({ action: 'foreignPayment', data: d }); setD(blank()); } catch { /* error visible */ } }}>
        <div className="grid gap-2 sm:grid-cols-3">
          <Field label="Fecha" required><input type="date" required className={inputClass} value={d.date} onChange={e => setD(v => ({ ...v, date: e.target.value }))} /></Field>
          <Field label="Cuenta bancaria" required><select className={inputClass} value={d.bankAccountId} onChange={e => setD(v => ({ ...v, bankAccountId: e.target.value }))}>{c.data.bankAccounts.map(b => <option key={b.id} value={b.id}>{b.name} · {usd(b.balance)}</option>)}</select></Field>
          <Field label="Concepto" required><input required minLength={2} className={inputClass} value={d.concept} onChange={e => setD(v => ({ ...v, concept: e.target.value }))} placeholder="Licencia de software, importación…" /></Field>
          <Field label="Destino del pago"><select className={inputClass} value={d.destination} onChange={e => { const destination = e.target.value as 'importacion' | 'servicio'; setD(v => ({ ...v, destination, imputacion: destination === 'importacion' ? v.imputacion : 'gasto' })); }}><option value="servicio">Servicio o gasto en el exterior</option><option value="importacion">Importación de materia prima, insumos o bienes de capital</option></select></Field>
          <Field label="Proveedor (si cancela una deuda)"><select className={inputClass} value={d.vendorCode} onChange={e => setD(v => ({ ...v, vendorCode: e.target.value }))}><option value="">Sin proveedor (gasto directo)</option>{c.data.vendors.map(v => <option key={v.id} value={v.cardCode}>{v.name} · saldo {usd(v.balance)}</option>)}</select></Field>
          <Field label="Monto a pagar al exterior USD" required><input type="number" min="0.01" step="0.01" required className={inputClass} value={d.amount} onChange={e => setD(v => ({ ...v, amount: Number(e.target.value) }))} /></Field>
          <Field label="Tarifa de ISD"><select className={inputClass} value={d.tarifa} onChange={e => setD(v => ({ ...v, tarifa: e.target.value as '5' | '2.5' | '0' }))}>{ISD_TARIFAS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}</select></Field>
          <Field label="El ISD se contabiliza como"><select className={inputClass} value={d.imputacion} disabled={!importacion} onChange={e => setD(v => ({ ...v, imputacion: e.target.value as 'gasto' | 'credito' }))}><option value="gasto">Gasto (6.08)</option><option value="credito">Crédito tributario (1.1.12)</option></select></Field>
          <Field label="Referencia"><input className={inputClass} value={d.reference} onChange={e => setD(v => ({ ...v, reference: e.target.value }))} /></Field>
        </div>
        <p role="status" className="border border-amber-500 bg-amber-50 p-2">Pago {usd(d.amount)} + ISD {tarifa.rate} % = {usd(isd)} → <strong>salen {usd(round(d.amount + isd))} del banco</strong>{banco && round(d.amount + isd) > banco.balance ? ' (saldo insuficiente)' : ''}.</p>
        <button type="submit" className={`${buttonClass} font-bold`} disabled={c.saving || d.amount <= 0}>Registrar pago al exterior</button>
      </form>
      {historial.length > 0 && <Table headers={['Fecha', 'Concepto', 'Pago', 'Tarifa', 'ISD', 'Total']} rows={historial.map(r => [r.date, r.title.replace('ISD · ', ''), usd(r.figures.pago), `${r.figures.tarifa} %`, usd(r.figures.isd), usd(r.figures.total)])} />}
    </Screen>
  );
}
