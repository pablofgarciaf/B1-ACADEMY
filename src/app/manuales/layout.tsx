import type { Metadata } from 'next';
import { publicUrl } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'Manuales SAP Business One en español | B1 Academy',
  description: 'Consulta el atlas técnico de SAP Business One en español, organizado por finanzas, compras, ventas, inventario, producción e implementación profesional.',
  alternates: { canonical: publicUrl('/manuales') },
};

export default function ManualsLayout({ children }: { children: React.ReactNode }) { return children; }
