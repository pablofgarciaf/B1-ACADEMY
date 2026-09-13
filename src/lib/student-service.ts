import { StudentProfile, QuizAttemptRecord, JobReadinessMetrics, AcademicStatus } from '@/types/student';

const STORAGE_KEY = 'sap_student_records_v1';
const CURRENT_STUDENT_KEY = 'sap_current_student_id';

// Perfil semilla con datos de muestra estilo edX / Aprende.org
const defaultStudent: StudentProfile = {
  uid: 'stu-demo-001',
  studentId: 'STU-SAP-2026-8942',
  email: 'carlos.estudiante@sapacademy.es',
  displayName: 'Carlos M. Ramírez',
  role: 'consultor_premium',
  enrollmentDate: '2026-08-01',
  specialties: ['FICO', 'MM'],
  sandboxHoursUsed: 18,
  sandboxHoursLimit: 100,
  progress: {
    FICO: {
      courseId: 'FICO',
      courseTitle: 'SAP FICO: Finanzas Corporativas & S/4HANA',
      completedLessons: ['l1', 'l2', 'l3'],
      totalLessons: 4,
      percent: 75,
      lastAccessedAt: '2026-09-12T20:30:00Z',
    },
    MM: {
      courseId: 'MM',
      courseTitle: 'SAP MM: Gestión de Materiales e Inventarios',
      completedLessons: ['m1', 'm2', 'm3', 'm4'],
      totalLessons: 4,
      percent: 100,
      lastAccessedAt: '2026-09-10T18:00:00Z',
    },
    SD: {
      courseId: 'SD',
      courseTitle: 'SAP SD: Ventas y Distribución Order-to-Cash',
      completedLessons: ['s1'],
      totalLessons: 4,
      percent: 25,
      lastAccessedAt: '2026-09-05T14:00:00Z',
    },
  },
  grades: [
    {
      id: 'eval-fico-01',
      quizId: 'quiz-fico-mid',
      courseId: 'FICO',
      courseTitle: 'Evaluación Técnica Parametrización SPRO',
      score: 85,
      passed: true,
      attemptNumber: 1,
      date: '2026-09-11',
      feedback: 'Dominio destacado de la tabla ACDOCA y parametrización de sociedades.',
    },
    {
      id: 'eval-mm-01',
      quizId: 'quiz-mm-final',
      courseId: 'MM',
      courseTitle: 'Examen de Certificación de Aprovisionamiento',
      score: 92,
      passed: true,
      attemptNumber: 1,
      date: '2026-09-10',
      feedback: 'Aprobado con distinción en valoración de stocks y pedidos corporativos.',
    },
  ],
  certifications: [
    {
      id: 'CERT-SAP-MM-2026',
      courseCode: 'MM',
      title: 'Especialista en Aprovisionamiento y Logística SAP S/4HANA',
      issuedDate: '2026-09-10',
      credentialUrl: 'https://sapacademy.es/certificados/CERT-SAP-MM-2026',
      verificationHash: 'sha256-e789f1a2b3c4d5e6',
    }
  ],
  jobReadiness: {
    status: 'en_certificacion',
    overallProgressPercent: 66,
    averageGrade: 88.5,
    sandboxHoursVerified: 18,
    certificationsCount: 1,
    isEligibleForJobs: false,
    missingRequirements: [
      'Completar el 100% del módulo SAP FICO (Progreso actual: 75%)',
      'Aprobar la evaluación final de Arquitectura S/4HANA',
    ],
  },
};

/**
 * Recalcula la elegibilidad laboral del estudiante según estándares universitarios:
 * 1. Progreso global >= 80%
 * 2. Promedio de calificaciones >= 80%
 * 3. Mínimo 15h de prácticas en Sandbox
 * 4. Al menos 1 certificación oficial aprobada
 */
export function recalculateReadiness(student: StudentProfile): JobReadinessMetrics {
  const courses = Object.values(student.progress);
  const totalPercent = courses.reduce((acc, c) => acc + c.percent, 0);
  const overallPercent = courses.length > 0 ? Math.round(totalPercent / courses.length) : 0;

  const grades = student.grades;
  const avgGrade = grades.length > 0 
    ? Math.round((grades.reduce((acc, g) => acc + g.score, 0) / grades.length) * 10) / 10 
    : 0;

  const missing: string[] = [];
  if (overallPercent < 80) missing.push(`Alcanzar >= 80% de avance global (Actual: ${overallPercent}%)`);
  if (avgGrade < 80) missing.push(`Obtener promedio de notas >= 80% (Actual: ${avgGrade}%)`);
  if (student.sandboxHoursUsed < 15) missing.push(`Completar mínimo 15h en Sandbox S/4HANA (Actual: ${student.sandboxHoursUsed}h)`);
  if (student.certifications.length < 1) missing.push('Obtener al menos 1 certificación aprobada');

  const isEligible = missing.length === 0;
  let status: AcademicStatus = 'en_formacion';
  if (isEligible) status = 'job_ready';
  else if (overallPercent >= 50 || student.certifications.length > 0) status = 'en_certificacion';

  return {
    status,
    overallProgressPercent: overallPercent,
    averageGrade: avgGrade,
    sandboxHoursVerified: student.sandboxHoursUsed,
    certificationsCount: student.certifications.length,
    isEligibleForJobs: isEligible,
    missingRequirements: missing,
    unlockedAt: isEligible ? new Date().toISOString() : undefined,
  };
}

export function getStudentProfile(): StudentProfile {
  if (typeof window === 'undefined') return defaultStudent;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStudent));
    return defaultStudent;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return defaultStudent;
  }
}

export function saveStudentProfile(student: StudentProfile): void {
  if (typeof window === 'undefined') return;
  student.jobReadiness = recalculateReadiness(student);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(student));
}

export function recordLessonCompletion(courseId: string, lessonId: string): StudentProfile {
  const student = getStudentProfile();
  const course = student.progress[courseId];
  if (course) {
    if (!course.completedLessons.includes(lessonId)) {
      course.completedLessons.push(lessonId);
      course.percent = Math.min(100, Math.round((course.completedLessons.length / course.totalLessons) * 100));
      course.lastAccessedAt = new Date().toISOString();
    }
  }
  student.sandboxHoursUsed += 1;
  saveStudentProfile(student);
  return student;
}

export function recordExamResult(courseId: string, quizId: string, courseTitle: string, score: number, feedback: string): StudentProfile {
  const student = getStudentProfile();
  const existingAttempts = student.grades.filter(g => g.quizId === quizId).length;
  const newGrade: QuizAttemptRecord = {
    id: `eval-${courseId}-${Date.now()}`,
    quizId,
    courseId,
    courseTitle,
    score,
    passed: score >= 70,
    attemptNumber: existingAttempts + 1,
    date: new Date().toISOString().split('T')[0],
    feedback,
  };

  student.grades.unshift(newGrade);

  if (score >= 70) {
    // Emite certificado oficial
    const hasCert = student.certifications.some(c => c.courseCode === courseId);
    if (!hasCert) {
      student.certifications.push({
        id: `CERT-SAP-${courseId}-${Date.now()}`,
        courseCode: courseId,
        title: `Certificación en ${courseTitle}`,
        issuedDate: new Date().toISOString().split('T')[0],
        credentialUrl: `https://sapacademy.es/certificados/CERT-SAP-${courseId}`,
        verificationHash: `sha256-${Math.random().toString(36).substring(2, 12)}`,
      });
    }
  }

  saveStudentProfile(student);
  return student;
}

// Candidatos elegibles visibles para empresas
export function getEligibleJobCandidates(): StudentProfile[] {
  const student = getStudentProfile();
  const candidateList = [student];

  // Agrega candidatos ficticios certificados para enriquecer la bolsa de empleo
  candidateList.push({
    uid: 'stu-partner-002',
    studentId: 'STU-SAP-2026-4412',
    email: 'maria.lopez@sapacademy.es',
    displayName: 'Ing. María López',
    role: 'consultor_premium',
    enrollmentDate: '2026-06-15',
    specialties: ['MM', 'SD'],
    sandboxHoursUsed: 42,
    sandboxHoursLimit: 999,
    progress: {},
    grades: [],
    certifications: [{
      id: 'CERT-SAP-MM-SD-02',
      courseCode: 'MM',
      title: 'Consultora Senior en Logística y Ventas S/4HANA',
      issuedDate: '2026-08-20',
      credentialUrl: '#',
      verificationHash: 'sha256-m987b654c321',
    }],
    jobReadiness: {
      status: 'job_ready',
      overallProgressPercent: 95,
      averageGrade: 94,
      sandboxHoursVerified: 42,
      certificationsCount: 2,
      isEligibleForJobs: true,
      missingRequirements: [],
    },
  });

  return candidateList.filter(c => c.jobReadiness.isEligibleForJobs);
}

// Registrar horas de practica en Sandbox
export function recordSandboxPractice(hours: number): StudentProfile {
  const student = getStudentProfile();
  student.sandboxHoursUsed = Math.min(student.sandboxHoursLimit, (student.sandboxHoursUsed || 0) + hours);
  student.jobReadiness = recalculateReadiness(student);
  saveStudentProfile(student);
  return student;
}
