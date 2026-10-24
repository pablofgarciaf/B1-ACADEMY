import type { Metadata } from 'next';
import { publicUrl } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'Capacitación SAP Business One para profesionales | B1 Academy',
  description: 'Explora rutas prácticas de SAP Business One en español, con contenidos de finanzas, ventas, compras, inventario y consultoría orientada a casos reales.',
  alternates: { canonical: publicUrl('/capacitacion') },
};

export default function TrainingLayout({ children }: { children: React.ReactNode }) { return children; }

