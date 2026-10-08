'use client';
import { useEffect, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { Screen, Field, Table, inputClass, buttonClass } from './SAPControls';

interface Grupo { codigo: string; nombre: string; descripcion: string }

export default function GruposScreen({ tipo }: { tipo: 'cliente' | 'articulo' }) {
  const c = useCompany();
  const p = c.data.profile;
  const key = tipo === 'cliente' ? 'customerGroups' : 'itemGroups';
  const titulo = tipo === 'cliente' ? 'Grupos de clientes' : 'Grupos de artículos';
  const guardados: Grupo[] = ((p as unknown as Record<string, unknown>)?.[key] as Grupo[]) ?? [];

  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [editando, setEditando] = useState<Grupo | null>(null);

  useEffect(() => { setGrupos(guardados); }, [guardados.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const vacio = (): Grupo => ({ codigo: '', nombre: '', descripcion: '' });

  const guardar = async () => {
    if (!editando || !editando.codigo || !editando.nombre) return;
    const sinActual = grupos.filter(g => g.codigo !== editando.codigo);
    const nueva = [...sinActual, editando];
    await c.save({ action: tipo === 'cliente' ? 'customerGroupSave' : 'itemGroupSave', data: { groups: nueva } });
    setEditando(null);
  };

  const eliminar = async (codigo: string) => {
    const nueva = grupos.filter(g => g.codigo !== codigo);
    await c.save({ action: tipo === 'cliente' ? 'customerGroupSave' : 'itemGroupSave', data: { groups: nueva } });
  };

  return (
    <Screen title={titulo}>
      <div className="space-y-3">
        <div className="flex justify-end">
          <button type="button" className={buttonClass} onClick={() => setEditando(vacio())}>+ Nuevo grupo</button>
        </div>

        <Table
          headers={['Código', 'Nombre', 'Descripción', '']}
          rows={grupos.map(g => [
            <span key="c" className="font-mono font-bold">{g.codigo}</span>,
            <span key="n">{g.nombre}</span>,
            <span key="d" className="text-gray-500">{g.descripcion}</span>,
            <div key="a" className="flex gap-1">
              <button type="button" className={buttonClass} onClick={() => setEditando({ ...g })}>Editar</button>
              <button type="button" className={`${buttonClass} text-red-700`} onClick={() => eliminar(g.codigo)}>✕</button>
            </div>,
          ])}
        />
        {grupos.length === 0 && !editando && (
          <p className="text-sm text-gray-500 italic">No hay grupos de {tipo === 'cliente' ? 'clientes' : 'artículos'} definidos.</p>
        )}

        {editando && (
          <div className="border border-[#9fb1c7] rounded-sm bg-[#f7f8fa] p-3 space-y-2 max-w-md">
            <h4 className="font-bold text-[#003366]">Nuevo grupo de {tipo === 'cliente' ? 'clientes' : 'artículos'}</h4>
            <Field label="Código" required>
              <input required maxLength={8} className={inputClass} value={editando.codigo} onChange={e => setEditando(v => v ? { ...v, codigo: e.target.value.toUpperCase() } : v)} placeholder="EDU" />
            </Field>
            <Field label="Nombre" required>
              <input required minLength={2} className={inputClass} value={editando.nombre} onChange={e => setEditando(v => v ? { ...v, nombre: e.target.value } : v)} placeholder="Escuelas" />
            </Field>
            <Field label="Descripción">
              <input className={inputClass} value={editando.descripcion} onChange={e => setEditando(v => v ? { ...v, descripcion: e.target.value } : v)} />
            </Field>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={guardar} disabled={c.saving || !editando.codigo || !editando.nombre} className={`${buttonClass} font-bold`}>Añadir</button>
              <button type="button" onClick={() => setEditando(null)} className={buttonClass}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </Screen>
  );
}
