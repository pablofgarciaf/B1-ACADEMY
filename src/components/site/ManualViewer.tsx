"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Bot,
  FileQuestion,
  Wrench,
  GraduationCap,
  Send,
  PlayCircle,
  CheckCircle2,
  Sparkles,
  Lightbulb,
  Compass,
  Target,
  Maximize2,
  X,
  Timer,
  ShieldAlert,
  Award,
  Download,
  AlertTriangle,
  ShieldCheck,
  Pause,
  Volume2
} from 'lucide-react';
import { useAcademyVoice } from '@/hooks/useAcademyVoice';

import { QuizQuestion, getQuizForManual } from '@/lib/manual-quizzes-data';
import SAPInteractiveSimulator from '@/components/simulator/SAPInteractiveSimulator';
import { getManualSimulatorConfig } from '@/lib/manual-simulator-registry';
import MasterB1CheckpointOverlay from '@/components/lms/MasterB1CheckpointOverlay';

export interface StepGuide {
  title: string;
  menu_path?: string;
  action_type?: string;
  instructions: string[];
  expected_output?: string;
}

export interface SyncData {
  slide_index: number;
  image_file: string;
  script_text: string;
  start_time: number;
  end_time: number;
  step_guide?: StepGuide;
  /** Firma del servidor que permite narrar este guion sin sesión (modo narrado). */
  firma?: string;
}

interface ManualViewerProps {
  manualId?: string;
  content: string;
  images: string[];
  videoUrl?: string;
  syncData?: SyncData[];
  quizQuestions?: QuizQuestion[];
}

export default function ManualViewer({
  manualId,
  content,
  images,
  videoUrl,
  syncData,
  quizQuestions: externalQuestions
}: ManualViewerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'explicacion' | 'ia' | 'docente' | 'faq' | 'simulador' | 'quiz'>('explicacion');
  const [completedCheckpoints, setCompletedCheckpoints] = useState<number[]>([]);
  const [isMasterB1CheckpointOpen, setIsMasterB1CheckpointOpen] = useState(false);

  // Detectar si es un manual de Casos Prácticos (CS)
  const isPractical = useMemo(() => {
    return !!manualId && (
      manualId.startsWith('CS') ||
      manualId.includes('Query') ||
      manualId.includes('Introduction') ||
      manualId.includes('Procurement')
    );
  }, [manualId]);

  // Estado para modal expandido del simulador
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState(false);

  // Función para pantalla completa del reproductor de video
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        } else if ((videoRef.current as any).webkitRequestFullscreen) {
          (videoRef.current as any).webkitRequestFullscreen();
        } else if ((videoRef.current as any).msRequestFullscreen) {
          (videoRef.current as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  };

  // Estado de Aprobado (guardado en localStorage)
  const [isApproved, setIsApproved] = useState(false);
  const simConfig = useMemo(() => getManualSimulatorConfig(manualId || ''), [manualId]);

  useEffect(() => {
    if (manualId) {
      try {
        const saved = localStorage.getItem('sap_completed_manuals');
        if (saved) {
          const list: string[] = JSON.parse(saved);
          if (list.includes(manualId)) {
            setIsApproved(true);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [manualId]);

  // Ref y estado para Sincronización Teleprompter
  const videoRef = useRef<HTMLVideoElement>(null);
  const teleprompterScrollRef = useRef<HTMLDivElement>(null);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);

  // Imagen, voz y texto activo siempre se resuelven desde el mismo registro.
  const syncSlideForIndex = useCallback((idx: number) => {
    if (!syncData) return undefined;
    const fileName = images[idx]?.split('/').pop();
    return syncData.find((slide) => slide.image_file === fileName) ?? syncData[idx];
  }, [images, syncData]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentVideoTime(time);

      // Detección de Checkpoint Obligatorio de Laboratorio (Opción A: Pausa Estricta)
      if (syncData && syncData.length > 0 && !isMasterB1CheckpointOpen) {
        const slide = syncData.find(s => time >= s.start_time && time < s.end_time);
        if (slide?.step_guide && !completedCheckpoints.includes(slide.slide_index)) {
          videoRef.current.pause();
          setIsMasterB1CheckpointOpen(true);
        }
      }
    }
  };

  const activeSyncSlide = useMemo(() => {
    if (!syncData || syncData.length === 0) return null;
    if (!videoUrl) return syncSlideForIndex(currentIdx) ?? syncData[0];
    return syncData.find(s => currentVideoTime >= s.start_time && currentVideoTime < s.end_time) || syncData[0];
  }, [currentVideoTime, syncData, videoUrl, currentIdx, syncSlideForIndex]);

  // Auto-scroll del Teleprompter para que el texto vaya subiendo fluidamente
  useEffect(() => {
    if (activeSyncSlide && activeTab === 'explicacion') {
      const scrollArea = teleprompterScrollRef.current;
      const activeEl = scrollArea?.querySelector<HTMLElement>(`[data-sync-slide="${activeSyncSlide.slide_index}"]`);
      if (scrollArea && activeEl) {
        const areaRect = scrollArea.getBoundingClientRect();
        const itemRect = activeEl.getBoundingClientRect();
        const itemTop = itemRect.top - areaRect.top + scrollArea.scrollTop;
        const centeredTop = itemTop - (scrollArea.clientHeight - activeEl.offsetHeight) / 2;
        scrollArea.scrollTo({ top: Math.max(0, centeredTop), behavior: 'smooth' });
      }
    }
  }, [activeSyncSlide, activeTab]);

  // Estado para el Examen con Profesor IA
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(35);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [professorFeedback, setProfessorFeedback] = useState<{ status: 'correct' | 'incorrect' | 'timeout' | null, message: string }>({ status: null, message: '' });
  const [cheatAlert, setCheatAlert] = useState<string | null>(null);
  const [writtenAnswer, setWrittenAnswer] = useState<string>('');

  const quizQuestions = useMemo(() => {
    if (externalQuestions && externalQuestions.length > 0) {
      return externalQuestions;
    }
    if (manualId) {
      return getQuizForManual(manualId, '', '');
    }
    return [
      {
        q: "¿Cuál es el propósito principal de SAP Business One?",
        options: [
          "Diseño gráfico y edición multimedia",
          "Integrar todos los procesos empresariales en una sola plataforma unificada",
          "Crear páginas web estáticas",
          "Solo llevar la contabilidad básica"
        ],
        answer: 1,
        explanation: "SAP B1 es un ERP integral que unifica finanzas, compras, ventas, inventario y producción."
      }
    ];
  }, [externalQuestions, manualId]);

  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  const moveToNextQuestion = useCallback((scoreSoFar: number) => {
    setProfessorFeedback({ status: null, message: '' });
    setWrittenAnswer('');
    setIsEvaluating(false);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimeLeft(35);
    } else {
      setQuizCompleted(true);
      const passingMin = Math.ceil(quizQuestions.length * 0.90);
      if (scoreSoFar >= passingMin && manualId) {
        setIsApproved(true);
        try {
          const saved = localStorage.getItem('sap_completed_manuals');
          const list: string[] = saved ? JSON.parse(saved) : [];
          if (!list.includes(manualId)) {
            list.push(manualId);
            localStorage.setItem('sap_completed_manuals', JSON.stringify(list));
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [currentQuestion, manualId, quizQuestions.length]);

  const handleQuestionTimeout = useCallback(() => {
    setIsEvaluating(true);
    setProfessorFeedback({
      status: 'timeout',
      message: '⏰ ¡Tiempo agotado! No respondiste en los 35 segundos asignados. La calificación para esta pregunta es 0/100. Pasemos a la siguiente pregunta.'
    });

    setTimeout(() => {
      moveToNextQuestion(quizScore);
    }, 2500);
  }, [moveToNextQuestion, quizScore]);

  // Temporizador regresivo estricto de 35 segundos para el Examen
  useEffect(() => {
    if (!quizStarted || quizCompleted || isEvaluating) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleQuestionTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted, isEvaluating, currentQuestion, handleQuestionTimeout]);

  // Detección de cambio de pestaña / ventana (Anti-Cheat)
  useEffect(() => {
    if (!quizStarted || quizCompleted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setCheatAlert("⚠️ Alerta de Seguridad: Se detectó cambio de pestaña o ventana durante el examen.");
        setTimeout(() => setCheatAlert(null), 5000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [quizStarted, quizCompleted]);

  const handleAnswer = (selectedOptionIndex: number) => {
    if (isEvaluating) return;
    setIsEvaluating(true);

    const isCorrect = selectedOptionIndex === quizQuestions[currentQuestion].answer;
    setUserAnswers(prev => ({ ...prev, [currentQuestion]: selectedOptionIndex }));
    const nextScore = isCorrect ? quizScore + 1 : quizScore;
    if (isCorrect) {
      setQuizScore(nextScore);
    }

    setProfessorFeedback({
      status: isCorrect ? 'correct' : 'incorrect',
      message: isCorrect
        ? `✓ ¡Excelente! ${quizQuestions[currentQuestion].explanation}`
        : `✗ Incorrecto. ${quizQuestions[currentQuestion].explanation}`
    });

    setTimeout(() => {
      moveToNextQuestion(nextScore);
    }, 2400);
  };

  const restartQuiz = () => {
    setQuizStarted(true);
    setQuizCompleted(false);
    setQuizScore(0);
    setCurrentQuestion(0);
    setTimeLeft(35);
    setIsEvaluating(false);
    setProfessorFeedback({ status: null, message: '' });
    setWrittenAnswer('');
    setUserAnswers({});
  };

  // Estado para Chat IA Contextual
  const [chatInput, setChatInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ia', text: string }[]>([
    {
      role: 'ia',
      text: isPractical
        ? "¡Hola! Soy tu tutor de Laboratorio Práctico de SAP Business One. Tengo cargadas las especificaciones de este caso de estudio y del simulador interactivo. ¿En qué paso o validación técnica necesitas apoyo?"
        : "¡Hola! Soy tu tutor virtual de B1 Academy. He analizado la documentación técnica de este manual. ¿Qué concepto o flujo operativo deseas comprender a fondo?"
    }
  ]);

  const handleSendMessage = async (overrideText?: string) => {
    const textToSend = overrideText || chatInput;
    if (!textToSend.trim() || isAiLoading) return;
    const userText = textToSend.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    if (!overrideText) setChatInput("");

    // PROTOCOLO ESTRICTO DE INTEGRIDAD ACADÉMICA (ANTI-TRAMPAS)
    const lower = userText.toLowerCase();
    const isAskingExam =
      lower.includes("respuesta") ||
      lower.includes("quiz") ||
      lower.includes("examen") ||
      lower.includes("pregunta") ||
      lower.includes("opción") ||
      lower.includes("opcion") ||
      lower.includes("cuál es la correcta") ||
      lower.includes("cual es la correcta") ||
      lower.includes("dime la a") ||
      lower.includes("dime la b") ||
      lower.includes("dime la c") ||
      lower.includes("ayúdame a pasar") ||
      lower.includes("ayudame a pasar");

    if (isAskingExam) {
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          {
            role: 'ia',
            text: `⚠️ **AVISO DE INTEGRIDAD ACADÉMICA Y CONTROL DE EVALUACIÓN**\n\nComo Tutor Virtual Oficial de B1 Academy, **tengo estrictamente prohibido dar respuestas directas a preguntas de evaluación, quizzes o exámenes de certificación**.\n\n📌 **Orientación de Estudio:** Para responder esta interrogante, por favor repasa con atención el Teleprompter y las diapositivas explicativas de este manual.\n\n🚨 **Registro Académico:** Este intento de solicitud de respuestas ha sido registrado en tu expediente de estudiante.\n\n💼 **Recordatorio de Bolsa de Empleo:** Recuerda que para ingresar a las vacantes de nuestra Bolsa de Empleo con empresas partners de SAP, **deberás aprobar obligatoriamente una evaluación técnica presencial y semi-oral en vivo con nuestros reclutadores**, donde deberás defender tus conocimientos frente al sistema real. Intentar memorizar o trampear respuestas en la plataforma no te servirá en la entrevista presencial.`
          }
        ]);
      }, 500);
      return;
    }

    // Inyectar contexto del paso actual si existe
    const stepContext = activeSyncSlide?.step_guide
      ? `[Contexto Técnico de la Tarea: "${activeSyncSlide.step_guide.title}" | Ruta SAP: "${activeSyncSlide.step_guide.menu_path || 'General'}" | Instrucciones: ${activeSyncSlide.step_guide.instructions?.join(' ')} | Resultado: ${activeSyncSlide.step_guide.expected_output || 'N/A'}]`
      : "";

    setIsAiLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...chatMessages.map(m => ({ role: m.role === 'ia' ? 'assistant' : 'user', content: m.text })),
            { role: 'user', content: `${stepContext}\n${userText}` }
          ]
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.message) {
          setChatMessages(prev => [...prev, { role: 'ia', text: data.message }]);
          setIsAiLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Fallback local de IA:", e);
    }

    // Fallback inteligente enriquecido con el caso práctico activo
    setTimeout(() => {
      let aiResponse = "Excelente análisis. En SAP Business One, todos los procesos se comunican de forma nativa a través de la capa de objetos de negocio para garantizar trazabilidad. ¡Sigue explorando el simulador y las diapositivas para dominar los detalles!";

      if (activeSyncSlide?.step_guide && (lower.includes("pista") || lower.includes("ayuda") || lower.includes("cómo") || lower.includes("paso"))) {
        aiResponse = `💡 **Pista Pedagógica para ${activeSyncSlide.step_guide.title}:**\n\n1. **Ubicación en SAP B1:** Navega a \`${activeSyncSlide.step_guide.menu_path || 'Menú Principal'}\`.\n2. **Procedimiento Clave:** ${activeSyncSlide.step_guide.instructions?.join(' ')}\n3. **Resultado Esperado:** ${activeSyncSlide.step_guide.expected_output || 'Verifica que la grilla o documento refleje los datos requeridos.'}\n\nPuedes probarlo directamente en el **Simulador Interactivo** a la izquierda.`;
      } else if (lower.includes("socio") || lower.includes("cliente") || lower.includes("proveedor") || lower.includes("ocrd")) {
        aiResponse = "Los Interlocutores Comerciales en SAP B1 se almacenan en la tabla OCRD. Se dividen en Clientes ('C'), Proveedores ('S') y Leads ('L'). En el simulador, filtrar por `CardType = 'C'` es esencial para separar clientes de proveedores.";
      } else if (lower.includes("hana") || lower.includes("sql") || lower.includes("consulta")) {
        aiResponse = "En las consultas SQL de SAP HANA, proyecta solo los campos estrictamente necesarios en el SELECT para optimizar la memoria columnar. Para filtros dinámicos con selector de calendario, utiliza la sintaxis `[%0]`.";
      } else if (lower.includes("compras") || lower.includes("pedido") || lower.includes("entrada") || lower.includes("factura") || lower.includes("aprovisionamiento")) {
        aiResponse = "El flujo de aprovisionamiento enlaza Pedido de Compras (OPOR) ➔ Entrada de Mercancías (OPDN) ➔ Factura de Proveedores (OPCH). La Entrada de Mercancías incrementa el stock físico y acredita la cuenta puente EM/RF, la cual se liquida automáticamente al registrar la Factura.";
      }

      setChatMessages(prev => [...prev, { role: 'ia', text: aiResponse }]);
      setIsAiLoading(false);
    }, 600);
  };

  // Navegación con teclado (Modo sin video)
  const nextSlide = useCallback(() => {
    if (currentIdx < images.length - 1) setCurrentIdx(prev => prev + 1);
  }, [currentIdx, images.length]);

  const prevSlide = useCallback(() => {
    if (currentIdx > 0) setCurrentIdx(prev => prev - 1);
  }, [currentIdx]);

  // ── Modo narrado: sin archivo de video, Jorge narra cada lámina con su guion (clase_sync.json) ──
  // Es lo mismo que el video (lámina fija + voz), pero sin almacenar gigas de MP4 en el hosting.
  const narrable = !videoUrl && !!syncData && syncData.length > 0;
  const { isSpeaking, needsGesture, vozFallo, speakText, stopSpeaking, resumeAfterGesture, preload } = useAcademyVoice();
  const [narrando, setNarrando] = useState(false);

  // La clase arranca sola 2 segundos después de abrir el manual (como un video).
  // Si el navegador bloquea el audio por no haber interacción previa, se muestra el botón "Escuchar a Jorge".
  useEffect(() => {
    if (!narrable) return;
    const inicio = setTimeout(() => setNarrando(true), 2000);
    return () => clearTimeout(inicio);
  }, [narrable]);

  // Si la voz no responde, la clase se detiene en la lámina actual: nunca avanza en silencio.
  useEffect(() => {
    if (vozFallo && narrando) { stopSpeaking(); setNarrando(false); }
  }, [vozFallo, narrando, stopSpeaking]);

  useEffect(() => {
    if (!narrable || !narrando) return;
    const guion = syncSlideForIndex(currentIdx);
    const siguiente = syncSlideForIndex(currentIdx + 1);
    if (siguiente?.script_text) preload(siguiente.script_text, siguiente.firma);
    if (!guion?.script_text) { setNarrando(false); return; }
    speakText(guion.script_text, () => {
      // Práctica del simulador en esta lámina: se pausa la clase y se abre la práctica.
      if (guion.step_guide && !completedCheckpoints.includes(guion.slide_index)) {
        setCompletedCheckpoints(prev => [...prev, guion.slide_index]);
        setNarrando(false);
        setActiveTab('simulador');
        return;
      }
      if (currentIdx < images.length - 1) setCurrentIdx(prev => prev + 1);
      else {
        setNarrando(false);
        setActiveTab(simConfig && syncData?.some(s => s.step_guide) ? 'simulador' : 'quiz');
      }
    }, guion.firma);
    return () => stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [narrable, narrando, currentIdx]);

  const alternarNarracion = () => {
    if (narrando) { stopSpeaking(); setNarrando(false); }
    else setNarrando(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const slideTexts = useMemo(() => {
    if (!content) return [];
    const parts = content.split(/## Diapositiva \d+/i);
    return parts.slice(1).map(part => part.replace(/---/g, '').trim());
  }, [content]);

  const currentText = slideTexts[currentIdx] || "No hay texto explicativo para esta diapositiva.";

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-hidden">
      <div className="flex flex-1 min-h-0 w-full flex-col lg:flex-row gap-3 sm:gap-4 overflow-hidden">
        {/* Zona principal de la Presentación o Video */}
        <div className="flex flex-1 min-h-0 h-full flex-col overflow-hidden rounded-2xl border border-gray-800 bg-[#0A0A0F] shadow-2xl lg:w-2/3">
          {videoUrl ? (
            <div className="relative flex flex-1 min-h-0 items-center justify-center bg-black p-0 overflow-hidden group">
              <video
                ref={videoRef}
                key={videoUrl}
                src={videoUrl}
                controls
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => { if (simConfig && syncData && syncData.some(s => s.step_guide)) { setActiveTab('simulador'); setIsSimulatorModalOpen(true); } else { setActiveTab('quiz'); } }}
                onDoubleClick={toggleFullscreen}
                className="h-full w-full object-contain"
                poster={images[0]}
              />

              {/* Overlay Interactivo Tutor IA con Pausa Estricta */}


              {/* Botón Flotante para Pantalla Completa del Video */}
              <button
                onClick={toggleFullscreen}
                title="Ver Video en Pantalla Completa"
                className="absolute top-3 right-3 z-20 flex items-center gap-1.5 rounded-lg bg-black/75 hover:bg-black/95 text-white/90 hover:text-white px-2.5 py-1.5 text-xs font-semibold backdrop-blur-md border border-white/20 shadow-xl transition-all active:scale-95 opacity-85 hover:opacity-100 group-hover:opacity-100"
              >
                <Maximize2 size={13} className="text-amber-400" />
                <span className="hidden sm:inline">Pantalla Completa</span>
              </button>
            </div>
          ) : (
            <div className="relative flex flex-1 min-h-0 items-center justify-center bg-[#050508] p-4 lg:p-6 overflow-hidden">
              {images.length > 0 ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={images[currentIdx]}
                  alt={`Diapositiva ${currentIdx + 1}`}
                  className="max-h-full max-w-full rounded-lg object-contain shadow-xl"
                />
              ) : (
                <div className="text-gray-500">No hay imágenes disponibles para este manual</div>
              )}

              {/* Botón superpuesto si el navegador bloqueó el autoplay de audio */}
              {needsGesture && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20 p-4 text-center">
                  <button
                    onClick={resumeAfterGesture}
                    className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-2xl transition-all active:scale-95 animate-pulse"
                  >
                    <Volume2 size={20} />
                    <span>Escuchar narración de Jorge</span>
                  </button>
                  <p className="mt-2 text-xs text-amber-200/90 font-medium">Haz clic para activar el audio de la clase</p>
                </div>
              )}
            </div>
          )}

          {/* Barra de Controles Inferior (Solo si NO es video) */}
          {!videoUrl && (
            <div className="flex shrink-0 items-center justify-between border-t border-gray-800 bg-[#131a20] px-4 py-2.5">
              <button
                onClick={() => { stopSpeaking(); prevSlide(); }}
                disabled={currentIdx === 0}
                className="flex items-center gap-1.5 rounded-lg bg-gray-800/50 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-gray-700 active:scale-95 disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronLeft size={16} />
                <span>Anterior</span>
              </button>

              <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
                {narrable && (
                  <button
                    onClick={alternarNarracion}
                    className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition-all active:scale-95 ${narrando ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                      }`}
                    title={narrando ? 'Pausar la clase' : 'Reproducir la clase narrada'}
                  >
                    {narrando ? <><Pause size={14} /> Pausar</> : <><PlayCircle size={14} /> {currentIdx === 0 ? 'Reproducir clase' : 'Continuar'}</>}
                  </button>
                )}
                {needsGesture && (
                  <button onClick={resumeAfterGesture} className="flex items-center gap-1 rounded-lg bg-amber-500/20 px-2 py-1 text-amber-300 active:scale-95">
                    <Volume2 size={13} /> Activar voz
                  </button>
                )}
                {isSpeaking && <span className="hidden sm:inline text-amber-400 animate-pulse">Narrando…</span>}
                <span><span className="text-white font-bold">{currentIdx + 1}</span> / {images.length}</span>
              </div>

              <button
                onClick={() => { stopSpeaking(); nextSlide(); }}
                disabled={currentIdx === images.length - 1}
                className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-500 transition-all hover:bg-amber-500/20 active:scale-95 disabled:pointer-events-none disabled:opacity-30"
              >
                <span>Siguiente</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Zona lateral de Herramientas LMS (Tabs) */}
        <div className="flex flex-1 min-h-0 h-full flex-col overflow-hidden rounded-2xl border border-gray-800 bg-[#131a20] shadow-xl lg:w-1/3">
          {/* Navegación de Pestañas con Indicador de Aprobado */}
          <div className="flex shrink-0 items-center justify-between border-b border-gray-800 bg-[#19222a] p-2">
            <div className="flex gap-1.5 overflow-x-auto custom-scrollbar">
              <button
                onClick={() => setActiveTab('explicacion')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${activeTab === 'explicacion' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'}`}
              >
                <BookOpen size={14} /> <span>Teleprompter</span>
              </button>
              <button
                onClick={() => setActiveTab('ia')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${activeTab === 'ia' ? 'bg-amber-500/20 text-amber-500' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'}`}
              >
                <Bot size={14} /> <span>Tutor IA</span>
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${activeTab === 'faq' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'}`}
              >
                <FileQuestion size={14} /> <span>FAQ</span>
              </button>
              {simConfig.requiresSimulator && (
                <button
                  onClick={() => setActiveTab('simulador')}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${activeTab === 'simulador' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'}`}
                >
                  <Wrench size={14} />
                  <span>{simConfig.requiresSimulator ? 'Simulador' : 'Teoría'}</span>
                  {!simConfig.requiresSimulator && (
                    <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1 py-0.2 rounded font-mono font-bold">Concepto</span>
                  )}
                </button>)}
              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${activeTab === 'quiz' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'}`}
              >
                <GraduationCap size={14} /> <span>Examen IA</span>
              </button>
              <button
                onClick={() => setActiveTab('docente')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${activeTab === 'docente' ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'}`}
              >
                <Sparkles size={14} /> <span>Modo Docente</span>
              </button>
            </div>

            {isApproved && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <CheckCircle2 size={12} /> Aprobado
              </span>
            )}
          </div>

          {/* Contenido de la pestaña */}
          <div ref={teleprompterScrollRef} className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 scroll-smooth custom-scrollbar">
            {activeTab === 'explicacion' && (
              <div className="flex flex-col h-full">
                {syncData && syncData.length > 0 ? (
                  <div className="space-y-4 pb-8">
                    {syncData.map((slide, i) => {
                      const isActive = activeSyncSlide?.slide_index === slide.slide_index;
                      return (
                        <div
                          key={i}
                          data-sync-slide={slide.slide_index}
                          aria-current={isActive ? 'step' : undefined}
                          className={`p-4 rounded-xl transition-all duration-300 ${isActive
                            ? 'bg-amber-500/15 border border-amber-500/40 shadow-lg scale-100 ring-1 ring-amber-500/30'
                            : 'opacity-50 scale-[0.99] border border-gray-800/80 bg-gray-900/40 hover:opacity-80'
                            }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${isActive ? 'bg-amber-500 text-black' : 'bg-gray-800 text-gray-400'
                              }`}>
                              Diapositiva {slide.slide_index}
                            </span>
                            {slide.step_guide?.menu_path && (
                              <span className="text-[10px] font-mono text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded truncate max-w-[220px]">
                                🧭 {slide.step_guide.menu_path}
                              </span>
                            )}
                          </div>

                          <p className={`text-xs sm:text-sm leading-relaxed mb-3 ${isActive ? 'text-amber-100 font-medium' : 'text-gray-300'
                            }`}>
                            {slide.script_text}
                          </p>

                          {slide.step_guide && (
                            <div className="mt-3 pt-3 border-t border-amber-500/20 bg-black/40 rounded-lg p-3 text-left">
                              <div className="text-xs font-bold text-amber-400 mb-2">
                                📋 {slide.step_guide.title}
                              </div>
                              {slide.step_guide.instructions && (
                                <ul className="space-y-1.5 mb-2.5">
                                  {slide.step_guide.instructions.map((inst, idx) => (
                                    <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                                      <span className="text-amber-400 font-bold shrink-0">{idx + 1}.</span>
                                      <span className="leading-snug">{inst}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                              {slide.step_guide.expected_output && (
                                <div className="text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1.5 rounded">
                                  🎯 <strong>Resultado esperado:</strong> {slide.step_guide.expected_output}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="prose prose-invert prose-amber max-w-none text-xs sm:text-sm">
                    <ReactMarkdown>{currentText}</ReactMarkdown>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ia' && (
              <div className="flex h-full flex-col">
                {activeSyncSlide?.step_guide && (
                  <div className="shrink-0 mb-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-left">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 mb-1">
                      <span className="flex items-center gap-1"><Sparkles size={12} /> Tutor de Laboratorio</span>
                      <span className="font-mono text-[10px]">Diapositiva {activeSyncSlide.slide_index}</span>
                    </div>
                    <div className="text-xs text-white font-medium truncate mb-2">
                      {activeSyncSlide.step_guide.title}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => handleSendMessage(`¿Me das una pista pedagógica para resolver "${activeSyncSlide?.step_guide?.title}"?`)}
                        className="text-[10px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 rounded px-2 py-0.5 transition-colors flex items-center gap-1"
                      >
                        <Lightbulb size={10} /> Pista del paso
                      </button>
                      <button
                        onClick={() => handleSendMessage(`¿En qué menú o ruta exacta encuentro esta ventana en SAP Business One?`)}
                        className="text-[10px] bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-500/30 rounded px-2 py-0.5 transition-colors flex items-center gap-1"
                      >
                        <Compass size={10} /> Ruta en el menú
                      </button>
                      <button
                        onClick={() => handleSendMessage(`¿Cuál es el resultado técnico esperado para este paso?`)}
                        className="text-[10px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/30 rounded px-2 py-0.5 transition-colors flex items-center gap-1"
                      >
                        <Target size={10} /> Resultado esperado
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex-1 min-h-0 space-y-3 overflow-y-auto mb-3 pr-1 custom-scrollbar">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs sm:text-sm ${msg.role === 'user' ? 'bg-amber-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'
                        }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex shrink-0 items-center gap-2 border-t border-gray-800 pt-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Pregunta algo sobre SAP..."
                    className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs sm:text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-600 text-white transition-colors hover:bg-amber-500 active:scale-95"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="flex h-full flex-col text-left">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Preguntas Frecuentes</h3>
                <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-1">
                  <div className="rounded-xl border border-gray-800 bg-[#1a232b] p-3.5">
                    <p className="font-semibold text-white text-xs sm:text-sm">¿Cómo ingreso al simulador real de SAP?</p>
                    <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                      Puedes acceder directamente en la pestaña <strong>Simulador</strong> en este panel, y pulsar <strong>Expandir</strong> si deseas trabajar a pantalla completa.
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-800 bg-[#1a232b] p-3.5">
                    <p className="font-semibold text-white text-xs sm:text-sm">¿Qué versión de SAP Business One se usa aquí?</p>
                    <p className="mt-1 text-xs text-gray-400 leading-relaxed">Usamos la versión 10.0 (HANA/SQL), estándar del mercado.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'docente' && (
              <div className="flex h-full flex-col text-left space-y-3.5 overflow-y-auto custom-scrollbar pr-1">
                <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3.5">
                  <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider mb-1">
                    <Sparkles size={14} /> Guía del Catedrático • Tutor IA
                  </div>
                  <p className="text-xs text-purple-100 leading-relaxed">
                    Material pedagógico y orientaciones para profesores universitarios. Utiliza estas directrices para conducir la clase y evaluar a tus alumnos con el simulador.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-800 bg-[#1a232b] p-3.5 space-y-1.5">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">🎯 Objetivo de Aprendizaje</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {simConfig.scenarioGoal || 'Comprender los principios de parametrización, estructura documental e impacto en libro mayor de este proceso de negocio en SAP B1 10.0.'}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-800 bg-[#1a232b] p-3.5 space-y-1.5">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">❓ Preguntas Socráticas para el Aula</h4>
                  <ul className="text-xs text-gray-300 space-y-1 list-disc pl-4">
                    <li>¿Qué tabla del sistema registra la cabecera de esta operación ({simConfig.defaultTable?.split(' ')[0] || 'OJDT'}) y qué campo la vincula con las líneas?</li>
                    <li>¿Qué impacto contable o logístico ocurre si el usuario cancela o devuelve este documento?</li>
                    <li>¿Bajo qué condiciones tributarias o de control interno se requiere un procedimiento de aprobación aquí?</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-gray-800 bg-[#1a232b] p-3.5 space-y-1.5">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">⚠️ Errores Frecuentes de Alumnos</h4>
                  <ul className="text-xs text-gray-300 space-y-1 list-disc pl-4">
                    <li>Omitir la selección del Socio de Negocios obligatorio (campo amarillo claro).</li>
                    <li>Confundir fecha de contabilización con fecha de vencimiento fiscal.</li>
                    <li>Intentar modificar un documento cerrado sin generar previamente una nota de ajuste.</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 space-y-1.5">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">✅ Rúbrica Práctica en el Simulador</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Exigir al alumno que abra el formulario en la pestaña <strong>Simulador</strong>, complete los campos mandatorios y verifique el asiento contable resultante.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'simulador' && (
              <div className="h-full flex flex-col overflow-hidden">
                <div className="shrink-0 flex items-center justify-between border-b border-gray-800 bg-[#161f28] px-3 py-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 truncate max-w-[280px]">
                    <Wrench size={13} className="shrink-0" />
                    <span className="truncate">{simConfig.requiresSimulator ? simConfig.title : 'Guía Conceptual y Metodología'}</span>
                  </div>
                  <button
                    onClick={() => setIsSimulatorModalOpen(true)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 px-2 py-1 rounded-md transition-all active:scale-95"
                    title="Expandir simulador a pantalla completa"
                  >
                    <Maximize2 size={11} />
                    <span>Expandir</span>
                  </button>
                </div>
                <div className="flex-1 min-h-0 overflow-hidden">
                  <SAPInteractiveSimulator
                    manualId={manualId || ''}
                    currentStepIndex={currentIdx}
                    stepGuide={activeSyncSlide?.step_guide}
                  />
                </div>
              </div>
            )}

            {activeTab === 'quiz' && (
              <div className="flex h-full flex-col">
                {!quizStarted && !quizCompleted ? (
                  /* PANTALLA INICIAL: PRESENTACIÓN DEL PROFESOR IA */
                  <div className="flex h-full flex-col items-center justify-center text-center p-3 sm:p-4 overflow-y-auto custom-scrollbar">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-lg">
                      <GraduationCap size={30} />
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-2">
                      <Sparkles size={11} /> Examen con Profesor IA
                    </div>

                    <h3 className="text-sm font-bold text-white mb-2">
                      Evaluación en Vivo (Simulacro)
                    </h3>

                    <p className="text-xs text-gray-300 max-w-[280px] leading-relaxed mb-4">
                      El Profesor de B1 Academy te evaluará sobre los conceptos y procesos técnicos de este manual.
                    </p>

                    {/* Reglas Estrictas del Examen */}
                    <div className="bg-[#111822] border border-gray-800 rounded-xl p-3 text-left w-full max-w-[310px] mb-4 space-y-2 text-[11px]">
                      <div className="flex items-start gap-2 text-gray-300">
                        <Timer size={14} className="text-amber-400 shrink-0 mt-0.5" />
                        <span><strong>Límite Estricto:</strong> Tienes <strong>35 segundos</strong> por pregunta. Si el tiempo expira, la pregunta se califica con 0 y se cambia automáticamente.</span>
                      </div>
                      <div className="flex items-start gap-2 text-gray-300">
                        <ShieldAlert size={14} className="text-blue-400 shrink-0 mt-0.5" />
                        <span><strong>Anti-Copia:</strong> Portapapeles bloqueado (sin pegar de ChatGPT) y detección de cambio de ventana.</span>
                      </div>
                      <div className="flex items-start gap-2 text-gray-300">
                        <Award size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Aprobación:</strong> Requiere <strong>90% de aciertos</strong> para aprobar la materia.</span>
                      </div>
                    </div>

                    <button
                      onClick={restartQuiz}
                      className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 px-6 py-2.5 text-xs font-bold text-black transition-all active:scale-95 shadow-lg shadow-amber-600/30 flex items-center gap-2"
                    >
                      <Timer size={14} />
                      <span>Comenzar Examen ({quizQuestions.length} Preguntas)</span>
                    </button>
                  </div>
                ) : quizCompleted ? (
                  /* PANTALLA FINAL: RESULTADOS Y APP DESCARGABLE */
                  <div className="flex h-full flex-col items-center justify-center text-center p-3 sm:p-4 overflow-y-auto custom-scrollbar">
                    <div className="mb-2 text-4xl">{quizScore >= Math.ceil(quizQuestions.length * 0.90) ? '🏆' : '📚'}</div>
                    <h3 className="mb-1 text-lg font-bold text-white">
                      Puntuación: {quizScore} de {quizQuestions.length} ({Math.round((quizScore / quizQuestions.length) * 100)}%)
                    </h3>

                    {quizScore >= Math.ceil(quizQuestions.length * 0.90) ? (
                      <div className="space-y-3 mb-4 w-full max-w-[320px]">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                          <CheckCircle2 size={13} /> ¡Examen Aprobado con Excelencia!
                        </span>

                        {/* Tarjeta de la App Descargable para Certificado Oficial */}
                        <div className="p-3.5 rounded-xl bg-gradient-to-b from-[#16222f] to-[#101720] border border-blue-500/30 text-left space-y-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                            <ShieldCheck size={16} className="text-blue-400 shrink-0" />
                            <span>Certificación Oficial en App Descargable</span>
                          </div>
                          <p className="text-[11px] text-gray-300 leading-relaxed">
                            Has superado el simulacro web. Para que tu certificado cuente con <strong>código QR criptográfico y verificación oficial</strong>, rinde la prueba definitiva en nuestra aplicación de escritorio protegida (sin navegadores ni extensiones).
                          </p>
                          <div className="text-emerald-400 font-bold text-center mt-4">✓ Certificado Oficial Habilitado</div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 mb-4 w-full">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                          Requiere 90% para Aprobar ({Math.ceil(quizQuestions.length * 0.90)}/{quizQuestions.length})
                        </span>

                        <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-left space-y-2 w-full max-h-44 overflow-y-auto custom-scrollbar">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" /> Diagnóstico del Profesor IA para Reforzar
                          </div>
                          <p className="text-[11px] text-gray-300">
                            Repasa estos conceptos clave antes de volver a presentarte:
                          </p>
                          {quizQuestions
                            .map((q, idx) => ({ q, idx }))
                            .filter(({ q, idx }) => userAnswers[idx] !== q.answer)
                            .map(({ q, idx }) => (
                              <div key={idx} className="p-2 rounded-lg bg-black/40 border border-white/5 space-y-1 text-[11px]">
                                <div className="font-semibold text-white">📌 {q.topic || q.q}</div>
                                <div className="text-gray-400 text-[10px] leading-relaxed">{q.explanation}</div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={restartQuiz}
                        className="rounded-xl bg-gray-800 hover:bg-gray-700 px-4 py-2 text-xs font-semibold text-white transition-all active:scale-95"
                      >
                        Reintentar Examen
                      </button>
                      <Link
                        href="/manuales"
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition-all active:scale-95"
                      >
                        Ver Biblioteca
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* PANTALLA EN CURSO: Evaluación CON CRONÓMETRO */
                  <div className="flex h-full flex-col">

                    {/* Alerta de Seguridad Anti-Copia */}
                    {cheatAlert && (
                      <div className="mb-2 bg-rose-950/90 border border-rose-500/50 text-rose-200 px-3 py-1.5 rounded-lg text-[11px] flex items-center gap-2 animate-pulse">
                        <AlertTriangle size={14} className="shrink-0 text-rose-400" />
                        <span>{cheatAlert}</span>
                      </div>
                    )}

                    {/* Cabecera del Examen con Cronómetro Dinámico */}
                    <div className="mb-2 flex items-center justify-between border-b border-gray-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                          Pregunta {currentQuestion + 1} de {quizQuestions.length}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">
                          Aciertos: <strong className="text-emerald-400">{quizScore}</strong>
                        </span>
                      </div>

                      {/* Contador Regresivo de 35 Segundos */}
                      <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold transition-all ${timeLeft <= 8
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 animate-pulse'
                        : timeLeft <= 18
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        }`}>
                        <Timer size={13} />
                        <span>{timeLeft}s</span>
                      </div>
                    </div>

                    {/* Barra de Progreso del Tiempo Restante */}
                    <div className="w-full mb-3">
                      <progress
                        value={timeLeft}
                        max={35}
                        aria-label="Tiempo restante para responder"
                        className={`w-full h-1.5 rounded-full overflow-hidden transition-all duration-1000 block bg-gray-800 [&::-webkit-progress-bar]:bg-gray-800 ${timeLeft <= 8
                          ? 'accent-rose-500 [&::-webkit-progress-value]:bg-rose-500 [&::-moz-progress-bar]:bg-rose-500'
                          : timeLeft <= 18
                            ? 'accent-amber-500 [&::-webkit-progress-value]:bg-amber-500 [&::-moz-progress-bar]:bg-amber-500'
                            : 'accent-emerald-500 [&::-webkit-progress-value]:bg-emerald-500 [&::-moz-progress-bar]:bg-emerald-500'
                          }`}
                      />
                    </div>

                    {/* Intervención del Profesor IA / Pregunta */}
                    <div className="bg-[#16202b] border border-gray-700/80 rounded-xl p-3 mb-3 text-left">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 mb-1">
                        <Bot size={13} />
                        <span>Profesor Evaluador SAP:</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                        &ldquo;{quizQuestions[currentQuestion].q}&rdquo;
                      </p>
                    </div>

                    {/* Retroalimentación en Tiempo Real si respondió o tiempo agotado */}
                    {professorFeedback.status && (
                      <div className={`p-2.5 rounded-xl border text-xs mb-3 text-left animate-fadeIn ${professorFeedback.status === 'correct'
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                        : professorFeedback.status === 'timeout'
                          ? 'bg-rose-950/70 border-rose-500/50 text-rose-200'
                          : 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                        }`}>
                        <p className="font-medium text-[11px] leading-snug">
                          {professorFeedback.message}
                        </p>
                      </div>
                    )}

                    {/* Opciones de Respuesta Inmediata */}
                    <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1 pr-1">
                      {quizQuestions[currentQuestion].options.map((opt, i) => (
                        <button
                          key={i}
                          disabled={isEvaluating}
                          onClick={() => handleAnswer(i)}
                          className={`rounded-xl border p-2.5 sm:p-3 text-left text-xs sm:text-sm transition-all active:scale-[0.98] ${isEvaluating
                            ? 'opacity-50 cursor-not-allowed border-gray-800 bg-[#161f28] text-gray-400'
                            : 'border-gray-700/80 bg-[#1a232b] text-gray-200 hover:border-amber-500/50 hover:bg-[#222e38]'
                            }`}
                        >
                          <span className="font-mono text-amber-400 font-bold mr-2">
                            {String.fromCharCode(65 + i)}.
                          </span>
                          {opt}
                        </button>
                      ))}
                    </div>

                    {/* Caja de Respuesta Escrita Opcional con Bloqueo de Pegado */}
                    <div className="mt-2 pt-2 border-t border-gray-800 flex items-center gap-1.5">
                      <input
                        type="text"
                        value={writtenAnswer}
                        disabled={isEvaluating}
                        onChange={(e) => setWrittenAnswer(e.target.value)}
                        onPaste={(e) => {
                          e.preventDefault();
                          setCheatAlert("⚠️ Portapapeles bloqueado: No está permitido pegar texto en la Evaluación .");
                          setTimeout(() => setCheatAlert(null), 3500);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && writtenAnswer.trim() && !isEvaluating) {
                            handleAnswer(0);
                          }
                        }}
                        placeholder="O responde directamente aquí (sin pegar)..."
                        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        disabled={isEvaluating || !writtenAnswer.trim()}
                        onClick={() => handleAnswer(0)}
                        className="bg-amber-600 hover:bg-amber-500 disabled:opacity-30 text-white text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                      >
                        Enviar
                      </button>
                    </div>

                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Pantalla Completa del Simulador */}
      {isSimulatorModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md p-2 sm:p-4">
          <div className="flex items-center justify-between bg-[#19222a] border border-gray-800 rounded-t-xl px-4 py-2.5 shadow">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles size={14} /> Entorno Oficial de Caso Práctico SAP B1
              </span>
              {activeSyncSlide?.step_guide?.title && (
                <span className="text-xs text-gray-300 font-medium hidden md:inline truncate max-w-xl">
                  • {activeSyncSlide.step_guide.title}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsSimulatorModalOpen(false)}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-700 transition-all active:scale-95"
            >
              <X size={14} />
              <span>Cerrar Simulador Completo</span>
            </button>
          </div>
          <div className="flex-1 min-h-0 bg-[#0A0A0F] border-x border-b border-gray-800 rounded-b-xl overflow-hidden shadow-2xl">
            <SAPInteractiveSimulator
              manualId={manualId || ''}
              currentStepIndex={currentIdx}
              stepGuide={activeSyncSlide?.step_guide}
            />
          </div>
        </div>
      )}
    </div>
  );
}
