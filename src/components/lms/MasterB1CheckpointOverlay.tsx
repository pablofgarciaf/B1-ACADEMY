"use client";

import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Play, 
  Wrench, 
  CheckCircle2, 
  AlertCircle, 
  Volume2, 
  VolumeX, 
  Compass, 
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { StepGuide } from '@/components/site/ManualViewer';
import { ManualSimulatorConfig } from '@/lib/manual-simulator-registry';
import { useAcademyVoice } from '@/hooks/useAcademyVoice';

interface MasterB1CheckpointOverlayProps {
  isOpen: boolean;
  manualTitle: string;
  slideIndex: number;
  stepGuide?: StepGuide;
  simConfig?: ManualSimulatorConfig;
  onOpenSimulator: () => void;
  onValidateAndResume: () => void;
}

export default function MasterB1CheckpointOverlay({
  isOpen,
  manualTitle,
  slideIndex,
  stepGuide,
  simConfig,
  onOpenSimulator,
  onValidateAndResume
}: MasterB1CheckpointOverlayProps) {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState(false);
  // Voz oficial de la academia (Jorge), la misma de los videos de los manuales.
  const { isSpeaking, speakText, stopSpeaking } = useAcademyVoice();

  const guideTitle = stepGuide?.title || simConfig?.scenarioGoal || 'Práctica interactiva en el Simulador SAP B1';
  const menuPath = stepGuide?.menu_path || simConfig?.moduleName || 'Módulo de Operación';

  const speakInstruction = React.useCallback(() => {
    if (!audioEnabled) return;
    speakText(`¡Atención! Soy Master B1, tu profesor virtual. Hemos pausado la clase en la diapositiva ${slideIndex}. Para continuar, abre el simulador de SAP y realiza la siguiente actividad: ${guideTitle}. Revisa la ruta en el menú: ${menuPath}.`);
  }, [audioEnabled, slideIndex, guideTitle, menuPath, speakText]);

  useEffect(() => {
    if (isOpen) {
      setValidationSuccess(false);
      const timer = setTimeout(() => {
        if (audioEnabled) speakInstruction();
      }, 500);
      return () => {
        clearTimeout(timer);
        stopSpeaking();
      };
    }
  }, [isOpen, slideIndex, audioEnabled, speakInstruction, stopSpeaking]);

  const handleValidate = () => {
    setIsValidating(true);
    stopSpeaking();

    setTimeout(() => {
      setIsValidating(false);
      setValidationSuccess(true);
      setTimeout(() => {
        onValidateAndResume();
      }, 1000);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl rounded-2xl border border-amber-500/40 bg-[#131a20] p-5 sm:p-6 shadow-2xl text-left">
        {/* Header con Avatar de Master B1 */}
        <div className="flex items-start justify-between gap-3 border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg ring-2 ring-amber-400/30">
              <Bot size={26} />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-[#131a20]">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">Master B1</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                  <Sparkles size={10} /> Profesor IA
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Pausa pedagógica estricta • Diapositiva {slideIndex}
              </p>
            </div>
          </div>

          {/* Toggle de Audio */}
          <button
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              setAudioEnabled(!audioEnabled);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-300 hover:text-white transition-colors active:scale-95"
            title={audioEnabled ? "Silenciar voz del profesor" : "Activar voz del profesor"}
          >
            {audioEnabled ? <Volume2 size={16} className={isSpeaking ? "text-amber-400 animate-pulse" : ""} /> : <VolumeX size={16} />}
          </button>
        </div>

        {/* Mensaje de Master B1 */}
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
            <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed">
              &ldquo;¡Alto ahí! La mejor manera de dominar SAP Business One es practicando en caliente. 
              He detenido el video para que ejecutes la transacción en el simulador interactivo antes de seguir.&rdquo;
            </p>
          </div>

          {/* Caja del Reto Práctico */}
          <div className="rounded-xl border border-gray-800 bg-[#1a232b] p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
              <Compass size={14} className="shrink-0" />
              <span className="truncate">Ruta en SAP: {menuPath}</span>
            </div>
            
            <h4 className="text-sm font-semibold text-white">
              {guideTitle}
            </h4>

            {stepGuide?.instructions && stepGuide.instructions.length > 0 && (
              <ul className="space-y-1.5 pt-1 text-xs text-gray-300">
                {stepGuide.instructions.map((inst, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-[10px] font-bold text-blue-300 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            )}

            {stepGuide?.expected_output && (
              <div className="mt-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 p-2.5 text-[11px] text-emerald-300 flex items-start gap-1.5">
                <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-emerald-400" />
                <span><strong>Resultado Esperado:</strong> {stepGuide.expected_output}</span>
              </div>
            )}
          </div>
        </div>

        {/* Botones de Acción Obligatoria */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
          <button
            onClick={onOpenSimulator}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 text-xs font-bold shadow-lg transition-all active:scale-95"
          >
            <Wrench size={14} />
            <span>Abrir Simulador SAP</span>
          </button>

          <button
            onClick={handleValidate}
            disabled={isValidating || validationSuccess}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all shadow-lg active:scale-95 ${
              validationSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold'
            }`}
          >
            {isValidating ? (
              <>
                <div className="h-3.5 w-3.5 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
                <span>Validando con Master B1...</span>
              </>
            ) : validationSuccess ? (
              <>
                <CheckCircle2 size={15} />
                <span>¡Excelente! Reanudando...</span>
              </>
            ) : (
              <>
                <Play size={14} className="fill-current" />
                <span>Validar & Continuar Video</span>
              </>
            )}
          </button>
        </div>

        <p className="mt-3 text-[10px] text-center text-gray-500">
          Modo Estricto de Aprendizaje • El video continuará una vez validada la práctica operativa.
        </p>
      </div>
    </div>
  );
}
