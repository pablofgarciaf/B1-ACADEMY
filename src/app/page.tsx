import React from 'react';
import Link from 'next/link';
import { 
  Server, 
  ShieldCheck, 
  Briefcase, 
  Users, 
  Award, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  BookOpen,
  GraduationCap,
  ChevronRight,
  TrendingUp,
  FileCheck,
  CheckCircle
} from 'lucide-react';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { TRAINING_TRACKS } from '@/lib/courses-data';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a] selection:bg-sap-blue selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION DE LA ESCUELA */}
        <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-sap-blue/20 via-sky-500/15 to-transparent blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* GEO Capsule */}
            <aside
              aria-label="Cápsula GEO para Buscadores y Motores de IA"
              className="p-4 sm:p-5 rounded-2xl border border-sky-500/30 bg-sky-50/70 dark:bg-sky-950/20 backdrop-blur-md"
            >
              <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <Sparkles className="w-5 h-5 text-sap-blue dark:text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white font-semibold">
                    Escuela Oficial de Capacitación Tecnológica y Consultoría:
                  </strong>{' '}
                  Especialización integral en el ecosistema <strong>Heinsohn Ecuador y SAP Business One</strong>.
                  Formación dividida en <strong>5 grandes tracks</strong> (SAP B1 Core NIIF, Localización SRI, Heinsohn Nómina IESS/MDT, Gestión Humana Nine-Box y Verticales de Exportación Banano/Camarón/Beas).
                  Con simulador de prácticas sandbox, evaluaciones automatizadas, expedientes de calificaciones y acceso directo a bolsa de empleo para perfiles Job-Ready.
                </div>
              </div>
            </aside>

            {/* Main Header */}
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sap-blue/30 bg-sap-blue/5 text-xs font-bold text-sap-blue dark:text-sky-300">
                <span className="w-2 h-2 rounded-full bg-sap-blue animate-pulse" />
                Academia Tecnológica B2B / B2C • Ecosistema Heinsohn & SAP B1
              </div>

              {/* H1 Exacto (45-65 chars) -> 53 caracteres */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
                Escuela de Capacitación en SAP B1 y Heinsohn Ecuador
              </h1>

              <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
                Aprende con la arquitectura de conocimiento real de las empresas ecuatorianas. 
                Domina transacciones operativas, parametrización tributaria SRI, nómina laboral IESS y la gestión vertical agroexportadora.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  href="/capacitacion"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sap-blue to-sky-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-sap-blue/25 hover:shadow-sap-blue/40 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-5 h-5" />
                  Explorar los 5 Tracks Formativos
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/[0.04] text-slate-800 dark:text-white font-semibold text-sm sm:text-base hover:border-sap-blue/50 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <GraduationCap className="w-5 h-5 text-sap-blue" />
                  Ingresar a Mi Aula Virtual
                </Link>
              </div>

              {/* Stats E-E-A-T */}
              <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-t border-slate-200 dark:border-white/[0.08]">
                <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 shadow-sm">
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">5</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Grandes Tracks</p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 shadow-sm">
                  <p className="text-2xl sm:text-3xl font-extrabold text-sap-blue dark:text-sky-400 font-display">32</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Submódulos Técnicos</p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 shadow-sm">
                  <p className="text-2xl sm:text-3xl font-extrabold text-emerald-500 font-display">259h</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Horas de Formación</p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 shadow-sm">
                  <p className="text-2xl sm:text-3xl font-extrabold text-amber-500 font-display">Job-Ready</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Conexión con Empresas</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN PRINCIPAL: LOS 5 GRANDES TRACKS FORMATIVOS */}
        <section id="tracks" className="py-20 bg-slate-100/70 dark:bg-white/[0.01] border-y border-slate-200 dark:border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-sap-blue dark:text-sky-400 font-bold">
                Estructura Curricular
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
                Los 5 Pilares del Ecosistema Heinsohn Ecuador
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                Cada track contiene submódulos con enfoque <strong>[OP] Operativo</strong> para usuarios transaccionales y <strong>[ARQ] Arquitectura</strong> para consultores implementadores.
              </p>
            </div>

            {/* Grid de los 5 tracks */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {TRAINING_TRACKS.map((track, index) => {
                const isLarge = index === 0 || index === 1;
                return (
                  <div
                    key={track.id}
                    className={`rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-7 sm:p-8 flex flex-col justify-between hover:border-sap-blue/40 hover:shadow-lg transition-all group ${
                      index === 4 ? 'md:col-span-2 lg:col-span-1' : ''
                    }`}
                  >
                    <div className="space-y-5">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-sap-blue/10 text-sap-blue">
                          Track 0{index + 1}
                        </span>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                          {track.badge}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-sap-blue transition-colors font-display">
                          {track.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                          {track.totalDurationHours} Horas Lectivas • {track.submodulesCount} Submódulos Especializados
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {track.description}
                      </p>

                      <div className="space-y-2 border-t border-slate-100 dark:border-white/5 pt-4">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Temas Clave:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {track.submodules.slice(0, 3).map((sub, i) => (
                            <span key={i} className="text-[11px] px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-white/5">
                              {sub.title.split(':')[0]}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <span className="text-xs text-slate-500 italic">
                        {track.targetAudience.split(',')[0]}
                      </span>
                      <Link
                        href={`/capacitacion/${track.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-sap-blue hover:text-sky-500 transition-colors"
                      >
                        Ver Módulos <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center pt-4">
              <Link
                href="/capacitacion"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sap-blue text-white text-xs font-bold shadow-md shadow-sap-blue/20 hover:bg-sky-600 transition-all active:scale-95 cursor-pointer"
              >
                Ver Programa Curricular Completo con los 32 Módulos
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* METODOLOGÍA: APRENDER HACIENDO (ESTILO EDX / APRENDE.ORG) */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-sap-blue dark:text-sky-400 font-bold">
                Metodología Certificada
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
                Modelo de Formación Riguroso y Empleable
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                Inspirado en los mejores modelos pedagógicos universitarios y de acreditación empresarial.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-sap-blue flex items-center justify-center font-bold">
                  01
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Clases Guiadas & Base de Conocimiento
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Lecciones estructuradas por expertos con acceso a la documentación técnica, guías de parametrización y casos de estudio reales.
                </p>
              </div>

              <div className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                  02
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Prácticas en Sandbox con Horas Contabilizadas
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Ambiente de pruebas real para ejecutar transacciones en SAP B1, parametrizar tablas SRI y procesar planillas en Heinsohn Nómina.
                </p>
              </div>

              <div className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                  03
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Acreditación & Bolsa Job-Ready
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Al alcanzar ≥80% de avance, ≥80% en exámenes y ≥15h de sandbox, el sistema activa automáticamente tu postulación ante empresas contratantes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
