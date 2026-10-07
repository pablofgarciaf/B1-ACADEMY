/**
 * Pruebas del motor tributario avanzado (ICE, RIMPE, retenciones recibidas, utilidades, impuesto a la renta, anticipo, ISD).
 *   npx tsx scripts/pruebas/motor_impuestos.ts
 */
import { applyCommand } from '../../src/lib/company-engine';
import { emptyCompany, type CompanyState } from '../../src/lib/firestore-types';
import { comandosB1Center, comandoStock } from '../../src/lib/b1-center-datos';
import type { CompanyCommand } from '../../src/lib/company-commands';
import { defaultATS } from '../../src/lib/company-defaults';

let ok = 0; let mal = 0;
const check = (n: string, c: boolean, extra = '') => { if (c) ok++; else mal++; console.log(c ? '✔' : '✘', n, c ? '' : extra); };
const sub = (v: number) => Math.round(v * 100) / 100;

function nuevaEmpresa() {
  let s: CompanyState = emptyCompany(); let reloj = Date.parse('2026-12-01T15:00:00.000Z');
  const run = (cmd: unknown): string => { reloj += 5000; const r = applyCommand(s, cmd as CompanyCommand, 'u1', 'a@b.c', new Date(reloj).toISOString()); s = r.state; return r.result; };
  const falla = (cmd: unknown): string => { try { run(cmd); return 'NO FALLÓ'; } catch (e) { return (e as Error).message; } };
  for (const c of comandosB1Center()) run(c);
  for (const it of s.items) run(comandoStock(it.itemCode)); // igual que crearB1Center: 20 unidades por artículo en la bodega central
  return { get s() { return s; }, run, falla };
}
const rucValido = (b9: string) => { const k = [4, 3, 2, 7, 6, 5, 4, 3, 2]; const r = k.reduce((a, c, i) => a + c * Number(b9[i]), 0) % 11; return b9 + (r === 0 ? 0 : 11 - r) + '001'; };
const articulo = (name: string, ice: string, precio: number, costo: number) => ({ action: 'item', data: { ice, name, type: 'inventory', group: 'General', purchaseUnit: 'UND', salesUnit: 'UND', price: precio, price2: precio, price3: precio, maxDiscount: 100, purchasePrice: costo, preferredVendor: '', weight: 0, length: 0, width: 0, height: 0, costingMethod: 'average', standardCost: costo, minStock: 0, maxStock: 1000, reorderPoint: 0, description: name, specifications: '', active: true } });
const linea = (itemCode: string, cantidad: number, precio: number, iva = 15) => ({ itemCode, description: itemCode, quantity: cantidad, unit: 'UND', price: precio, discount: 0, taxRate: iva, warehouseCode: '01' });
const doc = (cardCode: string, lineas: unknown[], fecha = '2026-03-10') => ({ date: fecha, dueDate: fecha, cardCode, reference: '', comments: '', baseDocumentId: '', lines: lineas });
const deposito = (cuenta: string, monto: number, contra = '3.01', fecha = '2026-01-05', extra: Record<string, unknown> = {}) => ({ action: 'bank', data: { bankAccountId: cuenta, type: 'deposit', amount: monto, date: fecha, reference: 'DEP', counterpartAccount: contra, documentId: '', ...extra } });

// ═══════════ ICE ═══════════
{
  const t = nuevaEmpresa(); const cli = t.s.customers[0].cardCode; const prov = t.s.vendors[0].cardCode;
  const perfume = t.run(articulo('Perfume Eau 100ml', 'perfumes', 100, 60)); const cigs = t.run(articulo('Cigarrillo rubio (unidad)', 'cigarrillos', 0.5, 0.2));
  const normal = t.s.items[0].itemCode;
  check('el artículo guarda su tipo de ICE', t.s.items.find(i => i.itemCode === perfume)?.ice === 'perfumes');
  // compra de perfumes: el ICE entra al costo del inventario
  t.run({ action: 'purchase', data: { docType: 'vendor_invoice', document: doc(prov, [linea(perfume, 5, 50)]) } });
  const fp = t.s.purchaseOrders.at(-1)!;
  check('compra de perfumes: base 250 + ICE 20 % (50) + IVA 15 % sobre 300 (45) = 345', fp.subtotal === 250 && fp.ice === 50 && fp.tax === 45 && fp.total === 345, `${fp.subtotal}/${fp.ice}/${fp.tax}/${fp.total}`);
  const stockP = t.s.warehouseStock.find(x => x.itemCode === perfume && x.warehouseCode === '01')!;
  check('el ICE de la compra se capitaliza en el inventario (5 u × 60 = 300)', stockP.quantity === 5 && stockP.value === 300, `${stockP.quantity}/${stockP.value}`);
  const asC = t.s.journalEntries.find(j => j.id === fp.journalEntryId)!;
  check('asiento de compra con ICE cuadra', asC.totalDebit === asC.totalCredit && asC.totalDebit === 345, `${asC.totalDebit}/${asC.totalCredit}`);
  // venta: el navegador no puede fijar el ICE
  t.run({ action: 'sales', data: { docType: 'invoice', document: doc(cli, [{ ...linea(perfume, 2, 100), ice: 0 }]) } });
  const fv = t.s.salesOrders.at(-1)!;
  check('venta de perfumes: base 200 + ICE 40 + IVA 36 = 276 (el ICE lo fija el artículo)', fv.subtotal === 200 && fv.ice === 40 && fv.tax === 36 && fv.total === 276, `${fv.subtotal}/${fv.ice}/${fv.tax}/${fv.total}`);
  const asV = t.s.journalEntries.find(j => j.id === fv.journalEntryId)!;
  check('el ICE vendido se acredita en ICE por pagar (2.1.11)', asV.lines.some(l => l.accountCode === '2.1.11' && l.credit === 40));
  check('cliente debe 276', t.s.customers.find(c => c.cardCode === cli)!.balance === 276);
  // comprobante electrónico con ICE: el SRI de pruebas lo autoriza porque base + ICE + IVA = total
  const det = { matrixAddress: 'Quito', establishmentAddress: 'Quito', accountingRequired: true };
  t.run({ action: 'sri', data: { docType: '01', date: '2026-03-10', partnerCode: cli, sourceDocumentId: fv.id, series: '001-001', retentionLines: [], ats: defaultATS(), details: det } });
  const xmlIce = t.s.sriDocuments.at(-1)!;
  check('XML con ICE: impuesto código 3, código 3610, valor 40 e IVA sobre base + ICE', xmlIce.xml.includes('<codigo>3</codigo>') && xmlIce.xml.includes('<codigoPorcentaje>3610</codigoPorcentaje>') && xmlIce.xml.includes('<valor>40.00</valor>') && xmlIce.xml.includes('<baseImponible>240.00</baseImponible>'));
  t.run({ action: 'authorize', data: { id: xmlIce.id } });
  check('el SRI de pruebas autoriza la factura con ICE', t.s.sriDocuments.find(d => d.id === xmlIce.id)!.status === 'AUTORIZADO', JSON.stringify(t.s.sriDocuments.find(d => d.id === xmlIce.id)!.sriMessages?.filter(m => m.tipo === 'ERROR')));
  // cigarrillos: específico por unidad
  t.run({ action: 'stock', data: { itemCode: cigs, warehouseCode: '01', qty: 500, costingMethod: 'average' } });
  t.run({ action: 'sales', data: { docType: 'invoice', document: doc(cli, [linea(cigs, 100, 0.5)]) } });
  const fc = t.s.salesOrders.at(-1)!;
  check('cigarrillos: 100 u × USD 0,16 = 16 de ICE; IVA sobre 50 + 16 = 9,90', fc.ice === 16 && fc.tax === 9.9 && fc.total === 75.9, `${fc.ice}/${fc.tax}/${fc.total}`);
  t.run({ action: 'sales', data: { docType: 'invoice', document: doc(cli, [linea(normal, 1, 850)]) } });
  check('un artículo sin ICE no genera ICE', t.s.salesOrders.at(-1)!.ice === 0);
}

// ═══════════ RIMPE ═══════════
{
  const t = nuevaEmpresa(); const art = t.s.items[0].itemCode;
  const socio = (name: string, b9: string, rimpe: string) => ({ action: 'vendor', data: { rimpe, name, ruc: rucValido(b9), email: '', phone: '', address: 'Quito', city: 'Quito', contactName: '', currency: 'USD', paymentTermsDays: 0, creditLimit: 0, active: true, group: 'Nacional', notes: '' } });
  const popular = t.run(socio('Tienda Doña Rosa', '171000001', 'popular')); const emprendedor = t.run(socio('Taller Andino', '171000002', 'emprendedor'));
  check('compra con IVA 15 % a un Negocio Popular → rechazada', t.falla({ action: 'purchase', data: { docType: 'vendor_invoice', document: doc(popular, [linea(art, 1, 100, 15)]) } }).includes('no cobra IVA'));
  check('compra a un Negocio Popular con IVA 0 % → aceptada', t.falla({ action: 'purchase', data: { docType: 'vendor_invoice', document: doc(popular, [linea(art, 2, 50, 0)]) } }) === 'NO FALLÓ');
  const fpop = t.s.purchaseOrders.at(-1)!;
  const ret = (prov: string, factura: string, lineas: unknown[]) => ({ action: 'sri', data: { docType: '07', date: '2026-03-10', partnerCode: prov, sourceDocumentId: factura, series: '001-001', retentionLines: lineas, ats: defaultATS(), details: { supportNumber: '001-001-000000555', matrixAddress: 'Quito', establishmentAddress: 'Quito', accountingRequired: true } } });
  check('retención de renta del 2 % a un Negocio Popular → rechazada (es 0 %)', t.falla(ret(popular, fpop.id, [{ code: 'IR-312', tax: 'IR', base: 100, rate: 2 }])).includes('Negocio Popular'));
  t.run({ action: 'purchase', data: { docType: 'vendor_invoice', document: doc(emprendedor, [linea(art, 4, 100, 15)]) } });
  const femp = t.s.purchaseOrders.at(-1)!;
  check('retención del 2 % a un RIMPE Emprendedor → rechazada (es 1 %, código 343)', t.falla(ret(emprendedor, femp.id, [{ code: 'IR-312', tax: 'IR', base: 400, rate: 2 }])).includes('343'));
  check('retención del 1 % (343) a un RIMPE Emprendedor → aceptada', t.falla(ret(emprendedor, femp.id, [{ code: 'IR-343', tax: 'IR', base: 400, rate: 1 }])) === 'NO FALLÓ');
  // la empresa como Negocio Popular
  t.run({ action: 'companySettings', data: { companyName: 'B1 Center', ruc: '1792456789001', incomeTaxRate: 25, regimen: 'rimpe-popular', warehouses: t.s.profile!.warehouses } });
  check('empresa RIMPE Negocio Popular: no puede cobrar IVA', t.falla({ action: 'sales', data: { docType: 'invoice', document: doc(t.s.customers[0].cardCode, [linea(art, 1, 100, 15)]) } }).includes('Negocio Popular'));
  check('empresa RIMPE Negocio Popular: nota de venta sin IVA → aceptada', t.falla({ action: 'sales', data: { docType: 'invoice', document: doc(t.s.customers[0].cardCode, [linea(art, 1, 100, 0)]) } }) === 'NO FALLÓ');
  const nv = t.s.salesOrders.at(-1)!;
  t.run({ action: 'companySettings', data: { companyName: 'B1 Center', ruc: '1792456789001', incomeTaxRate: 25, regimen: 'rimpe-emprendedor', warehouses: t.s.profile!.warehouses } });
  t.run({ action: 'sales', data: { docType: 'invoice', document: doc(t.s.customers[1].cardCode, [linea(art, 1, 100, 15)]) } });
  t.run({ action: 'sri', data: { docType: '01', date: '2026-03-10', partnerCode: t.s.customers[1].cardCode, sourceDocumentId: t.s.salesOrders.at(-1)!.id, series: '001-001', retentionLines: [], ats: defaultATS(), details: { matrixAddress: 'Quito', establishmentAddress: 'Quito', accountingRequired: false } } });
  check('RIMPE Emprendedor: el XML lleva la leyenda de contribuyente RIMPE', t.s.sriDocuments.at(-1)!.xml.includes('<contribuyenteRimpe>CONTRIBUYENTE RÉGIMEN RIMPE</contribuyenteRimpe>'));
  t.run({ action: 'companySettings', data: { companyName: 'B1 Center', ruc: '1792456789001', incomeTaxRate: 25, regimen: 'rimpe-popular', warehouses: t.s.profile!.warehouses } });
  check('empresa RIMPE Negocio Popular: no emite factura electrónica', t.falla({ action: 'sri', data: { docType: '01', date: '2026-03-10', partnerCode: t.s.customers[0].cardCode, sourceDocumentId: nv.id, series: '001-001', retentionLines: [], ats: defaultATS(), details: { matrixAddress: 'Quito', establishmentAddress: 'Quito', accountingRequired: false } } }).includes('nota de venta'));
}

// ═══════════ RETENCIONES RECIBIDAS ═══════════
{
  const t = nuevaEmpresa(); const cli = t.s.customers[0].cardCode; const art = t.s.items[0].itemCode;
  t.run({ action: 'sales', data: { docType: 'invoice', document: doc(cli, [linea(art, 1, 1000)]) } });
  const f = t.s.salesOrders.at(-1)!;
  check('factura de 1.150 (1.000 + IVA 150)', f.total === 1150);
  check('retenciones sin factura → rechazadas', t.falla(deposito('BAN-1', 100, '1.1.03', '2026-03-20', { retentionIR: 5 })).includes('factura'));
  const e = t.falla(deposito('BAN-1', 1085, '1.1.03', '2026-03-20', { documentId: f.id, retentionIR: 20, retentionIVA: 45 }));
  check('cobro de 1.085 + retención de renta 20 + de IVA 45 liquida la factura', e === 'NO FALLÓ' && t.s.salesOrders.find(d => d.id === f.id)!.status === 'closed', e);
  const asBanco = t.s.journalEntries.at(-1)!;
  check('asiento: banco 1.085, crédito tributario renta 20 e IVA 45 contra clientes 1.150', asBanco.lines.some(l => l.accountCode === '1.1.02' && l.debit === 1085) && asBanco.lines.some(l => l.accountCode === '1.1.10' && l.debit === 20) && asBanco.lines.some(l => l.accountCode === '1.1.11' && l.debit === 45) && asBanco.lines.some(l => l.accountCode === '1.1.03' && l.credit === 1150), JSON.stringify(asBanco.lines));
  check('el cliente queda en cero', t.s.customers.find(c => c.cardCode === cli)!.balance === 0);
}

// ═══════════ UTILIDADES, IMPUESTO A LA RENTA Y ANTICIPO ═══════════
{
  const t = nuevaEmpresa();
  const empleado = (nombre: string, cedula: string, ingreso: string, cargas: number) => ({ action: 'employee', data: { firstName: nombre, lastName: 'X', identification: cedula, position: 'Analista', department: 'Op', hireDate: ingreso, contract: 'indefinite', schedule: 'full', baseSalary: 600, employerRate: 12.15, personalRate: 9.45, thirteenthMonthly: false, fourteenthMonthly: false, reserveMonthly: false, vacationDays: 15, dependents: cargas, projectedExpenses: 0, active: true } });
  // empresa con solo dos empleados: se reemplazan los de B1 Center
  const dos = nuevaEmpresa(); void dos;
  const u = nuevaEmpresa();
  u.s.employees.splice(0, u.s.employees.length);
  u.run(empleado('Ana', '1710034065', '2020-01-10', 2)); u.run(empleado('Beto', '1712345675', '2021-05-03', 0));
  check('sin utilidad no hay participación', u.falla({ action: 'profitShare', data: { year: 2026, date: '2026-12-31', profit: 0 } }).includes('No hay utilidad'));
  u.run({ action: 'profitShare', data: { year: 2026, date: '2026-12-31', profit: 10000 } });
  const par = u.s.taxRuns.find(r => r.kind === 'utilidades')!;
  check('15 % de 10.000 = 1.500; Ana (2 cargas) 1.000 y Beto 500', par.figures.participacion === 1500 && par.lines.find(l => l.label.startsWith('Ana'))?.value === '1000.00' && par.lines.find(l => l.label.startsWith('Beto'))?.value === '500.00', JSON.stringify(par.lines.map(l => l.value)));
  const asUt = u.s.journalEntries.find(j => j.id === par.journalEntryId)!;
  check('asiento de utilidades: gasto 6.06 contra utilidades por pagar 2.1.09, cuadrado', asUt.lines.some(l => l.accountCode === '6.06' && l.debit === 1500) && asUt.lines.some(l => l.accountCode === '2.1.09' && l.credit === 1500) && asUt.totalDebit === asUt.totalCredit);
  check('las utilidades de un año se calculan una sola vez', u.falla({ action: 'profitShare', data: { year: 2026, date: '2026-12-31', profit: 10000 } }).includes('ya fueron calculadas'));

  // tope de 24 SBU por trabajador
  const g = nuevaEmpresa(); g.s.employees.splice(0, g.s.employees.length);
  g.run(empleado('Ana', '1710034065', '2020-01-10', 0)); g.run(empleado('Beto', '1712345675', '2021-05-03', 0));
  g.run({ action: 'profitShare', data: { year: 2026, date: '2026-12-31', profit: 1000000 } });
  const pg = g.s.taxRuns.find(r => r.kind === 'utilidades')!;
  check('tope de 24 SBU (11.568) por trabajador; el excedente va al IESS', pg.figures.tope === 11568 && pg.figures.pagar === 23136 && pg.figures.excesoAlIESS === sub(150000 - 23136), JSON.stringify(pg.figures));

  // impuesto a la renta y anticipo (en la empresa u)
  check('IR sin calcular utilidades → rechazado', g.falla({ action: 'incomeTaxClose', data: { year: 2025, date: '2025-12-31' } }).includes('utilidades'));
  u.run(deposito('BAN-1', 5000, '3.01', '2026-02-01'));
  u.run({ action: 'bank', data: { bankAccountId: 'BAN-1', type: 'payment', amount: 300, date: '2026-07-10', reference: 'Anticipo julio', counterpartAccount: '1.1.09', documentId: '' } });
  u.run({ action: 'sales', data: { docType: 'invoice', document: doc(u.s.customers[0].cardCode, [linea(u.s.items[0].itemCode, 1, 1000)], '2026-04-10') } });
  u.run(deposito('BAN-1', 1085, '1.1.03', '2026-04-20', { documentId: u.s.salesOrders.at(-1)!.id, retentionIR: 20, retentionIVA: 45 }));
  u.run({ action: 'incomeTaxClose', data: { year: 2026, date: '2026-12-31' } });
  const renta = u.s.taxRuns.find(r => r.kind === 'renta')!;
  check('IR: base = 10.000 − 1.500 = 8.500; 25 % = 2.125', renta.figures.base === 8500 && renta.figures.ir === 2125, JSON.stringify(renta.figures));
  check('IR a pagar = 2.125 − anticipo 300 − retenciones 20 = 1.805', renta.figures.anticipo === 300 && renta.figures.retenciones === 20 && renta.figures.pagar === 1805, JSON.stringify(renta.figures));
  const asIR = u.s.journalEntries.find(j => j.id === renta.journalEntryId)!;
  check('asiento del IR: 6.07 contra 1.1.09, 1.1.10 y 2.1.10, cuadrado', asIR.lines.some(l => l.accountCode === '6.07' && l.debit === 2125) && asIR.lines.some(l => l.accountCode === '2.1.10' && l.credit === 1805) && asIR.totalDebit === asIR.totalCredit, JSON.stringify(asIR.lines));
  check('el IR de un año se cierra una sola vez', u.falla({ action: 'incomeTaxClose', data: { year: 2026, date: '2026-12-31' } }).includes('ya fue calculado'));
  u.run({ action: 'incomeTaxAdvance', data: { year: 2026, date: '2027-01-15' } });
  const ant = u.s.taxRuns.find(r => r.kind === 'anticipo')!;
  check('anticipo = 50 % × 2.125 − retenciones 20 = 1.042,50 en dos cuotas de 521,25', ant.figures.anticipo === 1042.5 && ant.figures.cuota === 521.25, JSON.stringify(ant.figures));
  const rimpe = nuevaEmpresa(); rimpe.run({ action: 'companySettings', data: { companyName: 'B1 Center', ruc: '1792456789001', incomeTaxRate: 25, regimen: 'rimpe-emprendedor', warehouses: rimpe.s.profile!.warehouses } });
  rimpe.run({ action: 'profitShare', data: { year: 2026, date: '2026-12-31', profit: 1000 } });
  check('los RIMPE no usan la tarifa general de sociedades', rimpe.falla({ action: 'incomeTaxClose', data: { year: 2026, date: '2026-12-31' } }).includes('RIMPE'));
}

// ═══════════ ISD ═══════════
{
  const t = nuevaEmpresa(); const prov = t.s.vendors[0].cardCode; const art = t.s.items[0].itemCode;
  t.run(deposito('BAN-1', 5000, '3.01', '2026-01-05'));
  t.run({ action: 'purchase', data: { docType: 'vendor_invoice', document: doc(prov, [linea(art, 2, 400)]) } });
  const pago = (extra: Record<string, unknown>) => ({ action: 'foreignPayment', data: { date: '2026-03-15', bankAccountId: 'BAN-1', concept: 'Licencia de software', destination: 'servicio', vendorCode: '', amount: 1000, tarifa: '5', imputacion: 'gasto', reference: 'SWIFT-1', ...extra } });
  t.run(pago({}));
  const asS = t.s.journalEntries.at(-1)!;
  check('ISD 5 % de 1.000 = 50: gasto 1.000 + ISD 50 contra banco 1.050', asS.lines.some(l => l.accountCode === '6.03' && l.debit === 1000) && asS.lines.some(l => l.accountCode === '6.08' && l.debit === 50) && asS.lines.some(l => l.accountCode === '1.1.02' && l.credit === 1050), JSON.stringify(asS.lines));
  check('el banco baja 1.050', t.s.bankAccounts.find(b => b.id === 'BAN-1')!.balance === 3950, String(t.s.bankAccounts.find(b => b.id === 'BAN-1')!.balance));
  check('ISD como crédito tributario en un servicio → rechazado', t.falla(pago({ imputacion: 'credito' })).includes('importación'));
  t.run(pago({ destination: 'importacion', imputacion: 'credito', vendorCode: prov, concept: 'Importación de laptops', amount: 800, tarifa: '2.5' }));
  const asI = t.s.journalEntries.at(-1)!;
  check('importación con tarifa reducida 2,5 %: ISD 20 como crédito tributario (1.1.12) y baja la deuda con el proveedor', asI.lines.some(l => l.accountCode === '1.1.12' && l.debit === 20) && asI.lines.some(l => l.accountCode === '2.1.01' && l.debit === 800), JSON.stringify(asI.lines));
  t.run(pago({ amount: 100, tarifa: '0', concept: 'Medicinas', destination: 'importacion', imputacion: 'gasto' }));
  check('tarifa 0 % (farmacéutico): ISD 0', t.s.taxRuns.filter(r => r.kind === 'isd').at(-1)!.figures.isd === 0);
  check('sin saldo suficiente para pago + ISD → rechazado', t.falla(pago({ amount: 3000 })).includes('Saldo bancario insuficiente'));
  check('una tarifa inventada → rechazada', t.falla(pago({ tarifa: '7' })).includes('no vigente'));
}

// ═══════════ MIGRACIÓN: una empresa creada antes de estas cuentas las recibe sola ═══════════
{
  const t = nuevaEmpresa();
  const nuevas = ['1.1.09', '1.1.10', '1.1.11', '1.1.12', '2.1.09', '2.1.10', '2.1.11', '6.06', '6.07', '6.08'];
  t.s.chartOfAccounts.splice(0, t.s.chartOfAccounts.length, ...t.s.chartOfAccounts.filter(a => !nuevas.includes(a.code)));
  check('empresa antigua: no tiene las cuentas nuevas', !t.s.chartOfAccounts.some(a => nuevas.includes(a.code)));
  t.run(deposito('BAN-1', 100, '3.01', '2026-01-05'));
  check('al operar, el motor le agrega las cuentas faltantes sin tocar las existentes', nuevas.every(c => t.s.chartOfAccounts.some(a => a.code === c && a.postable)) && t.s.chartOfAccounts.filter(a => a.code === '1.1.01').length === 1);
}

console.log(`\n${ok} correctas, ${mal} fallidas`);
if (mal) process.exit(1);
