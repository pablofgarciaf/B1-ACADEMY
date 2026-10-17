const {test}=require('node:test');const assert=require('node:assert/strict');const Module=require('node:module');require('./register.cjs');
const original=Module._load;const effects=[];
Module._load=function(name,parent,...rest){if(name==='react')return {useState:value=>[value,()=>{}],useRef:value=>({current:value}),useCallback:fn=>fn,useEffect:fn=>effects.push(fn)};return original.call(this,name,parent,...rest);};
const {useAcademyVoice}=require('../src/hooks/useAcademyVoice.ts');
const flush=()=>new Promise(resolve=>setImmediate(resolve));

test('pausar durante la descarga impide reproducir hasta reanudar y la lámina anterior no reaparece',async()=>{
 let resolveAudio;let plays=0;const audios=[];
 const saved={Audio:global.Audio,fetch:global.fetch,create:URL.createObjectURL};
 global.fetch=()=>new Promise(resolve=>{resolveAudio=resolve;});URL.createObjectURL=()=> 'blob:test';
 global.Audio=class{constructor(){this.paused=true;audios.push(this);}pause(){this.paused=true;}play(){plays++;this.paused=false;return Promise.resolve();}};
 try{
 const voice=useAcademyVoice();let ended=0;voice.speakText('Caso de descarga tardía',()=>ended++);voice.pause();resolveAudio({ok:true,blob:async()=>new Blob(['audio'])});await flush();await flush();
 assert.equal(plays,0);voice.resume();assert.equal(plays,1);
 const oldEnd=audios[0].onended;voice.speakText('Nueva lámina');oldEnd();assert.equal(ended,0);
 voice.stopSpeaking();resolveAudio({ok:true,blob:async()=>new Blob(['audio'])});await flush();await flush();assert.equal(plays,1);
 }finally{global.Audio=saved.Audio;global.fetch=saved.fetch;URL.createObjectURL=saved.create;}
});

test('pausa previa al fallo de voz conserva el temporizador de lectura sin adelantar clase',async()=>{
 const saved={fetch:global.fetch,setTimeout:global.setTimeout,clearTimeout:global.clearTimeout};let rejectAudio,scheduled=0;
 global.fetch=()=>new Promise((_,reject)=>{rejectAudio=reject;});global.setTimeout=()=>{scheduled++;return 1;};global.clearTimeout=()=>{};
 try{const voice=useAcademyVoice();voice.speakText('Texto para lectura sin servicio');voice.pause();rejectAudio(new Error('offline'));await flush();await flush();assert.equal(scheduled,0);voice.resume();assert.equal(scheduled,1);voice.stopSpeaking();}
 finally{global.fetch=saved.fetch;global.setTimeout=saved.setTimeout;global.clearTimeout=saved.clearTimeout;}
});

test('un audio que no se puede decodificar detiene la reproducción sin completar la lámina',async()=>{
 const saved={Audio:global.Audio,fetch:global.fetch,create:URL.createObjectURL};let audio,ended=0;
 global.fetch=async()=>({ok:true,blob:async()=>new Blob(['invalid-mp3'])});URL.createObjectURL=()=> 'blob:invalid';
 global.Audio=class{constructor(){audio=this;this.paused=true;}pause(){this.paused=true;}play(){this.paused=false;return Promise.resolve();}};
 try{const voice=useAcademyVoice();voice.speakText('Prueba de audio inválido',()=>ended++);await flush();await flush();audio.onerror();assert.equal(ended,0);assert.equal(audio.paused,true);voice.stopSpeaking();}
 finally{global.Audio=saved.Audio;global.fetch=saved.fetch;URL.createObjectURL=saved.create;}
});
