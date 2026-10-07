import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireBearerUser } from '@/lib/server-auth';
import { readCompany, executeCompanyCommand } from '@/lib/company-server';
import { commandSchema } from '@/lib/company-commands';

export const runtime = 'nodejs';
const envelope = z.object({ requestId: z.string().uuid(), command: commandSchema });
/**
 * Empresa del estudiante según la cabecera X-Empresa: "curso" = su B1 Center (Mi Aula), "libre" = su empresa propia.
 * La clave se deriva SIEMPRE de la sesión: nadie puede apuntar a la empresa de otro.
 */
const claveEmpresa = (request: Request, uid: string) => (request.headers.get('x-empresa') === 'libre' ? `${uid}__libre` : uid);
export async function GET(request: Request) {
  let actor;
  try { actor = await requireBearerUser(request); } catch (error: unknown) { return NextResponse.json({ error: error instanceof Error ? 'Sesión no válida.' : 'No autorizado.' }, { status: 401 }); }
  try {
    const pedido = new URL(request.url).searchParams.get('uid') || actor.uid;
    if (pedido !== actor.uid && !['teacher', 'docente'].includes(actor.profile.role)) return NextResponse.json({ error: 'Acceso denegado.' }, { status: 403 });
    const uid = pedido === actor.uid ? claveEmpresa(request, actor.uid) : pedido;
    if (!/^[\w-]{1,128}$/.test(uid)) return NextResponse.json({ error: 'Identificador inválido.' }, { status: 400 });
    // El correo solo se pasa cuando el estudiante lee su propia empresa (necesario para migrarla).
    return NextResponse.json(await readCompany(uid, pedido === actor.uid ? actor.email : ''), { headers: { 'Cache-Control': 'no-store' } });
  } catch (error: unknown) {
    console.error('SAP company read failed', error instanceof Error ? error.message : 'Unknown');
    return NextResponse.json({ error: 'No se pudo cargar la empresa. Comprueba tu sesión y la configuración de Firebase Admin.' }, { status: 503 });
  }
}
export async function POST(request: Request) {
  let actor;
  try { actor = await requireBearerUser(request); } catch (error: unknown) { return NextResponse.json({ error: error instanceof Error ? 'Sesión no válida.' : 'No autorizado.' }, { status: 401 }); }
  try {
    const parsed = envelope.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('; ') }, { status: 400 });
    if (parsed.data.command.action === 'authorize') await new Promise<void>(resolve => setTimeout(resolve, 2000));
    const result = await executeCompanyCommand(claveEmpresa(request, actor.uid), actor.email, parsed.data.command, parsed.data.requestId);
    return NextResponse.json({ result });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'No se pudo guardar.' }, { status: 400 });
  }
}
