'use client';
import { useMemo, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { today, usd } from '@/lib/company-calculations';
import { analisisCompras } from '@/lib/company-analytics';
import { Screen, Field, Table, inputClass } from './SAPControls';
import { Lectura, ParaPensar } from './AnalysisBlocks';

/** Análisis de compras: proveedores, artículos y variación de precios pagados. */
export default function PurchaseAnalysisScreen() {
  const c = useCompany();
  const [desde, setDesde] = useState(today().slice(0, 4) + '-01-01');
  const [hasta, setHasta] = useState(today());
  const a = useMemo(() => analisisCompras(c.data, desde, hasta), [c.data, desde, hasta]);
  const tarjetas: [string, string][] = [
    ['Compras netas facturadas (sin IVA)', usd(a.total)],
    ['Pedidos de compra abiertos', usd(a.pedidosAbiertos)],
    ['Recibido sin factura', usd(a.recibidoSinFactura)],
  ];
  return (
    <Screen title="Análisis de compras">
      <p className="border-l-4 border-[#0055A5] bg-white p-2">
        Comprar bien es ganar antes de vender: cada dólar ahorrado en compras va directo a la utilidad.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="Desde"><input type="date" className={inputClass} value={desde} onChange={e => setDesde(e.target.value)} /></Field>
        <Field label="Hasta"><input type="date" className={inputClass} value={hasta} onChange={e => setHasta(e.target.value)} /></Field>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {tarjetas.map(([label, valor]) => <div key={label} className="border border-[#999] bg-white p-3"><p>{label}</p><strong className="text-lg">{valor}</strong></div>)}
      </div>
      <h3 className="font-bold text-[#003366]">Por proveedor</h3>
      <Table headers={['Proveedor', 'Documentos', 'Compras USD', 'Participación']}
        rows={a.proveedores.map(p => [`${p.cardCode} · ${p.nombre}`, p.documentos, usd(p.monto), `${p.participacion} %`])} />
      <h3 className="font-bold text-[#003366]">Por artículo y precio pagado</h3>
      <Table headers={['Artículo', 'Cantidad', 'Compras USD', 'Precio mín.', 'Precio máx.', 'Promedio', 'Variación']}
        rows={a.articulos.map(x => [`${x.itemCode} · ${x.descripcion}`, x.cantidad, usd(x.monto), usd(x.precioMin), usd(x.precioMax), usd(x.precioPromedio), `${x.dispersionPct} %`])} />
      <Lectura frases={a.lectura} />
      <ParaPensar preguntas={a.preguntas} clave={`b1_compras_${c.data.profile?.uid ?? 'anon'}_${desde}_${hasta}`} />
    </Screen>
  );
}
