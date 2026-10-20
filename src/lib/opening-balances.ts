import type { CompanyState, Entity, FixedAsset, PurchaseDocument, SalesDocument } from './firestore-types';
import { collectionNames } from './firestore-types';
import { openingBalancesSchema, openingControlMaps, type OpeningBalancesInput } from './opening-balances-schema';
import { quantityRound, round } from './company-calculations';
import { isPrivateCompany } from './company-scope';

const check = (valid: unknown, message: string): void => { if (!valid) throw new Error(message); };
const unique = (values: string[], label: string) => check(new Set(values).size === values.length, `${label}: registro duplicado.`);
const sum = (values: number[]) => round(values.reduce((a, b) => a + b, 0));

/** Shared, side-effect-free preview/commit. The existing server transaction persists all collections together. */
export function prepareOpeningBalances(original: CompanyState, input: OpeningBalancesInput, uid: string, now: string) {
  const data = openingBalancesSchema.parse(input);
  check(isPrivateCompany(uid) && original.profile?.usage === 'private', 'La apertura solo corresponde a la empresa privada del propietario.');
  check(!original.profile?.openingBalances, 'Los saldos iniciales ya fueron importados. No se puede importar dos veces.');
  const allowed = new Set(['chartOfAccounts', 'customers', 'vendors', 'items', 'bankAccounts']);
  check(collectionNames.every(k => allowed.has(k) || original[k].length === 0), 'La empresa ya tiene operaciones. Importa la apertura antes de registrar movimientos.');
  check(original.customers.every(r => r.balance === 0) && original.vendors.every(r => r.balance === 0) && original.bankAccounts.every(r => r.balance === 0 && r.openingBalance === 0), 'Existen saldos auxiliares previos.');
  check(!original.profile?.closedPeriods?.includes(data.date.slice(0, 7)) && !original.profile?.closedFiscalYears?.includes(data.date.slice(0, 4)), 'El período de apertura está cerrado.');
  const state = structuredClone(original);
  const profile = state.profile!;
  const map = openingControlMaps[data.accountFamily];
  const journalId = `AP-${data.reference}`;
  const meta = (id: string): Entity => ({ id, createdAt: now, updatedAt: now, createdBy: uid });
  unique(data.balances.map(r => r.accountCode), 'Mayor');
  unique(data.receivables.map(r => `${r.cardCode}|${r.documentNumber}`), 'Clientes');
  unique(data.payables.map(r => `${r.cardCode}|${r.documentNumber}`), 'Proveedores');
  unique(data.inventory.map(r => `${r.itemCode}|${r.warehouseCode}`), 'Inventario');
  unique(data.banks.map(r => r.bankAccountId), 'Banco');
  unique(data.banks.map(r => r.ledgerAccount), 'Cuenta contable bancaria');
  unique(data.assets.map(r => r.assetCode), 'Activos');
  for (const row of data.balances) {
    const account = state.chartOfAccounts.find(a => a.code === row.accountCode && a.postable && a.active);
    check(account && ['asset','liability','equity'].includes(account.category), `Cuenta de balance activa e imputable requerida: ${row.accountCode}.`);
    check((row.debit > 0) !== (row.credit > 0), `Indica debe o haber, no ambos ni cero: ${row.accountCode}.`);
  }
  const debit = sum(data.balances.map(r => r.debit));
  const credit = sum(data.balances.map(r => r.credit));
  check(debit > 0 && debit === credit, `La apertura no cuadra: debe ${debit.toFixed(2)}, haber ${credit.toFixed(2)}. Corrige el mayor; no se genera una contrapartida automática.`);
  const ledger = (account: string) => sum(data.balances.filter(r => r.accountCode === account).map(r => r.debit - r.credit));
  const matches = (label: string, auxiliary: number, account: string) => check(round(auxiliary) === ledger(account), `${label}: auxiliar ${round(auxiliary).toFixed(2)} no coincide con mayor ${ledger(account).toFixed(2)} en ${account}.`);
  // Do not accept parallel balances in a different control account without an auxiliary mapping.
  const control = new Set<string>(Object.values(map));
  const controlPrefixes = ['1.1.03','1.1.04','1.1.05','1.1.07','1.2.01','1.2.02','2.1.01','1010205','1010206','1010209','10103','10201','20103'];
  for (const row of data.balances) if (controlPrefixes.some(p => row.accountCode.startsWith(p))) check(control.has(row.accountCode), `Cuenta de control sin auxiliar configurado: ${row.accountCode}. Usa las cuentas indicadas en la plantilla.`);
  matches('Clientes', sum(data.receivables.map(r => r.amount)), map['1.1.03']);
  matches('Proveedores', -sum(data.payables.map(r => r.amount)), map['2.1.01']);
  const pending = (rows: OpeningBalancesInput['receivables'], sales: boolean) => rows.forEach((row, index) => {
    check(row.date <= data.date, 'El documento pendiente no puede ser posterior al corte.');
    const partner = (sales ? state.customers : state.vendors).find(p => p.cardCode === row.cardCode && p.active);
    check(partner && (!sales || !('kind' in partner) || partner.kind === 'customer'), `Socio activo inexistente: ${row.cardCode}. Regístralo antes de importar.`);
    const id = `${journalId}-${sales ? 'C' : 'P'}-${index + 1}`;
    const common = { ...meta(id), openingBalance: true, docNumber: row.documentNumber, ownerCode: '', date: row.date, dueDate: row.dueDate, cardCode: row.cardCode, cardName: partner!.name, currency: 'USD' as const, reference: data.reference, comments: 'Saldo pendiente al corte de apertura. No reconstruye líneas ni impuestos del documento histórico.', baseDocumentId: '', status: 'open' as const, lines: [], subtotal: row.amount, tax: 0, total: row.amount, paidAmount: 0, journalEntryId: journalId };
    if (sales) state.salesOrders.push({ ...common, docType: 'invoice' } as SalesDocument);
    else state.purchaseOrders.push({ ...common, docType: 'vendor_invoice' } as PurchaseDocument);
    partner!.balance = round(partner!.balance + row.amount); partner!.updatedAt = now;
  });
  pending(data.receivables, true); pending(data.payables, false);
  let inventory = 0; const finished = 0;
  for (const row of data.inventory) {
    const item = state.items.find(i => i.itemCode === row.itemCode && i.active && i.type === 'inventory');
    check(item, `Artículo inventariable inexistente: ${row.itemCode}. Regístralo antes de importar.`);
    check(profile.warehouses.some(w => w.code === row.warehouseCode), `Almacén inexistente: ${row.warehouseCode}.`);
    check(row.quantity === quantityRound(row.quantity), 'Usa hasta seis decimales en las cantidades.');
    const layers = (row.layers ?? [{ quantity: row.quantity, unitCost: row.unitCost, date: data.date }]).map(l => ({ quantity: l.quantity, cost: l.unitCost, date: l.date }));
    check(item!.costingMethod !== 'fifo' || row.layers !== undefined, 'Para FIFO aporta las capas originales de cantidades y costos, no un promedio.');
    check(layers.every(l => l.date <= data.date && l.quantity === quantityRound(l.quantity)), 'Capa de inventario con fecha o cantidad inválida.');
    check(quantityRound(layers.reduce((n,l) => n+l.quantity,0)) === row.quantity, 'Las capas deben sumar las unidades del inventario.');
    const value = round(row.quantity * row.unitCost);
    check(round(layers.reduce((n,l) => n+l.quantity*l.cost,0)) === value, 'El valor de las capas no coincide con el costo de apertura.');
    check(item!.costingMethod !== 'standard' || layers.every(l => l.cost === item!.standardCost) && row.unitCost === item!.standardCost, 'El costo estándar debe coincidir con el maestro del artículo.');
    const id = `${row.itemCode}__${row.warehouseCode}`;
    state.warehouseStock.push({ ...meta(id), itemCode: row.itemCode, warehouseCode: row.warehouseCode, quantity: row.quantity, reserved: 0, value, averageCost: value / row.quantity, costingMethod: item!.costingMethod, layers });
    state.stockMovements.push({ ...meta(`${journalId}-MOV-${state.stockMovements.length+1}`), itemCode: row.itemCode, warehouseCode: row.warehouseCode, date: data.date, quantity: row.quantity, unitCost: row.unitCost, value, balance: row.quantity, reference: journalId });
    // No BOMs exist in a new company; opening inventory starts as merchandise/raw materials.
    inventory = round(inventory + value);
  }
  matches('Inventario', inventory, map['1.1.05']); matches('Productos terminados', finished, map['1.1.07']);
  const banking = new Set(data.banks.map(r => r.ledgerAccount));
  for (const row of data.banks) {
    const bank = state.bankAccounts.find(b => b.id === row.bankAccountId && b.active);
    const account = state.chartOfAccounts.find(a => a.code === row.ledgerAccount && a.active && a.postable && a.category === 'asset');
    check(bank && account, 'Cuenta bancaria o cuenta contable inexistente. Registra el banco antes de importar.');
    check(row.ledgerAccount.startsWith('1.1.02.') || ['1010103','1010104','1010105','1010106'].includes(row.ledgerAccount), 'Usa una cuenta contable bancaria individual de la plantilla.');
    matches(bank!.name, row.balance, row.ledgerAccount);
    Object.assign(bank!, { ledgerAccount: row.ledgerAccount, openingBalance: row.balance, balance: row.balance, updatedAt: now });
  }
  for (const row of data.balances) if (row.accountCode === '1.1.02' || row.accountCode.startsWith('1.1.02.') || ['1010103','1010104','1010105','1010106'].includes(row.accountCode)) check(banking.has(row.accountCode), `Banco sin detalle auxiliar: ${row.accountCode}.`);
  for (const row of data.assets) {
    check(row.acquisitionDate <= data.date, 'La adquisición del activo no puede ser posterior al corte.');
    check(row.residualValue <= row.cost && row.accumulatedDepreciation <= round(row.cost - row.residualValue), 'Depreciación o valor residual mayor que el valor depreciable del activo.');
    const periods: string[] = [];
    let month = row.acquisitionDate.slice(0,7);
    while (month <= data.date.slice(0,7)) { periods.push(month); const y = Number(month.slice(0,4)), m = Number(month.slice(5)); month = m === 12 ? `${y+1}-01` : `${y}-${String(m+1).padStart(2,'0')}`; check(periods.length <= 2400, 'Antigüedad del activo fuera del límite admitido.'); }
    state.fixedAssets.push({ ...meta(row.assetCode), ...row, depreciatedPeriods: periods, status: row.accumulatedDepreciation === round(row.cost-row.residualValue) ? 'fully_depreciated' : 'active', journalEntryId: journalId } as FixedAsset);
  }
  matches('Costo de activos', sum(data.assets.map(r=>r.cost)), map['1.2.01']);
  matches('Depreciación acumulada', -sum(data.assets.map(r=>r.accumulatedDepreciation)), map['1.2.02']);
  state.journalEntries.push({ ...meta(journalId), entryNumber: journalId, date: data.date, dueDate: data.date, period: data.date.slice(0,7), reference: data.reference, memo: 'Importación de saldos iniciales con auxiliares', lines: data.balances.map(r=>({...r,description:'Saldo al corte de apertura',costCenter:''})), totalDebit: debit, totalCredit: credit, reversalOf:'', reversedBy:'', source:'opening' });
  profile.controlAccounts = { ...map };
  profile.openingBalances = { reference:data.reference, date:data.date, journalEntryId:journalId, importedAt:now, accountFamily:data.accountFamily };
  return { state, result:journalId, summary:{ date:data.date, debit, credit, customers:data.receivables.length, vendors:data.payables.length, inventory:data.inventory.length, banks:data.banks.length, assets:data.assets.length } };
}
