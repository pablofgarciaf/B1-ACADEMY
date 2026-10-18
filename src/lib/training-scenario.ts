import { comandosB1Center, comandoStock } from './b1-center-datos';
import type { CompanyCommand } from './company-commands';
import type { CompanyState } from './firestore-types';

type Reducer=(state:CompanyState,command:CompanyCommand,uid:string,email:string,now:string)=>{state:CompanyState;result:string};
/** Build the complete academic scenario before the persistence transaction commits. */
export function prepareTraining(original:CompanyState,name:string|undefined,uid:string,email:string,now:string,apply:Reducer){
  if(original.profile?.trainingSetupVersion===1 || (original.profile?.companyName && (original.customers.length > 0 || original.items.length > 0))){
    const state = structuredClone(original);
    if (state.profile) state.profile.trainingSetupVersion = 1;
    return {state,result:uid};
  }
  let state=structuredClone(original);
  const run=(c:CompanyCommand)=>{state=apply(state,c,uid,email,now).state;};
  for(const command of comandosB1Center(name)){
    if(command.action==='customer' && state.customers.some(x=>x.ruc===command.data.ruc))continue;
    if(command.action==='vendor' && state.vendors.some(x=>x.ruc===command.data.ruc))continue;
    if(command.action==='item' && state.items.some(x=>x.name===command.data.name))continue;
    if(command.action==='employee' && state.employees.some(x=>x.identification===command.data.identification))continue;
    if(command.action==='importMasterData'){
      const { kind, rows } = command.data;
      const filtered = rows.filter(r => {
        const row = r as Record<string, unknown>;
        if (kind === 'customer') return !state.customers.some(x => x.ruc === row.ruc);
        if (kind === 'vendor') return !state.vendors.some(x => x.ruc === row.ruc);
        if (kind === 'item') return !state.items.some(x => x.name === row.name);
        return true;
      });
      if (!filtered.length) continue;
      run({ ...command, data: { ...command.data, rows: filtered as Record<string, unknown>[] } });
      continue;
    }
    if(command.action==='journal'){
      if(state.journalEntries.some(e=>e.reference==='APER-2026'))continue;
      run({...command,data:{...command.data,lines:[
        {accountCode:'1.1.01',debit:12000,credit:0,description:'Aporte inicial de caja',costCenter:''},
        {accountCode:'1.1.02',debit:65000,credit:0,description:'Aporte inicial a bancos',costCenter:''},
        {accountCode:'3.01',debit:0,credit:77000,description:'Capital inicial de laboratorio',costCenter:''},
      ]}});continue;
    }
    run(command);
  }
  for(const item of state.items){if(!state.warehouseStock.some(s=>s.itemCode===item.itemCode && s.warehouseCode==='01')){
    const before=state.journalEntries.length;run(comandoStock(item.itemCode));
    for(const entry of state.journalEntries.slice(before)){entry.memo='Aporte inicial de existencias de laboratorio';for(const line of entry.lines)if(line.accountCode==='4.02')line.accountCode='3.01';}
  }}
  if(!state.profile || !state.items.length || !state.customers.length || !state.vendors.length)throw new Error('No se pudo completar la preparación académica.');
  state.profile.trainingSetupVersion=1;
  return {state,result:uid};
}
