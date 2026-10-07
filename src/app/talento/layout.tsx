import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Talento y consultores SAP Business One en formación',
  description: 'Descubre perfiles en formación SAP Business One, sus competencias prácticas y el proceso de evaluación utilizado antes de participar en oportunidades.',
  alternates: { canonical: 'https://b1-academy.vercel.app/talento' },
};

export default function TalentLayout({ children }: { children: React.ReactNode }) { return children; }

