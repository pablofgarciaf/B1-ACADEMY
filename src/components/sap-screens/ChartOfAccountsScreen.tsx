'use client';
import { useCompany } from '@/hooks/useCompany';
import { trialBalance, usd } from '@/lib/company-calculations';
import { Screen } from './SAPControls';
export default function ChartOfAccountsScreen() {
  const c = useCompany(); const rows = trialBalance(c.data.chartOfAccounts, c.data.journalEntries, '0000-00-00', '9999-12-31');
  const branch = (parent: string) => c.data.chartOfAccounts.filter(a => a.parentCode === parent).map(a => {
    const balance = rows.filter(r => r.accountCode === a.code || r.accountCode.startsWith(a.code + '.')).reduce((s, r) => s + r.closing, 0);
    return a.postable ? <p key={a.id} className="border-b border-[#D4D0C8] p-2">{a.code} · {a.name} · {a.nature} · {a.category} · {usd(balance)}</p> : <details key={a.id} open className="ml-3 border-l border-[#999] pl-2"><summary className="cursor-pointer bg-[#D4D0C8] p-2 font-bold">{a.code} · {a.name} · {usd(balance)}</summary>{branch(a.code)}</details>;
  });
  return <Screen title="Plan de cuentas educativo Ecuador · NEC / NIIF">{branch('')}<p>Saldo con signo contable: debe positivo, haber negativo.</p></Screen>;
}
