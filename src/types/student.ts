export type UserRole = 'regular' | 'consultor_premium' | 'admin';

export type AcademicStatus = 'en_formacion' | 'en_certificacion' | 'job_ready';

export interface LessonProgressItem {
  lessonId: string;
  courseId: string;
  lessonTitle: string;
  completed: boolean;
  completedAt?: string;
  secondsWatched: number;
}

export interface QuizAttemptRecord {
  id: string;
  quizId: string;
  courseId: string;
  courseTitle: string;
  score: number; // 0 - 100
  passed: boolean;
  attemptNumber: number;
  date: string;
  feedback: string;
}

export interface JobReadinessMetrics {
  status: AcademicStatus;
  overallProgressPercent: number; // 0 - 100%
  averageGrade: number; // 0 - 100
  sandboxHoursVerified: number;
  certificationsCount: number;
  isEligibleForJobs: boolean;
  unlockedAt?: string;
  missingRequirements: string[];
}

export interface StudentProfile {
  uid: string;
  studentId: string; // STU-SAP-2026-XXXX
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
  profilePhoto?: string | null; // base64 data URL or external URL
  enrollmentDate: string;
  specialties: ('SAP-B1-LOGISTICS' | 'SAP-B1-FINANCIALS' | 'SAP-B1-IMPLEMENTATION' | 'SAP-B1-PRODUCTION' | 'SRI-LOC-EC' | 'B1-NOM-EC' | 'B1-RRHH-EC' | 'VERTICALES-EC' | string)[];
  selectedModules?: string[]; // slugs of modules the student chose to study
  lastVisited?: {
    moduleSlug: string;
    lessonId: string;
    timestamp: string;
  };
  progress: Record<string, {
    courseId: string;
    courseTitle: string;
    completedLessons: string[];
    totalLessons: number;
    percent: number;
    lastAccessedAt: string;
  }>;
  grades: QuizAttemptRecord[];
  sandboxHoursUsed: number;
  sandboxHoursLimit: number;
  jobReadiness: JobReadinessMetrics;
  certifications: {
    id: string;
    courseCode: string;
    title: string;
    issuedDate: string;
    credentialUrl: string;
    verificationHash: string;
  }[];
}
