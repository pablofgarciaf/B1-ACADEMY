import type { CompanyState } from './firestore-types';
import { round } from './company-calculations';

export const NOMBRES_LISTA: Record<1 | 2 | 3, string> = { 1: 'General', 2: 'Mayorista', 3: 'Distribuidor' };

export interface ListaPrecios { no: number; name: string; base: number; factor: number; derivada: boolean }

/** Las tres listas base (precios por artículo) más las derivadas de otra lista con un factor. */
export function listasDePrecios(state: CompanyState): ListaPrecios[] {
  const base: ListaPrecios[] = ([1, 2, 3] as const).map(no => ({ no, name: NOMBRES_LISTA[no], base: 0, factor: 1, derivada: false }));
  return [...base, ...(state.profile?.priceLists ?? []).map(l => ({ ...l, derivada: true }))];
}

export const nombreLista = (state: CompanyState, no: number): string => listasDePrecios(state).find(l => l.no === no)?.name ?? NOMBRES_LISTA[1];

/** Precio de un artículo en una lista: el propio de las listas 1 a 3, o el de la lista base por el factor. */
export function precioDeLista(state: CompanyState, item: { price: number; price2: number; price3: number }, no: number, profundidad = 0): number {
  if (no === 2) return item.price2;
  if (no === 3) return item.price3;
  if (no === 1) return item.price;
  const lista = state.profile?.priceLists?.find(l => l.no === no);
  if (!lista || profundidad > 10) return item.price;
  return round(precioDeLista(state, item, lista.base, profundidad + 1) * lista.factor);
}

export interface PrecioSugerido {
  lista: number; nombreLista: string; precio: number; descuento: number; reglaDescuento: string;
  precioNeto: number; costo: number; margenPct: number | null; topeDescuento: number;
}

/** Costo unitario actual del artículo (promedio ponderado de sus almacenes o, si no hay stock, el precio de compra). */
export function costoUnitario(state: CompanyState, itemCode: string): number {
  const filas = state.warehouseStock.filter(s => s.itemCode === itemCode && s.quantity > 0);
  const qty = filas.reduce((s, f) => s + f.quantity, 0);
  if (qty > 0) return round(filas.reduce((s, f) => s + f.value, 0) / qty);
  return state.items.find(i => i.itemCode === itemCode)?.purchasePrice ?? 0;
}

/**
 * Precio que SAP propondría: el de la lista asignada al cliente y el mejor descuento por volumen
 * aplicable a la cantidad, sin superar el descuento máximo del artículo.
 */
export function precioSugerido(state: CompanyState, cardCode: string, itemCode: string, cantidad: number): PrecioSugerido | null {
  const item = state.items.find(i => i.itemCode === itemCode);
  if (!item) return null;
  const lista = state.profile?.customerPriceLists?.[cardCode] ?? 1;
  const porLista = precioDeLista(state, item, lista);
  const precio = porLista > 0 ? porLista : item.price;
  const reglas = (state.profile?.volumeDiscounts ?? [])
    .filter(v => (v.itemCode === itemCode || v.itemCode === '*') && cantidad >= v.minQuantity)
    .sort((a, b) => b.discount - a.discount);
  const descuento = Math.min(reglas[0]?.discount ?? 0, item.maxDiscount);
  const precioNeto = round(precio * (1 - descuento / 100));
  const costo = costoUnitario(state, itemCode);
  return {
    lista, nombreLista: nombreLista(state, lista), precio, descuento,
    reglaDescuento: reglas[0] ? `Desde ${reglas[0].minQuantity} unidades: ${reglas[0].discount} %` : '',
    precioNeto, costo, margenPct: precioNeto > 0 ? round(((precioNeto - costo) / precioNeto) * 100) : null, topeDescuento: item.maxDiscount,
  };
}
