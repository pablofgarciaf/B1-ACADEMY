'use client';

import Link from 'next/link';
import {
  PanelLeftClose,
  PanelLeftOpen,
  CheckCircle2,
  BookOpen,
  ShieldCheck,
  RotateCcw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  Award
} from 'lucide-react';
import type { SyllabusModule } from '@/lib/curriculum-data';
import type { AulaPhase, LessonData } from './types';

interface AulaHeaderProps {
  moduleId: string;
  moduleInfo?: SyllabusModule;
  lessonData: LessonData | null;
  phase: AulaPhase;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  isPaused: boolean;
  togglePause: () => void;
  isSpeaking: boolean;
  isMuted: boolean;
  toggleMute: () => void;
  velocidad: number;
  cambiarVelocidad: () => void;
  mostrarSubtitulos: boolean;
  setMostrarSubtitulos: (v: boolean | ((prev: boolean) => boolean)) => void;
  pantallaCompleta: boolean;
  alternarPantallaCompleta: () => void;
  handleRestart: () => void;
}

export default function AulaHeader({
  moduleId,
  moduleInfo,
  lessonData,
  phase,
  sidebarOpen,
  setSidebarOpen,
  isPaused,
  togglePause,
  isSpeaking,
  isMuted,
  toggleMute,
  velocidad,
  cambiarVelocidad,
  mostrarSubtitulos,
  setMostrarSubtitulos,
  pantallaCompleta,
  alternarPantallaCompleta,
  handleRestart
}: AulaHeaderProps) {
  return (
    <header className="shrink-0 z-30 bg-[#0e1620]/95 backdrop-blur-md border-b border-gray-800 px-2 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href="/mi-aula"
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all shrink-0"
          title="Volver a Mi Aula"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </Link>
        <div className="w-px h-6 bg-gray-800 shrink-0" />
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
            {moduleInfo?.id === 'mod-ventas' ? 'Taller Comercial ERP' : `Módulo ${moduleInfo?.number}`}: {moduleInfo?.title}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {lessonData?.title || 'Cargando clase...'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
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

        <button
          onClick={handleRestart}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
          title="Reiniciar clase"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={togglePause}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
            isPaused
              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/30'
              : 'text-gray-300 bg-gray-800/80 hover:text-white hover:bg-gray-700'
          }`}
          title={isPaused ? 'Reanudar lección (Espacio)' : 'Pausar lección (Espacio)'}
          aria-label={isPaused ? 'Reanudar lección' : 'Pausar lección'}
        >
          {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
          <span className="hidden sm:inline">{isPaused ? 'Reanudar' : 'Pausar'}</span>
        </button>

        <button
          onClick={toggleMute}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
          title={isMuted ? 'Activar audio' : 'Silenciar'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

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

        <button
          onClick={() => setMostrarSubtitulos(v => !v)}
          className={`min-w-[36px] px-2 py-1.5 rounded-lg text-xs font-bold font-mono transition-all active:scale-95 border ${
            mostrarSubtitulos
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-gray-800/80 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-white'
          }`}
          title={mostrarSubtitulos ? 'Ocultar subtítulos [CC]' : 'Mostrar subtítulos [CC]'}
          aria-label={mostrarSubtitulos ? 'Ocultar subtítulos' : 'Mostrar subtítulos'}
        >
          CC
        </button>

        <button
          onClick={alternarPantallaCompleta}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all active:scale-95"
          title={pantallaCompleta ? 'Salir de pantalla completa (Esc)' : 'Pantalla completa'}
          aria-label={pantallaCompleta ? 'Salir de pantalla completa' : 'Pantalla completa'}
          aria-pressed={pantallaCompleta}
        >
          {pantallaCompleta ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        <button
          onClick={() => window.dispatchEvent(new Event('fini-abrir'))}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 via-amber-500 to-yellow-500 hover:from-red-500 hover:to-amber-400 text-white text-xs font-bold transition-all active:scale-95 shadow-md shadow-amber-900/30"
          title="Pregúntale a @FeNi AI cualquier duda de la clase"
        >
          <span className="text-sm">🐦‍🔥</span>
          <span className="hidden sm:inline">Preguntar a @FeNi AI</span>
        </button>

        <Link
          href={`/mi-aula/${moduleId}/oral-exam`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-semibold transition-all active:scale-95"
        >
          <Award className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Evaluación</span>
        </Link>
      </div>
    </header>
  );
}
