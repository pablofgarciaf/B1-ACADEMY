import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sapacademy.es';

  return {
    rules: [
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Applebot',
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'anthropic-ai',
          'PerplexityBot',
          'Google-Extended',
          'OAI-SearchBot',
        ],
        allow: '/',
        disallow: ['/admin/', '/api/', '/privado/', '/evaluaciones/respuestas/'],
      },
      {
        userAgent: ['HTTrack', 'Wget', 'Scrapy', 'MegaIndex', 'AhrefsBot', 'SemrushBot'],
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
