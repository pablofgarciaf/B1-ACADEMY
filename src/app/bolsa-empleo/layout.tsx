import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Empleo para profesionales SAP Business One | Academy',
  description: 'Conecta tu formación práctica en SAP Business One con oportunidades laborales y procesos de selección que valoran competencias técnicas demostrables.',
  alternates: { canonical: 'https://sapacademy.es/bolsa-empleo' },
};

export default function JobsLayout({ children }: { children: React.ReactNode }) { return children; }

