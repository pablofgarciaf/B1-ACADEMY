'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { resultadoEjercicio, usd } from '@/lib/company-calculations';
import type { TaxRun } from '@/lib/firestore-types';
import { Screen, Field, Table, inputClass, buttonClass } from './SAPControls';

const TITULOS: Record<TaxRun['kind'], string> = { utilidades: 'Utilidades de los trabajadores', renta: 'Impuesto a la renta', anticipo: 'Anticipo del impuesto a la renta', isd: 'ISD' };

/**
 * Cierre tributario del ejercicio: (1) participación de los trabajadores en las utilidades, (2) impuesto a la renta de la empresa
 * y (3) anticipo del año siguiente. El orden importa: la participación es deducible, y el anticipo parte del impuesto causado.
 */
export default function TaxCloseScreen() {
  const c = useCompany();
  const [year, setYear] = useState(Number(new Date().toLocaleDateString('en-CA', { timeZone: 'America/Guayaquil' }).slice(0, 4)));
  const [profit, setProfit] = useState('');
  const resultado = resultadoEjercicio(c.data, year);
  const runs = c.data.taxRuns.filter(r => r.kind !== 'isd' && r.year === year);
  const tiene = (kind: TaxRun['kind']) => runs.some(r => r.kind === kind);
  const fin = `${year}-12-31`; const ene = `${year + 1}-01-15`;
  const accion = async (command: Parameters<typeof c.save>[0]) => { try { await c.save(command); } catch { /* el error lo muestra el proveedor */ } };

  return (
    <Screen title="Cierre tributario del ejercicio">
      <p>Orden del cierre: <strong>1) utilidades de los trabajadores → 2) impuesto a la renta → 3) anticipo</strong>. La participación del 15 % es deducible del impuesto a la renta; el anticipo se calcula sobre el impuesto causado.</p>
      <div className="grid gap-2 sm:grid-cols-3">
        <Field label="Ejercicio fiscal"><input type="number" min={2020} max={2100} className={inputClass} value={year} onChange={e => setYear(Number(e.target.value))} /></Field>
        <Field label="Utilidad líquida (vacío = tomarla del libro mayor)"><input type="number" step="0.01" className={inputClass} value={profit} onChange={e => setProfit(e.target.value)} /></Field>
        <div className="self-end"><p className="text-[#555]">Resultado del libro mayor en {year}: <strong>{usd(resultado)}</strong> (ingresos − costos − gastos, antes de participación e impuesto).</p></div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} disabled={c.saving || tiene('utilidades')} onClick={() => accion({ action: 'profitShare', data: { year, date: fin, ...(profit.trim() ? { profit: Number(profit) } : {}) } })}>1. Calcular utilidades de los trabajadores</button>
        <button type="button" className={buttonClass} disabled={c.saving || tiene('renta') || !tiene('utilidades')} onClick={() => accion({ action: 'incomeTaxClose', data: { year, date: fin } })}>2. Cerrar impuesto a la renta</button>
        <button type="button" className={buttonClass} disabled={c.saving || tiene('anticipo') || !tiene('renta')} onClick={() => accion({ action: 'incomeTaxAdvance', data: { year, date: ene } })}>3. Calcular anticipo del año siguiente</button>
      </div>
      <p className="text-[#555]">Las cuotas del anticipo (julio y septiembre) se pagan en Bancos con la contrapartida «1.1.09 Anticipo de impuesto a la renta». Las retenciones que te hicieron tus clientes se registran al cobrar la factura (cuentas 1.1.10 y 1.1.11).</p>
      {runs.length === 0 && <p>Aún no hay cierres tributarios de {year}.</p>}
      {runs.map(r => (
        <div key={r.id} className="space-y-1 border border-[#999] bg-white p-2">
          <h3 className="font-bold text-[#003366]">{TITULOS[r.kind]} {r.year}{r.journalEntryId && <span className="font-normal"> · asiento {r.journalEntryId}</span>}</h3>
          <Table headers={['Concepto', 'USD', 'Nota']} rows={r.lines.map(l => [l.label, l.value, l.note])} />
        </div>
      ))}
    </Screen>
  );
}
