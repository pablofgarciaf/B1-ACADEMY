import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';

export const metadata: Metadata = {
  // absolute: evita que la plantilla del layout agregue "| SAP Academy" y pase de 60 caracteres (51).
  title: { absolute: 'Verificar Certificado SAP Business One | B1 Academy' },
  description: 'Ingresa el código de un certificado de B1 Academy para comprobar al instante su autenticidad, titular, competencia acreditada y fecha de emisión.',
  alternates: { canonical: 'https://b1-academy.vercel.app/verificar' },
};

export default async function VerificarPage({ searchParams }: { searchParams: Promise<{ codigo?: string }> }) {
  const codigo = (await searchParams).codigo?.trim().toUpperCase();
  if (codigo) redirect(`/verificar/${encodeURIComponent(codigo)}`);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-gray-100">
      <Navbar />
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <aside aria-label="Resumen" className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 text-sm text-slate-700 dark:text-slate-300">
          Cada certificado de B1 Academy tiene un código único y firmado. Ingrésalo aquí para confirmar quién lo obtuvo,
          qué competencia acredita y cuándo se emitió.
        </aside>
        <h1 className="text-3xl font-extrabold tracking-tight">Verificar un certificado de SAP Business One de B1 Academy</h1>
        <form action="/verificar" method="get" className="rounded-3xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#131a20] p-6 shadow-xl space-y-4">
          <label htmlFor="codigo" className="block text-sm font-semibold">Código de verificación</label>
          <input
            id="codigo"
            name="codigo"
            required
            maxLength={70}
            placeholder="B1-MOD-8-A1B2C3D4E5F6A7B8C9D0"
            className="w-full rounded-xl border border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 px-4 py-3 font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button type="submit" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold transition-all active:scale-95">
            <ShieldCheck className="w-4 h-4" /> Verificar
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
