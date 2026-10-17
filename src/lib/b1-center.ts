'use client';
import {sendCommand} from './firestore-company';
export {EMPRESA_CURSO} from './b1-center-datos';
export async function crearB1Center(uid:string,avance:(text:string)=>void=()=>{},nombrePersonalizado?:string){
 avance('Preparando tu empresa y sus datos de práctica…');
 await sendCommand(uid,{action:'initializeTraining',data:{companyName:nombrePersonalizado}});
 avance('Tu empresa de práctica está lista.');
}
