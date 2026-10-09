'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { round, usd } from '@/lib/company-calculations';
import { costoUnitario, listasDePrecios, precioDeLista } from '@/lib/company-pricing';
import type { Item } from '@/lib/firestore-types';
import { Screen, Field, Table, inputClass, buttonClass } from './SAPControls';
import { ParaPensar } from './AnalysisBlocks';

function margen(precio: number, costo: number) {
  if (precio <= 0) return <span className="text-[#555]">—</span>;
  const m = round(((precio - costo) / precio) * 100);
  const color = m < 0 ? 'text-[#c62828]' : m < 15 ? 'text-[#b26a00]' : 'text-[#2e7d32]';
  return <span className={`font-bold ${color}`}>{m.toLocaleString('es-EC', { maximumFractionDigits: 1 })} %</span>;
}

/** Una fila por artículo: las listas base (1 a 3) se editan; las derivadas se calculan con su factor. */
function FilaArticulo({ item }: { item: Item }) {
  const c = useCompany();
  const listas = listasDePrecios(c.data);
  const [p, setP] = useState({ price: item.price, price2: item.price2, price3: item.price3 });
  const costo = costoUnitario(c.data, item.itemCode);
  const cambiado = p.price !== item.price || p.price2 !== item.price2 || p.price3 !== item.price3;
  const campo = (k: keyof typeof p, nombre: string) => <input aria-label={`${nombre} ${item.name}`} type="number" min={0} step="0.01" className={inputClass} value={p[k]} onChange={e => setP(v => ({ ...v, [k]: Number(e.target.value) }))} />;
  return (
    <tr className="hover:bg-[#FFFDE7]">
      <td className="border border-[#999] p-2">{item.itemCode} · {item.name}</td>
      <td className="border border-[#999] p-2 text-right">{usd(costo)}</td>
      <td className="border border-[#999] p-2">{campo('price', 'General')}{margen(p.price, costo)}</td>
      <td className="border border-[#999] p-2">{campo('price2', 'Mayorista')}{margen(p.price2, costo)}</td>
      <td className="border border-[#999] p-2">{campo('price3', 'Distribuidor')}{margen(p.price3, costo)}</td>
      {listas.filter(l => l.derivada).map(l => { const precio = precioDeLista(c.data, item, l.no); return <td key={l.no} className="border border-[#999] p-2 text-right">{usd(precio)}<br />{margen(precio, costo)}</td>; })}
      <td className="border border-[#999] p-2">
        <button type="button" className={buttonClass} disabled={!cambiado || c.saving} onClick={async () => { try { await c.save({ action: 'itemPrices', data: { itemCode: item.itemCode, ...p } }); } catch { /* error visible */ } }}>Guardar</button>
      </td>
    </tr>
  );
}

/** Listas de precios (SAL007): listas base y derivadas con factor, asistente de actualización, margen contra costo y lista por cliente. */
export default function PriceListScreen() {
  const c = useCompany();
  const asignadas = c.data.profile?.customerPriceLists ?? {};
  const articulos = c.data.items.filter(i => i.active);
  const listas = listasDePrecios(c.data);
  const [nueva, setNueva] = useState<{ no?: number; name: string; base: number; factor: number }>({ name: '', base: 1, factor: 1 });
  const [asistente, setAsistente] = useState<{ list: number; method: 'factor' | 'percent'; value: number }>({ list: 1, method: 'factor', value: 1 });
  const accion = async (command: Parameters<typeof c.save>[0]) => { try { await c.save(command); return true; } catch { return false; } };
  const mult = asistente.method === 'factor' ? asistente.value : 1 + asistente.value / 100;
  const listaAsist = listas.find(l => l.no === asistente.list);
  const campoBase = (['price', 'price', 'price2', 'price3'] as const)[asistente.list];

  return (
    <Screen title="Listas de precios">
      <p className="border-l-4 border-[#0055A5] bg-white p-2">
        Las listas <strong>1 General</strong>, <strong>2 Mayorista</strong> y <strong>3 Distribuidor</strong> son listas base: tú escribes el precio de cada artículo. Una lista nueva puede
        <strong> derivarse</strong> de otra con un <strong>factor</strong> (por ejemplo ×2,0): sus precios se calculan solos y cambian cuando cambia la lista base. A cada cliente se le asigna una lista y Finix ERP propone ese precio al facturar.
      </p>

      <h3 className="font-bold text-[#003366]">Listas de precios</h3>
      <Table headers={['N.º', 'Nombre', 'Tipo', 'Lista base', 'Factor', '']} rows={listas.map(l => [l.no, l.name, l.derivada ? 'Derivada' : 'Base', l.derivada ? `${l.base} · ${listas.find(x => x.no === l.base)?.name ?? ''}` : '—', l.derivada ? `×${l.factor}` : '—',
        l.derivada ? <button key={l.no} type="button" className={buttonClass} onClick={() => setNueva({ no: l.no, name: l.name, base: l.base, factor: l.factor })}>Editar</button> : ''])} />
      <form className="space-y-2 border border-[#999] bg-white p-2" onSubmit={async e => { e.preventDefault(); if (await accion({ action: 'priceListSave', data: nueva })) setNueva({ name: '', base: 1, factor: 1 }); }}>
        <h4 className="font-bold text-[#003366]">{nueva.no ? `Editar lista ${nueva.no}` : 'Nueva lista de precios'}</h4>
        <div className="grid gap-2 sm:grid-cols-3">
          <Field label="Nombre de la lista" required><input required minLength={2} className={inputClass} value={nueva.name} onChange={e => setNueva(v => ({ ...v, name: e.target.value }))} placeholder="Ej.: Escuelas 2" /></Field>
          <Field label="Lista base" required><select className={inputClass} value={nueva.base} onChange={e => setNueva(v => ({ ...v, base: Number(e.target.value) }))}>{listas.filter(l => !nueva.no || l.no < nueva.no).map(l => <option key={l.no} value={l.no}>{l.no} · {l.name}</option>)}</select></Field>
          <Field label="Factor" required><input required type="number" min="0.01" max="100" step="0.01" className={inputClass} value={nueva.factor} onChange={e => setNueva(v => ({ ...v, factor: Number(e.target.value) }))} /></Field>
        </div>
        <button type="submit" className={`${buttonClass} font-bold`} disabled={c.saving}>{nueva.no ? 'Actualizar lista' : 'Añadir lista'}</button>
        {nueva.no && <button type="button" className={`${buttonClass} ml-2`} onClick={() => setNueva({ name: '', base: 1, factor: 1 })}>Cancelar</button>}
      </form>

      <h3 className="font-bold text-[#003366]">Asistente de actualización de precios</h3>
      <div className="space-y-2 border border-[#999] bg-white p-2">
        <div className="grid gap-2 sm:grid-cols-3">
          <Field label="Lista a actualizar"><select className={inputClass} value={asistente.list} onChange={e => setAsistente(v => ({ ...v, list: Number(e.target.value) }))}>{listas.map(l => <option key={l.no} value={l.no}>{l.no} · {l.name}</option>)}</select></Field>
          <Field label="Método"><select className={inputClass} value={asistente.method} onChange={e => { const method = e.target.value as 'factor' | 'percent'; setAsistente(v => ({ ...v, method, value: method === 'factor' ? 1 : 0 })); }}><option value="factor">Factor (multiplicar)</option><option value="percent">Porcentaje (subir o bajar)</option></select></Field>
          <Field label={asistente.method === 'factor' ? 'Factor' : 'Porcentaje %'}><input type="number" step="0.01" className={inputClass} value={asistente.value} onChange={e => setAsistente(v => ({ ...v, value: Number(e.target.value) }))} /></Field>
        </div>
        <p className="text-[#555]">{listaAsist?.derivada ? `La lista ${listaAsist.name} es derivada: se cambia su factor (de ×${listaAsist.factor} a ×${Math.round(listaAsist.factor * mult * 10000) / 10000}).` : 'Es una lista base: se cambia el precio de cada artículo.'}</p>
        <Table headers={['Simulación (antes de aplicar)', 'Precio actual', 'Precio nuevo']} rows={articulos.slice(0, 5).map(a => { const actual = listaAsist?.derivada ? precioDeLista(c.data, a, asistente.list) : a[campoBase]; return [`${a.itemCode} · ${a.name}`, usd(actual), usd(round(actual * (mult > 0 ? mult : 1)))]; })} />
        <button type="button" className={`${buttonClass} font-bold`} disabled={c.saving || !(mult > 0)} onClick={() => accion({ action: 'priceUpdate', data: asistente })}>Aplicar actualización</button>
      </div>

      <h3 className="font-bold text-[#003366]">Precios por artículo</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white text-left">
          <thead className="bg-[#D4D0C8]"><tr>{['Artículo', 'Costo actual', 'Lista 1 · General', 'Lista 2 · Mayorista', 'Lista 3 · Distribuidor', ...listas.filter(l => l.derivada).map(l => `Lista ${l.no} · ${l.name}`), ''].map(h => <th key={h} scope="col" className="border border-[#999] p-2">{h}</th>)}</tr></thead>
          <tbody>
            {articulos.map(i => <FilaArticulo key={`${i.id}-${i.updatedAt}-${listas.length}`} item={i} />)}
            {!articulos.length && <tr><td colSpan={6} className="p-4 text-center">Crea artículos para definir sus precios.</td></tr>}
          </tbody>
        </table>
      </div>

      <h3 className="font-bold text-[#003366]">Lista asignada a cada cliente</h3>
      <Table headers={['Cliente', 'Lista de precios']} rows={c.data.customers.map(cl => [
        `${cl.cardCode} · ${cl.name}`,
        <select key={cl.cardCode} className={inputClass} disabled={c.saving} value={asignadas[cl.cardCode] ?? 1}
          onChange={e => { void accion({ action: 'customerPriceList', data: { cardCode: cl.cardCode, list: Number(e.target.value) } }); }}>
          {listas.map(l => <option key={l.no} value={l.no}>{l.no} · {l.name}</option>)}
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
