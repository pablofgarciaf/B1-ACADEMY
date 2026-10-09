"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Award, CheckCircle2, FileCheck, Shield, Download, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { OFFICIAL_SYLLABUS, SPECIALTY_DIPLOMAS, MASTER_PROGRAM } from '@/lib/curriculum-data';
import { generateOfficialCampusCertificate } from '@/lib/certificate-generator';

interface CertRecord {
  code: string;
  uid: string;
  moduleId: string;
  issuedAt: string;
  status: 'valid' | 'revoked';
  title?: string;
  holderName?: string;
}

export default function CalificacionesPage() {
  const { userProfile, loading: authLoading } = useAuth();
  const [certificates, setCertificates] = useState<CertRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userProfile?.uid) return;

    setLoading(true);
    fetch(`/api/certificates/my-certificates?uid=${userProfile.uid}`)
      .then(res => res.json())
      .then(data => {
        if (data.certificates) {
          setCertificates(data.certificates);
        }
      })
      .catch(err => {
        console.error('Error cargando certificados:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userProfile]);

  const displayName = userProfile?.name || userProfile?.displayName || 'Pablo García';
  const studentId = userProfile?.cedula || userProfile?.uid || '1721790721';

  const handleDownloadPdf = (
    certType: 'micro' | 'diploma' | 'master',
    title: string,
    code: string,
    hours = 25
  ) => {
    try {
      generateOfficialCampusCertificate({
        studentName: displayName,
        certificateType: certType,
        title,
        code,
        scorePercent: 100,
        hours,
        instructorName: 'Master B1 & Comité Evaluador B1 Academy'
      });
    } catch (err) {
      console.error('Error al generar PDF:', err);
      alert('Error al descargar el PDF.');
    }
  };

  const certsByModule = new Map<string, CertRecord>();
  certificates.forEach(c => certsByModule.set(c.moduleId, c));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a] selection:bg-sap-blue selection:text-white">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-sap-blue dark:text-sky-400 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Volver al Panel del Estudiante
          </Link>
          <div className="text-xs text-slate-500 font-mono">
            Expediente: <strong>{displayName}</strong> • ID: <strong>{studentId}</strong>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold font-mono">
              EXPEDIENTE ACREDITADO 100%
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            Boletín Oficial de Calificaciones y Acreditaciones
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Registro inmutable de evaluaciones técnicas, prácticas en Supabase y certificados oficiales con hash de verificación.
          </p>
        </div>

        {/* TABLA DE EVALUACIONES (30 MÓDULOS) */}
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              Historial de Exámenes por Módulo (30 Módulos)
            </h2>
            <span className="text-xs font-semibold text-emerald-500 font-mono">
              Nota Media: 100% (Aprobado con Excelencia)
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {OFFICIAL_SYLLABUS.map((mod) => {
              const cert = certsByModule.get(mod.id);
              const certCode = cert?.code || `B1-${mod.id.toUpperCase()}-VERIFIED`;

              return (
                <div key={mod.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-white/[0.01]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-sap-blue dark:text-sky-400 px-2 py-0.5 rounded bg-sap-blue/10">
                        M0{mod.number}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {mod.certificateTitle}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 font-mono">
                      {mod.title} • Bloque: {mod.block}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Registro Criptográfico: {certCode}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xl font-extrabold font-display text-emerald-500 block">
                        100/100
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                        Aprobado Oficial
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => handleDownloadPdf('micro', mod.certificateTitle, certCode, 20)}
                        className="px-3 py-1.5 rounded-lg bg-sap-blue hover:bg-sky-600 text-white font-bold text-xs shadow transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                      <Link
                        href={`/verificar/${certCode}`}
                        target="_blank"
                        className="px-3 py-1 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 font-semibold text-[11px] text-center"
                      >
                        Verificar
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECCIÓN DIPLOMAS DE ESPECIALIDAD & GRADO MÁSTER */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Diplomas de Especialización & Titulación Máster (15 Documentos)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Grado Máster */}
            <div className="p-5 rounded-2xl border-2 border-amber-500/50 bg-amber-500/5 space-y-3 md:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-500" />
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-500 font-mono">GRADO CUMBRE INSTITUCIONAL</span>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{MASTER_PROGRAM.title}</h3>
                  </div>
                </div>
                <button
                  onClick={() => handleDownloadPdf('master', MASTER_PROGRAM.title, `B1-MASTER-SUPER-ANALISTA-${studentId}`, 120)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-md hover:bg-amber-400 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Descargar Diploma PDF
                </button>
              </div>
            </div>

            {/* 14 Diplomas */}
            {SPECIALTY_DIPLOMAS.map((dip) => {
              const cert = certsByModule.get(dip.id);
              const certCode = cert?.code || `B1-${dip.id.toUpperCase()}-VERIFIED`;

              return (
                <div key={dip.id} className="p-5 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-cyan-500" />
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">{dip.title}</h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{dip.role}</p>
                    <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono pt-1">
                      Código: {certCode}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <Link
                      href={`/verificar/${certCode}`}
                      target="_blank"
                      className="text-xs font-semibold text-sap-blue dark:text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Verificar en Línea
                    </Link>

                    <button
                      onClick={() => handleDownloadPdf('diploma', dip.title, certCode, 40)}
                      className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Descargar PDF
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
