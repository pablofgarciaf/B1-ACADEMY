'use client';
import {useState} from 'react';
import {useCompany} from '@/hooks/useCompany';
import type {TrainingOpeningInput} from '@/lib/training-accounting';
import {today,usd} from '@/lib/company-calculations';
import {Screen,Field,Table,inputClass,buttonClass} from './FinixControls';

export default function TrainingOpeningScreen(){
 const c=useCompany();const[d,setD]=useState<TrainingOpeningInput>({kind:'cash',date:`${today().slice(0,4)}-01-01`,accountCode:'1.1.01',cardCode:'',itemCode:'',warehouseCode:'01',amount:0,quantity:0,unitCost:0});
 const set=<K extends keyof TrainingOpeningInput>(key:K,value:TrainingOpeningInput[K])=>setD(old=>({...old,[key]:value}));
 return <Screen title="Saldos de apertura · Laboratorio"><p>Ingresa el saldo inicial del caso a la fecha de corte. La diferencia se contabiliza contra Patrimonio — Saldos de apertura; los movimientos posteriores siguen sumándose al saldo actual. Puedes revisar el asiento, el auxiliar del cliente y el kardex después de guardar.</p>
 <form className="space-y-3" onSubmit={async e=>{e.preventDefault();try{await c.save({action:'trainingOpening',data:d});}catch{/* provider shows errors */}}}><div className="grid gap-3 sm:grid-cols-3">
 <Field label="Tipo de saldo"><select className={inputClass} value={d.kind} onChange={e=>set('kind',e.target.value as TrainingOpeningInput['kind'])}><option value="cash">Caja</option><option value="customer">Cliente</option><option value="inventory">Inventario</option></select></Field>
 <Field label="Fecha"><input required type="date" className={inputClass} value={d.date} onChange={e=>set('date',e.target.value)}/></Field>
 {d.kind==='cash'&&<Field label="Cuenta"><select className={inputClass} value={d.accountCode} onChange={e=>set('accountCode',e.target.value)}><option value="1.1.01">1.1.01 · Caja (equivalente a 101000)</option></select></Field>}
 {d.kind==='customer'&&<Field label="Cliente"><select required className={inputClass} value={d.cardCode} onChange={e=>set('cardCode',e.target.value)}><option value="">Seleccionar</option>{c.data.customers.filter(p=>p.active&&p.kind==='customer').map(p=><option key={p.id} value={p.cardCode}>{p.cardCode} · {p.name}</option>)}</select></Field>}
 {d.kind==='inventory'?<><Field label="Artículo"><select required className={inputClass} value={d.itemCode} onChange={e=>{set('itemCode',e.target.value);set('unitCost',c.data.items.find(i=>i.itemCode===e.target.value)?.purchasePrice??0);}}><option value="">Seleccionar</option>{c.data.items.filter(i=>i.type==='inventory'&&i.active).map(i=><option key={i.id} value={i.itemCode}>{i.itemCode} · {i.name}</option>)}</select></Field><Field label="Almacén"><select className={inputClass} value={d.warehouseCode} onChange={e=>set('warehouseCode',e.target.value)}>{c.data.profile?.warehouses.map(w=><option key={w.code} value={w.code}>{w.code} · {w.name}</option>)}</select></Field><Field label="Cantidad inicial"><input required type="number" min="0.000001" step="any" className={inputClass} value={d.quantity} onChange={e=>set('quantity',Number(e.target.value))}/></Field><Field label="Precio por unidad"><input required type="number" min="0.01" step="0.01" className={inputClass} value={d.unitCost} onChange={e=>set('unitCost',Number(e.target.value))}/></Field></>:<Field label="Saldo de apertura (Debe)"><input required type="number" min="0.01" step="0.01" className={inputClass} value={d.amount} onChange={e=>set('amount',Number(e.target.value))}/></Field>}
 </div><p>Contrapartida: 3.03 · Patrimonio — Saldos de apertura. Origen: OB.</p><button className={buttonClass} disabled={c.saving}>Registrar apertura</button></form>
 <Table headers={['Fecha','Tipo','Cuenta / Artículo / Cliente','Saldo / Cantidad','Asiento']} rows={(c.data.profile?.trainingOpenings??[]).map(r=>[r.date,r.kind,r.description,r.kind==='inventory'?`${r.quantity} × ${usd(r.unitCost)}`:usd(r.amount),r.journalEntryId])}/></Screen>;
}
