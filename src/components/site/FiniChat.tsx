'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, User, Trash2 } from 'lucide-react';
import FiniMascota from './FiniMascota';

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

export default function FiniChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lado, setLado] = useState<'izq' | 'der'>('der');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleAbrir = () => setIsOpen(true);
    window.addEventListener('fini-abrir', handleAbrir);
    window.addEventListener('sapi-abrir', handleAbrir);
    return () => {
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

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (data.message) {
        setMessages([...newMessages, { role: 'assistant', content: data.message }]);
      } else {
        throw new Error('Respuesta inválida');
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Lo siento, tuve un problema al procesar tu consulta. Por favor, intenta de nuevo.',
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
        <FiniMascota onAbrir={(l) => { setLado(l); setIsOpen(true); }} />
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
                className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Área de Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/80">
            {messages.length === 0 && (
              <div className="space-y-3 mb-6">
                <div className="bg-[#19222a] p-4 rounded-2xl rounded-tl-sm border border-amber-500/10 max-w-[90%] text-gray-200 text-xs leading-relaxed">
                  ¡Hola! Soy **@FeNi AI** 🐦‍🔥, tu asistente Fénix de inteligencia ERP y contable. Conozco la arquitectura de Finix ERP y la normativa tributaria ecuatoriana (SRI 2026). ¿Qué deseas consultar o realizar hoy?
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      className="text-[11px] bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20 px-3 py-1.5 rounded-full transition-all active:scale-95 text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${
                  m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    m.role === 'user'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-[#0055A5] text-white'
                  }`}
                >
                  {m.role === 'user' ? <User size={14} /> : '🐦‍🔥'}
                </div>
                <div
                  className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#0055A5] text-white rounded-tr-sm'
                      : 'bg-[#19222a] text-gray-200 rounded-tl-sm border border-white/5'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#0055A5] text-white flex items-center justify-center text-xs shrink-0 animate-pulse">
                  🐦‍🔥
                </div>
                <div className="bg-[#19222a] p-3 rounded-2xl rounded-tl-sm border border-white/5 text-xs text-gray-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  @FeNi AI está analizando los datos ERP...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Formulario de Entrada */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#131a20] border-t border-amber-500/20 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta a @FeNi AI..."
              className="flex-1 bg-[#19222a] text-white text-xs px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

// Re-exportamos SapiChat y FeniChat para compatibilidad
export { FiniChat as SapiChat, FiniChat as FeniChat };
