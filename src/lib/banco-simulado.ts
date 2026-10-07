/**
 * Banca en línea SIMULADA de Banco Pichincha, Banco del Pacífico, Banco Guayaquil y Produbanco.
 *
 * En Ecuador las pymes no se conectan al banco por una API pública: descargan el extracto de su banca empresas
 * (Excel/CSV/TXT) y suben archivos de pagos con el formato propio de cada banco. Aquí se reproduce ese flujo.
 *
 * IMPORTANTE: los formatos de abajo son SIMULADOS para formación (`oficial: false`). Cada banco entrega su
 * especificación oficial a sus clientes empresariales; cuando la empresa la tenga, se reemplaza el adaptador
 * de ese banco sin cambiar el resto del sistema.
 */
import type { BankTransaction } from '@/lib/firestore-types';

export type BancoId = 'pichincha' | 'pacifico' | 'guayaquil' | 'produbanco';

interface Adaptador {
  nombre: string;
  oficial: false;
  separador: ';' | ',' | '|';
  fecha: 'DD/MM/AAAA' | 'AAAA-MM-DD';
  /** true = columnas Débito y Crédito separadas; false = una columna Monto con signo. */
  debitoCredito: boolean;
  columnas: string[];
}

export const BANCOS: Record<BancoId, Adaptador> = {
  pichincha: { nombre: 'Banco Pichincha', oficial: false, separador: ';', fecha: 'DD/MM/AAAA', debitoCredito: true, columnas: ['Fecha', 'Referencia', 'Descripción', 'Débito', 'Crédito', 'Saldo'] },
  pacifico: { nombre: 'Banco del Pacífico', oficial: false, separador: ',', fecha: 'AAAA-MM-DD', debitoCredito: false, columnas: ['Fecha', 'Documento', 'Concepto', 'Monto', 'Saldo'] },
  guayaquil: { nombre: 'Banco Guayaquil', oficial: false, separador: '|', fecha: 'DD/MM/AAAA', debitoCredito: false, columnas: ['FECHA', 'REFERENCIA', 'DETALLE', 'VALOR', 'SALDO'] },
  produbanco: { nombre: 'Produbanco', oficial: false, separador: ';', fecha: 'AAAA-MM-DD', debitoCredito: true, columnas: ['Fecha contable', 'Nro. documento', 'Descripción', 'Cargos', 'Abonos', 'Saldo disponible'] },
};

export function detectarBanco(nombreBanco: string): BancoId | null {
  const n = nombreBanco.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  if (n.includes('pichincha')) return 'pichincha';
  if (n.includes('pacifico')) return 'pacifico';
  if (n.includes('guayaquil')) return 'guayaquil';
  if (n.includes('produbanco')) return 'produbanco';
  return null;
}

export interface LineaExtracto { fecha: string; referencia: string; descripcion: string; monto: number }

const fechaBanco = (iso: string, f: Adaptador['fecha']) => (f === 'AAAA-MM-DD' ? iso.slice(0, 10) : iso.slice(0, 10).split('-').reverse().join('/'));
const fechaIso = (texto: string) => (/^\d{2}\/\d{2}\/\d{4}$/.test(texto) ? texto.split('/').reverse().join('-') : texto.slice(0, 10));
const dinero = (n: number) => n.toFixed(2);
const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Extracto del período, como lo descargaría la empresa de su banca en línea: sus movimientos más los que el banco
 * registra por su cuenta (comisión de mantenimiento e interés), que la empresa debe contabilizar al conciliar.
 */
export function generarExtracto(banco: BancoId, movimientos: BankTransaction[], saldoInicial = 0): string {
  const a = BANCOS[banco];
  const lineas: LineaExtracto[] = [...movimientos]
    .sort((x, y) => x.date.localeCompare(y.date))
    .map((m) => ({ fecha: m.date, referencia: m.reference || m.transactionId, descripcion: m.type === 'deposit' ? 'Depósito / transferencia recibida' : 'Pago / transferencia enviada', monto: m.type === 'deposit' ? m.amount : -m.amount }));
  const ultimo = lineas.at(-1)?.fecha ?? new Date().toISOString().slice(0, 10);
  const cierre = `${ultimo.slice(0, 7)}-28`;
  lineas.push({ fecha: cierre, referencia: 'COM-MANT', descripcion: 'Comisión mantenimiento de cuenta', monto: -2.5 });
  const saldoAntes = r2(lineas.reduce((s, l) => s + l.monto, saldoInicial));
  if (saldoAntes > 0) lineas.push({ fecha: cierre, referencia: 'INT-GAN', descripcion: 'Interés ganado', monto: r2(saldoAntes * 0.0005) });

  let saldo = saldoInicial;
  const filas = lineas.map((l) => {
    saldo = r2(saldo + l.monto);
    const valores = a.debitoCredito
      ? [fechaBanco(l.fecha, a.fecha), l.referencia, l.descripcion, l.monto < 0 ? dinero(-l.monto) : '', l.monto > 0 ? dinero(l.monto) : '', dinero(saldo)]
      : [fechaBanco(l.fecha, a.fecha), l.referencia, l.descripcion, dinero(l.monto), dinero(saldo)];
    return valores.join(a.separador);
  });
  return [`# ${a.nombre} · extracto en FORMATO SIMULADO para formación (no es el formato oficial del banco)`, a.columnas.join(a.separador), ...filas].join('\n');
}

/** Lee un extracto con el formato del banco y lo normaliza (montos con signo: + entra, − sale). */
export function leerExtracto(banco: BancoId, texto: string): LineaExtracto[] {
  const a = BANCOS[banco];
  return texto.split(/\r?\n/)
    .filter((l) => l.trim() && !l.startsWith('#'))
    .slice(1)
    .map((l) => l.split(a.separador).map((c) => c.trim()))
    .filter((c) => c.length >= a.columnas.length - 1)
    .map((c) => ({
      fecha: fechaIso(c[0]), referencia: c[1], descripcion: c[2],
      monto: a.debitoCredito ? r2((Number(c[4]) || 0) - (Number(c[3]) || 0)) : r2(Number(c[3]) || 0),
    }));
}

/**
 * Conciliación automática: cada línea del extracto se empareja con un movimiento no conciliado del mismo monto,
 * prefiriendo la misma referencia y, si no, la fecha más cercana (máximo 5 días). Lo que queda sin pareja son
 * movimientos que el banco registró y la empresa todavía no (comisiones, intereses) o diferencias por revisar.
 */
export function conciliar(lineas: LineaExtracto[], movimientos: BankTransaction[]) {
  const libres = movimientos.filter((m) => !m.reconciled);
  const usados = new Set<string>();
  const emparejados: { movimiento: BankTransaction; linea: LineaExtracto }[] = [];
  const sinPareja: LineaExtracto[] = [];
  for (const linea of lineas) {
    const candidatos = libres.filter((m) => !usados.has(m.id) && r2(m.type === 'deposit' ? m.amount : -m.amount) === linea.monto);
    const dias = (m: BankTransaction) => Math.abs(Date.parse(m.date) - Date.parse(linea.fecha)) / 86400000;
    const elegido = candidatos.find((m) => m.reference && m.reference === linea.referencia)
      ?? candidatos.filter((m) => dias(m) <= 5).sort((x, y) => dias(x) - dias(y))[0];
    if (elegido) { usados.add(elegido.id); emparejados.push({ movimiento: elegido, linea }); } else sinPareja.push(linea);
  }
  return { emparejados, sinPareja };
}

export interface PagoProveedor { proveedor: string; ruc: string; monto: number; referencia: string }

/** Archivo de pagos a proveedores para "subir" a la banca empresas (formato simulado del banco). */
export function generarArchivoPagos(banco: BancoId, cuentaOrigen: string, pagos: PagoProveedor[]): string {
  const a = BANCOS[banco];
  const total = r2(pagos.reduce((s, p) => s + p.monto, 0));
  const hoy = fechaBanco(new Date().toISOString(), a.fecha);
  return [
    `# ${a.nombre} · archivo de pagos en FORMATO SIMULADO para formación (no es el formato oficial del banco)`,
    ['CAB', cuentaOrigen, hoy, String(pagos.length), dinero(total)].join(a.separador),
    ...pagos.map((p, i) => ['DET', String(i + 1).padStart(4, '0'), p.ruc, p.proveedor, dinero(p.monto), p.referencia].join(a.separador)),
  ].join('\n');
}
