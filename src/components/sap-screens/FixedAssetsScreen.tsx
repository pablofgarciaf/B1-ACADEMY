'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { round, today, usd } from '@/lib/company-calculations';
import { Screen, Field, Table, inputClass, buttonClass } from './SAPControls';
import { ParaPensar } from './AnalysisBlocks';

/** Vidas útiles máximas para depreciación deducible (Reglamento LRTI Ecuador, art. 28). */
const CATEGORIAS = [
  { nombre: 'Inmuebles (excepto terrenos)', meses: 240, tasa: '5 %' },
  { nombre: 'Instalaciones, maquinaria, equipos y muebles', meses: 120, tasa: '10 %' },
  { nombre: 'Vehículos y equipo de transporte', meses: 60, tasa: '20 %' },
  { nombre: 'Equipos de cómputo y software', meses: 36, tasa: '33 %' },
];
const PAGO = [
  { code: '2.2.01', label: 'Préstamo a largo plazo' },
  { code: '2.1.01', label: 'A crédito (cuentas por pagar)' },
  { code: '1.1.01', label: 'De contado (caja)' },
] as const;

/** Activos fijos (FIN006): alta, depreciación mensual en línea recta y valor en libros. */
export default function FixedAssetsScreen() {
  const c = useCompany();
  const [f, setF] = useState({ name: '', category: CATEGORIAS[3].nombre, acquisitionDate: today(), cost: 1000, residualValue: 0, usefulLifeMonths: 36, paymentAccount: '2.2.01' as (typeof PAGO)[number]['code'] });
  const [periodo, setPeriodo] = useState(today().slice(0, 7));
  const activos = c.data.fixedAssets;
  const totalCosto = round(activos.reduce((s, a) => s + a.cost, 0));
  const totalDep = round(activos.reduce((s, a) => s + a.accumulatedDepreciation, 0));

  return (
    <Screen title="Activos fijos">
      <p className="border-l-4 border-[#0055A5] bg-white p-2">
        Un activo fijo no es un gasto del día: su costo se reparte en su vida útil mediante la <strong>depreciación</strong>. En Ecuador el reglamento
        tributario fija vidas útiles máximas; usarlas bien afecta la utilidad y el impuesto a la renta.
      </p>
      <form className="space-y-2 border border-[#999] bg-white p-2" onSubmit={async e => { e.preventDefault(); try { await c.save({ action: 'fixedAsset', data: f }); setF(v => ({ ...v, name: '' })); } catch { /* error visible */ } }}>
        <h3 className="font-bold text-[#003366]">Registrar activo</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Descripción" required><input required minLength={2} className={inputClass} value={f.name} onChange={e => setF(v => ({ ...v, name: e.target.value }))} placeholder="Ej.: Laptop para contabilidad" /></Field>
          <Field label="Categoría (vida útil SRI)">
            <select className={inputClass} value={f.category} onChange={e => { const cat = CATEGORIAS.find(x => x.nombre === e.target.value); setF(v => ({ ...v, category: e.target.value, usefulLifeMonths: cat?.meses ?? v.usefulLifeMonths })); }}>
              {CATEGORIAS.map(x => <option key={x.nombre} value={x.nombre}>{x.nombre} · {x.meses / 12} años ({x.tasa} anual)</option>)}
            </select>
          </Field>
          <Field label="Fecha de adquisición" required><input type="date" required className={inputClass} value={f.acquisitionDate} onChange={e => setF(v => ({ ...v, acquisitionDate: e.target.value }))} /></Field>
          <Field label="Costo (USD)" required><input type="number" min={0.01} step="0.01" required className={inputClass} value={f.cost} onChange={e => setF(v => ({ ...v, cost: Number(e.target.value) }))} /></Field>
          <Field label="Valor residual (USD)"><input type="number" min={0} step="0.01" className={inputClass} value={f.residualValue} onChange={e => setF(v => ({ ...v, residualValue: Number(e.target.value) }))} /></Field>
          <Field label="Vida útil (meses)"><input type="number" min={1} max={600} className={inputClass} value={f.usefulLifeMonths} onChange={e => setF(v => ({ ...v, usefulLifeMonths: Number(e.target.value) }))} /></Field>
          <Field label="Forma de pago"><select className={inputClass} value={f.paymentAccount} onChange={e => setF(v => ({ ...v, paymentAccount: e.target.value as typeof f.paymentAccount }))}>{PAGO.map(p => <option key={p.code} value={p.code}>{p.label}</option>)}</select></Field>
        </div>
        <p className="text-[#555]">Depreciación mensual estimada: <strong>{usd(Math.max(0, (f.cost - f.residualValue) / Math.max(1, f.usefulLifeMonths)))}</strong></p>
        <button type="submit" className={`${buttonClass} font-bold`} disabled={c.saving}>Registrar activo</button>
      </form>

      <section className="flex flex-wrap items-end gap-2 border border-[#999] bg-white p-2">
        <Field label="Depreciar el período"><input type="month" className={inputClass} value={periodo} onChange={e => setPeriodo(e.target.value)} /></Field>
        <button type="button" className={buttonClass} disabled={c.saving || !activos.length} onClick={async () => { try { await c.save({ action: 'depreciate', data: { period: periodo } }); } catch { /* error visible */ } }}>Calcular y contabilizar depreciación</button>
      </section>

      <Table headers={['Código', 'Activo', 'Categoría', 'Adquisición', 'Costo', 'Dep. acumulada', 'Valor en libros', 'Avance', 'Estado']} rows={activos.map(a => {
        const depreciable = a.cost - a.residualValue;
        return [a.assetCode, a.name, a.category, a.acquisitionDate, usd(a.cost), usd(a.accumulatedDepreciation), usd(a.cost - a.accumulatedDepreciation),
          `${depreciable > 0 ? Math.round((a.accumulatedDepreciation / depreciable) * 100) : 100} %`, a.status === 'active' ? 'En uso' : 'Totalmente depreciado'];
      })} />
      {activos.length > 0 && <p><strong>Total:</strong> costo {usd(totalCosto)} · depreciación acumulada {usd(totalDep)} · valor en libros {usd(totalCosto - totalDep)}</p>}
      <ParaPensar clave={`b1_activos_${c.data.profile?.uid ?? 'anon'}`} preguntas={[
        '¿Por qué comprar una laptop de $1.200 no reduce la utilidad del mes en $1.200? ¿Dónde aparece ese dinero en los estados financieros?',
        'Si deprecias más rápido de lo que permite el SRI, ¿qué pasa con el impuesto a la renta y con la conciliación tributaria?',
        'Un activo totalmente depreciado que sigue funcionando, ¿tiene valor para la empresa? ¿Lo reemplazarías?',
      ]} />
    </Screen>
  );
}
