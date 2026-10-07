import type { Metadata } from 'next';

type ModuleRouteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ moduloId: string }>;
};

export async function generateMetadata({ params }: ModuleRouteLayoutProps): Promise<Metadata> {
  const { moduloId } = await params;

  return {
    alternates: {
      canonical: `https://b1-academy.vercel.app/capacitacion/${encodeURIComponent(moduloId)}`,
    },
  };
}

export default function ModuleRouteLayout({ children }: ModuleRouteLayoutProps) {
  return children;
}
