'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import type { Customer, Vendor } from '@/lib/firestore-types';
import { usd } from '@/lib/company-calculations';
import { buttonClass, inputClass, Modal, Table } from './FinixControls';
import CompanyPartnerForm from './CompanyPartnerForm';

export function PartnerLookup({ vendor = false, onSelect, onClose }: { vendor?: boolean; onSelect: (partner: Customer | Vendor) => void; onClose: () => void }) {
  const c = useCompany(); 
  const [query, setQuery] = useState(''); 
  const [selected, setSelected] = useState(''); 
  const [create, setCreate] = useState(false);
  const rows = (vendor ? c.data.vendors : c.data.customers).filter(p => `${p.cardCode} ${p.name} ${p.ruc}`.toLowerCase().includes(query.toLowerCase()));
  
  const choose = (idOrCode: string) => { 
    const row = rows.find(p => (p.id && p.id === idOrCode) || p.cardCode === idOrCode); 
    if (row) { 
      onSelect(row); 
      onClose(); 
    } 
  };

  return (
    <Modal title={vendor ? 'Selección de proveedores' : 'Selección de clientes'} onClose={onClose}>
      {create ? (
        <>
          <CompanyPartnerForm vendor={vendor} />
          <button className={buttonClass + ' mt-3'} onClick={() => setCreate(false)}>Volver a la lista</button>
        </>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <input 
              aria-label="Buscar por código o nombre" 
              placeholder="Buscar por código, nombre o RUC..."
              className={`${inputClass} flex-1`} 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              autoFocus
            />
            <button className={buttonClass} onClick={() => setCreate(true)}>
              {vendor ? '+ Nuevo proveedor' : '+ Nuevo cliente'}
            </button>
          </div>
          <div className="text-[11px] text-slate-500 italic">
            💡 Haz clic en cualquier fila o en el botón «Elegir» para seleccionar al socio de negocios.
          </div>
          <Table 
            headers={['Código', 'Nombre del Socio', 'RUC / Cédula', 'Saldo', 'Estado', 'Acción']} 
            rows={rows.map(p => {
              const partnerKey = p.id || p.cardCode;
              const isSelected = selected === partnerKey;
              return [
                <button 
                  key="code"
                  type="button" 
                  className={`font-mono font-bold text-left px-2 py-1 rounded ${isSelected ? 'bg-blue-600 text-white' : 'text-[#0055A5] hover:underline'}`}
                  onClick={() => choose(partnerKey)}
                >
                  {p.cardCode}
                </button>,
                <span 
                  key="name" 
                  className="font-medium cursor-pointer hover:text-[#0055A5]"
                  onClick={() => choose(partnerKey)}
                >
                  {p.name}
                </span>,
                <span key="ruc" className="font-mono text-xs">{p.ruc}</span>,
                usd(p.balance),
                <span key="act" className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${p.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                  {p.active ? 'Activo' : 'Inactivo'}
                </span>,
                <button 
                  key="pick"
                  type="button" 
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#0055A5] text-white hover:bg-[#004080] transition active:scale-95 shadow-2xs"
                  onClick={() => choose(partnerKey)}
                >
                  Elegir
                </button>
              ];
            })} 
          />
        </div>
      )}
    </Modal>
  );
}

export default function CustomerLookupModal({ onSelect, onClose }: { onSelect: (partner: Customer) => void; onClose: () => void }) { 
  return <PartnerLookup onSelect={p => onSelect(p as Customer)} onClose={onClose} />; 
}
