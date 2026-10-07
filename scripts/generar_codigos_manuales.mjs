// Regenera src/lib/manual-legacy-codes.ts (id académico del manual → código original del PDF)
// a partir de src/lib/manuals-120-data.ts. Ejecutar cuando se agreguen o renombren manuales:
//   node scripts/generar_codigos_manuales.mjs
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const src = fs.readFileSync(path.join(ROOT, 'src/lib/manuals-120-data.ts'), 'utf8');
const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const mod = { exports: {} };
new Function('module', 'exports', 'require', js)(mod, mod.exports, require);

const mapa = {};
for (const manual of mod.exports.ALL_MANUALS) {
  const codigo = (manual.pdfPath || '').split('/').pop().replace(/\.pdf$/, '');
  if (codigo && codigo !== manual.id) mapa[manual.id] = codigo;
}

const cuerpo = Object.entries(mapa).map(([id, codigo]) => `  ${JSON.stringify(id)}: ${JSON.stringify(codigo)},`).join('\n');
const salida = `/**
 * Equivalencia entre el id académico de cada manual ("1.1_Introduccion_a_SAP_Business_One") y su código
 * original ("10_Intro_11_Overview_IntroSAPB1_ES"), que es la clave de MANUAL_SPECIFIC_QUIZZES y MANUAL_SIMULATOR_MAP.
 *
 * Archivo generado a partir de manuals-120-data.ts (campo pdfPath). Existe para no importar ese archivo de 225 KB
 * en código que también usa el navegador (el simulador de Mi Aula lo cargaba en cada clase).
 * Regenerar si cambian los manuales: ver scripts/generar_codigos_manuales.mjs
 */
export const MANUAL_LEGACY_CODES: Record<string, string> = {
${cuerpo}
};

/** Código original de un manual, o undefined si no tiene otro código. */
export function legacyManualCode(manualId: string): string | undefined {
  return MANUAL_LEGACY_CODES[manualId];
}
`;
fs.writeFileSync(path.join(ROOT, 'src/lib/manual-legacy-codes.ts'), salida);
console.log(`manual-legacy-codes.ts: ${Object.keys(mapa).length} equivalencias`);
