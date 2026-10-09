'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, User, Trash2 } from 'lucide-react';
import FeNiMascota from './FeNiMascota';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  '¿Cómo se crea un Asiento Contable?',
  '¿Cómo registro una Factura de Clientes con IVA 15%?',
  '¿Cómo se consulta el Inventario Disponible?',
  '¿Cuáles son los pasos del Asistente de Pagos Masivos?',
];

export default function FeNiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lado, setLado] = useState<'izq' | 'der'>('der');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleAbrir = () => setIsOpen(true);
    window.addEventListener('feni-abrir', handleAbrir);
    window.addEventListener('fini-abrir', handleAbrir);
    window.addEventListener('sapi-abrir', handleAbrir);
    return () => {
      window.removeEventListener('feni-abrir', handleAbrir);
      window.removeEventListener('fini-abrir', handleAbrir);
      window.removeEventListener('sapi-abrir', handleAbrir);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del asistente');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply || 'Lo siento, no pude procesar tu consulta en este momento.',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Ocurrió un error al conectar con FeNi AI. Por favor, intenta de nuevo.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Botón flotante Fénix Rojo */}
      {!isOpen && (
        <FeNiMascota onAbrir={(l) => { setLado(l); setIsOpen(true); }} />
      )}

      {/* Ventana Modal de Chat @FeNi AI */}
      {isOpen && (
        <div
          className={`fixed bottom-4 z-50 flex h-[min(600px,calc(100dvh-2rem))] w-[95vw] sm:w-[420px] flex-col overflow-hidden rounded-2xl border border-amber-500/20 bg-[#131a20] shadow-2xl backdrop-blur-xl transition-all duration-300 ${
            lado === 'izq' ? 'left-4' : 'right-4'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#002244] via-[#003366] to-[#0055A5] p-4 flex items-center justify-between border-b border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-red-950 border border-amber-400 flex items-center justify-center shadow-inner">
                <span className="text-xl">🐦‍🔥</span>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#131a20]"></div>
              </div>
              <div>
                <h3 className="font-extrabold text-white flex items-center gap-1.5 text-sm tracking-wide">
                  @FeNi AI <Sparkles size={14} className="text-amber-400" />
                </h3>
                <p className="text-[11px] text-amber-300 font-medium">Asistente Fénix ERP & Financiero Finix</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={handleClear}
                  title="Limpiar chat"
                  className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                title="Cerrar chat"
                className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-red-950/60 border border-amber-400/40 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🐦‍🔥</span>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">
                  ¡Hola! Soy FeNi AI
                </h4>
                <p className="text-xs text-gray-400 mb-4 max-w-[280px] mx-auto">
                  El Fénix inteligente de Finix ERP. Puedo resolver tus dudas sobre contabilidad NIIF, módulos de compras, ventas e impuestos SRI en Ecuador.
                </p>
                <div className="space-y-1.5 text-left">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-1">
                    Preguntas frecuentes:
                  </p>
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(q);
                      }}
                      className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-amber-500/10 hover:border-amber-500/30 border border-white/5 text-xs text-gray-300 hover:text-white transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-red-950 border border-amber-400/50 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs">🐦‍🔥</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl p-3 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#0055A5] text-white rounded-br-none'
                        : 'bg-white/10 text-gray-200 border border-white/10 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center shrink-0 mt-0.5">
                      <User size={14} className="text-blue-300" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-2.5 items-center text-gray-400 text-xs py-2">
                <div className="w-7 h-7 rounded-full bg-red-950 border border-amber-400/50 flex items-center justify-center shrink-0">
                  <span className="text-xs">🐦‍🔥</span>
                </div>
                <div className="flex gap-1 items-center bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-black/40 border-t border-white/10 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregúntale a FeNi AI sobre Finix ERP..."
              disabled={isLoading}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-black font-bold p-2 rounded-xl transition-all shadow-md active:scale-95 shrink-0 flex items-center justify-center"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

// Re-exportamos para compatibilidad con código existente
export { FeNiChat as FiniChat, FeNiChat as SapiChat };
