import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/site/JsonLd";

// Title 50-60 chars (Actual: 53 chars)
// Description 120-160 chars (Actual: 146 chars)
export const metadata: Metadata = {
  title: "Blog Técnico y Recursos de Consultoría | SAP Academy",
  description:
    "Artículos especializados en parametrización SAP S/4HANA, directivas de migración Brownfield, tablas maestras y scripts de automatización con n8n.",
  alternates: {
    canonical: "https://sapacademy.es/blog",
  },
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Centro de Recursos y Blog Técnico SAP",
  description: "Artículos técnicos, guías de configuración y buenas prácticas en soluciones SAP.",
  url: "https://sapacademy.es/blog",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <JsonLd data={blogSchema} />

      <aside aria-label="Centro de Recursos Técnicos" className="mb-8 p-4 rounded-2xl border border-sky-500/30 bg-sky-50/70 dark:bg-sky-950/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
        <strong>Recursos Descargables:</strong> Guías de parametrización IMG, checklists de migración S/4HANA y flujogramas de integración con n8n disponibles para alumnos de la academia.
      </aside>

      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
          Centro de Recursos y Artículos Técnicos en SAP
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base">
          Investigaciones, mejores prácticas y guías paso a paso de consultoría de sistemas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <article className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] space-y-4 shadow-sm hover:border-sap-blue/40 transition-all">
          <div className="flex items-center gap-2 text-xs text-sap-blue font-semibold">
            <Calendar className="w-3.5 h-3.5" /> 10 de Septiembre, 2026 • Arquitectura S/4HANA
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Migración Brownfield vs Greenfield: Criterios para el 2026
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Análisis profundo sobre cuándo conviene transformar el sistema existente versus iniciar una instalación limpia en la nube.
          </p>
          <div className="pt-4 border-t border-slate-100 dark:border-white/5">
            <span className="text-xs font-semibold text-sap-blue hover:underline cursor-pointer">
              Leer artículo completo →
            </span>
          </div>
        </article>

        <article className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] space-y-4 shadow-sm hover:border-sap-blue/40 transition-all">
          <div className="flex items-center gap-2 text-xs text-amber-500 font-semibold">
            <Calendar className="w-3.5 h-3.5" /> 8 de Septiembre, 2026 • Automatización
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Integrando n8n con SAP BTP: Webhooks y Emisión de Credenciales
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Cómo configurar flujos reactivos que automaticen la verificación de aprobados y sincronicen ofertas en tiempo real.
          </p>
          <div className="pt-4 border-t border-slate-100 dark:border-white/5">
            <span className="text-xs font-semibold text-amber-500 hover:underline cursor-pointer">
              Leer artículo completo →
            </span>
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
