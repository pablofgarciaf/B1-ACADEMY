"use client";

import React, { useState } from 'react';
import { Play, Pause, Volume2, Maximize, RotateCcw, CheckCircle, Laptop, ShieldCheck } from 'lucide-react';

interface VideoPlayerProps {
  title: string;
  durationMin: number;
  systemType?: string;
  transactionCode?: string;
  onComplete?: () => void;
}

export function VideoPlayer({ 
  title, 
  durationMin, 
  systemType = "SAP Business One v10.0 / Heinsohn Ecuador",
  transactionCode = "Live Masterclass ERP",
  onComplete 
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleMarkCompleted = () => {
    setCompleted(true);
    if (onComplete) onComplete();
  };

  return (
    <div className="w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-black aspect-video relative flex flex-col justify-between p-6 group shadow-2xl">
      {/* Background simulado de consola SAP Business One & Heinsohn */}
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-[#0a1428] to-slate-900 opacity-95" />
      
      {/* Overlay de interfaz ERP real */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center space-y-2 opacity-35 group-hover:opacity-50 transition-opacity">
          <div className="font-mono text-xs text-sky-400 font-bold tracking-wide">
            {systemType} • {transactionCode}
          </div>
          <div className="font-mono text-[10px] text-slate-400">
            Grabación Oficial de Práctica ERP • Base de Datos HANA • 1080p 60fps
          </div>
        </div>
      </div>

      {/* Header superior del video */}
      <div className="relative z-10 flex justify-between items-center">
        <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/10 text-white backdrop-blur-md border border-white/10 flex items-center gap-2">
          <Laptop className="w-3.5 h-3.5 text-sky-400" />
          <span className="line-clamp-1">{title}</span>
        </span>
        <span className="text-xs text-slate-300 font-mono bg-black/40 px-2.5 py-1 rounded-lg border border-white/5">
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
            <button onClick={togglePlay} className="hover:text-sky-400 cursor-pointer font-bold">
              {isPlaying ? "Pausar Lección" : "Reproducir Lección"}
            </button>
            <Volume2 className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white" />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Instructor Certificado Heinsohn Ecuador
            </span>
            <button
              onClick={handleMarkCompleted}
              className={`px-3 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                completed
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {completed ? "Video Visto" : "Marcar Visto"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
