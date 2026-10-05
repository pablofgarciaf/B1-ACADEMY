import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Capacitación SAP Business One para profesionales 2026',
  description: 'Explora rutas prácticas de SAP Business One en español, con contenidos de finanzas, ventas, compras, inventario y consultoría orientada a casos reales.',
  alternates: { canonical: 'https://sapacademy.es/capacitacion' },
};

export default function TrainingLayout({ children }: { children: React.ReactNode }) { return children; }

