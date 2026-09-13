"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Server, Laptop, ShieldCheck, CheckCircle, Award } from 'lucide-react';
import { TRAINING_TRACKS } from '@/lib/courses-data';
import { VideoPlayer } from '@/components/lms/VideoPlayer';
import { LessonNavigator } from '@/components/lms/LessonNavigator';
import { EvaluationQuiz } from '@/components/lms/EvaluationQuiz';
import { recordLessonCompletion, recordExamResult } from '@/lib/student-service';

export default function ModuloLMSViewer({ params }: { params: Promise<{ moduloId: string }> }) {
  const [activeLessonId, setActiveLessonId] = useState('l1');
  const [showQuiz, setShowQuiz] = useState(false);

  // Desempaquetado de params
  const [resolvedParams, setResolvedParams] = useState<{ moduloId: string } | null>(null);

  React.useEffect(() => {
    params.then(p => setResolvedParams(p));
  }, [params]);

  const moduloId = resolvedParams?.moduloId || 'sap-b1-core';
  const track = TRAINING_TRACKS.find(t => t.id === moduloId) || TRAINING_TRACKS[0];

  // Lecciones adaptadas al track seleccionado
  const dynamicLessons = track.submodules.map((sub, idx) => ({
    id: `l${idx + 1}`,
    title: `[${sub.level}] ${sub.title}`,
    durationMin: sub.durationHours * 5,
    isCompleted: idx === 0,
    isLocked: idx > 2,
  }));

  const currentLesson = dynamicLessons.find(l => l.id === activeLessonId) || dynamicLessons[0];
  const activeSubmodule = track.submodules[parseInt(activeLessonId.replace('l', '')) - 1] || track.submodules[0];

  const handleLessonComplete = () => {
    recordLessonCompletion(track.code, activeLessonId);
  };

  const handleQuizPassed = (score: number) => {
    recordExamResult(track.code, `quiz-${track.code}`, track.title, score, `Evaluación aprobada con ${score}% en ${track.shortTitle}`);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header del Aula */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/capacitacion" className="inline-flex items-center gap-1.5 text-xs font-bold text-sap-blue hover:underline">
            <ArrowLeft className="w-4 h-4" /> Todas las Especialidades
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-xs font-mono text-slate-500 font-bold">{track.code}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full">
            <Server className="w-3.5 h-3.5" /> Sandbox SAP S/4HANA & Heinsohn Activo
          </span>
          <button
            onClick={() => setShowQuiz(!showQuiz)}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-900 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            {showQuiz ? "Volver al Video de Clase" : "Hacer Examen Oficial"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {showQuiz ? (
            <EvaluationQuiz onPassed={handleQuizPassed} />
          ) : (
            <>
              <VideoPlayer
                title={currentLesson.title}
                durationMin={currentLesson.durationMin}
                onComplete={handleLessonComplete}
              />

              <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                    activeSubmodule.level === 'ARQ'
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      : 'bg-sap-blue/10 text-sap-blue border border-sap-blue/20'
                  }`}>
                    {activeSubmodule.level === 'ARQ' ? 'Nivel Arquitectura / Consultor Premium' : 'Nivel Operativo / Usuario Estándar'}
                  </span>
                  <span className="text-xs font-mono text-slate-500">ID: {activeSubmodule.code}</span>
                </div>

                <h1 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  {activeSubmodule.title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeSubmodule.description}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-2">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Temas de la sesión práctica:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                    {activeSubmodule.keyTopics.map((topic, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-sap-blue shrink-0" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>

        <div>
          <LessonNavigator
            lessons={dynamicLessons}
            activeLessonId={activeLessonId}
            onSelectLesson={(id) => {
              setActiveLessonId(id);
              setShowQuiz(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}
