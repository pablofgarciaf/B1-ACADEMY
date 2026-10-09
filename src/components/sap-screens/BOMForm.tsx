'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import type { CommandData } from '@/lib/company-commands';
import { usd } from '@/lib/company-calculations';
import { Screen, Field, Navigation, SaveButton, inputClass, buttonClass, Table, NumberInput } from './SAPControls';
export default function BOMForm() {
  const c = useCompany(); const blank = (): CommandData<'bom'> => ({ parentItemCode: '', type: 'production', components: [{ itemCode: '', quantity: 1, unit: 'UND', cost: 0 }] });
  const [data, setData] = useState(blank); const [index, setIndex] = useState(-1); const reset = () => { setIndex(-1); setData(blank()); };
  const inventoryItems = c.data.items.filter(i => i.type === 'inventory');
  const items = inventoryItems.length > 0 ? inventoryItems : [
    { id: 'fb-1', itemCode: 'A00001', name: 'Laptop Ensamblada B1', type: 'inventory', purchaseUnit: 'UND', purchasePrice: 500 },
    { id: 'fb-2', itemCode: 'A00007', name: 'Disco Duro SSD 1TB Samsung', type: 'inventory', purchaseUnit: 'UND', purchasePrice: 80 },
    { id: 'fb-3', itemCode: 'A00008', name: 'Memoria RAM 16GB DDR4', type: 'inventory', purchaseUnit: 'UND', purchasePrice: 45 },
  ];
  return <Screen title="Lista de materiales (BOM)">
    <Navigation count={c.data.boms.length} index={index} onNew={reset} onSelect={i => {
      setIndex(i);
      const b = c.data.boms[i];
      if (b) {
        setData({
          parentItemCode: b.parentItemCode ?? '',
          type: b.type ?? 'production',
          components: (b.components ?? []).map(comp => ({
            itemCode: comp.itemCode ?? '',
            quantity: comp.quantity ?? 1,
            unit: comp.unit ?? 'UND',
            cost: comp.cost ?? 0
          }))
        });
      }
    }} />
    <form className="space-y-3" onSubmit={async e => { e.preventDefault(); try { await c.save({ action: 'bom', data }); reset(); } catch { /* Provider error. */ } }}>
      <fieldset disabled={c.saving || index >= 0} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
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
        </div>
        <Table headers={['Componente *', 'Cantidad *', 'UM', 'Costo unitario', 'Acción']} rows={data.components.map((line, i) => [
          <select key="item" aria-label={'Componente ' + (i + 1)} required className={inputClass} value={line.itemCode ?? ''} onChange={e => { const item = items.find(a => a.itemCode === e.target.value); setData(d => ({ ...d, components: d.components.map((l, j) => j === i ? { ...l, itemCode: e.target.value, unit: item?.purchaseUnit ?? 'UND', cost: item?.purchasePrice ?? 0 } : l) })); }}>
            <option value="">Seleccionar</option>
            {items.filter(item => item.itemCode !== data.parentItemCode).map(item => <option key={item.id} value={item.itemCode}>{item.name}</option>)}
          </select>,
          <NumberInput key="qty" ariaLabel={'Cantidad ' + (i + 1)} required min={0.000001} value={line.quantity ?? 1} onChange={val => setData(d => ({ ...d, components: d.components.map((l, j) => j === i ? { ...l, quantity: val } : l) }))} />,
          line.unit ?? 'UND',
          <NumberInput key="cost" ariaLabel={'Costo ' + (i + 1)} min={0} value={line.cost ?? 0} onChange={val => setData(d => ({ ...d, components: d.components.map((l, j) => j === i ? { ...l, cost: val } : l) }))} />,
          <button key="remove" type="button" disabled={data.components.length === 1} className={buttonClass} onClick={() => setData(d => ({ ...d, components: d.components.filter((_, j) => i !== j) }))}>✕</button>
        ])} />
        <button type="button" className={buttonClass} onClick={() => setData(d => ({ ...d, components: [...d.components, { itemCode: '', quantity: 1, unit: 'UND', cost: 0 }] }))}>+ Componente</button>
      </fieldset>
      <p>Costo estimado total: {usd(data.components.reduce((s, l) => s + (l.quantity || 0) * (l.cost || 0), 0))}</p>
      <SaveButton disabled={index >= 0} />
    </form>
  </Screen>;
}
