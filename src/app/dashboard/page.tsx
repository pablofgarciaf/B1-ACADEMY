"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Clock,
  ArrowRight,
  ShieldCheck,
  Play,
  RotateCcw,
  Sparkles,
  Camera,
  Plus,
  Trash2,
  Check,
  Layers,
  FileText,
  User,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import {
  getStudentProfile,
  recordLessonCompletion,
  recordExamResult,
  resetStudentProfile,
  selectModule,
  deselectModule,
  updateProfilePhoto
} from '@/lib/student-service';
import { StudentProfile } from '@/types/student';
import { TRAINING_MODULES, TrainingModule } from '@/lib/modules-data';
import { TRAINING_TRACKS } from '@/lib/courses-data';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';

export default function StudentDashboardPage() {
  const router = useRouter();
  const { userProfile, loading: authLoading } = useAuth();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── ROUTE GUARD ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading) {
      if (!userProfile) {
        router.replace('/login');
        return;
      }
      if (userProfile.passwordChanged === false) {
        router.replace('/change-password');
        return;
      }
    }
  }, [authLoading, userProfile, router]);
  // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!userProfile) return;
    const prof = getStudentProfile();
    if (userProfile) {
      prof.displayName = userProfile.name || userProfile.displayName || 'Pablo F. García';
      prof.email = userProfile.email || 'pablofgarciaf@gmail.com';
      prof.studentId = userProfile.cedula || '1721790721';
    }
    setStudent({ ...prof });
  }, [userProfile]);

  if (authLoading || !userProfile || userProfile.passwordChanged === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#080d1a]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-10 h-10 rounded-full border-2 border-sap-blue border-t-transparent animate-spin" />
          <p className="text-xs font-mono">Cargando expediente...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Cargando expediente académico...</div>;
  }

  const { jobReadiness } = student;

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen debe pesar menos de 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const updated = updateProfilePhoto(base64);
      setStudent({ ...updated });
    };
    reader.readAsDataURL(file);
  };

  // Handle Module Selection Toggle
  const handleToggleModule = (moduleSlug: string, isSelected: boolean) => {
    let updated: StudentProfile;
    if (isSelected) {
      updated = deselectModule(moduleSlug);
    } else {
      updated = selectModule(moduleSlug);
    }
    setStudent({ ...updated });
  };

  // Reset Progress
  const handleResetProgress = () => {
    if (confirm('¿Deseas reiniciar tu progreso a 0% para iniciar tu formación desde cero?')) {
      const reset = resetStudentProfile();
      if (userProfile) {
        reset.displayName = userProfile.name || userProfile.displayName || 'Pablo F. García';
        reset.email = userProfile.email || 'pablofgarciaf@gmail.com';
        reset.studentId = userProfile.cedula || '1721790721';
      }
      setStudent({ ...reset });
    }
  };

  // Categorize Modules: Selected vs Remaining
  const selectedSlugs = student.selectedModules || ['modulo-01', 'modulo-02', 'modulo-03'];
  const selectedModulesList = TRAINING_MODULES.filter(m => selectedSlugs.includes(m.slug));
  const remainingModulesList = TRAINING_MODULES.filter(m => !selectedSlugs.includes(m.slug));

  // Calculate stats for Selected Modules
  const getModuleProgress = (slug: string) => {
    const p = student.progress[slug];
    return p ? p.percent : 0;
  };

  const completedSelectedModules = selectedModulesList.filter(m => getModuleProgress(m.slug) === 100);
  const inProgressSelectedModules = selectedModulesList.filter(m => getModuleProgress(m.slug) < 100);

  // Resume Module Card (Hero)
  const lastVisitedSlug = student.lastVisited?.moduleSlug || selectedModulesList[0]?.slug || 'modulo-01';
  const activeHeroModule = TRAINING_MODULES.find(m => m.slug === lastVisitedSlug) || TRAINING_MODULES[0];
  const activeHeroLessonId = student.lastVisited?.lessonId || activeHeroModule.lessons[0].id;
  const activeHeroProgress = getModuleProgress(activeHeroModule.slug);

  // Calculate overall program completion %
  const totalCompletedLessons = Object.values(student.progress).reduce((acc, p) => acc + (p.completedLessons?.length || 0), 0);
  const overallCompletionPercent = Math.min(100, Math.round((totalCompletedLessons / 38) * 100));

  // User Initials
  const initials = student.displayName
    ? student.displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'PG';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080d1a] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* HEADER BRANDING */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sap-blue dark:text-sky-400 font-bold mb-1 uppercase tracking-wider">
              <span>B1 ACADEMY</span>
              <span>•</span>
              <span>EXPEDIENTE ACADÉMICO UNIFICADO</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Panel del Estudiante
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetProgress}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reiniciar Progreso
            </button>
            <Link
              href="/dashboard/calificaciones"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-sap-blue text-white shadow-md hover:bg-sky-600 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Award className="w-3.5 h-3.5" /> Boletín de Certificados
            </Link>
          </div>
        </div>

        {/* ── BENTO GRID SECTION ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {/* CARD 1: PERFIL DEL ESTUDIANTE */}
          <div className="md:col-span-1 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  PERFIL REGISTRADO
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sap-blue/10 text-sap-blue dark:text-sky-400 border border-sap-blue/20">
                  {student.role === 'admin' ? 'Superadmin' : 'Consultor Premium'}
                </span>
              </div>

              {/* Avatar + Change Photo */}
              <div className="flex flex-col items-center text-center space-y-3 pt-2">
                <div className="relative group">
                  {student.profilePhoto ? (
                    <img
                      src={student.profilePhoto}
                      alt={student.displayName}
                      className="w-24 h-24 rounded-full object-cover border-4 border-sap-blue/30 shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sap-blue to-sky-500 text-white flex items-center justify-center font-bold text-2xl border-4 border-sap-blue/30 shadow-md">
                      {initials}
                    </div>
                  )}

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all cursor-pointer border border-white/20"
                    title="Cambiar foto de perfil"
                  >
                    <Camera className="w-4 h-4" />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                    {student.displayName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{student.email}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>ID Estudiante:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-200">{student.studentId}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Matrícula:</span>
                  <span className="font-mono text-slate-900 dark:text-slate-200">{student.enrollmentDate}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" /> Expediente Activo y Verificado
              </div>
            </div>
          </div>

          {/* CARD 2: CONTINUAR DONDE LO DEJÉ (HERO CARD) */}
          <div className="md:col-span-2 bg-gradient-to-br from-slate-900 via-[#0b1326] to-slate-950 text-white border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sap-blue/20 rounded-full blur-3xl -z-0 pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                  <Play className="w-3 h-3 fill-amber-300" /> CONTINUAR FORMARCIÓN
                </span>
                <span className="text-xs font-mono text-slate-400">Última Lección Visto</span>
              </div>

              <div>
                <span className="text-xs font-mono text-sky-400 font-bold uppercase block mb-1">
                  MÓDULO {activeHeroModule.id} • {activeHeroModule.shortTitle}
                </span>
                <h2 className="text-xl font-bold text-white leading-tight line-clamp-2">
                  {activeHeroModule.title}
                </h2>
                <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                  {activeHeroModule.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Avance del Módulo</span>
                  <span className="text-sky-400 font-bold">{activeHeroProgress}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sap-blue to-sky-400 transition-all duration-500"
                    style={{ width: `${activeHeroProgress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 flex items-center justify-between border-t border-white/10 mt-4">
              <div className="text-xs text-slate-400">
                <span>Lección activa: </span>
                <strong className="text-white">{activeHeroLessonId}</strong>
              </div>
              <Link
                href={`/mi-aula/${activeHeroModule.slug}/${activeHeroLessonId}`}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sap-blue to-sky-600 hover:from-sky-600 hover:to-sap-blue text-white font-bold text-xs shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>Continuar Módulo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* CARD 3: METRICAS Y PROGRESO GENERAL */}
          <div className="md:col-span-1 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                PROGRESO GLOBAL (38 LECCIONES)
              </span>

              {/* Circular Ring */}
              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="46"
                      className="text-slate-100 dark:text-white/5 stroke-current"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="46"
                      className="text-sap-blue stroke-current transition-all duration-1000"
                      strokeWidth="8"
                      strokeDasharray={289}
                      strokeDashoffset={289 - (289 * overallCompletionPercent) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {overallCompletionPercent}%
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Completado</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Módulos Elegidos:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedModulesList.length} de 12
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Módulos Finalizados:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {completedSelectedModules.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Horas Practicadas:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {student.sandboxHoursUsed}h / 999h
                  </span>
                </div>
              </div>
            </div>

            {/* Estatus Job-Ready */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/5">
              <div
                className={`p-3 rounded-2xl border flex items-center gap-3 ${
                  jobReadiness.isEligibleForJobs
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
                }`}
              >
                <Briefcase className="w-5 h-5 flex-shrink-0" />
                <div className="text-xs">
                  <div className="font-bold">
                    {jobReadiness.isEligibleForJobs ? 'Consultor Job-Ready' : 'En Formación Técnica'}
                  </div>
                  <div className="text-[10px] opacity-80">
                    {jobReadiness.isEligibleForJobs
                      ? 'Habilitado para Bolsa de Empleo'
                      : 'Completa >= 80% para habilitarte'}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── MIS MÓDULOS ELEGIDOS (SECCIÓN PRINCIPAL) ────────────────────────── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sap-blue dark:text-sky-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Mis Módulos Elegidos ({selectedModulesList.length})
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Estos son los módulos seleccionados para tu plan de estudio activo. Al completar un módulo con examen ≥ 80% emites su certificado específico.
              </p>
            </div>

            <Link
              href="/mi-aula"
              className="text-xs font-bold text-sap-blue dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              Ver aula completa <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedModulesList.map((mod) => {
              const pct = getModuleProgress(mod.slug);
              const isDone = pct === 100;
              const hasCert = student.certifications.some(c => c.courseCode === mod.slug);

              return (
                <div
                  key={mod.id}
                  className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-3xl p-6 space-y-4 hover:border-sap-blue/40 transition-all flex flex-col justify-between group shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                        MÓDULO {mod.id}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        {isDone && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Completado
                          </span>
                        )}
                        <button
                          onClick={() => handleToggleModule(mod.slug, true)}
                          className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                          title="Quitar de mi plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-sap-blue dark:group-hover:text-sky-400 transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {mod.description}
                      </p>
                    </div>

                    {/* Lecciones list */}
                    <div className="space-y-1 pt-2">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {mod.lessonsCount} Lecciones • {mod.durationMinutes} min
                      </span>
                      <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isDone
                              ? 'bg-emerald-500'
                              : 'bg-gradient-to-r from-sap-blue to-sky-400'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                    {hasCert ? (
                      <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" /> Certificado Emitido
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono">
                        {pct}% avance
                      </span>
                    )}

                    <Link
                      href={`/mi-aula/${mod.slug}/${mod.lessons[0].id}`}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white/10 hover:bg-sap-blue dark:hover:bg-sap-blue text-white transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                    >
                      <span>{isDone ? 'Repasar' : 'Estudiar'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── MÓDULOS RESTANTES DISPONIBLES ──────────────────────────────────── */}
        {remainingModulesList.length > 0 && (
          <section className="space-y-6 pt-6">
            <div className="border-b border-slate-200 dark:border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-slate-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Módulos Restantes del Programa ({remainingModulesList.length})
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Haz clic en &quot;+ Agregar a mi plan&quot; para incluir cualquier módulo adicional a tu ruta de estudio activa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {remainingModulesList.map((mod) => (
                <div
                  key={mod.id}
                  className="bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/20 transition-all space-y-3 opacity-90 hover:opacity-100"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        MÓDULO {mod.id}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {mod.durationMinutes} min
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 line-clamp-2">
                      {mod.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => handleToggleModule(mod.slug, false)}
                    className="w-full py-2 rounded-xl text-xs font-bold border border-sap-blue/30 text-sap-blue dark:text-sky-400 hover:bg-sap-blue hover:text-white transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar a Mi Plan
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── MIS CERTIFICADOS EXPEDIDOS ─────────────────────────────────────── */}
        <section className="space-y-6 pt-6">
          <div className="border-b border-slate-200 dark:border-white/10 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Mis Certificados Obtenidos ({student.certifications.length})
              </h2>
            </div>
          </div>

          {student.certifications.length === 0 ? (
            <div className="p-8 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 text-center space-y-3 bg-white dark:bg-white/[0.01]">
              <Award className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">
                  Aún no has emitido certificados
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Completa cualquiera de los 12 módulos y aprueba su examen oficial con <strong>≥ 80%</strong> para generar automáticamente tu certificado verificado en PDF y LinkedIn.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {student.certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-gradient-to-br from-white to-amber-50/30 dark:from-white/[0.03] dark:to-amber-500/[0.02] border border-amber-200 dark:border-amber-500/20 rounded-3xl p-6 space-y-4 shadow-sm relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {cert.title.includes('Máster') ? 'CERTIFICACIÓN SUPERIOR' : 'CERTIFICADO DE MÓDULO'}
                    </span>
                    <Award className="w-5 h-5 text-amber-500" />
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                      Emitido el: {cert.issuedDate}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 truncate max-w-[150px]">
                      ID: {cert.id}
                    </span>
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-sap-blue dark:text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <span>Verificar</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      <Footer />
    </div>
  );
}
