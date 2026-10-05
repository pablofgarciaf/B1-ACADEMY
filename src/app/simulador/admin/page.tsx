import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/server-auth';
import TeacherDashboard from '@/components/simulador/TeacherDashboard';
export default async function SimulatorTeacherPage() {
  const user = await getSessionUser();
  if (!user || !['teacher', 'docente'].includes(user.profile.role)) redirect('/simulador');
  return <TeacherDashboard />;
}
