'use client';
import { useEffect, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { Screen, Field, Table, inputClass, buttonClass } from './FinixControls';

interface Grupo { codigo: string; nombre: string; descripcion: string; defaultPriceList?: string; uomGroup?: string; inventoryUnit?: string; costingMethod?: string; perWarehouse?: boolean; perpetualInventory?: boolean; inventoryAccount?:string;incomeAccount?:string;costAccount?:string }

export default function GruposScreen({ tipo }: { tipo: 'cliente' | 'articulo' }) {
  const c = useCompany();
  const p = c.data.profile;
  const key = tipo === 'cliente' ? 'customerGroups' : 'itemGroups';
  const titulo = tipo === 'cliente' ? 'Grupos de clientes' : 'Grupos de artículos';
  const guardados: Grupo[] = ((p as unknown as Record<string, unknown>)?.[key] as Grupo[]) ?? [];

  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [editando, setEditando] = useState<Grupo | null>(null);

  useEffect(() => { setGrupos(guardados); }, [guardados.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const vacio = (): Grupo => ({ codigo: '', nombre: '', descripcion: '', defaultPriceList: '', uomGroup: '', inventoryUnit: 'UND', costingMethod:'average', perWarehouse:false, perpetualInventory:true });

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
          headers={['Código', 'Nombre', 'Descripción', tipo === 'cliente' ? 'Lista predeterminada' : 'Unidades', '']}
          rows={grupos.map(g => [
            <span key="c" className="font-mono font-bold">{g.codigo}</span>,
            <span key="n">{g.nombre}</span>,
            <span key="d" className="text-gray-500">{g.descripcion}</span>,
            <span key="x" className="text-gray-500">{tipo === 'cliente' ? g.defaultPriceList || '—' : `${g.uomGroup || '—'} · ${g.inventoryUnit || '—'}`}</span>,
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
            {tipo === 'cliente' ? <Field label="Lista de precio predeterminada"><input className={inputClass} value={editando.defaultPriceList ?? ''} onChange={e => setEditando(v => v ? { ...v, defaultPriceList: e.target.value } : v)} placeholder="Lista Especial EDU" /></Field> : <><Field label="Grupo UM"><input className={inputClass} value={editando.uomGroup ?? ''} onChange={e => setEditando(v => v ? { ...v, uomGroup: e.target.value } : v)} placeholder="CABLES" /></Field><Field label="UM inventario"><input className={inputClass} value={editando.inventoryUnit ?? ''} onChange={e => setEditando(v => v ? { ...v, inventoryUnit: e.target.value } : v)} placeholder="Metro" /></Field></>}
            <div className="flex gap-2 pt-1">
              {tipo==='articulo'&&(['inventoryAccount','incomeAccount','costAccount'] as const).map((key,i)=><Field key={key} label={['Cuenta de existencias','Cuenta de ingresos','Cuenta de costos'][i]}><select className={inputClass} value={editando[key]??''} onChange={e=>setEditando(v=>v?{...v,[key]:e.target.value}:v)}><option value="">Cuenta predeterminada</option>{c.data.chartOfAccounts.filter(a=>a.active&&a.postable&&a.category===['asset','income','cost'][i]).map(a=><option key={a.code} value={a.code}>{a.code} · {a.name}</option>)}</select></Field>)}
              {tipo==='articulo'&&<div className="space-y-2"><Field label="Método de valoración"><select className={inputClass} value={editando.costingMethod??'average'} onChange={e=>setEditando(v=>v?{...v,costingMethod:e.target.value}:v)}><option value="average">Promedio variable</option><option value="standard">Estándar</option><option value="fifo">FIFO</option></select></Field><label><input type="checkbox" checked={editando.perWarehouse??false} onChange={e=>setEditando(v=>v?{...v,perWarehouse:e.target.checked}:v)}/> Gestionar por almacén</label><label><input type="checkbox" checked={editando.perpetualInventory??true} onChange={e=>setEditando(v=>v?{...v,perpetualInventory:e.target.checked}:v)}/> Inventario permanente</label></div>}
              <button type="button" onClick={guardar} disabled={c.saving || !editando.codigo || !editando.nombre} className={`${buttonClass} font-bold`}>Añadir</button>
              <button type="button" onClick={() => setEditando(null)} className={buttonClass}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </Screen>
  );
}
