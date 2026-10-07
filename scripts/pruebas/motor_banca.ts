import { applyCommand } from '../../src/lib/company-engine';
import { emptyCompany } from '../../src/lib/firestore-types';
import { conciliar, detectarBanco, generarExtracto, leerExtracto } from '../../src/lib/banco-simulado';
let s = emptyCompany(); const t = '2026-10-07T10:00:00.000Z';
const run = (cmd: any) => { const r = applyCommand(s, cmd, 'u1', 'a@b.c', t); s = r.state; return r.result; };
run({ action: 'initialize', data: { companyName: 'B1 Center' } });
console.log('cuentas:', s.bankAccounts.map(a => `${a.id} ${a.name} ${a.accountNumber}`).join(' | '));
const CTA = s.chartOfAccounts.find(c => c.postable && c.code !== '1.1.02')!.code; console.log('contrapartida', CTA);
for (const a of s.bankAccounts) {
  run({ action: 'bank', data: { bankAccountId: a.id, type: 'deposit', amount: 1150, date: '2026-10-02', reference: 'DEP-1', counterpartAccount: CTA } });
  run({ action: 'bank', data: { bankAccountId: a.id, type: 'withdrawal', amount: 230.5, date: '2026-10-05', reference: 'PAG-1', counterpartAccount: CTA } });
  const banco = detectarBanco(a.bankName)!;
  const movs = s.bankTransactions.filter(m => m.bankAccountId === a.id);
  const { emparejados, sinPareja } = conciliar(leerExtracto(banco, generarExtracto(banco, movs, a.openingBalance)), movs);
  for (const { movimiento, linea } of emparejados) run({ action: 'reconcile', data: { id: movimiento.id, statementAmount: linea.monto, reconciled: true } });
  console.log(banco, 'conciliados', emparejados.length, 'sin pareja', sinPareja.map(l => `${l.referencia} ${l.monto}`).join(', '), 'reconciled en motor', s.bankTransactions.filter(m => m.bankAccountId === a.id && m.reconciled).length);
}
