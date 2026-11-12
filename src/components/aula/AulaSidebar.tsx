'use client';

import Link from 'next/link';
import { Award, Lock, Check, ChevronRight } from 'lucide-react';
import type { SyllabusClass, SyllabusModule } from '@/lib/curriculum-data';

interface AulaSidebarProps {
  sidebarOpen: boolean;
  moduleId: string;
  moduleInfo?: SyllabusModule;
  moduleClasses: SyllabusClass[];
  activeClassId: string;
  userDisplayName: string;
  userEmail?: string | null;
  completedClasses: Record<string, boolean>;
  passedPractices: string[];
  requiredPractices: string[];
  totalLessons: number;
  completedCount: number;
  vozFallo: boolean;
  practiceNotice: string | null;
  handleSelectClass: (id: string) => void;
}

export default function AulaSidebar({
  sidebarOpen,
  moduleId,
  moduleInfo,
  moduleClasses,
  activeClassId,
  userDisplayName,
  userEmail,
  completedClasses,
  passedPractices,
  requiredPractices,
  totalLessons,
  completedCount,
  vozFallo,
  practiceNotice,
  handleSelectClass
}: AulaSidebarProps) {
  if (!sidebarOpen) return null;

  return (
    <aside id="aula-temario" className="absolute inset-y-0 left-0 z-20 w-60 max-w-[85vw] shadow-2xl lg:shadow-none lg:static shrink-0 bg-[#0a1018] border-r border-gray-800 flex flex-col overflow-y-auto">
      {/* Student card */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-sm shrink-0">
            {(userDisplayName || 'U')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">
              {userDisplayName || 'Estudiante'}
            </p>
            <p className="text-[10px] text-gray-500 truncate">{userEmail}</p>
          </div>
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Progreso en Módulo</p>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs text-gray-300">{completedCount} de {totalLessons} ({Math.round((completedCount / Math.max(totalLessons, 1)) * 100)}%)</p>
        </div>
        <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
            style={{ width: `${(completedCount / Math.max(totalLessons, 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Certificate lock */}
      <div className="p-3 mx-3 my-3 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
            <Award className="w-3 h-3" /> Certificado
          </span>
          {completedCount < totalLessons ? (
            <span className="text-[10px] bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded-md font-medium flex items-center gap-0.5">
              <Lock className="w-2.5 h-2.5" /> Bloqueado
            </span>
          ) : (
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-md font-medium">¡Listo!</span>
          )}
        </div>
        {moduleInfo?.certificateTitle && (
          <p className="text-[11px] font-semibold text-amber-200 leading-snug mb-1">{moduleInfo.certificateTitle}</p>
        )}
        <p className="text-[10px] text-gray-400 leading-relaxed">
          Completa todas las clases, aprueba las prácticas del simulador y la Evaluación con Tutor IA.
        </p>
        {requiredPractices.length > 0 && (
          <p className="mt-1 text-[10px] font-semibold text-blue-300">
            Prácticas aprobadas: {requiredPractices.filter(p => passedPractices.includes(p)).length} de {requiredPractices.length}
          </p>
        )}
        {vozFallo && <p role="status" className="mt-1 text-xs text-amber-300">La voz no está disponible. Puedes leer el texto y controlar el avance.</p>}
        {practiceNotice && <p className="mt-1 text-[10px] text-amber-300" role="status">{practiceNotice}</p>}
        <Link
          href={`/mi-aula/${moduleId}/oral-exam`}
          className={`mt-2 w-full flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${completedCount >= totalLessons
            ? 'bg-amber-500 text-slate-900 hover:bg-amber-400 active:scale-95'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed pointer-events-none'
            }`}
        >
          Ir a Evaluación
        </Link>
      </div>

      {/* Class list */}
      <div className="px-3 pb-4 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
          Temario Oficial ({totalLessons} Clases)
        </p>
        {moduleClasses.map(cls => {
          const isActive = cls.id === activeClassId;
          const isDone = !!completedClasses[cls.id];
          return (
            <button
              key={cls.id}
              onClick={() => handleSelectClass(cls.id)}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer mb-1 ${isActive
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                : 'hover:bg-gray-800/60 text-gray-400 hover:text-gray-200 border border-transparent'
                }`}
            >
              <div className={`h-5 w-5 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-bold ${isDone ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                isActive ? 'bg-amber-500 text-slate-950' :
                  'bg-gray-800 text-gray-500 border border-gray-700'
                }`}>
                {isDone ? <Check className="w-3 h-3" /> : cls.number}
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate">{cls.title}</p>
                <p className="text-[10px] text-gray-500">{cls.durationMinutes} min</p>
              </div>
              {isActive && !isDone && (
                <ChevronRight className="w-3 h-3 text-amber-400 shrink-0 ml-auto" />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
