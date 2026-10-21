import type { PracticeOutcomeContract } from './practice-outcome-contract';
import type { CompanyState } from './firestore-types';
import { round } from './company-calculations';
import { precioDeLista } from './company-pricing';

const rule=(key:string,collection:PracticeOutcomeContract['collection'],fields:Record<string,[string,string]>,rows?:string):PracticeOutcomeContract=>({key,collection,rows,pending:[],requirements:Object.entries(fields).map(([label,[path,expected]])=>({label,path,expected}))});
export function financePracticeContract(key:string):PracticeOutcomeContract|undefined {
 if(key==='mod18-c2#7')return rule(key,'profile',{Código:['codigo','IMPRES'],Nombre:['nombre','Impresoras'],Inventario:['inventoryAccount','9000'],Ingresos:['incomeAccount','9001'],Costos:['costAccount','9002']},'itemGroups');
 if(key==='mod18-c2#8')return rule(key,'items',{Código:['itemCode','A00002'],Descripción:['name','Laptop HP ProBook 440'],Grupo:['group','IMPRES'],Barras:['barcode','HP440001'],Impuesto:['salesTaxRate','15']});
 if(key==='mod18-c3#9')return rule(key,'journalEntries',{Origen:['source','manual'],Año:['dateYear','2026'],Gasto:['debitLines.accountCode','51020100'],Debe:['debitLines.debit','50'],Caja:['creditLines.accountCode','11010200'],Haber:['creditLines.credit','50']});
 if(key==='mod18-c4#7')return rule(key,'journalEntries',{Origen:['source','manual'],Fecha:['date','15/01/2026'],Gasto:['debitLines.accountCode','601000'],Debe:['debitLines.debit','150'],Banco:['creditLines.accountCode','101005'],Haber:['creditLines.credit','150']});
 if(key==='mod18-c4#5')return rule(key,'profile',{Ejercicio:['accountingPeriodSetup.startDate','01/01/2026'],Fin:['accountingPeriodSetup.endDate','31/12/2026'],Natural:['accountingPeriodSetup.differentCalendar','No']});
 if(key==='mod18-c4#6')return rule(key,'profile',{Ejercicio:['year','2026'],Período:['ordinal','001'],Desde:['startDate','01/01/2026'],Hasta:['endDate','31/01/2026'],Descripción:['name','Enero 2026']},'accountingPeriods');
 if(key==='mod21-c3#5')return rule(key,'profile',{Inicializado:['inicializado','Sí'],Control:['alSuperar','Bloquear'],Ejercicio:['ejercicio','2026'],Por:['controlPor','Mensual']},'costCenters.config.controlPresupuesto');
 if(key==='mod21-c3#7')return rule(key,'budgets',{Escenario:['scenario','Principal'],Cuenta:['accountCode','510000'],Anual:['annual','6000'],Método:['distribution','Igual']});
 if(key==='mod21-c3#8')return rule(key,'profile',{Escenario:['scenario','Principal'],Período:['period','10/2026'],Cuenta:['accountCode','510000'],Presupuesto:['budget','500'],Real:['actual','550'],Desviación:['variance','-50']},'budgetReports');
 if(key==='mod13-c1#8')return rule(key,'profile',{Lista:['list','4'],Método:['method','factor'],Factor:['value','1.1']},'priceUpdates');
 if(key==='mod13-c2#7')return rule(key,'profile',{Artículo:['itemCode','A00004'],Tipo:['kind','period'],Descuento:['discount','5'],Desde:['validFrom','01/09/2026'],Hasta:['validTo','30/09/2026'],Automático:['automatic','No'],Precio:['netPrice','42.75']},'volumeDiscounts');
 if(key==='mod13-c2#8')return rule(key,'profile',{Artículo:['itemCode','A00004'],Tipo:['kind','quantity'],Descuento:['discount','3'],Desde:['validFrom','01/09/2026'],Hasta:['validTo','30/09/2026'],Cantidad:['minQuantity','4'],Precio:['netPrice','41.47']},'volumeDiscounts');
 return undefined;
}

export function decorateFinanceOutcome(value:unknown,state:CompanyState,rows?:string):unknown {
 if(!value||typeof value!=='object')return value;
 const row=value as Record<string,unknown>;
 if(rows==='accountingPeriods')return {...row,year:String(row.code).slice(0,4),ordinal:String(Number(String(row.code).slice(-2))).padStart(3,'0')};
 if(Array.isArray(row.lines)&&row.source)return {...row,dateYear:String(row.date).slice(0,4),debitLines:row.lines.filter(l=>l.debit>0),creditLines:row.lines.filter(l=>l.credit>0)};
 if(Array.isArray(row.months)){const months=row.months;return {...row,scenario:row.scenario??'Principal',annual:round(months.reduce((sum,n)=>sum+Number(n),0)),distribution:months.every(n=>n===months[0])?'Igual':'Personalizada'};}
 if(rows==='volumeDiscounts'){
  const item=state.items.find(i=>i.itemCode===row.itemCode);const list=Number(row.list??1);
  const base=item?precioDeLista(state,item,list):0;
  const period=(state.profile?.volumeDiscounts??[]).find(v=>v.kind==='period'&&v.itemCode===row.itemCode&&(v.list??1)===list&&v.active&&v.validFrom===row.validFrom&&v.validTo===row.validTo);
  const periodNet=period?.automatic===false&&period.fixedPrice!=null?period.fixedPrice:period?round(base*(1-period.discount/100)):base;
  return {...row,netPrice:row.kind==='period'?(row.automatic===false&&row.fixedPrice!=null?row.fixedPrice:round(base*(1-Number(row.discount)/100))):round(periodNet*(1-Number(row.discount)/100))};
 }
 return row;
}
