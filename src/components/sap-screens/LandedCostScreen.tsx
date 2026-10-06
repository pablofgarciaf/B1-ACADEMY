'use client';
import { useMemo, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { round, today, usd } from '@/lib/company-calculations';
import { Screen, Field, Table, inputClass, buttonClass } from './SAPControls';
import { ParaPensar } from './AnalysisBlocks';

/** Conceptos típicos de una importación en Ecuador. */
const CONCEPTOS = ['Flete internacional', 'Seguro internacional', 'Arancel (ad valorem)', 'FODINFA 0,5 %', 'ISD 5 %', 'Agente de aduana', 'Transporte local', 'Almacenaje'];

/** Costos de importación (PUR007): prorrateo de gastos sobre la mercadería recibida. */
export default function LandedCostScreen() {
  const c = useCompany();
  const recepciones = useMemo(() => c.data.purchaseOrders.filter(d =>
    (d.docType === 'goods_receipt' || (d.docType === 'vendor_invoice' && !d.baseDocumentId)) && c.data.stockMovements.some(m => m.reference === d.id && m.quantity > 0)), [c.data]);
  const [doc, setDoc] = useState('');
  const [fecha, setFecha] = useState(today());
  const [reparto, setReparto] = useState<'value' | 'quantity'>('value');
  const [pago, setPago] = useState<'2.1.01' | '1.1.01'>('2.1.01');
  const [costos, setCostos] = useState([{ concept: CONCEPTOS[0], amount: 0 }]);
  const seleccionado = recepciones.find(d => d.id === doc);
  const totalCostos = round(costos.reduce((s, x) => s + (x.amount || 0), 0));
  const valorMercaderia = seleccionado?.subtotal ?? 0;

  const registrar = async () => {
    try { await c.save({ action: 'landedCost', data: { documentId: doc, date: fecha, allocation: reparto, paymentAccount: pago, costs: costos.filter(x => x.amount > 0) } }); setCostos([{ concept: CONCEPTOS[0], amount: 0 }]); } catch { /* error visible */ }
  };

  return (
    <Screen title="Costos de importación">
      <p className="border-l-4 border-[#0055A5] bg-white p-2">
        Un producto importado no cuesta lo que dice la factura del proveedor: hay que sumar flete, seguro, arancel, FODINFA, el
        <strong> ISD del 5 %</strong>, el agente de aduana… Si no se suman, el costo queda subvaluado y <strong>el margen parece mayor de lo que es</strong>.
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Recepción de mercadería"><select className={inputClass} value={doc} onChange={e => setDoc(e.target.value)}><option value="">Selecciona…</option>{recepciones.map(d => <option key={d.id} value={d.id}>{d.docNumber} · {d.cardName} · {usd(d.subtotal)}</option>)}</select></Field>
        <Field label="Fecha"><input type="date" className={inputClass} value={fecha} onChange={e => setFecha(e.target.value)} /></Field>
        <Field label="Repartir según"><select className={inputClass} value={reparto} onChange={e => setReparto(e.target.value as 'value' | 'quantity')}><option value="value">Valor de cada artículo</option><option value="quantity">Cantidad de unidades</option></select></Field>
        <Field label="Forma de pago"><select className={inputClass} value={pago} onChange={e => setPago(e.target.value as '2.1.01' | '1.1.01')}><option value="2.1.01">A crédito (por pagar)</option><option value="1.1.01">De contado (caja)</option></select></Field>
      </div>
      <Table headers={['Concepto', 'Monto USD', '']} rows={costos.map((x, i) => [
        <select key="c" className={inputClass} value={x.concept} onChange={e => setCostos(v => v.map((y, j) => (j === i ? { ...y, concept: e.target.value } : y)))}>{CONCEPTOS.map(k => <option key={k}>{k}</option>)}</select>,
        <input key="m" type="number" min={0} step="0.01" className={inputClass} value={x.amount} onChange={e => setCostos(v => v.map((y, j) => (j === i ? { ...y, amount: Number(e.target.value) } : y)))} />,
        <button key="q" type="button" className={buttonClass} disabled={costos.length === 1} onClick={() => setCostos(v => v.filter((_, j) => j !== i))}>✕</button>,
      ])} />
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className={buttonClass} disabled={costos.length >= 10} onClick={() => setCostos(v => [...v, { concept: CONCEPTOS[Math.min(v.length, CONCEPTOS.length - 1)], amount: 0 }])}>+ Agregar concepto</button>
        <span>Total gastos: <strong>{usd(totalCostos)}</strong>{valorMercaderia > 0 && <> · equivale al <strong>{((totalCostos / valorMercaderia) * 100).toLocaleString('es-EC', { maximumFractionDigits: 1 })} %</strong> del valor de la mercadería</>}</span>
      </div>
      <button type="button" className={`${buttonClass} font-bold`} disabled={c.saving || !doc || totalCostos <= 0} onClick={registrar}>Prorratear y contabilizar</button>

      <h3 className="font-bold text-[#003366]">Costeos registrados</h3>
      <Table headers={['Número', 'Recepción', 'Fecha', 'Total gastos', 'A inventario', 'A costo de ventas']} rows={c.data.landedCosts.map(l => [
        l.landedCostNumber, l.documentNumber, l.date, usd(l.total),
        usd(l.lines.reduce((s, x) => s + x.toInventory, 0)), usd(l.lines.reduce((s, x) => s + x.toCostOfSales, 0)),
      ])} />
      <ParaPensar clave={`b1_importacion_${c.data.profile?.uid ?? 'anon'}`} preguntas={[
        'Si los gastos de importación suman 18 % del valor de la mercadería, ¿cuánto debe subir tu precio para mantener el mismo margen?',
        '¿Por qué parte del gasto se va al costo de ventas cuando la mercadería ya se vendió antes de llegar la factura del flete?',
        '¿Te conviene importar directamente o comprarle a un distribuidor local? ¿Qué costos y riesgos comparas?',
      ]} />
    </Screen>
  );
}
