import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, SearchCheck } from 'lucide-react';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';

export const metadata: Metadata = {
  title: 'Verificación de constancias y consultores',
  description: 'Consulta la autenticidad de una constancia de B1 Academy por su código y conoce cómo se evaluarán las competencias de cada perfil.',
  alternates: { canonical: '/consultores' },
  robots: { index: false, follow: true },
};

export default function ConsultoresPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a] text-slate-900 dark:text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 px-3 py-1 text-xs font-bold text-finix-blue dark:text-sky-300"><BadgeCheck className="h-4 w-4" /> Verificación de B1 Academy</span>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Comprueba una constancia antes de confiar en ella</h1>
          <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">Si una persona te presenta una constancia emitida por B1 Academy, usa el código impreso para consultar su autenticidad. La consulta confirma el documento; no sustituye una entrevista ni acredita experiencia laboral externa.</p>
          <Link href="/verificar" className="inline-flex items-center gap-2 rounded-xl bg-finix-blue px-6 py-3 text-sm font-bold text-white hover:bg-sky-600">Verificar por código <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-white/10 dark:bg-white/[0.03]">
            <SearchCheck className="h-7 w-7 text-finix-blue" />
            <h2 className="mt-4 text-lg font-bold">Qué puedes comprobar</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">El estado, nombre del titular, título y fecha que constan en el registro de la academia. Los resultados de exámenes y el progreso individual son privados.</p>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-white/10 dark:bg-white/[0.03]">
            <BadgeCheck className="h-7 w-7 text-emerald-500" />
            <h2 className="mt-4 text-lg font-bold">Perfiles profesionales</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">El directorio de personas se publicará cuando exista autorización de cada participante y una verificación individual de sus datos y competencias.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
