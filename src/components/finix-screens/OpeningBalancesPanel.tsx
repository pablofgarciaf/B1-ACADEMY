'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { prepareOpeningBalances } from '@/lib/opening-balances';
import { openingBalancesSchema, openingControlMaps } from '@/lib/opening-balances-schema';
import { buttonClass, inputClass } from './FinixControls';

export default function OpeningBalancesPanel() {
  const c = useCompany();
  const [source, setSource] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<ReturnType<typeof prepareOpeningBalances>['summary'] | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [family, setFamily] = useState<'global' | 'compact'>('global');
  const opening = c.data.profile?.openingBalances;
  const owner = c.data.profile?.createdBy ?? '';
  function template() {
    const map = openingControlMaps[family];
    const sample = {version:1,reference:'APERTURA',date:'',accountFamily:family,balances:[...new Set(Object.values(map))].map(accountCode=>({accountCode,debit:0,credit:0})),receivables:[],payables:[],inventory:[],banks:[],assets:[]};
    const blob = new Blob([JSON.stringify(sample,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href=url;link.download='plantilla-saldos-iniciales.json';link.click();URL.revokeObjectURL(url);
  }
  function validate() {
    setError('');setPreview(null);setConfirmed(false);
    try {const data=openingBalancesSchema.parse(JSON.parse(source));setPreview(prepareOpeningBalances(c.data,data,owner,new Date().toISOString()).summary);}
    catch(e){setError(e instanceof Error?e.message:'No se pudo validar el archivo.');}
  }
  async function commit() {
    if(!preview||!confirmed)return;
    try {const data=openingBalancesSchema.parse(JSON.parse(source));prepareOpeningBalances(c.data,data,owner,new Date().toISOString());await c.save({action:'openingBalances',data});setSource('');setPreview(null);setConfirmed(false);}
    catch(e){setError(e instanceof Error?e.message:'No se importaron los saldos.');}
  }
  if(c.data.profile?.usage!=='private')return null;
  return <section className="mt-6 space-y-3 border-t border-[#999] pt-4" aria-label="Importar saldos iniciales">
    <h3 className="font-bold">Saldos iniciales con auxiliares</h3>
    {opening?<p role="status">Apertura registrada al {opening.date}. Referencia: {opening.reference}. Asiento: {opening.journalEntryId}. Las nuevas operaciones deben tener fecha posterior al corte.</p>:<>
      <p>Para una empresa sin movimientos. Crea primero sus clientes, proveedores, artículos, almacenes y bancos. Aporta el balance al corte y el detalle real de las deudas, existencias, bancos y activos. La importación se guarda completa en una sola operación.</p>
      <div className="flex flex-wrap gap-2"><label>Catálogo de la plantilla <select className={inputClass} value={family} onChange={e=>setFamily(e.target.value as typeof family)}><option value="global">Global Ecuador</option><option value="compact">Compacto</option></select></label><button type="button" className={buttonClass} onClick={template}>Descargar plantilla vacía</button></div>
      <details><summary className="cursor-pointer font-bold">Cómo preparar el archivo</summary><div className="space-y-2 py-3">
        <p>Formato JSON, versión 1. Fecha en AAAA-MM-DD y valores monetarios con dos decimales. Elimina las filas sin saldo de la plantilla y agrega las cuentas de caja, bancos y patrimonio correspondientes. Debe y haber deben coincidir; no se inventa una contrapartida.</p>
        <p>Clientes y proveedores: cardCode, documentNumber, date, dueDate, amount (saldo pendiente). Inventario: itemCode, warehouseCode, quantity, unitCost; para FIFO, layers con quantity, unitCost y date de cada capa.</p>
        <p>Bancos: bankAccountId, ledgerAccount, balance. Activos: assetCode, name, category, acquisitionDate, cost, residualValue, usefulLifeMonths, accumulatedDepreciation.</p>
        <p>Usa los códigos existentes en los maestros. El detalle debe cuadrar con cada cuenta de control. Esta apertura conserva saldos pendientes; no reconstruye facturas históricas ni sus impuestos. El inventario inicial admite mercadería y materias primas; los productos terminados requieren una migración específica.</p>
        <p>Cuentas bancarias disponibles: {c.data.bankAccounts.map(b=>`${b.name}: ${b.id} / ${b.ledgerAccount}`).join('; ')||'Registra primero las cuentas bancarias.'}</p>
      </div></details>
      <label className="block">Archivo de apertura <input type="file" accept=".json,application/json" className={inputClass} onChange={async e=>{setPreview(null);setConfirmed(false);setError('');const file=e.target.files?.[0];if(!file)return;if(file.size>1000000){setError('El archivo supera 1 MB.');return;}try{setSource(await file.text());}catch{setError('No se pudo leer el archivo.');}}}/></label>
      <label className="block">Contenido a revisar<textarea className={`${inputClass} min-h-40 font-mono`} value={source} onChange={e=>{setSource(e.target.value);setPreview(null);setConfirmed(false);}} maxLength={1000000}/></label>
      <button type="button" className={buttonClass} disabled={!source||c.saving} onClick={validate}>Validar y mostrar resumen</button>
      {error&&<p role="alert" className="whitespace-pre-wrap text-red-700">{error}</p>}
      {preview&&<div className="space-y-3 rounded border p-3"><p>Corte: {preview.date}. Debe: ${preview.debit.toFixed(2)}. Haber: ${preview.credit.toFixed(2)}.</p><p>{preview.customers} documentos de clientes; {preview.vendors} de proveedores; {preview.inventory} existencias; {preview.banks} bancos; {preview.assets} activos.</p><label className="flex gap-2"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>He revisado los saldos y sus auxiliares. Confirmo esta apertura única.</label><button type="button" className={buttonClass} disabled={!confirmed||c.saving} onClick={()=>void commit()}>{c.saving?'Importando…':'Importar apertura validada'}</button></div>}
    </>}
  </section>;
}
