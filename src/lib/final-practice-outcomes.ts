import type {PracticeOutcomeContract} from './practice-outcome-contract';
const rule=(key:string,fields:Record<string,[string,string]>):PracticeOutcomeContract=>({key,collection:'profile',rows:'finalOperations',pending:[],requirements:Object.entries(fields).map(([label,[path,expected]])=>({label,path,expected}))});
export function finalPracticeContract(key:string):PracticeOutcomeContract|undefined{
 if(key==='mod8-c1#6')return rule(key,{Operación:['kind','procurementQuotes'],Base:['sourceType','Solicitud de Compra'],Solicitud:['requestNumber','10000'],Artículo:['itemCode','A00003'],Cantidad:['quantity','2'],Proveedores:['vendorCount','3'],Destino:['targetType','Cotización de Compra']});
 if(key==='mod9-c4#8')return rule(key,{Operación:['kind','costAdjustment'],Serie:['series','AJC001'],Fecha:['date','30/06/2026'],Centro:['toCenter','DESARROLLO'],Importe:['amount','200'],Cuenta:['accountCode','590000']});
 if(key==='mod19-c1#8')return rule(key,{Operación:['kind','cardSettlement'],Fecha:['date','17/04/2026'],Número:['reference','DEP-2026-001'],Origen:['sourceAccount','Compensación Tarjetas'],Destino:['destinationAccount','Banco Pichincha Cta Corriente'],Importe:['amount','105']});
 if(key==='mod19-c3#11')return rule(key,{Operación:['kind','vendorReconciliation'],Proveedor:['vendorCode','V10000'],Tipo:['accountType','Proveedor'],Factura:['creditNumber','FV20260405'],ValorFactura:['creditValue','500'],Pago:['debitNumber','BP20260410'],ValorPago:['debitValue','500']});
 if(key==='mod19-c4#7')return rule(key,{Operación:['kind','vendorAging'],Fecha:['date','30/06/2026'],Rango1:['range1','30'],Rango2:['range2','45'],Rango3:['range3','60'],Anticipos:['showAdvances','Sí'],Proveedor:['vendorCode','V10000']});
 if(key==='mod20-c2#8')return rule(key,{Operación:['kind','accountingPreview'],Ingresos:['incomeAccount','4100-02'],Cliente:['customerCode','C20000'],Existencias:['inventoryAccount','1410-02'],IVA:['taxAccount','2150'],Impuesto:['tax','33']});
 return undefined;
}
