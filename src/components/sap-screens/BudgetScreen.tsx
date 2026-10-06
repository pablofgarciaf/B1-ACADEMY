'use client';
import { useEffect, useMemo, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { round, today, usd } from '@/lib/company-calculations';
import { presupuestoVsReal } from '@/lib/company-analytics';
import { Screen, Field, Table, inputClass, buttonClass, SaveButton } from './SAPControls';
import { Lectura, ParaPensar } from './AnalysisBlocks';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const TIPO: Record<string, string> = { income: 'Ingreso', cost: 'Costo', expense: 'Gasto' };

/** Presupuestos (FIN007): fijar metas mensuales por cuenta y compararlas con lo real. */
export default function BudgetScreen() {
  const c = useCompany();
  const [year, setYear] = useState(today().slice(0, 4));
  const [hastaMes, setHastaMes] = useState(Number(today().slice(5, 7)));
  const cuentas = useMemo(() => c.data.chartOfAccounts.filter(a => a.postable && ['income', 'cost', 'expense'].includes(a.category)), [c.data.chartOfAccounts]);
  const [cuenta, setCuenta] = useState('');
  const [meses, setMeses] = useState<number[]>(() => Array(12).fill(0));
  const [anual, setAnual] = useState(0);

  useEffect(() => { if (!cuenta && cuentas[0]) setCuenta(cuentas[0].code); }, [cuenta, cuentas]);
  // Al elegir cuenta/año se carga el presupuesto ya guardado (si existe).
  useEffect(() => {
    const b = c.data.budgets.find(x => x.year === year && x.accountCode === cuenta);
    setMeses(b ? [...b.months] : Array(12).fill(0));
  }, [c.data.budgets, year, cuenta]);

  const r = useMemo(() => presupuestoVsReal(c.data, year, hastaMes), [c.data, year, hastaMes]);
  const repartir = () => { const base = round(anual / 12); setMeses(Array.from({ length: 12 }, (_, i) => (i === 11 ? round(anual - base * 11) : base))); };

  return (
    <Screen title="Presupuestos">
      <p className="border-l-4 border-[#0055A5] bg-white p-2">
        Un gerente no solo mira lo que pasó: <strong>se pone metas y mide la desviación</strong>. Presupuesta tus ventas, costos y gastos
        mes a mes y compara contra lo real. En ingresos, superar el presupuesto es bueno; en costos y gastos, es una alerta.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="Año"><input type="number" min={2020} max={2099} className={inputClass} value={year} onChange={e => setYear(e.target.value)} /></Field>
        <Field label="Comparar acumulado hasta">
          <select className={inputClass} value={hastaMes} onChange={e => setHastaMes(Number(e.target.value))}>{MESES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}</select>
        </Field>
      </div>

      <form className="space-y-2 border border-[#999] bg-white p-2" onSubmit={async e => { e.preventDefault(); try { await c.save({ action: 'budget', data: { year, accountCode: cuenta, months: meses } }); } catch { /* el proveedor muestra el error */ } }}>
        <h3 className="font-bold text-[#003366]">Definir presupuesto de una cuenta</h3>
        <div className="grid gap-2 sm:grid-cols-[2fr_1fr_auto] sm:items-end">
          <Field label="Cuenta" required>
            <select className={inputClass} value={cuenta} onChange={e => setCuenta(e.target.value)}>{cuentas.map(a => <option key={a.code} value={a.code}>{a.code} · {a.name} ({TIPO[a.category]})</option>)}</select>
          </Field>
          <Field label="Monto anual (opcional)"><input type="number" min={0} step="any" className={inputClass} value={anual} onChange={e => setAnual(Number(e.target.value))} /></Field>
          <button type="button" className={buttonClass} onClick={repartir}>Repartir en 12 meses</button>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-12">
          {MESES.map((m, i) => (
            <Field key={m} label={m}>
              <input type="number" min={0} step="any" className={inputClass} value={meses[i]}
                onChange={e => setMeses(v => v.map((x, j) => (j === i ? Number(e.target.value) : x)))} />
            </Field>
          ))}
        </div>
        <p>Total anual: <strong>{usd(meses.reduce((s, v) => s + v, 0))}</strong></p>
        <SaveButton label="Guardar presupuesto" disabled={!cuenta} />
      </form>

      <h3 className="font-bold text-[#003366]">Presupuesto vs. real · enero a {MESES[hastaMes - 1]} {year}</h3>
      <Table headers={['Cuenta', 'Tipo', 'Presupuesto', 'Real', 'Desviación', 'Cumplimiento']}
        rows={r.filas.map(f => [
          `${f.accountCode} · ${f.nombre}`, TIPO[f.tipo], usd(f.presupuestoAcum), usd(f.realAcum),
          <span key="d" className={`font-bold ${f.favorable ? 'text-[#2e7d32]' : 'text-[#c62828]'}`}>{f.desviacion > 0 ? '+' : ''}{usd(f.desviacion)}</span>,
          f.cumplimientoPct === null ? '—' : `${f.cumplimientoPct.toLocaleString('es-EC', { maximumFractionDigits: 1 })} %`,
        ])} />
      {r.filas.length > 0 && <p>Utilidad presupuestada: <strong>{usd(r.utilidadPresupuestada)}</strong> · Utilidad real: <strong>{usd(r.utilidadReal)}</strong></p>}
      <Lectura frases={r.lectura} />
      <ParaPensar preguntas={r.preguntas} clave={`b1_presupuesto_${c.data.profile?.uid ?? 'anon'}_${year}_${hastaMes}`} />
    </Screen>
  );
}
