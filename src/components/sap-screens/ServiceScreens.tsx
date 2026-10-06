'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { round, today, usd } from '@/lib/company-calculations';
import type { EstadoLlamada, ServiceCall } from '@/lib/firestore-types';
import { Screen, Field, Table, inputClass, buttonClass } from './SAPControls';
import { ParaPensar } from './AnalysisBlocks';

const TIPO_CONTRATO = { garantia: 'Garantía', mantenimiento: 'Mantenimiento preventivo', soporte: 'Soporte técnico' } as const;
const ESTADO: Record<EstadoLlamada, string> = { abierta: 'Abierta', en_proceso: 'En proceso', resuelta: 'Resuelta', cerrada: 'Cerrada' };
const ahoraLocal = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);

/** SRV001 Contratos de servicio con SLA. */
export function ServiceContractsScreen() {
  const c = useCompany();
  const [f, setF] = useState({ cardCode: '', type: 'soporte' as keyof typeof TIPO_CONTRATO, startDate: today(), endDate: `${Number(today().slice(0, 4)) + 1}${today().slice(4)}`, monthlyFee: 100, responseHours: 24, coverage: '' });
  const activos = c.data.serviceContracts.filter(k => k.status === 'active' && k.endDate >= today());
  const ingresoMensual = round(activos.reduce((s, k) => s + k.monthlyFee, 0));
  return (
    <Screen title="Contratos de servicio">
      <p className="border-l-4 border-[#0055A5] bg-white p-2">Un contrato define qué cubres y <strong>en cuántas horas te comprometes a responder (SLA)</strong>. Es ingreso recurrente, pero también una promesa que hay que cumplir.</p>
      <form className="space-y-2 border border-[#999] bg-white p-2" onSubmit={async e => { e.preventDefault(); try { await c.save({ action: 'serviceContract', data: f }); setF(v => ({ ...v, coverage: '' })); } catch { /* error visible */ } }}>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Cliente" required><select required className={inputClass} value={f.cardCode} onChange={e => setF(v => ({ ...v, cardCode: e.target.value }))}><option value="">Selecciona…</option>{c.data.customers.map(x => <option key={x.id} value={x.cardCode}>{x.name}</option>)}</select></Field>
          <Field label="Tipo"><select className={inputClass} value={f.type} onChange={e => setF(v => ({ ...v, type: e.target.value as keyof typeof TIPO_CONTRATO }))}>{Object.entries(TIPO_CONTRATO).map(([k, n]) => <option key={k} value={k}>{n}</option>)}</select></Field>
          <Field label="Inicio"><input type="date" className={inputClass} value={f.startDate} onChange={e => setF(v => ({ ...v, startDate: e.target.value }))} /></Field>
          <Field label="Fin"><input type="date" className={inputClass} value={f.endDate} onChange={e => setF(v => ({ ...v, endDate: e.target.value }))} /></Field>
          <Field label="Cuota mensual (USD)"><input type="number" min={0} step="0.01" className={inputClass} value={f.monthlyFee} onChange={e => setF(v => ({ ...v, monthlyFee: Number(e.target.value) }))} /></Field>
          <Field label="SLA: horas de respuesta"><input type="number" min={1} max={720} className={inputClass} value={f.responseHours} onChange={e => setF(v => ({ ...v, responseHours: Number(e.target.value) }))} /></Field>
          <Field label="Cobertura" required><input required minLength={3} className={inputClass} value={f.coverage} onChange={e => setF(v => ({ ...v, coverage: e.target.value }))} placeholder="Ej.: 10 equipos, repuestos incluidos" /></Field>
        </div>
        <button type="submit" className={`${buttonClass} font-bold`} disabled={c.saving}>Registrar contrato</button>
      </form>
      <p>Contratos vigentes: <strong>{activos.length}</strong> · ingreso recurrente mensual: <strong>{usd(ingresoMensual)}</strong></p>
      <Table headers={['Contrato', 'Cliente', 'Tipo', 'Vigencia', 'Cuota', 'SLA', 'Cobertura']} rows={c.data.serviceContracts.map(k => [k.contractNumber, k.cardName, TIPO_CONTRATO[k.type], `${k.startDate} a ${k.endDate}`, usd(k.monthlyFee), `${k.responseHours} h`, k.coverage])} />
    </Screen>
  );
}

function FilaLlamada({ l }: { l: ServiceCall }) {
  const c = useCompany();
  const [f, setF] = useState({ status: l.status, technician: l.technician, resolution: l.resolution, hoursWorked: l.hoursWorked });
  const guardar = async () => { try { await c.save({ action: 'serviceCallUpdate', data: { id: l.id, ...f, at: new Date().toISOString() } }); } catch { /* error visible */ } };
  const cerrada = l.status === 'cerrada';
  return (
    <article className="space-y-1 border border-[#999] bg-white p-2">
      <header className="flex flex-wrap justify-between gap-2 font-bold"><span>{l.callNumber} · {l.cardName} · {l.subject}</span><span>Prioridad {l.priority} · {l.responseHours ? `SLA ${l.responseHours} h` : 'sin contrato'}</span></header>
      <p className="text-[#555]">Abierta {new Date(l.openedAt).toLocaleString('es-EC')}{l.resolvedAt && ` · resuelta ${new Date(l.resolvedAt).toLocaleString('es-EC')}`}{l.slaMet !== null && <strong className={l.slaMet ? 'text-[#2e7d32]' : 'text-[#c62828]'}> · {l.slaMet ? 'SLA cumplido' : 'SLA incumplido'}</strong>}</p>
      <div className="grid gap-2 sm:grid-cols-4">
        <Field label="Estado"><select disabled={cerrada} className={inputClass} value={f.status} onChange={e => setF(v => ({ ...v, status: e.target.value as EstadoLlamada }))}>{(Object.keys(ESTADO) as EstadoLlamada[]).map(k => <option key={k} value={k}>{ESTADO[k]}</option>)}</select></Field>
        <Field label="Técnico"><input disabled={cerrada} className={inputClass} value={f.technician} onChange={e => setF(v => ({ ...v, technician: e.target.value }))} /></Field>
        <Field label="Horas trabajadas"><input disabled={cerrada} type="number" min={0} step="0.25" className={inputClass} value={f.hoursWorked} onChange={e => setF(v => ({ ...v, hoursWorked: Number(e.target.value) }))} /></Field>
        <Field label="Solución aplicada"><input disabled={cerrada} className={inputClass} value={f.resolution} onChange={e => setF(v => ({ ...v, resolution: e.target.value }))} /></Field>
      </div>
      {!cerrada && <button type="button" className={buttonClass} disabled={c.saving} onClick={guardar}>Actualizar</button>}
    </article>
  );
}

/** SRV002 / SRV004 Órdenes de servicio y servicio técnico: llamadas, SLA y tiempos de solución. */
export function ServiceCallsScreen() {
  const c = useCompany();
  const [f, setF] = useState({ cardCode: '', subject: '', itemCode: '', priority: 'media' as 'alta' | 'media' | 'baja', openedAt: ahoraLocal() });
  const llamadas = [...c.data.serviceCalls].sort((a, b) => b.openedAt.localeCompare(a.openedAt));
  const conSla = llamadas.filter(l => l.slaMet !== null);
  const cumplimiento = conSla.length ? round((conSla.filter(l => l.slaMet).length / conSla.length) * 100) : null;
  const resueltas = llamadas.filter(l => l.resolvedAt);
  const mttr = resueltas.length ? round(resueltas.reduce((s, l) => s + (Date.parse(l.resolvedAt) - Date.parse(l.openedAt)) / 3_600_000, 0) / resueltas.length) : null;
  return (
    <Screen title="Órdenes de servicio">
      <div className="grid gap-2 sm:grid-cols-3">
        {([['Llamadas abiertas', String(llamadas.filter(l => l.status === 'abierta' || l.status === 'en_proceso').length)], ['Cumplimiento de SLA', cumplimiento === null ? '—' : `${cumplimiento} %`], ['Tiempo medio de solución', mttr === null ? '—' : `${mttr} h`]] as const).map(([t, v]) => <div key={t} className="border border-[#999] bg-white p-3"><p>{t}</p><strong className="text-lg">{v}</strong></div>)}
      </div>
      <form className="space-y-2 border border-[#999] bg-white p-2" onSubmit={async e => { e.preventDefault(); try { await c.save({ action: 'serviceCall', data: { ...f, openedAt: new Date(f.openedAt).toISOString() } }); setF(v => ({ ...v, subject: '' })); } catch { /* error visible */ } }}>
        <h3 className="font-bold text-[#003366]">Nueva llamada de servicio</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <Field label="Cliente" required><select required className={inputClass} value={f.cardCode} onChange={e => setF(v => ({ ...v, cardCode: e.target.value }))}><option value="">Selecciona…</option>{c.data.customers.map(x => <option key={x.id} value={x.cardCode}>{x.name}</option>)}</select></Field>
          <Field label="Asunto" required><input required minLength={5} className={inputClass} value={f.subject} onChange={e => setF(v => ({ ...v, subject: e.target.value }))} /></Field>
          <Field label="Artículo"><select className={inputClass} value={f.itemCode} onChange={e => setF(v => ({ ...v, itemCode: e.target.value }))}><option value="">(ninguno)</option>{c.data.items.map(i => <option key={i.id} value={i.itemCode}>{i.name}</option>)}</select></Field>
          <Field label="Prioridad"><select className={inputClass} value={f.priority} onChange={e => setF(v => ({ ...v, priority: e.target.value as typeof f.priority }))}><option value="alta">Alta</option><option value="media">Media</option><option value="baja">Baja</option></select></Field>
          <Field label="Recibida"><input type="datetime-local" className={inputClass} value={f.openedAt} onChange={e => setF(v => ({ ...v, openedAt: e.target.value }))} /></Field>
        </div>
        <button type="submit" className={`${buttonClass} font-bold`} disabled={c.saving}>Registrar llamada</button>
      </form>
      <div className="space-y-2">{llamadas.map(l => <FilaLlamada key={`${l.id}-${l.updatedAt}`} l={l} />)}</div>
      <ParaPensar clave={`b1_servicio_${c.data.profile?.uid ?? 'anon'}`} preguntas={[
        'Si el cumplimiento de SLA baja del 90 %, ¿contratas otro técnico o renegocias los tiempos del contrato? ¿Qué cuesta más?',
        '¿Qué llamadas repetidas del mismo equipo indican un problema de producto y no de servicio?',
        '¿Cobrarías aparte las llamadas de clientes sin contrato? ¿Cómo convertirías esos clientes en contratos?',
      ]} />
    </Screen>
  );
}

/** SRV003 Proyectos: horas y gastos reales frente al presupuesto. */
export function ProjectsScreen() {
  const c = useCompany();
  const [f, setF] = useState({ name: '', cardCode: '', startDate: today(), endDate: today(), budget: 5000, hourlyCost: 25, etapas: 'Análisis:40\nConfiguración:80\nCapacitación:20' });
  const [avance, setAvance] = useState<Record<string, { stage: number; hours: number; done: boolean }>>({});
  const crear = async () => {
    const stages = f.etapas.split('\n').map(l => l.split(':')).filter(p => p[0]?.trim()).map(([name, h]) => ({ name: name.trim(), budgetHours: Number(h) || 0 }));
    try { await c.save({ action: 'project', data: { name: f.name, cardCode: f.cardCode, startDate: f.startDate, endDate: f.endDate, budget: f.budget, hourlyCost: f.hourlyCost, stages } }); setF(v => ({ ...v, name: '' })); } catch { /* error visible */ }
  };
  return (
    <Screen title="Proyectos">
      <p className="border-l-4 border-[#0055A5] bg-white p-2">Un proyecto se gana o se pierde en las horas. Compara lo presupuestado contra lo real <strong>mientras</strong> avanza, no al final.</p>
      <form className="space-y-2 border border-[#999] bg-white p-2" onSubmit={e => { e.preventDefault(); void crear(); }}>
        <div className="grid gap-2 sm:grid-cols-3">
          <Field label="Proyecto" required><input required minLength={3} className={inputClass} value={f.name} onChange={e => setF(v => ({ ...v, name: e.target.value }))} /></Field>
          <Field label="Cliente" required><select required className={inputClass} value={f.cardCode} onChange={e => setF(v => ({ ...v, cardCode: e.target.value }))}><option value="">Selecciona…</option>{c.data.customers.map(x => <option key={x.id} value={x.cardCode}>{x.name}</option>)}</select></Field>
          <Field label="Precio de venta (USD)"><input type="number" min={0} className={inputClass} value={f.budget} onChange={e => setF(v => ({ ...v, budget: Number(e.target.value) }))} /></Field>
          <Field label="Inicio"><input type="date" className={inputClass} value={f.startDate} onChange={e => setF(v => ({ ...v, startDate: e.target.value }))} /></Field>
          <Field label="Fin"><input type="date" className={inputClass} value={f.endDate} onChange={e => setF(v => ({ ...v, endDate: e.target.value }))} /></Field>
          <Field label="Costo por hora (USD)"><input type="number" min={0} className={inputClass} value={f.hourlyCost} onChange={e => setF(v => ({ ...v, hourlyCost: Number(e.target.value) }))} /></Field>
        </div>
        <Field label="Etapas (una por línea: nombre:horas)"><textarea className={`${inputClass} min-h-20 font-mono`} value={f.etapas} onChange={e => setF(v => ({ ...v, etapas: e.target.value }))} /></Field>
        <button type="submit" className={`${buttonClass} font-bold`} disabled={c.saving}>Crear proyecto</button>
      </form>
      {c.data.projects.map(p => {
        const hp = p.stages.reduce((s, x) => s + x.budgetHours, 0); const hr = p.stages.reduce((s, x) => s + x.actualHours, 0);
        const gastos = p.expenses.reduce((s, x) => s + x.amount, 0); const costo = round(hr * p.hourlyCost + gastos);
        const margen = p.budget ? round(((p.budget - costo) / p.budget) * 100) : 0;
        const a = avance[p.id] ?? { stage: 0, hours: 0, done: false };
        return (
          <section key={p.id} className="space-y-1 border border-[#999] bg-white p-2">
            <h3 className="font-bold text-[#003366]">{p.projectNumber} · {p.name} · {p.cardName} {p.status === 'cerrado' && '· CERRADO'}</h3>
            <Table headers={['Etapa', 'Horas presup.', 'Horas reales', 'Desviación', 'Estado']} rows={p.stages.map(s => [s.name, s.budgetHours, s.actualHours, <strong key="d" className={s.actualHours > s.budgetHours ? 'text-[#c62828]' : 'text-[#2e7d32]'}>{round(s.actualHours - s.budgetHours)}</strong>, s.done ? '✔ Terminada' : 'En curso'])} />
            <p>Horas {hr} de {hp} · costo real {usd(costo)} de un precio de {usd(p.budget)} · <strong className={margen < 0 ? 'text-[#c62828]' : 'text-[#2e7d32]'}>margen {margen} %</strong></p>
            {p.status === 'activo' && (
              <div className="flex flex-wrap items-end gap-2">
                <Field label="Etapa"><select className={inputClass} value={a.stage} onChange={e => setAvance(v => ({ ...v, [p.id]: { ...a, stage: Number(e.target.value) } }))}>{p.stages.map((s, i) => <option key={s.name} value={i}>{s.name}</option>)}</select></Field>
                <Field label="Horas a registrar"><input type="number" min={0} step="0.5" className={inputClass} value={a.hours} onChange={e => setAvance(v => ({ ...v, [p.id]: { ...a, hours: Number(e.target.value) } }))} /></Field>
                <label className="flex items-center gap-1"><input type="checkbox" checked={a.done} onChange={e => setAvance(v => ({ ...v, [p.id]: { ...a, done: e.target.checked } }))} /> Etapa terminada</label>
                <button type="button" className={buttonClass} disabled={c.saving} onClick={async () => { try { await c.save({ action: 'projectProgress', data: { id: p.id, stage: a.stage, hours: a.hours, done: a.done, close: false } }); } catch { /* error visible */ } }}>Registrar avance</button>
                <button type="button" className={buttonClass} disabled={c.saving || !p.stages.every(s => s.done)} onClick={async () => { try { await c.save({ action: 'projectProgress', data: { id: p.id, stage: 0, hours: 0, done: p.stages[0].done, close: true } }); } catch { /* error visible */ } }}>Cerrar proyecto</button>
              </div>
            )}
          </section>
        );
      })}
      <ParaPensar clave={`b1_proyectos_${c.data.profile?.uid ?? 'anon'}`} preguntas={[
        'Si a mitad del proyecto ya usaste el 70 % de las horas, ¿qué le dices al cliente y qué le dices a tu equipo?',
        '¿Cobrarías los cambios que pide el cliente fuera del alcance? ¿Cómo lo acordarías desde el inicio?',
      ]} />
    </Screen>
  );
}
