import type { AccountingAccount, CompanyState, DocumentLine, JournalEntry, PayrollEmployee, PayrollInputLine, PayrollLine, TrialBalanceRow, WarehouseStock, CostingMethod } from './firestore-types';

export const round = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;
export const quantityRound = (value: number): number => Math.round(value * 1e6) / 1e6;
export const today = (): string => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Guayaquil' });
export const usd = (value: number): string => new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(value);
export function totals(lines: DocumentLine[]) {
  let subtotal = 0; let tax = 0;
  for (const line of lines) { const net = round(line.quantity * line.price * (1 - line.discount / 100)); subtotal += net; tax += round(net * line.taxRate / 100); }
  return { subtotal: round(subtotal), tax: round(tax), total: round(subtotal + tax) };
}
export function trialBalance(accounts: AccountingAccount[], entries: JournalEntry[], from: string, to: string): TrialBalanceRow[] {
  return accounts.filter(a => a.postable).map(account => {
    let opening = 0; let debit = 0; let credit = 0;
    for (const entry of entries.filter(e => e.date <= to)) for (const line of entry.lines.filter(l => l.accountCode === account.code)) {
      if (entry.date < from) opening += line.debit - line.credit;
      else { debit += line.debit; credit += line.credit; }
    }
    return { accountCode: account.code, name: account.name, category: account.category, nature: account.nature, opening: round(opening), debit: round(debit), credit: round(credit), closing: round(opening + debit - credit) };
  });
}
export function financialSummary(rows: TrialBalanceRow[], incomeTaxRate = 25) {
  const sum = (category: AccountingAccount['category']) => round(rows.filter(r => r.category === category).reduce((s, r) => s + r.closing, 0));
  const assets = sum('asset'); const liabilities = -sum('liability'); const equity = -sum('equity');
  const revenue = -sum('income'); const cost = sum('cost'); const expenses = sum('expense');
  const profit = round(revenue - cost - expenses); const tax = round(Math.max(0, profit) * incomeTaxRate / 100);
  return { assets, liabilities, equity, revenue, cost, expenses, grossProfit: round(revenue - cost), profit, tax, net: round(profit - tax), difference: round(assets - liabilities - equity - profit) };
}
export function moveStock(stock: WarehouseStock, qty: number, unitCost: number, method: CostingMethod, date: string): { stock: WarehouseStock; cost: number } {
  if (!Number.isFinite(qty) || qty === 0 || !Number.isFinite(unitCost) || unitCost < 0) throw new Error('Movimiento inválido.');
  if (stock.quantity > 0 && method !== stock.costingMethod) throw new Error('No se puede cambiar el método con existencias.');
  if (stock.quantity + qty < stock.reserved - 0.000001) throw new Error(`Stock disponible insuficiente: ${stock.itemCode}.`);
  const layers = stock.layers.map(l => ({ ...l }));
  let cost = 0;
  if (qty > 0) {
    cost = round(qty * unitCost); layers.push({ quantity: qty, cost: unitCost, date });
  } else {
    let remaining = -qty;
    while (remaining > 0.000001 && layers.length) {
      const layer = layers[0]; const used = Math.min(layer.quantity, remaining);
      if (method === 'fifo') cost += used * layer.cost;
      layer.quantity = quantityRound(layer.quantity - used); remaining = quantityRound(remaining - used);
      if (layer.quantity <= 0.000001) layers.shift();
    }
    if (method !== 'fifo') cost = -qty * (method === 'standard' ? unitCost : stock.averageCost);
    cost = round(cost);
  }
  const quantity = quantityRound(stock.quantity + qty);
  if (qty < 0 && quantity === 0) cost = stock.value;
  const value = quantity === 0 ? 0 : round(stock.value + (qty > 0 ? cost : -cost));
  return { stock: { ...stock, quantity, value, averageCost: quantity ? value / quantity : 0, costingMethod: method, layers }, cost };
}
export function payrollLine(employee: PayrollEmployee, input: PayrollInputLine, period: string, sbu: number): PayrollLine {
  const salary = round(employee.baseSalary * input.days / 30);
  const overtime50 = round(employee.baseSalary / 240 * 1.5 * input.extra50);
  const overtime100 = round(employee.baseSalary / 240 * 2 * input.extra100);
  const contributory = round(salary + overtime50 + overtime100 + input.commissions + input.otherIncome);
  const thirteenth = round(contributory / 12); const fourteenth = round(sbu / 12 * input.days / 30);
  const end = new Date(`${period}-01T00:00:00Z`); end.setUTCMonth(end.getUTCMonth() + 1); end.setUTCDate(0);
  const anniversary = new Date(`${employee.hireDate}T00:00:00Z`); anniversary.setUTCFullYear(anniversary.getUTCFullYear() + 1);
  const reserves = end >= anniversary ? round(contributory / 12) : 0;
  const personalIESS = round(contributory * employee.personalRate / 100); const employerIESS = round(contributory * employee.employerRate / 100);
  const income = round(contributory + (employee.thirteenthMonthly ? thirteenth : 0) + (employee.fourteenthMonthly ? fourteenth : 0) + (employee.reserveMonthly ? reserves : 0));
  const deductions = round(personalIESS + input.advances + input.otherDeductions);
  if (deductions > income) throw new Error(`Descuentos mayores al ingreso: ${employee.firstName}.`);
  return { ...input, employeeName: `${employee.firstName} ${employee.lastName}`, salary, overtime50, overtime100, contributory, thirteenth: employee.thirteenthMonthly ? thirteenth : 0, fourteenth: employee.fourteenthMonthly ? fourteenth : 0, reserves: employee.reserveMonthly ? reserves : 0, thirteenthProvision: employee.thirteenthMonthly ? 0 : thirteenth, fourteenthProvision: employee.fourteenthMonthly ? 0 : fourteenth, reserveProvision: employee.reserveMonthly ? 0 : reserves, vacationProvision: round(contributory * employee.vacationDays / 360), personalIESS, employerIESS, income, deductions, net: round(income - deductions) };
}
export function sriAccessKey(date: string, type: string, ruc: string, series: string, sequence: number, numericCode: string): string {
  const [year, month, day] = date.split('-');
  const base = `${day}${month}${year}${type}${ruc}1${series.replace('-', '')}${String(sequence).padStart(9, '0')}${numericCode}1`;
  if (!/^\d{48}$/.test(base)) throw new Error('La clave debe contener 48 dígitos antes del verificador.');
  let sum = 0; let factor = 2;
  for (let i = base.length - 1; i >= 0; i--) { sum += Number(base[i]) * factor; factor = factor === 7 ? 2 : factor + 1; }
  const check = 11 - sum % 11;
  return base + (check === 11 ? 0 : check === 10 ? 1 : check);
}
export const xmlEscape = (value: string): string => value.replace(/[<>&"']/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char] ?? char);
export function mrp(state: CompanyState) {
  const needs = new Map<string, number>();
  const allocated = new Map<string, number>();
  function expand(itemCode: string, quantity: number, visited: Set<string>) {
    if (visited.has(itemCode)) throw new Error('BOM circular.');
    const bom = state.boms.find(b => b.parentItemCode === itemCode && b.type === 'production');
    if (!bom) { needs.set(itemCode, (needs.get(itemCode) ?? 0) + quantity); return; }
    const available = state.warehouseStock.filter(s => s.itemCode === itemCode).reduce((sum, row) => sum + row.quantity - row.reserved, 0);
    const incoming = state.productionOrders.filter(o => o.parentItemCode === itemCode && o.status !== 'closed').reduce((sum, row) => sum + row.quantity, 0);
    const coverage = Math.max(0, available + incoming - (allocated.get(itemCode) ?? 0));
    const used = Math.min(quantity, coverage); allocated.set(itemCode, (allocated.get(itemCode) ?? 0) + used);
    const net = quantityRound(quantity - used);
    if (!net) return;
    const next = new Set(visited).add(itemCode);
    bom.components.forEach(c => expand(c.itemCode, c.quantity * net, next));
  }
  state.salesOrders.filter(d => d.docType === 'order' && d.status === 'open').forEach(d => d.lines.forEach(l => expand(l.itemCode, l.quantity, new Set())));
  return [...needs].map(([itemCode, required]) => {
    const available = state.warehouseStock.filter(s => s.itemCode === itemCode).reduce((s, row) => s + row.quantity - row.reserved, 0);
    const onOrder = state.purchaseOrders.filter(d => d.status === 'open' && ['purchase_request', 'purchase_order'].includes(d.docType)).flatMap(d => d.lines).filter(l => l.itemCode === itemCode).reduce((sum, l) => sum + l.quantity, 0);
    return { itemCode, required: quantityRound(required), available: quantityRound(available), onOrder: quantityRound(onOrder), shortage: quantityRound(Math.max(0, required - available - onOrder)) };
  });
}
