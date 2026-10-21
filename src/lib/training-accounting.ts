import { z } from 'zod';
import { code,date,money,text,type CompanyState,type JournalLine } from './firestore-types';
import { round } from './company-calculations';

export const trainingOpeningSchema=z.object({kind:z.enum(['cash','customer','inventory']),date,accountCode:code.default('1.1.01'),cardCode:text.default(''),itemCode:text.default(''),warehouseCode:text.default('01'),amount:money.default(0),quantity:money.default(0),unitCost:money.default(0)});
export type TrainingOpeningInput=z.infer<typeof trainingOpeningSchema>;
export interface TrainingOpeningRecord extends TrainingOpeningInput {id:string;journalEntryId:string;description:string;credit:number;compensationAccount:string;origin:string;delta:number;}
export const accountingPeriodsSchema=z.object({startDate:date,endDate:date,dueThrough:date}).refine(d=>d.startDate.endsWith('-01-01')&&d.endDate===`${d.startDate.slice(0,4)}-12-31`,'Configura un ejercicio anual de enero a diciembre.').refine(d=>d.dueThrough>d.endDate,'Amplía el vencimiento más allá del cierre del ejercicio.');
export interface AccountingPeriodRecord {code:string;name:string;startDate:string;endDate:string;dueThrough:string;closed:boolean;}
type Post=(date:string,memo:string,source:string,reference:string,lines:JournalLine[])=>string;
type Move=(itemCode:string,warehouse:string,qty:number,cost:number,date:string,reference:string)=>number;
const line=(accountCode:string,debit=0,credit=0):JournalLine=>({accountCode,debit,credit,description:'Apertura de laboratorio',costCenter:''});
const check=(condition:unknown,message:string)=>{if(!condition)throw new Error(message);};

/** Academic opening keeps the existing real auxiliary and posts only its difference against opening equity. */
export function applyTrainingOpening(state:CompanyState,input:TrainingOpeningInput,now:string,uid:string,next:(prefix:string,date:string)=>string,post:Post,move:Move){
 const p=state.profile!;check(p.usage==='training','Esta práctica solo está disponible en la empresa de aprendizaje.');
 const d=trainingOpeningSchema.parse(input);const id=next('OB',d.date);let description='',delta=0,entry='';
 const equity='3.03';if(!state.chartOfAccounts.some(a=>a.code===equity))state.chartOfAccounts.push({id:equity,code:equity,name:'Patrimonio - Saldos de apertura',category:'equity',nature:'H',parentCode:'3',postable:true,active:true,createdAt:now,updatedAt:now,createdBy:uid});
 const book=(account:string,value:number)=>post(d.date,'Saldo de apertura académico','training-opening',id,value>0?[line(account,value),line(equity,0,value)]:[line(equity,-value),line(account,0,-value)]);
 if(d.kind==='inventory'){
   const item=state.items.find(i=>i.itemCode===d.itemCode&&i.type==='inventory'&&i.active);check(item,'Selecciona un artículo inventariable activo.');check(d.quantity>0&&d.unitCost>0,'Cantidad y costo deben ser positivos.');
   check(p.warehouses.some(w=>w.code===d.warehouseCode),'Almacén inexistente.');
   const stock=state.warehouseStock.find(s=>s.itemCode===d.itemCode&&s.warehouseCode===d.warehouseCode);check(!stock?.reserved,'No se puede abrir un artículo con reservas.');
   check(!stock||!stock.quantity||Math.abs(stock.averageCost-d.unitCost)<0.005,'El costo inicial debe coincidir con el costo existente; usa una empresa de práctica nueva para otro costo.');
   const quantityAtCutoff=state.stockMovements.filter(m=>m.itemCode===d.itemCode&&m.warehouseCode===d.warehouseCode&&m.date<=d.date).reduce((sum,m)=>sum+m.quantity,0);
   delta=round(d.quantity-quantityAtCutoff);check(delta!==0,'El stock al corte ya tiene esa cantidad: no se crea otra apertura.');
   const value=move(d.itemCode,d.warehouseCode,delta,d.unitCost,d.date,id);entry=book('1.1.05',delta>0?value:-value);description=item!.name;
 }else if(d.kind==='customer'){
   const partner=state.customers.find(c=>c.cardCode===d.cardCode&&c.active&&c.kind==='customer');check(partner,'Selecciona un cliente activo.');check(d.amount>0,'Saldo positivo requerido.');
   const pending=state.salesOrders.filter(doc=>doc.cardCode===d.cardCode&&doc.docType==='invoice'&&doc.status==='open');
   check(pending.every(doc=>doc.openingBalance),'El cliente tiene facturas operativas: usa otro caso de práctica para ingresar su apertura.');
   delta=round(d.amount-partner!.balance);check(delta!==0,'El cliente ya tiene ese saldo.');entry=book('1.1.03',delta);
   for(const old of pending){old.paidAmount=old.total;old.status='closed';old.updatedAt=now;old.comments=`Apertura sustituida por ${id}; compensación del saldo anterior, sin cobro bancario.`;}
   state.salesOrders.push({id,createdAt:now,updatedAt:now,createdBy:uid,openingBalance:true,docNumber:id,series:'',ownerCode:'',date:d.date,dueDate:d.date,cardCode:partner!.cardCode,cardName:partner!.name,currency:'USD',reference:id,comments:'Saldo de apertura académico; no genera IVA ni ventas.',baseDocumentId:'',status:'open',lines:[],subtotal:d.amount,tax:0,total:d.amount,paidAmount:0,journalEntryId:entry,docType:'invoice'});
   partner!.balance=d.amount;partner!.updatedAt=now;description=partner!.name;
 }else{
   check(d.accountCode==='1.1.01','Para esta práctica selecciona Caja (1.1.01, equivalente a 101000 del manual).');check(d.amount>0,'Saldo positivo requerido.');
   const balance=round(state.journalEntries.filter(j=>j.date<=d.date).flatMap(j=>j.lines).filter(l=>l.accountCode===d.accountCode).reduce((s,l)=>s+l.debit-l.credit,0));delta=round(d.amount-balance);check(delta!==0,'La cuenta ya tiene ese saldo.');entry=book(d.accountCode,delta);description='Caja';
 }
 const row:TrainingOpeningRecord={...d,id,journalEntryId:entry,description,credit:0,compensationAccount:'Patrimonio - Saldos de apertura',origin:'OB',delta};
 p.trainingOpenings=[...(p.trainingOpenings??[]),row];return id;
}
