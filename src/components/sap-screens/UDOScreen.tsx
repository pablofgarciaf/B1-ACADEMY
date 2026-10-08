'use client';
import { useEffect, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { Screen, Field, Table, inputClass, buttonClass } from './SAPControls';

interface UDOField { nombre: string; tipo: 'Texto' | 'Número' | 'Fecha' | 'Lista' | 'Sí/No'; descripcion: string }
interface UDOTable { codigo: string; nombre: string; campos: UDOField[]; registros: Record<string, string>[] }

const TIPOS_CAMPO = ['Texto', 'Número', 'Fecha', 'Lista', 'Sí/No'] as const;

export default function UDOScreen() {
  const c = useCompany();
  const p = c.data.profile;
  const guardados: UDOTable[] = ((p as unknown as Record<string, unknown>)?.udoTables as UDOTable[]) ?? [];

  const [tablas, setTablas] = useState<UDOTable[]>([]);
  const [seleccionada, setSeleccionada] = useState<UDOTable | null>(null);
  const [nuevoCampo, setNuevoCampo] = useState<UDOField>({ nombre: '', tipo: 'Texto', descripcion: '' });
  const [nuevaTabla, setNuevaTabla] = useState({ codigo: '', nombre: '' });
  const [modoNuevaTabla, setModoNuevaTabla] = useState(false);
  const [nuevoReg, setNuevoReg] = useState<Record<string, string>>({});

  useEffect(() => { setTablas(guardados); }, [guardados.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const guardarTablas = async (ts: UDOTable[]) => {
    await c.save({ action: 'udoSave', data: { tables: ts } });
    setTablas(ts);
  };

  const crearTabla = async () => {
    if (!nuevaTabla.codigo || !nuevaTabla.nombre) return;
    const t: UDOTable = { codigo: nuevaTabla.codigo.toUpperCase(), nombre: nuevaTabla.nombre, campos: [], registros: [] };
    const ts = [...tablas, t];
    await guardarTablas(ts);
    setSeleccionada(t);
    setModoNuevaTabla(false);
    setNuevaTabla({ codigo: '', nombre: '' });
  };

  const agregarCampo = async () => {
    if (!seleccionada || !nuevoCampo.nombre) return;
    const campos = [...seleccionada.campos, nuevoCampo];
    const ts = tablas.map(t => t.codigo === seleccionada.codigo ? { ...t, campos } : t);
    await guardarTablas(ts);
    setSeleccionada(t => t ? { ...t, campos } : t);
    setNuevoCampo({ nombre: '', tipo: 'Texto', descripcion: '' });
  };

  const agregarRegistro = async () => {
    if (!seleccionada) return;
    const registros = [...seleccionada.registros, nuevoReg];
    const ts = tablas.map(t => t.codigo === seleccionada.codigo ? { ...t, registros } : t);
    await guardarTablas(ts);
    setSeleccionada(t => t ? { ...t, registros } : t);
    setNuevoReg({});
  };

  return (
    <Screen title="Objetos definidos por el usuario (UDO)">
      <div className="space-y-3">
        <div className="flex gap-2">
          <button type="button" className={buttonClass} onClick={() => setModoNuevaTabla(true)}>+ Nueva tabla UDO</button>
        </div>

        {modoNuevaTabla && (
          <div className="border border-[#9fb1c7] rounded-sm bg-[#f7f8fa] p-3 space-y-2 max-w-sm">
            <h4 className="font-bold text-[#003366]">Nueva tabla UDO</h4>
            <Field label="Código de tabla"><input className={inputClass} value={nuevaTabla.codigo} onChange={e => setNuevaTabla(v => ({ ...v, codigo: e.target.value }))} placeholder="CONDUCTORES" /></Field>
            <Field label="Nombre descriptivo"><input className={inputClass} value={nuevaTabla.nombre} onChange={e => setNuevaTabla(v => ({ ...v, nombre: e.target.value }))} placeholder="Tabla de conductores" /></Field>
            <div className="flex gap-2">
              <button type="button" onClick={crearTabla} disabled={!nuevaTabla.codigo || !nuevaTabla.nombre} className={`${buttonClass} font-bold`}>Crear tabla</button>
              <button type="button" onClick={() => setModoNuevaTabla(false)} className={buttonClass}>Cancelar</button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {tablas.map(t => (
            <button key={t.codigo} type="button"
              onClick={() => { setSeleccionada({ ...t }); setNuevoReg({}); }}
              className={`px-3 py-1 text-sm border rounded-sm ${seleccionada?.codigo === t.codigo ? 'bg-[#003366] text-white border-[#003366]' : 'bg-white border-[#9fb1c7] hover:bg-[#e8f1fb]'}`}>
              {t.codigo} — {t.nombre}
            </button>
          ))}
        </div>

        {seleccionada && (
          <div className="space-y-3">
            <h3 className="font-bold text-[#003366]">{seleccionada.nombre} ({seleccionada.codigo})</h3>

            {/* Campos */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-1">CAMPOS DE LA TABLA</p>
              <Table
                headers={['Nombre', 'Tipo', 'Descripción']}
                rows={seleccionada.campos.map(f => [f.nombre, f.tipo, f.descripcion || '—'])}
              />
              {seleccionada.campos.length === 0 && <p className="text-xs text-gray-400 italic">Sin campos. Agrega uno abajo.</p>}
              <div className="flex flex-wrap gap-2 items-end mt-2">
                <Field label="Nombre campo"><input className={inputClass} value={nuevoCampo.nombre} onChange={e => setNuevoCampo(v => ({ ...v, nombre: e.target.value }))} placeholder="Nombre conductor" /></Field>
                <Field label="Tipo">
                  <select className={inputClass} value={nuevoCampo.tipo} onChange={e => setNuevoCampo(v => ({ ...v, tipo: e.target.value as typeof nuevoCampo.tipo }))}>
                    {TIPOS_CAMPO.map(t => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Descripción"><input className={inputClass} value={nuevoCampo.descripcion} onChange={e => setNuevoCampo(v => ({ ...v, descripcion: e.target.value }))} /></Field>
                <div className="pb-0.5"><button type="button" onClick={agregarCampo} disabled={!nuevoCampo.nombre} className={buttonClass}>+ Agregar campo</button></div>
              </div>
            </div>

            {/* Registros */}
            {seleccionada.campos.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">REGISTROS</p>
                <Table
                  headers={seleccionada.campos.map(f => f.nombre)}
                  rows={seleccionada.registros.map(r => seleccionada.campos.map(f => r[f.nombre] ?? '—'))}
                />
                <div className="flex flex-wrap gap-2 items-end mt-2">
                  {seleccionada.campos.map(f => (
                    <Field key={f.nombre} label={f.nombre}>
                      <input className={inputClass} value={nuevoReg[f.nombre] ?? ''} onChange={e => setNuevoReg(r => ({ ...r, [f.nombre]: e.target.value }))} />
                    </Field>
                  ))}
                  <div className="pb-0.5"><button type="button" onClick={agregarRegistro} className={buttonClass}>+ Agregar registro</button></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Screen>
  );
}
