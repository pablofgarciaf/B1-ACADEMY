'use client';

import { companyScreens } from './company-screen-registry';

interface GenericSAPScreenProps {
  screenId: string;
  screenName: string;
  icon?: string;
  description?: string;
}

const TIPS: Record<string, string[]> = {
  default: [
    'Usa Ctrl+F para buscar registros existentes',
    'Tab navega entre campos; Enter confirma valores',
    'Doble clic en una fila abre el documento relacionado',
    'F5 actualiza la pantalla actual',
  ],
};

export default function GenericSAPScreen({ screenId, screenName, icon = '🖥️', description }: GenericSAPScreenProps) {
  const CompanyScreen = companyScreens[screenId];
  if (CompanyScreen) return <CompanyScreen />;
  return (
    <div className="flex flex-col h-full bg-[#ECE9D8] font-sans text-[11px] text-gray-800 select-none">
      {/* Título de ventana */}
      <div className="flex items-center justify-between bg-gradient-to-r from-[#003366] to-[#0055A5] px-2 py-0.5">
        <span className="text-white font-semibold text-[11px]">{screenName}</span>
        <div className="flex gap-1">
          <button className="w-4 h-4 bg-[#ECE9D8] border border-gray-600 text-[9px] flex items-center justify-center">_</button>
          <button className="w-4 h-4 bg-[#ECE9D8] border border-gray-600 text-[9px] flex items-center justify-center">□</button>
          <button className="w-4 h-4 bg-[#ECE9D8] border border-gray-600 text-[9px] flex items-center justify-center hover:bg-red-500 hover:text-white">✕</button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-1 py-0.5 bg-[#ECE9D8] border-b border-gray-400">
        {['◀', '▶', '⊕', '⊗', '💾', '🖨', '🔍'].map((icon, i) => (
          <button key={i} className="w-6 h-5 text-[10px] border border-gray-400 bg-[#F5F4EE] hover:bg-[#DDD9C4] flex items-center justify-center">
            {icon}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
        <div className="text-5xl">{icon}</div>
        <div className="text-center">
          <p className="font-bold text-gray-700 text-base mb-1">{screenName}</p>
          <p className="text-gray-500 text-xs max-w-xs text-center leading-relaxed">{description}</p>
          <p className="mt-2 text-[10px] text-gray-400 font-mono">ID: {screenId}</p>
        </div>

        {/* Tips de uso */}
        <div className="mt-4 w-full max-w-sm bg-[#FFFDE7] border border-yellow-300 rounded p-3">
          <p className="text-[10px] font-bold text-yellow-800 mb-2">💡 Atajos de SAP B1:</p>
          <ul className="space-y-1">
            {TIPS.default.map((tip, i) => (
              <li key={i} className="text-[10px] text-yellow-700 flex gap-2">
                <span>•</span><span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[10px] text-gray-400 italic mt-2">
          Componente en construcción — próximamente con réplica visual completa
        </p>
      </div>

      {/* Status bar */}
      <div className="flex items-center px-2 py-0.5 bg-[#D4D0C8] border-t border-gray-400 text-[10px] text-gray-600">
        <span className="flex-1">SAP Business One 10.0 — {screenId}</span>
        <span>Lista para aprendizaje</span>
      </div>
    </div>
  );
}
