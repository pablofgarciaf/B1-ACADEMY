import 'server-only';
import { adminDb } from './firebase-admin';
import type { AuthenticatedUser } from './server-auth';

export async function canTeachCompany(actor: AuthenticatedUser, companyId: string): Promise<boolean> {
  if (!['teacher','docente'].includes(actor.profile.role) || companyId.includes('__')) return false;
  const data=(await adminDb.collection('usuarios').doc(companyId).get()).data();
  return data?.status==='active' && Array.isArray(data.assignedTeacherUids) && data.assignedTeacherUids.includes(actor.uid);
}
