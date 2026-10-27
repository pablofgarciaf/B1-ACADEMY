'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import type { DocType, DocumentLine, PurchaseDocType, SalesDocType, DocumentInput } from '@/lib/firestore-types';
import { purchaseTypes } from '@/lib/firestore-types';
import { documentLabels } from '@/lib/company-engine';
import { today, totals, usd } from '@/lib/company-calculations';
import { nombreLista, precioSugerido } from '@/lib/company-pricing';
import { Screen, Field, Navigation, inputClass, buttonClass, SaveButton, Table, NumberInput } from './FinixControls';
import { PartnerLookup } from './CustomerLookupModal';
import ItemLookupModal from './ItemLookupModal';
export interface SalesOrderFormProps { screenId?: string; screenName?: string; docType: DocType; readOnly?: boolean }
const emptyLine = (): DocumentLine => ({ itemCode: '', description: '', quantity: 1, unit: 'UND', price: 0, discount: 0, taxRate: 15, warehouseCode: 'PRINCIPAL' });
export default function SalesOrderForm(props: SalesOrderFormProps) { return <DocumentForm key={props.docType} {...props} />; }
function DocumentForm({ docType, readOnly = false }: SalesOrderFormProps) {
  const c = useCompany(); const purchase = (purchaseTypes as readonly string[]).includes(docType);
  const blank = (): DocumentInput => ({ date: today(), dueDate: today(), cardCode: '', reference: '', comments: '', baseDocumentId: '', series: '', lines: [emptyLine()] });
  const [data, setData] = useState<DocumentInput>(blank); const [index, setIndex] = useState(-1); const [partnerLookup, setPartnerLookup] = useState(false); const [itemLookup, setItemLookup] = useState<number | null>(null);
  const docs = (purchase ? c.data.purchaseOrders : c.data.salesOrders).filter(d => d.docType === docType);
  const partners = purchase ? c.data.vendors : c.data.customers; const partner = partners.find(p => p.cardCode === data.cardCode);
  const locked = readOnly || index >= 0 || c.saving; const amounts = totals(data.lines);
  const predecessor: Partial<Record<DocType, DocType>> = { order: 'quotation', delivery: 'order', invoice: 'delivery', credit_note: 'invoice', purchase_order: 'purchase_request', goods_receipt: 'purchase_order', vendor_invoice: 'goods_receipt', debit_note: 'vendor_invoice' };
  const sources = (purchase ? c.data.purchaseOrders : c.data.salesOrders).filter(d => d.docType === predecessor[docType]);
  const reset = () => { setData(blank()); setIndex(-1); };
  const lineChange = (i: number, changes: Partial<DocumentLine>) => setData(d => ({ ...d, lines: d.lines.map((line, j) => j === i ? { ...line, ...changes } : line) }));
  // Ventas: precio de la lista del cliente y descuento por volumen, como los propone Finix ERP (se pueden editar).
  const sugerir = (itemCode: string, quantity: number): Partial<DocumentLine> => {
    if (purchase || data.baseDocumentId) return {};
    const s = precioSugerido(c.data, data.cardCode, itemCode, quantity, data.date);
    return s ? { price: s.precio, discount: s.descuento,taxRate:c.data.items.find(item=>item.itemCode===itemCode)?.salesTaxRate??15 } : {};
  };
  const listaCliente = !purchase && partner ? nombreLista(c.data, c.data.profile?.customerPriceLists?.[partner.cardCode] ?? 1) : '';
  return <Screen title={documentLabels[docType]}>
    <Navigation count={docs.length} index={index} onNew={reset} onSelect={i => {
      setIndex(i);
      const doc = docs[i];
      if (doc) {
        setData({
          date: doc.date ?? today(),
          dueDate: doc.dueDate ?? today(),
          cardCode: doc.cardCode ?? '',
          reference: doc.reference ?? '',
          comments: doc.comments ?? '',
          baseDocumentId: doc.baseDocumentId ?? '', series: doc.series ?? '', assetValuationDate:'assetValuationDate' in doc?doc.assetValuationDate:undefined,
          lines: (doc.lines ?? []).map(l => ({
            itemType:l.itemType,expenseAccount:l.expenseAccount,binCode:l.binCode,
            itemCode: l.itemCode ?? '',
            description: l.description ?? '',
            quantity: l.quantity ?? 1,
            unit: l.unit ?? 'UND',
            price: l.price ?? 0,
            discount: l.discount ?? 0,
            taxRate: l.taxRate ?? 15,
            warehouseCode: l.warehouseCode ?? 'PRINCIPAL'
          }))
        });
      }
    }} />
    <p className="font-bold">{index >= 0 ? docs[index]?.docNumber : 'Numeración automática'} · USD</p>
    <form className="space-y-3" onSubmit={async event => { event.preventDefault(); try { if (purchase) await c.save({ action: 'purchase', data: { docType: docType as PurchaseDocType, document: data } }); else await c.save({ action: 'sales', data: { docType: docType as SalesDocType, document: data } }); reset(); } catch { /* Provider displays the error. */ } }}>
      <fieldset disabled={locked} className="space-y-3"><div className="grid gap-3 sm:grid-cols-3">
        <Field label={purchase ? 'Proveedor' : 'Cliente'} required>
          <div className="flex gap-1.5 items-center">
            <input 
              list="partners-datalist"
              className={inputClass + ' w-28 sm:w-32 font-mono font-bold'} 
              required 
              placeholder="Código..."
              value={data.cardCode} 
              onChange={e => {
                const val = e.target.value.trim();
                const found = partners.find(p => p.cardCode.toLowerCase() === val.toLowerCase() || p.name.toLowerCase() === val.toLowerCase());
                if (found) {
                  setData(d => ({ ...d, cardCode: found.cardCode }));
                } else {
                  setData(d => ({ ...d, cardCode: e.target.value }));
                }
              }} 
            />
            <input
              type="text"
              readOnly
              className={inputClass + ' flex-1 bg-slate-50 text-slate-800 font-medium cursor-pointer hover:bg-slate-100 transition-colors'}
              placeholder={purchase ? "Seleccionar proveedor..." : "Seleccionar cliente..."}
              value={partner ? partner.name : ''}
              onClick={() => setPartnerLookup(true)}
              title="Haz clic para seleccionar o buscar socio de negocios"
            />
            <datalist id="partners-datalist">
              {partners.map(p => (
                <option key={p.cardCode} value={p.cardCode}>{p.name}</option>
              ))}
            </datalist>
            <button type="button" aria-label="Buscar socio" onClick={() => setPartnerLookup(true)} className={buttonClass} title="Abrir catálogo completo">
              […]
            </button>
          </div>
        </Field>
        <Field label="Fecha" required><input required type="date" className={inputClass} value={data.date ?? today()} onChange={e => setData(d => ({ ...d, date: e.target.value }))} /></Field>
        <Field label="Vencimiento" required><input required type="date" className={inputClass} min={data.date || today()} value={data.dueDate ?? today()} onChange={e => setData(d => ({ ...d, dueDate: e.target.value }))} /></Field>
        {docType==='vendor_invoice'&&<Field label="Fecha valoración activo (solo capitalización)"><input type="date" className={inputClass} value={data.assetValuationDate??''} onChange={e=>setData(d=>({...d,assetValuationDate:e.target.value||undefined}))}/><small>Con fecha, cada unidad se registra como activo fijo y no ingresa a existencias. Déjala vacía para mercadería.</small></Field>}
        <Field label="Referencia"><input className={inputClass} value={data.reference ?? ''} onChange={e => setData(d => ({ ...d, reference: e.target.value }))} /></Field>
        {(() => { const profile = c.data.profile as unknown as { docSeries?: { docType:string; nombre:string; prefijo:string; bloqueada?:boolean }[] } | null; const seriesType: Record<DocType,string> = { quotation:'facturas', order:'pedidos', delivery:'entregas', invoice:'facturas', credit_note:'nc_cliente', purchase_request:'compras', purchase_order:'compras', goods_receipt:'grpo', vendor_invoice:'factprov', debit_note:'nc_prov' }; const available=(profile?.docSeries??[]).filter(s=>s.docType===seriesType[docType]&&!s.bloqueada); return available.length ? <Field label="Serie"><select className={inputClass} value={data.series ?? ''} onChange={e=>setData(d=>({...d,series:e.target.value}))}><option value="">Predeterminada</option>{available.map(s=><option key={s.nombre} value={s.nombre}>{s.nombre}{s.prefijo?` (${s.prefijo})`:''}</option>)}</select></Field> : null; })()}
        {predecessor[docType] && <Field label="Copiar de documento base"><select className={inputClass} value={data.baseDocumentId ?? ''} onChange={e => { const source = sources.find(s => s.id === e.target.value); if (source) setData(d => ({ ...d, cardCode: source.cardCode, baseDocumentId: source.id, lines: source.lines.map(l => ({ ...l })) })); else setData(d => ({ ...d, baseDocumentId: '' })); }}><option value="">Sin documento base</option>{sources.map(s => <option key={s.id} value={s.id}>{s.docNumber} · {s.cardName}</option>)}</select></Field>}
      </div>
      <Table headers={['Artículo *', 'Descripción', 'Cantidad *', 'UM', 'Precio *', 'Desc. %', 'IVA %', 'Almacén *', 'Total', 'Acción']} rows={data.lines.map((line, i) => [
        <div key="code" className="flex gap-1 items-center">
          <input 
            aria-label={'Artículo línea ' + (i + 1)} 
            required 
            className={inputClass + ' w-28 font-mono'} 
            list={`item-list-${i}`}
            value={line.itemCode ?? ''} 
            placeholder="Código..."
            onChange={e => {
              const codeVal = e.target.value.trim();
              const matched = c.data.items.find(it => it.itemCode.toLowerCase() === codeVal.toLowerCase() || it.name.toLowerCase() === codeVal.toLowerCase());
              if (matched) {
                lineChange(i, { 
                  itemCode: matched.itemCode, 
                  itemType: matched.type, 
                  description: matched.name, 
                  price: purchase ? matched.purchasePrice : matched.price, 
                  unit: purchase ? matched.purchaseUnit : matched.salesUnit, 
                  ...sugerir(matched.itemCode, line.quantity ?? 1) 
                });
              } else {
                lineChange(i, { itemCode: e.target.value });
              }
            }}
          />
          <datalist id={`item-list-${i}`}>
            {c.data.items.filter(it => it.active).map(it => (
              <option key={it.itemCode} value={it.itemCode}>{it.name} (${it.price})</option>
            ))}
          </datalist>
          <button type="button" aria-label={'Buscar artículo línea ' + (i + 1)} className={buttonClass} onClick={() => setItemLookup(i)} title="Abrir catálogo completo">[…]</button>
        </div>, <div key="description"><input aria-label={'Descripción línea '+(i+1)} required className={inputClass} value={line.description??''} onChange={e=>lineChange(i,{description:e.target.value})}/>{purchase&&line.itemType==='service'&&<select aria-label={'Cuenta de gastos línea '+(i+1)} required className={inputClass} value={line.expenseAccount??'6.03'} onChange={e=>lineChange(i,{expenseAccount:e.target.value})}>{c.data.chartOfAccounts.filter(a=>a.active&&a.postable&&['cost','expense'].includes(a.category)).map(a=><option key={a.id} value={a.code}>{a.code} — {a.name}</option>)}</select>}</div>,
        <NumberInput key="qty" ariaLabel={'Cantidad línea ' + (i + 1)} min={0.000001} required value={line.quantity ?? 1} onChange={val => { lineChange(i, { quantity: val, ...(line.itemCode ? { discount: sugerir(line.itemCode, val).discount ?? line.discount } : {}) }); }} />, line.unit ?? 'UND',
        <NumberInput key="price" ariaLabel={'Precio línea ' + (i + 1)} min={0} required value={line.price ?? 0} onChange={val => lineChange(i, { price: val })} />,
        <NumberInput key="discount" ariaLabel={'Descuento línea ' + (i + 1)} min={0} max={100} value={line.discount ?? 0} onChange={val => lineChange(i, { discount: val })} />,
        <select key="tax" aria-label={'IVA línea ' + (i + 1)} className={inputClass} value={line.taxRate ?? 15} onChange={e => lineChange(i, { taxRate: Number(e.target.value) as 0 | 5 | 8 | 15 })}>{[15, 5, 8, 0].map(rate => <option key={rate} value={rate}>{rate}%{rate === 8 ? ' (turismo en feriados)' : rate === 5 ? ' (materiales de construcción)' : ''}</option>)}</select>,
        <div key="warehouse"><select aria-label={'Almacén línea ' + (i + 1)} className={inputClass} value={line.warehouseCode ?? 'PRINCIPAL'} onChange={e => lineChange(i, { warehouseCode: e.target.value,binCode:undefined })}>{c.data.profile?.warehouses.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}</select>{purchase&&<select aria-label={'Depósito línea '+(i+1)} className={inputClass} value={line.binCode??''} onChange={e=>lineChange(i,{binCode:e.target.value||undefined})}><option value="">Sin depósito asignado</option>{c.data.binLocations.filter(b=>b.warehouseCode===line.warehouseCode).map(b=><option key={b.id} value={b.binCode}>{b.binCode}</option>)}</select>}</div>, usd(totals([line]).total),
        <button key="remove" type="button" aria-label={'Eliminar línea ' + (i + 1)} disabled={data.lines.length === 1} className={buttonClass} onClick={() => setData(d => ({ ...d, lines: d.lines.filter((_, j) => j !== i) }))}>✕</button>
      ])} />
      <button type="button" className={buttonClass} onClick={() => setData(d => ({ ...d, lines: [...d.lines, emptyLine()] }))}>+ Agregar línea</button>
      {listaCliente && <p className="text-[#555]">Lista de precios del cliente: <strong>{listaCliente}</strong>. Los descuentos por volumen se aplican al cambiar la cantidad.</p>}
      <Field label="Comentarios"><textarea className={inputClass} value={data.comments ?? ''} onChange={e => setData(d => ({ ...d, comments: e.target.value }))} /></Field></fieldset>
      <div className="flex justify-end gap-5 font-bold"><span>Subtotal {usd(amounts.subtotal)}</span><span>IVA {usd(amounts.tax)}</span><span>Total {usd(amounts.total)}</span></div>
      <SaveButton disabled={locked || !partner} /><button type="button" onClick={reset} disabled={c.saving} className={buttonClass + ' ml-2'}>Cancelar</button>
    </form>
    {partnerLookup && <PartnerLookup vendor={purchase} onClose={() => setPartnerLookup(false)} onSelect={p => setData(d => ({ ...d, cardCode: p.cardCode }))} />}
    {itemLookup !== null && <ItemLookupModal onClose={() => setItemLookup(null)} onSelect={item => lineChange(itemLookup, { itemCode: item.itemCode,itemType:item.type,expenseAccount:item.type==='service'?'6200':undefined, description: item.name, price: purchase ? item.purchasePrice : item.price, unit: purchase ? item.purchaseUnit : item.salesUnit, ...sugerir(item.itemCode, data.lines[itemLookup]?.quantity ?? 1) })} />}
  </Screen>;
}
