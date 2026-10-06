'use client';
import { useMemo, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { today, usd } from '@/lib/company-calculations';
import { flujoCaja, type Actividad } from '@/lib/company-analytics';
import { Screen, Field, Table, inputClass } from './SAPControls';
import { Lectura, ParaPensar } from './AnalysisBlocks';

const ACTIVIDADES: Actividad[] = ['Operación', 'Inversión', 'Financiamiento'];

/** Flujo de caja (método directo): de dónde vino y a dónde fue el dinero. */
export default function CashFlowScreen() {
  const c = useCompany();
  const [desde, setDesde] = useState(today().slice(0, 4) + '-01-01');
  const [hasta, setHasta] = useState(today());
  const f = useMemo(() => flujoCaja(c.data, desde, hasta), [c.data, desde, hasta]);
  return (
    <Screen title="Flujo de caja">
      <p className="border-l-4 border-[#0055A5] bg-white p-2">
        La utilidad dice si el negocio gana; el flujo de caja dice si tiene <strong>dinero para pagar</strong>. Muchas empresas rentables quiebran por falta de caja.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="Desde"><input type="date" className={inputClass} value={desde} onChange={e => setDesde(e.target.value)} /></Field>
        <Field label="Hasta"><input type="date" className={inputClass} value={hasta} onChange={e => setHasta(e.target.value)} /></Field>
      </div>
      <Table headers={['Concepto', 'USD']} rows={[
        ['Saldo inicial de caja y bancos', usd(f.saldoInicial)],
        ['(+) Entradas de dinero', usd(f.entradas)],
        ['(−) Salidas de dinero', usd(f.salidas)],
        [<strong key="s">Saldo final</strong>, <strong key="v">{usd(f.saldoFinal)}</strong>],
      ]} />
      <h3 className="font-bold text-[#003366]">Por actividad</h3>
      <Table headers={['Actividad', 'Concepto', 'Neto USD']} rows={ACTIVIDADES.flatMap(act => {
        const lista = f.categorias.filter(x => x.actividad === act);
        return [
          ...lista.map(x => [act, x.categoria, usd(x.monto)]),
          [<strong key={act}>{act}</strong>, <strong key={`${act}-t`}>Flujo neto de {act.toLowerCase()}</strong>, <strong key={`${act}-v`}>{usd(f.porActividad[act])}</strong>],
        ];
      })} />
      <Lectura frases={f.lectura} />
      <ParaPensar preguntas={f.preguntas} clave={`b1_flujo_${c.data.profile?.uid ?? 'anon'}_${desde}_${hasta}`} />
    </Screen>
  );
}
