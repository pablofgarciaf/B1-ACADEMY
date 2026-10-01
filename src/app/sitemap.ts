import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sapacademy.es';

  // Rutas canónicas estáticas limpias con respuesta garantizada 200 OK
  const staticRoutes = [
    { path: '', changeFrequency: 'daily', priority: 1.0 },
    { path: '/mi-aula', changeFrequency: 'daily', priority: 1.0 },
    { path: '/campus', changeFrequency: 'daily', priority: 0.9 },
    { path: '/manuales', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/simulador', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/capacitacion', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/bolsa-empleo', changeFrequency: 'daily', priority: 0.8 },
    { path: '/consultores', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/empresas', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/blog', changeFrequency: 'weekly', priority: 0.7 },
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency as any,
    priority: route.priority,
  }));
}
