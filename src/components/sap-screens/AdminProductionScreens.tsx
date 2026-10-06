'use client';
import { useMemo, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { usd } from '@/lib/company-calculations';
import { AREAS_PERMISO, cargaCapacidad, conflictosSoD, verificarIntegridad } from '@/lib/company-analytics';
import type { TeamUser } from '@/lib/firestore-types';
import { Screen, Field, Table, inputClass, buttonClass } from './SAPControls';
import { ParaPensar } from './AnalysisBlocks';

type Nivel = 'total' | 'consulta' | 'ninguno';
const sinPermisos = (): Record<string, Nivel> => Object.fromEntries(AREAS_PERMISO.map(a => [a, 'ninguno']));

/** ADM002 Usuarios y permisos: matriz por área y detector de conflictos de segregación de funciones. */
export function TeamUsersScreen() {
  const c = useCompany();
  const [f, setF] = useState({ userCode: '', name: '', role: '', permissions: sinPermisos(), active: true });
  const conflictosForm = conflictosSoD(f.permissions);
  const editar = (u: TeamUser) => setF({ userCode: u.userCode, name: u.name, role: u.role, permissions: { ...sinPermisos(), ...u.permissions }, active: u.active });
  return (
    <Screen title="Usuarios y autorizaciones">
      <p className="border-l-4 border-[#0055A5] bg-white p-2">
        Arma el equipo de tu empresa y define qué puede hacer cada persona. La regla de oro del control interno es la
        <strong> segregación de funciones</strong>: nadie debe poder iniciar, aprobar y pagar la misma operación.
      </p>
      <form className="space-y-2 border border-[#999] bg-white p-2" onSubmit={async e => { e.preventDefault(); try { await c.save({ action: 'teamUser', data: f }); setF({ userCode: '', name: '', role: '', permissions: sinPermisos(), active: true }); } catch { /* error visible */ } }}>
        <div className="grid gap-2 sm:grid-cols-3">
          <Field label="Nombre" required><input required minLength={2} className={inputClass} value={f.name} onChange={e => setF(v => ({ ...v, name: e.target.value }))} /></Field>
          <Field label="Cargo" required><input required minLength={2} className={inputClass} value={f.role} onChange={e => setF(v => ({ ...v, role: e.target.value }))} placeholder="Ej.: Jefe de compras" /></Field>
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.active} onChange={e => setF(v => ({ ...v, active: e.target.checked }))} /> Activo</label>
        </div>
        <Table headers={['Área', 'Acceso total', 'Solo consulta', 'Sin acceso']} rows={AREAS_PERMISO.map(a => [a, ...(['total', 'consulta', 'ninguno'] as Nivel[]).map(n => (
          <input key={n} type="radio" name={`perm-${a}`} aria-label={`${a}: ${n}`} checked={f.permissions[a] === n} onChange={() => setF(v => ({ ...v, permissions: { ...v.permissions, [a]: n } }))} />
        ))])} />
        {conflictosForm.length > 0 && <ul className="list-disc border border-[#c62828] bg-[#fdecea] p-2 pl-6 text-[#a12622]">{conflictosForm.map(x => <li key={x.a + x.b}><strong>{x.a} + {x.b}:</strong> {x.riesgo}</li>)}</ul>}
        <button type="submit" className={`${buttonClass} font-bold`} disabled={c.saving}>{f.userCode ? 'Guardar cambios' : 'Crear usuario'}</button>
      </form>
      <Table headers={['Usuario', 'Cargo', 'Acceso total en', 'Conflictos', '']} rows={c.data.teamUsers.map(u => {
        const conf = conflictosSoD(u.permissions);
        return [`${u.userCode} · ${u.name}${u.active ? '' : ' (inactivo)'}`, u.role, AREAS_PERMISO.filter(a => u.permissions[a] === 'total').join(', ') || '—',
          conf.length ? <strong key="c" className="text-[#c62828]">⚠ {conf.length}</strong> : <span key="c" className="text-[#2e7d32]">✔ Ninguno</span>,
          <button key="e" type="button" className={buttonClass} onClick={() => editar(u)}>Editar</button>];
      })} />
      <ParaPensar clave={`b1_usuarios_${c.data.profile?.uid ?? 'anon'}`} preguntas={[
        'En una empresa de 5 personas no siempre se pueden separar todas las funciones. ¿Qué control compensatorio aplicarías?',
        '¿Por qué el contador no debería poder registrar ventas ni cobrar?',
        'Cuando alguien sale de la empresa, ¿qué es lo primero que harías con su usuario?',
      ]} />
    </Screen>
  );
}

/** ADM005 Verificación y respaldo de datos: conciliación de auxiliares con el mayor. */
export function DataVerificationScreen() {
  const c = useCompany();
  const v = useMemo(() => verificarIntegridad(c.data), [c.data]);
  const respaldo = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(c.data, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = `respaldo-${c.data.profile?.companyName ?? 'empresa'}-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url);
  };
  const malas = v.filter(x => !x.ok).length;
  return (
    <Screen title="Verificación y respaldo de datos">
      <p className="border-l-4 border-[#0055A5] bg-white p-2">
        Antes de confiar en un balance, un auditor verifica que cada <strong>auxiliar</strong> (bodega, clientes, proveedores, bancos, activos) cuadre con su cuenta del <strong>mayor</strong>.
        Una diferencia no siempre es un error del sistema: suele ser un registro que se hizo por fuera del documento correcto.
      </p>
      <p role="status" className={`font-bold ${malas ? 'text-[#c62828]' : 'text-[#2e7d32]'}`}>{malas ? `${malas} verificación(es) con diferencias` : 'Todo cuadra: auxiliares y mayor coinciden'}</p>
      <Table headers={['Verificación', 'Auxiliar', 'Mayor', 'Diferencia', 'Qué significa']} rows={v.map(x => [
        <span key="n">{x.ok ? '✅' : '⚠️'} {x.nombre}</span>, usd(x.auxiliar), usd(x.mayor),
        <strong key="d" className={x.ok ? 'text-[#2e7d32]' : 'text-[#c62828]'}>{usd(x.diferencia)}</strong>, x.explicacion,
      ])} />
      <button type="button" className={buttonClass} onClick={respaldo}>Descargar respaldo completo (JSON)</button>
      <ParaPensar clave={`b1_verificacion_${c.data.profile?.uid ?? 'anon'}`} preguntas={[
        'Si el inventario de bodega vale más que la cuenta contable, ¿qué movimiento pudo haberse registrado sin asiento?',
        '¿Por qué un activo comprado a crédito sin crear la factura del proveedor descuadra la conciliación de proveedores?',
      ]} />
    </Screen>
  );
}

/** MFG002 Rutas de fabricación: operaciones, centros de trabajo y tiempos estándar. */
export function RoutingScreen() {
  const c = useCompany();
  const [item, setItem] = useState('');
  const [ops, setOps] = useState([{ seq: 10, name: 'Ensamblaje', workCenter: 'Línea 1', setupMinutes: 30, runMinutesPerUnit: 15 }]);
  const elegir = (code: string) => { setItem(code); const r = c.data.routings.find(x => x.itemCode === code); setOps(r ? r.operations.map(o => ({ ...o })) : [{ seq: 10, name: 'Ensamblaje', workCenter: 'Línea 1', setupMinutes: 30, runMinutesPerUnit: 15 }]); };
  const campo = (i: number, k: keyof (typeof ops)[number], tipo: 'text' | 'number') => (
    <input key={k} type={tipo} min={0} className={inputClass} value={ops[i][k]} onChange={e => setOps(v => v.map((o, j) => (j === i ? { ...o, [k]: tipo === 'number' ? Number(e.target.value) : e.target.value } : o)))} />
  );
  const total = (q: number) => ops.reduce((s, o) => s + o.setupMinutes + o.runMinutesPerUnit * q, 0);
  return (
    <Screen title="Rutas de fabricación">
      <p className="border-l-4 border-[#0055A5] bg-white p-2">La lista de materiales dice <em>qué</em> se usa; la ruta dice <strong>dónde y cuánto tiempo</strong> toma fabricarlo. Sin tiempos estándar no se puede planificar ni costear la mano de obra.</p>
      <Field label="Producto"><select className={inputClass} value={item} onChange={e => elegir(e.target.value)}><option value="">Selecciona…</option>{c.data.items.filter(i => i.type === 'inventory').map(i => <option key={i.id} value={i.itemCode}>{i.itemCode} · {i.name}{c.data.routings.some(r => r.itemCode === i.itemCode) ? ' (con ruta)' : ''}</option>)}</select></Field>
      {item && (
        <>
          <Table headers={['Secuencia', 'Operación', 'Centro de trabajo', 'Preparación (min)', 'Por unidad (min)', '']} rows={ops.map((_, i) => [
            campo(i, 'seq', 'number'), campo(i, 'name', 'text'), campo(i, 'workCenter', 'text'), campo(i, 'setupMinutes', 'number'), campo(i, 'runMinutesPerUnit', 'number'),
            <button key="q" type="button" className={buttonClass} disabled={ops.length === 1} onClick={() => setOps(v => v.filter((__, j) => j !== i))}>✕</button>,
          ])} />
          <div className="flex flex-wrap gap-2">
            <button type="button" className={buttonClass} onClick={() => setOps(v => [...v, { seq: (v.at(-1)?.seq ?? 0) + 10, name: 'Nueva operación', workCenter: 'Línea 1', setupMinutes: 0, runMinutesPerUnit: 5 }])}>+ Operación</button>
            <button type="button" className={`${buttonClass} font-bold`} disabled={c.saving} onClick={async () => { try { await c.save({ action: 'routing', data: { itemCode: item, operations: ops } }); } catch { /* error visible */ } }}>Guardar ruta</button>
          </div>
          <p>Tiempo para 1 unidad: <strong>{Math.round(total(1))} min</strong> · para 100 unidades: <strong>{(total(100) / 60).toFixed(1)} h</strong> (la preparación pesa menos cuanto más grande es el lote).</p>
        </>
      )}
    </Screen>
  );
}

/** MFG006 Capacidad de producción: carga de las órdenes abiertas frente a las horas disponibles. */
export function CapacityScreen() {
  const c = useCompany();
  const [horas, setHoras] = useState(8);
  const [dias, setDias] = useState(20);
  const carga = useMemo(() => cargaCapacidad(c.data, horas, dias), [c.data, horas, dias]);
  const sinRuta = c.data.productionOrders.filter(o => o.status !== 'closed' && !c.data.routings.some(r => r.itemCode === o.parentItemCode)).length;
  return (
    <Screen title="Capacidad de producción">
      <p className="border-l-4 border-[#0055A5] bg-white p-2">¿Podemos cumplir lo que vendimos? La carga de las órdenes abiertas (según las rutas) se compara con las horas disponibles de cada centro de trabajo.</p>
      <div className="grid max-w-md gap-2 sm:grid-cols-2">
        <Field label="Horas por día"><input type="number" min={1} max={24} className={inputClass} value={horas} onChange={e => setHoras(Number(e.target.value))} /></Field>
        <Field label="Días del horizonte"><input type="number" min={1} max={365} className={inputClass} value={dias} onChange={e => setDias(Number(e.target.value))} /></Field>
      </div>
      {sinRuta > 0 && <p className="text-[#b26a00]">⚠ {sinRuta} orden(es) abiertas sin ruta de fabricación: no suman carga. Define sus rutas en MFG002.</p>}
      <Table headers={['Centro de trabajo', 'Órdenes', 'Carga (h)', 'Disponible (h)', 'Utilización']} rows={carga.map(f => [
        f.centro, f.ordenes, f.horas, f.disponible,
        <strong key="u" className={f.utilizacion > 100 ? 'text-[#c62828]' : f.utilizacion > 85 ? 'text-[#b26a00]' : 'text-[#2e7d32]'}>{f.utilizacion} %{f.utilizacion > 100 ? ' · cuello de botella' : ''}</strong>,
      ])} />
      <ParaPensar clave={`b1_capacidad_${c.data.profile?.uid ?? 'anon'}`} preguntas={[
        'Un centro está al 130 %: ¿horas extra, segundo turno, tercerizar o mover fechas de entrega? ¿Cuál cuesta menos al cliente?',
        '¿Por qué trabajar al 100 % de capacidad todo el tiempo es peligroso?',
      ]} />
    </Screen>
  );
}
