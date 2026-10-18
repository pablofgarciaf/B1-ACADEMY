import { requiresPasswordChange } from '@/lib/account-access-policy';
import 'server-only';
import { adminDb, fieldValue } from './firebase-admin';
import { PASSWORD_POLICY_EPOCH } from './password-policy';
import type { AuthenticatedUser } from './server-auth';

/** Password-change time, unlike token revocation time, proves a credential was replaced. */
export function passwordWasRecovered(account: { passwordUpdatedAt?: number; createdAt?: string }, now=Date.now()) {
  const changed=Number(account.passwordUpdatedAt),created=Number(account.createdAt);
  return Number.isFinite(changed)&&Number.isFinite(created)&&created>0&&changed>created+1000&&changed>=PASSWORD_POLICY_EPOCH&&changed<=now+60000;
}
export async function passwordAccess(user:AuthenticatedUser,idToken:string) {
  if(!requiresPasswordChange(user.profile))return {ready:true,recoveryRequired:false};
  const key=process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if(!key)throw new Error('No se pudo verificar la recuperación. Intenta nuevamente.');
  const response=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(key)}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken}),signal:AbortSignal.timeout(10000),cache:'no-store'});
  if(!response.ok)throw new Error('No se pudo verificar la recuperación. Vuelve a iniciar sesión.');
  const body=await response.json();
  const account=body.users?.find((row:{localId?:string})=>row.localId===user.uid);
  if(!account)throw new Error('La cuenta no pudo verificarse.');
  if(passwordWasRecovered(account)) {
    const changes={passwordChanged:true,passwordSecurityVersion:2,passwordChangedAt:new Date(Number(account.passwordUpdatedAt)).toISOString()};
    await adminDb.collection('usuarios').doc(user.uid).update({...changes,temporaryPasswordExpiresAt:fieldValue().delete()});
    Object.assign(user.profile,changes);return {ready:true,recoveryRequired:false};
  }
  const validInvitation=Date.parse(user.profile.temporaryPasswordExpiresAt||'')>Date.now();
  return {ready:false,recoveryRequired:!validInvitation};
}

