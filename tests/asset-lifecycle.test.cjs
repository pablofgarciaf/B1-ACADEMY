const {test}=require('node:test');const assert=require('node:assert/strict');require('./register.cjs');
const {applyCommand}=require('../src/lib/company-engine.ts');const {commandSchema}=require('../src/lib/company-commands.ts');const {emptyCompany}=require('../src/lib/firestore-types.ts');const {auditChanges}=require('../src/lib/company-audit.ts');const {missionOutcomeMatches}=require('../src/lib/practice-outcome-contract.ts');
function fixture(){let state=emptyCompany();const run=(action,data)=>{const before=state,out=applyCommand(state,commandSchema.parse({action,data}),'student-assets','synthetic@example.test','2026-10-21T12:00:00Z');state=out.state;return{action,result:out.result,changes:auditChanges(before,state)};};run('initializeTraining',{});return{run,get state(){return state;}};}
const asset=(assetCode,name,cost,acquisitionDate='2026-01-01',usefulLifeMonths=36)=>({assetCode,name,category:'Camiones de Reparto',acquisitionDate,cost,residualValue:0,usefulLifeMonths,paymentAccount:'2.2.01',depreciationMethod:'Lineal',accountCode:'110500',depreciationArea:'PCGA'});
const purchase=(itemCode,quantity,price,date,vendor='V10000',capitalize=true)=>({docType:'vendor_invoice',document:{date,dueDate:date,cardCode:vendor,reference:'',comments:'',baseDocumentId:'',series:'',assetValuationDate:capitalize?date:undefined,lines:[{itemCode,description:'Adquisición para uso de la empresa',quantity,price,unit:'UND',discount:0,taxRate:15,warehouseCode:'01'}]}});
test('modelo virtual requiere serie real y facturas capitalizadas crean fichas sin duplicar inventario',()=>{
 const c=fixture();assert.throws(()=>c.run('assetLifecycle',{mode:'model',itemCode:'A00001',isAsset:true,virtual:true,series:'AF001'}),/serie/);
 c.run('docSeriesSave',{series:[{docType:'activos',nombre:'AF001',inicio:1,fin:9999,actual:1,digitos:8,prefijo:'',grupo:1,porDefecto:true,bloqueada:false}]});
 const model=c.run('assetLifecycle',{mode:'model',itemCode:'A00001',isAsset:true,virtual:true,series:'AF001'});assert.equal(missionOutcomeMatches(c.state,model,'mod3-c1#7'),true);
 const laptop=c.run('purchase',purchase('A00001',3,850,'2026-03-15'));assert.deepEqual(c.state.fixedAssets.filter(a=>a.sourceDocumentId===laptop.result).map(a=>a.assetCode),['00000001','00000002','00000003']);
 const qty=c.state.warehouseStock.find(s=>s.itemCode==='A00006'&&s.warehouseCode==='01').quantity;
 const invoice=c.run('purchase',purchase('A00006',1,6000,'2026-01-01'));assert.equal(missionOutcomeMatches(c.state,invoice,'mod3-c2#5'),true);assert.equal(c.state.warehouseStock.find(s=>s.itemCode==='A00006'&&s.warehouseCode==='01').quantity,qty);
 const entry=c.state.journalEntries.find(e=>e.id===c.state.purchaseOrders.at(-1).journalEntryId);assert.equal(entry.lines.find(l=>l.accountCode==='110500').debit,6000);assert.equal(c.state.fixedAssets.filter(a=>a.sourceDocumentId===invoice.result).length,1);
 const five=c.run('purchase',purchase('A00004',5,45,'2026-01-02','V10002'));assert.equal(missionOutcomeMatches(c.state,five,'mod3-c2#9'),true);assert.equal(c.state.fixedAssets.filter(a=>a.sourceDocumentId===five.result).reduce((s,a)=>s+a.cost,0),225);
 const ordinary=fixture(),stock=ordinary.run('purchase',purchase('A00006',1,6000,'2026-01-01','V10000',false));assert.equal(missionOutcomeMatches(ordinary.state,stock,'mod3-c2#5'),false);
 assert.throws(()=>c.run('purchase',purchase('A00006',1.5,6000,'2026-01-01')),/enteras/);
});
test('amortización anual recalcula vista previa, contabiliza solo lo pendiente y cambio anual conserva saldos',()=>{
 const c=fixture();const a=c.run('fixedAsset',asset('CAM001','Camión de reparto',6000));
 assert.throws(()=>c.run('assetLifecycle',{mode:'annual',assetId:a.result,date:'2026-12-31',area:'PCGA',expectedAmount:1}),/vista previa/);
 const annual=c.run('assetLifecycle',{mode:'annual',assetId:a.result,date:'2026-12-31',area:'PCGA',expectedAmount:2000});assert.equal(missionOutcomeMatches(c.state,annual,'mod3-c3#6'),true);assert.equal(c.state.fixedAssets[0].accumulatedDepreciation,2000);
 assert.throws(()=>c.run('assetLifecycle',{mode:'annual',assetId:a.result,date:'2026-12-31',area:'PCGA',expectedAmount:2000}),/pendiente/);assert.throws(()=>c.run('depreciate',{period:'2026-12'}),/pendientes/);
 const close=c.run('assetLifecycle',{mode:'rollover',year:2026,newYear:2027,date:'2026-12-31',transfer:true,recalculate:true});assert.equal(missionOutcomeMatches(c.state,close,'mod3-c3#11'),true);assert.equal(c.state.fixedAssets[0].fiscalYear,2027);assert.equal(c.state.fixedAssets[0].accumulatedDepreciation,2000);assert.throws(()=>c.run('assetLifecycle',{mode:'rollover',year:2026,newYear:2027,date:'2026-12-31',transfer:true,recalculate:true}),/transferido/);
});
test('baja revierte costo y acumulada, imputa el valor neto y bloquea una segunda baja',()=>{
 const c=fixture(),a=c.run('fixedAsset',asset('CAMION002','Camión de reparto 2',25000,'2025-01-01',48));
 c.run('assetLifecycle',{mode:'annual',assetId:a.result,date:'2025-12-31',area:'PCGA',expectedAmount:6250});
 const d={mode:'dispose',assetId:a.result,date:'2026-06-20',reason:'Fin de vida útil',kind:'Desecho',posting:'Neto'};const e=c.run('assetLifecycle',d);assert.equal(missionOutcomeMatches(c.state,e,'mod3-c4#7'),true);assert.equal(c.state.fixedAssets[0].status,'disposed');
 const entry=c.state.journalEntries.at(-1);assert.equal(entry.lines.find(l=>l.accountCode==='6.03').debit,18750);assert.equal(entry.totalDebit,entry.totalCredit);assert.throws(()=>c.run('assetLifecycle',d),/baja/);
});
test('práctica distingue seguimiento serial con FIFO del costo específico no implementado',()=>{
 const c=fixture(),item=c.state.items.find(i=>i.itemCode==='A00001');const e=c.run('itemUpdate',{...item,manageMethod:'serial',costingMethod:'fifo',perpetualInventory:true});assert.equal(missionOutcomeMatches(c.state,e,'mod7-c4#5'),true);
 const noPerpetual=c.run('itemUpdate',{...c.state.items.find(i=>i.itemCode==='A00001'),perpetualInventory:false});assert.equal(missionOutcomeMatches(c.state,noPerpetual,'mod7-c4#5'),false);
});
