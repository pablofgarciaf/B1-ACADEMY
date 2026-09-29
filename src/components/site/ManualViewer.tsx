"use client";

import { useState } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ManualViewerProps {
  content: string;
  images: string[];
}

export default function ManualViewer({ content, images }: ManualViewerProps) {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const nextImage = () => {
    if (currentImageIdx < images.length - 1) {
      setCurrentImageIdx(prev => prev + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIdx > 0) {
      setCurrentImageIdx(prev => prev - 1);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      {/* Columna de Texto */}
      <div className="prose prose-invert prose-amber max-w-none prose-headings:font-semibold prose-a:text-amber-500 hover:prose-a:text-amber-400">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>

      {/* Columna de Imágenes (Sticky) */}
      <div className="relative">
        <div className="sticky top-28 flex flex-col items-center gap-4">
          {images.length > 0 ? (
            <>
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[currentImageIdx]}
                  alt={`Diapositiva ${currentImageIdx + 1}`}
                  className="h-full w-full object-contain"
                />
                
                {/* Controles sobre la imagen */}
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 transition-opacity hover:opacity-100">
                  <button 
                    onClick={prevImage}
                    disabled={currentImageIdx === 0}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur disabled:opacity-30"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={nextImage}
                    disabled={currentImageIdx === images.length - 1}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur disabled:opacity-30"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{currentImageIdx + 1} / {images.length}</span>
              </div>
            </>
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-gray-800 bg-gray-900 text-gray-500">
              No hay imágenes disponibles para este manual
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
