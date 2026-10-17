import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminAuth, adminDb, fieldValue } from '@/lib/firebase-admin';
import { authenticateIdToken } from '@/lib/server-auth';
import { consumeQuota } from '@/lib/rate-limit';
import {mayReplacePassword} from '@/lib/password-policy';

export async function POST(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace(/^Bearer /, '');
    if (!token) return NextResponse.json({ error: 'Inicia sesión nuevamente.' }, { status: 401 });
    const user = await authenticateIdToken(token);
    const decoded=await adminAuth.verifyIdToken(token,true);
    if(Date.now()/1000-Number(decoded.auth_time||0)>300)return NextResponse.json({error:'Inicia sesión de nuevo antes de cambiar tu contraseña.'},{status:401});
    const account=await adminAuth.getUser(user.uid);
    if(!mayReplacePassword(user.profile,account.tokensValidAfterTime))return NextResponse.json({error:'Por seguridad, restablece primero tu contraseña con el enlace enviado a tu correo y vuelve a iniciar sesión.'},{status:403});
    const parsed = z.object({ password: z.string().min(12).max(128) }).safeParse(await request.json());
    if (!parsed.success || parsed.data.password === user.profile.cedula) return NextResponse.json({ error: 'Usa una contraseña personal de al menos 12 caracteres.' }, { status: 400 });
    const quota = await consumeQuota('password-change', user.uid, 5, 3600_000);
    if (!quota.allowed) return NextResponse.json({ error: 'Espera antes de intentarlo nuevamente.' }, { status: 429 });
    await adminAuth.updateUser(user.uid, { password: parsed.data.password });
    await adminDb.collection('usuarios').doc(user.uid).update({ passwordChanged: true, passwordSecurityVersion:2, passwordChangedAt: new Date().toISOString(), temporaryPasswordExpiresAt: fieldValue().delete() });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'No pudimos actualizar la contraseña. Inicia sesión y vuelve a intentarlo.' }, { status: 503 }); }
}
