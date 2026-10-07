'use client';

import { use, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Award, Bot, CheckCircle2, Clock, Mic, MicOff, Send, ShieldCheck, Volume2, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getModuleById } from '@/lib/curriculum-data';
import { useAcademyVoice } from '@/hooks/useAcademyVoice';
import {
  EXAM_QUESTIONS_PER_ATTEMPT, MAX_ATTEMPTS_PER_DAY, MIN_ANSWER_WORDS, PASS_MIN_PER_QUESTION, PASS_TOTAL, POINTS_PER_QUESTION,
} from '@/lib/exam-bank';

interface QuestionState { questionNumber: number; totalQuestions: number; question: string; expiresAt: number }
interface QuestionResult { score: number; covered: string[]; missing: string[]; feedback: string }
interface FinalState { passed: boolean; total: number; weakest: number; summary: { question: string; score: number; missing: string[] }[] }

// Dictado por voz (Chrome/Edge). No está en las definiciones estándar de TypeScript.
interface DictationResultEvent { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }
interface Dictation { lang: string; continuous: boolean; interimResults: boolean; start(): void; stop(): void; onresult: ((e: DictationResultEvent) => void) | null; onend: (() => void) | null }
type DictationCtor = new () => Dictation;

export default function ExamPage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = use(params);
  const courseModule = getModuleById(moduleId);
  const { currentUser } = useAuth();
  const { isSpeaking, needsGesture, speakText, stopSpeaking, resumeAfterGesture } = useAcademyVoice();

  const [examId, setExamId] = useState<string | null>(null);
  const [current, setCurrent] = useState<QuestionState | null>(null);
  const [answer, setAnswer] = useState('');
  const [lastResult, setLastResult] = useState<QuestionResult | null>(null);
  const [final, setFinal] = useState<FinalState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [listening, setListening] = useState(false);
  const [certificate, setCertificate] = useState<string | null>(null);
  const dictationRef = useRef<Dictation | null>(null);

  const words = answer.trim() ? answer.trim().split(/\s+/).length : 0;
  const remainingMs = current ? Math.max(0, current.expiresAt - now) : 0;

  useEffect(() => {
    if (!current || final) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [current, final]);

  const call = useCallback(async (body: object) => {
    if (!currentUser) throw new Error('Inicia sesión para rendir el examen.');
    const token = await currentUser.getIdToken();
    const response = await fetch('/api/oral-exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error((data as { error?: string }).error ?? 'No se pudo procesar la solicitud.');
    return data;
  }, [currentUser]);

  const askQuestion = useCallback((q: QuestionState) => {
    setCurrent(q);
    setAnswer('');
    speakText(`Pregunta ${q.questionNumber} de ${q.totalQuestions}. ${q.question}`);
  }, [speakText]);

  const startExam = async () => {
    setBusy(true); setError(null);
    try {
      const data = await call({ action: 'start', moduleId }) as QuestionState & { examId: string };
      setExamId(data.examId);
      askQuestion(data);
    } catch (e) { setError(e instanceof Error ? e.message : 'Error'); }
    finally { setBusy(false); }
  };

  const stopDictation = () => { dictationRef.current?.stop(); setListening(false); };

  const submitAnswer = async () => {
    if (!examId) return;
    stopDictation(); stopSpeaking();
    setBusy(true); setError(null);
    try {
      const data = await call({ action: 'answer', examId, answer }) as { result: QuestionResult; finished: boolean; next?: QuestionState } & Partial<FinalState>;
      setLastResult(data.result);
      if (data.finished) {
        const result: FinalState = { passed: !!data.passed, total: data.total ?? 0, weakest: data.weakest ?? 0, summary: data.summary ?? [] };
        setFinal(result);
        setCurrent(null);
        speakText(result.passed
          ? `Felicitaciones. Aprobaste la evaluación con ${result.total} puntos sobre cien.`
          : `Obtuviste ${result.total} puntos. Aún no alcanzas el nivel de certificación. Revisa los conceptos que faltaron y vuelve a intentarlo.`);
      } else if (data.next) {
        askQuestion(data.next);
      }
    } catch (e) { setError(e instanceof Error ? e.message : 'Error'); }
    finally { setBusy(false); }
  };

  const toggleDictation = () => {
    if (listening) { stopDictation(); return; }
    const w = window as unknown as { SpeechRecognition?: DictationCtor; webkitSpeechRecognition?: DictationCtor };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) { setError('Tu navegador no permite dictado por voz. Usa Chrome o Edge, o escribe tu respuesta.'); return; }
    stopSpeaking();
    const rec = new Ctor();
    rec.lang = 'es-EC';
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e) => {
      let text = '';
      for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) text += e.results[i][0].transcript;
      if (text) setAnswer((prev) => `${prev}${prev && !prev.endsWith(' ') ? ' ' : ''}${text.trim()}`);
    };
    rec.onend = () => setListening(false);
    dictationRef.current = rec;
    rec.start();
    setListening(true);
  };

  const issueCertificate = async () => {
    setBusy(true); setError(null);
    try {
      if (!currentUser) throw new Error('Sesión no válida.');
      const token = await currentUser.getIdToken();
      const response = await fetch('/api/certificates/issue', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ moduleId }),
      });
      const data = await response.json() as { code?: string; error?: string };
      if (!response.ok || !data.code) throw new Error(data.error ?? 'No se pudo emitir el certificado.');
      setCertificate(data.code);
    } catch (e) { setError(e instanceof Error ? e.message : 'Error'); }
    finally { setBusy(false); }
  };

  useEffect(() => () => { dictationRef.current?.stop(); }, []);

  if (!courseModule) {
    return (
      <main className="min-h-screen bg-[#070b14] text-white flex flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-bold">Módulo no encontrado</h1>
        <Link href="/mi-aula" className="px-5 py-2.5 rounded-xl bg-amber-600 font-bold text-xs">Volver a Mi Aula</Link>
      </main>
    );
  }

  const mm = Math.floor(remainingMs / 60000);
  const ss = Math.floor((remainingMs % 60000) / 1000).toString().padStart(2, '0');

  return (
    <main className="min-h-screen bg-[#070b14] text-gray-100">
      <header className="sticky top-0 z-20 bg-[#0e1620]/95 backdrop-blur border-b border-gray-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Evaluación de certificación</p>
          <h1 className="text-sm sm:text-base font-bold text-white truncate">Módulo {courseModule.number}: {courseModule.title}</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {current && (
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold ${remainingMs < 5 * 60000 ? 'bg-red-500/20 text-red-300' : 'bg-gray-800 text-gray-300'}`}>
              <Clock className="w-3.5 h-3.5" /> {mm}:{ss}
            </span>
          )}
          <Link href={`/mi-aula/${moduleId}`} className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-gray-800">Volver al módulo</Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {error && (
          <div role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
        )}

        {!examId && !final && (
          <section className="rounded-2xl border border-purple-500/30 bg-[#0e1620] p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center"><Award className="w-6 h-6 text-purple-300" /></div>
              <div>
                <h2 className="text-lg font-bold text-white">Antes de empezar</h2>
                <p className="text-xs text-gray-400">Este examen certifica que entiendes el sistema, no que memorizaste respuestas.</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• {EXAM_QUESTIONS_PER_ATTEMPT} preguntas abiertas, elegidas al azar. El Tutor IA califica cada una contra los conceptos que una respuesta correcta debe explicar.</li>
              <li>• Para aprobar necesitas <strong className="text-white">{PASS_TOTAL}/100</strong> y al menos <strong className="text-white">{PASS_MIN_PER_QUESTION}/{POINTS_PER_QUESTION}</strong> en <strong className="text-white">cada</strong> pregunta.</li>
              <li>• Tienes 45 minutos. Puedes responder hablando (micrófono) o escribiendo. No se permite pegar texto.</li>
              <li>• Mínimo {MIN_ANSWER_WORDS} palabras por respuesta: explica el porqué y el impacto en la empresa, no solo el qué.</li>
              <li>• Máximo {MAX_ATTEMPTS_PER_DAY} intentos cada 24 horas.</li>
            </ul>
            <button
              onClick={startExam}
              disabled={busy}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-bold active:scale-95 transition-all"
            >
              {busy ? 'Preparando examen...' : 'Comenzar evaluación'}
            </button>
          </section>
        )}

        {lastResult && (
          <section className="rounded-2xl border border-gray-700 bg-[#0e1620] p-5 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Resultado de la pregunta anterior</p>
            <p className="text-2xl font-bold text-white">{lastResult.score}<span className="text-sm text-gray-400">/{POINTS_PER_QUESTION}</span></p>
            <p className="text-sm text-gray-300">{lastResult.feedback}</p>
            {lastResult.missing.length > 0 && (
              <p className="text-xs text-amber-300">Faltó: {lastResult.missing.join(' · ')}</p>
            )}
          </section>
        )}

        {current && !final && (
          <section className="rounded-2xl border border-blue-500/30 bg-[#0e1620] p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Pregunta {current.questionNumber} de {current.totalQuestions}</span>
              <div className="flex items-center gap-2">
                {isSpeaking && <span className="flex items-center gap-1 text-xs text-amber-300 animate-pulse"><Bot className="w-3.5 h-3.5" /> Leyendo...</span>}
                {needsGesture && (
                  <button onClick={resumeAfterGesture} className="flex items-center gap-1 px-2 py-1 rounded bg-amber-500 text-slate-950 text-xs font-bold"><Volume2 className="w-3.5 h-3.5" /> Escuchar</button>
                )}
                <button onClick={() => speakText(current.question)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800" title="Repetir pregunta"><Volume2 className="w-4 h-4" /></button>
              </div>
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-white leading-relaxed">{current.question}</h2>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onPaste={(e) => { e.preventDefault(); setError('Pegar texto no está permitido en la evaluación. Responde con tus palabras.'); }}
              onDrop={(e) => e.preventDefault()}
              rows={8}
              placeholder="Explica con tus palabras: qué es, para qué sirve en la empresa y cómo se hace en SAP Business One..."
              className="w-full rounded-xl bg-[#070b14] border border-gray-700 focus:border-blue-500 focus:outline-none p-3 text-sm text-gray-100 leading-relaxed"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleDictation}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all ${listening ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'}`}
                >
                  {listening ? <><MicOff className="w-4 h-4" /> Detener dictado</> : <><Mic className="w-4 h-4" /> Responder hablando</>}
                </button>
                <span className={`text-xs ${words >= MIN_ANSWER_WORDS ? 'text-emerald-400' : 'text-gray-500'}`}>{words}/{MIN_ANSWER_WORDS} palabras mínimas</span>
              </div>
              <button
                onClick={submitAnswer}
                disabled={busy || words < MIN_ANSWER_WORDS}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-bold active:scale-95 transition-all"
              >
                <Send className="w-4 h-4" /> {busy ? 'Evaluando...' : 'Enviar respuesta'}
              </button>
            </div>
          </section>
        )}

        {final && (
          <section className={`rounded-2xl border p-6 space-y-5 ${final.passed ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-red-500/40 bg-red-500/5'}`}>
            <div className="flex items-center gap-3">
              {final.passed ? <CheckCircle2 className="w-10 h-10 text-emerald-400" /> : <XCircle className="w-10 h-10 text-red-400" />}
              <div>
                <h2 className="text-xl font-bold text-white">{final.passed ? '¡Aprobaste la certificación del módulo!' : 'Aún no alcanzas el nivel de certificación'}</h2>
                <p className="text-sm text-gray-300">Puntaje {final.total}/100 · pregunta más baja {final.weakest}/{POINTS_PER_QUESTION}</p>
              </div>
            </div>
            <ul className="space-y-3">
              {final.summary.map((s, i) => (
                <li key={i} className="rounded-xl bg-[#0e1620] border border-gray-800 p-3">
                  <p className="text-sm text-gray-200"><strong className={s.score >= PASS_MIN_PER_QUESTION ? 'text-emerald-400' : 'text-red-400'}>{s.score}/{POINTS_PER_QUESTION}</strong> — {s.question}</p>
                  {s.missing.length > 0 && <p className="text-xs text-amber-300 mt-1">Repasa: {s.missing.join(' · ')}</p>}
                </li>
              ))}
            </ul>
            {final.passed ? (
              certificate ? (
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-sm text-emerald-300"><ShieldCheck className="w-5 h-5" /> {courseModule.certificateTitle} emitido. Código de verificación: <strong className="font-mono">{certificate}</strong></p>
                  <Link href={`/verificar/${encodeURIComponent(certificate)}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200">
                    Ver página pública de verificación (para compartir con empleadores)
                  </Link>
                </div>
              ) : (
                <button onClick={issueCertificate} disabled={busy} className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold active:scale-95 transition-all">
                  {busy ? 'Emitiendo...' : 'Emitir mi certificado'}
                </button>
              )
            ) : (
              <Link href={`/mi-aula/${moduleId}`} className="inline-block px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold">Repasar el módulo</Link>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
