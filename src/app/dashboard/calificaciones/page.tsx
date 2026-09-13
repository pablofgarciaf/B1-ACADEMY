"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Award, CheckCircle2, FileCheck, Shield } from 'lucide-react';
import { getStudentProfile } from '@/lib/student-service';
import { StudentProfile } from '@/types/student';

export default function CalificacionesPage() {
  const [student, setStudent] = useState<StudentProfile | null>(null);

  useEffect(() => {
    setStudent(getStudentProfile());
  }, []);

  if (!student) return <div className="p-8">Cargando expediente...</div>;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-sap-blue hover:underline">
          <ArrowLeft className="w-4 h-4" /> Volver a Mi Aula
        </Link>
        <div className="text-xs text-slate-500 font-mono">
          Expediente: <strong>{student.displayName}</strong> • CI: <strong>{student.studentId}</strong>
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          Boletín Oficial de Calificaciones y Evaluaciones
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Registro inmutable de evaluaciones técnicas y proyectos de parametrización en SAP Business One y Ecosistema Heinsohn Ecuador.
        </p>
      </div>

      {/* Tabla de Evaluaciones */}
      <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
          <h2 className="font-bold text-base text-slate-900 dark:text-white">
            Historial de Intentos y Exámenes
          </h2>
          <span className="text-xs font-semibold text-emerald-500 font-mono">
            {student.grades.length > 0 
              ? `Nota Media: ${student.jobReadiness.averageGrade}%` 
              : 'Sin evaluaciones rendidas'}
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/5">
          {student.grades.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Aún no has rendido exámenes en tu expediente académico.
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Ingresa a cualquiera de las aulas virtuales y completa las pruebas de certificación para registrar tus notas oficiales.
              </p>
              <div className="pt-3">
                <Link
                  href="/capacitacion"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sap-blue hover:bg-sky-600 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
                >
                  Explorar Especialidades
                </Link>
              </div>
            </div>
          ) : (
            student.grades.map((grade) => (
              <div key={grade.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sap-blue px-2 py-0.5 rounded bg-sap-blue/10">
                      {grade.courseId}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {grade.courseTitle}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Fecha: {grade.date} • Intento #{grade.attemptNumber}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic pt-1">
                    &ldquo;{grade.feedback}&rdquo;
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0">
                  <span className={`text-2xl font-extrabold font-display ${
                    grade.score >= 80 ? 'text-emerald-500' : 'text-amber-500'
                  }`}>
                    {grade.score}%
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    grade.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {grade.passed ? 'Aprobado Oficial' : 'Reprobado'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Certificados Emitidos */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
          Acreditaciones y Certificados con Hash Criptográfico
        </h2>

        {student.certifications.length === 0 ? (
          <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-center text-xs text-slate-500">
            No tienes certificados emitidos aún. Aprueba los exámenes finales de cada track con al menos el 80% para obtener tus diplomas verificados.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {student.certifications.map((cert) => (
              <div key={cert.id} className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{cert.title}</h3>
                </div>
                <p className="text-xs text-slate-500 font-mono">ID: {cert.id}</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono break-all">
                  Hash: {cert.verificationHash}
                </p>
                <p className="text-[11px] text-slate-400 pt-1">Emitido el: {cert.issuedDate}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
