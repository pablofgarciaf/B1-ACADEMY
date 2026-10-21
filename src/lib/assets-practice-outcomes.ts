import type {PracticeOutcomeContract} from './practice-outcome-contract';
import type {CompanyState} from './firestore-types';
const rule=(key:string,collection:PracticeOutcomeContract['collection'],fields:Record<string,[string,string]>,rows?:string):PracticeOutcomeContract=>({key,collection,rows,pending:[],requirements:Object.entries(fields).map(([label,[path,expected]])=>({label,path,expected}))});
export function assetsPracticeContract(key:string):PracticeOutcomeContract|undefined{
 if(key==='mod3-c1#7')return rule(key,'profile',{Artículo:['itemCode','A00001'],Activo:['isAsset','Sí'],Virtual:['virtual','Sí'],Serie:['series','AF001']},'assetModels');
 if(key==='mod3-c2#5'||key==='mod3-c2#9'){
  const multiple=key==='mod3-c2#9';
  return rule(key,'purchaseOrders',{Proveedor:['cardCode',multiple?'V10002':'V10000'],Fecha:['date',multiple?'02/01/2026':'01/01/2026'],Valoración:['assetValuationDate',multiple?'02/01/2026':'01/01/2026'],Artículo:['lines.itemCode',multiple?'A00004':'A00006'],Cantidad:['lines.quantity',multiple?'5':'1'],Precio:['lines.price',multiple?'45':'6000'],Activos:['capitalizedQuantity',multiple?'5':'1']});
 }
 if(key==='mod3-c3#6')return rule(key,'profile',{Proceso:['mode','annual'],Área:['area','PCGA'],Fecha:['date','31/12/2026'],Importe:['amount','2000'],Contabilizado:['posted','Sí']},'assetLifecycle');
 if(key==='mod3-c3#11')return rule(key,'profile',{Proceso:['mode','rollover'],Actual:['year','2026'],Nuevo:['newYear','2027'],Transferir:['transfer','Sí'],Recalcular:['recalculate','Sí'],Corte:['date','31/12/2026'],Activos:['carriedCountPositive','Sí']},'assetLifecycle');
 if(key==='mod3-c4#7')return rule(key,'profile',{Proceso:['mode','dispose'],Activo:['assetId','CAMION002'],Tipo:['kind','Desecho'],Fecha:['date','20/06/2026'],Motivo:['reason','Fin de vida útil'],Contabilización:['posting','Neto'],Libro:['bookValue','18750'],Contabilizado:['posted','Sí']},'assetLifecycle');
 if(key==='mod7-c4#5')return rule(key,'items',{Código:['itemCode','A00001'],Descripción:['name','Laptop Dell Latitude 3420'],Gestión:['manageMethod','serial'],Valoración:['costingMethod','fifo'],Permanente:['perpetualInventory','Sí']});
 return undefined;
}
export function decorateAssetOutcome(value:unknown,state:CompanyState):unknown{
 if(!value||typeof value!=='object')return value;const row=value as Record<string,unknown>;
 if(row.docType==='vendor_invoice')return {...row,capitalizedQuantity:state.fixedAssets.filter(a=>a.sourceDocumentId===row.id&&a.journalEntryId===row.journalEntryId).length};
 if(['annual','dispose','rollover'].includes(String(row.mode)))return {...row,posted:!!row.journalEntryId&&state.journalEntries.some(e=>e.id===row.journalEntryId&&e.reference===row.id),carriedCountPositive:Array.isArray(row.carried)&&row.carried.length>0};
 return row;
}
