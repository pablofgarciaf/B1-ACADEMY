import { MetadataRoute } from 'next';
import { publicUrl } from '@/lib/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '', '/manuales', '/capacitacion', '/blog', '/verificar',
    '/privacidad', '/terminos', '/cookies',
    '/blog/partida-doble-en-el-simulador',
    '/blog/trazabilidad-de-operaciones-erp',
  ];

  // Omit lastModified until content publication dates can be sourced reliably.
  return staticRoutes.map((path) => ({
    url: publicUrl(path),
  }));
}
