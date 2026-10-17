import 'server-only';
import { adminDb } from './firebase-admin';
import { buildStudentDocId, legacyStudentDocId, ownedAcademicData } from './student-doc';
export async function readAcademicProgress(uid: string, moduleId: string, name: string, email: string) {
  const ids = [...new Set([buildStudentDocId(moduleId, uid), legacyStudentDocId(moduleId, name, email)])];
  const snapshots = await Promise.all(ids.map(id => adminDb.collection('academic_progress').doc(id).get()));
  const records = snapshots.map(s => ownedAcademicData(s.data(), uid, moduleId)).filter(Boolean);
  const practices=await adminDb.collection('practice_records').where('uid','==',uid).where('moduleId','==',moduleId).get();
  return {
    completedClasses: [...new Set<string>(records.flatMap(r => r?.completedClasses ?? []))],
    passedPractices: [...new Set<string>(practices.docs.filter(s=>s.data().aprobada===true&&s.data().validationVersion===2).map(s=>String(s.data().practiceKey)))],
  };
}
