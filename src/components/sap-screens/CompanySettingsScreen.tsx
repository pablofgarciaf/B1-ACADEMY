'use client';
import { useEffect, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { REGIMENES, REGIMEN_ETIQUETAS } from '@/lib/sri-catalogo';
import { Screen, Field, Table, inputClass, buttonClass } from './SAPControls';

/** Inicialización / datos de la empresa (ADM001): razón social, RUC, impuesto a la renta y almacenes. */
export default function CompanySettingsScreen() {
  const c = useCompany();
  const p = c.data.profile;
  const [f, setF] = useState({ companyName: '', ruc: '', address: '', phone: '', incomeTaxRate: 25, regimen: 'general' as (typeof REGIMENES)[number], warehouses: [] as { code: string; name: string }[] });
  useEffect(() => { if (p) setF({ companyName: p.companyName, ruc: p.ruc, address: p.address ?? '', phone: p.phone ?? '', incomeTaxRate: p.incomeTaxRate, regimen: p.regimen ?? 'general', warehouses: p.warehouses.map(w => ({ ...w })) }); }, [p]);
  const rucValido = /^\d{10}001$/.test(f.ruc);
  const conStock = (code: string) => c.data.warehouseStock.some(s => s.warehouseCode === code && s.quantity !== 0);

  return (
    <Screen title="Detalles de la sociedad">
      <form className="space-y-3" onSubmit={async e => { e.preventDefault(); try { await c.save({ action: 'companySettings', data: f }); } catch { /* error visible */ } }}>
        <div className="grid gap-2 sm:grid-cols-3">
          <Field label="Razón social" required><input required minLength={2} className={inputClass} value={f.companyName ?? ''} onChange={e => setF(v => ({ ...v, companyName: e.target.value }))} /></Field>
          <Field label="RUC (13 dígitos, termina en 001)" required>
            <input required inputMode="numeric" maxLength={13} className={`${inputClass} ${f.ruc && !rucValido ? 'outline outline-2 outline-[#c62828]' : ''}`} value={f.ruc ?? ''} onChange={e => setF(v => ({ ...v, ruc: e.target.value.replace(/\D/g, '') }))} />
          </Field>
          <Field label="Dirección"><input className={inputClass} value={f.address ?? ''} onChange={e => setF(v => ({ ...v, address: e.target.value }))} /></Field>
          <Field label="Teléfono 1"><input inputMode="tel" maxLength={30} className={inputClass} value={f.phone ?? ''} onChange={e => setF(v => ({ ...v, phone: e.target.value }))} /></Field>
          <Field label="Régimen tributario"><select className={inputClass} value={f.regimen ?? 'general'} onChange={e => setF(v => ({ ...v, regimen: e.target.value as (typeof REGIMENES)[number] }))}>{REGIMENES.map(r => <option key={r} value={r}>{REGIMEN_ETIQUETAS[r]}</option>)}</select></Field>
          <Field label="Tarifa de impuesto a la renta (%)"><input type="number" min={0} max={40} step="0.5" className={inputClass} value={f.incomeTaxRate ?? 25} onChange={e => setF(v => ({ ...v, incomeTaxRate: Number(e.target.value) }))} /></Field>
        </div>
        <p className="text-[#555]">Moneda: USD · País: Ecuador. La tarifa general de impuesto a la renta para sociedades es 25 %. Un RIMPE Negocio Popular emite notas de venta sin IVA y no factura electrónicamente; un RIMPE Emprendedor factura con la leyenda de contribuyente RIMPE.</p>
        <h3 className="font-bold text-[#003366]">Almacenes</h3>
        <Table headers={['Código', 'Nombre', '']} rows={f.warehouses.map((w, i) => [
          <input key="c" required className={inputClass} value={w.code} disabled={conStock(w.code)} onChange={e => setF(v => ({ ...v, warehouses: v.warehouses.map((x, j) => (j === i ? { ...x, code: e.target.value.toUpperCase().replace(/[^\w.-]/g, '') } : x)) }))} />,
          <input key="n" required minLength={2} className={inputClass} value={w.name} onChange={e => setF(v => ({ ...v, warehouses: v.warehouses.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) }))} />,
          <button key="q" type="button" className={buttonClass} disabled={conStock(w.code) || f.warehouses.length === 1} title={conStock(w.code) ? 'Tiene existencias' : ''} onClick={() => setF(v => ({ ...v, warehouses: v.warehouses.filter((_, j) => j !== i) }))}>✕</button>,
        ])} />
        <button type="button" className={buttonClass} onClick={() => setF(v => ({ ...v, warehouses: [...v.warehouses, { code: `ALM${v.warehouses.length + 1}`, name: 'Nuevo almacén' }] }))}>+ Agregar almacén</button>
        <div><button type="submit" className={`${buttonClass} font-bold`} disabled={c.saving || !rucValido}>Guardar datos de la empresa</button></div>
      </form>
    </Screen>
  );
}
