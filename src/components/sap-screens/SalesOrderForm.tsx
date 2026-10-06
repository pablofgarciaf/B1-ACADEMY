'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import type { DocType, DocumentLine, PurchaseDocType, SalesDocType, DocumentInput } from '@/lib/firestore-types';
import { purchaseTypes } from '@/lib/firestore-types';
import { documentLabels } from '@/lib/company-engine';
import { today, totals, usd } from '@/lib/company-calculations';
import { NOMBRES_LISTA, precioSugerido } from '@/lib/company-pricing';
import { Screen, Field, Navigation, inputClass, buttonClass, SaveButton, Table } from './SAPControls';
import { PartnerLookup } from './CustomerLookupModal';
import ItemLookupModal from './ItemLookupModal';
export interface SalesOrderFormProps { screenId?: string; screenName?: string; docType: DocType; readOnly?: boolean }
const emptyLine = (): DocumentLine => ({ itemCode: '', description: '', quantity: 1, unit: 'UND', price: 0, discount: 0, taxRate: 15, warehouseCode: 'PRINCIPAL' });
export default function SalesOrderForm(props: SalesOrderFormProps) { return <DocumentForm key={props.docType} {...props} />; }
function DocumentForm({ docType, readOnly = false }: SalesOrderFormProps) {
  const c = useCompany(); const purchase = (purchaseTypes as readonly string[]).includes(docType);
  const blank = (): DocumentInput => ({ date: today(), dueDate: today(), cardCode: '', reference: '', comments: '', baseDocumentId: '', lines: [emptyLine()] });
  const [data, setData] = useState<DocumentInput>(blank); const [index, setIndex] = useState(-1); const [partnerLookup, setPartnerLookup] = useState(false); const [itemLookup, setItemLookup] = useState<number | null>(null);
  const docs = (purchase ? c.data.purchaseOrders : c.data.salesOrders).filter(d => d.docType === docType);
  const partners = purchase ? c.data.vendors : c.data.customers; const partner = partners.find(p => p.cardCode === data.cardCode);
  const locked = readOnly || index >= 0 || c.saving; const amounts = totals(data.lines);
  const predecessor: Partial<Record<DocType, DocType>> = { order: 'quotation', delivery: 'order', invoice: 'delivery', credit_note: 'invoice', purchase_order: 'purchase_request', goods_receipt: 'purchase_order', vendor_invoice: 'goods_receipt', debit_note: 'vendor_invoice' };
  const sources = (purchase ? c.data.purchaseOrders : c.data.salesOrders).filter(d => d.docType === predecessor[docType]);
  const reset = () => { setData(blank()); setIndex(-1); };
  const lineChange = (i: number, changes: Partial<DocumentLine>) => setData(d => ({ ...d, lines: d.lines.map((line, j) => j === i ? { ...line, ...changes } : line) }));
  // Ventas: precio de la lista del cliente y descuento por volumen, como los propone SAP (se pueden editar).
  const sugerir = (itemCode: string, quantity: number): Partial<DocumentLine> => {
    if (purchase || data.baseDocumentId) return {};
    const s = precioSugerido(c.data, data.cardCode, itemCode, quantity);
    return s ? { price: s.precio, discount: s.descuento } : {};
  };
  const listaCliente = !purchase && partner ? NOMBRES_LISTA[c.data.profile?.customerPriceLists?.[partner.cardCode] ?? 1] : '';
  return <Screen title={documentLabels[docType]}>
    <Navigation count={docs.length} index={index} onNew={reset} onSelect={i => { setIndex(i); setData(docs[i]); }} />
    <p className="font-bold">{index >= 0 ? docs[index]?.docNumber : 'Numeración automática'} · USD</p>
    <form className="space-y-3" onSubmit={async event => { event.preventDefault(); try { if (purchase) await c.save({ action: 'purchase', data: { docType: docType as PurchaseDocType, document: data } }); else await c.save({ action: 'sales', data: { docType: docType as SalesDocType, document: data } }); reset(); } catch { /* Provider displays the error. */ } }}>
      <fieldset disabled={locked} className="space-y-3"><div className="grid gap-3 sm:grid-cols-3">
        <Field label={purchase ? 'Proveedor' : 'Cliente'} required><div className="flex gap-1"><input className={inputClass} required readOnly value={partner ? partner.cardCode + ' · ' + partner.name : ''} /><button type="button" aria-label="Buscar socio" onClick={() => setPartnerLookup(true)} className={buttonClass}>[…]</button></div></Field>
        <Field label="Fecha" required><input required type="date" className={inputClass} value={data.date} onChange={e => setData(d => ({ ...d, date: e.target.value }))} /></Field>
        <Field label="Vencimiento" required><input required type="date" className={inputClass} min={data.date} value={data.dueDate} onChange={e => setData(d => ({ ...d, dueDate: e.target.value }))} /></Field>
        <Field label="Referencia"><input className={inputClass} value={data.reference} onChange={e => setData(d => ({ ...d, reference: e.target.value }))} /></Field>
        {predecessor[docType] && <Field label="Copiar de documento base"><select className={inputClass} value={data.baseDocumentId} onChange={e => { const source = sources.find(s => s.id === e.target.value); if (source) setData(d => ({ ...d, cardCode: source.cardCode, baseDocumentId: source.id, lines: source.lines.map(l => ({ ...l })) })); else setData(d => ({ ...d, baseDocumentId: '' })); }}><option value="">Sin documento base</option>{sources.map(s => <option key={s.id} value={s.id}>{s.docNumber} · {s.cardName}</option>)}</select></Field>}
      </div>
      <Table headers={['Artículo *', 'Descripción', 'Cantidad *', 'UM', 'Precio *', 'Desc. %', 'IVA %', 'Almacén *', 'Total', 'Acción']} rows={data.lines.map((line, i) => [
        <div key="code" className="flex"><input aria-label={'Artículo línea ' + (i + 1)} required className={inputClass} value={line.itemCode} readOnly /><button type="button" aria-label={'Buscar artículo línea ' + (i + 1)} className={buttonClass} onClick={() => setItemLookup(i)}>[…]</button></div>, line.description,
        <input key="qty" aria-label={'Cantidad línea ' + (i + 1)} type="number" min="0.000001" step="any" required className={inputClass} value={line.quantity} onChange={e => { const quantity = Number(e.target.value); lineChange(i, { quantity, ...(line.itemCode ? { discount: sugerir(line.itemCode, quantity).discount ?? line.discount } : {}) }); }} />, line.unit,
        <input key="price" aria-label={'Precio línea ' + (i + 1)} type="number" min="0" step="0.01" required className={inputClass} value={line.price} onChange={e => lineChange(i, { price: Number(e.target.value) })} />,
        <input key="discount" aria-label={'Descuento línea ' + (i + 1)} type="number" min="0" max="100" className={inputClass} value={line.discount} onChange={e => lineChange(i, { discount: Number(e.target.value) })} />,
        <select key="tax" aria-label={'IVA línea ' + (i + 1)} className={inputClass} value={line.taxRate} onChange={e => lineChange(i, { taxRate: Number(e.target.value) as 0 | 5 | 15 })}>{[0, 5, 15].map(rate => <option key={rate} value={rate}>{rate}%</option>)}</select>,
        <select key="warehouse" aria-label={'Almacén línea ' + (i + 1)} className={inputClass} value={line.warehouseCode} onChange={e => lineChange(i, { warehouseCode: e.target.value })}>{c.data.profile?.warehouses.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}</select>, usd(totals([line]).total),
        <button key="remove" type="button" aria-label={'Eliminar línea ' + (i + 1)} disabled={data.lines.length === 1} className={buttonClass} onClick={() => setData(d => ({ ...d, lines: d.lines.filter((_, j) => j !== i) }))}>✕</button>
      ])} />
      <button type="button" className={buttonClass} onClick={() => setData(d => ({ ...d, lines: [...d.lines, emptyLine()] }))}>+ Agregar línea</button>
      {listaCliente && <p className="text-[#555]">Lista de precios del cliente: <strong>{listaCliente}</strong>. Los descuentos por volumen se aplican al cambiar la cantidad.</p>}
      <Field label="Comentarios"><textarea className={inputClass} value={data.comments} onChange={e => setData(d => ({ ...d, comments: e.target.value }))} /></Field></fieldset>
      <div className="flex justify-end gap-5 font-bold"><span>Subtotal {usd(amounts.subtotal)}</span><span>IVA {usd(amounts.tax)}</span><span>Total {usd(amounts.total)}</span></div>
      <SaveButton disabled={locked || !partner} /><button type="button" onClick={reset} disabled={c.saving} className={buttonClass + ' ml-2'}>Cancelar</button>
    </form>
    {partnerLookup && <PartnerLookup vendor={purchase} onClose={() => setPartnerLookup(false)} onSelect={p => setData(d => ({ ...d, cardCode: p.cardCode }))} />}
    {itemLookup !== null && <ItemLookupModal onClose={() => setItemLookup(null)} onSelect={item => lineChange(itemLookup, { itemCode: item.itemCode, description: item.name, price: purchase ? item.purchasePrice : item.price, unit: purchase ? item.purchaseUnit : item.salesUnit, ...sugerir(item.itemCode, data.lines[itemLookup]?.quantity ?? 1) })} />}
  </Screen>;
}
