'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { CheckCircle2, Building2, Info } from 'lucide-react';
import { CompanyContext, useCompanyController } from '@/hooks/useCompany';
import type { CompanyCommand } from '@/lib/company-commands';
import type { IntentoPractica } from '@/lib/practice-check';
import type { PantallaConectada } from '@/lib/practica-conectada';
import type { GuiaPractica } from './PracticaValidada';
import { EMPRESA_CURSO } from '@/lib/b1-center-datos';
import PracticeQuery from './PracticeQuery';
import { SALES_MISSIONS } from '@/lib/sales-learning';
import { operationFor } from '@/lib/practice-contract';

// Pantallas reales del Simulador integral (cargadas solo cuando la práctica las necesita).
const cargando = () => <p className="p-4 text-[#4a5b70]">Abriendo la ventana…</p>;
const P = {
  socio: dynamic(() => import('@/components/finix-screens/CompanyPartnerForm'), { loading: cargando }),
  articulo: dynamic(() => import('@/components/finix-screens/ItemMasterForm'), { loading: cargando }),
  documento: dynamic(() => import('@/components/finix-screens/SalesOrderForm'), { loading: cargando }),
  asiento: dynamic(() => import('@/components/finix-screens/JournalEntryForm'), { loading: cargando }),
  activos: dynamic(() => import('@/components/finix-screens/FixedAssetsScreen'), { loading: cargando }),
  bom: dynamic(() => import('@/components/finix-screens/BOMForm'), { loading: cargando }),
  produccion: dynamic(() => import('@/components/finix-screens/ProductionOrderForm'), { loading: cargando }),
  transferencia: dynamic(() => import('@/components/finix-screens/WarehouseTransferForm'), { loading: cargando }),
  conteo: dynamic(() => import('@/components/finix-screens/InventoryCountScreen'), { loading: cargando }),
  precios: dynamic(() => import('@/components/finix-screens/PriceListScreen'), { loading: cargando }),
  descuentos: dynamic(() => import('@/components/finix-screens/VolumeDiscountScreen'), { loading: cargando }),
  bancos: dynamic(() => import('@/components/finix-screens/BankingScreen'), { loading: cargando }),
  empleado: dynamic(() => import('@/components/finix-screens/EmployeeForm'), { loading: cargando }),
  oportunidad: dynamic(() => import('@/components/finix-screens/OpportunitiesScreen'), { loading: cargando }),
  empresa: dynamic(() => import('@/components/finix-screens/CompanySettingsScreen'), { loading: cargando }),
  presupuesto: dynamic(() => import('@/components/finix-screens/BudgetScreen'), { loading: cargando }),
  cierre: dynamic(() => import('@/components/finix-screens/PeriodCloseScreen'), { loading: cargando }),
  importacion: dynamic(() => import('@/components/finix-screens/LandedCostScreen'), { loading: cargando }),
  mrp: dynamic(() => import('@/components/finix-screens/MRPScreen'), { loading: cargando }),
  consultas: dynamic(() => import('@/components/finix-screens/QueryManagerScreen'), { loading: cargando }),
  sri: dynamic(() => import('@/components/finix-screens/SRIElectronicScreen'), { loading: cargando }),
  nomina: dynamic(() => import('@/components/finix-screens/PayrollRunScreen'), { loading: cargando }),
  cierreTributario: dynamic(() => import('@/components/finix-screens/TaxCloseScreen'), { loading: cargando }),
  isd: dynamic(() => import('@/components/finix-screens/ForeignPaymentScreen'), { loading: cargando }),
  // Pantallas nuevas (mod-2 .. mod-24)
  series: dynamic(() => import('@/components/finix-screens/SeriesNumeracionScreen'), { loading: cargando }),
  grupos: dynamic(() => import('@/components/finix-screens/GruposScreen'), { loading: cargando }),
  monedas: dynamic(() => import('@/components/finix-screens/MonedasScreen'), { loading: cargando }),
  costos: dynamic(() => import('@/components/finix-screens/CentroCostesScreen'), { loading: cargando }),
  recursos: dynamic(() => import('@/components/finix-screens/RecursosProduccionScreen'), { loading: cargando }),
  udo: dynamic(() => import('@/components/finix-screens/UDOScreen'), { loading: cargando }),
  cockpit: dynamic(() => import('@/components/finix-screens/CockpitScreen'), { loading: cargando }),
};

function Pantalla({ p }: { p: Exclude<PantallaConectada,{clave:'consultaAcademica'}> }) {
  switch (p.clave) {
    case 'cliente':   return <P.socio />;
    case 'proveedor': return <P.socio vendor />;
    case 'articulo':  return <P.articulo />;
    case 'documento': return <P.documento docType={p.docType} />;
    case 'series':    return <P.series docType={(p as { clave: 'series'; docType?: string }).docType} />;
    case 'grupos':    return <P.grupos tipo={(p as { clave: 'grupos'; tipo: 'cliente' | 'articulo' }).tipo} />;
    case 'recursos':  return <P.recursos tipo={(p as { clave: 'recursos'; tipo?: 'trabajo' | 'maquina' }).tipo} />;
    case 'monedas':   return <P.monedas />;
    case 'costos':    return <P.costos />;
    case 'udo':       return <P.udo />;
    case 'cockpit':   return <P.cockpit />;
    default: { const Comp = P[p.clave as keyof typeof P] as React.ComponentType; return <Comp />; }
  }
}

/**
 * Práctica en la empresa del estudiante: la pantalla real del Simulador guarda en Supabase.
 * La práctica se cumple cuando el motor confirma que la operación quedó registrada.
 */
export default function PracticaConectada({ guia, pantalla, onCompleta }: {
  guia: GuiaPractica; pantalla: PantallaConectada; onCompleta: (intento: IntentoPractica) => void;
}) {
  const c = useCompanyController();
  const [logrado, setLogrado] = useState<string | null>(null);

  // Mismo contexto que usa el Simulador, con el guardado interceptado para saber cuándo se cumplió la misión.
  const valor = useMemo(() => ({
    ...c,
    save: async (command: CompanyCommand) => {
      if(guia.missionId==='mod-ventas-c1#2'&&command.action==='customer'){
        const d=command.data;
        if(d.name!=='Corporación Andina S.A.'||d.ruc!=='1790099001001'||d.creditLimit!==10000||d.paymentTermsDays!==30)throw new Error('Usa los datos de la misión: Corporación Andina S.A., RUC de práctica 1790099001001, límite 10000 y plazo 30 días.');
      }
      const requestId=crypto.randomUUID();
      const resultado = await c.save(command,requestId);
      const mission=guia.missionId?SALES_MISSIONS[guia.missionId]:undefined;
      const expected=mission?.expectedAction?[mission.expectedAction]:operationFor(pantalla);
      const docMatches=!mission?.expectedDocType || (command.action==='sales' && command.data.docType===mission.expectedDocType);
      if (expected.includes(command.action) && docMatches && !logrado) {
        setLogrado(resultado);
        onCompleta({ valores: [`${command.action}:${resultado}`], evidence:{requestId,action:command.action,result:resultado}, intentos: 1, vioSolucion: false, conectada: true });
      }
      return resultado;
    },
  }), [c, logrado, onCompleta,guia.missionId,pantalla]);

  const empresa = c.data.profile?.companyName;
  return (
    <div className="m-2 sm:m-3 rounded-md border border-[#8a9bb0] bg-[#eef1f5] shadow-2xl overflow-hidden text-[#1d2d3e] text-xs">
      <div className="flex items-center gap-2 bg-gradient-to-b from-[#dfe7f1] to-[#c7d4e4] border-b border-[#9fb1c7] px-2 py-1 font-semibold">
        <span className="rounded-sm bg-gradient-to-b from-[#b91c1c] to-[#7f1d1d] px-1.5 text-[10px] font-black italic text-white">Finix</span>
        Finix ERP 2026 — {empresa || EMPRESA_CURSO}
      </div>

      {logrado && (
        <div className="mx-3 mt-2 rounded-sm bg-emerald-50 border border-emerald-400 p-2 text-emerald-800 font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          ¡Guardado en tu empresa! ({logrado}) Continuamos con la clase…
        </div>
      )}

      <CompanyContext.Provider value={valor}>
        <div className="mx-3 mb-3 rounded-sm border border-[#7f93ab] bg-[#ECE9D8] font-[Tahoma,Arial,sans-serif] text-[11px] text-[#222] min-h-[320px]">
          {pantalla.clave==='consultaAcademica'?<PracticeQuery missionId={guia.missionId||''} onCompleta={onCompleta}/>:<Pantalla p={pantalla} />}
        </div>
      </CompanyContext.Provider>
    </div>
  );
}
