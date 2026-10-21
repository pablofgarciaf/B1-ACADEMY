'use client';
import {useState} from 'react';
import {useCompany} from '@/hooks/useCompany';
import {annualAssetAmount} from '@/lib/asset-lifecycle';
import {today,usd} from '@/lib/company-calculations';
import {Field,Table,inputClass,buttonClass} from './FinixControls';

export default function AssetLifecyclePanel(){
 const c=useCompany();const [item,setItem]=useState('');const [series,setSeries]=useState('');const [isAsset,setIsAsset]=useState(true);const [virtual,setVirtual]=useState(true);
 const [assetId,setAssetId]=useState('');const [date,setDate]=useState(today());const [area,setArea]=useState('PCGA');const [preview,setPreview]=useState<{assetId:string;date:string;amount:number;area:string}|null>(null);
 const [year,setYear]=useState(new Date().getFullYear());const [reason,setReason]=useState('');
 const asset=c.data.fixedAssets.find(a=>a.id===assetId);const seriesList=(c.data.profile as unknown as {docSeries?:{docType?:string;nombre?:string;bloqueada?:boolean}[]}|null)?.docSeries??[];
 const save=async(data:Parameters<typeof c.save>[0])=>{try{await c.save(data);setPreview(null);}catch{/* error in company provider */}};
 return <div className="space-y-3">
  <details className="border bg-white p-3"><summary className="cursor-pointer font-bold">Artículo de activo y modelo virtual</summary><div className="grid gap-2 sm:grid-cols-3 mt-2">
   <Field label="Artículo"><select className={inputClass} value={item} onChange={e=>setItem(e.target.value)}><option value="">Seleccionar</option>{c.data.items.filter(i=>i.active).map(i=><option key={i.id} value={i.itemCode}>{i.itemCode} · {i.name}</option>)}</select></Field>
   <Field label="Serie de activos"><select className={inputClass} value={series} onChange={e=>setSeries(e.target.value)}><option value="">Seleccionar</option>{seriesList.filter(s=>s.docType==='activos'&&!s.bloqueada).map(s=><option key={s.nombre} value={s.nombre}>{s.nombre}</option>)}</select></Field>
   <label><input type="checkbox" checked={isAsset} onChange={e=>setIsAsset(e.target.checked)}/> Artículo de activo</label><label><input type="checkbox" checked={virtual} onChange={e=>setVirtual(e.target.checked)}/> Artículo virtual (una ficha por unidad adquirida)</label>
  </div><button type="button" className={buttonClass} disabled={c.saving||!item||!series} onClick={()=>save({action:'assetLifecycle',data:{mode:'model',itemCode:item,series,isAsset,virtual}})}>Guardar modelo</button>
  <p className="text-xs mt-2">Al comprar un activo, indique la fecha de valoración en la factura. El costo se capitaliza y cada unidad genera una ficha; no se registra como mercadería.</p>
  <Table headers={['Artículo','Activo','Virtual','Serie']} rows={(c.data.profile?.assetModels??[]).map(m=>[m.itemCode,m.isAsset?'Sí':'No',m.virtual?'Sí':'No',m.series])}/></details>
  <section className="border bg-white p-3 space-y-2"><h3 className="font-bold">Amortización anual y baja</h3><div className="grid gap-2 sm:grid-cols-3">
   <Field label="Activo"><select className={inputClass} value={assetId} onChange={e=>{setAssetId(e.target.value);setPreview(null);}}><option value="">Seleccionar</option>{c.data.fixedAssets.filter(a=>a.status!=='disposed').map(a=><option key={a.id} value={a.id}>{a.assetCode} · {a.name}</option>)}</select></Field>
   <Field label="Fecha de corte / baja"><input type="date" className={inputClass} value={date} onChange={e=>{setDate(e.target.value);setPreview(null);}}/></Field>
   <Field label="Área de amortización"><input className={inputClass} value={area} onChange={e=>{setArea(e.target.value);setPreview(null);}}/></Field>
  </div>
  <button type="button" className={buttonClass} disabled={!asset||c.saving} onClick={()=>asset&&setPreview({assetId,date,area,amount:annualAssetAmount(asset,date)})}>Vista previa anual</button>
  {preview&&<div role="status"><p>Amortización pendiente hasta {preview.date}: <strong>{usd(preview.amount)}</strong>. El importe se calcula con vida útil, residual y depreciación ya registrada.</p><button type="button" className={buttonClass} disabled={c.saving||preview.amount<=0} onClick={()=>save({action:'assetLifecycle',data:{mode:'annual',assetId:preview.assetId,date:preview.date,area:preview.area,expectedAmount:preview.amount}})}>Confirmar y contabilizar amortización</button></div>}
  <Field label="Motivo de desecho"><input className={inputClass} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Fin de vida útil"/></Field>
  {asset&&<p>Valor libro para la baja neta: {usd(asset.cost-asset.accumulatedDepreciation)}. Se revierte el costo y la depreciación acumulada y se lleva el neto a resultados.</p>}
  <button type="button" className={buttonClass} disabled={!asset||reason.trim().length<3||c.saving} onClick={()=>window.confirm('¿Contabilizar la baja definitiva de este activo?')&&save({action:'assetLifecycle',data:{mode:'dispose',assetId,date,reason,kind:'Desecho',posting:'Neto'}})}>Dar de baja por desecho</button>
  </section>
  <section className="border bg-white p-3 space-y-2"><h3 className="font-bold">Cambio de ejercicio de activos</h3><Field label="Ejercicio actual"><input className={inputClass} type="number" min={2020} max={2099} value={year} onChange={e=>setYear(Number(e.target.value))}/></Field><p>Se trasladan los valores acumulados al ejercicio {year+1} y se recalcula el valor pendiente. Este proceso conserva los asientos y no vuelve a depreciar.</p><button type="button" className={buttonClass} disabled={c.saving||!c.data.fixedAssets.length} onClick={()=>save({action:'assetLifecycle',data:{mode:'rollover',year,newYear:year+1,date:`${year}-12-31`,transfer:true,recalculate:true}})}>Confirmar cambio de ejercicio</button></section>
  <Table headers={['Proceso','Fecha','Activo / ejercicio','Monto','Asiento']} rows={(c.data.profile?.assetLifecycle??[]).map(r=>[r.mode,r.date??'',r.assetId??`${r.year} → ${r.newYear}`,r.amount!==undefined?usd(r.amount):r.bookValue!==undefined?usd(r.bookValue):'—',r.journalEntryId??'No genera asiento'])}/>
 </div>;
}
