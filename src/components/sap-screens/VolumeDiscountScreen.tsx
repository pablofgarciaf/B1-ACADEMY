'use client';
import { useMemo, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { usd } from '@/lib/company-calculations';
import { precioSugerido } from '@/lib/company-pricing';
import { Screen, Field, Table, inputClass, buttonClass } from './SAPControls';
import { ParaPensar } from './AnalysisBlocks';

/** Descuentos por volumen (SAL008) + simulador de precio y margen. */
export default function VolumeDiscountScreen() {
  const c = useCompany();
  const reglas = c.data.profile?.volumeDiscounts ?? [];
  const nombre = (code: string) => (code === '*' ? 'Todos los artículos' : c.data.items.find(i => i.itemCode === code)?.name ?? code);
  const [nueva, setNueva] = useState({ itemCode: '*', minQuantity: 10, discount: 5 });
  const [sim, setSim] = useState({ cardCode: '', itemCode: '', cantidad: 1 });
  const r = useMemo(() => (sim.itemCode ? precioSugerido(c.data, sim.cardCode, sim.itemCode, sim.cantidad) : null), [c.data, sim]);
  const guardar = async () => { try { await c.save({ action: 'volumeDiscount', data: { id: '', ...nueva, remove: false } }); } catch { /* error visible */ } };
  const quitar = async (id: string, itemCode: string) => { try { await c.save({ action: 'volumeDiscount', data: { id, itemCode, minQuantity: 1, discount: 0, remove: true } }); } catch { /* error visible */ } };

  return (
    <Screen title="Descuentos por volumen">
      <p className="border-l-4 border-[#0055A5] bg-white p-2">
        Premia a quien compra más, pero <strong>sin regalar el margen</strong>. Cada regla aplica un descuento desde cierta cantidad; nunca supera
        el descuento máximo del artículo. Se aplica solo al registrar ventas.
      </p>
      <section className="space-y-2 border border-[#999] bg-white p-2">
        <h3 className="font-bold text-[#003366]">Nueva regla</h3>
        <div className="grid gap-2 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end">
          <Field label="Artículo"><select className={inputClass} value={nueva.itemCode} onChange={e => setNueva(v => ({ ...v, itemCode: e.target.value }))}><option value="*">Todos los artículos</option>{c.data.items.map(i => <option key={i.id} value={i.itemCode}>{i.itemCode} · {i.name} (máx. {i.maxDiscount} %)</option>)}</select></Field>
          <Field label="Desde cantidad"><input type="number" min={1} step="any" className={inputClass} value={nueva.minQuantity} onChange={e => setNueva(v => ({ ...v, minQuantity: Number(e.target.value) }))} /></Field>
          <Field label="Descuento %"><input type="number" min={0} max={100} step="any" className={inputClass} value={nueva.discount} onChange={e => setNueva(v => ({ ...v, discount: Number(e.target.value) }))} /></Field>
          <button type="button" className={buttonClass} disabled={c.saving} onClick={guardar}>Añadir</button>
        </div>
        <Table headers={['Artículo', 'Desde cantidad', 'Descuento', '']} rows={[...reglas].sort((a, b) => a.itemCode.localeCompare(b.itemCode) || a.minQuantity - b.minQuantity).map(v => [
          nombre(v.itemCode), v.minQuantity, `${v.discount} %`,
          <button key={v.id} type="button" className={buttonClass} disabled={c.saving} onClick={() => quitar(v.id, v.itemCode)}>Eliminar</button>,
        ])} />
      </section>

      <section className="space-y-2 border border-[#999] bg-white p-2">
        <h3 className="font-bold text-[#003366]">Simulador de precio</h3>
        <div className="grid gap-2 sm:grid-cols-3">
          <Field label="Cliente"><select className={inputClass} value={sim.cardCode} onChange={e => setSim(v => ({ ...v, cardCode: e.target.value }))}><option value="">(lista general)</option>{c.data.customers.map(cl => <option key={cl.id} value={cl.cardCode}>{cl.name}</option>)}</select></Field>
          <Field label="Artículo"><select className={inputClass} value={sim.itemCode} onChange={e => setSim(v => ({ ...v, itemCode: e.target.value }))}><option value="">Selecciona…</option>{c.data.items.map(i => <option key={i.id} value={i.itemCode}>{i.name}</option>)}</select></Field>
          <Field label="Cantidad"><input type="number" min={1} step="any" className={inputClass} value={sim.cantidad} onChange={e => setSim(v => ({ ...v, cantidad: Number(e.target.value) }))} /></Field>
        </div>
        {r && (
          <Table headers={['Concepto', 'Valor']} rows={[
            ['Lista aplicada', r.nombreLista], ['Precio de lista', usd(r.precio)],
            ['Descuento por volumen', r.descuento ? `${r.descuento} % (${r.reglaDescuento})` : 'Ninguno para esta cantidad'],
            ['Precio neto unitario', usd(r.precioNeto)], ['Costo unitario', usd(r.costo)],
            ['Margen', <strong key="m" className={r.margenPct !== null && r.margenPct < 0 ? 'text-[#c62828]' : 'text-[#2e7d32]'}>{r.margenPct === null ? '—' : `${r.margenPct.toLocaleString('es-EC', { maximumFractionDigits: 1 })} %`}</strong>],
            ['Total de la línea (sin IVA)', usd(r.precioNeto * sim.cantidad)],
          ]} />
        )}
      </section>
      <ParaPensar clave={`b1_descuentos_${c.data.profile?.uid ?? 'anon'}`} preguntas={[
        'Si das 10 % de descuento con un margen de 25 %, ¿cuánto más debes vender para ganar lo mismo que antes?',
        '¿Conviene un descuento por volumen o un descuento por pronto pago? ¿Qué problema resuelve cada uno?',
        '¿Qué pasa con tu inventario y tu caja si un cliente compra mucho volumen a crédito?',
      ]} />
    </Screen>
  );
}
