// Prueba de integración REAL del simulador contra Supabase (no corre en CI: necesita la clave secreta).
// Uso: node --test tests/supabase-store.integration.cjs   (lee SUPABASE_URL y SUPABASE_SECRET_KEY de .env.local)
// Crea una empresa temporal, ejecuta operaciones con el motor real, verifica y la BORRA al final.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

// Variables de .env.local (sin imprimir valores).
for (const linea of fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = linea.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^"|"$/g, '');
}
process.env.SIMULADOR_DB = 'supabase';
const clave = process.env.SUPABASE_SECRET_KEY || '';
const omitir = !clave.startsWith('sb_secret_') && !clave.startsWith('eyJ');

// 'server-only' solo existe dentro de Next; aquí se reemplaza por un módulo vacío.
const resolver = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) { return request === 'server-only' ? require.resolve('./stub-vacio.cjs') : resolver.call(this, request, ...rest); };
require('ts-node').register({ transpileOnly: true, compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' } });

test('empresa en Supabase: guardar, leer, idempotencia y concurrencia', { skip: omitir && 'Falta la Secret key de Supabase en .env.local' }, async () => {
  const { executeCompanyCommandSupabase, readCompanySupabase, supabaseActivo } = require('../src/lib/company-store-supabase.ts');
  assert.equal(supabaseActivo(), true);
  const uid = `prueba_integracion_${Date.now()}`;
  const url = process.env.SUPABASE_URL.replace(/\/$/, '');
  const headers = { apikey: clave, ...(clave.startsWith('eyJ') ? { Authorization: `Bearer ${clave}` } : {}) };
  try {
    const r1 = '11111111-1111-4111-8111-111111111111';
    await executeCompanyCommandSupabase(uid, 'prueba@example.test', { action: 'initialize', data: { companyName: 'Empresa de prueba' } }, r1);
    // Misma solicitud repetida (reintento de red): no debe duplicar nada.
    await executeCompanyCommandSupabase(uid, 'prueba@example.test', { action: 'initialize', data: { companyName: 'Empresa de prueba' } }, r1);
    const cliente = { name: 'Cliente prueba', ruc: '1790000000001', email: '', phone: '', address: '', city: 'Quito', contactName: '', currency: 'USD', paymentTermsDays: 30, creditLimit: 1000, active: true, group: 'General', notes: '', kind: 'customer' };
    // Dos operaciones a la vez sobre la misma empresa: el control de versión debe serializarlas.
    await Promise.all([
      executeCompanyCommandSupabase(uid, 'prueba@example.test', { action: 'customer', data: { ...cliente, name: 'Cliente A' } }, '22222222-2222-4222-8222-222222222222'),
      executeCompanyCommandSupabase(uid, 'prueba@example.test', { action: 'customer', data: { ...cliente, name: 'Cliente B', ruc: '1790000000002' } }, '33333333-3333-4333-8333-333333333333'),
    ]);
    const empresa = await readCompanySupabase(uid);
    assert.equal(empresa.profile.companyName, 'Empresa de prueba');
    assert.ok(empresa.chartOfAccounts.length > 20, 'el plan de cuentas debe guardarse');
    assert.deepEqual(empresa.customers.map(c => c.name).sort(), ['Cliente A', 'Cliente B']);
  } finally {
    await fetch(`${url}/rest/v1/sim_companies?uid=eq.${uid}`, { method: 'DELETE', headers });
  }
});
