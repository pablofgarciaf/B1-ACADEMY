import {NextResponse} from 'next/server';
import {adminDb} from '@/lib/firebase-admin';
export async function GET(){
  try{const jobs=await adminDb.collection('job_listings').where('published','==',true).limit(50).get();
    return NextResponse.json({jobs:jobs.docs.map(s=>({id:s.id,title:String(s.data().title||''),company:String(s.data().company||''),location:String(s.data().location||''),description:String(s.data().description||'')}))});
  }catch{return NextResponse.json({error:'No se pudo consultar las vacantes. Vuelve a intentarlo.'},{status:503});}
}
