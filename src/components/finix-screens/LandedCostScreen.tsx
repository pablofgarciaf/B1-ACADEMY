'use client';
import { useMemo, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { round, today, usd } from '@/lib/company-calculations';
import { Screen, Field, Table, inputClass, buttonClass } from './FinixControls';
import { ParaPensar } from './AnalysisBlocks';
import type {CommandData} from '@/lib/company-commands';

/** Conceptos típicos de una importación en Ecuador. */
const CONCEPTOS = ['Flete internacional', 'Seguro internacional', 'Arancel (ad valorem)', 'FODINFA 0,5 %', 'ISD 5 %', 'Agente de aduana', 'Transporte local', 'Almacenaje'];

/** Costos de importación (PUR007): prorrateo de gastos sobre la mercadería recibida. */
export default function LandedCostScreen() {
  const c = useCompany();
  const [type,setType]=useState<CommandData<'landedCostType'>>({name:'',expenseAccount:'605000',updatesStock:true,allocation:'weight',updatesLastPurchase:true,fixedAmount:0});
  const concepts=[...new Set([...CONCEPTOS,...(c.data.profile?.landedCostTypes??[]).map(type=>type.name)])];
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
      <details className="rounded border p-2"><summary className="font-bold cursor-pointer">Definir tipos de gastos</summary><form className="grid gap-2 sm:grid-cols-3 mt-2" onSubmit={async e=>{e.preventDefault();await c.save({action:'landedCostType',data:type});}}><Field label="Nombre"><input required className={inputClass} value={type.name} onChange={e=>setType(t=>({...t,name:e.target.value}))}/></Field><Field label="Cuenta de gastos"><select className={inputClass} value={type.expenseAccount} onChange={e=>setType(t=>({...t,expenseAccount:e.target.value}))}>{c.data.chartOfAccounts.filter(a=>a.active&&a.postable&&['cost','expense'].includes(a.category)).map(a=><option key={a.id} value={a.code}>{a.code} — {a.name}</option>)}</select></Field><Field label="Método de distribución"><select className={inputClass} value={type.allocation} onChange={e=>setType(t=>({...t,allocation:e.target.value as typeof type.allocation}))}><option value="weight">Peso</option><option value="value">Valor</option><option value="quantity">Cantidad</option><option value="none">Ninguno</option></select></Field><Field label="Importe fijo (0 = variable)"><input type="number" min="0" step="0.01" className={inputClass} value={type.fixedAmount} onChange={e=>setType(t=>({...t,fixedAmount:Number(e.target.value)}))}/></Field><label><input type="checkbox" checked={type.updatesStock} onChange={e=>setType(t=>({...t,updatesStock:e.target.checked}))}/> Actualiza stock</label><label><input type="checkbox" checked={type.updatesLastPurchase} onChange={e=>setType(t=>({...t,updatesLastPurchase:e.target.checked}))}/> Actualiza último precio de compra</label><button className={buttonClass} disabled={c.saving}>Guardar tipo de gasto</button></form><Table headers={['Tipo','Cuenta','Actualiza stock','Método','Importe fijo']} rows={(c.data.profile?.landedCostTypes??[]).map(t=>[t.name,t.expenseAccount,t.updatesStock?'Sí':'No',t.allocation,usd(t.fixedAmount)])}/></details>
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
        <select key="c" className={inputClass} value={x.concept} onChange={e => setCostos(v => v.map((y, j) => (j === i ? { ...y, concept: e.target.value,amount:c.data.profile?.landedCostTypes?.find(t=>t.name===e.target.value)?.fixedAmount||y.amount } : y)))}>{concepts.map(k => <option key={k}>{k}</option>)}</select>,
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
