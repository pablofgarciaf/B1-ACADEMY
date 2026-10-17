// Registro público con contraseña personal y consentimiento vigente. Los privilegios
// del perfil se fijan en el servidor; nunca se toman del formulario del navegador.
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { clientAddress, consumeQuota } from '@/lib/rate-limit';
import { legalConfigured, POLITICAS_VERSION } from '@/lib/legal-config';

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(12).max(128),
  phone: z.string().trim().max(30).optional(),
  privacyAccepted: z.literal(true),
  policyVersion: z.literal(POLITICAS_VERSION),
});

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production' && !legalConfigured) return NextResponse.json({error:'El registro estará disponible pronto.'},{status:503});
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Revisa los datos y usa una contraseña de 12 caracteres.' }, { status: 400 });
  try {
    const quota=await consumeQuota('registration',clientAddress(request),5,3600_000);
    if (!quota.allowed) return NextResponse.json({error:'Demasiados intentos. Intenta más tarde.'},{status:429});
    const data = parsed.data;
    const user = await adminAuth.createUser({ email: data.email, password: data.password, displayName: data.name });
    try { await adminDb.collection('usuarios').doc(user.uid).set({
      uid: user.uid, email: data.email, name: data.name, displayName: data.name, cedula: '',
      role: 'estudiante', status: 'active', createdAt: new Date().toISOString(), passwordChanged: true, passwordSecurityVersion:2,
      assignedTracks: ['finix-erp-core'], phone: data.phone ?? '', simuladorLevel: 1, simuladorXP: 0, completedMissions: 0,
      consentimiento: {politicas:POLITICAS_VERSION,fecha:new Date().toISOString(),medio:'registro-web'},
    }); } catch(error) { await adminAuth.deleteUser(user.uid); throw error; }
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'No fue posible crear la cuenta o el correo ya está registrado.' }, { status: 409 });
  }
}
