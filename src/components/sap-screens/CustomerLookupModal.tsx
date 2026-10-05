'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import type { Customer, Vendor } from '@/lib/firestore-types';
import { usd } from '@/lib/company-calculations';
import { buttonClass, inputClass, Modal, Table } from './SAPControls';
import CompanyPartnerForm from './CompanyPartnerForm';

export function PartnerLookup({ vendor = false, onSelect, onClose }: { vendor?: boolean; onSelect: (partner: Customer | Vendor) => void; onClose: () => void }) {
  const c = useCompany(); const [query, setQuery] = useState(''); const [selected, setSelected] = useState(''); const [create, setCreate] = useState(false);
  const rows = (vendor ? c.data.vendors : c.data.customers).filter(p => `${p.cardCode} ${p.name} ${p.ruc}`.toLowerCase().includes(query.toLowerCase()));
  const choose = (id: string) => { const row = rows.find(p => p.id === id); if (row) { onSelect(row); onClose(); } };
  return <Modal title={vendor ? 'Selección de proveedores' : 'Selección de clientes'} onClose={onClose}>{create ? <><CompanyPartnerForm vendor={vendor} /><button className={buttonClass} onClick={() => setCreate(false)}>Volver a la lista</button></> : <><input aria-label="Buscar por código o nombre" className={`${inputClass} mb-3`} value={query} onChange={e => setQuery(e.target.value)} /><Table headers={['Código', 'Nombre', 'RUC', 'Saldo', 'Estado']} rows={rows.map(p => [<button key={p.id} type="button" aria-pressed={selected === p.id} className={`${buttonClass} ${selected === p.id ? 'font-bold' : ''}`} onClick={() => setSelected(p.id)} onDoubleClick={() => choose(p.id)}>{p.cardCode}</button>, p.name, p.ruc, usd(p.balance), p.active ? 'Activo' : 'Inactivo'])} /><div className="mt-3 flex gap-2"><button disabled={!selected} className={buttonClass} onClick={() => choose(selected)}>Seleccionar</button><button className={buttonClass} onClick={() => setCreate(true)}>{vendor ? 'Nuevo proveedor' : 'Nuevo cliente'}</button></div></>}</Modal>;
}
export default function CustomerLookupModal({ onSelect, onClose }: { onSelect: (partner: Customer) => void; onClose: () => void }) { return <PartnerLookup onSelect={p => { if ('kind' in p) onSelect(p); }} onClose={onClose} />; }
