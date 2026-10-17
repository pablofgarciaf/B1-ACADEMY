import {NextResponse} from 'next/server';
import {z} from 'zod';
import {adminDb} from '@/lib/firebase-admin';
import {isAdmin,requireBearerUser} from '@/lib/server-auth';
export async function GET(request:Request){
  try{const actor=await requireBearerUser(request);if(!isAdmin(actor.profile))return NextResponse.json({error:'Prohibido.'},{status:403});
    const leads=await adminDb.collection('business_leads').orderBy('createdAt','desc').limit(100).get();
    return NextResponse.json({leads:leads.docs.map(s=>{const d=s.data();return {id:s.id,company:d.company,name:d.name,email:d.email,phone:d.phone,teamSize:d.teamSize,needs:d.needs,status:d.status,createdAt:d.createdAt,marketingConsent:d.marketingConsent};})},{headers:{'Cache-Control':'no-store'}});
  }catch{return NextResponse.json({error:'No pudimos consultar las solicitudes.'},{status:503});}
}
export async function PATCH(request:Request){
  try{const actor=await requireBearerUser(request);if(!isAdmin(actor.profile))return NextResponse.json({error:'Prohibido.'},{status:403});
    const d=z.object({id:z.string().uuid(),status:z.enum(['new','in_review','contacted','closed'])}).parse(await request.json());
    await adminDb.collection('business_leads').doc(d.id).update({status:d.status,reviewedBy:actor.uid,updatedAt:new Date().toISOString()});return NextResponse.json({success:true});
  }catch{return NextResponse.json({error:'No se pudo actualizar la solicitud.'},{status:400});}
}
