"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Hotspot {
  x: number;  // percentage 0-100
  y: number;
  w: number;
  h: number;
  label?: string;
}

interface Paso {
  id: number;
  screenshot: string;
  instruccion: string;
  tipo: "observar" | "clic" | "escribir";
  hotspot: Hotspot | null;
  accion: "next" | "click_hotspot";
}

interface QuizItem {
  pregunta: string;
  opciones: string[];
  correcta: number;
}

interface SimData {
  id: string;
  titulo: string;
  mision: string;
  pasos: Paso[];
  mini_quiz: QuizItem[];
  mensaje_final: string;
}

interface Props {
  simData: SimData;
  onComplete: (passed: boolean) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SimuladorLeccion({ simData, onComplete }: Props) {
  const [phase, setPhase] = useState<"intro" | "sim" | "quiz" | "done">("intro");
  const [step, setStep] = useState(0);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentPaso = simData.pasos[step];
  const totalSteps = simData.pasos.length;

  // ── Sim navigation ──────────────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    } else {
      setPhase("quiz");
      setQuizStep(0);
      setQuizAnswers([]);
      setSelected(null);
    }
  }, [step, totalSteps]);

  // ── Quiz ────────────────────────────────────────────────────────────────────
  const handleAnswer = (idx: number) => {
    if (showFeedback) return;
    setSelected(idx);
    setShowFeedback(true);
    setTimeout(() => {
      const newAnswers = [...quizAnswers, idx];
      setQuizAnswers(newAnswers);
      setShowFeedback(false);
      setSelected(null);
      if (quizStep < simData.mini_quiz.length - 1) {
        setQuizStep((q) => q + 1);
      } else {
        // evaluate
        const correct = newAnswers.filter(
          (ans, i) => ans === simData.mini_quiz[i].correcta
        ).length;
        const passed = correct / simData.mini_quiz.length >= 0.5;
        setPhase("done");
        setTimeout(() => onComplete(passed), 400);
      }
    }, 1200);
  };

  const progress = Math.round(((step + 1) / totalSteps) * 100);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-0 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 select-none">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 border-b border-slate-800">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
          💻 Simulador
        </span>
        <span className="text-xs text-slate-500 flex-1 truncate">{simData.titulo}</span>
        {phase === "sim" && (
          <span className="text-xs text-slate-600">
            {step + 1} / {totalSteps}
          </span>
        )}
      </div>

      {/* ── INTRO ── */}
      {phase === "intro" && (
        <div className="flex flex-col items-center gap-6 p-8 text-center">
          <div className="text-4xl">🎯</div>
          <h3 className="text-lg font-bold text-slate-100">Tu misión</h3>
          <p className="text-sm text-slate-300 max-w-md leading-relaxed">
            {simData.mision}
          </p>
          <p className="text-xs text-slate-500">
            Verás capturas reales de SAP B1 con instrucciones paso a paso.
          </p>
          <button
            onClick={() => setPhase("sim")}
            className="mt-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-semibold rounded-lg transition-all"
          >
            Iniciar simulación →
          </button>
        </div>
      )}

      {/* ── SIMULATOR ── */}
      {phase === "sim" && currentPaso && (
        <div className="flex flex-col">
          {/* Progress bar */}
          <div className="h-1 bg-slate-800">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Screenshot */}
          <div className="relative w-full bg-slate-900" style={{ aspectRatio: "16/9" }}>
            <Image
              src={currentPaso.screenshot}
              alt={`Paso ${currentPaso.id}`}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, 800px"
            />

            {/* Hotspot overlay */}
            {currentPaso.hotspot && (
              <button
                onClick={handleNext}
                className="absolute border-2 border-amber-400 bg-amber-400/20 rounded cursor-pointer
                           hover:bg-amber-400/40 transition-all animate-pulse"
                style={{
                  left: `${currentPaso.hotspot.x}%`,
                  top: `${currentPaso.hotspot.y}%`,
                  width: `${currentPaso.hotspot.w}%`,
                  height: `${currentPaso.hotspot.h}%`,
                }}
                aria-label={currentPaso.hotspot.label ?? "Haz clic aquí"}
              />
            )}

            {/* Step counter badge */}
            <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 rounded text-xs text-slate-300 font-mono">
              {step + 1}/{totalSteps}
            </div>
          </div>

          {/* Instruction + Next */}
          <div className="flex items-start gap-4 px-4 py-4 bg-slate-900 border-t border-slate-800">
            <div className="flex-1">
              <p className="text-sm text-slate-200 leading-relaxed">
                {currentPaso.instruccion}
              </p>
            </div>
            {currentPaso.accion === "next" && (
              <button
                onClick={handleNext}
                className="shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95
                           text-white text-sm font-semibold rounded-lg transition-all"
              >
                {step < totalSteps - 1 ? "Siguiente →" : "Ir al quiz →"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── QUIZ ── */}
      {phase === "quiz" && (
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              ✅ Mini Quiz
            </span>
            <span className="text-xs text-slate-600 ml-auto">
              {quizStep + 1} / {simData.mini_quiz.length}
            </span>
          </div>

          <p className="text-sm font-semibold text-slate-100 leading-relaxed">
            {simData.mini_quiz[quizStep].pregunta}
          </p>

          <div className="flex flex-col gap-2">
            {simData.mini_quiz[quizStep].opciones.map((op, i) => {
              const isSelected = selected === i;
              const isCorrect = i === simData.mini_quiz[quizStep].correcta;
              let cls =
                "px-4 py-3 rounded-lg border text-sm text-left transition-all cursor-pointer ";
              if (!showFeedback) {
                cls += "border-slate-700 bg-slate-900 hover:border-blue-500 hover:bg-slate-800 text-slate-300";
              } else if (isCorrect) {
                cls += "border-emerald-500 bg-emerald-950 text-emerald-300";
              } else if (isSelected && !isCorrect) {
                cls += "border-red-500 bg-red-950 text-red-300";
              } else {
                cls += "border-slate-800 bg-slate-950 text-slate-600 opacity-50";
              }
              return (
                <button key={i} className={cls} onClick={() => handleAnswer(i)}>
                  <span className="font-mono mr-2 text-xs opacity-60">
                    {["A", "B", "C", "D"][i]}.
                  </span>
                  {op}
                  {showFeedback && isCorrect && " ✓"}
                  {showFeedback && isSelected && !isCorrect && " ✗"}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── DONE ── */}
      {phase === "done" && (
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="text-4xl">🏁</div>
          <p className="text-sm text-slate-300 leading-relaxed max-w-md">
            {simData.mensaje_final}
          </p>
        </div>
      )}
    </div>
  );
}
