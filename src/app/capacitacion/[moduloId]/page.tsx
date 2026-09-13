"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Server, 
  Laptop, 
  ShieldCheck, 
  CheckCircle, 
  Award,
  BookOpen,
  Terminal,
  FileText,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Layers
} from 'lucide-react';
import { TRAINING_TRACKS } from '@/lib/courses-data';
import { SUBMODULE_GUIDES } from '@/lib/submodules-content';
import { VideoPlayer } from '@/components/lms/VideoPlayer';
import { LessonNavigator } from '@/components/lms/LessonNavigator';
import { EvaluationQuiz } from '@/components/lms/EvaluationQuiz';
import { InteractiveSimulator } from '@/components/lms/InteractiveSimulator';
import { recordLessonCompletion, recordExamResult } from '@/lib/student-service';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';

export default function ModuloLMSViewer({ params }: { params: Promise<{ moduloId: string }> }) {
  const [activeLessonId, setActiveLessonId] = useState('l1');
  const [activeViewTab, setActiveViewTab] = useState<'video' | 'guide' | 'sandbox' | 'quiz'>('guide');

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
    isLocked: idx > 3,
  }));

  const lessonIndex = parseInt(activeLessonId.replace('l', '')) - 1;
  const activeSubmodule = track.submodules[lessonIndex] || track.submodules[0];
  const currentLesson = dynamicLessons[lessonIndex] || dynamicLessons[0];

  // Guía técnica detallada si existe, o guía por defecto estructurada
  const detailedGuide = SUBMODULE_GUIDES[activeSubmodule.id] || {
    submoduleId: activeSubmodule.id,
    code: activeSubmodule.code,
    title: activeSubmodule.title,
    trackId: track.id,
    functionalOverview: activeSubmodule.description,
    sapMenuPath: `Módulos → ${track.shortTitle} → ${activeSubmodule.title.split(':')[0]}`,
    businessCaseEC: {
      companyName: 'Caso de Estudio Empresarial Ecuador',
      scenario: `Operación técnica y configuración de ${activeSubmodule.title} bajo estándares corporativos y marco normativo ecuatoriano.`,
      calculationOrConfig: 'Validación de integridad referencial, centros de costo y asientos contables balanceados.'
    },
    stepByStepSteps: [
      {
        stepNumber: 1,
        title: 'Verificación de Prerrequisitos y Tablas Maestras',
        action: 'Comprobar la existencia y consistencia de los datos maestros previos requeridos por la transacción.',
        technicalDetails: 'Validación de estructura relacional en base de datos HANA / SQL Server.',
        validationCheck: 'Comprobar que no existan inconsistencias de clave foránea ni bloqueos de período.'
      },
      {
        stepNumber: 2,
        title: 'Ejecución y Parametrización en el Software',
        action: 'Ingresar los valores del caso de estudio y procesar la transacción según la política de control interno.',
        technicalDetails: 'Generación del documento preliminar o asiento en firme respetando segregación de funciones.',
        validationCheck: 'Revisar la bitácora de auditoría y confirmar la autorización o timbrado correspondiente.'
      },
      {
        stepNumber: 3,
        title: 'Cierre Operativo y Conciliación Contable',
        action: 'Conciliar el impacto financiero y emitir los reportes analíticos para dirección y entes de control.',
        technicalDetails: 'Mapeo hacia centros de costos analíticos y cuentas de mayor NIIF.',
        validationCheck: 'Certificar que el balance de comprobación mantenga suma cero entre débitos y créditos.'
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
    recordLessonCompletion(track.code, activeLessonId);
  };

  const handleQuizPassed = (score: number) => {
    recordExamResult(track.code, `quiz-${track.code}`, track.title, score, `Evaluación aprobada con ${score}% en ${track.shortTitle}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a] selection:bg-sap-blue selection:text-white">
      <Navbar />

      <main className="flex-1 py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 w-full">
        {/* Header Superior del Aula */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-sm">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/capacitacion" className="inline-flex items-center gap-1 text-xs font-bold text-sap-blue hover:underline">
                <ArrowLeft className="w-4 h-4" /> Tracks
              </Link>
              <span className="text-slate-400">/</span>
              <span className="text-xs font-mono font-bold text-slate-500">{track.code}</span>
              <span className="text-slate-400">/</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-sap-blue/10 text-sap-blue">
                {activeSubmodule.code}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
              {activeSubmodule.title}
            </h1>
          </div>

          {/* Selector de Pestañas Didácticas (Coursera / edX Style) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveViewTab('guide')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                activeViewTab === 'guide'
                  ? 'bg-sap-blue text-white shadow-md shadow-sap-blue/25'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              <FileText className="w-4 h-4" /> Guía Paso a Paso
            </button>
            <button
              onClick={() => setActiveViewTab('sandbox')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                activeViewTab === 'sandbox'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              <Terminal className="w-4 h-4" /> Consola Sandbox
            </button>
            <button
              onClick={() => setActiveViewTab('video')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                activeViewTab === 'video'
                  ? 'bg-sap-blue text-white shadow-md shadow-sap-blue/25'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              <Laptop className="w-4 h-4" /> Video de Clase
            </button>
            <button
              onClick={() => setActiveViewTab('quiz')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                activeViewTab === 'quiz'
                  ? 'bg-amber-500 text-slate-900 font-extrabold shadow-md shadow-amber-500/25'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" /> Examen Oficial
            </button>
          </div>
        </div>

        {/* CONTENEDOR PRINCIPAL: Pestaña Activa + Navegador Lateral */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {/* PESTAÑA 1: GUÍA DIDÁCTICA PASO A PASO */}
            {activeViewTab === 'guide' && (
              <div className="space-y-6">
                {/* Resumen Funcional */}
                <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-5 shadow-sm">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      activeSubmodule.level === 'ARQ'
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        : 'bg-sap-blue/10 text-sap-blue border border-sap-blue/20'
                    }`}>
                      {activeSubmodule.level === 'ARQ' ? 'Nivel Arquitectura / Parametrización IMG' : 'Nivel Operativo / Transaccional'}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      Ruta SAP: <strong>{detailedGuide.sapMenuPath}</strong>
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      Fundamento Operativo & Arquitectura
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {detailedGuide.functionalOverview}
                    </p>
                  </div>

                  {/* Caso de Estudio Ecuatoriano */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/20 border border-sky-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-sap-blue dark:text-sky-400 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" /> Caso Real: {detailedGuide.businessCaseEC.companyName}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      <strong>Escenario:</strong> {detailedGuide.businessCaseEC.scenario}
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-mono bg-white/60 dark:bg-black/30 p-2.5 rounded-xl border border-sky-500/20">
                      <strong>Cálculo / Parametrización:</strong> {detailedGuide.businessCaseEC.calculationOrConfig}
                    </p>
                  </div>
                </div>

                {/* Pasos de Ejecución Técnica */}
                <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-6 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-sap-blue" />
                    Procedimiento Técnico de Parametrización y Operación
                  </h3>

                  <div className="space-y-4">
                    {detailedGuide.stepByStepSteps.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] space-y-2.5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-xl bg-sap-blue text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {step.stepNumber}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                            {step.title}
                          </h4>
                        </div>

                        <p className="text-xs text-slate-700 dark:text-slate-300 pl-10">
                          {step.action}
                        </p>

                        <div className="pl-10 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px]">
                          <div className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/5 text-slate-600 dark:text-slate-400 font-mono">
                            <strong>Detalle Técnico:</strong> {step.technicalDetails}
                          </div>
                          <div className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                            <strong>Comprobación:</strong> {step.validationCheck}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Errores Críticos y Marco Regulatorio */}
                <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-5 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 text-rose-500">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                    Errores Críticos a Evitar en Producción
                  </h3>

                  <div className="space-y-3">
                    {detailedGuide.criticalErrorsToAvoid.map((err, i) => (
                      <div key={i} className="p-4 rounded-2xl border border-rose-500/20 bg-rose-50/50 dark:bg-rose-950/10 space-y-1.5 text-xs">
                        <p className="font-bold text-rose-700 dark:text-rose-400">
                          ❌ Error: {err.error}
                        </p>
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong>Impacto:</strong> {err.consequence}
                        </p>
                        <p className="text-emerald-700 dark:text-emerald-400 font-medium pt-1">
                          ✅ <strong>Solución del Consultor:</strong> {err.solution}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500">
                    <strong>Normativa Ecuatoriana Aplicable:</strong> {detailedGuide.regulatoryContextEC}
                  </div>
                </div>
              </div>
            )}

            {/* PESTAÑA 2: CONSOLA SANDBOX INTERACTIVA */}
            {activeViewTab === 'sandbox' && (
              <div className="space-y-4">
                <InteractiveSimulator
                  trackCode={track.code}
                  submoduleCode={activeSubmodule.code}
                />
              </div>
            )}

            {/* PESTAÑA 3: VIDEO DE CLASE */}
            {activeViewTab === 'video' && (
              <div className="space-y-4">
                <VideoPlayer
                  title={currentLesson.title}
                  durationMin={currentLesson.durationMin}
                  onComplete={handleLessonComplete}
                />
              </div>
            )}

            {/* PESTAÑA 4: EXAMEN OFICIAL DEL TRACK */}
            {activeViewTab === 'quiz' && (
              <div className="space-y-4">
                <EvaluationQuiz
                  trackCode={track.code}
                  onPassed={handleQuizPassed}
                />
              </div>
            )}
          </div>

          {/* TEMARIO Y NAVEGACIÓN LATERAL */}
          <div className="space-y-6">
            <LessonNavigator
              lessons={dynamicLessons}
              activeLessonId={activeLessonId}
              onSelectLesson={(id) => {
                setActiveLessonId(id);
              }}
            />

            {/* Ficha Rápida del Estudiante */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-4 shadow-sm">
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-500">
                Tu Estatus en este Track
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Progreso del Track:</span>
                  <span className="font-bold text-sap-blue">75%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                  <div className="h-full bg-sap-blue w-3/4 rounded-full" />
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-500">Sandbox Requerido:</span>
                <span className="font-semibold text-emerald-500">15h mínimas</span>
              </div>
              <Link
                href="/dashboard"
                className="block text-center w-full py-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all active:scale-95"
              >
                Ver Mi Expediente Completo
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
