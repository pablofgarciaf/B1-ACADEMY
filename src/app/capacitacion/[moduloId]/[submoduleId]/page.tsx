"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Laptop, CheckCircle2, Award, BookOpen, Terminal, FileText, AlertTriangle, Sparkles, ChevronRight, ExternalLink, Layers, ArrowRight
} from 'lucide-react';
import { TRAINING_TRACKS } from '@/lib/courses-data';
import { SUBMODULE_GUIDES } from '@/lib/submodules-content';
import { getModuleSimulation } from '@/lib/module-simulations-data';
import { ALL_MANUALS } from '@/lib/manuals-120-data';
import { VisualScreenSimulator } from '@/components/lms/VisualScreenSimulator';
import { VideoPlayer } from '@/components/lms/VideoPlayer';
import { LessonNavigator } from '@/components/lms/LessonNavigator';
import { EvaluationQuiz } from '@/components/lms/EvaluationQuiz';
import { InteractiveSimulator } from '@/components/lms/InteractiveSimulator';
import { QuickCheckQuiz } from '@/components/lms/QuickCheckQuiz';
import { recordLessonCompletion, recordExamResult, getStudentProfile } from '@/lib/student-service';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';

export default function SubmoduleLMSViewer({ params }: { params: Promise<{ moduloId: string, submoduleId: string }> }) {
  const resolvedParams = use(params);
  const moduloId = resolvedParams?.moduloId || 'sap-b1-logistics';
  const submoduleId = resolvedParams?.submoduleId || 'b1-01';

  const [activeLessonId, setActiveLessonId] = useState('t0');
  const [activeViewTab, setActiveViewTab] = useState<'all' | 'screen' | 'guide' | 'quickcheck' | 'quiz'>('all');
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  const [showToast, setShowToast] = useState(false);

  const track = TRAINING_TRACKS.find(t => t.id === moduloId) || TRAINING_TRACKS[0];
  const activeSubmodule = track.submodules.find(s => s.id === submoduleId) || track.submodules[0];
  
  // Create lessons from keyTopics
  const dynamicLessons = activeSubmodule.keyTopics.map((topic, idx) => ({
    id: `t${idx}`,
    title: topic,
    durationMin: 15,
    isCompleted: !!completedLessons[`t${idx}`],
    isLocked: false,
  }));

  const lessonIndex = parseInt(activeLessonId.replace('t', '')) || 0;
  const currentLesson = dynamicLessons[lessonIndex] || dynamicLessons[0];

  useEffect(() => {
    // Basic mock of tracking completed sub-topics
    const student = getStudentProfile();
    const course = student.progress[track.id] || student.progress[track.code];
    if (course?.completedLessons) {
      const map: Record<string, boolean> = {};
      course.completedLessons.forEach(lid => {
        if (lid.startsWith(`${submoduleId}-`)) {
           map[lid.replace(`${submoduleId}-`, '')] = true;
        }
      });
      setCompletedLessons(map);
    }
  }, [track.id, track.code, submoduleId]);

  const simulation = getModuleSimulation(activeSubmodule.id, track.code);
  const relatedManuals = ALL_MANUALS.filter(m => simulation.relatedManualNumbers.includes(m.number));

  const detailedGuide = SUBMODULE_GUIDES[activeSubmodule.id] || {
    submoduleId: activeSubmodule.id,
    code: activeSubmodule.code,
    title: activeSubmodule.title,
    trackId: track.id,
    functionalOverview: activeSubmodule.description,
    sapMenuPath: `Módulos → ${track.shortTitle} → ${activeSubmodule.title.split(':')[0]}`,
    businessCaseEC: {
      companyName: 'Distribuidora & Logística Andina S.A.S. (Guayaquil, Ecuador)',
      scenario: `Operación técnica y configuración de ${activeSubmodule.title} bajo estándares corporativos y marco normativo ecuatoriano.`,
      calculationOrConfig: 'Validación de integridad referencial en tablas maestras, centros de costo y asientos contables balanceados.'
    },
    stepByStepSteps: [
      {
        stepNumber: 1,
        title: 'Verificación de Prerrequisitos y Tablas Maestras',
        action: 'Comprobar la existencia y consistencia de los datos maestros previos requeridos por la transacción.',
        technicalDetails: 'Validación de estructura relacional en base de datos HANA / SQL Server.',
        validationCheck: 'Comprobar que no existan inconsistencias de clave foránea ni bloqueos de período.'
      }
    ],
    criticalErrorsToAvoid: [
      {
        error: 'Registrar movimientos en períodos contables bloqueados o cerrados por auditoría',
        consequence: 'Rechazo del sistema o descuadres en las declaraciones tributarias mensuales presentadas al SRI.',
        solution: 'Verificar el estado del período en Inicialización del Sistema antes de contabilizar.'
      }
    ],
    regulatoryContextEC: 'Resolución Técnica vigente SRI / Código del Trabajo / Normas Internacionales de Información Financiera (NIIF).'
  };

  const handleLessonComplete = () => {
    setCompletedLessons(prev => ({ ...prev, [activeLessonId]: true }));
    recordLessonCompletion(track.id, `${submoduleId}-${activeLessonId}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleQuizPassed = (score: number) => {
    recordExamResult(
      track.id,
      `quiz-${track.id}-${activeSubmodule.id}`,
      activeSubmodule.title,
      score,
      `Evaluación aprobada con ${score}% en ${activeSubmodule.title}`
    );
    // Aprobar el submódulo entero al pasar el examen oficial
    recordLessonCompletion(track.id, activeSubmodule.code);
  };

  const isCurrentCompleted = !!completedLessons[activeLessonId];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a] selection:bg-sap-blue selection:text-white">
      <Navbar />

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-2xl flex items-center gap-3 transition-all animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <div className="text-xs">
            <p className="font-bold">¡Tema Registrado con Éxito!</p>
            <p className="text-emerald-100">Se ha actualizado tu progreso en este submódulo.</p>
          </div>
        </div>
      )}

      <main className="flex-1 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 w-full">
        {/* BREADCRUMB & HEADER */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <Link href={`/capacitacion/${track.id}`} className="text-sap-blue hover:text-sky-600 flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al Track
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-500">{track.title}</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-800 dark:text-slate-200">{activeSubmodule.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white">
              {activeSubmodule.code}
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${activeSubmodule.level === 'ARQ' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              Nivel {activeSubmodule.level}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
            {activeSubmodule.title}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-4xl">
            {activeSubmodule.description}
          </p>
        </div>

        {/* Barra de Filtros / Pestañas Didácticas */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-200 dark:border-white/10 select-none">
            <button onClick={() => setActiveViewTab('all')} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeViewTab === 'all' ? 'bg-sap-blue text-white shadow-md' : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'}`}>
              <BookOpen className="w-3.5 h-3.5" /> Aula Completa (Video + Texto)
            </button>
            <button onClick={() => setActiveViewTab('screen')} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeViewTab === 'screen' ? 'bg-gradient-to-r from-sap-blue to-sky-600 text-white shadow-md' : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'}`}>
              <Laptop className="w-3.5 h-3.5" /> Pantalla ERP
            </button>
            <button onClick={() => setActiveViewTab('guide')} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeViewTab === 'guide' ? 'bg-sap-blue text-white shadow-md' : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'}`}>
              <FileText className="w-3.5 h-3.5" /> Guía Técnica
            </button>
            <button onClick={() => setActiveViewTab('quickcheck')} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeViewTab === 'quickcheck' ? 'bg-sky-500 text-white shadow-md' : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'}`}>
              <Sparkles className="w-3.5 h-3.5" /> Autoevaluación
            </button>
            <button onClick={() => setActiveViewTab('quiz')} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeViewTab === 'quiz' ? 'bg-amber-500 text-slate-900 shadow-md' : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'}`}>
              <Award className="w-3.5 h-3.5" /> Examen Oficial
            </button>
        </div>

        {/* CONTENEDOR PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            {/* PESTAÑA 1: AULA COMPLETA (VIDEO + TEXTO EXPLICATIVO DE LA LECCIÓN) */}
            {activeViewTab === 'all' && (
              <div className="space-y-6">
                <VideoPlayer
                  title={`${activeSubmodule.title}: ${currentLesson.title}`}
                  durationMin={currentLesson.durationMin}
                  systemType={`SAP Business One v10.0 • ${track.shortTitle}`}
                  transactionCode={simulation.transactionCode}
                  onComplete={handleLessonComplete}
                />
                
                {/* Texto Explicativo / Transcripción de la Lección */}
                <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-5 shadow-sm">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-white/5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sap-blue animate-pulse" />
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      Texto y Fundamento Teórico de la Clase
                    </h3>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {simulation.classTranscript.summary}
                  </p>
                  
                  {detailedGuide.functionalOverview && (
                    <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-2">
                      <h4 className="text-xs font-mono font-bold text-sap-blue dark:text-sky-400 uppercase">
                        CONCEPTOS CLAVE DE LA SESIÓN
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {detailedGuide.functionalOverview}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PESTAÑA 2: PANTALLA ERP */}
            {activeViewTab === 'screen' && (
              <VisualScreenSimulator
                systemType={simulation.systemType}
                windowTitle={simulation.windowTitle}
                transactionCode={simulation.transactionCode}
                screenSummary={simulation.screenSummary}
                interactiveFields={simulation.interactiveFields}
                workedExample={simulation.workedExample}
              />
            )}

            {/* PESTAÑA 3: GUÍA TÉCNICA */}
            {activeViewTab === 'guide' && (
              <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-5 shadow-sm">
                <h3 className="font-bold text-lg">Guía y Procedimiento Técnico</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{detailedGuide.functionalOverview}</p>
                <div className="space-y-3">
                  {detailedGuide.stepByStepSteps.map(step => (
                     <div key={step.stepNumber} className="p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{step.stepNumber}. {step.title}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{step.action}</p>
                     </div>
                  ))}
                </div>
              </div>
            )}

            {/* PESTAÑA 4: AUTOEVALUACIÓN */}
            {activeViewTab === 'quickcheck' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300 text-xs">
                  <strong>💡 Práctica de Autoevaluación:</strong> Responde estas preguntas para verificar tu comprensión inmediata. No afecta tu promedio académico final.
                </div>
                <QuickCheckQuiz questions={simulation.quickCheckQuestions} submoduleCode={activeSubmodule.code} />
              </div>
            )}

            {/* PESTAÑA 5: EXAMEN OFICIAL */}
            {activeViewTab === 'quiz' && (
               <div className="space-y-4">
                 <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs">
                   <strong>🏆 Examen Oficial de Certificación:</strong> Se requiere un puntaje mínimo de 80% para aprobar y asentar la nota en tu expediente estudiantil.
                 </div>
                 <EvaluationQuiz trackCode={track.code} onPassed={handleQuizPassed} />
               </div>
            )}
            
            {/* Navegacion bottom */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Tema: {currentLesson.title}
              </h4>
              {lessonIndex < dynamicLessons.length - 1 ? (
                <button
                  onClick={() => {
                    setActiveLessonId(`t${lessonIndex + 1}`);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 dark:bg-white/10 hover:bg-slate-700 dark:hover:bg-white/20 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  Siguiente Tema <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveViewTab('quiz');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  Ir al Examen Oficial <Award className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

          {/* TEMARIO LATERAL */}
          <div className="space-y-6">
            <LessonNavigator
              lessons={dynamicLessons}
              activeLessonId={activeLessonId}
              trackTitle={activeSubmodule.title}
              trackCode={activeSubmodule.code}
              onSelectLesson={(id) => {
                setActiveLessonId(id);
                if (activeViewTab !== 'all') setActiveViewTab('all');
              }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
