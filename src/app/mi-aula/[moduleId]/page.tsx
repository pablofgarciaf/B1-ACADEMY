'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useAcademyVoice } from '@/hooks/useAcademyVoice';
import { OFFICIAL_SYLLABUS } from '@/lib/curriculum-data';
import type { IntentoPractica } from '@/lib/practice-check';
import { getCompany } from '@/lib/firestore-company';
import PasoCeroEmpresa from '@/components/lms/PasoCeroEmpresa';
import SAPInteractiveSimulator from '@/components/simulator/SAPInteractiveSimulator';
import { GraduationCap, BookOpen, CheckCircle2, Award, Bot, Volume2, VolumeX, ArrowRight, ShieldCheck, Check, Lock, PanelLeftClose, PanelLeftOpen, ChevronRight, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';

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
  const moduleClasses = useMemo(() => moduleInfo?.classes ?? [], [moduleInfo]);

  // Active class
  const [activeClassId, setActiveClassId] = useState<string>('');
  useEffect(() => {
    if (moduleClasses.length > 0 && !activeClassId) {
      setActiveClassId(moduleClasses[0].id);
    }
  }, [moduleClasses, activeClassId]);

  // Paso 0: la clase no arranca (ni la narración) hasta que el estudiante tenga su empresa de práctica.
  // Si la consulta falla por red, no se bloquea la clase.
  const [empresaEstado, setEmpresaEstado] = useState<'cargando' | 'falta' | 'ok'>('cargando');
  useEffect(() => {
    if (!currentUser) return;
    let activo = true;
    getCompany(currentUser.uid)
      .then(s => { if (activo) setEmpresaEstado(s.profile ? 'ok' : 'falta'); })
      .catch(() => { if (activo) setEmpresaEstado('ok'); });
    return () => { activo = false; };
  }, [currentUser]);

  // Módulo 1 = inducción obligatoria: los demás módulos se abren al completarlo (el servidor también lo exige).
  const [induccionLista, setInduccionLista] = useState<boolean | null>(null);
  useEffect(() => {
    if (!currentUser || !moduleId) return;
    const sinRequisito = moduleId === 'mod-1' || ['super', 'admin', 'docente'].includes(userProfile?.role ?? '');
    if (sinRequisito) { setInduccionLista(true); return; }
    const totalMod1 = OFFICIAL_SYLLABUS.find(m => m.id === 'mod-1')?.classes.length ?? 0;
    let activo = true;
    currentUser.getIdToken()
      .then(token => fetch('/api/progress?moduleId=mod-1', { headers: { Authorization: `Bearer ${token}` } }))
      .then(r => (r.ok ? r.json() : { completedClasses: [] }))
      .then((d: { completedClasses?: string[] }) => { if (activo) setInduccionLista((d.completedClasses ?? []).length >= totalMod1); })
      .catch(() => { if (activo) setInduccionLista(true); }); // sin red no se bloquea: el servidor decide
    return () => { activo = false; };
  }, [currentUser, moduleId, userProfile?.role]);

  // Lesson data
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);
  const [lessonError, setLessonError] = useState<string | null>(null);
  const [progressError, setProgressError] = useState<string | null>(null);
  const [restartKey, setRestartKey] = useState(0);
  const [retrySave, setRetrySave] = useState(0);
  const [lessonSaved, setLessonSaved] = useState(false);

  // Class flow
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [phase, setPhase] = useState<'narrating' | 'simulator' | 'mission_done'>('narrating');
  const [completedClasses, setCompletedClasses] = useState<Record<string, boolean>>({});
  const [passedPractices, setPassedPractices] = useState<string[]>([]);
  const [requiredPractices, setRequiredPractices] = useState<string[]>([]);
  const [practiceNotice, setPracticeNotice] = useState<string | null>(null);

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => { setSidebarOpen(window.matchMedia('(min-width: 1024px)').matches); }, []);

  // Pantalla completa: el estado se sincroniza con el evento del navegador
  // (así también se actualiza si el estudiante sale con Esc).
  const [pantallaCompleta, setPantallaCompleta] = useState(false);
  useEffect(() => {
    const sync = () => setPantallaCompleta(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);
  const alternarPantallaCompleta = () => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    else void document.documentElement.requestFullscreen?.().catch(() => {});
  };

  // Narración larga en el panel de instrucciones: recortada a 2 líneas por defecto
  const [narracionAbierta, setNarracionAbierta] = useState(false);

  // Speech
  const { isSpeaking, isMuted, needsGesture, speakText, stopSpeaking, toggleMute, resumeAfterGesture, preload, velocidad, cambiarVelocidad } = useAcademyVoice();

  // =============================================
  // Load lesson data when class changes
  // =============================================
  useEffect(() => {
    if (!activeClassId || !currentUser || !moduleInfo || empresaEstado !== 'ok' || induccionLista !== true) return;
    let isMounted = true;
    const controller = new AbortController();
    setIsLoadingLesson(true);
    setLessonData(null);
    setLessonError(null);
    setProgressError(null);
    setLessonSaved(false);
    setCurrentSlideIndex(0);
    setPhase('narrating');
    stopSpeaking();

    currentUser.getIdToken()
      .then(token =>
        fetch(`/api/lesson-data?moduleId=${encodeURIComponent(moduleInfo.id)}&classId=${encodeURIComponent(activeClassId)}`, {
          signal: controller.signal,
          headers: { Authorization: `Bearer ${token}` }
        })
      )
      .then(r => { if (!r.ok) throw new Error('lesson-load'); return r.json(); })
      .then(data => {
        if (data?.classId !== activeClassId || !data.syncData?.length) throw new Error('lesson-data');
        if (isMounted) setLessonData(data);
      })
      .catch(() => { if (isMounted) setLessonError('No se pudo cargar esta clase. Vuelve a intentarlo.'); })
      .finally(() => { if (isMounted) setIsLoadingLesson(false); });

    return () => {
      isMounted = false;
      controller.abort();
      stopSpeaking();
    };
  }, [activeClassId, currentUser, moduleInfo, stopSpeaking, restartKey, empresaEstado, induccionLista]);

  // =============================================
  // Derived state
  // =============================================
  const currentSync = useMemo(() =>
    lessonData?.classId === activeClassId && !isLoadingLesson
      ? lessonData.syncData.find(s => s.slide_index === currentSlideIndex + 1) || null : null,
    [lessonData, activeClassId, isLoadingLesson, currentSlideIndex]
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
    if (isLoadingLesson || lessonData?.classId !== activeClassId || phase !== 'narrating' || !slideScript) return;

    // Lámina con práctica: se abre el simulador de inmediato y la narración continúa sobre él.
    if (hasSimulatorStep) {
      setPhase('simulator');
      return;
    }

    speakText(slideScript, () => setPhase('mission_done'));

    return () => { stopSpeaking(); };
  }, [phase, currentSlideIndex, activeClassId, lessonData, isLoadingLesson, slideScript, hasSimulatorStep, speakText, stopSpeaking]);

  // =============================================
  // SIMULATOR ENTRY → read instructions
  // =============================================
  useEffect(() => {
    if (phase === 'simulator' && currentStepGuide) {
      // Explicación de la lámina + instrucciones, narradas mientras el estudiante ya ve el simulador.
      const instText = currentStepGuide.instructions.map(i => i.replace(/\.$/, '')).join('. ');
      speakText(`${slideScript} ${instText}.`.trim());
      return stopSpeaking;
    }
  }, [phase, currentStepGuide, slideScript, speakText, stopSpeaking]);

  // =============================================
  // Mission complete callback from simulator
  // =============================================
  const handleMissionComplete = useCallback((intento?: IntentoPractica) => {
    stopSpeaking();
    setPhase('mission_done');
    if (!intento || !currentUser || !moduleInfo) return;
    // La práctica se califica en el servidor: solo así cuenta para el certificado del módulo.
    const clave = `${activeClassId}#${currentSlideIndex + 1}`;
    void currentUser.getIdToken()
      .then(token => fetch('/api/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ moduleId: moduleInfo.id, classId: activeClassId, slideIndex: currentSlideIndex + 1, ...intento }),
      }))
      .then(r => r.ok ? r.json() : Promise.reject(new Error('practice-save')))
      .then((res: { aprobada: boolean }) => {
        if (res.aprobada) setPassedPractices(prev => (prev.includes(clave) ? prev : [...prev, clave]));
        setPracticeNotice(res.aprobada ? null : 'Práctica completada, pero no cumple los requisitos del certificado. Repítela para que se registre.');
      })
      .catch(() => setPracticeNotice('No se pudo registrar la práctica para tu certificado. Repítela cuando tengas conexión.'));
  }, [stopSpeaking, currentUser, moduleInfo, activeClassId, currentSlideIndex]);

  // =============================================
  // Progress & lessons
  // =============================================
  useEffect(() => {
    if (moduleInfo && currentUser) {
      currentUser.getIdToken()
        .then(token => fetch(`/api/progress?moduleId=${encodeURIComponent(moduleInfo.id)}`, { headers: { Authorization: `Bearer ${token}` } }))
        .then(r => r.ok ? r.json() : { completedClasses: [] })
        .then((data: { completedClasses: string[]; passedPractices?: string[]; requiredPractices?: string[] }) => {
          setCompletedClasses(Object.fromEntries(data.completedClasses.map(id => [id, true])));
          setPassedPractices(data.passedPractices ?? []);
          setRequiredPractices(data.requiredPractices ?? []);
        })
        .catch(() => setCompletedClasses({}));
    }
  }, [moduleInfo, currentUser]);

  const handleSelectClass = useCallback((classId: string) => {
    if (classId === activeClassId) return;
    stopSpeaking();
    setLessonData(null);
    setIsLoadingLesson(true);
    setCurrentSlideIndex(0);
    setPhase('narrating');
    setProgressError(null);
    setPracticeNotice(null);
    setLessonSaved(false);
    setActiveClassId(classId);
    if (!window.matchMedia('(min-width: 1024px)').matches) setSidebarOpen(false);
  }, [activeClassId, stopSpeaking]);

  // Every pending advance belongs to this lesson/slide and is cancelled on navigation.
  useEffect(() => {
    if (phase !== 'mission_done' || !lessonData || lessonData.classId !== activeClassId || isLoadingLesson || !currentUser || !moduleInfo) return;
    let cancelled = false;
    const controller = new AbortController();
    let nextTimer: ReturnType<typeof setTimeout> | undefined;
    const timer = setTimeout(async () => {
      if (currentSlideIndex < lessonData.totalSlides - 1) {
        setCurrentSlideIndex(index => index + 1);
        setPhase('narrating');
        return;
      }
      try {
        const token = await currentUser.getIdToken();
        if (cancelled) return;
        const response = await fetch('/api/progress', {
          method: 'POST', signal: controller.signal,
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ moduleId: moduleInfo.id, classId: activeClassId }),
        });
        if (!response.ok) throw new Error('progress-save');
        if (cancelled) return;
        setCompletedClasses(previous => ({ ...previous, [activeClassId]: true }));
        setLessonSaved(true);
        const index = moduleClasses.findIndex(cls => cls.id === activeClassId);
        if (index >= 0 && index < moduleClasses.length - 1) {
          nextTimer = setTimeout(() => handleSelectClass(moduleClasses[index + 1].id), 1500);
        }
      } catch {
        if (!cancelled) setProgressError('No se pudo guardar el progreso. Reintenta para continuar.');
      }
    }, 1200);
    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timer);
      clearTimeout(nextTimer);
    };
  }, [phase, lessonData, activeClassId, isLoadingLesson, currentUser, moduleInfo, currentSlideIndex, moduleClasses, handleSelectClass, retrySave]);

  const handleRestart = useCallback(() => {
    stopSpeaking();
    setLessonData(null);
    setIsLoadingLesson(true);
    setCurrentSlideIndex(0);
    setPhase('narrating');
    setRestartKey(key => key + 1);
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

  // Módulo bloqueado hasta completar el Módulo 1 (inducción).
  if (induccionLista === false) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 bg-[#070b14] text-white p-6 text-center">
        <Lock className="w-10 h-10 text-amber-400" aria-hidden="true" />
        <h1 className="text-2xl font-bold">Primero, el Módulo 1</h1>
        <p className="max-w-md text-sm text-gray-300">
          El Módulo 1 es tu inducción: creas tu empresa de práctica y aprendes a moverte en SAP Business One.
          Al completarlo se abren todos los demás módulos.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/mi-aula/mod-1" className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm active:scale-95">Ir al Módulo 1</Link>
          <Link href="/mi-aula" className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-sm active:scale-95">Volver a Mi Aula</Link>
        </div>
      </div>
    );
  }

  // Paso 0: sin empresa de práctica todavía → bienvenida y creación de la empresa antes de la clase.
  if (empresaEstado === 'falta') {
    return <PasoCeroEmpresa onLista={() => setEmpresaEstado('ok')} />;
  }

  // =============================================
  // RENDER
  // =============================================
  return (
    <div className="h-dvh w-full overflow-hidden flex flex-col bg-[#070b14] text-gray-100">

      {/* ── BARRA SUPERIOR (sin Navbar global) ── */}
      <header className="shrink-0 z-30 bg-[#0e1620]/95 backdrop-blur-md border-b border-gray-800 px-2 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {/* Back */}
          <Link
            href="/mi-aula"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all shrink-0"
            title="Volver a Mi Aula"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </Link>
          <div className="w-px h-6 bg-gray-800 shrink-0" />
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all shrink-0"
            title={sidebarOpen ? 'Cerrar Temario' : 'Abrir Temario'}
            aria-expanded={sidebarOpen}
            aria-controls="aula-temario"
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

          {/* Velocidad de narración (1× → 1.25× → 1.5× → 1.75×) */}
          <button
            onClick={cambiarVelocidad}
            className={`min-w-[44px] px-2 py-1.5 rounded-lg text-xs font-bold tabular-nums transition-all active:scale-95 ${
              velocidad > 1 ? 'text-amber-300 bg-amber-500/15 hover:bg-amber-500/25' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title="Velocidad de la narración"
            aria-label={`Velocidad de la narración: ${velocidad}×. Pulsa para cambiar`}
          >
            {velocidad}×
          </button>

          {/* Pantalla completa (también se sale con Esc) */}
          <button
            onClick={alternarPantallaCompleta}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all active:scale-95"
            title={pantallaCompleta ? 'Salir de pantalla completa (Esc)' : 'Pantalla completa'}
            aria-label={pantallaCompleta ? 'Salir de pantalla completa' : 'Pantalla completa'}
            aria-pressed={pantallaCompleta}
          >
            {pantallaCompleta ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* exam */}
          <Link
            href={`/mi-aula/${moduleId}/oral-exam`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-semibold transition-all active:scale-95"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Evaluación</span>
          </Link>
        </div>
      </header>

      {/* ── MAIN LAYOUT ── */}
      <div className="relative flex flex-1 min-h-0 overflow-hidden">

        {/* ── SIDEBAR ── */}
        {sidebarOpen && (
          <aside id="aula-temario" className="absolute inset-y-0 left-0 z-20 w-60 max-w-[85vw] shadow-2xl lg:shadow-none lg:static shrink-0 bg-[#0a1018] border-r border-gray-800 flex flex-col overflow-y-auto">
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
                <p className="text-xs text-gray-300">{completedCount} de {totalLessons} ({Math.round((completedCount / Math.max(totalLessons, 1)) * 100)}%)</p>
              </div>
              <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                  style={{ width: `${(completedCount / Math.max(totalLessons, 1)) * 100}%` }}
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
              {moduleInfo?.certificateTitle && (
                <p className="text-[11px] font-semibold text-amber-200 leading-snug mb-1">{moduleInfo.certificateTitle}</p>
              )}
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Completa todas las clases, aprueba las prácticas del simulador y la Evaluación con Tutor IA.
              </p>
              {requiredPractices.length > 0 && (
                <p className="mt-1 text-[10px] font-semibold text-blue-300">
                  Prácticas aprobadas: {requiredPractices.filter(p => passedPractices.includes(p)).length} de {requiredPractices.length}
                </p>
              )}
              {practiceNotice && <p className="mt-1 text-[10px] text-amber-300" role="status">{practiceNotice}</p>}
              <Link
                href={`/mi-aula/${moduleId}/oral-exam`}
                className={`mt-2 w-full flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${completedCount >= totalLessons
                  ? 'bg-amber-500 text-slate-900 hover:bg-amber-400 active:scale-95'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed pointer-events-none'
                  }`}
              >
                Ir a Evaluación
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
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer mb-1 ${isActive
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                      : 'hover:bg-gray-800/60 text-gray-400 hover:text-gray-200 border border-transparent'
                      }`}
                  >
                    <div className={`h-5 w-5 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-bold ${isDone ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
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

          {lessonError ? (
            <div role="alert" className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center">
              <p>{lessonError}</p>
              <button onClick={handleRestart} className="rounded-lg bg-amber-500 px-4 py-2 text-slate-950 font-bold active:scale-95">Reintentar carga</button>
            </div>
          ) : isLoadingLesson || !lessonData ? (
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
              <p className="text-sm text-gray-400" role="status">{progressError || (lessonSaved ? (activeClassId === moduleClasses.at(-1)?.id ? 'Módulo terminado. Puedes acceder a la Evaluación .' : 'Clase guardada. Preparando la siguiente lección...') : 'Guardando tu progreso...')}</p>
              {progressError && <button onClick={() => { setProgressError(null); setRetrySave(value => value + 1); }} className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-slate-950 font-bold active:scale-95">Reintentar guardado</button>}
              {practiceNotice && <p className="mt-3 max-w-md text-xs text-amber-300" role="status">{practiceNotice}</p>}
            </div>

          ) : phase === 'simulator' && currentStepGuide ? (
            /* ── SIMULATOR PHASE ── */
            <div className="flex-1 min-h-0 flex flex-col overflow-y-auto">
              {/* Glowing instructions bar */}
              <div className="shrink-0 max-h-[30dvh] overflow-y-auto mx-2 sm:mx-4 mt-3 p-3 rounded-xl bg-gradient-to-r from-blue-900/60 to-blue-800/40 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
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
                {slideScript && (
                  <div className="mb-2">
                    <p className={`text-xs text-blue-100/80 leading-relaxed ${narracionAbierta ? '' : 'line-clamp-2'}`}>{slideScript}</p>
                    {slideScript.length > 160 && (
                      <button
                        onClick={() => setNarracionAbierta((v) => !v)}
                        className="mt-0.5 text-[11px] font-semibold text-amber-300 hover:text-amber-200 active:scale-95"
                      >
                        {narracionAbierta ? 'Ver menos' : 'Ver más'}
                      </button>
                    )}
                  </div>
                )}
                <ol className="space-y-1">
                  {currentStepGuide.instructions.map((inst, i) => (
                    <li key={i} className="text-xs text-blue-100 flex gap-2">
                      <span className="shrink-0 w-4 h-4 rounded-full bg-blue-500/30 text-blue-300 flex items-center justify-center text-[9px] font-bold">{i + 1}</span>
                      {inst}
                    </li>
                  ))}
                </ol>
              </div>
              {/* Simulator */}
              <div className="flex-1 min-h-[320px] mt-3 px-2 sm:px-4 pb-4">
                <SAPInteractiveSimulator
                  key={`${activeClassId}:${currentSlideIndex}:${restartKey}`}
                  manualId={activeClassId}
                  currentStepIndex={currentSlideIndex}
                  stepGuide={currentStepGuide}
                  onMissionComplete={handleMissionComplete}
                  scrollInterno={false}
                />
              </div>
            </div>

          ) : (
            /* ── NARRATION PHASE ── */
            <div className="flex-1 min-h-0 flex flex-col overflow-y-auto">
              {/* Slide image */}
              <div className="relative flex-1 min-h-[180px] bg-[#0a0a10]">
                {activeSlideImage ? (
                  <Image
                    src={activeSlideImage}
                    alt={`Diapositiva ${currentSlideIndex + 1}`}
                    width={1920}
                    height={1080}
                    unoptimized
                    className="absolute inset-0 w-full h-full object-contain"
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
                <div className="shrink-0 max-h-[35dvh] overflow-y-auto p-4 border-t border-gray-800 bg-[#0e1620]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${isSpeaking
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

              {/* exam notice (last slide) */}
              {lessonData && currentSlideIndex === lessonData.totalSlides - 1 && !hasSimulatorStep && (
                <div className="p-4 bg-[#070b14] border-t border-purple-500/20">
                  <div className="rounded-xl bg-purple-500/10 border border-purple-500/30 p-3 flex items-start gap-3">
                    <Award className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-purple-300 mb-1">Evaluación con Tutor IA</p>
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

