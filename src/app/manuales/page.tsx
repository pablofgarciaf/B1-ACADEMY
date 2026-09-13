"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Search, 
  Filter, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Layers,
  ChevronRight,
  FileText
} from 'lucide-react';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ALL_83_MANUALS, TechnicalManualItem } from '@/lib/manuals-83-data';

export default function ManualesLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<'ALL' | 'OP' | 'ARQ'>('ALL');

  const blocks = [
    { code: 'ALL', name: 'Todos los Bloques (83)' },
    { code: 'A', name: 'Bloque A: SAP B1 Núcleo Transversal (16)' },
    { code: 'B', name: 'Bloque B: Producción y Planificación (6)' },
    { code: 'C', name: 'Bloque C: Localización SRI Ecuador (6)' },
    { code: 'D', name: 'Bloque D: Adaptaciones Verticales (10)' },
    { code: 'E', name: 'Bloque E: Personalización y Boyum IT (2)' },
    { code: 'F', name: 'Bloque F: Heinsohn Nómina Operación (9)' },
    { code: 'G', name: 'Bloque G: Heinsohn Nómina Configuración (9)' },
    { code: 'H', name: 'Bloque H: Heinsohn Gestión Humana (8)' },
    { code: 'I', name: 'Bloque I: Marco Normativo Laboral (6)' },
    { code: 'J', name: 'Bloque J: Flujos de Trabajo Transversales (6)' },
    { code: 'K', name: 'Bloque K: Consultor Premium Parametrización (5)' },
  ];

  const filteredManuals = ALL_83_MANUALS.filter((man) => {
    const matchesSearch = man.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          man.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          man.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          man.number.toString().includes(searchTerm);
    const matchesBlock = selectedBlock === 'ALL' || man.block === selectedBlock;
    const matchesLevel = selectedLevel === 'ALL' || man.level === selectedLevel;

    return matchesSearch && matchesBlock && matchesLevel;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a] selection:bg-sap-blue selection:text-white">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 w-full">
        {/* Encabezado Principal */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-sap-blue/30 bg-sap-blue/5 text-xs font-bold text-sap-blue">
            <Sparkles className="w-3.5 h-3.5" /> Repositorio Documental Oficial • Ecosistema Heinsohn & SAP B1
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
            Biblioteca de los 83 Manuales Técnicos
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Explora la arquitectura de conocimiento detallada del software: 
            <strong> 47 documentos de Nivel Operativo [OP]</strong> y 
            <strong> 36 documentos de Nivel Arquitectura [ARQ]</strong>.
          </p>
        </div>

        {/* Buscador y Filtros */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Input Buscador */}
            <div className="relative md:col-span-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por título, palabra clave o tema..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sap-blue"
              />
            </div>

            {/* Selector de Bloques */}
            <div className="md:col-span-1">
              <select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sap-blue cursor-pointer"
              >
                {blocks.map((b) => (
                  <option key={b.code} value={b.code} className="dark:bg-slate-900">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de Nivel OP vs ARQ */}
            <div className="flex gap-2 md:col-span-1">
              <button
                onClick={() => setSelectedLevel('ALL')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedLevel === 'ALL' ? 'bg-sap-blue text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setSelectedLevel('OP')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedLevel === 'OP' ? 'bg-sap-blue text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300'
                }`}
              >
                [OP] Operativo
              </button>
              <button
                onClick={() => setSelectedLevel('ARQ')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedLevel === 'ARQ' ? 'bg-amber-500 text-slate-900' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300'
                }`}
              >
                [ARQ] Arquitectura
              </button>
            </div>
          </div>
        </div>

        {/* Resumen de Resultados */}
        <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
          <span>Mostrando {filteredManuals.length} de 83 documentos técnicos</span>
          <span>Filtro activo: {selectedBlock} • {selectedLevel}</span>
        </div>

        {/* Listado de Manuales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredManuals.map((man) => (
            <div
              key={man.id}
              className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-sap-blue/40 transition-all flex flex-col justify-between space-y-4 group shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 dark:bg-white/5 px-2.5 py-0.5 rounded">
                    Doc #{man.number < 10 ? `0${man.number}` : man.number}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      man.level === 'ARQ'
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        : 'bg-sap-blue/10 text-sap-blue border border-sap-blue/20'
                    }`}
                  >
                    {man.level === 'ARQ' ? 'Nivel Arquitectura [ARQ]' : 'Nivel Operativo [OP]'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                    {man.blockTitle}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-sap-blue transition-colors">
                    {man.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {man.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-500">
                  {man.category}
                </span>
                <Link
                  href="/capacitacion/sap-b1-core"
                  className="inline-flex items-center gap-1 text-xs font-bold text-sap-blue hover:text-sky-500 transition-colors"
                >
                  Abrir en Aula <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
