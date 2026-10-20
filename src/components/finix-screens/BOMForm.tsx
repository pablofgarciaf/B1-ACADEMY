'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import type { CommandData } from '@/lib/company-commands';
import { usd } from '@/lib/company-calculations';
import { Screen, Field, Navigation, SaveButton, inputClass, buttonClass, Table, NumberInput } from './FinixControls';
export default function BOMForm() {
  const c = useCompany(); const blank = (): CommandData<'bom'> => ({ parentItemCode: '', type: 'production', level: 1, baseQuantity: 1, warehouseCode: c.data.profile?.warehouses?.[0]?.code ?? '01', components: [{ lineType: 'item', itemCode: '', quantity: 1, unit: 'UND', cost: 0, warehouseCode: c.data.profile?.warehouses?.[0]?.code ?? '01' }] });
  const [data, setData] = useState(blank); const [index, setIndex] = useState(-1); const reset = () => { setIndex(-1); setData(blank()); };
  const inventoryItems = c.data.items.filter(i => i.type === 'inventory');
  const items = inventoryItems.length > 0 ? inventoryItems : [
    { id: 'fb-1', itemCode: 'A00001', name: 'Laptop Ensamblada B1', type: 'inventory', purchaseUnit: 'UND', purchasePrice: 500 },
    { id: 'fb-2', itemCode: 'A00007', name: 'Disco Duro SSD 1TB Samsung', type: 'inventory', purchaseUnit: 'UND', purchasePrice: 80 },
    { id: 'fb-3', itemCode: 'A00008', name: 'Memoria RAM 16GB DDR4', type: 'inventory', purchaseUnit: 'UND', purchasePrice: 45 },
  ];
  const resources = ((c.data.profile as unknown as Record<string, unknown>)?.resources as {codigo:string;nombre:string;costoPorHora?:number;unidad?:string;activo?:boolean}[]|undefined)?.filter(resource => resource.activo !== false) ?? [];
  const warehouses = c.data.profile?.warehouses?.length ? c.data.profile.warehouses : [{code:'01',name:'Bodega Central'}];
  return <Screen title="Lista de materiales (BOM)">
    <Navigation count={c.data.boms.length} index={index} onNew={reset} onSelect={i => {
      setIndex(i);
      const b = c.data.boms[i];
      if (b) {
        setData({
          parentItemCode: b.parentItemCode ?? '', level: b.level ?? 1, baseQuantity: b.baseQuantity ?? 1, warehouseCode: b.warehouseCode ?? '01',
          type: b.type ?? 'production',
          components: (b.components ?? []).map(comp => ({
            lineNumber: comp.lineNumber, lineType: comp.lineType ?? 'item', itemCode: comp.itemCode ?? '', description: comp.description,
            quantity: comp.quantity ?? 1,
            unit: comp.unit ?? 'UND',
            cost: comp.cost ?? 0, warehouseCode: comp.warehouseCode ?? b.warehouseCode ?? '01'
          }))
        });
      }
    }} />
    <form className="space-y-3" onSubmit={async e => { e.preventDefault(); try { await c.save({ action: 'bom', data }); reset(); } catch { /* Provider error. */ } }}>
      <fieldset disabled={c.saving || index >= 0} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Producto padre" required>
            <select required className={inputClass} value={data.parentItemCode ?? ''} onChange={e => setData(d => ({ ...d, parentItemCode: e.target.value }))}>
              <option value="">Seleccionar</option>
              {items.map(i => <option key={i.id} value={i.itemCode}>{i.name}</option>)}
            </select>
          </Field>
          <Field label="Tipo">
            <select className={inputClass} value={data.type ?? 'production'} onChange={e => setData(d => ({ ...d, type: e.target.value as CommandData<'bom'>['type'] }))}>
              <option value="production">Producción</option>
              <option value="template">Plantilla</option>
              <option value="sales">Ventas</option>
            </select>
          </Field>
          <Field label="Nivel"><NumberInput min={1} value={data.level ?? 1} onChange={value => setData(current => ({...current,level:value}))} /></Field>
          <Field label="Cantidad base"><NumberInput min={0.000001} value={data.baseQuantity ?? 1} onChange={value => setData(current => ({...current,baseQuantity:value}))} /></Field>
          <Field label="Almacén"><select className={inputClass} value={data.warehouseCode ?? '01'} onChange={event => setData(current => ({...current,warehouseCode:event.target.value}))}>{warehouses.map(warehouse => <option key={warehouse.code} value={warehouse.code}>{warehouse.code} · {warehouse.name}</option>)}</select></Field>
        </div>
        <Table headers={['Tipo', 'Componente o recurso *', 'Cantidad *', 'UM', 'Almacén', 'Costo unitario', 'Acción']} rows={data.components.map((line, i) => [
          <select key="type" className={inputClass} value={line.lineType ?? 'item'} onChange={event => setData(current => ({...current,components:current.components.map((component,index) => index===i ? {...component,lineType:event.target.value as 'item'|'resource',itemCode:'',description:undefined,cost:0,unit:event.target.value==='resource'?'Horas':'UND'} : component)}))}><option value="item">Artículo</option><option value="resource">Recurso</option></select>,
          <select key="item" aria-label={'Componente ' + (i + 1)} required className={inputClass} value={line.itemCode ?? ''} onChange={e => { const resource = resources.find(candidate => candidate.codigo === e.target.value); const article = items.find(candidate => candidate.itemCode === e.target.value); const isResource = line.lineType === 'resource'; setData(d => ({ ...d, components: d.components.map((l, j) => j === i ? { ...l, itemCode: e.target.value, description: isResource ? resource?.nombre ?? e.target.value : article?.name ?? e.target.value, unit: isResource ? resource?.unidad ?? 'Horas' : article?.purchaseUnit ?? 'UND', cost: isResource ? resource?.costoPorHora ?? 0 : article?.purchasePrice ?? 0 } : l) })); }}>
            <option value="">Seleccionar</option>
            {line.lineType === 'resource' ? resources.map(resource => <option key={resource.codigo} value={resource.codigo}>{resource.codigo} · {resource.nombre}</option>) : items.filter(item => item.itemCode !== data.parentItemCode).map(item => <option key={item.id} value={item.itemCode}>{item.itemCode} · {item.name}</option>)}
          </select>,
          <NumberInput key="qty" ariaLabel={'Cantidad ' + (i + 1)} required min={0.000001} value={line.quantity ?? 1} onChange={val => setData(d => ({ ...d, components: d.components.map((l, j) => j === i ? { ...l, quantity: val } : l) }))} />,
          line.unit ?? 'UND',
          <select key="warehouse" className={inputClass} disabled={line.lineType==='resource'} value={line.warehouseCode ?? data.warehouseCode ?? '01'} onChange={event => setData(current => ({...current,components:current.components.map((component,index) => index===i?{...component,warehouseCode:event.target.value}:component)}))}>{warehouses.map(warehouse => <option key={warehouse.code} value={warehouse.code}>{warehouse.code}</option>)}</select>,
          <NumberInput key="cost" ariaLabel={'Costo ' + (i + 1)} min={0} value={line.cost ?? 0} onChange={val => setData(d => ({ ...d, components: d.components.map((l, j) => j === i ? { ...l, cost: val } : l) }))} />,
          <button key="remove" type="button" disabled={data.components.length === 1} className={buttonClass} onClick={() => setData(d => ({ ...d, components: d.components.filter((_, j) => i !== j) }))}>✕</button>
        ])} />
        <button type="button" className={buttonClass} onClick={() => setData(d => ({ ...d, components: [...d.components, { lineType: 'item', itemCode: '', quantity: 1, unit: 'UND', cost: 0, warehouseCode: d.warehouseCode }] }))}>+ Línea</button>
      </fieldset>
      <p>Costo estimado total: {usd(data.components.reduce((s, l) => s + (l.quantity || 0) * (l.cost || 0), 0))}</p>
      <SaveButton disabled={index >= 0} />
    </form>
  </Screen>;
}
