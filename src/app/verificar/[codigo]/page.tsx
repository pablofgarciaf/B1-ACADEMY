import type { Metadata } from 'next';
import Link from 'next/link';
import { Award, ShieldCheck, ShieldX, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { adminDb } from '@/lib/firebase-admin';
import { getModuleById } from '@/lib/curriculum-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Verificación de Certificado SAP B1 | B1 Academy' },
  description: 'Comprueba la autenticidad de un certificado de competencia emitido por B1 Academy: titular, competencia acreditada, fecha de emisión y estado.',
  robots: { index: false, follow: false },
};

/** Formato de los códigos que emite /api/certificates/issue: B1-MOD-13-<20 hex>. */
const CODIGO_VALIDO = /^B1-[A-Z0-9-]{4,60}$/;

interface CertificadoPublico {
  title?: string;
  holderName?: string;
  moduleId: string;
  issuedAt: string;
  status: 'valid' | 'revoked';
}

async function buscar(codigo: string): Promise<CertificadoPublico | null> {
  if (!CODIGO_VALIDO.test(codigo)) return null;
  try {
    const doc = await adminDb.collection('certificates').doc(codigo).get();
    return doc.exists ? (doc.data() as CertificadoPublico) : null;
  } catch {
    return null;
  }
}

export default async function VerificarCertificadoPage({ params }: { params: Promise<{ codigo: string }> }) {
  const codigo = decodeURIComponent((await params).codigo).trim().toUpperCase();
  const cert = await buscar(codigo);
  const modulo = cert ? getModuleById(cert.moduleId) : undefined;
  const valido = cert?.status === 'valid';
  const titulo = cert?.title || modulo?.certificateTitle || modulo?.title || 'Certificado de competencia';
  const fecha = cert ? new Date(cert.issuedAt).toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-gray-100">
      <Navbar />
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <Link href="/verificar" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400">
          <ArrowLeft className="w-3.5 h-3.5" /> Verificar otro código
        </Link>

        {cert ? (
          <section className={`rounded-3xl border p-6 sm:p-8 shadow-xl bg-white dark:bg-[#131a20] space-y-5 ${valido ? 'border-emerald-500/40' : 'border-red-500/40'}`}>
            <div className="flex items-center gap-3">
              {valido
                ? <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                : <ShieldX className="w-8 h-8 text-red-600 dark:text-red-400 shrink-0" aria-hidden="true" />}
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${valido ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                  {valido ? 'Certificado auténtico y vigente' : 'Certificado revocado'}
                </p>
                <h1 className="text-xl sm:text-2xl font-bold">{titulo}</h1>
              </div>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {cert.holderName && (
                <div>
                  <dt className="text-xs font-semibold text-slate-500 dark:text-gray-400">Titular</dt>
                  <dd className="font-semibold">{cert.holderName}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-semibold text-slate-500 dark:text-gray-400">Fecha de emisión</dt>
                <dd className="font-semibold">{fecha}</dd>
              </div>
              {modulo && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold text-slate-500 dark:text-gray-400">Módulo aprobado</dt>
                  <dd className="font-semibold">Módulo {modulo.number}: {modulo.title}</dd>
                </div>
              )}
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold text-slate-500 dark:text-gray-400">Código de verificación</dt>
                <dd className="font-mono text-xs break-all">{codigo}</dd>
              </div>
            </dl>

            <div className="rounded-2xl bg-slate-50 dark:bg-gray-800/40 border border-slate-200 dark:border-gray-700 p-4 text-xs text-slate-600 dark:text-gray-300 flex gap-2">
              <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
              <p>
                Para obtenerlo, el titular completó todas las clases del módulo, aprobó cada práctica en el Simulador SAP B1
                (calificada en el servidor) y superó la evaluación con Tutor IA.
              </p>
            </div>
          </section>
        ) : (
          <section className="rounded-3xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#131a20] p-6 sm:p-8 shadow-xl space-y-3">
            <ShieldX className="w-8 h-8 text-slate-400" aria-hidden="true" />
            <h1 className="text-xl font-bold">No encontramos este certificado</h1>
            <p className="text-sm text-slate-600 dark:text-gray-400">
              El código <span className="font-mono">{codigo}</span> no corresponde a ningún certificado emitido. Revisa que esté escrito exactamente como aparece en el documento.
            </p>
          </section>
        )}

        <p className="text-[11px] text-slate-500 dark:text-gray-500 leading-relaxed">
          B1 Academy es una institución de formación independiente. Sus certificados acreditan competencias prácticas
          en SAP Business One y no constituyen una certificación oficial de SAP SE.
        </p>
      </main>
      <Footer />
    </div>
  );
}
