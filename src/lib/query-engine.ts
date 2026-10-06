import type { CompanyState } from './firestore-types';

/**
 * Query Manager del simulador: un subconjunto de SQL sobre los datos de la empresa del estudiante,
 * con los nombres de tabla reales de SAP Business One (OCRD, OITM, OINV, OJDT, JDT1…).
 * Corre en memoria sobre su propia empresa: no hay base de datos real ni riesgo de inyección.
 *
 * Soporta: SELECT [DISTINCT] columnas | * | COUNT/SUM/AVG/MIN/MAX(...) [AS alias]
 *          FROM tabla  WHERE (=, <>, !=, <, <=, >, >=, LIKE, NOT LIKE, IS [NOT] NULL, AND, OR, NOT, paréntesis)
 *          GROUP BY ...  ORDER BY ... [ASC|DESC]  LIMIT n
 */

export type Fila = Record<string, string | number | boolean | null>;
type Primitivo = string | number | boolean | null;

export interface TablaSap { nombre: string; alias: string[]; descripcion: string; filas: (s: CompanyState) => Fila[] }

/** Copia solo los campos simples (texto, número, sí/no) de una entidad. */
function plano(obj: object, extra: Fila = {}): Fila {
  const fila: Fila = {};
  for (const [k, v] of Object.entries(obj)) if (v === null || ['string', 'number', 'boolean'].includes(typeof v)) fila[k] = v as Primitivo;
  return { ...fila, ...extra };
}

export const TABLAS: TablaSap[] = [
  { nombre: 'OCRD', alias: ['socios'], descripcion: 'Socios de negocios (clientes C y proveedores S)', filas: s => [...s.customers.map(c => plano(c, { cardType: 'C' })), ...s.vendors.map(v => plano(v, { cardType: 'S' }))] },
  { nombre: 'OITM', alias: ['articulos'], descripcion: 'Datos maestros de artículos', filas: s => s.items.map(i => plano(i)) },
  { nombre: 'OITW', alias: ['stock'], descripcion: 'Stock por artículo y almacén', filas: s => s.warehouseStock.map(w => plano(w)) },
  { nombre: 'OINV', alias: ['facturas'], descripcion: 'Facturas de venta', filas: s => s.salesOrders.filter(d => d.docType === 'invoice').map(d => plano(d)) },
  { nombre: 'ORIN', alias: ['notas_credito'], descripcion: 'Notas de crédito de clientes', filas: s => s.salesOrders.filter(d => d.docType === 'credit_note').map(d => plano(d)) },
  { nombre: 'ORDR', alias: ['pedidos_venta'], descripcion: 'Pedidos de venta', filas: s => s.salesOrders.filter(d => d.docType === 'order').map(d => plano(d)) },
  { nombre: 'OQUT', alias: ['ofertas'], descripcion: 'Ofertas / cotizaciones de venta', filas: s => s.salesOrders.filter(d => d.docType === 'quotation').map(d => plano(d)) },
  { nombre: 'OPCH', alias: ['facturas_proveedor'], descripcion: 'Facturas de proveedores', filas: s => s.purchaseOrders.filter(d => d.docType === 'vendor_invoice').map(d => plano(d)) },
  { nombre: 'OPOR', alias: ['pedidos_compra'], descripcion: 'Pedidos de compra', filas: s => s.purchaseOrders.filter(d => d.docType === 'purchase_order').map(d => plano(d)) },
  { nombre: 'INV1', alias: ['lineas_venta'], descripcion: 'Líneas de documentos de venta', filas: s => s.salesOrders.flatMap(d => d.lines.map(l => plano(l, { docNumber: d.docNumber, docType: d.docType, date: d.date, cardCode: d.cardCode, lineTotal: Math.round(l.quantity * l.price * (1 - l.discount / 100) * 100) / 100 }))) },
  { nombre: 'OJDT', alias: ['asientos'], descripcion: 'Asientos contables (cabecera)', filas: s => s.journalEntries.map(e => plano(e)) },
  { nombre: 'JDT1', alias: ['lineas_asiento'], descripcion: 'Líneas de asientos contables', filas: s => s.journalEntries.flatMap(e => e.lines.map(l => plano(l, { entryNumber: e.entryNumber, date: e.date, memo: e.memo }))) },
  { nombre: 'OACT', alias: ['cuentas'], descripcion: 'Plan de cuentas', filas: s => s.chartOfAccounts.map(a => plano(a)) },
  { nombre: 'OBNK', alias: ['movimientos_banco'], descripcion: 'Movimientos bancarios', filas: s => s.bankTransactions.map(t => plano(t)) },
  { nombre: 'OHEM', alias: ['empleados'], descripcion: 'Empleados', filas: s => s.employees.map(e => plano(e)) },
];

export function buscarTabla(nombre: string) {
  const n = nombre.toLowerCase();
  return TABLAS.find(t => t.nombre.toLowerCase() === n || t.alias.includes(n));
}

/* ─────────────── Analizador léxico ─────────────── */

type Token = { t: 'id' | 'num' | 'str' | 'op' | 'punct'; v: string };
const PALABRAS = new Set(['select', 'distinct', 'from', 'where', 'and', 'or', 'not', 'like', 'is', 'null', 'group', 'order', 'by', 'asc', 'desc', 'limit', 'as', 'true', 'false']);

function tokenizar(sql: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < sql.length) {
    const c = sql[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === '-' && sql[i + 1] === '-') { while (i < sql.length && sql[i] !== '\n') i++; continue; }
    if (c === "'") {
      let v = ''; i++;
      while (i < sql.length) { if (sql[i] === "'" && sql[i + 1] === "'") { v += "'"; i += 2; continue; } if (sql[i] === "'") break; v += sql[i++]; }
      if (sql[i] !== "'") throw new Error('Falta cerrar una comilla simple.');
      i++; tokens.push({ t: 'str', v }); continue;
    }
    const num = /^\d+(\.\d+)?/.exec(sql.slice(i));
    if (num) { tokens.push({ t: 'num', v: num[0] }); i += num[0].length; continue; }
    const id = /^[A-Za-z_][\w.]*/.exec(sql.slice(i)) ?? /^"([^"]+)"/.exec(sql.slice(i));
    if (id) { tokens.push({ t: 'id', v: id[1] ?? id[0] }); i += id[0].length; continue; }
    const op = /^(<=|>=|<>|!=|=|<|>)/.exec(sql.slice(i));
    if (op) { tokens.push({ t: 'op', v: op[0] }); i += op[0].length; continue; }
    if ('(),*;'.includes(c)) { if (c !== ';') tokens.push({ t: 'punct', v: c }); i++; continue; }
    throw new Error(`Carácter no válido: "${c}".`);
  }
  return tokens;
}

/* ─────────────── Analizador sintáctico ─────────────── */

type Agregado = 'count' | 'sum' | 'avg' | 'min' | 'max';
type Item = { tipo: 'todo' } | { tipo: 'col'; col: string; alias: string } | { tipo: 'agg'; fn: Agregado; col: string; alias: string };
type Expr =
  | { tipo: 'y' | 'o'; a: Expr; b: Expr }
  | { tipo: 'no'; e: Expr }
  | { tipo: 'cmp'; col: string; op: string; valor: Primitivo }
  | { tipo: 'like'; col: string; patron: string; negado: boolean }
  | { tipo: 'nulo'; col: string; negado: boolean };
export interface Consulta { distinct: boolean; items: Item[]; tabla: string; where?: Expr; groupBy: string[]; orderBy: { clave: string; desc: boolean }[]; limit: number }

class Parser {
  private pos = 0;
  constructor(private tokens: Token[]) {}
  private ver() { return this.tokens[this.pos]; }
  private es(palabra: string) { const k = this.ver(); return k?.t === 'id' && k.v.toLowerCase() === palabra; }
  private tomar(palabra: string) { if (!this.es(palabra)) throw new Error(`Se esperaba ${palabra.toUpperCase()}.`); this.pos++; }
  private signo(v: string) { const k = this.ver(); if (k?.t !== 'punct' || k.v !== v) throw new Error(`Se esperaba "${v}".`); this.pos++; }
  private identificador() {
    const k = this.ver();
    if (k?.t !== 'id' || PALABRAS.has(k.v.toLowerCase())) throw new Error(k ? `Se esperaba un nombre de columna y llegó "${k.v}".` : 'La consulta terminó antes de tiempo.');
    this.pos++; return k.v;
  }

  consulta(): Consulta {
    this.tomar('select');
    const distinct = this.es('distinct'); if (distinct) this.pos++;
    const items: Item[] = [this.item()];
    while (this.ver()?.v === ',') { this.pos++; items.push(this.item()); }
    this.tomar('from');
    const tabla = this.identificador();
    let where: Expr | undefined;
    if (this.es('where')) { this.pos++; where = this.o(); }
    const groupBy: string[] = [];
    if (this.es('group')) { this.pos++; this.tomar('by'); groupBy.push(this.identificador()); while (this.ver()?.v === ',') { this.pos++; groupBy.push(this.identificador()); } }
    const orderBy: { clave: string; desc: boolean }[] = [];
    if (this.es('order')) {
      this.pos++; this.tomar('by');
      do {
        if (orderBy.length) this.pos++;
        const k = this.ver(); const clave = k?.t === 'num' ? (this.pos++, k.v) : this.identificador();
        let desc = false; if (this.es('desc')) { desc = true; this.pos++; } else if (this.es('asc')) this.pos++;
        orderBy.push({ clave, desc });
      } while (this.ver()?.v === ',');
    }
    let limit = 500;
    if (this.es('limit')) { this.pos++; const k = this.ver(); if (k?.t !== 'num') throw new Error('LIMIT necesita un número.'); limit = Math.min(500, Number(k.v)); this.pos++; }
    const sobrante = this.ver();
    if (sobrante) throw new Error(`No entiendo "${sobrante.v}" en esa posición.`);
    return { distinct, items, tabla, where, groupBy, orderBy, limit };
  }

  private item(): Item {
    if (this.ver()?.v === '*') { this.pos++; return { tipo: 'todo' }; }
    const k = this.ver();
    const fn = k?.t === 'id' ? k.v.toLowerCase() : '';
    if (['count', 'sum', 'avg', 'min', 'max'].includes(fn) && this.tokens[this.pos + 1]?.v === '(') {
      this.pos += 2;
      let col = '*';
      if (this.ver()?.v === '*') this.pos++; else col = this.identificador();
      this.signo(')');
      return { tipo: 'agg', fn: fn as Agregado, col, alias: this.alias(`${fn.toUpperCase()}(${col})`) };
    }
    const col = this.identificador();
    return { tipo: 'col', col, alias: this.alias(col) };
  }
  private alias(porDefecto: string) {
    if (this.es('as')) { this.pos++; return this.identificador(); }
    const k = this.ver(); if (k?.t === 'id' && !PALABRAS.has(k.v.toLowerCase())) { this.pos++; return k.v; }
    return porDefecto;
  }

  private o(): Expr { let a = this.y(); while (this.es('or')) { this.pos++; a = { tipo: 'o', a, b: this.y() }; } return a; }
  private y(): Expr { let a = this.no(); while (this.es('and')) { this.pos++; a = { tipo: 'y', a, b: this.no() }; } return a; }
  private no(): Expr { if (this.es('not')) { this.pos++; return { tipo: 'no', e: this.no() }; } return this.condicion(); }
  private condicion(): Expr {
    if (this.ver()?.v === '(') { this.pos++; const e = this.o(); this.signo(')'); return e; }
    const col = this.identificador();
    if (this.es('is')) { this.pos++; const negado = this.es('not'); if (negado) this.pos++; this.tomar('null'); return { tipo: 'nulo', col, negado }; }
    let negado = false; if (this.es('not')) { negado = true; this.pos++; }
    if (this.es('like')) { this.pos++; const k = this.ver(); if (k?.t !== 'str') throw new Error('LIKE necesita un texto entre comillas simples.'); this.pos++; return { tipo: 'like', col, patron: k.v, negado }; }
    if (negado) throw new Error('NOT solo puede ir antes de LIKE o de una condición.');
    const op = this.ver(); if (op?.t !== 'op') throw new Error(`Falta un operador de comparación después de ${col}.`); this.pos++;
    return { tipo: 'cmp', col, op: op.v, valor: this.valor() };
  }
  private valor(): Primitivo {
    const k = this.ver(); if (!k) throw new Error('Falta el valor a comparar.'); this.pos++;
    if (k.t === 'num') return Number(k.v);
    if (k.t === 'str') return k.v;
    if (k.t === 'id' && k.v.toLowerCase() === 'true') return true;
    if (k.t === 'id' && k.v.toLowerCase() === 'false') return false;
    if (k.t === 'id' && k.v.toLowerCase() === 'null') return null;
    throw new Error(`Valor no válido: "${k.v}". Los textos van entre comillas simples.`);
  }
}

/* ─────────────── Ejecución ─────────────── */

function columna(fila: Fila, nombre: string, columnas: string[]): Primitivo {
  const real = columnas.find(c => c.toLowerCase() === nombre.toLowerCase());
  if (!real) throw new Error(`La columna "${nombre}" no existe. Revisa la lista de columnas de la tabla.`);
  return fila[real] ?? null;
}

function comparar(a: Primitivo, b: Primitivo) {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a ?? '').localeCompare(String(b ?? ''), 'es', { numeric: true });
}

function evaluar(e: Expr, f: Fila, cols: string[]): boolean {
  switch (e.tipo) {
    case 'y': return evaluar(e.a, f, cols) && evaluar(e.b, f, cols);
    case 'o': return evaluar(e.a, f, cols) || evaluar(e.b, f, cols);
    case 'no': return !evaluar(e.e, f, cols);
    case 'nulo': { const v = columna(f, e.col, cols); return (v === null || v === '') !== e.negado; }
    case 'like': {
      const v = String(columna(f, e.col, cols) ?? '');
      const re = new RegExp('^' + e.patron.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/%/g, '.*').replace(/_/g, '.') + '$', 'i');
      return re.test(v) !== e.negado;
    }
    case 'cmp': {
      const d = comparar(columna(f, e.col, cols), e.valor);
      return e.op === '=' ? d === 0 : e.op === '<>' || e.op === '!=' ? d !== 0 : e.op === '<' ? d < 0 : e.op === '<=' ? d <= 0 : e.op === '>' ? d > 0 : d >= 0;
    }
  }
}

function agregar(fn: Agregado, col: string, filas: Fila[], cols: string[]): Primitivo {
  if (fn === 'count') return col === '*' ? filas.length : filas.filter(f => columna(f, col, cols) !== null).length;
  const nums = filas.map(f => Number(columna(f, col, cols))).filter(Number.isFinite);
  if (!nums.length) return null;
  const r = fn === 'sum' ? nums.reduce((s, n) => s + n, 0) : fn === 'avg' ? nums.reduce((s, n) => s + n, 0) / nums.length : fn === 'min' ? Math.min(...nums) : Math.max(...nums);
  return Math.round(r * 100) / 100;
}

export interface Resultado { columnas: string[]; filas: Fila[]; total: number; truncado: boolean }

export function ejecutarConsulta(state: CompanyState, sql: string): Resultado {
  if (!sql.trim()) throw new Error('Escribe una consulta.');
  const q = new Parser(tokenizar(sql)).consulta();
  const tabla = buscarTabla(q.tabla);
  if (!tabla) throw new Error(`La tabla "${q.tabla}" no existe. Tablas disponibles: ${TABLAS.map(t => t.nombre).join(', ')}.`);
  let filas = tabla.filas(state);
  const cols = [...new Set(filas.flatMap(f => Object.keys(f)))];
  if (q.where) filas = filas.filter(f => evaluar(q.where as Expr, f, cols));

  const hayAgregados = q.items.some(i => i.tipo === 'agg');
  let salida: Fila[];
  if (hayAgregados || q.groupBy.length) {
    for (const i of q.items) if (i.tipo === 'col' && !q.groupBy.some(g => g.toLowerCase() === i.col.toLowerCase())) throw new Error(`"${i.col}" debe ir en GROUP BY o dentro de una función (SUM, COUNT…).`);
    if (q.items.some(i => i.tipo === 'todo')) throw new Error('No se puede usar * junto con funciones de agregado.');
    const grupos = new Map<string, Fila[]>();
    for (const f of filas) { const k = JSON.stringify(q.groupBy.map(g => columna(f, g, cols))); grupos.set(k, [...(grupos.get(k) ?? []), f]); }
    if (!q.groupBy.length && !grupos.size) grupos.set('[]', []);
    salida = [...grupos.values()].map(g => Object.fromEntries(q.items.map(i => i.tipo === 'agg' ? [i.alias, agregar(i.fn, i.col, g, cols)] : i.tipo === 'col' ? [i.alias, columna(g[0], i.col, cols)] : ['', null])));
  } else {
    salida = filas.map(f => {
      const fila: Fila = {};
      for (const i of q.items) {
        if (i.tipo === 'todo') Object.assign(fila, f);
        else if (i.tipo === 'col') fila[i.alias] = columna(f, i.col, cols);
      }
      return fila;
    });
  }
  if (q.distinct) { const vistos = new Set<string>(); salida = salida.filter(f => { const k = JSON.stringify(f); if (vistos.has(k)) return false; vistos.add(k); return true; }); }
  const columnasSalida = salida.length ? Object.keys(salida[0]) : q.items.flatMap(i => i.tipo === 'todo' ? cols : [i.alias]);
  if (q.orderBy.length) {
    salida.sort((a, b) => {
      for (const o of q.orderBy) {
        const clave = /^\d+$/.test(o.clave) ? columnasSalida[Number(o.clave) - 1] : columnasSalida.find(c => c.toLowerCase() === o.clave.toLowerCase());
        if (!clave) throw new Error(`No se puede ordenar por "${o.clave}": no está en el SELECT.`);
        const d = comparar(a[clave], b[clave]);
        if (d) return o.desc ? -d : d;
      }
      return 0;
    });
  }
  const total = salida.length;
  return { columnas: columnasSalida, filas: salida.slice(0, q.limit), total, truncado: total > q.limit };
}

/** Consultas de ejemplo que enseñan preguntas de negocio, no solo sintaxis. */
export const CONSULTAS_EJEMPLO: { titulo: string; pregunta: string; sql: string }[] = [
  { titulo: 'Mejores clientes', pregunta: '¿Quién compra más? ¿Depende la empresa de pocos clientes?', sql: 'SELECT cardName, COUNT(*) AS facturas, SUM(subtotal) AS ventas\nFROM OINV\nGROUP BY cardName\nORDER BY ventas DESC' },
  { titulo: 'Facturas pendientes de cobro', pregunta: '¿A quién hay que llamar hoy para cobrar?', sql: "SELECT docNumber, cardName, dueDate, total, paidAmount\nFROM OINV\nWHERE status = 'open'\nORDER BY dueDate" },
  { titulo: 'Artículos más vendidos', pregunta: '¿Qué productos mueven el negocio?', sql: "SELECT itemCode, description, SUM(quantity) AS unidades, SUM(lineTotal) AS ventas\nFROM INV1\nWHERE docType = 'invoice'\nGROUP BY itemCode, description\nORDER BY ventas DESC" },
  { titulo: 'Stock bajo el punto de reorden', pregunta: '¿Qué debo comprar antes de quedarme sin mercadería?', sql: 'SELECT itemCode, warehouseCode, quantity, value\nFROM OITW\nORDER BY quantity\nLIMIT 20' },
  { titulo: 'Movimientos de una cuenta', pregunta: '¿Qué asientos afectaron la cuenta de clientes?', sql: "SELECT entryNumber, date, memo, debit, credit\nFROM JDT1\nWHERE accountCode = '1.1.03'\nORDER BY date" },
  { titulo: 'Proveedores con más compras', pregunta: '¿Con quién conviene negociar mejores condiciones?', sql: 'SELECT cardName, SUM(subtotal) AS compras\nFROM OPCH\nGROUP BY cardName\nORDER BY compras DESC' },
];
