"use client";

import React, { useState } from 'react';
import { Play, Pause, Volume2, Maximize, RotateCcw, CheckCircle } from 'lucide-react';

interface VideoPlayerProps {
  title: string;
  durationMin: number;
  onComplete?: () => void;
}

export function VideoPlayer({ title, durationMin, onComplete }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleMarkCompleted = () => {
    setCompleted(true);
    if (onComplete) onComplete();
  };

  return (
    <div className="w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-black aspect-video relative flex flex-col justify-between p-6 group shadow-2xl">
      {/* Background simulado de consola SAP S/4HANA */}
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-[#0a1428] to-slate-900 opacity-90" />
      
      {/* Overlay de interfaz SAP Fiori */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center space-y-2 opacity-30 group-hover:opacity-40 transition-opacity">
          <div className="font-mono text-xs text-sky-400">SAP GUI S/4HANA • Transaction SPRO / FBL3N</div>
          <div className="font-mono text-[10px] text-slate-500">Live Practice Recording • 1080p 60fps</div>
        </div>
      </div>

      {/* Header superior del video */}
      <div className="relative z-10 flex justify-between items-center">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-md">
          {title}
        </span>
        <span className="text-xs text-slate-400 font-mono">
          {durationMin}:00 min
        </span>
      </div>

      {/* Botón central Play/Pause */}
      <div className="relative z-10 flex items-center justify-center">
        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-sap-blue/90 hover:bg-sap-blue text-white flex items-center justify-center shadow-lg shadow-sap-blue/50 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm"
        >
          {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
        </button>
      </div>

      {/* Barra de controles inferior */}
      <div className="relative z-10 space-y-2">
        {/* Barra de progreso */}
        <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
          <div className={`h-full bg-sap-blue transition-all duration-300 ${isPlaying ? 'w-2/3' : 'w-1/4'}`} />
        </div>

        <div className="flex justify-between items-center text-xs text-white">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="hover:text-sky-400 cursor-pointer">
              {isPlaying ? "Pausar" : "Reproducir"}
            </button>
            <Volume2 className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white" />
          </div>

          <button
            onClick={handleMarkCompleted}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              completed 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            {completed ? "Lección Completada" : "Marcar como Completada"}
          </button>
        </div>
      </div>
    </div>
  );
}
