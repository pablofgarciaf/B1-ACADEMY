'use client';
import { useEffect, useMemo, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { today, usd } from '@/lib/company-calculations';
import { analisisGerencial, comparativoPeriodos, type Area, type FilaComparativo, type Indicador, type Semaforo } from '@/lib/company-analytics';
import { Lectura } from './AnalysisBlocks';
import { Screen, Field, Table, inputClass } from './SAPControls';

/**
 * Análisis gerencial: indicadores con semáforo + interpretación guiada.
 * Objetivo pedagógico: no solo operar SAP, sino leer los números y decidir como gerente.
 */

const COLOR: Record<Semaforo, string> = {
  verde: 'bg-[#2e7d32]', amarillo: 'bg-[#f0ab00]', rojo: 'bg-[#c62828]', 'sin-datos': 'bg-[#9e9e9e]',
};
const TEXTO: Record<Semaforo, string> = { verde: 'Sano', amarillo: 'Vigilar', rojo: 'Alerta', 'sin-datos': 'Sin datos' };
const AREAS: Area[] = ['Liquidez', 'Solvencia', 'Rentabilidad', 'Eficiencia', 'Riesgo comercial'];

function formatear(i: Indicador) {
  if (i.valor === null) return '—';
  if (i.formato === 'porcentaje') return `${i.valor.toLocaleString('es-EC', { maximumFractionDigits: 1 })} %`;
  if (i.formato === 'dias') return `${Math.round(i.valor)} días`;
  return `${i.valor.toLocaleString('es-EC', { maximumFractionDigits: 2 })} veces`;
}

function cifra(valor: number, formato: FilaComparativo['formato']) {
  if (formato === 'usd') return usd(valor);
  if (formato === 'porcentaje') return `${valor.toLocaleString('es-EC', { maximumFractionDigits: 1 })} %`;
  return `${Math.round(valor)} días`;
}

function Variacion({ f }: { f: FilaComparativo }) {
  if (f.variacionPct === null) return <span className="text-[#555]">—</span>;
  const mejora = f.variacionPct === 0 ? null : (f.variacionPct > 0) === f.mejorSiSube;
  const color = mejora === null ? 'text-[#555]' : mejora ? 'text-[#2e7d32]' : 'text-[#c62828]';
  return <span className={`font-bold ${color}`}>{f.variacionPct > 0 ? '▲' : f.variacionPct < 0 ? '▼' : '='} {Math.abs(f.variacionPct).toLocaleString('es-EC', { maximumFractionDigits: 1 })} %</span>;
}

function Tarjeta({ i }: { i: Indicador }) {
  return (
    <article className="border border-[#999] bg-white">
      <header className="flex items-center justify-between gap-2 border-b border-[#ccc] bg-[#f5f4ee] px-2 py-1">
        <h4 className="font-bold">{i.nombre}</h4>
        <span className="flex items-center gap-1 whitespace-nowrap">
          <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${COLOR[i.semaforo]}`} />
          {TEXTO[i.semaforo]}
        </span>
      </header>
      <div className="space-y-1 p-2">
        <p className="text-[18px] font-bold text-[#003366] tabular-nums">{formatear(i)}</p>
        <p className="text-[#555]"><span className="font-semibold">Fórmula:</span> {i.formula}</p>
        <p className="text-[#555]"><span className="font-semibold">Referencia:</span> {i.referencia}</p>
        <details>
          <summary className="cursor-pointer text-[#0055A5]">¿Qué significa y qué debo pensar?</summary>
          <p className="mt-1">{i.significado}</p>
          <p className="mt-1 border-l-2 border-[#f0ab00] bg-[#fffde7] p-1 font-semibold">🤔 {i.pregunta}</p>
        </details>
      </div>
    </article>
  );
}

export default function ManagementAnalysisScreen() {
  const c = useCompany();
  const [desde, setDesde] = useState(today().slice(0, 4) + '-01-01');
  const [hasta, setHasta] = useState(today());
  const a = useMemo(() => analisisGerencial(c.data, desde, hasta), [c.data, desde, hasta]);
  const comp = useMemo(() => comparativoPeriodos(c.data, desde, hasta), [c.data, desde, hasta]);

  // La reflexión del estudiante se guarda en su navegador, por empresa y período.
  const clave = `b1_reflexion_${c.data.profile?.uid ?? 'anon'}_${desde}_${hasta}`;
  const [reflexion, setReflexion] = useState('');
  useEffect(() => { try { setReflexion(localStorage.getItem(clave) ?? ''); } catch { setReflexion(''); } }, [clave]);
  const guardar = (texto: string) => { setReflexion(texto); try { localStorage.setItem(clave, texto); } catch { /* sin almacenamiento */ } };

  const k = a.cifras;
  return (
    <Screen title="Análisis gerencial e indicadores">
      <p className="border-l-4 border-[#0055A5] bg-white p-2">
        Un buen operador registra; un buen gerente <strong>interpreta y decide</strong>. Revisa cada indicador, abre
        &quot;¿Qué significa?&quot; y responde las preguntas antes de proponer una decisión.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="Desde"><input type="date" className={inputClass} value={desde} onChange={e => setDesde(e.target.value)} /></Field>
        <Field label="Hasta"><input type="date" className={inputClass} value={hasta} onChange={e => setHasta(e.target.value)} /></Field>
      </div>

      {!a.suficientesDatos && (
        <p role="status" className="border border-[#f0ab00] bg-[#fffde7] p-2">
          Aún no hay suficientes movimientos en este período. Registra compras, ventas y cobros en tu empresa y vuelve aquí:
          los indicadores se calculan con tus propios asientos.
        </p>
      )}

      <h3 className="font-bold text-[#003366]">Cifras clave del período ({a.dias} días)</h3>
      <Table headers={['Estado de resultados', 'USD', 'Balance a la fecha de corte', 'USD']} rows={[
        ['Ventas', usd(k.ventas), 'Efectivo y bancos', usd(k.efectivo)],
        ['Costo de ventas', usd(k.costoVentas), 'Cuentas por cobrar', usd(k.cuentasPorCobrar)],
        ['Utilidad bruta', usd(k.utilidadBruta), 'Inventarios', usd(k.inventario)],
        ['Gastos operacionales', usd(k.gastos), 'Activo total', usd(k.activoTotal)],
        ['Utilidad operacional', usd(k.utilidadOperacional), 'Pasivo total', usd(k.pasivoTotal)],
        ['Utilidad neta estimada', usd(k.utilidadNeta), 'Patrimonio (incl. resultado)', usd(k.patrimonio)],
      ]} />

      <h3 className="font-bold text-[#003366]">
        Comparativo con el período anterior ({comp.anterior.desde} a {comp.anterior.hasta})
      </h3>
      <Table headers={['Concepto', 'Período actual', 'Período anterior', 'Variación']}
        rows={comp.filas.map(f => [f.concepto, cifra(f.actual, f.formato), cifra(f.anterior, f.formato), <Variacion key={f.concepto} f={f} />])} />
      <Lectura titulo="Qué dice la comparación" frases={comp.lectura} />

      {AREAS.map(area => {
        const lista = a.indicadores.filter(i => i.area === area);
        return (
          <section key={area} className="space-y-2">
            <h3 className="font-bold text-[#003366]">{area}</h3>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{lista.map(i => <Tarjeta key={i.clave} i={i} />)}</div>
          </section>
        );
      })}

      <section className="space-y-1 border border-[#999] bg-white p-2">
        <h3 className="font-bold text-[#003366]">Diagnóstico automático</h3>
        {a.diagnostico.length ? <ul className="list-disc space-y-1 pl-5">{a.diagnostico.map(d => <li key={d}>{d}</li>)}</ul> : <p>Sin datos suficientes para diagnosticar.</p>}
      </section>

      <section className="space-y-2 border border-[#999] bg-white p-2">
        <h3 className="font-bold text-[#003366]">Tu decisión como gerente</h3>
        <ol className="list-decimal space-y-1 pl-5">{a.decisiones.map(d => <li key={d}>{d}</li>)}</ol>
        <Field label="Tu interpretación y la decisión que tomarías">
          <textarea className={`${inputClass} min-h-28`} value={reflexion} onChange={e => guardar(e.target.value)}
            placeholder="Ej.: La liquidez es 0,9: no alcanzo a cubrir mis deudas de corto plazo. Primero aceleraría la cobranza porque…" />
        </Field>
        <p className="text-[#555]">Se guarda en este navegador. Úsala para tu evaluación y para discutirla con tu docente.</p>
      </section>
    </Screen>
  );
}
