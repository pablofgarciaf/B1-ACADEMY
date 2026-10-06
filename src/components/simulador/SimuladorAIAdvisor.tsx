'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Loader } from 'lucide-react';

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
}

export default function SimuladorAIAdvisor({
  currentScreen = 'Dashboard',
  currentModule = 'Ventas',
  isOpen: initialOpen = false,
}: SimuladorAIAdvisorProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `¡Hola! Soy tu Asesor de IA de SAP B1. Estoy aquí para ayudarte con instrucciones paso a paso sobre cómo realizar tareas en el simulador.

Actualmente estás en: **${currentModule} > ${currentScreen}**

¿Qué necesitas hacer? Puedes preguntarme:
- "¿Cómo crear una factura?"
- "¿Qué pasos debo seguir para agregar un cliente?"
- "Explícame cómo usar el módulo de inventario"

¡Estoy listo para ayudarte! 🚀`,
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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage.content },
          ],
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

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-14 right-4 z-[5000] w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
          title="Abrir Asesor de IA"
        >
          <MessageCircle size={24} />
          <span className="absolute -top-12 right-0 bg-gray-800 text-white text-xs px-3 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Asesor IA
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-x-3 bottom-14 z-[5000] flex h-[min(600px,calc(100dvh-5rem))] flex-col overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900 shadow-2xl backdrop-blur-xl sm:inset-x-auto sm:right-4 sm:w-96">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold flex items-center gap-2">
                <MessageCircle size={18} />
                Asesor de IA SAP B1
              </h3>
              <p className="text-xs text-blue-100 mt-1">
                {currentModule} • {currentScreen}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 p-2 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 text-sm ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === 'user'
                        ? 'text-blue-100'
                        : 'text-slate-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-slate-200 rounded-lg px-4 py-2 rounded-bl-none border border-slate-700">
                  <div className="flex items-center gap-2">
                    <Loader size={16} className="animate-spin" />
                    <span className="text-sm">IA está pensando...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-slate-700/50 bg-slate-900 p-4 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta algo... ¿Cómo creo una factura?"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white p-2 rounded-lg transition flex items-center justify-center"
            >
              {isLoading ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
