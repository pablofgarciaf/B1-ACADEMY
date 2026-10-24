import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { VerificationForm } from './VerificationForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Verificación de Certificado | B1 Academy' },
  description: 'Consulta la autenticidad de un certificado de B1 Academy mediante su código.',
  robots: { index: false, follow: false },
};

export default async function VerificarCertificadoPage({ params }: { params: Promise<{ codigo: string }> }) {
  const codigo = (await params).codigo.trim().toUpperCase();
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-gray-100">
      <Navbar />
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <Link href="/verificar" className="text-sm font-semibold text-amber-700 dark:text-amber-400 hover:underline">← Verificar otro código</Link>
        <h1 className="text-3xl font-extrabold tracking-tight">Verificar certificado</h1>
        <VerificationForm code={codigo} />
      </main>
      <Footer />
    </div>
  );
}
