const {test}=require('node:test');const assert=require('node:assert/strict');const Module=require('node:module');
require('./register.cjs');const {FakeFirestore}=require('./fake-firestore.cjs');const db=new FakeFirestore();
let actor={uid:'u1',email:'u1@example.test',profile:{role:'estudiante',status:'active',passwordChanged:true,passwordSecurityVersion:2}};
let facts={profile:{trainingSetupVersion:1},customers:[{id:'C20005',cardCode:'C20005',name:'Corporación Andina S.A.',ruc:'1790099001001',creditLimit:10000,paymentTermsDays:30}],salesOrders:[]},events=[];
const load=Module._load;
Module._load=function(name,parent,...args){
 if(name==='server-only')return {};
 if(name==='@/lib/legal-config-server')return {readLegalConfiguration:async()=>({ready:true,available:true,policyVersion:'test-policy'})};
 if(/(?:^|\/)firebase-admin$/.test(name))return {adminDb:db,fieldValue:()=>({arrayUnion:(...v)=>({union:v}),delete:()=>({delete:true})})};
 if(name==='@/lib/server-auth')return {requireBearerUser:async()=>actor};
 if(name==='@/lib/company-server')return {hasInitializedCompany:async()=>true,readCompany:async()=>facts,readCompanyAudit:async()=>events};
 if(name==='@/lib/academic-progress')return {readAcademicProgress:async()=>progress};
 if(name==='@/lib/requisitos-aula')return {moduloInduccionCompleto:async()=>true,MODULO_INDUCCION:'mod-1'};
 if(name==='@/lib/exam-evaluator')return {evaluateAnswer:async()=>{await new Promise(r=>setTimeout(r,15));return {score:20,covered:[],missing:[],feedback:'correcta'};},EvaluatorUnavailableError:class extends Error{}};
 return load.call(this,name,parent,...args);
};
const {consumeQuota}=require('../src/lib/rate-limit.ts');
const practice=require('../src/app/api/practice/route.ts');const exams=require('../src/app/api/oral-exam/route.ts');
const leads=require('../src/app/api/business-leads/route.ts');
const issuance=require('../src/app/api/certificates/issue/route.ts');
const verification=require('../src/app/api/certificates/verify/route.ts');
const webhook=require('../src/app/api/webhooks/n8n/route.ts');
const {canTeachCompany}=require('../src/lib/company-access.ts');
const {getModuleById}=require('../src/lib/curriculum-data.ts');const {practicasDelModulo}=require('../src/lib/practice-registry.ts');
const progress={completedClasses:getModuleById('mod-ventas').classes.map(c=>c.id),passedPractices:practicasDelModulo('mod-ventas')};
const post=(body)=>new Request('http://localhost/api',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({policyVersion:'test-policy',...body})});
test('quota compartida limita solicitudes concurrentes, independientemente de la instancia',async()=>{
 const outcomes=await Promise.all(Array.from({length:12},()=>consumeQuota('test','same-user',3,60000,1000)));
 assert.equal(outcomes.filter(x=>x.allowed).length,3);
 assert.equal((await consumeQuota('test','same-user',3,60000,61000)).allowed,true);
});
test('la API de práctica ignora conectada del cliente y exige evidencia específica sin reutilización',async()=>{
 const bad={moduleId:'mod-ventas',classId:'mod-ventas-c1',slideIndex:2,valores:['arbitrario'],intentos:1,vioSolucion:false,conectada:true};
 let response=await practice.POST(post(bad));assert.equal((await response.json()).aprobada,false);
 const requestId='7167b25d-6d64-44fe-a1ed-b5ba136717aa';
 events=[{companyId:'u1',actorUid:'u1',requestId,result:'C20005',action:'customer',occurredAt:new Date().toISOString(),changes:[{collection:'customers',after:{id:'C20005',name:'Corporación Andina S.A.'}}]}];
 response=await practice.POST(post({...bad,evidence:{requestId,action:'customer',result:'C20005'}}));assert.equal((await response.json()).aprobada,true);
 response=await practice.POST(post({...bad,classId:'mod-ventas-c2',slideIndex:4,evidence:{requestId,action:'customer',result:'C20005'}}));assert.equal((await response.json()).aprobada,false);
 assert.equal(db.rows.get('practice_records/u1_mod-ventas-c1_2').validationVersion,2);
});
test('inicio concurrente de examen reserva un solo intento y rechaza duplicado de pregunta',async()=>{
 const starts=await Promise.all(Array.from({length:5},()=>exams.POST(post({action:'start',moduleId:'mod-ventas'})).then(r=>r.json())));
 assert.equal(new Set(starts.map(s=>s.examId)).size,1);
 const id=starts[0].examId;assert.ok(id);assert.equal(db.rows.get('exam_attempts/u1_mod-ventas').attempts.length,1);
 const answer={action:'answer',examId:id,questionNumber:1,answer:Array(120).fill('explicación').join(' ')};
 const responses=await Promise.all([exams.POST(post(answer)),exams.POST(post(answer))]);
 assert.deepEqual(responses.map(r=>r.status).sort(),[200,409]);
 assert.equal(db.rows.get('exam_sessions/'+id).answers.length,1);
 const stale=await exams.POST(post(answer));assert.equal(stale.status,409);
});
test('negación de evidencia reutilizada se hace dentro de la transacción',async()=>{
 const requestId='eaf0c9aa-7bd5-4131-a45a-cceac09a4cb1';
 db.rows.set('practice_evidence_claims/u1_'+requestId,{uid:'u1',practiceKey:'otra-clase#1'});
 events=[{companyId:'u1',actorUid:'u1',requestId,result:'C20005',action:'customer',occurredAt:new Date().toISOString(),changes:[{collection:'customers',after:{id:'C20005'}}]}];
 const r=await practice.POST(post({moduleId:'mod-ventas',classId:'mod-ventas-c1',slideIndex:2,valores:['x'],intentos:1,vioSolucion:false,evidence:{requestId,action:'customer',result:'C20005'}}));assert.equal(r.status,409);
});

test('solicitudes empresariales concurrentes persisten una sola vez y detectan cambios al reintentar',async()=>{
 const body={requestId:'70f65a1e-39ab-4ca6-a52a-ec5352f19190',company:'Empresa de prueba',name:'Prueba',phone:'0999999999',teamSize:5,needs:'Capacitar al equipo comercial',privacyAccepted:true};
 const responses=await Promise.all([leads.POST(post(body)),leads.POST(post(body))]);
 assert.deepEqual(responses.map(r=>r.status).sort(),[200,201]);
 const row=db.rows.get('business_leads/'+body.requestId);assert.equal(row.status,'new');assert.equal(row.marketingConsent,false);assert.ok(row.privacyAcceptedAt);
 assert.equal((await leads.POST(post({...body,needs:'Cambiar el alcance del curso'}))).status,409);
 assert.equal((await leads.POST(new Request('http://localhost/api',{method:'POST',headers:{origin:'https://otro.example','Content-Type':'application/json'},body:JSON.stringify({policyVersion:'test-policy',...body})}))).status,403);
});

test('docentes solo consultan alumnos activos asignados y nunca su empresa personal',async()=>{
 db.rows.set('usuarios/student',{status:'active',assignedTeacherUids:['t1']});
 const teacher={uid:'t1',profile:{role:'docente'}};
 assert.equal(await canTeachCompany(teacher,'student'),true);
 assert.equal(await canTeachCompany({...teacher,uid:'t2'},'student'),false);
 assert.equal(await canTeachCompany(teacher,'student__personal'),false);
 assert.equal(await canTeachCompany({uid:'t1',profile:{role:'estudiante'}},'student'),false);
 db.rows.get('usuarios/student').status='blocked';assert.equal(await canTeachCompany(teacher,'student'),false);
});

test('constancia nueva exige evaluación revalidada y congela nota y duración sin inventar 100%',async()=>{
 process.env.CERTIFICATE_SIGNING_SECRET='test-only-secret-not-for-deployment';
 db.rows.set('evaluations/u1_mod-ventas',{uid:'u1',moduleId:'mod-ventas',passed:true,score:87,validationVersion:1});
 assert.equal((await issuance.POST(post({moduleId:'mod-ventas'}))).status,403);
 db.rows.get('evaluations/u1_mod-ventas').validationVersion=2;
 const response=await issuance.POST(post({moduleId:'mod-ventas'}));assert.equal(response.status,200);
 const {code}=await response.json(),cert=db.rows.get('certificates/'+code);
 assert.equal(cert.scorePercent,87);assert.ok(cert.estimatedHours>0);assert.equal(cert.validationVersion,2);
});

test('consulta pública devuelve solo la constancia y limita cinco búsquedas diarias por contacto',async()=>{
 const code='B1-TEST-PUBLIC';db.rows.set('certificates/'+code,{code,status:'valid',holderName:'Titular de prueba',title:'Formación',issuedAt:'2026-10-16',uid:'private-uid',studentEmail:'private@example.test',completedClasses:['private']});
 const body={code,requesterName:'Visitante de prueba',requesterEmail:'',requesterPhone:'0999999999',privacyAccepted:true,marketingAccepted:false};
 for(let i=0;i<5;i++){const response=await verification.POST(post(body));assert.equal(response.status,200);const value=await response.json();assert.deepEqual(Object.keys(value.certificate).sort(),['code','holderName','issuedAt','status','title']);assert.doesNotMatch(JSON.stringify(value),/private/);}
 assert.equal((await verification.POST(post(body))).status,429);
 assert.equal((await verification.POST(post({...body,requesterPhone:''}))).status,400);
});

test('webhook firmado persiste una vez y no afirma haber emitido documentos',async()=>{
 process.env.N8N_WEBHOOK_SECRET='webhook-secret-only-for-this-test';
 const body=JSON.stringify({event:'COURSE_EVALUATION_PASSED',userId:'u1',courseCode:'mod-ventas',score:87});
 const signature=require('node:crypto').createHmac('sha256',process.env.N8N_WEBHOOK_SECRET).update(body).digest('hex');
 const request=()=>new Request('http://localhost/api/webhooks/n8n',{method:'POST',body,headers:{'x-webhook-signature':signature}});
 const first=await webhook.POST(request());assert.equal(first.status,202);const row=await first.json();assert.equal(row.completed,false);assert.equal(row.status,'pending_review');assert.equal(row.duplicate,false);
 const second=await webhook.POST(request());assert.equal((await second.json()).duplicate,true);
 assert.equal(db.rows.get('automation_events/'+row.id).status,'pending_review');
 const rejected=await webhook.POST(new Request('http://localhost/api',{method:'POST',body,headers:{'x-webhook-signature':'a'.repeat(64)}}));assert.equal(rejected.status,401);
});

test('emisión concurrente genera una sola constancia por módulo y conserva una revocación',async()=>{db.rows.clear();process.env.CERTIFICATE_SIGNING_SECRET='test-only-secret-not-for-deployment';db.rows.set('evaluations/u1_mod-ventas',{uid:'u1',moduleId:'mod-ventas',passed:true,score:87,validationVersion:2});const responses=await Promise.all(Array.from({length:4},()=>issuance.POST(post({moduleId:'mod-ventas'}))));for(const r of responses)assert.equal(r.status,200);const codes=await Promise.all(responses.map(r=>r.json().then(x=>x.code)));assert.equal(new Set(codes).size,1);assert.equal([...db.rows.keys()].filter(k=>k.startsWith('certificates/')).length,1);db.rows.get('certificates/'+codes[0]).status='revoked';assert.equal((await issuance.POST(post({moduleId:'mod-ventas'}))).status,409);});
