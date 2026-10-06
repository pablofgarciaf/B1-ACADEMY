import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  AuthRejectedError,
  authenticateIdToken,
  createSessionValue,
  getSessionUser,
  SESSION_COOKIE,
  SESSION_MAX_AGE_MS,
} from '@/lib/server-auth';

export const dynamic = 'force-dynamic';

/** Diagnóstico de la sesión propia (sin secretos): qué tipo de cookie hay y si el servidor la acepta. */
export async function GET() {
  const valor = (await cookies()).get(SESSION_COOKIE)?.value;
  const tipo = !valor ? 'ninguna' : valor.startsWith('idtoken:') ? 'respaldo-idtoken (caduca en 1 h)' : 'cookie-firebase (5 días)';
  const usuario = valor ? await getSessionUser() : null;
  return NextResponse.json({ tipo, valida: Boolean(usuario), rol: usuario?.profile.role ?? null });
}

export async function POST(request: Request) {
  try {
    const { idToken } = (await request.json()) as { idToken?: string };
    if (!idToken || idToken.length > 10000) {
      return NextResponse.json({ error: 'Token requerido.' }, { status: 400 });
    }
    const user = await authenticateIdToken(idToken);
    const sessionCookie = await createSessionValue(idToken);
    const response = NextResponse.json({ profile: user.profile });
    response.cookies.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_MS / 1000,
    });
    return response;
  } catch (error) {
    // 401 solo ante un rechazo real; una caída de red hacia Firebase es temporal (503) y no debe cerrar la sesión.
    if (error instanceof AuthRejectedError) {
      return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Servicio temporalmente no disponible. Intenta de nuevo.' }, { status: 503 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
