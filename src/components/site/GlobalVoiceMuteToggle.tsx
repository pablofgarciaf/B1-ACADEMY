"use client";

import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const CLAVE_GLOBAL_MUTE = 'finix_global_mute';

export function GlobalVoiceMuteToggle() {
  const [isMuted, setIsMuted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(CLAVE_GLOBAL_MUTE) === 'true';
      setIsMuted(saved);
    } catch {
      // Ignorar restricciones de storage
    }

    const handleSync = (e: Event) => {
      try {
        const customVal = (e as CustomEvent).detail?.isMuted;
        if (typeof customVal === 'boolean') {
          setIsMuted(customVal);
        } else {
          setIsMuted(localStorage.getItem(CLAVE_GLOBAL_MUTE) === 'true');
        }
      } catch {
        // Fallback seguro
      }
    };

    window.addEventListener('finix-mute-changed', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('finix-mute-changed', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const toggle = () => {
    const next = !isMuted;
    setIsMuted(next);
    try {
      localStorage.setItem(CLAVE_GLOBAL_MUTE, String(next));
      window.dispatchEvent(new CustomEvent('finix-mute-changed', { detail: { isMuted: next } }));
    } catch {
      // Fallback
    }
  };

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 opacity-0 pointer-events-none" />
    );
  }

  return (
    <button
      onClick={toggle}
      className={`relative p-2.5 rounded-xl border transition-all active:scale-95 flex items-center justify-center ${
        isMuted
          ? 'border-amber-500/40 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
          : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-finix-blue hover:text-finix-blue dark:hover:text-sky-300 hover:bg-slate-50 dark:hover:bg-white/5'
      }`}
      title={
        isMuted
          ? 'Narración de diapositivas: SILENCIADA (Click para activar audio en todas las clases)'
          : 'Narración de diapositivas: ACTIVA (Click para silenciar en todas las clases)'
      }
      aria-label={
        isMuted
          ? 'Activar narración de diapositivas'
          : 'Silenciar narración de diapositivas'
      }
    >
      {isMuted ? (
        <VolumeX className="w-4 h-4 text-amber-500 animate-pulse" />
      ) : (
        <Volume2 className="w-4 h-4 opacity-80" />
      )}
      <span className="sr-only">
        {isMuted ? 'Audio silenciado' : 'Audio activo'}
      </span>
    </button>
  );
}
