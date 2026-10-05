import { NextResponse } from 'next/server';
import {
  AuthRejectedError,
  authenticateIdToken,
  createSessionValue,
  SESSION_COOKIE,
  SESSION_MAX_AGE_MS,
} from '@/lib/server-auth';

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
