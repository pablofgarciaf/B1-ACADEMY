import { buildSRIXml } from './sri-xml';
import { commandSchema, type CompanyCommand, type CommandData } from './company-commands';
import { mensajeValidacion } from './zod-es';
import type { CompanyState, Entity, AccountingAccount, JournalLine, DocumentLine, SalesDocument, PurchaseDocument, DocType, WarehouseStock, SRITaxDocument, InventoryCountLine, LandedCost } from './firestore-types';
import { enviarAlSRI, iceDeLinea, ISD_TARIFAS, opcionRetencion, revisarIdentificacion } from './sri-catalogo';
import { financialSummary, moveStock, resultadoEjercicio, mrp, payrollLine, quantityRound, round, sriAccessKey, totals, trialBalance } from './company-calculations';

export const documentLabels: Record<DocType, string> = { quotation: 'Cotización', order: 'Pedido de venta', delivery: 'Entrega', invoice: 'Factura de venta', credit_note: 'Nota de crédito', purchase_request: 'Solicitud de compra', purchase_order: 'Pedido de compra', goods_receipt: 'Entrada de mercancías', vendor_invoice: 'Factura de proveedor', debit_note: 'Nota de débito' };
const prefixes: Record<DocType, string> = { quotation: 'COT', order: 'PV', delivery: 'ENT', invoice: 'FAC', credit_note: 'NC', purchase_request: 'SC', purchase_order: 'PC', goods_receipt: 'EM', vendor_invoice: 'FP', debit_note: 'ND' };
const accountDefinitions: [string, string, AccountingAccount['category'], boolean][] = [
  ['1', 'ACTIVO', 'asset', false], ['1.1', 'Activo corriente', 'asset', false], ['1.1.01', 'Caja', 'asset', true], ['1.1.02', 'Bancos', 'asset', true], ['1.1.03', 'Cuentas por cobrar clientes', 'asset', true], ['1.1.04', 'Provisión cuentas incobrables', 'asset', true], ['1.1.05', 'Inventarios materia prima / mercaderías', 'asset', true], ['1.1.06', 'IVA en compras', 'asset', true], ['1.1.07', 'Inventarios producto terminado', 'asset', true], ['1.1.08', 'Anticipos al personal', 'asset', true], ['1.2', 'Activo no corriente', 'asset', false], ['1.2.01', 'Propiedad, planta y equipo', 'asset', true], ['1.2.02', 'Depreciación acumulada', 'asset', true],
  ['2', 'PASIVO', 'liability', false], ['2.1', 'Pasivo corriente', 'liability', false], ['2.1.01', 'Cuentas por pagar proveedores', 'liability', true], ['2.1.02', 'IVA en ventas', 'liability', true], ['2.1.03', 'Retenciones por pagar', 'liability', true], ['2.1.04', 'IESS por pagar', 'liability', true], ['2.1.05', 'Sueldos por pagar', 'liability', true], ['2.1.06', 'Mercadería recibida no facturada', 'liability', true], ['2.1.07', 'Beneficios sociales por pagar', 'liability', true], ['2.1.08', 'Otros descuentos por pagar', 'liability', true], ['2.2', 'Pasivo no corriente', 'liability', false], ['2.2.01', 'Préstamos largo plazo', 'liability', true],
  ['3', 'PATRIMONIO', 'equity', false], ['3.01', 'Capital social', 'equity', true], ['3.02', 'Resultados acumulados', 'equity', true], ['4', 'INGRESOS', 'income', false], ['4.01', 'Ventas operacionales', 'income', true], ['4.02', 'Otros ingresos', 'income', true], ['5', 'COSTOS', 'cost', false], ['5.01', 'Costo de ventas', 'cost', true], ['6', 'GASTOS', 'expense', false], ['6.01', 'Gasto de nómina', 'expense', true], ['6.02', 'IESS patronal', 'expense', true], ['6.03', 'Gastos administrativos', 'expense', true], ['6.04', 'Beneficios sociales', 'expense', true], ['6.05', 'Diferencias de inventario y costo estándar', 'expense', true],
  ['1.1.09', 'Anticipo de impuesto a la renta', 'asset', true], ['1.1.10', 'Crédito tributario: retenciones de renta recibidas', 'asset', true], ['1.1.11', 'Crédito tributario: retenciones de IVA recibidas', 'asset', true], ['1.1.12', 'ISD pagado (crédito tributario)', 'asset', true],
  ['2.1.09', 'Utilidades por pagar a trabajadores', 'liability', true], ['2.1.10', 'Impuesto a la renta por pagar', 'liability', true], ['2.1.11', 'ICE por pagar', 'liability', true],
  ['6.06', 'Participación de trabajadores en utilidades', 'expense', true], ['6.07', 'Impuesto a la renta', 'expense', true], ['6.08', 'Impuesto a la salida de divisas (ISD)', 'expense', true],
];
const assert = (condition: unknown, message: string): void => { if (!condition) throw new Error(message); };

/** Pure, server-authoritative reducer. Persistence commits its changes atomically. */
export function applyCommand(original: CompanyState, command: CompanyCommand, uid: string, email: string, now: string): { state: CompanyState; result: string } {
  const state = structuredClone(original);
  const meta = (id: string): Entity => ({ id, createdAt: now, updatedAt: now, createdBy: uid });
  if (command.action === 'initialize') {
    if (state.profile) { state.profile.lastAccess = now; return { state, result: uid }; }
    state.profile = { ...meta(uid), uid, email, companyName: command.data.companyName, ruc: '1790000001001', currency: 'USD', country: 'EC', fiscalScenario: 'ecuador-2026', sbu: 482, incomeTaxRate: 25, warehouses: [{ code: 'PRINCIPAL', name: 'Almacén principal' }, { code: 'SECUNDARIO', name: 'Almacén secundario' }], xp: 0, level: 1, xpHistory: [], completedModules: [], lastAccess: now, sequences: {}, documentCount: 0 };
    state.chartOfAccounts = accountDefinitions.map(([code, name, category, postable]) => ({ ...meta(code), code, name, category, postable, parentCode: code.includes('.') ? code.slice(0, code.lastIndexOf('.')) : '', nature: (['asset', 'cost', 'expense'].includes(category) && !['1.1.04', '1.2.02'].includes(code)) ? 'D' : 'H', active: true }));
    state.bankAccounts = ['Banco Pichincha', 'Banco del Pacífico', 'Banco Guayaquil', 'Produbanco'].map((bankName, i) => ({ ...meta(`BAN-${i + 1}`), name: `${bankName} · Cta. corriente`, bankName, accountNumber: `2100${String(i + 1).padStart(6, '0')}`, currency: 'USD', ledgerAccount: '1.1.02', openingBalance: 0, balance: 0, active: true }));
    return { state, result: uid };
  }
  const profile = state.profile;
  if (!profile) throw new Error('Inicializa primero tu empresa.');
  const next = (prefix: string, date = now.slice(0, 10)): string => {
    const key = `${prefix}-${date.slice(0, 4)}`; const seq = (profile.sequences[key] ?? 0) + 1;
    profile.sequences[key] = seq; return `${key}-${String(seq).padStart(4, '0')}`;
  };
  /** Códigos al estilo SAP que enseñan las clases: clientes C20000+, proveedores V10000+, artículos A00001+. */
  const nextEmp = (): string => { const seq = (profile.sequences['COD-E'] ?? 0) + 1; profile.sequences['COD-E'] = seq; return `E${String(seq).padStart(3, '0')}`; };
  const nextSap = (prefix: 'C' | 'V' | 'A'): string => {
    const key = `COD-${prefix}`; const seq = (profile.sequences[key] ?? 0) + 1; profile.sequences[key] = seq;
    return prefix === 'C' ? `C${20000 + seq - 1}` : prefix === 'V' ? `V${10000 + seq - 1}` : `A${String(seq).padStart(5, '0')}`;
  };
  // Empresas creadas antes de una versión nueva reciben las cuentas que les faltan (sin tocar las que ya tienen).
  for (const [codigo, nombre, categoria, imputable] of accountDefinitions) {
    if (!state.chartOfAccounts.some(a => a.code === codigo)) state.chartOfAccounts.push({ ...meta(codigo), code: codigo, name: nombre, category: categoria, postable: imputable, parentCode: codigo.includes('.') ? codigo.slice(0, codigo.lastIndexOf('.')) : '', nature: (['asset', 'cost', 'expense'].includes(categoria) && !['1.1.04', '1.2.02'].includes(codigo)) ? 'D' : 'H', active: true });
  }
  /** Saldo (debe − haber) de una cuenta hasta una fecha. */
  const saldoDeudor = (cuenta: string, hasta: string): number => round(state.journalEntries.filter(e => e.date <= hasta).flatMap(e => e.lines).filter(l => l.accountCode === cuenta).reduce((s, l) => s + l.debit - l.credit, 0));
  /** Resultado del ejercicio antes de participación de trabajadores e impuesto a la renta (ingresos − costos − gastos). */
  const resultadoAntesDeImpuestos = (year: number): number => resultadoEjercicio(state, year);
  const award = (key: string, points: number, reference: string, label = key): void => {
    if (!profile.xpHistory.some(e => e.key === key)) { profile.xpHistory.push({ key, label, points, reference, date: now }); profile.xp += points; }
  };
  const ledgerLine = (accountCode: string, debit = 0, credit = 0): JournalLine => ({ accountCode, debit: round(debit), credit: round(credit), description: '', costCenter: '' });
  /** Un período cerrado no admite asientos ni movimientos: lo controla el motor, no la pantalla. */
  const periodoAbierto = (date: string) => assert(!(profile.closedPeriods ?? []).includes(date.slice(0, 7)), `El período ${date.slice(0, 7)} está cerrado. Reábrelo en Cierres Fiscales o usa una fecha de un período abierto.`);
  const post = (date: string, memo: string, source: string, reference: string, input: JournalLine[]): string => {
    periodoAbierto(date);
    const lines = input.map(l => ({ ...l, debit: round(l.debit), credit: round(l.credit) })).filter(l => l.debit || l.credit); const debit = round(lines.reduce((s, l) => s + l.debit, 0)); const credit = round(lines.reduce((s, l) => s + l.credit, 0));
    assert(lines.length >= 2 && debit > 0 && debit === credit, 'El asiento debe cuadrar al centavo y tener importe positivo.');
    for (const line of lines) { assert(state.chartOfAccounts.some(a => a.code === line.accountCode && a.active && a.postable), `Cuenta no imputable: ${line.accountCode}.`); assert(line.debit >= 0 && line.credit >= 0 && !(line.debit && line.credit), 'Una línea debe tener debe o haber, no ambos.'); }
    const id = next('AS', date);
    state.journalEntries.push({ ...meta(id), entryNumber: id, date, dueDate: date, period: date.slice(0, 7), memo, reference, source, lines, totalDebit: debit, totalCredit: credit, reversalOf: '', reversedBy: '' });
    if (source === 'manual') award('journal', 200, id, 'Primer asiento cuadrado');
    return id;
  };
  const stock = (itemCode: string, warehouseCode: string): WarehouseStock => {
    assert(profile.warehouses.some(w => w.code === warehouseCode), 'Almacén inexistente.');
    const item = state.items.find(i => i.itemCode === itemCode && i.active && i.type === 'inventory');
    if (!item) throw new Error(`Artículo inventariable inexistente: ${itemCode}.`);
    let row = state.warehouseStock.find(s => s.itemCode === itemCode && s.warehouseCode === warehouseCode);
    if (!row) { const id = `${itemCode}__${warehouseCode}`; row = { ...meta(id), itemCode, warehouseCode, quantity: 0, reserved: 0, value: 0, averageCost: 0, costingMethod: item.costingMethod, layers: [] }; state.warehouseStock.push(row); }
    return row;
  };
  const move = (itemCode: string, warehouseCode: string, qty: number, cost: number, date: string, reference: string): number => {
    periodoAbierto(date);
    const item = state.items.find(i => i.itemCode === itemCode); if (!item) throw new Error('Artículo inexistente.');
    const row = stock(itemCode, warehouseCode);
    const changed = moveStock(row, qty, item.costingMethod === 'standard' ? item.standardCost : cost, item.costingMethod, date);
    Object.assign(row, changed.stock, { updatedAt: now });
    const id = next('MOV', date); state.stockMovements.push({ ...meta(id), itemCode, warehouseCode, date, quantity: qty, unitCost: changed.cost / Math.abs(qty), value: round(Math.sign(qty) * changed.cost), balance: row.quantity, reference });
    return changed.cost;
  };
  function saveDocument(kind: 'sales' | 'purchase', docType: DocType, data: CommandData<'sales'>['document'], aprobado = false): string {
    const sales = kind === 'sales'; const partners = sales ? state.customers : state.vendors;
    const partner = partners.find(p => p.cardCode === data.cardCode && p.active);
    if (!partner) throw new Error('Selecciona un socio activo.');
    // ICE: lo fija el artículo (catálogo del SRI), nunca el navegador.
    data = { ...data, lines: data.lines.map(l => { const it = state.items.find(i => i.itemCode === l.itemCode); return { ...l, ice: iceDeLinea(it?.ice, l.quantity, round(l.quantity * l.price * (1 - l.discount / 100))) }; }) };
    // RIMPE: un Negocio Popular no cobra IVA (ni como emisor ni como proveedor).
    if (sales) assert(state.profile?.regimen !== 'rimpe-popular' || data.lines.every(l => l.taxRate === 0), 'Tu empresa es RIMPE Negocio Popular: emite notas de venta sin IVA (tarifa 0 %).');
    else assert(!('rimpe' in partner) || partner.rimpe !== 'popular' || data.lines.every(l => l.taxRate === 0), `${partner.name} es RIMPE Negocio Popular: entrega nota de venta y no cobra IVA; usa tarifa 0 %. Si necesitas el crédito del IVA, emite una liquidación de compra.`);
    if (sales && 'kind' in partner && partner.kind === 'lead' && docType !== 'quotation') throw new Error('Un lead solo puede recibir cotizaciones.');
    const records = sales ? state.salesOrders : state.purchaseOrders;
    const base = records.find(d => d.id === data.baseDocumentId);
    const predecessor: Partial<Record<DocType, DocType>> = { order: 'quotation', delivery: 'order', invoice: 'delivery', credit_note: 'invoice', purchase_order: 'purchase_request', goods_receipt: 'purchase_order', vendor_invoice: 'goods_receipt', debit_note: 'vendor_invoice' };
    if (data.baseDocumentId) {
      assert(base && base.docType === predecessor[docType] && base.cardCode === partner.cardCode, 'Documento base incompatible.');
      assert(!records.some(d => d.baseDocumentId === data.baseDocumentId && d.docType === docType), 'El documento base ya fue copiado a este tipo.');
      if (base && docType !== 'debit_note') assert(JSON.stringify(base.lines) === JSON.stringify(data.lines), 'La copia debe mantener las líneas completas del documento base.');
    }
    if (docType === 'credit_note') assert(base, 'La nota de crédito requiere una factura base.');
    for (const line of data.lines) { const item = state.items.find(i => i.itemCode === line.itemCode && i.active); assert(item, 'Artículo inexistente o inactivo.'); if (sales && item) assert(line.discount <= item.maxDiscount, `Descuento excedido: ${line.itemCode}.`); }
    // Autorización: sobre el monto de la regla, el documento queda retenido como borrador pendiente.
    const regla = (state.profile?.approvalRules ?? []).find(r => r.active && r.docType === docType);
    const preTotal = totals(data.lines).total;
    if (!aprobado && regla && preTotal > regla.threshold) {
      const approvalId = next('APR', data.date);
      state.approvals.push({ ...meta(approvalId), approvalNumber: approvalId, kind, docType, cardCode: partner.cardCode, cardName: partner.name, total: preTotal, threshold: regla.threshold, document: structuredClone(data), status: 'pending', decisionComment: '', decidedAt: '', resultDocumentId: '' });
      return approvalId;
    }
    const id = next(prefixes[docType], data.date); const amounts = totals(data.lines); assert(amounts.total > 0, 'El total debe ser positivo.');
    let journalEntryId = ''; let inventoryCost = 0;
    const inventoryAccount = (itemCode: string) => state.boms.some(b => b.parentItemCode === itemCode && b.type === 'production') ? '1.1.07' : '1.1.05';
    const inventoryByAccount = new Map<string, number>();
    const affectsOut = docType === 'delivery' || (docType === 'invoice' && !base);
    const affectsIn = docType === 'goods_receipt' || (docType === 'vendor_invoice' && !base);
    if (affectsOut || affectsIn) for (const line of data.lines) {
      if (state.items.find(i => i.itemCode === line.itemCode)?.type !== 'inventory') continue;
      const cost = move(line.itemCode, line.warehouseCode, line.quantity * (affectsOut ? -1 : 1), line.price * (1 - line.discount / 100) + (affectsIn ? (line.ice ?? 0) / line.quantity : 0), data.date, id);
      inventoryCost += cost;
      const account = inventoryAccount(line.itemCode); inventoryByAccount.set(account, round((inventoryByAccount.get(account) ?? 0) + cost));
    }
    inventoryCost = round(inventoryCost);
    const lines: JournalLine[] = [];
    if (affectsOut && inventoryCost) { lines.push(ledgerLine('5.01', inventoryCost)); inventoryByAccount.forEach((cost, account) => lines.push(ledgerLine(account, 0, cost))); }
    if (docType === 'invoice') { partner.balance = round(partner.balance + amounts.total); lines.push(ledgerLine('1.1.03', amounts.total), ledgerLine('4.01', 0, amounts.subtotal), ledgerLine('2.1.02', 0, amounts.tax), ledgerLine('2.1.11', 0, amounts.ice)); }
    if (docType === 'credit_note' && base) {
      partner.balance = round(partner.balance - amounts.total);
      lines.push(ledgerLine('4.01', amounts.subtotal), ledgerLine('2.1.02', amounts.tax), ledgerLine('2.1.11', amounts.ice), ledgerLine('1.1.03', 0, amounts.total));
      const delivery = state.salesOrders.find(d => d.id === base.baseDocumentId);
      const source = delivery?.id ?? base.id;
      let returned = 0;
      state.stockMovements.filter(m => m.reference === source && m.quantity < 0).forEach(m => { const value = move(m.itemCode, m.warehouseCode, -m.quantity, m.unitCost, data.date, id); returned += value; lines.push(ledgerLine(inventoryAccount(m.itemCode), value)); });
      if (returned) lines.push(ledgerLine('5.01', 0, returned));
    }
    if (docType === 'goods_receipt' && inventoryCost) { inventoryByAccount.forEach((cost, account) => lines.push(ledgerLine(account, cost))); lines.push(ledgerLine('2.1.06', 0, inventoryCost)); }
    if (docType === 'vendor_invoice' || docType === 'debit_note') {
      partner.balance = round(partner.balance + amounts.total);
      const received = base?.docType === 'goods_receipt' ? round(state.stockMovements.filter(m => m.reference === base.id).reduce((s, m) => s + m.value, 0)) : inventoryCost;
      if (received) { if (base?.docType === 'goods_receipt') lines.push(ledgerLine('2.1.06', received)); else inventoryByAccount.forEach((cost, account) => lines.push(ledgerLine(account, cost))); }
      const other = round(amounts.subtotal + amounts.ice - received);
      if (other >= 0) lines.push(ledgerLine('6.03', other)); else lines.push(ledgerLine('6.05', 0, -other));
      lines.push(ledgerLine('1.1.06', amounts.tax), ledgerLine('2.1.01', 0, amounts.total));
    }
    if (lines.length) journalEntryId = post(data.date, documentLabels[docType], kind, id, lines);
    const creditApplied = docType === 'credit_note' && base ? round(amounts.total - base.paidAmount) : 0;
    const common = { ...meta(id), ...data, ...amounts, docNumber: id, cardName: partner.name, currency: 'USD' as const, status: (docType === 'credit_note' && creditApplied === amounts.total ? 'closed' : 'open') as 'open' | 'closed', paidAmount: creditApplied, journalEntryId };
    if (sales) state.salesOrders.push({ ...common, docType: docType as SalesDocument['docType'] });
    else state.purchaseOrders.push({ ...common, docType: docType as PurchaseDocument['docType'] });
    if (base && docType !== 'debit_note') { base.status = 'closed'; base.updatedAt = now; }
    partner.updatedAt = now;
    const points: Partial<Record<DocType, number>> = { quotation: 100, order: 150, invoice: 200, purchase_order: 100, goods_receipt: 200 };
    if (points[docType]) award(docType, points[docType], id, `Primer documento: ${documentLabels[docType]}`);
    return id;
  }
  let result = '';
  switch (command.action) {
    case 'access': profile.lastAccess = now; result = uid; break;
    case 'sales': result = saveDocument('sales', command.data.docType, command.data.document); break;
    case 'purchase': result = saveDocument('purchase', command.data.docType, command.data.document); break;
    case 'customer': { assert(!state.customers.some(p => p.ruc === command.data.ruc), 'Identificación ya registrada.'); result = nextSap('C'); state.customers.push({ ...meta(result), ...command.data, cardCode: result, balance: 0 }); award('customer', 50, result, 'Primer cliente'); break; }
    case 'vendor': { assert(!state.vendors.some(p => p.ruc === command.data.ruc), 'Identificación ya registrada.'); result = nextSap('V'); state.vendors.push({ ...meta(result), ...command.data, cardCode: result, balance: 0 }); break; }
    case 'item': { result = nextSap('A'); state.items.push({ ...meta(result), ...command.data, itemCode: result }); award('item', 50, result, 'Primer artículo'); break; }
    case 'employee': { assert(!state.employees.some(e => e.identification === command.data.identification), 'Cédula ya registrada.'); result = nextEmp(); state.employees.push({ ...meta(result), ...command.data, employeeCode: result }); break; }
    case 'journal': { const d = command.data; result = post(d.date, d.memo, 'manual', d.reference, d.lines); const entry = state.journalEntries.find(e => e.id === result); if (entry) entry.dueDate = d.dueDate; break; }
    case 'reverse': {
      const entry = state.journalEntries.find(e => e.id === command.data.entryId); assert(entry && !entry.reversedBy && !entry.reversalOf && entry.source === 'manual', 'Solo se revierte un asiento manual original sin reversión previa.');
      if (!entry) break; result = post(command.data.date, `Reversión ${entry.entryNumber}`, 'reversal', entry.id, entry.lines.map(l => ({ ...l, debit: l.credit, credit: l.debit })));
      entry.reversedBy = result; entry.updatedAt = now; state.journalEntries[state.journalEntries.length - 1].reversalOf = entry.id; break;
    }
    case 'stock': {
      const d = command.data; const item = state.items.find(i => i.itemCode === d.itemCode); assert(item?.costingMethod === d.costingMethod, 'Método de costeo incompatible.'); result = next('AJ');
      const cost = move(d.itemCode, d.warehouseCode, d.qty, item?.purchasePrice ?? 0, now.slice(0, 10), result);
      const account = state.boms.some(b => b.parentItemCode === d.itemCode && b.type === 'production') ? '1.1.07' : '1.1.05';
      if (cost) post(now.slice(0, 10), 'Ajuste de inventario', 'stock', result, d.qty > 0 ? [ledgerLine(account, cost), ledgerLine('6.05', 0, cost)] : [ledgerLine('6.05', cost), ledgerLine(account, 0, cost)]); break;
    }
    case 'transfer': {
      const d = command.data; assert(d.from !== d.to, 'Selecciona almacenes diferentes.'); result = next('TR', d.date);
      for (const line of d.lines) {
        const sourceStock = stock(line.itemCode, d.from);
        const transferredLayers: WarehouseStock['layers'] = [];
        let remaining = line.quantity;
        if (sourceStock.costingMethod === 'fifo') for (const layer of sourceStock.layers) {
          const quantity = Math.min(remaining, layer.quantity);
          if (quantity > 0) transferredLayers.push({ ...layer, quantity });
          remaining = quantityRound(remaining - quantity);
          if (remaining <= 0) break;
        }
        const cost = move(line.itemCode, d.from, -line.quantity, 0, d.date, result);
        move(line.itemCode, d.to, line.quantity, cost / line.quantity, d.date, result);
        if (transferredLayers.length) stock(line.itemCode, d.to).layers.splice(-1, 1, ...transferredLayers);
      } break;
    }
    case 'bank': {
      const d = command.data; const bank = state.bankAccounts.find(b => b.id === d.bankAccountId && b.active); if (!bank) throw new Error('Cuenta bancaria inexistente.');
      const deposit = d.type === 'deposit'; const records = [...state.salesOrders, ...state.purchaseOrders]; const invoice = records.find(doc => doc.id === d.documentId);
      let counterpart = d.counterpartAccount;
      const retIR = d.retentionIR ?? 0; const retIVA = d.retentionIVA ?? 0; const settle = round(d.amount + retIR + retIVA);
      assert(!(retIR || retIVA) || (deposit && d.documentId), 'Las retenciones recibidas se registran al cobrar una factura de venta.');
      if (d.documentId) {
        assert(invoice && (deposit ? invoice.docType === 'invoice' : ['vendor_invoice', 'debit_note', 'credit_note'].includes(invoice.docType)), 'Selecciona una factura o nota de débito compatible.');
        if (!invoice) break; assert(invoice.status === 'open' && round(invoice.paidAmount + settle) <= invoice.total, 'Pago excedido o factura cerrada.');
        counterpart = deposit || invoice.docType === 'credit_note' ? '1.1.03' : '2.1.01'; invoice.paidAmount = round(invoice.paidAmount + settle); invoice.status = invoice.paidAmount === invoice.total ? 'closed' : 'open'; invoice.updatedAt = now;
        const partner = (deposit || invoice.docType === 'credit_note' ? state.customers : state.vendors).find(p => p.cardCode === invoice.cardCode); if (partner) { partner.balance = round(partner.balance + (invoice.docType === 'credit_note' ? settle : -settle)); partner.updatedAt = now; }
      }
      assert(counterpart !== bank.ledgerAccount, 'Selecciona una contrapartida distinta de bancos.');
      assert(deposit || bank.balance >= d.amount, 'Saldo bancario insuficiente.'); result = next('BAN', d.date);
      const journalEntryId = post(d.date, deposit ? 'Cobro / depósito' : 'Pago bancario', 'bank', result, deposit ? [ledgerLine(bank.ledgerAccount, d.amount), ledgerLine('1.1.10', retIR), ledgerLine('1.1.11', retIVA), ledgerLine(counterpart, 0, settle)] : [ledgerLine(counterpart, d.amount), ledgerLine(bank.ledgerAccount, 0, d.amount)]);
      bank.balance = round(bank.balance + (deposit ? d.amount : -d.amount)); bank.updatedAt = now;
      state.bankTransactions.push({ ...meta(result), ...d, counterpartAccount: counterpart, transactionId: result, reconciled: false, statementAmount: null, journalEntryId }); break;
    }
    case 'reconcile': {
      const d = command.data; const row = state.bankTransactions.find(t => t.id === d.id); if (!row) throw new Error('Movimiento inexistente.');
      assert(!d.reconciled || round(d.statementAmount) === round(row.amount * (row.type === 'deposit' ? 1 : -1)), 'Los importes no coinciden.'); Object.assign(row, d, { updatedAt: now }); result = row.id; break;
    }
    case 'payroll': {
      const d = command.data; assert(d.date.startsWith(d.period), 'Fecha fuera del período.');
      assert(new Set(d.lines.map(l => l.employeeCode)).size === d.lines.length, 'Empleado duplicado.');
      for (const input of d.lines) assert(!state.payrollRuns.some(r => r.period === d.period && r.lines.some(l => l.employeeCode === input.employeeCode)), `El empleado ${input.employeeCode} ya tiene rol de pagos en ${d.period}: no se paga dos veces el mismo período.`);
      const lines = d.lines.map(input => { const employee = state.employees.find(e => e.employeeCode === input.employeeCode && e.active); if (!employee) throw new Error('Empleado inactivo o inexistente.'); assert(employee.contract !== 'fees', 'Honorarios se procesan como compra de servicios, no como nómina.'); assert(employee.hireDate <= d.date, 'Empleado aún no contratado.'); assert(!state.payrollRuns.some(p => p.period === d.period && p.lines.some(l => l.employeeCode === input.employeeCode)), 'Empleado ya liquidado en este mes.'); return payrollLine(employee, input, d.period, d.sbu); });
      const sum = (key: keyof typeof lines[number]) => round(lines.reduce((s, l) => s + (typeof l[key] === 'number' ? l[key] as number : 0), 0));
      result = next('ROL', d.date); const provisions = round(sum('thirteenthProvision') + sum('fourteenthProvision') + sum('reserveProvision') + sum('vacationProvision'));
      const journalEntryId = post(d.date, `Nómina ${d.period}`, 'payroll', result, [ledgerLine('6.01', sum('income')), ledgerLine('6.02', sum('employerIESS')), ledgerLine('6.04', provisions), ledgerLine('2.1.05', 0, sum('net')), ledgerLine('2.1.04', 0, sum('personalIESS') + sum('employerIESS')), ledgerLine('2.1.03', 0, sum('incomeTax')), ledgerLine('1.1.08', 0, sum('advances')), ledgerLine('2.1.08', 0, sum('otherDeductions')), ledgerLine('2.1.07', 0, provisions)]);
      state.payrollRuns.push({ ...meta(result), payrollId: result, date: d.date, period: d.period, sbu: d.sbu, lines, totalIncome: sum('income'), totalDeductions: sum('deductions'), totalNet: sum('net'), employerIESS: sum('employerIESS'), journalEntryId, status: 'posted' }); award('payroll', 400, result, 'Primera nómina'); break;
    }
    case 'profitShare': {
      const d = command.data; assert(d.date.startsWith(`${d.year}-`), 'La fecha debe estar dentro del ejercicio.');
      assert(!state.taxRuns.some(r => r.kind === 'utilidades' && r.year === d.year), `Las utilidades de ${d.year} ya fueron calculadas.`);
      const utilidad = d.profit ?? resultadoAntesDeImpuestos(d.year);
      assert(utilidad > 0, `No hay utilidad en ${d.year} (${utilidad.toFixed(2)}): sin utilidad no hay participación de trabajadores.`);
      const empleados = state.employees.filter(e => e.contract !== 'fees' && e.hireDate <= `${d.year}-12-31`);
      assert(empleados.length > 0, 'No hay empleados que participen en las utilidades.');
      const dias = (e: { hireDate: string }) => Math.round((Date.parse(`${d.year}-12-31`) - Date.parse(e.hireDate > `${d.year}-01-01` ? e.hireDate : `${d.year}-01-01`)) / 86400000) + 1;
      const totalDias = empleados.reduce((s, e) => s + dias(e), 0); const totalCargas = empleados.reduce((s, e) => s + (e.dependents ?? 0), 0);
      const pool10 = utilidad * 0.10; const pool5 = utilidad * 0.05; const tope = round(24 * profile.sbu);
      const reparto = empleados.map(e => {
        const p10 = pool10 * dias(e) / totalDias; const p5 = totalCargas > 0 ? pool5 * (e.dependents ?? 0) / totalCargas : pool5 * dias(e) / totalDias;
        const total = round(p10 + p5); const pagar = Math.min(total, tope);
        return { e, dias: dias(e), p10: round(p10), p5: round(p5), total, pagar, exceso: round(total - pagar) };
      });
      const totalPool = round(reparto.reduce((s, r) => s + r.total, 0)); const totalPagar = round(reparto.reduce((s, r) => s + r.pagar, 0)); const totalExceso = round(totalPool - totalPagar);
      result = next('TAX', d.date);
      const journalEntryId = post(d.date, `Participación de trabajadores en utilidades ${d.year}`, 'tax', result, [ledgerLine('6.06', totalPool), ledgerLine('2.1.09', 0, totalPagar), ledgerLine('2.1.04', 0, totalExceso)]);
      state.taxRuns.push({ ...meta(result), runId: result, kind: 'utilidades', year: d.year, date: d.date, title: `Utilidades de los trabajadores ${d.year}`, journalEntryId,
        figures: { utilidad, participacion: totalPool, pagar: totalPagar, excesoAlIESS: totalExceso, tope },
        lines: [{ label: 'Utilidad líquida del ejercicio', value: utilidad.toFixed(2), note: 'ingresos − costos − gastos, antes de participación e impuesto a la renta' }, { label: '15 % para trabajadores', value: totalPool.toFixed(2), note: '10 % por días trabajados + 5 % por cargas familiares' },
          ...reparto.map(r => ({ label: `${r.e.firstName} ${r.e.lastName}`, value: r.pagar.toFixed(2), note: `${r.dias} días · 10 %: ${r.p10.toFixed(2)} · 5 %: ${r.p5.toFixed(2)}${r.exceso ? ` · excede el tope de 24 SBU en ${r.exceso.toFixed(2)} (va al IESS)` : ''}` }))] });
      break;
    }
    case 'incomeTaxClose': {
      const d = command.data; assert(d.date.startsWith(`${d.year}-`) || d.date.startsWith(`${d.year + 1}-`), 'La fecha debe corresponder al cierre del ejercicio.');
      assert((profile.regimen ?? 'general') === 'general', 'Los RIMPE pagan el impuesto a la renta con su propio régimen (no con la tarifa general de sociedades): este cierre es solo para el régimen general.');
      assert(!state.taxRuns.some(r => r.kind === 'renta' && r.year === d.year), `El impuesto a la renta de ${d.year} ya fue calculado.`);
      const util = state.taxRuns.find(r => r.kind === 'utilidades' && r.year === d.year);
      if (!util) throw new Error(`Primero calcula las utilidades de los trabajadores de ${d.year}: la participación es deducible del impuesto a la renta.`);
      const base = round(Math.max(0, util.figures.utilidad - util.figures.participacion)); const ir = round(base * profile.incomeTaxRate / 100);
      const fin = `${d.year}-12-31`; const anticipo = Math.max(0, saldoDeudor('1.1.09', fin)); const retenciones = Math.max(0, saldoDeudor('1.1.10', fin));
      const usadoAnt = round(Math.min(anticipo, ir)); const usadoRet = round(Math.min(retenciones, ir - usadoAnt)); const pagar = round(ir - usadoAnt - usadoRet);
      result = next('TAX', d.date);
      let journalEntryId = '';
      if (ir > 0) journalEntryId = post(d.date, `Impuesto a la renta ${d.year}`, 'tax', result, [ledgerLine('6.07', ir), ledgerLine('1.1.09', 0, usadoAnt), ledgerLine('1.1.10', 0, usadoRet), ledgerLine('2.1.10', 0, pagar)]);
      state.taxRuns.push({ ...meta(result), runId: result, kind: 'renta', year: d.year, date: d.date, title: `Impuesto a la renta ${d.year}`, journalEntryId,
        figures: { utilidad: util.figures.utilidad, participacion: util.figures.participacion, base, tarifa: profile.incomeTaxRate, ir, anticipo: usadoAnt, retenciones: usadoRet, pagar, saldoAFavor: round(anticipo + retenciones - usadoAnt - usadoRet) },
        lines: [{ label: 'Utilidad antes de participación e impuesto', value: util.figures.utilidad.toFixed(2), note: '' }, { label: '(−) Participación de trabajadores 15 %', value: util.figures.participacion.toFixed(2), note: 'deducible' }, { label: 'Base del impuesto a la renta', value: base.toFixed(2), note: 'sin conciliación tributaria (simplificación didáctica)' },
          { label: `Impuesto a la renta causado ${profile.incomeTaxRate} %`, value: ir.toFixed(2), note: '' }, { label: '(−) Anticipo pagado', value: usadoAnt.toFixed(2), note: 'cuenta 1.1.09' }, { label: '(−) Retenciones de renta recibidas', value: usadoRet.toFixed(2), note: 'cuenta 1.1.10' }, { label: 'Impuesto a pagar', value: pagar.toFixed(2), note: 'cuenta 2.1.10' }] });
      break;
    }
    case 'incomeTaxAdvance': {
      const d = command.data; const renta = state.taxRuns.find(r => r.kind === 'renta' && r.year === d.year);
      if (!renta) throw new Error(`Primero cierra el impuesto a la renta de ${d.year}: el anticipo se calcula sobre el impuesto causado.`);
      assert(!state.taxRuns.some(r => r.kind === 'anticipo' && r.year === d.year), `El anticipo basado en ${d.year} ya fue calculado.`);
      const retenciones = renta.figures.retenciones; const total = round(Math.max(0, renta.figures.ir * 0.5 - retenciones)); const cuota = round(total / 2);
      result = next('TAX', d.date);
      state.taxRuns.push({ ...meta(result), runId: result, kind: 'anticipo', year: d.year, date: d.date, title: `Anticipo voluntario de impuesto a la renta (base ${d.year})`, journalEntryId: '',
        figures: { irCausado: renta.figures.ir, retenciones, anticipo: total, cuota },
        lines: [{ label: 'Impuesto a la renta causado', value: renta.figures.ir.toFixed(2), note: '' }, { label: '50 % del impuesto causado', value: round(renta.figures.ir * 0.5).toFixed(2), note: '' }, { label: '(−) Retenciones de renta del ejercicio', value: retenciones.toFixed(2), note: '' }, { label: 'Anticipo', value: total.toFixed(2), note: 'se paga en dos cuotas iguales' }, { label: 'Cuota de julio', value: cuota.toFixed(2), note: 'contrapartida 1.1.09 Anticipo de impuesto a la renta' }, { label: 'Cuota de septiembre', value: cuota.toFixed(2), note: 'contrapartida 1.1.09 Anticipo de impuesto a la renta' }] });
      break;
    }
    case 'foreignPayment': {
      const d = command.data; const bank = state.bankAccounts.find(b => b.id === d.bankAccountId && b.active); if (!bank) throw new Error('Cuenta bancaria inexistente.');
      const tarifa = ISD_TARIFAS.find(t => t.id === d.tarifa); if (!tarifa) throw new Error('Tarifa de ISD no vigente en 2026.');
      assert(d.imputacion === 'gasto' || d.destination === 'importacion', 'El ISD solo es crédito tributario cuando el pago es por importación de materias primas, insumos o bienes de capital; en otros pagos va al gasto.');
      const isd = round(d.amount * tarifa.rate / 100); const proveedor = d.vendorCode ? state.vendors.find(v => v.cardCode === d.vendorCode) : undefined;
      if (d.vendorCode) assert(proveedor, 'Proveedor inexistente.');
      assert(bank.balance >= round(d.amount + isd), `Saldo bancario insuficiente: necesitas ${(d.amount + isd).toFixed(2)} (pago ${d.amount.toFixed(2)} + ISD ${isd.toFixed(2)}).`);
      result = next('BAN', d.date);
      const principal = proveedor ? '2.1.01' : '6.03';
      const journalEntryId = post(d.date, `Pago al exterior: ${d.concept}`, 'bank', result, [ledgerLine(principal, d.amount), ledgerLine(d.imputacion === 'credito' ? '1.1.12' : '6.08', isd), ledgerLine(bank.ledgerAccount, 0, round(d.amount + isd))]);
      if (proveedor) { proveedor.balance = round(proveedor.balance - d.amount); proveedor.updatedAt = now; }
      bank.balance = round(bank.balance - d.amount - isd); bank.updatedAt = now;
      state.bankTransactions.push({ ...meta(result), transactionId: result, bankAccountId: bank.id, date: d.date, type: 'payment', amount: round(d.amount + isd), counterpartAccount: principal, reference: d.reference || d.concept, documentId: '', reconciled: false, statementAmount: null, journalEntryId });
      state.taxRuns.push({ ...meta(`${result}-ISD`), runId: `${result}-ISD`, kind: 'isd', year: Number(d.date.slice(0, 4)), date: d.date, title: `ISD · ${d.concept}`, journalEntryId, figures: { pago: d.amount, tarifa: tarifa.rate, isd, total: round(d.amount + isd) },
        lines: [{ label: 'Pago al exterior', value: d.amount.toFixed(2), note: d.concept }, { label: `ISD ${tarifa.rate} %`, value: isd.toFixed(2), note: d.imputacion === 'credito' ? 'crédito tributario (1.1.12)' : 'gasto (6.08)' }, { label: 'Total que sale del banco', value: round(d.amount + isd).toFixed(2), note: '' }] });
      break;
    }
    case 'sri': {
      const d = command.data; assert([...state.customers, ...state.vendors].some(p => p.cardCode === d.partnerCode), 'Beneficiario inexistente.');
      if (d.sourceDocumentId) assert([...state.salesOrders, ...state.purchaseOrders].some(doc => doc.id === d.sourceDocumentId && doc.cardCode === d.partnerCode), 'Documento de sustento incompatible.');
      if (d.docType === '07') {
        assert(d.retentionLines.length > 0 && d.retentionLines.every(l => l.base > 0), 'Añade retenciones con base positiva.');
        const sustento = state.purchaseOrders.find(doc => doc.id === d.sourceDocumentId); if (!sustento) throw new Error('Selecciona la factura del proveedor que vas a retener.');
        // El porcentaje lo fija la tabla vigente del SRI, no la pantalla: así nadie puede retener un porcentaje inventado.
        d.retentionLines = d.retentionLines.map(l => { const o = opcionRetencion(l.code); if (!o) throw new Error(`El código de retención ${l.code} no está vigente en 2026. Elige uno de la tabla actual.`); return { ...l, tax: o.tax, rate: o.rate }; });
        const baseIR = round(d.retentionLines.filter(l => l.tax === 'IR').reduce((s, l) => s + l.base, 0)); const baseIVA = round(d.retentionLines.filter(l => l.tax === 'IVA').reduce((s, l) => s + l.base, 0));
        assert(baseIR <= round(sustento.subtotal + 0.01), `La base de la retención de renta (${baseIR.toFixed(2)}) no puede superar el subtotal sin IVA de la factura (${sustento.subtotal.toFixed(2)}).`);
        assert(baseIVA <= round(sustento.tax + 0.01), `La retención del IVA se calcula sobre el IVA de la factura (${sustento.tax.toFixed(2)}), no sobre la base imponible. Tu base de IVA es ${baseIVA.toFixed(2)}.`);
      }
      assert(!(d.docType === '01' && profile.regimen === 'rimpe-popular'), 'Un RIMPE Negocio Popular no emite factura electrónica: entrega nota de venta RIMPE.');
      if (d.docType === '07') {
        const prov = state.vendors.find(v => v.cardCode === d.partnerCode);
        if (prov?.rimpe === 'popular') assert(d.retentionLines.every(l => l.rate === 0), `${prov.name} es Negocio Popular: no se le retiene renta ni IVA (código 332, 0 %).`);
        if (prov?.rimpe === 'emprendedor') assert(d.retentionLines.filter(l => l.tax === 'IR').every(l => opcionRetencion(l.code)?.codigo === '343'), `${prov.name} es RIMPE Emprendedor: la retención de renta es del 1 % (código 343).`);
      }
      const key = `SRI-${d.docType}-${d.series}`; const seq = (profile.sequences[key] ?? 0) + 1; profile.sequences[key] = seq;
      result = sriAccessKey(d.date, d.docType, profile.ruc, d.series, seq, String(seq).padStart(8, '0'));
      const number = `${d.series}-${String(seq).padStart(9, '0')}`;
      const totalRetention = round(d.retentionLines.reduce((s, l) => s + round(l.base * l.rate / 100), 0));
      assert(!state.sriDocuments.some(doc => doc.docType === d.docType && doc.sourceDocumentId === d.sourceDocumentId && !['DEVUELTA', 'NO AUTORIZADO'].includes(doc.status)), 'Este documento ya tiene un comprobante del mismo tipo.');
      const xml = buildSRIXml(state, d, result, seq);
      state.sriDocuments.push({ ...meta(result), ...d, ats: { ...d.ats, secuencial: String(seq).padStart(9, '0'), autorizacion: result }, claveAcceso: result, number, environment: '1', emissionType: '1', status: 'PENDIENTE', authorizedAt: '', xml, totalRetention, simulated: true }); award('sri', 300, result, 'Primer comprobante SRI simulado'); break;
    }
    case 'authorize': {
      const row = state.sriDocuments.find(d => d.id === command.data.id); if (!row) throw new Error('Comprobante inexistente.');
      assert(row.status === 'PENDIENTE', row.status === 'AUTORIZADO' ? 'Este comprobante ya está autorizado.' : 'El SRI rechazó este comprobante: corrige el dato y genera uno nuevo.');
      assert(Date.parse(now) - Date.parse(row.createdAt) >= 2000, 'La simulación tarda al menos dos segundos.');
      const hoyEcuador = new Date(Date.parse(now) - 5 * 3600_000).toISOString().slice(0, 10); // Ecuador continental: UTC−5
      const autorizadas = new Set(state.sriDocuments.filter(x => x.status === 'AUTORIZADO').map(x => x.claveAcceso));
      const respuesta = enviarAlSRI(row.xml, autorizadas, hoyEcuador);
      row.status = respuesta.estado; row.sriMessages = respuesta.mensajes; row.updatedAt = now; result = row.id;
      if (respuesta.estado !== 'AUTORIZADO') break;
      row.authorizedAt = now;
      // La retención autorizada reduce lo que se le debe al proveedor y crea la obligación con el SRI.
      if (row.docType === '07' && row.totalRetention > 0) {
        const factura = state.purchaseOrders.find(doc => doc.id === row.sourceDocumentId); if (!factura) throw new Error('Factura de proveedor inexistente.');
        assert(row.totalRetention <= round(factura.total - factura.paidAmount), `La retención (${row.totalRetention.toFixed(2)}) supera el saldo pendiente de la factura (${round(factura.total - factura.paidAmount).toFixed(2)}): ya se pagó de más al proveedor.`);
        row.journalEntryId = post(row.date, `Retención ${row.number}`, 'sri', row.number, [ledgerLine('2.1.01', row.totalRetention), ledgerLine('2.1.03', 0, row.totalRetention)]);
        factura.paidAmount = round(factura.paidAmount + row.totalRetention); factura.status = factura.paidAmount >= factura.total ? 'closed' : 'open'; factura.updatedAt = now;
        const proveedor = state.vendors.find(v => v.cardCode === factura.cardCode); if (proveedor) { proveedor.balance = round(proveedor.balance - row.totalRetention); proveedor.updatedAt = now; }
      }
      break;
    }
    case 'bom': {
      const d = command.data; assert(state.items.some(i => i.itemCode === d.parentItemCode && i.type === 'inventory'), 'Producto padre inventariable requerido.'); assert(!state.boms.some(b => b.parentItemCode === d.parentItemCode && b.type === d.type), 'Ya existe una BOM de este tipo.');
      assert(new Set(d.components.map(c => c.itemCode)).size === d.components.length, 'Componente duplicado.');
      d.components.forEach(c => assert(c.itemCode !== d.parentItemCode && state.items.some(i => i.itemCode === c.itemCode && i.type === 'inventory'), 'Componente inválido.'));
      const reaches = (item: string, target: string, seen: Set<string>): boolean => item === target || (!seen.has(item) && state.boms.filter(b => b.parentItemCode === item).some(b => b.components.some(c => reaches(c.itemCode, target, new Set(seen).add(item)))));
      assert(!d.components.some(c => reaches(c.itemCode, d.parentItemCode, new Set())), 'BOM circular.');
      assert(!state.warehouseStock.some(s => s.itemCode === d.parentItemCode && s.quantity > 0), 'Crea la BOM de producción antes de ingresar stock del producto padre.');
      result = next('BOM'); state.boms.push({ ...meta(result), ...d, bomCode: result, totalCost: round(d.components.reduce((s, c) => s + c.quantity * c.cost, 0)) }); break;
    }
    case 'production': {
      const d = command.data; const bom = state.boms.find(b => b.bomCode === d.bomCode && b.type === 'production'); if (!bom) throw new Error('BOM de producción inexistente.'); assert(d.dueDate >= d.date, 'Vencimiento inválido.'); stock(bom.parentItemCode, d.warehouseCode);
      result = next('OP', d.date); state.productionOrders.push({ ...meta(result), ...d, orderNumber: result, parentItemCode: bom.parentItemCode, components: bom.components, status: 'planned', journalEntryId: '', actualCost: 0 }); break;
    }
    case 'productionStatus': {
      const d = command.data; const order = state.productionOrders.find(o => o.id === d.id); if (!order) throw new Error('Orden inexistente.');
      const transitions = { planned: 'released', released: 'in_progress', in_progress: 'closed', closed: '' }; assert(transitions[order.status] === d.status, 'Transición de estado inválida.');
      if (d.status === 'released') for (const c of order.components) { const row = stock(c.itemCode, order.warehouseCode); const qty = quantityRound(c.quantity * order.quantity); assert(row.quantity - row.reserved >= qty, `Stock insuficiente: ${c.itemCode}.`); row.reserved = quantityRound(row.reserved + qty); row.updatedAt = now; }
      if (d.status === 'closed') {
        let consumed = 0; const consumedAccounts = new Map<string, number>();
        for (const c of order.components) { const row = stock(c.itemCode, order.warehouseCode); const qty = quantityRound(c.quantity * order.quantity); row.reserved = quantityRound(row.reserved - qty); const value = move(c.itemCode, order.warehouseCode, -qty, c.cost, order.date, order.id); consumed += value; const account = state.boms.some(b => b.parentItemCode === c.itemCode && b.type === 'production') ? '1.1.07' : '1.1.05'; consumedAccounts.set(account, round((consumedAccounts.get(account) ?? 0) + value)); }
        consumed = round(consumed); const produced = move(order.parentItemCode, order.warehouseCode, order.quantity, consumed / order.quantity, order.date, order.id); order.actualCost = consumed;
        const variance = round(consumed - produced); const lines = [ledgerLine('1.1.07', produced), ...Array.from(consumedAccounts, ([account, cost]) => ledgerLine(account, 0, cost))]; if (variance >= 0) lines.push(ledgerLine('6.05', variance)); else lines.push(ledgerLine('6.05', 0, -variance));
        if (consumed || produced) order.journalEntryId = post(order.date, 'Cierre de producción', 'production', order.id, lines);
      }
      order.status = d.status; order.updatedAt = now; result = order.id; break;
    }
    case 'mrp': {
      const requirements = mrp(state).filter(r => r.shortage > 0); assert(requirements.length, 'No hay faltantes pendientes.');
      const lines: DocumentLine[] = requirements.map(r => { const item = state.items.find(i => i.itemCode === r.itemCode); if (!item) throw new Error('Artículo no encontrado.'); return { itemCode: item.itemCode, description: item.name, quantity: r.shortage, unit: item.purchaseUnit, price: item.purchasePrice, discount: 0, taxRate: 15, warehouseCode: profile.warehouses[0].code }; });
      result = saveDocument('purchase', 'purchase_request', { date: command.data.date, dueDate: command.data.date, cardCode: command.data.vendorCode, reference: 'MRP', comments: 'Necesidades netas de pedidos abiertos', baseDocumentId: '', lines }); break;
    }
    case 'budget': {
      const d = command.data;
      const account = state.chartOfAccounts.find(a => a.code === d.accountCode);
      if (!account || !account.postable || !['income', 'cost', 'expense'].includes(account.category)) throw new Error('Solo se presupuestan cuentas imputables de ingresos, costos o gastos.');
      result = `PRE-${d.year}-${d.accountCode}`;
      const existing = state.budgets.find(b => b.id === result);
      if (existing) { existing.months = d.months; existing.updatedAt = now; }
      else state.budgets.push({ ...meta(result), year: d.year, accountCode: d.accountCode, accountName: account.name, months: d.months });
      award('budget', 50, result, 'Primer presupuesto');
      break;
    }
    case 'closePeriod': {
      const d = command.data; const cerrados = new Set(profile.closedPeriods ?? []);
      if (d.closed) cerrados.add(d.period); else cerrados.delete(d.period);
      profile.closedPeriods = [...cerrados].sort(); result = d.period;
      if (d.closed) award('period-close', 150, d.period, 'Primer cierre de período');
      break;
    }
    case 'closeYear': {
      const { year } = command.data;
      assert(!state.journalEntries.some(e => e.source === 'closing' && e.reference === year), `El ejercicio ${year} ya fue cerrado.`);
      // Asiento de cierre: se saldan ingresos, costos y gastos del año contra Resultados acumulados (3.02).
      const netos = new Map<string, number>();
      for (const e of state.journalEntries) if (e.date.startsWith(year)) for (const l of e.lines) {
        const cat = state.chartOfAccounts.find(a => a.code === l.accountCode)?.category;
        if (cat === 'income' || cat === 'cost' || cat === 'expense') netos.set(l.accountCode, round((netos.get(l.accountCode) ?? 0) + l.debit - l.credit));
      }
      const lineas: JournalLine[] = [];
      let resultado = 0;
      netos.forEach((neto, cuenta) => { if (!neto) return; lineas.push(neto > 0 ? ledgerLine(cuenta, 0, neto) : ledgerLine(cuenta, -neto)); resultado = round(resultado - neto); });
      if (resultado > 0) lineas.push(ledgerLine('3.02', 0, resultado)); else if (resultado < 0) lineas.push(ledgerLine('3.02', -resultado));
      // El asiento de cierre va al 31/12 aunque diciembre ya estuviera cerrado (único caso permitido).
      const cerradosAntes = profile.closedPeriods ?? [];
      profile.closedPeriods = cerradosAntes.filter(p => p !== `${year}-12`);
      result = lineas.length ? post(`${year}-12-31`, `Cierre del ejercicio ${year}`, 'closing', year, lineas) : year;
      profile.closedPeriods = [...new Set([...(profile.closedPeriods ?? []), ...Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, '0')}`)])].sort();
      award('year-close', 500, year, 'Cierre del ejercicio fiscal');
      break;
    }
    case 'approvalRule': {
      const d = command.data; const reglas = (profile.approvalRules ?? []).filter(r => r.docType !== d.docType);
      profile.approvalRules = [...reglas, { docType: d.docType, threshold: d.threshold, active: d.active }]; result = d.docType;
      if (d.active) award('approval-rule', 100, d.docType, 'Primera regla de autorización');
      break;
    }
    case 'approve': {
      const d = command.data; const solicitud = state.approvals.find(a => a.id === d.id);
      if (!solicitud) throw new Error('Solicitud de autorización inexistente.');
      assert(solicitud.status === 'pending', 'Esta solicitud ya fue decidida.');
      // Al aprobar se vuelve a validar todo (stock, documento base…) y recién ahí se crea el documento.
      if (d.approved) solicitud.resultDocumentId = saveDocument(solicitud.kind, solicitud.docType, solicitud.document, true);
      solicitud.status = d.approved ? 'approved' : 'rejected'; solicitud.decisionComment = d.comment; solicitud.decidedAt = now; solicitud.updatedAt = now;
      result = solicitud.resultDocumentId || solicitud.id;
      award('approval-decision', 150, solicitud.id, 'Primera decisión de autorización');
      break;
    }
    case 'itemPrices': {
      const d = command.data; const item = state.items.find(i => i.itemCode === d.itemCode); if (!item) throw new Error('Artículo inexistente.');
      Object.assign(item, { price: d.price, price2: d.price2, price3: d.price3, updatedAt: now }); result = item.itemCode; break;
    }
    case 'customerPriceList': {
      const d = command.data; assert(state.customers.some(c => c.cardCode === d.cardCode), 'Cliente inexistente.');
      profile.customerPriceLists = { ...(profile.customerPriceLists ?? {}), [d.cardCode]: d.list }; result = d.cardCode; break;
    }
    case 'volumeDiscount': {
      const d = command.data; let lista = profile.volumeDiscounts ?? [];
      if (d.remove) { lista = lista.filter(v => v.id !== d.id); result = d.id; }
      else {
        assert(d.itemCode === '*' || state.items.some(i => i.itemCode === d.itemCode), 'Artículo inexistente.');
        const maximo = d.itemCode === '*' ? Math.min(...state.items.map(i => i.maxDiscount), 100) : state.items.find(i => i.itemCode === d.itemCode)?.maxDiscount ?? 0;
        assert(d.discount <= maximo, `El descuento supera el máximo permitido (${maximo} %).`);
        result = d.id || next('DV');
        lista = [...lista.filter(v => v.id !== result), { id: result, itemCode: d.itemCode, minQuantity: d.minQuantity, discount: d.discount }];
      }
      profile.volumeDiscounts = lista; break;
    }
    case 'inventoryCount': {
      const d = command.data; assert(profile.warehouses.some(w => w.code === d.warehouseCode), 'Almacén inexistente.');
      assert(new Set(d.lines.map(l => l.itemCode)).size === d.lines.length, 'Artículo repetido en el conteo.');
      result = next('CNT', d.date);
      const lines: InventoryCountLine[] = []; const porCuenta = new Map<string, number>();
      for (const l of d.lines) {
        const item = state.items.find(i => i.itemCode === l.itemCode && i.type === 'inventory'); if (!item) throw new Error(`Artículo inventariable inexistente: ${l.itemCode}.`);
        const row = stock(l.itemCode, d.warehouseCode); const sistema = row.quantity;
        const diferencia = quantityRound(l.countedQuantity - sistema);
        let valor = 0;
        if (diferencia !== 0) {
          const costo = move(l.itemCode, d.warehouseCode, diferencia, row.averageCost || item.purchasePrice, d.date, result);
          valor = round(Math.sign(diferencia) * costo);
          const cuenta = state.boms.some(b => b.parentItemCode === l.itemCode && b.type === 'production') ? '1.1.07' : '1.1.05';
          porCuenta.set(cuenta, round((porCuenta.get(cuenta) ?? 0) + valor));
        }
        lines.push({ itemCode: l.itemCode, itemName: item.name, systemQuantity: sistema, countedQuantity: l.countedQuantity, difference: diferencia, unitCost: diferencia ? round(Math.abs(valor / diferencia)) : row.averageCost, value: valor });
      }
      const total = round([...porCuenta.values()].reduce((s, v) => s + v, 0));
      const asiento: JournalLine[] = [];
      porCuenta.forEach((v, cuenta) => asiento.push(v > 0 ? ledgerLine(cuenta, v) : ledgerLine(cuenta, 0, -v)));
      if (total > 0) asiento.push(ledgerLine('6.05', 0, total)); else if (total < 0) asiento.push(ledgerLine('6.05', -total));
      const journalEntryId = asiento.some(l => l.debit || l.credit) && total !== 0 ? post(d.date, 'Ajuste por conteo físico', 'count', result, asiento) : '';
      state.inventoryCounts.push({ ...meta(result), countNumber: result, date: d.date, warehouseCode: d.warehouseCode, blind: d.blind, lines, totalDifferenceValue: total, journalEntryId });
      award('inventory-count', 200, result, 'Primer conteo físico');
      break;
    }
    case 'fixedAsset': {
      const d = command.data; assert(d.residualValue < d.cost, 'El valor residual debe ser menor al costo.');
      result = next('AF', d.acquisitionDate);
      const journalEntryId = post(d.acquisitionDate, `Compra de activo fijo: ${d.name}`, 'asset', result, [ledgerLine('1.2.01', d.cost), ledgerLine(d.paymentAccount, 0, d.cost)]);
      state.fixedAssets.push({ ...meta(result), assetCode: result, name: d.name, category: d.category, acquisitionDate: d.acquisitionDate, cost: d.cost, residualValue: d.residualValue, usefulLifeMonths: d.usefulLifeMonths, accumulatedDepreciation: 0, depreciatedPeriods: [], status: 'active', journalEntryId });
      award('fixed-asset', 150, result, 'Primer activo fijo');
      break;
    }
    case 'depreciate': {
      const { period } = command.data;
      if (!state.chartOfAccounts.some(a => a.code === '6.06')) state.chartOfAccounts.push({ ...meta('6.06'), code: '6.06', name: 'Depreciación de activos fijos', category: 'expense', postable: true, parentCode: '6', nature: 'D', active: true });
      let total = 0;
      for (const a of state.fixedAssets) {
        if (a.status !== 'active' || a.acquisitionDate.slice(0, 7) > period || a.depreciatedPeriods.includes(period)) continue;
        const depreciable = round(a.cost - a.residualValue);
        const cuota = round(Math.min(depreciable / a.usefulLifeMonths, depreciable - a.accumulatedDepreciation));
        if (cuota <= 0) continue;
        a.accumulatedDepreciation = round(a.accumulatedDepreciation + cuota); a.depreciatedPeriods.push(period); a.updatedAt = now;
        if (a.accumulatedDepreciation >= depreciable) a.status = 'fully_depreciated';
        total = round(total + cuota);
      }
      assert(total > 0, 'No hay activos pendientes de depreciar en ese período.');
      const [y, m] = period.split('-').map(Number);
      const finDeMes = new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
      result = post(finDeMes, `Depreciación ${period}`, 'depreciation', period, [ledgerLine('6.06', total), ledgerLine('1.2.02', 0, total)]);
      award('depreciation', 150, period, 'Primera depreciación');
      break;
    }
    case 'landedCost': {
      const d = command.data;
      const doc = state.purchaseOrders.find(p => p.id === d.documentId);
      assert(doc && (doc.docType === 'goods_receipt' || (doc.docType === 'vendor_invoice' && !doc.baseDocumentId)), 'Selecciona una entrada de mercancía o una factura de proveedor que haya ingresado stock.');
      if (!doc) break;
      const recibidos = state.stockMovements.filter(m => m.reference === doc.id && m.quantity > 0);
      assert(recibidos.length > 0, 'Ese documento no ingresó mercadería al inventario.');
      const total = round(d.costs.reduce((s, c) => s + c.amount, 0));
      const base = recibidos.map(m => (d.allocation === 'value' ? m.value : m.quantity));
      const baseTotal = base.reduce((s, v) => s + v, 0);
      assert(baseTotal > 0, 'No hay base para prorratear.');
      result = next('CI', d.date);
      let asignado = 0; const porCuenta = new Map<string, number>(); let aCosto = 0; let aVariacion = 0;
      const lineas: LandedCost['lines'] = recibidos.map((m, i) => {
        // La última línea absorbe el redondeo para que el prorrateo sume exacto.
        const share = i === recibidos.length - 1 ? round(total - asignado) : round((total * base[i]) / baseTotal);
        asignado = round(asignado + share);
        const row = stock(m.itemCode, m.warehouseCode);
        const enBodega = Math.min(m.quantity, row.quantity);
        const toInventory = round((share * enBodega) / m.quantity);
        const toCostOfSales = round(share - toInventory);
        if (toInventory > 0) {
          if (row.costingMethod === 'standard') aVariacion = round(aVariacion + toInventory);
          else {
            row.value = round(row.value + toInventory); row.averageCost = row.quantity ? row.value / row.quantity : 0;
            if (row.costingMethod === 'fifo') {
              // Se reparte en las capas más recientes, que corresponden a lo recibido.
              let porCubrir = enBodega; const extraUnit = toInventory / enBodega;
              for (let k = row.layers.length - 1; k >= 0 && porCubrir > 0.000001; k--) {
                const capa = row.layers[k];
                if (capa.quantity > porCubrir) { row.layers.splice(k, 1, { ...capa, quantity: quantityRound(capa.quantity - porCubrir) }, { ...capa, quantity: porCubrir, cost: capa.cost + extraUnit }); porCubrir = 0; }
                else { capa.cost += extraUnit; porCubrir = quantityRound(porCubrir - capa.quantity); }
              }
            }
            row.updatedAt = now;
            const cuenta = state.boms.some(b => b.parentItemCode === m.itemCode && b.type === 'production') ? '1.1.07' : '1.1.05';
            porCuenta.set(cuenta, round((porCuenta.get(cuenta) ?? 0) + toInventory));
          }
        }
        aCosto = round(aCosto + toCostOfSales);
        return { itemCode: m.itemCode, warehouseCode: m.warehouseCode, quantity: m.quantity, baseValue: m.value, share, toInventory, toCostOfSales };
      });
      const asiento: JournalLine[] = [...Array.from(porCuenta, ([cuenta, v]) => ledgerLine(cuenta, v))];
      if (aCosto) asiento.push(ledgerLine('5.01', aCosto));
      if (aVariacion) asiento.push(ledgerLine('6.05', aVariacion));
      asiento.push(ledgerLine(d.paymentAccount, 0, total));
      const journalEntryId = post(d.date, `Costos de importación ${doc.docNumber}`, 'landed', result, asiento);
      state.landedCosts.push({ ...meta(result), landedCostNumber: result, documentId: doc.id, documentNumber: doc.docNumber, date: d.date, allocation: d.allocation, costs: d.costs, total, lines: lineas, journalEntryId });
      award('landed-cost', 200, result, 'Primer costeo de importación');
      break;
    }
    case 'opportunity': {
      const d = command.data;
      const cliente = state.customers.find(c => c.cardCode === d.cardCode); if (!cliente) throw new Error('Cliente o lead inexistente.');
      const probabilidad = { prospecto: 10, calificado: 25, propuesta: 50, negociacion: 75, ganada: 100, perdida: 0 }[d.stage];
      assert(d.stage !== 'perdida' || d.lossReason.trim().length >= 5, 'Registra el motivo de la pérdida: es la información más valiosa para mejorar.');
      const cerrada = d.stage === 'ganada' || d.stage === 'perdida';
      const existente = d.id ? state.opportunities.find(o => o.id === d.id) : undefined;
      if (d.id) assert(existente, 'Oportunidad inexistente.');
      if (existente) {
        Object.assign(existente, { name: d.name, cardCode: d.cardCode, cardName: cliente.name, amount: d.amount, stage: d.stage, probability: probabilidad, expectedClose: d.expectedClose, source: d.source, notes: d.notes, lossReason: d.lossReason, closedAt: cerrada ? existente.closedAt || now : '', updatedAt: now });
        result = existente.id;
      } else {
        result = next('OPO');
        state.opportunities.push({ ...meta(result), opportunityNumber: result, name: d.name, cardCode: d.cardCode, cardName: cliente.name, amount: d.amount, stage: d.stage, probability: probabilidad, expectedClose: d.expectedClose, source: d.source, notes: d.notes, lossReason: d.lossReason, closedAt: cerrada ? now : '' });
      }
      award('crm', 100, result, 'Primera oportunidad comercial');
      if (d.stage === 'ganada') award('crm-won', 200, result, 'Primera oportunidad ganada');
      break;
    }
    case 'companySettings': {
      const d = command.data;
      const codigos = new Set(d.warehouses.map(w => w.code));
      assert(codigos.size === d.warehouses.length, 'Código de almacén repetido.');
      for (const w of profile.warehouses) {
        const usado = state.warehouseStock.some(s => s.warehouseCode === w.code && s.quantity !== 0);
        assert(codigos.has(w.code) || !usado, `No se puede eliminar el almacén ${w.code}: tiene existencias.`);
      }
      // Un RUC con estructura imposible (provincia, tercer dígito, cédula base) se rechaza al guardar; el dígito
      // verificador de una sociedad solo advierte porque el SRI ha emitido RUC que no cumplen el módulo 11.
      const rucRevisado = revisarIdentificacion(d.ruc); assert(!rucRevisado.error, rucRevisado.error ?? '');
      Object.assign(profile, { address: d.address ?? profile.address ?? '', phone: d.phone ?? profile.phone ?? '', regimen: d.regimen ?? profile.regimen ?? 'general', companyName: d.companyName, ruc: d.ruc, incomeTaxRate: d.incomeTaxRate, warehouses: d.warehouses });
      result = uid; break;
    }
    case 'serviceContract': {
      const d = command.data; const cliente = state.customers.find(c => c.cardCode === d.cardCode); if (!cliente) throw new Error('Cliente inexistente.');
      result = next('CS', d.startDate);
      state.serviceContracts.push({ ...meta(result), contractNumber: result, cardCode: d.cardCode, cardName: cliente.name, type: d.type, startDate: d.startDate, endDate: d.endDate, monthlyFee: d.monthlyFee, responseHours: d.responseHours, coverage: d.coverage, status: 'active' });
      award('service-contract', 100, result, 'Primer contrato de servicio'); break;
    }
    case 'serviceCall': {
      const d = command.data; const cliente = state.customers.find(c => c.cardCode === d.cardCode); if (!cliente) throw new Error('Cliente inexistente.');
      const dia = d.openedAt.slice(0, 10);
      // Si el cliente tiene contrato vigente, la llamada hereda su SLA; si no, se atiende sin compromiso de tiempo.
      const contrato = state.serviceContracts.find(k => k.cardCode === d.cardCode && k.status === 'active' && k.startDate <= dia && k.endDate >= dia);
      result = next('LS', dia);
      state.serviceCalls.push({ ...meta(result), callNumber: result, cardCode: d.cardCode, cardName: cliente.name, subject: d.subject, itemCode: d.itemCode, priority: d.priority, status: 'abierta', technician: '', contractId: contrato?.id ?? '', openedAt: d.openedAt, resolvedAt: '', resolution: '', hoursWorked: 0, responseHours: contrato?.responseHours ?? 0, slaMet: null });
      award('service-call', 100, result, 'Primera llamada de servicio'); break;
    }
    case 'serviceCallUpdate': {
      const d = command.data; const llamada = state.serviceCalls.find(x => x.id === d.id); if (!llamada) throw new Error('Llamada inexistente.');
      assert(llamada.status !== 'cerrada', 'La llamada ya está cerrada.');
      const orden: Record<string, number> = { abierta: 0, en_proceso: 1, resuelta: 2, cerrada: 3 };
      assert(orden[d.status] >= orden[llamada.status], 'Una llamada no puede volver a un estado anterior.');
      if (d.status === 'resuelta' || d.status === 'cerrada') assert(d.resolution.trim().length >= 10, 'Describe la solución aplicada (mínimo 10 caracteres).');
      if (d.status !== 'abierta') assert(d.technician.trim().length >= 2, 'Asigna un técnico.');
      Object.assign(llamada, { status: d.status, technician: d.technician, resolution: d.resolution, hoursWorked: d.hoursWorked, updatedAt: now });
      if ((d.status === 'resuelta' || d.status === 'cerrada') && !llamada.resolvedAt) {
        llamada.resolvedAt = d.at;
        const horas = (Date.parse(d.at) - Date.parse(llamada.openedAt)) / 3_600_000;
        llamada.slaMet = llamada.responseHours ? horas <= llamada.responseHours : null;
      }
      result = llamada.id; break;
    }
    case 'project': {
      const d = command.data; const cliente = state.customers.find(c => c.cardCode === d.cardCode); if (!cliente) throw new Error('Cliente inexistente.');
      assert(d.endDate >= d.startDate, 'La fecha de fin debe ser posterior al inicio.');
      result = next('PRY', d.startDate);
      state.projects.push({ ...meta(result), projectNumber: result, name: d.name, cardCode: d.cardCode, cardName: cliente.name, startDate: d.startDate, endDate: d.endDate, budget: d.budget, hourlyCost: d.hourlyCost, status: 'activo', stages: d.stages.map(s => ({ ...s, actualHours: 0, done: false })), expenses: [] });
      award('project', 100, result, 'Primer proyecto'); break;
    }
    case 'projectProgress': {
      const d = command.data; const p = state.projects.find(x => x.id === d.id); if (!p) throw new Error('Proyecto inexistente.');
      assert(p.status === 'activo', 'El proyecto está cerrado.');
      const etapa = p.stages[d.stage]; if (!etapa) throw new Error('Etapa inexistente.');
      etapa.actualHours = round(etapa.actualHours + d.hours); etapa.done = d.done;
      if (d.expense && d.expense.amount > 0) p.expenses.push(d.expense);
      if (d.close) { assert(p.stages.every(s => s.done), 'Para cerrar el proyecto todas las etapas deben estar terminadas.'); p.status = 'cerrado'; }
      p.updatedAt = now; result = p.id; break;
    }
    case 'teamUser': {
      const d = command.data; const existente = d.userCode ? state.teamUsers.find(u => u.userCode === d.userCode) : undefined;
      if (d.userCode) assert(existente, 'Usuario inexistente.');
      if (existente) { Object.assign(existente, { name: d.name, role: d.role, permissions: d.permissions, active: d.active, updatedAt: now }); result = existente.userCode; }
      else { result = next('USR'); state.teamUsers.push({ ...meta(result), userCode: result, name: d.name, role: d.role, permissions: d.permissions, active: d.active }); }
      award('team-user', 100, result, 'Primer usuario del equipo'); break;
    }
    case 'routing': {
      const d = command.data; assert(state.items.some(i => i.itemCode === d.itemCode), 'Artículo inexistente.');
      assert(new Set(d.operations.map(o => o.seq)).size === d.operations.length, 'Secuencia de operación repetida.');
      const ops = [...d.operations].sort((a, b) => a.seq - b.seq);
      const existente = state.routings.find(r => r.itemCode === d.itemCode);
      if (existente) { existente.operations = ops; existente.updatedAt = now; result = existente.id; }
      else { result = `RUTA-${d.itemCode}`; state.routings.push({ ...meta(result), itemCode: d.itemCode, operations: ops }); }
      award('routing', 100, result, 'Primera ruta de fabricación'); break;
    }
    case 'importMasterData': {
      const d = command.data;
      // Cada fila pasa por la misma validación que crearla a mano; si una falla, no se importa ninguna.
      let parcial: CompanyState = state; const creados: string[] = [];
      d.rows.forEach((fila, i) => {
        const parsed = commandSchema.safeParse({ action: d.kind, data: fila });
        if (!parsed.success) throw new Error(`Fila ${i + 1}: ${parsed.error.issues.map(x => mensajeValidacion(x)).join('; ')}`);
        try { const out = applyCommand(parcial, parsed.data, uid, email, now); parcial = out.state; creados.push(out.result); }
        catch (e) { throw new Error(`Fila ${i + 1}: ${e instanceof Error ? e.message : 'no válida'}`); }
      });
      // Se conserva el mismo objeto `profile`: el motor lo sigue actualizando después del switch (XP, nivel…).
      Object.assign(profile, parcial.profile);
      Object.assign(state, { ...parcial, profile });
      result = `${creados.length} registros importados`;
      award('dtw', 200, creados[0] ?? '', 'Primera importación masiva');
      break;
    }
    case 'missionComplete': { const mission = state.missions.find(m => m.id === command.data.id); if (!mission) throw new Error('Misión inexistente.'); mission.status = 'completed'; mission.updatedAt = now; result = mission.id; break; }
  }
  const linkedCycle = (records: (SalesDocument | PurchaseDocument)[], types: DocType[]): boolean => records.filter(d => d.docType === types[types.length - 1]).some(end => {
    let current = end;
    for (let i = types.length - 2; i >= 0; i--) { const prev = records.find(d => d.id === current.baseDocumentId && d.docType === types[i]); if (!prev) return false; current = prev; } return true;
  });
  if (linkedCycle(state.salesOrders, ['quotation', 'order', 'delivery', 'invoice'])) award('sales-cycle', 300, result, 'Ciclo COT → PV → ENT → FAC');
  if (linkedCycle(state.purchaseOrders, ['purchase_request', 'purchase_order', 'goods_receipt', 'vendor_invoice'])) award('purchase-cycle', 300, result, 'Ciclo SC → PC → EM → FP');
  const summary = financialSummary(trialBalance(state.chartOfAccounts, state.journalEntries, '0000-00-00', '9999-12-31'));
  if (state.journalEntries.length && summary.assets > 0 && summary.difference === 0) award('balance', 500, result, 'Balance cuadrado con actividad');
  const fullSales = profile.xpHistory.some(e => e.key === 'sales-cycle') && state.salesOrders.some(d => d.docType === 'credit_note') && state.bankTransactions.some(t => t.type === 'deposit' && t.documentId);
  const fullPurchases = profile.xpHistory.some(e => e.key === 'purchase-cycle') && state.purchaseOrders.some(d => d.docType === 'debit_note') && state.bankTransactions.some(t => t.type === 'payment' && t.documentId);
  for (const [module, complete] of [['Ventas', fullSales], ['Compras', fullPurchases], ['Producción', state.productionOrders.some(o => o.status === 'closed')], ['Nómina', state.payrollRuns.length > 0], ['SRI', state.sriDocuments.some(d => d.status === 'AUTORIZADO')]] as const) {
    if (complete) { award(`module-${module}`, 1000, result, `Módulo ${module} completo`); if (!profile.completedModules.includes(module)) profile.completedModules.push(module); }
  }
  profile.level = profile.xp >= 10000 ? 5 : profile.xp >= 6000 ? 4 : profile.xp >= 3000 ? 3 : profile.xp >= 1000 ? 2 : 1;
  profile.documentCount = state.salesOrders.length + state.purchaseOrders.length + state.journalEntries.length + state.sriDocuments.length + state.payrollRuns.length;
  profile.updatedAt = now;
  return { state, result };
}
