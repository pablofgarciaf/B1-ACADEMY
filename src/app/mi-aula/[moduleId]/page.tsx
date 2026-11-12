'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useAcademyVoice } from '@/hooks/useAcademyVoice';
import { OFFICIAL_SYLLABUS } from '@/lib/curriculum-data';
import type { IntentoPractica } from '@/lib/practice-check';
import { getCompany, usarEmpresaCurso } from '@/lib/firestore-company';
import PasoCeroEmpresa from '@/components/lms/PasoCeroEmpresa';
import { GraduationCap, Lock, Building2 } from 'lucide-react';

import type { LessonData, AulaPhase } from '@/components/aula/types';
import AulaHeader from '@/components/aula/AulaHeader';
import AulaSidebar from '@/components/aula/AulaSidebar';
import AulaSimulatorView from '@/components/aula/AulaSimulatorView';
import AulaNarrationView from '@/components/aula/AulaNarrationView';
import AulaCompletedView from '@/components/aula/AulaCompletedView';

export default function AulaModuloPage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { currentUser, userProfile, loading } = useAuth();

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
      const requested = new URLSearchParams(window.location.search).get('clase');
      setActiveClassId(moduleClasses.find(c => c.id === requested)?.id ?? moduleClasses[0].id);
    }
  }, [moduleClasses, activeClassId]);

  // Paso 0: Verificación de empresa B1 Center (Zero Trust)
  const [empresaEstado, setEmpresaEstado] = useState<'cargando' | 'falta' | 'ok'>('cargando');
  useEffect(() => usarEmpresaCurso(), []);
  useEffect(() => {
    if (!currentUser) return;
    let activo = true;
    getCompany(currentUser.uid)
      .then(s => {
        if (!activo) return;
        const exists = Boolean(s?.profile?.trainingSetupVersion === 1 || (s?.profile?.companyName && (s?.customers?.length || s?.items?.length)));
        setEmpresaEstado(exists ? 'ok' : 'falta');
      })
      .catch(() => {
        if (!activo) return;
        setEmpresaEstado('falta');
      });
    return () => { activo = false; };
  }, [currentUser]);

  // Inducción obligatoria
  const [induccionLista, setInduccionLista] = useState<boolean | null>(null);
  useEffect(() => {
    if (!currentUser || !moduleId) return;
    const sinRequisito = moduleId === 'mod-1' || moduleId === 'mod-ventas' || ['super', 'admin', 'docente'].includes(userProfile?.role ?? '');
    if (sinRequisito) { setInduccionLista(true); return; }
    const totalMod1 = OFFICIAL_SYLLABUS.find(m => m.id === 'mod-1')?.classes.length ?? 0;
    let activo = true;
    currentUser.getIdToken()
      .then(token => fetch('/api/progress?moduleId=mod-1', { headers: { Authorization: `Bearer ${token}` } }))
      .then(r => (r.ok ? r.json() : { completedClasses: [] }))
      .then((d: { completedClasses?: string[] }) => {
        if (activo) setInduccionLista((d.completedClasses ?? []).length >= totalMod1);
      })
      .catch(() => {
        if (activo) setInduccionLista(false);
      });
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
  const [phase, setPhase] = useState<AulaPhase>('narrating');
  const [practiceAttempt, setPracticeAttempt] = useState(0);
  const practiceContext = useRef('');
  practiceContext.current = currentUser?.uid + ':' + moduleId + ':' + activeClassId + ':' + currentSlideIndex + ':' + restartKey;
  useEffect(() => setPracticeAttempt(0), [activeClassId, currentSlideIndex]);
  const [completedClasses, setCompletedClasses] = useState<Record<string, boolean>>({});
  const [passedPractices, setPassedPractices] = useState<string[]>([]);
  const [requiredPractices, setRequiredPractices] = useState<string[]>([]);
  const [practiceNotice, setPracticeNotice] = useState<string | null>(null);
  const [mostrarSubtitulos, setMostrarSubtitulos] = useState(false);

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => { setSidebarOpen(window.matchMedia('(min-width: 1024px)').matches); }, []);

  // Pantalla completa
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

  const [narracionAbierta, setNarracionAbierta] = useState(false);

  // Speech & Video Player State
  const {
    isSpeaking,
    isPaused,
    isMuted,
    needsGesture,
    vozFallo,
    currentTime,
    duration,
    speakText,
    stopSpeaking,
    resume,
    togglePause,
    seek,
    toggleMute,
    resumeAfterGesture,
    preload,
    velocidad,
    cambiarVelocidad
  } = useAcademyVoice();

  // Controles de navegación estilo reproductor de video
  const irAlaminAnterior = useCallback(() => {
    if (currentSlideIndex > 0) {
      stopSpeaking();
      setCurrentSlideIndex(i => i - 1);
      setPhase('narrating');
    }
  }, [currentSlideIndex, stopSpeaking]);

  const irAlaminSiguiente = useCallback(() => {
    if (lessonData && currentSlideIndex < lessonData.totalSlides - 1) {
      stopSpeaking();
      setCurrentSlideIndex(i => i + 1);
      setPhase('narrating');
    }
  }, [lessonData, currentSlideIndex, stopSpeaking]);

  const retroceder10s = useCallback(() => {
    seek(Math.max(0, currentTime - 10));
  }, [seek, currentTime]);

  const avanzar10s = useCallback(() => {
    seek(Math.min(duration || Infinity, currentTime + 10));
  }, [seek, currentTime, duration]);

  const formatTime = (secs: number) => {
    const s = Math.floor(secs || 0);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem.toString().padStart(2, '0')}`;
  };

  // Atajos de teclado
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePause();
      } else if (e.key === 'ArrowRight') {
        if (e.shiftKey) irAlaminSiguiente();
        else avanzar10s();
      } else if (e.key === 'ArrowLeft') {
        if (e.shiftKey) irAlaminAnterior();
        else retroceder10s();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePause, irAlaminSiguiente, irAlaminAnterior, avanzar10s, retroceder10s, toggleMute]);

  // Load lesson data
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

  // Derived state
  const currentSync = useMemo(() =>
    lessonData?.classId === activeClassId && !isLoadingLesson
      ? lessonData.syncData.find(s => s.slide_index === currentSlideIndex + 1) || null : null,
    [lessonData, activeClassId, isLoadingLesson, currentSlideIndex]
  );

  const currentStepGuide = useMemo(() => currentSync?.step_guide ? { ...currentSync.step_guide, missionId: `${activeClassId}#${currentSlideIndex + 1}` } : null, [currentSync, activeClassId, currentSlideIndex]);
  const slideScript = currentSync?.script_text || '';
  const lessonImages = lessonData?.images ?? [];
  const activeSlideImage = lessonImages[Math.min(currentSlideIndex, lessonImages.length - 1)] || null;
  const hasSimulatorStep = !!currentStepGuide;

  useEffect(() => {
    const next = lessonData?.syncData?.find(s => s.slide_index === currentSlideIndex + 2);
    if (next?.script_text) preload(next.script_text);
  }, [lessonData, currentSlideIndex, preload]);

  // Auto-trigger narration or direct simulator (eliminando parpadeo)
  useEffect(() => {
    if (isLoadingLesson || lessonData?.classId !== activeClassId || phase !== 'narrating' || !slideScript) return;

    if (hasSimulatorStep) {
      setPhase('simulator');
      return;
    }

    speakText(slideScript, () => setPhase('mission_done'));
    return () => { stopSpeaking(); };
  }, [phase, currentSlideIndex, activeClassId, lessonData, isLoadingLesson, slideScript, hasSimulatorStep, speakText, stopSpeaking]);

  useEffect(() => {
    if (phase === 'simulator' && currentStepGuide && practiceAttempt === 0) {
      const instText = currentStepGuide.instructions.filter(i => !/^Datos a registrar/i.test(i)).map(i => i.replace(/\.$/, '')).join('. ');
      speakText(`${slideScript} ${instText}.`.trim());
      return stopSpeaking;
    }
  }, [phase, currentStepGuide, slideScript, speakText, stopSpeaking, practiceAttempt]);

  // Mission complete callback
  const handleMissionComplete = useCallback(async (intento?: IntentoPractica) => {
    stopSpeaking();
    const clave = activeClassId + '#' + (currentSlideIndex + 1);
    const context = practiceContext.current;
    const retry = (message: string) => {
      if (practiceContext.current !== context) return;
      setPracticeNotice(message);
      setPhase('simulator');
    };
    if (!intento) {
      if (process.env.NODE_ENV !== 'production') {
        setPassedPractices(previous => previous.includes(clave) ? previous : [...previous, clave]);
        setPhase('mission_done');
        return;
      }
      if (requiredPractices.includes(clave)) retry('La actividad no entregó un resultado verificable. Revisa la instrucción o consulta al docente con el código ' + clave + '.');
      else setPhase('mission_done');
      return;
    }
    if (!currentUser || !moduleInfo) { retry('Inicia sesión para guardar la práctica.'); return; }
    setPhase('validating'); setPracticeNotice(null);
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('/api/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ moduleId: moduleInfo.id, classId: activeClassId, slideIndex: currentSlideIndex + 1, ...intento })
      });
      const result = await response.json();
      if (practiceContext.current !== context) return;
      if (!response.ok) throw new Error(result.error || 'No pudimos comprobar el resultado. Intenta nuevamente.');
      if (result.aprobada !== true) {
        retry('El resultado todavía no coincide con la misión. Corrige los datos y vuelve a guardar; tu operación anterior sigue registrada.');
        return;
      }
      setPassedPractices(previous => previous.includes(clave) ? previous : [...previous, clave]);
      setPhase('mission_done');
    } catch (error) {
      retry(error instanceof Error ? error.message : 'No pudimos comprobar el resultado. Intenta nuevamente.');
    }
  }, [stopSpeaking, currentUser, moduleInfo, activeClassId, currentSlideIndex, requiredPractices]);

  // Progress fetch
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

  // Avance tras finalizar la misión
  useEffect(() => {
    if (phase !== 'mission_done' || isPaused || !lessonData || lessonData.classId !== activeClassId || isLoadingLesson || !currentUser || !moduleInfo) return;
    let cancelled = false;
    const controller = new AbortController();
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
      } catch {
        if (!cancelled) setProgressError('No se pudo guardar el progreso. Reintenta para continuar.');
      }
    }, 1200);

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timer);
    };
  }, [phase, isPaused, lessonData, activeClassId, isLoadingLesson, currentUser, moduleInfo, currentSlideIndex, retrySave]);

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
  const currentClassIndex = moduleClasses.findIndex(cls => cls.id === activeClassId);
  const nextClass = currentClassIndex >= 0 && currentClassIndex < moduleClasses.length - 1 ? moduleClasses[currentClassIndex + 1] : null;

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

  if (loading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 bg-[#070b14] text-white p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-spin">
          <Building2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold">Iniciando sesión en Finix ERP...</h2>
        <p className="text-sm text-gray-400 max-w-sm">
          Cargando tus credenciales académicas seguras.
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 bg-[#070b14] text-white p-6 text-center">
        <Lock className="w-12 h-12 text-amber-400" />
        <h2 className="text-xl font-bold">Sesión requerida para Mi Aula</h2>
        <p className="text-sm text-gray-400 max-w-md">
          Para acceder a las clases, el simulador interactivo y registrar tus prácticas evaluadas debes iniciar sesión con tu cuenta.
        </p>
        <Link
          href={`/login?redirect=/mi-aula/${moduleId || 'mod-1'}`}
          className="mt-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm active:scale-95 transition shadow-lg shadow-amber-500/20"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (empresaEstado === 'cargando' || (induccionLista === null && moduleId !== 'mod-1')) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 bg-[#070b14] text-white p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-spin">
          <Building2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold">Conectando con tu entorno Finix ERP...</h2>
        <p className="text-sm text-gray-400 max-w-sm">
          Verificando tu empresa de práctica B1 Center y requisitos académicos de acceso.
        </p>
      </div>
    );
  }

  if (empresaEstado === 'falta') {
    return <PasoCeroEmpresa onLista={() => setEmpresaEstado('ok')} />;
  }

  if (induccionLista === false) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 bg-[#070b14] text-white p-6 text-center">
        <Lock className="w-10 h-10 text-amber-400" aria-hidden="true" />
        <h1 className="text-2xl font-bold">Primero, el Módulo 1</h1>
        <p className="max-w-md text-sm text-gray-300">
          El Módulo 1 es tu inducción: creas tu empresa de práctica y aprendes a moverte en Finix ERP.
          Al completarlo se abren todos los demás módulos.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/mi-aula/mod-1" className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm active:scale-95">Ir al Módulo 1</Link>
          <Link href="/mi-aula" className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-sm active:scale-95">Volver a Mi Aula</Link>
        </div>
      </div>
    );
  }

  const isCurrentSlideWithSimulator = Boolean(currentStepGuide);

  return (
    <div className="h-dvh w-full overflow-hidden flex flex-col bg-[#070b14] text-gray-100">
      <AulaHeader
        moduleId={moduleId}
        moduleInfo={moduleInfo}
        lessonData={lessonData}
        phase={phase}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isPaused={isPaused}
        togglePause={togglePause}
        isSpeaking={isSpeaking}
        isMuted={isMuted}
        toggleMute={toggleMute}
        velocidad={velocidad}
        cambiarVelocidad={cambiarVelocidad}
        mostrarSubtitulos={mostrarSubtitulos}
        setMostrarSubtitulos={setMostrarSubtitulos}
        pantallaCompleta={pantallaCompleta}
        alternarPantallaCompleta={alternarPantallaCompleta}
        handleRestart={handleRestart}
      />

      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        <AulaSidebar
          sidebarOpen={sidebarOpen}
          moduleId={moduleId}
          moduleInfo={moduleInfo}
          moduleClasses={moduleClasses}
          activeClassId={activeClassId}
          userDisplayName={userProfile?.displayName || userProfile?.name || 'Estudiante'}
          userEmail={currentUser?.email}
          completedClasses={completedClasses}
          passedPractices={passedPractices}
          requiredPractices={requiredPractices}
          totalLessons={totalLessons}
          completedCount={completedCount}
          vozFallo={vozFallo}
          practiceNotice={practiceNotice}
          handleSelectClass={handleSelectClass}
        />

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
          ) : phase === 'validating' ? (
            <div role="status" aria-live="polite" className="m-auto p-8 text-center text-sky-200">
              <div className="w-10 h-10 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Comprobando el resultado guardado de tu práctica en Finix ERP…
            </div>
          ) : phase === 'mission_done' && currentSlideIndex >= (lessonData?.totalSlides ?? 1) - 1 ? (
            <AulaCompletedView
              progressError={progressError}
              lessonSaved={lessonSaved}
              isLastClassInModule={activeClassId === moduleClasses.at(-1)?.id}
              practiceNotice={practiceNotice}
              onRetrySave={() => { setProgressError(null); setRetrySave(v => v + 1); }}
              onNextClass={nextClass ? () => handleSelectClass(nextClass.id) : undefined}
              hasNextClass={Boolean(nextClass)}
            />
          ) : (phase === 'simulator' || isCurrentSlideWithSimulator) && currentStepGuide ? (
            <AulaSimulatorView
              currentStepGuide={currentStepGuide}
              activeClassId={activeClassId}
              currentSlideIndex={currentSlideIndex}
              restartKey={restartKey}
              practiceAttempt={practiceAttempt}
              slideScript={slideScript}
              lessonData={lessonData}
              isSpeaking={isSpeaking}
              isPaused={isPaused}
              needsGesture={needsGesture}
              narracionAbierta={narracionAbierta}
              setNarracionAbierta={setNarracionAbierta}
              togglePause={togglePause}
              resumeAfterGesture={resumeAfterGesture}
              handleMissionComplete={handleMissionComplete}
            />
          ) : (
            <AulaNarrationView
              activeClassId={activeClassId}
              currentSync={currentSync}
              currentSlideIndex={currentSlideIndex}
              slideScript={slideScript}
              currentStepGuide={currentStepGuide}
              lessonData={lessonData}
              activeSlideImage={activeSlideImage}
              hasSimulatorStep={hasSimulatorStep}
              isPaused={isPaused}
              isMuted={isMuted}
              isSpeaking={isSpeaking}
              needsGesture={needsGesture}
              currentTime={currentTime}
              duration={duration}
              mostrarSubtitulos={mostrarSubtitulos}
              completedCount={completedCount}
              totalLessons={totalLessons}
              isLastClassInModule={activeClassId === moduleClasses.at(-1)?.id}
              allPracticesCompleted={requiredPractices.length === 0 || requiredPractices.every(p => passedPractices.includes(p))}
              moduleId={moduleId}
              togglePause={togglePause}
              resume={resume}
              seek={seek}
              toggleMute={toggleMute}
              resumeAfterGesture={resumeAfterGesture}
              irAlaminAnterior={irAlaminAnterior}
              irAlaminSiguiente={irAlaminSiguiente}
              retroceder10s={retroceder10s}
              avanzar10s={avanzar10s}
              formatTime={formatTime}
              setMostrarSubtitulos={setMostrarSubtitulos}
              onIrAlSimulador={() => setPhase('simulator')}
            />
          )}
        </main>
      </div>
    </div>
  );
}
