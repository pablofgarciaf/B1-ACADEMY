import { requiresPasswordChange } from '@/lib/account-access-policy';
import { redirect } from 'next/navigation';
import { getSessionState } from '@/lib/server-auth';
import SesionNoDisponible from '@/components/site/SesionNoDisponible';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function SimulatorLayout({ children }: { children: React.ReactNode }) {
  const sesion = await getSessionState();
  if (sesion.estado === 'sin-sesion') redirect('/login?next=/simulador');
  if (sesion.estado === 'no-disponible') return <SesionNoDisponible destino="/simulador" />;
  if (sesion.estado === 'ok' && requiresPasswordChange(sesion.user.profile)) redirect('/change-password');
  return children;
}
