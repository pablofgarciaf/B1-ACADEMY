"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Award,
  Sparkles,
  BookOpen,
  Wrench,
  CheckCircle2,
  Download,
  ShieldCheck,
  FileText,
  Layers,
  Compass,
  DollarSign,
  ShoppingCart,
  Factory,
  Scale,
  Terminal,
  Users,
  LayoutDashboard,
  TrendingUp,
  Building2,
  CreditCard,
  PieChart,
  ArrowRight,
  Search,
  Filter,
  Check,
  Clock,
  Lock,
  ExternalLink,
  Bot,
  ChevronRight,
  UserCheck,
  LogIn,
  Play
} from 'lucide-react';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import {
  SPECIALTY_DIPLOMAS,
  OFFICIAL_SYLLABUS,
  getModuleById
} from '@/lib/curriculum-data';
import { useAuth } from '@/context/AuthContext';

export default function MiAulaPage() {
  const { userProfile } = useAuth();
  const [profileMode, setProfileMode] = useState<'student' | 'teacher'>('student');

  const studentDisplayName = userProfile?.displayName || userProfile?.name || 'Estudiante';
  const studentEmail = userProfile?.email || '';
  const initials = studentDisplayName
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-gray-100 selection:bg-amber-500/30 selection:text-white transition-colors">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10 sm:space-y-12">
        {/* Cápsula GEO para Motores de Búsqueda IA (Perplexity, ChatGPT, Claude, Google AI) */}
        <aside aria-label="Resumen de Mi Aula Virtual SAP B1" className="p-4 sm:p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300 backdrop-blur-md">
          <strong className="text-slate-900 dark:text-white font-semibold">Escuela SAP Business One 10.0 (HANA):</strong>{' '}
          Plataforma de formación especializada estructurada en <strong>4 rutas profesionales</strong> con el contenido de los <strong>manuales técnicos</strong>, tutoría interactiva de <strong>Tutor IA</strong>, laboratorios en el <strong>Simulador SAP B1</strong> y evaluación con IA.
        </aside>

        {/* Tarjeta de Bienvenida & Perfil del Estudiante */}
        {userProfile ? (
          <div className="rounded-3xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#131a20] p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow-lg ring-2 ring-amber-400/30">
                {initials || <GraduationCap size={28} />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Estudiante Activo
                  </span>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {studentDisplayName}
                </h2>
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  {studentEmail} • Expediente Curricular SAP B1 Habilitado
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/simulador"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg transition-all active:scale-95"
              >
                <Wrench className="w-4 h-4" />
                <span>Simulador SAP B1</span>
              </Link>
              <Link
                href="/manuales"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-200 text-xs font-bold border border-slate-300 dark:border-gray-700 transition-all active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>Atlas de Manuales</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> Bienvenido a la Escuela SAP Business One 10.0
              </h2>
              <p className="text-xs text-slate-600 dark:text-gray-400">
                Selecciona una carrera para acceder al temario interactivo de lecciones con diapositivas reales, tutoría de Tutor IA y laboratorios.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 shrink-0"
            >
              <LogIn className="w-4 h-4" />
              <span>Iniciar Sesión</span>
            </Link>
          </div>
        )}

        {/* Encabezado Principal & Switch Alumno vs Docente */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-200 dark:border-gray-800 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <GraduationCap className="w-3.5 h-3.5" /> Escuela Universitaria & Ejecutiva ERP
            </div>
            {/* H1 Quirúrgico (55 caracteres: exacto entre 45 y 65 chars) */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white">
              Mi Aula Virtual: Escuela y Clases SAP Business One 10.0
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Selecciona una de las <strong>4 rutas profesionales</strong> para abrir su aula de aprendizaje con visor de diapositivas, teleprompter guiado, simulador y <strong>evaluación interactiva</strong>.
            </p>
          </div>

          {/* Selector Alumno vs Docente */}
          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#131a20] border border-slate-200 dark:border-gray-800 shadow-xl">
            <button
              onClick={() => setProfileMode('student')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${profileMode === 'student'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25'
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Estudiante / Profesional</span>
            </button>
            <button
              onClick={() => setProfileMode('teacher')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${profileMode === 'teacher'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <Users className="w-4 h-4" />
              <span>Docente Universitario</span>
            </button>
          </div>
        </div>

        {/* MODO DOCENTE UNIVERSITARIO ("TRAIN THE TRAINER") */}
        {profileMode === 'teacher' && (
          <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/30 via-[#131a20] to-[#0d131a] p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-purple-500/20 pb-5">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Programa Train the Trainer</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" /> Acreditación Docente e Instructor Catedrático
                </h2>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                120 Horas Pedagógicas
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
              <div className="space-y-3 rounded-2xl bg-black/40 border border-purple-500/20 p-5">
                <h3 className="font-bold text-purple-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Requisitos de Habilitación por Carrera
                </h3>
                <p className="text-xs leading-relaxed text-gray-400">
                  Aprobación completa de las lecciones del itinerario de especialidad y superación de la Evaluación con Tutor IA con calificación mínima de 90%.
                </p>
                <div className="pt-2 text-xs font-semibold text-purple-200">
                  Habilita al catedrático para impartir cátedra en educación superior en la especialidad correspondiente.
                </div>
              </div>

              <div className="space-y-3 rounded-2xl bg-black/40 border border-purple-500/20 p-5">
                <h3 className="font-bold text-amber-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" /> Acreditación Docente Titular Tutor IA
                </h3>
                <p className="text-xs leading-relaxed text-gray-400">
                  Completar los manuales del atlas, superar la defensa técnica integral y demostrar dominio del Simulador como laboratorio de evaluación universitaria.
                </p>
                <div className="pt-2 text-xs font-semibold text-amber-200">
                  Otorga la máxima jerarquía académica y la facultad de rubricar exámenes de grado a nivel universitario.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LOS 4 DIPLOMAS DE ESPECIALIDAD */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Acreditación Profesional
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Los 4 Diplomas de Especialidad SAP B1
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 max-w-md">
              Para obtener un Diploma de Especialidad debes aprobar los módulos correspondientes. Ingresa a cualquier módulo para empezar.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {SPECIALTY_DIPLOMAS.map((diploma, idx) => {
              const reqModules = diploma.requiredModules.map(modId => getModuleById(modId)).filter(Boolean) as typeof OFFICIAL_SYLLABUS;

              return (
                <div
                  key={diploma.id}
                  className="rounded-3xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#131a20] p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6 hover:border-amber-500/50 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700">
                        Diploma {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-gray-400 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-500" /> Acreditación Oficial
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                        {diploma.title}
                      </h3>
                      <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-1">
                        {diploma.description}
                      </p>
                    </div>

                    {/* Módulos que agrupa */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Módulos Requeridos ({reqModules.length}):
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {reqModules.map((mod, ci) => (
                          <Link
                            key={mod.id}
                            href={`/mi-aula/${mod.id}`}
                            className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-gray-800/40 border border-slate-200 dark:border-gray-700/60 hover:border-amber-500/40 transition-colors"
                          >
                            <div className="flex flex-col min-w-0 pr-4">
                              <span className="text-xs font-bold text-slate-800 dark:text-gray-200 truncate group-hover:text-amber-500 transition-colors">
                                Módulo {mod.number}: {mod.title}
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-gray-400 truncate">
                                {mod.classes.length} Clases • {mod.badge}
                              </span>
                            </div>
                            <div className="shrink-0">
                              <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                                <ArrowRight className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:text-white" />
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* MODELO DE TITULACIÓN Y RIGOR ACADÉMICO */}
        <section className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-slate-950 via-[#131a20] to-slate-950 p-6 sm:p-10 shadow-2xl text-white flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <ShieldCheck className="w-4 h-4" /> Política de Integridad & Rigor Universitario
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Acreditación Oficial: Certificados y Diplomas por Mérito Real
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              En B1 Academy los certificados no se regalan ni se desbloquean con simples preguntas automáticas. Para obtener tu acreditación oficial con firmas de responsabilidad y código QR, debes <strong>completar el 100% de las lecciones</strong> de la carrera y <strong>aprobar la Evaluación con Tutor IA</strong> demostrando criterio técnico en situaciones reales.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/simulador"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xs border border-gray-700 transition-all active:scale-95"
              >
                <Wrench className="w-4 h-4 text-blue-400" />
                <span>Practicar en Simulador SAP B1</span>
              </Link>
              <Link
                href="/manuales"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xs border border-gray-700 transition-all active:scale-95"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Consultar los Manuales</span>
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-80 rounded-2xl bg-black/60 border border-gray-800 p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-gray-400">
              <span>Requisitos de Graduación</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Estudiar las diapositivas reales de cada módulo</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Ejecutar los talleres en el simulador</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Aprobar el Examen con Tutor IA (≥ 80 pts)</span>
              </li>
            </ul>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
