import 'server-only';
import { createHash } from 'node:crypto';
import { adminDb } from './firebase-admin';
import { LEGAL, POLITICAS_VERSION, legalDetailsSchema, legalMissing, type LegalDetails } from './legal-config';

/** Only these public business details leave the server. Never return document metadata. */
export function publishedLegal(details: LegalDetails, updatedAt = '') {
  const legal = { ...LEGAL, ...details, sitio: details.sitio || LEGAL.sitio };
  const revision = createHash('sha256').update(JSON.stringify(details)).digest('hex').slice(0,16);
  return { legal, policyVersion: `${POLITICAS_VERSION}.${revision}`, ready: legalMissing(details).length === 0, missing: legalMissing(details), available: true, updatedAt };
}
let cachedLegal: ReturnType<typeof publishedLegal> | null = null;
let lastLegalFetch = 0;
const LEGAL_CACHE_TTL = 5 * 60 * 1000; // 5 minutos de caché

export async function readLegalConfiguration() {
  const now = Date.now();
  if (cachedLegal && (now - lastLegalFetch < LEGAL_CACHE_TTL)) {
    return cachedLegal;
  }
  try {
    const doc = await adminDb.collection('app_config').doc('legal').get();
    const data: Record<string, unknown> | undefined = doc.exists ? doc.data() : LEGAL;
    const parsed = legalDetailsSchema.safeParse(data);
    if (!parsed.success) throw new Error('Invalid public legal configuration');
    cachedLegal = publishedLegal(parsed.data, typeof data?.updatedAt === 'string' ? data.updatedAt : '');
    lastLegalFetch = now;
    return cachedLegal;
  } catch (err) {
    // Si ya teníamos caché, reutilizarlo
    if (cachedLegal) return cachedLegal;
    // Si falla por cuota o red, usar LEGAL por defecto como fallback seguro y disponible
    const fallbackParsed = legalDetailsSchema.safeParse(LEGAL);
    if (fallbackParsed.success) {
      cachedLegal = publishedLegal(fallbackParsed.data, '');
      lastLegalFetch = now;
      return cachedLegal;
    }
    return { ...publishedLegal({razonSocial:'',ruc:'',direccion:'',ciudad:'',correoPrivacidad:'',whatsapp:'',sitio:''}), ready:false, available:false };
  }
}
export async function saveLegalConfiguration(details: LegalDetails, actorUid: string) {
  const parsed = legalDetailsSchema.parse(details);
  const updatedAt = new Date().toISOString();
  await adminDb.collection('app_config').doc('legal').set({...parsed,updatedAt,updatedBy:actorUid});
  return publishedLegal(parsed,updatedAt);
}
