import type { Metadata } from 'next';
import { publicUrl } from '@/lib/site-url';

type ManualRouteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ManualRouteLayoutProps): Promise<Metadata> {
  const { id } = await params;

  return {
    alternates: {
      canonical: publicUrl(`/manuales/${encodeURIComponent(id)}`),
    },
  };
}

export default function ManualRouteLayout({ children }: ManualRouteLayoutProps) {
  return children;
}
