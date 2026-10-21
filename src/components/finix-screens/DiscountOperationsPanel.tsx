'use client';
import { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { listasDePrecios } from '@/lib/company-pricing';
import { Field,Table,inputClass,buttonClass } from './FinixControls';

export default function DiscountOperationsPanel(){
 const c=useCompany(),p=c.data.profile,lists=listasDePrecios(c.data),groups=p?.discountGroups??[];
 const [group,setGroup]=useState({code:'',description:'',validFrom:'2026-01-01',validTo:'2026-12-31',active:true});
 const [rule,setRule]=useState({groupCode:'',itemGroup:'',itemCode:'',discount:0,paidQuantity:2,freeQuantity:1,maxFree:4,kind:'percent' as 'percent'|'free',description:''});
 const [assign,setAssign]=useState({cardCode:'',customerGroup:'',groupCode:'',list:1,excluded:false});
 const [copy,setCopy]=useState({list:1,sourceItemCode:'',targetItemCodes:[] as string[],filter:'Grupo de unidades de medida' as const,overwrite:false});
 const [batch,setBatch]=useState({group:'',percent:-5,validFrom:'2026-08-01',validTo:'2026-08-31'});
 const [special,setSpecial]=useState({sourceCardCode:'',itemCode:'',targetCardCodes:[] as string[],replaceExisting:true});
 const save=async(command:Parameters<typeof c.save>[0])=>{try{await c.save(command);}catch{/* Provider displays failure. */}};
 const itemOptions=c.data.items.filter(i=>i.active).map(i=><option key={i.itemCode} value={i.itemCode}>{i.itemCode} · {i.name}</option>);
 const groupOptions=groups.map(g=><option key={g.code} value={g.code}>{g.code} · {g.description}</option>);
 const listOptions=lists.filter(l=>l.active).map(l=><option key={l.no} value={l.no}>{l.code} · {l.name}</option>);
 const customers=c.data.customers.filter(c=>c.active);
 const source=c.data.items.find(i=>i.itemCode===copy.sourceItemCode);
 const eligible=c.data.items.filter(i=>i.active&&i.itemCode!==copy.sourceItemCode&&source&&(i.uomGroup||i.salesUnit)===(source.uomGroup||source.salesUnit));
 return <section className="space-y-4">
  <details className="border bg-white p-3" open><summary className="font-bold">Grupos de descuento</summary>
   <form className="mt-2 grid gap-2 sm:grid-cols-3" onSubmit={e=>{e.preventDefault();void save({action:'discountGroup',data:group});}}>
    <Field label="Grupo de descuento"><input required className={inputClass} value={group.code} onChange={e=>setGroup(v=>({...v,code:e.target.value}))}/></Field>
    <Field label="Descripción"><input required className={inputClass} value={group.description} onChange={e=>setGroup(v=>({...v,description:e.target.value}))}/></Field>
    <Field label="Fecha de inicio"><input required type="date" className={inputClass} value={group.validFrom} onChange={e=>setGroup(v=>({...v,validFrom:e.target.value}))}/></Field>
    <Field label="Fecha de fin"><input required type="date" className={inputClass} value={group.validTo} onChange={e=>setGroup(v=>({...v,validTo:e.target.value}))}/></Field>
    <label><input type="checkbox" checked={group.active} onChange={e=>setGroup(v=>({...v,active:e.target.checked}))}/> Activo</label>
    <button className={buttonClass} disabled={c.saving}>Guardar grupo</button>
   </form>
   <Table headers={['Grupo','Descripción','Vigencia','Reglas']} rows={groups.map(g=>[g.code,g.description,`${g.validFrom} a ${g.validTo}`,g.rules.length])}/>
   <form className="mt-3 grid gap-2 sm:grid-cols-3" onSubmit={e=>{e.preventDefault();void save({action:'discountGroupRule',data:rule});}}>
    <Field label="Grupo de descuento"><select required className={inputClass} value={rule.groupCode} onChange={e=>setRule(v=>({...v,groupCode:e.target.value}))}><option value="">Selecciona…</option>{groupOptions}</select></Field>
    <Field label="Grupo de artículos"><input required className={inputClass} value={rule.itemGroup} onChange={e=>setRule(v=>({...v,itemGroup:e.target.value}))}/></Field>
    <Field label="Artículo a clasificar en este grupo"><select required className={inputClass} value={rule.itemCode} onChange={e=>setRule(v=>({...v,itemCode:e.target.value,description:c.data.items.find(i=>i.itemCode===e.target.value)?.name??''}))}><option value="">Selecciona…</option>{itemOptions}</select></Field>
    <Field label="Tipo de regla"><select className={inputClass} value={rule.kind} onChange={e=>setRule(v=>({...v,kind:e.target.value as 'percent'|'free'}))}><option value="percent">Porcentaje</option><option value="free">Unidades gratuitas</option></select></Field>
    {rule.kind==='percent'?<Field label="Descuento %"><input required type="number" min={0} max={100} className={inputClass} value={rule.discount} onChange={e=>setRule(v=>({...v,discount:Number(e.target.value)}))}/></Field>:<>
     <Field label="Cantidad abonada"><input required type="number" min={1} className={inputClass} value={rule.paidQuantity} onChange={e=>setRule(v=>({...v,paidQuantity:Number(e.target.value)}))}/></Field>
     <Field label="Cantidad gratuita"><input required type="number" min={1} className={inputClass} value={rule.freeQuantity} onChange={e=>setRule(v=>({...v,freeQuantity:Number(e.target.value)}))}/></Field>
     <Field label="Máximo gratuito"><input required type="number" min={1} className={inputClass} value={rule.maxFree} onChange={e=>setRule(v=>({...v,maxFree:Number(e.target.value)}))}/></Field>
    </>}
    <Field label="Descripción de regla"><input className={inputClass} value={rule.description} onChange={e=>setRule(v=>({...v,description:e.target.value}))}/></Field>
    <p className="sm:col-span-3">Al guardar se clasifica el artículo seleccionado en el grupo indicado. Las ventas aplicarán la regla a todos los artículos de ese grupo. Para promociones, ingresa en la venta la cantidad total entregada, incluidas las unidades gratuitas.</p>
    <button className={buttonClass} disabled={c.saving}>Guardar regla y clasificación</button>
   </form>
   <Table headers={['Grupo descuento','Grupo artículo','Tipo','Detalle']} rows={groups.flatMap(g=>g.rules.map(r=>[g.code,r.itemGroup,r.kind==='free'?'Unidades gratuitas':'Porcentaje',r.kind==='free'?`Paga ${r.paidQuantity}, recibe ${r.freeQuantity} gratis (máx. ${r.maxFree})`:`${r.discount} %`]))}/>
  </details>
  <details className="border bg-white p-3"><summary className="font-bold">Asignación de grupo a cliente</summary>
   <form className="mt-2 grid gap-2 sm:grid-cols-3" onSubmit={e=>{e.preventDefault();void save({action:'customerDiscountGroup',data:assign});}}>
    <Field label="Cliente"><select required className={inputClass} value={assign.cardCode} onChange={e=>setAssign(v=>({...v,cardCode:e.target.value,customerGroup:customers.find(c=>c.cardCode===e.target.value)?.group??''}))}><option value="">Selecciona…</option>{customers.map(c=><option key={c.cardCode} value={c.cardCode}>{c.cardCode} · {c.name}</option>)}</select></Field>
    <Field label="Grupo de clientes"><input required className={inputClass} value={assign.customerGroup} onChange={e=>setAssign(v=>({...v,customerGroup:e.target.value}))}/></Field>
    <Field label="Grupo de descuento"><select required className={inputClass} value={assign.groupCode} onChange={e=>setAssign(v=>({...v,groupCode:e.target.value}))}><option value="">Selecciona…</option>{groupOptions}</select></Field>
    <Field label="Lista de precios"><select className={inputClass} value={assign.list} onChange={e=>setAssign(v=>({...v,list:Number(e.target.value)}))}>{listOptions}</select></Field>
    <label><input type="checkbox" checked={assign.excluded} onChange={e=>setAssign(v=>({...v,excluded:e.target.checked}))}/> No aplicar grupos de descuento</label>
    <button className={buttonClass} disabled={c.saving}>Asignar grupo y lista</button>
   </form>
   <Table headers={['Cliente','Grupo descuento','Excluido']} rows={Object.entries(p?.customerDiscountGroups??{}).map(([code,a])=>[code,a.groupCode,a.excluded?'Sí':'No'])}/>
  </details>
  <details className="border bg-white p-3"><summary className="font-bold">Copiar descuentos por período y cantidad</summary>
   <form className="mt-2 grid gap-2 sm:grid-cols-3" onSubmit={e=>{e.preventDefault();void save({action:'copyVolumeDiscounts',data:copy});}}>
    <Field label="Lista de precios"><select className={inputClass} value={copy.list} onChange={e=>setCopy(v=>({...v,list:Number(e.target.value)}))}>{listOptions}</select></Field>
    <Field label="Artículo origen"><select required className={inputClass} value={copy.sourceItemCode} onChange={e=>setCopy(v=>({...v,sourceItemCode:e.target.value,targetItemCodes:[]}))}><option value="">Selecciona…</option>{itemOptions}</select></Field>
    <Field label="Filtrar por"><input readOnly className={inputClass} value={copy.filter}/></Field>
    <fieldset className="sm:col-span-3"><legend>Artículos destino con la misma unidad de medida</legend>{eligible.map(i=><label key={i.itemCode} className="mr-3 inline-flex gap-1"><input type="checkbox" checked={copy.targetItemCodes.includes(i.itemCode)} onChange={e=>setCopy(v=>({...v,targetItemCodes:e.target.checked?[...v.targetItemCodes,i.itemCode]:v.targetItemCodes.filter(x=>x!==i.itemCode)}))}/>{i.itemCode} · {i.name}</label>)}</fieldset>
    <label><input type="checkbox" checked={copy.overwrite} onChange={e=>setCopy(v=>({...v,overwrite:e.target.checked}))}/> Sobrescribir existentes</label>
    <button className={buttonClass} disabled={c.saving||!copy.targetItemCodes.length}>Copiar período y cantidad</button>
   </form>
  </details>
  <details className="border bg-white p-3"><summary className="font-bold">Actualización global de precios especiales</summary>
   <p>Selecciona el grupo de clientes que ya tiene precios especiales. Un ajuste negativo reduce adicionalmente el precio neto. Revisa la vigencia antes de ejecutar.</p>
   <form className="mt-2 grid gap-2 sm:grid-cols-3" onSubmit={e=>{e.preventDefault();void save({action:'specialPriceBatch',data:batch});}}>
    <Field label="Grupo de clientes"><input required className={inputClass} list="discount-customer-groups" value={batch.group} onChange={e=>setBatch(v=>({...v,group:e.target.value}))}/><datalist id="discount-customer-groups">{[...new Set(customers.map(c=>c.group))].map(g=><option key={g} value={g}/>)}</datalist></Field>
    <Field label="Porcentaje de ajuste"><input required type="number" min={-100} max={100} step="0.01" className={inputClass} value={batch.percent} onChange={e=>setBatch(v=>({...v,percent:Number(e.target.value)}))}/></Field>
    <Field label="Fecha de inicio"><input required type="date" className={inputClass} value={batch.validFrom} onChange={e=>setBatch(v=>({...v,validFrom:e.target.value}))}/></Field>
    <Field label="Fecha de fin"><input required type="date" className={inputClass} value={batch.validTo} onChange={e=>setBatch(v=>({...v,validTo:e.target.value}))}/></Field>
    <button className={buttonClass} disabled={c.saving}>Aplicar cambio de descuento</button>
   </form>
  </details>
  <details className="border bg-white p-3"><summary className="font-bold">Copiar precios especiales entre clientes</summary>
   <form className="mt-2 grid gap-2 sm:grid-cols-3" onSubmit={e=>{e.preventDefault();void save({action:'copySpecialPrices',data:special});}}>
    <Field label="Interlocutor origen"><select required className={inputClass} value={special.sourceCardCode} onChange={e=>setSpecial(v=>({...v,sourceCardCode:e.target.value,targetCardCodes:[]}))}><option value="">Selecciona…</option>{customers.map(c=><option key={c.cardCode} value={c.cardCode}>{c.cardCode} · {c.name}</option>)}</select></Field>
    <Field label="Artículo"><select required className={inputClass} value={special.itemCode} onChange={e=>setSpecial(v=>({...v,itemCode:e.target.value}))}><option value="">Selecciona…</option>{itemOptions}</select></Field>
    <Field label="Regla de copia"><select className={inputClass} value={special.replaceExisting?'replace':'new'} onChange={e=>setSpecial(v=>({...v,replaceExisting:e.target.value==='replace'}))}><option value="replace">Sustituir existentes</option><option value="new">Crear solo faltantes</option></select></Field>
    <fieldset className="sm:col-span-3"><legend>Clientes destino</legend>{customers.filter(c=>c.cardCode!==special.sourceCardCode).map(c=><label key={c.cardCode} className="mr-3 inline-flex gap-1"><input type="checkbox" checked={special.targetCardCodes.includes(c.cardCode)} onChange={e=>setSpecial(v=>({...v,targetCardCodes:e.target.checked?[...v.targetCardCodes,c.cardCode]:v.targetCardCodes.filter(x=>x!==c.cardCode)}))}/>{c.cardCode} · {c.name}</label>)}</fieldset>
    <button className={buttonClass} disabled={c.saving||!special.targetCardCodes.length}>Ejecutar copia de precio especial</button>
   </form>
  </details>
  <Table headers={['Operación','Registros afectados']} rows={(p?.discountOperations??[]).slice(-10).map(o=>[o.kind,o.count])}/>
 </section>;
}
