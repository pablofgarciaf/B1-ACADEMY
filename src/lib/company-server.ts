import 'server-only';
import type { CompanyState } from './firestore-types';
import type { CompanyCommand } from './company-commands';
import { readCompanyFirestore, executeCompanyCommandFirestore } from './company-server-firestore';
import { supabaseActivo, readCompanySupabase, executeCompanyCommandSupabase } from './company-store-supabase';
import { readCompanyAuditFirestore, verifyCompanyAuditFirestore } from './company-server-firestore';
import { readCompanyAuditSupabase, verifyCompanyAuditSupabase } from './company-store-supabase';

/**
 * Punto único de acceso a las empresas del simulador.
 * SIMULADOR_DB=supabase (con SUPABASE_URL y su clave secreta) → PostgreSQL; si no, Firestore.
 * Las rutas de la API no saben dónde se guardan los datos.
 */

export function almacenSimulador(): 'supabase' | 'firestore' {
  return supabaseActivo() ? 'supabase' : 'firestore';
}

export async function readCompany(uid: string, email = ''): Promise<CompanyState> {
  return supabaseActivo() ? readCompanySupabase(uid, email) : readCompanyFirestore(uid);
}

/** Verifica de forma irrefutable si el usuario ya inicializó su empresa de prueba B1 Center */
export async function hasInitializedCompany(uid: string): Promise<boolean> {
  try {
    const company = await readCompany(uid);
    return Boolean(company?.profile && company.profile.companyName);
  } catch {
    return false;
  }
}

export async function executeCompanyCommand(uid: string, email: string, command: CompanyCommand, requestId: string, actorUid = uid): Promise<string> {
  return supabaseActivo()
    ? executeCompanyCommandSupabase(uid, email, command, requestId, actorUid)
    : executeCompanyCommandFirestore(uid, email, command, requestId, actorUid);
}

export async function readCompanyAudit(uid: string, limit = 100, before?: number) {
  return supabaseActivo()
    ? readCompanyAuditSupabase(uid, limit, before)
    : readCompanyAuditFirestore(uid, limit, before);
}

export async function verifyCompanyAudit(uid: string) {
  return supabaseActivo() ? verifyCompanyAuditSupabase(uid) : verifyCompanyAuditFirestore(uid);
}
