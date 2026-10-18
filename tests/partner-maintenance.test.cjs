const { test } = require('node:test');
const assert = require('node:assert/strict');
require('./register.cjs');
const { emptyCompany } = require('../src/lib/firestore-types.ts');
const { applyCommand } = require('../src/lib/company-engine.ts');
const { commandSchema } = require('../src/lib/company-commands.ts');
const now = '2026-10-17T15:00:00.000Z';
function fixture() {
  let state = emptyCompany();
  const run = (action, data) => { const result = applyCommand(state, commandSchema.parse({ action, data }), 'partner-owner__privado', 'synthetic@example.test', now); state = result.state; return result.result; };
  run('initialize', { companyName: 'Empresa ficticia de prueba' });
  const common = { name: 'Socio ficticio', ruc: '1790000000001', email: '', phone: '', address: '', city: 'Quito', contactName: '', currency: 'USD', paymentTermsDays: 30, creditLimit: 1000, active: true, group: 'Prueba', notes: '' };
  const customerCode = run('customer', { ...common, kind: 'lead' });
  const vendorCode = run('vendor', common);
  return { run, customerCode, vendorCode, common, get state() { return state; } };
}
test('editar y convertir un lead conserva identidad y saldo y no crea otra ficha', () => {
  const f = fixture(); const before = structuredClone(f.state);
  f.run('partnerUpdate', { partnerType: 'customer', cardCode: f.customerCode, changes: { kind: 'customer', city: 'Cuenca', paymentTermsDays: 45 } });
  assert.equal(f.state.customers.length, 1); assert.equal(f.state.customers[0].kind, 'customer');
  assert.equal(f.state.customers[0].city, 'Cuenca'); assert.equal(f.state.customers[0].paymentTermsDays, 45);
  for (const key of ['id', 'cardCode', 'balance', 'createdAt', 'createdBy']) assert.equal(f.state.customers[0][key], before.customers[0][key]);
  assert.throws(() => commandSchema.parse({ action: 'partnerUpdate', data: { partnerType: 'customer', cardCode: f.customerCode, changes: { balance: 999 } } }));
});
test('vínculo de cliente y proveedor verifica identidad y registra ambos extremos sin compensar deuda', () => {
  const f = fixture(); f.state.customers[0].balance = 75; f.state.vendors[0].balance = 30;
  f.run('partnerLink', { customerCode: f.customerCode, vendorCode: f.vendorCode });
  assert.equal(f.state.customers[0].linkedVendorCode, f.vendorCode); assert.equal(f.state.vendors[0].linkedCustomerCode, f.customerCode);
  assert.equal(f.state.customers[0].balance, 75); assert.equal(f.state.vendors[0].balance, 30);
  const before = JSON.stringify(f.state);
  assert.throws(() => f.run('partnerUpdate', { partnerType: 'customer', cardCode: f.customerCode, changes: { ruc: '1790000000002' } }), /identificación/);
  assert.equal(JSON.stringify(f.state), before);
  const other = f.run('vendor', { ...f.common, name: 'Otra empresa ficticia', ruc: '1790000000002' });
  assert.throws(() => f.run('partnerLink', { customerCode: f.customerCode, vendorCode: other }), /misma identificación/);
  assert.throws(() => f.run('partnerLink', { customerCode: 'AJENO', vendorCode: f.vendorCode }), /esta empresa/);
});
test('edición rechaza desactivar saldo pendiente, duplicar identificación o mezclar tipos', () => {
  const f = fixture(); f.state.customers[0].balance = 10;
  assert.throws(() => f.run('partnerUpdate', { partnerType: 'customer', cardCode: f.customerCode, changes: { active: false } }), /saldo pendiente/);
  assert.throws(() => f.run('partnerUpdate', { partnerType: 'vendor', cardCode: f.vendorCode, changes: { kind: 'lead' } }), /proveedor/);
  assert.throws(() => f.run('partnerUpdate', { partnerType: 'customer', cardCode: f.customerCode, changes: { rimpe: 'popular' } }), /cliente/);
  f.state.customers[0].balance = 0;
  f.run('customer', { ...f.common, name: 'Segundo socio ficticio', ruc: '1790000000002', kind: 'customer' });
  assert.throws(() => f.run('partnerUpdate', { partnerType: 'customer', cardCode: f.customerCode, changes: { ruc: '1790000000002' } }), /otro socio/);
});
