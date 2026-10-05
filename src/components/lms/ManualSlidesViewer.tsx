"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Monitor, BookOpen, Maximize2, Info } from 'lucide-react';
import type { RealSlide } from '@/lib/slide-utils';

interface ManualSlidesViewerProps {
  slides: RealSlide[];
  /** Título de la ventana SAP simulada */
  windowTitle?: string;
  /** Código de transacción SAP */
  transactionCode?: string;
  /** Resumen del módulo para mostrar en el panel de ayuda */
  screenSummary?: string;
}

export function ManualSlidesViewer({
  slides,
  windowTitle = 'SAP Business One',
  transactionCode = 'SBO',
  screenSummary,
}: ManualSlidesViewerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleNext = useCallback(() => {
    setCurrentIdx(prev => Math.min(prev + 1, slides.length - 1));
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentIdx(prev => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleNext, handlePrev]);

  if (!slides || slides.length === 0) {
    return (
      <div className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] text-center space-y-3">
        <Monitor className="w-10 h-10 text-slate-400 mx-auto" />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No hay pantallas SAP disponibles para este módulo.
        </p>
      </div>
    );
  }

  const currentSlide = slides[currentIdx];
  const progress = ((currentIdx + 1) / slides.length) * 100;

  return (
    <div className="space-y-4">
      {/* Barra de título SAP */}
      <div className="rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#0c1424] shadow-2xl overflow-hidden">

        {/* Barra de título SO */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white px-4 py-2 flex items-center justify-between text-xs border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span className="font-mono font-bold text-sky-400 ml-2">
              [SAP Business One 10.0]
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-medium text-slate-200">{windowTitle}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-[11px] text-amber-300">
              Tx: {transactionCode}
            </span>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
              title="Pantalla completa"
            >
              <Maximize2 className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
            </button>
          </div>
        </div>

        {/* Barra de menús SAP */}
        <div className="bg-slate-200 dark:bg-slate-800/80 px-4 py-1.5 flex gap-4 text-[11px] text-slate-600 dark:text-slate-300 border-b border-slate-300 dark:border-slate-700 select-none">
          {['Archivo', 'Edición', 'Datos', 'Ir a', 'Herramientas', 'Ventana', 'Ayuda'].map(item => (
            <span key={item} className="hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer">{item}</span>
          ))}
        </div>

        {/* Área principal: imagen SAP real */}
        <div className={`relative bg-black ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
          <div className="relative w-full" style={{ aspectRatio: '16/9', minHeight: 400 }}>
            <Image
              key={currentSlide.imageUrl}
              src={encodeURI(currentSlide.imageUrl)}
              alt={`Pantalla SAP: ${currentSlide.manualTitle} - Diapositiva ${currentSlide.slideNum}`}
              fill
              className="object-contain"
              priority={currentIdx === 0}
              sizes="(max-width: 1280px) 100vw, 900px"
            />
          </div>
        </div>
      </div>

      {/* Barra de progreso y navegación */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] flex items-center gap-4">

        {/* Botón Anterior */}
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>

        {/* Barra de progreso */}
        <div className="flex-1 space-y-1.5">
          <div className="h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {currentSlide.manualTitle}
            </span>
            <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
              {currentIdx + 1} / {slides.length}
            </span>
          </div>
        </div>

        {/* Botón Siguiente */}
        <button
          onClick={handleNext}
          disabled={currentIdx === slides.length - 1}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-95"
        >
          Siguiente <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Mini-mapa de diapositivas (thumbnails) */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIdx(idx)}
            className={`flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
              idx === currentIdx
                ? 'border-sky-500 ring-1 ring-sky-500 scale-105'
                : 'border-slate-200 dark:border-white/10 opacity-60 hover:opacity-100 hover:border-slate-400'
            }`}
            title={`Diapositiva ${slide.slideNum}`}
          >
            <div className="relative w-full h-full">
              <Image
                src={encodeURI(slide.imageUrl)}
                alt={`Miniatura ${slide.slideNum}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          </button>
        ))}
      </div>

      {/* Panel informativo */}
      {screenSummary && (
        <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/20 border border-sky-500/20 flex items-start gap-3">
          <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong className="text-slate-900 dark:text-white">Contexto del módulo: </strong>
            {screenSummary}
          </p>
        </div>
      )}
    </div>
  );
}
