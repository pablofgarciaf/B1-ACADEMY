import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { requireBearerUser } from '@/lib/server-auth';

const schema = z.object({ jobTitle: z.string().trim().min(2).max(160), companyName: z.string().trim().min(2).max(160) });

export async function POST(request: Request) {
  try {
    const user = await requireBearerUser(request);
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 });
    const ref = adminDb.collection('job_applications').doc();
    await ref.set({ ...parsed.data, applicantId: user.uid, applicantEmail: user.email, status: 'submitted', createdAt: new Date().toISOString() });
    return NextResponse.json({ success: true, id: ref.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Debes iniciar sesión para postular.' }, { status: 401 });
  }
}
