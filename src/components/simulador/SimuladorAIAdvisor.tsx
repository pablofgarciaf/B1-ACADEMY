'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Loader, Bot, Sparkles, Minus, Maximize2, Minimize2 } from 'lucide-react';
import { empresaActiva, LISTA_SIETE_EMPRESAS } from '@/lib/firestore-company';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SimuladorAIAdvisorProps {
  currentScreen?: string;
  currentModule?: string;
  isOpen?: boolean;
  hideFloatingButton?: boolean;
  theme?: 'classic' | 'fiori';
  onClose?: () => void;
  embedded?: boolean;
}

export default function SimuladorAIAdvisor({
  currentScreen = 'Dashboard',
  currentModule = 'Finanzas & Contabilidad',
  isOpen: initialOpen = false,
  hideFloatingButton = false,
  theme = 'classic',
  onClose,
  embedded = false,
}: SimuladorAIAdvisorProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [lado, setLado] = useState<'izq' | 'der'>('der');
  const isFiori = theme === 'fiori';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: isFiori
        ? `¡Hola! Soy **Joule** ✨, tu copiloto IA. ¿En qué te asisto?`
        : `¡Hola! Soy **FeNi** 🐦, tu asistente de IA. ¿En qué te ayudo?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Escucha el evento global disparado por FeNiMascota o tecla F1
  useEffect(() => {
    const abrirDesdeEvento = (e: Event) => {
      const detail = (e as CustomEvent<{ lado?: 'izq' | 'der' }>).detail;
      if (detail?.lado) setLado(detail.lado);
      setIsOpen(true);
    };
    window.addEventListener('feni-abrir', abrirDesdeEvento);
    return () => window.removeEventListener('feni-abrir', abrirDesdeEvento);
  }, []);

  // Cuando abre: mueve a FeNi junto al chat. Cuando cierra: lo regresa.
  useEffect(() => {
    if (isOpen) {
      const chatHeight = isMinimized ? 60 : (isMaximized
        ? Math.min(720, window.innerHeight * 0.8)
        : Math.min(600, window.innerHeight - 80));
      // y = justo encima del panel de chat (bottom-14 = 56px)
      const chatTopY = window.innerHeight - 56 - chatHeight - 68; // 68 = TAM(60) + 8px margen
      window.dispatchEvent(new CustomEvent('feni-acercar', { detail: { lado, y: chatTopY } }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const activeSlot = empresaActiva();
      const currentCompanyDef = LISTA_SIETE_EMPRESAS.find(e => e.id === activeSlot) || LISTA_SIETE_EMPRESAS[0];

      const response = await fetch('/api/simulador/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage.content },
          ],
          currentScreen,
          currentModule,
          companySlot: activeSlot,
          companyName: currentCompanyDef.name,
        }),
      });

      const data = await response.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          data.message ||
          'Lo siento, hubo un error. Por favor, intenta nuevamente.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'Lo siento, no pude conectarme. Verifica tu conexión e intenta nuevamente.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('feni-volver'));
    if (onClose) onClose();
  };

  return (
    <>
      {/* Floating Button (solo en modo clásico y cuando no esté oculto) - POSICIONADO A LA IZQUIERDA */}
      {!hideFloatingButton && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-14 left-4 z-[5000] h-12 px-3.5 bg-gradient-to-r from-[#002b5c] via-[#0055A5] to-[#0854a0] hover:brightness-110 text-white rounded-full shadow-2xl transition-all flex items-center gap-2.5 active:scale-95 border-2 border-amber-400/80 group cursor-pointer"
          title="Abrir Tutor IA de SAP Business One"
        >
          <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-slate-900/60 border border-amber-400/50 shadow-inner">
            <Bot className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-slate-900" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-xs tracking-wide text-white leading-tight flex items-center gap-1">
              Tutor IA
            </span>
            <span className="text-[9.5px] text-blue-200 font-medium leading-none">SAP Business One</span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={
          embedded
            ? "w-full h-full flex flex-col overflow-hidden bg-white dark:bg-[#111927]"
            : `fixed inset-x-3 bottom-14 z-[5000] flex flex-col overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900 shadow-2xl backdrop-blur-xl sm:inset-x-auto transition-all duration-200 ${
                lado === 'izq' ? 'sm:left-4 sm:right-auto' : 'sm:right-4 sm:left-auto'
              } ${
                isMaximized
                  ? 'sm:w-[520px] h-[min(80vh,720px)]'
                  : isMinimized
                    ? 'sm:w-96 h-auto'
                    : 'sm:w-96 h-[min(600px,calc(100dvh-5rem))]'
              }`
        }>
          {/* Header */}
          <div className={
            isFiori
              ? "bg-gradient-to-r from-[#0055A5] via-[#0854a0] to-[#0a6ed1] text-white p-3.5 flex items-center justify-between border-b border-blue-400/20 shadow-xs"
              : "bg-gradient-to-r from-[#001833] via-[#002b5c] to-[#0055A5] text-white p-3.5 flex items-center justify-between border-b border-amber-400/30"
          }>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-400/40 flex items-center justify-center text-amber-400">
                {isFiori ? <Sparkles className="w-4 h-4 text-amber-300" /> : <Bot className="w-5 h-5 text-amber-400" />}
              </div>
              <div>
                <h3 className="font-extrabold text-xs flex items-center gap-1.5 tracking-wide text-white">
                  <span>{isFiori ? 'SAP Joule · Copiloto Fiori' : 'Tutor IA · SAP Business One'}</span>
                </h3>
                <p className="text-[10.5px] text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {currentModule} • {currentScreen}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setIsMinimized((v) => !v); setIsMaximized(false); }}
                className="hover:bg-white/20 p-1.5 rounded-lg transition-all active:scale-95 cursor-pointer text-white"
                title={isMinimized ? 'Restaurar' : 'Minimizar'}
              >
                <Minus size={15} />
              </button>
              <button
                onClick={() => { setIsMaximized((v) => !v); setIsMinimized(false); }}
                className="hover:bg-white/20 p-1.5 rounded-lg transition-all active:scale-95 cursor-pointer text-white"
                title={isMaximized ? 'Restaurar' : 'Maximizar'}
              >
                {isMaximized ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
              <button
                onClick={handleClose}
                className="hover:bg-white/20 p-1.5 rounded-lg transition-all active:scale-95 cursor-pointer text-white"
                title="Cerrar asistente"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          {!isMinimized && <div className={`flex-1 overflow-y-auto p-4 space-y-3.5 ${
            isFiori ? 'bg-slate-50 dark:bg-[#0b121e]' : 'bg-slate-950'
          }`}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs ${
                    message.role === 'user'
                      ? 'bg-[#0055A5] text-white rounded-br-xs shadow-xs'
                      : isFiori
                        ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200 dark:border-slate-700 shadow-xs'
                        : 'bg-slate-800 text-slate-200 rounded-bl-xs border border-slate-700'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p
                    className={`text-[10px] mt-1 text-right ${
                      message.role === 'user'
                        ? 'text-blue-100'
                        : 'text-slate-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`rounded-2xl px-3.5 py-2 rounded-bl-xs border text-xs flex items-center gap-2 ${
                  isFiori
                    ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    : 'bg-slate-800 text-slate-200 border-slate-700'
                }`}>
                  <Loader size={14} className="animate-spin text-[#0055A5]" />
                  <span>{isFiori ? 'Joule está analizando tu consulta...' : 'El Tutor IA está analizando tu consulta...'}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>}

          {/* Input Form */}
          {!isMinimized && <form
            onSubmit={handleSendMessage}
            className={`border-t p-3 flex gap-2 ${
              isFiori
                ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                : 'border-slate-700/50 bg-slate-900'
            }`}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isFiori ? "Pregunta a Joule... ¿Cómo registro una factura SRI?" : "Pregunta al Tutor IA... ¿Cómo creo un pedido de venta?"}
              className={`flex-1 rounded-xl px-3 py-2 text-xs outline-none transition ${
                isFiori
                  ? 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white focus:border-[#0055A5] focus:ring-1 focus:ring-[#0055A5]'
                  : 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500'
              }`}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[#0055A5] hover:bg-[#004080] disabled:opacity-40 text-white px-3 py-2 rounded-xl transition flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
            >
              {isLoading ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </form>}
        </div>
      )}
    </>
  );
}
