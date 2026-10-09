'use client';

import { companyScreens } from './company-screen-registry';

interface GenericFinixScreenProps {
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

export default function GenericFinixScreen({ screenId, screenName, icon = '🖥️', description }: GenericFinixScreenProps) {
  const CompanyScreen = companyScreens[screenId];
  if (CompanyScreen) return <CompanyScreen />;
  return (
    <div className="flex flex-col h-full bg-[#f8fafc] font-sans text-xs text-gray-800 select-none">
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
          <p className="text-[10px] font-bold text-yellow-800 mb-2">💡 Atajos de Finix ERP:</p>
          <ul className="space-y-1">
            {TIPS.default.map((tip, i) => (
              <li key={i} className="text-[10px] text-yellow-700 flex gap-2">
                <span>•</span><span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[10px] text-gray-400 italic mt-2">
          Componente interactivo oficial de Finix ERP Cloud
        </p>
      </div>

      {/* Status bar */}
      <div className="flex items-center px-2 py-0.5 bg-[#D4D0C8] border-t border-gray-400 text-[10px] text-gray-600">
        <span className="flex-1">Finix ERP 2026 — {screenId}</span>
        <span>Lista para aprendizaje</span>
      </div>
    </div>
  );
}

export { GenericFinixScreen as GenericSAPScreen };
