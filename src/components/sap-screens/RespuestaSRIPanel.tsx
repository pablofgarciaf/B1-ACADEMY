'use client';
import { useCompany } from '@/hooks/useCompany';
import type { SRITaxDocument } from '@/lib/firestore-types';
import { construirRIDE } from '@/lib/sri-ride';
import { buttonClass } from './SAPControls';

const COLOR: Record<SRITaxDocument['status'], string> = {
  PENDIENTE: 'border-amber-500 bg-amber-50', AUTORIZADO: 'border-green-700 bg-green-50', DEVUELTA: 'border-red-700 bg-red-50', 'NO AUTORIZADO': 'border-red-700 bg-red-50',
};

/** Respuesta del SRI (simulado) para un comprobante y, si está autorizado, su RIDE imprimible. */
export default function RespuestaSRIPanel({ doc }: { doc: SRITaxDocument }) {
  const c = useCompany();

  const verRIDE = async () => {
    const { default: JsBarcode } = await import('jsbarcode');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    JsBarcode(svg, doc.claveAcceso, { format: 'CODE128', displayValue: false, margin: 0, height: 50, width: 1 });
    const ventana = window.open('', '_blank');
    if (!ventana) return;
    ventana.document.write(construirRIDE(c.data, doc, new XMLSerializer().serializeToString(svg)));
    ventana.document.close();
  };

  return (
    <div role="status" className={`space-y-2 border-l-4 p-2 ${COLOR[doc.status]}`}>
      <p className="font-bold">Estado SRI: {doc.status}{doc.status === 'PENDIENTE' ? ' · aún no se envía' : ''}</p>
      {doc.status === 'DEVUELTA' && <p>El SRI no recibió el comprobante (falla de estructura). Corrige el dato y genera uno nuevo.</p>}
      {doc.status === 'NO AUTORIZADO' && <p>El SRI recibió el comprobante pero no lo autorizó. Corrige el dato indicado y genera uno nuevo: este número ya no se puede reutilizar.</p>}
      {!!doc.sriMessages?.length && (
        <ul className="space-y-1">
          {doc.sriMessages.map((m, i) => (
            <li key={i}><b>{m.tipo}{m.identificador !== '—' ? ` ${m.identificador}` : ''}:</b> {m.mensaje}</li>
          ))}
        </ul>
      )}
      {doc.status === 'AUTORIZADO' && (
        <>
          {doc.docType === '07' && doc.journalEntryId && <p>Asiento {doc.journalEntryId}: Cuentas por pagar proveedores (debe) contra Retenciones por pagar (haber) por {doc.totalRetention.toFixed(2)}.</p>}
          <button type="button" className={buttonClass} onClick={() => void verRIDE()}>Ver RIDE (para entregar al cliente)</button>
        </>
      )}
    </div>
  );
}
