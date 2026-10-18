import { requiresPasswordChange } from '@/lib/account-access-policy';
import { redirect } from 'next/navigation';
import { getSessionUser, isAdmin } from '@/lib/server-auth';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/login?next=/admin');
  if(requiresPasswordChange(user.profile))redirect('/change-password');
  if (!isAdmin(user.profile)) redirect('/dashboard');
  return children;
}
