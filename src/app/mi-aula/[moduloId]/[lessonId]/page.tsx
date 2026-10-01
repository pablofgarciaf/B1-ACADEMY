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
  const currentModule = getModuleBySlug(moduloId);
  if (!currentModule) return {};
  
  const lesson = currentModule.lessons.find(l => l.id === lessonId);
  if (!lesson) return {};

  const title = `${lesson.title} | ${currentModule.shortTitle} | B1 Academy`;
  const description = currentModule.description;
  return {
    title,
    description,
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { moduloId, lessonId } = await params;
  const currentModule = getModuleBySlug(moduloId);
  if (!currentModule) notFound();

  const lessonIndex = currentModule.lessons.findIndex(l => l.id === lessonId);
  if (lessonIndex === -1) notFound();

  const lesson = currentModule.lessons[lessonIndex];
  const content = await getLessonMarkdown(moduloId, lessonId);
  
  const previousLesson = lessonIndex > 0 ? currentModule.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < currentModule.lessons.length - 1 ? currentModule.lessons[lessonIndex + 1] : null;

  const previousLessonUrl = previousLesson ? `/mi-aula/${moduloId}/${previousLesson.id}` : null;
  const nextLessonUrl = nextLesson ? `/mi-aula/${moduloId}/${nextLesson.id}` : null;

  // JSON-LD Schema for Service
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    provider: { '@type': 'Organization', name: 'B1 Academy', url: 'https://b1academy.com' },
    areaServed: ['ES', 'PT'],
    offers: { '@type': 'Offer', priceCurrency: 'EUR', price: '0', url: `https://b1academy.com/mi-aula/${currentModule.slug}/${lesson.id}` },
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
          moduleTitle={currentModule.title}
          moduleSlug={currentModule.slug}
          lessonTitle={lesson.title}
          lessonId={lesson.id}
          markdownContent={content}
          totalLessons={currentModule.lessons.length}
          currentLessonIndex={lessonIndex}
          previousLessonUrl={previousLessonUrl}
          nextLessonUrl={nextLessonUrl}
        />
      </main>
    </div>
  );
}
