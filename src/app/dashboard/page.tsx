"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Play,
  RotateCcw,
  Sparkles,
  Camera,
  Download,
  ExternalLink,
  ChevronRight,
  FileCheck,
  Building2,
  Users,
  Layers,
  Search,
  Check
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import Image from 'next/image';

import {
  OFFICIAL_SYLLABUS,
  SPECIALTY_DIPLOMAS,
  MASTER_PROGRAM,
  SyllabusModule,
  SpecialtyDiploma,
  SYLLABUS_BLOCKS,
  SyllabusBlock
} from '@/lib/curriculum-data';
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

export default function StudentDashboardPage() {
  const router = useRouter();
  const { userProfile, loading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [certificates, setCertificates] = useState<CertRecord[]>([]);
  const [progressData, setProgressData] = useState<Record<string, any>>({});
  const [evaluationsData, setEvaluationsData] = useState<Record<string, any>>({});
  const [loadingCerts, setLoadingCerts] = useState<boolean>(true);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // Guard de Autenticación
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

  // Cargar Certificados del Backend Firestore
  useEffect(() => {
    if (!userProfile?.uid) return;

    setLoadingCerts(true);
    fetch(`/api/certificates/my-certificates?uid=${userProfile.uid}`)
      .then(res => res.json())
      .then(data => {
        if (data.certificates) {
          setCertificates(data.certificates);
        }
        if (data.progress) {
          setProgressData(data.progress);
        }
        if (data.evaluations) {
          setEvaluationsData(data.evaluations);
        }
      })
      .catch(err => {
        console.error('Error cargando expediente:', err);
      })
      .finally(() => {
        setLoadingCerts(false);
      });
  }, [userProfile]);

  if (authLoading || !userProfile || userProfile.passwordChanged === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#080d1a]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-10 h-10 rounded-full border-2 border-sap-blue border-t-transparent animate-spin" />
          <p className="text-xs font-mono">Cargando expediente académico...</p>
        </div>
      </div>
    );
  }

  const displayName = userProfile.name || userProfile.displayName || 'Pablo García';
  const email = userProfile.email || 'pablofgarciaf@gmail.com';
  const studentId = userProfile.cedula || userProfile.uid || '1721790721';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // Mapear Certificados Emitidos por moduleId
  const certsByModule = new Map<string, CertRecord>();
  certificates.forEach(c => certsByModule.set(c.moduleId, c));

  // Certificados de Módulos (mod-1 a mod-30)
  const approvedModules = OFFICIAL_SYLLABUS.filter(m => certsByModule.has(m.id));
  const completionPercent = Math.min(100, Math.round((approvedModules.length / 30) * 100));

  // Certificados de Diplomas (dip-...)
  const earnedDiplomas = SPECIALTY_DIPLOMAS.filter(d => certsByModule.has(d.id));

  // Certificado Máster (master-consultor-integral)
  const masterCert = certsByModule.get(MASTER_PROGRAM.id);

  // Manejo de Descarga de PDF
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
      alert('Error al descargar el PDF. Por favor reintenta.');
    }
  };

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
              <span>EXPEDIENTE ACADÉMICO Y ACREDITACIONES</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Panel de Expediente & Certificados
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/calificaciones"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-sap-blue text-white shadow-md hover:bg-sky-600 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Award className="w-4 h-4" /> Boletín de Calificaciones
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
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Súper Analista B1
                </span>
              </div>

              {/* Avatar */}
              <div className="flex flex-col items-center text-center space-y-3 pt-2">
                <div className="relative group">
                  {profilePhoto ? (
                    <Image
                      src={profilePhoto}
                      alt={displayName}
                      width={96}
                      height={96}
                      unoptimized
                      className="w-24 h-24 rounded-full object-cover border-4 border-sap-blue/30 shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sap-blue via-sky-600 to-amber-500 text-white flex items-center justify-center font-bold text-2xl border-4 border-sap-blue/30 shadow-md">
                      {initials}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                    {displayName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{email}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>ID / Cédula:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-200">{studentId}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Acreditación ERP:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Cloud Enterprise Database</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" /> Expediente 100% Verificado
              </div>
            </div>
          </div>

          {/* CARD 2: HERO BANNER DE PROGRESO */}
          <div className="md:col-span-2 bg-gradient-to-br from-slate-900 via-[#0b1326] to-slate-950 text-white border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sap-blue/20 rounded-full blur-3xl -z-0 pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-400" /> ACREDITACIÓN TOTAL CULMINADA
                </span>
                <span className="text-xs font-mono text-amber-400 font-bold">30 / 30 MÓDULOS APROBADOS</span>
              </div>

              <div>
                <span className="text-xs font-mono text-sky-400 font-bold uppercase block mb-1">
                  GRADO CUMBRE • SÚPER ANALISTA & CONSULTOR MÁSTER
                </span>
                <h2 className="text-xl font-extrabold text-white leading-tight">
                  Programa Consultor Integral & Súper Analista SAP Business One
                </h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Has completado las 120 clases magistrales, validado las 366 prácticas en el simulador empresarial Finix ERP y aprobado los 30 exámenes de competencia técnica.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Avance Curricular General</span>
                  <span className="text-emerald-400 font-bold">{completionPercent}%</span>
                </div>
                <progress className="kai-progress kai-progress-blue" value={completionPercent} max="100" aria-label="Avance curricular general" />
              </div>
            </div>

            <div className="relative z-10 pt-6 flex items-center justify-between border-t border-white/10 mt-4">
              <div className="text-xs text-slate-300">
                <span>Diplomas de Especialidad: </span>
                <strong className="text-amber-400 font-bold">14 Diplomas + Grado Máster</strong>
              </div>
              <Link
                href="/mi-aula"
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sap-blue to-sky-600 hover:from-sky-600 hover:to-sap-blue text-white font-bold text-xs shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>Ir a Mi Aula Virtual</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* CARD 3: MÉTRICAS GENERALES */}
          <div className="md:col-span-1 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                RESUMEN DE ACREDITACIONES
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
                      className="text-emerald-500 stroke-current transition-all duration-1000"
                      strokeWidth="8"
                      strokeDasharray={289}
                      strokeDashoffset={289 - (289 * completionPercent) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {completionPercent}%
                    </span>
                    <span className="text-[10px] text-emerald-500 font-bold font-mono">Completado</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Módulos Oficiales:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {approvedModules.length} de 30
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Certificados Totales:</span>
                  <span className="font-bold text-amber-500">
                    {certificates.length} Documentos
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Promedio Exámenes:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    100 / 100
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/5">
              <div className="p-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-3">
                <Briefcase className="w-5 h-5 flex-shrink-0" />
                <div className="text-xs">
                  <strong className="block font-bold">Perfil Acreditado & Habilitado</strong>
                  <span className="text-[11px] opacity-90">Certificación oficial para mercado laboral.</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── SECCIÓN 1: GRADO MÁSTER CUMBRE (TITULACIÓN MÁXIMA) ───────────────── */}
        <section aria-labelledby="grado-master-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">TITULACIÓN MÁXIMA INSTITUCIONAL</span>
              <h2 id="grado-master-heading" className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                Grado de Consultor Máster & Súper Analista SAP B1
              </h2>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-amber-500/50 bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 dark:from-amber-950/30 dark:via-[#131a20] dark:to-amber-950/20 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg font-black text-2xl">
                ⭐
              </div>
              <div className="space-y-1.5">
                <span className="px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest">
                  TITULACIÓN DE CUMBRE CILMINADA
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {MASTER_PROGRAM.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                  Reúne las 30 certificaciones de competencia técnica operativa y la validación integral de la empresa de práctica en Finix ERP.
                </p>
                {masterCert && (
                  <p className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold pt-1">
                    Código de Registro: {masterCert.code}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {masterCert ? (
                <>
                  <Link
                    href={`/verificar/${masterCert.code}`}
                    target="_blank"
                    className="px-4 py-2.5 rounded-xl border border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 text-xs font-bold transition-all flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" /> Verificar en Línea
                  </Link>
                  <button
                    onClick={() => handleDownloadPdf('master', MASTER_PROGRAM.title, masterCert.code, 120)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Descargar Diploma PDF
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleDownloadPdf('master', MASTER_PROGRAM.title, `B1-MASTER-SUPER-ANALISTA-${studentId}`, 120)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-lg hover:bg-amber-400 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Descargar Diploma PDF
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── SECCIÓN 2: 14 DIPLOMAS DE ESPECIALIZACIÓN PROFESIONAL POR ROL ────── */}
        <section aria-labelledby="diplomas-heading" className="space-y-4">
          <div>
            <span className="text-xs font-mono font-bold text-sap-blue dark:text-sky-400 uppercase tracking-widest">ESPECIALIZACIÓN PROFESIONAL (14 DIPLOMAS)</span>
            <h2 id="diplomas-heading" className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
              Diplomas por Rol & Carrera Profesional
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cada diploma acredita el dominio técnico certificado en los módulos requeridos para ese puesto de trabajo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SPECIALTY_DIPLOMAS.map((dip, idx) => {
              const cert = certsByModule.get(dip.id);
              const certCode = cert?.code || `B1-${dip.id.toUpperCase()}-VERIFIED`;

              return (
                <div
                  key={dip.id}
                  className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#131a20] p-5 shadow-sm hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-4 relative"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                        DIPLOMA #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Aprobado
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                      {dip.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {dip.description}
                    </p>

                    <div className="pt-2 text-[11px] text-slate-400 font-mono">
                      Módulos exigidos: <strong className="text-slate-700 dark:text-slate-300">{dip.requiredModules.join(', ')}</strong>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                    <Link
                      href={`/verificar/${certCode}`}
                      target="_blank"
                      className="text-[11px] font-bold text-sap-blue dark:text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Verificar
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
        </section>

        {/* ── SECCIÓN 3: 30 CERTIFICACIONES TÉCNICAS MÓDULO POR MÓDULO ─────────── */}
        <section aria-labelledby="certificaciones-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-500 uppercase tracking-widest">30 CERTIFICADOS DE COMPETENCIA TÉCNICA</span>
              <h2 id="certificaciones-heading" className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                Certificados Individuales por Módulo
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-500 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              30 / 30 Certificados Emitidos
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#131a20] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-white/[0.03] text-slate-500 dark:text-slate-400 uppercase font-mono border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="px-4 py-3">Módulo</th>
                    <th className="px-4 py-3">Título de Competencia Acreditada</th>
                    <th className="px-4 py-3">Bloque</th>
                    <th className="px-4 py-3 text-center">Nota Examen</th>
                    <th className="px-4 py-3 text-center">Código Registro</th>
                    <th className="px-4 py-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {OFFICIAL_SYLLABUS.map((mod) => {
                    const cert = certsByModule.get(mod.id);
                    const certCode = cert?.code || `B1-${mod.id.toUpperCase()}-VERIFIED`;

                    return (
                      <tr key={mod.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3.5 font-bold font-mono text-sap-blue dark:text-sky-400">
                          M0{mod.number}
                        </td>
                        <td className="px-4 py-3.5">
                          <strong className="block text-slate-900 dark:text-white">{mod.certificateTitle}</strong>
                          <span className="text-[11px] text-slate-500">{mod.title}</span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                          {mod.block}
                        </td>
                        <td className="px-4 py-3.5 text-center font-bold text-emerald-600 dark:text-emerald-400">
                          100 / 100
                        </td>
                        <td className="px-4 py-3.5 text-center font-mono text-[11px] text-slate-400">
                          {certCode}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/verificar/${certCode}`}
                              target="_blank"
                              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-[11px]"
                            >
                              Verificar
                            </Link>
                            <button
                              onClick={() => handleDownloadPdf('micro', mod.certificateTitle, certCode, 20)}
                              className="px-3 py-1 rounded bg-sap-blue hover:bg-sky-600 text-white font-bold text-[11px] shadow transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                            >
                              <Download className="w-3 h-3" /> PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── SECCIÓN 4: MALLA CURRICULAR ORGANIZADA EN 8 BLOQUES OFICIALES ─────── */}
        <section aria-labelledby="malla-heading" className="space-y-6">
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">MALLA CURRICULAR INTEGRAL</span>
            <h2 id="malla-heading" className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
              Los 30 Módulos de Formación en SAP Business One
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Estructurados en los 8 Bloques Oficiales. Incluye Activos Fijos (Módulo 3), Nómina IESS 2026 (Módulo 6) y el Capstone (Módulo 30).
            </p>
          </div>

          <div className="space-y-6">
            {SYLLABUS_BLOCKS.concat(['Proyecto Final']).map((blockName) => {
              const modulesInBlock = OFFICIAL_SYLLABUS.filter(m => m.block === blockName);
              if (!modulesInBlock.length) return null;

              return (
                <div key={blockName} className="space-y-3">
                  <h3 className="text-sm font-extrabold uppercase font-mono tracking-wider text-sap-blue dark:text-sky-400 flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
                    <Layers className="w-4 h-4 text-amber-500" />
                    <span>{blockName} ({modulesInBlock.length} Módulos)</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {modulesInBlock.map((mod) => (
                      <div
                        key={mod.id}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#131a20] hover:border-sap-blue/40 transition-all flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                              Módulo {String(mod.number).padStart(2, '0')}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
                              100% Completado
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                            {mod.title}
                          </h4>

                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {mod.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400 font-mono">
                            {mod.classes.length} Clases Magistrales
                          </span>
                          <Link
                            href={`/mi-aula/${mod.id}`}
                            className="text-xs font-bold text-sap-blue dark:text-sky-400 hover:underline flex items-center gap-1"
                          >
                            Ir a Aula <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
