import { NextResponse } from 'next/server';
import { requireBearerUser, isAdmin } from '@/lib/server-auth';
import { legalDetailsSchema } from '@/lib/legal-config';
import { readLegalConfiguration, saveLegalConfiguration } from '@/lib/legal-config-server';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  let actor; try { actor = await requireBearerUser(request); } catch { return NextResponse.json({error:'Inicia sesión.'},{status:401}); }
  if (!isAdmin(actor.profile)) return NextResponse.json({error:'Solo administradores.'},{status:403});
  const config = await readLegalConfiguration();
  return NextResponse.json(config,{status:config.available?200:503,headers:{'Cache-Control':'no-store'}});
}
export async function PUT(request: Request) {
  let actor; try { actor = await requireBearerUser(request); } catch { return NextResponse.json({error:'Inicia sesión.'},{status:401}); }
  if (!isAdmin(actor.profile)) return NextResponse.json({error:'Solo administradores.'},{status:403});
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({error:'Origen no permitido.'},{status:403});
  const parsed = legalDetailsSchema.safeParse(await request.json().catch(()=>null));
  if (!parsed.success) return NextResponse.json({error:parsed.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`).join(' ')},{status:400});
  try {return NextResponse.json(await saveLegalConfiguration(parsed.data,actor.uid),{headers:{'Cache-Control':'no-store'}});}
  catch {return NextResponse.json({error:'No se guardó la configuración. Intenta de nuevo.'},{status:503});}
}
