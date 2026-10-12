import type { Metadata } from 'next';
import { publicUrl } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'Empleo para profesionales Finix ERP | Academy',
  description: 'Conecta tu formación práctica en Finix ERP con oportunidades laborales y procesos de selección que valoran competencias técnicas demostrables.',
  alternates: { canonical: publicUrl('/bolsa-empleo') },
};

export default function JobsLayout({ children }: { children: React.ReactNode }) { return children; }

