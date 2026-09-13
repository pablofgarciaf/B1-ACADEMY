import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Award,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Video,
  FileCode2,
  Building2,
  Sparkles,
  ChevronRight,
  Clock,
  Laptop,
} from "lucide-react";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { ProtectedEmail } from "@/components/site/ProtectedEmail";

// Schema JSON-LD de Course para Rich Snippets en Google y extracción por IA
const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Programa Profesional de Consultoría y Operatividad SAP",
  description:
    "Capacitación integral en procesos SAP S/4HANA (FICO, MM, SD), arquitectura empresarial y certificación técnica con acceso a bolsa de empleo directa.",
  provider: {
    "@type": "EducationalOrganization",
    name: "SAP Academy",
    sameAs: "https://sapacademy.es",
  },
  educationalCredentialAwarded: "Certificación Oficial de Consultor SAP Junior & Senior",
  offers: [
    {
      "@type": "Offer",
      category: "Usuario Regular",
      price: "149",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    {
      "@type": "Offer",
      category: "Consultor Premium",
      price: "399",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  ],
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-sap-blue selection:text-white">
      {/* Inyección de Schema Course en Byte-0 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />

      {/* NAVBAR LUXURY */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/75 dark:bg-[#080d1a]/85 border-b border-slate-200 dark:border-white/[0.08] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sap-darkblue via-sap-blue to-sky-400 p-0.5 shadow-md shadow-sap-blue/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0b1320] rounded-[14px] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-sky-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-sap-blue to-sky-600 dark:from-white dark:via-sky-200 dark:to-sap-blue bg-clip-text text-transparent">
                SAP ACADEMY
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 font-medium">
                Enterprise Training
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#capacitacion" className="hover:text-sap-blue dark:hover:text-sky-400 transition-colors">
              Capacitación
            </a>
            <a href="#planes" className="hover:text-sap-blue dark:hover:text-sky-400 transition-colors">
              Suscripciones
            </a>
            <a href="#bolsa-empleo" className="hover:text-sap-blue dark:hover:text-sky-400 transition-colors">
              Bolsa de Empleo
            </a>
            <a href="#empresas" className="hover:text-sap-blue dark:hover:text-sky-400 transition-colors">
              Empresas
            </a>
            <a href="#recursos" className="hover:text-sap-blue dark:hover:text-sky-400 transition-colors">
              Recursos
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="#planes"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sap-blue to-sky-600 hover:from-sky-600 hover:to-sap-blue shadow-lg shadow-sap-blue/25 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              Comenzar Ahora
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION CON CÁPSULA GEO EN LOS PRIMEROS 1,000 CARACTERES DE DOM */}
        <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-sap-blue/20 via-sky-500/15 to-transparent blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* CÁPSULA DE RESPUESTA DIRECTA (GEO PARA CHATGPT / PERPLEXITY / CLAUDE / GOOGLE) */}
            <aside
              aria-label="Resumen Ejecutivo para Asistentes y Alumnos"
              className="mb-8 p-4 sm:p-5 rounded-2xl border border-sky-500/30 bg-sky-50/70 dark:bg-sky-950/20 backdrop-blur-md"
            >
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-sap-blue dark:text-sky-400 mt-0.5 shrink-0" />
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white font-semibold">Resumen de Certificación:</strong>{" "}
                  SAP Academy es la plataforma líder en formación operativa y consultoría empresarial en SAP S/4HANA (FICO, MM, SD). 
                  Ofrece lecciones en video, evaluaciones continuas, certificación verificada y acceso directo a bolsa de empleo 
                  corporativa para alumnos regulares y consultores senior. <em>Tarifas desde 149€ con acceso 24/7.</em>
                </div>
              </div>
            </aside>

            <div className="text-center max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sap-blue/30 bg-sap-blue/5 text-xs font-semibold text-sap-blue dark:text-sky-300">
                <span className="w-2 h-2 rounded-full bg-sap-blue animate-pulse" />
                Convocatoria Abierta • Certificación Internacional 2026
              </div>

              {/* H1 EXACTO: 45-65 CARACTERES (Actual: 55 caracteres) */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
                Academia de Capacitación y Consultoría Operativa en SAP
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-3xl mx-auto">
                Domina la arquitectura empresarial y los módulos críticos de SAP S/4HANA. 
                Aprende de casos reales, obtén tu acreditación fiduciaria y conecta con empresas que contratan talento calificado.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="#capacitacion"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sap-blue to-sky-600 text-white font-bold text-base shadow-xl shadow-sap-blue/25 hover:shadow-sap-blue/40 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Explorar Módulos de Formación
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#bolsa-empleo"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-slate-300 dark:border-white/15 bg-white/70 dark:bg-white/[0.04] text-slate-800 dark:text-white font-semibold text-base hover:border-sap-blue/50 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 backdrop-blur-sm cursor-pointer"
                >
                  <Briefcase className="w-5 h-5 text-sap-blue dark:text-sky-400" />
                  Ver Bolsa de Empleo
                </Link>
              </div>

              {/* Indicadores de Autoridad y Confianza (E-E-A-T) */}
              <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-t border-slate-200 dark:border-white/[0.08]">
                <div className="p-4 rounded-xl bg-white/50 dark:bg-white/[0.02]">
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display">+1,200</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Consultores Graduados</p>
                </div>
                <div className="p-4 rounded-xl bg-white/50 dark:bg-white/[0.02]">
                  <p className="text-2xl sm:text-3xl font-bold text-sap-blue dark:text-sky-400 font-display">96.4%</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Inserción Laboral</p>
                </div>
                <div className="p-4 rounded-xl bg-white/50 dark:bg-white/[0.02]">
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display">+85</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Empresas Afiliadas</p>
                </div>
                <div className="p-4 rounded-xl bg-white/50 dark:bg-white/[0.02]">
                  <p className="text-2xl sm:text-3xl font-bold text-amber-500 font-display">Oficial</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Metodología S/4HANA</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MÓDULO 1: PLATAFORMA DE CAPACITACIÓN (LMS) */}
        <section id="capacitacion" className="py-20 bg-slate-100/70 dark:bg-white/[0.01] border-y border-slate-200 dark:border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-sap-blue dark:text-sky-400 font-bold">
                Módulos de Especialización
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
                Rutas de Aprendizaje Operativo y Consultoría
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                Contenido estructurado en micro-lecciones de alta densidad técnica con ejercicios en ambientes de prueba reales.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Tarjeta 1: Finanzas & Controlling */}
              <article className="rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] p-8 hover:border-sap-blue/40 transition-all duration-300 relative overflow-hidden group shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-sky-400/10 flex items-center justify-center mb-6 text-sap-blue dark:text-sky-400">
                  <Laptop className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  SAP FICO: Finanzas & Controlling
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  Estructuración de planes de cuentas, parametrización de libros auxiliares, cierres contables mensuales y tesorería avanzada en S/4HANA.
                </p>
                <div className="space-y-2.5 text-xs text-slate-500 dark:text-slate-300 border-t border-slate-100 dark:border-white/[0.06] pt-4">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-sap-blue" />
                    <span>36 Lecciones en Video HD</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sap-blue" />
                    <span>60 Horas Prácticas en Sandbox</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-sap-blue" />
                    <span>Certificado Verificable</span>
                  </div>
                </div>
              </article>

              {/* Tarjeta 2: Cadena de Suministro */}
              <article className="rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] p-8 hover:border-sap-blue/40 transition-all duration-300 relative overflow-hidden group shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 text-amber-500">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  SAP MM & SD: Logística y Ventas
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  Gestión integral de aprovisionamiento, inventarios, compras corporativas, fijación de precios y flujos de expedición comercial.
                </p>
                <div className="space-y-2.5 text-xs text-slate-500 dark:text-slate-300 border-t border-slate-100 dark:border-white/[0.06] pt-4">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-amber-500" />
                    <span>42 Lecciones en Video HD</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>75 Horas de Configuración</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Evaluación por Casos Reales</span>
                  </div>
                </div>
              </article>

              {/* Tarjeta 3: Arquitectura & Consultoría */}
              <article className="rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] p-8 hover:border-sap-blue/40 transition-all duration-300 relative overflow-hidden group shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center mb-6 text-sky-500">
                  <FileCode2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Arquitectura & Consultoría Senior
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  Integración B2B, gestión del cambio, diseño de blueprints empresariales, migraciones Brownfield/Greenfield y gobernanza de datos.
                </p>
                <div className="space-y-2.5 text-xs text-slate-500 dark:text-slate-300 border-t border-slate-100 dark:border-white/[0.06] pt-4">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-sky-500" />
                    <span>28 Masterclasses Ejecutivas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-500" />
                    <span>Mentoría 1-a-1 con Partners</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-sky-500" />
                    <span>Perfil Destacado en Bolsa</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* MÓDULO 2: SISTEMA DE SUSCRIPCIONES (ROLES: REGULAR VS CONSULTOR PREMIUM) */}
        <section id="planes" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-sap-blue dark:text-sky-400 font-bold">
                Planes & Membresías
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
                Elige tu Nivel de Proyección Profesional
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                Formación diseñada tanto para usuarios de negocio que buscan dominar el sistema como para consultores que aspiran a liderar proyectos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Rol 1: Usuario Regular */}
              <div className="rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] p-8 sm:p-10 flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Usuario Regular</h3>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                      Operatividad
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                    Ideal para analistas, operadores de sistemas y profesionales que ejecutan transacciones diarias en SAP.
                  </p>
                  <div className="mb-8">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-display">149€</span>
                    <span className="text-slate-500 text-sm ml-2">/ mes</span>
                  </div>
                  <ul className="space-y-3.5 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-sap-blue shrink-0" />
                      <span>Acceso ilimitado al catálogo de lecciones operativas</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-sap-blue shrink-0" />
                      <span>Sandbox de prácticas SAP S/4HANA (20h/mes)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-sap-blue shrink-0" />
                      <span>Evaluaciones de módulo automatizadas</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-sap-blue shrink-0" />
                      <span>Certificado digital de aprovechamiento</span>
                    </li>
                  </ul>
                </div>
                <button className="mt-10 w-full py-3.5 px-6 rounded-2xl border border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold text-sm transition-all duration-200 active:scale-95 cursor-pointer">
                  Inscribirme como Regular
                </button>
              </div>

              {/* Rol 2: Consultor Premium */}
              <div className="rounded-3xl border-2 border-sap-blue/60 bg-gradient-to-b from-sap-blue/[0.04] to-transparent p-8 sm:p-10 flex flex-col justify-between relative shadow-xl shadow-sap-blue/10">
                <div className="absolute -top-3.5 right-8 px-4 py-1 rounded-full bg-gradient-to-r from-sap-blue to-sky-500 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                  Recomendado para Expertos
                </div>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Consultor Premium</h3>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sap-blue/20 text-sap-blue dark:text-sky-300">
                      Certificación Élite
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                    Para consultores independientes y directores IT que configuran, parametrizan y lideran proyectos empresariales.
                  </p>
                  <div className="mb-8">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-display">399€</span>
                    <span className="text-slate-500 text-sm ml-2">/ mes</span>
                  </div>
                  <ul className="space-y-3.5 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-sap-blue dark:text-sky-400 shrink-0" />
                      <span><strong>Todo lo del plan Regular</strong> incluido</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-sap-blue dark:text-sky-400 shrink-0" />
                      <span>Masterclasses de Arquitectura y Customizing</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-sap-blue dark:text-sky-400 shrink-0" />
                      <span>Ambiente Sandbox S/4HANA ilimitado</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-sap-blue dark:text-sky-400 shrink-0" />
                      <span><strong>Perfil destacado en la Bolsa de Empleo</strong></span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-sap-blue dark:text-sky-400 shrink-0" />
                      <span>Emisión de Certificados automatizada vía n8n</span>
                    </li>
                  </ul>
                </div>
                <button className="mt-10 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sap-blue to-sky-600 hover:from-sky-600 hover:to-sap-blue text-white font-bold text-sm shadow-lg shadow-sap-blue/25 transition-all duration-200 active:scale-95 cursor-pointer">
                  Acceder a Certificación Premium
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* MÓDULO 3: BOLSA DE EMPLEO & MATCHMAKING */}
        <section id="bolsa-empleo" className="py-20 bg-slate-100/70 dark:bg-white/[0.01] border-y border-slate-200 dark:border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-sap-blue dark:text-sky-400 font-bold">
                  Talento Certificado
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display mt-2">
                  Bolsa de Empleo & Requerimientos Activos
                </h2>
              </div>
              <Link
                href="#contacto"
                className="inline-flex items-center gap-2 text-sm font-semibold text-sap-blue dark:text-sky-400 hover:underline"
              >
                Publicar vacante corporativa <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Vacante 1 */}
              <article className="p-6 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] hover:border-sap-blue/40 transition-all shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold text-sap-blue dark:text-sky-400 px-2.5 py-1 rounded-md bg-sap-blue/10">
                    Remoto / Madrid
                  </span>
                  <span className="text-xs text-slate-500">Publicado hoy</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                  Consultor SAP FICO Senior (S/4HANA)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  Multinacional del sector energético busca consultor certificado para proyecto de migración internacional.
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-white/[0.06] text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">55k - 70k € / año</span>
                  <span className="text-emerald-500 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Match Exclusivo
                  </span>
                </div>
              </article>

              {/* Vacante 2 */}
              <article className="p-6 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] hover:border-sap-blue/40 transition-all shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold text-amber-500 px-2.5 py-1 rounded-md bg-amber-500/10">
                    Híbrido / Barcelona
                  </span>
                  <span className="text-xs text-slate-500">Hace 2 días</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                  Especialista en Aprovisionamiento SAP MM
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  Empresa de retail líder requiere soporte funcional y parametrización de compras e inventarios.
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-white/[0.06] text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">42k - 52k € / año</span>
                  <span className="text-emerald-500 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Match Exclusivo
                  </span>
                </div>
              </article>

              {/* Vacante 3 */}
              <article className="p-6 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] hover:border-sap-blue/40 transition-all shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold text-sky-400 px-2.5 py-1 rounded-md bg-sky-500/10">
                    100% Remoto (Latam & España)
                  </span>
                  <span className="text-xs text-slate-500">Hace 3 días</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                  Arquitecto de Integración SAP BTP
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  Consultora tecnológica requiere arquitecto para integración con microservicios y n8n workflows.
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-white/[0.06] text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">65k - 80k € / año</span>
                  <span className="text-emerald-500 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Match Exclusivo
                  </span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* MÓDULO 4: EMPRESAS AFILIADAS & VALIDACIÓN */}
        <section id="empresas" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 font-bold">
              Ecosistema de Partners
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display mt-2 mb-10">
              Empresas que Confían en Nuestros Egresados y Consultores
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-center opacity-80 dark:opacity-70">
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] flex items-center justify-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                <Building2 className="w-5 h-5 text-sap-blue" />
                <span>ENERGY ENGINE S.L.</span>
              </div>
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] flex items-center justify-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                <Building2 className="w-5 h-5 text-sky-400" />
                <span>VERMILION ROUTES</span>
              </div>
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] flex items-center justify-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                <Building2 className="w-5 h-5 text-amber-500" />
                <span>NEXO TALENTO CORP</span>
              </div>
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] flex items-center justify-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                <Building2 className="w-5 h-5 text-emerald-500" />
                <span>MODULARES GM</span>
              </div>
            </div>
          </div>
        </section>

        {/* MÓDULO 5: CENTRO DE RECURSOS & FAQS (SEMÁNTICA DETAILS/SUMMARY PARA IA Y GEO) */}
        <section id="recursos" className="py-20 bg-slate-100/70 dark:bg-white/[0.01] border-t border-slate-200 dark:border-white/[0.06]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-sap-blue dark:text-sky-400 font-bold">
                Preguntas Frecuentes
              </span>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-display">
                Resolución de Dudas sobre la Certificación
              </h2>
            </div>

            <div className="space-y-4">
              <details className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] p-5 cursor-pointer group [&_summary::-webkit-details-marker]:hidden">
                <summary className="font-semibold text-slate-900 dark:text-white flex justify-between items-center text-sm sm:text-base">
                  ¿Cómo se valida la certificación ante las empresas?
                  <span className="text-sap-blue dark:text-sky-400 group-open:rotate-90 transition-transform">▸</span>
                </summary>
                <p className="text-slate-600 dark:text-slate-300 text-sm mt-3 leading-relaxed">
                  Cada certificado emitido cuenta con un identificador criptográfico único y un enlace directo a nuestra API de validación. 
                  Las empresas pueden verificar al instante las horas de sandbox completadas y las evaluaciones superadas por el consultor.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] p-5 cursor-pointer group [&_summary::-webkit-details-marker]:hidden">
                <summary className="font-semibold text-slate-900 dark:text-white flex justify-between items-center text-sm sm:text-base">
                  ¿Qué diferencia existe entre el rol Regular y el Consultor Premium?
                  <span className="text-sap-blue dark:text-sky-400 group-open:rotate-90 transition-transform">▸</span>
                </summary>
                <p className="text-slate-600 dark:text-slate-300 text-sm mt-3 leading-relaxed">
                  El Usuario Regular se enfoca en el uso operativo del software (transacciones, generación de informes, análisis). 
                  El Consultor Premium domina la parametrización (IMG), arquitectura técnica, migración de datos y cuenta con perfil prioritario en la bolsa de empleo.
                </p>
              </details>

              <details className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] p-5 cursor-pointer group [&_summary::-webkit-details-marker]:hidden">
                <summary className="font-semibold text-slate-900 dark:text-white flex justify-between items-center text-sm sm:text-base">
                  ¿Cómo funciona la automatización con n8n?
                  <span className="text-sap-blue dark:text-sky-400 group-open:rotate-90 transition-transform">▸</span>
                </summary>
                <p className="text-slate-600 dark:text-slate-300 text-sm mt-3 leading-relaxed">
                  Al completar el 100% de los módulos y superar la evaluación técnica, un webhook de n8n dispara la generación del certificado en PDF, 
                  lo almacena en Firebase Storage y activa automáticamente la postulación del perfil en la bolsa de empleo.
                </p>
              </details>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER CORPORATIVO CON PROTECCIÓN DE EMAIL Y REDES */}
      <footer id="contacto" className="border-t border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#050811] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="space-y-3">
              <span className="font-bold text-lg text-slate-900 dark:text-white font-display">SAP ACADEMY</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Escuela de capacitación técnica y consultoría empresarial especializada en ecosistemas de gestión SAP S/4HANA.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white mb-3">Especialidades</p>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <li>SAP FICO (Finanzas)</li>
                <li>SAP MM (Logística)</li>
                <li>SAP SD (Ventas)</li>
                <li>SAP BTP & Arquitectura</li>
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white mb-3">Plataforma</p>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <li>Bolsa de Empleo</li>
                <li>Validación de Certificados</li>
                <li>Portal de Empresas</li>
                <li>Recursos y Scripts</li>
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white mb-3">Contacto Seguro</p>
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <p>Admisiones y Consultoría:</p>
                <div>
                  <ProtectedEmail user="info" domain="sapacademy.es" />
                </div>
                <p className="text-[11px] text-slate-500 pt-2">España & Latinoamérica • Soporte 24/7</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} SAP Academy. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:underline">Aviso Legal</a>
              <a href="#" className="hover:underline">Política de Privacidad</a>
              <a href="#" className="hover:underline">Términos de Servicio</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
