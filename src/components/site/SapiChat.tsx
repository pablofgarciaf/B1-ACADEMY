"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, ExternalLink } from 'lucide-react';
import SapiMascota from './SapiMascota';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const SUGGESTED_QUESTIONS = [
  "¿Qué es SAP Business One?",
  "¿Cómo crear un pedido de venta?",
  "¿Cómo funciona el MRP?"
];

export default function SapiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [lado, setLado] = useState<'izq' | 'der'>('der');

  // Cualquier botón de la plataforma puede abrir SAPI (p. ej. "Preguntar a SAPI" en la barra de la clase).
  useEffect(() => {
    const abrir = () => { setLado('der'); setIsOpen(true); };
    window.addEventListener('sapi-abrir', abrir);
    return () => window.removeEventListener('sapi-abrir', abrir);
  }, []);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [...prev, { role: 'assistant', content: "Lo siento, ha ocurrido un error de conexión." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={isOpen ? `fixed bottom-6 z-50 ${lado === 'izq' ? 'left-6' : 'right-6'}` : ''}>
      {isOpen ? (
        <div className="flex flex-col w-full sm:w-[400px] h-[550px] max-h-[85vh] bg-[#131a20] border border-white/10 rounded-2xl shadow-2xl overflow-hidden shadow-amber-500/10">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-[#19222a] border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 border border-amber-500/30">
                  <Bot size={24} />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#19222a]"></div>
              </div>
              <div>
                <h3 className="font-bold text-white flex items-center gap-2">
                  SAPI <Sparkles size={16} className="text-amber-500" />
                </h3>
                <p className="text-xs text-gray-400">Tu asistente experta en SAP Business One</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="space-y-3 mb-6">
                <div className="bg-[#19222a] p-4 rounded-2xl rounded-tl-sm border border-white/5 max-w-[85%] text-gray-200">
                  ¡Hola! Soy SAPI. Conozco los manuales de SAP Business One. ¿En qué puedo ayudarte hoy?
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      className="text-xs bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/20 px-3 py-1.5 rounded-full transition-all active:scale-95 text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] text-sm ${msg.role === 'user'
                      ? 'bg-amber-500 text-white rounded-tr-sm'
                      : 'bg-[#19222a] text-gray-200 border border-white/5 rounded-tl-sm'
                    }`}
                >
                  {msg.role === 'user' ? (
                    msg.content
                  ) : (
                    <ReactMarkdown
                      components={{
                        a: ({ node, ...props }) => (
                          <Link href={props.href || "#"} className="text-amber-500 hover:underline inline-flex items-center gap-1 font-medium">
                            {props.children}
                          </Link>
                        ),
                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#19222a] p-4 rounded-2xl rounded-tl-sm border border-white/5 flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#131a20] border-t border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta..."
                className="w-full bg-[#19222a] text-white placeholder-gray-500 rounded-xl px-4 py-3 pr-12 outline-none border border-white/10 focus:border-amber-500/50 transition-all text-sm"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-2 bg-amber-500 text-white rounded-lg disabled:opacity-50 disabled:bg-gray-600 hover:bg-amber-600 transition-all active:scale-95 flex items-center justify-center"
              >
                <Send size={16} className={input.trim() && !isLoading ? 'ml-0.5' : ''} />
              </button>
            </form>

            <div className="mt-3 flex justify-center">
              <a
                href="https://wa.me/593983992549"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-amber-500 flex items-center gap-1 transition-colors"
              >
                ¿Necesitas ayuda humana? Contáctanos por WhatsApp <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      ) : (
        <SapiMascota onAbrir={(l) => { setLado(l); setIsOpen(true); }} />
      )}
    </div>
  );
}
