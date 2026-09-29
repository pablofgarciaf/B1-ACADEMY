import { getModuleBySlug } from './modules-data';
import { promises as fs } from 'fs';
import path from 'path';

export async function getLessonMarkdown(moduloSlug: string, lessonId: string): Promise<string> {
  const module = getModuleBySlug(moduloSlug);
  if (!module) return '';

  const markdownPath = path.join(process.cwd(), 'public', 'modulos', module.fileName);
  try {
    const content = await fs.readFile(markdownPath, 'utf-8');

    // Split by ## LECCIÓN
    // Also matching ## LECCI to cover encoding issues
    const parts = content.split(/##\s*LECCI(?:A"N|ÓN|ON|O\u0301N|O)/i);
    
    if (parts.length === 1) {
      // If no lessons found, return everything if it's the first lesson, else empty
      const firstLesson = module.lessons[0]?.id;
      return lessonId === firstLesson ? content : '';
    }

    const intro = parts[0];
    const lessonIndex = module.lessons.findIndex(l => l.id === lessonId);
    
    if (lessonIndex === -1) return '';

    if (lessonIndex === 0) {
      // For the first lesson, include the intro
      return intro + '\n## LECCIÓN' + parts[1];
    }

    if (lessonIndex + 1 < parts.length) {
      return '## LECCIÓN' + parts[lessonIndex + 1];
    }

    return '';
  } catch (err) {
    return '';
  }
}
