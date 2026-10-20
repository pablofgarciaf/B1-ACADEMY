'use client';
import { useEffect, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { Screen, Field, Table, inputClass, buttonClass } from './FinixControls';

interface CentroCoste { codigo: string; nombre: string; tipo: string; clasificacion?: string; cuentas: string[] }
interface NormaReparto { codigo: string; nombre: string; centros: { codigo: string; porcentaje: number }[] }
interface CostCenterConfig { multipleDimensions?: boolean; dimensionCount?: number; display?: string; dimensiones?: { nombre: string; nombre2?: string; centros: { codigo: string; descripcion: string }[]; centros2?: { codigo: string; descripcion: string }[] }[]; cuentas?: { cuenta: string; nombre: string; norma?: string; descripcion?: string; dimension1?: string; norma1?: string; dimension2?: string; norma2?: string }[]; informes?: { periodo: string; centro: string; tipo?: string; dimension?: string; gastosElectricos?: number; totalGastos?: number; escenario?: string; cuenta?: string; presupuestado?: number; real?: number; desviacion?: number }[]; controlPresupuesto?: { inicializado: boolean; alSuperar: string; ejercicio: string; controlPor: string }[] }

const TIPOS = ['Ventas', 'Producción', 'Administración', 'Logística', 'Soporte', 'General'];

function uid() { return Math.random().toString(36).slice(2, 8).toUpperCase(); }

export default function CentroCostesScreen() {
  const c = useCompany();
  const p = c.data.profile;
  const data = (p as unknown as Record<string, unknown>)?.costCenters as { centros: CentroCoste[]; normas: NormaReparto[]; config?: CostCenterConfig } | undefined;

  const [centros, setCentros] = useState<CentroCoste[]>([]);
  const [normas, setNormas] = useState<NormaReparto[]>([]);
  const [config, setConfig] = useState<CostCenterConfig>({});
  const [editCC, setEditCC] = useState<CentroCoste | null>(null);
  const [editNorma, setEditNorma] = useState<NormaReparto | null>(null);
  const [tab, setTab] = useState<'centros' | 'normas' | 'dimensiones' | 'cuentas' | 'informes' | 'presupuesto'>('centros');

  useEffect(() => {
    setCentros(data?.centros ?? []);
    setNormas(data?.normas ?? []);
    setConfig(data?.config ?? {});
  }, [data]);

  const guardar = async () => {
    const settings = [{ modulo: 'Contabilidad de costes', multipleDimensions: Boolean(config.multipleDimensions), dimensionCount: config.dimensionCount ?? 2, display: config.display ?? 'Columnas distintas' }];
    await c.save({ action: 'costCentersSave', data: { centros, normas, config: { ...config, settings } as Record<string, unknown> } });
  };

  const addCC = () => setEditCC({ codigo: uid(), nombre: '', tipo: 'Ventas', clasificacion: 'DEPT', cuentas: [] });

  const saveCC = () => {
    if (!editCC?.nombre) return;
    setCentros(cs => { const sin = cs.filter(x => x.codigo !== editCC.codigo); return [...sin, editCC]; });
    setEditCC(null);
  };

  const addNorma = () => setEditNorma({ codigo: uid(), nombre: '', centros: centros.map(cc => ({ codigo: cc.codigo, porcentaje: 0 })) });

  const saveNorma = async () => {
    if (!editNorma?.nombre) return;
    const sin = normas.filter(n => n.codigo !== editNorma.codigo);
    const nuevas = [...sin, editNorma];
    setNormas(nuevas);
    await c.save({ action: 'costCentersSave', data: { centros, normas: nuevas, config: config as Record<string, unknown> } });
    setEditNorma(null);
  };

  return (
    <Screen title="Centros de coste">
      <div className="space-y-3">
        <div className="flex gap-1 border-b border-[#cdd6e1]">
          {(['centros', 'normas', 'dimensiones', 'cuentas', 'informes', 'presupuesto'] as const).map(t => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={`px-4 py-1.5 text-sm font-semibold border-b-2 -mb-px ${tab === t ? 'border-[#f0ab00] text-[#003366]' : 'border-transparent text-gray-500 hover:text-[#003366]'}`}>
              {{centros:'Centros',normas:'Normas',dimensiones:'Dimensiones',cuentas:'Cuentas',informes:'Informes',presupuesto:'Presupuesto'}[t]}
            </button>
          ))}
        </div>

        {tab === 'centros' && (
          <>
            <div className="flex justify-end">
              <button type="button" className={buttonClass} onClick={addCC}>+ Nuevo centro de coste</button>
            </div>
            <Table
              headers={['Código', 'Nombre', 'Clasificación', 'Tipo', '']}
              rows={centros.map(cc => [
                <span key="c" className="font-mono font-bold">{cc.codigo}</span>,
                <span key="n">{cc.nombre}</span>,
                <span key="cl">{cc.clasificacion ?? 'DEPT'}</span>,
                <span key="t" className="text-[#1565C0]">{cc.tipo}</span>,
                <div key="a" className="flex gap-1">
                  <button type="button" className={buttonClass} onClick={() => setEditCC({ ...cc })}>Editar</button>
                  <button type="button" className={`${buttonClass} text-red-700`} onClick={() => { setCentros(cs => cs.filter(x => x.codigo !== cc.codigo)); }}>✕</button>
                </div>,
              ])}
            />
            {centros.length === 0 && !editCC && <p className="text-sm text-gray-500 italic">No hay centros de coste definidos.</p>}

            {editCC && (
              <div className="border border-[#9fb1c7] rounded-sm bg-[#f7f8fa] p-3 space-y-2 max-w-md">
                <h4 className="font-bold text-[#003366]">Centro de coste</h4>
                <Field label="Código"><input className={inputClass} value={editCC.codigo} onChange={e => setEditCC(v => v ? { ...v, codigo: e.target.value.toUpperCase() } : v)} /></Field>
                <Field label="Nombre" required><input required className={inputClass} value={editCC.nombre} onChange={e => setEditCC(v => v ? { ...v, nombre: e.target.value } : v)} /></Field>
                <Field label="Código de clasificación"><input className={inputClass} value={editCC.clasificacion ?? 'DEPT'} onChange={e => setEditCC(v => v ? { ...v, clasificacion: e.target.value.toUpperCase() } : v)} /></Field>
                <Field label="Tipo">
                  <select className={inputClass} value={editCC.tipo} onChange={e => setEditCC(v => v ? { ...v, tipo: e.target.value } : v)}>
                    {TIPOS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <div className="flex gap-2">
                  <button type="button" onClick={saveCC} disabled={!editCC.nombre} className={`${buttonClass} font-bold`}>Añadir</button>
                  <button type="button" onClick={() => setEditCC(null)} className={buttonClass}>Cancelar</button>
                </div>
              </div>
            )}
            {centros.length > 0 && <button type="button" onClick={guardar} disabled={c.saving} className={`${buttonClass} font-bold`}>Guardar centros de coste</button>}
          </>
        )}

        {tab === 'normas' && (
          <>
            <div className="flex justify-end">
              <button type="button" className={buttonClass} onClick={addNorma} disabled={centros.length === 0}>+ Nueva norma de reparto</button>
            </div>
            {centros.length === 0 && <p className="text-sm text-amber-600">Define primero los centros de coste para crear normas de reparto.</p>}
            <Table
              headers={['Código', 'Nombre', 'Reparto', '']}
              rows={normas.map(n => [
                <span key="c" className="font-mono font-bold">{n.codigo}</span>,
                <span key="n">{n.nombre}</span>,
                <span key="r" className="text-xs">{n.centros.map(cc => `${cc.codigo}:${cc.porcentaje}%`).join(' | ')}</span>,
                <button key="a" type="button" className={`${buttonClass} text-red-700`} onClick={() => setNormas(ns => ns.filter(x => x.codigo !== n.codigo))}>✕</button>,
              ])}
            />

            {editNorma && (
              <div className="border border-[#9fb1c7] rounded-sm bg-[#f7f8fa] p-3 space-y-2 max-w-lg">
                <h4 className="font-bold text-[#003366]">Nueva norma de reparto</h4>
                <Field label="Nombre de la norma" required>
                  <input required className={inputClass} value={editNorma.nombre} onChange={e => setEditNorma(v => v ? { ...v, nombre: e.target.value } : v)} placeholder="AREA" />
                </Field>
                <p className="text-xs font-semibold text-[#003366]">Porcentaje por centro de coste (debe sumar 100 %):</p>
                {editNorma.centros.map((cc, i) => (
                  <div key={cc.codigo} className="flex items-center gap-2">
                    <span className="w-28 font-mono text-sm">{cc.codigo}</span>
                    <input type="number" min={0} max={100} step={0.01} className={`${inputClass} w-24`} value={cc.porcentaje}
                      onChange={e => setEditNorma(v => v ? { ...v, centros: v.centros.map((x, j) => j === i ? { ...x, porcentaje: Number(e.target.value) } : x) } : v)} />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                ))}
                <p className="text-xs text-gray-500">
                  Total: {editNorma.centros.reduce((s, cc) => s + cc.porcentaje, 0).toFixed(2)} %
                </p>
                <div className="flex gap-2">
                  <button type="button" onClick={saveNorma} disabled={c.saving || !editNorma.nombre} className={`${buttonClass} font-bold`}>Añadir norma</button>
                  <button type="button" onClick={() => setEditNorma(null)} className={buttonClass}>Cancelar</button>
                </div>
              </div>
            )}
          </>
        )}
        {tab === 'dimensiones' && <section className="space-y-3 border border-[#999] bg-white p-3">
          <h3 className="font-bold text-[#003366]">Dimensiones múltiples</h3>
          <label className="flex gap-2"><input type="checkbox" checked={Boolean(config.multipleDimensions)} onChange={e=>setConfig(v=>({...v,multipleDimensions:e.target.checked}))} />Habilitar dimensiones múltiples</label>
          <div className="grid gap-2 sm:grid-cols-3"><Field label="Número de dimensiones"><input type="number" min={1} max={5} className={inputClass} value={config.dimensionCount ?? 2} onChange={e=>setConfig(v=>({...v,dimensionCount:Number(e.target.value)}))}/></Field><Field label="Mostrar normas en"><select className={inputClass} value={config.display ?? 'Columnas distintas'} onChange={e=>setConfig(v=>({...v,display:e.target.value}))}><option>Columnas distintas</option><option>Una columna</option></select></Field></div>
          {(config.dimensiones ?? []).map((d,i)=><div key={i} className="grid gap-2 border-t pt-2 sm:grid-cols-2"><Field label={`Dimensión ${i+1}`}><input className={inputClass} value={d.nombre} onChange={e=>setConfig(v=>({...v,dimensiones:(v.dimensiones??[]).map((x,j)=>j===i?{...x,nombre:e.target.value}:x)}))}/></Field><Field label="Centro de costo"><input className={inputClass} value={d.centros[0]?.codigo ?? ''} onChange={e=>setConfig(v=>({...v,dimensiones:(v.dimensiones??[]).map((x,j)=>j===i?{...x,centros:[{codigo:e.target.value,descripcion:x.centros[0]?.descripcion??''}]}:x)}))}/></Field></div>)}
          <button type="button" className={buttonClass} onClick={()=>setConfig(v=>({...v,dimensiones:[...(v.dimensiones??[]),{nombre:'',centros:[{codigo:'',descripcion:''}]}]}))}>+ Dimensión</button><button type="button" className={`${buttonClass} ml-2`} onClick={guardar} disabled={c.saving}>Guardar</button>
        </section>}
        {tab === 'cuentas' && <section className="space-y-3 border border-[#999] bg-white p-3"><h3 className="font-bold text-[#003366]">Cuentas y normas</h3>{(config.cuentas??[]).map((a,i)=><div key={i} className="grid gap-2 sm:grid-cols-3"><Field label="Cuenta"><input className={inputClass} value={a.cuenta} onChange={e=>setConfig(v=>({...v,cuentas:(v.cuentas??[]).map((x,j)=>j===i?{...x,cuenta:e.target.value}:x)}))}/></Field><Field label="Nombre"><input className={inputClass} value={a.nombre} onChange={e=>setConfig(v=>({...v,cuentas:(v.cuentas??[]).map((x,j)=>j===i?{...x,nombre:e.target.value}:x)}))}/></Field><Field label="Norma de reparto"><input className={inputClass} value={a.norma??''} onChange={e=>setConfig(v=>({...v,cuentas:(v.cuentas??[]).map((x,j)=>j===i?{...x,norma:e.target.value}:x)}))}/></Field></div>)}<button type="button" className={buttonClass} onClick={()=>setConfig(v=>({...v,cuentas:[...(v.cuentas??[]),{cuenta:'',nombre:'',norma:''}]}))}>+ Vincular cuenta</button><button type="button" className={`${buttonClass} ml-2`} onClick={guardar} disabled={c.saving}>Guardar</button></section>}
        {tab === 'informes' && <section className="space-y-3 border border-[#999] bg-white p-3"><h3 className="font-bold text-[#003366]">Informe guardado de costes</h3><p>Guarda el filtro que usas para revisar gastos por centro o dimensión; el resultado queda asociado a tu empresa de práctica.</p><Field label="Período"><input type="month" className={inputClass} onChange={e=>setConfig(v=>({...v,informes:[{periodo:e.target.value,centro:'',tipo:'Gastos'}]}))}/></Field><Field label="Centro de coste"><select className={inputClass} onChange={e=>setConfig(v=>({...v,informes:[{...(v.informes?.[0]??{periodo:'2026-01',tipo:'Gastos'}),centro:e.target.value}]}))}><option value="">Seleccionar</option>{centros.map(x=><option key={x.codigo}>{x.codigo}</option>)}</select></Field><button type="button" className={buttonClass} onClick={guardar} disabled={c.saving}>Guardar informe</button></section>}
        {tab === 'presupuesto' && <section className="space-y-3 border border-[#999] bg-white p-3"><h3 className="font-bold text-[#003366]">Control presupuestario</h3><label className="flex gap-2"><input type="checkbox" checked={config.controlPresupuesto?.[0]?.inicializado??false} onChange={e=>setConfig(v=>({...v,controlPresupuesto:[{inicializado:e.target.checked,alSuperar:v.controlPresupuesto?.[0]?.alSuperar??'Bloquear',ejercicio:v.controlPresupuesto?.[0]?.ejercicio??'2026',controlPor:v.controlPresupuesto?.[0]?.controlPor??'Mensual'}]}))}/>Inicialización del presupuesto</label><div className="grid gap-2 sm:grid-cols-3"><Field label="Al superar presupuesto"><select className={inputClass} value={config.controlPresupuesto?.[0]?.alSuperar??'Bloquear'} onChange={e=>setConfig(v=>({...v,controlPresupuesto:[{...(v.controlPresupuesto?.[0]??{inicializado:false,ejercicio:'2026',controlPor:'Mensual'}),alSuperar:e.target.value}]}))}><option>Bloquear</option><option>Advertir</option></select></Field><Field label="Ejercicio Fiscal"><input className={inputClass} value={config.controlPresupuesto?.[0]?.ejercicio??'2026'} onChange={e=>setConfig(v=>({...v,controlPresupuesto:[{...(v.controlPresupuesto?.[0]??{inicializado:false,alSuperar:'Bloquear',controlPor:'Mensual'}),ejercicio:e.target.value}]}))}/></Field><Field label="Control por"><select className={inputClass} value={config.controlPresupuesto?.[0]?.controlPor??'Mensual'} onChange={e=>setConfig(v=>({...v,controlPresupuesto:[{...(v.controlPresupuesto?.[0]??{inicializado:false,alSuperar:'Bloquear',ejercicio:'2026'}),controlPor:e.target.value}]}))}><option>Mensual</option><option>Anual</option></select></Field></div><button type="button" className={buttonClass} onClick={guardar} disabled={c.saving}>Guardar control</button></section>}
      </div>
    </Screen>
  );
}
