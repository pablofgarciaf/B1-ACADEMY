import { NextResponse } from 'next/server';
import { estadoFirebaseAdmin } from '@/lib/firebase-admin';
import { almacenSimulador } from '@/lib/company-server';

export const dynamic = 'force-dynamic';

/**
 * Diagnóstico de salud del servidor. No expone secretos: solo la versión de Node
 * y si Firebase Admin pudo cargarse (nombre/código del error, nunca la credencial).
 */
export function GET() {
  const admin = estadoFirebaseAdmin();
  return NextResponse.json({
    ok: true,
    node: process.version,
    firebaseAdmin: admin.ok ? 'ok' : `error: ${admin.error}`,
    credencialesAdmin: Boolean(process.env.FIREBASE_ADMIN_PROJECT_ID && process.env.FIREBASE_ADMIN_CLIENT_EMAIL && process.env.FIREBASE_ADMIN_PRIVATE_KEY),
    simuladorDb: almacenSimulador(),
  });
}
