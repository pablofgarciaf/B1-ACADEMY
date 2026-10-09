/**
 * Catálogo Oficial de Cuentas bajo NIIF de la Superintendencia de Compañías,
 * Valores y Seguros (SuperCías) del Ecuador.
 *
 * Estructura oficial:
 * Signo: P (Positivo) | N (Negativo / Valuación) | D (Doble)
 * Tipo de Cuenta: T (Total / Título no imputable) | D (Detalle / Imputable para asientos)
 * Tipo de Estado: 1 (Situación Financiera / Balance) | 2 (Resultado Integral) | 3 (Flujos) | 5 (Patrimonio)
 */

export interface SuperciasAccountDef {
  code: string;
  name: string;
  category: 'asset' | 'liability' | 'equity' | 'income' | 'cost' | 'expense';
  postable: boolean; // true = Detalle (D), false = Total (T)
  sign: 'P' | 'N' | 'D';
  statementType: 1 | 2 | 3 | 5;
  parentCode?: string;
}

export const SUPERCÍAS_CATALOG: SuperciasAccountDef[] = [
  // ─── 1. ACTIVO ──────────────────────────────────────────────────────────
  { code: '1', name: 'ACTIVO', category: 'asset', postable: false, sign: 'P', statementType: 1 },
  { code: '101', name: 'ACTIVO CORRIENTE', category: 'asset', postable: false, sign: 'P', statementType: 1, parentCode: '1' },
  { code: '10101', name: 'EFECTIVO Y EQUIVALENTES AL EFECTIVO', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '101' },
  { code: '1010101', name: 'Caja General Matriz', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10101' },
  { code: '1010102', name: 'Caja Chica', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10101' },
  { code: '1010103', name: 'Banco Pichincha - Cta. Cte.', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10101' },
  { code: '1010104', name: 'Banco del Pacífico - Cta. Cte.', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10101' },
  { code: '1010105', name: 'Banco Guayaquil - Cta. Cte.', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10101' },
  { code: '1010106', name: 'Produbanco - Cta. Cte.', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10101' },

  { code: '10102', name: 'ACTIVOS FINANCIEROS', category: 'asset', postable: false, sign: 'D', statementType: 1, parentCode: '101' },
  { code: '1010201', name: 'Activos financieros a valor razonable con cambios en resultados', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10102' },
  { code: '1010205', name: 'Documentos y cuentas por cobrar clientes no relacionados', category: 'asset', postable: false, sign: 'P', statementType: 1, parentCode: '10102' },
  { code: '101020501', name: 'Clientes ordinarios que generen intereses', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '1010205' },
  { code: '101020502', name: 'Clientes comerciales nacionales (ordinarios)', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '1010205' },
  { code: '1010206', name: 'Cuentas por cobrar clientes relacionados', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10102' },
  { code: '1010208', name: 'Otras cuentas por cobrar', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10102' },
  { code: '1010209', name: '(-) Provisión cuentas incobrables y deterioro', category: 'asset', postable: true, sign: 'N', statementType: 1, parentCode: '10102' },

  { code: '10103', name: 'INVENTARIOS', category: 'asset', postable: false, sign: 'D', statementType: 1, parentCode: '101' },
  { code: '1010301', name: 'Inventarios de materia prima', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10103' },
  { code: '1010302', name: 'Inventarios de productos en proceso', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10103' },
  { code: '1010303', name: 'Inventarios de suministros y materiales de producción', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10103' },
  { code: '1010305', name: 'Inventarios de productos terminados - producido por la compañía', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10103' },
  { code: '1010306', name: 'Inventarios de mercaderías para la venta - comprado de terceros', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10103' },
  { code: '1010307', name: 'Mercaderías en tránsito', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10103' },
  { code: '1010313', name: '(-) Provisión por valor neto de realización de inventarios', category: 'asset', postable: true, sign: 'N', statementType: 1, parentCode: '10103' },

  { code: '10104', name: 'SERVICIOS Y OTROS PAGOS ANTICIPADOS', category: 'asset', postable: false, sign: 'P', statementType: 1, parentCode: '101' },
  { code: '1010401', name: 'Seguros pagados por anticipado', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10104' },
  { code: '1010402', name: 'Arriendos pagados por anticipado', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10104' },
  { code: '1010403', name: 'Anticipos entregados a proveedores', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10104' },
  { code: '1010404', name: 'Anticipos entregados a empleados', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10104' },

  { code: '10105', name: 'ACTIVOS POR IMPUESTOS CORRIENTES (SRI)', category: 'asset', postable: false, sign: 'P', statementType: 1, parentCode: '101' },
  { code: '1010501', name: 'Crédito tributario a favor de la empresa (IVA en compras)', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10105' },
  { code: '1010502', name: 'Crédito tributario a favor de la empresa (Retenciones de I.R. recibidas)', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10105' },
  { code: '1010503', name: 'Anticipo de Impuesto a la Renta', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10105' },
  { code: '1010504', name: 'Crédito tributario por ISD (Tarifa reducida materias primas)', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10105' },

  // 102 ACTIVO NO CORRIENTE
  { code: '102', name: 'ACTIVO NO CORRIENTE', category: 'asset', postable: false, sign: 'P', statementType: 1, parentCode: '1' },
  { code: '10201', name: 'PROPIEDADES, PLANTA Y EQUIPO', category: 'asset', postable: false, sign: 'D', statementType: 1, parentCode: '102' },
  { code: '1020101', name: 'Terrenos', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10201' },
  { code: '1020102', name: 'Edificios e instalaciones', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10201' },
  { code: '1020105', name: 'Muebles y enseres de oficina', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10201' },
  { code: '1020106', name: 'Maquinaria y equipo de producción', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10201' },
  { code: '1020108', name: 'Equipo de computación y software', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10201' },
  { code: '1020109', name: 'Vehículos y equipo de transporte', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10201' },
  { code: '1020112', name: '(-) Depreciación acumulada propiedades, planta y equipo', category: 'asset', postable: true, sign: 'N', statementType: 1, parentCode: '10201' },
  { code: '10204', name: 'ACTIVO INTANGIBLE', category: 'asset', postable: false, sign: 'D', statementType: 1, parentCode: '102' },
  { code: '1020402', name: 'Marcas, patentes, licencias y derechos', category: 'asset', postable: true, sign: 'P', statementType: 1, parentCode: '10204' },
  { code: '1020404', name: '(-) Amortización acumulada de activo intangible', category: 'asset', postable: true, sign: 'N', statementType: 1, parentCode: '10204' },

  // ─── 2. PASIVO ──────────────────────────────────────────────────────────
  { code: '2', name: 'PASIVO', category: 'liability', postable: false, sign: 'P', statementType: 1 },
  { code: '201', name: 'PASIVO CORRIENTE', category: 'liability', postable: false, sign: 'P', statementType: 1, parentCode: '2' },
  { code: '20103', name: 'CUENTAS Y DOCUMENTOS POR PAGAR', category: 'liability', postable: false, sign: 'P', statementType: 1, parentCode: '201' },
  { code: '2010301', name: 'Proveedores locales', category: 'liability', postable: true, sign: 'P', statementType: 1, parentCode: '20103' },
  { code: '2010302', name: 'Proveedores del exterior (Importaciones)', category: 'liability', postable: true, sign: 'P', statementType: 1, parentCode: '20103' },

  { code: '20104', name: 'OBLIGACIONES CON INSTITUCIONES FINANCIERAS', category: 'liability', postable: false, sign: 'P', statementType: 1, parentCode: '201' },
  { code: '2010401', name: 'Préstamos y sobregiros bancarios locales', category: 'liability', postable: true, sign: 'P', statementType: 1, parentCode: '20104' },

  { code: '20107', name: 'OTRAS OBLIGACIONES CORRIENTES', category: 'liability', postable: false, sign: 'P', statementType: 1, parentCode: '201' },
  { code: '2010701', name: 'Obligaciones con la Administración Tributaria (SRI)', category: 'liability', postable: false, sign: 'P', statementType: 1, parentCode: '20107' },
  { code: '201070101', name: 'IVA por pagar en ventas (15%)', category: 'liability', postable: true, sign: 'P', statementType: 1, parentCode: '2010701' },
  { code: '201070102', name: 'Retenciones en la fuente de Impuesto a la Renta por pagar', category: 'liability', postable: true, sign: 'P', statementType: 1, parentCode: '2010701' },
  { code: '201070103', name: 'Retenciones en la fuente de IVA por pagar', category: 'liability', postable: true, sign: 'P', statementType: 1, parentCode: '2010701' },
  { code: '201070104', name: 'ICE por pagar', category: 'liability', postable: true, sign: 'P', statementType: 1, parentCode: '2010701' },
  { code: '2010702', name: 'Impuesto a la Renta por pagar del ejercicio', category: 'liability', postable: true, sign: 'P', statementType: 1, parentCode: '20107' },
  { code: '2010703', name: 'Obligaciones patronales con el IESS (Aporte personal y patronal)', category: 'liability', postable: true, sign: 'P', statementType: 1, parentCode: '20107' },
  { code: '2010704', name: 'Beneficios de ley a empleados (Sueldos por pagar)', category: 'liability', postable: true, sign: 'P', statementType: 1, parentCode: '20107' },
  { code: '2010705', name: '15% Participación de trabajadores por pagar del ejercicio', category: 'liability', postable: true, sign: 'P', statementType: 1, parentCode: '20107' },
  { code: '2010706', name: 'Dividendos por pagar a accionistas', category: 'liability', postable: true, sign: 'P', statementType: 1, parentCode: '20107' },
  { code: '20110', name: 'Anticipos recibidos de clientes', category: 'liability', postable: true, sign: 'P', statementType: 1, parentCode: '201' },

  // 202 PASIVO NO CORRIENTE
  { code: '202', name: 'PASIVO NO CORRIENTE', category: 'liability', postable: false, sign: 'P', statementType: 1, parentCode: '2' },
  { code: '20203', name: 'Obligaciones bancarias a largo plazo', category: 'liability', postable: true, sign: 'P', statementType: 1, parentCode: '202' },
  { code: '2020701', name: 'Provisión para jubilación patronal', category: 'liability', postable: true, sign: 'P', statementType: 1, parentCode: '202' },

  // ─── 3. PATRIMONIO ──────────────────────────────────────────────────────
  { code: '3', name: 'PATRIMONIO NETO', category: 'equity', postable: false, sign: 'P', statementType: 1 },
  { code: '301', name: 'CAPITAL', category: 'equity', postable: false, sign: 'P', statementType: 1, parentCode: '3' },
  { code: '30101', name: 'Capital suscrito o asignado', category: 'equity', postable: true, sign: 'P', statementType: 1, parentCode: '301' },
  { code: '302', name: 'Aportes de socios o accionistas para futura capitalización', category: 'equity', postable: true, sign: 'P', statementType: 1, parentCode: '3' },
  { code: '30401', name: 'Reserva legal', category: 'equity', postable: true, sign: 'P', statementType: 1, parentCode: '3' },
  { code: '30402', name: 'Reservas facultativa y estatutaria', category: 'equity', postable: true, sign: 'P', statementType: 1, parentCode: '3' },
  { code: '30601', name: 'Ganancias acumuladas de ejercicios anteriores', category: 'equity', postable: true, sign: 'P', statementType: 1, parentCode: '3' },
  { code: '30602', name: '(-) Pérdidas acumuladas de ejercicios anteriores', category: 'equity', postable: true, sign: 'N', statementType: 1, parentCode: '3' },
  { code: '30701', name: 'Ganancia neta del periodo', category: 'equity', postable: true, sign: 'P', statementType: 1, parentCode: '3' },
  { code: '30702', name: '(-) Pérdida neta del periodo', category: 'equity', postable: true, sign: 'N', statementType: 1, parentCode: '3' },

  // ─── 4. INGRESOS ────────────────────────────────────────────────────────
  { code: '41', name: 'INGRESOS DE ACTIVIDADES ORDINARIAS', category: 'income', postable: false, sign: 'D', statementType: 2 },
  { code: '4101', name: 'Venta de bienes gravada con tarifa IVA 15%', category: 'income', postable: true, sign: 'P', statementType: 2, parentCode: '41' },
  { code: '410101', name: 'Venta de bienes gravada con tarifa IVA 0%', category: 'income', postable: true, sign: 'P', statementType: 2, parentCode: '41' },
  { code: '4102', name: 'Prestación de servicios profesionales y técnicos', category: 'income', postable: true, sign: 'P', statementType: 2, parentCode: '41' },
  { code: '410601', name: 'Intereses generados por ventas a crédito', category: 'income', postable: true, sign: 'P', statementType: 2, parentCode: '41' },
  { code: '4110', name: '(-) Descuentos comerciales concedidos en ventas', category: 'income', postable: true, sign: 'N', statementType: 2, parentCode: '41' },
  { code: '4111', name: '(-) Devoluciones en ventas', category: 'income', postable: true, sign: 'N', statementType: 2, parentCode: '41' },
  { code: '4302', name: 'Intereses ganados e ingresos financieros', category: 'income', postable: true, sign: 'P', statementType: 2 },
  { code: '4305', name: 'Otros ingresos operacionales y rentas diversas', category: 'income', postable: true, sign: 'P', statementType: 2 },

  // ─── 5. COSTOS DE PRODUCCIÓN Y VENTAS ──────────────────────────────────
  { code: '51', name: 'COSTO DE VENTAS Y PRODUCCIÓN', category: 'cost', postable: false, sign: 'P', statementType: 2 },
  { code: '510101', name: 'Costo de ventas - Mercaderías compradas a terceros', category: 'cost', postable: true, sign: 'P', statementType: 2, parentCode: '51' },
  { code: '510102', name: 'Compras netas locales de inventario / mercaderías', category: 'cost', postable: true, sign: 'P', statementType: 2, parentCode: '51' },
  { code: '510103', name: 'Importaciones directas de inventario / mercaderías', category: 'cost', postable: true, sign: 'P', statementType: 2, parentCode: '51' },
  { code: '510106', name: 'Consumo y compras de materia prima', category: 'cost', postable: true, sign: 'P', statementType: 2, parentCode: '51' },
  { code: '510201', name: 'Mano de obra directa - Sueldos y beneficios de producción', category: 'cost', postable: true, sign: 'P', statementType: 2, parentCode: '51' },
  { code: '510301', name: 'Mano de obra indirecta de fábrica', category: 'cost', postable: true, sign: 'P', statementType: 2, parentCode: '51' },
  { code: '510401', name: 'Depreciación de maquinaria y equipo de producción', category: 'cost', postable: true, sign: 'P', statementType: 2, parentCode: '51' },
  { code: '510406', name: 'Mantenimiento y repuestos de planta', category: 'cost', postable: true, sign: 'P', statementType: 2, parentCode: '51' },

  // ─── 52. GASTOS OPERACIONALES (ADMINISTRACIÓN Y VENTAS) ─────────────────
  { code: '52', name: 'GASTOS OPERACIONALES', category: 'expense', postable: false, sign: 'P', statementType: 2 },
  { code: '5201', name: 'GASTOS DE ADMINISTRACIÓN', category: 'expense', postable: false, sign: 'P', statementType: 2, parentCode: '52' },
  { code: '520101', name: 'Sueldos, salarios y remuneraciones de administración', category: 'expense', postable: true, sign: 'P', statementType: 2, parentCode: '5201' },
  { code: '520102', name: 'Aporte patronal al IESS (12.15%) y Fondos de Reserva (8.33%)', category: 'expense', postable: true, sign: 'P', statementType: 2, parentCode: '5201' },
  { code: '520103', name: 'Beneficios sociales: 13º y 14º sueldo, vacaciones', category: 'expense', postable: true, sign: 'P', statementType: 2, parentCode: '5201' },
  { code: '520105', name: 'Honorarios profesionales a personas naturales', category: 'expense', postable: true, sign: 'P', statementType: 2, parentCode: '5201' },
  { code: '520108', name: 'Mantenimiento y reparaciones de oficinas', category: 'expense', postable: true, sign: 'P', statementType: 2, parentCode: '5201' },
  { code: '520109', name: 'Arrendamiento de oficinas y locales comerciales', category: 'expense', postable: true, sign: 'P', statementType: 2, parentCode: '5201' },
  { code: '520111', name: 'Publicidad, marketing y medios digitales', category: 'expense', postable: true, sign: 'P', statementType: 2, parentCode: '5201' },
  { code: '520112', name: 'Combustibles, peajes y lubricantes', category: 'expense', postable: true, sign: 'P', statementType: 2, parentCode: '5201' },
  { code: '520114', name: 'Seguros y pólizas de activos y responsabilidad civil', category: 'expense', postable: true, sign: 'P', statementType: 2, parentCode: '5201' },
  { code: '520115', name: 'Transporte, logística y fletes locales', category: 'expense', postable: true, sign: 'P', statementType: 2, parentCode: '5201' },
  { code: '520116', name: 'Gastos de gestión (atención a clientes y reuniones)', category: 'expense', postable: true, sign: 'P', statementType: 2, parentCode: '5201' },
  { code: '520117', name: 'Gastos de viaje, viáticos y hospedaje', category: 'expense', postable: true, sign: 'P', statementType: 2, parentCode: '5201' },
  { code: '520118', name: 'Servicios básicos: Agua, energía eléctrica, internet y telefonía', category: 'expense', postable: true, sign: 'P', statementType: 2, parentCode: '5201' },
  { code: '52012101', name: 'Gasto depreciación de muebles, equipos y vehículos administrativos', category: 'expense', postable: true, sign: 'P', statementType: 2, parentCode: '5201' },

  { code: '5202', name: 'GASTOS DE VENTAS', category: 'expense', postable: false, sign: 'P', statementType: 2, parentCode: '52' },
  { code: '520201', name: 'Sueldos y comisiones de equipo comercial', category: 'expense', postable: true, sign: 'P', statementType: 2, parentCode: '5202' },
  { code: '520210', name: 'Comisiones de ventas a terceros', category: 'expense', postable: true, sign: 'P', statementType: 2, parentCode: '5202' },

  { code: '5203', name: 'GASTOS FINANCIEROS', category: 'expense', postable: false, sign: 'P', statementType: 2, parentCode: '52' },
  { code: '520301', name: 'Intereses por préstamos bancarios', category: 'expense', postable: true, sign: 'P', statementType: 2, parentCode: '5203' },
  { code: '520302', name: 'Comisiones bancarias y mantenimiento de cuentas', category: 'expense', postable: true, sign: 'P', statementType: 2, parentCode: '5203' },

  // Cuentas de Cierre Legal Ecuador
  { code: '61', name: '15% PARTICIPACIÓN DE TRABAJADORES EN UTILIDADES', category: 'expense', postable: true, sign: 'P', statementType: 2 },
  { code: '63', name: 'IMPUESTO A LA RENTA CAUSADO DEL EJERCICIO (25%)', category: 'expense', postable: true, sign: 'P', statementType: 2 },
  { code: '68', name: 'IMPUESTO A LA SALIDA DE DIVISAS (ISD 5%)', category: 'expense', postable: true, sign: 'P', statementType: 2 },
];
