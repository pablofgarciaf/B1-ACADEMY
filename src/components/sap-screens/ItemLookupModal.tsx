'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import type { Item } from '@/lib/firestore-types';
import { usd } from '@/lib/company-calculations';
import { buttonClass, inputClass, Modal, Table } from './SAPControls';
export default function ItemLookupModal({ onSelect, onClose }: { onSelect: (item: Item) => void; onClose: () => void }) {
  const c = useCompany(); const [query, setQuery] = useState(''); const [selected, setSelected] = useState('');
  const rows = c.data.items.filter(i => i.active && `${i.itemCode} ${i.name}`.toLowerCase().includes(query.toLowerCase()));
  const choose = (id: string) => { const item = rows.find(i => i.id === id); if (item) { onSelect(item); onClose(); } };
  return <Modal title="Selección de artículos" onClose={onClose}><input aria-label="Buscar artículo" className={`${inputClass} mb-3`} value={query} onChange={e => setQuery(e.target.value)} /><Table headers={['Código', 'Descripción', 'Stock disponible', 'Precio USD', 'UM']} rows={rows.map(i => [<button key={i.id} className={buttonClass} aria-pressed={selected === i.id} onClick={() => setSelected(i.id)} onDoubleClick={() => choose(i.id)}>{i.itemCode}</button>, i.name, c.data.warehouseStock.filter(s => s.itemCode === i.itemCode).reduce((sum, s) => sum + s.quantity - s.reserved, 0), usd(i.price), i.salesUnit])} /><button className={`${buttonClass} mt-3`} disabled={!selected} onClick={() => choose(selected)}>Seleccionar</button></Modal>;
}
