"use client";

import React, { useState } from 'react';
import { VideoPlayer } from './VideoPlayer';
import { EvaluationQuiz } from './EvaluationQuiz';
import { InteractiveSimulator } from './InteractiveSimulator';
import { Terminal, Award, Laptop } from 'lucide-react';
import { recordExamResult } from '@/lib/student-service';

interface Props {
  moduleTitle: string;
  moduleCode: string;
  isLastLesson: boolean;
}

export function LessonInteractiveSection({ moduleTitle, moduleCode, isLastLesson }: Props) {
  const [activeTab, setActiveTab] = useState<'video' | 'sandbox' | 'quiz'>('video');

  const handleQuizPassed = (score: number) => {
    recordExamResult(moduleCode, `quiz-${moduleCode}`, moduleTitle, score, 'Aprobado desde Mi Aula');
  };

  return (
    <div className="mt-12 space-y-6 border-t border-slate-200 dark:border-white/10 pt-8">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Material Interactivo y Práctica</h3>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-[#0b1320] p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('video')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'video'
              ? 'bg-white dark:bg-white/10 text-sap-blue shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5'
          }`}
        >
          <Laptop className="w-4 h-4" /> Video Clase
        </button>
        {isLastLesson && (
          <>
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'sandbox'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5'
              }`}
            >
              <Terminal className="w-4 h-4" /> Entorno de Práctica
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'quiz'
                  ? 'bg-amber-500 text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5'
              }`}
            >
              <Award className="w-4 h-4" /> Examen del Módulo
            </button>
          </>
        )}
      </div>

      {/* Content */}
      <div className="bg-slate-50 dark:bg-white/[0.02] rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-white/5">
        {activeTab === 'video' && (
          <VideoPlayer 
            title={`Clase Virtual: ${moduleTitle}`} 
            durationMin={45}
          />
        )}
        
        {activeTab === 'sandbox' && isLastLesson && (
          <div className="h-[600px] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-white/10">
            <InteractiveSimulator trackCode={moduleCode} submoduleCode={moduleCode} />
          </div>
        )}

        {activeTab === 'quiz' && isLastLesson && (
          <EvaluationQuiz trackCode={moduleCode} onPassed={handleQuizPassed} />
        )}
      </div>
    </div>
  );
}
