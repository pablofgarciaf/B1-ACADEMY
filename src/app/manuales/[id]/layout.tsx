import type { Metadata } from 'next';
import { publicUrl } from '@/lib/site-url';
import { ALL_MANUALS } from '@/lib/manuals-120-data';

type ManualRouteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ManualRouteLayoutProps): Promise<Metadata> {
  const { id } = await params;
  const manual = ALL_MANUALS.find(item => item.id === id);

  return {
    title: manual?.title || 'Manual no encontrado',
    alternates: {
      canonical: publicUrl(`/manuales/${encodeURIComponent(id)}`),
    },
  };
}

export default function ManualRouteLayout({ children }: ManualRouteLayoutProps) {
  return children;
}
