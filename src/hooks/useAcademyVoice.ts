'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Voz oficial de SAP Academy (es-MX-JorgeNeural, la de los videos de los manuales).
 * Reemplaza a window.speechSynthesis: nunca usa la voz robótica del navegador.
 * Si el servicio de voz falla, deja el texto en pantalla y avanza según el tiempo de lectura.
 */

const audioCache = new Map<string, Promise<string>>();

function fetchAudioUrl(text: string, firma?: string): Promise<string> {
  const key = text.trim();
  const cached = audioCache.get(key);
  if (cached) return cached;
  const request = fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // La firma (de guiones publicados por el sitio) permite narrar sin sesión iniciada.
    body: JSON.stringify(firma ? { text: key, firma } : { text: key }),
  }).then(async (response) => {
    if (!response.ok) throw new Error(`TTS ${response.status}`);
    return URL.createObjectURL(await response.blob());
  });
  request.catch(() => audioCache.delete(key));
  audioCache.set(key, request);
  return request;
}

/** Tiempo aproximado de lectura en voz alta (≈150 palabras por minuto a velocidad 1×). */
function readingTimeMs(text: string, velocidad = 1) {
  return Math.max(2500, (text.split(/\s+/).length / 2.5) * 1000) / velocidad;
}

/** Velocidades de narración disponibles (el botón las recorre en orden). */
export const VELOCIDADES_VOZ = [1, 1.25, 1.5, 1.75] as const;
const CLAVE_VELOCIDAD = 'b1_voz_velocidad';

function velocidadGuardada(): number {
  try {
    const v = Number(localStorage.getItem(CLAVE_VELOCIDAD));
    return (VELOCIDADES_VOZ as readonly number[]).includes(v) ? v : 1;
  } catch { return 1; }
}

/** Aplica la velocidad sin cambiar el tono de la voz (sin efecto "ardilla"). */
function aplicarVelocidad(audio: HTMLAudioElement, velocidad: number) {
  audio.preservesPitch = true;
  audio.playbackRate = velocidad;
}

export function useAcademyVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  /** true si el servicio de voz no respondió (red, 401, 503) en la última narración. */
  const [vozFallo, setVozFallo] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tokenRef = useRef(0);
  const pendingEndRef = useRef<(() => void) | undefined>(undefined);
  const mutedRef = useRef(false);
  const [velocidad, setVelocidad] = useState(1);
  const velocidadRef = useRef(1);
  useEffect(() => { const v = velocidadGuardada(); velocidadRef.current = v; setVelocidad(v); }, []);

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

  const speakText = useCallback((text: string, onEnd?: () => void, firma?: string) => {
    tokenRef.current += 1;
    const token = tokenRef.current;
    clearPlayback();
    setNeedsGesture(false);
    setVozFallo(false);
    let finished = false;
    const finish = () => {
      if (token !== tokenRef.current || finished) return;
      finished = true;
      clearPlayback();
      setIsSpeaking(false);
      pendingEndRef.current = undefined;
      onEnd?.();
    };
    if (!text.trim()) { finish(); return; }
    setIsSpeaking(true);
    pendingEndRef.current = finish;
    fetchAudioUrl(text, firma)
      .then((url) => {
        if (token !== tokenRef.current) return;
        const audio = audioRef.current ?? new Audio();
        audioRef.current = audio;
        audio.muted = mutedRef.current;
        audio.src = url;
        aplicarVelocidad(audio, velocidadRef.current); // tras src: cambiar la fuente puede reiniciar la velocidad
        audio.onended = finish;
        audio.onerror = finish;
        return audio.play().catch((error: unknown) => {
          if (token !== tokenRef.current) return;
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
        setVozFallo(true); // quien use el hook puede detenerse en lugar de avanzar en silencio
        timerRef.current = setTimeout(finish, readingTimeMs(text, velocidadRef.current));
      });
  }, [clearPlayback]);

  /** Reanuda tras el bloqueo de autoplay (se llama desde un clic del usuario). */
  const resumeAfterGesture = useCallback(() => {
    const audio = audioRef.current;
    const token = tokenRef.current;
    const end = pendingEndRef.current;
    if (!audio || !end) return;
    setNeedsGesture(false);
    setIsSpeaking(true);
    audio.play().catch(() => { if (token === tokenRef.current) end(); });
  }, []);

  /** Descarga por adelantado la narración siguiente para que no haya silencios entre láminas. */
  const preload = useCallback((text: string, firma?: string) => {
    if (text.trim()) fetchAudioUrl(text, firma).catch(() => undefined);
  }, []);

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setIsMuted(next);
    // Muting changes volume, not lesson progress. Also applies to audio still loading.
    if (audioRef.current) audioRef.current.muted = next;
  }, []);

  /** Pasa a la siguiente velocidad (1× → 1.25× → 1.5× → 1.75× → 1×); se aplica al instante y se recuerda. */
  const cambiarVelocidad = useCallback(() => {
    const actual = VELOCIDADES_VOZ.indexOf(velocidadRef.current as (typeof VELOCIDADES_VOZ)[number]);
    const siguiente = VELOCIDADES_VOZ[(actual + 1) % VELOCIDADES_VOZ.length];
    velocidadRef.current = siguiente;
    setVelocidad(siguiente);
    if (audioRef.current) aplicarVelocidad(audioRef.current, siguiente);
    try { localStorage.setItem(CLAVE_VELOCIDAD, String(siguiente)); } catch { /* sin almacenamiento */ }
  }, []);

  useEffect(() => () => { tokenRef.current += 1; clearPlayback(); }, [clearPlayback]);

  return { isSpeaking, isMuted, needsGesture, vozFallo, speakText, stopSpeaking, toggleMute, resumeAfterGesture, preload, velocidad, cambiarVelocidad };
}
