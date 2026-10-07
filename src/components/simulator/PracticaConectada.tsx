'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { CheckCircle2, Building2, Info } from 'lucide-react';
import { CompanyContext, useCompanyController } from '@/hooks/useCompany';
import type { CompanyCommand } from '@/lib/company-commands';
import type { IntentoPractica } from '@/lib/practice-check';
import type { PantallaConectada } from '@/lib/practica-conectada';
import type { GuiaPractica } from './PracticaValidada';

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
};

function Pantalla({ p }: { p: PantallaConectada }) {
  switch (p.clave) {
    case 'cliente': return <P.socio />;
    case 'proveedor': return <P.socio vendor />;
    case 'articulo': return <P.articulo />;
    case 'documento': return <P.documento docType={p.docType} />;
    default: { const Comp = P[p.clave]; return <Comp />; }
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
        <span className="rounded-sm bg-gradient-to-b from-[#1f6fc5] to-[#0a3d8f] px-1.5 text-[10px] font-black italic text-white">SAP</span>
        SAP Business One 10.0 — {empresa || 'Mi Empresa'}
      </div>

      {/* Ficha del ejercicio: objetivo, ventana y datos sugeridos (el estudiante puede usar los suyos). */}
      <div className="m-3 rounded-sm border border-[#7f93ab] bg-white px-3 py-2 space-y-1.5">
        <p className="font-bold text-[#0B3D91] flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" aria-hidden="true" /> Práctica en tu empresa: {guia.title}</p>
        {guia.menu_path && <p className="text-[#4a5b70]">En SAP: <strong className="text-[#1d2d3e]">{guia.menu_path}</strong></p>}
        {!!guia.instructions?.length && (
          <ol className="list-decimal pl-4 text-[#1d2d3e] space-y-0.5">{guia.instructions.map((t, i) => <li key={i}>{t}</li>)}</ol>
        )}
        {!!guia.campos?.length && (
          <div className="rounded-sm bg-[#f4f7fb] border border-[#d5dde8] px-2 py-1.5">
            <p className="flex items-center gap-1 text-[#4a5b70] mb-1"><Info className="w-3 h-3" aria-hidden="true" /> Datos sugeridos (puedes usar los tuyos):</p>
            <dl className="grid sm:grid-cols-2 gap-x-4">
              {guia.campos.map((f, i) => <div key={i} className="flex gap-1.5"><dt className="text-[#4a5b70]">{f.etiqueta}:</dt><dd className="font-semibold">{f.valor}</dd></div>)}
            </dl>
          </div>
        )}
        {logrado ? (
          <p role="status" className="flex items-center gap-1.5 font-bold text-emerald-700"><CheckCircle2 className="w-4 h-4" aria-hidden="true" /> ¡Guardado en tu empresa! ({logrado}) Continuamos con la clase…</p>
        ) : (
          <p className="text-[#4a5b70]">La práctica se completa cuando el registro queda guardado en tu empresa.</p>
        )}
      </div>

      <CompanyContext.Provider value={valor}>
        <div className="mx-3 mb-3 rounded-sm border border-[#7f93ab] bg-[#ECE9D8] font-[Tahoma,Arial,sans-serif] text-[11px] text-[#222] min-h-[320px]">
          <Pantalla p={pantalla} />
        </div>
      </CompanyContext.Provider>
    </div>
  );
}
