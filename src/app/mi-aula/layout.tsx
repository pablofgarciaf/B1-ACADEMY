import { requiresPasswordChange } from '@/lib/account-access-policy';
import type { Metadata } from 'next';
import {publicUrl} from '@/lib/site-url';
import { redirect } from 'next/navigation';
import { getSessionState } from '@/lib/server-auth';
import SesionNoDisponible from '@/components/site/SesionNoDisponible';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  // 55 caracteres (Estándar 50-60)
  title: 'Mi Aula Virtual Finix ERP | Cursos y Clases 2026',
  // 157 caracteres (Estándar 120-160)
  description: 'Clases magistrales de Finix ERP 10.0 con Tutor IA, simulador interactivo, prácticas guiadas y diplomas propios basados en evaluación técnica.',
  alternates: {
    canonical: publicUrl('/mi-aula'),
  },
  openGraph: {
    title: 'Mi Aula Virtual Finix ERP | Cursos y Clases 2026',
    description: 'Clases magistrales de Finix ERP 10.0 con Tutor IA, simulador interactivo, prácticas guiadas y diplomas propios.',
    url: publicUrl('/mi-aula'),
    siteName: 'Finix Academy',
  type: 'website',
  },
  robots: { index: false, follow: false },
};

export default async function MiAulaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sin sesión válida → login. Firebase sin responder → "reintentar" (mandar al login aquí creaba el bucle
  // login ⇄ /mi-aula). Ya no se muestra el error interno del servidor al estudiante.
  const sesion = await getSessionState();
  if (sesion.estado === 'sin-sesion') redirect('/login?next=/mi-aula');
  if (sesion.estado === 'no-disponible') return <SesionNoDisponible destino="/mi-aula" />;
  if(sesion.estado==='ok' && (requiresPasswordChange(sesion.user.profile))) redirect('/change-password');
  return <>{children}</>;
}
