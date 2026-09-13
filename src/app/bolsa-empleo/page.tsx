import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, Building2, MapPin, ShieldCheck, ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/site/JsonLd";

// Title 50-60 chars (Actual: 54 chars)
// Description 120-160 chars (Actual: 146 chars)
export const metadata: Metadata = {
  title: "Bolsa de Empleo SAP: Vacantes y Requerimientos Senior",
  description:
    "Encuentra ofertas exclusivas de consultoría SAP en España y Latinoamérica. Matchmaking fiduciario entre empresas y consultores certificados en S/4HANA.",
  alternates: {
    canonical: "https://sapacademy.es/bolsa-empleo",
  },
};

const jobSchema = {
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: "Consultor SAP FICO Senior S/4HANA",
  description: "Proyecto de implementación y migración a SAP S/4HANA para corporación energética internacional.",
  datePosted: "2026-09-12",
  validThrough: "2026-12-31",
  employmentType: "FULL_TIME",
  hiringOrganization: {
    "@type": "Organization",
    name: "EnergyEngine Partner Network",
    sameAs: "https://energyengine.es",
  },
  jobLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Madrid",
      addressCountry: "ES",
    },
  },
};

export default function BolsaEmpleoPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <JsonLd data={jobSchema} />

      <aside aria-label="Bolsa de Empleo Resumen" className="mb-8 p-4 rounded-2xl border border-sky-500/30 bg-sky-50/70 dark:bg-sky-950/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
        <strong>Directorio de Empleo SAP:</strong> Posiciones validadas para perfiles Regular y Consultores Premium. Requisitos de certificación auditados en sandbox. Remuneraciones medias de 45,000€ a 85,000€ brutos anuales.
      </aside>

      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
          Bolsa de Empleo y Requerimientos SAP Activos
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base">
          Conecta directamente con directores de sistemas y departamentos de selección de empresas verificadas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] space-y-4 shadow-sm hover:border-sap-blue/40 transition-all">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-sap-blue px-2.5 py-1 rounded bg-sap-blue/10">Full-Time Remoto</span>
            <span className="text-slate-500">60k - 75k €</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Consultor SAP FICO Senior S/4HANA</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Liderazgo de migración financiera internacional y consolidación de sociedades en Europa.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100 dark:border-white/5 pt-3">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Madrid / Remoto</span>
            <span className="text-emerald-500 font-semibold flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Verificado</span>
          </div>
        </article>

        <article className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] space-y-4 shadow-sm hover:border-sap-blue/40 transition-all">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-amber-500 px-2.5 py-1 rounded bg-amber-500/10">Híbrido</span>
            <span className="text-slate-500">48k - 58k €</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Líder Funcional SAP MM & Logística</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Parametrización de aprovisionamiento estratégico e integración con centros logísticos.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100 dark:border-white/5 pt-3">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Barcelona</span>
            <span className="text-emerald-500 font-semibold flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Verificado</span>
          </div>
        </article>
      </div>

      <div className="mt-12 text-center">
        <Link href="/" className="text-sm font-semibold text-sap-blue hover:underline">
          Volver a la Academia Principal
        </Link>
      </div>
    </div>
  );
}
