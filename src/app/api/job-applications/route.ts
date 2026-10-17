import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { requireBearerUser } from '@/lib/server-auth';
import {eligibleForJobs} from '@/lib/job-eligibility';
import {createHash} from 'crypto';

const schema = z.object({ jobId:z.string().regex(/^[\w-]{1,128}$/) });
export async function GET(request:Request){try{const u=await requireBearerUser(request);return NextResponse.json({eligible:await eligibleForJobs(u.uid)});}catch{return NextResponse.json({eligible:false},{status:401});}}

export async function POST(request: Request) {
  try {
    const user = await requireBearerUser(request);
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 });
    if(!await eligibleForJobs(user.uid))return NextResponse.json({error:'Necesitas una constancia verificada del programa para postular.'},{status:403});
    const job=(await adminDb.collection('job_listings').doc(parsed.data.jobId).get()).data();
    if(!job || job.published!==true)return NextResponse.json({error:'La vacante ya no está disponible.'},{status:404});
    const ref = adminDb.collection('job_applications').doc(createHash('sha256').update(`${user.uid}:${parsed.data.jobId}`).digest('hex'));
    await adminDb.runTransaction(async tx=>{if((await tx.get(ref)).exists)return;tx.create(ref,{jobId:parsed.data.jobId,jobTitle:job.title,companyName:job.company,applicantId:user.uid,applicantEmail:user.email,status:'submitted',createdAt:new Date().toISOString()});});
    return NextResponse.json({ success: true, id: ref.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Debes iniciar sesión para postular.' }, { status: 401 });
  }
}
