'use client';
import { useMemo, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { round, today, usd } from '@/lib/company-calculations';
import { Screen, Field, Table, inputClass, buttonClass } from './SAPControls';
import { ParaPensar } from './AnalysisBlocks';

/** Conteo físico de inventario (INV003): conteo ciego, ajuste automático y merma. */
export default function InventoryCountScreen() {
  const c = useCompany();
  const almacenes = c.data.profile?.warehouses ?? [];
  const [almacen, setAlmacen] = useState(almacenes[0]?.code ?? 'PRINCIPAL');
  const [fecha, setFecha] = useState(today());
  const [ciego, setCiego] = useState(true);
  const [contado, setContado] = useState<Record<string, string>>({});
  const filas = useMemo(() => c.data.items.filter(i => i.active && i.type === 'inventory').map(i => {
    const s = c.data.warehouseStock.find(w => w.itemCode === i.itemCode && w.warehouseCode === almacen);
    return { itemCode: i.itemCode, nombre: i.name, sistema: s?.quantity ?? 0, costo: s?.averageCost || i.purchasePrice };
  }), [c.data, almacen]);
  const lineas = filas.filter(f => contado[f.itemCode] !== undefined && contado[f.itemCode] !== '').map(f => ({ itemCode: f.itemCode, countedQuantity: Number(contado[f.itemCode]) }));

  const registrar = async () => {
    if (!window.confirm(`Se ajustará el stock de ${lineas.length} artículo(s) y se registrará el asiento de diferencias. ¿Continuar?`)) return;
    try { await c.save({ action: 'inventoryCount', data: { warehouseCode: almacen, date: fecha, blind: ciego, lines: lineas } }); setContado({}); } catch { /* error visible */ }
  };

  const historial = [...c.data.inventoryCounts].sort((a, b) => b.date.localeCompare(a.date));
  const ultimo = historial[0];
  const valorSistema = ultimo ? ultimo.lines.reduce((s, l) => s + l.systemQuantity * l.unitCost, 0) : 0;
  const mermaPct = ultimo && valorSistema > 0 ? round((Math.abs(Math.min(0, ultimo.totalDifferenceValue)) / valorSistema) * 100) : 0;

  return (
    <Screen title="Conteo de inventario">
      <p className="border-l-4 border-[#0055A5] bg-white p-2">
        El sistema dice lo que <em>debería</em> haber; el conteo dice lo que <strong>hay</strong>. En el <strong>conteo ciego</strong> quien cuenta no ve la cantidad
        del sistema, así no se deja influenciar. Las diferencias se ajustan solas y se contabilizan como pérdida o ganancia de inventario (6.05).
      </p>
      <div className="grid gap-2 sm:grid-cols-3 sm:items-end">
        <Field label="Almacén"><select className={inputClass} value={almacen} onChange={e => { setAlmacen(e.target.value); setContado({}); }}>{almacenes.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}</select></Field>
        <Field label="Fecha del conteo"><input type="date" className={inputClass} value={fecha} onChange={e => setFecha(e.target.value)} /></Field>
        <label className="flex items-center gap-2"><input type="checkbox" checked={ciego} onChange={e => setCiego(e.target.checked)} /> Conteo ciego (ocultar cantidad del sistema)</label>
      </div>
      <Table headers={['Artículo', ...(ciego ? [] : ['En sistema']), 'Contado', ...(ciego ? [] : ['Diferencia'])]} rows={filas.map(f => {
        const v = contado[f.itemCode];
        const dif = v !== undefined && v !== '' ? round(Number(v) - f.sistema) : null;
        return [
          `${f.itemCode} · ${f.nombre}`,
          ...(ciego ? [] : [f.sistema]),
          <input key="c" aria-label={`Cantidad contada ${f.nombre}`} type="number" min={0} step="any" className={inputClass} value={v ?? ''} onChange={e => setContado(x => ({ ...x, [f.itemCode]: e.target.value }))} />,
          ...(ciego ? [] : [dif === null ? '—' : <strong key="d" className={dif < 0 ? 'text-[#c62828]' : dif > 0 ? 'text-[#b26a00]' : 'text-[#2e7d32]'}>{dif > 0 ? '+' : ''}{dif}</strong>]),
        ];
      })} />
      <button type="button" className={`${buttonClass} font-bold`} disabled={c.saving || !lineas.length} onClick={registrar}>Registrar conteo y ajustar ({lineas.length})</button>

      {ultimo && (
        <section className="space-y-1 border border-[#999] bg-white p-2">
          <h3 className="font-bold text-[#003366]">Resultado del último conteo · {ultimo.countNumber} ({ultimo.date})</h3>
          <Table headers={['Artículo', 'Sistema', 'Contado', 'Diferencia', 'Valor']} rows={ultimo.lines.map(l => [l.itemName, l.systemQuantity, l.countedQuantity, l.difference, usd(l.value)])} />
          <p><strong>Diferencia neta valorizada:</strong> {usd(ultimo.totalDifferenceValue)} · <strong>Merma:</strong> {mermaPct.toLocaleString('es-EC', { maximumFractionDigits: 2 })} % del valor contado en sistema.</p>
          {mermaPct > 2 && <p className="text-[#c62828]">Una merma sobre el 2 % es alta: revisa controles de bodega, despachos sin documento o errores de registro.</p>}
        </section>
      )}
      <ParaPensar clave={`b1_conteo_${c.data.profile?.uid ?? 'anon'}`} preguntas={[
        'Si faltan unidades, ¿cómo distinguirías entre robo, error de despacho y error de registro? ¿Qué revisarías primero?',
        '¿Por qué el conteo ciego da resultados más confiables? ¿Quién no debería hacer el conteo?',
        '¿Cada cuánto contarías los artículos de alto valor frente a los de bajo valor (análisis ABC)?',
      ]} />
    </Screen>
  );
}
