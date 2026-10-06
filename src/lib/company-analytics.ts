import type { CompanyState, TrialBalanceRow } from './firestore-types';
import { financialSummary, round, trialBalance } from './company-calculations';

/**
 * Análisis gerencial de la empresa del estudiante.
 * No solo calcula: cada indicador trae su semáforo, qué significa y una pregunta
 * para que el estudiante interprete y decida como lo haría quien dirige la empresa.
 */

export type Semaforo = 'verde' | 'amarillo' | 'rojo' | 'sin-datos';
export type Formato = 'veces' | 'porcentaje' | 'dias';
export type Area = 'Liquidez' | 'Solvencia' | 'Rentabilidad' | 'Eficiencia' | 'Riesgo comercial';

export interface Indicador {
  clave: string;
  area: Area;
  nombre: string;
  valor: number | null;
  formato: Formato;
  semaforo: Semaforo;
  formula: string;
  referencia: string;
  significado: string;
  pregunta: string;
}

export interface AnalisisGerencial {
  desde: string;
  hasta: string;
  dias: number;
  cifras: {
    ventas: number; costoVentas: number; utilidadBruta: number; gastos: number; utilidadOperacional: number; utilidadNeta: number;
    activoCorriente: number; inventario: number; cuentasPorCobrar: number; efectivo: number; activoTotal: number;
    pasivoCorriente: number; cuentasPorPagar: number; pasivoTotal: number; patrimonio: number;
  };
  indicadores: Indicador[];
  diagnostico: string[];
  decisiones: string[];
  suficientesDatos: boolean;
}

/**
 * Rangos de referencia del semáforo. `mayorEsMejor` indica la dirección.
 * Con `rango`, el valor sano está DENTRO de [min, max] y se tolera `holgura` a cada lado
 * (p. ej. días de pago: pagar muy rápido estrangula la caja, pagar demasiado tarde rompe con el proveedor).
 */
type Umbral = { verde: number; amarillo: number; mayorEsMejor: boolean } | { rango: [number, number]; holgura: number };

function semaforo(valor: number | null, u: Umbral): Semaforo {
  if (valor === null || !Number.isFinite(valor)) return 'sin-datos';
  if ('rango' in u) {
    const [min, max] = u.rango;
    if (valor >= min && valor <= max) return 'verde';
    return valor >= min - u.holgura && valor <= max + u.holgura ? 'amarillo' : 'rojo';
  }
  if (u.mayorEsMejor) return valor >= u.verde ? 'verde' : valor >= u.amarillo ? 'amarillo' : 'rojo';
  return valor <= u.verde ? 'verde' : valor <= u.amarillo ? 'amarillo' : 'rojo';
}

const div = (a: number, b: number): number | null => (b === 0 ? null : a / b);
const saldo = (rows: TrialBalanceRow[], prefijo: string) => round(rows.filter(r => r.accountCode.startsWith(prefijo)).reduce((s, r) => s + r.closing, 0));
const movimiento = (rows: TrialBalanceRow[], prefijo: string) => round(rows.filter(r => r.accountCode.startsWith(prefijo)).reduce((s, r) => s + r.debit - r.credit, 0));

function diasEntre(desde: string, hasta: string) {
  const ms = new Date(`${hasta}T00:00:00`).getTime() - new Date(`${desde}T00:00:00`).getTime();
  return Math.max(1, Math.round(ms / 86_400_000) + 1);
}

export function analisisGerencial(state: CompanyState, desde: string, hasta: string): AnalisisGerencial {
  const rows = trialBalance(state.chartOfAccounts, state.journalEntries, desde, hasta);
  const balance = financialSummary(rows, state.profile?.incomeTaxRate);
  const dias = diasEntre(desde, hasta);

  // Estado de resultados del período (movimientos) y balance a la fecha de corte (saldos).
  const ventas = -movimiento(rows, '4.01');
  const otrosIngresos = -movimiento(rows, '4.02');
  const costoVentas = movimiento(rows, '5.');
  const gastos = movimiento(rows, '6.');
  const utilidadBruta = round(ventas - costoVentas);
  const utilidadOperacional = round(utilidadBruta - gastos);
  const antesImpuestos = round(utilidadOperacional + otrosIngresos);
  const impuesto = round(Math.max(0, antesImpuestos) * (state.profile?.incomeTaxRate ?? 25) / 100);
  const utilidadNeta = round(antesImpuestos - impuesto);

  const activoCorriente = saldo(rows, '1.1.');
  const inventario = round(saldo(rows, '1.1.05') + saldo(rows, '1.1.07'));
  const cuentasPorCobrar = round(saldo(rows, '1.1.03') + saldo(rows, '1.1.04'));
  const efectivo = round(saldo(rows, '1.1.01') + saldo(rows, '1.1.02'));
  const activoTotal = balance.assets;
  const pasivoCorriente = -saldo(rows, '2.1.');
  const cuentasPorPagar = -saldo(rows, '2.1.01');
  const pasivoTotal = balance.liabilities;
  const patrimonio = round(balance.equity + balance.profit);

  // Concentración: qué parte de lo facturado depende del cliente más grande.
  const facturado = new Map<string, number>();
  for (const d of state.salesOrders) {
    if (d.date < desde || d.date > hasta) continue;
    const signo = d.docType === 'invoice' ? 1 : d.docType === 'credit_note' ? -1 : 0;
    if (signo) facturado.set(d.cardCode, (facturado.get(d.cardCode) ?? 0) + signo * d.subtotal);
  }
  const totalFacturado = [...facturado.values()].reduce((s, v) => s + v, 0);
  const mayorCliente = Math.max(0, ...facturado.values());

  const dso = cuentasPorCobrar > 0 && ventas > 0 ? (cuentasPorCobrar / ventas) * dias : ventas > 0 ? 0 : null;
  const dio = inventario > 0 && costoVentas > 0 ? (inventario / costoVentas) * dias : costoVentas > 0 ? 0 : null;
  const dpo = cuentasPorPagar > 0 && costoVentas > 0 ? (cuentasPorPagar / costoVentas) * dias : costoVentas > 0 ? 0 : null;
  const ciclo = dso !== null && dio !== null && dpo !== null ? dso + dio - dpo : null;

  const pct = (v: number | null) => (v === null ? null : v * 100);
  const def = (
    clave: string, area: Area, nombre: string, valor: number | null, formato: Formato, u: Umbral,
    formula: string, referencia: string, significado: string, pregunta: string,
  ): Indicador => ({ clave, area, nombre, valor: valor === null ? null : round(valor), formato, semaforo: semaforo(valor, u), formula, referencia, significado, pregunta });

  const indicadores: Indicador[] = [
    def('liquidez', 'Liquidez', 'Liquidez corriente', div(activoCorriente, pasivoCorriente), 'veces', { verde: 1.5, amarillo: 1, mayorEsMejor: true },
      'Activo corriente ÷ Pasivo corriente', 'Sana desde 1,5; menos de 1 es alerta',
      'Cuántos dólares de bienes de corto plazo tiene la empresa por cada dólar que debe pagar en el corto plazo.',
      'Si los proveedores exigieran pago inmediato mañana, ¿la empresa podría cumplir sin vender activos fijos ni endeudarse?'),
    def('acida', 'Liquidez', 'Prueba ácida', div(activoCorriente - inventario, pasivoCorriente), 'veces', { verde: 1, amarillo: 0.7, mayorEsMejor: true },
      '(Activo corriente − Inventarios) ÷ Pasivo corriente', 'Sana desde 1',
      'Igual que la liquidez, pero sin contar el inventario, que puede tardar en convertirse en dinero.',
      '¿Cuánto de la liquidez depende de vender el inventario? ¿Qué pasa si ese inventario se vuelve obsoleto?'),
    def('endeudamiento', 'Solvencia', 'Endeudamiento', pct(div(pasivoTotal, activoTotal)), 'porcentaje', { verde: 50, amarillo: 70, mayorEsMejor: false },
      'Pasivo total ÷ Activo total', 'Prudente hasta 50 %; sobre 70 % es riesgoso',
      'Qué parte de los bienes de la empresa está financiada con deuda y no con dinero de los dueños.',
      'Si los bancos subieran la tasa de interés, ¿cuánto afectaría a la utilidad? ¿Conviene más deuda o más capital?'),
    def('margenBruto', 'Rentabilidad', 'Margen bruto', pct(div(utilidadBruta, ventas)), 'porcentaje', { verde: 30, amarillo: 15, mayorEsMejor: true },
      'Utilidad bruta ÷ Ventas', 'Depende del sector; en distribución, 25–35 %',
      'De cada dólar vendido, cuánto queda después de pagar lo que costó el producto.',
      '¿El margen bajo se debe a precios de venta muy bajos o a costos de compra altos? ¿Qué harías primero?'),
    def('margenOperacional', 'Rentabilidad', 'Margen operacional', pct(div(utilidadOperacional, ventas)), 'porcentaje', { verde: 10, amarillo: 0, mayorEsMejor: true },
      'Utilidad operacional ÷ Ventas', 'Positivo siempre; sano desde 10 %',
      'Lo que deja el negocio principal después de pagar costos, nómina y gastos administrativos.',
      'Si este margen es bajo pero el bruto es bueno, ¿qué gastos revisarías y cuáles no tocarías?'),
    def('margenNeto', 'Rentabilidad', 'Margen neto', pct(div(utilidadNeta, ventas)), 'porcentaje', { verde: 5, amarillo: 0, mayorEsMejor: true },
      'Utilidad neta ÷ Ventas', 'Positivo; sano desde 5 %',
      'Lo que realmente gana la empresa por cada dólar vendido, después de impuestos.',
      '¿Vender más siempre aumenta la utilidad? ¿En qué caso vender más podría hacer perder dinero?'),
    def('roe', 'Rentabilidad', 'Rentabilidad del patrimonio (ROE)', pct(div(utilidadNeta, patrimonio)), 'porcentaje', { verde: 15, amarillo: 5, mayorEsMejor: true },
      'Utilidad neta ÷ Patrimonio', 'Atractivo sobre 15 % anual',
      'Cuánto rinde el dinero que pusieron los dueños. Compáralo con lo que daría una inversión sin riesgo.',
      'Si una póliza bancaria paga 6 % anual, ¿vale la pena el riesgo de este negocio para los socios?'),
    def('dso', 'Eficiencia', 'Días de cobro', dso, 'dias', { verde: 45, amarillo: 60, mayorEsMejor: false },
      'Cuentas por cobrar ÷ Ventas × días del período', 'Hasta 45 días; sobre 60 es alerta',
      'Cuántos días tardan los clientes, en promedio, en pagar lo que compran.',
      '¿Qué pasaría con la caja si las ventas crecen 20 % pero los clientes siguen pagando con la misma demora?'),
    def('dio', 'Eficiencia', 'Días de inventario', dio, 'dias', { verde: 60, amarillo: 90, mayorEsMejor: false },
      'Inventario ÷ Costo de ventas × días del período', 'Hasta 60 días en distribución',
      'Cuántos días permanece la mercadería en bodega antes de venderse.',
      '¿Qué artículos están inmovilizando dinero? ¿Comprarías menos cantidad más seguido aunque cueste más por unidad?'),
    def('dpo', 'Eficiencia', 'Días de pago a proveedores', dpo, 'dias', { rango: [30, 60], holgura: 30 },
      'Cuentas por pagar ÷ Costo de ventas × días del período', 'Sano entre 30 y 60 días; sobre 90 indica atrasos',
      'Cuántos días de financiamiento gratuito te dan los proveedores.',
      '¿Negociarías más plazo con los proveedores o un descuento por pronto pago? ¿Qué conviene más a la caja?'),
    def('ciclo', 'Eficiencia', 'Ciclo de conversión de efectivo', ciclo, 'dias', { verde: 45, amarillo: 90, mayorEsMejor: false },
      'Días de cobro + Días de inventario − Días de pago', 'Mientras más corto, mejor',
      'Cuántos días pasan desde que pagas la mercadería hasta que el cliente te paga a ti. Esos días los financia la empresa.',
      'Si tuvieras que reducir este ciclo 15 días, ¿atacarías el cobro, el inventario o el pago? ¿Por qué?'),
    def('concentracion', 'Riesgo comercial', 'Dependencia del mayor cliente', pct(totalFacturado > 0 ? mayorCliente / totalFacturado : null), 'porcentaje', { verde: 30, amarillo: 50, mayorEsMejor: false },
      'Ventas al mayor cliente ÷ Ventas facturadas', 'Riesgo alto sobre 50 %',
      'Qué parte de lo facturado depende de un solo cliente.',
      'Si ese cliente se va a la competencia, ¿cuánto cae la venta? ¿Qué harías hoy para no depender de él?'),
  ];

  const nombres = (s: Semaforo) => indicadores.filter(i => i.semaforo === s).map(i => i.nombre.toLowerCase());
  const diagnostico: string[] = [];
  const rojos = nombres('rojo'); const amarillos = nombres('amarillo'); const verdes = nombres('verde');
  if (rojos.length) diagnostico.push(`Alertas críticas: ${rojos.join(', ')}. Son la prioridad de la gerencia.`);
  if (amarillos.length) diagnostico.push(`En observación: ${amarillos.join(', ')}.`);
  if (verdes.length) diagnostico.push(`Fortalezas: ${verdes.join(', ')}.`);
  if (utilidadBruta > 0 && utilidadOperacional < 0) diagnostico.push('El producto deja margen, pero los gastos se lo comen: el problema está en la estructura de gastos, no en el precio.');
  if (utilidadNeta > 0 && efectivo <= 0) diagnostico.push('La empresa gana dinero en papel pero no tiene caja: típico cuando se vende a crédito y se cobra lento. Utilidad no es lo mismo que efectivo.');
  if (dso !== null && dpo !== null && dso > dpo + 30) diagnostico.push('Cobras mucho más lento de lo que pagas: la empresa está financiando a sus clientes con su propia caja.');
  if (dpo !== null && dpo > 90) diagnostico.push('Las deudas con proveedores se acumulan sin pagarse. El ciclo de efectivo parece bueno, pero es una ilusión: se sostiene con atrasos que pueden costar el crédito y el abastecimiento.');

  const decisiones = [
    '¿Cuál de las alertas resolverías primero y qué indicador esperas que mejore como consecuencia?',
    'Propón una acción concreta (precio, crédito, compras o gastos) y explica qué riesgo asumes al tomarla.',
    'Si fueras el banco, ¿le prestarías dinero a esta empresa con estos números? Justifica con dos indicadores.',
  ];

  const suficientesDatos = state.journalEntries.length > 0 && ventas > 0;
  return {
    desde, hasta, dias,
    cifras: { ventas, costoVentas, utilidadBruta, gastos, utilidadOperacional, utilidadNeta, activoCorriente, inventario, cuentasPorCobrar, efectivo, activoTotal, pasivoCorriente, cuentasPorPagar, pasivoTotal, patrimonio },
    indicadores, diagnostico, decisiones, suficientesDatos,
  };
}
