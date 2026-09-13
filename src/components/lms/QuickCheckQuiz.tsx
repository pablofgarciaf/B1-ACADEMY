"use client";

import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, Sparkles, RotateCcw } from 'lucide-react';

export interface QuickQuestionItem {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuickCheckQuizProps {
  questions: QuickQuestionItem[];
  submoduleCode: string;
}

export function QuickCheckQuiz({ questions, submoduleCode }: QuickCheckQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const handleSelectOption = (qId: number, optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
    setRevealed(prev => ({ ...prev, [qId]: true }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setRevealed({});
  };

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = questions.filter(
    q => selectedAnswers[q.id] !== undefined && selectedAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sap-blue dark:text-sky-400">
            <Sparkles className="w-4 h-4" /> Comprobación Inmediata de Aprendizaje
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
            Autoevaluación Rápida de la Lección ({submoduleCode})
          </h3>
          <p className="text-xs text-slate-500">
            Responde estas 3 preguntas clave para validar la comprensión de los conceptos antes de continuar.
          </p>
        </div>

        {answeredCount > 0 && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                Puntaje: <span className="text-sap-blue dark:text-sky-400">{correctCount}</span> / {totalQuestions}
              </span>
              <div className="text-[10px] text-slate-400">
                {correctCount === totalQuestions ? '¡Perfecto! Dominio 100%' : 'Revisa las explicaciones'}
              </div>
            </div>
            <button
              onClick={handleReset}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-all cursor-pointer active:scale-95"
              title="Reiniciar prueba"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const isAnswered = selectedAnswers[q.id] !== undefined;
          const selectedIdx = selectedAnswers[q.id];
          const isCorrect = isAnswered && selectedIdx === q.correctIndex;

          return (
            <div
              key={q.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/60 dark:bg-white/[0.01] space-y-4"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-sap-blue/10 text-sap-blue dark:text-sky-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 font-mono">
                  0{qIndex + 1}
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                  {q.question}
                </p>
              </div>

              {/* Opciones */}
              <div className="grid grid-cols-1 gap-2.5 pl-9">
                {q.options.map((option, optIdx) => {
                  const isSelected = selectedIdx === optIdx;
                  const isOptionCorrect = optIdx === q.correctIndex;

                  let buttonStyles =
                    'border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 text-slate-700 dark:text-slate-300 hover:border-sap-blue/40';

                  if (isAnswered) {
                    if (isSelected && isCorrect) {
                      buttonStyles =
                        'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 ring-1 ring-emerald-500 font-medium';
                    } else if (isSelected && !isCorrect) {
                      buttonStyles =
                        'border-rose-500 bg-rose-500/10 text-rose-900 dark:text-rose-300 ring-1 ring-rose-500 font-medium';
                    } else if (isOptionCorrect) {
                      buttonStyles =
                        'border-emerald-500/50 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300/80';
                    } else {
                      buttonStyles = 'opacity-40 border-slate-200 dark:border-white/5';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start justify-between gap-3 cursor-pointer active:scale-[0.99] ${buttonStyles}`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="font-mono text-[11px] font-bold text-slate-400 shrink-0">
                          {String.fromCharCode(65 + optIdx)})
                        </span>
                        <span className="leading-relaxed">{option}</span>
                      </div>

                      {isAnswered && isSelected && (
                        <div className="shrink-0 mt-0.5">
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500" />
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explicación pedagógica desplegada al responder */}
              {isAnswered && (
                <div
                  className={`ml-9 p-4 rounded-xl border text-xs leading-relaxed transition-all ${
                    isCorrect
                      ? 'border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300'
                      : 'border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <HelpCircle className="w-4 h-4" />
                    <span>{isCorrect ? '¡Correcto!' : 'Respuesta Incorrecta'} • Explicación del Consultor:</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300">
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
