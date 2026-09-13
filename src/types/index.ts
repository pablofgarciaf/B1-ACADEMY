export type UserRole = 'regular' | 'consultor_premium' | 'admin' | 'super' | 'docente' | 'estudiante';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  createdAt: string;
  // Campos específicos de formación y consultoría
  specialties?: ('FICO' | 'MM' | 'SD' | 'BTP')[];
  sandboxHoursUsed?: number;
  sandboxHoursLimit?: number;
  certifications?: {
    id: string;
    courseId: string;
    courseName: string;
    issuedAt: string;
    hashVerification: string;
    verified: boolean;
  }[];
  isAvailableForHiring?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  code: 'FICO' | 'MM' | 'SD' | 'BTP';
  durationHours: number;
  lessonsCount: number;
  level: 'Operativo' | 'Consultoría Senior';
  description: string;
  requiredRole: 'regular' | 'consultor_premium';
  lessons: {
    id: string;
    title: string;
    videoDurationMin: number;
    videoUrl: string;
    summary: string;
    completed?: boolean;
  }[];
}

export interface JobListing {
  id: string;
  title: string;
  companyName: string;
  location: string;
  modality: 'Remoto' | 'Híbrido' | 'Presencial';
  salaryRange: string;
  specialtyRequired: 'FICO' | 'MM' | 'SD' | 'BTP';
  description: string;
  createdAt: string;
  applicantsCount: number;
}
