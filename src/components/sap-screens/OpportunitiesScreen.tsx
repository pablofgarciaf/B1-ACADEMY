'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { round, today, usd } from '@/lib/company-calculations';
import type { EtapaOportunidad, Opportunity } from '@/lib/firestore-types';
import { Screen, Field, Table, inputClass, buttonClass } from './SAPControls';
import { ParaPensar } from './AnalysisBlocks';

const ETAPAS: { clave: EtapaOportunidad; nombre: string; prob: number }[] = [
  { clave: 'prospecto', nombre: 'Prospecto', prob: 10 }, { clave: 'calificado', nombre: 'Calificado', prob: 25 },
  { clave: 'propuesta', nombre: 'Propuesta', prob: 50 }, { clave: 'negociacion', nombre: 'Negociación', prob: 75 },
  { clave: 'ganada', nombre: 'Ganada', prob: 100 }, { clave: 'perdida', nombre: 'Perdida', prob: 0 },
];
const ABIERTAS: EtapaOportunidad[] = ['prospecto', 'calificado', 'propuesta', 'negociacion'];
const vacia = () => ({ id: '', name: '', cardCode: '', amount: 0, stage: 'prospecto' as EtapaOportunidad, expectedClose: today(), source: 'Referido', notes: '', lossReason: '' });

/** Oportunidades (CRM001): embudo comercial, pronóstico ponderado y aprendizaje de las pérdidas. */
export default function OpportunitiesScreen() {
  const c = useCompany();
  const [f, setF] = useState(vacia());
  const ops = c.data.opportunities;
  const abiertas = ops.filter(o => ABIERTAS.includes(o.stage));
  const ganadas = ops.filter(o => o.stage === 'ganada');
  const perdidas = ops.filter(o => o.stage === 'perdida');
  const embudo = round(abiertas.reduce((s, o) => s + o.amount, 0));
  const ponderado = round(abiertas.reduce((s, o) => s + (o.amount * o.probability) / 100, 0));
  const tasa = ganadas.length + perdidas.length ? round((ganadas.length / (ganadas.length + perdidas.length)) * 100) : null;
  const motivos = Object.entries(perdidas.reduce<Record<string, number>>((m, o) => ({ ...m, [o.lossReason]: (m[o.lossReason] ?? 0) + 1 }), {})).sort((a, b) => b[1] - a[1]);
  const vencidas = abiertas.filter(o => o.expectedClose < today());

  const guardar = async () => { try { await c.save({ action: 'opportunity', data: f }); setF(vacia()); } catch { /* error visible */ } };
  const editar = (o: Opportunity) => setF({ id: o.id, name: o.name, cardCode: o.cardCode, amount: o.amount, stage: o.stage, expectedClose: o.expectedClose, source: o.source, notes: o.notes, lossReason: o.lossReason });

  return (
    <Screen title="Oportunidades de venta">
      <p className="border-l-4 border-[#0055A5] bg-white p-2">
        Las ventas de mañana se ven hoy en el embudo. El <strong>pronóstico ponderado</strong> multiplica cada oportunidad por su probabilidad:
        es la venta que razonablemente puedes esperar, no la que deseas.
      </p>
      <div className="grid gap-2 sm:grid-cols-4">
        {([['Embudo abierto', usd(embudo)], ['Pronóstico ponderado', usd(ponderado)], ['Tasa de cierre', tasa === null ? '—' : `${tasa} %`], ['Vencidas sin cerrar', String(vencidas.length)]] as const).map(([t, v]) => (
          <div key={t} className="border border-[#999] bg-white p-3"><p>{t}</p><strong className="text-lg">{v}</strong></div>
        ))}
      </div>

      <div className="grid gap-2 lg:grid-cols-6">
        {ETAPAS.map(e => {
          const lista = ops.filter(o => o.stage === e.clave);
          return (
            <section key={e.clave} className="border border-[#999] bg-[#f5f4ee] p-1">
              <h3 className="font-bold text-[#003366]">{e.nombre} <span className="font-normal">({e.prob} %)</span></h3>
              <p className="text-[#555]">{lista.length} · {usd(lista.reduce((s, o) => s + o.amount, 0))}</p>
              <ul className="space-y-1">
                {lista.map(o => (
                  <li key={o.id}>
                    <button type="button" onClick={() => editar(o)} className="w-full border border-[#ccc] bg-white p-1 text-left hover:bg-[#FFFDE7]">
                      <strong>{o.name}</strong><br />{o.cardName} · {usd(o.amount)}<br /><span className="text-[#555]">Cierre {o.expectedClose}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <form className="space-y-2 border border-[#999] bg-white p-2" onSubmit={e => { e.preventDefault(); void guardar(); }}>
        <h3 className="font-bold text-[#003366]">{f.id ? `Editar ${ops.find(o => o.id === f.id)?.opportunityNumber}` : 'Nueva oportunidad'}</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Nombre" required><input required minLength={3} className={inputClass} value={f.name} onChange={e => setF(v => ({ ...v, name: e.target.value }))} placeholder="Ej.: Equipamiento sala de cómputo" /></Field>
          <Field label="Cliente" required><select required className={inputClass} value={f.cardCode} onChange={e => setF(v => ({ ...v, cardCode: e.target.value }))}><option value="">Selecciona…</option>{c.data.customers.map(cl => <option key={cl.id} value={cl.cardCode}>{cl.name}</option>)}</select></Field>
          <Field label="Monto estimado (USD)"><input type="number" min={0} step="0.01" className={inputClass} value={f.amount} onChange={e => setF(v => ({ ...v, amount: Number(e.target.value) }))} /></Field>
          <Field label="Etapa"><select className={inputClass} value={f.stage} onChange={e => setF(v => ({ ...v, stage: e.target.value as EtapaOportunidad }))}>{ETAPAS.map(e => <option key={e.clave} value={e.clave}>{e.nombre} ({e.prob} %)</option>)}</select></Field>
          <Field label="Cierre esperado"><input type="date" className={inputClass} value={f.expectedClose} onChange={e => setF(v => ({ ...v, expectedClose: e.target.value }))} /></Field>
          <Field label="Origen"><select className={inputClass} value={f.source} onChange={e => setF(v => ({ ...v, source: e.target.value }))}>{['Referido', 'Web', 'Feria', 'Llamada en frío', 'Cliente actual', 'Redes sociales'].map(x => <option key={x}>{x}</option>)}</select></Field>
          {f.stage === 'perdida' && <Field label="Motivo de la pérdida" required><input required minLength={5} className={inputClass} value={f.lossReason} onChange={e => setF(v => ({ ...v, lossReason: e.target.value }))} placeholder="Ej.: Precio, plazo de entrega, competidor…" /></Field>}
          <Field label="Notas"><input className={inputClass} value={f.notes} onChange={e => setF(v => ({ ...v, notes: e.target.value }))} /></Field>
        </div>
        <div className="flex gap-2"><button type="submit" className={`${buttonClass} font-bold`} disabled={c.saving}>Guardar</button>{f.id && <button type="button" className={buttonClass} onClick={() => setF(vacia())}>Nueva</button>}</div>
      </form>

      {motivos.length > 0 && <><h3 className="font-bold text-[#003366]">¿Por qué perdemos?</h3><Table headers={['Motivo', 'Oportunidades']} rows={motivos.map(([m, n]) => [m, n])} /></>}
      <ParaPensar clave={`b1_crm_${c.data.profile?.uid ?? 'anon'}`} preguntas={[
        'Si tu meta mensual es 20.000 USD y el pronóstico ponderado es 12.000, ¿cuántas oportunidades nuevas necesitas y en qué etapa?',
        '¿Qué te dice el motivo de pérdida más frecuente sobre tu precio, tu producto o tu servicio?',
        'Una oportunidad lleva tres meses en "Negociación". ¿La sigues contando en el pronóstico? ¿Qué harías con ella?',
      ]} />
    </Screen>
  );
}
