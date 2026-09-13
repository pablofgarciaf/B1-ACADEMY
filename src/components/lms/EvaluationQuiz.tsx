"use client";

import React, { useState } from 'react';
import { Award, CheckCircle, AlertCircle, RotateCcw, Send } from 'lucide-react';
import { TRACK_QUIZZES, QuizQuestion } from '@/lib/quizzes-data';

interface EvaluationQuizProps {
  trackCode?: string;
  onPassed?: (score: number) => void;
}

export function EvaluationQuiz({ trackCode = 'SAP-B1-CORE', onPassed }: EvaluationQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions: QuizQuestion[] = TRACK_QUIZZES[trackCode] || TRACK_QUIZZES['SAP-B1-CORE'];

  const handleSelect = (qId: number, optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) correct++;
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = calculateScore();
    if (score >= 70 && onPassed) {
      onPassed(score);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const score = submitted ? calculateScore() : 0;
  const isPassed = score >= 70;

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 sm:p-8 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Examen Oficial de Certificación: {trackCode}
          </h3>
          <p className="text-xs text-slate-500">Mínimo para aprobar: 70% • Calificación registrada en tu expediente académico</p>
        </div>
        <Award className="w-6 h-6 text-amber-400" />
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="space-y-3">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {idx + 1}. {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[q.id] === optIdx;
                const isCorrect = q.correctAnswer === optIdx;
                let optStyle = "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]";

                if (submitted) {
                  if (isCorrect) {
                    optStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold";
                  } else if (isSelected && !isCorrect) {
                    optStyle = "border-rose-500 bg-rose-500/10 text-rose-400";
                  }
                } else if (isSelected) {
                  optStyle = "border-sap-blue bg-sap-blue/10 text-sap-blue font-semibold";
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelect(q.id, optIdx)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all active:scale-[0.99] cursor-pointer ${optStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-slate-100 dark:bg-white/[0.02] p-3 rounded-xl border border-slate-200/50 dark:border-white/5">
                💡 <strong>Fundamento Técnico:</strong> {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      {submitted ? (
        <div className="space-y-4">
          <div className={`p-5 rounded-2xl border text-center space-y-2 ${isPassed ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/40 bg-rose-500/10 text-rose-300'}`}>
            <p className="text-base font-bold">
              {isPassed ? "¡Felicidades! Evaluación Aprobada 🎉" : "Calificación Insuficiente"}
            </p>
            <p className="text-xs">
              Puntuación Final: <strong>{score}%</strong> ({isPassed ? "Tu nota se ha asentado en tu expediente y se computó para tu estatus Job-Ready." : "Se requiere mínimo 70%. Revisa la teoría y vuelve a intentar."})
            </p>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-3 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Reintentar Evaluación
          </button>
        </div>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(selectedAnswers).length < questions.length}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sap-blue to-sky-600 hover:from-sky-600 hover:to-sap-blue disabled:opacity-40 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4" /> Enviar Respuestas para Calificación
        </button>
      )}
    </div>
  );
}
