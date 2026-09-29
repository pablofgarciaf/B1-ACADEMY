import { StudentProfile, QuizAttemptRecord, JobReadinessMetrics, AcademicStatus } from '@/types/student';

const STORAGE_KEY = 'sap_student_records_v5';
const CURRENT_STUDENT_KEY = 'sap_current_student_id';

// Perfil oficial por defecto: Pablo F. García (Director & Superadmin)
// Comienza con 0% real y limpio hasta que el estudiante interactúe con las lecciones y exámenes
const defaultStudent: StudentProfile = {
  uid: 'usr-pablo-1721790721',
  studentId: '1721790721',
  email: 'pablofgarciaf@gmail.com',
  displayName: 'Pablo F. García',
  role: 'consultor_premium',
  enrollmentDate: '2026-09-13',
  profilePhoto: null,
  selectedModules: ['modulo-01', 'modulo-02', 'modulo-03'],
  specialties: ['SAP-B1-LOGISTICS', 'SAP-B1-FINANCIALS', 'SAP-B1-IMPLEMENTATION', 'SAP-LOC-EC', 'B1-NOM-EC'],
  sandboxHoursUsed: 0,
  sandboxHoursLimit: 999,
  progress: {
    'sap-b1-core': {
      courseId: 'sap-b1-core',
      courseTitle: 'SAP Business One: Núcleo Transversal & Finanzas NIIF',
      completedLessons: [],
      totalLessons: 8,
      percent: 0,
      lastAccessedAt: new Date().toISOString(),
    },
    'sap-loc-ec': {
      courseId: 'sap-loc-ec',
      courseTitle: 'Localización Ecuador: Facturación Electrónica & SRI Compliance',
      completedLessons: [],
      totalLessons: 6,
      percent: 0,
      lastAccessedAt: new Date().toISOString(),
    },
    'b1-nomina': {
      courseId: 'b1-nomina',
      courseTitle: 'Nómina HCM Ecuador: Roles de Pago & IESS',
      completedLessons: [],
      totalLessons: 6,
      percent: 0,
      lastAccessedAt: new Date().toISOString(),
    },
    'b1-rrhh': {
      courseId: 'b1-rrhh',
      courseTitle: 'Gestión Humana & Talento',
      completedLessons: [],
      totalLessons: 6,
      percent: 0,
      lastAccessedAt: new Date().toISOString(),
    },
    'verticales-ecuador': {
      courseId: 'verticales-ecuador',
      courseTitle: 'Verticales Agroindustriales (Bananera, Camaronera, Beas)',
      completedLessons: [],
      totalLessons: 6,
      percent: 0,
      lastAccessedAt: new Date().toISOString(),
    },
  },
  grades: [],
  certifications: [],
  jobReadiness: {
    status: 'en_formacion',
    overallProgressPercent: 0,
    averageGrade: 0,
    sandboxHoursVerified: 0,
    certificationsCount: 0,
    isEligibleForJobs: false,
    missingRequirements: [
      'Alcanzar >= 80% de avance global en los tracks',
      'Obtener promedio de notas >= 80% en evaluaciones',
      'Completar mínimo 15h de práctica en Sandbox SAP B1',
      'Obtener al menos 1 certificación oficial aprobada',
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
  
  // Limpieza agresiva de versiones demo anteriores
  localStorage.removeItem('sap_student_records_v1');
  localStorage.removeItem('sap_student_records_v2');
  localStorage.removeItem('sap_student_records_v3');
  localStorage.removeItem('sap_student_records_v4');

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
    // Si contiene cursos demo viejos o nombres no oficiales, regenerar con datos reales limpios
    if (
      parsed?.progress?.FICO || 
      parsed?.progress?.['sri-localizacion'] ||
      parsed?.grades?.some((g: { id?: string }) => g.id === 'eval-b1-01')
    ) {
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

export function resetStudentProfile(): StudentProfile {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return getStudentProfile();
}

export function recordLessonCompletion(courseIdOrCode: string, lessonId: string): StudentProfile {
  const student = getStudentProfile();
  
  let keyToUpdate = courseIdOrCode;
  if (!student.progress[keyToUpdate]) {
    const found = Object.keys(student.progress).find(
      k => k.toLowerCase() === courseIdOrCode.toLowerCase() ||
           (courseIdOrCode.toLowerCase().includes('loc') && k.includes('loc')) ||
           (courseIdOrCode.toLowerCase().includes('b1') && k.includes('b1')) ||
           (courseIdOrCode.toLowerCase().includes('nom') && k.includes('nom'))
    );
    if (found) keyToUpdate = found;
  }

  const course = student.progress[keyToUpdate];
  if (course) {
    if (!course.completedLessons.includes(lessonId)) {
      course.completedLessons.push(lessonId);
      course.percent = Math.min(100, Math.round((course.completedLessons.length / course.totalLessons) * 100));
      course.lastAccessedAt = new Date().toISOString();
    }
  }
  student.sandboxHoursUsed = (student.sandboxHoursUsed || 0) + 1;
  saveStudentProfile(student);
  return student;
}

export function recordExamResult(courseIdOrCode: string, quizId: string, courseTitle: string, score: number, feedback: string): StudentProfile {
  const student = getStudentProfile();
  const existingAttempts = student.grades.filter(g => g.quizId === quizId).length;
  const newGrade: QuizAttemptRecord = {
    id: `eval-${courseIdOrCode}-${Date.now()}`,
    quizId,
    courseId: courseIdOrCode,
    courseTitle,
    score,
    passed: score >= 70,
    attemptNumber: existingAttempts + 1,
    date: new Date().toISOString().split('T')[0],
    feedback,
  };

  student.grades.unshift(newGrade);

  // Si aprueba el examen final con >= 80%, generar certificación específica (Módulo o Master Track)
  if (score >= 80 && !student.certifications.some(c => c.courseCode === courseIdOrCode)) {
    const isModuleCert = courseIdOrCode.startsWith('modulo-');
    const certTitle = isModuleCert
      ? `Certificado de Módulo: ${courseTitle}`
      : `Certificación Superior Máster: ${courseTitle}`;

    student.certifications.push({
      id: `CERT-${courseIdOrCode.toUpperCase()}-2026`,
      courseCode: courseIdOrCode,
      title: certTitle,
      issuedDate: new Date().toISOString().split('T')[0],
      credentialUrl: `https://sapacademy.es/certificados/CERT-${courseIdOrCode.toUpperCase()}-2026`,
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

  // Candidatos de muestra certificados en B1 Academy Ecuador
  candidateList.push(
    {
      uid: 'stu-partner-002',
      studentId: 'STU-SAP-2026-4412',
      email: 'maria.lopez@sapacademy.es',
      displayName: 'Ing. María López',
      role: 'consultor_premium',
      enrollmentDate: '2026-06-15',
      specialties: ['B1-NOM-EC', 'SRI-LOC-EC'],
      sandboxHoursUsed: 42,
      sandboxHoursLimit: 999,
      progress: {},
      grades: [],
      certifications: [{
        id: 'CERT-B1-NOM-02',
        courseCode: 'b1-nomina',
        title: 'Consultora Senior en Nómina HCM e IESS Ecuador',
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
      specialties: ['SAP-B1-LOGISTICS', 'VERTICALES-EC'],
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

// Seleccionar un módulo para el plan de estudio del alumno
export function selectModule(moduleSlug: string): StudentProfile {
  const student = getStudentProfile();
  if (!student.selectedModules) student.selectedModules = ['modulo-01', 'modulo-02', 'modulo-03'];
  if (!student.selectedModules.includes(moduleSlug)) {
    student.selectedModules.push(moduleSlug);
    saveStudentProfile(student);
  }
  return student;
}

// Deseleccionar un módulo
export function deselectModule(moduleSlug: string): StudentProfile {
  const student = getStudentProfile();
  if (!student.selectedModules) student.selectedModules = ['modulo-01', 'modulo-02', 'modulo-03'];
  student.selectedModules = student.selectedModules.filter(s => s !== moduleSlug);
  saveStudentProfile(student);
  return student;
}

// Actualizar foto de perfil del alumno
export function updateProfilePhoto(photoDataUrl: string | null): StudentProfile {
  const student = getStudentProfile();
  student.profilePhoto = photoDataUrl;
  saveStudentProfile(student);
  return student;
}

// Registrar última lección visitada
export function recordLastVisited(moduleSlug: string, lessonId: string): StudentProfile {
  const student = getStudentProfile();
  student.lastVisited = {
    moduleSlug,
    lessonId,
    timestamp: new Date().toISOString(),
  };
  saveStudentProfile(student);
  return student;
}

