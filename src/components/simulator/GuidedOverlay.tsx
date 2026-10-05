import React from 'react';
import { ArrowRight, Info, CheckCircle } from 'lucide-react';

interface GuidedOverlayProps {
  active: boolean;
  message: string;
  expectedAction: string;
  onActionSimulated?: () => void;
}

export default function GuidedOverlay({ active, message, expectedAction, onActionSimulated }: GuidedOverlayProps) {
  if (!active) return null;

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
      {/* Capa de oscurecimiento */}
      <div className="absolute inset-0 bg-black/60 pointer-events-auto backdrop-blur-[1px]" />
      
      {/* Tooltip de Instrucción del Tutor IA */}
      <div className="relative z-50 bg-[#1e293b] border border-blue-500/50 p-4 rounded-xl shadow-2xl max-w-sm pointer-events-auto flex flex-col gap-3 animate-in fade-in zoom-in duration-300 translate-y-10">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
            <Info size={20} />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-1">Tutor IA:</h4>
            <p className="text-gray-300 text-xs leading-relaxed">{message}</p>
          </div>
        </div>
        
        <div className="bg-[#0f172a] rounded-lg p-2.5 border border-gray-700 flex items-center justify-between">
          <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Acción Requerida</span>
          <span className="text-amber-400 font-mono text-[11px] font-bold flex items-center gap-1">
            {expectedAction} <ArrowRight size={12} />
          </span>
        </div>

        {onActionSimulated && (
          <button 
            onClick={onActionSimulated}
            className="mt-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded shadow transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <CheckCircle size={14} /> Simular Clic (Omitir Paso)
          </button>
        )}
      </div>
    </div>
  );
}
