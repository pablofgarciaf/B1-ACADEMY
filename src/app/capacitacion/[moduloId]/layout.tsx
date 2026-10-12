import type { Metadata } from 'next';
import { publicUrl } from '@/lib/site-url';

type ModuleRouteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ moduloId: string }>;
};

export async function generateMetadata({ params }: ModuleRouteLayoutProps): Promise<Metadata> {
  const { moduloId } = await params;

  return {
    alternates: {
      canonical: publicUrl(`/capacitacion/${encodeURIComponent(moduloId)}`),
    },
  };
}

export default function ModuleRouteLayout({ children }: ModuleRouteLayoutProps) {
  return children;
}
