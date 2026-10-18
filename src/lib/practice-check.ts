/**
 * Reglas de calificación de las prácticas del simulador de Mi Aula.
 * Módulo puro (sin 'use client'): lo usan tanto PracticaValidada en el navegador
 * como /api/practice en el servidor, para que ambos califiquen exactamente igual.
 */

/** Normaliza para comparar: sin tildes, mayúsculas, espacios, símbolos de moneda; números y fechas por su valor. */
export function normalizar(valor: string): string {
  let v = valor.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const original = v;
  v = v.replace(/\b(usd|us\$)\b/g, '').replace(/[$\s]/g, '');
  const fecha = v.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})$/);
  if (fecha) return `${Number(fecha[1])}/${Number(fecha[2])}/${fecha[3].length === 2 ? `20${fecha[3]}` : fecha[3]}`;
  const num = v.replace(/%$/, '');
  if (/^-?[\d.,]+$/.test(num) && /\d/.test(num)) {
    const ultimo = Math.max(num.lastIndexOf('.'), num.lastIndexOf(','));
    let n: number;
    if (ultimo === -1) n = Number(num);
    else {
      const usaAmbos = num.includes('.') && num.includes(',');
      const decimales = num.length - ultimo - 1;
      // "1.150" o "1,150" (un solo tipo y 3 dígitos al final) = miles; si no, es separador decimal.
      const esDecimal = usaAmbos || decimales !== 3;
      n = esDecimal
        ? Number(num.slice(0, ultimo).replace(/[.,]/g, '') + '.' + num.slice(ultimo + 1))
        : Number(num.replace(/[.,]/g, ''));
    }
    if (!Number.isNaN(n)) return String(Math.round(n * 100) / 100);
  }
  // Una moneda o un separador pueden ser la respuesta completa de la ficha.
  // No convertir USD, "." o "," en vacío: impediría aprobar incluso la solución publicada.
  return v.replace(/[.,;:'"()_-]/g, '') || original;
}

/**
 * Datos maestros de B1 Center: en Finix ERP se puede escribir el código o el nombre.
 * Cada grupo son formas equivalentes del mismo dato.
 */
const EQUIVALENCIAS: string[][] = [
  ['01', 'Bodega Central Quito', 'Bodega Central', 'Almacén Central'], ['02', 'Bodega Sucursal Guayaquil', 'Bodega Guayaquil'],
  ['C20000', 'Maxi-Teq'], ['C20001', 'TechSolutions'], ['C20002', 'CompuMundo'], ['C20003', 'ElectroHogar'], ['C20004', 'Sistemas del Valle'],
  ['C20005', 'Corporación Andina Comercial S.A.', 'Corporación Andina', 'Andina Comercial'],
  ['V10000', 'Dell Ecuador'], ['V10001', 'HP Importaciones'], ['V10002', 'Lenovo Andina'], ['V10003', 'Acer Distributors'],
  ['A00001', 'Laptop Dell Latitude 3420', 'Laptop Dell Latitud 3420', 'Dell Latitude 3420', 'Dell Latitud 3420'], ['A00002', 'Laptop HP ProBook 440'], ['A00003', 'Monitor Lenovo ThinkVision 24"'],
  ['A00004', 'Teclado Inalámbrico Logitech'], ['A00005', 'Mouse Óptico Dell'], ['A00006', 'Servidor HP ProLiant DL380'],
  ['A00007', 'Disco Duro SSD 1TB Samsung'], ['A00008', 'Memoria RAM 16GB DDR4'],
  ['manager', 'admin', 'pablo.garcia', 'alumno@ejemplo.test', 'pablo'],
  ['B1Admin2026', 'ClaveSoloDePractica2026!', '123456', 'manager', 'admin'],
  ['Banco Pichincha', 'Pichincha', 'BAN-1'],
  ['Oferta de Venta', 'Cotización', 'Oferta de ventas', 'Cotización comercial', 'COT'],
  ['Pedido de Cliente', 'Pedido de venta', 'Pedido en firme', 'Orden de venta', 'PV'],
  ['Factura de Clientes', 'Factura de deudores', 'Factura de venta', 'Factura electrónica', 'FAC'],
  ['Pago Recibido', 'Cobro', 'Cobranza', 'Pago de cliente'],
  ['Transferencia Bancaria', 'Transferencia', 'Depósito bancario'],
  ['Mapa de Relaciones', 'Mapa de relación', 'Árbol de relaciones', 'Relationship map'],
].map((g) => g.map((v) => normalizar(v)));

/** Valores de sí/no: en Finix ERP son casillas de verificación, no texto. */
export const SI = /^(si|true|marcado|activado|activo|habilitado|x|check)$/;
export const NO = /^(no|false|desmarcado|desactivado|inactivo|deshabilitado)$/;
export const esBooleano = (valor: string) => { const n = normalizar(valor); return SI.test(n) || NO.test(n); };

function distanciaLevenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const d: number[][] = [];
  for (let i = 0; i <= a.length; i++) d[i] = [i];
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      );
    }
  }
  return d[a.length][b.length];
}

/** ¿La respuesta del estudiante coincide con la esperada? (formatos, código o nombre, sí/no, credenciales flexibles) */
export function coincide(respuesta: string, esperado: string, etiqueta?: string): boolean {
  const r = normalizar(respuesta);
  const e = normalizar(esperado);
  if (!r) return false;
  if (r === e) return true;

  // Para credenciales, verificar contra la lista de equivalencias válidas del sistema
  const tag = (etiqueta || '').toLowerCase();
  if (/usuario|user|login/.test(tag) || /contra|clave|pass/.test(tag)) {
    if (EQUIVALENCIAS.some((g) => g.includes(r) && g.includes(e))) return true;
  }

  if (esBooleano(esperado)) return SI.test(e) ? SI.test(r) : NO.test(r) || r === '';
  return EQUIVALENCIAS.some((g) => g.includes(r) && g.includes(e));
}

/** Lo que el navegador informa al terminar una práctica. */
export interface IntentoPractica {
  evidence?: { action: string; result: string; requestId: string };
  /** Valores escritos por el estudiante, en el mismo orden que los campos de la práctica. */
  valores: string[];
  /** Cuántas veces pulsó "Añadir" antes de lograrlo (1 = a la primera). */
  intentos: number;
  /** true si abrió la solución antes de completar la práctica. */
  vioSolucion: boolean;
  /** true si se hizo en una pantalla real del Simulador (el servidor verifica el registro en la empresa). */
  conectada?: boolean;
}

/**
 * Política de aprobación para el certificado: decide si una práctica cuenta como aprobada.
 */
export function practicaAprobada(correctos: number, total: number, intento: IntentoPractica): boolean {
  if (total <= 0 || correctos < total) return false;
  // Si el estudiante vio la solución en este intento, debe repetirla demostrando dominio propio
  if (intento.vioSolucion) return false;
  return true;
}
