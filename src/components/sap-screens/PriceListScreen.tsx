'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { round, usd } from '@/lib/company-calculations';
import { costoUnitario, NOMBRES_LISTA } from '@/lib/company-pricing';
import type { Item } from '@/lib/firestore-types';
import { Screen, Table, inputClass, buttonClass } from './SAPControls';
import { ParaPensar } from './AnalysisBlocks';

function margen(precio: number, costo: number) {
  if (precio <= 0) return <span className="text-[#555]">—</span>;
  const m = round(((precio - costo) / precio) * 100);
  const color = m < 0 ? 'text-[#c62828]' : m < 15 ? 'text-[#b26a00]' : 'text-[#2e7d32]';
  return <span className={`font-bold ${color}`}>{m.toLocaleString('es-EC', { maximumFractionDigits: 1 })} %</span>;
}

function FilaArticulo({ item }: { item: Item }) {
  const c = useCompany();
  const [p, setP] = useState({ price: item.price, price2: item.price2, price3: item.price3 });
  const costo = costoUnitario(c.data, item.itemCode);
  const cambiado = p.price !== item.price || p.price2 !== item.price2 || p.price3 !== item.price3;
  const campo = (k: keyof typeof p) => <input aria-label={`${NOMBRES_LISTA[k === 'price' ? 1 : k === 'price2' ? 2 : 3]} ${item.name}`} type="number" min={0} step="0.01" className={inputClass} value={p[k]} onChange={e => setP(v => ({ ...v, [k]: Number(e.target.value) }))} />;
  return (
    <tr className="hover:bg-[#FFFDE7]">
      <td className="border border-[#999] p-2">{item.itemCode} · {item.name}</td>
      <td className="border border-[#999] p-2 text-right">{usd(costo)}</td>
      <td className="border border-[#999] p-2">{campo('price')}{margen(p.price, costo)}</td>
      <td className="border border-[#999] p-2">{campo('price2')}{margen(p.price2, costo)}</td>
      <td className="border border-[#999] p-2">{campo('price3')}{margen(p.price3, costo)}</td>
      <td className="border border-[#999] p-2">
        <button type="button" className={buttonClass} disabled={!cambiado || c.saving} onClick={async () => { try { await c.save({ action: 'itemPrices', data: { itemCode: item.itemCode, ...p } }); } catch { /* error visible */ } }}>Guardar</button>
      </td>
    </tr>
  );
}

/** Listas de precios (SAL007): tres listas por artículo, margen contra costo y lista por cliente. */
export default function PriceListScreen() {
  const c = useCompany();
  const asignadas = c.data.profile?.customerPriceLists ?? {};
  const articulos = c.data.items.filter(i => i.active);
  return (
    <Screen title="Listas de precios">
      <p className="border-l-4 border-[#0055A5] bg-white p-2">
        Cada artículo tiene tres precios: <strong>General</strong>, <strong>Mayorista</strong> y <strong>Distribuidor</strong>. A cada cliente se le asigna una
        lista y SAP propone ese precio al facturar. El margen se calcula contra el <strong>costo real</strong> del inventario: rojo significa que vendes a pérdida.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white text-left">
          <thead className="bg-[#D4D0C8]"><tr>{['Artículo', 'Costo actual', 'Lista 1 · General', 'Lista 2 · Mayorista', 'Lista 3 · Distribuidor', ''].map(h => <th key={h} scope="col" className="border border-[#999] p-2">{h}</th>)}</tr></thead>
          <tbody>
            {articulos.map(i => <FilaArticulo key={`${i.id}-${i.updatedAt}`} item={i} />)}
            {!articulos.length && <tr><td colSpan={6} className="p-4 text-center">Crea artículos para definir sus precios.</td></tr>}
          </tbody>
        </table>
      </div>
      <h3 className="font-bold text-[#003366]">Lista asignada a cada cliente</h3>
      <Table headers={['Cliente', 'Lista de precios']} rows={c.data.customers.map(cl => [
        `${cl.cardCode} · ${cl.name}`,
        <select key={cl.cardCode} className={inputClass} disabled={c.saving} value={asignadas[cl.cardCode] ?? 1}
          onChange={async e => { try { await c.save({ action: 'customerPriceList', data: { cardCode: cl.cardCode, list: Number(e.target.value) as 1 | 2 | 3 } }); } catch { /* error visible */ } }}>
          {([1, 2, 3] as const).map(n => <option key={n} value={n}>{n} · {NOMBRES_LISTA[n]}</option>)}
        </select>,
      ])} />
      <ParaPensar clave={`b1_listas_${c.data.profile?.uid ?? 'anon'}`} preguntas={[
        '¿Qué condiciones debería cumplir un cliente para merecer la lista Mayorista: volumen, puntualidad de pago, ambas?',
        'Si el costo de un artículo sube 8 %, ¿qué lista ajustarías primero y cómo se lo comunicarías al cliente?',
        '¿Es aceptable vender un artículo con margen negativo? ¿En qué estrategia podría tener sentido?',
      ]} />
    </Screen>
  );
}
