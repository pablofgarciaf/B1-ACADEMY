'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import type { PayrollInputLine, PayrollLine } from '@/lib/firestore-types';
import { payrollLine, today, usd } from '@/lib/company-calculations';
import { Screen, Field, Table, Navigation, SaveButton, inputClass, buttonClass } from './SAPControls';
import PayrollSlip from './PayrollSlip';
import { buildIESSPlanillaTxt } from '@/lib/ats-generator';
export default function PayrollRunScreen() {
  const c = useCompany(); const initial = (): PayrollInputLine[] => c.data.employees.filter(e => e.active && e.contract !== 'fees').map(e => ({ employeeCode: e.employeeCode, days: 30, extra50: 0, extra100: 0, commissions: 0, otherIncome: 0, advances: 0, otherDeductions: 0 }));
  const [period, setPeriod] = useState(today().slice(0, 7)); const [date, setDate] = useState(today()); const [sbu, setSbu] = useState(c.data.profile?.sbu ?? 482); const [inputs, setInputs] = useState(initial); const [index, setIndex] = useState(-1); const [slip, setSlip] = useState('');
  const run = c.data.payrollRuns[index]; let preview: PayrollLine[] = []; let error = '';
  try { preview = run ? run.lines : inputs.map(input => { const employee = c.data.employees.find(e => e.employeeCode === input.employeeCode); if (!employee) throw new Error('Empleado inexistente.'); return payrollLine(employee, input, period, sbu); }); } catch (e: unknown) { error = e instanceof Error ? e.message : 'Datos inválidos.'; }
  const reset = () => { setIndex(-1); setInputs(initial()); setSlip(''); };
  const columns: { key: Exclude<keyof PayrollInputLine, 'employeeCode'>; label: string }[] = [{ key: 'days', label: 'Días' }, { key: 'extra50', label: 'Horas 50%' }, { key: 'extra100', label: 'Horas 100%' }, { key: 'commissions', label: 'Comisiones' }, { key: 'otherIncome', label: 'Otros ingresos' }, { key: 'advances', label: 'Anticipos' }, { key: 'otherDeductions', label: 'Otros descuentos' }];
  const descargarIESS = () => {
    try {
      const txt = buildIESSPlanillaTxt(c.data, period);
      const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PLANILLA_IESS_${period.replace('-', '_')}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* Error ignorado */ }
  };
  return <Screen title="Corrida mensual de nómina"><p>Escenario Ecuador 2026: SBU $482, vigente desde el 1 de enero de 2026. Ajusta los parámetros al período del ejercicio. Los beneficios provisionados se contabilizan sin sumarse al efectivo del empleado.</p><Navigation count={c.data.payrollRuns.length} index={index} onNew={reset} onSelect={i => { const r = c.data.payrollRuns[i]; setIndex(i); setPeriod(r.period); setDate(r.date); setSbu(r.sbu); setInputs(r.lines); }} /><form className="space-y-3" onSubmit={async e => { e.preventDefault(); try { await c.save({ action: 'payroll', data: { period, date, sbu, lines: inputs } }); reset(); } catch { /* Provider error. */ } }}><fieldset disabled={c.saving || index >= 0} className="space-y-3"><div className="grid gap-2 sm:grid-cols-3"><Field label="Período" required><input required type="month" className={inputClass} value={period} onChange={e => { setPeriod(e.target.value); setDate(e.target.value + '-28'); }} /></Field><Field label="Fecha contable" required><input required type="date" className={inputClass} value={date} onChange={e => setDate(e.target.value)} /></Field><Field label="SBU del ejercicio" required><input required type="number" min="1" step="0.01" className={inputClass} value={sbu} onChange={e => setSbu(Number(e.target.value))} /></Field></div><Table headers={['Empleado', ...columns.map(col => col.label), 'Acción']} rows={inputs.map((input, i) => [input.employeeCode, ...columns.map(col => <input key={col.key} aria-label={col.label + ' ' + input.employeeCode} type="number" min="0" max={col.key === 'days' ? 30 : undefined} step="0.01" className={inputClass} value={input[col.key]} onChange={e => setInputs(ls => ls.map((l, j) => j === i ? { ...l, [col.key]: Number(e.target.value) } : l))} />), <button key="remove" type="button" className={buttonClass} onClick={() => setInputs(ls => ls.filter((_, j) => j !== i))}>Excluir</button>])} /></fieldset>{error && <p role="alert" className="text-red-800">{error}</p>}<Table headers={['Empleado', 'Ingresos', 'IESS personal', 'IR empleado', 'Descuentos', 'Neto', 'Patronal', 'Rol']} rows={preview.map(line => [line.employeeName, usd(line.income), usd(line.personalIESS), usd(line.incomeTax ?? 0), usd(line.deductions), usd(line.net), usd(line.employerIESS), <button key="slip" type="button" disabled={!run} onClick={() => setSlip(line.employeeCode)} className={buttonClass}>Ver rol</button>])} /><strong>Total neto: {usd(preview.reduce((sum, line) => sum + line.net, 0))}</strong><div className="flex gap-2 items-center"><SaveButton disabled={index >= 0 || Boolean(error) || !inputs.length} label="Contabilizar nómina" />{run && <button type="button" className={buttonClass} onClick={descargarIESS}>Descargar Planilla IESS (.txt)</button>}</div></form>{run && slip && run.lines.find(l => l.employeeCode === slip) && <PayrollSlip payroll={run} line={run.lines.find(l => l.employeeCode === slip)!} companyName={c.data.profile?.companyName ?? ''} onClose={() => setSlip('')} />}</Screen>;
}
