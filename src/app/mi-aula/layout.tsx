import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  // 55 caracteres (Estándar 50-60)
  title: 'Mi Aula Virtual SAP Business One | Cursos y Clases 2026',
  // 157 caracteres (Estándar 120-160)
  description: 'Clases magistrales de SAP Business One 10.0 con Tutor IA, simulador interactivo, prácticas guiadas y diplomas propios basados en evaluación técnica.',
  alternates: {
    canonical: 'https://sapacademy.es/mi-aula',
  },
  openGraph: {
    title: 'Mi Aula Virtual SAP Business One | Cursos y Clases 2026',
    description: 'Clases magistrales de SAP Business One 10.0 con Tutor IA, simulador interactivo, prácticas guiadas y diplomas propios.',
    url: 'https://sapacademy.es/mi-aula',
    siteName: 'B1 Academy',
  type: 'website',
  },
  robots: { index: false, follow: false },
};

export default async function MiAulaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const user = await getSessionUser();
    if (!user) redirect('/login?next=/mi-aula');
    return <>{children}</>;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.stack || error.message : String(error);
    // Verificamos si es NEXT_REDIRECT para no atrapar el redireccionamiento!
    if (errorMsg.includes('NEXT_REDIRECT')) throw error;
    
    return (
      <div style={{ padding: '2rem', color: 'red', backgroundColor: '#fee' }}>
        <h1>Error Crítico de Servidor (500)</h1>
        <pre>{errorMsg}</pre>
      </div>
    );
  }
}
