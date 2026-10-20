'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import type { CommandData } from '@/lib/company-commands';
import { MasterForm, Field, inputClass, buttonClass, type FieldDefinition } from './FinixControls';

export default function CompanyPartnerForm({ vendor = false }: { vendor?: boolean }) {
  const c = useCompany();
  const privateCompany = c.data.profile?.usage === 'private';
  const [customerCode, setCustomerCode] = useState('');
  const [vendorCode, setVendorCode] = useState('');
  const initial: CommandData<'vendor'> & { kind: 'customer' | 'lead'; cardCode: string; ownerCode: string } = { cardCode: '', ownerCode: '', rimpe: 'ninguno', subjectToWithholding: false, withholdingTax: '', vatWithholdingGroup: '', vatWithholdingCode: '', fiscalCategory: '', partnerClass: 'Proveedor', name: privateCompany ? '' : 'NovaTech', ruc: privateCompany ? '' : '1792456789001', email: privateCompany ? '' : 'contacto@novatech.ec', phone: privateCompany ? '' : '022345678', address: privateCompany ? '' : 'Av. Solano y 10 de Agosto', city: privateCompany ? '' : 'Cuenca', contactName: privateCompany ? '' : 'Ing. Carlos Pérez', currency: 'USD', paymentTermsDays: 30, creditLimit: privateCompany ? 0 : 5000, active: true, group: 'Nacional', notes: '', kind: 'customer' };
  const fields: FieldDefinition<typeof initial>[] = [
    { key: 'name', label: 'Razón social', required: true }, { key: 'ruc', label: privateCompany ? 'RUC / Cédula' : 'RUC / Cédula ficticia', required: true }, { key: 'kind', label: 'Tipo', kind: 'select', options: [{ value: 'customer', label: 'Cliente' }, { value: 'lead', label: 'Lead' }] }, { key: 'email', label: 'Correo', kind: 'email' }, { key: 'phone', label: 'Teléfono' }, { key: 'contactName', label: 'Contacto' }, { key: 'address', label: 'Dirección' }, { key: 'city', label: 'Ciudad' }, { key: 'paymentTermsDays', label: 'Plazo de pago (días)', kind: 'number' }, { key: 'creditLimit', label: 'Límite crédito USD', kind: 'number' }, { key: 'group', label: 'Grupo' }, { key: 'ownerCode', label: 'Propietario (empleado)' }, { key: 'rimpe', label: 'Régimen del proveedor', kind: 'select', options: [{ value: 'ninguno', label: 'Régimen general' }, { value: 'emprendedor', label: 'RIMPE Emprendedor (retención de renta 1 %)' }, { value: 'popular', label: 'RIMPE Negocio Popular (nota de venta, sin IVA ni retención)' }] }, { key: 'subjectToWithholding', label: 'Sujeto a retención', kind: 'checkbox' }, { key: 'withholdingTax', label: 'Impuesto de retención' }, { key: 'vatWithholdingGroup', label: 'Grupo de retención IVA' }, { key: 'vatWithholdingCode', label: 'Código de retención IVA' }, { key: 'fiscalCategory', label: 'Categoría fiscal' }, { key: 'active', label: 'Activo', kind: 'checkbox' }, { key: 'notes', label: 'Observaciones', kind: 'textarea' },
  ];
  return <>
    <MasterForm title={vendor ? 'Proveedores · Empresa Ecuador' : 'Clientes y leads · Empresa Ecuador'} initial={initial} fields={fields.filter(f => vendor ? f.key !== 'kind' : !['rimpe','subjectToWithholding','withholdingTax','vatWithholdingGroup','vatWithholdingCode','fiscalCategory'].includes(String(f.key)))} records={vendor ? c.data.vendors.map(v => ({ ...initial, ...v, kind: 'customer' as const })) : c.data.customers.map(v => ({ ...initial, ...v, rimpe: 'ninguno' as const }))} onSave={data => {
      if (!data.cardCode) return vendor ? c.save({ action: 'vendor', data }) : c.save({ action: 'customer', data });
      const { name, ruc, email, phone, address, city, contactName, paymentTermsDays, creditLimit, active, group, notes, ownerCode } = data;
      return c.save({ action: 'partnerUpdate', data: { partnerType: vendor ? 'vendor' : 'customer', cardCode: data.cardCode,
        changes: { name, ruc, email, phone, address, city, contactName, paymentTermsDays, creditLimit, active, group, notes, ...(vendor ? {} : { ownerCode }),
          ...(vendor ? { rimpe: data.rimpe, subjectToWithholding: data.subjectToWithholding, withholdingTax: data.withholdingTax, vatWithholdingGroup: data.vatWithholdingGroup, vatWithholdingCode: data.vatWithholdingCode, fiscalCategory: data.fiscalCategory } : { kind: data.kind }) } } });
    }} />
    <form className="space-y-2 border border-[#999] bg-white p-3" onSubmit={async e => { e.preventDefault(); try { await c.save({ action: 'partnerLink', data: { customerCode, vendorCode } }); } catch { /* error visible en el proveedor */ } }}>
      <h3 className="font-bold">Vincular fichas de cliente y proveedor</h3>
      <p>Úsalo para relacionar las fichas comerciales que se compran y venden entre sí. Los saldos y documentos de cada ficha se mantienen separados.</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="Cliente"><select required className={inputClass} value={customerCode} onChange={e => { setCustomerCode(e.target.value); setVendorCode(''); }}><option value="">Selecciona un cliente</option>{c.data.customers.filter(p => p.active).map(p => <option key={p.id} value={p.cardCode}>{p.cardCode} · {p.name}</option>)}</select></Field>
        <Field label="Proveedor conectado"><select required className={inputClass} value={vendorCode} onChange={e => setVendorCode(e.target.value)}><option value="">Selecciona un proveedor</option>{c.data.vendors.filter(p => p.active).map(p => <option key={p.id} value={p.cardCode}>{p.cardCode} · {p.name}</option>)}</select></Field>
      </div>
      <button className={buttonClass} disabled={c.saving || !customerCode || !vendorCode}>Guardar vínculo</button>
    </form>
  </>;
}
