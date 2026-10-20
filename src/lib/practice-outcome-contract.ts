import LECCIONES from '@/content/aula/lecciones.json';
import type { CompanyState, CollectionName } from './firestore-types';
import type { CompanyAuditEvent } from './company-audit';
import { pantallaConectada, type PantallaConectada } from './practica-conectada';
import { normalizar } from './practice-check';
import { STRICT_PRACTICE_KEYS } from './strict-practice-keys';

type RecordValue = Record<string, unknown>;
export interface OutcomeRequirement { label: string; expected: string; path: string; generated?: boolean }
export interface PracticeOutcomeContract {
  key: string; collection: CollectionName | 'profile'; rows?: string;
  requirements: OutcomeRequirement[]; pending: string[];
}
const plain = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const entries = (pairs: Record<string, string>) => new Map(Object.entries(pairs).map(([label, path]) => [plain(label), path]));
const maps: Record<string, Map<string, string>> = {
  empresa: entries({'Razón social':'companyName','Nombre de la empresa':'companyName','RUC':'ruc','RUC (ID fiscal)':'ruc','Dirección':'address','Teléfono 1':'phone','Tarifa de impuesto a la renta (%)':'incomeTaxRate','Moneda local':'currency'}),
  cliente: entries({'Nombre':'name','RUC':'ruc','Ciudad':'city','Condición de pago':'paymentTermsDays','Grupo de clientes':'group','Clase':'kind'}),
  cockpit: entries({'Nombre del cockpit':'nombre','Cockpit predeterminado':'predeterminado'}),
  proveedor: entries({'Nombre':'name','Ciudad':'city','Proveedor':'cardCode','Código Proveedor':'cardCode'}),
  articulo: entries({'Descripción':'name','Nombre':'name','Descripción 2':'description','Costo':'purchasePrice','Precio de venta':'price','Precio lista 1':'price','Grupo de artículos':'group','Grupo':'group','Clase de artículos':'itemClass','Tipo de artículo':'type','Tipo':'type','Grupo UM':'uomGroup','UM Inventario':'inventoryUnit','UM Compra':'purchaseUnit','UM Venta':'salesUnit','Costo estándar':'standardCost','Método de valoración':'costingMethod','Método de gestión':'manageMethod','Inventario perpetuo':'perpetualInventory','Proveedor preferido':'preferredVendor','Peso artículo':'weight','ICE':'ice'}),
  documento: entries({'Proveedor':'cardCode','Cliente':'cardCode','Código Proveedor':'cardCode','Código socio de negocios':'cardCode','Fecha':'date','Fecha contabilización':'date','Fecha documento':'date','Fecha Contable':'date','Fecha del Pedido':'date','Fecha de contabilización':'date','Fecha de emisión':'date','Fecha vencimiento':'dueDate','Fecha de vencimiento':'dueDate','Fecha requerida':'dueDate','Fecha de entrega':'dueDate','Fecha de validez':'dueDate','Válida hasta':'dueDate','Comentario':'comments','Comentarios':'comments','Referencia':'reference','Total':'total','Neto':'subtotal','IVA Crédito':'tax','Información Adicional':'comments','Artículo':'lines.itemCode','Código de artículo':'lines.itemCode','Cantidad':'lines.quantity','Precio':'lines.price','Precio unitario':'lines.price','Descuento %':'lines.discount','Bodega':'lines.warehouseCode','Almacén':'lines.warehouseCode','Depósito':'lines.warehouseCode','Impuesto':'lines.taxRate','IVA':'tax'}),
  empleado: entries({'Nombre':'firstName','Apellido':'lastName','N° de cédula':'identification','Cargo':'position','Departamento':'department','Sueldo mensual':'baseSalary','Fecha de ingreso':'hireDate','Activo':'active'}),
  nomina: entries({'Período':'period','Empleado':'lines.employeeCode','Días trabajados':'lines.days','Sueldo mensual':'lines.salary','Neto a pagar':'lines.net','Horas extras 50 %':'lines.extra50','Horas extras 100 %':'lines.extra100','Anticipo':'lines.advances'}),
  activos: entries({'Descripción':'name','Costo':'cost','Vida útil (meses)':'usefulLifeMonths','Clase de activo':'category','Fecha':'acquisitionDate'}),
  oportunidad: entries({'Nombre':'name','Cliente':'cardCode','Monto estimado (USD)':'amount','Valor potencial':'amount','Etapa':'stage','Probabilidad':'probability','Probabilidad de cierre (%)':'probability','Fecha estimada de cierre':'expectedClose','Descripción':'notes'}),
  bom: entries({'Artículo':'parentItemCode','Tipo':'type','Cantidad':'components.quantity','Unidad de medida':'components.unit'}),
  produccion: entries({'Artículo':'parentItemCode','Código':'parentItemCode','Cantidad':'quantity','Bodega':'warehouseCode','Almacén':'warehouseCode','Fecha':'date','Fecha de inicio':'date','Fecha inicio':'date','Fecha de vencimiento':'dueDate','Fecha vencimiento':'dueDate'}),
  conteo: entries({'Fecha ejemplo':'date','Fecha':'date','Código de artículo':'lines.itemCode','Cantidad contada':'lines.countedQuantity','Cantidad en sistema':'lines.systemQuantity','Diferencia':'lines.difference','Almacén':'warehouseCode'}),
  presupuesto: entries({'Ejercicio Fiscal':'year','Cuenta':'accountCode','Escenario':'scenario'}),
  grupos: entries({'Código de grupo':'codigo','Código':'codigo','Grupo':'codigo','Nombre del grupo':'nombre','Nombre':'nombre','Descripción':'descripcion'}),
  series: entries({'Tipo de documento':'docType','Cantidad de dígitos':'digitos','Sufijo':'sufijo','Usuario':'usuario','Número de inicio':'inicio','Número final':'fin','Nombre de la serie':'nombre','Grupo de serie':'grupo','Próximo número':'actual','Fijar como por defecto':'porDefecto','Prefijo':'prefijo'}),
  monedas: entries({'Moneda local':'monedaLocal','Moneda del sistema':'monedaSistema','Tipo de cambio':'tasa','Fecha de tipo de cambio':'fecha'}),
  precios: entries({'Lista de precios':'code','Nombre de la lista':'name','Nombre':'name','Descripción':'description','Moneda':'currency','Fecha de inicio':'validFrom','Fecha de fin':'validTo','Válida desde':'validFrom','Válida hasta':'validTo','Lista base':'base','Factor':'factor','Activa':'active','Código de cliente':'cardCode','Interlocutor origen':'cardCode','Código de artículo':'itemCode','Artículo':'itemCode','Porcentaje':'discount','Descuento':'discount','Referencia a lista':'referenceList'}),
  descuentos: entries({'Lista de precios':'list','Código de artículo':'itemCode','Artículo':'itemCode','Desde cantidad':'minQuantity','Cantidad mínima':'minQuantity','Hasta cantidad':'maxQuantity','Descuento':'discount','Descuento %':'discount','Fecha de inicio':'validFrom','Fecha de fin':'validTo','Válida desde':'validFrom','Válida hasta':'validTo','Activo':'active'}),
  bancos: entries({'Fecha':'date','Fecha pago':'date','Fecha documento':'date','Monto':'amount','Valor pagado':'amount','Importe recibido':'amount','Importe':'amount','Importe a pagar':'amount','Total pagado':'amount','Valor':'amount','Contrapartida':'counterpartAccount','Referencia':'reference','Retención renta':'retentionIR','Retención IVA':'retentionIVA','Tipo':'type'}),
  isd: entries({'Fecha':'date','Valor':'figures.amount','ISD':'figures.isd','Total':'figures.total'}),
};
const sources: Partial<Record<PantallaConectada['clave'], CollectionName | 'profile'>> = {
  empresa:'profile',cliente:'customers',proveedor:'vendors',articulo:'items',empleado:'employees',nomina:'payrollRuns',activos:'fixedAssets',oportunidad:'opportunities',bom:'boms',produccion:'productionOrders',conteo:'inventoryCounts',presupuesto:'budgets',grupos:'profile',series:'profile',bancos:'bankTransactions',isd:'taxRuns',asiento:'journalEntries',mrp:'missions',importacion:'landedCosts',monedas:'profile',costos:'profile',recursos:'profile',udo:'profile',cockpit:'profile',precios:'profile',descuentos:'profile',cierre:'profile',transferencia:'stockMovements',sri:'sriDocuments',consultas:'profile',
};
const GENERATED = new Set(['cliente:Código','articulo:Código','empleado:ID','activos:Código de activo']);
function contract(key: string): PracticeOutcomeContract {
  const [classId, index] = key.split('#');
  const lesson = (LECCIONES as Record<string,{syncData: {slide_index:number;step_guide?:{campos?:{etiqueta:string;valor:string}[];title?:string;menu_path?:string}|null}[]}>)[classId];
  const guide = lesson?.syncData.find(slide => slide.slide_index === Number(index))?.step_guide;
  const screen = pantallaConectada({...guide,missionId:key});
  const collection = screen?.clave==='documento' ? (['purchase_request','purchase_order','goods_receipt','vendor_invoice'].includes(screen.docType)?'purchaseOrders':'salesOrders') : screen ? sources[screen.clave] : undefined;
  const result: PracticeOutcomeContract = {key,collection:collection??'profile',requirements:[],pending:[]};
  if(!screen || !collection) { result.pending.push('Pantalla sin contrato de resultados.'); return result; }
  if(screen.clave==='grupos') result.rows=screen.tipo==='cliente'?'customerGroups':'itemGroups';
  if(screen.clave==='series') result.rows='docSeries';
  if(screen.clave==='monedas') { result.rows='currencies.tasas'; const target=guide?.campos?.find(f=>f.etiqueta==='Moneda del sistema'); if(target)result.requirements.push({label:'Moneda de la tasa',expected:target.valor,path:'moneda'}); }
  if(screen.clave==='cockpit') result.rows='cockpit.plantillas';
  if(screen.clave==='precios') result.rows=(guide?.campos??[]).some(f=>['Código de cliente','Interlocutor origen'].includes(f.etiqueta)) ? 'specialPrices' : 'priceLists';
  if(screen.clave==='descuentos') result.rows='volumeDiscounts';
  for(const field of guide?.campos??[]) {
    const generated=GENERATED.has(`${screen.clave}:${field.etiqueta}`);
    const path=screen.clave==='documento'&&field.etiqueta==='IVA'&&field.valor.includes('%')?'lines.taxRate':generated ? (screen.clave==='cliente'?'cardCode':screen.clave==='articulo'?'itemCode':screen.clave==='empleado'?'employeeCode':'assetCode') : maps[screen.clave]?.get(plain(field.etiqueta));
    if(!path) result.pending.push(`${field.etiqueta}: falta resultado equivalente verificable.`);
    else result.requirements.push({label:field.etiqueta,expected:field.valor,path,generated});
  }
  if(!result.requirements.length) result.pending.push('La misión no define resultados comprobables.');
  return result;
}
/** No hay aprobación por omisión: cualquier atributo sin representación real mantiene la misión pendiente. */
export const PRACTICE_OUTCOME_CONTRACTS = Object.fromEntries([...STRICT_PRACTICE_KEYS].map(key=>[key,contract(key)]));
export const outcomeContractFor = (key:string) => PRACTICE_OUTCOME_CONTRACTS[key];
const get = (value:unknown,path:string):unknown => path.split('.').reduce<unknown>((current,key)=>current&&typeof current==='object'?(current as RecordValue)[key]:undefined,value);
function comparable(value:unknown): string {
  if(typeof value==='boolean')return value?'Sí':'No';
  const text=String(value??'').trim();
  if(/^\d{4}-\d{2}-\d{2}$/.test(text)){const [year,month,day]=text.split('-');return `${day}/${month}/${year}`;}
  const aliases:Record<string,string>={facturas:'Facturas de clientes',clientes:'Datos maestros de clientes',inventory:'Material',service:'Servicio',customer:'Cliente',lead:'Cliente potencial',average:'Promedio ponderado',standard:'Estándar',fifo:'FIFO',perfumes:'Perfumes 20 %'};
  return aliases[text]??text;
}
function matches(actual:unknown,requirement:OutcomeRequirement,state:CompanyState):boolean {
  if(requirement.generated)return typeof actual==='string'&&/^[\w.-]+$/.test(actual);
  let expected=requirement.expected;
  if(['cardCode','itemCode','employeeCode','parentItemCode','warehouseCode','preferredVendor'].includes(requirement.path.split('.').at(-1)!)){
    const code=expected.match(/^([A-Z]{1,5}\d{2,})(?:\s|$)/)?.[1];
    if(code)expected=code;
    else if(requirement.path.endsWith('itemCode'))expected=state.items.find(row=>normalizar(row.name)===normalizar(expected))?.itemCode??expected;
    else if(requirement.path.endsWith('employeeCode'))expected=state.employees.find(row=>normalizar(`${row.firstName} ${row.lastName}`)===normalizar(expected))?.employeeCode??expected;
  }
  if(requirement.path==='docType'){const labels:Record<string,string>={facturas:'Facturas de clientes',clientes:'Datos maestros de clientes'};actual=labels[String(actual)]??actual;}
  if(['list','referenceList'].includes(requirement.path)){const number=String(expected).match(/(\d+)$/)?.[1];if(number)expected=String(Number(number));}
  if(requirement.path==='paymentTermsDays')expected=expected.replace(/\s*d[ií]as?$/i,'');
  return actual!==undefined && normalizar(comparable(actual))===normalizar(comparable(expected));
}
function rowMatches(row:unknown,requirements:OutcomeRequirement[],state:CompanyState):boolean {
  const grouped=new Map<string,OutcomeRequirement[]>();
  for(const requirement of requirements){const [root]=requirement.path.split('.');if(Array.isArray(get(row,root))){const group=grouped.get(root)??[];group.push({...requirement,path:requirement.path.slice(root.length+1)});grouped.set(root,group);}else if(!matches(get(row,requirement.path),requirement,state))return false;}
  for(const [root,fields]of grouped)if(!(get(row,root) as unknown[]).some(candidate=>rowMatches(candidate,fields,state)))return false;
  return true;
}
export function missionOutcomeMatches(state:CompanyState,event:CompanyAuditEvent,key:string):boolean {
  const rule=outcomeContractFor(key);
  if(!rule||rule.pending.length||!rule.requirements.length)return false;
  if(key==='mod2-c1#7'&&(event.action!=='partnerUpdate'||!event.changes.some(c=>c.collection==='customers'&&(c.before as RecordValue|null)?.kind==='lead'&&(c.after as RecordValue|null)?.kind==='customer')))return false;
  const changes=event.changes.filter(change=>change.collection===rule.collection&&change.after);
  return changes.some(change=>{
    const current=rule.collection==='profile'?state.profile:state[rule.collection].find(row=>row.id===change.id);
    if(!current)return false;
    if(!rule.rows)return rowMatches(change.after,rule.requirements,state)&&rowMatches(current,rule.requirements,state);
    const after=get(change.after,rule.rows),present=get(current,rule.rows),before=get(change.before,rule.rows);
    if(!Array.isArray(after)||!Array.isArray(present))return false;
    const decorate=(profile:unknown,row:RecordValue)=>rule.rows==='cockpit.plantillas'?{...row,predeterminado:row.id===get(profile,'cockpit.plantillaActiva')}:rule.rows==='currencies.tasas'?{...row,monedaLocal:get(profile,'currencies.monedaLocal'),monedaSistema:get(profile,'currencies.monedaSistema')}:row;
    return after.some(row=>rowMatches(decorate(change.after,row),rule.requirements,state)&&present.some(item=>JSON.stringify(item)===JSON.stringify(row)&&rowMatches(decorate(current,item),rule.requirements,state))&&(!Array.isArray(before)||!before.some(item=>JSON.stringify(decorate(change.before,item))===JSON.stringify(decorate(change.after,row)))));
  });
}
