import React from 'react';

interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

/**
 * Componente Server Component reutilizable para inyectar Schemas JSON-LD
 * de Google y motores de IA (Course, JobPosting, ProfilePage, Article, etc.)
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
