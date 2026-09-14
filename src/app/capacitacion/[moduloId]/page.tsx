"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Server,
  Laptop,
  ShieldCheck,
  CheckCircle2,
  Award,
  BookOpen,
  Terminal,
  FileText,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Layers,
  Printer,
  Check,
  HelpCircle,
  Calculator,
  Compass,
  FileCode2,
  Briefcase,
  Clock
} from 'lucide-react';
import { TRAINING_TRACKS } from '@/lib/courses-data';
import { SUBMODULE_GUIDES } from '@/lib/submodules-content';
import { getModuleSimulation } from '@/lib/module-simulations-data';
import { ALL_83_MANUALS } from '@/lib/manuals-83-data';
import { VisualScreenSimulator } from '@/components/lms/VisualScreenSimulator';
import { VideoPlayer } from '@/components/lms/VideoPlayer';
import { LessonNavigator } from '@/components/lms/LessonNavigator';
import { EvaluationQuiz } from '@/components/lms/EvaluationQuiz';
import { InteractiveSimulator } from '@/components/lms/InteractiveSimulator';
import { QuickCheckQuiz } from '@/components/lms/QuickCheckQuiz';
import { recordLessonCompletion, recordExamResult, getStudentProfile } from '@/lib/student-service';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';

export default function ModuloLMSViewer({ params }: { params: Promise<{ moduloId: string }> }) {
  // Desempaquetado oficial React 19 / Next.js 15
  const resolvedParams = use(params);
  const moduloId = resolvedParams?.moduloId || 'sap-b1-core';

  const [activeLessonId, setActiveLessonId] = useState('l1');
  const [activeViewTab, setActiveViewTab] = useState<'all' | 'screen' | 'guide' | 'manuales' | 'sandbox' | 'quiz'>('all');
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  const [showToast, setShowToast] = useState(false);

  const track = TRAINING_TRACKS.find(t => t.id === moduloId) || TRAINING_TRACKS[0];

  // Sincronizar lecciones aprobadas reales desde el perfil del estudiante
  useEffect(() => {
    const student = getStudentProfile();
    const course = student.progress[track.id] || student.progress[track.code];
    if (course?.completedLessons) {
      const map: Record<string, boolean> = {};
      course.completedLessons.forEach(lid => {
        map[lid] = true;
      });
      setCompletedLessons(map);
    }
  }, [track.id, track.code]);

  // Soporte para selección directa de submódulo por URL (ej. ?sub=loc-02)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const subParam = urlParams.get('sub');
      if (subParam) {
        const foundIdx = track.submodules.findIndex(
          s => s.id === subParam || s.code.toLowerCase() === subParam.toLowerCase()
        );
        if (foundIdx !== -1) {
          setActiveLessonId(`l${foundIdx + 1}`);
        }
      }
    }
  }, [track]);

  // Lecciones dinámicas adaptadas al track seleccionado
  const dynamicLessons = track.submodules.map((sub, idx) => ({
    id: `l${idx + 1}`,
    title: `[${sub.level}] ${sub.title}`,
    durationMin: sub.durationHours * 5,
    isCompleted: !!completedLessons[`l${idx + 1}`],
    isLocked: false,
  }));

  const lessonIndex = Math.max(0, parseInt(activeLessonId.replace('l', '')) - 1);
  const activeSubmodule = track.submodules[lessonIndex] || track.submodules[0];
  const currentLesson = dynamicLessons[lessonIndex] || dynamicLessons[0];

  // Datos de Simulación visual y caso práctico para el submódulo activo
  const simulation = getModuleSimulation(activeSubmodule.id, track.code);

  // Manuales oficiales asociados de los 83 manuales
  const relatedManuals = ALL_83_MANUALS.filter(m =>
    simulation.relatedManualNumbers.includes(m.number)
  );

  // Guía técnica detallada si existe, o guía estructurada con datos reales
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
    setCompletedLessons(prev => ({ ...prev, [activeLessonId]: true }));
    recordLessonCompletion(track.id, activeLessonId);
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
  };

  const isCurrentCompleted = !!completedLessons[activeLessonId];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a] selection:bg-sap-blue selection:text-white">
      <Navbar />

      {/* Toast Notificación de Lección Completada */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-2xl flex items-center gap-3 transition-all animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <div className="text-xs">
            <p className="font-bold">¡Lección Registrada con Éxito!</p>
            <p className="text-emerald-100">Se ha actualizado tu expediente académico oficial.</p>
          </div>
        </div>
      )}

      <main className="flex-1 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 w-full">
        {/* BANNER MAESTRO DEL TRACK / PROGRAMA FORMATIVO OFICIAL */}
        <div className="p-6 sm:p-8 rounded-3xl border border-sap-blue/30 bg-gradient-to-br from-sap-blue/10 via-sky-500/5 to-white dark:to-white/[0.02] shadow-sm space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3">
              {/* Breadcrumb de Navegación & Badges Oficiales */}
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/capacitacion"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-sap-blue hover:text-sky-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Todas las Especialidades
                </Link>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-lg bg-sap-blue text-white shadow-sm">
                  {track.code}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm">
                  {track.badge}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  {track.category}
                </span>
              </div>

              {/* Título Principal del Track Completo */}
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Programa Especializado de Certificación
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight mt-1">
                  {track.title}
                </h1>
              </div>

              {/* Descripción Oficial del Track */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
                {track.description}
              </p>

              {/* Métricas y Audiencia del Programa */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1.5 font-bold text-sap-blue">
                  <Clock className="w-4 h-4" /> {track.totalDurationHours} Horas Lectivas
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                  <Layers className="w-4 h-4 text-sky-500" /> {track.submodules.length} Submódulos Especializados
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Briefcase className="w-4 h-4 text-emerald-500" /> Dirigido a: {track.targetAudience}
                </span>
              </div>
            </div>

            {/* Acciones de Certificación y Ficha */}
            <div className="flex flex-wrap lg:flex-col items-end gap-2.5 shrink-0">
              <button
                onClick={handleLessonComplete}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-2 cursor-pointer ${isCurrentCompleted
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-gradient-to-r from-sap-blue to-sky-600 hover:from-sky-600 hover:to-sap-blue text-white shadow-md shadow-sap-blue/20'
                  }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {isCurrentCompleted ? 'Submódulo Completado' : 'Aprobar Submódulo'}
              </button>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 transition-all cursor-pointer active:scale-95 text-xs font-semibold flex items-center gap-1.5"
                title="Imprimir o Guardar Ficha Oficial en PDF"
              >
                <Printer className="w-4 h-4" /> Imprimir Ficha
              </button>
            </div>
          </div>

          {/* SELECTOR HORIZONTAL DE LOS 6 SUBMÓDULOS DEL PROGRAMA */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Submódulos del Programa ({track.submodules.length} Temas Específicos):
              </span>
              <span className="text-[11px] font-mono font-bold text-sap-blue">
                Cursando actualmente: Submódulo #{lessonIndex + 1} de {track.submodules.length}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {track.submodules.map((sub, sIdx) => {
                const isSelected = activeLessonId === `l${sIdx + 1}`;
                const isDone = !!completedLessons[`l${sIdx + 1}`];
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setActiveLessonId(`l${sIdx + 1}`);
                      if (activeViewTab !== 'all') {
                        setActiveViewTab('all');
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${isSelected
                      ? 'bg-sap-blue text-white border-sap-blue shadow-md shadow-sap-blue/30 scale-[1.02]'
                      : 'bg-white/90 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-sap-blue/40 text-slate-700 dark:text-slate-300'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`text-[10px] font-mono font-extrabold ${isSelected ? 'text-sky-200' : 'text-slate-500'}`}>
                        0{sIdx + 1} • {sub.code}
                      </span>
                      {isDone && (
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-500'}`} />
                      )}
                    </div>
                    <p className={`text-[11px] font-bold leading-tight line-clamp-2 ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                      {sub.title.split(':')[0]}
                    </p>
                    <span className={`text-[9px] font-bold mt-1.5 px-1.5 py-0.5 rounded w-fit ${isSelected
                      ? 'bg-white/20 text-white'
                      : sub.level === 'ARQ'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-sap-blue/10 text-sap-blue'
                      }`}>
                      {sub.level} • {sub.durationHours}h
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* FICHA DE CONTEXTO DEL SUBMÓDULO ACTIVO */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-sm space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              Submódulo Activo #{lessonIndex + 1} de {track.submodules.length}
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
              Código: {activeSubmodule.code}
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${activeSubmodule.level === 'ARQ'
              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              }`}>
              {activeSubmodule.level === 'ARQ' ? 'Nivel Arquitectura [ARQ] (Parametrización)' : 'Nivel Operativo [OP] (Ejecución Transaccional)'}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              • Carga Lectiva: {activeSubmodule.durationHours} Horas
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
            {activeSubmodule.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
            {activeSubmodule.description}
          </p>

          {/* ROADMAP METODOLÓGICO: CÓMO FUNCIONA CADA LECCIÓN (4 PASOS REALES) */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-sap-blue/10 via-sky-500/5 to-transparent border border-sap-blue/20 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sap-blue animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-sap-blue dark:text-sky-400">
                  Metodología Oficial de Aprendizaje • Lección {lessonIndex + 1} de {dynamicLessons.length}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Aprende ➔ Simula ➔ Cuadra Asiento ➔ Certifica
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-white/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-sap-blue">
                  <span className="w-5 h-5 rounded-lg bg-sap-blue/10 flex items-center justify-center text-[10px]">1</span>
                  1. Marco y Objetivos
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  Video, transcripción didáctica y leyes SRI / IESS aplicables.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-sky-500">
                  <span className="w-5 h-5 rounded-lg bg-sky-500/10 flex items-center justify-center text-[10px]">2</span>
                  2. Pantalla ERP en Vivo
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  Ventana interactiva con campos, RUCs y valores ecuatorianos.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-5 h-5 rounded-lg bg-emerald-500/10 flex items-center justify-center text-[10px]">3</span>
                  3. Matemática & Asiento OJDT
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  Cálculo al centavo y balance contable obligatorio Debe = Haber.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-500">
                  <span className="w-5 h-5 rounded-lg bg-amber-500/10 flex items-center justify-center text-[10px]">4</span>
                  4. Autoevaluación Práctica
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  3 preguntas situacionales de consultor para aprobar el tema.
                </p>
              </div>
            </div>
          </div>

          {/* Barra de Filtros / Pestañas Didácticas */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-white/5 select-none">
            <button
              onClick={() => setActiveViewTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${activeViewTab === 'all'
                ? 'bg-sap-blue text-white shadow-md shadow-sap-blue/25'
                : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Aula Completa (Recomendado)
            </button>

            <button
              onClick={() => setActiveViewTab('screen')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${activeViewTab === 'screen'
                ? 'bg-gradient-to-r from-sap-blue to-sky-600 text-white shadow-md shadow-sap-blue/25'
                : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
            >
              <Laptop className="w-3.5 h-3.5" /> Pantalla ERP y Caso
            </button>

            <button
              onClick={() => setActiveViewTab('guide')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${activeViewTab === 'guide'
                ? 'bg-sap-blue text-white shadow-md shadow-sap-blue/25'
                : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
            >
              <FileText className="w-3.5 h-3.5" /> Guía y Procedimiento
            </button>

            <button
              onClick={() => setActiveViewTab('manuales')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${activeViewTab === 'manuales'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Manuales Oficiales ({relatedManuals.length})
            </button>

            <button
              onClick={() => setActiveViewTab('sandbox')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${activeViewTab === 'sandbox'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
            >
              <Terminal className="w-3.5 h-3.5" /> Consola Sandbox
            </button>

            <button
              onClick={() => setActiveViewTab('quiz')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${activeViewTab === 'quiz'
                ? 'bg-amber-500 text-slate-900 font-extrabold shadow-md shadow-amber-500/25'
                : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" /> Autoevaluación & Examen
            </button>
          </div>
        </div>

        {/* CONTENEDOR PRINCIPAL: Contenido Principal + Navegador Lateral */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            {/* SECCIÓN 1: REPRODUCTOR MULTIMEDIA & TRANSCRIPCIÓN DIDÁCTICA */}
            {(activeViewTab === 'all') && (
              <div className="space-y-4">
                <VideoPlayer
                  title={`${track.shortTitle}: Submódulo ${lessonIndex + 1} - ${activeSubmodule.title}`}
                  durationMin={currentLesson.durationMin}
                  systemType={`SAP Business One v10.0 • ${track.shortTitle}`}
                  transactionCode={simulation.transactionCode}
                  onComplete={handleLessonComplete}
                />

                {/* Síntesis Ejecutiva & Transcripción de la Clase */}
                <div className="p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-sap-blue animate-pulse" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Síntesis Didáctica & Transcripción de la Lección
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 italic">
                      Docente: {simulation.classTranscript.instructor}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                    {simulation.classTranscript.summary}
                  </p>

                  {/* Puntos Clave / Key Takeaways (GEO Standard) */}
                  <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/20 border border-sky-500/20 space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-sap-blue dark:text-sky-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Puntos Críticos de la Lección (Key Takeaways):
                    </div>
                    <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                      {simulation.classTranscript.keyPoints.map((point, pIdx) => (
                        <li key={pIdx} className="leading-relaxed">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                    <strong>Profundización Técnica:</strong> {simulation.classTranscript.deepDiveText}
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN 2: SIMULADOR VISUAL DE PANTALLA ERP Y CASO PRÁCTICO NUMÉRICO */}
            {(activeViewTab === 'all' || activeViewTab === 'screen') && (
              <div className="space-y-4">
                <VisualScreenSimulator
                  systemType={simulation.systemType}
                  windowTitle={simulation.windowTitle}
                  transactionCode={simulation.transactionCode}
                  screenSummary={simulation.screenSummary}
                  interactiveFields={simulation.interactiveFields}
                  workedExample={simulation.workedExample}
                />
              </div>
            )}

            {/* SECCIÓN 3: PROCEDIMIENTO TÉCNICO Y MARCO REGULATORIO */}
            {(activeViewTab === 'all' || activeViewTab === 'guide') && (
              <div className="space-y-6">
                {/* Resumen Funcional & Caso de Estudio Ecuatoriano */}
                <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full w-fit ${activeSubmodule.level === 'ARQ'
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
                          <span className="w-7 h-7 rounded-xl bg-sap-blue text-white flex items-center justify-center text-xs font-bold shrink-0 font-mono">
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

            {/* SECCIÓN 4: MANUALES OFICIALES ASOCIADOS (83 MANUALES) */}
            {(activeViewTab === 'all' || activeViewTab === 'manuales') && (
              <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
                      <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      Manuales Técnicos Oficiales del Ecosistema ({relatedManuals.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Documentación técnica oficial correspondiente a esta lección extraída del catálogo de Manuales.
                    </p>
                  </div>
                  <Link
                    href="/manuales"
                    className="text-xs font-bold text-sap-blue hover:underline inline-flex items-center gap-1"
                  >
                    Ver los Manuales <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedManuals.map((manual) => (
                    <div
                      key={manual.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] hover:border-purple-500/40 transition-all space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                            Manual #{manual.number < 10 ? `0${manual.number}` : manual.number} • Bloque {manual.block}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${manual.level === 'ARQ'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-sap-blue/10 text-sap-blue'
                            }`}>
                            {manual.level}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                          {manual.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                          {manual.summary}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">{manual.category}</span>
                        <Link
                          href={`/manuales?search=${encodeURIComponent(manual.title)}`}
                          className="font-bold text-sap-blue hover:underline inline-flex items-center gap-0.5"
                        >
                          Consultar <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECCIÓN 5: LABORATORIO PRÁCTICO & CONSOLA SANDBOX */}
            {(activeViewTab === 'all' || activeViewTab === 'sandbox') && (
              <div className="space-y-4">
                <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    <Terminal className="w-4 h-4" /> Desafío Práctico de Laboratorio
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                    {simulation.practiceLab.title}
                  </h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong>Misión del Estudiante:</strong> {simulation.practiceLab.mission}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-mono bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/20">
                    <strong>Resultado Esperado:</strong> {simulation.practiceLab.expectedResult}
                  </p>
                </div>

                <InteractiveSimulator
                  trackCode={track.code}
                  submoduleCode={activeSubmodule.code}
                />
              </div>
            )}

            {/* SECCIÓN 6: AUTOEVALUACIÓN RÁPIDA DE LA LECCIÓN (3 PREGUNTAS CLAVE) */}
            {(activeViewTab === 'all' || activeViewTab === 'quiz') && (
              <div className="space-y-6">
                <QuickCheckQuiz
                  questions={simulation.quickCheckQuestions}
                  submoduleCode={activeSubmodule.code}
                />

                {/* Examen Oficial de Certificación del Track */}
                <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
                        <Award className="w-5 h-5 text-amber-500" />
                        Examen Oficial de Certificación del Track: {track.shortTitle}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Evaluación integral de 3 preguntas de certificación. Mínimo 70% para aprobar y registrar el resultado en tu expediente.
                      </p>
                    </div>
                  </div>

                  <EvaluationQuiz
                    trackCode={track.code}
                    onPassed={handleQuizPassed}
                  />
                </div>
              </div>
            )}

            {/* BARRA DE NAVEGACIÓN Y AVANCE ENTRE LECCIONES */}
            <div className="p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                  ¿Finalizaste este tema?
                </p>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Lección actual: #{lessonIndex + 1} de {dynamicLessons.length} • {activeSubmodule.title}
                </h4>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {lessonIndex > 0 && (
                  <button
                    onClick={() => {
                      const prevId = `l${lessonIndex}`;
                      setActiveLessonId(prevId);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer active:scale-95"
                  >
                    ← Anterior
                  </button>
                )}

                <button
                  onClick={() => {
                    handleLessonComplete();
                    if (lessonIndex < dynamicLessons.length - 1) {
                      const nextId = `l${lessonIndex + 2}`;
                      setActiveLessonId(nextId);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }
                  }}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-sap-blue hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-md shadow-sap-blue/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {lessonIndex < dynamicLessons.length - 1
                    ? `Aprobar y Pasar a la Lección #${lessonIndex + 2} ➔`
                    : '¡Completar Última Lección y Finalizar Track! 🏆'}
                </button>
              </div>
            </div>
          </div>

          {/* TEMARIO Y NAVEGACIÓN LATERAL (COLUMNA DERECHA) */}
          <div className="space-y-6">
            <LessonNavigator
              lessons={dynamicLessons}
              activeLessonId={activeLessonId}
              trackTitle={track.title}
              trackCode={track.code}
              onSelectLesson={(id) => {
                setActiveLessonId(id);
                // Si estaba en examen u otra pestaña, vuelve a aula completa para mostrar el nuevo módulo
                if (activeViewTab !== 'all') {
                  setActiveViewTab('all');
                }
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
                  <span className="font-bold text-sap-blue font-mono">
                    {Math.round((Object.keys(completedLessons).length / dynamicLessons.length) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                  <div
                    className={`h-full bg-sap-blue rounded-full transition-all duration-500 ${Math.round((Object.keys(completedLessons).length / dynamicLessons.length) * 100) >= 100
                      ? 'w-full'
                      : Math.round((Object.keys(completedLessons).length / dynamicLessons.length) * 100) >= 75
                        ? 'w-3/4'
                        : Math.round((Object.keys(completedLessons).length / dynamicLessons.length) * 100) >= 50
                          ? 'w-1/2'
                          : Math.round((Object.keys(completedLessons).length / dynamicLessons.length) * 100) >= 25
                            ? 'w-1/4'
                            : 'w-2'
                      }`}
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-500">Horas de Sandbox:</span>
                <span className="font-semibold text-emerald-500 font-mono">18 / 100 Horas</span>
              </div>
              <Link
                href="/dashboard"
                className="block text-center w-full py-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all active:scale-95"
              >
                Ver Mi Expediente Completo
              </Link>
            </div>

            {/* Acceso a Biblioteca de Manuales */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                <BookOpen className="w-4 h-4" /> Recursos Oficiales
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Biblioteca de Manuales Técnicos
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Revisa los manuales operativos y de arquitectura organizados por bloques de la A a la K.
              </p>
              <Link
                href="/manuales"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
              >
                Abrir Biblioteca de Manuales <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>

            {/* Acceso a Bolsa de Empleo */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                <Briefcase className="w-4 h-4" /> Inserción Laboral
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Bolsa de Empleo & Oportunidades
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Vacantes activas en empresas ecuatorianas usuarias de SAP Business One y Heinsohn.
              </p>
              <Link
                href="/bolsa-empleo"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Explorar Ofertas Laborales <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
