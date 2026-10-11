import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Capacitación Finix ERP para profesionales 2026',
  description: 'Explora rutas prácticas de Finix ERP en español, con contenidos de finanzas, ventas, compras, inventario y consultoría orientada a casos reales.',
  alternates: { canonical: 'https://b1-academy.vercel.app/capacitacion' },
};

export default function TrainingLayout({ children }: { children: React.ReactNode }) { return children; }

