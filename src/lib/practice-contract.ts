import type { PantallaConectada } from './practica-conectada';
import type { CompanyAuditEvent } from './company-audit';

export function operationFor(p: PantallaConectada): string[] {
  if(p.clave==='cliente')return ['customer','partnerUpdate','partnerLink'];
  if(p.clave==='proveedor')return ['vendor','partnerUpdate','partnerLink'];
  if(p.clave==='documento') return [['purchase_request','purchase_order','goods_receipt','vendor_invoice'].includes(p.docType)?'purchase':'sales'];
  const actions:Record<string,string[]>={cliente:['customer'],proveedor:['vendor'],articulo:['item'],asiento:['journal'],activos:['fixedAsset','depreciate'],bom:['bom'],produccion:['production','productionStatus'],transferencia:['transfer'],conteo:['inventoryCount'],precios:['customerPriceList','itemPrices','priceListSave','priceUpdate','specialPrice'],descuentos:['volumeDiscount'],bancos:['bank','reconcile'],empleado:['employee'],oportunidad:['opportunity'],empresa:['companySettings'],presupuesto:['budget'],cierre:['closePeriod','closeYear'],importacion:['landedCost'],mrp:['mrp'],sri:['sri','authorize'],nomina:['payroll'],cierreTributario:['profitShare','incomeTaxClose','incomeTaxAdvance'],isd:['foreignPayment'],series:['docSeriesSave'],grupos:['customerGroupSave','itemGroupSave'],monedas:['currenciesSave'],costos:['costCentersSave'],recursos:['resourceSave'],udo:['udoSave'],cockpit:['cockpitSave']};
  return actions[p.clave]??[];
}

export function validPracticeEvent(event:CompanyAuditEvent|undefined, uid:string, requestId:string, result:string, actions:string[], docType?:string, now=Date.now()) {
  if(!event || event.companyId!==uid || event.actorUid!==uid || event.requestId!==requestId || event.result!==result || !actions.includes(event.action)) return false;
  const age=now-Date.parse(event.occurredAt);
  if(!Number.isFinite(age)||age<0||age>20*60_000||!event.changes.length) return false;
  return !docType || event.changes.some(c=>c.after && (c.after as {docType?:string}).docType===docType);
}
