const { test } = require('node:test');
const assert = require('node:assert/strict');
require('ts-node').register({ transpileOnly: true, compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' } });
const { emptyCompany } = require('../src/lib/firestore-types.ts');
const { applyCommand } = require('../src/lib/company-engine.ts');
const { auditChanges, auditHash, verifyAuditChain } = require('../src/lib/company-audit.ts');

test('la verificación detecta truncado, ausencia y alteración aunque las claves cambien de orden',()=>{
  const payload={companyId:'u1',actorUid:'u1',actorEmail:'student@example.test',requestId:'test',action:'initialize',result:'u1',occurredAt:'2026-10-16T12:00:00.000Z',changes:[{collection:'profile',id:'main',before:null,after:{name:'Prueba',amount:1}}],previousHash:'0'.repeat(64)};
  const event={...payload,hash:auditHash(payload),version:1};
  const reordered=Object.fromEntries(Object.entries(payload).reverse());reordered.changes=[{after:{amount:1,name:'Prueba'},before:null,id:'main',collection:'profile'}];
  assert.equal(auditHash(reordered),event.hash);
  const head={version:1,hash:event.hash};assert.equal(verifyAuditChain([{...reordered,hash:event.hash,version:1}],head,true).valid,true);
  assert.equal(verifyAuditChain([],head,true).valid,false);
  assert.equal(verifyAuditChain([event],{version:2,hash:'deleted-tail'},true).valid,false);
  assert.equal(verifyAuditChain([event],null,true).valid,false);
  assert.equal(verifyAuditChain([{...event,result:'altered'}],head,true).valid,false);
  assert.equal(verifyAuditChain([{...event,version:5}],{version:5,hash:event.hash},true).valid,false);
});

test('la evidencia registra creación, reversión, reapertura y conciliación con antes/después', () => {
  let state = emptyCompany();
  let previousHash = '0'.repeat(64);
  const events = [];
  let index = 0;
  function run(command) {
    const now = new Date(Date.UTC(2026, 9, 11, 12, index++)).toISOString();
    const before = state;
    const applied = applyCommand(state, command, 'alumno-1', 'alumno@example.test', now);
    state = applied.state;
    const event = { companyId: 'alumno-1__servicios', actorUid: 'alumno-1', actorEmail: 'alumno@example.test',
      requestId: `request-${index}`, action: command.action, result: applied.result, occurredAt: now,
      changes: auditChanges(before, state), previousHash };
    const hash = auditHash(event);
    assert.match(hash, /^[a-f0-9]{64}$/);
    previousHash = hash;
    events.push(event);
    return applied.result;
  }

  run({ action: 'initialize', data: { companyName: 'Servicios de prueba' } });
  assert.equal(events[0].changes.find(c => c.collection === 'profile').before, null);
  const entryId = run({ action: 'journal', data: { date: '2026-10-11', dueDate: '2026-10-11', memo: 'Aporte inicial', reference: 'AP-1',
    lines: [{ accountCode: '1.1.01', debit: 100, credit: 0, description: '', costCenter: '' },
      { accountCode: '3.01', debit: 0, credit: 100, description: '', costCenter: '' }] } });
  assert.ok(events[1].changes.some(c => c.collection === 'journalEntries' && c.id === entryId && c.before === null));
  run({ action: 'closePeriod', data: { period: '2026-10', closed: true } });
  run({ action: 'closePeriod', data: { period: '2026-10', closed: false } });
  const reopening = events[3].changes.find(c => c.collection === 'profile');
  assert.ok(reopening.before.closedPeriods.includes('2026-10'));
  assert.ok(!reopening.after.closedPeriods.includes('2026-10'));
  run({ action: 'reverse', data: { entryId, date: '2026-10-11' } });
  assert.ok(events[4].changes.some(c => c.collection === 'journalEntries' && c.id === entryId && c.before.reversedBy === '' && c.after.reversedBy));
  const transactionId = run({ action: 'bank', data: { bankAccountId: 'BAN-1', date: '2026-10-11', type: 'deposit', amount: 50,
    counterpartAccount: '3.01', reference: 'DEP-1', documentId: '', retentionIR: 0, retentionIVA: 0 } });
  run({ action: 'reconcile', data: { id: transactionId, statementAmount: 50, reconciled: true } });
  const reconciliation = events.at(-1).changes.find(c => c.collection === 'bankTransactions' && c.id === transactionId);
  assert.equal(reconciliation.before.reconciled, false);
  assert.equal(reconciliation.after.reconciled, true);
  assert.equal(events[1].previousHash, auditHash(events[0]));
  const tampered = { ...events[1], result: 'otro resultado' };
  assert.notEqual(auditHash(tampered), auditHash(events[1]));
  const removed = { ...state, customers: [{ id: 'C-1', createdAt: '', updatedAt: '', createdBy: '' }] };
  assert.deepEqual(auditChanges(removed, state).find(c => c.collection === 'customers'), {
    collection: 'customers', id: 'C-1', before: removed.customers[0], after: null,
  });
});
