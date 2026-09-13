"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import { getStudentProfile, recordLessonCompletion, recordExamResult } from '@/lib/student-service';
import { StudentProfile } from '@/types/student';
import { useAuth } from '@/context/AuthContext';

export default function StudentDashboardPage() {
  const { userProfile } = useAuth();
  const [student, setStudent] = useState<StudentProfile | null>(null);

  useEffect(() => {
    const prof = getStudentProfile();
    if (userProfile) {
      prof.displayName = userProfile.name || userProfile.displayName || 'Pablo F. García';
      prof.email = userProfile.email || 'pablofgarciaf@gmail.com';
      prof.studentId = userProfile.cedula || '1721790721';
    }
    setStudent({ ...prof });
  }, [userProfile]);

  if (!student) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Cargando expediente académico...</div>;
  }

  const { jobReadiness } = student;

  const handleSimulatePassCourse = () => {
    recordLessonCompletion('sap-b1-core', 'l7');
    recordLessonCompletion('sap-b1-core', 'l8');
    recordExamResult(
      'sap-b1-core', 
      'quiz-b1-final', 
      'SAP Business One Core & Finanzas NIIF', 
      95, 
      'Excelente desempeño en asientos OJDT, parametrización de cuentas puente y configuración DTW.'
    );
    const updated = getStudentProfile();
    if (userProfile) {
      updated.displayName = userProfile.name || userProfile.displayName || 'Pablo F. García';
      updated.email = userProfile.email || 'pablofgarciaf@gmail.com';
      updated.studentId = userProfile.cedula || '1721790721';
    }
    setStudent({ ...updated });
  };

  const isSuperUser = userProfile?.role === 'super' || userProfile?.role === 'admin' || student.email === 'pablofgarciaf@gmail.com';

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header del Estudiante con Matrícula Oficial */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sap-blue to-sky-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
            {student.displayName.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                {student.displayName}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                isSuperUser 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                  : 'bg-sap-blue/10 text-sap-blue'
              }`}>
                {isSuperUser ? 'Superadmin & Consultor' : 'Consultor Premium'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Cédula / Matrícula: <strong>{student.studentId}</strong> • Correo: <strong>{student.email}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {isSuperUser && (
            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all active:scale-95 shadow-sm flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Consola Admin</span>
            </Link>
          )}
          <Link
            href="/dashboard/calificaciones"
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:border-sap-blue text-xs font-semibold transition-all active:scale-95 text-slate-700 dark:text-slate-200"
          >
            Boletín de Calificaciones
          </Link>
          <Link
            href="/bolsa-empleo"
            className="px-4 py-2 rounded-xl bg-sap-blue hover:bg-sky-600 text-white text-xs font-bold transition-all active:scale-95 shadow-sm"
          >
            Ir a Bolsa de Empleo
          </Link>
        </div>
      </div>

      {/* SEMÁFORO DE ELEGIBILIDAD LABORAL (JOB READINESS ENGINE) */}
      <div className={`p-6 sm:p-8 rounded-3xl border transition-all shadow-lg ${
        jobReadiness.isEligibleForJobs
          ? 'border-emerald-500/50 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent'
          : 'border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {jobReadiness.isEligibleForJobs ? (
                <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
              )}
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {jobReadiness.isEligibleForJobs 
                  ? '¡Perfil Habilitado para la Bolsa de Empleo Corporativa!' 
                  : 'Estado Académico: En Proceso de Certificación'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {jobReadiness.isEligibleForJobs 
                ? 'Has alcanzado los estándares universitarios requeridos. Las empresas afiliadas pueden ver tu perfil verificado y puedes postularte a vacantes en 1 clic.'
                : 'Para proteger el estándar fiduciario de la academia, solo los estudiantes con >=80% de avance y promedio sobresaliente pueden postular a empleos corporativos.'}
            </p>

            {!jobReadiness.isEligibleForJobs && jobReadiness.missingRequirements.length > 0 && (
              <div className="pt-2 space-y-1">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Requisitos pendientes para desbloquear:</p>
                {jobReadiness.missingRequirements.map((req, i) => (
                  <p key={i} className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    • {req}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 bg-white/70 dark:bg-white/[0.04] p-4 rounded-2xl border border-slate-200 dark:border-white/10 shrink-0">
            <div className="text-center px-3">
              <p className="text-2xl font-bold text-slate-900 dark:text-white font-display">
                {jobReadiness.overallProgressPercent}%
              </p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Avance Global</p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
            <div className="text-center px-3">
              <p className="text-2xl font-bold text-emerald-500 font-display">
                {jobReadiness.averageGrade}%
              </p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Nota Promedio</p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
            <div className="text-center px-3">
              <p className="text-2xl font-bold text-sap-blue font-display">
                {student.sandboxHoursUsed}h
              </p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Sandbox SAP</p>
            </div>
          </div>
        </div>

        {/* Botón interactivo para simular completar los requisitos si el usuario desea probarlo */}
        {!jobReadiness.isEligibleForJobs && (
          <div className="mt-4 pt-4 border-t border-amber-500/20 flex justify-end">
            <button
              onClick={handleSimulatePassCourse}
              className="text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1.5 cursor-pointer bg-amber-500/10 px-3.5 py-1.5 rounded-xl border border-amber-500/30 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" /> [Simulador] Aprobar SAP B1 Core y Desbloquear Bolsa de Empleo
            </button>
          </div>
        )}
      </div>

      {/* CURSOS EN CURSO Y PROGRESO GRANULAR */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
              Mis Tracks de Formación Oficial
            </h2>
            <p className="text-xs text-slate-500">
              Ecosistema Heinsohn Ecuador & SAP Business One • Formación Práctica con Simulación ERP
            </p>
          </div>
          <Link
            href="/capacitacion"
            className="text-xs font-bold text-sap-blue hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            Explorar Catálogo Completo <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(student.progress).map((course) => (
            <div
              key={course.courseId}
              className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] flex flex-col justify-between space-y-4 shadow-sm hover:border-sap-blue/40 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-sap-blue px-2.5 py-0.5 rounded bg-sap-blue/10">
                    {course.courseId.toUpperCase()}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    course.percent === 100 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {course.percent}% Completado
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-sap-blue transition-colors">
                  {course.courseTitle}
                </h3>
                <p className="text-xs text-slate-500">
                  {course.completedLessons.length} de {course.totalLessons} lecciones aprobadas
                </p>

                {/* Barra de progreso */}
                <div className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      course.percent === 100 ? 'bg-emerald-500' : 'bg-sap-blue'
                    }`}
                    style={{ width: `${course.percent}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
                <Link
                  href={`/capacitacion/${course.courseId}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-sap-blue hover:bg-sky-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {course.percent === 0 ? 'Comenzar Track' : 'Entrar al Aula Virtual'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
