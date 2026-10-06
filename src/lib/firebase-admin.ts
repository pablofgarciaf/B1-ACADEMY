import 'server-only';

import type { App } from 'firebase-admin/app';
import type { Auth } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';

/**
 * Firebase Admin con carga diferida.
 *
 * Antes se importaba y se inicializaba al cargar el módulo: si el paquete o sus credenciales
 * fallaban en Vercel (versión de Node, credencial mal formada, dependencia ausente), TODA ruta
 * que importara server-auth respondía 500 antes de ejecutar una sola línea propia.
 * Ahora el paquete se carga al primer uso, dentro de los try/catch de cada llamada:
 * si falla, la sesión cae al respaldo REST de server-auth y el error queda registrado.
 */

type EstadoAdmin = { app: App; auth: Auth; db: Firestore } | { error: Error };
let estado: EstadoAdmin | null = null;

function cargarAdmin(): EstadoAdmin {
  if (estado) return estado;
  try {
    // require() dentro de la función: carga diferida a propósito (ver arriba).
    const appMod = require('firebase-admin/app') as typeof import('firebase-admin/app');
    const authMod = require('firebase-admin/auth') as typeof import('firebase-admin/auth');
    const dbMod = require('firebase-admin/firestore') as typeof import('firebase-admin/firestore');

    let app = appMod.getApps()[0];
    if (!app) {
      const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
      app = projectId && clientEmail && privateKey
        ? appMod.initializeApp({ credential: appMod.cert({ projectId, clientEmail, privateKey }) })
        : appMod.initializeApp();
    }
    estado = { app, auth: authMod.getAuth(app), db: dbMod.getFirestore(app) };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('[firebase-admin] No se pudo inicializar:', err.name, (err as NodeJS.ErrnoException).code ?? '', err.message);
    estado = { error: err };
  }
  return estado;
}

function obtener<K extends 'auth' | 'db'>(clave: K) {
  const e = cargarAdmin();
  if ('error' in e) throw new Error(`Firebase Admin no disponible: ${e.error.message}`);
  return e[clave];
}

/** Proxy perezoso: el objeto real se crea en el primer acceso a una propiedad. */
function perezoso<T extends object>(crear: () => T): T {
  return new Proxy({} as T, {
    get(_destino, prop) {
      const real = crear();
      const valor = Reflect.get(real, prop, real);
      return typeof valor === 'function' ? valor.bind(real) : valor;
    },
  });
}

export const adminAuth: Auth = perezoso(() => obtener('auth') as Auth);
export const adminDb: Firestore = perezoso(() => obtener('db') as Firestore);

/** Estado para diagnóstico (sin secretos): nombre y código del error, nunca la credencial. */
export function estadoFirebaseAdmin(): { ok: boolean; error?: string } {
  const e = cargarAdmin();
  if (!('error' in e)) return { ok: true };
  const code = (e.error as NodeJS.ErrnoException).code;
  return { ok: false, error: [e.error.name, code].filter(Boolean).join(' ') };
}

/** FieldValue de Firestore cargado también de forma diferida. */
export function fieldValue(): typeof import('firebase-admin/firestore').FieldValue {
  obtener('db');
  return (require('firebase-admin/firestore') as typeof import('firebase-admin/firestore')).FieldValue;
}
