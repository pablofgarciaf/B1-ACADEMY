'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Loader } from 'lucide-react';
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
  const isFiori = theme === 'fiori';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: isFiori
        ? `¡Hola! Soy **Joule** ✨, tu copiloto inteligente para SAP Fiori y Finix ERP.

¿En qué puedo asistirte hoy en el sistema?
- 🛒 *"¿Cómo creo un pedido de venta (SAL002)?"*
- 🧾 *"¿Cuáles son los pasos para emitir una Factura Electrónica SRI?"*
- 📦 *"¿Cómo recibir mercancías de una orden de compra (GRPO)?"*
- 📊 *"¿Cómo verificar el balance o registrar un asiento contable?"*

Pregúntame cualquier transacción, código de pantalla o concepto contable. 🚀`
        : `¡Hola! Soy **@FeNi AI** 🐦‍🔥, tu copiloto inteligente para Finix ERP.

¿Qué deseas realizar o consultar en el simulador?
- 🛒 *"¿Cómo registro un pedido de venta?"*
- 📊 *"¿Cómo verifico los mayores de Bancos?"*
- 🏦 *"¿Cómo realizo una conciliación bancaria?"*
- 🧾 *"¿Cómo contabilizo un asiento de diario?"*

Pregúntame y te indicaré la ruta exacta del menú y los pasos del formulario. 🚀`,
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
    if (onClose) onClose();
  };

  return (
    <>
      {/* Floating Button (solo en modo clásico y cuando no esté oculto) */}
      {!hideFloatingButton && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-14 right-4 z-[5000] h-14 px-4 bg-gradient-to-r from-[#b91c1c] via-[#0055A5] to-[#003366] hover:brightness-110 text-white rounded-full shadow-2xl transition-all flex items-center gap-2.5 active:scale-95 border-2 border-amber-400/60 group cursor-pointer"
          title="Abrir Copiloto @FeNi AI"
        >
          <div className="relative flex items-center gap-1.5">
            <span className="text-lg">🐦‍🔥</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <span className="font-black text-xs tracking-wide text-white">@FeNi AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={
          embedded
            ? "w-full h-full flex flex-col overflow-hidden bg-white dark:bg-[#111927]"
            : "fixed inset-x-3 bottom-14 z-[5000] flex h-[min(600px,calc(100dvh-5rem))] flex-col overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900 shadow-2xl backdrop-blur-xl sm:inset-x-auto sm:right-4 sm:w-96"
        }>
          {/* Header */}
          <div className={
            isFiori
              ? "bg-gradient-to-r from-[#0055A5] via-[#0854a0] to-[#0a6ed1] text-white p-3.5 flex items-center justify-between border-b border-blue-400/20 shadow-xs"
              : "bg-gradient-to-r from-[#7f1d1d] via-[#003366] to-[#001f3f] text-white p-4 flex items-center justify-between border-b border-amber-400/30"
          }>
            <div>
              <h3 className="font-extrabold text-sm flex items-center gap-2 tracking-wide text-white">
                <span>{isFiori ? '✨' : '🐦‍🔥'}</span>
                <span>{isFiori ? 'SAP Joule · Copiloto Fiori' : '@FeNi AI · Copiloto ERP'}</span>
              </h3>
              <p className="text-[11px] text-blue-100 mt-0.5 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {currentModule} • {currentScreen}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="hover:bg-white/20 p-1.5 rounded-lg transition-all active:scale-95 cursor-pointer text-white"
              title="Cerrar asistente"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-3.5 ${
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
                  <span>Joule está analizando tu consulta...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
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
              placeholder={isFiori ? "Pregunta a Joule... ¿Cómo registro una factura SRI?" : "Pregunta algo... ¿Cómo creo una factura?"}
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
          </form>
        </div>
      )}
    </>
  );
}
