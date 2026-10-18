const {test}=require('node:test');
const assert=require('node:assert/strict');
require('./register.cjs');
const {applyCommand}=require('../src/lib/company-engine.ts');
const {emptyCompany,salesSchema,purchaseSchema}=require('../src/lib/firestore-types.ts');
const {commandSchema}=require('../src/lib/company-commands.ts');
const {prepareOpeningBalances}=require('../src/lib/opening-balances.ts');
const {openingControlMaps}=require('../src/lib/opening-balances-schema.ts');
const {verificarIntegridad,antiguedadSaldos,analisisGerencial,analisisCompras}=require('../src/lib/company-analytics.ts');
const {trialBalance,financialSummary}=require('../src/lib/company-calculations.ts');
function fixture(family='compact',method='fifo'){
 let state=emptyCompany();const uid='owner__privado',now='2025-01-15T12:00:00.000Z';
 const run=(action,data)=>{const result=applyCommand(state,commandSchema.parse({action,data}),uid,'synthetic@example.test',now);state=result.state;return result.result;};
 run('initialize',{companyName:'Empresa ficticia de apertura'});
 const partner={ruc:'1790000000001',email:'',phone:'',address:'',city:'Quito',contactName:'',currency:'USD',paymentTermsDays:30,creditLimit:10000,active:true,group:'General',notes:''};
 const customer=run('customer',{...partner,name:'Cliente ficticio',kind:'customer'});
 const vendor=run('vendor',{...partner,name:'Proveedor ficticio',ruc:'1790000000002'});
 const item=run('item',{name:'Artículo ficticio',type:'inventory',group:'General',purchaseUnit:'UND',salesUnit:'UND',price:30,price2:30,price3:30,maxDiscount:0,purchasePrice:10,preferredVendor:'',weight:0,length:0,width:0,height:0,costingMethod:method,standardCost:10,minStock:0,maxStock:1000,reorderPoint:0,description:'',specifications:'',active:true});
 const bank=run('bankAccount',{name:'Cuenta ficticia',bankName:'Banco de prueba',accountNumber:'TEST0001'});
 const map=openingControlMaps[family];
 const bankLedger=family==='compact'?state.bankAccounts[0].ledgerAccount:'1010103';
 const payload={version:1,reference:'APERTURA-2024',date:'2024-12-31',accountFamily:family,
  balances:[{accountCode:family==='compact'?'1.1.01':'1010101',debit:50,credit:0},{accountCode:bankLedger,debit:1000,credit:0},{accountCode:map['1.1.03'],debit:200,credit:0},{accountCode:map['1.1.05'],debit:100,credit:0},{accountCode:map['1.2.01'],debit:1200,credit:0},{accountCode:map['1.2.02'],debit:0,credit:300},{accountCode:map['2.1.01'],debit:0,credit:150},{accountCode:family==='compact'?'3.01':'30101',debit:0,credit:2100}],
  receivables:[{cardCode:customer,documentNumber:'FACT-ANTERIOR-1',date:'2024-11-01',dueDate:'2025-01-10',amount:200}],
  payables:[{cardCode:vendor,documentNumber:'PROV-ANTERIOR-1',date:'2024-12-01',dueDate:'2025-01-10',amount:150}],
  inventory:[{itemCode:item,warehouseCode:'PRINCIPAL',quantity:10,unitCost:10,...(method==='fifo'?{layers:[{quantity:5,unitCost:8,date:'2024-11-01'},{quantity:5,unitCost:12,date:'2024-12-01'}]}:{})}],
  banks:[{bankAccountId:bank,ledgerAccount:bankLedger,balance:1000}],
  assets:[{assetCode:'ACT-ANTERIOR-1',name:'Equipo ficticio',category:'Equipo de cómputo',acquisitionDate:'2024-01-01',cost:1200,residualValue:0,usefulLifeMonths:48,accumulatedDepreciation:300}]};
 return {run,uid,now,customer,vendor,item,bank,map,payload,get state(){return state;}};
}
const integrity=state=>{assert.deepEqual(verificarIntegridad(state).filter(v=>!v.ok),[]);assert.equal(financialSummary(trialBalance(state.chartOfAccounts,state.journalEntries,'0000-00-00','9999-12-31')).difference,0);};
for(const family of ['compact','global'])test(`apertura ${family}: preview puro, auxiliares, cobros/pagos posteriores, FIFO, depreciación y cierre`,()=>{
 const c=fixture(family),before=JSON.stringify(c.state);
 const preview=prepareOpeningBalances(c.state,c.payload,c.uid,c.now);assert.equal(JSON.stringify(c.state),before);assert.equal(preview.summary.debit,2550);assert.equal(preview.summary.credit,2550);
 const id=c.run('openingBalances',c.payload);assert.equal(id,preview.result);integrity(c.state);
 assert.equal(c.state.journalEntries.length,1);assert.equal(c.state.profile.ruc,'');assert.equal(c.state.profile.xp,0);
 assert.equal(c.state.customers[0].balance,200);assert.equal(c.state.vendors[0].balance,150);
 assert.ok(salesSchema.safeParse(c.state.salesOrders[0]).success);assert.ok(purchaseSchema.safeParse(c.state.purchaseOrders[0]).success);
 assert.equal(antiguedadSaldos(c.state,'2024-12-31','cobrar').total,200);
 assert.equal(analisisCompras(c.state,'2024-01-01','2024-12-31').total,0,'La deuda inicial no representa el valor histórico de las compras');
 const bank=(type,amount,date,documentId)=>c.run('bank',{bankAccountId:c.bank,type,amount,date,documentId,counterpartAccount:'3.01',reference:'Operación sintética'});
 bank('deposit',200,'2025-01-02',c.state.salesOrders[0].id);bank('payment',150,'2025-01-03',c.state.purchaseOrders[0].id);
 const invoice=c.run('sales',{docType:'invoice',document:{date:'2025-01-04',dueDate:'2025-02-04',cardCode:c.customer,reference:'Venta ficticia',comments:'',baseDocumentId:'',lines:[{itemCode:c.item,description:'Artículo ficticio',quantity:2,unit:'UND',price:30,discount:0,taxRate:15,warehouseCode:'PRINCIPAL'}]}});
 bank('deposit',69,'2025-01-05',invoice);c.run('depreciate',{period:'2025-01'});integrity(c.state);
 assert.equal(c.state.warehouseStock[0].quantity,8);assert.equal(c.state.warehouseStock[0].value,84);assert.equal(c.state.bankAccounts[0].balance,1119);assert.equal(c.state.fixedAssets[0].accumulatedDepreciation,325);
 assert.equal(c.state.customers[0].balance,0);assert.equal(c.state.vendors[0].balance,0);
 assert.equal(analisisGerencial(c.state,'2025-01-01','2025-12-31').cifras.ventas,60);
 assert.equal(antiguedadSaldos(c.state,'2024-12-31','cobrar').total,200);
 c.run('closeYear',{year:'2025'});integrity(c.state);
});

test('apertura admite promedio y estándar sin falsear costo y rechaza FIFO sin capas',()=>{
 for(const method of ['average','standard']){const c=fixture('compact',method);c.run('openingBalances',c.payload);integrity(c.state);}
 const c=fixture();delete c.payload.inventory[0].layers;assert.throws(()=>c.run('openingBalances',c.payload),/FIFO/);
});
test('importación rechazada es atómica para descuadres, duplicados, referencias, capas, activos y bancos inválidos',()=>{
 const mutations=[
  [p=>p.balances[0].debit++,/no cuadra/],
  [p=>p.receivables[0].amount++,/Clientes/],
  [p=>p.payables[0].amount++,/Proveedores/],
  [p=>p.receivables.push({...p.receivables[0]}),/duplicado/],
  [p=>p.balances.push({...p.balances[0]}),/duplicado/],
  [p=>p.receivables[0].cardCode='NO-EXISTE',/Socio/],
  [p=>p.receivables[0].date='2025-01-01',/posterior/],
  [p=>p.inventory[0].warehouseCode='NO-EXISTE',/Almacén/],
  [p=>p.inventory[0].quantity++,/capas/],
  [p=>p.inventory[0].layers[0].unitCost++,/capas/],
  [p=>p.inventory[0].layers[0].date='2025-01-01',/Capa/],
  [p=>p.assets[0].accumulatedDepreciation=1201,/Depreciación/],
  [p=>p.assets[0].cost++,/Costo de activos/],
  [p=>p.banks[0].balance++,/auxiliar/],
  [p=>p.banks[0].bankAccountId='NO-EXISTE',/bancaria/],
  [p=>p.banks=[],/sin detalle/],
 ];
 for(const [mutate,error]of mutations){const c=fixture(),before=JSON.stringify(c.state);mutate(c.payload);assert.throws(()=>c.run('openingBalances',c.payload),error);assert.equal(JSON.stringify(c.state),before);}
});

test('no reimporta, no admite empresa operada/cerrada/pública y bloquea asientos antes o durante el corte',()=>{
 const c=fixture();c.run('openingBalances',c.payload);const before=JSON.stringify(c.state);
 assert.throws(()=>c.run('openingBalances',c.payload),/dos veces/);assert.equal(JSON.stringify(c.state),before);
 assert.throws(()=>c.run('journal',{date:'2024-12-31',dueDate:'2024-12-31',memo:'No retroceder',reference:'TEST',lines:[{accountCode:'1.1.01',debit:1,credit:0,description:'',costCenter:''},{accountCode:'3.01',debit:0,credit:1,description:'',costCenter:''}]}),/corte/);
 const operated=fixture();operated.run('bank',{bankAccountId:operated.bank,type:'deposit',amount:1,date:'2024-12-01',documentId:'',counterpartAccount:'3.01',reference:'Prueba'});assert.throws(()=>operated.run('openingBalances',operated.payload),/ya tiene operaciones/);
 const closed=fixture();closed.run('closePeriod',{period:'2024-12',closed:true});assert.throws(()=>closed.run('openingBalances',closed.payload),/cerrado/);
 const publicState=structuredClone(fixture().state);publicState.profile.usage='training';assert.throws(()=>prepareOpeningBalances(publicState,c.payload,'student',c.now),/privada/);
});
