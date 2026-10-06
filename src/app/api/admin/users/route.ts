import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { isAdmin, requireBearerUser } from '@/lib/server-auth';

const newUserSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  // La clave temporal es la cédula (10 dígitos) o el pasaporte: el estudiante la cambia en su primer ingreso.
  temporaryPassword: z.string().trim().min(6).max(128),
  cedula: z.string().trim().max(20).optional(),
  role: z.enum(['estudiante', 'docente', 'admin']).default('estudiante'),
  assignedTracks: z.array(z.string().min(1).max(80)).max(20).default(['sap-b1-core']),
  phone: z.string().trim().max(30).optional(),
});

export async function GET(request: Request) {
  try {
    const actor = await requireBearerUser(request);
    if (!isAdmin(actor.profile)) return NextResponse.json({ error: 'Prohibido.' }, { status: 403 });
    const snapshot = await adminDb.collection('usuarios').limit(500).get();
    const users = snapshot.docs.map((doc) => doc.data());
    return NextResponse.json({ users });
  } catch {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const actor = await requireBearerUser(request);
    if (!isAdmin(actor.profile)) return NextResponse.json({ error: 'Prohibido.' }, { status: 403 });
    const parsed = newUserSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Datos de usuario inválidos.' }, { status: 400 });
    const data = parsed.data;
    const user = await adminAuth.createUser({
      email: data.email,
      password: data.temporaryPassword,
      displayName: data.name,
      disabled: false,
    });
    const profile = {
      uid: user.uid,
      email: data.email,
      name: data.name,
      displayName: data.name,
      cedula: data.cedula || data.temporaryPassword,
      role: data.role,
      status: 'active',
      createdAt: new Date().toISOString(),
      passwordChanged: false,
      assignedTracks: data.assignedTracks,
      phone: data.phone ?? '',
      simuladorLevel: 1,
      simuladorXP: 0,
      completedMissions: 0,
    };
    await adminDb.collection('usuarios').doc(user.uid).set(profile);
    return NextResponse.json({ user: profile }, { status: 201 });
  } catch (error) {
    const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
    if (code.includes('email-already-exists')) {
      return NextResponse.json({ error: 'El correo ya está registrado.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'No fue posible crear el usuario.' }, { status: 500 });
  }
}

