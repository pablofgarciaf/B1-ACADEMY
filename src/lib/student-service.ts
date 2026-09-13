import { StudentProfile, QuizAttemptRecord, JobReadinessMetrics, AcademicStatus } from '@/types/student';

const STORAGE_KEY = 'sap_student_records_v4';
const CURRENT_STUDENT_KEY = 'sap_current_student_id';

// Perfil oficial por defecto: Pablo F. García (Director & Superadmin)
const defaultStudent: StudentProfile = {
  uid: 'usr-pablo-1721790721',
  studentId: '1721790721',
  email: 'pablofgarciaf@gmail.com',
  displayName: 'Pablo F. García',
  role: 'consultor_premium',
  enrollmentDate: '2026-08-01',
  specialties: ['SAP-B1-CORE', 'HEIN-NOM-EC', 'SRI-LOC-EC'],
  sandboxHoursUsed: 24,
  sandboxHoursLimit: 999,
  progress: {
    'sap-b1-core': {
      courseId: 'sap-b1-core',
      courseTitle: 'SAP Business One: Núcleo Transversal & Finanzas NIIF',
      completedLessons: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'],
      totalLessons: 8,
      percent: 75,
      lastAccessedAt: '2026-09-12T20:30:00Z',
    },
    'sri-localizacion': {
      courseId: 'sri-localizacion',
      courseTitle: 'Localización Ecuador & Facturación Electrónica SRI',
      completedLessons: ['l1', 'l2'],
      totalLessons: 6,
      percent: 33,
      lastAccessedAt: '2026-09-11T16:00:00Z',
    },
    'heinsohn-nomina': {
      courseId: 'heinsohn-nomina',
      courseTitle: 'Heinsohn Nómina Ecuador: Roles de Pago & IESS',
      completedLessons: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'],
      totalLessons: 6,
      percent: 100,
      lastAccessedAt: '2026-09-10T18:00:00Z',
    },
    'heinsohn-rrhh': {
      courseId: 'heinsohn-rrhh',
      courseTitle: 'Heinsohn Gestión Humana & Talento',
      completedLessons: [],
      totalLessons: 6,
      percent: 0,
      lastAccessedAt: '2026-09-05T14:00:00Z',
    },
    'verticales-ecuador': {
      courseId: 'verticales-ecuador',
      courseTitle: 'Verticales Agroindustriales (Bananera, Camaronera, Beas)',
      completedLessons: [],
      totalLessons: 6,
      percent: 0,
      lastAccessedAt: '2026-09-01T10:00:00Z',
    },
  },
  grades: [
    {
      id: 'eval-b1-01',
      quizId: 'quiz-b1-core-mid',
      courseId: 'sap-b1-core',
      courseTitle: 'Evaluación Técnica: Asientos Contables OJDT y Plan NIIF',
      score: 88,
      passed: true,
      attemptNumber: 1,
      date: '2026-09-11',
      feedback: 'Excelente parametrización de cuentas puente de nómina y determinación G/L.',
    },
    {
      id: 'eval-nom-01',
      quizId: 'quiz-nomina-final',
      courseId: 'heinsohn-nomina',
      courseTitle: 'Examen de Certificación: Liquidación de Sueldos e IESS',
      score: 94,
      passed: true,
      attemptNumber: 1,
      date: '2026-09-10',
      feedback: 'Aprobado con distinción en cálculo de décimos, IESS 9.45% / 12.15% y finiquitos.',
    },
  ],
  certifications: [
    {
      id: 'CERT-HEIN-NOM-2026',
      courseCode: 'HEIN-NOM-EC',
      title: 'Consultor Certificado en Heinsohn Nómina Ecuador & IESS',
      issuedDate: '2026-09-10',
      credentialUrl: 'https://sapacademy.es/certificados/CERT-HEIN-NOM-2026',
      verificationHash: 'sha256-e789f1a2b3c4d5e6',
    }
  ],
  jobReadiness: {
    status: 'en_certificacion',
    overallProgressPercent: 42,
    averageGrade: 91,
    sandboxHoursVerified: 18,
    certificationsCount: 1,
    isEligibleForJobs: false,
    missingRequirements: [
      'Completar el 100% del track SAP Business One Core (Progreso actual: 75%)',
      'Aprobar la evaluación de Localización SRI Ecuador & Retenciones',
    ],
  },
};

/**
 * Recalcula la elegibilidad laboral del estudiante según estándares de la academia:
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
  if (student.sandboxHoursUsed < 15) missing.push(`Completar mínimo 15h en Sandbox SAP B1 (Actual: ${student.sandboxHoursUsed}h)`);
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
  
  // Limpieza agresiva de versiones anteriores
  localStorage.removeItem('sap_student_records_v1');
  localStorage.removeItem('sap_student_records_v2');
  localStorage.removeItem('sap_student_records_v3');

  // Si existe sesión de AuthContext en localStorage, sincronizar datos de Pablo F. García
  const authSession = localStorage.getItem('sap_auth_session');
  if (authSession) {
    try {
      const parsedAuth = JSON.parse(authSession);
      if (parsedAuth?.email) {
        defaultStudent.email = parsedAuth.email;
        defaultStudent.displayName = parsedAuth.name || parsedAuth.displayName || 'Pablo F. García';
        defaultStudent.studentId = parsedAuth.cedula || '1721790721';
      }
    } catch {}
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStudent));
    return defaultStudent;
  }
  try {
    const parsed = JSON.parse(raw);
    // Si contiene cursos viejos o el nombre antiguo Carlos, reemplazar de inmediato por Pablo F. García
    if (parsed?.progress?.FICO || !parsed?.progress?.['sap-b1-core'] || parsed?.displayName?.includes('Carlos') || parsed?.email?.includes('carlos')) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStudent));
      return defaultStudent;
    }
    return parsed;
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

  // Si aprueba el examen final del curso con >= 80%, generar certificación
  if (score >= 80 && !student.certifications.some(c => c.courseCode === courseId)) {
    student.certifications.push({
      id: `CERT-${courseId.toUpperCase()}-2026`,
      courseCode: courseId,
      title: `Especialista Certificado en ${courseTitle}`,
      issuedDate: new Date().toISOString().split('T')[0],
      credentialUrl: `https://sapacademy.es/certificados/CERT-${courseId.toUpperCase()}-2026`,
      verificationHash: `sha256-${Math.random().toString(36).substring(2, 12)}`,
    });
  }

  saveStudentProfile(student);
  return student;
}

// Candidatos elegibles verificados para la bolsa de empleo corporativa
export function getEligibleJobCandidates(): StudentProfile[] {
  const student = getStudentProfile();
  const candidateList = [student];

  // Candidatos de muestra certificados en el Ecosistema Heinsohn Ecuador
  candidateList.push(
    {
      uid: 'stu-partner-002',
      studentId: 'STU-SAP-2026-4412',
      email: 'maria.lopez@sapacademy.es',
      displayName: 'Ing. María López',
      role: 'consultor_premium',
      enrollmentDate: '2026-06-15',
      specialties: ['HEIN-NOM-EC', 'SRI-LOC-EC'],
      sandboxHoursUsed: 42,
      sandboxHoursLimit: 999,
      progress: {},
      grades: [],
      certifications: [{
        id: 'CERT-HEIN-NOM-02',
        courseCode: 'heinsohn-nomina',
        title: 'Consultora Senior en Heinsohn Nómina e IESS Ecuador',
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
    },
    {
      uid: 'stu-partner-003',
      studentId: 'STU-SAP-2026-5189',
      email: 'roberto.cajas@sapacademy.es',
      displayName: 'Lcdo. Roberto Cajas',
      role: 'consultor_premium',
      enrollmentDate: '2026-05-10',
      specialties: ['SAP-B1-CORE', 'VERTICALES-EC'],
      sandboxHoursUsed: 35,
      sandboxHoursLimit: 999,
      progress: {},
      grades: [],
      certifications: [{
        id: 'CERT-SAP-VERT-03',
        courseCode: 'verticales-ecuador',
        title: 'Especialista en Verticales Bananera y Camaronera SAP B1',
        issuedDate: '2026-07-15',
        credentialUrl: '#',
        verificationHash: 'sha256-r456c789a123',
      }],
      jobReadiness: {
        status: 'job_ready',
        overallProgressPercent: 91,
        averageGrade: 92,
        sandboxHoursVerified: 35,
        certificationsCount: 1,
        isEligibleForJobs: true,
        missingRequirements: [],
      },
    }
  );

  return candidateList.filter(c => c.jobReadiness.isEligibleForJobs);
}

// Registrar horas de práctica en Sandbox SAP B1
export function recordSandboxPractice(hours: number): StudentProfile {
  const student = getStudentProfile();
  student.sandboxHoursUsed = Math.min(student.sandboxHoursLimit, (student.sandboxHoursUsed || 0) + hours);
  student.jobReadiness = recalculateReadiness(student);
  saveStudentProfile(student);
  return student;
}

