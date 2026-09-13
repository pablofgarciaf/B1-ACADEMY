"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, MapPin, ShieldCheck, Lock, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { getStudentProfile } from '@/lib/student-service';
import { StudentProfile } from '@/types/student';
import { JobApplicationModal } from '@/components/ecosystem/JobApplicationModal';

const sampleJobs = [
  {
    id: 'job-01',
    title: 'Consultor SAP FICO Senior (S/4HANA)',
    company: 'EnergyEngine S.L.',
    location: 'Madrid / Remoto',
    salary: '55k - 70k €',
    type: 'Full-Time Remoto',
    desc: 'Liderazgo técnico en parametrización de libro mayor universal (ACDOCA) y consolidación de balances multinacionales.',
    requiredSpecialty: 'FICO',
  },
  {
    id: 'job-02',
    title: 'Líder Funcional SAP MM & Aprovisionamiento',
    company: 'Nexo Talento Corp',
    location: 'Barcelona / Híbrido',
    salary: '48k - 58k €',
    type: 'Híbrido',
    desc: 'Gestión de compras estratégicas corporativas, valoración de existencias e integración con centros logísticos.',
    requiredSpecialty: 'MM',
  },
  {
    id: 'job-03',
    title: 'Arquitecto de Integración SAP BTP & n8n',
    company: 'Vermilion Routes Tech',
    location: '100% Remoto (España & Latam)',
    salary: '65k - 80k €',
    type: 'Remoto Global',
    desc: 'Diseño de extensiones Clean Core, flujos automatizados con n8n y microservicios conectados a SAP S/4HANA Cloud.',
    requiredSpecialty: 'BTP',
  },
];

export default function BolsaEmpleoPage() {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [selectedJob, setSelectedJob] = useState<{ title: string; company: string } | null>(null);

  useEffect(() => {
    setStudent(getStudentProfile());
  }, []);

  const isEligible = student?.jobReadiness.isEligibleForJobs || false;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Banner de estatus de elegibilidad del estudiante */}
      <div className={`p-6 rounded-3xl border transition-all ${
        isEligible
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
          : 'border-amber-500/40 bg-amber-500/10 text-amber-300'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {isEligible ? (
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            ) : (
              <Lock className="w-6 h-6 text-amber-400 shrink-0" />
            )}
            <div>
              <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                {isEligible
                  ? '✅ Tu perfil cumple los requisitos para postular a vacantes'
                  : '🔒 Acceso Restringido a Postulaciones Laborales'}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {isEligible
                  ? 'Tus horas de sandbox y notas han sido validadas. Las empresas recibirán tu hash criptográfico de certificación.'
                  : 'Debes alcanzar >=80% de avance académico y nota promedio >=80% para desbloquear las postulaciones.'}
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-white dark:bg-white/10 text-slate-900 dark:text-white text-xs font-bold hover:bg-slate-100 transition-all text-center shrink-0"
          >
            Ver Mi Progreso en el Aula
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-sap-blue font-bold">
            Ecosistema de Contratación
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display mt-2">
            Bolsa de Empleo y Vacantes Exclusivas SAP
          </h1>
        </div>

        <Link
          href="/talento"
          className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-1"
        >
          <Sparkles className="w-4 h-4" /> Portal de Empresas: Ver Graduados Job-Ready →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sampleJobs.map((job) => (
          <article
            key={job.id}
            className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] flex flex-col justify-between space-y-4 shadow-sm hover:border-sap-blue/40 transition-all"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-sap-blue px-2.5 py-1 rounded bg-sap-blue/10">
                  {job.type}
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {job.salary}
                </span>
              </div>

              <h2 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                {job.title}
              </h2>

              <p className="text-xs text-slate-500">
                Empresa: <strong>{job.company}</strong> • {job.location}
              </p>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {job.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/5">
              {isEligible ? (
                <button
                  onClick={() => setSelectedJob({ title: job.title, company: job.company })}
                  className="w-full py-2.5 px-4 rounded-xl bg-sap-blue hover:bg-sky-600 text-white font-bold text-xs transition-all active:scale-95 cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Briefcase className="w-3.5 h-3.5" /> Postularme con Mi Certificado
                </button>
              ) : (
                <Link
                  href="/dashboard"
                  className="w-full py-2.5 px-4 rounded-xl border border-amber-500/30 text-amber-500 hover:bg-amber-500/10 font-bold text-xs transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" /> Bloqueado (Ver requisitos en Mi Aula)
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>

      {selectedJob && (
        <JobApplicationModal
          jobTitle={selectedJob.title}
          companyName={selectedJob.company}
          isOpen={true}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
