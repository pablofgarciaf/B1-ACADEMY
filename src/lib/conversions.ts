import { POLITICAS_VERSION } from './legal-config';

export function analyticsAllowed(cookie: string): boolean {
  try {
    const row = cookie.split(';').map(s => s.trim()).find(s => s.startsWith('b1_consent='));
    const choice = row ? JSON.parse(decodeURIComponent(row.slice('b1_consent='.length))) : null;
    const expected = typeof document !== 'undefined' ? document.documentElement?.dataset.legalPolicyVersion || POLITICAS_VERSION : POLITICAS_VERSION;
    return choice?.v === expected && choice.analitica === true;
  } catch { return false; }
}

export function captureCampaign(url:string){
  if(typeof window==='undefined'||!analyticsAllowed(document.cookie))return;
  try{
    const params=new URL(url).searchParams,source=params.get('utm_source'),id=params.get('utm_id');
    const previous=JSON.parse(sessionStorage.getItem('finix:campaign')||'{}');
    if(source&&['google','facebook','instagram','linkedin','tiktok','bing','newsletter'].includes(source))previous.campaign_source=source;
    if(id&&/^\d{1,30}$/.test(id))previous.campaign_id=id;
    if(Object.keys(previous).length)sessionStorage.setItem('finix:campaign',JSON.stringify(previous));
  }catch{/* Storage may be unavailable. It must not block registration. */}
}

/** Emit only after a confirmed result. Never send identity/contact fields to tags. */
export function trackConversion(event: 'sign_up' | 'generate_lead', id: string, params: Record<string, string> = {}) {
  if (typeof window === 'undefined' || !analyticsAllowed(document.cookie)) return false;
  try {
    const key = `finix:conversion:${event}:${id}`;
    if (sessionStorage.getItem(key)) return false;
    const safe: Record<string, string> = {};
    if (params.method && ['email', 'business_form'].includes(params.method)) safe.method = params.method;
    window.dataLayer = window.dataLayer || [];
    const campaign=JSON.parse(sessionStorage.getItem('finix:campaign')||'{}');
    if(['google','facebook','instagram','linkedin','tiktok','bing','newsletter'].includes(campaign.campaign_source))safe.campaign_source=campaign.campaign_source;
    if(/^\d{1,30}$/.test(campaign.campaign_id||''))safe.campaign_id=campaign.campaign_id;
    window.dataLayer.push({ event, event_id: crypto.randomUUID(), ...safe });
    sessionStorage.setItem(key, '1');
    return true;
  } catch { return false; }
}
