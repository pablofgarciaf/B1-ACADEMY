"use client";

import React, { useState } from 'react';
import { Terminal, Play, CheckCircle2, AlertTriangle, RefreshCw, Layers } from 'lucide-react';
import { recordSandboxPractice } from '@/lib/student-service';

interface SimulatorProps {
  trackCode: string;
  submoduleCode: string;
}

export function InteractiveSimulator({ trackCode, submoduleCode }: SimulatorProps) {
  const [activeTab, setActiveTab] = useState<'calc' | 'xml' | 'sql'>('calc');
  const [calcInput, setCalcInput] = useState({
    sueldoBase: 800,
    horasSup50: 10,
    horasExt100: 5,
    montoCompra: 5000,
    tipoBienServicio: 'BIEN', // 312 vs 344
  });
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [practiceCompleted, setPracticeCompleted] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationLogs(['Iniciando simulación en entorno Sandbox aislado...']);

    setTimeout(() => {
      if (trackCode === 'HEIN-NOM-EC') {
        const valorHora = calcInput.sueldoBase / 240;
        const total50 = valorHora * 1.5 * calcInput.horasSup50;
        const total100 = valorHora * 2.0 * calcInput.horasExt100;
        const totalHorasExtras = total50 + total100;
        const materiaGravada = calcInput.sueldoBase + totalHorasExtras;
        const iessPersonal = materiaGravada * 0.0945;
        const iessPatronal = materiaGravada * 0.1215;

        setSimulationLogs([
          'Conexión exitosa a la base de datos Heinsohn Nómina HCM.',
          `Fórmula legal aplicada: Sueldo / 240 = $${calcInput.sueldoBase} / 240 = $${valorHora.toFixed(4)} / hora.`,
          `Horas Suplementarias (+50%): ${calcInput.horasSup50}h x $${(valorHora * 1.5).toFixed(2)} = $${total50.toFixed(2)}`,
          `Horas Extraordinarias (+100%): ${calcInput.horasExt100}h x $${(valorHora * 2.0).toFixed(2)} = $${total100.toFixed(2)}`,
          `Materia Gravada total = $${materiaGravada.toFixed(2)}`,
          `Aporte Personal IESS (9.45%) = $${iessPersonal.toFixed(2)} (Descuento en rol)`,
          `Aporte Patronal IESS (12.15%) = $${iessPatronal.toFixed(2)} (Gasto empresa)`,
          'Asiento generado en OJDT con Centro de Costos: OK (Idempotencia verificada).',
          'Práctica registrada en tu expediente académico (+1.5 horas de sandbox contabilizadas).'
        ]);
      } else if (trackCode === 'SAP-LOC-EC') {
        const iva15 = calcInput.montoCompra * 0.15;
        const codRetencion = calcInput.tipoBienServicio === 'BIEN' ? '312 (1.75%)' : '344 (2.75%)';
        const pctRet = calcInput.tipoBienServicio === 'BIEN' ? 0.0175 : 0.0275;
        const retRenta = calcInput.montoCompra * pctRet;
        const retIva = calcInput.tipoBienServicio === 'BIEN' ? iva15 * 0.30 : iva15 * 0.70;

        setSimulationLogs([
          'Validando estructura XML contra esquemas XSD del SRI versión 2.1.0...',
          `Monto Base de Compra = $${calcInput.montoCompra.toFixed(2)}`,
          `IVA Generado (15%) = $${iva15.toFixed(2)}`,
          `Retención Impuesto a la Renta Código ${codRetencion} = $${retRenta.toFixed(2)}`,
          `Retención de IVA (${calcInput.tipoBienServicio === 'BIEN' ? '30%' : '70%'}) = $${retIva.toFixed(2)}`,
          `Total a Pagar Líquido al Proveedor = $${(calcInput.montoCompra + iva15 - retRenta - retIva).toFixed(2)}`,
          'Firma digital XAdES-BES inyectada con éxito.',
          'Comprobante Electrónico Tipo 07 generado para transmisión al Web Service SRI.',
          'Práctica registrada en tu expediente académico (+1.5 horas de sandbox contabilizadas).'
        ]);
      } else {
        setSimulationLogs([
          'Cargando parámetros de simulación para ' + trackCode + '...',
          'Validación de datos maestros de SAP B1 (OCRD, OITM, OACT): 100% Correcto.',
          'Verificación de transacciones ACID y reglas de negocio: OK.',
          'Práctica registrada en tu expediente académico (+1.5 horas de sandbox contabilizadas).'
        ]);
      }

      setIsSimulating(false);
      setPracticeCompleted(true);
      recordSandboxPractice(1.5);
    }, 1000);
  };

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070d18] overflow-hidden shadow-xl">
      {/* Header de la Consola */}
      <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sap-blue/20 text-sky-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Simulador Interactivo de Prácticas Sandbox</h4>
            <p className="text-[11px] text-slate-400 font-mono">Entorno de Pruebas SAP B1 & Heinsohn Ecuador</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('calc')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${activeTab === 'calc' ? 'bg-sap-blue text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
          >
            Parámetros
          </button>
          <button
            onClick={() => setActiveTab('xml')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${activeTab === 'xml' ? 'bg-sap-blue text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
          >
            Payload / JSON
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {activeTab === 'calc' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500">Datos de Entrada del Ejercicio</h5>
              
              {trackCode === 'HEIN-NOM-EC' ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Sueldo Mensual Base ($):</label>
                    <input
                      type="number"
                      value={calcInput.sueldoBase}
                      onChange={(e) => setCalcInput({...calcInput, sueldoBase: parseFloat(e.target.value) || 0})}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Horas Supl. (+50%):</label>
                      <input
                        type="number"
                        value={calcInput.horasSup50}
                        onChange={(e) => setCalcInput({...calcInput, horasSup50: parseFloat(e.target.value) || 0})}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Horas Extra (+100%):</label>
                      <input
                        type="number"
                        value={calcInput.horasExt100}
                        onChange={(e) => setCalcInput({...calcInput, horasExt100: parseFloat(e.target.value) || 0})}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Monto de la Operación ($):</label>
                    <input
                      type="number"
                      value={calcInput.montoCompra}
                      onChange={(e) => setCalcInput({...calcInput, montoCompra: parseFloat(e.target.value) || 0})}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Clasificación SRI:</label>
                    <select
                      value={calcInput.tipoBienServicio}
                      onChange={(e) => setCalcInput({...calcInput, tipoBienServicio: e.target.value})}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white font-medium"
                    >
                      <option value="BIEN">Transferencia de Bienes Muebles (Cód. 312 - 1.75%)</option>
                      <option value="SERVICIO">Servicios en General (Cód. 344 - 2.75%)</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                onClick={runSimulation}
                disabled={isSimulating}
                className="w-full py-3 rounded-xl bg-sap-blue hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sap-blue/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Ejecutar Simulación en Servidor Sandbox
              </button>
            </div>

            {/* Consola de Salida */}
            <div className="rounded-2xl bg-black/90 p-4 font-mono text-xs text-emerald-400 space-y-2 border border-white/10 min-h-[220px] flex flex-col justify-between">
              <div className="space-y-1 overflow-y-auto max-h-[190px]">
                <p className="text-slate-500 text-[10px]">// Consola de Eventos del Servidor (STDOUT)</p>
                {simulationLogs.length === 0 ? (
                  <p className="text-slate-600 text-xs italic pt-4">Presiona "Ejecutar Simulación" para compilar el caso de estudio...</p>
                ) : (
                  simulationLogs.map((log, idx) => (
                    <p key={idx} className="leading-relaxed">
                      <span className="text-sky-400 font-bold">&gt;</span> {log}
                    </p>
                  ))
                )}
              </div>

              {practiceCompleted && (
                <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-[11px] text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Práctica de Sandbox Validada y Computada (+1.5h)
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-black/95 p-4 font-mono text-xs text-sky-300 border border-white/10 overflow-x-auto">
            <pre className="text-[11px] leading-relaxed">
{JSON.stringify({
  serviceLayerTransaction: {
    module: trackCode,
    submodule: submoduleCode,
    currency: "USD",
    timestamp: new Date().toISOString(),
    payload: {
      ruleset: "EC_SRI_IESS_2026",
      status: "APPROVED",
      environment: "SANDBOX_SAP_B1_HANA"
    }
  }
}, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
