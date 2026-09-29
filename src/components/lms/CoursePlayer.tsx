"use client";

import React, { useState, useEffect } from 'react';
import { MarkdownRenderer } from '@/components/lms/MarkdownRenderer';
import { EvaluationQuiz } from '@/components/lms/EvaluationQuiz';
import { InteractiveSimulator } from '@/components/lms/InteractiveSimulator';
import { VideoPlayer } from '@/components/lms/VideoPlayer';
import { SlideViewer } from '@/components/lms/SlideViewer';
import { recordLessonCompletion } from '@/lib/student-service';
import { BookOpen, PenTool, Zap, FileText, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CoursePlayerProps {
  moduleTitle: string;
  moduleSlug: string;
  lessonTitle: string;
  lessonId: string;
  markdownContent: string;
  totalLessons: number;
  currentLessonIndex: number;
  previousLessonUrl: string | null;
  nextLessonUrl: string | null;
}

type TabType = 'contenido' | 'practica' | 'quiz' | 'recursos';

export function CoursePlayer({
  moduleTitle,
  moduleSlug,
  lessonTitle,
  lessonId,
  markdownContent,
  totalLessons,
  currentLessonIndex,
  previousLessonUrl,
  nextLessonUrl
}: CoursePlayerProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('contenido');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setActiveTab('contenido');
    setIsCompleted(false);
  }, [lessonId]);

  const handleMarkAsCompleted = () => {
    recordLessonCompletion(moduleSlug, lessonId);
    setIsCompleted(true);
  };

  const navigateTo = (url: string | null) => {
    if (url) {
      router.push(url);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#080d1a] transition-colors duration-300">

      <div className="max-w-6xl w-full mx-auto px-4 py-6 flex-1 flex flex-col">
        {/* Header Info */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-sap-blue dark:text-sky-400 mb-1">{moduleTitle}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            {currentLessonIndex + 1}. {lessonTitle}
          </h1>
        </div>

        {/* Tabs Navigation */}
        <div className="flex space-x-1 border-b border-slate-200 dark:border-white/10 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('contenido')}
            className={`flex items-center px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === 'contenido'
                ? 'border-sap-blue text-sap-blue dark:border-sky-400 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Contenido
          </button>
          <button
            onClick={() => setActiveTab('practica')}
            className={`flex items-center px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === 'practica'
                ? 'border-sap-blue text-sap-blue dark:border-sky-400 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <PenTool className="w-4 h-4 mr-2" />
            Práctica
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === 'quiz'
                ? 'border-sap-blue text-sap-blue dark:border-sky-400 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 mr-2" />
            Quiz
          </button>
          <button
            onClick={() => setActiveTab('recursos')}
            className={`flex items-center px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === 'recursos'
                ? 'border-sap-blue text-sap-blue dark:border-sky-400 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            Recursos
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-white dark:bg-[#0B0F17] rounded-xl shadow-sm border border-slate-200 dark:border-white/10 p-6 md:p-8 mb-8">
          {activeTab === 'contenido' && (
            <div className="w-full">
              <SlideViewer 
                slides={[
                  { id: '1', title: 'Fundamentos de SAP B1', content: markdownContent.substring(0, 500) + '...' },
                  { id: '2', title: 'Conceptos Avanzados', content: 'Aquí irá la continuación del contenido técnico desglosado.' }
                ]} 
              />
            </div>
          )}
          
          {activeTab === 'practica' && (
            <div className="h-full">
              <InteractiveSimulator trackCode={moduleSlug} submoduleCode={moduleSlug} />
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="h-full">
              <EvaluationQuiz 
                trackCode={moduleSlug} 
                onPassed={(score) => {
                  handleMarkAsCompleted();
                }}
              />
            </div>
          )}

          {activeTab === 'recursos' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recursos de la lección</h3>
              <div className="flex items-start p-4 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <FileText className="w-6 h-6 text-sap-blue dark:text-sky-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">Manual del Estudiante</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">PDF Document - 2.4 MB</p>
                </div>
              </div>
              <div className="flex items-start p-4 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <BookOpen className="w-6 h-6 text-sap-blue dark:text-sky-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">Guía de Ejercicios Prácticos</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">PDF Document - 1.1 MB</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto border-t border-slate-200 dark:border-white/10 pt-6">
          <button
            onClick={() => navigateTo(previousLessonUrl)}
            disabled={!previousLessonUrl}
            className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-300 dark:border-white/20 font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Lección anterior
          </button>



          <button
            onClick={() => navigateTo(nextLessonUrl)}
            disabled={!nextLessonUrl}
            className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
          >
            Siguiente lección
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
