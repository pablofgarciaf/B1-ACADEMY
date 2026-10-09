"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap, Award, ArrowRight, ChevronDown, Lock, CheckCircle2, Compass, Package, ShoppingCart,
  Landmark, Factory, Settings2, Flag, PlayCircle, Building2, ShieldCheck, Wrench,
} from 'lucide-react';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import {
  SPECIALTY_DIPLOMAS, OFFICIAL_SYLLABUS, SYLLABUS_BLOCKS, MASTER_PROGRAM, getModuleById, moduleMinutes,
  type SyllabusBlock, type SyllabusModule,
} from '@/lib/curriculum-data';
import { useAuth } from '@/context/AuthContext';

const INDUCCION = 'mod-1';
const ICONO_BLOQUE: Record<SyllabusBlock, typeof Compass> = {
  'Administración y Talento Humano': Building2,
  'Logística y Cadena de Suministro': Package,
  'Gestión Comercial y CRM': ShoppingCart,
  'Producción y Planificación': Factory,
  'Finanzas y Fiscalidad': Landmark,
  'Tecnología y Analítica': Settings2,
  'Consultoría y Business Analyst': Compass,
  'Proyecto Final': Flag,
};

export default function MiAulaPage() {
  const { userProfile, currentUser } = useAuth();
  const induccion = getModuleById(INDUCCION)!;

  // Progreso del Módulo 1: hasta completarlo, los demás módulos quedan con candado.
  const [hechasInduccion, setHechasInduccion] = useState<number | null>(null);
  useEffect(() => {
    if (!currentUser) return;
    let activo = true;
    currentUser.getIdToken()
      .then(token => fetch(`/api/progress?moduleId=${INDUCCION}`, { headers: { Authorization: `Bearer ${token}` } }))
      .then(r => (r.ok ? r.json() : { completedClasses: [] }))
      .then((d: { completedClasses?: string[] }) => { if (activo) setHechasInduccion((d.completedClasses ?? []).length); })
      .catch(() => { if (activo) setHechasInduccion(0); });
    return () => { activo = false; };
  }, [currentUser]);

  const esEquipo = ['super', 'admin', 'docente'].includes(userProfile?.role ?? '');
  const totalInduccion = induccion.classes.length;
  const induccionCompleta = esEquipo || (hechasInduccion ?? 0) >= totalInduccion;
  const nombre = (userProfile?.displayName || userProfile?.name || '').split(' ')[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-gray-100 transition-colors">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        {/* Cápsula GEO */}
        <aside aria-label="Resumen de Mi Aula" className="sr-only">
          Mi Aula de B1 Academy: escuela de SAP Business One 10.0 con módulos prácticos, cada uno con certificado de
          competencia verificable, diplomas por rol profesional, clases narradas, prácticas en simulador y evaluación final.
        </aside>

        {/* Encabezado */}
        <header className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            {nombre ? `Hola, ${nombre}` : 'Escuela SAP Business One'}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display">
            Mi Aula Virtual: Escuela y Clases SAP Business One 10.0
          </h1>
          <div className="flex flex-wrap gap-2 pt-2">
            <Link href="/simulador" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#131a20] border border-slate-200 dark:border-gray-800 text-xs font-semibold hover:border-amber-500/50 transition-all active:scale-95">
              <Wrench className="w-4 h-4 text-blue-500" aria-hidden="true" /> Simulador SAP B1
            </Link>
            <Link href="/verificar" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#131a20] border border-slate-200 dark:border-gray-800 text-xs font-semibold hover:border-amber-500/50 transition-all active:scale-95">
              <ShieldCheck className="w-4 h-4 text-emerald-500" aria-hidden="true" /> Verificar un certificado
            </Link>
          </div>
        </header>

        {/* 1 · EMPIEZA AQUÍ: Módulo 1 obligatorio */}
        <section aria-labelledby="empieza" className="rounded-3xl border border-amber-500/40 bg-white dark:bg-[#131a20] p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center gap-6">
          <div className="h-14 w-14 shrink-0 rounded-2xl bg-amber-500/15 flex items-center justify-center">
            {induccionCompleta ? <CheckCircle2 className="w-7 h-7 text-emerald-500" aria-hidden="true" /> : <Building2 className="w-7 h-7 text-amber-600 dark:text-amber-400" aria-hidden="true" />}
          </div>
          <div className="flex-1 space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Empieza aquí · Obligatorio</p>
            <h2 id="empieza" className="text-xl sm:text-2xl font-bold">Módulo 1: {induccion.title}</h2>
            <p className="text-sm text-slate-600 dark:text-gray-300">
              Creas tu empresa de práctica y aprendes a moverte en SAP. Al completarlo se abren todos los demás módulos.
            </p>
            {hechasInduccion !== null && !esEquipo && (
              <div className="pt-1 max-w-sm">
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-gray-400 mb-1">
                  <span>{Math.min(hechasInduccion, totalInduccion)} de {totalInduccion} clases</span>
                  <span>{induccion.classes.reduce((a, c) => a + c.durationMinutes, 0)} min</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-200 dark:bg-gray-800 overflow-hidden">
                  <div className="h-full rounded-full bg-amber-500 transition-all duration-500" style={{ width: `${Math.min(100, (hechasInduccion / Math.max(totalInduccion, 1)) * 100)}%` }} />
                </div>
              </div>
            )}
          </div>
          <Link
            href={`/mi-aula/${INDUCCION}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-md transition-all active:scale-95 shrink-0"
          >
            <PlayCircle className="w-4 h-4" aria-hidden="true" />
            {induccionCompleta ? 'Repasar' : (hechasInduccion ?? 0) > 0 ? 'Continuar' : 'Comenzar'}
          </Link>
        </section>

        {/* 2 · DIPLOMAS POR ROL */}
        <section aria-labelledby="diplomas" className="space-y-4">
          <div>
            <h2 id="diplomas" className="text-2xl font-bold tracking-tight">Diplomas por rol profesional</h2>
            <p className="text-sm text-slate-500 dark:text-gray-400">Cada diploma reúne los certificados de los módulos que exige ese puesto.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SPECIALTY_DIPLOMAS.map(d => {
              const mods = (d.requiredModules.map(id => getModuleById(id)).filter(Boolean) as SyllabusModule[])
                .sort((a, b) => a.number - b.number);
              return (
                <details key={d.id} className="group rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#131a20] shadow-sm open:shadow-lg open:border-amber-500/50 transition-all">
                  <summary className="list-none cursor-pointer p-5 flex items-start gap-3">
                    <Award className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">{d.role}</p>
                      <h3 className="font-bold leading-snug">{d.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-gray-300 mt-1.5 leading-relaxed">{d.description}</p>
                      <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mt-2 flex items-center gap-1">
                        Ver sus {mods.length} módulos <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition-transform" aria-hidden="true" />
                      </p>
                    </div>
                  </summary>
                  <div className="px-5 pb-5">
                    <ul className="space-y-1">
                      {mods.map(m => (
                        <li key={m.id}>
                          <Link href={`/mi-aula/${m.id}`} className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-gray-800/50 text-xs hover:text-amber-600 dark:hover:text-amber-400">
                            <span className="truncate">Módulo {m.number}: {m.title}</span>
                            {m.id !== INDUCCION && !induccionCompleta && <Lock className="w-3 h-3 shrink-0 text-slate-400" aria-label="Bloqueado" />}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        {/* ⭐ CAPSTONE DE GRADO: SÚPER ANALISTA / CONSULTOR MÁSTER */}
        <section aria-labelledby="capstone-grado" className="rounded-3xl border-2 border-amber-500/60 bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 dark:from-amber-950/20 dark:via-[#131a20] dark:to-amber-950/10 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center gap-6 relative overflow-hidden">
          <div className="h-16 w-16 shrink-0 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500 shadow-inner">
            <Award className="w-9 h-9" aria-hidden="true" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest">
                Estrella de Grado · Titulación Máxima
              </span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                Módulo 30 (Proyecto Integrador)
              </span>
            </div>
            <h2 id="capstone-grado" className="text-xl sm:text-2xl font-extrabold font-display">
              {MASTER_PROGRAM.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
              {MASTER_PROGRAM.description} Simulación de una empresa real desde cero: parametrización de maestros, ciclo de compras, ventas, contabilidad, nómina y facturación electrónica, culminando con la defensa ante el Auditor IA.
            </p>
          </div>
          <Link
            href="/mi-aula/mod-24"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-extrabold shadow-lg hover:shadow-amber-500/25 transition-all active:scale-95 shrink-0"
          >
            <PlayCircle className="w-5 h-5" aria-hidden="true" />
            Ver Proyecto de Grado
          </Link>
        </section>

        {/* 3 · CATÁLOGO DE MÓDULOS (como el Atlas de Manuales) */}
        <section aria-labelledby="catalogo" className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 id="catalogo" className="text-2xl font-bold tracking-tight">Módulos</h2>
            {!induccionCompleta && (
              <p className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-400">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" /> Se abren al completar el Módulo 1
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SYLLABUS_BLOCKS.map(bloque => {
              const mods = OFFICIAL_SYLLABUS.filter(m => m.block === bloque && m.id !== INDUCCION);
              if (!mods.length) return null;
              const Icono = ICONO_BLOQUE[bloque];
              return (
                <details key={bloque} className="group rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#131a20] shadow-sm open:shadow-lg open:border-amber-500/50 transition-all">
                  <summary className="list-none cursor-pointer p-5 flex items-center gap-4">
                    <span className="h-11 w-11 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Icono className="w-5 h-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                    </span>
                    <div className="flex-1">
                      <h3 className="font-bold">{bloque}</h3>
                      <p className="text-xs text-slate-500 dark:text-gray-400">{mods.length} {mods.length === 1 ? 'módulo' : 'módulos'}</p>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-gray-400 flex items-center gap-1">
                      Ver <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" aria-hidden="true" />
                    </span>
                  </summary>
                  <ul className="px-4 pb-4 space-y-1.5">
                    {mods.map(m => {
                      const disponible = m.classes.length > 0;
                      const bloqueado = !induccionCompleta;
                      const contenido = (
                        <>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">Módulo {m.number}: {m.title}</p>
                            <p className="text-[11px] text-slate-500 dark:text-gray-400 truncate">
                              {disponible ? `${m.classes.length} clases · ${moduleMinutes(m)} min` : 'Próximamente'} · {m.certificateTitle.replace(/^Certificado en /, '')}
                            </p>
                          </div>
                          {bloqueado ? <Lock className="w-3.5 h-3.5 shrink-0 text-slate-400" aria-label="Bloqueado" /> : <ArrowRight className="w-3.5 h-3.5 shrink-0 text-amber-500" aria-hidden="true" />}
                        </>
                      );
                      return (
                        <li key={m.id}>
                          {disponible && !bloqueado ? (
                            <Link href={`/mi-aula/${m.id}`} className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-gray-800/40 hover:bg-amber-500/10 transition-colors">{contenido}</Link>
                          ) : (
                            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-gray-800/40 opacity-70">{contenido}</div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </details>
              );
            })}
          </div>
        </section>

        {/* Cómo se obtiene un certificado */}
        <section className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#131a20] p-5 flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
          <GraduationCap className="w-6 h-6 text-amber-500 shrink-0" aria-hidden="true" />
          <p className="text-slate-600 dark:text-gray-300 flex-1">
            Para certificar un módulo: completa sus clases, aprueba cada práctica en el simulador y supera la evaluación con Tutor IA.
            <span className="block text-xs text-slate-500 dark:text-gray-500 mt-1">
              B1 Academy es una institución de formación independiente; sus certificados no constituyen una certificación oficial de SAP SE.
            </span>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
