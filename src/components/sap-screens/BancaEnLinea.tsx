'use client';
import { useMemo, useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { usd } from '@/lib/company-calculations';
import { BANCOS, conciliar, detectarBanco, generarArchivoPagos, generarExtracto, leerExtracto, type LineaExtracto } from '@/lib/banco-simulado';
import { buttonClass, inputClass, Field } from './SAPControls';

/** Descarga un texto como archivo (el extracto o el archivo de pagos que la empresa usaría con su banco). */
function descargar(nombre: string, texto: string) {
  const url = URL.createObjectURL(new Blob([texto], { type: 'text/plain;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = nombre; a.click(); URL.revokeObjectURL(url);
}

/**
 * Banca en línea simulada (Pichincha, Pacífico, Guayaquil, Produbanco): el mismo flujo que una pyme ecuatoriana
 * hace con su banco real — descargar el extracto, importarlo para conciliar y subir el archivo de pagos.
 */
export default function BancaEnLinea() {
  const c = useCompany();
  const cuentas = c.data.bankAccounts.filter(a => detectarBanco(a.bankName));
  const [cuentaId, setCuentaId] = useState('');
  const cuenta = cuentas.find(a => a.id === cuentaId) ?? cuentas[0];
  const banco = cuenta ? detectarBanco(cuenta.bankName) : null;
  const movimientos = useMemo(() => c.data.bankTransactions.filter(t => cuenta && t.bankAccountId === cuenta.id), [c.data.bankTransactions, cuenta]);
  const [resultado, setResultado] = useState<{ conciliadas: number; sinPareja: LineaExtracto[] } | null>(null);
  const [trabajando, setTrabajando] = useState(false);

  const facturasProveedor = [...c.data.purchaseOrders].filter(d => d.docType === 'vendor_invoice' && d.status === 'open');

  if (!cuenta || !banco) return <p className="mt-4 border border-[#999] bg-white p-3">Esta empresa no tiene cuentas en los bancos simulados. Las empresas nuevas incluyen Pichincha, Pacífico, Guayaquil y Produbanco.</p>;
  const adaptador = BANCOS[banco];

  const importar = async (archivo: File) => {
    setTrabajando(true); setResultado(null);
    try {
      const lineas = leerExtracto(banco, await archivo.text());
      const { emparejados, sinPareja } = conciliar(lineas, movimientos);
      for (const { movimiento, linea } of emparejados) {
        await c.save({ action: 'reconcile', data: { id: movimiento.id, statementAmount: linea.monto, reconciled: true } });
      }
      setResultado({ conciliadas: emparejados.length, sinPareja });
    } catch { /* el error lo muestra el proveedor de la empresa */ }
    finally { setTrabajando(false); }
  };

  return (
    <section className="mt-4 space-y-3 border border-[#999] bg-white p-3">
      <h3 className="font-bold">Banca en línea · {adaptador.nombre}</h3>
      <p className="text-[#555]">Formato simulado para formación: cuando la empresa tenga la especificación oficial de su banco, se reemplaza este formato sin cambiar el resto del sistema.</p>
      <Field label="Cuenta">
        <select className={inputClass} value={cuenta.id} onChange={e => { setCuentaId(e.target.value); setResultado(null); }}>
          {cuentas.map(a => <option key={a.id} value={a.id}>{a.name} · {a.accountNumber} · {usd(a.balance)}</option>)}
        </select>
      </Field>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} disabled={!movimientos.length} onClick={() => descargar(`extracto_${banco}_${cuenta.accountNumber}.csv`, generarExtracto(banco, movimientos, cuenta.openingBalance))}>
          1. Descargar extracto del banco
        </button>
        <label className={`${buttonClass} cursor-pointer`}>
          2. Importar extracto y conciliar
          <input type="file" accept=".csv,.txt" className="sr-only" disabled={trabajando} onChange={e => { const f = e.target.files?.[0]; if (f) void importar(f); e.target.value = ''; }} />
        </label>
        <button type="button" className={buttonClass} disabled={!facturasProveedor.length} onClick={() => descargar(`pagos_${banco}_${cuenta.accountNumber}.txt`, generarArchivoPagos(banco, cuenta.accountNumber, facturasProveedor.map(f => {
          const proveedor = c.data.vendors.find(v => v.cardCode === f.cardCode);
          return { proveedor: proveedor?.name ?? f.cardCode, ruc: proveedor?.ruc ?? '', monto: f.total, referencia: f.docNumber ?? f.id };
        })))}>
          3. Generar archivo de pagos a proveedores
        </button>
      </div>
      {!movimientos.length && <p className="text-[#555]">Registra primero cobros o pagos en esta cuenta para que el banco tenga movimientos en el extracto.</p>}
      {trabajando && <p>Conciliando…</p>}
      {resultado && (
        <div role="status" className="space-y-1">
          <p className="font-semibold text-green-800">{resultado.conciliadas} movimiento(s) conciliado(s) con el extracto.</p>
          {resultado.sinPareja.length > 0 && (
            <>
              <p className="font-semibold">Movimientos del banco que tu empresa aún no registró (regístralos arriba como cobro o pago):</p>
              <ul className="list-disc pl-5">{resultado.sinPareja.map((l, i) => <li key={i}>{l.fecha} · {l.descripcion} · {usd(l.monto)}</li>)}</ul>
            </>
          )}
        </div>
      )}
    </section>
  );
}
