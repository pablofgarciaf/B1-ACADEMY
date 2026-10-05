'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useAcademyVoice } from '@/hooks/useAcademyVoice';
import { OFFICIAL_SYLLABUS } from '@/lib/curriculum-data';
import SAPInteractiveSimulator from '@/components/simulator/SAPInteractiveSimulator';
import { GraduationCap, BookOpen, CheckCircle2, Award, Bot, Volume2, VolumeX, ArrowRight, ShieldCheck, Check, Lock, PanelLeftClose, PanelLeftOpen, Send, ChevronRight, RotateCcw } from 'lucide-react';

// =============================================
// Types
// =============================================
interface StepGuide {
  action_type: string;
  menu_path?: string;
  title: string;
  instructions: string[];
}

interface SyncSlide {
  slide_index: number;
  script_text: string;
  step_guide: StepGuide | null;
}

interface LessonData {
  classId: string;
  title: string;
  category: string;
  number: number;
  totalSlides: number;
  images: string[];
  syncData: SyncSlide[];
  quizQuestions: any[];
}

// =============================================
// Main Component
// =============================================
export default function AulaModuloPage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { currentUser, userProfile } = useAuth();

  // Resolve params
  const [moduleId, setModuleId] = useState<string>('');
  useEffect(() => {
    params.then(p => setModuleId(p.moduleId));
  }, [params]);

  // Module info
  const moduleInfo = useMemo(() =>
    OFFICIAL_SYLLABUS.find(m => m.id === moduleId),
    [moduleId]
  );
  const moduleClasses = moduleInfo?.classes ?? [];

  // Active class
  const [activeClassId, setActiveClassId] = useState<string>('');
  useEffect(() => {
    if (moduleClasses.length > 0 && !activeClassId) {
      setActiveClassId(moduleClasses[0].id);
    }
  }, [moduleClasses, activeClassId]);

  // Lesson data
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);

  // Class flow
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [phase, setPhase] = useState<'narrating' | 'simulator' | 'mission_done'>('narrating');
  const [completedClasses, setCompletedClasses] = useState<Record<string, boolean>>({});

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Speech
  const { isSpeaking, isMuted, needsGesture, speakText, stopSpeaking, toggleMute, resumeAfterGesture, preload } = useAcademyVoice();

  // =============================================
  // Load lesson data when class changes
  // =============================================
  useEffect(() => {
    if (!activeClassId || !currentUser || !moduleInfo) return;
    let isMounted = true;
    setIsLoadingLesson(true);
    setCurrentSlideIndex(0);
    setPhase('narrating');
    stopSpeaking();

    currentUser.getIdToken()
      .then(token =>
        fetch(`/api/lesson-data?moduleId=${encodeURIComponent(moduleInfo.id)}&classId=${encodeURIComponent(activeClassId)}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      )
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (isMounted && data) setLessonData(data);
      })
      .catch(() => {})
      .finally(() => { if (isMounted) setIsLoadingLesson(false); });

    return () => {
      isMounted = false;
      stopSpeaking();
    };
  }, [activeClassId, currentUser, moduleInfo, stopSpeaking]);

  // =============================================
  // Derived state
  // =============================================
  const currentSync = useMemo(() =>
    lessonData?.syncData?.find(s => s.slide_index === currentSlideIndex + 1) || null,
    [lessonData, currentSlideIndex]
  );

  const currentStepGuide = currentSync?.step_guide || null;
  const slideScript = currentSync?.script_text || '';
  // Si una narración no tiene lámina propia, se mantiene la última imagen de la clase en vez de un hueco vacío.
  const lessonImages = lessonData?.images ?? [];
  const activeSlideImage = lessonImages[Math.min(currentSlideIndex, lessonImages.length - 1)] || null;
  const hasSimulatorStep = !!currentStepGuide;

  // Descarga anticipada de la siguiente narración: sin silencios entre láminas.
  useEffect(() => {
    const next = lessonData?.syncData?.find(s => s.slide_index === currentSlideIndex + 2);
    if (next?.script_text) preload(next.script_text);
  }, [lessonData, currentSlideIndex, preload]);

  // =============================================
  // NARRATION → auto-trigger when slide changes
  // =============================================
  useEffect(() => {
    if (phase !== 'narrating' || !slideScript) return;

    // Lámina con práctica: se abre el simulador de inmediato y la narración continúa sobre él.
    if (hasSimulatorStep) {
      setPhase('simulator');
      return;
    }

    speakText(slideScript, () => setPhase('mission_done'));

    return () => { stopSpeaking(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentSlideIndex, lessonData]);

  // =============================================
  // SIMULATOR ENTRY → read instructions
  // =============================================
  useEffect(() => {
    if (phase === 'simulator' && currentStepGuide) {
      // Explicación de la lámina + instrucciones, narradas mientras el estudiante ya ve el simulador.
      const instText = currentStepGuide.instructions.map(i => i.replace(/\.$/, '')).join('. ');
      speakText(`${slideScript} ${instText}.`.trim());
    }
  }, [phase, currentStepGuide, slideScript, speakText]);

  // =============================================
  // MISSION DONE → advance slide or complete class
  // =============================================
  useEffect(() => {
    if (phase !== 'mission_done') return;
    const totalSlides = lessonData?.totalSlides || 0;

    const timer = setTimeout(() => {
      if (currentSlideIndex < totalSlides - 1) {
        setCurrentSlideIndex(prev => prev + 1);
        setPhase('narrating');
      } else {
        handleMarkLessonComplete();
      }
    }, 1200);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // =============================================
  // Mission complete callback from simulator
  // =============================================
  const handleMissionComplete = useCallback(() => {
    setPhase('mission_done');
  }, []);

  // =============================================
  // Progress & lessons
  // =============================================
  useEffect(() => {
    if (moduleInfo && currentUser) {
      currentUser.getIdToken()
        .then(token => fetch(`/api/progress?moduleId=${encodeURIComponent(moduleInfo.id)}`, { headers: { Authorization: `Bearer ${token}` } }))
        .then(r => r.ok ? r.json() : { completedClasses: [] })
        .then((data: { completedClasses: string[] }) =>
          setCompletedClasses(Object.fromEntries(data.completedClasses.map(id => [id, true])))
        )
        .catch(() => setCompletedClasses({}));
    }
  }, [moduleInfo, currentUser]);

  const handleMarkLessonComplete = useCallback(() => {
    if (!currentUser || !moduleInfo) return;
    currentUser.getIdToken().then(token =>
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ moduleId: moduleInfo.id, classId: activeClassId })
      })
    ).then(() => {
      setCompletedClasses(prev => ({ ...prev, [activeClassId]: true }));
      // Auto-advance to next class
      const idx = moduleClasses.findIndex(c => c.id === activeClassId);
      if (idx >= 0 && idx < moduleClasses.length - 1) {
        setTimeout(() => handleSelectClass(moduleClasses[idx + 1].id), 1500);
      }
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, moduleInfo, activeClassId, moduleClasses]);

  const handleSelectClass = useCallback((classId: string) => {
    if (classId === activeClassId) return;
    stopSpeaking();
    setActiveClassId(classId);
  }, [activeClassId, stopSpeaking]);

  const handleRestart = useCallback(() => {
    stopSpeaking();
    setCurrentSlideIndex(0);
    setPhase('narrating');
  }, [stopSpeaking]);

  const totalLessons = moduleClasses.length;
  const completedCount = Object.keys(completedClasses).filter(id => completedClasses[id]).length;

  // =============================================
  // NOT FOUND
  // =============================================
  if (moduleId && !moduleInfo) {
    return (
      <div className="min-h-screen flex flex-col bg-[#070b14] text-white items-center justify-center p-6 text-center">
        <GraduationCap className="w-12 h-12 text-amber-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Módulo no encontrado</h1>
        <p className="text-sm text-gray-400 mb-6">El módulo seleccionado no existe en el curriculum.</p>
        <Link href="/mi-aula" className="px-5 py-2.5 rounded-xl bg-amber-600 font-bold text-xs">
          Volver a Mi Aula
        </Link>
      </div>
    );
  }

  // =============================================
  // RENDER
  // =============================================
  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-gray-100">

      {/* ── BARRA SUPERIOR (sin Navbar global) ── */}
      <header className="sticky top-0 z-30 bg-[#0e1620]/95 backdrop-blur-md border-b border-gray-800 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {/* Back */}
          <Link
            href="/mi-aula"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all shrink-0"
            title="Volver a Mi Aula"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <div className="w-px h-6 bg-gray-800 shrink-0" />
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all shrink-0"
            title={sidebarOpen ? 'Cerrar Temario' : 'Abrir Temario'}
          >
            {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400 truncate">
              Módulo {moduleInfo?.number}: {moduleInfo?.title}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {lessonData?.title || 'Cargando clase...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Phase indicator */}
          {phase === 'mission_done' && (
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> ¡Completado!
            </span>
          )}
          {phase === 'narrating' && isSpeaking && (
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold animate-pulse">
              <BookOpen className="w-3.5 h-3.5" /> Narrando...
            </span>
          )}
          {phase === 'simulator' && (
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Simulador
            </span>
          )}

          {/* Restart */}
          <button
            onClick={handleRestart}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
            title="Reiniciar clase"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Mute */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
            title={isMuted ? 'Activar audio' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Oral exam */}
          <Link
            href={`/mi-aula/${moduleId}/oral-exam`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-semibold transition-all active:scale-95"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Evaluación Oral</span>
          </Link>
        </div>
      </header>

      {/* ── MAIN LAYOUT ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ── SIDEBAR ── */}
        {sidebarOpen && (
          <aside className="w-60 shrink-0 bg-[#0a1018] border-r border-gray-800 flex flex-col overflow-y-auto">
            {/* Student card */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-sm shrink-0">
                  {(userProfile?.displayName || userProfile?.name || 'U')[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    {userProfile?.displayName || userProfile?.name || 'Estudiante'}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">{currentUser?.email}</p>
                </div>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Progreso en Módulo</p>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs text-gray-300">{completedCount} de {totalLessons} ({Math.round((completedCount/Math.max(totalLessons,1))*100)}%)</p>
              </div>
              <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                  style={{ width: `${(completedCount/Math.max(totalLessons,1))*100}%` }}
                />
              </div>
            </div>

            {/* Certificate lock */}
            <div className="p-3 mx-3 my-3 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Award className="w-3 h-3" /> Certificado
                </span>
                {completedCount < totalLessons ? (
                  <span className="text-[10px] bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded-md font-medium flex items-center gap-0.5">
                    <Lock className="w-2.5 h-2.5" /> Bloqueado
                  </span>
                ) : (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-md font-medium">¡Listo!</span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Completa todas las clases y aprueba la evaluación oral con Tutor IA.
              </p>
              <Link
                href={`/mi-aula/${moduleId}/oral-exam`}
                className={`mt-2 w-full flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  completedCount >= totalLessons
                    ? 'bg-amber-500 text-slate-900 hover:bg-amber-400 active:scale-95'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed pointer-events-none'
                }`}
              >
                Ir a Evaluación Oral
              </Link>
            </div>

            {/* Class list */}
            <div className="px-3 pb-4 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                Temario Oficial ({totalLessons} Clases)
              </p>
              {moduleClasses.map(cls => {
                const isActive = cls.id === activeClassId;
                const isDone = !!completedClasses[cls.id];
                return (
                  <button
                    key={cls.id}
                    onClick={() => handleSelectClass(cls.id)}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer mb-1 ${
                      isActive
                        ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                        : 'hover:bg-gray-800/60 text-gray-400 hover:text-gray-200 border border-transparent'
                    }`}
                  >
                    <div className={`h-5 w-5 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-bold ${
                      isDone ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      isActive ? 'bg-amber-500 text-slate-950' :
                      'bg-gray-800 text-gray-500 border border-gray-700'
                    }`}>
                      {isDone ? <Check className="w-3 h-3" /> : cls.number}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{cls.title}</p>
                      <p className="text-[10px] text-gray-500">{cls.durationMinutes} min</p>
                    </div>
                    {isActive && !isDone && (
                      <ChevronRight className="w-3 h-3 text-amber-400 shrink-0 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* ── CONTENT AREA ── */}
        <main className="flex-1 min-w-0 flex flex-col overflow-hidden">

          {isLoadingLesson ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-400">Cargando clase...</p>
              </div>
            </div>
          ) : phase === 'mission_done' && currentSlideIndex >= (lessonData?.totalSlides ?? 1) - 1 ? (
            /* ── COMPLETED ── */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">¡Misión Completada!</h3>
              <p className="text-sm text-gray-400">Avanzando a la siguiente diapositiva...</p>
            </div>

          ) : phase === 'simulator' && currentStepGuide ? (
            /* ── SIMULATOR PHASE ── */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Glowing instructions bar */}
              <div className="shrink-0 mx-4 mt-3 p-3 rounded-xl bg-gradient-to-r from-blue-900/60 to-blue-800/40 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                    📋 {currentStepGuide.title}
                  </p>
                  {isSpeaking && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300 animate-pulse">
                      <Bot className="w-3.5 h-3.5" /> Tutor IA explicando...
                    </span>
                  )}
                  {needsGesture && (
                    <button
                      onClick={resumeAfterGesture}
                      className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-bold hover:bg-amber-400 active:scale-95"
                    >
                      <Volume2 className="w-3 h-3" /> Activar voz
                    </button>
                  )}
                </div>
                {slideScript && <p className="text-xs text-blue-100/80 mb-2 leading-relaxed">{slideScript}</p>}
                <ol className="space-y-1">
                  {currentStepGuide.instructions.map((inst, i) => (
                    <li key={i} className="text-xs text-blue-100 flex gap-2">
                      <span className="shrink-0 w-4 h-4 rounded-full bg-blue-500/30 text-blue-300 flex items-center justify-center text-[9px] font-bold">{i+1}</span>
                      {inst}
                    </li>
                  ))}
                </ol>
              </div>
              {/* Simulator */}
              <div className="flex-1 min-h-0 mt-3 px-4 pb-4 overflow-hidden">
                <SAPInteractiveSimulator
                  manualId={activeClassId}
                  currentStepIndex={currentSlideIndex}
                  stepGuide={currentStepGuide}
                  onMissionComplete={handleMissionComplete}
                />
              </div>
            </div>

          ) : (
            /* ── NARRATION PHASE ── */
            <div className="flex-1 flex flex-col overflow-y-auto">
              {/* Slide image */}
              <div className="relative bg-[#0a0a10]">
                {activeSlideImage ? (
                  <Image
                    src={activeSlideImage}
                    alt={`Diapositiva ${currentSlideIndex + 1}`}
                    width={1920}
                    height={1080}
                    unoptimized
                    className="w-full max-h-[52vh] object-contain mx-auto"
                    priority={currentSlideIndex === 0}
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-[#0e1620] to-[#131a28]">
                    <div className="text-center">
                      <BookOpen className="w-10 h-10 text-amber-500/60 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">{lessonData?.title}</p>
                    </div>
                  </div>
                )}
                {/* Aviso: la narración que sigue lleva a una práctica en el simulador */}
                {hasSimulatorStep && currentStepGuide && (
                  <div className="absolute top-3 left-3 max-w-[70%] px-3 py-2 rounded-lg bg-blue-950/85 border border-blue-500/40 text-blue-100 text-xs font-semibold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-300 shrink-0" />
                    <span className="truncate">Próxima práctica: {currentStepGuide.title}</span>
                  </div>
                )}
                {/* Slide counter */}
                {lessonData && (
                  <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-mono">
                    {currentSlideIndex + 1}/{lessonData.totalSlides}
                  </div>
                )}
              </div>

              {/* Narration text */}
              {slideScript && (
                <div className="p-4 border-t border-gray-800 bg-[#0e1620]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                      isSpeaking
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                        : 'bg-gray-800 text-gray-400'
                    }`}>
                      <Bot className="w-3.5 h-3.5" />
                      {isSpeaking ? 'Tutor IA explicando...' : 'Tutor IA'}
                    </div>
                    {needsGesture && (
                      <button
                        onClick={resumeAfterGesture}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 active:scale-95 transition-all"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Activar la voz del tutor
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed font-medium">
                    {slideScript}
                  </p>
                </div>
              )}

              {/* Oral exam notice (last slide) */}
              {lessonData && currentSlideIndex === lessonData.totalSlides - 1 && !hasSimulatorStep && (
                <div className="p-4 bg-[#070b14] border-t border-purple-500/20">
                  <div className="rounded-xl bg-purple-500/10 border border-purple-500/30 p-3 flex items-start gap-3">
                    <Award className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-purple-300 mb-1">Evaluación Oral con Tutor IA</p>
                      <p className="text-[11px] text-gray-400">
                        {completedCount >= totalLessons
                          ? '¡Todas las clases completadas! Puedes iniciar tu evaluación.'
                          : 'Completa todas las clases para habilitar el examen de grado.'}
                      </p>
                      {completedCount >= totalLessons && (
                        <Link
                          href={`/mi-aula/${moduleId}/oral-exam`}
                          className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 active:scale-95 transition-all"
                        >
                          Iniciar Evaluación <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

