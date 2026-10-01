import { redirect } from 'next/navigation';
import { getModuleBySlug } from '@/lib/modules-data';

export default async function ModuloPage({ params }: { params: Promise<{ moduloId: string }> }) {
  const { moduloId } = await params;
  const currentModule = getModuleBySlug(moduloId);
  
  if (!currentModule || !currentModule.lessons || currentModule.lessons.length === 0) {
    redirect('/mi-aula');
  }

  redirect(`/mi-aula/${moduloId}/${currentModule.lessons[0].id}`);
}
