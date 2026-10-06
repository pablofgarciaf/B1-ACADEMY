// Pruebas de control interno y operaciones avanzadas: autorizaciones, cierres, precios, conteo y activos fijos.
const { test } = require('node:test');
const assert = require('node:assert/strict');
require('ts-node').register({ transpileOnly: true, compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' } });
const { applyCommand } = require('../src/lib/company-engine.ts');
const { emptyCompany } = require('../src/lib/firestore-types.ts');
const { commandSchema } = require('../src/lib/company-commands.ts');
const { trialBalance, financialSummary } = require('../src/lib/company-calculations.ts');

const now = '2026-10-04T12:00:00.000Z';
const socio = { ruc: '1790000000001', email: '', phone: '', address: '', city: 'Quito', contactName: '', currency: 'USD', paymentTermsDays: 30, creditLimit: 100000, active: true, group: 'General', notes: '' };
const item = { name: 'Laptop', type: 'inventory', group: 'General', purchaseUnit: 'UND', salesUnit: 'UND', price: 20, price2: 18, price3: 16, maxDiscount: 15, purchasePrice: 10, preferredVendor: '', weight: 0, length: 0, width: 0, height: 0, costingMethod: 'average', standardCost: 10, minStock: 2, maxStock: 1000, reorderPoint: 5, description: '', specifications: '', active: true };

function empresa() {
  let state = emptyCompany();
  const run = (action, data) => { const out = applyCommand(state, commandSchema.parse({ action, data }), 'u1', 'u1@example.test', now); state = out.state; return out.result; };
  run('initialize', { companyName: 'Demo' });
  const cliente = run('customer', { ...socio, name: 'Cliente', kind: 'customer' });
  const proveedor = run('vendor', { ...socio, name: 'Proveedor', ruc: '1790000000002' });
  const art = run('item', item);
  const line = (q, p) => ({ itemCode: art, description: 'Laptop', quantity: q, unit: 'UND', price: p, discount: 0, taxRate: 15, warehouseCode: 'PRINCIPAL' });
  const doc = (card, lines, date = '2026-10-04') => ({ date, dueDate: '2026-12-30', cardCode: card, lines, baseDocumentId: '', reference: '', comments: '' });
  return { run, cliente, proveedor, art, line, doc, get state() { return state; } };
}
const cuadra = s => financialSummary(trialBalance(s.chartOfAccounts, s.journalEntries, '0000-00-00', '9999-12-31')).difference === 0;

test('autorización: la compra sobre el monto queda retenida y solo se crea al aprobar con justificación', () => {
  const s = empresa();
  s.run('approvalRule', { docType: 'vendor_invoice', threshold: 1000, active: true });
  const id = s.run('purchase', { docType: 'vendor_invoice', document: s.doc(s.proveedor, [s.line(100, 10)]) }); // 1150 > 1000
  assert.match(id, /^APR-/);
  assert.equal(s.state.purchaseOrders.length, 0, 'no debe crearse el documento todavía');
  assert.equal(s.state.warehouseStock.length, 0, 'ni mover inventario');
  assert.throws(() => s.run('approve', { id, approved: true, comment: 'ok' }), /10 caracteres/);
  const doc = s.run('approve', { id, approved: true, comment: 'Precio negociado y stock necesario para la temporada.' });
  assert.match(doc, /^FP-/);
  assert.equal(s.state.purchaseOrders.length, 1);
  assert.equal(s.state.approvals[0].status, 'approved');
  assert.throws(() => s.run('approve', { id, approved: true, comment: 'Aprobación repetida no permitida' }), /ya fue decidida/);
  // Bajo el monto, el documento se crea directo.
  assert.match(s.run('purchase', { docType: 'vendor_invoice', document: s.doc(s.proveedor, [s.line(1, 10)]) }), /^FP-/);
});

test('autorización rechazada: no se crea nada y queda la justificación', () => {
  const s = empresa();
  s.run('approvalRule', { docType: 'vendor_invoice', threshold: 100, active: true });
  const id = s.run('purchase', { docType: 'vendor_invoice', document: s.doc(s.proveedor, [s.line(50, 10)]) });
  s.run('approve', { id, approved: false, comment: 'Excede el presupuesto de compras del trimestre.' });
  assert.equal(s.state.purchaseOrders.length, 0);
  assert.equal(s.state.approvals[0].status, 'rejected');
});

test('cierre de período: bloquea asientos en el mes cerrado y se puede reabrir', () => {
  const s = empresa();
  s.run('closePeriod', { period: '2026-10', closed: true });
  assert.throws(() => s.run('purchase', { docType: 'vendor_invoice', document: s.doc(s.proveedor, [s.line(1, 10)]) }), /período 2026-10 está cerrado/);
  assert.equal(s.state.purchaseOrders.length, 0);
  s.run('closePeriod', { period: '2026-10', closed: false });
  assert.match(s.run('purchase', { docType: 'vendor_invoice', document: s.doc(s.proveedor, [s.line(1, 10)]) }), /^FP-/);
});

test('cierre anual: salda resultados contra 3.02, mantiene el balance cuadrado y cierra los 12 meses', () => {
  const s = empresa();
  s.run('purchase', { docType: 'vendor_invoice', document: s.doc(s.proveedor, [s.line(10, 10)]) });
  s.run('sales', { docType: 'invoice', document: s.doc(s.cliente, [s.line(2, 20)]) }); // utilidad 40 − 20 = 20
  s.run('closeYear', { year: '2026' });
  const anual = trialBalance(s.state.chartOfAccounts, s.state.journalEntries, '0000-00-00', '9999-12-31');
  const saldo = c => anual.find(r => r.accountCode === c).closing;
  assert.equal(saldo('4.01'), 0); assert.equal(saldo('5.01'), 0);
  assert.equal(saldo('3.02'), -20, 'la utilidad pasa a Resultados acumulados (saldo acreedor)');
  assert.ok(cuadra(s.state));
  assert.equal(s.state.profile.closedPeriods.length, 12);
  assert.throws(() => s.run('closeYear', { year: '2026' }), /ya fue cerrado/);
});

test('precios: listas por artículo, lista por cliente y descuentos por volumen con tope', () => {
  const s = empresa();
  s.run('itemPrices', { itemCode: s.art, price: 25, price2: 22, price3: 20 });
  assert.equal(s.state.items[0].price2, 22);
  s.run('customerPriceList', { cardCode: s.cliente, list: 2 });
  assert.equal(s.state.profile.customerPriceLists[s.cliente], 2);
  const dv = s.run('volumeDiscount', { itemCode: s.art, minQuantity: 10, discount: 5 });
  assert.equal(s.state.profile.volumeDiscounts.length, 1);
  assert.throws(() => s.run('volumeDiscount', { itemCode: s.art, minQuantity: 50, discount: 30 }), /máximo permitido/);
  s.run('volumeDiscount', { id: dv, itemCode: s.art, minQuantity: 10, discount: 0, remove: true });
  assert.equal(s.state.profile.volumeDiscounts.length, 0);
});

test('conteo físico: ajusta stock y contabiliza la merma contra 6.05', () => {
  const s = empresa();
  s.run('purchase', { docType: 'vendor_invoice', document: s.doc(s.proveedor, [s.line(10, 10)]) }); // 10 u a $10
  s.run('inventoryCount', { warehouseCode: 'PRINCIPAL', date: '2026-10-05', blind: true, lines: [{ itemCode: s.art, countedQuantity: 8 }] });
  const conteo = s.state.inventoryCounts[0];
  assert.equal(conteo.lines[0].difference, -2);
  assert.equal(conteo.totalDifferenceValue, -20);
  assert.equal(s.state.warehouseStock[0].quantity, 8);
  const merma = trialBalance(s.state.chartOfAccounts, s.state.journalEntries, '0000-00-00', '9999-12-31').find(r => r.accountCode === '6.05');
  assert.equal(merma.closing, 20);
  assert.ok(cuadra(s.state));
});

test('costos de importación: lo que sigue en bodega sube el costo; lo vendido va al costo de ventas', () => {
  const s = empresa();
  const fp = s.run('purchase', { docType: 'vendor_invoice', document: s.doc(s.proveedor, [s.line(10, 10)]) }); // 10 u × $10
  s.run('sales', { docType: 'invoice', document: s.doc(s.cliente, [s.line(4, 20)]) }); // vende 4
  s.run('landedCost', { documentId: fp, date: '2026-10-06', allocation: 'value', paymentAccount: '2.1.01', costs: [{ concept: 'Flete internacional', amount: 15 }, { concept: 'ISD 5 %', amount: 5 }] });
  const ci = s.state.landedCosts[0];
  assert.equal(ci.total, 20);
  assert.equal(ci.lines[0].toInventory, 12);
  assert.equal(ci.lines[0].toCostOfSales, 8);
  assert.equal(s.state.warehouseStock[0].value, 72);
  assert.equal(s.state.warehouseStock[0].averageCost, 12);
  assert.ok(cuadra(s.state));
  assert.throws(() => s.run('landedCost', { documentId: 'NO-EXISTE', date: '2026-10-06', allocation: 'value', paymentAccount: '2.1.01', costs: [{ concept: 'Flete', amount: 1 }] }), /entrada de mercancía/);
});

test('CRM: probabilidad por etapa, motivo obligatorio al perder y actualización sin duplicar', () => {
  const s = empresa();
  const id = s.run('opportunity', { name: 'Renovación de equipos', cardCode: s.cliente, amount: 5000, stage: 'propuesta', expectedClose: '2026-11-30', source: 'Referido', notes: '' });
  assert.equal(s.state.opportunities[0].probability, 50);
  assert.throws(() => s.run('opportunity', { id, name: 'Renovación de equipos', cardCode: s.cliente, amount: 5000, stage: 'perdida', expectedClose: '2026-11-30', source: 'Referido', notes: '' }), /motivo de la pérdida/);
  s.run('opportunity', { id, name: 'Renovación de equipos', cardCode: s.cliente, amount: 5000, stage: 'ganada', expectedClose: '2026-11-30', source: 'Referido', notes: '' });
  assert.equal(s.state.opportunities.length, 1);
  assert.equal(s.state.opportunities[0].probability, 100);
  assert.ok(s.state.opportunities[0].closedAt);
});

test('datos de la empresa: valida el RUC y no permite borrar un almacén con stock', () => {
  const s = empresa();
  assert.throws(() => s.run('companySettings', { companyName: 'Demo', ruc: '1790000000', incomeTaxRate: 25, warehouses: [{ code: 'PRINCIPAL', name: 'Principal' }] }), /13 dígitos/);
  s.run('purchase', { docType: 'vendor_invoice', document: s.doc(s.proveedor, [s.line(1, 10)]) });
  assert.throws(() => s.run('companySettings', { companyName: 'Demo', ruc: '1790012345001', incomeTaxRate: 25, warehouses: [{ code: 'SECUNDARIO', name: 'Secundario' }] }), /tiene existencias/);
  s.run('companySettings', { companyName: 'Andina S.A.', ruc: '1790012345001', incomeTaxRate: 22, warehouses: [{ code: 'PRINCIPAL', name: 'Matriz Quito' }, { code: 'GYE', name: 'Bodega Guayaquil' }] });
  assert.equal(s.state.profile.ruc, '1790012345001');
  assert.equal(s.state.profile.warehouses.length, 2);
});

test('importación masiva: valida cada fila con las mismas reglas y es todo o nada', () => {
  const s = empresa();
  const fila = (n) => ({ ...socio, name: `Cliente ${n}`, ruc: `17900000001${String(n).padStart(2, '0')}`, kind: 'customer' });
  const antes = s.state.customers.length;
  assert.throws(() => s.run('importMasterData', { kind: 'customer', rows: [fila(10), { ...fila(11), ruc: 'malo' }] }), /Fila 2/);
  assert.equal(s.state.customers.length, antes, 'si una fila falla no se importa ninguna');
  assert.equal(s.run('importMasterData', { kind: 'customer', rows: [fila(10), fila(11), fila(12)] }), '3 registros importados');
  assert.equal(s.state.customers.length, antes + 3);
  assert.ok(s.state.profile.xpHistory.some(e => e.key === 'dtw'), 'el perfil sigue actualizándose');
});

test('activo fijo: compra y depreciación mensual en línea recta, sin pasarse del valor depreciable', () => {
  const s = empresa();
  s.run('fixedAsset', { name: 'Computador', category: 'Equipo de cómputo', acquisitionDate: '2026-01-15', cost: 1200, residualValue: 0, usefulLifeMonths: 36, paymentAccount: '2.2.01' });
  s.run('depreciate', { period: '2026-01' });
  assert.equal(s.state.fixedAssets[0].accumulatedDepreciation, 33.33);
  assert.throws(() => s.run('depreciate', { period: '2026-01' }), /No hay activos pendientes/);
  assert.ok(s.state.chartOfAccounts.some(a => a.code === '6.06'));
  assert.ok(cuadra(s.state));
  // Un activo de vida útil corta queda totalmente depreciado y no se pasa.
  s.run('fixedAsset', { name: 'Herramienta', category: 'Otros', acquisitionDate: '2026-02-01', cost: 100, residualValue: 10, usefulLifeMonths: 2, paymentAccount: '1.1.01' });
  s.run('depreciate', { period: '2026-02' }); s.run('depreciate', { period: '2026-03' });
  const h = s.state.fixedAssets[1];
  assert.equal(h.accumulatedDepreciation, 90); assert.equal(h.status, 'fully_depreciated');
});
