import type { PracticeOutcomeContract } from './practice-outcome-contract';
import type { CompanyState, SRITaxDocument } from './firestore-types';
import { round } from './company-calculations';

const rules = (key:string, collection:PracticeOutcomeContract['collection'], fields:Record<string,[string,string]>, rows?:string):PracticeOutcomeContract => ({key,collection,rows,pending:[],requirements:Object.entries(fields).map(([label,[path,expected]])=>({label,path,expected}))});
export function accountingPracticeContract(key:string):PracticeOutcomeContract|undefined {
  const openings:Record<string,Record<string,[string,string]>>={
   'mod25-c3#5':{Tipo:['kind','inventory'],Artículo:['itemCode','A00001'],Almacén:['warehouseCode','01'],Cantidad:['quantity','50'],Costo:['unitCost','650']},
   'mod29-c1#7':{Tipo:['kind','cash'],Cuenta:['accountCode','1.1.01'],Débito:['amount','15000'],Crédito:['credit','0']},
   'mod29-c1#9':{Tipo:['kind','customer'],Código:['cardCode','C20000'],Nombre:['description','Maxi-Teq'],Saldo:['amount','5000']},
   'mod29-c3#5':{Tipo:['kind','inventory'],Código:['itemCode','A00001'],Descripción:['description','Laptop Dell Latitude 3420'],Cantidad:['quantity','10'],Costo:['unitCost','650'],Almacén:['warehouseCode','01'],Contrapartida:['compensationAccount','Patrimonio - Saldos de apertura']},
   'mod29-c3#7':{Tipo:['kind','cash'],Cuenta:['accountCode','1.1.01'],Debe:['amount','1500'],Haber:['credit','0'],Fecha:['date','01/01/2026'],Contrapartida:['compensationAccount','Patrimonio - Saldos de apertura'],Origen:['origin','OB']},
   'mod29-c3#9':{Tipo:['kind','customer'],Código:['cardCode','C20000'],Nombre:['description','Maxi-Teq'],Saldo:['amount','2000'],Fecha:['date','01/01/2026'],Contrapartida:['compensationAccount','Patrimonio - Saldos de apertura']},
  };
  if(openings[key])return rules(key,'profile',openings[key],'trainingOpenings');
  if(key==='mod25-c4#5')return rules(key,'profile',{Código:['code','2026-01'],Nombre:['name','Enero 2026'],Bloqueado:['closed','Sí'],Vencimiento:['dueThrough','31/01/2026']},'accountingPeriods');
  if(key==='mod29-c2#5')return rules(key,'profile',{Inicio:['accountingPeriodSetup.startDate','01/01/2026'],Fin:['accountingPeriodSetup.endDate','31/12/2026'],Intervalo:['accountingPeriodSetup.interval','Mensual'],Vencimiento:['accountingPeriodSetup.extendedDue','Sí'],Enero:['accountingPeriodSetup.januaryStart','Sí'],Calendario:['accountingPeriodSetup.differentCalendar','No']});
  if(key==='mod30-c1#5')return rules(key,'profile',{Plantilla:['nombre','Ventas'],Descripción:['descripcion','Cockpit de Ventas estilo Fiori'],Usuario:['usuario','director'],Activo:['predeterminado','Sí']},'cockpit.plantillas');
  if(['mod22-c2#8','mod22-c3#8'].includes(key)) return rules(key,'sriDocuments',{
    Fecha:['date',key==='mod22-c2#8'?'05/04/2026':'15/06/2026'],Proveedor:['partnerCode','V10000'],Documento:['docType','07'],Base:['sourceSubtotal','1700'],IVA:['sourceTax','255'],Retención:['vatRetention','76.5'],
  });
  if(key==='mod22-c6#7')return rules(key,'sriDocuments',{Fecha:['date','16/06/2026'],Cliente:['partnerCode','C20000'],Documento:['docType','06'],Artículo:['sourceLines.itemCode','A00001'],Cantidad:['sourceLines.quantity','1'],Motivo:['details.reason','Venta'],Transportista:['details.carrierName','Juan Pérez']});
  if(['mod22-c9#5','mod22-c9#7'].includes(key)){const reduced=key.endsWith('#7');return rules(key,'taxRuns',{Fecha:['date',reduced?'20/06/2026':'15/06/2026'],Proveedor:['partnerCode',reduced?'V10001':'V10000'],Concepto:['concept',reduced?'Importación de equipos':'Licencia de software'],Valor:['figures.pago',reduced?'800':'1000'],ISD:['figures.isd',reduced?'20':'50'],Total:['figures.total',reduced?'820':'1050']});}
  if(key==='mod22-c10#5')return rules(key,'bankTransactions',{Cliente:['partnerCode','C20000'],Factura:['documentNumber','5000'],Total:['documentTotal','1150'],Renta:['retentionIR','20'],IVA:['retentionIVA','45'],Cobro:['amount','1085']});
  return undefined;
}

/** Values derived from the persisted source document, never from answers submitted by the student. */
export function decorateAccountingOutcome(row:unknown,collection:string,state:CompanyState):unknown {
  if(collection!=='sriDocuments'||!row||typeof row!=='object')return row;
  const sri=row as SRITaxDocument;
  const source=[...state.salesOrders,...state.purchaseOrders].find(d=>d.id===sri.sourceDocumentId&&d.cardCode===sri.partnerCode);
  return {...sri,sourceSubtotal:source?.subtotal,sourceTax:source?.tax,sourceLines:source?.lines,vatRetention:round(sri.retentionLines.filter(l=>l.tax==='IVA').reduce((sum,l)=>sum+round(l.base*l.rate/100),0))};
}
