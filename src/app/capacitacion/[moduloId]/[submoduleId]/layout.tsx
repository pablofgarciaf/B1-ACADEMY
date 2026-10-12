import type { Metadata } from 'next';
import { publicUrl } from '@/lib/site-url';

type SubmoduleRouteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ moduloId: string; submoduleId: string }>;
};

export async function generateMetadata({ params }: SubmoduleRouteLayoutProps): Promise<Metadata> {
  const { moduloId, submoduleId } = await params;

  return {
    alternates: {
      canonical: publicUrl(`/capacitacion/${encodeURIComponent(moduloId)}/${encodeURIComponent(submoduleId)}`),
    },
  };
}

export default function SubmoduleRouteLayout({ children }: SubmoduleRouteLayoutProps) {
  return children;
}
