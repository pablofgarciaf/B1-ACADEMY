

import React from 'react';
import { notFound } from 'next/navigation';
import { getModuleBySlug } from '@/lib/modules-data';
import { promises as fs } from 'fs';
import path from 'path';
import { MarkdownRenderer } from '@/components/lms/MarkdownRenderer';
import { ModuleSidebar } from '@/components/lms/ModuleSidebar';
import Head from 'next/head';
import type { Metadata } from 'next';

type PageProps = {
  params: Promise<{ moduloId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { moduloId } = await params;
  const module = getModuleBySlug(moduloId);
  if (!module) return {};
  const title = `${module.title} | EnergyEngine`;
  const description = `${module.shortTitle}: ${module.description}`;
  return {
    title,
    description,
  };
}

export default async function ModuloPage({ params }: PageProps) {
  const { moduloId } = await params;
  const module = getModuleBySlug(moduloId);
  if (!module) notFound();

  const markdownPath = path.join(process.cwd(), 'public', 'modulos', module.fileName);
  const content = await fs.readFile(markdownPath, 'utf-8');

  // JSON‑LD Schema for Service
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    provider: { '@type': 'Organization', name: 'EnergyEngine', url: 'https://energyengine.com' },
    areaServed: ['ES', 'PT'],
    offers: { '@type': 'Offer', priceCurrency: 'EUR', price: '0', url: `https://energyengine.com/mi-aula/${module.slug}` },
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
      <ModuleSidebar />
      <article className="flex-1 p-4 md:p-8 bg-white dark:bg-[#080d1a] rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold mb-4 text-sap-blue dark:text-sky-400">{module.title}</h1>
        <MarkdownRenderer content={content} />
      </article>
    </div>
  );
}
