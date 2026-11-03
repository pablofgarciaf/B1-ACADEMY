/**
 * GET /api/kb?sistema=b1&proceso=02_Compras&page=0&limit=30
 * Devuelve cards filtradas de docs/kb/index.json (solo calidad ok/revisar, sin duplicados)
 */
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import type { KBCard } from '@/types/kb-simulator';

const INDEX_PATH = path.join(process.cwd(), 'docs', 'kb', 'index.json');

let _cache: KBCard[] | null = null;
function loadIndex(): KBCard[] {
  if (_cache) return _cache;
  const raw = fs.readFileSync(INDEX_PATH, 'utf-8');
  _cache = JSON.parse(raw) as KBCard[];
  return _cache;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sistema  = searchParams.get('sistema');   // b1 | s4-sapgui | fiori
  const proceso  = searchParams.get('proceso');   // 02_Compras, etc.
  const page     = parseInt(searchParams.get('page')  ?? '0', 10);
  const limit    = parseInt(searchParams.get('limit') ?? '40', 10);
  const listOnly = searchParams.get('list') === '1'; // solo procesos disponibles

  const all = loadIndex();

  // ---- modo "list": qué procesos / sistemas hay en la KB ----
  if (listOnly) {
    const bySystem: Record<string, Set<string>> = {};
    for (const c of all) {
      if (c.calidad === 'descartar' || c.duplicado_de) continue;
      const sys = c.sistema_real;
      if (!bySystem[sys]) bySystem[sys] = new Set();
      bySystem[sys].add(c.proceso);
    }
    const result: Record<string, string[]> = {};
    for (const [sys, set] of Object.entries(bySystem)) {
      result[sys] = Array.from(set).sort();
    }
    return NextResponse.json(result);
  }

  // ---- modo cards ----
  let filtered = all.filter(c => {
    if (c.calidad === 'descartar') return false;
    if (c.duplicado_de)            return false;
    if (sistema && c.sistema_real  !== sistema)  return false;
    if (proceso && c.proceso       !== proceso)  return false;
    return true;
  });

  // orden cronológico: por video+segundo cuando los hay, por nombre de archivo si no
  filtered.sort((a, b) => {
    if (a.video && b.video && a.video !== b.video) return a.video < b.video ? -1 : 1;
    const sa = a.segundo ?? 0;
    const sb = b.segundo ?? 0;
    if (sa !== sb) return sa - sb;
    return a.archivo < b.archivo ? -1 : 1;
  });

  const total = filtered.length;
  const slice = filtered.slice(page * limit, (page + 1) * limit);

  return NextResponse.json({ total, page, limit, cards: slice });
}
