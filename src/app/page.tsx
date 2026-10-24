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
  Building2,
  Package,
  ShoppingCart,
  Factory,
  Landmark,
  Settings2,
  Compass,
  Wrench,
  Layers
} from 'lucide-react';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { 
  SPECIALTY_DIPLOMAS, 
  OFFICIAL_SYLLABUS, 
  SYLLABUS_BLOCKS, 
  MASTER_PROGRAM, 
  getModuleById, 
  moduleMinutes,
  type SyllabusBlock 
} from '@/lib/curriculum-data';

export const metadata = {
  title: 'Capacitación Práctica en SAP Business One | B1 Academy',
  description: 'Aprende procesos empresariales con clases guiadas, manuales y un simulador educativo. Rutas de formación individual y capacitación para equipos en Ecuador.',
};

const BLOCK_ICONS: Record<SyllabusBlock, typeof Building2> = {
  'Administración y Talento Humano': Building2,
  'Logística y Cadena de Suministro': Package,
  'Gestión Comercial y CRM': ShoppingCart,
  'Producción y Planificación': Factory,
  'Finanzas y Fiscalidad': Landmark,
  'Tecnología y Analítica': Settings2,
  'Consultoría y Business Analyst': Compass,
  'Proyecto Final': Award,
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a] selection:bg-finix-blue selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION DE LA ESCUELA */}
        <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-finix-blue/20 via-sky-500/15 to-transparent blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Main Header */}
            <div className="text-center max-w-4xl mx-auto space-y-6 py-4 sm:py-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-finix-blue/30 bg-finix-blue/5 text-xs font-bold text-finix-blue dark:text-sky-300">
                <span className="w-2 h-2 rounded-full bg-finix-blue animate-pulse" />
                Academia Tecnológica B2B / B2C • B1 Academy Ecuador
              </div>

              {/* H1 Exacto (45-65 chars) -> 53 caracteres */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
                Capacitación Práctica en SAP Business One
              </h1>

              <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
                Aprende procesos empresariales con clases guiadas y un laboratorio de práctica. Elige una ruta por función y avanza a tu ritmo.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  href="/capacitacion"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-finix-blue to-sky-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-finix-blue/25 hover:shadow-finix-blue/40 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-5 h-5" />
                  Explorar rutas de formación
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/mi-aula"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/[0.04] text-slate-800 dark:text-white font-semibold text-sm sm:text-base hover:border-finix-blue/50 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <GraduationCap className="w-5 h-5 text-finix-blue" />
                  Ingresar a Mi Aula Virtual
                </Link>
              </div>

              {/* Datos del programa */}
              <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-t border-slate-200 dark:border-white/[0.08]">
                <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 shadow-sm">
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">{SPECIALTY_DIPLOMAS.length}</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Diplomas de Especialidad</p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 shadow-sm">
                  <p className="text-2xl sm:text-3xl font-extrabold text-finix-blue dark:text-sky-400 font-display">{OFFICIAL_SYLLABUS.length}</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Módulos de estudio</p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 shadow-sm">
                  <p className="text-2xl sm:text-3xl font-extrabold text-emerald-500 font-display">{OFFICIAL_SYLLABUS.reduce((total, module) => total + module.classes.length, 0)}</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Clases guiadas</p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 shadow-sm">
                  <p className="text-2xl sm:text-3xl font-extrabold text-amber-500 font-display">{new Set(OFFICIAL_SYLLABUS.map(module => module.block)).size}</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Áreas temáticas</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN PRINCIPAL: LOS 14 DIPLOMAS DE ESPECIALIDAD */}
        <section id="diplomas" className="py-20 bg-slate-100/70 dark:bg-white/[0.01] border-y border-slate-200 dark:border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-finix-blue dark:text-sky-400 font-bold">
                Estructura Profesional
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
                 Encuentra una ruta para tu trabajo
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                 Empieza por la función que necesitas practicar. El catálogo completo reúne 14 rutas de especialidad.
              </p>
            </div>

             {/* Tres rutas de entrada; el catálogo completo está en capacitación. */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {SPECIALTY_DIPLOMAS.filter((diploma) => ['dip-compras', 'dip-contable', 'dip-consultor'].includes(diploma.id)).map((diploma, index) => {
                const isMaster = diploma.id === 'dip-consultor' || diploma.id === 'dip-business-analyst';
                return (
                  <div
                    key={diploma.id}
                    className={`rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-6 sm:p-7 flex flex-col justify-between hover:border-finix-blue/40 hover:shadow-lg transition-all group ${
                      isMaster ? 'md:col-span-2 lg:col-span-1 bg-gradient-to-b from-finix-blue/5 to-transparent border-finix-blue/30' : ''
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-finix-blue/10 text-finix-blue">
                           Ruta 0{index + 1}
                        </span>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                          {diploma.role}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-finix-blue transition-colors font-display leading-snug">
                          {diploma.title}
                        </h3>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {diploma.description}
                      </p>

                      <div className="space-y-2 border-t border-slate-100 dark:border-white/5 pt-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Módulos Requeridos ({diploma.requiredModules.length}):</p>
                        <div className="flex flex-wrap gap-1.5">
                          {diploma.requiredModules.map((mId) => {
                            const mod = getModuleById(mId);
                            return (
                              <span key={mId} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                                 {mod?.badge || mod?.title.split(':')[0]}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="pt-5 mt-5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">
                        {diploma.requiredModules.length} módulos incluidos
                      </span>
                      <Link
                        href="/capacitacion"
                        className="inline-flex items-center gap-1 text-xs font-bold text-finix-blue hover:text-sky-500 transition-colors"
                      >
                        Ver Detalle <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
             </div>

             <div className="text-center">
               <Link href="/capacitacion" className="inline-flex items-center gap-2 rounded-xl border border-finix-blue/40 px-6 py-3 text-sm font-bold text-finix-blue dark:text-sky-300 hover:bg-finix-blue/10 transition-colors">
                 Ver las 14 rutas <ArrowRight className="h-4 w-4" />
               </Link>
             </div>

             {/* PROGRAMA CUMBRE MÁSTER */}
            <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-8 sm:p-10 space-y-4 text-center max-w-4xl mx-auto shadow-xl">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold">
                 <Award className="w-4 h-4" /> Proyecto integrador de la academia
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                {MASTER_PROGRAM.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                 Reúne lo aprendido en los módulos del itinerario y practícalo en un escenario integrado del simulador educativo.
              </p>
              <div className="pt-2">
                <Link
                  href="/mi-aula"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  <GraduationCap className="w-5 h-5" />
                  Iniciar Carrera de Súper Analista
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* METODOLOGÍA: APRENDER HACIENDO */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-finix-blue dark:text-sky-400 font-bold">
                 Cómo se aprende
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
                Modelo de Formación Práctico y Empleable
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                Formación diseñada con estándares reales de consultoría e implementación en empresas de Ecuador.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-finix-blue flex items-center justify-center font-bold">
                  01
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                   Clases guiadas por procesos
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Lecciones en formato diapositivas interactivas, guías de parametrización SRI/IESS y ejercicios prácticos paso a paso.
                </p>
              </div>

              <div className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                  02
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Simulador Sandbox B1 Center
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                   Ensaya compras, ventas, documentos, asientos y nómina con datos de laboratorio. Las operaciones no se envían al SRI ni a bancos.
                </p>
              </div>

              <div className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                  03
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                   Constancias verificables
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                   Consulta la autenticidad de una constancia emitida por la academia mediante su código de verificación.
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
