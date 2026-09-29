import React from 'react';
import { notFound } from 'next/navigation';
import { getModuleBySlug } from '@/lib/modules-data';
import { getLessonMarkdown } from '@/lib/markdown-chunker';
import { CoursePlayer } from '@/components/lms/CoursePlayer';
import { LessonSidebar } from '@/components/lms/LessonSidebar';
import type { Metadata } from 'next';

type PageProps = {
  params: Promise<{ moduloId: string; lessonId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { moduloId, lessonId } = await params;
  const module = getModuleBySlug(moduloId);
  if (!module) return {};
  
  const lesson = module.lessons.find(l => l.id === lessonId);
  if (!lesson) return {};

  const title = `${lesson.title} | ${module.shortTitle} | B1 Academy`;
  const description = module.description;
  return {
    title,
    description,
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { moduloId, lessonId } = await params;
  const module = getModuleBySlug(moduloId);
  if (!module) notFound();

  const lessonIndex = module.lessons.findIndex(l => l.id === lessonId);
  if (lessonIndex === -1) notFound();

  const lesson = module.lessons[lessonIndex];
  const content = await getLessonMarkdown(moduloId, lessonId);
  
  const previousLesson = lessonIndex > 0 ? module.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < module.lessons.length - 1 ? module.lessons[lessonIndex + 1] : null;

  const previousLessonUrl = previousLesson ? `/mi-aula/${moduloId}/${previousLesson.id}` : null;
  const nextLessonUrl = nextLesson ? `/mi-aula/${moduloId}/${nextLesson.id}` : null;

  // JSON-LD Schema for Service
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    provider: { '@type': 'Organization', name: 'B1 Academy', url: 'https://b1academy.com' },
    areaServed: ['ES', 'PT'],
    offers: { '@type': 'Offer', priceCurrency: 'EUR', price: '0', url: `https://b1academy.com/mi-aula/${module.slug}/${lesson.id}` },
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#080d1a]">
      {/* JSON-LD for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Sidebar */}
      <LessonSidebar currentModuleSlug={moduloId} currentLessonId={lessonId} />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full min-w-0">
        <CoursePlayer
          moduleTitle={module.title}
          moduleSlug={module.slug}
          lessonTitle={lesson.title}
          lessonId={lesson.id}
          markdownContent={content}
          totalLessons={module.lessons.length}
          currentLessonIndex={lessonIndex}
          previousLessonUrl={previousLessonUrl}
          nextLessonUrl={nextLessonUrl}
        />
      </main>
    </div>
  );
}
