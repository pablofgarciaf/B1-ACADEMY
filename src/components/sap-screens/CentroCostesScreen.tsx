'use client';
import { useEffect, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { Screen, Field, Table, inputClass, buttonClass } from './SAPControls';

interface CentroCoste { codigo: string; nombre: string; tipo: string; cuentas: string[] }
interface NormaReparto { codigo: string; nombre: string; centros: { codigo: string; porcentaje: number }[] }

const TIPOS = ['Ventas', 'Producción', 'Administración', 'Logística', 'Soporte', 'General'];

function uid() { return Math.random().toString(36).slice(2, 8).toUpperCase(); }

export default function CentroCostesScreen() {
  const c = useCompany();
  const p = c.data.profile;
  const data = (p as unknown as Record<string, unknown>)?.costCenters as { centros: CentroCoste[]; normas: NormaReparto[] } | undefined;

  const [centros, setCentros] = useState<CentroCoste[]>([]);
  const [normas, setNormas] = useState<NormaReparto[]>([]);
  const [editCC, setEditCC] = useState<CentroCoste | null>(null);
  const [editNorma, setEditNorma] = useState<NormaReparto | null>(null);
  const [tab, setTab] = useState<'centros' | 'normas'>('centros');

  useEffect(() => {
    setCentros(data?.centros ?? []);
    setNormas(data?.normas ?? []);
  }, [data]);

  const guardar = async () => {
    await c.save({ action: 'costCentersSave', data: { centros, normas } });
  };

  const addCC = () => setEditCC({ codigo: uid(), nombre: '', tipo: 'Ventas', cuentas: [] });

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
    await c.save({ action: 'costCentersSave', data: { centros, normas: nuevas } });
    setEditNorma(null);
  };

  return (
    <Screen title="Centros de coste">
      <div className="space-y-3">
        <div className="flex gap-1 border-b border-[#cdd6e1]">
          {(['centros', 'normas'] as const).map(t => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={`px-4 py-1.5 text-sm font-semibold border-b-2 -mb-px ${tab === t ? 'border-[#f0ab00] text-[#003366]' : 'border-transparent text-gray-500 hover:text-[#003366]'}`}>
              {t === 'centros' ? 'Centros de coste' : 'Normas de reparto'}
            </button>
          ))}
        </div>

        {tab === 'centros' && (
          <>
            <div className="flex justify-end">
              <button type="button" className={buttonClass} onClick={addCC}>+ Nuevo centro de coste</button>
            </div>
            <Table
              headers={['Código', 'Nombre', 'Tipo', '']}
              rows={centros.map(cc => [
                <span key="c" className="font-mono font-bold">{cc.codigo}</span>,
                <span key="n">{cc.nombre}</span>,
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
      </div>
    </Screen>
  );
}
