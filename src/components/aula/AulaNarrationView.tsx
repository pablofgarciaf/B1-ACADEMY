'use client';

import Image from 'next/image';
import Link from 'next/link';
import AcademicSlide from '@/components/simulator/AcademicSlide';
import {
  BookOpen,
  ShieldCheck,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Award
} from 'lucide-react';
import type { SyncSlide, LessonData } from './types';
import type { StepGuide } from '@/components/simulator/FinixInteractiveSimulator';

interface AulaNarrationViewProps {
  activeClassId: string;
  currentSync: SyncSlide | null;
  currentSlideIndex: number;
  slideScript: string;
  currentStepGuide: StepGuide | null;
  lessonData: LessonData | null;
  activeSlideImage: string | null;
  hasSimulatorStep: boolean;
  isPaused: boolean;
  isMuted: boolean;
  isSpeaking: boolean;
  needsGesture: boolean;
  currentTime: number;
  duration: number;
  mostrarSubtitulos: boolean;
  completedCount: number;
  totalLessons: number;
  isLastClassInModule?: boolean;
  allPracticesCompleted?: boolean;
  moduleId: string;
  togglePause: () => void;
  resume: () => void;
  seek: (t: number) => void;
  toggleMute: () => void;
  resumeAfterGesture: () => void;
  irAlaminAnterior: () => void;
  irAlaminSiguiente: () => void;
  retroceder10s: () => void;
  avanzar10s: () => void;
  formatTime: (secs: number) => string;
  setMostrarSubtitulos: (v: boolean | ((prev: boolean) => boolean)) => void;
  onIrAlSimulador?: () => void;
}

export default function AulaNarrationView({
  activeClassId,
  currentSync,
  currentSlideIndex,
  slideScript,
  currentStepGuide,
  lessonData,
  activeSlideImage,
  hasSimulatorStep,
  isPaused,
  isMuted,
  isSpeaking,
  needsGesture,
  currentTime,
  duration,
  mostrarSubtitulos,
  completedCount,
  totalLessons,
  isLastClassInModule = false,
  allPracticesCompleted = false,
  moduleId,
  togglePause,
  resume,
  seek,
  toggleMute,
  resumeAfterGesture,
  irAlaminAnterior,
  irAlaminSiguiente,
  retroceder10s,
  avanzar10s,
  formatTime,
  setMostrarSubtitulos,
  onIrAlSimulador
}: AulaNarrationViewProps) {
  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-y-auto">
      {/* Contenedor interactivo de video simulado con hover controls y estado de pausa */}
      <div
        className="group relative flex-1 min-h-[220px] bg-[#05070d] flex items-center justify-center overflow-hidden select-none cursor-pointer"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('.video-controls-bar')) return;
          togglePause();
        }}
      >
        {activeClassId.startsWith('mod-ventas') || currentSync?.presentation === 'text' ? (
          <AcademicSlide script={slideScript} title={currentStepGuide?.title || lessonData?.title || 'Formación empresarial'} index={currentSlideIndex + 1} />
        ) : activeSlideImage ? (
          <Image
            src={activeSlideImage}
            alt={`Diapositiva ${currentSlideIndex + 1}`}
            width={1920}
            height={1080}
            unoptimized
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            priority={currentSlideIndex === 0}
          />
        ) : (
          <div className="w-full h-56 flex items-center justify-center bg-gradient-to-br from-[#0e1620] to-[#131a28]">
            <div className="text-center">
              <BookOpen className="w-10 h-10 text-amber-500/60 mx-auto mb-2" />
              <p className="text-sm text-gray-500">{lessonData?.title}</p>
            </div>
          </div>
        )}

        {/* Aviso y botón de acceso a práctica si la lámina incluye simulador */}
        {hasSimulatorStep && currentStepGuide && (
          <div className="absolute top-3 left-3 z-10 max-w-[85%] sm:max-w-[70%] p-2 rounded-xl bg-blue-950/95 border border-blue-500/50 text-blue-100 text-xs shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <ShieldCheck className="w-4 h-4 text-blue-300 shrink-0" />
              <span className="font-bold truncate">Práctica: {currentStepGuide.title}</span>
            </div>
            {onIrAlSimulador && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onIrAlSimulador();
                }}
                className="px-2.5 py-1 rounded bg-blue-500 hover:bg-blue-400 active:scale-95 text-slate-950 font-bold text-[11px] transition shadow"
              >
                Abrir Simulador →
              </button>
            )}
          </div>
        )}

        {/* Overlay central cuando la lección está pausada */}
        {isPaused && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-[2px] transition-all animate-in fade-in duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                resume();
              }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/40 hover:scale-110 active:scale-95 transition-all mb-3"
              title="Reanudar lección"
              aria-label="Reanudar lección"
            >
              <Play className="w-7 h-7 fill-slate-950 ml-1" />
            </button>
            <p className="text-white text-sm font-bold tracking-wide">Lección en Pausa</p>
            <p className="text-xs text-amber-300/80 font-mono mt-1">Haz clic o presiona [Espacio] para reanudar</p>
          </div>
        )}

        {/* Barra de control flotante tipo reproductor de video (visible en hover o persistente si está en pausa) */}
        <div
          className={`video-controls-bar absolute bottom-0 inset-x-0 z-30 transition-all duration-300 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent pt-8 pb-3 px-3 sm:px-4 cursor-default ${
            isPaused ? 'opacity-100 translate-y-0' : 'opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Línea de tiempo interactiva (Scrubber) */}
          <div className="flex items-center gap-2 mb-2">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.2}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-all"
              title="Línea de tiempo"
              aria-label="Línea de tiempo del audio"
            />
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            {/* Controles de reproducción */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={togglePause}
                className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95 transition-all"
                title={isPaused ? 'Reproducir (Espacio)' : 'Pausar (Espacio)'}
                aria-label={isPaused ? 'Reproducir' : 'Pausar'}
              >
                {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
              </button>

              <button
                onClick={retroceder10s}
                className="p-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-200 active:scale-95 transition-all"
                title="Retroceder 10 segundos [←]"
                aria-label="Retroceder 10 segundos"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={avanzar10s}
                className="p-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-200 active:scale-95 transition-all"
                title="Avanzar 10 segundos [→]"
                aria-label="Avanzar 10 segundos"
              >
                <RotateCcw className="w-4 h-4 -scale-x-100" />
              </button>

              {/* Lámina anterior */}
              <button
                onClick={irAlaminAnterior}
                disabled={currentSlideIndex === 0}
                className="p-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all border border-gray-700"
                title="Lámina anterior [Shift + ←]"
                aria-label="Lámina anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Lámina siguiente */}
              <button
                onClick={irAlaminSiguiente}
                disabled={!lessonData || currentSlideIndex >= lessonData.totalSlides - 1}
                className="p-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all border border-gray-700"
                title="Lámina siguiente [Shift + →]"
                aria-label="Lámina siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Tiempo transcurrido / Duración */}
              <div className="text-[11px] font-mono text-gray-300 ml-1">
                <span>{formatTime(currentTime)}</span>
                <span className="text-gray-500"> / </span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Información y ajustes rápidos */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {needsGesture && (
                <button
                  onClick={resumeAfterGesture}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 active:scale-95 transition-all shadow-sm animate-pulse"
                  title="Haz clic para activar el audio en el navegador"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Activar voz
                </button>
              )}

              <button
                onClick={toggleMute}
                className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 active:scale-95 transition-all"
                title={isMuted ? 'Activar audio (M)' : 'Silenciar (M)'}
                aria-label={isMuted ? 'Activar audio' : 'Silenciar'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Indicador de diapositiva actual */}
              <span className="text-[11px] font-bold text-amber-400 font-mono bg-slate-900/90 px-2 py-0.5 rounded border border-gray-800">
                Lámina {currentSlideIndex + 1}/{lessonData?.totalSlides ?? 1}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtítulos expandibles / Accesibilidad */}
      {mostrarSubtitulos && slideScript && (
        <div className="shrink-0 p-3 sm:p-4 bg-slate-950/90 border-t border-gray-800 backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>💬</span> Subtítulos oficiales
            </span>
            <button
              onClick={() => setMostrarSubtitulos(false)}
              className="text-xs text-gray-400 hover:text-gray-200 px-2 py-0.5 rounded hover:bg-gray-800 active:scale-95 transition-all"
              title="Ocultar subtítulos [CC]"
            >
              ✕ Ocultar
            </button>
          </div>
          <p className="text-sm text-gray-200 leading-relaxed font-medium">
            {slideScript}
          </p>
        </div>
      )}

      {/* exam notice (solo en la última diapositiva de la última clase del módulo y si se completaron clases y prácticas) */}
      {isLastClassInModule && lessonData && currentSlideIndex === lessonData.totalSlides - 1 && !hasSimulatorStep && (
        <div className="p-4 bg-[#070b14] border-t border-purple-500/20">
          <div className="rounded-xl bg-purple-500/10 border border-purple-500/30 p-3 flex items-start gap-3">
            <Award className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-purple-300 mb-1">Evaluación con Tutor IA</p>
              <p className="text-[11px] text-gray-400">
                {completedCount >= totalLessons && allPracticesCompleted
                  ? '¡Todas las clases y prácticas completadas! Puedes iniciar tu evaluación.'
                  : 'Completa todas las lecciones y prácticas del simulador para habilitar tu evaluación.'}
              </p>
              {completedCount >= totalLessons && allPracticesCompleted && (
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
  );
}
