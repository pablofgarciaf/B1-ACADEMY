'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import type { Item } from '@/lib/firestore-types';
import { usd } from '@/lib/company-calculations';
import { buttonClass, inputClass, Modal, Table } from './FinixControls';

export default function ItemLookupModal({ onSelect, onClose }: { onSelect: (item: Item) => void; onClose: () => void }) {
  const c = useCompany(); 
  const [query, setQuery] = useState(''); 
  const [selected, setSelected] = useState('');
  const rows = c.data.items.filter(i => i.active && `${i.itemCode} ${i.name}`.toLowerCase().includes(query.toLowerCase()));
  
  const choose = (idOrCode: string) => { 
    const item = rows.find(i => (i.id && i.id === idOrCode) || i.itemCode === idOrCode); 
    if (item) { 
      onSelect(item); 
      onClose(); 
    } 
  };

  return (
    <Modal title="Selección de artículos" onClose={onClose}>
      <div className="space-y-3">
        <input 
          aria-label="Buscar artículo" 
          placeholder="Buscar por código de artículo o descripción..."
          className={`${inputClass} w-full`} 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
          autoFocus
        />
        <div className="text-[11px] text-slate-500 italic">
          💡 Haz clic en cualquier artículo o en el botón «Elegir» para añadirlo a la línea del documento.
        </div>
        <Table 
          headers={['Código', 'Descripción', 'Stock disponible', 'Precio USD', 'UM', 'Acción']} 
          rows={rows.map(i => {
            const itemKey = i.id || i.itemCode;
            const isSelected = selected === itemKey;
            const stockDisp = c.data.warehouseStock.filter(s => s.itemCode === i.itemCode).reduce((sum, s) => sum + s.quantity - s.reserved, 0);
            return [
              <button 
                key="code"
                type="button"
                className={`font-mono font-bold text-left px-2 py-1 rounded ${isSelected ? 'bg-blue-600 text-white' : 'text-[#0055A5] hover:underline'}`}
                onClick={() => choose(itemKey)}
              >
                {i.itemCode}
              </button>,
              <span 
                key="name" 
                className="font-medium cursor-pointer hover:text-[#0055A5]"
                onClick={() => choose(itemKey)}
              >
                {i.name}
              </span>,
              <span key="stock" className="font-bold text-slate-800">{stockDisp}</span>,
              usd(i.price),
              i.salesUnit || 'UND',
              <button 
                key="pick"
                type="button" 
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#0055A5] text-white hover:bg-[#004080] transition active:scale-95 shadow-2xs"
                onClick={() => choose(itemKey)}
              >
                Elegir
              </button>
            ];
          })} 
        />
      </div>
    </Modal>
  );
}
