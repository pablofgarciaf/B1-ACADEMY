'use client';
import { useMemo, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { today, usd } from '@/lib/company-calculations';
import { antiguedadSaldos, TRAMOS } from '@/lib/company-analytics';
import { Screen, Field, Table, inputClass, buttonClass } from './SAPControls';
import { Lectura, ParaPensar } from './AnalysisBlocks';

/** Antigüedad de saldos de clientes y proveedores por tramos de vencimiento. */
export default function AgingScreen() {
  const c = useCompany();
  const [tipo, setTipo] = useState<'cobrar' | 'pagar'>('cobrar');
  const [corte, setCorte] = useState(today());
  const a = useMemo(() => antiguedadSaldos(c.data, corte, tipo), [c.data, corte, tipo]);
  return (
    <Screen title="Antigüedad de saldos">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} aria-pressed={tipo === 'cobrar'} onClick={() => setTipo('cobrar')}>Cuentas por cobrar (clientes)</button>
        <button type="button" className={buttonClass} aria-pressed={tipo === 'pagar'} onClick={() => setTipo('pagar')}>Cuentas por pagar (proveedores)</button>
      </div>
      <div className="max-w-xs"><Field label="Fecha de corte"><input type="date" className={inputClass} value={corte} onChange={e => setCorte(e.target.value)} /></Field></div>
      <p className="border-l-4 border-[#0055A5] bg-white p-2">
        {tipo === 'cobrar'
          ? 'Cada columna agrupa lo que los clientes deben según cuántos días lleva vencido. Mientras más a la derecha, menos probable es cobrarlo.'
          : 'Lo que la empresa debe a sus proveedores según su atraso. Pagar tarde a un proveedor clave puede detener tus ventas.'}
      </p>
      <Table headers={[tipo === 'cobrar' ? 'Cliente' : 'Proveedor', ...TRAMOS, 'Total']}
        rows={[
          ...a.filas.map(f => [`${f.cardCode} · ${f.nombre}`, ...f.tramos.map(v => (v ? usd(v) : '—')), usd(f.total)]),
          ...(a.filas.length ? [[<strong key="t">TOTAL</strong>, ...a.totales.map((v, i) => <strong key={i}>{usd(v)}</strong>), <strong key="g">{usd(a.total)}</strong>]] : []),
        ]} />
      {a.total > 0 && <p><strong>Vencido:</strong> {a.vencidoPct} % del saldo.</p>}
      <Lectura titulo="Alertas" frases={a.alertas} />
      <ParaPensar preguntas={a.preguntas} clave={`b1_aging_${c.data.profile?.uid ?? 'anon'}_${tipo}_${corte}`} />
    </Screen>
  );
}
