const {test,beforeEach}=require('node:test');
const assert=require('node:assert/strict');
const Module=require('node:module');
require('./register.cjs');
const {FakeFirestore}=require('./fake-firestore.cjs');
const db=new FakeFirestore();
let legalReady=false,created=[],deleted=[],failProfile=false,companyReads=[],companyWrites=[],progressReads=[],initialized=true,passed=[],sessionCookie=null,sessionCreationFails=false;
const profiles={
 alice:{uid:'alice',email:'alice@example.test',name:'Prueba Alice',role:'estudiante',status:'active',passwordChanged:true,passwordSecurityVersion:2},
 bob:{uid:'bob',email:'bob@example.test',name:'Prueba Bob',role:'estudiante',status:'active',passwordChanged:true,passwordSecurityVersion:2},
};
const adminAuth={
 async verifyIdToken(token,revocation){assert.equal(revocation,true);if(!profiles[token])throw Object.assign(Error('Invalid token'),{code:'auth/id-token-revoked'});return {uid:token,email:profiles[token].email};},
 async createUser(data){created.push(data);if(failProfile)db.collection=()=>{throw Error('database unavailable');};return {uid:'new-user'};},
 async deleteUser(uid){deleted.push(uid);},
 async createSessionCookie(token){if(sessionCreationFails)throw Error('temporary provider failure');return 'signed-session-'+token;},
 async verifySessionCookie(token,revocation){assert.equal(revocation,true);return this.verifyIdToken(token.replace('signed-session-',''),revocation);},
};
const originalCollection=db.collection;
const originalLoad=Module._load;
Module._load=function(name,parent,...rest){
 if(name==='server-only')return {};
 if(name==='next/headers')return {cookies:async()=>({get:()=>sessionCookie?{value:sessionCookie}:undefined})};
 if(/(?:^|\/)firebase-admin$/.test(name))return {adminDb:db,adminAuth,fieldValue:()=>({arrayUnion:(...v)=>({union:v})})};
 if(name==='@/lib/legal-config')return {get legalConfigured(){return legalReady;},POLITICAS_VERSION:'test-policy'};
 if(name==='@/lib/company-server')return {hasInitializedCompany:async()=>initialized,readCompany:async(uid)=>{companyReads.push(uid);return {owner:uid};},executeCompanyCommand:async(...args)=>{companyWrites.push(args);return 'saved';}};
 if(name==='@/lib/academic-progress')return {readAcademicProgress:async(uid)=>{progressReads.push(uid);return {completedClasses:[],passedPractices:passed};}};
 if(name==='@/lib/requisitos-aula')return {moduloInduccionCompleto:async()=>true,MODULO_INDUCCION:'mod-1'};
 return originalLoad.call(this,name,parent,...rest);
};
const register=require('../src/app/api/auth/register/route.ts');
const session=require('../src/app/api/auth/session/route.ts');
const leads=require('../src/app/api/business-leads/route.ts');
const verify=require('../src/app/api/certificates/verify/route.ts');
const certificates=require('../src/app/api/certificates/my-certificates/route.ts');
const progress=require('../src/app/api/progress/route.ts');
const company=require('../src/app/api/finix/company/route.ts');
const {getModuleById}=require('../src/lib/curriculum-data.ts');
const {practicasDelModulo}=require('../src/lib/practice-registry.ts');
const request=(path,body,token,headers={})=>new Request('http://localhost'+path,{method:body===undefined?'GET':'POST',headers:{...(body===undefined?{}:{'Content-Type':'application/json'}),...(token?{authorization:'Bearer '+token}:{}),...headers},...(body===undefined?{}:{body:JSON.stringify(body)})});
const enrollment={name:'Persona sintética',email:'synthetic@example.test',password:'Prueba-larga-123',phone:'0999999999',privacyAccepted:true,policyVersion:'test-policy'};
const lead={requestId:'41fe21ed-2cd6-424c-b5ed-37c1cd37713c',company:'Empresa sintética',name:'Persona sintética',phone:'0999999999',teamSize:5,needs:'Capacitar a cinco colaboradores',privacyAccepted:true};
beforeEach(()=>{db.collection=originalCollection;db.rows.clear();db.tail=Promise.resolve();for(const [uid,profile]of Object.entries(profiles))db.rows.set('usuarios/'+uid,structuredClone(profile));process.env.NODE_ENV='test';legalReady=false;created=[];deleted=[];failProfile=false;companyReads=[];companyWrites=[];progressReads=[];initialized=true;passed=[];sessionCookie=null;sessionCreationFails=false;});

test('producción no crea cuentas, solicitudes ni consultas públicas con responsable pendiente',async()=>{
 process.env.NODE_ENV='production';
 for(const [route,body]of [[register,enrollment],[leads,lead],[verify,{code:'B1-TEST'}]])assert.equal((await route.POST(request('/api',body))).status,503);
 assert.equal(created.length,0);assert.equal(db.rows.size,2);
});
test('inscripción configurada crea perfil de alumno sin aceptar privilegios del navegador',async()=>{
 process.env.NODE_ENV='production';legalReady=true;
 const response=await register.POST(request('/api/auth/register',{...enrollment,role:'super',privateAccountingEnabled:true,status:'active'}));
 assert.equal(response.status,201);const row=db.rows.get('usuarios/new-user');
 assert.equal(row.role,'estudiante');assert.equal(row.passwordSecurityVersion,2);assert.equal(row.passwordChanged,true);assert.equal(row.privateAccountingEnabled,undefined);assert.equal(row.password,undefined);assert.equal(row.consentimiento.politicas,'test-policy');
});
test('inscripción exige aceptación, versión vigente y contraseña personal con mínimo de ocho caracteres',async()=>{
 for(const delta of [{privacyAccepted:false},{policyVersion:'obsolete'},{password:'1234567'},{email:'bad'}])assert.equal((await register.POST(request('/api',{...enrollment,...delta}))).status,400);
 assert.equal(created.length,0);
});
test('si falla el perfil se revierte solo el usuario recién creado y no se anuncia éxito',async()=>{
 failProfile=true;assert.equal((await register.POST(request('/api',enrollment))).status,409);assert.deepEqual(deleted,['new-user']);
});
test('cuota de registro evita seis altas desde un mismo origen en una hora',async()=>{
 for(let n=0;n<5;n++)assert.equal((await register.POST(request('/api',{...enrollment,email:`synthetic${n}@example.test`}))).status,201);
 assert.equal((await register.POST(request('/api',enrollment))).status,429);assert.equal(created.length,5);
});
test('solicitud empresarial acepta un único contacto y consentimiento comercial separado',async()=>{
 legalReady=true;process.env.NODE_ENV='production';
 assert.equal((await leads.POST(request('/api',lead))).status,201);
 const row=db.rows.get('business_leads/'+lead.requestId);assert.equal(row.email,undefined);assert.equal(row.phone,lead.phone);assert.equal(row.marketingConsent,false);assert.equal(row.deliveryStatus,'pending_review');
});
test('solicitud empresarial rechaza contacto vacío, bot, origen ajeno y omisión de privacidad',async()=>{
 for(const delta of [{phone:''},{website:'spam.example'},{privacyAccepted:false}])assert.equal((await leads.POST(request('/api',{...lead,...delta}))).status,400);
 assert.equal((await leads.POST(request('/api',lead,undefined,{origin:'https://foreign.example'}))).status,403);
 assert.equal(db.rows.has('business_leads/'+lead.requestId),false);
});
test('certificados privados no aceptan uid ajeno y no exponen otra identidad autenticada',async()=>{
 db.rows.set('certificates/a',{uid:'alice',code:'ALICE'});db.rows.set('certificates/b',{uid:'bob',code:'BOB'});
 const response=await certificates.GET(request('/api/certificates/my-certificates?uid=bob',undefined,'alice'));
 assert.equal(response.status,200);assert.deepEqual((await response.json()).certificates,[{uid:'alice',code:'ALICE'}]);assert.match(response.headers.get('cache-control'),/no-store/);
 assert.equal((await certificates.GET(request('/api?uid=bob',undefined,'revoked'))).status,401);
});
test('progreso ignora uid cliente, no permite terminar clases sin práctica y persiste solo la identidad propia',async()=>{
 const moduleId='mod-ventas',classId=getModuleById(moduleId).classes[0].id;
 let response=await progress.POST(request('/api/progress',{moduleId,classId,uid:'bob'},'alice'));
 assert.equal(response.status,403);
 passed=practicasDelModulo(moduleId).filter(p=>p.startsWith(classId+'#'));assert.ok(passed.length);
 response=await progress.POST(request('/api/progress',{moduleId,classId,uid:'bob'},'alice'));
 assert.equal(response.status,200);assert.equal(db.rows.get('academic_progress/alice_'+moduleId).uid,'alice');assert.equal(db.rows.has('academic_progress/bob_'+moduleId),false);assert.ok(progressReads.every(uid=>uid==='alice'));
});
test('empresa ajena, privada sin habilitación y sesión revocada no llegan al almacén',async()=>{
 assert.equal((await company.GET(request('/api/finix/company?uid=bob',undefined,'alice'))).status,403);
 assert.equal((await company.GET(request('/api/finix/company',undefined,'alice',{'x-empresa':'privado'}))).status,403);
 assert.equal((await company.GET(request('/api/finix/company',undefined,'revoked'))).status,401);assert.deepEqual(companyReads,[]);
});
test('empresa privada habilitada deriva propietario del token e impide sembrar datos del curso',async()=>{
 db.rows.get('usuarios/alice').privateAccountingEnabled=true;
 let response=await company.GET(request('/api/finix/company',undefined,'alice',{'x-empresa':'privado'}));assert.equal(response.status,200);assert.deepEqual(companyReads,['alice__privado']);
 response=await company.POST(request('/api/finix/company',{requestId:crypto.randomUUID(),command:{action:'initializeTraining',data:{}}},'alice',{'x-empresa':'privado'}));assert.equal(response.status,403);assert.deepEqual(companyWrites,[]);
});
test('perfil bloqueado y contraseña antigua se rechazan antes de leer empresas',async()=>{
 db.rows.get('usuarios/alice').status='blocked';assert.equal((await company.GET(request('/api',undefined,'alice'))).status,401);
 db.rows.get('usuarios/bob').passwordChanged=false;db.rows.get('usuarios/bob').temporaryPasswordExpiresAt=new Date(Date.now()+3600000).toISOString();assert.equal((await company.GET(request('/api',undefined,'bob'))).status,401);assert.deepEqual(companyReads,[]);
});
test('sesión real exige token válido y entrega cookie segura HttpOnly limitada a cinco días',async()=>{
 process.env.NODE_ENV='production';
 assert.equal((await session.POST(request('/api/auth/session',{}))).status,400);
 assert.equal((await session.POST(request('/api/auth/session',{idToken:'revoked'}))).status,401);
 const response=await session.POST(request('/api/auth/session',{idToken:'alice'}));assert.equal(response.status,200);
 const cookie=response.headers.get('set-cookie');for(const flag of ['HttpOnly','Secure','SameSite=lax','Max-Age=432000'])assert.match(cookie,new RegExp(flag));
 assert.doesNotMatch(JSON.stringify(await response.json()),/signed-session/);
});
test('respaldo de sesión tiene una hora y la consulta propia por cookie tampoco acepta uid ajeno',async()=>{
 sessionCreationFails=true;const response=await session.POST(request('/api/auth/session',{idToken:'alice'}));assert.equal(response.status,200);assert.match(response.headers.get('set-cookie'),/Max-Age=3600/);
 db.rows.set('certificates/a',{uid:'alice',code:'ALICE'});db.rows.set('certificates/b',{uid:'bob',code:'BOB'});
 sessionCookie='idtoken:alice';const mine=await certificates.GET(request('/api?uid=bob'));assert.equal(mine.status,200);assert.equal((await mine.json()).certificates[0].code,'ALICE');
 sessionCookie='idtoken:revoked';assert.equal((await certificates.GET(request('/api?uid=bob'))).status,401);
 sessionCookie=null;assert.equal((await certificates.GET(request('/api?uid=bob'))).status,401);
});
