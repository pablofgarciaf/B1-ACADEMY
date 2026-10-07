import type { CompanyState, SRITaxDocument } from './firestore-types';
import { round, totals, xmlEscape as e } from './company-calculations';
import { sriLabels } from './sri-xml';
import { opcionRetencion } from './sri-catalogo';

const usd = (n: number) => round(n).toFixed(2);
const fecha = (iso: string) => iso.slice(0, 10).split('-').reverse().join('/');

/**
 * RIDE (Representación Impresa del Documento Electrónico): la versión legible que se entrega al cliente.
 * El documento con validez es el XML autorizado; el RIDE solo lo representa. `codigoBarras` es el SVG de la clave.
 */
export function construirRIDE(state: CompanyState, doc: SRITaxDocument, codigoBarras: string): string {
  const p = state.profile; if (!p) throw new Error('Empresa requerida.');
  const socio = [...state.customers, ...state.vendors].find((s) => s.cardCode === doc.partnerCode);
  const sustento = [...state.salesOrders, ...state.purchaseOrders].find((d) => d.id === doc.sourceDocumentId);
  const det = doc.details ?? {};
  const fila = (celdas: (string | number)[]) => `<tr>${celdas.map((c) => `<td>${e(String(c))}</td>`).join('')}</tr>`;

  let cuerpo = '';
  if (doc.docType === '07') {
    cuerpo = `<table><thead><tr><th>Comprobante</th><th>Número</th><th>Ejercicio fiscal</th><th>Base imponible</th><th>Impuesto</th><th>Código</th><th>% Retención</th><th>Valor retenido</th></tr></thead><tbody>${
      doc.retentionLines.map((l) => fila(['FACTURA', String(det.supportNumber ?? ''), doc.date.slice(5, 7) + '/' + doc.date.slice(0, 4), usd(l.base), l.tax === 'IR' ? 'RENTA' : 'IVA', opcionRetencion(l.code)?.codigo ?? l.code, l.rate + ' %', usd(l.base * l.rate / 100)])).join('')
    }</tbody></table><p class="total">Total retenido: USD ${usd(doc.totalRetention)}</p>`;
  } else if (sustento) {
    const precio = doc.docType !== '06';
    cuerpo = `<table><thead><tr><th>Código</th><th>Cant.</th><th>Descripción</th>${precio ? '<th>P. unitario</th><th>Descuento</th><th>Total</th>' : ''}</tr></thead><tbody>${
      sustento.lines.map((l) => fila([l.itemCode, l.quantity, l.description, ...(precio ? [usd(l.price), usd(round(l.quantity * l.price) - totals([l]).subtotal), usd(totals([l]).subtotal)] : [])])).join('')
    }</tbody></table>`;
    if (precio) {
      const porTarifa = [15, 8, 5, 0].map((t) => [t, totals(sustento.lines.filter((l) => l.taxRate === t)).subtotal] as const).filter(([, v]) => v > 0);
      cuerpo += `<table class="totales">${porTarifa.map(([t, v]) => fila([`SUBTOTAL ${t} %`, usd(v)])).join('')}${fila(['SUBTOTAL SIN IMPUESTOS', usd(sustento.subtotal)])}${fila(['IVA', usd(sustento.tax)])}${fila(['VALOR TOTAL', usd(sustento.total)])}</table>`;
    }
  }

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>RIDE ${e(doc.number)}</title><style>
body{font:12px Arial,sans-serif;color:#111;margin:24px}h1{font-size:16px;margin:0}.marca{color:#b00;font-weight:bold;text-align:center;border:2px dashed #b00;padding:6px;margin-bottom:12px}
.cab{display:grid;grid-template-columns:1fr 1fr;gap:12px}.caja{border:1px solid #444;border-radius:6px;padding:10px}table{width:100%;border-collapse:collapse;margin-top:12px}
th,td{border:1px solid #888;padding:4px;text-align:left}th{background:#eee}.totales{width:45%;margin-left:auto}.total{text-align:right;font-weight:bold}svg{max-width:100%;height:56px}
.sep{margin-top:12px}.mono{font-family:monospace;font-size:10px}@media print{.noimp{display:none}}</style></head><body>
<p class="marca">AMBIENTE DE PRUEBAS · DOCUMENTO SIN VALIDEZ TRIBUTARIA · SIMULACIÓN ACADÉMICA</p>
<div class="cab"><div class="caja"><h1>${e(p.companyName)}</h1><p>Dirección matriz: ${e(String(det.matrixAddress ?? ''))}</p><p>Dirección establecimiento: ${e(String(det.establishmentAddress ?? ''))}</p><p>Obligado a llevar contabilidad: ${det.accountingRequired ? 'SÍ' : 'NO'}</p></div>
<div class="caja"><p><b>R.U.C.:</b> ${e(p.ruc)}</p><h1>${e(sriLabels[doc.docType].toUpperCase())}</h1><p><b>No.</b> ${e(doc.number)}</p><p><b>NÚMERO DE AUTORIZACIÓN</b><br>${e(doc.claveAcceso)}</p><p>FECHA Y HORA DE AUTORIZACIÓN: ${e(doc.authorizedAt ? new Date(doc.authorizedAt).toLocaleString('es-EC', { timeZone: 'America/Guayaquil' }) : '—')}</p><p>AMBIENTE: PRUEBAS · EMISIÓN: NORMAL</p><p><b>CLAVE DE ACCESO</b></p>${codigoBarras}<p class="mono">${e(doc.claveAcceso)}</p></div></div>
<div class="caja sep"><p><b>Razón social / Nombres:</b> ${e(socio?.name ?? doc.partnerCode)} &nbsp; <b>Identificación:</b> ${e(socio?.ruc ?? '')}</p><p><b>Fecha de emisión:</b> ${fecha(doc.date)}</p></div>
${cuerpo}
<div class="caja sep"><b>Información adicional</b><p>Ejercicio académico de B1 Academy, generado en el ambiente de pruebas simulado.</p></div>
<p class="noimp"><button onclick="print()">Imprimir / Guardar como PDF</button></p></body></html>`;
}
