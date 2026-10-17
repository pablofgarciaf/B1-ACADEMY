const {test}=require('node:test');
const assert=require('node:assert/strict');
require('./register.cjs');
const {applyCommand}=require('../src/lib/company-engine.ts');
const {emptyCompany}=require('../src/lib/firestore-types.ts');
const {commandSchema}=require('../src/lib/company-commands.ts');
const {trialBalance,financialSummary,periodResults,resultadoEjercicio,round}=require('../src/lib/company-calculations.ts');
const {verificarIntegridad,analisisGerencial,antiguedadSaldos,presupuestoVsReal,flujoCaja}=require('../src/lib/company-analytics.ts');

// Entirely synthetic, in-memory fixture. Never writes company records or connects to a backend.
function fixture(){
 let state=emptyCompany(),clock='2022-01-01';
 const run=(action,data)=>{const result=applyCommand(state,commandSchema.parse({action,data}),'cycle-owner__privado','synthetic@example.test',clock+'T12:00:00.000Z');state=result.state;return result.result;};
 run('initialize',{companyName:'Empresa ficticia para pruebas de ciclo'});
 const partner={ruc:'1790000000001',email:'',phone:'',address:'',city:'Quito',contactName:'',currency:'USD',paymentTermsDays:30,creditLimit:100000,active:true,group:'General',notes:''};
 const customer=run('customer',{...partner,name:'Cliente ficticio',kind:'customer'});
 const vendor=run('vendor',{...partner,ruc:'1790000000002',name:'Proveedor ficticio'});
 const item=run('item',{name:'Producto ficticio',type:'inventory',group:'General',purchaseUnit:'UND',salesUnit:'UND',price:20,price2:20,price3:20,maxDiscount:0,purchasePrice:10,preferredVendor:'',weight:0,length:0,width:0,height:0,costingMethod:'average',standardCost:10,minStock:0,maxStock:1000,reorderPoint:0,description:'',specifications:'',active:true});
 const bank=run('bankAccount',{name:'Banco ficticio',bankName:'Banco de pruebas',accountNumber:'TEST0001'});
 const line=(quantity,price)=>({itemCode:item,description:'Producto ficticio',quantity,unit:'UND',price,discount:0,taxRate:15,warehouseCode:'PRINCIPAL'});
 const doc=(cardCode,lines,date,baseDocumentId='')=>({date,dueDate:date,cardCode,lines,baseDocumentId,reference:'Prueba ficticia',comments:''});
 const pay=(type,amount,date,documentId='',counterpartAccount='3.01')=>run('bank',{bankAccountId:bank,type,amount,date,documentId,counterpartAccount,reference:'Prueba ficticia'});
 const balance=(code,from='0000-00-00',to='9999-12-31')=>trialBalance(state.chartOfAccounts,state.journalEntries,from,to).find(r=>r.accountCode===code).closing;
 const integral=()=>{assert.equal(financialSummary(trialBalance(state.chartOfAccounts,state.journalEntries,'0000-00-00','9999-12-31')).difference,0);assert.deepEqual(verificarIntegridad(state).filter(v=>!v.ok),[]);for(const e of state.journalEntries)assert.equal(round(e.lines.reduce((s,l)=>s+l.debit-l.credit,0)),0);};
 return {run,pay,line,doc,customer,vendor,item,bank,balance,integral,get state(){return state;},date(value){clock=value;}};
}

test('cuatro ejercicios privados: apertura, compra, venta, devolución, cobro, pago, conciliación y cierre mantienen auxiliares y saldos',()=>{
 const c=fixture();c.pay('deposit',10000,'2022-01-01');
 for(const year of ['2022','2023','2024','2025']){
  c.date(year+'-02-01');
  const purchase=c.run('purchase',{docType:'vendor_invoice',document:c.doc(c.vendor,[c.line(10,10)],year+'-02-01')});
  c.pay('payment',115,year+'-02-02',purchase);
  const invoice=c.run('sales',{docType:'invoice',document:c.doc(c.customer,[c.line(3,20)],year+'-03-01')});
  c.pay('deposit',69,year+'-03-02',invoice);
  const returned=c.run('sales',{docType:'credit_note',document:c.doc(c.customer,[c.line(3,20)],year+'-03-03',invoice)});
  c.pay('payment',69,year+'-03-04',returned);
  const sale=c.run('sales',{docType:'invoice',document:c.doc(c.customer,[c.line(4,20)],year+'-04-01')});
  c.pay('deposit',92,year+'-04-02',sale);
  const transaction=c.state.bankTransactions.at(-1);
  assert.throws(()=>c.run('reconcile',{id:transaction.id,statementAmount:91,reconciled:true}),/importes/);
  c.run('reconcile',{id:transaction.id,statementAmount:92,reconciled:true});
  assert.equal(c.state.bankTransactions.at(-1).reconciled,true);
  c.integral();assert.equal(c.balance('4.01',year+'-01-01',year+'-12-31'),-80);
  assert.equal(c.state.customers[0].balance,0);assert.equal(c.state.vendors[0].balance,0);
  c.run('closePeriod',{period:year+'-04',closed:true});
  const before=JSON.stringify(c.state);
  assert.throws(()=>c.run('sales',{docType:'invoice',document:c.doc(c.customer,[c.line(1,20)],year+'-04-30')}),/cerrado/);
  assert.equal(JSON.stringify(c.state),before,'una operación rechazada es atómica');
  c.run('closeYear',{year});c.integral();
  assert.equal(c.balance('4.01'),0);assert.equal(c.balance('5.01'),0);
  assert.throws(()=>c.run('closeYear',{year}),/cerrado/);
  assert.throws(()=>c.run('closePeriod',{period:year+'-04',closed:false}),/cierre anual/);
 }
 assert.equal(c.state.warehouseStock[0].quantity,24);assert.equal(c.state.warehouseStock[0].value,240);
 assert.equal(c.state.bankAccounts[0].balance,9908);assert.equal(c.balance('3.02'),-160);
 assert.equal(c.state.profile.closedPeriods.length,48);assert.equal(c.state.profile.xp,0);
 assert.ok(c.state.chartOfAccounts.length>100,'el catálogo global sigue presente');
 const legacy=structuredClone(c.state);delete legacy.profile.closedFiscalYears;
 for(const [action,data] of [['closeYear',{year:'2022'}],['closePeriod',{period:'2022-01',closed:false}]])assert.throws(()=>applyCommand(legacy,commandSchema.parse({action,data}),'cycle-owner__privado','synthetic@example.test','2026-01-01T00:00:00.000Z'),/cerrado|cierre anual/);
});

test('reversión de asiento manual abierto revierte importes y conserva referencias; rechazo no modifica empresa',()=>{
 const c=fixture();
 const lines=[{accountCode:'1.1.01',debit:100,credit:0,description:'',costCenter:''},{accountCode:'3.01',debit:0,credit:100,description:'',costCenter:''}];
 const id=c.run('journal',{date:'2022-01-01',dueDate:'2022-01-01',memo:'Apertura ficticia caja',reference:'APERTURA',lines});
 c.run('reverse',{entryId:id,date:'2022-01-02'});assert.equal(c.balance('1.1.01'),0);c.integral();
 const before=JSON.stringify(c.state);assert.throws(()=>c.run('reverse',{entryId:id,date:'2022-01-03'}),/reversión/);assert.equal(JSON.stringify(c.state),before);
 assert.equal(c.state.journalEntries.at(-1).reversalOf,id);
});

test('los indicadores anuales conservan ventas y margen histórico después del cierre contable',()=>{
 const c=fixture();c.pay('deposit',1000,'2022-01-01');
 c.run('purchase',{docType:'vendor_invoice',document:c.doc(c.vendor,[c.line(10,10)],'2022-02-01')});
 c.run('sales',{docType:'invoice',document:c.doc(c.customer,[c.line(4,20)],'2022-03-01')});
 const before=analisisGerencial(c.state,'2022-01-01','2022-12-31');
 c.run('closeYear',{year:'2022'});
 const after=analisisGerencial(c.state,'2022-01-01','2022-12-31');
 assert.equal(before.cifras.ventas,80);assert.equal(after.cifras.ventas,80);
 assert.equal(after.cifras.costoVentas,40);assert.equal(after.cifras.utilidadBruta,40);
 assert.equal(after.cifras.activoTotal,before.cifras.activoTotal);
 assert.equal(after.cifras.patrimonio,before.cifras.patrimonio);
});

test('catálogo global: ingresos, devoluciones, gastos, efectivo y balance se interpretan antes y después del cierre',()=>{
 const c=fixture();
 const journal=(date,amount,debit,credit)=>c.run('journal',{date,dueDate:date,memo:'Prueba del catálogo global',reference:'GLOBAL',lines:[{accountCode:debit,debit:amount,credit:0,description:'',costCenter:''},{accountCode:credit,debit:0,credit:amount,description:'',costCenter:''}]});
 journal('2022-01-01',1000,'1010101','30101');
 journal('2022-02-01',200,'1010101','4102');
 journal('2022-02-02',20,'4111','1010101');
 journal('2022-02-03',30,'6.03','1010101');
 c.run('budget',{year:'2022',accountCode:'4102',months:[0,200,0,0,0,0,0,0,0,0,0,0]});
 for(const closed of [false,true]){
  if(closed)c.run('closeYear',{year:'2022'});
  const a=analisisGerencial(c.state,'2022-01-01','2022-12-31');
  assert.equal(a.cifras.ventas,180);assert.equal(a.cifras.gastos,30);assert.equal(a.cifras.efectivo,1150);assert.equal(a.cifras.activoCorriente,1150);
  assert.equal(a.cifras.utilidadOperacional,150);assert.equal(a.cifras.patrimonio,1150);
  const p=periodResults(c.state.chartOfAccounts,c.state.journalEntries,'2022-01-01','2022-12-31');assert.equal(p.operatingRevenue,180);assert.equal(p.profit,150);
  assert.equal(resultadoEjercicio(c.state,2022),150);
  const cash=flujoCaja(c.state,'2022-01-01','2022-12-31');assert.equal(cash.saldoFinal,1150);assert.equal(cash.porActividad.Financiamiento,1000);assert.equal(cash.porActividad['Operación'],150);
  assert.equal(presupuestoVsReal(c.state,'2022',12).filas[0].realAcum,200);
 }
});

test('asientos y bancos privados rechazan cuentas de control sin auxiliar en ambos catálogos de forma atómica',()=>{
 const c=fixture();c.pay('deposit',1000,'2022-01-01');
 for(const accountCode of ['1.1.03','1.1.05','1.2.01','2.1.01','101020502','1010306','1020101','2010301']){
  const before=JSON.stringify(c.state);
  assert.throws(()=>c.run('journal',{date:'2022-01-02',dueDate:'2022-01-02',memo:'No permitir auxiliar huérfano',reference:'CONTROL',lines:[{accountCode,debit:10,credit:0,description:'',costCenter:''},{accountCode:'3.01',debit:0,credit:10,description:'',costCenter:''}]}),/auxiliar/);
  assert.throws(()=>c.pay('payment',10,'2022-01-02','',accountCode),/auxiliar/);
  assert.equal(JSON.stringify(c.state),before);
 }
 c.integral();
});

test('antigüedad histórica conserva la deuda al corte aunque ya se haya cobrado o pagado después',()=>{
 const c=fixture();c.pay('deposit',1000,'2022-01-01');
 const purchase=c.run('purchase',{docType:'vendor_invoice',document:c.doc(c.vendor,[c.line(10,10)],'2022-02-01')});
 const invoice=c.run('sales',{docType:'invoice',document:c.doc(c.customer,[c.line(4,20)],'2022-03-01')});
 c.pay('payment',115,'2022-04-01',purchase);c.pay('deposit',92,'2022-04-02',invoice);
 assert.equal(antiguedadSaldos(c.state,'2022-03-31','cobrar').total,92);
 assert.equal(antiguedadSaldos(c.state,'2022-03-31','pagar').total,115);
 assert.equal(antiguedadSaldos(c.state,'2022-04-30','cobrar').total,0);
 assert.equal(antiguedadSaldos(c.state,'2022-04-30','pagar').total,0);
});

test('un año sin resultado queda cerrado una sola vez aunque no produzca asiento de cierre',()=>{
 const c=fixture();c.pay('deposit',1000,'2022-01-01');
 c.run('closeYear',{year:'2022'});
 assert.equal(c.state.journalEntries.some(e=>e.source==='closing'),false);
 assert.deepEqual(c.state.profile.closedFiscalYears,['2022']);
 const before=JSON.stringify(c.state);
 assert.throws(()=>c.run('closeYear',{year:'2022'}),/ya fue cerrado/);
 assert.throws(()=>c.run('closePeriod',{period:'2022-01',closed:false}),/cierre anual/);
 assert.equal(JSON.stringify(c.state),before);c.integral();
});

test('el cobro con retenciones conserva su detalle y la deuda histórica anterior al cobro',()=>{
 const {bankSchema}=require('../src/lib/firestore-types.ts');
 const c=fixture();c.pay('deposit',1000,'2022-01-01');
 c.run('purchase',{docType:'vendor_invoice',document:c.doc(c.vendor,[c.line(10,10)],'2022-02-01')});
 const invoice=c.run('sales',{docType:'invoice',document:c.doc(c.customer,[c.line(4,20)],'2022-03-01')});
 c.run('bank',{bankAccountId:c.bank,type:'deposit',amount:87,retentionIR:2,retentionIVA:3,date:'2022-04-02',documentId:invoice,counterpartAccount:'1.1.03',reference:'Cobro ficticio con retenciones'});
 const stored=bankSchema.parse(c.state.bankTransactions.at(-1));
 assert.equal(stored.retentionIR,2);assert.equal(stored.retentionIVA,3);
 assert.equal(antiguedadSaldos(c.state,'2022-03-31','cobrar').total,92);
 assert.equal(antiguedadSaldos(c.state,'2022-04-30','cobrar').total,0);c.integral();
});
