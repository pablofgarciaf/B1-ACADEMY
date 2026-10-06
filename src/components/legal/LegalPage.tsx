import Link from 'next/link';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { LEGAL } from '@/lib/legal-config';

const PAGINAS = [
  { href: '/privacidad', label: 'Privacidad y datos personales' },
  { href: '/terminos', label: 'Términos y condiciones' },
  { href: '/cookies', label: 'Política de cookies' },
];

export function LegalPage({ titulo, resumen, actual, children }: {
  titulo: string; resumen: string[]; actual: string; children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="bg-slate-50 dark:bg-[#080d1a] min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-widest text-sap-blue">Información legal · {LEGAL.marca}</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{titulo}</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Versión {LEGAL.version} · Vigente desde el {LEGAL.vigenciaDesde} · Ley Orgánica de Protección de Datos Personales (Ecuador)
          </p>

          <aside aria-label="Resumen" className="mt-8 rounded-2xl border border-sap-blue/20 bg-white dark:bg-white/5 p-5 sm:p-6">
            <p className="text-sm font-bold text-slate-900 dark:text-white">En resumen</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc pl-5">
              {resumen.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </aside>

          <nav aria-label="Documentos legales" className="mt-6 flex flex-wrap gap-2">
            {PAGINAS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                aria-current={p.href === actual ? 'page' : undefined}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors active:scale-95 ${
                  p.href === actual
                    ? 'bg-sap-blue text-white border-sap-blue'
                    : 'border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:border-sap-blue'
                }`}
              >
                {p.label}
              </Link>
            ))}
          </nav>

          <article className="mt-10 prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-h2:text-xl prose-h2:mt-10 prose-a:text-sap-blue prose-table:text-sm">
            {children}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

/** Correo ofuscado en entidades HTML (anti-scraping). */
export function CorreoLegal({ correo }: { correo: string }) {
  if (!correo.trim()) return <span>[pendiente]</span>;
  const entidades = Array.from(correo).map((c) => `&#${c.codePointAt(0)};`).join('');
  return <span dangerouslySetInnerHTML={{ __html: entidades }} />;
}
