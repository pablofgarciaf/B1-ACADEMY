import 'server-only';

import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import type { UserProfile } from '@/context/AuthContext';

export const SESSION_COOKIE = '__session';
export const SESSION_MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000;

export interface AuthenticatedUser {
  uid: string;
  email: string;
  profile: UserProfile;
}

export class AuthRejectedError extends Error {}

async function readProfile(uid: string, email?: string): Promise<UserProfile | null> {
  const current = await adminDb.collection('usuarios').doc(uid).get();
  if (current.exists) return current.data() as UserProfile;

  // Migración transparente desde el esquema histórico usuarios/{email}.
  if (email) {
    const legacy = await adminDb.collection('usuarios').doc(email.toLowerCase()).get();
    if (legacy.exists) {
      const profile = { ...(legacy.data() as UserProfile), uid, email: email.toLowerCase() };
      await adminDb.collection('usuarios').doc(uid).set(profile, { merge: true });
      return profile;
    }
  }
  return null;
}

export async function authenticateIdToken(idToken: string): Promise<AuthenticatedUser> {
  let uid = '';
  let email = '';
  let profile: UserProfile | null = null;

  try {
    const decoded = await adminAuth.verifyIdToken(idToken, true);
    uid = decoded.uid;
    email = decoded.email?.toLowerCase() ?? '';
    if (!email) throw new Error('La cuenta autenticada no tiene correo.');
    profile = await readProfile(uid, email);
  } catch(error) {
    if(esRechazoAuth(error))throw new AuthRejectedError('Token no válido o revocado.');
    // Do not downgrade revocation checks to a different verifier when Admin is unavailable.
    throw error;
  }

  if (!profile || profile.status !== 'active') throw new AuthRejectedError('Perfil inexistente o inactivo.');
  return { uid, email, profile };
}

export async function createSessionValue(idToken: string): Promise<string> {
  try {
    return await adminAuth.createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE_MS });
  } catch {
    return `idtoken:${idToken}`;
  }
}

/**
 * Estado de la sesión para las páginas protegidas. Distingue "no hay sesión válida" (ir al login)
 * de "Firebase no respondió" (mostrar reintentar): mandar al login en el segundo caso creaba un bucle
 * login → /mi-aula → login, porque el navegador sí tiene sesión y el login lo devuelve de inmediato.
 */
export type SessionState =
  | { estado: 'ok'; user: AuthenticatedUser }
  | { estado: 'sin-sesion' }
  | { estado: 'no-disponible' };

/** Rechazo real de Firebase Auth (cookie vencida, revocada, inválida) frente a una falla temporal. */
function esRechazoAuth(error: unknown): boolean {
  if (error instanceof AuthRejectedError) return true;
  const code = (error as { code?: unknown })?.code;
  return typeof code === 'string' && code.startsWith('auth/') && !/internal|network|unavailable|quota|timeout/.test(code);
}

export async function getSessionState(): Promise<SessionState> {
  const session = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!session) return { estado: 'sin-sesion' };
  try {
    if (session.startsWith('idtoken:')) return { estado: 'ok', user: await authenticateIdToken(session.slice('idtoken:'.length)) };
    const decoded = await adminAuth.verifySessionCookie(session, true);
    const email = decoded.email?.toLowerCase();
    if (!email) return { estado: 'sin-sesion' };
    const profile = await readProfile(decoded.uid, email);
    if (!profile || profile.status !== 'active') return { estado: 'sin-sesion' };
    return { estado: 'ok', user: { uid: decoded.uid, email, profile } };
  } catch (error) {
    if (esRechazoAuth(error)) return { estado: 'sin-sesion' };
    console.error('[sesión] Firebase no disponible al validar la cookie:', (error as { code?: string })?.code ?? error);
    return { estado: 'no-disponible' };
  }
}

export async function getSessionUser(): Promise<AuthenticatedUser | null> {
  const store = await cookies();
  const session = store.get(SESSION_COOKIE)?.value;
  if (!session) return null;
  try {
    // `await` obligatorio: sin él, un token vencido escapa del try/catch y la página responde 500 en vez de ir al login.
    if (session.startsWith('idtoken:')) return await authenticateIdToken(session.slice('idtoken:'.length));

    const decoded = await adminAuth.verifySessionCookie(session, true);
    const email = decoded.email?.toLowerCase();
    if (!email) return null;
    const profile = await readProfile(decoded.uid, email);
    if (!profile || profile.status !== 'active') return null;
    return { uid: decoded.uid, email, profile };
  } catch {
    return null;
  }
}

export async function requireBearerUser(request: Request): Promise<AuthenticatedUser> {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) throw new Error('UNAUTHORIZED');
  const user = await authenticateIdToken(header.slice(7));
  assertAccountReady(user);
  return user;
}

export function assertAccountReady(user: AuthenticatedUser) {
  if (user.profile.passwordChanged === false || user.profile.passwordSecurityVersion !== 2) throw new AuthRejectedError('Debes crear tu contraseña personal antes de continuar.');
}

export function isAdmin(profile: UserProfile) {
  return profile.role === 'super' || profile.role === 'admin';
}
