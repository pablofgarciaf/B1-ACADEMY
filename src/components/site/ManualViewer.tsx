"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  CheckCircle2
} from 'lucide-react';

export interface SyncData {
  slide_index: number;
  image_file: string;
  script_text: string;
  start_time: number;
  end_time: number;
}

interface ManualViewerProps {
  manualId?: string;
  content: string;
  images: string[];
  videoUrl?: string;
  syncData?: SyncData[];
}

export default function ManualViewer({ manualId, content, images, videoUrl, syncData }: ManualViewerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'explicacion' | 'ia' | 'faq' | 'simulador' | 'quiz'>('explicacion');
  
  // Estado de Aprobado (guardado en localStorage)
  const [isApproved, setIsApproved] = useState(false);

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
  const [currentVideoTime, setCurrentVideoTime] = useState(0);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentVideoTime(videoRef.current.currentTime);
    }
  };

  const activeSyncSlide = useMemo(() => {
    if (!syncData || syncData.length === 0) return null;
    return syncData.find(s => currentVideoTime >= s.start_time && currentVideoTime < s.end_time) || syncData[0];
  }, [currentVideoTime, syncData]);

  // Auto-scroll del Teleprompter para que el texto vaya subiendo fluidamente
  useEffect(() => {
    if (activeSyncSlide && activeTab === 'explicacion') {
      const activeEl = document.getElementById(`sync-slide-${activeSyncSlide.slide_index}`);
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [activeSyncSlide?.slide_index, activeTab]);

  // Estado para el Quiz
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  const quizQuestions = useMemo(() => [
    {
      q: "¿Cuál es el propósito principal de SAP Business One?",
      options: [
        "Diseño gráfico y edición multimedia",
        "Integrar todos los procesos empresariales en una sola plataforma unificada",
        "Crear páginas web estáticas",
        "Solo llevar la contabilidad básica"
      ],
      answer: 1
    },
    {
      q: "¿A qué tipo de organizaciones va dirigido principalmente SAP Business One?",
      options: [
        "Pequeñas y medianas empresas (PYMES) en crecimiento",
        "Gobiernos enteros de forma exclusiva",
        "Exclusivamente freelancers individuales",
        "Multinacionales globales con más de 100,000 empleados"
      ],
      answer: 0
    },
    {
      q: "Según la lección, ¿cuál es el motor actual de la transformación digital empresarial?",
      options: [
        "Las máquinas de escribir mecánicas",
        "El marketing tradicional y volantes físicos",
        "La tecnología, datos en tiempo real y la hiperconectividad",
        "Archivadores de papel de almacenamiento local"
      ],
      answer: 2
    }
  ], []);

  const handleAnswer = (selectedOptionIndex: number) => {
    const isCorrect = selectedOptionIndex === quizQuestions[currentQuestion].answer;
    const nextScore = isCorrect ? quizScore + 1 : quizScore;
    if (isCorrect) {
      setQuizScore(nextScore);
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Quiz terminado: mostrar pantalla de resultados
      setQuizCompleted(true);
      
      // Si aprobó (2 de 3 o más): registrar como Aprobado
      if (nextScore >= 2 && manualId) {
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
  };

  const restartQuiz = () => {
    setQuizStarted(true);
    setQuizCompleted(false);
    setQuizScore(0);
    setCurrentQuestion(0);
  };

  // Estado para Chat IA
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ia', text: string}[]>([
    { role: 'ia', text: "¡Hola! Soy tu tutor virtual. He leído la documentación de este manual. ¿Qué duda tienes sobre SAP Business One?" }
  ]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setChatInput("");
    
    // Simulación de respuesta inmediata de la IA
    setTimeout(() => {
      let aiResponse = "Esa es una excelente pregunta. En SAP Business One, todos los módulos están interconectados para evitar la doble entrada de datos. ¡Pronto me conectarán al cerebro principal para darte respuestas más exactas!";
      if (userText.toLowerCase().includes("socio de negocios") || userText.toLowerCase().includes("socio")) {
        aiResponse = "Un 'Socio de Negocios' en SAP B1 es el término general para referirse a Clientes, Proveedores y Leads (Prospectos). Todos se gestionan en el módulo de Datos Maestros.";
      }
      setChatMessages(prev => [...prev, { role: 'ia', text: aiResponse }]);
    }, 800);
  };

  // Navegación con teclado (Modo sin video)
  const nextSlide = useCallback(() => {
    if (currentIdx < images.length - 1) setCurrentIdx(prev => prev + 1);
  }, [currentIdx, images.length]);

  const prevSlide = useCallback(() => {
    if (currentIdx > 0) setCurrentIdx(prev => prev - 1);
  }, [currentIdx]);

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
    <div className="flex h-full w-full flex-col lg:flex-row gap-3 sm:gap-4 overflow-hidden">
      {/* Zona principal de la Presentación o Video */}
      <div className="flex flex-1 min-h-0 h-full flex-col overflow-hidden rounded-2xl border border-gray-800 bg-[#0A0A0F] shadow-2xl lg:w-2/3">
        {videoUrl ? (
          <div className="relative flex flex-1 min-h-0 items-center justify-center bg-black p-0 overflow-hidden">
            <video 
              ref={videoRef}
              key={videoUrl}
              src={videoUrl} 
              controls 
              onTimeUpdate={handleTimeUpdate}
              className="h-full w-full object-contain"
              poster={images[0]}
            />
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
          </div>
        )}
        
        {/* Barra de Controles Inferior (Solo si NO es video) */}
        {!videoUrl && (
          <div className="flex shrink-0 items-center justify-between border-t border-gray-800 bg-[#131a20] px-4 py-2.5">
            <button 
              onClick={prevSlide}
              disabled={currentIdx === 0}
              className="flex items-center gap-1.5 rounded-lg bg-gray-800/50 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-gray-700 active:scale-95 disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft size={16} />
              <span>Anterior</span>
            </button>
            
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
              <span className="text-white font-bold">{currentIdx + 1}</span> 
              <span>/</span> 
              <span>{images.length}</span>
            </div>
            
            <button 
              onClick={nextSlide}
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
            <button 
              onClick={() => setActiveTab('simulador')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${activeTab === 'simulador' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'}`}
            >
              <Wrench size={14} /> <span>Simulador</span>
            </button>
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${activeTab === 'quiz' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'}`}
            >
              <GraduationCap size={14} /> <span>Quiz</span>
            </button>
          </div>

          {isApproved && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <CheckCircle2 size={12} /> Aprobado
            </span>
          )}
        </div>
        
        {/* Contenido de la pestaña */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 scroll-smooth">
          {activeTab === 'explicacion' && (
            <div className="flex flex-col h-full">
              {videoUrl && syncData ? (
                 <div className="flex flex-col h-full">
                   <div className="shrink-0 mb-3 flex items-center justify-between">
                     <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                       <PlayCircle size={15} /> Teleprompter Sincronizado
                     </h3>
                     <span className="text-[11px] text-gray-500">Auto-scroll inteligente activo</span>
                   </div>
                   
                   <div className="flex-1 min-h-0 overflow-y-auto pr-1.5 custom-scrollbar">
                     <div className="space-y-3 pb-8">
                       {syncData.map((slide, i) => {
                         const isActive = activeSyncSlide?.slide_index === slide.slide_index;
                         return (
                           <div 
                             key={i} 
                             id={`sync-slide-${slide.slide_index}`}
                             className={`p-3.5 rounded-xl transition-all duration-300 ${
                               isActive 
                                 ? 'bg-amber-500/15 border border-amber-500/40 shadow-lg scale-100 ring-1 ring-amber-500/30' 
                                 : 'opacity-35 scale-[0.98] border border-transparent hover:opacity-60'
                             }`}
                           >
                             <div className="flex items-center gap-2 mb-1.5">
                               <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                 isActive ? 'bg-amber-500 text-black' : 'bg-gray-800 text-gray-400'
                               }`}>
                                 Diapositiva {slide.slide_index}
                               </span>
                               {isActive && (
                                 <span className="flex h-2 w-2 relative">
                                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                   <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                 </span>
                               )}
                             </div>
                             <p className={`text-xs sm:text-sm leading-relaxed ${
                               isActive ? 'text-amber-100 font-medium' : 'text-gray-400'
                             }`}>
                               {slide.script_text}
                             </p>
                           </div>
                         );
                       })}
                     </div>
                   </div>
                 </div>
              ) : (
                <div className="prose prose-invert prose-amber max-w-none text-xs sm:text-sm">
                  <h3 className="mb-3 font-semibold text-white">Explicación de Diapositiva {currentIdx + 1}</h3>
                  {slideTexts.length > 0 ? (
                    <ReactMarkdown>{currentText}</ReactMarkdown>
                  ) : (
                    <p className="text-gray-500 italic">Cargando transcripción o no disponible...</p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'ia' && (
            <div className="flex h-full flex-col">
              <div className="flex-1 min-h-0 space-y-3 overflow-y-auto mb-3 pr-1 custom-scrollbar">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs sm:text-sm ${
                      msg.role === 'user' ? 'bg-amber-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'
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
                  onClick={handleSendMessage}
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
                  <p className="mt-1 text-xs text-gray-400 leading-relaxed">Las credenciales te serán enviadas al completar y aprobar el Nivel 1.</p>
                </div>
                <div className="rounded-xl border border-gray-800 bg-[#1a232b] p-3.5">
                  <p className="font-semibold text-white text-xs sm:text-sm">¿Qué versión de SAP Business One se usa aquí?</p>
                  <p className="mt-1 text-xs text-gray-400 leading-relaxed">Usamos la versión 10.0 (HANA/SQL), estándar del mercado.</p>
                </div>
              </div>
              <button className="mt-3 w-full shrink-0 rounded-lg bg-gray-800 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-700 active:scale-95">
                Hacer una pregunta
              </button>
            </div>
          )}

          {activeTab === 'simulador' && (
            <div className="flex h-full flex-col items-center justify-center text-center p-4">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                <Wrench size={28} />
              </div>
              <h3 className="mb-1 text-sm font-bold text-white">Simulador SAP B1</h3>
              <p className="text-xs text-gray-400 max-w-[260px] leading-relaxed">
                Este módulo de Introducción es teórico. Los simuladores interactivos se activan en los módulos transaccionales de Ventas y Compras.
              </p>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="flex h-full flex-col">
              {!quizStarted && !quizCompleted ? (
                <div className="flex h-full flex-col items-center justify-center text-center p-4">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                    <GraduationCap size={28} />
                  </div>
                  <h3 className="mb-1 text-sm font-bold text-white">Prueba de Conocimiento</h3>
                  <p className="text-xs text-gray-400 max-w-[260px] leading-relaxed mb-4">
                    Responde las 3 preguntas clave para validar lo aprendido y aprobar este manual.
                  </p>
                  <button 
                    onClick={restartQuiz}
                    className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white transition-all hover:bg-emerald-500 active:scale-95 shadow-lg shadow-emerald-600/20"
                  >
                    Comenzar Evaluación (3 Preguntas)
                  </button>
                </div>
              ) : quizCompleted ? (
                <div className="flex h-full flex-col items-center justify-center text-center p-4">
                  <div className="mb-2 text-4xl">{quizScore >= 2 ? '🎉' : '📚'}</div>
                  <h3 className="mb-1 text-lg font-bold text-white">
                    Puntuación: {quizScore} de {quizQuestions.length}
                  </h3>
                  
                  {quizScore >= 2 ? (
                    <div className="space-y-1 mb-5">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                        ✓ Manual Aprobado
                      </span>
                      <p className="text-xs text-gray-400 pt-1 max-w-[260px]">
                        ¡Excelente! Tu progreso ha sido registrado en la biblioteca de manuales.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1 mb-5">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                        No alcanzaste el mínimo (2/3)
                      </span>
                      <p className="text-xs text-gray-400 pt-1 max-w-[260px]">
                        Te sugerimos repasar el video y volver a intentarlo.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button 
                      onClick={restartQuiz}
                      className="rounded-xl bg-gray-800 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-gray-700 active:scale-95"
                    >
                      Reintentar Quiz
                    </button>
                    {quizScore >= 2 && (
                      <a 
                        href="/manuales"
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-emerald-500 active:scale-95"
                      >
                        Ver en Biblioteca
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col">
                  <div className="mb-3 flex items-center justify-between border-b border-gray-800 pb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      Pregunta {currentQuestion + 1} de {quizQuestions.length}
                    </span>
                    <span className="text-[11px] font-mono text-gray-400">
                      Aciertos: {quizScore}
                    </span>
                  </div>

                  <h3 className="mb-4 text-xs sm:text-sm font-semibold text-white leading-relaxed">
                    {quizQuestions[currentQuestion].q}
                  </h3>

                  <div className="flex flex-col gap-2.5 overflow-y-auto custom-scrollbar flex-1 pr-1">
                    {quizQuestions[currentQuestion].options.map((opt, i) => (
                      <button 
                        key={i}
                        onClick={() => handleAnswer(i)}
                        className="rounded-xl border border-gray-700/80 bg-[#1a232b] p-3 text-left text-xs sm:text-sm text-gray-200 transition-all hover:border-emerald-500/50 hover:bg-[#222e38] active:scale-[0.98]"
                      >
                        <span className="font-mono text-gray-400 font-bold mr-2">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
