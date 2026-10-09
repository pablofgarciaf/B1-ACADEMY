"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Award, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Building2,
  Package,
  ShoppingCart,
  Factory,
  Landmark,
  Settings2,
  Compass,
  Search,
  Check
} from 'lucide-react';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { 
  SPECIALTY_DIPLOMAS, 
  OFFICIAL_SYLLABUS, 
  SYLLABUS_BLOCKS, 
  MASTER_PROGRAM, 
  getModuleById,
  type SpecialtyDiploma,
  type SyllabusBlock
} from '@/lib/curriculum-data';

export default function CapacitacionPage() {
  const [selectedBlock, setSelectedBlock] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDiplomas = SPECIALTY_DIPLOMAS.filter(dip => {
    const matchesSearch = 
      dip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dip.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dip.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a] selection:bg-sap-blue selection:text-white">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 w-full">
        {/* Cápsula GEO para Google AI Overviews, Perplexity y ChatGPT */}
        <aside aria-label="Resumen del Ecosistema Formativo" className="p-5 rounded-2xl border border-sky-500/30 bg-sky-50/70 dark:bg-sky-950/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300 backdrop-blur-md">
          <strong className="text-slate-900 dark:text-white font-semibold">Oferta Académica B1 Academy Ecuador:</strong>{' '}
          Formación especializada en <strong>SAP Business One 10.0</strong> dividida en <strong>14 Diplomas de Especialidad</strong> por rol corporativo y <strong>30 Módulos de Aprendizaje Continuo</strong> distribuidos en 8 Bloques Académicos:
          Administración & RRHH, Logística & Suministros, Comercial & CRM, Producción & MRP, Finanzas & Fiscalidad SRI, Tecnología & SQL, Consultoría & Business Analyst y Titulación Máster Capstone Súper Analista.
        </aside>

        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-sap-blue/30 bg-sap-blue/5 text-xs font-bold text-sap-blue">
            <Sparkles className="w-3.5 h-3.5" /> 14 Diplomas de Especialidad • 30 Módulos Oficiales
          </div>
          {/* H1 Quirúrgico (45-65 chars) -> 52 caracteres */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
            Diplomas de Especialidad en SAP Business One Ecuador
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Elige la especialidad según tu perfil profesional. Cada diploma integra módulos prácticos evaluados en el simulador sandbox de SAP B1.
          </p>
        </div>

        {/* Buscador de Especialidades */}
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por rol (ej. Compras, Ventas, Contable, Consultor)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sap-blue transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* SECCIÓN 1: DIPLOMAS DE ESPECIALIDAD */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
              Catálogo de 14 Diplomas de Especialidad
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              {filteredDiplomas.length} Diplomas Disponibles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDiplomas.map((diploma, idx) => (
              <div
                key={diploma.id}
                className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-sm hover:border-sap-blue/40 hover:shadow-md transition-all flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-sap-blue/10 text-sap-blue">
                      Diploma 0{idx + 1}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                      {diploma.role}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sap-blue transition-colors font-display">
                    {diploma.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {diploma.description}
                  </p>

                  <div className="space-y-2 border-t border-slate-100 dark:border-white/5 pt-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Módulos Requeridos ({diploma.requiredModules.length}):
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {diploma.requiredModules.map((mId) => {
                        const mod = getModuleById(mId);
                        return (
                          <Link
                            key={mId}
                            href={`/mi-aula/${mId}`}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 hover:border-sap-blue hover:text-sap-blue transition-colors"
                          >
                            {mId}: {mod?.badge || mod?.title.split(':')[0]}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    {diploma.requiredModules.length} Evaluaciones Practicas
                  </span>
                  <Link
                    href={`/mi-aula`}
                    className="px-4 py-2 rounded-xl bg-sap-blue hover:bg-sky-600 text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                  >
                    Cursar Diploma <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN 2: MALLA CURRICULAR DE LOS 30 MÓDULOS */}
        <section className="pt-8 space-y-8 border-t border-slate-200 dark:border-white/10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-sap-blue dark:text-sky-400 font-bold">
              Plan de Estudios Completo
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Malla Curricular de 30 Módulos Continuos (1 a 30)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Estructurados en 8 bloques pedagógicos desde fundamentos operativos hasta la defensa del Proyecto Integrador.
            </p>
          </div>

          <div className="space-y-8">
            {SYLLABUS_BLOCKS.map((blockName) => {
              const modulesInBlock = OFFICIAL_SYLLABUS.filter(m => m.block === blockName);
              return (
                <div key={blockName} className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
                    <div className="p-2.5 rounded-xl bg-sap-blue/10 text-sap-blue">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                        Bloque: {blockName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {modulesInBlock.length} Módulos Especializados
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {modulesInBlock.map((mod) => (
                      <Link
                        key={mod.id}
                        href={`/mi-aula/${mod.id}`}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] hover:border-sap-blue hover:shadow-md transition-all space-y-3 flex flex-col justify-between group cursor-pointer"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-sap-blue bg-sap-blue/10 px-2 py-0.5 rounded">
                              Módulo {mod.number} • {mod.id}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                              {mod.badge}
                            </span>
                          </div>

                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-sap-blue transition-colors">
                            {mod.title}
                          </h4>

                          <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {mod.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 italic">
                            {mod.classes.length > 0 ? `${mod.classes.length} clases` : 'Evaluación sandbox'}
                          </span>
                          <span className="text-[10px] font-bold text-sap-blue font-mono group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                            Entrar al Módulo <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </Link>
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
