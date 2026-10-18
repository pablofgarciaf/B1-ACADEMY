// Disposable synthetic accounts only. Generates a recovery link without sending email.
const {test}=require('node:test');const assert=require('node:assert/strict');const {randomUUID,randomBytes}=require('node:crypto');
test('acceso publicado: recuperación por correo y cambio temporal de ocho caracteres',{skip:process.env.RUN_LIVE_PASSWORD_TESTS!=='1',timeout:180000},async()=>{
 require('@next/env').loadEnvConfig(process.cwd());const {initializeApp,cert,deleteApp}=require('firebase-admin/app');const {getAuth}=require('firebase-admin/auth');const {getFirestore}=require('firebase-admin/firestore');
 const app=initializeApp({credential:cert({projectId:process.env.FIREBASE_ADMIN_PROJECT_ID,clientEmail:process.env.FIREBASE_ADMIN_CLIENT_EMAIL,privateKey:process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g,'\n')})},'password-'+randomUUID());const auth=getAuth(app),db=getFirestore(app);db.settings({preferRest:true});
 const base=process.env.LIVE_PLATFORM_URL||'https://b1-academy.vercel.app';assert.ok(['http://localhost:4317','https://b1-academy.vercel.app'].includes(base));const created=[];
 const firebase=async(action,body)=>{const response=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:${action}?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(20000)});assert.equal(response.status,200,action);return response.json();};
 const api=async(path,token,body)=>{const response=await fetch(base+path,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(30000)});return {status:response.status,data:await response.json(),cookie:response.headers.get('set-cookie')};};
 try {for(const kind of ['recovery','temporary']){
   const uid='qa_password_'+randomBytes(12).toString('hex'),email=uid+'@example.test',initial=randomBytes(16).toString('base64url'),password=randomBytes(6).toString('base64url');assert.equal(password.length,8);
   await auth.createUser({uid,email,password:initial});created.push(uid);await db.collection('usuarios').doc(uid).set({uid,email,name:'Ensayo de acceso',role:'estudiante',status:'active',passwordChanged:false,passwordSecurityVersion:1,createdAt:new Date().toISOString(),...(kind==='temporary'?{temporaryPasswordExpiresAt:new Date(Date.now()+3600000).toISOString()}:{}),syntheticTest:true});
   let signed=await firebase('signInWithPassword',{email,password:initial,returnSecureToken:true});const before=await api('/api/auth/password',signed.idToken);assert.equal(before.status,200);assert.equal(before.data.recoveryRequired,kind==='recovery');
   if(kind==='recovery'){
     const blocked=await api('/api/auth/password',signed.idToken,{password});assert.equal(blocked.status,403);assert.equal(blocked.data.code,'RECOVERY_REQUIRED');
     await new Promise(resolve=>setTimeout(resolve,1500));const link=new URL(await auth.generatePasswordResetLink(email));await firebase('resetPassword',{oobCode:link.searchParams.get('oobCode'),newPassword:password});
   }else{const saved=await api('/api/auth/password',signed.idToken,{password});assert.equal(saved.status,200);assert.equal(saved.data.success,true);}
   signed=await firebase('signInWithPassword',{email,password,returnSecureToken:true});const session=await api('/api/auth/session',signed.idToken,{idToken:signed.idToken});assert.equal(session.status,200);assert.equal(session.data.profile.passwordChanged,true);assert.equal(session.data.profile.passwordSecurityVersion,2);assert.match(session.cookie,/HttpOnly/);
   const ready=await api('/api/auth/password',signed.idToken);assert.equal(ready.data.ready,true);assert.equal(ready.data.recoveryRequired,false);
   const dashboard=await fetch(base+'/dashboard',{headers:{Cookie:session.cookie.split(';')[0]},redirect:'manual',signal:AbortSignal.timeout(30000)});assert.equal(dashboard.status,200);
   console.log(kind+': contraseña de ocho caracteres aceptada y acceso sin segundo cambio.');
 }}finally{for(const uid of created){assert.match(uid,/^qa_password_[a-f0-9]{24}$/);await db.recursiveDelete(db.collection('usuarios').doc(uid));await auth.deleteUser(uid);}await deleteApp(app);console.log('Cuentas de ensayo retiradas; sin mensajes de correo enviados.');}
});


