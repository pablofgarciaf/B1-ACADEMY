import 'server-only';
import { createHash } from 'node:crypto';
import { collectionNames, emptyCompany, type CollectionName, type CompanyState, type Entity } from './firestore-types';
import { applyCommand } from './company-engine';
import { today } from './company-calculations';
import { companySummary } from './company-summary';
import type { CompanyCommand } from './company-commands';
import { auditChanges, type CompanyAuditEvent } from './company-audit';

/**
 * Empresas del simulador en Supabase (PostgreSQL).
 *
 * Mismo modelo que Firestore (perfil + colecciones), así el motor `applyCommand` no cambia.
 * Diferencia clave para escalar: leer una empresa es UNA consulta (sim_read) y guardar una
 * operación es UNA llamada atómica (sim_commit), en vez de una lectura por documento.
 * Se activa con SIMULADOR_DB=supabase; si falta, el simulador sigue en Firestore.
 */

const MAX_REINTENTOS = 4;

let avisoClave = false;
function config() {
  const url = process.env.SUPABASE_URL?.trim().replace(/^"|"$/g, '').replace(/\/$/, '');
  const key = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim().replace(/^"|"$/g, '');
  if (!url || !key) return null;
  // La clave publicable es pública y no tiene permiso sobre las tablas del simulador:
  // si se pegó por error, se ignora y el simulador sigue en Firestore en vez de fallar.
  if (key.startsWith('sb_publishable_')) {
    if (!avisoClave) { console.error('[simulador] SUPABASE_SECRET_KEY contiene la clave PUBLICABLE; usa la Secret key (sb_secret_…). Se mantiene Firestore.'); avisoClave = true; }
    return null;
  }
  return { url, key };
}

export function supabaseActivo(): boolean {
  return process.env.SIMULADOR_DB === 'supabase' && config() !== null;
}

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const c = config();
  if (!c) throw new Error('Supabase no está configurado.');
  // Las claves nuevas (sb_secret_…) van solo en `apikey`; las antiguas (JWT) también en Authorization.
  const headers: Record<string, string> = { apikey: c.key, 'Content-Type': 'application/json' };
  if (c.key.startsWith('eyJ')) headers.Authorization = `Bearer ${c.key}`;
  const response = await fetch(`${c.url}/rest/v1/rpc/${fn}`, { method: 'POST', headers, body: JSON.stringify(args), cache: 'no-store' });
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const mensaje = data && typeof data === 'object' && 'message' in data ? String(data.message) : `Supabase ${response.status}`;
    throw new Error(mensaje);
  }
  return data as T;
}

type Lectura = { exists: boolean; version: number; profile: CompanyState['profile']; entities: { c: string; d: Entity }[] };

async function leer(uid: string): Promise<{ state: CompanyState; version: number; exists: boolean }> {
  const r = await rpc<Lectura>('sim_read', { p_uid: uid });
  const state = emptyCompany();
  state.profile = r.profile ?? null;
  const validas = new Set<string>(collectionNames);
  for (const fila of r.entities) {
    if (!validas.has(fila.c)) continue;
    (state[fila.c as CollectionName] as Entity[]).push(fila.d);
  }
  return { state, version: Number(r.version) || 0, exists: r.exists };
}

type Commit = { status: 'ok' | 'duplicate' | 'conflict'; result?: string };

function filasNuevas(before: CompanyState, after: CompanyState) {
  const upserts: { c: CollectionName; id: string; d: Entity }[] = [];
  const deletes: { c: CollectionName; id: string }[] = [];
  for (const name of collectionNames) {
    const old = new Map<string, Entity>(before[name].map(row => [row.id, row]));
    const seenIds = new Set<string>();
    for (const row of after[name] as Entity[]) {
      if (seenIds.has(row.id)) continue;
      seenIds.add(row.id);
      if (JSON.stringify(old.get(row.id)) !== JSON.stringify(row)) upserts.push({ c: name, id: row.id, d: row });
      old.delete(row.id);
    }
    for (const id of old.keys()) deletes.push({ c: name, id });
  }
  return { upserts, deletes };
}

async function commitRPC(args: {
  p_uid: string; p_email: string; p_request_id: string; p_fingerprint: string; p_action: string;
  p_result: string; p_expected_version: number; p_profile: unknown; p_summary: unknown;
  p_upserts: unknown; p_deletes: unknown; p_audit: unknown;
}): Promise<Commit> {
  try {
    return await rpc<Commit>('sim_commit', args);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Could not find the function public.sim_commit')) {
      throw new Error('El almacén del simulador requiere la migración de auditoría. No se guardó la operación.', { cause: err });
    }
    throw err;
  }
}

/**
 * Migración perezosa: la primera vez que un estudiante usa el simulador con Supabase activo,
 * su empresa se copia desde Firestore. Si Firestore no responde, se empieza vacío sin bloquear.
 */
async function asegurarMigrada(uid: string, email: string, lectura: Awaited<ReturnType<typeof leer>>) {
  if (lectura.exists) return lectura;
  // Supabase es ya la base oficial del simulador: la copia desde Firestore queda desactivada (si no, al vaciar
  // Supabase las empresas antiguas "resucitarían"). Se reactiva solo con SIMULADOR_MIGRAR_FIRESTORE=1.
  if (process.env.SIMULADOR_MIGRAR_FIRESTORE !== '1') return lectura;
  let origen: CompanyState | null = null;
  try {
    const { readCompanyFirestore } = await import('./company-server-firestore');
    origen = await readCompanyFirestore(uid);
  } catch (error) {
    console.error('[simulador] No se pudo leer Firestore para migrar', uid, error instanceof Error ? error.message : error);
  }
  if (!origen?.profile) return lectura;
  const { upserts, deletes } = filasNuevas(emptyCompany(), origen);
  await commitRPC({
    p_uid: uid, p_email: email, p_request_id: 'migracion-firestore', p_fingerprint: 'migracion-firestore',
    p_action: 'migracion', p_result: 'Empresa migrada desde Firestore', p_expected_version: 0,
    p_profile: origen.profile, p_summary: companySummary(origen, today()), p_upserts: upserts, p_deletes: deletes,
    p_audit: { companyId: uid, actorUid: uid, actorEmail: email, requestId: 'migracion-firestore', action: 'migracion',
      result: 'Empresa migrada desde Firestore', occurredAt: new Date().toISOString(), changes: auditChanges(emptyCompany(), origen) },
  });
  return leer(uid);
}

export async function readCompanySupabase(uid: string, email = ''): Promise<CompanyState> {
  try {
    const lectura = await leer(uid);
    return (await asegurarMigrada(uid, email, lectura)).state;
  } catch (error: unknown) { throw new Error('No se pudo leer la empresa.', { cause: error }); }
}

export async function executeCompanyCommandSupabase(uid: string, email: string, command: CompanyCommand, requestId: string, actorUid = uid): Promise<string> {
  const fingerprint = createHash('sha256').update(JSON.stringify(command)).digest('hex');
  for (let intento = 0; intento < MAX_REINTENTOS; intento++) {
    const { state: before, version } = await asegurarMigrada(uid, email, await leer(uid));
    const occurredAt = new Date().toISOString();
    const { state, result } = applyCommand(before, command, uid, email, occurredAt);
    const { upserts, deletes } = filasNuevas(before, state);
    if (upserts.length + deletes.length > 450) throw new Error('Demasiadas líneas para una sola operación; divide el documento.');
    const r = await commitRPC({
      p_uid: uid, p_email: email, p_request_id: requestId, p_fingerprint: fingerprint, p_action: command.action,
      p_result: result, p_expected_version: version, p_profile: state.profile,
      p_summary: state.profile ? companySummary(state, today()) : null, p_upserts: upserts, p_deletes: deletes,
      p_audit: { companyId: uid, actorUid, actorEmail: email, requestId, action: command.action,
        result, occurredAt, changes: auditChanges(before, state) },
    });
    if (r.status !== 'conflict') return String(r.result ?? result);
    // Otra operación de la misma empresa se guardó a la vez: se relee y se vuelve a aplicar.
  }
  throw new Error('La empresa está ocupada; intenta de nuevo.');
}

/** Solo llamar después de autorizar al propietario o a un administrador en la ruta API. */
export async function readCompanyAuditSupabase(uid: string, limit = 100, before?: number): Promise<CompanyAuditEvent[]> {
  try {
    const rows = await rpc<Array<{
      uid: string; version: number; request_id: string; actor_uid: string; actor_email: string;
      action: CompanyAuditEvent['action']; result: string; occurred_at: string;
      changes: CompanyAuditEvent['changes']; previous_hash: string; hash: string;
    }>>('sim_read_audit', { p_uid: uid, p_limit: Math.min(Math.max(limit, 1), 100), p_before: before ?? null });
    return rows.map(row => ({ version: row.version, companyId: row.uid, actorUid: row.actor_uid, actorEmail: row.actor_email,
      requestId: row.request_id, action: row.action, result: row.result, occurredAt: row.occurred_at,
      changes: row.changes, previousHash: row.previous_hash, hash: row.hash }));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Could not find the function public.sim_read_audit')) throw new Error('La auditoría no está disponible: falta su migración.', { cause: err });
    throw err;
  }
}

export async function verifyCompanyAuditSupabase(uid: string): Promise<{ valid: boolean; checked: number; firstBadVersion?: number }> {
  try {
    return await rpc('sim_verify_audit', { p_uid: uid });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Could not find the function public.sim_verify_audit')) throw new Error('No se puede verificar la integridad: falta la migración de auditoría.', { cause: err });
    throw err;
  }
}

/** Listado para el panel del docente: perfil + resumen de cada empresa. */
export async function listCompaniesSupabase(): Promise<{ uid: string; raw: Record<string, unknown> }[]> {
  const c = config();
  if (!c) throw new Error('Supabase no está configurado.');
  const headers: Record<string, string> = { apikey: c.key };
  if (c.key.startsWith('eyJ')) headers.Authorization = `Bearer ${c.key}`;
  const response = await fetch(`${c.url}/rest/v1/sim_companies?select=uid,profile,summary&profile=not.is.null`, { headers, cache: 'no-store' });
  if (!response.ok) throw new Error(`Supabase ${response.status}`);
  const filas = (await response.json()) as { uid: string; profile: Record<string, unknown>; summary: Record<string, unknown> }[];
  // El docente ve la B1 Center de cada estudiante; la empresa libre ("<uid>__libre") es personal y no se lista.
  return filas.filter(f => !f.uid.includes('__') && f.profile.usage !== 'private').map(f => ({ uid: f.uid, raw: { ...f.profile, ...f.summary } }));
}

export async function addMissionSupabase(uid: string, mission: Record<string, unknown> & { id: string }): Promise<string> {
  return rpc<string>('sim_add_mission', { p_uid: uid, p_mission: mission });
}
