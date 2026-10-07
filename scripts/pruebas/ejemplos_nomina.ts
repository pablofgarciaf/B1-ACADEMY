/**
 * Calcula con el motor real los ejemplos de nómina que usan las clases (para que cifras de clase y simulador coincidan).
 *   npx tsx scripts/pruebas/ejemplos_nomina.ts
 */
import { payrollLine } from '../../src/lib/company-calculations';

const base = { personalRate: 9.45, employerRate: 12.15, vacationDays: 15, contract: 'indefinite', schedule: 'full', active: true };
const casos = [
  { titulo: 'María Gómez, Contadora: 900, ingresó 01/03/2024, 10 h extras al 50 %, anticipo 100, reserva mensualizada',
    emp: { ...base, firstName: 'María', lastName: 'Gómez', baseSalary: 900, hireDate: '2024-03-01', thirteenthMonthly: false, fourteenthMonthly: false, reserveMonthly: true },
    input: { employeeCode: 'E002', days: 30, extra50: 10, extra100: 0, commissions: 0, otherIncome: 0, advances: 100, otherDeductions: 0 } },
  { titulo: 'Ana Silva, Asistente: 482, ingresó 15/01/2026 (sin fondos de reserva aún), décimos mensualizados',
    emp: { ...base, firstName: 'Ana', lastName: 'Silva', baseSalary: 482, hireDate: '2026-01-15', thirteenthMonthly: true, fourteenthMonthly: true, reserveMonthly: true },
    input: { employeeCode: 'E004', days: 30, extra50: 0, extra100: 0, commissions: 0, otherIncome: 0, advances: 0, otherDeductions: 0 } },
  { titulo: 'Carlos López, Jefe de Bodega: 750, ingresó 10/06/2023, 8 h al 100 %, décimos acumulados',
    emp: { ...base, firstName: 'Carlos', lastName: 'López', baseSalary: 750, hireDate: '2023-06-10', thirteenthMonthly: false, fourteenthMonthly: false, reserveMonthly: false },
    input: { employeeCode: 'E003', days: 30, extra50: 0, extra100: 8, commissions: 0, otherIncome: 0, advances: 0, otherDeductions: 0 } },
];

for (const c of casos) {
  const l = payrollLine(c.emp as never, c.input, '2026-04', 482) as unknown as Record<string, number>;
  console.log('\n' + c.titulo);
  for (const k of ['salary', 'overtime50', 'overtime100', 'contributory', 'thirteenth', 'fourteenth', 'reserves', 'thirteenthProvision', 'fourteenthProvision', 'reserveProvision', 'vacationProvision', 'personalIESS', 'employerIESS', 'income', 'deductions', 'net']) console.log('  ', k.padEnd(20), l[k]);
}
