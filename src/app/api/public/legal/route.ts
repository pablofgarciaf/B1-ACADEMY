import { NextResponse } from 'next/server';
import { readLegalConfiguration } from '@/lib/legal-config-server';
export const dynamic = 'force-dynamic';
export async function GET() {
  const config = await readLegalConfiguration();
  return NextResponse.json(config,{status:config.available?200:503,headers:{'Cache-Control':'no-store, max-age=0'}});
}
