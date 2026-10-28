'use client';
import { useMemo, useRef, useState, useEffect, type ComponentType } from 'react';
import dynamic from 'next/dynamic';
import { FinixUIThemeContext, type FinixUITheme } from '@/components/finix-screens/FinixControls';
import { CompanyContext, type CompanyContextValue } from '@/hooks/useCompany';
import { createManualSandbox, runManualCommand } from '@/lib/manual-sandbox';
import { MANUAL_LABS, manualLabKey } from '@/lib/manual-labs';
import type { CompanyCommand } from '@/lib/company-commands';
const loading=()=> <p className="p-4">Preparando el laboratorio…</p>;
const screens:Record<string,ComponentType>={
 cockpit:dynamic(()=>import('@/components/finix-screens/CockpitScreen'),{loading}),
 customer:dynamic(()=>import('@/components/finix-screens/CompanyPartnerForm'),{loading}),
 item:dynamic(()=>import('@/components/finix-screens/ItemMasterForm'),{loading}),

 prices:dynamic(()=>import('@/components/finix-screens/PriceListScreen'),{loading}),
 discounts:dynamic(()=>import('@/components/finix-screens/VolumeDiscountScreen'),{loading}),
 transfer:dynamic(()=>import('@/components/finix-screens/WarehouseTransferForm'),{loading}),
 count:dynamic(()=>import('@/components/finix-screens/InventoryCountScreen'),{loading}),
 bom:dynamic(()=>import('@/components/finix-screens/BOMForm'),{loading}),
 production:dynamic(()=>import('@/components/finix-screens/ProductionOrderForm'),{loading}),
 resources:dynamic(()=>import('@/components/finix-screens/RecursosProduccionScreen'),{loading}),
 capacity:dynamic(()=>import('@/components/finix-screens/AdminProductionScreens').then(m=>m.CapacityScreen),{loading}),
 routing:dynamic(()=>import('@/components/finix-screens/AdminProductionScreens').then(m=>m.RoutingScreen),{loading}),
 users:dynamic(()=>import('@/components/finix-screens/AdminProductionScreens').then(m=>m.TeamUsersScreen),{loading}),
 verification:dynamic(()=>import('@/components/finix-screens/AdminProductionScreens').then(m=>m.DataVerificationScreen),{loading}),
 projects:dynamic(()=>import('@/components/finix-screens/ServiceScreens').then(m=>m.ProjectsScreen),{loading}),
 service:dynamic(()=>import('@/components/finix-screens/ServiceScreens').then(m=>m.ServiceCallsScreen),{loading}),
 opportunity:dynamic(()=>import('@/components/finix-screens/OpportunitiesScreen'),{loading}),
 mrp:dynamic(()=>import('@/components/finix-screens/MRPScreen'),{loading}),
 landed:dynamic(()=>import('@/components/finix-screens/LandedCostScreen'),{loading}),
 accounts:dynamic(()=>import('@/components/finix-screens/ChartOfAccountsScreen'),{loading}),
 journal:dynamic(()=>import('@/components/finix-screens/JournalEntryForm'),{loading}),
 currency:dynamic(()=>import('@/components/finix-screens/MonedasScreen'),{loading}),
 financial:dynamic(()=>import('@/components/finix-screens/FinancialStatementsScreen'),{loading}),
 cashflow:dynamic(()=>import('@/components/finix-screens/CashFlowScreen'),{loading}),
 aging:dynamic(()=>import('@/components/finix-screens/AgingScreen'),{loading}),
 bank:dynamic(()=>import('@/components/finix-screens/BankingScreen'),{loading}),
 period:dynamic(()=>import('@/components/finix-screens/PeriodCloseScreen'),{loading}),
 assets:dynamic(()=>import('@/components/finix-screens/FixedAssetsScreen'),{loading}),
 budget:dynamic(()=>import('@/components/finix-screens/BudgetScreen'),{loading}),
 costs:dynamic(()=>import('@/components/finix-screens/CentroCostesScreen'),{loading}),
 settings:dynamic(()=>import('@/components/finix-screens/CompanySettingsScreen'),{loading}),
 opening:dynamic(()=>import('@/components/finix-screens/OpeningBalancesPanel'),{loading}),
 import:dynamic(()=>import('@/components/finix-screens/DataTransferScreen'),{loading}),
 series:dynamic(()=>import('@/components/finix-screens/SeriesNumeracionScreen'),{loading}),
 print:dynamic(()=>import('@/components/finix-screens/PrintLayoutScreen'),{loading}),
 approvals:dynamic(()=>import('@/components/finix-screens/ApprovalsScreen'),{loading}),
 udo:dynamic(()=>import('@/components/finix-screens/UDOScreen'),{loading}),
 revaluation:dynamic(()=>import('@/components/finix-screens/StockRevaluationScreen'),{loading}),
 returns:dynamic(()=>import('@/components/finix-screens/PurchaseReturnScreen'),{loading}),
};
const Document=dynamic(()=>import('@/components/finix-screens/SalesOrderForm'),{loading});
const Groups=dynamic(()=>import('@/components/finix-screens/GruposScreen'),{loading});
const Query=dynamic(()=>import('@/components/finix-screens/QueryManagerScreen'),{loading});
const docs=['order','invoice','credit_note','purchase_order','purchase_request','goods_receipt','vendor_invoice'] as const;
export default function ManualSandbox({manualId}:{manualId:string}){
 const [data,setData]=useState(createManualSandbox);
 const state=useRef(data);
 const [generation,setGeneration]=useState(0);
 const [error,setError]=useState('');const [notice,setNotice]=useState('');
 const [viewMode, setViewMode] = useState<FinixUITheme>('fiori');

 useEffect(() => {
   const saved = typeof window !== 'undefined' ? localStorage.getItem('finix_view_mode') : null;
   if (saved === 'classic' || saved === 'fiori') setViewMode(saved);
   const handler = (e: StorageEvent) => {
     if (e.key === 'finix_view_mode' && (e.newValue === 'classic' || e.newValue === 'fiori')) {
       setViewMode(e.newValue);
     }
   };
   window.addEventListener('storage', handler);
   return () => window.removeEventListener('storage', handler);
 }, []);
 const screen=MANUAL_LABS[manualLabKey(manualId)];
 const context=useMemo<CompanyContextValue>(()=>({data,ephemeral:true,loading:false,saving:false,error,notice,refresh:async()=>{},save:async(command:CompanyCommand)=>{
   try{const result=runManualCommand(state.current,command);state.current=result.state;setData(result.state);setError('');setNotice('Resultado aplicado únicamente a esta demostración: '+result.result);return result.result;}
   catch(e){const message=e instanceof Error?e.message:'No se pudo ejecutar el ejercicio.';setError(message);throw e;}
 }}),[data,error,notice]);
 if(!screen)return null;
 const Component=screens[screen];const doc=docs.find(d=>d===screen);
 return <section className="space-y-2">
  <p className="text-xs text-amber-200">Laboratorio temporal: puedes cambiar los datos y observar resultados. No se guarda en tu empresa, tu cuenta ni tu progreso. Al salir se descarta.</p>
  <div className="flex flex-wrap items-center justify-between gap-2">
    <button type="button" className="rounded border border-slate-600 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 transition-colors" onClick={()=>{const fresh=createManualSandbox();state.current=fresh;setData(fresh);setGeneration(n=>n+1);setError('');setNotice('Datos de demostración reiniciados.');}}>Reiniciar datos de muestra</button>
    <button
      type="button"
      onClick={() => {
        const next = viewMode === 'fiori' ? 'classic' : 'fiori';
        setViewMode(next);
        localStorage.setItem('finix_view_mode', next);
        window.dispatchEvent(new StorageEvent('storage', { key: 'finix_view_mode', newValue: next }));
      }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs ${
        viewMode === 'fiori'
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/20'
          : 'bg-slate-700 text-slate-200 border border-slate-600'
      }`}
      title="Alternar entre interfaz moderna Fiori Horizon y clásica SAP B1"
    >
      {viewMode === 'fiori' ? '✨ Modo Fiori (Activo)' : '💻 Modo Clásico SAP'}
    </button>
  </div>
  {screen==='credit_note'&&<p className="text-sm text-slate-300">Esta práctica reproduce una devolución completa con retorno al inventario. Selecciona la factura ficticia en «Copiar de documento base». Los abonos parciales y sin contabilización de cantidad del manual todavía no están disponibles en este laboratorio.</p>}
  <CompanyContext.Provider value={context}>
    <FinixUIThemeContext.Provider value={viewMode}>
      <div key={generation} className={`rounded p-2 text-slate-950 overflow-x-auto ${viewMode === 'fiori' ? 'finix-fiori-mode bg-transparent' : 'bg-[#ECE9D8]'}`}>
        {doc?<Document key={screen} docType={doc}/>:screen==='groups'?<Groups tipo="articulo"/>:screen==='query'?<Query persistQueries={false}/>:Component?<Component/>:null}
      </div>
    </FinixUIThemeContext.Provider>
  </CompanyContext.Provider>
  {error&&<p role="alert" className="text-sm text-red-300">{error}</p>}{notice&&<p role="status" className="text-sm text-emerald-300">{notice}</p>}
 </section>;
}
