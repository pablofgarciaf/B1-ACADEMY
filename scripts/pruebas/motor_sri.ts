import { applyCommand } from '../../src/lib/company-engine';
import { emptyCompany } from '../../src/lib/firestore-types';
import { comandosB1Center } from '../../src/lib/b1-center-datos';
import { revisarIdentificacion, digitoModulo11, impuestoRenta, topeGastosPersonales, retencionIREmpleado } from '../../src/lib/sri-catalogo';
import { construirRIDE } from '../../src/lib/sri-ride';
import { defaultATS } from '../../src/lib/company-defaults';

let s = emptyCompany(); let reloj = Date.parse('2026-10-07T15:00:00.000Z');
const run = (cmd: any) => { reloj += 5000; const r = applyCommand(s, cmd, 'u1', 'a@b.c', new Date(reloj).toISOString()); s = r.state; return r.result; };
const falla = (cmd: any) => { try { run(cmd); return 'NO FALLÓ'; } catch (e: any) { return e.message as string; } };
let ok = 0, mal = 0; const check = (n: string, c: boolean, extra = '') => { if (c) ok++; else mal++; console.log(c ? '✔' : '✘', n, c ? '' : extra); };

for (const c of comandosB1Center()) run(c);
for (const p of [...s.customers, ...s.vendors]) check('RUC semilla válido ' + p.ruc, !revisarIdentificacion(p.ruc).error && !revisarIdentificacion(p.ruc).aviso, JSON.stringify(revisarIdentificacion(p.ruc)));
check('RUC empresa válido', JSON.stringify(revisarIdentificacion(s.profile!.ruc)) === '{}');
check('cédula válida 1710034065', JSON.stringify(revisarIdentificacion('1710034065')) === '{}', JSON.stringify(revisarIdentificacion('1710034065')));
check('cédula inválida 1710034066', !!revisarIdentificacion('1710034066').error);
check('consumidor final', JSON.stringify(revisarIdentificacion('9999999999999')) === '{}');

const hoy = '2026-10-07'; const prov = s.vendors[0]; const item = s.items[0]; const cli = s.customers[0];
const ats = defaultATS();
const linea = { itemCode: item.itemCode, description: 'Laptop', quantity: 2, unit: 'UND', price: 500, discount: 0, taxRate: 15, warehouseCode: '01' };
run({ action: 'purchase', data: { docType: 'vendor_invoice', document: { date: hoy, dueDate: hoy, cardCode: prov.cardCode, reference: '001-001-000000123', comments: '', baseDocumentId: '', lines: [linea] } } });
const fac = s.purchaseOrders.find(d => d.docType === 'vendor_invoice')!;
check('factura proveedor 1000 + IVA 150', fac.subtotal === 1000 && fac.tax === 150 && fac.total === 1150, `${fac.subtotal}/${fac.tax}`);
const det = { supportNumber: '001-001-000000123', matrixAddress: 'Av. Amazonas N34, Quito', establishmentAddress: 'Av. Amazonas N34, Quito', accountingRequired: true };
const ret = (lines: any[]) => ({ action: 'sri', data: { docType: '07', date: hoy, partnerCode: prov.cardCode, sourceDocumentId: fac.id, series: '001-001', retentionLines: lines, ats, details: det } });

const eIVA = falla(ret([{ code: 'IVA-30', tax: 'IVA', base: 1000, rate: 30 }]));
check('IVA retenido sobre la base → rechazado', eIVA.includes('sobre el IVA'), eIVA);
const eViejo = falla(ret([{ code: 'IR-BIENES', tax: 'IR', base: 1000, rate: 1 }]));
check('código 2025 (IR-BIENES 1 %) → rechazado', eViejo.includes('no está vigente'), eViejo);

run(ret([{ code: 'IR-312', tax: 'IR', base: 1000, rate: 37 }, { code: 'IVA-30', tax: 'IVA', base: 150, rate: 30 }]));
const r = s.sriDocuments.at(-1)!;
check('% lo fija el servidor: 2 % renta + 30 % IVA = 65', r.totalRetention === 65, String(r.totalRetention));
check('XML con código 312 y código IVA 1', r.xml.includes('<codigoRetencion>312</codigoRetencion>') && r.xml.includes('<codigoRetencion>1</codigoRetencion>'));
check('clave 49 dígitos y módulo 11', /^\d{49}$/.test(r.claveAcceso) && digitoModulo11(r.claveAcceso.slice(0, 48)) === +r.claveAcceso[48]);
run({ action: 'authorize', data: { id: r.id } });
const ra = s.sriDocuments.find(x => x.id === r.id)!;
check('retención AUTORIZADO', ra.status === 'AUTORIZADO', ra.status + ' ' + JSON.stringify(ra.sriMessages));
const as = s.journalEntries.find(j => j.id === ra.journalEntryId);
check('asiento CxP 65 / Retenciones por pagar 65', !!as && as.lines.some(l => l.accountCode === '2.1.01' && l.debit === 65) && as.lines.some(l => l.accountCode === '2.1.03' && l.credit === 65), JSON.stringify(as?.lines));
const fac2 = s.purchaseOrders.find(d => d.id === fac.id)!;
check('saldo a pagar al proveedor 1085', Math.round((fac2.total - fac2.paidAmount) * 100) / 100 === 1085, String(fac2.total - fac2.paidAmount));
const vb = s.vendors.find(v => v.cardCode === prov.cardCode)!.balance;
check('proveedor debe 1085', vb === 1085, String(vb));
check('reenviar autorizado → bloqueado', falla({ action: 'authorize', data: { id: r.id } }).includes('ya está autorizado'));
check('segunda retención misma factura → bloqueada', falla(ret([{ code: 'IR-312', tax: 'IR', base: 1, rate: 2 }])).includes('ya tiene'));

const cta = s.chartOfAccounts.find(c => c.postable && c.code === '1.1.01')!.code;
const ePago = falla({ action: 'bank', data: { bankAccountId: 'BAN-1', type: 'deposit', amount: 2000, date: hoy, reference: 'DEP', counterpartAccount: cta } });
check('depósito inicial', ePago === 'NO FALLÓ', ePago);
const ePago2 = falla({ action: 'bank', data: { bankAccountId: 'BAN-1', type: 'withdrawal', amount: 1085, date: hoy, reference: 'TRF-1', counterpartAccount: '', documentId: fac.id } });
check('pagar 1085 cierra la factura', ePago2 === 'NO FALLÓ' && s.purchaseOrders.find(d => d.id === fac.id)!.status === 'closed', ePago2);

run({ action: 'sales', data: { docType: 'invoice', document: { date: hoy, dueDate: hoy, cardCode: cli.cardCode, reference: '', comments: '', baseDocumentId: '', lines: [{ ...linea, quantity: 1, price: 850, taxRate: 15 }, { ...linea, quantity: 1, price: 100, taxRate: 8 }] } } });
const fv = s.salesOrders.find(d => d.docType === 'invoice')!;
check('venta 950 + IVA 127.50 + 8 = 135.50', fv.tax === 135.5 && fv.total === 1085.5, `${fv.tax}/${fv.total}`);
run({ action: 'sri', data: { docType: '01', date: hoy, partnerCode: cli.cardCode, sourceDocumentId: fv.id, series: '001-001', retentionLines: [], ats, details: det } });
const f01 = s.sriDocuments.at(-1)!;
check('XML factura incluye IVA 8 % (código 8)', f01.xml.includes('<codigoPorcentaje>8</codigoPorcentaje>'));
run({ action: 'authorize', data: { id: f01.id } });
const fa = s.sriDocuments.find(x => x.id === f01.id)!;
check('factura AUTORIZADO', fa.status === 'AUTORIZADO', fa.status + ' ' + JSON.stringify(fa.sriMessages));
const ride = construirRIDE(s, fa, '<svg></svg>');
check('RIDE con número, clave y total, sin style=""', ride.includes(fa.number) && ride.includes(fa.claveAcceso) && ride.includes(fv.total.toFixed(2)) && !ride.includes('style="'));

const base = s.customers[1];
const eCli = falla({ action: 'customer', data: { name: 'Juan Pérez', ruc: '1710034066', email: '', phone: '', address: 'Quito', city: 'Quito', contactName: '', currency: 'USD', paymentTermsDays: 0, creditLimit: 0, active: true, group: base.group ?? 'Nacional', notes: '' } });
const juan = s.customers.find(c => c.name === 'Juan Pérez');
check('cliente con cédula mal escrita se puede crear', !!juan, eCli);
if (juan) {
  run({ action: 'stock', data: { itemCode: item.itemCode, warehouseCode: '01', qty: 5, costingMethod: 'average' } });
  run({ action: 'sales', data: { docType: 'invoice', document: { date: hoy, dueDate: hoy, cardCode: juan.cardCode, reference: '', comments: '', baseDocumentId: '', lines: [{ ...linea, quantity: 1, price: 20 }] } } });
  const fj = s.salesOrders.filter(d => d.docType === 'invoice').at(-1)!;
  const sri01 = { action: 'sri', data: { docType: '01', date: hoy, partnerCode: juan.cardCode, sourceDocumentId: fj.id, series: '001-001', retentionLines: [], ats, details: det } };
  run(sri01); const fjx = s.sriDocuments.at(-1)!; run({ action: 'authorize', data: { id: fjx.id } });
  const fjr = s.sriDocuments.find(x => x.id === fjx.id)!;
  check('cédula inválida → NO AUTORIZADO', fjr.status === 'NO AUTORIZADO', JSON.stringify(fjr.sriMessages));
  console.log('   mensaje:', fjr.sriMessages?.[0]?.mensaje);
  const eOtra = falla(sri01);
  check('tras el rechazo se puede emitir otro', eOtra === 'NO FALLÓ', eOtra);
}

// Nómina: los empleados de B1 Center y las cifras que enseña la clase salen del mismo motor
check('B1 Center guarda dirección y teléfono en la ficha de la empresa', s.profile!.address === 'Av. El Salvador N34-12, Quito' && s.profile!.phone === '022345678', `${s.profile!.address}/${s.profile!.phone}`);
check('4 empleados E001..E004 en B1 Center', s.employees.length === 4 && s.employees[0].employeeCode === 'E001' && s.employees[3].employeeCode === 'E004', s.employees.map(e => e.employeeCode).join());
const lineaNomina = (code: string, extra: Partial<{ days: number; extra50: number; extra100: number; advances: number }>) => ({ employeeCode: code, days: 30, extra50: 0, extra100: 0, commissions: 0, otherIncome: 0, advances: 0, otherDeductions: 0, ...extra });
const eNom = falla({ action: 'payroll', data: { period: '2026-04', date: '2026-04-30', sbu: 482, lines: [lineaNomina('E001', {}), lineaNomina('E002', { extra50: 10, advances: 100 }), lineaNomina('E003', { extra100: 8 }), lineaNomina('E004', {})] } });
check('rol de pagos de abril se registra', eNom === 'NO FALLÓ', eNom);
const rol = s.payrollRuns.at(-1)!;
const maria = rol.lines.find(l => l.employeeCode === 'E002')!;
check('María Gómez: ingreso 1035.94 · descuentos 190.37 · neto 845.57', maria.income === 1035.94 && maria.deductions === 190.37 && maria.net === 845.57, `${maria.income}/${maria.deductions}/${maria.net}`);
const ana = rol.lines.find(l => l.employeeCode === 'E004')!;
check('Ana Silva (menos de 1 año): sin fondos de reserva · neto 516.79', ana.reserves === 0 && ana.net === 516.79, `${ana.reserves}/${ana.net}`);
const asientoNomina = s.journalEntries.find(j => j.id === rol.journalEntryId)!;
check('asiento de nómina cuadra', asientoNomina.totalDebit === asientoNomina.totalCredit && asientoNomina.totalDebit > 0, `${asientoNomina.totalDebit}/${asientoNomina.totalCredit}`);
check('un empleado no cobra dos veces el mismo período', falla({ action: 'payroll', data: { period: '2026-04', date: '2026-04-30', sbu: 482, lines: [lineaNomina('E002', {})] } }).includes('ya tiene rol'));
// Impuesto a la renta del empleado (tabla 2026): proyección de este rol × 12, base = gravado − IESS, sin décimos ni reserva
check('IR: sobre la fracción básica no hay impuesto', impuestoRenta(12208) === 0 && impuestoRenta(10000) === 0);
check('IR: 16.299 → 167 + 10 % de 750 = 242', impuestoRenta(16299) === 242, String(impuestoRenta(16299)));
check('IR: 120.000 → 24.572 + 37 % del excedente', impuestoRenta(120000) === Math.round((24572 + (120000 - 109956) * 0.37) * 100) / 100);
check('tope de gastos personales: 7 canastas sin cargas, 20 con 5 o más', topeGastosPersonales(0) === 5752.6 && topeGastosPersonales(5) === 16436 && topeGastosPersonales(9) === 16436, `${topeGastosPersonales(0)}/${topeGastosPersonales(5)}`);
const jIR = retencionIREmpleado(1500, 141.75, 0, 0);
check('Juan con comisión: base 16.299, impuesto 242, retención 20,17/mes', jIR.base === 16299 && jIR.impuesto === 242 && jIR.mensual === 20.17, JSON.stringify(jIR));
const jRebaja = retencionIREmpleado(1500, 141.75, 6000, 1);
check('con gastos de 6.000 y 1 carga: rebaja 18 % = 1.080 > 242 → retención 0', jRebaja.rebaja === 1080 && jRebaja.mensual === 0, JSON.stringify(jRebaja));
run({ action: 'payroll', data: { period: '2026-06', date: '2026-06-30', sbu: 482, lines: [lineaNomina('E001', { }), lineaNomina('E002', {})].map((l, i) => i === 0 ? { ...l, commissions: 300 } : l) } });
const rolJun = s.payrollRuns.at(-1)!; const juan06 = rolJun.lines.find(l => l.employeeCode === 'E001')!;
check('rol de junio de Juan: IR 20.17 y neto 1463.08', juan06.incomeTax === 20.17 && juan06.net === 1463.08, `${juan06.incomeTax}/${juan06.net}`);
const asJun = s.journalEntries.find(j => j.id === rolJun.journalEntryId)!;
check('el IR retenido se acredita en Retenciones por pagar (2.1.03) y el asiento cuadra', asJun.lines.some(l => l.accountCode === '2.1.03' && l.credit === 20.17) && asJun.totalDebit === asJun.totalCredit, JSON.stringify(asJun.lines.filter(l => l.accountCode === '2.1.03')));

check('no se puede repetir el mismo empleado en un rol', falla({ action: 'payroll', data: { period: '2026-05', date: '2026-05-31', sbu: 482, lines: [lineaNomina('E001', {}), lineaNomina('E001', {})] } }).includes('duplicado'));

// Códigos de B1 Center = los que enseñan las clases (Mi Aula y el simulador hablan el mismo idioma)
check('códigos C20000 / V10000 / A00001 como en las clases', s.customers[0].cardCode === 'C20000' && s.customers[4].cardCode === 'C20004' && s.vendors[0].cardCode === 'V10000' && s.vendors[3].cardCode === 'V10003' && s.items[0].itemCode === 'A00001' && s.items[11].itemCode === 'A00012', `${s.customers[0].cardCode} ${s.vendors[0].cardCode} ${s.items[0].itemCode}`);

// RUC de la empresa: el de una empresa nueva es válido y uno imposible se rechaza al guardar
check('RUC por defecto de empresa nueva válido', JSON.stringify(revisarIdentificacion('1790000001001')) === '{}');
const eRuc = falla({ action: 'companySettings', data: { companyName: 'Mi empresa', ruc: '9990000001001', incomeTaxRate: 25, warehouses: s.profile!.warehouses } });
check('RUC con provincia inexistente → rechazado al guardar', eRuc.includes('provincia'), eRuc);

console.log(`\n${ok} correctas, ${mal} fallidas`);
if (mal) process.exit(1);
