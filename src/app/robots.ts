import { MetadataRoute } from 'next';
import { publicUrl } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/dashboard/', '/mi-aula/', '/simulador/', '/change-password/', '/login', '/evaluaciones/respuestas/'],
      },
    ],
    sitemap: publicUrl('/sitemap.xml'),
  };
}
