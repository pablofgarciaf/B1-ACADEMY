const {test}=require('node:test');
const assert=require('node:assert/strict');
require('./register.cjs');
const {applyCommand}=require('../src/lib/company-engine.ts');
const {commandSchema}=require('../src/lib/company-commands.ts');
const {emptyCompany}=require('../src/lib/firestore-types.ts');
const {auditChanges}=require('../src/lib/company-audit.ts');
const {missionOutcomeMatches,outcomeContractFor}=require('../src/lib/practice-outcome-contract.ts');
const {requiredPracticeValidationVersion}=require('../src/lib/strict-practice-keys.ts');
function fixture(){let state=emptyCompany();const uid='synthetic-student',now='2026-10-17T12:00:00Z';const run=(action,data)=>{const before=state;const out=applyCommand(before,commandSchema.parse({action,data}),uid,'synthetic@example.test',now);state=out.state;return {companyId:uid,actorUid:uid,action,result:out.result,changes:auditChanges(before,state),occurredAt:now};};run('initializeTraining',{});return {run,get state(){return state;}};}
const purchase=quantity=>({docType:'vendor_invoice',document:{date:'2026-03-15',dueDate:'2026-04-15',cardCode:'V10000',reference:'Ensayo sintético',comments:'',baseDocumentId:'',lines:[{itemCode:'A00001',description:'Laptop Dell Latitude 3420',quantity,unit:'UND',price:850,discount:0,taxRate:15,warehouseCode:'01'}]}});
test('práctica exige datos reales de factura y rechaza otra cantidad aunque la operación sea correcta',()=>{
 const right=fixture(),event=right.run('purchase',purchase(3));assert.equal(missionOutcomeMatches(right.state,event,'mod3-c1#8'),true);
 const wrong=fixture(),other=wrong.run('purchase',purchase(2));assert.equal(missionOutcomeMatches(wrong.state,other,'mod3-c1#8'),false);
 const changed=structuredClone(right.state);changed.purchaseOrders.find(d=>d.id===event.result).lines[0].price=1;assert.equal(missionOutcomeMatches(changed,event,'mod3-c1#8'),false);
});
test('artículo, cantidad y precio deben coincidir en la misma línea',()=>{
 const c=fixture(),data=purchase(2);data.document.lines.push({...data.document.lines[0],itemCode:'A00002',quantity:3});const event=c.run('purchase',data);assert.equal(missionOutcomeMatches(c.state,event,'mod3-c1#8'),false);
});
test('convertir potencial exige transición real, no basta crear un cliente con el texto esperado',()=>{
 const c=fixture();const lead={name:'Maxi-Teq',ruc:'1799999999001',email:'',phone:'',address:'',city:'Quito',contactName:'',currency:'USD',paymentTermsDays:30,creditLimit:1000,active:true,group:'EDU',notes:'',kind:'lead'};
 const created=c.run('customer',lead);const converted=c.run('partnerUpdate',{partnerType:'customer',cardCode:created.result,changes:{kind:'customer'}});assert.equal(missionOutcomeMatches(c.state,converted,'mod2-c1#7'),true);
 const d=fixture(),direct=d.run('customer',{...lead,kind:'customer'});assert.equal(missionOutcomeMatches(d.state,direct,'mod2-c1#7'),false);
});
test('consigna sin correspondencia no aprueba; prácticas comerciales anteriores conservan su versión',()=>{
 assert.ok(outcomeContractFor('mod8-c3#5').pending.length>0);
 const c=fixture(),event=c.run('purchase',purchase(3));assert.equal(missionOutcomeMatches(c.state,event,'mod8-c3#5'),false);
 assert.equal(requiredPracticeValidationVersion('mod8-c3#5'),3);assert.equal(requiredPracticeValidationVersion('mod-ventas-c1#2'),2);
});
test('inducción usa campos presentes en las pantallas y comprueba plantilla activa, cliente y artículo',()=>{
 const c=fixture();
 const inactive=c.run('cockpitSave',{plantillas:[{id:'ventas',nombre:'Mi Cockpit Ventas',widgets:[]}],plantillaActiva:''});assert.equal(missionOutcomeMatches(c.state,inactive,'mod1-c2#10'),false);
 const active=c.run('cockpitSave',{plantillas:[{id:'ventas',nombre:'Mi Cockpit Ventas',widgets:[]}],plantillaActiva:'ventas'});assert.equal(missionOutcomeMatches(c.state,active,'mod1-c2#10'),true);
 const customer=c.run('customer',{name:'NovaTech',ruc:'1792456789001',email:'',phone:'',address:'',city:'Cuenca',contactName:'',currency:'USD',paymentTermsDays:30,creditLimit:1000,active:true,group:'Nacional',notes:'',kind:'customer'});assert.equal(missionOutcomeMatches(c.state,customer,'mod1-c3#5'),true);
 const item=c.run('item',{name:'Teclado Inalámbrico Genérico',type:'inventory',group:'General',purchaseUnit:'UND',salesUnit:'UND',price:35,price2:30,price3:25,maxDiscount:0,purchasePrice:20,preferredVendor:'',weight:0,length:0,width:0,height:0,costingMethod:'average',standardCost:20,minStock:0,maxStock:1000,reorderPoint:0,description:'',specifications:'',active:true});assert.equal(missionOutcomeMatches(c.state,item,'mod1-c3#6'),true);
});

test('la tasa pertenece a la moneda y fecha de la misión, no a cualquier divisa',()=>{
 for(const [moneda,fecha,expected] of [['EUR','2026-07-01',true],['COP','2026-07-01',false],['EUR','2026-07-02',false]]){
 const c=fixture(),event=c.run('currenciesSave',{monedaLocal:'USD',monedaSistema:'EUR',monedas:[],tasas:[{moneda,fecha,tasa:0.92}]});assert.equal(missionOutcomeMatches(c.state,event,'mod20-c1#4'),expected);
 }
});
test('la serie exige su rango completo en la misma fila',()=>{
 for(const [fin,expected] of [[5999,true],[6999,false]]){
 const c=fixture(),event=c.run('docSeriesSave',{series:[{docType:'facturas',inicio:5000,fin,nombre:'VENTAS NORTE',grupo:2,actual:5000}]});assert.equal(missionOutcomeMatches(c.state,event,'mod4-c1#5'),expected);
 }
});

test('grupos: la configuración adicional se conserva en la misma fila que el grupo',()=>{
 const clientes=fixture();
 const grupoCliente=clientes.run('customerGroupSave',{groups:[{codigo:'EDU',nombre:'Escuelas',descripcion:'',defaultPriceList:'Lista Especial EDU'}]});
 assert.equal(missionOutcomeMatches(clientes.state,grupoCliente,'mod2-c1#5'),true);
 const articulos=fixture();
 const grupoArticulo=articulos.run('itemGroupSave',{groups:[{codigo:'CABLES-FAM',nombre:'Cables',descripcion:'Familia de cables',uomGroup:'CABLES',inventoryUnit:'Metro'}]});
 assert.equal(missionOutcomeMatches(articulos.state,grupoArticulo,'mod2-c3#7'),true);
 const separado=fixture();
 const incompleto=separado.run('itemGroupSave',{groups:[{codigo:'CABLES-FAM',nombre:'Cables',descripcion:'Familia de cables'},{codigo:'OTRO',nombre:'Otro',descripcion:'',uomGroup:'CABLES',inventoryUnit:'Metro'}]});
 assert.equal(missionOutcomeMatches(separado.state,incompleto,'mod2-c3#7'),false);
});

test('proveedores: vínculo y retención se guardan en la ficha del proveedor',()=>{
 const c=fixture();
 const proveedor=c.state.vendors.find(v=>v.cardCode==='V10000');
 const cliente=c.state.customers.find(v=>v.cardCode==='C20000');
 assert.ok(proveedor);
 assert.ok(cliente);
 const enlace=c.run('partnerLink',{customerCode:cliente.cardCode,vendorCode:proveedor.cardCode});
 assert.equal(missionOutcomeMatches(c.state,enlace,'mod2-c1#8'),true);
 const edit=c.run('partnerUpdate',{partnerType:'vendor',cardCode:proveedor.cardCode,changes:{subjectToWithholding:true,withholdingTax:'RET IVA 30%',vatWithholdingGroup:'NO ESP',vatWithholdingCode:'30%',fiscalCategory:'No especial'}});
 assert.equal(missionOutcomeMatches(c.state,edit,'mod22-c2#5'),true);
 assert.equal(missionOutcomeMatches(c.state,edit,'mod22-c3#5'),true);
});

test('activos: el método, la cuenta y el área quedan en el activo y en su asiento',()=>{
 const c=fixture();
 const event=c.run('fixedAsset',{name:'Servidor HP ProLiant DL380',category:'Equipos de cómputo',acquisitionDate:'2026-01-01',cost:6000,residualValue:0,usefulLifeMonths:36,paymentAccount:'2.2.01',depreciationMethod:'Lineal',accountCode:'110500',depreciationArea:'PCGA'});
 assert.equal(missionOutcomeMatches(c.state,event,'mod3-c2#8'),true);
 assert.equal(c.state.journalEntries.at(-1).lines.some(line=>line.accountCode==='110500'&&line.debit===6000),true);
});
