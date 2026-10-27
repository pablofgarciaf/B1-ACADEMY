'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturó una excepción en Finix ERP:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[300px] flex items-center justify-center p-6 bg-[#f0f4f8] font-[Tahoma,Arial,sans-serif] text-[11px] text-[#333]">
          <div className="max-w-lg w-full bg-white border border-[#99aab8] rounded shadow-xl overflow-hidden">
            {/* Barra de Título Estilo SAP B1 */}
            <div className="bg-gradient-to-r from-[#8b0000] to-[#b22222] text-white px-3 py-1.5 font-bold flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle size={15} className="text-yellow-300" />
                <span>SAP Business One — Advertencia del Sistema</span>
              </div>
              <span className="text-[10px] text-white/80 font-mono">Error de Ejecución</span>
            </div>

            <div className="p-4 space-y-3">
              <p className="font-semibold text-gray-800">
                {this.props.fallbackTitle || 'Se produjo una interrupción en el renderizado de esta pantalla.'}
              </p>
              <div className="p-2.5 bg-red-50 border border-red-200 rounded font-mono text-[10.5px] text-red-900 break-words max-h-32 overflow-y-auto">
                {this.state.error?.message || 'Error no especificado'}
              </div>
              <p className="text-[10.5px] text-gray-500">
                Puedes reintentar la renderización o restablecer el simulador sin perder tu progreso guardado en la sociedad.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="px-3 py-1 bg-[#f0f4f8] hover:bg-white border border-[#99aab8] rounded text-[#003366] font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-xs"
                >
                  <RefreshCw size={12} />
                  <span>Reintentar</span>
                </button>
                <button
                  type="button"
                  onClick={this.handleReload}
                  className="px-3 py-1 bg-[#0055a5] hover:bg-[#004080] text-white border border-[#003366] rounded font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-xs"
                >
                  <Home size={12} />
                  <span>Reiniciar Simulador</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
