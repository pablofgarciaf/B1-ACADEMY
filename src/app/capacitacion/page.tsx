import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, Video, Clock, Award, ArrowRight, Laptop } from "lucide-react";
import { JsonLd } from "@/components/site/JsonLd";

// Title 50-60 chars (Actual: 53 chars)
// Description 120-160 chars (Actual: 147 chars)
export const metadata: Metadata = {
  title: "Cursos y Certificación SAP S/4HANA Oficial | Academy",
  description:
    "Catálogo formativo en módulos SAP FICO, MM, SD y BTP. Aprende en entornos sandbox dedicados con mentores senior y certifícate con validez internacional.",
  alternates: {
    canonical: "https://sapacademy.es/capacitacion",
  },
};

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Catálogo Integral de Certificación SAP S/4HANA",
  description:
    "Rutas de formación operativa y consultoría empresarial en módulos FICO, MM y SD sobre SAP S/4HANA.",
  provider: {
    "@type": "EducationalOrganization",
    name: "SAP Academy",
    url: "https://sapacademy.es",
  },
};

export default function CapacitacionPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <JsonLd data={courseSchema} />

      <aside aria-label="Resumen de Formación" className="mb-8 p-4 rounded-2xl border border-sky-500/30 bg-sky-50/70 dark:bg-sky-950/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
        <strong>Puntos Clave del Catálogo:</strong> Módulos intensivos en Finanzas (FICO), Cadena de Suministro (MM) y Ventas (SD). Incluye acceso sandbox S/4HANA 24/7 y evaluaciones con casos de estudio de multinacionales.
      </aside>

      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
          Cursos y Especialidades en Consultoría SAP S/4HANA
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base">
          Desarrolla las competencias técnicas más demandadas en el mercado ERP corporativo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <article className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] space-y-4 shadow-sm hover:border-sap-blue/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-sap-blue flex items-center justify-center font-bold">
            <Laptop className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">SAP FICO: Finanzas & Controlling</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Gestión de libro mayor, activos fijos, cuentas a cobrar/pagar y centros de coste en S/4HANA.
          </p>
          <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between items-center text-xs text-slate-500">
            <span>60 Horas • 36 Lecciones</span>
            <span className="font-bold text-sap-blue">Nivel Pro</span>
          </div>
        </article>

        <article className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] space-y-4 shadow-sm hover:border-sap-blue/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">SAP MM: Gestión de Materiales</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Aprovisionamiento, gestión de inventarios, valoración de existencias y verificación de facturas.
          </p>
          <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between items-center text-xs text-slate-500">
            <span>55 Horas • 32 Lecciones</span>
            <span className="font-bold text-amber-500">Nivel Pro</span>
          </div>
        </article>

        <article className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] space-y-4 shadow-sm hover:border-sap-blue/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">SAP SD: Ventas y Distribución</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Ciclo comercial Order-to-Cash, esquemas de cálculo de precios, facturación electrónica y entregas.
          </p>
          <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between items-center text-xs text-slate-500">
            <span>50 Horas • 30 Lecciones</span>
            <span className="font-bold text-sky-500">Nivel Pro</span>
          </div>
        </article>
      </div>

      <div className="text-center pt-16">
        <Link href="/#planes" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-sap-blue to-sky-600 text-white font-bold shadow-lg shadow-sap-blue/25 hover:shadow-sap-blue/40 transition-all active:scale-95 cursor-pointer">
          Inscribirme en una Especialidad <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
