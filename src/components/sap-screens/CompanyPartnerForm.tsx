'use client';
import { useCompany } from '@/hooks/useCompany';
import type { CommandData } from '@/lib/company-commands';
import { MasterForm, type FieldDefinition } from './SAPControls';

export default function CompanyPartnerForm({ vendor = false }: { vendor?: boolean }) {
  const c = useCompany();
  const initial: CommandData<'customer'> & { rimpe: 'ninguno' | 'emprendedor' | 'popular' } = { rimpe: 'ninguno', name: '', ruc: '', email: '', phone: '', address: '', city: '', contactName: '', currency: 'USD', paymentTermsDays: 30, creditLimit: 0, active: true, group: 'Nacional', notes: '', kind: 'customer' };
  const fields: FieldDefinition<typeof initial>[] = [
    { key: 'name', label: 'Razón social', required: true }, { key: 'ruc', label: 'RUC / Cédula ficticia', required: true }, { key: 'kind', label: 'Tipo', kind: 'select', options: [{ value: 'customer', label: 'Cliente' }, { value: 'lead', label: 'Lead' }] }, { key: 'email', label: 'Correo', kind: 'email' }, { key: 'phone', label: 'Teléfono' }, { key: 'contactName', label: 'Contacto' }, { key: 'address', label: 'Dirección' }, { key: 'city', label: 'Ciudad' }, { key: 'paymentTermsDays', label: 'Plazo de pago (días)', kind: 'number' }, { key: 'creditLimit', label: 'Límite crédito USD', kind: 'number' }, { key: 'group', label: 'Grupo' }, { key: 'rimpe', label: 'Régimen del proveedor', kind: 'select', options: [{ value: 'ninguno', label: 'Régimen general' }, { value: 'emprendedor', label: 'RIMPE Emprendedor (retención de renta 1 %)' }, { value: 'popular', label: 'RIMPE Negocio Popular (nota de venta, sin IVA ni retención)' }] }, { key: 'active', label: 'Activo', kind: 'checkbox' }, { key: 'notes', label: 'Observaciones', kind: 'textarea' },
  ];
  return <MasterForm title={vendor ? 'Proveedores · Empresa Ecuador' : 'Clientes y leads · Empresa Ecuador'} initial={initial} fields={fields.filter(f => vendor ? f.key !== 'kind' : f.key !== 'rimpe')} records={vendor ? c.data.vendors.map(v => ({ ...v, kind: 'customer' as const })) : c.data.customers.map(v => ({ ...v, rimpe: 'ninguno' as const }))} onSave={data => vendor ? c.save({ action: 'vendor', data }) : c.save({ action: 'customer', data })} />;
}
