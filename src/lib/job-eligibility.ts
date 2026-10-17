import 'server-only';
import { adminDb } from './firebase-admin';
export async function eligibleForJobs(uid:string){
  const certificates=await adminDb.collection('certificates').where('uid','==',uid).get();
  return certificates.docs.some(s=>s.data().status==='valid'&&s.data().validationVersion===2);
}
