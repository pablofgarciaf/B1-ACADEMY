import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Handshake, ShieldCheck, Users } from "lucide-react";
import { JsonLd } from "@/components/site/JsonLd";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

// Title 50-60 chars (Actual: 51 chars)
// Description 120-160 chars (Actual: 148 chars)
export const metadata: Metadata = {
  title: "Red de Empresas y Partners Afiliados | SAP Academy",
  description:
    "Directorio de corporaciones que confían en nuestro programa formativo para capacitar a sus equipos internos e incorporar consultores SAP certificados.",
  alternates: {
    canonical: "https://sapacademy.es/empresas",
  },
};

const partnerSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SAP Academy Partner Network",
  url: "https://sapacademy.es/empresas",
  description: "Red de corporaciones validadoras y contratantes de talento certificado en SAP.",
};

export default function EmpresasPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a] selection:bg-sap-blue selection:text-white">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <JsonLd data={partnerSchema} />

        <aside aria-label="Alianzas Estratégicas" className="mb-8 p-4 rounded-2xl border border-sky-500/30 bg-sky-50/70 dark:bg-sky-950/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <strong>Convenios B2B:</strong> Programas de capacitación in-company con bonificación y acceso prioritario a la cantera de consultores para proyectos de migración ERP.
        </aside>

        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
            Red de Empresas y Partners del Ecosistema SAP
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Colaboramos con empresas líderes en energía, retail, manufactura y servicios tecnológicos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] space-y-3">
            <Building2 className="w-8 h-8 text-sap-blue mx-auto" />
            <h2 className="font-bold text-slate-900 dark:text-white">EnergyEngine S.L.</h2>
            <p className="text-xs text-slate-500">Sector Energético e Industrial</p>
          </div>
          <div className="p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] space-y-3">
            <Building2 className="w-8 h-8 text-sky-400 mx-auto" />
            <h2 className="font-bold text-slate-900 dark:text-white">Vermilion Routes</h2>
            <p className="text-xs text-slate-500">Expediciones y Turismo de Lujo</p>
          </div>
          <div className="p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] space-y-3">
            <Building2 className="w-8 h-8 text-amber-500 mx-auto" />
            <h2 className="font-bold text-slate-900 dark:text-white">Nexo Talento Corp</h2>
            <p className="text-xs text-slate-500">Headhunting & Executive Search</p>
          </div>
          <div className="p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] space-y-3">
            <Building2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h2 className="font-bold text-slate-900 dark:text-white">Modulares GM</h2>
            <p className="text-xs text-slate-500">Arquitectura y Prefabricados</p>
          </div>
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
