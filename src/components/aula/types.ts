import type { StepGuide } from '@/components/simulator/FinixInteractiveSimulator';

export interface SyncSlide {
  slide_index: number;
  script_text: string;
  step_guide: StepGuide | null;
  presentation?: 'text';
}

export interface LessonData {
  classId: string;
  title: string;
  category: string;
  number: number;
  totalSlides: number;
  images: string[];
  syncData: SyncSlide[];
  quizQuestions: any[];
  references?: { title: string; url: string }[];
}

export type AulaPhase = 'narrating' | 'simulator' | 'validating' | 'mission_done';
