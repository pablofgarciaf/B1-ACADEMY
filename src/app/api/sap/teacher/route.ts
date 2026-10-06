import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { CompanyProfile } from '@/lib/firestore-types';
import type { TeacherStudent } from '@/lib/company-summary';
import { companySummary } from '@/lib/company-summary';
import { readCompany, almacenSimulador } from '@/lib/company-server';
import { listCompaniesSupabase, addMissionSupabase } from '@/lib/company-store-supabase';
import { adminDb } from '@/lib/firebase-admin';
import { requireBearerUser } from '@/lib/server-auth';
import { today } from '@/lib/company-calculations';

export async function GET(request: Request) {
  let actor;
  try { actor = await requireBearerUser(request); } catch (error: unknown) { return NextResponse.json({ error: error instanceof Error ? 'Sesión no válida.' : 'No autorizado.' }, { status: 401 }); }
  try {
    if (!['teacher', 'docente'].includes(actor.profile.role)) return NextResponse.json({ error: 'Acceso exclusivo de docentes.' }, { status: 403 });
    const params = new URL(request.url).searchParams;
    const cursor = params.get('cursor'); const moduleFilter = params.get('module') ?? '';
    // Empresas desde el almacén activo (Supabase o Firestore); los usuarios siguen en Firestore.
    const companies = almacenSimulador() === 'supabase'
      ? await listCompaniesSupabase()
      : (await adminDb.collection('sapCompanies').get()).docs.map(doc => ({ uid: doc.id, raw: doc.data() as Record<string, unknown> }));
    const users = await adminDb.collection('usuarios').select('uid', 'email', 'displayName', 'name', 'status', 'role').get();
    const day = today();
    const all = await Promise.all(companies.map(async doc => {
      const profile = doc.raw as unknown as CompanyProfile;
      const user = users.docs.find(u => u.id === doc.uid || u.data().uid === doc.uid) ?? users.docs.find(u => u.data().email === profile.email);
      const raw = doc.raw;
      const stats = typeof raw.pendingAlerts === 'number' ? {
        documentsToday: raw.activityDate === day ? Number(raw.documentsToday ?? 0) : 0,
        pendingAlerts: Number(raw.pendingAlerts), salesCycle: Boolean(raw.salesCycle), balanced: Boolean(raw.balanced),
      } : companySummary(await readCompany(doc.uid), day);
      const student: TeacherStudent = { ...profile, hasCompany: true, uid: doc.uid, studentName: String(user?.data().displayName || user?.data().name || 'Estudiante'), studentStatus: user?.data().status === 'suspended' ? 'suspended' : user?.data().status === 'active' ? 'active' : 'unknown', pendingAlerts: stats.pendingAlerts };
      return { student, stats };
    }));
    const seenEmails = new Set(all.map(row => row.student.email.toLowerCase()));
    for (const record of users.docs) {
      const user = record.data(); const email = String(user.email ?? '').toLowerCase();
      if (!['student', 'estudiante'].includes(String(user.role)) || !email || seenEmails.has(email)) continue;
      seenEmails.add(email);
      all.push({ student: { uid: String(user.uid || record.id), email, studentName: String(user.displayName || user.name || 'Estudiante'), studentStatus: user.status === 'suspended' ? 'suspended' : 'active', hasCompany: false, companyName: 'Sin empresa inicializada', xp: 0, level: 1, documentCount: 0, completedModules: [], lastAccess: '', pendingAlerts: 0 }, stats: { activityDate: day, documentsToday: 0, pendingAlerts: 0, salesCycle: false, balanced: false } });
    }
    const ranked = all.map(row => row.student).filter(p => !moduleFilter || p.completedModules.includes(moduleFilter)).sort((a, b) => b.xp - a.xp || a.uid.localeCompare(b.uid));
    const cursorIndex = cursor ? ranked.findIndex(p => p.uid === cursor) : -1;
    if (cursor && cursorIndex < 0) return NextResponse.json({ error: 'La lista cambió; pulsa Actualizar.' }, { status: 400 });
    const profiles = ranked.slice(cursorIndex + 1, cursorIndex + 51);
    return NextResponse.json({ profiles, total: all.length, filteredTotal: ranked.length,
      documentsToday: all.reduce((sum, row) => sum + row.stats.documentsToday, 0),
      pendingAlerts: all.reduce((sum, row) => sum + row.stats.pendingAlerts, 0),
      salesCycles: all.filter(row => row.stats.salesCycle).length, balancedCompanies: all.filter(row => row.stats.balanced).length,
      nextCursor: cursorIndex + 1 + profiles.length < ranked.length ? profiles.at(-1)?.uid ?? null : null });
  } catch (error: unknown) { return NextResponse.json({ error: error instanceof Error ? 'No se pudo cargar el panel; comprueba sesión y Firebase Admin.' : 'Error al cargar.' }, { status: 503 }); }
}
const missionSchema = z.object({ uid: z.string().regex(/^[\w-]{1,128}$/), title: z.string().trim().min(3).max(150), description: z.string().trim().min(3).max(1000), module: z.string().trim().min(1).max(60), requestId: z.string().uuid() });
export async function POST(request: Request) {
  try {
    const actor = await requireBearerUser(request);
    if (!['teacher', 'docente'].includes(actor.profile.role)) return NextResponse.json({ error: 'Acceso exclusivo de docentes.' }, { status: 403 });
    const parsed = missionSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: 'Completa la misión.' }, { status: 400 });
    const { uid, title, description, module, requestId } = parsed.data;
    if (almacenSimulador() === 'supabase') {
      const now = new Date().toISOString();
      const id = await addMissionSupabase(uid, { id: requestId, title, description, module, status: 'assigned', teacherUid: actor.uid, createdBy: actor.uid, createdAt: now, updatedAt: now });
      return NextResponse.json({ result: id });
    }
    const root = adminDb.collection('sapCompanies').doc(uid); const ref = root.collection('missions').doc(requestId);
    await adminDb.runTransaction(async tx => { const [company, existing] = await Promise.all([tx.get(root), tx.get(ref)]); if (!company.exists) throw new Error('Empresa inexistente.'); if (existing.exists) return; const now = new Date().toISOString(); tx.set(ref, { id: ref.id, title, description, module, status: 'assigned', teacherUid: actor.uid, createdBy: actor.uid, createdAt: now, updatedAt: now }); tx.update(root, { pendingAlerts: Number(company.data()?.pendingAlerts ?? 0) + 1 }); });
    return NextResponse.json({ result: ref.id });
  } catch (error: unknown) { return NextResponse.json({ error: error instanceof Error ? 'No se pudo asignar la misión.' : 'Error de guardado.' }, { status: 400 }); }
}
