'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { round, usd } from '@/lib/company-calculations';
import { costoUnitario, listasDePrecios, nombreLista, precioDeLista } from '@/lib/company-pricing';
import type { Item } from '@/lib/firestore-types';
import { Screen, Field, Table, inputClass, buttonClass } from './FinixControls';
import { ParaPensar } from './AnalysisBlocks';
import DiscountOperationsPanel from './DiscountOperationsPanel';

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
  const vacia = { code: '', name: '', description: '', base: 1, factor: 1, currency: 'USD' as const, validFrom: '2026-01-01', validTo: '2099-12-31', active: true };
  const [nueva, setNueva] = useState<{ no?: number } & typeof vacia>(vacia);
  const [asistente, setAsistente] = useState<{ list: number; method: 'factor' | 'percent'; value: number }>({ list: 1, method: 'factor', value: 1 });
  const [especial, setEspecial] = useState({ cardCode: '', itemCode: '', discount: 0, validFrom: '2026-01-01', validTo: '2099-12-31', referenceList: 1, active: true });
  const [precioLista, setPrecioLista] = useState({ list: 0, itemCode: '', price: 0, unit: 'UND', validFrom: '2026-01-01', validTo: '2099-12-31', active: true });
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
      <Table headers={['N.º', 'Código', 'Nombre', 'Vigencia', 'Tipo', 'Factor', '']} rows={listas.map(l => [l.no, l.code, l.name, `${l.validFrom} a ${l.validTo}`, l.derivada ? 'Derivada' : 'Base', l.derivada ? `×${l.factor}` : '—',
        l.derivada ? <button key={l.no} type="button" className={buttonClass} onClick={() => setNueva({ no: l.no, code: l.code, name: l.name, description: l.description, base: l.base, factor: l.factor, currency: l.currency, validFrom: l.validFrom, validTo: l.validTo, active: l.active })}>Editar</button> : ''])} />
      <form className="space-y-2 border border-[#999] bg-white p-2" onSubmit={async e => { e.preventDefault(); if (await accion({ action: 'priceListSave', data: nueva })) setNueva(vacia); }}>
        <h4 className="font-bold text-[#003366]">{nueva.no ? `Editar lista ${nueva.no}` : 'Nueva lista de precios'}</h4>
        <div className="grid gap-2 sm:grid-cols-3">
          <Field label="Código de la lista"><input className={inputClass} value={nueva.code} onChange={e => setNueva(v => ({ ...v, code: e.target.value }))} placeholder="LPRECIO01" /></Field>
          <Field label="Nombre de la lista" required><input required minLength={2} className={inputClass} value={nueva.name} onChange={e => setNueva(v => ({ ...v, name: e.target.value }))} placeholder="Ej.: Escuelas 2" /></Field>
          <Field label="Descripción"><input className={inputClass} value={nueva.description} onChange={e => setNueva(v => ({ ...v, description: e.target.value }))} /></Field>
          <Field label="Lista base" required><select className={inputClass} value={nueva.base} onChange={e => setNueva(v => ({ ...v, base: Number(e.target.value) }))}>{listas.filter(l => !nueva.no || l.no < nueva.no).map(l => <option key={l.no} value={l.no}>{l.no} · {l.name}</option>)}</select></Field>
          <Field label="Factor" required><input required type="number" min="0.01" max="100" step="0.01" className={inputClass} value={nueva.factor} onChange={e => setNueva(v => ({ ...v, factor: Number(e.target.value) }))} /></Field>
          <Field label="Válida desde"><input type="date" className={inputClass} value={nueva.validFrom} onChange={e => setNueva(v => ({ ...v, validFrom: e.target.value }))} /></Field>
          <Field label="Válida hasta"><input type="date" className={inputClass} value={nueva.validTo} onChange={e => setNueva(v => ({ ...v, validTo: e.target.value }))} /></Field>
          <Field label="Activa"><input type="checkbox" checked={nueva.active} onChange={e => setNueva(v => ({ ...v, active: e.target.checked }))} /></Field>
        </div>
        <button type="submit" className={`${buttonClass} font-bold`} disabled={c.saving}>{nueva.no ? 'Actualizar lista' : 'Añadir lista'}</button>
        {nueva.no && <button type="button" className={`${buttonClass} ml-2`} onClick={() => setNueva(vacia)}>Cancelar</button>}
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

      <section className="mt-3 space-y-2 border border-[#999] bg-white p-2">
        <h3 className="font-bold text-[#003366]">Precio explícito en una lista derivada</h3>
        <p className="text-[#555]">Úsalo cuando un artículo debe tener un precio propio dentro de una lista; ese valor se guarda y tiene prioridad sobre el factor de la lista.</p>
        <form className="grid gap-2 sm:grid-cols-3" onSubmit={async event => { event.preventDefault(); if (await accion({ action: 'priceListItem', data: { ...precioLista, remove:false } })) setPrecioLista(v => ({ ...v, itemCode: '', price: 0 })); }}>
          <Field label="Lista de precios" required><select required className={inputClass} value={precioLista.list} onChange={e => setPrecioLista(v => ({ ...v, list: Number(e.target.value) }))}><option value={0}>Selecciona…</option>{listas.filter(l => l.derivada && l.active).map(l => <option key={l.no} value={l.no}>{l.code} · {l.name}</option>)}</select></Field>
          <Field label="Artículo" required><select required className={inputClass} value={precioLista.itemCode} onChange={e => { const item = articulos.find(x => x.itemCode === e.target.value); setPrecioLista(v => ({ ...v, itemCode:e.target.value, unit:item?.salesUnit ?? v.unit, price:item ? precioDeLista(c.data,item, v.list || 1) : v.price })); }}><option value="">Selecciona…</option>{articulos.map(item => <option key={item.id} value={item.itemCode}>{item.itemCode} · {item.name}</option>)}</select></Field>
          <Field label="Precio"><input required type="number" min="0" step="0.01" className={inputClass} value={precioLista.price} onChange={e => setPrecioLista(v => ({ ...v, price:Number(e.target.value) }))} /></Field>
          <Field label="Unidad de medida"><input required className={inputClass} value={precioLista.unit} onChange={e => setPrecioLista(v => ({ ...v, unit:e.target.value }))} /></Field>
          <Field label="Válida desde"><input required type="date" className={inputClass} value={precioLista.validFrom} onChange={e => setPrecioLista(v => ({ ...v, validFrom:e.target.value }))} /></Field>
          <Field label="Válida hasta"><input required type="date" className={inputClass} value={precioLista.validTo} onChange={e => setPrecioLista(v => ({ ...v, validTo:e.target.value }))} /></Field>
          <button type="submit" className={buttonClass} disabled={c.saving || !precioLista.list}>Guardar precio</button>
        </form>
        <Table headers={['Lista', 'Artículo', 'Precio', 'UM', 'Vigencia']} rows={listas.flatMap(list => (list.items ?? []).map(entry => [list.code, `${entry.itemCode} · ${entry.description}`, usd(entry.price), entry.unit, `${entry.validFrom} a ${entry.validTo}`]))} />
      </section>

      <h3 className="font-bold text-[#003366]">Lista asignada a cada cliente</h3>
      <Table headers={['Cliente', 'Lista de precios']} rows={c.data.customers.map(cl => [
        `${cl.cardCode} · ${cl.name}`,
        <select key={cl.cardCode} className={inputClass} disabled={c.saving} value={asignadas[cl.cardCode] ?? 1}
          onChange={e => { void accion({ action: 'customerPriceList', data: { cardCode: cl.cardCode, list: Number(e.target.value) } }); }}>
          {listas.map(l => <option key={l.no} value={l.no}>{l.no} · {l.name}</option>)}
        </select>,
      ])} />
      <section className="mt-4 space-y-2 border border-[#999] bg-white p-2">
        <h3 className="font-bold text-[#003366]">Precio especial por cliente</h3>
        <p className="text-[#555]">El descuento especial tiene prioridad sobre la lista asignada mientras esté vigente. Se aplica al cotizar y facturar.</p>
        <form className="grid gap-2 sm:grid-cols-3" onSubmit={async e => { e.preventDefault(); if (await accion({ action: 'specialPrice', data: { id: '', ...especial, remove: false } })) setEspecial(v => ({ ...v, cardCode: '', itemCode: '', discount: 0 })); }}>
          <Field label="Cliente" required><select required className={inputClass} value={especial.cardCode} onChange={e => setEspecial(v => ({ ...v, cardCode: e.target.value }))}><option value="">Selecciona…</option>{c.data.customers.map(x => <option key={x.id} value={x.cardCode}>{x.cardCode} · {x.name}</option>)}</select></Field>
          <Field label="Artículo" required><select required className={inputClass} value={especial.itemCode} onChange={e => setEspecial(v => ({ ...v, itemCode: e.target.value }))}><option value="">Selecciona…</option>{articulos.map(x => <option key={x.id} value={x.itemCode}>{x.itemCode} · {x.name}</option>)}</select></Field>
          <Field label="Descuento %"><input type="number" min={0} max={100} step="0.01" className={inputClass} value={especial.discount} onChange={e => setEspecial(v => ({ ...v, discount: Number(e.target.value) }))} /></Field>
          <Field label="Lista de referencia"><select className={inputClass} value={especial.referenceList} onChange={e => setEspecial(v => ({ ...v, referenceList: Number(e.target.value) }))}>{listas.filter(x => x.active).map(x => <option key={x.no} value={x.no}>{x.code} · {x.name}</option>)}</select></Field>
          <Field label="Válida desde"><input type="date" className={inputClass} value={especial.validFrom} onChange={e => setEspecial(v => ({ ...v, validFrom: e.target.value }))} /></Field>
          <Field label="Válida hasta"><input type="date" className={inputClass} value={especial.validTo} onChange={e => setEspecial(v => ({ ...v, validTo: e.target.value }))} /></Field>
          <button type="submit" className={buttonClass} disabled={c.saving}>Guardar precio especial</button>
        </form>
        <Table headers={['Cliente', 'Artículo', 'Lista', 'Descuento', 'Vigencia']} rows={(c.data.profile?.specialPrices ?? []).filter(x => x.active).map(x => [x.cardCode, x.itemCode, nombreLista(c.data, x.referenceList), `${x.discount} %`, `${x.validFrom} a ${x.validTo}`])} />
      </section>
      <DiscountOperationsPanel />
      <ParaPensar clave={`b1_listas_${c.data.profile?.uid ?? 'anon'}`} preguntas={[
        '¿Qué condiciones debería cumplir un cliente para merecer la lista Mayorista: volumen, puntualidad de pago, ambas?',
        'Si el costo de un artículo sube 8 %, ¿qué lista ajustarías primero y cómo se lo comunicarías al cliente?',
        '¿Es aceptable vender un artículo con margen negativo? ¿En qué estrategia podría tener sentido?',
      ]} />
    </Screen>
  );
}
