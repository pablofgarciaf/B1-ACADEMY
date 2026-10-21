const {test}=require('node:test');
const assert=require('node:assert/strict');
require('./register.cjs');
const {applyCommand}=require('../src/lib/company-engine.ts');
const {commandSchema}=require('../src/lib/company-commands.ts');
const {emptyCompany}=require('../src/lib/firestore-types.ts');
const {auditChanges}=require('../src/lib/company-audit.ts');
const {missionOutcomeMatches}=require('../src/lib/practice-outcome-contract.ts');
const {precioSugerido}=require('../src/lib/company-pricing.ts');
function fixture(){let s=emptyCompany();const run=(action,data)=>{const before=s,out=applyCommand(s,commandSchema.parse({action,data}),'u','synthetic@example.test','2026-10-21T12:00:00Z');s=out.state;return {action,result:out.result,changes:auditChanges(before,s)};};run('initializeTraining',{});return {run,get state(){return s;}};}
const line=(accountCode,debit=0,credit=0)=>({accountCode,debit,credit,description:'Caso de clase',costCenter:''});
test('cuentas del grupo se guardan, validan y determinan los asientos reales de ventas',()=>{
 const c=fixture();const group=c.run('itemGroupSave',{groups:[{codigo:'IMPRES',nombre:'Impresoras',descripcion:'Impresoras',inventoryAccount:'9000',incomeAccount:'9001',costAccount:'9002'}]});
 assert.equal(missionOutcomeMatches(c.state,group,'mod18-c2#7'),true);
 const item=c.state.items.find(i=>i.itemCode==='A00002');const saved=c.run('itemUpdate',{...item,group:'IMPRES',barcode:'HP440001',salesTaxRate:15});assert.equal(missionOutcomeMatches(c.state,saved,'mod18-c2#8'),true);
 const event=c.run('sales',{docType:'invoice',document:{date:'2026-10-21',dueDate:'2026-10-21',cardCode:'C20000',reference:'',comments:'',baseDocumentId:'',series:'',lines:[{itemCode:'A00002',description:item.name,quantity:1,unit:'UND',price:890,discount:0,taxRate:15,warehouseCode:'01'}]}});
 const entry=c.state.journalEntries.find(j=>j.reference===event.result);assert.equal(entry.lines.find(l=>l.accountCode==='9000').credit,680);assert.equal(entry.lines.find(l=>l.accountCode==='9002').debit,680);assert.equal(entry.lines.find(l=>l.accountCode==='9001').credit,890);
 assert.throws(()=>c.run('itemGroupSave',{groups:[{inventoryAccount:'9001'}]}),/naturaleza/);
});
test('asientos verifican ambas contrapartidas y el lado contable sin aceptar otra fecha',()=>{
 const c=fixture();
 let event=c.run('journal',{date:'2026-10-21',dueDate:'2026-10-21',memo:'Gasto oficina',reference:'',lines:[line('51020100',50),line('11010200',0,50)]});
 assert.equal(missionOutcomeMatches(c.state,event,'mod18-c3#9'),true);
 event=c.run('journal',{date:'2026-01-15',dueDate:'2026-01-15',memo:'Agua',reference:'',lines:[line('601000',150),line('101005',0,150)]});
 assert.equal(missionOutcomeMatches(c.state,event,'mod18-c4#7'),true);
 const wrong=c.run('journal',{date:'2026-01-16',dueDate:'2026-01-16',memo:'Agua otro día',reference:'',lines:[line('601000',150),line('101005',0,150)]});
 assert.equal(missionOutcomeMatches(c.state,wrong,'mod18-c4#7'),false);
});
test('ejercicio y primer mes se derivan de los períodos que controlan las fechas del motor',()=>{
 const c=fixture(),e=c.run('accountingPeriods',{startDate:'2026-01-01',endDate:'2026-12-31',dueThrough:'2027-12-31'});
 assert.equal(missionOutcomeMatches(c.state,e,'mod18-c4#5'),true);assert.equal(missionOutcomeMatches(c.state,e,'mod18-c4#6'),true);
 assert.throws(()=>c.run('journal',{date:'2027-01-01',dueDate:'2027-01-01',memo:'Fuera',reference:'',lines:[line('601000',1),line('101005',0,1)]}),/período/);
});
test('presupuesto genera informe del mayor y bloqueo efectivo del exceso mensual',()=>{
 const c=fixture(),budget=c.run('budget',{year:'2026',accountCode:'510000',months:Array(12).fill(500)});
 assert.equal(missionOutcomeMatches(c.state,budget,'mod21-c3#7'),true);
 c.run('journal',{date:'2026-10-15',dueDate:'2026-10-15',memo:'Viajes',reference:'',lines:[line('510000',550),line('11010200',0,550)]});
 const report=c.run('budgetReport',{year:'2026',month:10,accountCode:'510000'});assert.equal(missionOutcomeMatches(c.state,report,'mod21-c3#8'),true);
 const config=c.run('costCentersSave',{centros:[],normas:[],config:{controlPresupuesto:[{inicializado:true,alSuperar:'Bloquear',ejercicio:'2026',controlPor:'Mensual'}]}});
 assert.equal(missionOutcomeMatches(c.state,config,'mod21-c3#5'),true);
 assert.throws(()=>c.run('journal',{date:'2026-11-01',dueDate:'2026-11-01',memo:'Viaje exceso',reference:'',lines:[line('510000',501),line('11010200',0,501)]}),/presupuesto/);
});
test('asistente cambia factor y descuentos de período/cantidad componen el precio usado en ventas',()=>{
 const c=fixture();c.run('priceListSave',{code:'LPESCUELA',name:'Escuelas 2',description:'',base:1,factor:2,currency:'USD',validFrom:'2026-01-01',validTo:'2026-12-31',active:true});
 const update=c.run('priceUpdate',{list:4,method:'factor',value:1.1});assert.equal(c.state.profile.priceLists[0].factor,2.2);assert.equal(missionOutcomeMatches(c.state,update,'mod13-c1#8'),true);
 const d={id:'',itemCode:'A00004',list:1,minQuantity:1,maxQuantity:null,discount:5,validFrom:'2026-09-01',validTo:'2026-09-30',active:true,kind:'period',automatic:false,fixedPrice:42.75,remove:false};
 const period=c.run('volumeDiscount',d);assert.equal(missionOutcomeMatches(c.state,period,'mod13-c2#7'),true);
 const qty=c.run('volumeDiscount',{...d,kind:'quantity',minQuantity:4,discount:3,automatic:true,fixedPrice:null});assert.equal(missionOutcomeMatches(c.state,qty,'mod13-c2#8'),true);
 assert.equal(precioSugerido(c.state,'C20000','A00004',4,'2026-09-15').precioNeto,41.47);
 assert.equal(precioSugerido(c.state,'C20000','A00004',3,'2026-09-15').precioNeto,42.75);
 assert.equal(precioSugerido(c.state,'C20000','A00004',4,'2026-10-01').precioNeto,45);
});
