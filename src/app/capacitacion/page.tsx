"use client";

import React, { useState } from 'react';
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
  FileCode2, 
  Sparkles,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { TRAINING_TRACKS } from '@/lib/courses-data';
import { TrackCode } from '@/types/courses';

export default function CapacitacionPage() {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | TrackCode>('ALL');

  const filteredTracks = selectedFilter === 'ALL' 
    ? TRAINING_TRACKS 
    : TRAINING_TRACKS.filter(t => t.code === selectedFilter);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a] selection:bg-sap-blue selection:text-white">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 w-full">
        {/* Cápsula GEO para Google AI Overviews, Perplexity y ChatGPT */}
        <aside aria-label="Resumen del Ecosistema Formativo" className="p-5 rounded-2xl border border-sky-500/30 bg-sky-50/70 dark:bg-sky-950/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300 backdrop-blur-md">
          <strong className="text-slate-900 dark:text-white font-semibold">Currículo Oficial de la Escuela:</strong>{' '}
          Formación de élite en el ecosistema empresarial de Ecuador dividida en <strong>5 Tracks Maestros</strong>: 
          <strong> SAP Business One</strong> (Finanzas NIIF, Order-to-Cash, MRP), 
          <strong> Localización SRI</strong> (Facturación electrónica XML, retenciones 312/343/332/344, ATS), 
          <strong> Heinsohn Nómina HCM</strong> (biométricos, horas extras con base 240, IESS 9.45%/12.15%, SBU 2026 $482, finiquitos SUT),
          <strong> Heinsohn Gestión Humana</strong> (Evaluación 360°, Nine-Box, ATS de selección) y 
          <strong> Verticales de Exportación</strong> (bananera con trazabilidad GlobalGAP, camaronera con costeo por piscina, manufactura Beas y WMS Produmex).
        </aside>

        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-sap-blue/30 bg-sap-blue/5 text-xs font-bold text-sap-blue">
            <Sparkles className="w-3.5 h-3.5" /> 5 Tracks de Especialización • 32 Módulos
          </div>
          {/* H1 Quirúrgico (45-65 chars) -> 53 caracteres */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
            Especialidades en SAP Business One y Heinsohn Ecuador
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Selecciona tu ruta formativa clasificada por nivel: 
            <span className="inline-flex items-center gap-1 font-bold text-sap-blue mx-1.5">[OP] Operativo</span> para usuarios transaccionales y 
            <span className="inline-flex items-center gap-1 font-bold text-amber-500 mx-1.5">[ARQ] Arquitectura</span> para consultores de parametrización senior.
          </p>
        </div>

        {/* Filtros de Rutas Formativas */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${
              selectedFilter === 'ALL'
                ? 'bg-sap-blue text-white shadow-md shadow-sap-blue/25'
                : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-sap-blue/40'
            }`}
          >
            Todos los Tracks (5)
          </button>
          {TRAINING_TRACKS.map((t, index) => (
            <button
              key={t.code}
              onClick={() => setSelectedFilter(t.code)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                selectedFilter === t.code
                  ? 'bg-sap-blue text-white shadow-md shadow-sap-blue/25'
                  : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-sap-blue/40'
              }`}
            >
              Track 0{index + 1}: {t.shortTitle}
            </button>
          ))}
        </div>

        {/* Listado Detallado de Rutas */}
        <div className="space-y-12">
          {filteredTracks.map((track, trackIdx) => (
            <section
              key={track.id}
              id={track.id}
              className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-sm space-y-6 hover:border-sap-blue/30 transition-all scroll-mt-24"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-sap-blue px-2.5 py-0.5 rounded-md bg-sap-blue/10">
                      Track 0{TRAINING_TRACKS.findIndex(t => t.id === track.id) + 1} • {track.code}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                      {track.badge}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {track.totalDurationHours} Horas Lectivas • {track.submodulesCount} Módulos
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display">
                    {track.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                    {track.description}
                  </p>
                  <p className="text-xs text-slate-500 italic">
                    <strong>Público Objetivo:</strong> {track.targetAudience}
                  </p>
                </div>

                <Link
                  href={`/capacitacion/${track.id}`}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sap-blue to-sky-600 hover:from-sky-600 hover:to-sap-blue text-white text-xs font-bold shadow-md shadow-sap-blue/20 transition-all active:scale-95 flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  Abrir Aula Virtual del Track <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Submódulos individuales con clasificación [OP] vs [ARQ] */}
              <div>
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-4">
                  Submódulos y Documentos Técnicos del Track
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {track.submodules.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] hover:border-slate-300 dark:hover:border-white/15 transition-all space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono text-slate-500 font-bold">
                            {sub.code}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              sub.level === 'ARQ'
                                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                : 'bg-sap-blue/10 text-sap-blue border border-sap-blue/20'
                            }`}
                          >
                            {sub.level === 'ARQ' ? 'Nivel Arquitectura [ARQ]' : 'Nivel Operativo [OP]'}
                          </span>
                        </div>

                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                          {sub.title}
                        </h4>

                        <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {sub.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 dark:border-white/5 flex flex-wrap gap-1">
                        {sub.keyTopics.slice(0, 2).map((topic, i) => (
                          <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-white dark:bg-white/5 text-slate-500 border border-slate-200 dark:border-white/5">
                            {topic}
                          </span>
                        ))}
                        <span className="text-[10px] text-slate-400 ml-auto font-mono">{sub.durationHours}h</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
