import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { isAdmin, requireBearerUser } from '@/lib/server-auth';

const newUserSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  // Clave temporal independiente de la identificación, con caducidad y cambio obligatorio.
  temporaryPassword: z.string().min(8).max(128),
  cedula: z.string().trim().max(20).optional(),
  role: z.enum(['estudiante', 'docente', 'admin']).default('estudiante'),
  assignedTracks: z.array(z.string().min(1).max(80)).max(20).default(['finix-erp-core']),
  assignedTeacherUids:z.array(z.string().regex(/^[\w-]{1,128}$/)).max(10).default([]),
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
    if(data.temporaryPassword===data.cedula) return NextResponse.json({error:'La contraseña temporal debe ser distinta de la identificación.'},{status:400});
    for (const id of data.assignedTeacherUids) {
      const teacher=(await adminDb.collection('usuarios').doc(id).get()).data();
      if (teacher?.role!=='docente' || teacher.status!=='active') return NextResponse.json({error:'Docente no disponible.'},{status:400});
    }
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
      cedula: data.cedula || '',
      temporaryPasswordExpiresAt: new Date(Date.now()+24*3600_000).toISOString(),
      role: data.role,
      status: 'active',
      createdAt: new Date().toISOString(),
      passwordChanged: false,
      assignedTracks: data.assignedTracks,
      assignedTeacherUids:data.assignedTeacherUids,
      phone: data.phone ?? '',
      simuladorLevel: 1,
      simuladorXP: 0,
      completedMissions: 0,
    };
    try { await adminDb.collection('usuarios').doc(user.uid).set(profile); }
    catch (error) { await adminAuth.deleteUser(user.uid); throw error; }
    return NextResponse.json({ user: profile }, { status: 201 });
  } catch (error) {
    const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
    if (code.includes('email-already-exists')) {
      return NextResponse.json({ error: 'El correo ya está registrado.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'No fue posible crear el usuario.' }, { status: 500 });
  }
}

export async function PATCH(request:Request){
  try{
    const actor=await requireBearerUser(request);if(!isAdmin(actor.profile))return NextResponse.json({error:'Prohibido.'},{status:403});
    const parsed=z.object({uid:z.string().regex(/^[\w-]{1,128}$/),assignedTeacherUids:z.array(z.string().regex(/^[\w-]{1,128}$/)).max(10)}).safeParse(await request.json());
    if(!parsed.success)return NextResponse.json({error:'Asignación inválida.'},{status:400});
    const {uid,assignedTeacherUids}=parsed.data;
    await adminDb.runTransaction(async tx=>{
      const student=adminDb.collection('usuarios').doc(uid),s=await tx.get(student);
      if(!s.exists||!['student','estudiante','regular'].includes(String(s.data()?.role)))throw new Error('Alumno inválido.');
      for(const id of assignedTeacherUids){const teacher=await tx.get(adminDb.collection('usuarios').doc(id));if(teacher.data()?.role!=='docente'||teacher.data()?.status!=='active')throw new Error('Docente no disponible.');}
      tx.update(student,{assignedTeacherUids,updatedAt:new Date().toISOString(),teacherAssignmentBy:actor.uid});
    });
    return NextResponse.json({success:true});
  }catch{return NextResponse.json({error:'No se pudo guardar la asignación.'},{status:400});}
}

