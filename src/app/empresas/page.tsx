import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building2, BookOpen, PanelsTopLeft, ShieldCheck } from 'lucide-react';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { BusinessLeadForm } from '@/components/site/BusinessLeadForm';

export const metadata: Metadata = {
  title: 'Formación ERP para equipos de empresas | Finix Academy',
  description: 'Explora las rutas de Finix Academy para equipos que necesitan practicar compras, ventas, operaciones y finanzas en un simulador educativo.',
  alternates: { canonical: '/empresas' },
};

export default function EmpresasPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a] text-slate-900 dark:text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 px-3 py-1 text-xs font-bold text-finix-blue dark:text-sky-300"><Building2 className="h-4 w-4" /> Para equipos de pymes</span>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Formación ERP para aprender procesos completos</h1>
          <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">Las rutas de Finix Academy permiten estudiar funciones empresariales y practicar en un entorno separado de los sistemas reales. Elige las áreas relevantes para tu equipo y revisa el temario antes de comenzar.</p>
          <Link href="#solicitud" className="inline-flex items-center gap-2 rounded-xl bg-finix-blue px-6 py-3 text-sm font-bold text-white hover:bg-sky-600">Solicitar capacitación <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { icon: BookOpen, title: 'Aprender', text: 'Clases guiadas por función, con manuales y objetivos de cada módulo.' },
            { icon: PanelsTopLeft, title: 'Practicar', text: 'Ejercicios de compras, ventas, producción y finanzas en un laboratorio educativo.' },
            { icon: ShieldCheck, title: 'Comprobar', text: 'Constancias de la academia consultables mediante un código de verificación.' },
          ].map(({ icon: Icon, title, text }) => (
            <section key={title} className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-white/10 dark:bg-white/[0.03]">
              <Icon className="h-7 w-7 text-finix-blue" />
              <h2 className="mt-4 text-lg font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{text}</p>
            </section>
          ))}
        </div>
        <BusinessLeadForm />
      </main>
      <Footer />
    </div>
  );
}
