import { redirect } from 'next/navigation';
import { getModuleBySlug } from '@/lib/modules-data';

export default async function ModuloPage({ params }: { params: Promise<{ moduloId: string }> }) {
  const { moduloId } = await params;
  const module = getModuleBySlug(moduloId);
  
  if (!module || !module.lessons || module.lessons.length === 0) {
    redirect('/mi-aula');
  }

  redirect(`/mi-aula/${moduloId}/${module.lessons[0].id}`);
}
