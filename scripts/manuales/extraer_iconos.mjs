// Extrae los íconos de lucide-react (ya instalado) a JSON {nombre-kebab: "<svg internals>"} para el renderizador Python.
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'node_modules/lucide-react/dist/esm/icons';
const out = {};
for (const file of readdirSync(dir)) {
  if (!file.endsWith('.js')) continue;
  const src = readFileSync(join(dir, file), 'utf8');
  const m = src.match(/const __iconNode = (\[[\s\S]*?\]);\n/);
  if (!m) continue;
  // El arreglo es JS literal (claves sin comillas): se evalúa en un contexto aislado sin acceso a nada.
  const nodes = Function(`"use strict"; return (${m[1]});`)();
  out[file.replace(/\.js$/, '')] = nodes.map(([tag, attrs]) => {
    const a = Object.entries(attrs).filter(([k]) => k !== 'key').map(([k, v]) => `${k}="${v}"`).join(' ');
    return `<${tag} ${a}/>`;
  }).join('');
}
mkdirSync('scripts/manuales/data', { recursive: true });
writeFileSync('scripts/manuales/data/lucide_icons.json', JSON.stringify(out));
console.log('íconos:', Object.keys(out).length);
