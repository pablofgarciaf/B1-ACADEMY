import type { Metadata } from 'next';
import { publicUrl } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'Empleo para profesionales SAP Business One | B1 Academy',
  description: 'Conecta tu formación práctica en SAP Business One con oportunidades laborales y procesos de selección que valoran competencias técnicas demostrables.',
  alternates: { canonical: publicUrl('/bolsa-empleo') },
};

export default function JobsLayout({ children }: { children: React.ReactNode }) { return children; }

