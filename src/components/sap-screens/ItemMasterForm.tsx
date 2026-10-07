'use client';
import { useCompany } from '@/hooks/useCompany';
import type { CommandData } from '@/lib/company-commands';
import { ICE_TIPOS, ICE_ETIQUETAS } from '@/lib/sri-catalogo';
import { MasterForm, type FieldDefinition } from './SAPControls';
export default function ItemMasterForm() {
  const c = useCompany();
  const initial: CommandData<'item'> = { ice: 'none', name: '', type: 'inventory', group: 'General', purchaseUnit: 'UND', salesUnit: 'UND', price: 0, price2: 0, price3: 0, maxDiscount: 100, purchasePrice: 0, preferredVendor: '', weight: 0, length: 0, width: 0, height: 0, costingMethod: 'average', standardCost: 0, minStock: 0, maxStock: 1000, reorderPoint: 0, description: '', specifications: '', active: true };
  const fields: FieldDefinition<typeof initial>[] = [
    { key: 'name', label: 'Descripción', required: true }, { key: 'type', label: 'Tipo', kind: 'select', options: [{ value: 'inventory', label: 'Inventariado' }, { value: 'service', label: 'Servicio' }, { value: 'labor', label: 'Trabajo' }] }, { key: 'group', label: 'Grupo' }, { key: 'salesUnit', label: 'UM venta', required: true }, { key: 'weight', label: 'Peso kg', kind: 'number' }, { key: 'length', label: 'Largo cm', kind: 'number' }, { key: 'width', label: 'Ancho cm', kind: 'number' }, { key: 'height', label: 'Alto cm', kind: 'number' }, { key: 'active', label: 'Activo', kind: 'checkbox' },
    { key: 'preferredVendor', label: 'Proveedor preferido', tab: 'Compras', kind: 'select', options: [{ value: '', label: 'Sin preferencia' }, ...c.data.vendors.map(v => ({ value: v.cardCode, label: v.name }))] }, { key: 'purchaseUnit', label: 'UM compra', tab: 'Compras', required: true }, { key: 'purchasePrice', label: 'Precio compra USD', tab: 'Compras', kind: 'number' },
    { key: 'price', label: 'Precio lista 1', tab: 'Ventas', kind: 'number' }, { key: 'price2', label: 'Precio lista 2', tab: 'Ventas', kind: 'number' }, { key: 'price3', label: 'Precio lista 3', tab: 'Ventas', kind: 'number' }, { key: 'maxDiscount', label: 'Descuento máximo %', tab: 'Ventas', kind: 'number', max: 100 }, { key: 'ice', label: 'ICE (Impuesto a los Consumos Especiales)', tab: 'Ventas', kind: 'select', options: ICE_TIPOS.map(t => ({ value: t, label: ICE_ETIQUETAS[t] })) },
    { key: 'costingMethod', label: 'Método costeo', tab: 'Inventario', kind: 'select', options: [{ value: 'average', label: 'Promedio' }, { value: 'fifo', label: 'FIFO' }, { value: 'standard', label: 'Estándar' }] }, { key: 'standardCost', label: 'Costo estándar', tab: 'Inventario', kind: 'number' }, { key: 'minStock', label: 'Stock mínimo', tab: 'Inventario', kind: 'number' }, { key: 'maxStock', label: 'Stock máximo', tab: 'Inventario', kind: 'number' }, { key: 'reorderPoint', label: 'Punto reorden', tab: 'Inventario', kind: 'number' }, { key: 'description', label: 'Descripción larga', tab: 'Texto', kind: 'textarea' }, { key: 'specifications', label: 'Especificaciones', tab: 'Texto', kind: 'textarea' },
  ];
  return <MasterForm title="Datos maestros de artículos" initial={initial} fields={fields} records={c.data.items} onSave={data => c.save({ action: 'item', data })} />;
}
