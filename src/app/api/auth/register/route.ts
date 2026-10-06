// Obsoleto: el registro público ahora se hace desde el navegador (AuthContext.register) con la cédula
// como clave del primer ingreso. Se conserva por compatibilidad con clientes antiguos.
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(12).max(128),
  phone: z.string().trim().max(30).optional(),
});

const attempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const now = Date.now();
  const current = attempts.get(forwarded);
  if (current && current.resetAt > now && current.count >= 5) {
    return NextResponse.json({ error: 'Demasiados intentos. Intenta más tarde.' }, { status: 429 });
  }
  attempts.set(forwarded, current && current.resetAt > now
    ? { ...current, count: current.count + 1 }
    : { count: 1, resetAt: now + 15 * 60_000 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Revisa los datos y usa una contraseña de 12 caracteres.' }, { status: 400 });
  try {
    const data = parsed.data;
    const user = await adminAuth.createUser({ email: data.email, password: data.password, displayName: data.name });
    await adminDb.collection('usuarios').doc(user.uid).set({
      uid: user.uid, email: data.email, name: data.name, displayName: data.name, cedula: '',
      role: 'estudiante', status: 'active', createdAt: new Date().toISOString(), passwordChanged: true,
      assignedTracks: ['sap-b1-core'], phone: data.phone ?? '', simuladorLevel: 1, simuladorXP: 0, completedMissions: 0,
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'No fue posible crear la cuenta o el correo ya está registrado.' }, { status: 409 });
  }
}
