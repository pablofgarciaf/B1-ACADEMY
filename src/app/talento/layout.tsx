import type { Metadata } from 'next';
import { publicUrl } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'Talento y consultores Finix ERP en formación',
  description: 'Descubre perfiles en formación Finix ERP, sus competencias prácticas y el proceso de evaluación utilizado antes de participar en oportunidades.',
  alternates: { canonical: publicUrl('/talento') },
};

export default function TalentLayout({ children }: { children: React.ReactNode }) { return children; }

