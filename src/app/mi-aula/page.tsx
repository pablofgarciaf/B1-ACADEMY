"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap, Award, ArrowRight, ChevronDown, Lock, CheckCircle2, Compass, Package, ShoppingCart,
  Landmark, Factory, Settings2, Flag, PlayCircle, Building2, ShieldCheck, Wrench, Sparkles,
} from 'lucide-react';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import {
  SPECIALTY_DIPLOMAS, OFFICIAL_SYLLABUS, SYLLABUS_BLOCKS, MASTER_PROGRAM, getModuleById, moduleMinutes,
  type SyllabusBlock, type SyllabusModule,
} from '@/lib/curriculum-data';
import { useAuth } from '@/context/AuthContext';
import { getCompany } from '@/lib/firestore-company';

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

  // Progreso del Módulo 1 y verificación de empresa B1 Center:
  // Sin empresa B1 Center creada en el Paso 0, NUNCA se desbloquean los demás módulos.
  const [hechasInduccion, setHechasInduccion] = useState<number | null>(null);
  const [tieneEmpresa, setTieneEmpresa] = useState<boolean | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    let activo = true;
    currentUser.getIdToken()
      .then(token => fetch(`/api/progress?moduleId=${INDUCCION}`, { headers: { Authorization: `Bearer ${token}` } }))
      .then(r => (r.ok ? r.json() : { completedClasses: [] }))
      .then((d: { completedClasses?: string[] }) => { if (activo) setHechasInduccion((d.completedClasses ?? []).length); })
      .catch(() => { if (activo) setHechasInduccion(0); });

    getCompany(currentUser.uid)
      .then(s => { if (activo) setTieneEmpresa(Boolean(s?.profile && s.profile.companyName)); })
      .catch(() => { if (activo) setTieneEmpresa(false); });

    return () => { activo = false; };
  }, [currentUser]);

  const esEquipo = ['super', 'admin', 'docente'].includes(userProfile?.role ?? '');
  const totalInduccion = induccion.classes.length;
  // Regla Zero Trust: Inducción exige que la empresa B1 Center exista Y que se hayan completado las clases
  const induccionCompleta = Boolean(tieneEmpresa) && (esEquipo || (hechasInduccion ?? 0) >= totalInduccion);
  const nombre = (userProfile?.displayName || userProfile?.name || '').split(' ')[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-gray-100 transition-colors">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        {/* Cápsula GEO */}
        <aside aria-label="Resumen de Mi Aula" className="sr-only">
          Mi Aula de B1 Academy: escuela de Finix ERP 10.0 con módulos prácticos, cada uno con certificado de
          competencia verificable, diplomas por rol profesional, clases narradas, prácticas en simulador y evaluación final.
        </aside>

        {/* Encabezado */}
        <header className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            {nombre ? `Hola, ${nombre}` : 'Escuela Finix ERP'}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display">
            Mi Aula Virtual: Escuela y Clases Finix ERP 10.0
          </h1>
          <div className="flex flex-wrap gap-2 pt-2">
            <Link href="/simulador" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#131a20] border border-slate-200 dark:border-gray-800 text-xs font-semibold hover:border-amber-500/50 transition-all active:scale-95">
              <Wrench className="w-4 h-4 text-blue-500" aria-hidden="true" /> Simulador Finix ERP
            </Link>
            <Link href="/verificar" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#131a20] border border-slate-200 dark:border-gray-800 text-xs font-semibold hover:border-amber-500/50 transition-all active:scale-95">
              <ShieldCheck className="w-4 h-4 text-emerald-500" aria-hidden="true" /> Verificar un certificado
            </Link>
          </div>
        </header>

        {/* RUTA COMERCIAL & VENTAS ERP (FAST-TRACK) */}
        <section aria-labelledby="ruta-comercial" className="rounded-3xl border-2 border-blue-500/50 bg-gradient-to-r from-blue-900/20 via-slate-900/40 to-amber-900/20 bg-white dark:bg-[#131a20] p-6 sm:p-8 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 shrink-0 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/40 text-blue-500 dark:text-blue-400">
              <Sparkles className="w-7 h-7" aria-hidden="true" />
            </div>
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500 text-white dark:text-slate-950 shadow-sm">
                  Ruta Comercial · Acceso Directo
                </span>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  45 min de Punta a Punta · 7 Misiones Prácticas
                </span>
              </div>
              <h2 id="ruta-comercial" className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Taller Maestro de Operaciones y Demostración Comercial Finix ERP
              </h2>
              <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                Diseñado para personal de ventas y consultores de preventa: opera el flujo comercial completo (Socios, Cotización, Pedido, Facturación SRI IVA 15%, Cobro y Mapa de Relaciones) y aprende a comunicar con éxito los beneficios, el ROI y rebatir las 5 objeciones más comunes ante clientes.
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-500 dark:text-gray-400 font-medium">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700/50">
                  ✓ Alta y calificación de clientes
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700/50">
                  ✓ Reserva automática de stock
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700/50">
                  ✓ Facturación electrónica SRI 2026
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700/50">
                  ✓ Trazabilidad en Mapa de Relaciones
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <Link
              href="/mi-aula/mod-ventas"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-95 text-center"
            >
              <PlayCircle className="w-4 h-4" aria-hidden="true" />
              Iniciar Taller de Ventas
            </Link>
            <Link
              href="/mi-aula/mod-ventas/oral-exam"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-blue-500/30 hover:border-blue-500 text-slate-800 dark:text-gray-200 text-xs font-semibold transition-all active:scale-95 text-center"
            >
              <Award className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
              Evaluación & Certificado
            </Link>
          </div>
        </section>

        {/* 1 · EMPIEZA AQUÍ: Módulo 1 obligatorio */}
        <section aria-labelledby="empieza" className="rounded-3xl border border-amber-500/40 bg-white dark:bg-[#131a20] p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center gap-6">
          <div className="h-14 w-14 shrink-0 rounded-2xl bg-amber-500/15 flex items-center justify-center">
            {induccionCompleta ? <CheckCircle2 className="w-7 h-7 text-emerald-500" aria-hidden="true" /> : <Building2 className="w-7 h-7 text-amber-600 dark:text-amber-400" aria-hidden="true" />}
          </div>
          <div className="flex-1 space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Empieza aquí · Obligatorio</p>
            <h2 id="empieza" className="text-xl sm:text-2xl font-bold">Módulo 1: {induccion.title}</h2>
            <p className="text-sm text-slate-600 dark:text-gray-300">
              Creas tu empresa de práctica y aprendes a moverte en Finix ERP. Al completarlo se abren todos los demás módulos.
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
            {induccionCompleta ? 'Repasar' : tieneEmpresa === false ? 'Crear Empresa (Paso 0)' : (hechasInduccion ?? 0) > 0 ? 'Continuar' : 'Comenzar'}
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
                      {mods.map(m => {
                        const bloqueado = m.id !== INDUCCION && !induccionCompleta;
                        return (
                          <li key={m.id}>
                            {!bloqueado ? (
                              <Link href={`/mi-aula/${m.id}`} className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-gray-800/50 text-xs hover:text-amber-600 dark:hover:text-amber-400">
                                <span className="truncate">Módulo {m.number}: {m.title}</span>
                              </Link>
                            ) : (
                              <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-gray-800/50 text-xs opacity-60 cursor-not-allowed text-slate-500">
                                <span className="truncate">Módulo {m.number}: {m.title}</span>
                                <Lock className="w-3 h-3 shrink-0 text-slate-400" aria-label="Bloqueado" />
                              </div>
                            )}
                          </li>
                        );
                      })}
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
          {induccionCompleta ? (
            <Link
              href="/mi-aula/mod-30"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-extrabold shadow-lg hover:shadow-amber-500/25 transition-all active:scale-95 shrink-0"
            >
              <PlayCircle className="w-5 h-5" aria-hidden="true" />
              Ver Proyecto de Grado
            </Link>
          ) : (
            <div
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-200 dark:bg-gray-800 text-slate-500 dark:text-gray-400 text-sm font-bold opacity-60 cursor-not-allowed shrink-0"
            >
              <Lock className="w-4 h-4" aria-hidden="true" />
              Bloqueado (Completa Inducción)
            </div>
          )}
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
              const mods = OFFICIAL_SYLLABUS.filter(m => m.block === bloque && m.id !== INDUCCION && m.id !== 'mod-ventas');
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
              Los certificados acreditan competencias prácticas demostradas en el simulador y en la evaluación con Tutor IA.
            </span>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
