import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { articles } from './articles';
import { publicUrl } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'Guías de práctica contable y ERP',
  description: 'Guías abiertas para practicar asientos contables y trazabilidad de operaciones en un simulador educativo.',
  alternates: { canonical: publicUrl('/blog') },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080d1a]">
      <Navbar />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Guías de práctica contable y ERP</h1>
        <p className="mt-4 mb-10 max-w-3xl text-slate-600 dark:text-slate-300">Explicaciones para entender una operación, practicarla en el simulador y revisar su efecto. Los ejemplos son educativos y no sustituyen la revisión de un contador.</p>
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((article) => (
            <article key={article.slug} className="p-7 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03]">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white"><Link href={`/blog/${article.slug}`} className="hover:underline">{article.title}</Link></h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300">{article.summary}</p>
              <Link href={`/blog/${article.slug}`} className="inline-block mt-5 font-semibold text-finix-blue hover:underline">Leer la guía →</Link>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
