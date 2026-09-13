"use client";

import React, { useState } from 'react';
import { Award, CheckCircle, AlertCircle, RotateCcw, Send } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "¿Cuál es la transacción fundamental en S/4HANA para parametrizar la estructura de la empresa en Finanzas?",
    options: [
      "SPRO (SAP Reference IMG)",
      "SE16N (Data Browser)",
      "SM30 (Table Maintenance)",
      "PFCG (Role Maintenance)"
    ],
    correctAnswer: 0,
    explanation: "SPRO abre el árbol de parametrización (Implementation Guide) donde se definen sociedades, centros y asignaciones organizativas."
  },
  {
    id: 2,
    question: "En SAP S/4HANA, ¿cuál es la tabla universal que unifica los datos contables de FI y CO?",
    options: [
      "BSEG",
      "BKPF",
      "ACDOCA (Universal Journal)",
      "KNA1"
    ],
    correctAnswer: 2,
    explanation: "ACDOCA es el Libro Mayor Universal que consolida partidas individuales de contabilidad financiera y analítica en una única fuente de la verdad."
  },
  {
    id: 3,
    question: "¿Qué rol de consultoría permite liderar implementaciones Brownfield y parametrizar Customizing empresarial?",
    options: [
      "Usuario Final Operativo",
      "Consultor Premium / Arquitecto de Soluciones",
      "Auditor de Inventarios",
      "Helpdesk Nivel 1"
    ],
    correctAnswer: 1,
    explanation: "El Consultor Premium cuenta con las competencias de arquitectura empresarial y parametrización IMG necesarias para transformaciones complejas."
  }
];

export function EvaluationQuiz({ onPassed }: { onPassed?: (score: number) => void }) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qId: number, optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    sampleQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) correct++;
    });
    return Math.round((correct / sampleQuestions.length) * 100);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = calculateScore();
    if (score >= 70 && onPassed) {
      onPassed(score);
    }
  };

  const score = submitted ? calculateScore() : 0;
  const isPassed = score >= 70;

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 sm:p-8 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Evaluación Técnica de Certificación
          </h3>
          <p className="text-xs text-slate-500">Mínimo para aprobar: 70% (Automatización n8n al aprobar)</p>
        </div>
        <Award className="w-6 h-6 text-amber-400" />
      </div>

      <div className="space-y-6">
        {sampleQuestions.map((q, idx) => (
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
                    optStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-400";
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
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all active:scale-[0.99] cursor-pointer ${optStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-slate-100 dark:bg-white/[0.02] p-2.5 rounded-lg">
                💡 <strong>Explicación:</strong> {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      {submitted ? (
        <div className={`p-4 rounded-2xl border text-center space-y-2 ${isPassed ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/40 bg-rose-500/10 text-rose-300'}`}>
          <p className="text-base font-bold">
            {isPassed ? "¡Felicidades! Evaluación Aprobada 🎉" : "Calificación Insuficiente"}
          </p>
          <p className="text-xs">
            Puntuación Obtenida: <strong>{score}%</strong> ({isPassed ? "Certificado emitido y sincronizado con n8n" : "Puedes repasar y reintentar"})
          </p>
        </div>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(selectedAnswers).length < sampleQuestions.length}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sap-blue to-sky-600 hover:from-sky-600 hover:to-sap-blue disabled:opacity-40 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4" /> Enviar Respuestas para Calificación
        </button>
      )}
    </div>
  );
}
