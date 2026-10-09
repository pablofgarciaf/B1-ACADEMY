'use client';
import { useMemo, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { documentLabels } from '@/lib/company-engine';
import { round, usd } from '@/lib/company-calculations';
import type { CompanyState, PurchaseDocument, SalesDocument } from '@/lib/firestore-types';
import { Screen, Field, inputClass, buttonClass } from './SAPControls';

const esc = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch] ?? ch);

/** Arma el HTML imprimible tipo RIDE (representación impresa del comprobante electrónico del SRI). */
function rideHtml(s: CompanyState, d: SalesDocument | PurchaseDocument) {
  const p = s.profile;
  const socio = [...s.customers, ...s.vendors].find(x => x.cardCode === d.cardCode);
  const sri = s.sriDocuments.find(x => x.sourceDocumentId === d.id);
  const base = (rate: number) => round(d.lines.filter(l => l.taxRate === rate).reduce((acc, l) => acc + l.quantity * l.price * (1 - l.discount / 100), 0));
  const filas = d.lines.map(l => `<tr><td>${esc(l.itemCode)}</td><td>${esc(l.description)}</td><td class="n">${l.quantity}</td><td class="n">${usd(l.price)}</td><td class="n">${l.discount} %</td><td class="n">${usd(l.quantity * l.price * (1 - l.discount / 100))}</td></tr>`).join('');
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${esc(documentLabels[d.docType])} ${esc(d.docNumber)}</title>
<style>body{font:12px Arial,sans-serif;margin:24px;color:#111}h1{font-size:18px;margin:0}.cab{display:flex;gap:16px}.caja{border:1px solid #444;border-radius:6px;padding:10px;flex:1}
table{width:100%;border-collapse:collapse;margin-top:12px}th,td{border:1px solid #888;padding:4px}th{background:#eee}.n{text-align:right}.tot{width:45%;margin-left:auto}
.marca{margin-top:16px;border:2px dashed #b00;color:#b00;padding:6px;text-align:center;font-weight:bold}@media print{.noprint{display:none}}</style></head><body>
<div class="cab"><div class="caja"><h1>${esc(p?.companyName)}</h1><p>RUC: ${esc(p?.ruc)}<br>Obligado a llevar contabilidad: SÍ</p></div>
<div class="caja"><h1>${esc(documentLabels[d.docType]).toUpperCase()}</h1><p>No. ${esc(sri?.number ?? d.docNumber)}<br>${sri ? `Clave de acceso / autorización:<br><small>${esc(sri.claveAcceso)}</small><br>Estado SRI: ${esc(sri.status)}` : 'Sin comprobante electrónico emitido'}</p></div></div>
<div class="caja" style="margin-top:12px">Razón social / Nombres: <b>${esc(d.cardName)}</b> · Identificación: ${esc(socio?.ruc ?? '')}<br>Fecha de emisión: ${esc(d.date)} · Vencimiento: ${esc(d.dueDate)} · Referencia: ${esc(d.reference)}</div>
<table><thead><tr><th>Código</th><th>Descripción</th><th>Cant.</th><th>P. unitario</th><th>Desc.</th><th>Total</th></tr></thead><tbody>${filas}</tbody></table>
<table class="tot"><tr><td>Subtotal 15 %</td><td class="n">${usd(base(15))}</td></tr><tr><td>Subtotal 5 %</td><td class="n">${usd(base(5))}</td></tr><tr><td>Subtotal 0 %</td><td class="n">${usd(base(0))}</td></tr>
<tr><td>Subtotal sin impuestos</td><td class="n">${usd(d.subtotal)}</td></tr><tr><td>IVA</td><td class="n">${usd(d.tax)}</td></tr><tr><th>VALOR TOTAL</th><th class="n">${usd(d.total)}</th></tr></table>
${d.comments ? `<p>Información adicional: ${esc(d.comments)}</p>` : ''}
<div class="marca">SIMULACIÓN ACADÉMICA · Finix ERP · Documento sin validez tributaria</div>
<p class="noprint"><button onclick="window.print()">Imprimir / Guardar PDF</button></p></body></html>`;
}

/** Impresora de formularios (UTL001): vista e impresión de documentos en formato RIDE. */
export default function PrintLayoutScreen() {
  const c = useCompany();
  const docs = useMemo(() => [...c.data.salesOrders, ...c.data.purchaseOrders].sort((a, b) => b.date.localeCompare(a.date)), [c.data]);
  const [id, setId] = useState('');
  const doc = docs.find(d => d.id === id);
  const html = doc ? rideHtml(c.data, doc) : '';
  const abrir = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(html); w.document.close();
  };
  return (
    <Screen title="Impresora de formularios">
      <p className="border-l-4 border-[#0055A5] bg-white p-2">Elige un documento para ver su representación impresa (formato RIDE del SRI) e imprimirla o guardarla como PDF.</p>
      <div className="flex flex-wrap items-end gap-2">
        <Field label="Documento"><select className={inputClass} value={id} onChange={e => setId(e.target.value)}><option value="">Selecciona…</option>{docs.map(d => <option key={d.id} value={d.id}>{d.docNumber} · {documentLabels[d.docType]} · {d.cardName} · {usd(d.total)}</option>)}</select></Field>
        <button type="button" className={`${buttonClass} font-bold`} disabled={!doc} onClick={abrir}>Abrir para imprimir / PDF</button>
      </div>
      {doc && <iframe title="Vista previa del documento" sandbox="" srcDoc={html} className="h-[600px] w-full border border-[#999] bg-white" />}
    </Screen>
  );
}
