"use client";

import React, { useState } from 'react';
import { 
  Monitor, 
  HelpCircle, 
  Check, 
  AlertCircle, 
  Info, 
  Calculator, 
  ArrowRight,
  Sparkles,
  Maximize2,
  FolderOpen
} from 'lucide-react';

interface SimulatedWindowProps {
  systemType: 'SAP_B1' | 'HEIN_NOMINA';
  windowTitle: string;
  transactionCode: string;
  screenSummary: string;
  interactiveFields: {
    label: string;
    value: string;
    helperExplanation: string;
    isMandatory?: boolean;
  }[];
  workedExample: {
    title: string;
    stepByStepMath: string[];
    accountingJournalEntry: {
      account: string;
      debe?: number;
      haber?: number;
    }[];
  };
}

export function VisualScreenSimulator({
  systemType,
  windowTitle,
  transactionCode,
  screenSummary,
  interactiveFields,
  workedExample
}: SimulatedWindowProps) {
  const [selectedField, setSelectedField] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState(true);

  return (
    <div className="space-y-6">
      {/* VENTANA SIMULADA DEL SOFTWARE (SAP GUI / HEINSOHN HCM) */}
      <div className="rounded-3xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#0c1424] shadow-2xl overflow-hidden font-sans">
        {/* Barra de Título del Sistema Operativo / ERP */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white px-4 py-2.5 flex items-center justify-between text-xs border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span className="font-mono font-bold text-sky-400 ml-2">
              [{systemType === 'SAP_B1' ? 'SAP Business One 10.0 FP 2305' : 'Heinsohn Nómina HCM v2026'}]
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-medium text-slate-200">{windowTitle}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-[11px] text-amber-300">
              Tx: {transactionCode}
            </span>
            <span className="text-slate-400 text-[11px]">Sociedad: DISTRIBUIDORA_EC</span>
          </div>
        </div>

        {/* Barra de Menús del ERP */}
        <div className="bg-slate-200 dark:bg-slate-800/80 px-4 py-1.5 flex gap-4 text-[11px] text-slate-600 dark:text-slate-300 border-b border-slate-300 dark:border-slate-700 select-none">
          <span className="hover:text-sap-blue cursor-pointer">Archivo</span>
          <span className="hover:text-sap-blue cursor-pointer">Edición</span>
          <span className="hover:text-sap-blue cursor-pointer">Datos</span>
          <span className="hover:text-sap-blue cursor-pointer">Ir a</span>
          <span className="hover:text-sap-blue cursor-pointer">Herramientas</span>
          <span className="hover:text-sap-blue cursor-pointer">Ventana</span>
          <span className="hover:text-sap-blue cursor-pointer">Ayuda</span>
        </div>

        {/* Contenido Visual de la Pantalla */}
        <div className="p-6 space-y-6">
          <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/20 border border-sky-500/20 flex items-start gap-3">
            <Info className="w-4 h-4 text-sap-blue shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-900 dark:text-white">¿Qué hace esta pantalla en el mundo real?</strong>{' '}
              {screenSummary}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulario Interactivo Simulando la Pantalla */}
            <div className="p-5 rounded-2xl bg-white dark:bg-black/30 border border-slate-300/80 dark:border-white/10 space-y-3.5 shadow-inner">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Campos de la Transacción (Haz clic en cada uno para entenderlo)
                </span>
              </div>

              <div className="space-y-3">
                {interactiveFields.map((field, idx) => {
                  const isSelected = selectedField === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedField(idx)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-sap-blue bg-sap-blue/10 dark:bg-sap-blue/20 ring-1 ring-sap-blue'
                          : 'border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer">
                          {field.label}
                          {field.isMandatory && <span className="text-rose-500 font-bold">*</span>}
                        </label>
                        <span className="font-mono text-xs font-bold text-sap-blue dark:text-sky-300 bg-white dark:bg-black/40 px-2 py-0.5 rounded border border-slate-200 dark:border-white/10">
                          {field.value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Panel de Ayuda del Consultor Senior para el Campo Seleccionado */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  Explicación del Campo: {interactiveFields[selectedField]?.label}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {interactiveFields[selectedField]?.helperExplanation}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-400 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Tip Consultor: Configurar este campo de forma errada puede ocasionar rechazos del SRI o descuadres de nómina.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CASO PRÁCTICO RESUELTO PASO A PASO CON NÚMEROS REALES */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              {workedExample.title}
            </h3>
            <p className="text-xs text-slate-500">
              Ejemplo numérico detallado paso a paso con su correspondiente asiento en el libro diario.
            </p>
          </div>
        </div>

        {/* Matemáticas y Fórmulas Explicadas */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Procedimiento Matemático y Legal:
          </h4>
          <div className="space-y-2">
            {workedExample.stepByStepMath.map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed"
              >
                <span className="text-sap-blue font-bold mr-2">[{idx + 1}]</span>
                {step}
              </div>
            ))}
          </div>
        </div>

        {/* Asiento Contable Generado en SAP B1 */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Asiento Contable en SAP Business One (Tabla OJDT / JDT1):
          </h4>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="p-3">Cuenta Contable</th>
                  <th className="p-3 text-right">Debe ($)</th>
                  <th className="p-3 text-right">Haber ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {workedExample.accountingJournalEntry.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                    <td className="p-3 text-slate-800 dark:text-slate-200">{row.account}</td>
                    <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {row.debe !== undefined ? `$${row.debe.toFixed(2)}` : '-'}
                    </td>
                    <td className="p-3 text-right font-bold text-sky-600 dark:text-sky-400">
                      {row.haber !== undefined ? `$${row.haber.toFixed(2)}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
