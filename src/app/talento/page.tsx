"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, ShieldCheck, CheckCircle2, Award, Clock, ArrowRight, UserCheck } from 'lucide-react';
import { getEligibleJobCandidates } from '@/lib/student-service';
import { StudentProfile } from '@/types/student';

export default function TalentoCertificadoPage() {
  const [candidates, setCandidates] = useState<StudentProfile[]>([]);

  useEffect(() => {
    setCandidates(getEligibleJobCandidates());
  }, []);

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <aside aria-label="Portal de Reclutamiento" className="mb-6 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
        <strong>Filtro Fiduciario para Empresas:</strong> Solo se listan los graduados que han superado el 100% de las auditorías de sandbox y cuentan con evaluación media &gt;= 80%.
      </aside>

      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
          Directorio de Graduados Certificados y Job-Ready
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base">
          Accede al perfil técnico auditado de consultores listos para incorporarse a proyectos SAP S/4HANA.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {candidates.map((cand) => (
          <article
            key={cand.uid}
            className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-4 shadow-sm hover:border-emerald-500/40 transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-lg">
                  {cand.displayName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                    {cand.displayName}
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </h2>
                  <p className="text-xs text-slate-500 font-mono">ID: {cand.studentId}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500">
                Job-Ready
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] text-center">
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white font-display">
                  {cand.jobReadiness.averageGrade}%
                </p>
                <p className="text-[10px] text-slate-500">Promedio</p>
              </div>
              <div>
                <p className="text-lg font-bold text-sap-blue font-display">
                  {cand.sandboxHoursUsed}h
                </p>
                <p className="text-[10px] text-slate-500">Sandbox SAP</p>
              </div>
              <div>
                <p className="text-lg font-bold text-amber-500 font-display">
                  {cand.certifications.length}
                </p>
                <p className="text-[10px] text-slate-500">Certificaciones</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Especialidades Auditadas:</p>
              <div className="flex gap-2">
                {cand.specialties.map((s) => (
                  <span key={s} className="text-xs font-mono px-2 py-0.5 rounded bg-sap-blue/10 text-sap-blue font-bold">
                    SAP {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
              <span className="text-xs text-slate-500">Disponible para contratación inmediata</span>
              <button className="px-4 py-1.5 rounded-xl bg-sap-blue text-white text-xs font-bold hover:bg-sky-600 transition-all active:scale-95 cursor-pointer">
                Contactar Consultor
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
