'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Voz oficial de SAP Academy (es-MX-JorgeNeural, la de los videos de los manuales).
 * Reemplaza a window.speechSynthesis: nunca usa la voz robótica del navegador.
 * Si el servicio de voz falla, deja el texto en pantalla y avanza según el tiempo de lectura.
 */

const audioCache = new Map<string, Promise<string>>();

function fetchAudioUrl(text: string): Promise<string> {
  const key = text.trim();
  const cached = audioCache.get(key);
  if (cached) return cached;
  const request = fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: key }),
  }).then(async (response) => {
    if (!response.ok) throw new Error(`TTS ${response.status}`);
    return URL.createObjectURL(await response.blob());
  });
  request.catch(() => audioCache.delete(key));
  audioCache.set(key, request);
  return request;
}

/** Tiempo aproximado de lectura en voz alta (≈150 palabras por minuto). */
function readingTimeMs(text: string) {
  return Math.max(2500, (text.split(/\s+/).length / 2.5) * 1000);
}

export function useAcademyVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tokenRef = useRef(0);
  const pendingEndRef = useRef<(() => void) | undefined>(undefined);
  const mutedRef = useRef(false);

  const clearPlayback = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    tokenRef.current += 1;
    clearPlayback();
    pendingEndRef.current = undefined;
    setIsSpeaking(false);
    setNeedsGesture(false);
  }, [clearPlayback]);

  const speakText = useCallback((text: string, onEnd?: () => void) => {
    tokenRef.current += 1;
    const token = tokenRef.current;
    clearPlayback();
    setNeedsGesture(false);
    const finish = () => {
      if (token !== tokenRef.current) return;
      setIsSpeaking(false);
      pendingEndRef.current = undefined;
      onEnd?.();
    };
    if (!text.trim()) { finish(); return; }
    if (mutedRef.current) {
      // Silenciado: el estudiante lee el texto; se respeta su ritmo de lectura.
      timerRef.current = setTimeout(finish, readingTimeMs(text));
      return;
    }

    setIsSpeaking(true);
    pendingEndRef.current = finish;
    fetchAudioUrl(text)
      .then((url) => {
        if (token !== tokenRef.current) return;
        const audio = audioRef.current ?? new Audio();
        audioRef.current = audio;
        audio.src = url;
        audio.onended = finish;
        audio.onerror = finish;
        return audio.play().catch((error: unknown) => {
          // El navegador bloquea el audio hasta que el usuario interactúe con la página.
          if (error instanceof DOMException && error.name === 'NotAllowedError') {
            setIsSpeaking(false);
            setNeedsGesture(true);
            return;
          }
          finish();
        });
      })
      .catch(() => {
        if (token !== tokenRef.current) return;
        setIsSpeaking(false);
        timerRef.current = setTimeout(finish, readingTimeMs(text));
      });
  }, [clearPlayback]);

  /** Reanuda tras el bloqueo de autoplay (se llama desde un clic del usuario). */
  const resumeAfterGesture = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setNeedsGesture(false);
    setIsSpeaking(true);
    audio.play().catch(() => pendingEndRef.current?.());
  }, []);

  /** Descarga por adelantado la narración siguiente para que no haya silencios entre láminas. */
  const preload = useCallback((text: string) => {
    if (text.trim()) fetchAudioUrl(text).catch(() => undefined);
  }, []);

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setIsMuted(next);
    if (next && audioRef.current && !audioRef.current.paused) {
      // Al silenciar a mitad de una narración, se termina ese tramo y la clase sigue.
      const end = pendingEndRef.current;
      stopSpeaking();
      end?.();
    }
  }, [stopSpeaking]);

  useEffect(() => () => { tokenRef.current += 1; clearPlayback(); }, [clearPlayback]);

  return { isSpeaking, isMuted, needsGesture, speakText, stopSpeaking, toggleMute, resumeAfterGesture, preload };
}
