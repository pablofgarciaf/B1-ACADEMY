const { test } = require('node:test');
const assert = require('node:assert/strict');
require('ts-node').register({ transpileOnly: true, compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' } });
const { applyCommand } = require('../src/lib/company-engine.ts');
const { emptyCompany } = require('../src/lib/firestore-types.ts');
const { commandSchema } = require('../src/lib/company-commands.ts');
const { totals, moveStock, trialBalance, financialSummary, sriAccessKey, payrollLine, mrp } = require('../src/lib/company-calculations.ts');
const { defaultATS } = require('../src/lib/company-defaults.ts');
const now = '2026-10-04T12:00:00.000Z';
const partner = { name: 'Socio ficticio', ruc: '1790000000001', email: '', phone: '', address: '', city: 'Quito', contactName: '', currency: 'USD', paymentTermsDays: 30, creditLimit: 10000, active: true, group: 'General', notes: '' };
const item = { name: 'Artículo demo', type: 'inventory', group: 'General', purchaseUnit: 'UND', salesUnit: 'UND', price: 20, price2: 20, price3: 20, maxDiscount: 20, purchasePrice: 10, preferredVendor: '', weight: 0, length: 0, width: 0, height: 0, costingMethod: 'average', standardCost: 10, minStock: 2, maxStock: 1000, reorderPoint: 5, description: '', specifications: '', active: true };
function sandbox() {
  let state = emptyCompany();
  const run = (action, data, timestamp = now) => { const parsed = commandSchema.parse({ action, data }); const output = applyCommand(state, parsed, 'student1', 'student@example.test', timestamp); state = output.state; return output.result; };
  run('initialize', { companyName: 'Academia Demo' });
  const customer = run('customer', { ...partner, kind: 'customer' });
  const vendor = run('vendor', partner); const article = run('item', item);
  const line = (quantity = 10, price = 10) => ({ itemCode: article, description: item.name, quantity, unit: 'UND', price, discount: 0, taxRate: 15, warehouseCode: 'PRINCIPAL' });
  const doc = (cardCode, lines, baseDocumentId = '') => ({ date: '2026-10-04', dueDate: '2026-10-30', cardCode, lines, baseDocumentId, reference: '', comments: '' });
  return { run, customer, vendor, article, line, doc, get state() { return state; } };
}
test('initialization is idempotent and tenant metadata is authoritative', () => {
  const s = sandbox(); const count = s.state.chartOfAccounts.length;
  s.run('initialize', { companyName: 'Do not overwrite' });
  assert.equal(s.state.profile.companyName, 'Academia Demo'); assert.equal(s.state.chartOfAccounts.length, count);
  assert.equal(s.state.customers[0].createdBy, 'student1');
});
test('schema rejects invalid dates, negative prices and invalid document types', () => {
  const s = sandbox(); assert.throws(() => s.run('sales', { docType: 'invoice', document: { ...s.doc(s.customer, [s.line()]), date: '2026-02-31' } }));
  assert.throws(() => s.run('sales', { docType: 'invoice', document: s.doc(s.customer, [{ ...s.line(), price: -1 }]) }));
});
test('linked purchase and sales cycles post once, move stock and award XP once', () => {
  const s = sandbox(); let base = '';
  for (const docType of ['purchase_request', 'purchase_order', 'goods_receipt', 'vendor_invoice']) base = s.run('purchase', { docType, document: s.doc(s.vendor, [s.line()], base) });
  assert.equal(s.state.warehouseStock[0].quantity, 10); assert.equal(s.state.vendors[0].balance, 115);
  const count = s.state.purchaseOrders.length;
  assert.throws(() => s.run('purchase', { docType: 'vendor_invoice', document: s.doc(s.vendor, [s.line()], s.state.purchaseOrders[2].id) }), /ya fue copiado/);
  assert.equal(s.state.purchaseOrders.length, count);
  base = '';
  for (const docType of ['quotation', 'order', 'delivery', 'invoice']) base = s.run('sales', { docType, document: s.doc(s.customer, [s.line(2, 20)], base) });
  assert.equal(s.state.warehouseStock[0].quantity, 8); assert.equal(s.state.customers[0].balance, 46);
  assert.equal(s.state.profile.xpHistory.filter(e => e.key === 'sales-cycle').length, 1);
  assert.equal(s.state.profile.xpHistory.filter(e => e.key === 'purchase-cycle').length, 1);
  s.run('bank', { bankAccountId: 'BAN-1', date: '2026-10-04', type: 'deposit', amount: 46, counterpartAccount: '1.1.03', reference: '', documentId: base });
  assert.equal(s.state.customers[0].balance, 0); assert.equal(s.state.bankAccounts[0].balance, 46);
  assert.throws(() => s.run('bank', { bankAccountId: 'BAN-1', date: '2026-10-04', type: 'deposit', amount: 1, counterpartAccount: '1.1.03', reference: '', documentId: base }));
  const balance = financialSummary(trialBalance(s.state.chartOfAccounts, s.state.journalEntries, '2026-01-01', '2026-12-31'));
  assert.equal(balance.difference, 0);
});
test('failed stock transaction does not mutate original state', () => {
  const s = sandbox(); const before = JSON.stringify(s.state);
  assert.throws(() => s.run('sales', { docType: 'delivery', document: s.doc(s.customer, [s.line(1)]) }), /Stock disponible/);
  assert.equal(JSON.stringify(s.state), before);
});
test('credit note restores exact cost and can only be created once', () => {
  const s = sandbox(); s.run('purchase', { docType: 'vendor_invoice', document: s.doc(s.vendor, [s.line()]) });
  const invoice = s.run('sales', { docType: 'invoice', document: s.doc(s.customer, [s.line(2, 20)]) });
  s.run('sales', { docType: 'credit_note', document: s.doc(s.customer, [s.line(2, 20)], invoice) });
  assert.equal(s.state.warehouseStock[0].quantity, 10); assert.equal(s.state.warehouseStock[0].value, 100); assert.equal(s.state.customers[0].balance, 0);
  assert.throws(() => s.run('sales', { docType: 'credit_note', document: s.doc(s.customer, [s.line(2, 20)], invoice) }));
});
test('FIFO costs and transfer conserve total inventory value', () => {
  const base = { id: 'i', createdAt: now, updatedAt: now, createdBy: 'u', itemCode: 'i', warehouseCode: 'w', quantity: 0, reserved: 0, averageCost: 0, value: 0, costingMethod: 'fifo', layers: [] };
  const a = moveStock(base, 5, 10, 'fifo', '2026-01-01').stock; const b = moveStock(a, 5, 20, 'fifo', '2026-01-02').stock; const c = moveStock(b, -7, 0, 'fifo', '2026-01-03');
  assert.equal(c.cost, 90); assert.equal(c.stock.value, 60); assert.equal(c.stock.quantity, 3);
  const s = sandbox(); s.run('purchase', { docType: 'vendor_invoice', document: s.doc(s.vendor, [s.line()]) });
  s.run('transfer', { from: 'PRINCIPAL', to: 'SECUNDARIO', date: '2026-10-04', lines: [{ itemCode: s.article, quantity: 3 }] });
  assert.equal(s.state.warehouseStock.reduce((sum, row) => sum + row.value, 0), 100);
  assert.equal(s.state.warehouseStock.reduce((sum, row) => sum + row.quantity, 0), 10);
});
test('manual journal rounding, opening balances and reversal are consistent', () => {
  const s = sandbox(); const lines = [{ accountCode: '1.1.01', debit: 100, credit: 0, description: '', costCenter: '' }, { accountCode: '3.01', debit: 0, credit: 100, description: '', costCenter: '' }];
  const id = s.run('journal', { date: '2026-01-01', dueDate: '2026-01-01', memo: 'Capital', reference: '', lines });
  const rows = trialBalance(s.state.chartOfAccounts, s.state.journalEntries, '2026-02-01', '2026-12-31'); assert.equal(rows.find(r => r.accountCode === '1.1.01').opening, 100);
  s.run('reverse', { entryId: id, date: '2026-02-01' }); assert.throws(() => s.run('reverse', { entryId: id, date: '2026-02-01' }));
  assert.equal(financialSummary(trialBalance(s.state.chartOfAccounts, s.state.journalEntries, '2026-01-01', '2026-12-31')).assets, 0);
});
test('payroll distinguishes accruals from cash and rejects duplicate employee/month', () => {
  const s = sandbox(); const employee = s.run('employee', { firstName: 'Ana', lastName: 'Demo', identification: '1700000000', position: 'Consultora', department: 'SAP', hireDate: '2024-01-01', contract: 'indefinite', schedule: 'full', baseSalary: 460, employerRate: 12.15, personalRate: 9.45, thirteenthMonthly: false, fourteenthMonthly: false, reserveMonthly: false, vacationDays: 15, active: true });
  const inputs = { employeeCode: employee, days: 30, extra50: 0, extra100: 0, commissions: 0, otherIncome: 0, advances: 0, otherDeductions: 0 };
  const line = payrollLine(s.state.employees[0], inputs, '2026-10', 460); assert.equal(line.income, 460); assert.equal(line.personalIESS, 43.47); assert.equal(line.net, 416.53); assert.equal(line.thirteenthProvision, 38.33); assert.equal(line.reserveProvision, 38.33);
  const data = { period: '2026-10', date: '2026-10-30', sbu: 460, lines: [inputs] }; s.run('payroll', data); assert.throws(() => s.run('payroll', data), /ya liquidado/);
  assert.equal(s.state.journalEntries.at(-1).totalDebit, s.state.journalEntries.at(-1).totalCredit);
});
test('production reserves, consumes and receives atomically; no duplicate close', () => {
  const s = sandbox(); s.run('purchase', { docType: 'vendor_invoice', document: s.doc(s.vendor, [s.line()]) }); const parent = s.run('item', { ...item, name: 'Producto terminado' });
  const bom = s.run('bom', { parentItemCode: parent, type: 'production', components: [{ itemCode: s.article, quantity: 2, unit: 'UND', cost: 10 }] });
  const order = s.run('production', { bomCode: bom, quantity: 2, warehouseCode: 'PRINCIPAL', date: '2026-10-04', dueDate: '2026-10-10' });
  s.run('productionStatus', { id: order, status: 'released' }); assert.equal(s.state.warehouseStock.find(r => r.itemCode === s.article).reserved, 4);
  assert.throws(() => s.run('stock', { itemCode: s.article, warehouseCode: 'PRINCIPAL', qty: -8, costingMethod: 'average' }));
  s.run('productionStatus', { id: order, status: 'in_progress' }); s.run('productionStatus', { id: order, status: 'closed' });
  assert.equal(s.state.warehouseStock.find(r => r.itemCode === s.article).quantity, 6); assert.equal(s.state.warehouseStock.find(r => r.itemCode === parent).quantity, 2); assert.equal(s.state.productionOrders[0].actualCost, 40);
  assert.throws(() => s.run('productionStatus', { id: order, status: 'closed' }));
});
test('SRI key is 49 digits including independent modulo-11 check; authorization delayed', () => {
  const key = sriAccessKey('2026-10-04', '01', '1790000000001', '001-001', 1, '00000001'); assert.match(key, /^\d{49}$/);
  const sum = [...key.slice(0, 48)].reverse().reduce((s, digit, i) => s + Number(digit) * (2 + i % 6), 0); let check = 11 - sum % 11; check = check === 11 ? 0 : check === 10 ? 1 : check; assert.equal(Number(key.at(-1)), check);
  const s = sandbox(); s.run('purchase', { docType: 'vendor_invoice', document: s.doc(s.vendor, [s.line()]) }); const invoice = s.run('sales', { docType: 'invoice', document: s.doc(s.customer, [s.line(1, 20)]) }); const id = s.run('sri', { docType: '01', date: '2026-10-04', partnerCode: s.customer, sourceDocumentId: invoice, series: '001-001', retentionLines: [], ats: defaultATS() });
  assert.throws(() => s.run('authorize', { id }), /dos segundos/); s.run('authorize', { id }, '2026-10-04T12:00:03.000Z'); assert.equal(s.state.sriDocuments[0].status, 'AUTORIZADO');
});
test('MRP subtracts open procurement; repeated generation cannot duplicate shortage', () => {
  const s = sandbox(); s.run('sales', { docType: 'order', document: s.doc(s.customer, [s.line(5, 20)]) }); assert.equal(mrp(s.state)[0].shortage, 5);
  s.run('mrp', { vendorCode: s.vendor, date: '2026-10-04' }); assert.equal(mrp(s.state)[0].shortage, 0); assert.throws(() => s.run('mrp', { vendorCode: s.vendor, date: '2026-10-04' }));
});
test('mixed IVA and discount use line rounding', () => { assert.deepEqual(totals([{ quantity: 3, price: 0.1, discount: 10, taxRate: 15 }, { quantity: 2, price: 10, discount: 0, taxRate: 0 }]), { subtotal: 20.27, tax: 0.04, total: 20.31 }); });


test('debit notes leave invoices payable and paid sales credit notes can be refunded', () => {
  const s = sandbox();
  s.run('bank', { bankAccountId: 'BAN-1', date: '2026-10-04', type: 'deposit', amount: 1000, counterpartAccount: '3.01', reference: 'Capital', documentId: '' });
  const purchase = s.run('purchase', { docType: 'vendor_invoice', document: s.doc(s.vendor, [s.line()]) });
  const debit = s.run('purchase', { docType: 'debit_note', document: s.doc(s.vendor, [s.line(1, 5)], purchase) });
  for (const [documentId, amount] of [[purchase, 115], [debit, 5.75]]) s.run('bank', { bankAccountId: 'BAN-1', date: '2026-10-04', type: 'payment', amount, counterpartAccount: '2.1.01', reference: '', documentId });
  assert.equal(s.state.vendors[0].balance, 0);
  const invoice = s.run('sales', { docType: 'invoice', document: s.doc(s.customer, [s.line(1, 20)]) });
  s.run('bank', { bankAccountId: 'BAN-1', date: '2026-10-04', type: 'deposit', amount: 23, counterpartAccount: '1.1.03', reference: '', documentId: invoice });
  const credit = s.run('sales', { docType: 'credit_note', document: s.doc(s.customer, [s.line(1, 20)], invoice) });
  assert.equal(s.state.customers[0].balance, -23);
  s.run('bank', { bankAccountId: 'BAN-1', date: '2026-10-04', type: 'payment', amount: 23, counterpartAccount: '1.1.03', reference: '', documentId: credit });
  assert.equal(s.state.customers[0].balance, 0);
  assert.equal(s.state.salesOrders.find(d => d.id === credit).status, 'closed');
  assert.throws(() => s.run('bank', { bankAccountId: 'BAN-1', date: '2026-10-04', type: 'payment', amount: 23, counterpartAccount: '1.1.03', reference: '', documentId: credit }));
});

test('six SRI structures link compatible source, escape text and reject duplicates', () => {
  const { buildSRIXml } = require('../src/lib/sri-xml.ts');
  const s = sandbox();
  const purchase = s.run('purchase', { docType: 'vendor_invoice', document: s.doc(s.vendor, [s.line()]) });
  const debit = s.run('purchase', { docType: 'debit_note', document: s.doc(s.vendor, [s.line(1, 5)], purchase) });
  const delivery = s.run('sales', { docType: 'delivery', document: s.doc(s.customer, [s.line(1, 20)]) });
  const invoice = s.run('sales', { docType: 'invoice', document: s.doc(s.customer, [s.line(1, 20)], delivery) });
  const credit = s.run('sales', { docType: 'credit_note', document: s.doc(s.customer, [s.line(1, 20)], invoice) });
  const structures = [['01', invoice, s.customer, 'infoFactura'], ['03', purchase, s.vendor, 'infoLiquidacionCompra'], ['04', credit, s.customer, 'infoNotaCredito'], ['05', debit, s.vendor, 'infoNotaDebito'], ['06', delivery, s.customer, 'destinatarios'], ['07', purchase, s.vendor, 'docsSustento']];
  for (const [docType, sourceDocumentId, partnerCode, expected] of structures) {
    const data = { docType, sourceDocumentId, partnerCode, date: '2026-10-04', series: '001-001', ats: defaultATS(), retentionLines: docType === '07' ? [{ code: 'IR-BIENES', tax: 'IR', base: 100, rate: 1 }] : [], details: { supportNumber: '001-001-000000007', supportDate: '2026-10-04', reason: 'Devolución & ajuste <demo>', carrierName: 'Transportista Demo', carrierId: '1700000000', plate: 'ABC-0001', departureAddress: 'Quito', destinationAddress: 'Guayaquil', transportStart: '2026-10-04', transportEnd: '2026-10-05' } };
    const id = s.run('sri', data); const document = s.state.sriDocuments.find(d => d.id === id);
    assert.ok(document.xml.includes('<' + expected + '>'));
    assert.ok(document.xml.includes('<dirMatriz>'));
    assert.ok(!document.xml.includes('<demo>'));
    assert.throws(() => s.run('sri', data), /ya tiene/);
    if (process.env.SAP_XML_OUTPUT) { const fs = require('node:fs'); const path = require('node:path'); fs.mkdirSync(process.env.SAP_XML_OUTPUT, { recursive: true }); fs.writeFileSync(path.join(process.env.SAP_XML_OUTPUT, docType + '.xml'), document.xml); }
  }
  const invalid = commandSchema.parse({ action: 'sri', data: { docType: '01', sourceDocumentId: purchase, partnerCode: s.vendor, date: '2026-10-04', series: '001-001', ats: defaultATS(), retentionLines: [] } });
  assert.throws(() => buildSRIXml(s.state, invalid.data, '0'.repeat(49), 1), /compatible/);
});

test('teacher summary uses Ecuador dates and access updates without XP farming', () => {
  const { companySummary } = require('../src/lib/company-summary.ts'); const s = sandbox();
  s.run('sales', { docType: 'quotation', document: s.doc(s.customer, [s.line(1, 20)]) }, '2026-10-05T02:00:00.000Z');
  const xp = s.state.profile.xp; s.run('access', {}, '2026-10-05T03:00:00.000Z');
  assert.equal(s.state.profile.lastAccess, '2026-10-05T03:00:00.000Z'); assert.equal(s.state.profile.xp, xp);
  assert.equal(companySummary(s.state, '2026-10-04').documentsToday, 1);
  assert.equal(companySummary(s.state, '2026-10-05').documentsToday, 0);
  assert.equal(companySummary(s.state, '2026-10-04').pendingAlerts, 1);
});


test('FIFO transfer preserves the source cost layers at the destination', () => {
  const s = sandbox(); const fifo = s.run('item', { ...item, name: 'FIFO', costingMethod: 'fifo' });
  const line = (price) => ({ ...s.line(5, price), itemCode: fifo });
  s.run('purchase', { docType: 'vendor_invoice', document: s.doc(s.vendor, [line(10)]) });
  s.run('purchase', { docType: 'vendor_invoice', document: s.doc(s.vendor, [line(20)]) });
  s.run('transfer', { from: 'PRINCIPAL', to: 'SECUNDARIO', date: '2026-10-04', lines: [{ itemCode: fifo, quantity: 7 }] });
  const stock = s.state.warehouseStock.find(r => r.itemCode === fifo && r.warehouseCode === 'SECUNDARIO');
  assert.deepEqual(stock.layers.map(l => [l.quantity,l.cost]), [[5,10],[2,20]]);
  s.run('sales', { docType: 'delivery', document: s.doc(s.customer, [{ ...line(30), quantity: 3, warehouseCode: 'SECUNDARIO' }]) });
  assert.equal(s.state.stockMovements.at(-1).value, -30);
  assert.equal(s.state.warehouseStock.filter(r => r.itemCode === fifo).reduce((sum,r) => sum+r.value,0),120);
});

test('multi-level production credits finished component inventory correctly', () => {
  const s=sandbox(); s.run('purchase',{docType:'vendor_invoice',document:s.doc(s.vendor,[s.line()])});
  const intermediate=s.run('item',{...item,name:'Intermedio'}); const final=s.run('item',{...item,name:'Final'});
  const first=s.run('bom',{parentItemCode:intermediate,type:'production',components:[{itemCode:s.article,quantity:2,unit:'UND',cost:10}]});
  const second=s.run('bom',{parentItemCode:final,type:'production',components:[{itemCode:intermediate,quantity:1,unit:'UND',cost:20}]});
  for(const bomCode of [first,second]) { const id=s.run('production',{bomCode,quantity:1,warehouseCode:'PRINCIPAL',date:'2026-10-04',dueDate:'2026-10-04'}); for(const status of ['released','in_progress','closed']) s.run('productionStatus',{id,status}); }
  const last=s.state.journalEntries.at(-1);
  assert.ok(last.lines.some(l=>l.accountCode==='1.1.07'&&l.credit===20));
  assert.ok(!last.lines.some(l=>l.accountCode==='1.1.05'));
  assert.equal(last.totalDebit,last.totalCredit);
});
