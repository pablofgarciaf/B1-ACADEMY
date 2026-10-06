// Pruebas del Query Manager (SQL sobre la empresa del estudiante con tablas SAP).
const { test } = require('node:test');
const assert = require('node:assert/strict');
require('ts-node').register({ transpileOnly: true, compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' } });
const { applyCommand } = require('../src/lib/company-engine.ts');
const { emptyCompany } = require('../src/lib/firestore-types.ts');
const { commandSchema } = require('../src/lib/company-commands.ts');
const { ejecutarConsulta, CONSULTAS_EJEMPLO } = require('../src/lib/query-engine.ts');

const now = '2026-10-04T12:00:00.000Z';
const socio = { ruc: '1790000000001', email: '', phone: '', address: '', city: 'Quito', contactName: '', currency: 'USD', paymentTermsDays: 30, creditLimit: 10000, active: true, group: 'General', notes: '' };
const item = { name: 'Laptop', type: 'inventory', group: 'General', purchaseUnit: 'UND', salesUnit: 'UND', price: 20, price2: 20, price3: 20, maxDiscount: 20, purchasePrice: 10, preferredVendor: '', weight: 0, length: 0, width: 0, height: 0, costingMethod: 'average', standardCost: 10, minStock: 2, maxStock: 1000, reorderPoint: 5, description: '', specifications: '', active: true };

function empresa() {
  let state = emptyCompany();
  const run = (action, data) => { const out = applyCommand(state, commandSchema.parse({ action, data }), 'u1', 'u1@example.test', now); state = out.state; return out.result; };
  run('initialize', { companyName: 'Demo' });
  const a = run('customer', { ...socio, name: 'Alfa', kind: 'customer' });
  const b = run('customer', { ...socio, name: 'Beta', ruc: '1790000000002', kind: 'customer' });
  const v = run('vendor', { ...socio, name: 'Proveedor', ruc: '1790000000003' });
  const art = run('item', item);
  const line = (q, p) => ({ itemCode: art, description: 'Laptop', quantity: q, unit: 'UND', price: p, discount: 0, taxRate: 15, warehouseCode: 'PRINCIPAL' });
  const doc = (card, lines) => ({ date: '2026-10-04', dueDate: '2026-10-30', cardCode: card, lines, baseDocumentId: '', reference: '', comments: '' });
  run('purchase', { docType: 'vendor_invoice', document: doc(v, [line(20, 10)]) });
  run('sales', { docType: 'invoice', document: doc(a, [line(3, 20)]) });
  run('sales', { docType: 'invoice', document: doc(a, [line(2, 20)]) });
  run('sales', { docType: 'invoice', document: doc(b, [line(1, 20)]) });
  return state;
}

test('GROUP BY con SUM y ORDER BY DESC por alias', () => {
  const r = ejecutarConsulta(empresa(), 'SELECT cardName, COUNT(*) AS n, SUM(subtotal) AS ventas FROM OINV GROUP BY cardName ORDER BY ventas DESC');
  assert.deepEqual(r.filas, [{ cardName: 'Alfa', n: 2, ventas: 100 }, { cardName: 'Beta', n: 1, ventas: 20 }]);
});

test('WHERE con AND, LIKE, comparación numérica y alias de tabla en español', () => {
  const s = empresa();
  assert.equal(ejecutarConsulta(s, "select docNumber from facturas where cardName like 'al%' and subtotal >= 50").filas.length, 1);
  assert.equal(ejecutarConsulta(s, "SELECT * FROM OCRD WHERE cardType = 'S'").filas.length, 1);
  assert.equal(ejecutarConsulta(s, "SELECT * FROM OCRD WHERE NOT (cardType = 'S')").filas.length, 2);
});

test('agregado sin GROUP BY sobre tabla vacía devuelve una fila', () => {
  const r = ejecutarConsulta(emptyCompany(), 'SELECT COUNT(*) AS n, SUM(total) AS t FROM OINV');
  assert.deepEqual(r.filas, [{ n: 0, t: null }]);
});

test('errores claros en español', () => {
  const s = empresa();
  assert.throws(() => ejecutarConsulta(s, 'SELECT * FROM TABLA_X'), /no existe/);
  assert.throws(() => ejecutarConsulta(s, 'SELECT columnaInventada FROM OINV'), /no existe/);
  assert.throws(() => ejecutarConsulta(s, 'SELECT cardName, SUM(total) FROM OINV'), /GROUP BY/);
  assert.throws(() => ejecutarConsulta(s, "SELECT * FROM OINV WHERE cardName = 'sin cerrar"), /comilla/);
  assert.throws(() => ejecutarConsulta(s, 'DELETE FROM OINV'), /SELECT/);
});

test('todas las consultas de ejemplo funcionan', () => {
  const s = empresa();
  for (const ej of CONSULTAS_EJEMPLO) assert.doesNotThrow(() => ejecutarConsulta(s, ej.sql), ej.titulo);
  assert.equal(ejecutarConsulta(s, CONSULTAS_EJEMPLO[2].sql).filas[0].unidades, 6);
});
