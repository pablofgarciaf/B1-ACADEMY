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

type FirebaseRestValue = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  arrayValue?: { values?: FirebaseRestValue[] };
  mapValue?: { fields?: Record<string, FirebaseRestValue> };
  timestampValue?: string;
  nullValue?: null;
};

type FirebaseRestDocument = {
  fields?: Record<string, FirebaseRestValue>;
};

function decodeFirestoreValue(value: FirebaseRestValue): unknown {
  if ('stringValue' in value) return value.stringValue ?? '';
  if ('integerValue' in value) return Number(value.integerValue ?? 0);
  if ('doubleValue' in value) return value.doubleValue ?? 0;
  if ('booleanValue' in value) return value.booleanValue ?? false;
  if ('timestampValue' in value) return value.timestampValue ?? '';
  if ('arrayValue' in value) return (value.arrayValue?.values ?? []).map(decodeFirestoreValue);
  if ('mapValue' in value) {
    return Object.fromEntries(
      Object.entries(value.mapValue?.fields ?? {}).map(([key, nested]) => [key, decodeFirestoreValue(nested)]),
    );
  }
  return null;
}

function decodeFirestoreDocument(document: FirebaseRestDocument): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(document.fields ?? {}).map(([key, value]) => [key, decodeFirestoreValue(value)]),
  );
}

/** Rechazo definitivo de la identidad (token inválido, perfil inexistente o inactivo). Las fallas de red NO usan esta clase. */
export class AuthRejectedError extends Error {}

async function verifyIdTokenWithRest(idToken: string) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) throw new Error('Falta NEXT_PUBLIC_FIREBASE_API_KEY.');

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
    cache: 'no-store',
  });
  if (response.status === 400 || response.status === 401 || response.status === 403) throw new AuthRejectedError('Token no válido.');
  if (!response.ok) throw new Error(`Servicio de identidad no disponible (${response.status}).`);
  const result = (await response.json()) as { users?: Array<{ localId?: string; email?: string }> };
  const user = result.users?.[0];
  if (!user?.localId || !user.email) throw new AuthRejectedError('La cuenta autenticada no tiene correo.');
  return { uid: user.localId, email: user.email.toLowerCase() };
}

async function readProfileWithRest(uid: string, email: string, idToken: string): Promise<UserProfile | null> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error('Falta NEXT_PUBLIC_FIREBASE_PROJECT_ID.');

  async function readDocument(documentId: string) {
    const encodedId = encodeURIComponent(documentId);
    const response = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/usuarios/${encodedId}`, {
      headers: { Authorization: `Bearer ${idToken}` },
      cache: 'no-store',
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('No se pudo leer el perfil del usuario.');
    return decodeFirestoreDocument((await response.json()) as FirebaseRestDocument) as Partial<UserProfile>;
  }

  const profile = await readDocument(uid) ?? await readDocument(email);
  return profile ? ({ ...profile, uid, email } as UserProfile) : null;
}

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
  } catch {
    const verified = await verifyIdTokenWithRest(idToken);
    uid = verified.uid;
    email = verified.email;
    profile = await readProfileWithRest(uid, email, idToken);
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

export async function getSessionUser(): Promise<AuthenticatedUser | null> {
  const store = await cookies();
  const session = store.get(SESSION_COOKIE)?.value;
  if (!session) return null;
  try {
    if (session.startsWith('idtoken:')) return authenticateIdToken(session.slice('idtoken:'.length));

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
  return authenticateIdToken(header.slice(7));
}

export function isAdmin(profile: UserProfile) {
  return profile.role === 'super' || profile.role === 'admin';
}
