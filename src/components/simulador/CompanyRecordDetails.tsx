import type { ReactNode } from 'react';
import { Table } from '@/components/sap-screens/SAPControls';

export const collectionLabels: Record<string, string> = {
  salesOrders: 'Ventas', purchaseOrders: 'Compras', customers: 'Clientes', vendors: 'Proveedores', items: 'Artículos', warehouseStock: 'Existencias', stockMovements: 'Kardex', journalEntries: 'Asientos contables', chartOfAccounts: 'Plan de cuentas', bankAccounts: 'Cuentas bancarias', bankTransactions: 'Movimientos bancarios', employees: 'Empleados', payrollRuns: 'Nóminas', sriDocuments: 'Comprobantes SRI', productionOrders: 'Producción', boms: 'Listas de materiales', missions: 'Misiones',
};
const labels: Record<string, string> = {
  id: 'Código', createdAt: 'Creado', updatedAt: 'Actualizado', createdBy: 'Autor', docNumber: 'Número', docType: 'Tipo', date: 'Fecha', dueDate: 'Vencimiento', cardCode: 'Código socio', cardName: 'Socio', currency: 'Moneda', reference: 'Referencia', comments: 'Comentarios', baseDocumentId: 'Documento base', status: 'Estado', lines: 'Líneas', subtotal: 'Subtotal', tax: 'Impuesto', total: 'Total', paidAmount: 'Importe liquidado', journalEntryId: 'Asiento', itemCode: 'Artículo', description: 'Descripción', quantity: 'Cantidad', unit: 'Unidad', price: 'Precio', discount: 'Descuento %', taxRate: 'IVA %', warehouseCode: 'Almacén', accountCode: 'Cuenta', debit: 'Debe', credit: 'Haber', costCenter: 'Centro de costo', entryNumber: 'Asiento', period: 'Período', memo: 'Concepto', totalDebit: 'Total debe', totalCredit: 'Total haber', source: 'Origen', reversalOf: 'Reversión de', reversedBy: 'Revertido por', name: 'Nombre', balance: 'Saldo', ruc: 'Identificación', email: 'Correo', phone: 'Teléfono', address: 'Dirección', city: 'Ciudad', contactName: 'Contacto', paymentTermsDays: 'Plazo días', creditLimit: 'Límite crédito', active: 'Activo', group: 'Grupo', notes: 'Notas', kind: 'Clase de socio', reserved: 'Reservado', averageCost: 'Costo promedio', value: 'Valor', costingMethod: 'Método de costeo', layers: 'Capas de costo', cost: 'Costo', firstName: 'Nombres', lastName: 'Apellidos', identification: 'Cédula', position: 'Cargo', department: 'Área', hireDate: 'Ingreso', baseSalary: 'Sueldo base', employeeName: 'Empleado', employeeCode: 'Código empleado', net: 'Neto', income: 'Ingresos', deductions: 'Descuentos', xml: 'XML educativo', title: 'Título', module: 'Módulo', teacherUid: 'Docente', parentItemCode: 'Producto terminado', components: 'Componentes', bomCode: 'Lista materiales', totalCost: 'Costo total', actualCost: 'Costo real', orderNumber: 'Orden', claveAcceso: 'Clave de acceso', number: 'Número fiscal', totalRetention: 'Total retenido', ats: 'ATS', retentionLines: 'Retenciones', simulated: 'Simulado',
};
const values: Record<string, string> = { open: 'Abierto', closed: 'Cerrado', planned: 'Planificada', released: 'Liberada', in_progress: 'En proceso', assigned: 'Asignada', completed: 'Completada', average: 'Promedio', fifo: 'FIFO', standard: 'Estándar', quotation: 'Cotización', order: 'Pedido venta', delivery: 'Entrega', invoice: 'Factura venta', credit_note: 'Nota crédito', purchase_request: 'Solicitud compra', purchase_order: 'Pedido compra', goods_receipt: 'Entrada mercancías', vendor_invoice: 'Factura proveedor', debit_note: 'Nota débito' };
function caption(key: string): string { return labels[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()); }
function display(value: unknown): ReactNode {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (typeof value === 'number') return value.toLocaleString('es-EC', { maximumFractionDigits: 6 });
  if (typeof value === 'string') return values[value] ?? value;
  if (Array.isArray(value)) {
    if (!value.length) return 'Sin registros';
    return <ol className="space-y-2">{value.map((item: unknown, i: number) => <li key={i} className="border-l-2 border-[#999] pl-2">{display(item)}</li>)}</ol>;
  }
  if (typeof value === 'object') return <Table headers={['Campo', 'Valor']} rows={Object.entries(value).map(([key, entry]) => [caption(key), display(entry)])} />;
  return '—';
}
export default function CompanyRecordDetails({ record }: { record: object }) {
  return <details><summary className="cursor-pointer">Ver documento completo</summary><div className="max-w-4xl whitespace-pre-wrap break-words">{display(record)}</div></details>;
}
