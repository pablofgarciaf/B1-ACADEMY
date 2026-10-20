const {test}=require('node:test');const assert=require('node:assert/strict');require('./register.cjs');
const {ALL_MANUALS}=require('../src/lib/manuals-120-data.ts');
const {MANUAL_CASES}=require('../src/lib/manual-cases.ts');
const {MANUAL_LABS}=require('../src/lib/manual-labs.ts');
const {getQuizForManual,shuffleQuizOptions}=require('../src/lib/manual-quizzes-data.ts');
const {getCategoryExam}=require('../src/lib/category-exams-data.ts');
const {createManualSandbox,runManualCommand}=require('../src/lib/manual-sandbox.ts');
test('los 120 manuales tienen un caso propio, explicación y selección explícita del laboratorio',()=>{
 for(const m of ALL_MANUALS){const key=m.id.split('_')[0];assert.ok(MANUAL_CASES[key],m.id);assert.ok(Object.hasOwn(MANUAL_LABS,key),m.id);const qs=getQuizForManual(m.id,'','');assert.ok(qs.length,m.id);for(const q of qs){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.options[q.answer],MANUAL_CASES[key][1][0]);assert.ok(q.explanation.length>30);}}
 assert.deepEqual(getQuizForManual('no-existe','',''),[]);
});
test('elegir la alternativa más larga no permite aprobar el conjunto de casos',()=>{
 const rows=Object.values(MANUAL_CASES);for(const count of [s=>s.length,s=>s.split(/\s+/).length])for(const extreme of [Math.max,Math.min]){
 const expected=rows.reduce((sum,r)=>{const lengths=r[1].map(count),max=extreme(...lengths);return sum+(lengths[0]===max?1/lengths.filter(n=>n===max).length:0);},0)/rows.length;
 assert.ok(expected<0.45,'Acierto por longitud: '+expected);
 }
});
test('permutar alternativas conserva la respuesta y distribuye su posición',()=>{
 const q={q:'Un caso',options:['Primera','Segunda','Tercera','Cuarta'],answer:2,explanation:'Justificación'};const positions=new Set();let seed=1;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<100;i++){const shuffled=shuffleQuizOptions(q,random);positions.add(shuffled.answer);assert.equal(shuffled.options[shuffled.answer],'Tercera');assert.equal(new Set(shuffled.options).size,4);}assert.equal(positions.size,4);assert.equal(q.answer,2);
});
test('los repasos de categoría usan exclusivamente preguntas de sus propios manuales',()=>{
 for(const category of new Set(ALL_MANUALS.map(m=>m.category))){const exam=getCategoryExam(category);assert.ok(exam.questions.length);assert.equal(exam.passingScore,Math.ceil(exam.questions.length*.9));for(const q of exam.questions)assert.equal(ALL_MANUALS.find(m=>m.id===q.recommendedManualId).category,category);}
});
test('el laboratorio tiene datos coherentes y ejecuta operaciones sin modificar la empresa de partida',()=>{
 const before=createManualSandbox();assert.ok(before.profile);assert.ok(before.bankAccounts.length);assert.ok(before.chartOfAccounts.length);const snapshot=JSON.stringify(before);
 const document={date:'2026-06-15',dueDate:'2026-07-15',cardCode:'C20000',reference:'Prueba aislada',comments:'',baseDocumentId:'',lines:[{itemCode:'A00001',description:'Laptop',quantity:1,unit:'UND',price:1000,discount:0,taxRate:15,warehouseCode:'01'}]};
 const out=runManualCommand(before,{action:'sales',data:{docType:'order',document}});
 assert.equal(out.state.salesOrders.length,before.salesOrders.length+1);assert.equal(out.state.salesOrders.at(-1).total,1150);assert.equal(JSON.stringify(before),snapshot);
 assert.throws(()=>runManualCommand(before,{action:'sales',data:{docType:'order',document:{...document,cardCode:'NO-EXISTE'}}}));assert.equal(JSON.stringify(before),snapshot);
});
test('notas de crédito, precios, producción y MRP tienen herramientas del tema',()=>{
 assert.equal(MANUAL_LABS['2.7'],'credit_note');assert.equal(MANUAL_LABS['8.2'],'prices');assert.equal(MANUAL_LABS['10.5'],'production');assert.equal(MANUAL_LABS['9.1'],'mrp');
});

test('la devolución de muestra usa una factura real del laboratorio y revierte stock y saldo',()=>{
 const before=createManualSandbox(), invoice=before.salesOrders.find(d=>d.docType==='invoice');assert.ok(invoice);
 const out=runManualCommand(before,{action:'sales',data:{docType:'credit_note',document:{date:'2026-06-15',dueDate:'2026-06-15',cardCode:invoice.cardCode,reference:'Devolución de muestra',comments:'',baseDocumentId:invoice.id,lines:invoice.lines}}});
 const note=out.state.salesOrders.at(-1);assert.equal(note.docType,'credit_note');assert.equal(note.total,invoice.total);assert.ok(note.journalEntryId);assert.equal(out.state.customers.find(c=>c.cardCode===invoice.cardCode).balance,before.customers.find(c=>c.cardCode===invoice.cardCode).balance-invoice.total);assert.ok(out.state.stockMovements.some(m=>m.reference===note.id&&m.quantity===1));
});
