import 'server-only';
import type { CompanyState } from './firestore-types';
import type { CompanyCommand } from './company-commands';
import { readCompanyFirestore, executeCompanyCommandFirestore } from './company-server-firestore';
import { supabaseActivo, readCompanySupabase, executeCompanyCommandSupabase } from './company-store-supabase';

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

export async function executeCompanyCommand(uid: string, email: string, command: CompanyCommand, requestId: string): Promise<string> {
  return supabaseActivo()
    ? executeCompanyCommandSupabase(uid, email, command, requestId)
    : executeCompanyCommandFirestore(uid, email, command, requestId);
}
