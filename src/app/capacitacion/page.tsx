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
  Check,
  Calculator,
  Cpu,
  Briefcase,
  Users
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


interface FilterAreaItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Fila 1: Los 5 filtros con menos caracteres (Todas las áreas y los 4 más cortos)
const FILTER_ROW_1: FilterAreaItem[] = [
  { key: 'ALL', label: 'Todas las áreas', icon: Sparkles },
  { key: 'Proyecto Final', label: 'Proyecto Final', icon: Award },
  { key: 'Finanzas y Fiscalidad', label: 'Finanzas y Fiscalidad', icon: Calculator },
  { key: 'Tecnología y Analítica', label: 'Tecnología y Analítica', icon: Cpu },
  { key: 'Gestión Comercial y CRM', label: 'Gestión Comercial y CRM', icon: ShoppingCart },
];

// Fila 2: Los 4 filtros con más caracteres restantes
const FILTER_ROW_2: FilterAreaItem[] = [
  { key: 'Producción y Planificación', label: 'Producción y Planificación', icon: Factory },
  { key: 'Consultoría y Business Analyst', label: 'Consultoría y Business Analyst', icon: Briefcase },
  { key: 'Administración y Talento Humano', label: 'Administración y Talento Humano', icon: Users },
  { key: 'Logística y Cadena de Suministro', label: 'Logística y Cadena de Suministro', icon: Package },
];

export default function CapacitacionPage() {
  const [selectedBlock, setSelectedBlock] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDiplomas = SPECIALTY_DIPLOMAS.filter(dip => {
    const matchesSearch = 
      dip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dip.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dip.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBlock = selectedBlock === 'ALL' || dip.requiredModules.some(mId => getModuleById(mId)?.block === selectedBlock);
    return matchesSearch && matchesBlock;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a] selection:bg-finix-blue selection:text-white">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 w-full">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-finix-blue/30 bg-finix-blue/5 text-xs font-bold text-finix-blue">
            <Sparkles className="w-3.5 h-3.5" /> {SPECIALTY_DIPLOMAS.length} rutas de especialidad • {OFFICIAL_SYLLABUS.length} módulos
          </div>
          {/* H1 Quirúrgico (45-65 chars) -> 52 caracteres */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
            Diplomas de Especialidad en SAP Business One | B1 Academy
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Encuentra una ruta por función, revisa sus módulos y decide dónde empezar. Los ejercicios se realizan en un laboratorio educativo.
          </p>
        </div>

        {/* Buscador de Especialidades */}
        <div className="max-w-xl mx-auto">
          <label htmlFor="buscar-ruta" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">¿Qué quieres aprender?</label>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="buscar-ruta"
              type="text"
              placeholder="Buscar por rol (ej. Compras, Ventas, Contable, Consultor)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-finix-blue transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* Filtros organizados en DOS (2) filas limpias y visibles sin barra de scroll */}
        <div className="space-y-2.5 max-w-5xl mx-auto w-full" role="group" aria-label="Filtrar rutas por área">
          {/* Fila 1: 5 filtros con menos caracteres */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {FILTER_ROW_1.map(({ key, label, icon: Icon }) => {
              const isSelected = selectedBlock === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedBlock(key)}
                  aria-pressed={isSelected}
                  className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-full border px-3.5 sm:px-4 py-2 text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer shadow-sm ${
                    isSelected
                      ? 'border-finix-blue bg-finix-blue text-white shadow-finix-blue/25'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-finix-blue/60 hover:text-finix-blue hover:bg-slate-50 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:border-sky-400 dark:hover:text-sky-300 dark:hover:bg-white/[0.08]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isSelected ? 'text-white' : 'text-finix-blue dark:text-sky-400'}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Fila 2: 4 filtros con más caracteres */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {FILTER_ROW_2.map(({ key, label, icon: Icon }) => {
              const isSelected = selectedBlock === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedBlock(key)}
                  aria-pressed={isSelected}
                  className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-full border px-3.5 sm:px-4 py-2 text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer shadow-sm ${
                    isSelected
                      ? 'border-finix-blue bg-finix-blue text-white shadow-finix-blue/25'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-finix-blue/60 hover:text-finix-blue hover:bg-slate-50 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:border-sky-400 dark:hover:text-sky-300 dark:hover:bg-white/[0.08]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isSelected ? 'text-white' : 'text-finix-blue dark:text-sky-400'}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECCIÓN 1: DIPLOMAS DE ESPECIALIDAD */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
              Rutas de especialidad
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              {filteredDiplomas.length} rutas encontradas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDiplomas.map((diploma, idx) => (
              <div
                key={diploma.id}
                className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-sm hover:border-finix-blue/40 hover:shadow-md transition-all flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-finix-blue/10 text-finix-blue">
                      Ruta 0{idx + 1}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                      {diploma.role}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-finix-blue transition-colors font-display">
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
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 hover:border-finix-blue hover:text-finix-blue transition-colors"
                          >
                            {mod?.badge || mod?.title.split(':')[0]}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    {diploma.requiredModules.length} módulos de estudio
                  </span>
                  <Link
                    href={`/mi-aula`}
                    className="px-4 py-2 rounded-xl bg-finix-blue hover:bg-sky-600 text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                  >
                    Explorar aula <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {filteredDiplomas.length === 0 && <p role="status" className="rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">No encontramos una ruta con esos filtros. Prueba otra palabra o elige todas las áreas.</p>}
        </div>

        {/* SECCIÓN 2: MALLA CURRICULAR DE LOS 30 MÓDULOS */}
        <section className="pt-8 space-y-8 border-t border-slate-200 dark:border-white/10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-finix-blue dark:text-sky-400 font-bold">
              Plan de Estudios Completo
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Malla curricular de {OFFICIAL_SYLLABUS.length} módulos
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
                    <div className="p-2.5 rounded-xl bg-finix-blue/10 text-finix-blue">
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
                        className="p-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] hover:border-finix-blue hover:shadow-md transition-all space-y-3 flex flex-col justify-between group cursor-pointer"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-finix-blue bg-finix-blue/10 px-2 py-0.5 rounded">
                              Módulo {mod.number} • {mod.id}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                              {mod.badge}
                            </span>
                          </div>

                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-finix-blue transition-colors">
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
                          <span className="text-[10px] font-bold text-finix-blue font-mono group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
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
