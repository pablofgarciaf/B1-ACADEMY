const {test}=require('node:test');
const assert=require('node:assert/strict');
require('./register.cjs');
const {emptyCompany}=require('../src/lib/firestore-types.ts');
const {applyCommand}=require('../src/lib/company-engine.ts');
const {commandSchema}=require('../src/lib/company-commands.ts');
const {resultadoEjercicio}=require('../src/lib/company-calculations.ts');
const {buildStudentDocId,legacyStudentDocId,ownedAcademicData}=require('../src/lib/student-doc.ts');
const {SALES_MISSIONS,camposConsulta}=require('../src/lib/sales-learning.ts');
const {operationFor,validPracticeEvent}=require('../src/lib/practice-contract.ts');
const {pantallaConectada}=require('../src/lib/practica-conectada.ts');
const {narrationChunks}=require('../src/lib/narration-chunks.ts');
const {businessLeadSchema}=require('../src/lib/business-lead.ts');
const {publicHelpReply}=require('../src/lib/public-help.ts');
const lessonData=require('../src/content/aula/lecciones.json');
function company(){let state=emptyCompany();return {get data(){return state;},run(action,data){const output=applyCommand(state,commandSchema.parse({action,data}),'student-1','student@example.test','2026-10-16T12:00:00.000Z');state=output.state;return output.result;}};}

test('homónimos mantienen identidades independientes y legacy de otro UID no se importa',()=>{
  assert.equal(legacyStudentDocId('mod-1','José Pérez'),legacyStudentDocId('mod-1','Jose Perez'));
  assert.notEqual(buildStudentDocId('mod-1','u1'),buildStudentDocId('mod-1','u2'));
  assert.equal(ownedAcademicData({uid:'u1',moduleId:'mod-1',passed:true},'u2','mod-1'),undefined);
  assert.throws(()=>buildStudentDocId('mod-1','../other'));
});
test('una operación ajena, antigua o sin cambios nunca prueba una práctica',()=>{
  const now=Date.now(),event={companyId:'u1',actorUid:'u1',requestId:'request',result:'doc-1',action:'sales',occurredAt:new Date(now).toISOString(),changes:[{after:{docType:'invoice'}}]};
  assert.equal(validPracticeEvent(event,'u1','request','doc-1',['sales'],'invoice',now),true);
  for(const mutation of [{actorUid:'u2'},{companyId:'u1__libre'},{action:'customer'},{changes:[]},{occurredAt:new Date(now-21*60000).toISOString()}])assert.equal(validPracticeEvent({...event,...mutation},'u1','request','doc-1',['sales'],'invoice',now),false);
  assert.equal(validPracticeEvent(event,'u1','request','doc-1',['sales'],'quotation',now),false);
});
test('las veinte misiones comerciales tienen contrato explícito de operación o consulta',()=>{
  const actual=Object.entries(lessonData).filter(([id])=>id.startsWith('mod-ventas')).flatMap(([id,l])=>l.syncData.filter(s=>s.step_guide?.campos?.length).map(s=>id+'#'+s.slide_index));
  assert.equal(actual.length,20);
  for(const id of actual){const m=SALES_MISSIONS[id];assert.ok(m,id);assert.deepEqual(pantallaConectada({missionId:id,title:'texto irrelevante'}),m.pantalla);if(m.mode==='write')assert.ok(operationFor(m.pantalla).includes(m.expectedAction));}
  assert.equal(SALES_MISSIONS['mod-ventas-c3#5'].pantalla.docType,'invoice');
  assert.equal(SALES_MISSIONS['mod-ventas-c3#7'].mode,'query');
});
test('la inicialización académica es atómica, completa e idempotente',()=>{
  const c=company();c.run('initializeTraining',{});
  assert.equal(c.data.profile.trainingSetupVersion,1);assert.ok(c.data.items.length>=10);assert.equal(c.data.customers.length,5);
  assert.ok(c.data.items.every(i=>c.data.warehouseStock.some(s=>s.itemCode===i.itemCode)));
  const before=JSON.stringify(c.data);c.run('initializeTraining',{});assert.equal(JSON.stringify(c.data),before);
  assert.ok(camposConsulta(c.data,'mod-ventas-c2#2'));
});
test('depreciación reduce resultado y no permite deuda huérfana ni reapertura incompatible',()=>{
  const c=company();c.run('initialize',{companyName:'Pruebas'});
  c.run('journal',{date:'2026-10-16',dueDate:'2026-10-16',memo:'Ingreso',reference:'I',lines:[{accountCode:'1.1.01',debit:1000,credit:0,description:'',costCenter:''},{accountCode:'4.01',debit:0,credit:1000,description:'',costCenter:''}]});
  const asset={name:'Equipo',category:'Otros',acquisitionDate:'2026-10-16',cost:1200,residualValue:0,usefulLifeMonths:12,paymentAccount:'1.1.01'};
  assert.throws(()=>c.run('fixedAsset',{...asset,paymentAccount:'2.1.01'}),/factura|proveedor/);
  c.run('fixedAsset',asset);c.run('depreciate',{period:'2026-10'});assert.equal(resultadoEjercicio(c.data,2026),900);
  c.run('closeYear',{year:'2026'});assert.throws(()=>c.run('closePeriod',{period:'2026-10',closed:false}),/cierre anual/);
});
test('ubicaciones y UDF ejecutan efectos y rechazan exceso/tipos inválidos',()=>{
  const c=company();c.run('initializeTraining',{});
  c.run('binLocation',{warehouseCode:'01',binCode:'E1',description:'Estante',maxQuantity:10});
  c.run('binMove',{warehouseCode:'01',itemCode:'A00001',fromBin:'',toBin:'E1',quantity:5});assert.equal(c.data.binLocations[0].contents[0].quantity,5);
  assert.throws(()=>c.run('binMove',{warehouseCode:'01',itemCode:'A00001',fromBin:'',toBin:'E1',quantity:10}),/capacidad/);
  c.run('udfDefine',{table:'OITM',field:'U_Color',label:'Color',type:'lista',options:['Azul'],remove:false});
  c.run('udfSet',{table:'OITM',key:'A00001',values:{U_Color:'Azul'}});assert.equal(c.data.udfValues[0].values.U_Color,'Azul');
  assert.throws(()=>c.run('udfSet',{table:'OITM',key:'A00001',values:{U_Color:'Rojo'}}),/lista/);
});
test('lotes y series se vinculan a recepción/salida y no permiten cantidades ni consumos duplicados',()=>{
 const c=company();c.run('initializeTraining',{});
 const item=c.data.items[0],vendor=c.data.vendors[0],customer=c.data.customers[0];
 const document=(cardCode,quantity)=>({date:'2026-10-16',dueDate:'2026-11-16',cardCode,baseDocumentId:'',reference:'Prueba de lotes',comments:'',lines:[{itemCode:item.itemCode,description:item.name,quantity,unit:'UND',price:650,discount:0,taxRate:15,warehouseCode:'01'}]});
 const receipt=c.run('purchase',{docType:'goods_receipt',document:document(vendor.cardCode,3)});
 assert.throws(()=>c.run('lotRegister',{documentId:receipt,itemCode:item.itemCode,kind:'serie',lots:[{lotNumber:'S1',quantity:2,expiryDate:''}]}),/una unidad/);
 c.run('lotRegister',{documentId:receipt,itemCode:item.itemCode,kind:'lote',lots:[{lotNumber:'L1',quantity:3,expiryDate:'2027-01-01'}]});
 assert.throws(()=>c.run('lotRegister',{documentId:receipt,itemCode:item.itemCode,kind:'lote',lots:[{lotNumber:'L2',quantity:1,expiryDate:''}]}),/supera la recepción/);
 const delivery=c.run('sales',{docType:'delivery',document:document(customer.cardCode,2)});
 c.run('lotIssue',{documentId:delivery,itemCode:item.itemCode,allocations:[{lotNumber:'L1',quantity:2}]});
 assert.equal(c.data.lots[0].quantity,1);assert.equal(c.data.lots[0].issues[0].documentId,delivery);
 assert.throws(()=>c.run('lotIssue',{documentId:delivery,itemCode:item.itemCode,allocations:[{lotNumber:'L1',quantity:1}]}),/supera la salida/);
});
test('texto largo publicado se conserva en fragmentos admitidos por voz',()=>{
  for(const lesson of Object.values(lessonData))for(const slide of lesson.syncData){const text=[slide.script_text||'',...(slide.step_guide?.instructions||[])].join(' ');const parts=narrationChunks(text);assert.ok(parts.every(s=>s.length<=1500));assert.equal(parts.join(' '),text.trim().replace(/\s+/g,' '));}
});
test('solicitud empresarial exige contacto y consentimiento sin imponer marketing',()=>{
  const input={requestId:'acb361b9-9a2b-49f7-854a-a4e0fe278a0e',company:'Ejemplo',name:'Nombre de prueba',phone:'0999999999',teamSize:5,needs:'Aprender procesos de compras',privacyAccepted:true,policyVersion:'test-policy'};
  assert.equal(businessLeadSchema.safeParse(input).success,true);
  assert.equal(businessLeadSchema.safeParse({...input,phone:''}).success,false);
  assert.equal(businessLeadSchema.safeParse({...input,privacyAccepted:false}).success,false);
  assert.equal(businessLeadSchema.safeParse({...input,policyVersion:''}).success,false);
  assert.equal(businessLeadSchema.parse(input).marketingConsent,false);
});
test('orientación pública siempre ofrece un recorrido utilizable sin proveedor IA',()=>{
  assert.match(publicHelpReply('Formación para mi empresa'),/empresas#solicitud/);
  assert.match(publicHelpReply('inscripción'),/login/);
  assert.doesNotMatch(publicHelpReply('precio'),/garantizado|acreditación oficial/);
});
