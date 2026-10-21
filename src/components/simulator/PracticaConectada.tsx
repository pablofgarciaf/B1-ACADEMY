'use client';
import { accountingPracticeGuidance } from '@/lib/accounting-practice-guidance';

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
  revalorizacionStock: dynamic(() => import('@/components/finix-screens/StockRevaluationScreen'), { loading: cargando }),
  devolucionCompra: dynamic(() => import('@/components/finix-screens/PurchaseReturnScreen'), { loading: cargando }),
  ubicacion: dynamic(() => import('@/components/finix-screens/BinWeightScreen'), { loading: cargando }),
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
  apertura: dynamic(() => import('@/components/finix-screens/TrainingOpeningScreen'), { loading: cargando }),
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
  const [pendingEvidence,setPendingEvidence]=useState<IntentoPractica | null>(null);

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
        setPendingEvidence({ valores: [`${command.action}:${resultado}`], evidence:{requestId,action:command.action,result:resultado}, intentos: 1, vioSolucion: false, conectada: true });
      }
      return resultado;
    },
  }), [c, logrado,guia.missionId,pantalla]);

  const empresa = c.data.profile?.companyName;
  return (
    <div className="m-2 sm:m-3 rounded-md border border-[#8a9bb0] bg-[#eef1f5] shadow-2xl overflow-hidden text-[#1d2d3e] text-xs">
      <div className="flex items-center justify-between bg-gradient-to-b from-[#dfe7f1] to-[#c7d4e4] border-b border-[#9fb1c7] px-2.5 py-1 font-semibold">
        <div className="flex items-center gap-2">
          <span className="rounded-sm bg-[#003366] px-1.5 text-[10px] font-black text-white">SAP B1</span>
          <span>Laboratorio de práctica equivalente — {empresa || EMPRESA_CURSO}</span>
        </div>
        <span className="text-[10px] text-gray-600 hidden sm:inline">Modo Laboratorio Transaccional</span>
      </div>

      {/* Panel Pedagógico: Misión, Ruta SAP y Datos requeridos */}
      <div className="mx-2 sm:mx-3 mt-2 rounded border border-[#b8cce2] bg-gradient-to-b from-[#f0f6fc] to-[#e4eef9] p-3 text-[#1c3654] space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-1 border-b border-[#c8d9eb] pb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🎯</span>
            <span className="font-bold text-xs text-[#003366]">{guia.title || 'Misión Práctica en SAP Business One'}</span>
          </div>
          {guia.menu_path && (
            <span className="text-[10.5px] font-medium text-[#4a6b8e] bg-white/80 px-2 py-0.5 rounded border border-[#c4d6ea]">
              Ruta: <strong>{guia.menu_path}</strong>
            </span>
          )}
        </div>

        {/* Pasos a seguir */}
        {accountingPracticeGuidance(guia.missionId)&&<p className="rounded border border-blue-200 bg-white p-2 text-xs"><strong>En este laboratorio: </strong>{accountingPracticeGuidance(guia.missionId)}</p>}
        {guia.instructions && guia.instructions.length > 0 && (
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-[#003366] uppercase tracking-wider block">
              📋 Pasos para completar esta misión:
            </span>
            <ol className="grid sm:grid-cols-2 gap-x-3 gap-y-1 bg-white/80 p-2 rounded border border-[#c4d6ea]">
              {guia.instructions.map((ins, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-[11px] text-[#1c3654] leading-tight">
                  <span className="shrink-0 w-4 h-4 rounded-full bg-[#0055A5] text-white text-[9.5px] font-bold flex items-center justify-center mt-0.5 shadow-2xs">
                    {idx + 1}
                  </span>
                  <span>{ins}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Ficha de datos requeridos si existen campos */}
        {guia.campos && guia.campos.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-extrabold text-[#003366] uppercase tracking-wider">
                🏷️ Datos clave del ejercicio:
              </span>
              <span className="text-[9.5px] text-[#4a6b8e]">
                💡 Tip: ingresa los valores tal como se indican
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
              {guia.campos.map((c, i) => (
                <div key={i} className="px-2 py-1 rounded bg-white border border-[#b8cce2] shadow-2xs flex flex-col justify-between">
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-[9.5px] font-bold text-[#004b91] uppercase tracking-wide truncate">
                      {c.etiqueta}
                    </span>
                    <span className="text-[11px] font-bold text-gray-900 font-mono select-all truncate">
                      {c.valor}
                    </span>
                  </div>
                  {c.pista && (
                    <span className="text-[9px] text-[#55708e] leading-tight mt-0.5 italic truncate" title={c.pista}>
                      {c.pista}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {pendingEvidence && !logrado && <div className="mx-3 mt-2 rounded border border-sky-400 bg-sky-50 p-3"><p>La operación está guardada en tu empresa educativa. Termina los pasos de la misión antes de comprobarla.</p><button type="button" disabled={c.saving} className="mt-2 rounded bg-sky-800 px-3 py-2 font-bold text-white disabled:opacity-50" onClick={()=>{setLogrado(pendingEvidence.evidence?.result??'registrada');onCompleta(pendingEvidence);}}>Comprobar práctica</button></div>}
      {logrado && (
        <div className="mx-2 sm:mx-3 mt-2 rounded-sm bg-emerald-50 border border-emerald-400 p-2 text-emerald-800 font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          Operación guardada ({logrado}). Comprobando los datos de la práctica…
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
