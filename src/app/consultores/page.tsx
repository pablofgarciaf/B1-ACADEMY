import type { Metadata } from "next";
import Link from "next/link";
import { UserCheck, Shield, CheckCircle, Award } from "lucide-react";
import { JsonLd } from "@/components/site/JsonLd";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

// Title 50-60 chars (Actual: 52 chars)
// Description 120-160 chars (Actual: 145 chars)
export const metadata: Metadata = {
  title: "Directorio de Consultores SAP Certificados | Academy",
  description:
    "Valida y contrata consultores especializados en SAP S/4HANA. Perfiles certificados con horas comprobadas de sandbox y proyectos de arquitectura ERP.",
  alternates: {
    canonical: "https://b1-academy.vercel.app/consultores",
  },
};

const profileSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: "Consultor Certificado SAP Academy",
    jobTitle: "Senior SAP Functional Architect",
    worksFor: {
      "@type": "Organization",
      name: "SAP Academy Network",
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      name: "SAP S/4HANA Master Professional",
    },
  },
};

export default function ConsultoresPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a] selection:bg-sap-blue selection:text-white">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <JsonLd data={profileSchema} />

        <aside aria-label="Directorio E-E-A-T" className="mb-8 p-4 rounded-2xl border border-sky-500/30 bg-sky-50/70 dark:bg-sky-950/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <strong>Acreditación Verificable:</strong> Todos los consultores listados han completado el programa de Consultor Premium y superado las auditorías técnicas de arquitectura S/4HANA.
        </aside>

        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
            Directorio Oficial de Consultores SAP Acreditados
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Perfiles profesionales con competencia probada en parametrización y consultoría empresarial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-sap-blue/20 text-sap-blue flex items-center justify-center font-bold text-lg">
              CR
            </div>
            <h2 className="font-bold text-base text-slate-900 dark:text-white">Carlos R. - Consultor Senior FICO</h2>
            <p className="text-xs text-slate-500">Certificación S/4HANA 2026 • 8 Años Exp.</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Especialista en integración bancaria, informes analíticos en Fiori y consolidación financiera.
            </p>
            <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center gap-1.5 text-xs text-emerald-500 font-semibold">
              <CheckCircle className="w-4 h-4" /> Certificado Verificado
            </div>
          </article>

          <article className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-lg">
              ML
            </div>
            <h2 className="font-bold text-base text-slate-900 dark:text-white">María L. - Consultora MM / SD</h2>
            <p className="text-xs text-slate-500">Certificación S/4HANA 2026 • 6 Años Exp.</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Optimizadora de compras corporativas, MRP, gestión de stocks y logística de distribución.
            </p>
            <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center gap-1.5 text-xs text-emerald-500 font-semibold">
              <CheckCircle className="w-4 h-4" /> Certificado Verificado
            </div>
          </article>

          <article className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-sky-500/20 text-sky-500 flex items-center justify-center font-bold text-lg">
              AT
            </div>
            <h2 className="font-bold text-base text-slate-900 dark:text-white">Alejandro T. - Arquitecto BTP</h2>
            <p className="text-xs text-slate-500">Certificación S/4HANA 2026 • 10 Años Exp.</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Especialista en extensiones Clean Core, APIs REST, microservicios y automatizaciones n8n.
            </p>
            <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center gap-1.5 text-xs text-emerald-500 font-semibold">
              <CheckCircle className="w-4 h-4" /> Certificado Verificado
            </div>
          </article>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-sm font-semibold text-sap-blue hover:underline">
            Volver a la Academia Principal
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
