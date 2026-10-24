import type { Metadata } from 'next';
import { publicUrl } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'Conoce el laboratorio y la formación en SAP Business One | B1 Academy',
  description: 'Explora el enfoque de formación, los procesos empresariales y el alcance educativo del simulador de SAP Business One para equipos y estudiantes.',
  alternates: { canonical: publicUrl('/presentacion-comercial') },
};

export default function PresentationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
