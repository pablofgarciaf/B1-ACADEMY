const {test}=require('node:test');const assert=require('node:assert/strict');
require('./register.cjs');
process.env.AUTH_POLICY_EPOCH='2026-10-16T00:00:00Z';
const {mayReplacePassword}=require('../src/lib/password-policy.ts');
const {analyticsAllowed,captureCampaign,trackConversion}=require('../src/lib/conversions.ts');
const {POLITICAS_VERSION}=require('../src/lib/legal-config.ts');

test('credencial predecible antigua exige recuperación posterior al corte y la invitación temporal caduca',()=>{
 const cutoff=Date.parse(process.env.AUTH_POLICY_EPOCH);
 assert.equal(mayReplacePassword({},'2026-10-15T00:00:00Z'),false);
 assert.equal(mayReplacePassword({},undefined),false);
 assert.equal(mayReplacePassword({},'2026-10-16T01:00:00Z'),true);
 const invitation={createdAt:'2026-10-15T00:00:00Z',temporaryPasswordExpiresAt:'2026-10-16T12:00:00Z'};
 assert.equal(mayReplacePassword(invitation,invitation.createdAt,cutoff),true);
 assert.equal(mayReplacePassword(invitation,invitation.createdAt,cutoff+86400000),false);
 assert.equal(mayReplacePassword(invitation,'2026-10-16T13:00:00Z',cutoff+86400000),true);
 assert.equal(mayReplacePassword({passwordSecurityVersion:2},undefined),true);
});

test('el corte de seguridad de la versión existe aunque el alojamiento no tenga la variable opcional',()=>{
 const path=require.resolve('../src/lib/password-policy.ts'),saved=process.env.AUTH_POLICY_EPOCH;
 try {delete process.env.AUTH_POLICY_EPOCH;delete require.cache[path];const policy=require(path);assert.ok(Number.isFinite(policy.PASSWORD_POLICY_EPOCH));assert.equal(policy.mayReplacePassword({},undefined),false);assert.equal(policy.mayReplacePassword({},new Date(policy.PASSWORD_POLICY_EPOCH-1000).toISOString()),false);assert.equal(policy.mayReplacePassword({},new Date(policy.PASSWORD_POLICY_EPOCH+1000).toISOString()),true);}
 finally {process.env.AUTH_POLICY_EPOCH=saved;delete require.cache[path];}
});

test('conversiones requieren consentimiento actual, excluyen identidad y deduplican resultados',()=>{
 const storage=new Map();global.window={dataLayer:[]};global.document={cookie:''};
 global.sessionStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
 try{
 assert.equal(trackConversion('generate_lead','secret-uid'),false);assert.equal(window.dataLayer.length,0);
 document.cookie='b1_consent='+encodeURIComponent(JSON.stringify({v:'old',analitica:true}));assert.equal(analyticsAllowed(document.cookie),false);
 document.cookie='b1_consent='+encodeURIComponent(JSON.stringify({v:POLITICAS_VERSION,analitica:true}));
 captureCampaign('https://example.test/?utm_source=google&utm_id=123&utm_campaign=personal@example.test');
 assert.equal(trackConversion('generate_lead','secret-uid',{method:'business_form',email:'personal@example.test',phone:'123456789'}),true);
 assert.equal(trackConversion('generate_lead','secret-uid'),false);
 const event=window.dataLayer[0];assert.equal(event.event,'generate_lead');assert.equal(event.campaign_source,'google');assert.equal(event.campaign_id,'123');
 assert.doesNotMatch(JSON.stringify(event),/secret-uid|personal|123456789|utm_campaign/);
 document.cookie='b1_consent='+encodeURIComponent(JSON.stringify({v:POLITICAS_VERSION,analitica:false}));assert.equal(trackConversion('sign_up','another'),false);
 }finally{delete global.window;delete global.document;delete global.sessionStorage;}
});
