"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, PlayCircle, BookOpen } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

export interface Slide {
  id: string;
  title?: string;
  content: string; // Markdown supported
  imageUrl?: string;
  audioUrl?: string; // For future text-to-speech integration
}

interface SlideViewerProps {
  slides: Slide[];
  onComplete?: () => void;
}

export const SlideViewer = ({ slides, onComplete }: SlideViewerProps) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, slides.length]);

  if (!slides || slides.length === 0) return <div>No hay diapositivas disponibles.</div>;

  const currentSlide = slides[currentIdx];

  const handleNext = () => {
    if (currentIdx < slides.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  return (
    <div className="w-full flex flex-col bg-slate-50 dark:bg-[#0B0F17] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm aspect-[16/9] min-h-[500px]">
      
      {/* Top Progress Bar */}
      <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5">
        <div 
          className="h-full bg-sap-blue transition-all duration-300 ease-out"
          style={{ width: `${((currentIdx + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Main Slide Content */}
      <div className="flex-1 flex flex-col relative p-8 md:p-12 overflow-y-auto">
        
        {/* Slide Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2 text-sap-blue dark:text-sky-400">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-wider uppercase">Diapositiva {currentIdx + 1} de {slides.length}</span>
          </div>
          
          {/* Audio Button (Placeholder for future) */}
          <button className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors text-xs font-medium group cursor-pointer active:scale-95">
            <PlayCircle className="w-4 h-4 text-slate-500 group-hover:text-sap-blue dark:group-hover:text-sky-400" />
            <span>Escuchar Lección</span>
          </button>
        </div>

        {/* Slide Body */}
        <div className="flex-1 flex flex-col md:flex-row gap-8 items-center">
          <div className={`flex-1 prose dark:prose-invert max-w-none w-full ${currentSlide.imageUrl ? 'md:w-1/2' : ''}`}>
            {currentSlide.title && (
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight mt-0">
                {currentSlide.title}
              </h2>
            )}
            <div className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
              <MarkdownRenderer content={currentSlide.content} />
            </div>
          </div>
          
          {currentSlide.imageUrl && (
            <div className="flex-1 w-full md:w-1/2 h-full min-h-[300px] rounded-xl overflow-hidden bg-slate-200 dark:bg-white/5 border border-slate-200 dark:border-white/10 relative">
              <img 
                src={currentSlide.imageUrl} 
                alt={currentSlide.title || "Slide Image"} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}
        </div>

      </div>

      {/* Bottom Controls */}
      <div className="h-20 border-t border-slate-200 dark:border-white/10 flex items-center justify-between px-6 bg-white dark:bg-[#131a20]">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="flex items-center px-4 py-2 rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Anterior
        </button>

        <div className="flex items-center space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIdx 
                  ? 'bg-sap-blue scale-125' 
                  : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-500'
              }`}
              aria-label={`Ir a diapositiva ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="flex items-center px-6 py-2.5 rounded-xl font-bold text-white bg-sap-blue hover:bg-sky-600 shadow-md shadow-sap-blue/20 disabled:opacity-50 transition-all active:scale-95"
        >
          {currentIdx === slides.length - 1 ? (
            'Completar Lección'
          ) : (
            <>
              Siguiente
              <ChevronRight className="w-5 h-5 ml-1" />
            </>
          )}
        </button>
      </div>

    </div>
  );
};
