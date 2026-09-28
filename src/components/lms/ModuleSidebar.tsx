"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  ChevronLeft,
  GraduationCap,
} from 'lucide-react';
import { TRAINING_MODULES } from '@/lib/modules-data';

interface ModuleSidebarProps {
  /** List of completed lesson IDs from student progress */
  completedLessons?: string[];
}

export function ModuleSidebar({ completedLessons = [] }: ModuleSidebarProps) {
  const pathname = usePathname();
  const currentSlug = pathname.split('/').pop() || '';

  return (
    <aside className="w-72 shrink-0 h-[calc(100vh-5rem)] sticky top-20 overflow-y-auto border-r border-slate-200 dark:border-white/[0.06] bg-white/50 dark:bg-[#0b1320]/80 backdrop-blur-xl hidden lg:block">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-white/5">
        <Link
          href="/mi-aula"
          className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-sap-blue transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Volver a Mi Aula
        </Link>
        <div className="flex items-center gap-2 mt-3">
          <GraduationCap className="w-5 h-5 text-sap-blue" />
          <span className="text-sm font-bold text-slate-900 dark:text-white font-display">
            SAP Business One 10.0
          </span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">12 Módulos • Programa Completo</p>
      </div>

      {/* Module list */}
      <nav className="p-2 space-y-0.5">
        {TRAINING_MODULES.map((mod) => {
          const isActive = currentSlug === mod.slug;
          const moduleLessonIds = mod.lessons.map((l) => l.id);
          const completedCount = moduleLessonIds.filter((id) =>
            completedLessons.includes(id)
          ).length;
          const isCompleted = completedCount === mod.lessons.length && mod.lessons.length > 0;

          return (
            <Link
              key={mod.id}
              href={`/mi-aula/${mod.slug}`}
              className={`group flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all ${
                isActive
                  ? 'bg-sap-blue/10 text-sap-blue dark:text-sky-300 font-bold border border-sap-blue/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.03] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {/* Status indicator */}
              <div className="mt-0.5 shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : isActive ? (
                  <BookOpen className="w-4 h-4 text-sap-blue" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-white/20 flex items-center justify-center text-[8px] font-bold text-slate-400">
                    {mod.id}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className={`leading-tight line-clamp-2 ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {mod.shortTitle}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-400">
                    {mod.lessonsCount} lecciones • {mod.durationMinutes} min
                  </span>
                  {completedCount > 0 && !isCompleted && (
                    <span className="text-[10px] text-sap-blue font-bold">
                      {completedCount}/{mod.lessonsCount}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
