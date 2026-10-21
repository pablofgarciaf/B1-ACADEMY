import type { PracticeOutcomeContract } from './practice-outcome-contract';
import type { CompanyState } from './firestore-types';
import { precioDeLista,listasDePrecios } from './company-pricing';
import { round } from './company-calculations';
const contract=(key:string,rows:string,fields:Record<string,[string,string]>):PracticeOutcomeContract=>({key,collection:'profile',rows,pending:[],requirements:Object.entries(fields).map(([label,[path,expected]])=>({label,path,expected}))});
export function discountPracticeContract(key:string):PracticeOutcomeContract|undefined {
 if(key==='mod13-c2#9')return contract(key,'discountOperations',{Tipo:['kind','volume_copy'],Lista:['listCode','LPVENTAS'],Origen:['sourceItemCode','A00004'],Destino:['targetItemCodes','A00005'],Filtro:['filter','Grupo de unidades de medida'],Sobrescribir:['overwrite','No'],Resultado:['stored','Sí']});
 if(key==='mod13-c3#5')return contract(key,'discountGroups',{Grupo:['code','DESC-MINORISTA'],Descripción:['description','Descuentos para clientes minoristas'],Desde:['validFrom','01/01/2026'],Hasta:['validTo','31/12/2026'],Activo:['active','Sí']});
 if(key==='mod13-c3#6')return contract(key,'discountGroups',{Grupo:['code','DESC-MINORISTA'],GrupoArtículo:['rules.itemGroup','IMPRESORAS'],Descuento:['rules.discount','10'],Artículo:['rules.itemCode','A00009'],Descripción:['rules.itemName','Impresora Multifunción Epson'],Base:['rules.listPrice','220'],Neto:['rules.netPrice','198'],Tipo:['rules.kind','percent']});
 if(key==='mod13-c3#7')return contract(key,'discountGroups',{Grupo:['code','DESC-MINORISTA'],GrupoArtículo:['rules.itemGroup','MEMORIAS'],Pagadas:['rules.paidQuantity','2'],Gratis:['rules.freeQuantity','1'],Máximo:['rules.maxFree','4'],Artículo:['rules.itemCode','A00008'],Descripción:['rules.description','Memoria RAM 16GB DDR4'],Tipo:['rules.kind','free']});
 if(key==='mod13-c3#8')return contract(key,'discountOperations',{Tipo:['kind','customer_group'],Cliente:['cardCode','C20000'],Nombre:['customerName','Maxi-Teq'],GrupoCliente:['customerGroup','CLIENTES-MINORISTAS'],Grupo:['groupCode','DESC-MINORISTA'],Lista:['listName','Precio Minorista'],Excluir:['excluded','No'],Guardado:['stored','Sí']});
 if(key==='mod13-c4#7')return contract(key,'discountOperations',{Tipo:['kind','special_batch'],Porcentaje:['percent','-5'],Grupo:['group','Distribuidores'],Desde:['validFrom','01/08/2026'],Hasta:['validTo','31/08/2026'],Resultado:['stored','Sí']});
 if(key==='mod13-c4#8')return contract(key,'discountOperations',{Tipo:['kind','special_copy'],Origen:['sourceCardCode','C20000'],Destinos:['targetCodes','C20001,C20002'],Artículo:['itemCode','A00002'],Descuento:['discount','15'],Desde:['validFrom','01/09/2026'],Hasta:['validTo','30/11/2026'],Sustituir:['replaceExisting','Sí'],Resultado:['stored','Sí']});
 return undefined;
}
export function decorateDiscountOutcome(value:unknown,state:CompanyState,rows?:string):unknown{
 if(!value||typeof value!=='object')return value;const row=value as Record<string,unknown>,p=state.profile;
 if(rows==='discountGroups')return {...row,rules:(row.rules as {itemCode:string;itemGroup:string;discount:number}[]).map(r=>{const item=state.items.find(i=>i.itemCode===r.itemCode&&i.group===r.itemGroup);const base=item?precioDeLista(state,item,1):NaN;return {...r,itemName:item?.name,listPrice:base,netPrice:round(base*(1-r.discount/100))};})};
 if(rows!=='discountOperations')return row;
 let stored=false;
 if(row.kind==='customer_group'){const cl=state.customers.find(c=>c.cardCode===row.cardCode);const assign=p?.customerDiscountGroups?.[String(row.cardCode)];return {...row,customerName:cl?.name,listName:listasDePrecios(state).find(l=>l.no===row.list)?.name,stored:cl?.group===row.customerGroup&&assign?.groupCode===row.groupCode&&assign?.excluded===row.excluded&&p?.customerPriceLists?.[String(row.cardCode)]===row.list};}
 if(row.kind==='volume_copy'){
  const source=p?.volumeDiscounts?.filter(r=>r.itemCode===row.sourceItemCode&&r.list===row.list&&r.active)??[];
  stored=source.some(r=>r.kind==='period')&&source.some(r=>r.kind==='quantity')&&(row.targetItemCodes as string[]).every(target=>source.every(src=>p?.volumeDiscounts?.some(dst=>dst.itemCode===target&&dst.list===src.list&&dst.kind===src.kind&&dst.discount===src.discount&&dst.validFrom===src.validFrom&&dst.validTo===src.validTo&&dst.minQuantity===src.minQuantity)));
 }
 if(row.kind==='special_copy')stored=Number(row.count)>0&&(row.targetCardCodes as string[]).every(target=>p?.specialPrices?.some(r=>r.cardCode===target&&r.itemCode===row.itemCode&&r.discount===row.discount&&r.validFrom===row.validFrom&&r.validTo===row.validTo));
 if(row.kind==='special_batch')stored=Number(row.count)>0&&(row.changes as {cardCode:string;itemCode:string;after:number}[]).every(ch=>p?.specialPrices?.some(r=>r.cardCode===ch.cardCode&&r.itemCode===ch.itemCode&&r.discount===ch.after&&r.validFrom===row.validFrom&&r.validTo===row.validTo));
 return {...row,stored,targetCodes:Array.isArray(row.targetCardCodes)?[...row.targetCardCodes].sort().join(','):'',listCode:listasDePrecios(state).find(l=>l.no===row.list)?.code};
}
