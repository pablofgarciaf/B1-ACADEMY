'use client';
import { useEffect, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { Screen, Field, Table, inputClass, buttonClass } from './SAPControls';

interface Recurso {
  codigo: string;
  nombre: string;
  tipo: 'trabajo' | 'maquina';
  capacidadDiaria: number;    // horas/día
  costoPorHora: number;       // USD/hora
  factorEficiencia: number;   // 0-100 %
  tiempoSetup: number;        // minutos
  activo: boolean;
}

const CAPACIDAD_DEFECTO = 8;

function uid() { return 'REC' + Math.random().toString(36).slice(2, 6).toUpperCase(); }

export default function RecursosProduccionScreen({ tipo: tipoProp }: { tipo?: 'trabajo' | 'maquina' }) {
  const c = useCompany();
  const p = c.data.profile;
  const guardados: Recurso[] = ((p as unknown as Record<string, unknown>)?.resources as Recurso[]) ?? [];

  const [tipoFiltro, setTipoFiltro] = useState<'trabajo' | 'maquina'>(tipoProp ?? 'trabajo');
  const [editando, setEditando] = useState<Recurso | null>(null);

  const recursos = guardados.filter(r => r.tipo === tipoFiltro);

  const vacio = (): Recurso => ({
    codigo: uid(), nombre: '', tipo: tipoFiltro,
    capacidadDiaria: CAPACIDAD_DEFECTO, costoPorHora: 0,
    factorEficiencia: 100, tiempoSetup: 0, activo: true,
  });

  const guardar = async () => {
    if (!editando?.nombre) return;
    const sin = guardados.filter(r => r.codigo !== editando.codigo);
    await c.save({ action: 'resourceSave', data: { resources: [...sin, editando] } });
    setEditando(null);
  };

  const eliminar = async (codigo: string) => {
    await c.save({ action: 'resourceSave', data: { resources: guardados.filter(r => r.codigo !== codigo) } });
  };

  const titulo = tipoFiltro === 'trabajo' ? 'Recursos de trabajo (mano de obra)' : 'Recursos de máquina';

  return (
    <Screen title={titulo}>
      <div className="space-y-3">
        {/* Tabs trabajo / máquina */}
        <div className="flex gap-1 border-b border-[#cdd6e1]">
          {(['trabajo', 'maquina'] as const).map(t => (
            <button key={t} type="button" onClick={() => { setTipoFiltro(t); setEditando(null); }}
              className={`px-4 py-1.5 text-sm font-semibold border-b-2 -mb-px ${tipoFiltro === t ? 'border-[#f0ab00] text-[#003366]' : 'border-transparent text-gray-500 hover:text-[#003366]'}`}>
              {t === 'trabajo' ? 'Trabajo' : 'Máquina'}
            </button>
          ))}
          <div className="ml-auto pb-1">
            <button type="button" className={buttonClass} onClick={() => setEditando(vacio())}>+ Nuevo recurso</button>
          </div>
        </div>

        <Table
          headers={['Código', 'Nombre', 'Cap./día (h)', 'Costo/h (USD)', 'Eficiencia', 'T. Setup (min)', 'Activo', '']}
          rows={recursos.map(r => [
            <span key="c" className="font-mono font-bold">{r.codigo}</span>,
            <span key="n">{r.nombre}</span>,
            <span key="cap">{r.capacidadDiaria}</span>,
            <span key="cost">{r.costoPorHora.toFixed(2)}</span>,
            <span key="ef">{r.factorEficiencia} %</span>,
            <span key="setup">{r.tiempoSetup}</span>,
            <span key="act">{r.activo ? '✓' : '—'}</span>,
            <div key="acc" className="flex gap-1">
              <button type="button" className={buttonClass} onClick={() => setEditando({ ...r })}>Editar</button>
              <button type="button" className={`${buttonClass} text-red-700`} onClick={() => eliminar(r.codigo)}>✕</button>
            </div>,
          ])}
        />
        {recursos.length === 0 && !editando && <p className="text-sm text-gray-500 italic">No hay recursos de {tipoFiltro} definidos.</p>}

        {editando && (
          <div className="border border-[#9fb1c7] rounded-sm bg-[#f7f8fa] p-3 space-y-2 max-w-xl">
            <h4 className="font-bold text-[#003366]">
              {tipoFiltro === 'trabajo' ? 'Recurso de trabajo' : 'Recurso de máquina'}
            </h4>
            <div className="grid sm:grid-cols-2 gap-2">
              <Field label="Código"><input className={inputClass} value={editando.codigo} onChange={e => setEditando(v => v ? { ...v, codigo: e.target.value.toUpperCase() } : v)} /></Field>
              <Field label="Nombre" required><input required className={inputClass} value={editando.nombre} onChange={e => setEditando(v => v ? { ...v, nombre: e.target.value } : v)} /></Field>
              <Field label="Capacidad diaria (horas)">
                <input type="number" min={0.5} max={24} step={0.5} className={inputClass} value={editando.capacidadDiaria} onChange={e => setEditando(v => v ? { ...v, capacidadDiaria: Number(e.target.value) } : v)} />
              </Field>
              <Field label="Costo por hora (USD)">
                <input type="number" min={0} step={0.01} className={inputClass} value={editando.costoPorHora} onChange={e => setEditando(v => v ? { ...v, costoPorHora: Number(e.target.value) } : v)} />
              </Field>
              <Field label="Factor de eficiencia (%)">
                <input type="number" min={1} max={200} className={inputClass} value={editando.factorEficiencia} onChange={e => setEditando(v => v ? { ...v, factorEficiencia: Number(e.target.value) } : v)} />
              </Field>
              <Field label="Tiempo de setup (min)">
                <input type="number" min={0} className={inputClass} value={editando.tiempoSetup} onChange={e => setEditando(v => v ? { ...v, tiempoSetup: Number(e.target.value) } : v)} />
              </Field>
            </div>
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="checkbox" className="accent-[#f0ab00]" checked={editando.activo} onChange={e => setEditando(v => v ? { ...v, activo: e.target.checked } : v)} />
              Recurso activo
            </label>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={guardar} disabled={c.saving || !editando.nombre} className={`${buttonClass} font-bold`}>Añadir</button>
              <button type="button" onClick={() => setEditando(null)} className={buttonClass}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </Screen>
  );
}
