import { NextResponse } from 'next/server';
import { requireBearerUser } from '@/lib/server-auth';
import { readCompanyAudit, verifyCompanyAudit } from '@/lib/company-server';
import { companyScope } from '@/lib/company-scope';

export const runtime = 'nodejs';

/** Historial completo: solo el propietario autenticado de la empresa. */
export async function GET(request: Request) {
  let actor;
  try { actor = await requireBearerUser(request); }
  catch { return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 }); }
  const url = new URL(request.url);
  const slot = request.headers.get('x-empresa') || 'curso';
  let companyId: string;
  try { companyId = companyScope(actor.uid,slot,actor.profile.privateAccountingEnabled === true); }
  catch (error) { return NextResponse.json({error:error instanceof Error ? error.message : 'Empresa inválida.'},{status:403}); }
  const limit = Number(url.searchParams.get('limit') || '50');
  const beforeRaw = url.searchParams.get('before');
  const before = beforeRaw ? Number(beforeRaw) : undefined;
  if (!Number.isInteger(limit) || limit < 1 || limit > 100 ||
      (before !== undefined && (!Number.isSafeInteger(before) || before < 1))) {
    return NextResponse.json({ error: 'Paginación inválida.' }, { status: 400 });
  }
  try {
    if (url.searchParams.get('verify') === '1') {
      return NextResponse.json(await verifyCompanyAudit(companyId), { headers: { 'Cache-Control': 'private, no-store' } });
    }
    const events = await readCompanyAudit(companyId, limit, before);
    return NextResponse.json({ events }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Finix audit read failed', error instanceof Error ? error.message : 'Unknown');
    return NextResponse.json({ error: 'No se pudo cargar la trazabilidad.' }, { status: 503 });
  }
}
