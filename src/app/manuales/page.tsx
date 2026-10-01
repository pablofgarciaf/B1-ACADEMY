"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
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
  FolderOpen,
  Award,
  GraduationCap,
  Download
} from 'lucide-react';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ALL_MANUALS, MANUAL_CATEGORIES, ManualItem } from '@/lib/manuals-120-data';
import { getCategoryExam, CategoryExam } from '@/lib/category-exams-data';
import { generateCategoryCertificate } from '@/lib/certificate-generator';

export default function ManualesLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeModalManual, setActiveModalManual] = useState<ManualItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [completedManuals, setCompletedManuals] = useState<string[]>([]);
  const [certifiedCategories, setCertifiedCategories] = useState<string[]>([]);

  // Estado para el Examen de Certificación de la Categoría
  const [examModalCategory, setExamModalCategory] = useState<CategoryExam | null>(null);
  const [examQuestionIdx, setExamQuestionIdx] = useState(0);
  const [examScore, setExamScore] = useState(0);
  const [examFinished, setExamFinished] = useState(false);
  const [studentName, setStudentName] = useState('Pablo García');
  const [examUserAnswers, setExamUserAnswers] = useState<Record<number, number>>({});

  // Cargar manuales y categorías certificadas desde localStorage
  useEffect(() => {
    try {
      const savedManuals = localStorage.getItem('sap_completed_manuals');
      if (savedManuals) {
        setCompletedManuals(JSON.parse(savedManuals));
      }
      const savedCerts = localStorage.getItem('sap_certified_categories');
      if (savedCerts) {
        setCertifiedCategories(JSON.parse(savedCerts));
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
    }
  };

  useEffect(() => {
    if (!activeCategory) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById('seccion-categoria-activa')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [activeCategory]);

  // Iniciar examen de certificación
  const handleStartCategoryExam = (catName: string) => {
    const exam = getCategoryExam(catName);
    setExamModalCategory(exam);
    setExamQuestionIdx(0);
    setExamScore(0);
    setExamFinished(false);
    setExamUserAnswers({});
  };

  const handleExamAnswer = (optionIdx: number) => {
    if (!examModalCategory) return;
    setExamUserAnswers(prev => ({ ...prev, [examQuestionIdx]: optionIdx }));
    const isCorrect = optionIdx === examModalCategory.questions[examQuestionIdx].answer;
    const nextScore = isCorrect ? examScore + 1 : examScore;
    if (isCorrect) setExamScore(nextScore);

    if (examQuestionIdx < examModalCategory.questions.length - 1) {
      setExamQuestionIdx(prev => prev + 1);
    } else {
      // Examen terminado
      setExamFinished(true);
      if (nextScore >= examModalCategory.passingScore) {
        // Guardar certificado
        try {
          const saved = localStorage.getItem('sap_certified_categories');
          const list: string[] = saved ? JSON.parse(saved) : [];
          if (!list.includes(examModalCategory.categoryName)) {
            list.push(examModalCategory.categoryName);
            localStorage.setItem('sap_certified_categories', JSON.stringify(list));
            setCertifiedCategories(list);
          }
        } catch (e) {
          console.error(e);
        }
        // Explosión de confeti
        try {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 }
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  const handleDownloadPDF = () => {
    if (!examModalCategory) return;
    generateCategoryCertificate({
      studentName: studentName.trim() || 'Estudiante Oficial',
      categoryTitle: examModalCategory.categoryName,
      score: examScore,
      totalQuestions: examModalCategory.questions.length
    });
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
            <strong>{ALL_MANUALS.length} manuales oficiales</strong> organizados en
            <strong> {MANUAL_CATEGORIES.length} módulos temáticos</strong>. Completa las clases prácticas y aprueba el examen final para obtener tu <strong>Certificado Oficial en PDF</strong>.
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
          <div id="seccion-categoria-activa" className="scroll-mt-24 space-y-6rounded-3xl border border-sap-blue/40 bg-sap-blue/[0.03] p-6 sm:p-8 shadow-xl transition-all">
            {/* Header de la Categoría Activa */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-sap-blue/20">
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
                    {certifiedCategories.includes(activeGroup[0]) && (
                      <span className="text-xs font-bold text-amber-500 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" /> Módulo Certificado
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    {activeGroup[0]}
                  </h2>
                </div>
              </div>

              {/* Acciones de la Categoría: Examen Final y Cerrar */}
              <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto">
                <button
                  onClick={() => handleStartCategoryExam(activeGroup[0])}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-xs font-bold text-white shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <GraduationCap className="w-4 h-4" /> Examen de Certificación del Módulo
                </button>

                <button
                  onClick={() => setActiveCategory(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-xs font-bold text-slate-700 dark:text-white transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <ChevronUp className="w-4 h-4" /> Cerrar
                </button>
              </div>
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
              const isCertified = certifiedCategories.includes(categoryName);
              
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
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sap-blue transition-colors line-clamp-1">
                          {categoryName}
                        </h3>
                        {isCertified && (
                          <span title="Módulo Certificado" className="text-amber-500 shrink-0">
                            🏆
                          </span>
                        )}
                      </div>
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

      {/* MODAL DEL EXAMEN DE CERTIFICACIÓN DE LA CATEGORÍA */}
      {examModalCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn">
            {/* Header del Examen */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-500 border border-amber-500/30 px-3 py-1 rounded-xl flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" /> Certificación Oficial
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {examModalCategory.categoryName}
                </span>
              </div>

              <button
                onClick={() => setExamModalCategory(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pantalla del Examen o Pantalla de Resultados y Certificado */}
            {!examFinished ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-sap-blue">
                    Pregunta {examQuestionIdx + 1} de {examModalCategory.questions.length}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Aciertos: {examScore}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/5">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                    {examModalCategory.questions[examQuestionIdx].q}
                  </h3>
                </div>

                <div className="flex flex-col gap-3">
                  {examModalCategory.questions[examQuestionIdx].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleExamAnswer(i)}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-sap-blue hover:bg-sap-blue/5 dark:hover:bg-white/5 text-left text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium transition-all cursor-pointer active:scale-[0.99] flex items-start gap-3"
                    >
                      <span className="font-mono font-bold text-slate-400 shrink-0 mt-0.5">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 py-2">
                <div className="text-6xl animate-bounce">
                  {examScore >= examModalCategory.passingScore ? '🏆' : '📚'}
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {examScore >= examModalCategory.passingScore
                      ? '¡Felicitaciones! Has Aprobado la Certificación'
                      : 'No alcanzaste el puntaje mínimo requerido'}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Tu puntuación: <strong>{examScore} de {examModalCategory.questions.length}</strong> (Mínimo requerido: {examModalCategory.passingScore} de {examModalCategory.questions.length} - 90%)
                  </p>
                </div>

                {examScore >= examModalCategory.passingScore ? (
                  <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4 text-left">
                    <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
                      <Award className="w-4 h-4" /> Personaliza tu Certificado Oficial
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Nombre completo para la emisión:
                      </label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Ej: Pablo García Fernández"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <button
                      onClick={handleDownloadPDF}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Download className="w-4 h-4" /> Descargar Certificado Oficial en PDF
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 text-left">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                      <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" /> Diagnóstico del Tutor IA: Módulos a Reforzar
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Para alcanzar el <strong>90% de aprobación técnica</strong>, te recomendamos repasar los siguientes conceptos específicos en los manuales de esta categoría:
                      </p>
                      {examModalCategory.questions
                        .map((q, idx) => ({ q, idx }))
                        .filter(({ idx }) => examUserAnswers[idx] !== examModalCategory.questions[idx].answer)
                        .map(({ q, idx }) => (
                          <div key={idx} className="p-3 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 space-y-1 text-xs">
                            <div className="font-bold text-slate-900 dark:text-white">
                              📌 {q.topic || q.q}
                            </div>
                            <div className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                              {q.explanation}
                            </div>
                            {q.recommendedManualTitle && (
                              <div className="text-sap-blue font-semibold text-[11px] pt-1">
                                💡 Lección recomendada: {q.recommendedManualTitle}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setExamQuestionIdx(0);
                      setExamScore(0);
                      setExamFinished(false);
                    }}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                  >
                    Reintentar Evaluación
                  </button>
                  <button
                    onClick={() => setExamModalCategory(null)}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all cursor-pointer"
                  >
                    Finalizar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.01] space-y-1">
                  <span className="text-slate-400 block">Entorno / Sistema:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    SAP Business One v10.0 (HANA/SQL)
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.01] space-y-1">
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
