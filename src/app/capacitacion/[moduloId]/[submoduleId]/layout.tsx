import type { Metadata } from 'next';

type SubmoduleRouteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ moduloId: string; submoduleId: string }>;
};

export async function generateMetadata({ params }: SubmoduleRouteLayoutProps): Promise<Metadata> {
  const { moduloId, submoduleId } = await params;

  return {
    alternates: {
      canonical: `https://sapacademy.es/capacitacion/${encodeURIComponent(moduloId)}/${encodeURIComponent(submoduleId)}`,
    },
  };
}

export default function SubmoduleRouteLayout({ children }: SubmoduleRouteLayoutProps) {
  return children;
}
