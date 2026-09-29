"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { TRAINING_MODULES } from '@/lib/modules-data';
import { getStudentProfile } from '@/lib/student-service';
import { StudentProfile } from '@/types/student';
import { CheckCircle2, Circle, Clock, ArrowLeft, ChevronDown, ChevronRight, Menu, X } from 'lucide-react';

interface LessonSidebarProps {
  currentModuleSlug: string;
  currentLessonId: string;
  studentName?: string;
  studentPhoto?: string | null;
}

export function LessonSidebar({
  currentModuleSlug,
  currentLessonId,
  studentName,
  studentPhoto
}: LessonSidebarProps) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    [currentModuleSlug]: true
  });

  useEffect(() => {
    setProfile(getStudentProfile());
  }, []);

  const currentModule = TRAINING_MODULES.find(m => m.slug === currentModuleSlug);
  const otherModules = TRAINING_MODULES.filter(m => m.slug !== currentModuleSlug);

  const toggleModule = (slug: string) => {
    setExpandedModules(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  const currentProgress = profile?.progress?.[currentModuleSlug]?.percent || 0;
  
  const getInitials = (name?: string) => {
    if (!name) return 'ST';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const displayName = studentName || profile?.displayName || 'Estudiante SAP';

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-[#080d1a] border-r border-slate-200 dark:border-white/10 w-72">
      {/* Top Section: Student Info & Back Link */}
      <div className="p-6 border-b border-slate-200 dark:border-white/10">
        <Link 
          href="/mi-aula" 
          className="flex items-center text-sm text-slate-500 hover:text-sap-blue dark:text-slate-400 dark:hover:text-sky-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Mi Aula
        </Link>
        
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-sap-blue/10 dark:bg-sky-400/10 flex items-center justify-center text-sap-blue dark:text-sky-400 font-bold text-lg flex-shrink-0 overflow-hidden">
            {studentPhoto ? (
              <img src={studentPhoto} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              getInitials(displayName)
            )}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{displayName}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-sap-blue/10 text-sap-blue dark:bg-sky-400/10 dark:text-sky-400 font-medium">
              {profile?.role === 'consultor_premium' ? 'Premium' : 'Estándar'}
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Current Module Section */}
        {currentModule && (
          <div className="p-4">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Módulo Actual</h4>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-14 h-14 flex-shrink-0">
                {/* Background circle */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200 dark:text-slate-700"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Progress circle */}
                  <path
                    className="text-sap-blue dark:text-sky-400 transition-all duration-1000 ease-in-out"
                    strokeDasharray={`${currentProgress}, 100`}
                    strokeWidth="3"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-sap-blue dark:text-sky-400">{Math.round(currentProgress)}%</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 leading-tight">
                  {currentModule.title}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              {currentModule.lessons.map((lesson) => {
                const isCompleted = profile?.progress?.[currentModuleSlug]?.completedLessons.includes(lesson.id);
                const isCurrent = lesson.id === currentLessonId;

                return (
                  <Link
                    key={lesson.id}
                    href={`/mi-aula/${currentModuleSlug}/${lesson.id}`}
                    className={`flex items-start p-3 rounded-lg transition-colors ${
                      isCurrent 
                        ? 'bg-sap-blue/10 dark:bg-sky-400/10' 
                        : 'hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="mt-0.5 mr-3 flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : isCurrent ? (
                        <div className="w-5 h-5 rounded-full border-2 border-sap-blue dark:border-sky-400 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-sap-blue dark:bg-sky-400" />
                        </div>
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium line-clamp-2 ${
                        isCurrent 
                          ? 'text-sap-blue dark:text-sky-400' 
                          : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {lesson.title}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="w-3 h-3 mr-1" />
                        15 min
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="h-px bg-slate-200 dark:bg-white/10 mx-4" />

        {/* Other Modules Section */}
        <div className="p-4 space-y-6">
          {/* Pendientes */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Módulos Pendientes</h4>
            <div className="space-y-2">
              {otherModules.filter(m => (profile?.progress?.[m.slug]?.percent || 0) < 80).map((module) => {
                const isExpanded = expandedModules[module.slug];
                const moduleProgress = profile?.progress?.[module.slug]?.percent || 0;

                return (
                  <div key={module.slug} className="border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleModule(module.slug)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-1">
                          {module.title}
                        </p>
                        <div className="flex items-center mt-1">
                          <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-1 mr-2">
                            <div 
                              className="bg-slate-400 dark:bg-slate-500 h-1 rounded-full" 
                              style={{ width: `${moduleProgress}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500">{Math.round(moduleProgress)}%</span>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="bg-slate-50 dark:bg-black/20 p-2 border-t border-slate-200 dark:border-white/10">
                        {module.lessons.map((lesson) => {
                          const isCompleted = profile?.progress?.[module.slug]?.completedLessons.includes(lesson.id);
                          return (
                            <Link
                              key={lesson.id}
                              href={`/mi-aula/${module.slug}/${lesson.id}`}
                              className="flex items-center p-2 rounded hover:bg-white dark:hover:bg-white/5 transition-colors"
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 mr-2 flex-shrink-0" />
                              )}
                              <span className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">{lesson.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Aprobados */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Certificados Aprobados</h4>
            <div className="space-y-2">
              {otherModules.filter(m => (profile?.progress?.[m.slug]?.percent || 0) >= 80).map((module) => {
                const isExpanded = expandedModules[module.slug];
                const moduleProgress = profile?.progress?.[module.slug]?.percent || 0;

                return (
                  <div key={module.slug} className="border border-green-200 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleModule(module.slug)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-sm font-medium text-green-800 dark:text-green-400 line-clamp-1">
                          {module.title}
                        </p>
                        <div className="flex items-center mt-1">
                          <CheckCircle2 className="w-3 h-3 text-green-500 mr-1" />
                          <span className="text-[10px] text-green-600 dark:text-green-500">Completado</span>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-green-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-green-600" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="bg-white/50 dark:bg-black/20 p-2 border-t border-green-100 dark:border-green-900/20">
                        {module.lessons.map((lesson) => (
                            <Link
                              key={lesson.id}
                              href={`/mi-aula/${module.slug}/${lesson.id}`}
                              className="flex items-center p-2 rounded hover:bg-white dark:hover:bg-white/5 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              <span className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">{lesson.title}</span>
                            </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {otherModules.filter(m => (profile?.progress?.[m.slug]?.percent || 0) >= 80).length === 0 && (
                <div className="text-xs text-slate-400 italic">Aún no hay módulos aprobados.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button 
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-sap-blue text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block sticky top-0 h-screen flex-shrink-0 z-10">
        <SidebarContent />
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 h-full shadow-2xl transform transition-transform">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
