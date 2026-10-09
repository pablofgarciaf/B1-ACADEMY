'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import type { JournalLine } from '@/lib/firestore-types';
import { round, today, usd } from '@/lib/company-calculations';
import { Screen, Field, Navigation, Table, SaveButton, inputClass, buttonClass } from './SAPControls';
const emptyLine = (): JournalLine => ({ accountCode: '', debit: 0, credit: 0, description: '', costCenter: '' });
export default function JournalEntryForm(_props: { screenId?: string; screenName?: string }) {
  const c = useCompany(); const [index, setIndex] = useState(-1); const [date, setDate] = useState(today()); const [memo, setMemo] = useState(''); const [reference, setReference] = useState(''); const [lines, setLines] = useState<JournalLine[]>([emptyLine(), emptyLine()]);
  const debit = round(lines.reduce((s, l) => s + l.debit, 0)); const credit = round(lines.reduce((s, l) => s + l.credit, 0));
  const entry = c.data.journalEntries[index];
  const reset = () => { setIndex(-1); setDate(today()); setMemo(''); setReference(''); setLines([emptyLine(), emptyLine()]); };
  const change = (i: number, patch: Partial<JournalLine>) => setLines(ls => ls.map((l, j) => i === j ? { ...l, ...patch } : l));
  return <Screen title="Asiento contable">
    <Navigation count={c.data.journalEntries.length} index={index} onNew={reset} onSelect={i => {
      const e = c.data.journalEntries[i];
      setIndex(i);
      setDate(e?.date ?? today());
      setMemo(e?.memo ?? '');
      setReference(e?.reference ?? '');
      setLines((e?.lines ?? []).map(l => ({
        accountCode: l.accountCode ?? '',
        debit: l.debit ?? 0,
        credit: l.credit ?? 0,
        description: l.description ?? '',
        costCenter: l.costCenter ?? ''
      })));
    }} />
    <p>{entry?.entryNumber ?? 'Numeración AS automática'} · Período {(date || today()).slice(0, 7)}</p>
    <form className="space-y-3" onSubmit={async e => { e.preventDefault(); try { await c.save({ action: 'journal', data: { date, dueDate: date, memo, reference, lines } }); reset(); } catch { /* Provider error. */ } }}>
      <fieldset disabled={c.saving || index >= 0} className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-3">
          <Field label="Fecha" required><input required type="date" className={inputClass} value={date ?? ''} onChange={e => setDate(e.target.value)} /></Field>
          <Field label="Concepto" required><input required className={inputClass} value={memo ?? ''} onChange={e => setMemo(e.target.value)} /></Field>
          <Field label="Referencia"><input className={inputClass} value={reference ?? ''} onChange={e => setReference(e.target.value)} /></Field>
        </div>
        <Table headers={['Cuenta *', 'Debe', 'Haber', 'Centro costo', 'Detalle', 'Acción']} rows={lines.map((line, i) => [
          <select key="account" aria-label={'Cuenta línea ' + (i + 1)} required className={inputClass} value={line.accountCode ?? ''} onChange={e => change(i, { accountCode: e.target.value })}><option value="">Seleccionar cuenta</option>{c.data.chartOfAccounts.filter(a => a.postable).map(a => <option key={a.id} value={a.code}>{a.code} · {a.name}</option>)}</select>,
          <input key="debit" aria-label={'Debe línea ' + (i + 1)} type="number" min="0" step="0.01" className={inputClass} value={line.debit ?? 0} onChange={e => change(i, { debit: Number(e.target.value), credit: 0 })} />,
          <input key="credit" aria-label={'Haber línea ' + (i + 1)} type="number" min="0" step="0.01" className={inputClass} value={line.credit ?? 0} onChange={e => change(i, { credit: Number(e.target.value), debit: 0 })} />,
          <input key="center" aria-label={'Centro costo línea ' + (i + 1)} className={inputClass} value={line.costCenter ?? ''} onChange={e => change(i, { costCenter: e.target.value })} />,
          <input key="description" aria-label={'Detalle línea ' + (i + 1)} className={inputClass} value={line.description ?? ''} onChange={e => change(i, { description: e.target.value })} />,
          <button key="remove" type="button" disabled={lines.length <= 2} className={buttonClass} onClick={() => setLines(ls => ls.filter((_, j) => i !== j))}>✕</button>
        ])} /><button type="button" className={buttonClass} onClick={() => setLines(ls => [...ls, emptyLine()])}>+ Línea</button>
      </fieldset>
      <p role="status" className={debit === credit && debit > 0 ? 'font-bold text-green-800' : 'font-bold text-red-800'}>Debe {usd(debit)} · Haber {usd(credit)} · Diferencia {usd(debit - credit)}</p>
      <SaveButton disabled={index >= 0 || debit !== credit || !debit} label="Contabilizar" />
      <button type="button" className={buttonClass + ' ml-2'} disabled={c.saving} onClick={reset}>Cancelar</button>
      <button type="button" className={buttonClass + ' ml-2'} disabled={c.saving || !entry || entry.source !== 'manual' || Boolean(entry.reversedBy)} onClick={async () => { if (!entry) return; try { await c.save({ action: 'reverse', data: { entryId: entry.id, date: today() } }); } catch { /* Provider error. */ } }}>Revertir</button>
    </form>
  </Screen>;
}
