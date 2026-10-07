import type { Metadata } from 'next';

type ManualRouteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ManualRouteLayoutProps): Promise<Metadata> {
  const { id } = await params;

  return {
    alternates: {
      canonical: `https://b1-academy.vercel.app/manuales/${encodeURIComponent(id)}`,
    },
  };
}

export default function ManualRouteLayout({ children }: ManualRouteLayoutProps) {
  return children;
}
