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

test('documentos guardan la serie aplicada, la referencia base y el tipo generado por MRP',()=>{
 const c=fixture();
 c.run('docSeriesSave',{series:[
  {id:'fac',docType:'facturas',nombre:'FAC2026',prefijo:'FAC-2026-',inicio:32,fin:99,actual:32,digitos:4,porDefecto:true,bloqueada:false,grupo:1},
  {id:'nd',docType:'nc_prov',nombre:'ND',prefijo:'ND-',inicio:1,fin:99,actual:1,digitos:5,porDefecto:true,bloqueada:false,grupo:1}
 ]});
 const invoice=c.run('sales',{docType:'invoice',document:{date:'2026-04-01',dueDate:'2026-04-01',cardCode:'C20001',reference:'',comments:'',baseDocumentId:'',series:'FAC2026',lines:[{itemCode:'A00009',description:'Impresora Multifunción Epson',quantity:1,unit:'UND',price:220,discount:0,taxRate:15,warehouseCode:'01'}]}});
 assert.equal(c.state.salesOrders.at(-1).docNumber,'FAC-2026-0032');
 const credit=c.run('sales',{docType:'credit_note',document:{date:'2026-04-02',dueDate:'2026-04-02',cardCode:'C20001',reference:'',comments:'',baseDocumentId:invoice.result,series:'',lines:[{itemCode:'A00009',description:'Impresora Multifunción Epson',quantity:1,unit:'UND',price:220,discount:0,taxRate:15,warehouseCode:'01'}]}});
 assert.equal(missionOutcomeMatches(c.state,credit,'mod12-c4#8'),true);
 const debit=c.run('purchase',{docType:'debit_note',document:{date:'2026-06-15',dueDate:'2026-06-15',cardCode:'V10000',reference:'Factura 00150',comments:'',baseDocumentId:'',series:'ND',lines:[{itemCode:'A00001',description:'Laptop Dell Latitude 3420',quantity:1,unit:'UND',price:850,discount:0,taxRate:15,warehouseCode:'01'}]}});
 assert.equal(c.state.purchaseOrders.at(-1).series,'ND');
 assert.equal(c.state.purchaseOrders.at(-1).docNumber,'ND-00001');
 assert.equal(missionOutcomeMatches(c.state,debit,'mod22-c6#5'),true);
 const mrp=c.run('purchase',{docType:'purchase_order',document:{date:'2026-07-01',dueDate:'2026-08-15',cardCode:'V10000',reference:'Recomendación MRP',comments:'',baseDocumentId:'',series:'',lines:[{itemCode:'A00007',description:'Disco Duro SSD 1TB Samsung',quantity:100,unit:'UND',price:80,discount:0,taxRate:15,warehouseCode:'01'}]}});
 assert.equal(missionOutcomeMatches(c.state,mrp,'mod15-c1#8'),true);
});

test('precio explícito por artículo queda guardado dentro de la lista y habilita la práctica',()=>{
 const c=fixture();
 const list=c.run('priceListSave',{code:'LPRECIO01',name:'Lista Estándar Clientes',description:'Precios estándar para clientes regulares',base:1,factor:1,currency:'USD',validFrom:'2026-01-01',validTo:'2026-12-31',active:true});
 assert.equal(missionOutcomeMatches(c.state,list,'mod2-c4#5'),true);
 const entry=c.run('priceListItem',{list:4,itemCode:'A00001',price:850,unit:'Unidad',validFrom:'2026-01-01',validTo:'2026-12-31',active:true,remove:false});
 assert.equal(c.state.profile.priceLists[0].items[0].price,850);
 assert.equal(missionOutcomeMatches(c.state,entry,'mod2-c4#6'),true);
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

test('costos: centros, reparto y vínculo contable se persisten en la misma configuración',()=>{
 const c=fixture();
 const event=c.run('costCentersSave',{centros:[{codigo:'VENTAS',nombre:'Ventas',clasificacion:'DEPT',tipo:'Ventas',cuentas:[]}],normas:[{codigo:'AREA',nombre:'Área',centros:[{codigo:'VENTAS',porcentaje:100}]}],config:{cuentas:[{cuenta:'6200',nombre:'Gastos de electricidad',norma:'AREA'}]}});
 assert.equal(missionOutcomeMatches(c.state,event,'mod21-c1#5'),true);
 assert.equal(missionOutcomeMatches(c.state,event,'mod21-c1#7'),true);
 // La práctica de reparto pide 40 %, por lo que una configuración de 100 % no puede aprobarla.
 assert.equal(missionOutcomeMatches(c.state,event,'mod21-c1#6'),false);
});

test('bancos: el movimiento conserva la cuenta bancaria y la contrapartida contabilizada',()=>{
 const c=fixture();
 const event=c.run('bank',{bankAccountId:'BAN-1',date:'2026-04-01',type:'deposit',amount:5000,counterpartAccount:'3.01',reference:'Capital inicial',documentId:''});
 assert.equal(missionOutcomeMatches(c.state,event,'mod6-c3#7'),true);
 assert.equal(c.state.bankTransactions.at(-1).bankName,'Banco Pichincha');
});

test('propiedad de datos: jefe, sucursal y propietario se validan y pasan al documento de venta',()=>{
 const c=fixture();
 const empleado=c.run('employee',{firstName:'María',lastName:'Gómez',identification:'1799998888',position:'Contadora',department:'Contabilidad',supervisorCode:'E001',branchCode:'01',hireDate:'2026-01-01',contract:'indefinite',schedule:'full',baseSalary:900,employerRate:12.15,personalRate:9.45,thirteenthMonthly:false,fourteenthMonthly:false,reserveMonthly:true,vacationDays:15,dependents:0,projectedExpenses:0,active:true});
 assert.equal(missionOutcomeMatches(c.state,empleado,'mod4-c4#6'),true);
 const propietario=c.run('partnerUpdate',{partnerType:'customer',cardCode:'C20000',changes:{ownerCode:'E002'}});
 assert.ok(propietario.changes.some(change=>change.collection==='customers'));
 const factura=c.run('sales',{docType:'invoice',document:{date:'2026-06-15',dueDate:'2026-06-15',cardCode:'C20000',reference:'',comments:'',baseDocumentId:'',lines:[{itemCode:'A00001',description:'Laptop Dell Latitude 3420',quantity:1,unit:'UND',price:1000,discount:0,taxRate:15,warehouseCode:'01'}]}});
 assert.equal(missionOutcomeMatches(c.state,factura,'mod4-c4#9'),true);
 assert.equal(c.state.salesOrders.at(-1).ownerCode,'E002');
});

test('UDO: tabla, campo y objeto maestro se guardan como configuración estructurada',()=>{
 const c=fixture();
 const conductores={codigo:'@OF_CONDUCTORES',nombre:'Conductores',descripcion:'Conductores de entrega',objectType:'Ningún objeto',codeEnabled:true,uniqueName:true,objectId:'',menuEnabled:false,menuModule:'Ventas',campos:[{nombre:'U_OF_NOMBRE',tipo:'Alfanumérico',longitud:50,descripcion:'Nombre completo del conductor'}],registros:[{'Código':'C001','Nombre':'María López','U_OF_NOMBRE':'María López','U_OF_TURNO':'Noche','U_OF_DISPONIBLE':'Sí','U_OF_UBICACION':'Quito'}],links:[{objeto:'Entrega',tipo:'Alfanumérico',nombre:'U_OF_CONDUCTOR',validacion:'Fijar tabla vinculada',tabla:'@OF_CONDUCTORES'}]};
 const tabla=c.run('udoSave',{tables:[conductores]});
 assert.equal(missionOutcomeMatches(c.state,tabla,'mod24-c1#5'),true);
 assert.equal(missionOutcomeMatches(c.state,tabla,'mod24-c1#6'),true);
 assert.equal(missionOutcomeMatches(c.state,tabla,'mod24-c1#7'),true);
 assert.equal(missionOutcomeMatches(c.state,tabla,'mod24-c1#8'),true);
 const vehiculos={codigo:'@OF_VEHICULOS',nombre:'Vehículos',descripcion:'',objectType:'Datos maestros',codeEnabled:true,uniqueName:true,objectId:'OFVEH',menuEnabled:true,menuModule:'Ventas',campos:[],registros:[],links:[]};
 const objeto=c.run('udoSave',{tables:[conductores,vehiculos]});
 assert.equal(missionOutcomeMatches(c.state,objeto,'mod24-c1#10'),true);
});

test('producción: la BOM guarda líneas de artículo y recurso; emitir y recibir dejan trazabilidad separada',()=>{
 const c=fixture();
 c.run('resourceSave',{resources:[{codigo:'R001',nombre:'Torno para grabado',tipo:'maquina',capacidadDiaria:8,costoPorHora:20,factorEficiencia:100,tiempoSetup:0,activo:true,unidad:'ciclos'},{codigo:'R002',nombre:'Operario de máquina',tipo:'trabajo',capacidadDiaria:8,costoPorHora:15,factorEficiencia:100,tiempoSetup:0,activo:true,unidad:'hora'}]});
 const bom=c.run('bom',{parentItemCode:'A00001',type:'production',level:1,baseQuantity:1,warehouseCode:'01',components:[{lineNumber:1,lineType:'item',itemCode:'A00007',description:'Disco Duro SSD 1TB Samsung',quantity:1,unit:'UND',cost:80,warehouseCode:'01'},{lineNumber:2,lineType:'resource',itemCode:'R001',description:'Torno para grabado',quantity:2,unit:'ciclos',cost:20},{lineNumber:3,lineType:'resource',itemCode:'R002',description:'Operario de máquina',quantity:1,unit:'hora',cost:15}]});
 assert.equal(missionOutcomeMatches(c.state,bom,'mod16-c1#5'),true);
 assert.equal(missionOutcomeMatches(c.state,bom,'mod16-c1#6'),true);
 assert.equal(missionOutcomeMatches(c.state,bom,'mod16-c1#7'),true);
 assert.equal(missionOutcomeMatches(c.state,bom,'mod16-c1#8'),true);
 const order=c.run('production',{bomCode:bom.result,quantity:5,warehouseCode:'01',date:'2026-09-01',dueDate:'2026-09-30',priority:1});
 assert.equal(missionOutcomeMatches(c.state,order,'mod16-c1#10'),true);
 c.run('productionStatus',{id:order.result,status:'released'});
 const issue=c.run('productionIssue',{id:order.result,date:'2026-09-06'});
 assert.equal(c.state.productionOrders[0].issuedQuantity,5);
 assert.ok(c.state.productionOrders[0].issueJournalEntryId);
 const receipt=c.run('productionReceipt',{id:order.result,date:'2026-09-30'});
 assert.equal(c.state.productionOrders[0].status,'closed');
 assert.equal(c.state.productionOrders[0].receivedQuantity,5);
 assert.ok(c.state.productionOrders[0].receiptNumber);
 assert.ok(c.state.productionOrders[0].receiptJournalEntryId);
 assert.equal(missionOutcomeMatches(c.state,receipt,'mod16-c1#11'),true);
 assert.equal(issue.changes.some(change=>change.collection==='productionOrders'),true);
});

test('recursos y etapas de ruta conservan la configuración y el envío verificable',()=>{
 const c=fixture();
 const recursos=c.run('resourceSave',{resources:[
  {codigo:'TRAB001',nombre:'Operario CNC',tipo:'trabajo',empleado:'E003',unidad:'Horas',capacidadDiaria:8,activo:true,tiempoPorUnidad:'00:15:00',unidadesPorPeriodo:1,tiempoEjecucion:'00:15:00'},
  {codigo:'MAQ001',nombre:'Torno CNC Principal',tipo:'maquina',activoFijo:'AF001',unidad:'Horas',capacidadDiaria:8,activo:true,tiempoPorUnidad:'00:15:00',unidadesPorPeriodo:1,tiempoEjecucion:'00:15:00'}
 ]});
 assert.equal(missionOutcomeMatches(c.state,recursos,'mod17-c1#5'),true);
 assert.equal(missionOutcomeMatches(c.state,recursos,'mod17-c1#6'),true);
 assert.equal(missionOutcomeMatches(c.state,recursos,'mod17-c1#7'),true);
 const pintura=c.state.items.find(item=>item.name==='Pintura blanca').itemCode;
 const bom=c.run('bom',{parentItemCode:'A00001',type:'production',level:1,baseQuantity:1,warehouseCode:'01',components:[
  {lineType:'item',itemCode:pintura,quantity:2,unit:'UND',cost:12,warehouseCode:'01'},
  {lineType:'resource',itemCode:'TRAB001',quantity:2,unit:'Horas',cost:15}
 ]});
 assert.equal(c.state.boms[0].components[1].estimatedTime,'00:30:00');
 assert.equal(missionOutcomeMatches(c.state,bom,'mod17-c1#8'),true);
 const order=c.run('production',{bomCode:bom.result,quantity:1,warehouseCode:'01',date:'2026-06-01',dueDate:'2026-06-05',priority:1});
 c.run('productionStatus',{id:order.result,status:'released'});
 const stage=c.run('productionStageIssue',{id:order.result,stage:3,componentCode:pintura,quantity:2,fromWarehouseCode:'01',toWarehouseCode:'01',date:'2026-06-02'});
 assert.equal(c.state.productionOrders.at(-1).stageIssues[0].stage,3);
 assert.equal(missionOutcomeMatches(c.state,stage,'mod17-c3#8'),true);
});

test('traslado a planta conserva origen, destino y descripción en el kardex',()=>{
 const c=fixture();
 c.run('companySettings',{companyName:'B1 Center',ruc:'1792456789001',incomeTaxRate:25,address:'',phone:'',warehouses:[{code:'01',name:'Bodega Central Quito'},{code:'02',name:'Bodega Sucursal Guayaquil'},{code:'99',name:'Planta de producción'}]});
 const event=c.run('transfer',{from:'01',to:'99',date:'2026-05-02',lines:[{itemCode:'A00004',quantity:10}]});
 assert.equal(missionOutcomeMatches(c.state,event,'mod16-c2#7'),true);
 const moves=c.state.stockMovements.filter(move=>move.reference===event.result);
 assert.equal(moves.every(move=>move.fromWarehouseCode==='01'&&move.toWarehouseCode==='99'),true);
});

test('conteo conserva política, responsable, ubicación y tipo de ajuste verificables',()=>{
 const c=fixture();
 const settings=c.run('inventorySettingsSave',{settings:[{document:'Recuento de Inventario',stockDateBy:'creation',default:true,appliesTo:'Todos los usuarios',exampleDate:'2026-09-07'}]});
 assert.equal(missionOutcomeMatches(c.state,settings,'mod10-c4#7'),true);
 c.run('stock',{itemCode:'A00003',warehouseCode:'01',qty:120,costingMethod:'average'});
 const up=c.run('inventoryCount',{warehouseCode:'01',date:'2026-09-08',blind:false,lines:[{itemCode:'A00003',countedQuantity:151,location:'A1-01',counter:'Lee'}]});
 assert.equal(missionOutcomeMatches(c.state,up,'mod10-c4#8'),false);
 assert.equal(missionOutcomeMatches(c.state,up,'mod10-c4#10'),true);
 const c2=fixture(); c2.run('stock',{itemCode:'A00003',warehouseCode:'01',qty:55,costingMethod:'average'});
 const count=c2.run('inventoryCount',{warehouseCode:'01',date:'2026-09-08',blind:true,lines:[{itemCode:'A00003',countedQuantity:75,location:'A1-01',counter:'Lee'}]});
 assert.equal(missionOutcomeMatches(c2.state,count,'mod10-c4#8'),true);
 assert.equal(c2.state.inventoryCounts.at(-1).lines[0].adjustmentType,'none');
});
