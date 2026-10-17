const {test}=require('node:test');
const assert=require('node:assert/strict');
require('./register.cjs');
const {companyScope}=require('../src/lib/company-scope.ts');
const {emptyCompany}=require('../src/lib/firestore-types.ts');
const {applyCommand}=require('../src/lib/company-engine.ts');
const {commandSchema}=require('../src/lib/company-commands.ts');
const {verificarIntegridad,flujoCaja}=require('../src/lib/company-analytics.ts');
const now='2026-10-17T12:00:00.000Z';
const run=(state,action,data)=>applyCommand(state,commandSchema.parse({action,data}),'owner__privado','owner@example.test',now);

test('el espacio privado exige permiso explícito y no colisiona con el aula ni otros propietarios',()=>{
 assert.throws(()=>companyScope('owner','privado'),/habilitación/);
 assert.equal(companyScope('owner','privado',true),'owner__privado');
 assert.notEqual(companyScope('owner','curso'),companyScope('owner','privado',true));
 assert.notEqual(companyScope('owner','privado',true),companyScope('other','privado',true));
 for(const slot of ['../curso','curso!','', 'a'.repeat(33)])assert.throws(()=>companyScope('owner',slot,true),/inválida/);
});
test('empresa privada vacía no inventa RUC, bancos, movimientos o contactos y conserva el original',()=>{
 const original=emptyCompany();const {state}=run(original,'initialize',{companyName:'Empresa pendiente de datos reales'});
 assert.equal(original.profile,null);assert.equal(state.profile.usage,'private');assert.equal(state.profile.ruc,'');
 for(const key of ['customers','vendors','bankAccounts','bankTransactions','journalEntries','warehouseStock','employees','items'])assert.equal(state[key].length,0,key);
 assert.equal(state.chartOfAccounts.length>20,true);
 const updated=run(state,'companySettings',{companyName:'Nombre aportado',ruc:'',incomeTaxRate:25,warehouses:[{code:'MATRIZ',name:'Matriz'}]}).state;
 assert.equal(updated.profile.ruc,'');assert.equal(updated.profile.companyName,'Nombre aportado');
});
test('la empresa privada nunca se autosiembra, autoriza en SRI simulado ni produce evidencia académica',()=>{
 assert.throws(()=>run(emptyCompany(),'access',{}),/Inicializa/);
 let {state}=run(emptyCompany(),'initialize',{companyName:'Privada de prueba'});
 const before=JSON.stringify(state);
 assert.throws(()=>run(state,'initializeTraining',{}),/datos de práctica/);
 assert.throws(()=>run(state,'missionComplete',{id:'m1'}),/académica/);
 assert.throws(()=>run(state,'authorize',{id:'f1'}),/SRI simulada/);
 assert.equal(JSON.stringify(state),before);
 state=run(state,'journal',{date:'2026-10-17',dueDate:'2026-10-17',memo:'Apertura sintética de prueba',reference:'TEST',lines:[{accountCode:'1.1.01',debit:100,credit:0,description:'',costCenter:''},{accountCode:'3.01',debit:0,credit:100,description:'',costCenter:''}]}).state;
 assert.equal(state.profile.xp,0);assert.deepEqual(state.profile.xpHistory,[]);assert.deepEqual(state.profile.completedModules,[]);
});

test('bancos privados se configuran sin saldo y mantienen auxiliar, mayor y flujo de caja coherentes',()=>{
 let {state}=run(emptyCompany(),'initialize',{companyName:'Privada de prueba'});
 state=run(state,'bankAccount',{name:'Cuenta sintética A',bankName:'Banco de prueba',accountNumber:'TEST0001'}).state;
 const account=state.bankAccounts[0];assert.equal(account.balance,0);assert.equal(state.journalEntries.length,0);
 assert.throws(()=>run(state,'bankAccount',{name:'Duplicada',bankName:'Banco de prueba',accountNumber:'TEST0001'}),/ya registrada/);
 const deposit={bankAccountId:account.id,date:'2026-10-17',type:'deposit',amount:500,counterpartAccount:'3.01',reference:'Prueba sintética',documentId:''};
 state=run(state,'bank',deposit).state;
 state=run(state,'bank',{...deposit,type:'payment',amount:25,counterpartAccount:'6.03'}).state;
 assert.equal(state.bankAccounts[0].balance,475);assert.ok(verificarIntegridad(state).every(x=>x.ok));
 const flow=flujoCaja(state,'2026-01-01','2026-12-31');assert.equal(flow.saldoFinal,475);
 assert.throws(()=>run(state,'bank',{...deposit,type:'payment',amount:600,counterpartAccount:'6.03'}),/insuficiente/);
 assert.throws(()=>run(state,'bank',{...deposit,counterpartAccount:'1.1.03'}),/documento/);
 assert.throws(()=>run(state,'bank',{...deposit,date:'2026-10-16'}),/anteriores/);
 assert.throws(()=>run(state,'journal',{date:'2026-10-17',dueDate:'2026-10-17',memo:'Prueba',reference:'T',lines:[{accountCode:account.ledgerAccount,debit:20,credit:0,description:'',costCenter:''},{accountCode:'3.01',debit:0,credit:20,description:'',costCenter:''}]}),/auxiliar/);
});
