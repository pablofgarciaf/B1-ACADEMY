import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Layers, Briefcase, CheckCircle2, Award, BookOpen, ChevronRight } from 'lucide-react';
import { 
  SPECIALTY_DIPLOMAS, 
  OFFICIAL_SYLLABUS, 
  getModuleById,
  type SpecialtyDiploma,
  type SyllabusModule
} from '@/lib/curriculum-data';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';

export default async function TrackSyllabusPage({ params }: { params: Promise<{ moduloId: string }> }) {
  const resolvedParams = await params;
  const targetId = resolvedParams?.moduloId || 'dip-compras';

  // Buscar diploma de especialidad primero
  const diploma = SPECIALTY_DIPLOMAS.find(d => d.id === targetId);
  // O buscar módulo individual
  const moduleItem = OFFICIAL_SYLLABUS.find(m => m.id === targetId);

  if (moduleItem) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a] selection:bg-sap-blue selection:text-white">
        <Navbar />
        <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 w-full">
          <div className="p-6 sm:p-8 rounded-3xl border border-sap-blue/30 bg-gradient-to-br from-sap-blue/10 via-sky-500/5 to-white dark:to-white/[0.02] shadow-sm space-y-5">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/capacitacion" className="inline-flex items-center gap-1.5 text-xs font-bold text-sap-blue hover:text-sky-600 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Todos los Diplomas
                </Link>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-lg bg-sap-blue text-white shadow-sm">
                  Módulo {moduleItem.number}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm">
                  {moduleItem.badge}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
                {moduleItem.title}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
                {moduleItem.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400 pt-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Bloque: {moduleItem.block}
                </span>
                <span>•</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {moduleItem.certificateTitle}
                </span>
              </div>
            </div>
            <div className="pt-2">
              <Link
                href={`/mi-aula/${moduleItem.id}`}
                className="px-6 py-3 rounded-2xl bg-sap-blue hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sap-blue/20 transition-all active:scale-95 inline-flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                Ingresar al Aula Virtual de este Módulo
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Si es un diploma o por defecto
  const activeDiploma = diploma || SPECIALTY_DIPLOMAS[0];
  const requiredModulesData = activeDiploma.requiredModules
    .map(mId => getModuleById(mId))
    .filter((m): m is SyllabusModule => m !== undefined);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a] selection:bg-sap-blue selection:text-white">
      <Navbar />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 w-full">
        {/* BANNER DEL DIPLOMA */}
        <div className="p-6 sm:p-8 rounded-3xl border border-sap-blue/30 bg-gradient-to-br from-sap-blue/10 via-sky-500/5 to-white dark:to-white/[0.02] shadow-sm space-y-5">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/capacitacion" className="inline-flex items-center gap-1.5 text-xs font-bold text-sap-blue hover:text-sky-600 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Todas las Especialidades
              </Link>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-lg bg-sap-blue text-white shadow-sm">
                {activeDiploma.role}
              </span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight mt-1">
                {activeDiploma.title}
              </h1>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
              {activeDiploma.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 font-bold text-sap-blue">
                <Award className="w-4 h-4" /> {activeDiploma.requiredModules.length} Módulos Requeridos
              </span>
            </div>
          </div>
        </div>

        {/* SYLLABUS GRID DEL DIPLOMA */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Módulos que Integran este Diploma
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requiredModulesData.map((mod) => (
              <Link
                key={mod.id}
                href={`/mi-aula/${mod.id}`}
                className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-sap-blue/50 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-extrabold text-sap-blue bg-sap-blue/10 px-2 py-0.5 rounded">
                      Módulo {mod.number} • {mod.id}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                      {mod.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-sap-blue transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                    {mod.description}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">{mod.block}</span>
                  <span className="text-sap-blue flex items-center gap-1">Cursar <ChevronRight className="w-3.5 h-3.5" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
