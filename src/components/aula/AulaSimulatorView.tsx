'use client';

import FinixInteractiveSimulator, { type StepGuide } from '@/components/simulator/FinixInteractiveSimulator';
import type { IntentoPractica } from '@/lib/practice-check';
import type { LessonData } from './types';
import { Bot, Play, Pause, Volume2 } from 'lucide-react';

interface AulaSimulatorViewProps {
  currentStepGuide: StepGuide;
  activeClassId: string;
  currentSlideIndex: number;
  restartKey: number;
  practiceAttempt: number;
  slideScript: string;
  lessonData: LessonData | null;
  isSpeaking: boolean;
  isPaused: boolean;
  needsGesture: boolean;
  narracionAbierta: boolean;
  setNarracionAbierta: (v: boolean | ((prev: boolean) => boolean)) => void;
  togglePause: () => void;
  resumeAfterGesture: () => void;
  handleMissionComplete: (intento?: IntentoPractica) => void;
}

export default function AulaSimulatorView({
  currentStepGuide,
  activeClassId,
  currentSlideIndex,
  restartKey,
  practiceAttempt,
  slideScript,
  lessonData,
  isSpeaking,
  isPaused,
  needsGesture,
  narracionAbierta,
  setNarracionAbierta,
  togglePause,
  resumeAfterGesture,
  handleMissionComplete
}: AulaSimulatorViewProps) {
  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-y-auto">
      {/* Glowing instructions bar */}
      <div className="shrink-0 max-h-[30dvh] overflow-y-auto mx-2 sm:mx-4 mt-3 p-3 rounded-xl bg-gradient-to-r from-blue-900/60 to-blue-800/40 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
        <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-300 flex items-center justify-center text-xs font-bold shrink-0">
              🎯
            </span>
            <p className="text-xs font-bold uppercase tracking-wide text-white truncate">
              {currentStepGuide.title}
            </p>
            {currentStepGuide.menu_path && (
              <span className="hidden sm:inline-flex text-[10.5px] font-mono font-medium text-blue-200 bg-blue-950/80 border border-blue-400/40 px-2 py-0.5 rounded shadow-2xs">
                Ruta: <strong>{currentStepGuide.menu_path}</strong>
              </span>
            )}
          </div>
          {isSpeaking && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300 animate-pulse">
              <Bot className="w-3.5 h-3.5" /> Tutor IA explicando...
            </span>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePause}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold active:scale-95 transition-all"
              title={isPaused ? 'Reanudar explicación (Espacio)' : 'Pausar explicación (Espacio)'}
            >
              {isPaused ? <Play className="w-3 h-3 fill-white" /> : <Pause className="w-3 h-3 fill-white" />}
              <span>{isPaused ? 'Reanudar' : 'Pausar'}</span>
            </button>
            {process.env.NODE_ENV !== 'production' && (
              <button
                type="button"
                onClick={() => handleMissionComplete()}
                className="px-2 py-0.5 rounded bg-blue-600/80 hover:bg-blue-500 text-white text-[10px] font-bold active:scale-95"
                title="Bypass de auditoría"
              >
                ⏩ Saltar práctica
              </button>
            )}
            {needsGesture && (
              <button
                onClick={resumeAfterGesture}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-bold hover:bg-amber-400 active:scale-95"
              >
                <Volume2 className="w-3 h-3" /> Activar voz
              </button>
            )}
          </div>
        </div>

        {slideScript && (
          <div className="mb-2">
            <p className={`text-xs text-blue-100/80 leading-relaxed ${narracionAbierta ? '' : 'line-clamp-2'}`}>{slideScript}</p>
            {slideScript.length > 160 && (
              <button
                onClick={() => setNarracionAbierta((v) => !v)}
                className="mt-0.5 text-[11px] font-semibold text-amber-300 hover:text-amber-200 active:scale-95"
              >
                {narracionAbierta ? 'Ver menos' : 'Ver más'}
              </button>
            )}
          </div>
        )}

        {!!lessonData?.references?.length && (
          <details className="mb-2 text-xs text-blue-100">
            <summary className="cursor-pointer">Fuentes de la clase</summary>
            <ul className="mt-1 space-y-1">
              {lessonData.references.map(reference => (
                <li key={reference.url}><a href={reference.url} target="_blank" rel="noopener noreferrer" className="underline">{reference.title}</a></li>
              ))}
            </ul>
          </details>
        )}

        <ol className="grid sm:grid-cols-2 gap-x-3 gap-y-1 my-1.5 bg-blue-950/40 p-2 rounded-lg border border-blue-500/20">
          {currentStepGuide.instructions.filter(i => !/^Datos a registrar/i.test(i)).map((inst, i) => (
            <li key={i} className="text-xs text-blue-100 flex items-start gap-2">
              <span className="shrink-0 w-4 h-4 rounded-full bg-blue-500/40 text-blue-200 flex items-center justify-center text-[9px] font-bold mt-0.5">{i + 1}</span>
              <span>{inst}</span>
            </li>
          ))}
          <li className="text-xs text-amber-300 font-semibold flex items-start gap-2 bg-amber-500/10 p-1 rounded border border-amber-500/20 sm:col-span-2">
            <span className="shrink-0 w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[9px] font-extrabold mt-0.5">✓</span>
            <span>Paso final: Una vez guardados o registrados los datos, pulsa el botón &quot;Verificar y Validar Práctica&quot; (o &quot;Añadir al sistema&quot;) para registrar tu aprobación.</span>
          </li>
        </ol>

        {/* Ficha unificada de datos requeridos */}
        {currentStepGuide.campos && currentStepGuide.campos.length > 0 && (
          <div className="mt-2 pt-2 border-t border-blue-500/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-extrabold text-blue-300 uppercase tracking-wider flex items-center gap-1">
                🏷️ Datos clave para ingresar en el simulador:
              </span>
              <span className="text-[9.5px] text-blue-200/70 hidden sm:inline">
                💡 Ingresa estos valores en el formulario
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1.5">
              {currentStepGuide.campos.map((c, i) => (
                <div key={i} className="px-2.5 py-1.5 rounded-lg bg-blue-950/70 border border-blue-500/30 flex flex-col justify-between shadow-2xs">
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-[9.5px] font-bold text-blue-300 uppercase tracking-wide truncate">{c.etiqueta}</span>
                    <span className="text-xs font-mono font-bold text-white select-all">{c.valor}</span>
                  </div>
                  {c.pista && <span className="text-[9px] text-blue-200/60 italic truncate mt-0.5" title={c.pista}>{c.pista}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Simulator */}
      <div className="flex-1 min-h-[320px] mt-3 px-2 sm:px-4 pb-4">
        <FinixInteractiveSimulator
          key={`${activeClassId}:${currentSlideIndex}:${restartKey}`}
          manualId={activeClassId}
          currentStepIndex={currentSlideIndex}
          stepGuide={currentStepGuide}
          onMissionComplete={handleMissionComplete}
          scrollInterno={false}
          hideHeaderGuide={true}
        />
      </div>
    </div>
  );
}
