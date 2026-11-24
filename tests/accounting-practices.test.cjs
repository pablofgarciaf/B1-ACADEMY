const {test}=require('node:test');const assert=require('node:assert/strict');require('./register.cjs');
const {applyCommand}=require('../src/lib/company-engine.ts');const {commandSchema}=require('../src/lib/company-commands.ts');const {emptyCompany,sriDetailsSchema}=require('../src/lib/firestore-types.ts');const {defaultATS}=require('../src/lib/company-defaults.ts');const {auditChanges}=require('../src/lib/company-audit.ts');const {missionOutcomeMatches}=require('../src/lib/practice-outcome-contract.ts');const {pantallaConectada}=require('../src/lib/practica-conectada.ts');const {operationFor}=require('../src/lib/practice-contract.ts');
function fixture(){let state=emptyCompany();const run=(action,data)=>{const before=state;const out=applyCommand(state,commandSchema.parse({action,data}),'synthetic','synthetic@example.test','2026-10-20T18:00:00Z');state=out.state;return {action,result:out.result,changes:auditChanges(before,state)};};run('initializeTraining',{});return {run,get state(){return state;}};}
const doc=(date,partner,quantity,price)=>({date,dueDate:date,cardCode:partner,reference:'Sintético',comments:'',baseDocumentId:'',lines:[{itemCode:'A00001',description:'Laptop Dell Latitude 3420',quantity,unit:'UND',price,discount:0,taxRate:15,warehouseCode:'01'}]});
test('retenciones usan base y líneas de factura persistida; ATS inventado no aprueba',()=>{
 for(const [date,key]of [['2026-04-05','mod22-c2#8'],['2026-06-15','mod22-c3#8']]){
 const c=fixture(),invoice=c.run('purchase',{docType:'vendor_invoice',document:doc(date,'V10000',2,850)});
 const event=c.run('sri',{docType:'07',date,partnerCode:'V10000',sourceDocumentId:invoice.result,series:'001-001',retentionLines:[{code:'IVA-30',tax:'IVA',base:255,rate:30}],ats:defaultATS(),details:sriDetailsSchema.parse({supportNumber:'001-001-000000001'})});
 assert.equal(missionOutcomeMatches(c.state,event,key),true);assert.equal(c.state.sriDocuments.at(-1).totalRetention,76.5);
 const tampered=structuredClone(c.state);tampered.purchaseOrders.at(-1).subtotal=170;assert.equal(missionOutcomeMatches(tampered,event,key),false);
 }
});
test('guía corresponde a entrega, artículo, cantidad y transportista reales',()=>{
 const c=fixture(),delivery=c.run('sales',{docType:'delivery',document:doc('2026-06-16','C20000',1,850)});
 const event=c.run('sri',{docType:'06',date:'2026-06-16',partnerCode:'C20000',sourceDocumentId:delivery.result,series:'001-001',retentionLines:[],ats:defaultATS(),details:sriDetailsSchema.parse({reason:'Venta',carrierName:'Juan Pérez',carrierId:'1712345675',plate:'ABC1234',departureAddress:'Quito',destinationAddress:'Quito',transportStart:'2026-06-16',transportEnd:'2026-06-16'})});
 assert.equal(missionOutcomeMatches(c.state,event,'mod22-c6#7'),true);assert.match(c.state.sriDocuments.at(-1).xml,/<guiaRemision/);
});
test('ISD abre pago exterior y verifica proveedor, concepto y asiento balanceado',()=>{
 const c=fixture();c.run('bank',{bankAccountId:'BAN-1',date:'2026-01-01',type:'deposit',amount:3000,counterpartAccount:'3.01',reference:'Aporte',documentId:''});
 for(const [key,vendorCode,date,amount,tarifa,concept]of [['mod22-c9#5','V10000','2026-06-15',1000,'5','Licencia de software'],['mod22-c9#7','V10001','2026-06-20',800,'2.5','Importación de equipos']]){
 const event=c.run('foreignPayment',{bankAccountId:'BAN-1',date,vendorCode,amount,tarifa,concept,destination:tarifa==='5'?'servicio':'importacion',imputacion:'gasto',reference:''});assert.equal(missionOutcomeMatches(c.state,event,key),true);
 const entry=c.state.journalEntries.at(-1);assert.equal(entry.totalDebit,entry.totalCredit);assert.equal(pantallaConectada({title:concept.includes('Licencia')?'Registrar pago al exterior':'Registrar pago ISD reducido',menu_path:'Gestión de bancos > Pagos efectuados'}).clave,'isd');
 }
});
test('cobro con retenciones liquida la factura exacta y conserva créditos tributarios',()=>{
 const c=fixture();c.run('docSeriesSave',{series:[{id:'f',docType:'facturas',nombre:'Ejercicio',prefijo:'',inicio:5000,actual:5000,fin:5999,digitos:4,porDefecto:true,bloqueada:false,grupo:1}]});
 const invoice=c.run('sales',{docType:'invoice',document:doc('2026-06-01','C20000',1,1000)});const event=c.run('bank',{bankAccountId:'BAN-1',date:'2026-06-01',type:'deposit',amount:1085,retentionIR:20,retentionIVA:45,counterpartAccount:'1.1.03',reference:'Cobro',documentId:invoice.result});
 assert.equal(missionOutcomeMatches(c.state,event,'mod22-c10#5'),true);assert.equal(c.state.salesOrders.at(-1).status,'closed');const e=c.state.journalEntries.at(-1);assert.equal(e.lines.find(l=>l.accountCode==='1.1.10').debit,20);assert.equal(e.lines.find(l=>l.accountCode==='1.1.11').debit,45);
});
test('apertura académica ajusta stock y patrimonio; no reconoce ingreso ni afecta empresa privada',()=>{
 const c=fixture();for(const[key,quantity]of [['mod25-c3#5',50],['mod29-c3#5',10]]){const e=c.run('trainingOpening',{kind:'inventory',date:'2026-01-01',itemCode:'A00001',warehouseCode:'01',quantity,unitCost:650});assert.equal(missionOutcomeMatches(c.state,e,key),true);const stock=c.state.warehouseStock.find(s=>s.itemCode==='A00001'&&s.warehouseCode==='01');assert.equal(stock.quantity,quantity+20);assert.equal(stock.value,(quantity+20)*650);const cutoff=c.state.stockMovements.filter(m=>m.itemCode==='A00001'&&m.date<='2026-01-01').reduce((s,m)=>s+m.quantity,0);assert.equal(cutoff,quantity);assert.deepEqual(c.state.journalEntries.at(-1).lines.map(l=>l.accountCode).sort(),['1.1.05','3.03']);}
 const privateState=structuredClone(c.state);privateState.profile.usage='private';assert.throws(()=>applyCommand(privateState,commandSchema.parse({action:'trainingOpening',data:{kind:'cash',date:'2026-01-01',amount:10}}),'u','e','2026-10-20'),/privada/);
});
test('apertura de caja y cliente conserva auxiliares cobrables y evita duplicar saldos',()=>{
 const c=fixture();for(const[key,kind,amount]of [['mod29-c1#7','cash',15000],['mod29-c3#7','cash',1500],['mod29-c1#9','customer',5000],['mod29-c3#9','customer',2000]]){
 const e=c.run('trainingOpening',{kind,date:'2026-01-01',amount,cardCode:'C20000'});assert.equal(missionOutcomeMatches(c.state,e,key),true);assert.equal(c.state.journalEntries.at(-1).totalDebit,c.state.journalEntries.at(-1).totalCredit);
 }
 assert.equal(c.state.customers[0].balance,2000);assert.equal(c.state.salesOrders.filter(d=>d.status==='open').reduce((s,d)=>s+d.total-d.paidAmount,0),2000);
 assert.throws(()=>c.run('trainingOpening',{kind:'customer',date:'2026-01-01',amount:2000,cardCode:'C20000'}),/ya tiene/);
 const invoice=c.state.salesOrders.find(d=>d.status==='open');c.run('bank',{bankAccountId:'BAN-1',date:'2026-01-02',type:'deposit',amount:2000,counterpartAccount:'1.1.03',reference:'Cobro apertura',documentId:invoice.id});assert.equal(c.state.customers[0].balance,0);
});
test('períodos mensuales guardan el ejercicio y cierre impide contabilizar',()=>{
 const c=fixture();let e=c.run('accountingPeriods',{startDate:'2026-01-01',endDate:'2026-12-31',dueThrough:'2027-12-31'});assert.equal(missionOutcomeMatches(c.state,e,'mod29-c2#5'),true);assert.equal(c.state.profile.accountingPeriods.length,12);
 assert.throws(()=>c.run('sales',{docType:'invoice',document:{...doc('2026-12-01','C20000',1,1000),dueDate:'2028-01-01'}}),/fuera del período/);
 assert.throws(()=>c.run('trainingOpening',{kind:'cash',date:'2027-01-01',amount:1500}),/Configura un período/);
 const other=fixture();e=other.run('closePeriod',{period:'2026-01',closed:true});assert.equal(missionOutcomeMatches(other.state,e,'mod25-c4#5'),true);assert.throws(()=>other.run('trainingOpening',{kind:'cash',date:'2026-01-01',amount:1500}),/cerrado/);
 assert.deepEqual(operationFor({clave:'apertura'}),['trainingOpening']);
});
test('cockpit valida plantilla activa y usuario del caso sin cambiar identidad real',()=>{
 const c=fixture(),plantillas=[{id:'ventas',nombre:'Ventas',descripcion:'Cockpit de Ventas estilo Fiori',widgets:[]}];
 const inactive=c.run('cockpitSave',{plantillas,plantillaActiva:'',usuario:'director'});assert.equal(missionOutcomeMatches(c.state,inactive,'mod30-c1#5'),false);
 const active=c.run('cockpitSave',{plantillas,plantillaActiva:'ventas',usuario:'director'});assert.equal(missionOutcomeMatches(c.state,active,'mod30-c1#5'),true);assert.equal(c.state.profile.cockpit.actorUid,'synthetic');
 assert.throws(()=>c.run('cockpitSave',{plantillas,plantillaActiva:'otra',usuario:'director'}),/existente/);
});
test('todas las prácticas contables tienen pantalla y acción apropiada conectadas',()=>{
 const lessons=require('../src/content/aula/lecciones.json');
 const cases={'mod22-c2#8':['sri','sri'],'mod22-c3#8':['sri','sri'],'mod22-c6#7':['sri','sri'],'mod22-c9#5':['isd','foreignPayment'],'mod22-c9#7':['isd','foreignPayment'],'mod22-c10#5':['bancos','bank'],'mod25-c3#5':['apertura','trainingOpening'],'mod25-c4#5':['cierre','closePeriod'],'mod29-c1#7':['apertura','trainingOpening'],'mod29-c1#9':['apertura','trainingOpening'],'mod29-c2#5':['cierre','accountingPeriods'],'mod29-c3#5':['apertura','trainingOpening'],'mod29-c3#7':['apertura','trainingOpening'],'mod29-c3#9':['apertura','trainingOpening'],'mod30-c1#5':['cockpit','cockpitSave']};
 for(const[key,[screen,action]]of Object.entries(cases)){const[lesson,index]=key.split('#'),guide=lessons[lesson].syncData.find(s=>s.slide_index===Number(index)).step_guide,p=pantallaConectada({...guide,missionId:key});assert.equal(p?.clave,screen,key);assert.ok(operationFor(p).includes(action),key);}
});
