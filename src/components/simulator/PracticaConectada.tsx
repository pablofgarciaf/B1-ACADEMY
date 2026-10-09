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

// Pantallas reales del Simulador integral (cargadas solo cuando la práctica las necesita).
const cargando = () => <p className="p-4 text-[#4a5b70]">Abriendo la ventana…</p>;
const P = {
  socio: dynamic(() => import('@/components/sap-screens/CompanyPartnerForm'), { loading: cargando }),
  articulo: dynamic(() => import('@/components/sap-screens/ItemMasterForm'), { loading: cargando }),
  documento: dynamic(() => import('@/components/sap-screens/SalesOrderForm'), { loading: cargando }),
  asiento: dynamic(() => import('@/components/sap-screens/JournalEntryForm'), { loading: cargando }),
  activos: dynamic(() => import('@/components/sap-screens/FixedAssetsScreen'), { loading: cargando }),
  bom: dynamic(() => import('@/components/sap-screens/BOMForm'), { loading: cargando }),
  produccion: dynamic(() => import('@/components/sap-screens/ProductionOrderForm'), { loading: cargando }),
  transferencia: dynamic(() => import('@/components/sap-screens/WarehouseTransferForm'), { loading: cargando }),
  conteo: dynamic(() => import('@/components/sap-screens/InventoryCountScreen'), { loading: cargando }),
  precios: dynamic(() => import('@/components/sap-screens/PriceListScreen'), { loading: cargando }),
  descuentos: dynamic(() => import('@/components/sap-screens/VolumeDiscountScreen'), { loading: cargando }),
  bancos: dynamic(() => import('@/components/sap-screens/BankingScreen'), { loading: cargando }),
  empleado: dynamic(() => import('@/components/sap-screens/EmployeeForm'), { loading: cargando }),
  oportunidad: dynamic(() => import('@/components/sap-screens/OpportunitiesScreen'), { loading: cargando }),
  empresa: dynamic(() => import('@/components/sap-screens/CompanySettingsScreen'), { loading: cargando }),
  presupuesto: dynamic(() => import('@/components/sap-screens/BudgetScreen'), { loading: cargando }),
  cierre: dynamic(() => import('@/components/sap-screens/PeriodCloseScreen'), { loading: cargando }),
  importacion: dynamic(() => import('@/components/sap-screens/LandedCostScreen'), { loading: cargando }),
  mrp: dynamic(() => import('@/components/sap-screens/MRPScreen'), { loading: cargando }),
  consultas: dynamic(() => import('@/components/sap-screens/QueryManagerScreen'), { loading: cargando }),
  sri: dynamic(() => import('@/components/sap-screens/SRIElectronicScreen'), { loading: cargando }),
  nomina: dynamic(() => import('@/components/sap-screens/PayrollRunScreen'), { loading: cargando }),
  cierreTributario: dynamic(() => import('@/components/sap-screens/TaxCloseScreen'), { loading: cargando }),
  isd: dynamic(() => import('@/components/sap-screens/ForeignPaymentScreen'), { loading: cargando }),
  // Pantallas nuevas (mod-2 .. mod-24)
  series: dynamic(() => import('@/components/sap-screens/SeriesNumeracionScreen'), { loading: cargando }),
  grupos: dynamic(() => import('@/components/sap-screens/GruposScreen'), { loading: cargando }),
  monedas: dynamic(() => import('@/components/sap-screens/MonedasScreen'), { loading: cargando }),
  costos: dynamic(() => import('@/components/sap-screens/CentroCostesScreen'), { loading: cargando }),
  recursos: dynamic(() => import('@/components/sap-screens/RecursosProduccionScreen'), { loading: cargando }),
  udo: dynamic(() => import('@/components/sap-screens/UDOScreen'), { loading: cargando }),
  cockpit: dynamic(() => import('@/components/sap-screens/CockpitScreen'), { loading: cargando }),
};

function Pantalla({ p }: { p: PantallaConectada }) {
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
      const resultado = await c.save(command);
      if (command.action !== 'access' && !logrado) {
        setLogrado(resultado);
        setTimeout(() => onCompleta({ valores: [`${command.action}:${resultado}`], intentos: 1, vioSolucion: false, conectada: true }), 2200);
      }
      return resultado;
    },
  }), [c, logrado, onCompleta]);

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
          <Pantalla p={pantalla} />
        </div>
      </CompanyContext.Provider>
    </div>
  );
}
