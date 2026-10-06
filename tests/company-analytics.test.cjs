// Pruebas del análisis gerencial con una empresa real del simulador (mismo motor que producción).
const { test } = require('node:test');
const assert = require('node:assert/strict');
require('ts-node').register({ transpileOnly: true, compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' } });
const { applyCommand } = require('../src/lib/company-engine.ts');
const { emptyCompany } = require('../src/lib/firestore-types.ts');
const { commandSchema } = require('../src/lib/company-commands.ts');
const { analisisGerencial } = require('../src/lib/company-analytics.ts');

const now = '2026-10-04T12:00:00.000Z';
const partner = { name: 'Socio ficticio', ruc: '1790000000001', email: '', phone: '', address: '', city: 'Quito', contactName: '', currency: 'USD', paymentTermsDays: 30, creditLimit: 10000, active: true, group: 'General', notes: '' };
const item = { name: 'Artículo demo', type: 'inventory', group: 'General', purchaseUnit: 'UND', salesUnit: 'UND', price: 20, price2: 20, price3: 20, maxDiscount: 20, purchasePrice: 10, preferredVendor: '', weight: 0, length: 0, width: 0, height: 0, costingMethod: 'average', standardCost: 10, minStock: 2, maxStock: 1000, reorderPoint: 5, description: '', specifications: '', active: true };

function empresa() {
  let state = emptyCompany();
  const run = (action, data) => { const out = applyCommand(state, commandSchema.parse({ action, data }), 'student1', 'student@example.test', now); state = out.state; return out.result; };
  run('initialize', { companyName: 'Academia Demo' });
  const customer = run('customer', { ...partner, kind: 'customer' });
  const vendor = run('vendor', partner);
  const article = run('item', item);
  const line = (quantity, price) => ({ itemCode: article, description: item.name, quantity, unit: 'UND', price, discount: 0, taxRate: 15, warehouseCode: 'PRINCIPAL' });
  const doc = (cardCode, lines) => ({ date: '2026-10-04', dueDate: '2026-10-30', cardCode, lines, baseDocumentId: '', reference: '', comments: '' });
  return { run, customer, vendor, line, doc, get state() { return state; } };
}

const valor = (a, clave) => a.indicadores.find(i => i.clave === clave);

test('empresa sin movimientos: sin datos y sin diagnóstico inventado', () => {
  const s = empresa();
  const a = analisisGerencial(s.state, '2026-01-01', '2026-12-31');
  assert.equal(a.suficientesDatos, false);
  assert.equal(valor(a, 'margenBruto').semaforo, 'sin-datos');
  assert.equal(valor(a, 'liquidez').valor, null);
});

test('compra y venta a crédito: indicadores correctos y diagnóstico coherente', () => {
  const s = empresa();
  // Compra 10 u × $10 a crédito (+15 % IVA) y vende 2 u × $20 a crédito.
  s.run('purchase', { docType: 'vendor_invoice', document: s.doc(s.vendor, [s.line(10, 10)]) });
  s.run('sales', { docType: 'invoice', document: s.doc(s.customer, [s.line(2, 20)]) });
  const a = analisisGerencial(s.state, '2026-01-01', '2026-12-31');

  assert.equal(a.suficientesDatos, true);
  assert.equal(a.cifras.ventas, 40);
  assert.equal(a.cifras.costoVentas, 20);
  assert.equal(a.cifras.utilidadBruta, 20);
  assert.equal(a.cifras.inventario, 80);
  assert.equal(a.cifras.cuentasPorCobrar, 46);
  assert.equal(a.cifras.cuentasPorPagar, 115);

  // Margen bruto 20 / 40 = 50 % → sano.
  assert.equal(valor(a, 'margenBruto').valor, 50);
  assert.equal(valor(a, 'margenBruto').semaforo, 'verde');
  // Todo lo vendido fue a un solo cliente → dependencia 100 % → alerta.
  assert.equal(valor(a, 'concentracion').valor, 100);
  assert.equal(valor(a, 'concentracion').semaforo, 'rojo');
  // Activo corriente (80 inv + 46 CxC + 15 IVA compras) ÷ pasivo corriente (115 CxP + 6 IVA ventas) ≈ 1,17 → vigilar.
  assert.equal(valor(a, 'liquidez').valor, 1.17);
  assert.equal(valor(a, 'liquidez').semaforo, 'amarillo');
  // Financiado casi todo con deuda de proveedores → endeudamiento alto.
  assert.equal(valor(a, 'endeudamiento').semaforo, 'rojo');

  // 115 de deuda a proveedores contra 20 de costo: no se les está pagando → alerta, no "sano".
  assert.equal(valor(a, 'dpo').semaforo, 'rojo');
  assert.ok(a.diagnostico.some(d => d.includes('proveedores se acumulan')));
  assert.ok(a.diagnostico.some(d => d.startsWith('Alertas críticas')));
  assert.ok(a.indicadores.every(i => i.pregunta.endsWith('?')), 'cada indicador debe dejar una pregunta para pensar');
});

test('cobrar al cliente mejora los días de cobro', () => {
  const s = empresa();
  s.run('purchase', { docType: 'vendor_invoice', document: s.doc(s.vendor, [s.line(10, 10)]) });
  const factura = s.run('sales', { docType: 'invoice', document: s.doc(s.customer, [s.line(2, 20)]) });
  const antes = valor(analisisGerencial(s.state, '2026-01-01', '2026-12-31'), 'dso').valor;
  s.run('bank', { bankAccountId: 'BAN-1', date: '2026-10-04', type: 'deposit', amount: 46, counterpartAccount: '1.1.03', reference: '', documentId: factura });
  const despues = valor(analisisGerencial(s.state, '2026-01-01', '2026-12-31'), 'dso').valor;
  assert.ok(antes > 0);
  assert.equal(despues, 0);
});
