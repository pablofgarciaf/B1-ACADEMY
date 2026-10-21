import type { CompanyState, AccountingAccount } from './firestore-types';

/** Stable account examples referenced by the accounting lessons, including older training companies. */
export function ensureTrainingFinanceCatalog(state:CompanyState,now:string,uid:string){
 if(state.profile?.usage!=='training')return;
 const examples:[string,string,AccountingAccount['category']][]=[['9000','Existencias grupo Impresoras','asset'],['9001','Ingresos grupo Impresoras','income'],['9002','Costo de ventas grupo Impresoras','cost'],['51020100','Gastos de Oficina','expense'],['11010200','Caja General','asset'],['601000','Gastos de servicios básicos','expense'],['101005','Banco Pichincha Cta Corriente','asset'],['510000','Gastos de Viajes','expense']];
 examples.push(['1.1.14','Compensación Tarjetas','asset'],['590000','Ajustes de contabilidad de costes','expense'],['4100-02','Ingresos diferenciados','income'],['1410-02','Inventario diferenciado','asset'],['2150','IVA en ventas diferenciado','liability']);
 for(const [code,name,category]of examples)if(!state.chartOfAccounts.some(a=>a.code===code))state.chartOfAccounts.push({id:code,code,name,category,parentCode:'',nature:['income','liability'].includes(category)?'H':'D',postable:true,active:true,createdAt:now,updatedAt:now,createdBy:uid});
}
