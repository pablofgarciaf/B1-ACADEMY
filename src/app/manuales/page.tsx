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
  FileText,
  X,
  Printer,
  ExternalLink,
  Laptop,
  Check
} from 'lucide-react';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ALL_83_MANUALS, TechnicalManualItem } from '@/lib/manuals-83-data';

export default function ManualesLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<'ALL' | 'OP' | 'ARQ'>('ALL');
  const [activeModalManual, setActiveModalManual] = useState<TechnicalManualItem | null>(null);

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

  const getTrackForBlock = (block: string): { id: string; name: string } => {
    switch (block) {
      case 'A': return { id: 'sap-b1-core', name: 'SAP B1 Core & Finanzas' };
      case 'B': return { id: 'verticales-ecuador', name: 'Verticales Agroindustriales' };
      case 'C': return { id: 'sri-localizacion', name: 'Localización SRI Ecuador' };
      case 'D': return { id: 'verticales-ecuador', name: 'Verticales Agroindustriales' };
      case 'E': return { id: 'sap-b1-core', name: 'SAP B1 Core & Finanzas' };
      case 'F': return { id: 'heinsohn-nomina', name: 'Heinsohn Nómina & IESS' };
      case 'G': return { id: 'heinsohn-nomina', name: 'Heinsohn Nómina Configuración' };
      case 'H': return { id: 'heinsohn-rrhh', name: 'Heinsohn Gestión Humana' };
      case 'I': return { id: 'heinsohn-nomina', name: 'Heinsohn Nómina & IESS' };
      case 'J': return { id: 'sap-b1-core', name: 'SAP B1 Core & Finanzas' };
      case 'K': return { id: 'sap-b1-core', name: 'SAP B1 Core & Finanzas' };
      default: return { id: 'sap-b1-core', name: 'SAP B1 Core' };
    }
  };

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
            Arquitectura de conocimiento oficial: 
            <strong> 47 Guías de Nivel Operativo [OP]</strong> y 
            <strong> 36 Guías de Nivel Arquitectura [ARQ]</strong>. Haz clic en cualquier manual para consultar su ficha técnica o abrir su clase práctica.
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
                placeholder="Buscar por título, palabra clave o número..."
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
          {filteredManuals.map((man) => {
            const track = getTrackForBlock(man.block);
            return (
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

                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveModalManual(man)}
                    className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-sap-blue transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" /> Ficha Técnica
                  </button>

                  <Link
                    href={`/capacitacion/${track.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-sap-blue hover:text-sky-500 transition-colors bg-sap-blue/10 px-3 py-1.5 rounded-xl border border-sap-blue/20 active:scale-95"
                  >
                    Abrir en Aula <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* MODAL DETALLE DE FICHA TÉCNICA DEL MANUAL */}
      {activeModalManual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold bg-sap-blue/10 text-sap-blue px-3 py-1 rounded-xl">
                  MANUAL #{activeModalManual.number < 10 ? `0${activeModalManual.number}` : activeModalManual.number}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  activeModalManual.level === 'ARQ' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-400'
                }`}>
                  {activeModalManual.level === 'ARQ' ? 'Arquitectura / IMG' : 'Operativo / Transaccional'}
                </span>
              </div>

              <button
                onClick={() => setActiveModalManual(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block">
                {activeModalManual.blockTitle} • Categoría: {activeModalManual.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                {activeModalManual.title}
              </h2>
            </div>

            {/* Resumen Funcional */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Alcance & Propósito Técnico:
              </p>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeModalManual.summary}
              </p>
            </div>

            {/* Especificaciones de Implementación */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-sap-blue" />
                Especificaciones de Base de Datos y Parámetros
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] space-y-1">
                  <span className="text-slate-400 block">Entorno / Sistema:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {activeModalManual.block.includes('F') || activeModalManual.block.includes('G') || activeModalManual.block.includes('H')
                      ? 'Heinsohn Nómina / Gestión Humana'
                      : 'SAP Business One v10.0 (HANA/SQL)'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] space-y-1">
                  <span className="text-slate-400 block">Normativa Aplicable:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {activeModalManual.block === 'C' ? 'SRI Ecuador / ATS v1.1.0' : 'NIIF Pymes / Código Trabajo EC'}
                  </span>
                </div>
              </div>
            </div>

            {/* Acciones del Modal */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Printer className="w-4 h-4" /> Imprimir / Guardar en PDF
              </button>

              <Link
                href={`/capacitacion/${getTrackForBlock(activeModalManual.block).id}`}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sap-blue hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-md shadow-sap-blue/20 flex items-center justify-center gap-2 active:scale-95"
              >
                <Laptop className="w-4 h-4" /> Ir a la Clase Práctica de este Módulo
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
