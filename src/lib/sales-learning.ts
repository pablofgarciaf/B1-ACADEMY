import type { CompanyState } from './firestore-types';
import type { PantallaConectada } from './practica-conectada';
import type {CompanyAuditEvent} from './company-audit';

export interface SalesMission {
  pantalla: PantallaConectada;
  mode: 'write' | 'query';
  expectedAction?: string;
  expectedDocType?: string;
}
const query = (): SalesMission => ({ pantalla: { clave: 'consultaAcademica' }, mode: 'query' });
const write = (pantalla: PantallaConectada, expectedAction: string, expectedDocType?: string): SalesMission => ({ pantalla, mode: 'write', expectedAction, expectedDocType });
export const SALES_MISSIONS: Record<string, SalesMission> = {
  'mod-ventas-c1#2': write({ clave: 'cliente' }, 'customer'),
  'mod-ventas-c1#3': write({ clave: 'precios' }, 'customerPriceList'),
  'mod-ventas-c1#4': query(),
  'mod-ventas-c1#6': query(),
  'mod-ventas-c1#7': query(),
  'mod-ventas-c2#2': query(),
  'mod-ventas-c2#3': query(),
  'mod-ventas-c2#4': write({ clave: 'documento', docType: 'quotation' }, 'sales', 'quotation'),
  'mod-ventas-c2#5': write({ clave: 'descuentos' }, 'volumeDiscount'),
  'mod-ventas-c2#6': query(),
  'mod-ventas-c3#2': write({ clave: 'documento', docType: 'order' }, 'sales', 'order'),
  'mod-ventas-c3#4': write({ clave: 'documento', docType: 'delivery' }, 'sales', 'delivery'),
  'mod-ventas-c3#5': write({ clave: 'documento', docType: 'invoice' }, 'sales', 'invoice'),
  'mod-ventas-c3#6': query(),
  'mod-ventas-c3#7': query(),
  'mod-ventas-c4#2': write({ clave: 'bancos' }, 'bank'),
  'mod-ventas-c4#3': query(),
  'mod-ventas-c4#4': query(),
  'mod-ventas-c4#6': query(),
  'mod-ventas-c4#7': query(),
};
export const obtenerMision = (classId: string, slideIndex: number) => SALES_MISSIONS[`${classId}#${slideIndex}`];

export function salesWriteMatches(state:CompanyState,event:CompanyAuditEvent,key:string):boolean {
  const customer=state.customers.find(c=>c.name==='Corporación Andina S.A.'&&c.ruc==='1790099001001');
  if(!customer)return false;
  if(key==='mod-ventas-c1#2')return event.changes.some(c=>c.collection==='customers'&&(c.after as {id?:string}|null)?.id===customer.id)&&customer.creditLimit===10000&&customer.paymentTermsDays===30;
  if(key==='mod-ventas-c1#3')return state.profile?.customerPriceLists?.[customer.cardCode]===2 && customer.paymentTermsDays===30;
  if(key==='mod-ventas-c2#5')return Boolean(state.profile?.volumeDiscounts?.some(v=>v.itemCode==='A00001'&&v.discount===5&&v.minQuantity>=5));
  const document=state.salesOrders.find(d=>d.id===event.result);
  if(key==='mod-ventas-c4#2')return state.bankTransactions.some(t=>t.id===event.result&&t.type==='deposit'&&state.salesOrders.some(d=>d.id===t.documentId&&d.cardCode===customer.cardCode&&d.docType==='invoice'&&d.status==='closed'))&&Math.abs(customer.balance)<0.01;
  if(!document||document.cardCode!==customer.cardCode)return false;
  if(!document.lines.some(l=>l.itemCode==='A00001'&&l.quantity===5)||!document.lines.some(l=>l.itemCode==='A00002'&&l.quantity===2))return false;
  if(key==='mod-ventas-c2#4')return document.docType==='quotation';
  const expected:Record<string,string>={'mod-ventas-c3#2':'quotation','mod-ventas-c3#4':'order','mod-ventas-c3#5':'delivery'};
  return state.salesOrders.some(d=>d.id===document.baseDocumentId&&d.docType===expected[key]&&d.cardCode===customer.cardCode);
}

/** The API and the classroom use the same current company facts for read-only exercises. */
export function camposConsulta(state: CompanyState, missionId: string): { etiqueta: string; valor: string }[] | null {
  const field = (etiqueta: string, value: string | number) => ({ etiqueta, valor: String(value) });
  const customer = state.customers.find(c => c.name === 'Corporación Andina S.A.') ?? state.customers.at(-1);
  const item = state.items.find(i => i.itemCode === 'A00001') ?? state.items[0];
  const invoices = state.salesOrders.filter(d => d.docType === 'invoice' && (!customer || d.cardCode === customer.cardCode));
  switch (missionId) {
    case 'mod-ventas-c1#4':
    case 'mod-ventas-c4#3': return customer ? [field('Cliente consultado', customer.cardCode), field('Límite de crédito USD', customer.creditLimit), field('Saldo actual USD', customer.balance)] : null;
    case 'mod-ventas-c1#6': return customer ? [field('Límite de crédito USD', customer.creditLimit), field('Exceso de una venta hipotética de USD 15000', Math.max(0, 15000 + customer.balance - customer.creditLimit))] : null;
    case 'mod-ventas-c1#7': return [field('Solicitudes de aprobación registradas', state.approvals.length), field('¿Un análisis sustituye una aprobación autorizada?', 'No')];
    case 'mod-ventas-c2#2': return item ? [field('Artículo consultado', item.itemCode), field('Registros de stock del artículo', state.warehouseStock.filter(s => s.itemCode === item.itemCode).length)] : null;
    case 'mod-ventas-c2#3': return item ? [field('Precio mayorista USD', item.price2), field('Costo de compra de referencia USD', item.purchasePrice), field('Margen sobre venta %', item.price2 ? Math.round((item.price2 - item.purchasePrice) / item.price2 * 10000) / 100 : 0)] : null;
    case 'mod-ventas-c2#6': return [field('Precio USD 850 con descuento del 30%', 595), field('Margen sobre venta con costo USD 650 (%)', -9.24)];
    case 'mod-ventas-c3#6': return invoices.length ? [field('Facturas del cliente', invoices.length), field('¿La retención depende del régimen y la operación?', 'Sí')] : null;
    case 'mod-ventas-c3#7': return invoices.length ? [field('Última factura', invoices.at(-1)!.docNumber), field('Documento base de esa factura', invoices.at(-1)!.baseDocumentId || 'Sin documento base')] : null;
    case 'mod-ventas-c4#4': return customer ? [field('Cliente consultado', customer.cardCode), field('Saldo pendiente USD', customer.balance), field('Facturas del cliente', invoices.length)] : null;
    case 'mod-ventas-c4#6': return [field('Inversión del caso USD', 12000), field('Ahorro neto mensual supuesto USD', 1000), field('Recuperación simple en meses', 12)];
    case 'mod-ventas-c4#7': return [field('¿El plazo de implantación requiere diagnóstico?', 'Sí'), field('¿La facilidad de uso elimina la necesidad de formación?', 'No')];
    default: return null;
  }
}
