"use client";

import React from 'react';
import { PlayCircle, CheckCircle2, Lock, Clock } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  durationMin: number;
  isCompleted: boolean;
  isLocked: boolean;
}

interface LessonNavigatorProps {
  lessons: Lesson[];
  activeLessonId: string;
  onSelectLesson: (id: string) => void;
  trackTitle?: string;
  trackCode?: string;
}

export function LessonNavigator({
  lessons,
  activeLessonId,
  onSelectLesson,
  trackTitle,
  trackCode,
}: LessonNavigatorProps) {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 space-y-4">
      <div className="flex justify-between items-start border-b border-slate-100 dark:border-white/5 pb-4 gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-sap-blue/10 text-sap-blue">
              {trackCode || 'SAP'}
            </span>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Temas de la Lección
            </h3>
          </div>
          {trackTitle && (
            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
              {trackTitle}
            </p>
          )}
        </div>
        <span className="text-xs font-semibold text-sap-blue shrink-0">
          {lessons.filter(l => l.isCompleted).length} / {lessons.length} Vistas
        </span>
      </div>

      <div className="space-y-2">
        {lessons.map((lesson, idx) => {
          const isActive = lesson.id === activeLessonId;
          return (
            <button
              key={lesson.id}
              disabled={lesson.isLocked}
              onClick={() => onSelectLesson(lesson.id)}
              className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.98] cursor-pointer ${
                isActive
                  ? 'bg-sap-blue text-white shadow-md shadow-sap-blue/20'
                  : lesson.isLocked
                  ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-white/[0.01]'
                  : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono opacity-60">#{idx + 1}</span>
                <div>
                  <p className="text-xs sm:text-sm font-semibold leading-tight">
                    {lesson.title}
                  </p>
                  <p className="text-[11px] opacity-70 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> {lesson.durationMin} min
                  </p>
                </div>
              </div>

              <div>
                {lesson.isLocked ? (
                  <Lock className="w-4 h-4 text-slate-400" />
                ) : lesson.isCompleted ? (
                  <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                ) : (
                  <PlayCircle className={`w-4 h-4 ${isActive ? 'text-white' : 'text-sap-blue'}`} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
