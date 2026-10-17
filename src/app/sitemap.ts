import { MetadataRoute } from 'next';
import { publicUrl } from '@/lib/site-url';
import {ALL_MANUALS} from '@/lib/manuals-120-data';
import {OFFICIAL_SYLLABUS} from '@/lib/curriculum-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '', '/manuales', '/capacitacion', '/blog', '/verificar',
    '/privacidad', '/terminos', '/cookies', '/empresas', '/talento', '/consultores', '/presentacion-comercial',
    '/blog/partida-doble-en-el-simulador',
    '/blog/trazabilidad-de-operaciones-erp',
  ];

  // Omit lastModified until content publication dates can be sourced reliably.
  const routes=[...staticRoutes,...ALL_MANUALS.map(m=>'/manuales/'+encodeURIComponent(m.id)),...OFFICIAL_SYLLABUS.map(m=>'/capacitacion/'+encodeURIComponent(m.id))];
  return [...new Set(routes)].map((path) => ({
    url: publicUrl(path),
  }));
}
