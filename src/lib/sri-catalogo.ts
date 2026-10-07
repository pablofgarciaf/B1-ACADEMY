/**
 * Catálogo tributario SRI 2026 y validaciones del "ambiente de pruebas" simulado.
 *
 * Porcentajes: Resolución NAC-DGERCGC26-00000009 (renta, desde el 1 de marzo de 2026) y
 * NAC-DGERCGC20-00000061 (IVA). Códigos de retención: tabla publicada para el formulario 103 / ATS 2026;
 * los códigos de retención del IVA en el XML siguen la ficha técnica de comprobantes electrónicos.
 * Cuando el SRI publique una nueva resolución, se actualiza SOLO este archivo.
 */

export interface OpcionRetencion { id: string; tax: 'IR' | 'IVA'; codigo: string; rate: number; label: string }

export const RETENCIONES_2026: readonly OpcionRetencion[] = [
  { id: 'IR-312', tax: 'IR', codigo: '312', rate: 2, label: '312 · Bienes muebles (mercadería, insumos) · 2 %' },
  { id: 'IR-312-AGRO-P', tax: 'IR', codigo: '312A', rate: 1, label: '312A · Productos agrícolas comprados al productor · 1 %' },
  { id: 'IR-312-AGRO-D', tax: 'IR', codigo: '312A', rate: 1.75, label: '312A · Productos agrícolas comprados a distribuidor · 1,75 %' },
  { id: 'IR-307', tax: 'IR', codigo: '307', rate: 3, label: '307 · Servicios donde predomina la mano de obra · 3 %' },
  { id: 'IR-303A', tax: 'IR', codigo: '303A', rate: 5, label: '303A · Servicios profesionales de sociedades residentes · 5 %' },
  { id: 'IR-304', tax: 'IR', codigo: '304', rate: 10, label: '304 · Servicios donde predomina el intelecto (sin título) · 10 %' },
  { id: 'IR-308', tax: 'IR', codigo: '308', rate: 10, label: '308 · Uso de imagen o renombre · 10 %' },
  { id: 'IR-303', tax: 'IR', codigo: '303', rate: 10, label: '303 · Honorarios de personas naturales · 10 %' },
  { id: 'IR-309', tax: 'IR', codigo: '309', rate: 3, label: '309 · Publicidad y medios de comunicación · 3 %' },
  { id: 'IR-310', tax: 'IR', codigo: '310', rate: 1, label: '310 · Transporte de pasajeros o carga · 1 %' },
  { id: 'IR-319', tax: 'IR', codigo: '319', rate: 2, label: '319 · Arrendamiento mercantil (leasing) · 2 %' },
  { id: 'IR-320', tax: 'IR', codigo: '320', rate: 10, label: '320 · Arrendamiento de inmuebles · 10 %' },
  { id: 'IR-322', tax: 'IR', codigo: '322', rate: 2, label: '322 · Seguros y reaseguros · 2 %' },
  { id: 'IR-343', tax: 'IR', codigo: '343', rate: 1, label: '343 · Compras a RIMPE Emprendedor y otras retenciones del 1 % · 1 %' },
  { id: 'IR-332', tax: 'IR', codigo: '332', rate: 0, label: '332 · Compras no sujetas a retención (p. ej. Negocio Popular RIMPE) · 0 %' },
  { id: 'IR-3440', tax: 'IR', codigo: '3440', rate: 3, label: '3440 · Otras retenciones sin porcentaje específico · 3 %' },
  { id: 'IVA-30', tax: 'IVA', codigo: '1', rate: 30, label: 'IVA bienes · proveedor NO contribuyente especial · 30 %' },
  { id: 'IVA-70', tax: 'IVA', codigo: '2', rate: 70, label: 'IVA servicios · proveedor NO contribuyente especial · 70 %' },
  { id: 'IVA-100', tax: 'IVA', codigo: '3', rate: 100, label: 'IVA honorarios, arriendo de persona natural o liquidación de compra · 100 %' },
  { id: 'IVA-10', tax: 'IVA', codigo: '9', rate: 10, label: 'IVA bienes · proveedor contribuyente especial · 10 %' },
  { id: 'IVA-20', tax: 'IVA', codigo: '10', rate: 20, label: 'IVA servicios · proveedor contribuyente especial · 20 %' },
];

export const opcionRetencion = (id: string) => RETENCIONES_2026.find((o) => o.id === id);

/** Tarifas de IVA vigentes en 2026 y su código de porcentaje en el XML (ficha técnica). */
export const CODIGO_PORCENTAJE_IVA: Record<number, string> = { 0: '0', 5: '5', 8: '8', 15: '4' };

// ── Identificación ─────────────────────────────────────────────────────────────

export const CONSUMIDOR_FINAL = '9999999999999';

function cedulaValida(c: string): boolean {
  if (!/^\d{10}$/.test(c)) return false;
  const provincia = Number(c.slice(0, 2));
  if (!((provincia >= 1 && provincia <= 24) || provincia === 30) || Number(c[2]) > 5) return false;
  const suma = [...c.slice(0, 9)].reduce((s, d, i) => { let v = Number(d) * (i % 2 === 0 ? 2 : 1); if (v > 9) v -= 9; return s + v; }, 0);
  return (10 - (suma % 10)) % 10 === Number(c[9]);
}

/**
 * Revisa una cédula o RUC. Devuelve `error` si la estructura es imposible, o `aviso` si solo falla el dígito
 * verificador del RUC de una sociedad (el SRI ha emitido RUC de sociedades que no cumplen el módulo 11,
 * por eso no se rechaza).
 */
export function revisarIdentificacion(id: string): { error?: string; aviso?: string } {
  if (id === CONSUMIDOR_FINAL) return {};
  if (/^\d{10}$/.test(id)) return cedulaValida(id) ? {} : { error: `La cédula ${id} no es válida (dígito verificador incorrecto).` };
  if (!/^\d{13}$/.test(id)) return { error: `"${id}" no es una cédula (10 dígitos) ni un RUC (13 dígitos).` };
  if (id.endsWith('000')) return { error: `El RUC ${id} no puede terminar en 000: los tres últimos dígitos son el establecimiento.` };
  const provincia = Number(id.slice(0, 2)); const tercero = Number(id[2]);
  if (!((provincia >= 1 && provincia <= 24) || provincia === 30)) return { error: `El RUC ${id} tiene un código de provincia inexistente (${id.slice(0, 2)}).` };
  if (tercero <= 5) return cedulaValida(id.slice(0, 10)) ? {} : { error: `El RUC ${id} no corresponde a una cédula válida.` };
  if (tercero === 9 || tercero === 6) {
    const coef = tercero === 9 ? [4, 3, 2, 7, 6, 5, 4, 3, 2] : [3, 2, 7, 6, 5, 4, 3, 2];
    const suma = coef.reduce((s, k, i) => s + k * Number(id[i]), 0);
    const r = suma % 11; const dv = r === 0 ? 0 : 11 - r;
    return dv === Number(id[coef.length]) ? {} : { aviso: `El dígito verificador del RUC ${id} no cumple el módulo 11; confírmalo en la consulta de RUC del SRI.` };
  }
  return { error: `El RUC ${id} tiene un tercer dígito inválido (${tercero}).` };
}

// ── Clave de acceso ─────────────────────────────────────────────────────────────

export function digitoModulo11(base48: string): number {
  let suma = 0; let factor = 2;
  for (let i = base48.length - 1; i >= 0; i--) { suma += Number(base48[i]) * factor; factor = factor === 7 ? 2 : factor + 1; }
  const d = 11 - (suma % 11);
  return d === 11 ? 0 : d === 10 ? 1 : d;
}

// ── Recepción y autorización simuladas ─────────────────────────────────────────

export interface MensajeSRI { identificador: string; mensaje: string; tipo: 'ERROR' | 'ADVERTENCIA' | 'INFORMATIVO' }
export interface RespuestaSRI { estado: 'AUTORIZADO' | 'DEVUELTA' | 'NO AUTORIZADO'; mensajes: MensajeSRI[] }

const valor = (xml: string, tag: string) => xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`))?.[1] ?? '';
const valores = (xml: string, tag: string) => [...xml.matchAll(new RegExp(`<${tag}>([^<]*)</${tag}>`, 'g'))].map((m) => m[1]);
const num = (t: string) => Number(t) || 0;
const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Lo que hace el SRI cuando recibe el XML: primero la RECEPCIÓN (estructura, clave de acceso, duplicados) y luego
 * la AUTORIZACIÓN (contenido tributario). Trabaja sobre el XML, igual que el SRI real.
 * `claves`: claves de acceso ya autorizadas en la empresa. `hoy`: fecha de envío (AAAA-MM-DD).
 */
export function enviarAlSRI(xml: string, claves: Set<string>, hoy: string): RespuestaSRI {
  const mensajes: MensajeSRI[] = [];
  const err = (identificador: string, mensaje: string) => mensajes.push({ identificador, mensaje, tipo: 'ERROR' });

  // 1. Recepción
  const clave = valor(xml, 'claveAcceso');
  if (!/^\d{49}$/.test(clave)) err('35', 'ARCHIVO NO CUMPLE ESTRUCTURA XML: la clave de acceso debe tener 49 dígitos.');
  else if (digitoModulo11(clave.slice(0, 48)) !== Number(clave[48])) err('35', 'ARCHIVO NO CUMPLE ESTRUCTURA XML: el dígito verificador (módulo 11) de la clave de acceso es incorrecto.');
  else {
    const [d, m, a] = valor(xml, 'fechaEmision').split('/');
    const esperado = `${d}${m}${a}${valor(xml, 'codDoc')}${valor(xml, 'ruc')}${valor(xml, 'ambiente')}${valor(xml, 'estab')}${valor(xml, 'ptoEmi')}${valor(xml, 'secuencial')}`;
    if (clave.slice(0, 39) !== esperado) err('35', 'ARCHIVO NO CUMPLE ESTRUCTURA XML: la clave de acceso no coincide con la fecha, el tipo, el RUC o la serie del comprobante.');
  }
  if (claves.has(clave)) err('43', 'CLAVE ACCESO REGISTRADA: este comprobante ya fue autorizado.');
  if (mensajes.length) return { estado: 'DEVUELTA', mensajes };

  // 2. Autorización
  const emisor = revisarIdentificacion(valor(xml, 'ruc'));
  if (emisor.error || !/^\d{10}001$/.test(valor(xml, 'ruc'))) err('—', `RUC DEL EMISOR: ${emisor.error ?? 'el RUC del emisor debe tener 13 dígitos y terminar en 001.'} Corrígelo en Gestión › Inicialización del sistema › Detalles de la sociedad.`);
  else if (emisor.aviso) mensajes.push({ identificador: '—', mensaje: emisor.aviso, tipo: 'ADVERTENCIA' });
  if (valor(xml, 'estab') === '000' || valor(xml, 'ptoEmi') === '000') err('—', 'ESTABLECIMIENTO O PUNTO DE EMISIÓN 000: la serie debe empezar en 001-001.');

  const receptor = valor(xml, 'identificacionComprador') || valor(xml, 'identificacionProveedor') || valor(xml, 'identificacionSujetoRetenido') || valor(xml, 'identificacionDestinatario');
  const rev = revisarIdentificacion(receptor);
  if (rev.error) err('—', `IDENTIFICACIÓN DEL RECEPTOR: ${rev.error} Corrígela en el socio de negocios y genera un comprobante nuevo.`);
  else if (rev.aviso) mensajes.push({ identificador: '—', mensaje: rev.aviso, tipo: 'ADVERTENCIA' });

  const [d, m, a] = valor(xml, 'fechaEmision').split('/'); const emision = `${a}-${m}-${d}`;
  if (emision > hoy) err('—', `FECHA DE EMISIÓN POSTERIOR AL ENVÍO (${emision}): no se puede emitir con fecha futura.`);
  else if (emision < hoy) mensajes.push({ identificador: '65', mensaje: `FECHA EMISIÓN EXTEMPORÁNEA: desde el 1 de enero de 2026 la transmisión es inmediata (Resolución NAC-DGERCGC25-00000017). Emitido el ${emision} y enviado el ${hoy}: en la vida real esto puede generar sanción.`, tipo: 'ADVERTENCIA' });

  // Cálculos (error 52 en la ficha técnica: diferencias en los valores)
  if (/<(factura|liquidacionCompra) id=/.test(xml)) {
    const sinImp = num(valor(xml, 'totalSinImpuestos'));
    const lineas = r2(valores(xml, 'precioTotalSinImpuesto').reduce((s, v) => s + num(v), 0));
    const ivaTotal = r2(valores(xml.split('<detalles>')[0], 'valor').reduce((s, v) => s + num(v), 0));
    if (Math.abs(lineas - sinImp) > 0.01) err('52', `ERROR EN DIFERENCIAS: la suma de las líneas (${lineas.toFixed(2)}) no coincide con el total sin impuestos (${sinImp.toFixed(2)}).`);
    if (Math.abs(r2(sinImp + ivaTotal + num(valor(xml, 'propina'))) - num(valor(xml, 'importeTotal'))) > 0.01) err('52', 'ERROR EN DIFERENCIAS: el importe total no es igual a subtotal + IVA + propina.');
  }
  // Cada impuesto se valida según su código: 2 = IVA (solo tarifas vigentes) y 3 = ICE (solo productos del catálogo).
  const pares = [...xml.matchAll(/<codigo>(\d)<\/codigo>\s*<codigoPorcentaje>(\w+)<\/codigoPorcentaje>/g)].map((m) => [m[1], m[2]] as const);
  const ivaMalo = pares.filter(([k, c]) => k === '2' && !Object.values(CODIGO_PORCENTAJE_IVA).includes(c));
  if (ivaMalo.length) err('—', `TARIFA DE IVA NO VIGENTE (código ${ivaMalo[0][1]}): en 2026 solo existen 0 %, 5 %, 8 % y 15 %.`);
  const iceMalo = pares.filter(([k, c]) => k === '3' && !Object.values(ICE_CATALOGO).some((e) => e.codigoSRI === c));
  if (iceMalo.length) err('—', `CÓDIGO DE ICE NO RECONOCIDO (${iceMalo[0][1]}): el producto no está en el catálogo de ICE del simulador.`);

  mensajes.push({ identificador: '—', mensaje: 'AMBIENTE DE PRUEBAS ACADÉMICO: sin firma electrónica XAdES-BES. En el SRI real cada empresa firma con su propio certificado y su propio RUC.', tipo: 'INFORMATIVO' });
  return { estado: mensajes.some((x) => x.tipo === 'ERROR') ? 'NO AUTORIZADO' : 'AUTORIZADO', mensajes };
}

// ── Impuesto a la renta de personas naturales 2026 (empleados) ───────────────────
// Tabla: Resolución NAC-DGERCGC25-00000043. Gastos personales: rebaja del 18 % sobre el menor valor entre los gastos
// proyectados y el tope por cargas familiares (canasta básica de enero de 2026). ⚠ El mecanismo de rebaja y los topes
// provienen de fuentes secundarias: confirmar con el contador (docs/16).

/** [desde, hasta, impuesto de la fracción básica, % sobre el excedente] */
export const TABLA_IR_2026: readonly (readonly [number, number, number, number])[] = [
  [0, 12208, 0, 0], [12208, 15549, 0, 5], [15549, 20188, 167, 10], [20188, 26700, 631, 12], [26700, 35136, 1412, 15],
  [35136, 46575, 2678, 20], [46575, 62005, 4965, 25], [62005, 82679, 8823, 30], [82679, 109956, 15025, 35], [109956, Infinity, 24572, 37],
];
export const FRACCION_BASICA_2026 = 12208;
export const CANASTA_BASICA_2026 = 821.8;
/** Canastas básicas que topan los gastos personales según las cargas familiares (0, 1, 2, 3, 4, 5 o más). */
export const CANASTAS_POR_CARGAS = [7, 9, 11, 14, 17, 20] as const;
export const REBAJA_GASTOS_PERSONALES = 0.18;

const r2c = (n: number) => Math.round(n * 100) / 100;

export function impuestoRenta(baseAnual: number): number {
  if (baseAnual <= FRACCION_BASICA_2026) return 0;
  const tramo = TABLA_IR_2026.find(([desde, hasta]) => baseAnual > desde && baseAnual <= hasta) ?? TABLA_IR_2026[TABLA_IR_2026.length - 1];
  return r2c(tramo[2] + (baseAnual - tramo[0]) * tramo[3] / 100);
}

export function topeGastosPersonales(cargas: number): number {
  return r2c(CANASTA_BASICA_2026 * CANASTAS_POR_CARGAS[Math.min(Math.max(Math.trunc(cargas), 0), 5)]);
}

/**
 * Retención mensual de IR de un empleado en relación de dependencia: proyección simple (lo gravado de este rol × 12).
 * Base = ingreso gravado anual − aporte personal al IESS anual; los décimos, los fondos de reserva y las utilidades no entran.
 */
export function retencionIREmpleado(gravadoMensual: number, iessPersonalMensual: number, gastosProyectados: number, cargas: number) {
  const base = r2c(gravadoMensual * 12 - iessPersonalMensual * 12);
  const impuesto = impuestoRenta(base);
  const rebaja = r2c(REBAJA_GASTOS_PERSONALES * Math.min(Math.max(gastosProyectados, 0), topeGastosPersonales(cargas)));
  const neto = Math.max(0, r2c(impuesto - rebaja));
  return { base, impuesto, rebaja, neto, mensual: r2c(neto / 12) };
}

// ── ICE (Impuesto a los Consumos Especiales) 2026 ─────────────────────────────────
// Resoluciones NAC-DGERCGC25-00000040 a 00000043 (diciembre de 2025). ⚠ La base imponible real del ICE es el precio de venta
// al público sugerido (o el ex fábrica más 25 % de margen); el simulador la simplifica al precio facturado: confirmar con el contador.
// ⚠ Los códigos del XML (3011, 3610, 3620) vienen de la ficha técnica según fuentes secundarias.
export const ICE_TIPOS = ['none', 'perfumes', 'videojuegos', 'cigarrillos'] as const;
export type IceTipo = (typeof ICE_TIPOS)[number];
export const ICE_CATALOGO: Record<Exclude<IceTipo, 'none'>, { label: string; modo: 'advalorem' | 'unidad'; valor: number; codigoSRI: string }> = {
  perfumes: { label: 'Perfumes y aguas de tocador · 20 %', modo: 'advalorem', valor: 20, codigoSRI: '3610' },
  videojuegos: { label: 'Videojuegos · 35 %', modo: 'advalorem', valor: 35, codigoSRI: '3620' },
  cigarrillos: { label: 'Cigarrillos · USD 0,16 por unidad (cigarrillo)', modo: 'unidad', valor: 0.16, codigoSRI: '3011' },
};
export const ICE_ETIQUETAS: Record<IceTipo, string> = { none: 'Sin ICE', perfumes: ICE_CATALOGO.perfumes.label, videojuegos: ICE_CATALOGO.videojuegos.label, cigarrillos: ICE_CATALOGO.cigarrillos.label };

/** ICE de una línea: ad valorem sobre el valor neto o específico por unidad. */
export function iceDeLinea(tipo: string | undefined, cantidad: number, netoLinea: number): number {
  if (!tipo || tipo === 'none' || !(tipo in ICE_CATALOGO)) return 0;
  const e = ICE_CATALOGO[tipo as Exclude<IceTipo, 'none'>];
  return r2c(e.modo === 'advalorem' ? netoLinea * e.valor / 100 : cantidad * e.valor);
}

// ── ISD (Impuesto a la Salida de Divisas) 2026 ────────────────────────────────────
// Tarifa general 5 %; para 2026 el Decreto Ejecutivo fija tarifas diferenciadas: 0 % sector farmacéutico y 2,5 % otros
// sectores productivos según acuerdo ministerial. ⚠ El simulador no verifica quién es beneficiario: el estudiante elige.
export const ISD_TARIFAS = [
  { id: '5', rate: 5, label: 'Tarifa general · 5 %' },
  { id: '2.5', rate: 2.5, label: 'Tarifa reducida 2026 (sector productivo beneficiario) · 2,5 %' },
  { id: '0', rate: 0, label: 'Sector farmacéutico beneficiario · 0 %' },
] as const;

// ── RIMPE ─────────────────────────────────────────────────────────────────────────
export const REGIMENES = ['general', 'rimpe-emprendedor', 'rimpe-popular'] as const;
export const REGIMEN_ETIQUETAS: Record<(typeof REGIMENES)[number], string> = { general: 'Régimen general', 'rimpe-emprendedor': 'RIMPE Emprendedor', 'rimpe-popular': 'RIMPE Negocio Popular' };
export const RIMPE_PROVEEDOR = ['ninguno', 'emprendedor', 'popular'] as const;
export const RIMPE_PROVEEDOR_ETIQUETAS: Record<(typeof RIMPE_PROVEEDOR)[number], string> = { ninguno: 'Régimen general', emprendedor: 'RIMPE Emprendedor (retención de renta 1 %)', popular: 'RIMPE Negocio Popular (nota de venta, sin IVA ni retención)' };
