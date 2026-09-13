"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Server, Laptop, ShieldCheck } from 'lucide-react';
import { VideoPlayer } from '@/components/lms/VideoPlayer';
import { LessonNavigator } from '@/components/lms/LessonNavigator';
import { EvaluationQuiz } from '@/components/lms/EvaluationQuiz';

const mockLessons = [
  { id: "l1", title: "Introducción a la Arquitectura SAP S/4HANA", durationMin: 18, isCompleted: true, isLocked: false },
  { id: "l2", title: "Configuración de la Sociedad FI y Libro Mayor", durationMin: 24, isCompleted: false, isLocked: false },
  { id: "l3", title: "Parametrización del Universal Journal (ACDOCA)", durationMin: 32, isCompleted: false, isLocked: false },
  { id: "l4", title: "Cierres Contables y Validación de Balances", durationMin: 28, isCompleted: false, isLocked: true },
];

export default function ModuloLMSViewer({ params }: { params: Promise<{ moduloId: string }> }) {
  const [activeLessonId, setActiveLessonId] = useState("l2");
  const [showQuiz, setShowQuiz] = useState(false);
  const currentLesson = mockLessons.find(l => l.id === activeLessonId) || mockLessons[0];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
        <Link href="/capacitacion" className="inline-flex items-center gap-2 text-xs font-semibold text-sap-blue hover:underline">
          <ArrowLeft className="w-4 h-4" /> Volver a Cursos
        </Link>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full">
            <Server className="w-3.5 h-3.5" /> Sandbox S/4HANA Conectado
          </span>
          <button
            onClick={() => setShowQuiz(!showQuiz)}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-900 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            {showQuiz ? "Ver Lección en Video" : "Hacer Examen de Módulo"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {showQuiz ? (
            <EvaluationQuiz onPassed={(s) => console.log('Passed quiz with score', s)} />
          ) : (
            <>
              <VideoPlayer
                title={currentLesson.title}
                durationMin={currentLesson.durationMin}
                onComplete={() => console.log('Lesson completed')}
              />
              <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-3">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {currentLesson.title}
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  En esta sesión abordamos la parametrización técnica en el menú SPRO. 
                  Aprenderás a crear variantes de ejercicio fiscal, asignar planes de cuentas operativos y configurar tolerancias de contabilización.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="space-y-6">
          <LessonNavigator
            lessons={mockLessons}
            activeLessonId={activeLessonId}
            onSelectLesson={(id) => setActiveLessonId(id)}
          />
        </div>
      </div>
    </div>
  );
}
