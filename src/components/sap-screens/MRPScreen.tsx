'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { mrp, today } from '@/lib/company-calculations';
import { Field, inputClass, SaveButton, Screen, Table } from './SAPControls';
export default function MRPScreen() {
  const c = useCompany(); const [vendorCode, setVendor] = useState(''); const rows = mrp(c.data);
  return <Screen title="MRP · Pedidos abiertos y necesidades netas"><p>Explosión de BOM de producción. Descuenta stock disponible y solicitudes/pedidos de compra abiertos para evitar generar faltantes duplicados.</p><Table headers={['Componente', 'Requerido', 'Disponible', 'En compra / solicitud', 'Faltante']} rows={rows.map(r => [r.itemCode, r.required, r.available, r.onOrder, r.shortage])} /><form className="mt-3 space-y-2" onSubmit={async e => { e.preventDefault(); try { await c.save({ action: 'mrp', data: { vendorCode, date: today() } }); } catch { /* Provider error. */ } }}><Field label="Proveedor para solicitud de compra" required><select required className={inputClass} value={vendorCode} onChange={e => setVendor(e.target.value)}><option value="">Seleccionar</option>{c.data.vendors.map(v => <option key={v.id} value={v.cardCode}>{v.name}</option>)}</select></Field><SaveButton disabled={!rows.some(r => r.shortage > 0)} label="Generar solicitud de compra" /></form></Screen>;
}
