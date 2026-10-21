import type {CompanyState,JournalLine,Entity} from './firestore-types';
import type {FinalOperationCommand} from './final-operation-commands';
import {round,totals} from './company-calculations';

export interface FinalOperationRecord {id:string;kind:string;[key:string]:unknown}
export interface AccountDeterminationRule {customerCode:string;itemGroup:string;incomeAccount:string;inventoryAccount:string;costAccount:string;receivableAccount:string;taxAccount:string}
const assert=(v:unknown,message:string):void=>{if(!v)throw new Error(message);};
export function documentAccountRule(state:CompanyState,customerCode:string,itemCode:string){
 const item=state.items.find(i=>i.itemCode===itemCode);
 return state.profile?.accountDeterminationRules?.find(r=>r.customerCode===customerCode&&r.itemGroup===item?.group);
}
type Tools={next:(prefix:string,date?:string)=>string;post:(date:string,memo:string,source:string,reference:string,lines:JournalLine[])=>string;meta:(id:string)=>Entity};
export function applyFinalOperation(state:CompanyState,command:FinalOperationCommand,t:Tools):string{
 const p=state.profile!;const d=command.data;const id=t.next('OP',d&&'date'in d?d.date:undefined);
 let row:FinalOperationRecord={id,kind:command.action,...d};
 const line=(accountCode:string,debit=0,credit=0,costCenter=''):JournalLine=>({accountCode,debit,credit,costCenter,description:''});
 if(command.action==='vendorAdvance'){
  const d=command.data,bank=state.bankAccounts.find(b=>b.id===d.bankAccountId&&b.active),vendor=state.vendors.find(v=>v.cardCode===d.vendorCode&&v.active);assert(bank&&vendor,'Selecciona banco y proveedor activos.');assert(bank!.balance>=d.amount,'Saldo bancario insuficiente.');assert(!state.bankTransactions.some(b=>b.reference===d.reference),'La referencia ya existe.');
  const journalEntryId=t.post(d.date,'Anticipo a proveedor','bank',d.reference,[line('2.1.01',d.amount),line(bank!.ledgerAccount,0,d.amount)]);bank!.balance=round(bank!.balance-d.amount);vendor!.balance=round(vendor!.balance-d.amount);
  state.bankTransactions.push({...t.meta(id),transactionId:id,bankAccountId:bank!.id,date:d.date,type:'payment',amount:d.amount,paymentMethod:'transfer',partnerCode:d.vendorCode,documentNumber:'',counterpartAccount:'2.1.01',reference:d.reference,documentId:'',reconciled:false,statementAmount:null,journalEntryId,bankName:bank!.bankName,accountName:bank!.name,accountNumber:bank!.accountNumber});row={...row,journalEntryId};
 }else if(command.action==='cardReceipt'){
  const d=command.data,invoice=state.salesOrders.find(i=>i.id===d.invoiceId&&i.docType==='invoice');assert(invoice&&d.amount<=round(invoice.total-invoice.paidAmount),'Selecciona una factura con saldo suficiente.');assert(d.date>=invoice!.date,'El cobro no puede preceder a la factura.');
  const journalEntryId=t.post(d.date,'Cobro pendiente de liquidar por tarjeta','card_receipt',id,[line('1.1.14',d.amount),line('1.1.03',0,d.amount)]);invoice!.paidAmount=round(invoice!.paidAmount+d.amount);invoice!.status=invoice!.paidAmount===invoice!.total?'closed':'open';const customer=state.customers.find(c=>c.cardCode===invoice!.cardCode);assert(customer,'Cliente inexistente.');customer!.balance=round(customer!.balance-d.amount);row={...row,journalEntryId};
 }else if(command.action==='procurementQuotes'){
  const d=command.data,request=state.purchaseOrders.find(r=>r.id===d.requestId&&r.docType==='purchase_request');assert(request,'Selecciona una solicitud de compra real.');assert(d.date>=request!.date,'La cotización no puede preceder a su solicitud.');assert(new Set(d.vendorCodes).size===d.vendorCodes.length,'Proveedor repetido.');
  const quotes=d.vendorCodes.map(vendorCode=>{const vendor=state.vendors.find(v=>v.cardCode===vendorCode&&v.active);assert(vendor,'Proveedor inactivo o inexistente.');return {id:t.next('OC',d.date),docType:'purchase_quotation',vendorCode,vendorName:vendor!.name,baseDocumentId:request!.id,date:d.date,lines:structuredClone(request!.lines),...totals(request!.lines)};});
  row={...row,sourceType:'Solicitud de Compra',requestNumber:request!.docNumber,itemCode:request!.lines[0].itemCode,quantity:request!.lines[0].quantity,vendorCount:quotes.length,targetType:'Cotización de Compra',quotes};
 }else if(command.action==='costAdjustment'){
  const d=command.data;assert(d.fromCenter!==d.toCenter,'El centro de origen y destino deben ser distintos.');
  const centers=(p as unknown as {costCenters?:{centros?:{codigo:string}[]}}).costCenters?.centros??[];assert([d.fromCenter,d.toCenter].every(c=>centers.some(r=>r.codigo===c)),'Selecciona centros de coste configurados.');
  const series=((p as unknown as {docSeries?:{docType:string;nombre:string;actual:number;inicio:number;fin:number;bloqueada?:boolean}[]}).docSeries??[]).find(s=>s.docType==='asientos'&&s.nombre===d.series);assert(series&&!series.bloqueada&&series.actual>=series.inicio&&series.actual<=series.fin,'Configura una serie de asientos con números disponibles.');
  const journalEntryId=t.post(d.date,'Redistribución entre centros de coste','cost_adjustment',`${d.series}-${series!.actual}`,[line(d.accountCode,d.amount,0,d.toCenter),line(d.accountCode,0,d.amount,d.fromCenter)]);series!.actual++;
  row={...row,journalEntryId};
 }else if(command.action==='cardSettlement'){
  const d=command.data,bank=state.bankAccounts.find(b=>b.id===d.bankAccountId&&b.active);assert(bank,'Selecciona un banco activo.');
  const available=round(state.journalEntries.filter(e=>e.date<=d.date).flatMap(e=>e.lines).filter(l=>l.accountCode==='1.1.14').reduce((s,l)=>s+l.debit-l.credit,0));assert(available>=d.amount,'La compensación de tarjetas no tiene saldo suficiente al corte. Registra primero el cobro con tarjeta en la cuenta 1.1.14.');assert(!(p.finalOperations??[]).some(r=>r.kind==='cardSettlement'&&r.reference===d.reference),'La referencia del depósito ya existe.');
  const journalEntryId=t.post(d.date,'Liquidación de tarjetas','card_settlement',d.reference,[line(bank!.ledgerAccount,d.amount),line('1.1.14',0,d.amount)]);bank!.balance=round(bank!.balance+d.amount);
  state.bankTransactions.push({...t.meta(id),transactionId:id,bankAccountId:bank!.id,date:d.date,type:'deposit',amount:d.amount,paymentMethod:'card',partnerCode:'',documentNumber:'',counterpartAccount:'1.1.14',reference:d.reference,documentId:'',reconciled:false,statementAmount:null,journalEntryId,bankName:bank!.bankName,accountName:bank!.name,accountNumber:bank!.accountNumber});
  row={...row,sourceAccount:'Compensación Tarjetas',destinationAccount:`${bank!.bankName} Cta Corriente`,journalEntryId};
 }else if(command.action==='vendorReconciliation'){
  const d=command.data,invoice=state.purchaseOrders.find(i=>i.id===d.invoiceId&&i.docType==='vendor_invoice'&&i.cardCode===d.vendorCode),payment=state.bankTransactions.find(b=>b.id===d.paymentId&&b.type==='payment'&&!b.documentId&&b.counterpartAccount==='2.1.01');
  assert(invoice&&payment,'Selecciona una factura del proveedor y un anticipo no aplicado.');assert(payment!.partnerCode===d.vendorCode,'El anticipo debe pertenecer al mismo proveedor.');assert(d.date>=invoice!.date&&d.date>=payment!.date,'La conciliación no puede preceder a las partidas.');assert(d.amount===payment!.amount&&d.amount<=round(invoice!.total-invoice!.paidAmount),'El importe debe coincidir con el anticipo y no superar el saldo de factura.');assert(!(p.finalOperations??[]).some(r=>r.kind==='vendorReconciliation'&&r.paymentId===d.paymentId),'El anticipo ya fue aplicado.');
  invoice!.paidAmount=round(invoice!.paidAmount+d.amount);invoice!.status=invoice!.paidAmount===invoice!.total?'closed':'open';payment!.documentId=invoice!.id;payment!.documentNumber=invoice!.docNumber;
  assert(state.vendors.some(v=>v.cardCode===d.vendorCode),'Proveedor inexistente.');
  row={...row,accountType:'Proveedor',creditNumber:invoice!.docNumber,debitNumber:payment!.reference||payment!.transactionId,creditValue:d.amount,debitValue:d.amount};
 }else if(command.action==='vendorAging'){
  const d=command.data;assert(state.vendors.some(v=>v.cardCode===d.vendorCode),'Proveedor inexistente.');
  const reconciliationFor=(paymentId:string)=>(p.finalOperations??[]).find(r=>r.kind==='vendorReconciliation'&&r.paymentId===paymentId);
  const appliedAtCutoff=(paymentId:string)=>{const reconciliation=reconciliationFor(paymentId);return !reconciliation||String(reconciliation.date)<=d.date;};
  const rows=state.purchaseOrders.filter(i=>i.cardCode===d.vendorCode&&i.docType==='vendor_invoice'&&i.date<=d.date).map(i=>{
   const paid=state.bankTransactions.filter(b=>b.type==='payment'&&b.documentId===i.id&&b.date<=d.date&&appliedAtCutoff(b.id)).reduce((s,b)=>s+b.amount+(b.discountAmount??0),0);
   const balance=round(i.total-paid),days=Math.floor((Date.parse(d.date)-Date.parse(i.dueDate))/86400000);return {documentId:i.id,number:i.docNumber,dueDate:i.dueDate,balance,days,bucket:days<=0?0:days<=d.ranges[0]?1:days<=d.ranges[1]?2:days<=d.ranges[2]?3:4};
  }).filter(r=>r.balance!==0);
  const advances=d.showAdvances?state.bankTransactions.filter(b=>b.type==='payment'&&b.partnerCode===d.vendorCode&&(!b.documentId||!appliedAtCutoff(b.id))&&b.date<=d.date).map(b=>({number:b.reference||b.transactionId,amount:b.amount})):[];
  row={...row,range1:d.ranges[0],range2:d.ranges[1],range3:d.ranges[2],rows,advances,total:round(rows.reduce((s,r)=>s+r.balance,0)-advances.reduce((s,r)=>s+r.amount,0))};
 }else if(command.action==='accountDetermination'){
  const d=command.data;assert(state.customers.some(c=>c.cardCode===d.customerCode),'Cliente inexistente.');const categories={incomeAccount:['income'],inventoryAccount:['asset'],costAccount:['cost','expense'],receivableAccount:['asset'],taxAccount:['liability']};for(const field of ['incomeAccount','inventoryAccount','costAccount','receivableAccount','taxAccount'] as const)assert(state.chartOfAccounts.some(a=>a.code===d[field]&&a.active&&a.postable&&categories[field].includes(a.category)),`Cuenta no imputable o de naturaleza incompatible: ${d[field]}`);
  assert(d.receivableAccount===(p.controlAccounts?.['1.1.03']??'1.1.03'),'Conserva la cuenta asociada de clientes del auxiliar de esta empresa.');
  p.accountDeterminationRules=[...(p.accountDeterminationRules??[]).filter(r=>r.customerCode!==d.customerCode||r.itemGroup!==d.itemGroup),d];
 }else if(command.action==='accountingPreview'){
  const d=command.data,rule=documentAccountRule(state,d.customerCode,d.itemCode),item=state.items.find(i=>i.itemCode===d.itemCode);assert(rule&&item,'Configura la determinación para ese cliente y grupo de artículo.');const stock=state.warehouseStock.find(w=>w.itemCode===d.itemCode&&w.warehouseCode===d.warehouseCode);assert(stock&&stock.quantity>=d.quantity,'Existencias insuficientes para la factura.');
  const subtotal=round(d.quantity*d.price),tax=round(subtotal*item!.salesTaxRate/100),cost=round(d.quantity*stock!.averageCost);const lines=[line(rule!.receivableAccount,subtotal+tax),line(rule!.incomeAccount,0,subtotal),line(rule!.taxAccount,0,tax),line(rule!.costAccount,cost),line(rule!.inventoryAccount,0,cost)];row={...row,...rule,subtotal,tax,cost,lines};
 }
 p.finalOperations=[...(p.finalOperations??[]),row];return id;
}
