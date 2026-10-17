const {test}=require('node:test');const assert=require('node:assert/strict');const Module=require('node:module');require('./register.cjs');
const output=[];const load=Module._load;
class PDF {constructor(){return new Proxy(this,{get:(_,name)=>name==='getTextWidth'?text=>text.length*4:name==='text'?text=>output.push(text):()=>{}});}}
Module._load=function(name,parent,...rest){if(name==='jspdf')return {jsPDF:PDF};return load.call(this,name,parent,...rest);};
const {generateOfficialCampusCertificate,generateCategoryCertificate}=require('../src/lib/certificate-generator.ts');
test('PDF registrado usa nota recibida y no inventa hash, grado oficial, duración o firma',()=>{
 output.length=0;generateOfficialCampusCertificate({studentName:'Titular de prueba',certificateType:'micro',title:'Programa de prueba',verified:true,code:'B1-TEST-CODE',scorePercent:87,dateStr:'16/10/2026'});
 const text=output.join(' ');assert.match(text,/87%/);assert.doesNotMatch(text,/100%|95%|25 horas|SHA-256|GRADO DE|Ing\. Pablo|b1academy\.org/);assert.match(text,/\/verificar\/B1-TEST-CODE/);
 assert.throws(()=>generateOfficialCampusCertificate({studentName:'Titular',certificateType:'micro',title:'Curso',verified:true}),/código/);
});
test('autoevaluación local no se presenta como constancia registrada ni tiene verificación pública',()=>{
 output.length=0;generateCategoryCertificate({studentName:'Prueba',categoryTitle:'Autoevaluación',score:9,totalQuestions:10,verificationCode:'B1-LOCAL-FAKE'});
 const text=output.join(' ');assert.match(text,/RESULTADO DE AUTOEVALUACIÓN/);assert.match(text,/No acredita prácticas verificadas/);assert.doesNotMatch(text,/Consulta: https|B1-LOCAL-FAKE|Constancia registrada/);
});
