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
export async function readLegalConfiguration() {
  try {
    const doc = await adminDb.collection('app_config').doc('legal').get();
    const data: Record<string, unknown> | undefined = doc.exists ? doc.data() : LEGAL;
    const parsed = legalDetailsSchema.safeParse(data);
    if (!parsed.success) throw new Error('Invalid public legal configuration');
    return publishedLegal(parsed.data, typeof data?.updatedAt === 'string' ? data.updatedAt : '');
  } catch {
    // A stored update must never silently fall back to old identity/consent details.
    return { ...publishedLegal({razonSocial:'',ruc:'',direccion:'',ciudad:'',correoPrivacidad:'',whatsapp:'',sitio:''}), ready:false, available:false };
  }
}
export async function saveLegalConfiguration(details: LegalDetails, actorUid: string) {
  const parsed = legalDetailsSchema.parse(details);
  const updatedAt = new Date().toISOString();
  await adminDb.collection('app_config').doc('legal').set({...parsed,updatedAt,updatedBy:actorUid});
  return publishedLegal(parsed,updatedAt);
}
