import type { CompanyState } from './firestore-types';
import { round } from './company-calculations';

export const NOMBRES_LISTA: Record<1 | 2 | 3, string> = { 1: 'General', 2: 'Mayorista', 3: 'Distribuidor' };

export interface PrecioSugerido {
  lista: 1 | 2 | 3; nombreLista: string; precio: number; descuento: number; reglaDescuento: string;
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
  const porLista = lista === 2 ? item.price2 : lista === 3 ? item.price3 : item.price;
  const precio = porLista > 0 ? porLista : item.price;
  const reglas = (state.profile?.volumeDiscounts ?? [])
    .filter(v => (v.itemCode === itemCode || v.itemCode === '*') && cantidad >= v.minQuantity)
    .sort((a, b) => b.discount - a.discount);
  const descuento = Math.min(reglas[0]?.discount ?? 0, item.maxDiscount);
  const precioNeto = round(precio * (1 - descuento / 100));
  const costo = costoUnitario(state, itemCode);
  return {
    lista, nombreLista: NOMBRES_LISTA[lista], precio, descuento,
    reglaDescuento: reglas[0] ? `Desde ${reglas[0].minQuantity} unidades: ${reglas[0].discount} %` : '',
    precioNeto, costo, margenPct: precioNeto > 0 ? round(((precioNeto - costo) / precioNeto) * 100) : null, topeDescuento: item.maxDiscount,
  };
}
