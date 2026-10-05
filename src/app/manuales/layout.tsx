import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manuales SAP Business One en español | B1 Academy',
  description: 'Consulta el atlas técnico de SAP Business One en español, organizado por finanzas, compras, ventas, inventario, producción e implementación profesional.',
  alternates: { canonical: 'https://sapacademy.es/manuales' },
};

export default function ManualsLayout({ children }: { children: React.ReactNode }) { return children; }

