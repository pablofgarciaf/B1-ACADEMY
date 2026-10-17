/** Fixed release cutover. The override may move it later; never use a per-instance clock. */
export const PASSWORD_POLICY_EPOCH=Date.parse(process.env.AUTH_POLICY_EPOCH||'2026-10-17T01:31:47.178Z');
/** Legacy predictable credentials require email recovery, not just possession of the old password. */
export function mayReplacePassword(profile:{passwordSecurityVersion?:number;createdAt?:string;temporaryPasswordExpiresAt?:string},tokensValidAfterTime:string|undefined,now=Date.now()){
  if(profile.passwordSecurityVersion===2)return true;
  const reset=Date.parse(tokensValidAfterTime||'');
  if(profile.temporaryPasswordExpiresAt){
    if(Date.parse(profile.temporaryPasswordExpiresAt)>now)return true;
    return Number.isFinite(reset)&&reset>Date.parse(profile.createdAt||'')+1000;
  }
  return Number.isFinite(PASSWORD_POLICY_EPOCH)&&Number.isFinite(reset)&&reset>=PASSWORD_POLICY_EPOCH;
}
