const {test,beforeEach}=require('node:test');
const assert=require('node:assert/strict');
const Module=require('node:module');
require('./register.cjs');
const {FakeFirestore}=require('./fake-firestore.cjs');
const db=new FakeFirestore();let unavailable=false;
const original=Module._load;
Module._load=function(name,parent,...rest){
 if(name==='server-only')return {};
 if(/(?:^|\/)firebase-admin$/.test(name))return {adminDb:{collection(...args){if(unavailable)throw Error('offline');return db.collection(...args);}}};
 if(name==='@/lib/server-auth')return {requireBearerUser:async req=>{const role=req.headers.get('authorization');if(!role)throw Error('no auth');return {uid:'synthetic-owner',profile:{role}};},isAdmin:p=>p.role==='admin'||p.role==='super'};
 return original.call(this,name,parent,...rest);
};
const {readLegalConfiguration,saveLegalConfiguration}=require('../src/lib/legal-config-server.ts');
const admin=require('../src/app/api/admin/legal/route.ts');
const publicRoute=require('../src/app/api/public/legal/route.ts');
const details={razonSocial:'Responsable sintético',direccion:'Dirección ficticia',ciudad:'Ciudad ficticia',correoPrivacidad:'privacy@example.test',ruc:'',whatsapp:'',sitio:''};
const request=(role,body,origin)=>new Request('https://academy.example.test/api/admin/legal',{method:body?'PUT':'GET',headers:{...(role?{authorization:role}:{}),...(origin?{origin}:{}),'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
beforeEach(()=>{db.rows.clear();unavailable=false;});
test('configuración real puede habilitar captación sin RUC ni dominio y publica solo detalles permitidos',async()=>{
 const response=await admin.PUT(request('admin',{...details,secret:'must-not-store',role:'super'}));assert.equal(response.status,200);
 const body=await response.json();assert.equal(body.ready,true);assert.equal(body.legal.ruc,'');assert.equal(body.legal.marca,'B1 Academy');
 const stored=db.rows.get('app_config/legal');assert.equal(stored.secret,undefined);assert.equal(stored.updatedBy,'synthetic-owner');
 const published=await publicRoute.GET();const value=await published.json();assert.equal(value.updatedBy,undefined);assert.equal(value.legal.updatedBy,undefined);assert.equal(value.secret,undefined);assert.match(published.headers.get('cache-control'),/no-store/);
});
test('solo administrador autenticado cambia identidad pública; origen ajeno no escribe',async()=>{
 assert.equal((await admin.GET(request())).status,401);
 assert.equal((await admin.PUT(request('estudiante',details))).status,403);
 assert.equal((await admin.PUT(request('admin',details,'https://other.example.test'))).status,403);
 assert.equal(db.rows.size,0);
});
test('borrador incompleto y falla de base no habilitan captación ni recuperan datos desactualizados',async()=>{
 await saveLegalConfiguration({...details,correoPrivacidad:''},'synthetic-owner');assert.equal((await readLegalConfiguration()).ready,false);
 await saveLegalConfiguration(details,'synthetic-owner');unavailable=true;const config=await readLegalConfiguration();assert.equal(config.ready,false);assert.equal(config.available,false);assert.equal(config.legal.razonSocial,'');assert.equal((await publicRoute.GET()).status,503);
});
test('versión de consentimiento cambia con identidad y permanece estable con reintentos iguales',async()=>{
 const a=await saveLegalConfiguration(details,'synthetic-owner');const b=await saveLegalConfiguration(details,'synthetic-owner');assert.equal(a.policyVersion,b.policyVersion);
 const c=await saveLegalConfiguration({...details,ciudad:'Otra ciudad ficticia'},'synthetic-owner');assert.notEqual(a.policyVersion,c.policyVersion);
 for(const sitio of ['http://example.test','https://user:pass@example.test','https://example.test/path'])assert.equal((await admin.PUT(request('admin',{...details,sitio}))).status,400);
});
