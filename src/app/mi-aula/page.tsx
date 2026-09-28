"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  BookOpen,
  Award,
  Clock,
  ArrowRight,
  CheckCircle2,
  Lock,
  Play,
  Download,
  FileText,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '@/components/site/Navbar';
import { useAuth } from '@/context/AuthContext';
import { TRAINING_MODULES, TOTAL_PROGRAM_HOURS } from '@/lib/modules-data';

export default function MiAulaPage() {
  const router = useRouter();
  const { userProfile, loading: authLoading } = useAuth();

  // Route guard
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

  if (authLoading || !userProfile || userProfile.passwordChanged === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#080d1a]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-10 h-10 rounded-full border-2 border-sap-blue border-t-transparent animate-spin" />
          <p className="text-xs font-mono">Cargando tu aula virtual...</p>
        </div>
      </div>
    );
  }

  const isSuperOrAdmin = userProfile.role === 'super' || userProfile.role === 'admin';
  const initials = (userProfile.name || 'U')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  // Placeholder: in the future this will come from Firestore
  const completedModules = 0;
  const progressPercent = 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a] selection:bg-sap-blue selection:text-white">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* ── HEADER: Student Profile ─────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Profile card */}
          <div className="flex-1 p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sap-blue to-sky-500 text-white flex items-center justify-center font-bold text-2xl shadow-lg">
                {initials}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                  {userProfile.name || userProfile.displayName}
                </h1>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {userProfile.email} • Cédula: {userProfile.cedula || 'N/A'}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sap-blue/10 text-sap-blue">
                    {isSuperOrAdmin ? 'Superadmin & Consultor' : 'Estudiante'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick stats */}
          <div className="flex gap-4 shrink-0">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] text-center min-w-[120px]">
              <BarChart3 className="w-5 h-5 text-sap-blue mx-auto mb-1.5" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white font-display">{progressPercent}%</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Avance Global</p>
            </div>
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] text-center min-w-[120px]">
              <Award className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white font-display">0</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Certificados</p>
            </div>
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] text-center min-w-[120px]">
              <Clock className="w-5 h-5 text-emerald-500 mx-auto mb-1.5" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white font-display">{TOTAL_PROGRAM_HOURS}h</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Programa</p>
            </div>
          </div>
        </div>

        {/* ── SECTION: My Certificates (placeholder) ───────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Mis Certificados
            </h2>
          </div>
          <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 text-center">
            <Award className="w-10 h-10 text-slate-300 dark:text-white/20 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Aún no has obtenido certificados. Completa los módulos, aprueba las evaluaciones teórica y práctica,
              y solicita tu evaluación semi-presencial para obtener tu primer certificado.
            </p>
          </div>
        </section>

        {/* ── SECTION: My Modules / Courses ───────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sap-blue" />
                Mis Módulos de Capacitación
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                SAP Business One 10.0 • {TRAINING_MODULES.length} Módulos • {TOTAL_PROGRAM_HOURS} Horas
              </p>
            </div>
            <Link
              href="/capacitacion"
              className="text-xs font-bold text-sap-blue hover:underline flex items-center gap-1"
            >
              Ver Catálogo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {TRAINING_MODULES.map((mod) => {
              const levelColors: Record<string, string> = {
                basico: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
                intermedio: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
                avanzado: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
              };
              const levelLabels: Record<string, string> = {
                basico: 'Básico',
                intermedio: 'Intermedio',
                avanzado: 'Avanzado',
              };

              return (
                <Link
                  key={mod.id}
                  href={`/mi-aula/${mod.slug}`}
                  className="group p-5 rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-sap-blue/40 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-sap-blue">
                        Módulo {mod.id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${levelColors[mod.level]}`}>
                        {levelLabels[mod.level]}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-sap-blue transition-colors line-clamp-2">
                      {mod.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      {mod.lessonsCount} lecciones • {mod.durationMinutes} min
                    </span>
                    <span className="text-[10px] text-sap-blue font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Ir al Módulo <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── SECTION: Pending Evaluations (placeholder) ───────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-500" />
              Mis Evaluaciones
            </h2>
          </div>
          <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 text-center">
            <Lock className="w-10 h-10 text-slate-300 dark:text-white/20 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Las evaluaciones se desbloquean cuando completas todas las lecciones de un módulo.
              Primero pasarás la <strong>Prueba Teórica</strong>, luego la <strong>Prueba Práctica</strong>,
              y finalmente podrás solicitar tu <strong>Evaluación Semi-Presencial</strong> con un experto.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
