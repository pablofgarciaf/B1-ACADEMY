/**
 * GET /api/kb/image?p=output/visualk_moderno/02_Compras/fcs_xxxx_0045.jpg
 * Sirve imágenes del KB que están fuera de /public
 */
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

const ROOT = process.cwd();

export async function GET(req: NextRequest) {
  const rel = req.nextUrl.searchParams.get('p') ?? '';
  if (!rel) return new NextResponse('missing p', { status: 400 });

  // Seguridad: no escapar el cwd
  const abs = path.resolve(ROOT, rel);
  if (!abs.startsWith(ROOT)) return new NextResponse('forbidden', { status: 403 });

  if (!fs.existsSync(abs)) return new NextResponse('not found', { status: 404 });

  const ext = path.extname(abs).toLowerCase();
  const mime =
    ext === '.png'  ? 'image/png'  :
    ext === '.webp' ? 'image/webp' :
    ext === '.jpg'  ? 'image/jpeg' :
    ext === '.jpeg' ? 'image/jpeg' : 'application/octet-stream';

  const buf = fs.readFileSync(abs);
  return new NextResponse(buf, {
    headers: {
      'Content-Type': mime,
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  });
}
