import type { Metadata } from 'next';
import { publicUrl } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'Capacitación Finix ERP para profesionales 2026',
  description: 'Explora rutas prácticas de Finix ERP en español, con contenidos de finanzas, ventas, compras, inventario y consultoría orientada a casos reales.',
  alternates: { canonical: publicUrl('/capacitacion') },
};

export default function TrainingLayout({ children }: { children: React.ReactNode }) { return children; }

