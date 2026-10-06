import type { CompanyState, JournalLine, TrialBalanceRow } from './firestore-types';
import { financialSummary, round, trialBalance, usd } from './company-calculations';

/** Porcentaje con coma decimal (formato Ecuador) para los textos de lectura. */
const pctTxt = (n: number) => n.toLocaleString('es-EC', { maximumFractionDigits: 1 });

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

/* ───────────── Antigüedad de saldos: quién nos debe / a quién debemos, y desde cuándo ───────────── */

export const TRAMOS = ['Por vencer', '1–30 días', '31–60 días', '61–90 días', 'Más de 90'] as const;
export interface FilaAntiguedad { cardCode: string; nombre: string; tramos: number[]; total: number }
export interface Antiguedad { tipo: 'cobrar' | 'pagar'; corte: string; filas: FilaAntiguedad[]; totales: number[]; total: number; vencidoPct: number; alertas: string[]; preguntas: string[] }

function tramo(diasVencido: number) {
  if (diasVencido <= 0) return 0;
  if (diasVencido <= 30) return 1;
  if (diasVencido <= 60) return 2;
  if (diasVencido <= 90) return 3;
  return 4;
}

export function antiguedadSaldos(state: CompanyState, corte: string, tipo: 'cobrar' | 'pagar'): Antiguedad {
  const docs = tipo === 'cobrar'
    ? state.salesOrders.filter(d => d.docType === 'invoice')
    : state.purchaseOrders.filter(d => d.docType === 'vendor_invoice' || d.docType === 'debit_note');
  const notas = tipo === 'cobrar' ? state.salesOrders.filter(d => d.docType === 'credit_note') : [];
  const porSocio = new Map<string, FilaAntiguedad>();
  for (const d of docs) {
    if (d.date > corte || d.status !== 'open') continue;
    const acreditado = notas.filter(n => n.baseDocumentId === d.id && n.date <= corte).reduce((s, n) => s + n.total, 0);
    const pendiente = round(d.total - d.paidAmount - acreditado);
    if (pendiente <= 0.009) continue;
    const t = d.dueDate >= corte ? 0 : tramo(diasEntre(d.dueDate, corte) - 1);
    const fila = porSocio.get(d.cardCode) ?? { cardCode: d.cardCode, nombre: d.cardName, tramos: [0, 0, 0, 0, 0], total: 0 };
    fila.tramos[t] = round(fila.tramos[t] + pendiente);
    fila.total = round(fila.total + pendiente);
    porSocio.set(d.cardCode, fila);
  }
  const filas = [...porSocio.values()].sort((a, b) => b.total - a.total);
  const totales = [0, 1, 2, 3, 4].map(i => round(filas.reduce((s, f) => s + f.tramos[i], 0)));
  const total = round(totales.reduce((s, v) => s + v, 0));
  const vencidoPct = total > 0 ? round(((total - totales[0]) / total) * 100) : 0;

  const alertas: string[] = [];
  const quien = tipo === 'cobrar' ? 'clientes' : 'proveedores';
  if (totales[4] > 0) alertas.push(tipo === 'cobrar'
    ? `Hay ${usd(totales[4])} con más de 90 días de atraso: probabilidad real de no cobrarlos. Evalúa provisionar cuentas incobrables.`
    : `Debes ${usd(totales[4])} con más de 90 días de atraso: riesgo de que te corten el crédito o el abastecimiento.`);
  if (vencidoPct >= 30) alertas.push(`El ${pctTxt(vencidoPct)} % del saldo con ${quien} está vencido.`);
  const mayor = filas[0];
  if (mayor && total > 0 && mayor.total / total >= 0.5) alertas.push(`${mayor.nombre} concentra el ${pctTxt((mayor.total / total) * 100)} % del saldo.`);

  const preguntas = tipo === 'cobrar'
    ? ['¿A qué cliente llamarías primero y qué le ofrecerías para que pague?', '¿Seguirías vendiéndole a crédito al cliente con más atraso? ¿Con qué condiciones?', '¿Qué cambiarías en la política de crédito para que esto no se repita?']
    : ['¿Qué proveedor es crítico para tu operación y debe pagarse primero?', '¿Conviene negociar un plan de pagos o pedir un préstamo para ponerse al día?', '¿Qué pasa con tus ventas si un proveedor clave deja de despacharte?'];
  return { tipo, corte, filas, totales, total, vencidoPct, alertas, preguntas };
}

/* ───────────── Flujo de caja (método directo) desde los asientos de Caja y Bancos ───────────── */

export type Actividad = 'Operación' | 'Inversión' | 'Financiamiento';
export interface FlujoCaja { desde: string; hasta: string; saldoInicial: number; entradas: number; salidas: number; saldoFinal: number; categorias: { categoria: string; actividad: Actividad; monto: number }[]; porActividad: Record<Actividad, number>; lectura: string[]; preguntas: string[] }

const esCaja = (cuenta: string) => cuenta === '1.1.01' || cuenta === '1.1.02';

function clasificar(contrapartida: string): { categoria: string; actividad: Actividad } {
  if (contrapartida === '1.1.03') return { categoria: 'Cobros a clientes', actividad: 'Operación' };
  if (contrapartida === '2.1.01' || contrapartida === '2.1.06') return { categoria: 'Pagos a proveedores', actividad: 'Operación' };
  if (['2.1.04', '2.1.05', '2.1.07', '2.1.08', '1.1.08', '6.01', '6.02', '6.04'].includes(contrapartida)) return { categoria: 'Nómina y beneficios', actividad: 'Operación' };
  if (['2.1.02', '2.1.03', '1.1.06'].includes(contrapartida)) return { categoria: 'Impuestos (IVA y retenciones)', actividad: 'Operación' };
  if (contrapartida.startsWith('1.2.')) return { categoria: 'Compra/venta de activos fijos', actividad: 'Inversión' };
  if (contrapartida.startsWith('2.2.')) return { categoria: 'Préstamos', actividad: 'Financiamiento' };
  if (contrapartida.startsWith('3.')) return { categoria: 'Aportes y retiros de socios', actividad: 'Financiamiento' };
  if (contrapartida.startsWith('4.')) return { categoria: 'Ventas de contado', actividad: 'Operación' };
  return { categoria: 'Otros gastos e ingresos operativos', actividad: 'Operación' };
}

export function flujoCaja(state: CompanyState, desde: string, hasta: string): FlujoCaja {
  let saldoInicial = 0; let entradas = 0; let salidas = 0;
  const categorias = new Map<string, { categoria: string; actividad: Actividad; monto: number }>();
  for (const e of state.journalEntries) {
    if (e.date > hasta) continue;
    const delta = round(e.lines.filter(l => esCaja(l.accountCode)).reduce((s, l) => s + l.debit - l.credit, 0));
    if (!delta) continue;
    if (e.date < desde) { saldoInicial += delta; continue; }
    if (delta > 0) entradas += delta; else salidas -= delta;
    // La contrapartida es la línea que no es caja con mayor importe en el asiento.
    const otras: JournalLine[] = e.lines.filter(l => !esCaja(l.accountCode)).sort((a, b) => (b.debit + b.credit) - (a.debit + a.credit));
    const c = clasificar(otras[0]?.accountCode ?? '');
    const fila = categorias.get(c.categoria) ?? { ...c, monto: 0 };
    fila.monto = round(fila.monto + delta);
    categorias.set(c.categoria, fila);
  }
  const lista = [...categorias.values()].sort((a, b) => Math.abs(b.monto) - Math.abs(a.monto));
  const porActividad: Record<Actividad, number> = { 'Operación': 0, 'Inversión': 0, 'Financiamiento': 0 };
  for (const c of lista) porActividad[c.actividad] = round(porActividad[c.actividad] + c.monto);
  saldoInicial = round(saldoInicial); entradas = round(entradas); salidas = round(salidas);
  const saldoFinal = round(saldoInicial + entradas - salidas);

  const lectura: string[] = [];
  if (porActividad['Operación'] > 0) lectura.push('La operación genera caja: el negocio se financia a sí mismo.');
  if (porActividad['Operación'] < 0 && porActividad['Financiamiento'] > 0) lectura.push('La operación consume caja y el hueco se tapa con préstamos o aportes: sostenible solo por un tiempo.');
  if (porActividad['Operación'] < 0 && porActividad['Financiamiento'] <= 0) lectura.push('La operación consume caja y no hay financiamiento que la cubra: el saldo de bancos se está agotando.');
  if (saldoFinal < 0) lectura.push('El saldo final es negativo: en la vida real serían cheques rebotados o sobregiro bancario.');

  const preguntas = [
    '¿La utilidad del estado de resultados se parece al flujo de operación? Si no, ¿dónde quedó el dinero (cuentas por cobrar, inventario)?',
    'Si mañana no pudieras pedir préstamos, ¿cuántos meses aguantaría la empresa con este ritmo de salidas?',
    '¿Qué pago podrías postergar y cuál nunca deberías atrasar? ¿Por qué?',
  ];
  return { desde, hasta, saldoInicial, entradas, salidas, saldoFinal, categorias: lista, porActividad, lectura, preguntas };
}

/* ───────────── Análisis de compras: a quién, qué y a qué precio compramos ───────────── */

export interface CompraProveedor { cardCode: string; nombre: string; monto: number; participacion: number; documentos: number }
export interface CompraArticulo { itemCode: string; descripcion: string; cantidad: number; monto: number; precioMin: number; precioMax: number; precioPromedio: number; dispersionPct: number }
export interface AnalisisCompras { total: number; proveedores: CompraProveedor[]; articulos: CompraArticulo[]; pedidosAbiertos: number; recibidoSinFactura: number; lectura: string[]; preguntas: string[] }

export function analisisCompras(state: CompanyState, desde: string, hasta: string): AnalisisCompras {
  const facturas = state.purchaseOrders.filter(d => (d.docType === 'vendor_invoice' || d.docType === 'debit_note') && d.date >= desde && d.date <= hasta);
  const total = round(facturas.reduce((s, d) => s + d.subtotal, 0));
  const porProveedor = new Map<string, CompraProveedor>();
  const porArticulo = new Map<string, { itemCode: string; descripcion: string; cantidad: number; monto: number; precios: number[] }>();
  for (const d of facturas) {
    const p = porProveedor.get(d.cardCode) ?? { cardCode: d.cardCode, nombre: d.cardName, monto: 0, participacion: 0, documentos: 0 };
    p.monto = round(p.monto + d.subtotal); p.documentos += 1; porProveedor.set(d.cardCode, p);
    if (d.docType !== 'vendor_invoice') continue;
    for (const l of d.lines) {
      const neto = round(l.quantity * l.price * (1 - l.discount / 100));
      const a = porArticulo.get(l.itemCode) ?? { itemCode: l.itemCode, descripcion: l.description, cantidad: 0, monto: 0, precios: [] };
      a.cantidad += l.quantity; a.monto = round(a.monto + neto); a.precios.push(round(neto / l.quantity));
      porArticulo.set(l.itemCode, a);
    }
  }
  const proveedores = [...porProveedor.values()].map(p => ({ ...p, participacion: total > 0 ? round((p.monto / total) * 100) : 0 })).sort((a, b) => b.monto - a.monto);
  const articulos: CompraArticulo[] = [...porArticulo.values()].map(a => {
    const min = Math.min(...a.precios); const max = Math.max(...a.precios); const prom = a.cantidad > 0 ? round(a.monto / a.cantidad) : 0;
    return { itemCode: a.itemCode, descripcion: a.descripcion, cantidad: a.cantidad, monto: a.monto, precioMin: min, precioMax: max, precioPromedio: prom, dispersionPct: min > 0 ? round(((max - min) / min) * 100) : 0 };
  }).sort((a, b) => b.monto - a.monto);
  const pedidosAbiertos = round(state.purchaseOrders.filter(d => d.docType === 'purchase_order' && d.status === 'open').reduce((s, d) => s + d.subtotal, 0));
  const recibidoSinFactura = round(state.purchaseOrders.filter(d => d.docType === 'goods_receipt' && d.status === 'open').reduce((s, d) => s + d.subtotal, 0));

  const lectura: string[] = [];
  if (proveedores[0] && proveedores[0].participacion >= 60) lectura.push(`Dependes de ${proveedores[0].nombre} para el ${pctTxt(proveedores[0].participacion)} % de tus compras: si falla, se detiene la operación.`);
  const variable = articulos.find(a => a.dispersionPct >= 10);
  if (variable) lectura.push(`El precio de ${variable.descripcion} varió ${pctTxt(variable.dispersionPct)} % entre compras: hay margen para negociar un precio fijo o comprar en otro momento.`);
  if (recibidoSinFactura > 0) lectura.push(`Hay mercadería recibida sin factura por ${usd(recibidoSinFactura)}: es una deuda real aunque el proveedor no la haya facturado.`);
  if (pedidosAbiertos > 0) lectura.push(`Tienes pedidos de compra abiertos por ${usd(pedidosAbiertos)}: compromisos de caja que llegarán pronto.`);

  const preguntas = [
    '¿Con qué proveedor negociarías primero y qué pedirías: precio, plazo de pago o descuento por volumen?',
    'Si tu proveedor principal subiera precios 10 %, ¿cuánto bajaría tu margen bruto? ¿Lo trasladarías al cliente?',
    '¿Conviene tener un segundo proveedor aunque sea un poco más caro? ¿Qué riesgo reduce?',
  ];
  return { total, proveedores, articulos, pedidosAbiertos, recibidoSinFactura, lectura, preguntas };
}

/* ───────────── Presupuesto vs. real ───────────── */

export interface FilaPresupuesto {
  accountCode: string; nombre: string; tipo: 'income' | 'cost' | 'expense';
  presupuestoMeses: number[]; realMeses: number[];
  presupuestoAcum: number; realAcum: number; desviacion: number; cumplimientoPct: number | null; favorable: boolean;
}
export interface PresupuestoVsReal { year: string; hastaMes: number; filas: FilaPresupuesto[]; utilidadPresupuestada: number; utilidadReal: number; lectura: string[]; preguntas: string[] }

/** `hastaMes` (1-12): se compara el acumulado de enero a ese mes. */
export function presupuestoVsReal(state: CompanyState, year: string, hastaMes: number): PresupuestoVsReal {
  const categoria = new Map(state.chartOfAccounts.map(a => [a.code, a.category]));
  const filas: FilaPresupuesto[] = state.budgets.filter(b => b.year === year).map(b => {
    const tipo = categoria.get(b.accountCode) as FilaPresupuesto['tipo'];
    const realMeses = Array.from({ length: 12 }, () => 0);
    for (const e of state.journalEntries) {
      if (!e.date.startsWith(year)) continue;
      const mes = Number(e.date.slice(5, 7)) - 1;
      for (const l of e.lines) if (l.accountCode === b.accountCode) realMeses[mes] += tipo === 'income' ? l.credit - l.debit : l.debit - l.credit;
    }
    const presupuestoAcum = round(b.months.slice(0, hastaMes).reduce((s, v) => s + v, 0));
    const realAcum = round(realMeses.slice(0, hastaMes).reduce((s, v) => s + v, 0));
    const desviacion = round(realAcum - presupuestoAcum);
    // En ingresos, superar el presupuesto es bueno; en costos y gastos, es malo.
    const favorable = tipo === 'income' ? desviacion >= 0 : desviacion <= 0;
    return {
      accountCode: b.accountCode, nombre: b.accountName, tipo, presupuestoMeses: b.months, realMeses: realMeses.map(round),
      presupuestoAcum, realAcum, desviacion, cumplimientoPct: presupuestoAcum ? round((realAcum / presupuestoAcum) * 100) : null, favorable,
    };
  }).sort((a, b) => a.accountCode.localeCompare(b.accountCode));

  const signo = (f: FilaPresupuesto) => (f.tipo === 'income' ? 1 : -1);
  const utilidadPresupuestada = round(filas.reduce((s, f) => s + signo(f) * f.presupuestoAcum, 0));
  const utilidadReal = round(filas.reduce((s, f) => s + signo(f) * f.realAcum, 0));

  const lectura: string[] = [];
  const peor = [...filas].filter(f => !f.favorable).sort((a, b) => Math.abs(b.desviacion) - Math.abs(a.desviacion))[0];
  if (peor) lectura.push(`La mayor desviación desfavorable está en ${peor.nombre}: ${usd(Math.abs(peor.desviacion))} ${peor.tipo === 'income' ? 'por debajo' : 'por encima'} de lo presupuestado.`);
  const ingresos = filas.filter(f => f.tipo === 'income');
  if (ingresos.length && ingresos.every(f => f.favorable)) lectura.push('Los ingresos cumplen o superan el presupuesto.');
  if (filas.length && utilidadReal < utilidadPresupuestada) lectura.push(`La utilidad real (${usd(utilidadReal)}) está por debajo de la presupuestada (${usd(utilidadPresupuestada)}).`);
  if (filas.length && utilidadReal >= utilidadPresupuestada) lectura.push(`La utilidad real (${usd(utilidadReal)}) cumple la meta presupuestada (${usd(utilidadPresupuestada)}).`);
  if (!filas.length) lectura.push('Todavía no hay presupuesto para este año. Empieza por las ventas, el costo de ventas y los gastos principales.');

  const preguntas = [
    'Cuando una cuenta se desvía, ¿fue un error del presupuesto o de la ejecución? ¿Cómo lo distinguirías?',
    'Si las ventas están bajo el presupuesto, ¿qué gastos recortarías primero para proteger la utilidad y cuáles nunca?',
    '¿Ajustarías el presupuesto de los meses restantes o mantendrías la meta? ¿Qué mensaje le da eso al equipo?',
  ];
  return { year, hastaMes, filas, utilidadPresupuestada, utilidadReal, lectura, preguntas };
}

/* ───────────── Comparativo con el período anterior de igual duración ───────────── */

export interface FilaComparativo { concepto: string; actual: number; anterior: number; variacionPct: number | null; mejorSiSube: boolean; formato: 'usd' | 'porcentaje' | 'dias' }
export interface Comparativo { actual: { desde: string; hasta: string }; anterior: { desde: string; hasta: string }; filas: FilaComparativo[]; lectura: string[] }

function sumarDias(fecha: string, dias: number) {
  const d = new Date(`${fecha}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

export function comparativoPeriodos(state: CompanyState, desde: string, hasta: string): Comparativo {
  const dias = diasEntre(desde, hasta);
  const antHasta = sumarDias(desde, -1);
  const antDesde = sumarDias(antHasta, -(dias - 1));
  const a = analisisGerencial(state, desde, hasta);
  const b = analisisGerencial(state, antDesde, antHasta);
  const ind = (x: AnalisisGerencial, clave: string) => x.indicadores.find(i => i.clave === clave)?.valor ?? 0;
  const fila = (concepto: string, actual: number, anterior: number, mejorSiSube: boolean, formato: FilaComparativo['formato']): FilaComparativo =>
    ({ concepto, actual, anterior, mejorSiSube, formato, variacionPct: anterior === 0 ? null : round(((actual - anterior) / Math.abs(anterior)) * 100) });
  const filas = [
    fila('Ventas', a.cifras.ventas, b.cifras.ventas, true, 'usd'),
    fila('Utilidad bruta', a.cifras.utilidadBruta, b.cifras.utilidadBruta, true, 'usd'),
    fila('Gastos operacionales', a.cifras.gastos, b.cifras.gastos, false, 'usd'),
    fila('Utilidad operacional', a.cifras.utilidadOperacional, b.cifras.utilidadOperacional, true, 'usd'),
    fila('Margen bruto', ind(a, 'margenBruto'), ind(b, 'margenBruto'), true, 'porcentaje'),
    fila('Días de cobro', ind(a, 'dso'), ind(b, 'dso'), false, 'dias'),
  ];
  const [ventas, , gastos, operacional] = filas;
  const lectura: string[] = [];
  if (b.cifras.ventas === 0) lectura.push('El período anterior no tiene ventas registradas: el comparativo tendrá sentido cuando haya historia.');
  else {
    if (ventas.variacionPct !== null && gastos.variacionPct !== null && gastos.variacionPct > ventas.variacionPct) lectura.push('Los gastos crecen más rápido que las ventas: la empresa se está volviendo menos eficiente.');
    if ((ventas.variacionPct ?? 0) > 0 && operacional.actual < operacional.anterior) lectura.push('Se vende más pero se gana menos: revisa precios, descuentos y costos.');
    if ((ventas.variacionPct ?? 0) < 0) lectura.push('Las ventas cayeron frente al período anterior: ¿es estacional, perdiste clientes o subió la competencia?');
  }
  return { actual: { desde, hasta }, anterior: { desde: antDesde, hasta: antHasta }, filas, lectura };
}
