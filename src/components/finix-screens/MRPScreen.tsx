'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { mrp, today } from '@/lib/company-calculations';
import { Field, inputClass, SaveButton, Screen, Table } from './FinixControls';

export default function MRPScreen() {
  const c = useCompany();
  const [vendorCode, setVendor] = useState('');
  const [run, setRun] = useState({scenario:'MRP_2026',startDate:today(),endDate:today(),level:'Almacén',warehouseCode:'01',itemCodes:[] as string[],horizon:30,includePurchases:true,includeProduction:true,includeSales:true,includeForecasts:false,excludeWarehouses:''});
  const [statusMsg, setStatusMsg] = useState<{ tipo: 'ok' | 'err'; texto: string } | null>(null);
  const rows = mrp(c.data);
  const pedidosAbiertos = c.data.salesOrders.filter(d => d.docType === 'order' && d.status === 'open');
  const bomsActivas = c.data.boms.filter(b => b.type === 'production');

  const tieneFaltantes = rows.some(r => r.shortage > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorCode) return;
    setStatusMsg(null);
    try {
      await c.save({ action: 'mrp', data: { vendorCode, date: today() } });
      setStatusMsg({
        tipo: 'ok',
        texto: '✓ Solicitud de compra MRP generada con éxito para los faltantes detectados.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al procesar MRP';
      setStatusMsg({ tipo: 'err', texto: `Error: ${msg}` });
    }
  };

  return (
    <Screen title="Asistente de Planificación MRP · Necesidades y Órdenes Netas">
      <div className="space-y-3">
        <form className="rounded border border-gray-300 bg-white p-3 space-y-2" onSubmit={async event=>{event.preventDefault();try{await c.save({action:'mrpRun',data:{...run,itemCodes:run.itemCodes,excludeWarehouses:run.excludeWarehouses.split(',').map(value=>value.trim()).filter(Boolean)}});setStatusMsg({tipo:'ok',texto:'✓ Escenario MRP guardado con sus parámetros y resultados.'});}catch(error){setStatusMsg({tipo:'err',texto:error instanceof Error?error.message:'No se pudo ejecutar MRP'});}}}>
          <h3 className="font-bold text-[#003366]">Ejecutar escenario MRP</h3><div className="grid gap-2 sm:grid-cols-3">
            <Field label="Escenario"><input required className={inputClass} value={run.scenario} onChange={e=>setRun(v=>({...v,scenario:e.target.value}))}/></Field><Field label="Fecha de inicio"><input required type="date" className={inputClass} value={run.startDate} onChange={e=>setRun(v=>({...v,startDate:e.target.value}))}/></Field><Field label="Fecha de fin"><input required type="date" className={inputClass} value={run.endDate} onChange={e=>setRun(v=>({...v,endDate:e.target.value}))}/></Field>
            <Field label="Nivel"><select className={inputClass} value={run.level} onChange={e=>setRun(v=>({...v,level:e.target.value}))}><option>Almacén</option><option>Empresa</option></select></Field><Field label="Almacén"><select className={inputClass} value={run.warehouseCode} onChange={e=>setRun(v=>({...v,warehouseCode:e.target.value}))}>{(c.data.profile?.warehouses??[]).map(w=><option key={w.code} value={w.code}>{w.code} · {w.name}</option>)}</select></Field><Field label="Horizonte (días)"><input type="number" min={1} className={inputClass} value={run.horizon} onChange={e=>setRun(v=>({...v,horizon:Number(e.target.value)}))}/></Field>
            <Field label="Artículos (vacío = todos)"><select multiple className={`${inputClass} min-h-24`} value={run.itemCodes} onChange={e=>setRun(v=>({...v,itemCodes:Array.from(e.target.selectedOptions,option=>option.value)}))}>{c.data.items.filter(item=>item.active).map(item=><option key={item.itemCode} value={item.itemCode}>{item.itemCode} · {item.name}</option>)}</select></Field>
            <Field label="Excluir almacenes"><input className={inputClass} value={run.excludeWarehouses} placeholder="02, 03" onChange={e=>setRun(v=>({...v,excludeWarehouses:e.target.value}))}/></Field>
            {[['includePurchases','Incluir compras'],['includeProduction','Incluir producción'],['includeSales','Incluir ventas'],['includeForecasts','Incluir pronósticos']].map(([key,label])=><label key={key} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={run[key as keyof typeof run] as boolean} onChange={e=>setRun(v=>({...v,[key]:e.target.checked}))}/>{label}</label>)}
          </div><SaveButton label="Ejecutar MRP" disabled={c.saving}/>
        </form>
        <p className="text-xs text-gray-600 leading-relaxed">
          Explosión de BOM de producción (Listas de Materiales) y demanda de pedidos de clientes abiertos. 
          Descuenta automáticamente el stock disponible en almacén y solicitudes/pedidos de compra abiertos para evitar compras duplicadas.
        </p>

        {/* Resumen de Demanda MRP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1">
          <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs">
            <span className="text-blue-600 font-bold block">Pedidos de Venta Abiertos:</span>
            <span className="text-lg font-bold text-blue-950">{pedidosAbiertos.length} documento(s)</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs">
            <span className="text-amber-700 font-bold block">Listas de Materiales (BOM):</span>
            <span className="text-lg font-bold text-amber-950">{bomsActivas.length} estructura(s)</span>
          </div>
          <div className={`border rounded p-2 text-xs ${tieneFaltantes ? 'bg-red-50 border-red-300' : 'bg-emerald-50 border-emerald-300'}`}>
            <span className={`font-bold block ${tieneFaltantes ? 'text-red-700' : 'text-emerald-700'}`}>
              {tieneFaltantes ? 'Faltantes Críticos:' : 'Estado de Stock:'}
            </span>
            <span className={`text-lg font-bold ${tieneFaltantes ? 'text-red-950' : 'text-emerald-950'}`}>
              {tieneFaltantes ? `${rows.filter(r => r.shortage > 0).length} componente(s)` : '100% Cubierto'}
            </span>
          </div>
        </div>

        {/* Tabla de Resultados MRP */}
        <div className="border border-gray-300 rounded overflow-hidden">
          <div className="bg-gray-100 px-3 py-1.5 border-b border-gray-300 font-bold text-xs text-gray-700">
            Explosión de Necesidades Netas por Componente
          </div>
          <Table
            headers={['Código Artículo / Componente', 'Requerido Total', 'Stock Disponible', 'En Solicitud / Pedido', 'Faltante Neto']}
            rows={rows.map(r => [
              r.itemCode,
              r.required,
              r.available,
              r.onOrder,
              r.shortage > 0 ? (
                <span key={r.itemCode} className="text-red-600 font-bold">
                  {r.shortage} (COMPRAR)
                </span>
              ) : (
                <span key={r.itemCode} className="text-emerald-600">
                  Cubierto
                </span>
              ),
            ])}
          />
        </div>

        {!tieneFaltantes && (
          <div className="bg-blue-50/70 border border-blue-200 p-2.5 rounded text-xs text-blue-900 leading-relaxed">
            ℹ️ <strong>Información MRP:</strong> En este momento no hay faltantes netos. Para generar nuevas necesidades de aprovisionamiento, 
            registra un <strong>Pedido de Cliente (SAL002)</strong> de artículos terminados o crea una <strong>Lista de Materiales (BOM)</strong> en Producción.
          </div>
        )}

        {statusMsg && (
          <div
            className={`p-2.5 rounded text-xs font-semibold ${
              statusMsg.tipo === 'ok' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-red-100 text-red-900 border border-red-300'
            }`}
          >
            {statusMsg.texto}
          </div>
        )}

        {/* Formulario de Solicitud de Compra Automática */}
        <form className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded space-y-2" onSubmit={handleSubmit}>
          <Field label="Proveedor sugerido para solicitud de compra automática" required>
            <select
              required
              className={inputClass}
              value={vendorCode}
              onChange={e => setVendor(e.target.value)}
            >
              <option value="">-- Seleccionar Proveedor --</option>
              {c.data.vendors.map(v => (
                <option key={v.id} value={v.cardCode}>
                  {v.cardCode} · {v.name} ({v.city})
                </option>
              ))}
            </select>
          </Field>
          <SaveButton
            disabled={!tieneFaltantes}
            label={tieneFaltantes ? 'Generar Solicitud de Compra MRP' : 'Sin Faltantes Pendientes'}
          />
        </form>
      </div>
    </Screen>
  );
}
