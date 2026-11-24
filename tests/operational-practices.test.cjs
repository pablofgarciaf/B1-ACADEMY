const {test}=require('node:test');
const assert=require('node:assert/strict');
require('./register.cjs');
const {applyCommand}=require('../src/lib/company-engine.ts');
const {commandSchema}=require('../src/lib/company-commands.ts');
const {emptyCompany}=require('../src/lib/firestore-types.ts');
const {auditChanges}=require('../src/lib/company-audit.ts');
const {missionOutcomeMatches}=require('../src/lib/practice-outcome-contract.ts');
function fixture(){let state=emptyCompany();const run=(action,data)=>{const before=state,out=applyCommand(state,commandSchema.parse({action,data}),'student','student@example.test','2026-10-20T12:00:00Z');state=out.state;return{action,result:out.result,changes:auditChanges(before,state)};};run('initializeTraining',{});return{run,get state(){return state;}};}
const line=(employeeCode,extra50=0,advances=0)=>({employeeCode,days:30,extra50,extra100:0,commissions:0,otherIncome:0,advances,otherDeductions:0});
test('cinco misiones de nómina se resuelven con roles contabilizados y datos coincidentes',()=>{
 for(const [keys,period,employee,extra,advance]of[[['mod5-c1#6'],'2026-05','E005',0,0],[['mod5-c2#5','mod6-c1#5'],'2026-04','E002',10,100],[['mod5-c2#7','mod6-c1#7'],'2026-05','E004',0,0]]){
  const c=fixture(),event=c.run('payroll',{period,date:period+'-28',sbu:482,lines:[line(employee,extra,advance)]});
  for(const key of keys)assert.equal(missionOutcomeMatches(c.state,event,key),true,key);
  assert.ok(c.state.payrollRuns[0].journalEntryId);
 }
});
test('series de activos y ajuste guardan longitud y uso contable comprobables',()=>{
 const c=fixture(),event=c.run('docSeriesSave',{series:[{docType:'activos',nombre:'AF001',digitos:8,inicio:1,fin:99999999,actual:1},{docType:'asientos',nombre:'AJC001',description:'Ajuste de Costos',inicio:1,fin:99999,actual:1,costAdjustmentOnly:true}]});
 assert.equal(missionOutcomeMatches(c.state,event,'mod3-c1#6'),true);
 assert.equal(missionOutcomeMatches(c.state,event,'mod9-c4#5'),true);
});
test('grupo de artículos conserva las tres reglas de valoración en una fila',()=>{
 const c=fixture(),event=c.run('itemGroupSave',{groups:[{codigo:'GEN-001',nombre:'Artículos Genéricos',descripcion:'',costingMethod:'average',perWarehouse:false,perpetualInventory:true}]});
 assert.equal(missionOutcomeMatches(c.state,event,'mod9-c3#5'),true);
});
test('ubicación calcula el peso real y rechaza asignaciones sobre el máximo',()=>{
 const c=fixture(),item=c.run('item',{...c.state.items[0],name:'Caja de prueba de 4 kg',weight:4});
 c.run('stock',{itemCode:item.result,warehouseCode:'01',qty:30,costingMethod:'average'});
 c.run('binLocation',{warehouseCode:'01',binCode:'UBIC01',description:'Ubic_1',maxQuantity:100,maxWeight:100});
 const event=c.run('binMove',{warehouseCode:'01',itemCode:item.result,fromBin:'',toBin:'UBIC01',quantity:20});
 assert.equal(missionOutcomeMatches(c.state,event,'mod10-c2#6'),true);
 assert.throws(()=>c.run('binMove',{warehouseCode:'01',itemCode:item.result,fromBin:'',toBin:'UBIC01',quantity:6}),/peso máximo/);
});
test('pedido y factura de servicio conservan gasto imputable sin crear existencias',()=>{
 for(const [key,type,vendor,date,description,price]of[['mod8-c2#4','purchase_order','V10000','2026-04-05','Diseño web institucional',1200],['mod8-c2#5','vendor_invoice','V10001','2026-04-10','Mantenimiento mensual equipos',350]]){
  const c=fixture(),service=c.state.items.find(i=>i.type==='service'),event=c.run('purchase',{docType:type,document:{date,dueDate:date,cardCode:vendor,reference:'',comments:'',baseDocumentId:'',lines:[{itemCode:service.itemCode,description,quantity:1,price,unit:'UND',discount:0,taxRate:15,warehouseCode:'01',expenseAccount:'6200'}]}});
  assert.equal(missionOutcomeMatches(c.state,event,key),true,key);
  assert.equal(c.state.stockMovements.some(m=>m.itemCode===service.itemCode),false);
  if(type==='vendor_invoice')assert.equal(c.state.journalEntries.at(-1).lines.find(l=>l.accountCode==='6200').debit,price);
 }
});
test('las cuatro devoluciones verifican sustento, RMA, stock y asiento sin duplicar cantidades',()=>{
 for(const[key,kind,vendor,item,quantity,price,date,reason,rma,withoutQuantity]of[
  ['mod8-c3#5','request','V10000','A00001',2,650,'2026-04-15','Daño transporte','RMA20260415',false],
  ['mod8-c3#6','goods_return','V10000','A00001',2,650,'2026-04-16','Daño transporte','',false],
  ['mod8-c3#8','credit_note','V10001','A00003',5,180,'2026-04-20','Defecto','',false],
  ['mod8-c3#10','value_credit','V10002','A00001',1,100,'2026-04-25','Falta 10% descuento','',true]]){
  const c=fixture();let baseDocumentId='';
  if(kind!=='request')baseDocumentId=c.run('purchase',{docType:kind==='goods_return'?'goods_receipt':'vendor_invoice',document:{date:'2026-04-01',dueDate:'2026-04-30',cardCode:vendor,reference:'',comments:'',baseDocumentId:'',lines:[{itemCode:item,description:c.state.items.find(i=>i.itemCode===item).name,quantity,price:kind==='value_credit'?1000:price,unit:'UND',discount:0,taxRate:15,warehouseCode:'01'}]}}).result;
  const before=c.state.warehouseStock.find(s=>s.itemCode===item&&s.warehouseCode==='01').quantity,event=c.run('purchaseReturn',{kind,date,vendorCode:vendor,baseDocumentId,itemCode:item,quantity,price,warehouseCode:'01',reason,rma,withoutQuantity});
  assert.equal(missionOutcomeMatches(c.state,event,key),true,key);
  assert.equal(c.state.warehouseStock.find(s=>s.itemCode===item&&s.warehouseCode==='01').quantity,before-(['request','value_credit'].includes(kind)?0:quantity));
  if(kind!=='request')assert.ok(c.state.profile.purchaseReturns.at(-1).journalEntryId);
  if(kind==='goods_return')assert.throws(()=>c.run('purchaseReturn',{kind,date,vendorCode:vendor,baseDocumentId,itemCode:item,quantity,price,warehouseCode:'01',reason,rma,withoutQuantity}),/supera/);
 }
});
test('recepción Cuenca guarda el depósito y asigna sus existencias',()=>{
 const c=fixture(),event=c.run('purchase',{docType:'goods_receipt',document:{date:'2026-04-01',dueDate:'2026-04-01',cardCode:'V10000',reference:'',comments:'',baseDocumentId:'',lines:[{itemCode:'A00003',description:'Monitor Lenovo ThinkVision 24"',quantity:30,price:120,unit:'UND',discount:0,taxRate:15,warehouseCode:'03',binCode:'A1-S1-L1'}]}});
 assert.equal(missionOutcomeMatches(c.state,event,'mod7-c2#7'),true);
 assert.equal(c.state.binLocations.find(b=>b.binCode==='A1-S1-L1').contents[0].quantity,30);
});
test('tipos de importación se aplican: flete a inventario y seguro fijo a gasto',()=>{
 const c=fixture();let event=c.run('landedCostType',{name:'Flete Internacional',expenseAccount:'605000',updatesStock:true,allocation:'weight',updatesLastPurchase:true,fixedAmount:0});assert.equal(missionOutcomeMatches(c.state,event,'mod7-c5#6'),true);
 event=c.run('landedCostType',{name:'Seguro de Carga',expenseAccount:'606000',updatesStock:false,allocation:'none',updatesLastPurchase:false,fixedAmount:25});assert.equal(missionOutcomeMatches(c.state,event,'mod7-c5#7'),true);
 const item=c.run('item',{...c.state.items[0],name:'Mercadería pesada',weight:4}).result;
 const receipt=c.run('purchase',{docType:'goods_receipt',document:{date:'2026-04-01',dueDate:'2026-04-01',cardCode:'V10000',reference:'',comments:'',baseDocumentId:'',lines:[{itemCode:item,description:'Mercadería pesada',quantity:10,price:100,unit:'UND',discount:0,taxRate:15,warehouseCode:'01'}]}});
 c.run('landedCost',{documentId:receipt.result,date:'2026-04-02',allocation:'value',paymentAccount:'1.1.01',costs:[{concept:'Flete Internacional',amount:100},{concept:'Seguro de Carga',amount:25}]});
 assert.equal(c.state.warehouseStock.find(s=>s.itemCode===item).value,1100);assert.equal(c.state.journalEntries.at(-1).lines.find(l=>l.accountCode==='606000').debit,25);
});
test('revalorización estándar cambia existencias y deja su diferencia contable',()=>{const c=fixture(),before=c.state.warehouseStock.find(s=>s.itemCode==='A00001').value,event=c.run('stockRevalue',{itemCode:'A00001',date:'2026-04-01',newCost:680,reason:'Ajuste por inflación'});assert.equal(missionOutcomeMatches(c.state,event,'mod9-c3#7'),true);assert.equal(c.state.warehouseStock.find(s=>s.itemCode==='A00001').value-before,600);assert.equal(c.state.journalEntries.at(-1).totalDebit,600);});
test('autorizar serie exige empleado activo y conserva grupo y acceso',()=>{const c=fixture(),event=c.run('seriesPermission',{userCode:'E004',group:2,access:'Total',enabled:true});assert.equal(missionOutcomeMatches(c.state,event,'mod4-c1#10'),true);assert.throws(()=>c.run('seriesPermission',{userCode:'E999',group:2,access:'Total',enabled:true}),/empleado activo/);});
