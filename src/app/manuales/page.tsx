"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  Layers,
  FileText,
  X,
  Printer,
  Laptop,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ALL_MANUALS, MANUAL_CATEGORIES, ManualItem } from '@/lib/manuals-120-data';

export default function ManualesLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeModalManual, setActiveModalManual] = useState<ManualItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [completedManuals, setCompletedManuals] = useState<string[]>([]);

  // Cargar manuales completados y aprobados desde el localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sap_completed_manuals');
      if (saved) {
        setCompletedManuals(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Filtrado de manuales
  const filteredManuals = useMemo(() => {
    return ALL_MANUALS.filter((man) => {
      const matchesSearch = searchTerm === '' ||
        man.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        man.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        man.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        man.number.toString().includes(searchTerm);
      const matchesCategory = selectedCategory === 'ALL' || man.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Agrupar los resultados filtrados por categoría
  const groupedResults = useMemo(() => {
    const groups: Record<string, ManualItem[]> = {};
    filteredManuals.forEach((man) => {
      if (!groups[man.category]) groups[man.category] = [];
      groups[man.category].push(man);
    });
    // Ordenar por categoryOrder
    return Object.entries(groups).sort((a, b) => {
      const orderA = a[1][0]?.categoryOrder ?? 99;
      const orderB = b[1][0]?.categoryOrder ?? 99;
      return orderA - orderB;
    });
  }, [filteredManuals]);

  // Manejar cambio en el selector de categoría
  const handleCategorySelectChange = (catName: string) => {
    setSelectedCategory(catName);
    if (catName === 'ALL') {
      setActiveCategory(null);
    } else {
      setActiveCategory(catName);
    }
  };

  // Abrir o cerrar una categoría
  const toggleCategory = (catName: string) => {
    if (activeCategory === catName) {
      setActiveCategory(null);
    } else {
      setActiveCategory(catName);
      // Desplazar suavemente hacia la sección activa
      const elem = document.getElementById('seccion-categoria-activa');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Obtener grupo activo y grupos secundarios
  const activeGroup = useMemo(() => {
    if (!activeCategory) return null;
    return groupedResults.find(([name]) => name === activeCategory) || null;
  }, [activeCategory, groupedResults]);

  const otherGroups = useMemo(() => {
    if (!activeCategory) return groupedResults;
    return groupedResults.filter(([name]) => name !== activeCategory);
  }, [activeCategory, groupedResults]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a] selection:bg-sap-blue selection:text-white">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 w-full">
        {/* Encabezado Principal */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-sap-blue/30 bg-sap-blue/5 text-xs font-bold text-sap-blue">
            <Sparkles className="w-3.5 h-3.5" /> Repositorio Documental Oficial • B1 Academy Ecuador
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
            Biblioteca de Manuales Técnicos
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            <strong>{ALL_MANUALS.length} manuales oficiales</strong> de SAP Business One organizados en
            <strong> {MANUAL_CATEGORIES.length} módulos temáticos</strong>. Selecciona cualquier categoría para explorar sus lecciones interactivas.
          </p>
        </div>

        {/* Buscador y Filtros */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Buscador */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por título, palabra clave o número..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sap-blue"
              />
            </div>

            {/* Selector de Categoría */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategorySelectChange(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sap-blue cursor-pointer"
              >
                <option value="ALL" className="dark:bg-slate-900">
                  Todas las Categorías ({ALL_MANUALS.length})
                </option>
                {MANUAL_CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name} className="dark:bg-slate-900">
                    {cat.icon} {cat.name} ({cat.manuals.length})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resumen de Resultados */}
        <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
          <span>Mostrando {filteredManuals.length} de {ALL_MANUALS.length} manuales técnicos</span>
          <span>{groupedResults.length} {groupedResults.length === 1 ? 'categoría' : 'categorías'}</span>
        </div>

        {/* ZONA DE CATEGORÍA SELECCIONADA (SUBE AL INICIO AL ESCOGERLA) */}
        {activeGroup && (
          <div id="seccion-categoria-activa" className="space-y-6 rounded-3xl border border-sap-blue/40 bg-sap-blue/[0.03] p-6 sm:p-8 shadow-xl transition-all">
            {/* Header de la Categoría Activa */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-sap-blue/20">
              <div className="flex items-center gap-4">
                <span className="text-4xl p-3 rounded-2xl bg-white dark:bg-white/10 shadow-sm border border-slate-200 dark:border-white/10">
                  {activeGroup[1][0]?.categoryIcon || '📁'}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-sap-blue bg-sap-blue/15 px-2.5 py-0.5 rounded-full">
                      Módulo Seleccionado
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {activeGroup[1].length} {activeGroup[1].length === 1 ? 'manual' : 'manuales'}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    {activeGroup[0]}
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setActiveCategory(null)}
                className="self-end sm:self-auto px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-xs font-bold text-slate-700 dark:text-white transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <ChevronUp className="w-4 h-4" /> Cerrar y volver a la cuadrícula
              </button>
            </div>

            {/* Grid de Manuales de la Categoría Activa */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeGroup[1].map((man) => {
                const isApproved = completedManuals.includes(man.id);
                return (
                  <div
                    key={man.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1322] hover:border-sap-blue/50 transition-all flex flex-col justify-between space-y-3 group shadow-md"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">
                            #{man.number < 10 ? `0${man.number}` : man.number < 100 ? `0${man.number}` : man.number}
                          </span>
                          {isApproved && (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Aprobado
                            </span>
                          )}
                        </div>
                        {man.totalSlides > 0 && (
                          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" /> {man.totalSlides} diapositivas
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sap-blue transition-colors leading-tight">
                        {man.title}
                      </h3>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                        {man.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setActiveModalManual(man)}
                        className="text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-sap-blue transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" /> Ficha Técnica
                      </button>

                      <Link
                        href={`/manuales/${encodeURIComponent(man.id)}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-sap-blue hover:bg-sky-600 transition-colors px-3 py-1.5 rounded-lg shadow-sm active:scale-95"
                      >
                        Abrir Clase <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CUADRÍCULA DE 3 COLUMNAS PARA LAS CATEGORÍAS */}
        <div className="space-y-4">
          {activeGroup && (
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-4 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-sap-blue" />
              Explorar Otras Categorías ({otherGroups.length})
            </h3>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherGroups.map(([categoryName, manuals], index) => {
              const icon = manuals[0]?.categoryIcon || '📁';
              
              // Si no hay categoría activa, hay 22 ítems:
              // Los primeros 21 van 7 filas x 3 columnas.
              // El ítem 22 (índice 21) se posiciona al medio con lg:col-start-2
              const isCenteredSingle = !activeGroup && otherGroups.length === 22 && index === 21;

              return (
                <button
                  key={categoryName}
                  onClick={() => toggleCategory(categoryName)}
                  className={`w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 hover:border-sap-blue hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer group text-left ${
                    isCenteredSingle ? 'lg:col-start-2' : ''
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-3xl transition-transform group-hover:scale-110 duration-200">
                      {icon}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sap-blue transition-colors line-clamp-1">
                        {categoryName}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400">
                        {manuals.length} {manuals.length === 1 ? 'manual' : 'manuales'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400 group-hover:text-sap-blue transition-colors">
                    <span className="text-[11px] font-medium hidden sm:inline">Ver</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredManuals.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <BookOpen className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-sm text-slate-500">No se encontraron manuales con ese criterio de búsqueda.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('ALL'); setActiveCategory(null); }}
              className="text-xs font-bold text-sap-blue hover:underline cursor-pointer"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </main>

      {/* MODAL DETALLE DE FICHA TÉCNICA DEL MANUAL */}
      {activeModalManual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold bg-sap-blue/10 text-sap-blue px-3 py-1 rounded-xl">
                  MANUAL #{activeModalManual.number < 10 ? `0${activeModalManual.number}` : activeModalManual.number}
                </span>
                <span className="text-lg">{activeModalManual.categoryIcon}</span>
                {completedManuals.includes(activeModalManual.id) && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Aprobado
                  </span>
                )}
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
                {activeModalManual.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                {activeModalManual.title}
              </h2>
            </div>

            {/* Resumen Funcional */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Alcance y Propósito del Manual:
              </p>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeModalManual.summary}
              </p>
            </div>

            {/* Especificaciones Técnicas */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-sap-blue" />
                Información del Recurso
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] space-y-1">
                  <span className="text-slate-400 block">Entorno / Sistema:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    SAP Business One v10.0 (HANA/SQL)
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] space-y-1">
                  <span className="text-slate-400 block">Diapositivas Disponibles:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {activeModalManual.totalSlides} capturas de pantalla
                  </span>
                </div>
              </div>
            </div>

            {/* Acciones del Modal */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <a
                href={activeModalManual.pdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Printer className="w-4 h-4" /> Abrir / Descargar PDF Original
              </a>

              <Link
                href={`/manuales/${encodeURIComponent(activeModalManual.id)}`}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sap-blue hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-md shadow-sap-blue/20 flex items-center justify-center gap-2 active:scale-95"
              >
                <Laptop className="w-4 h-4" /> Ir a la Clase Práctica
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
