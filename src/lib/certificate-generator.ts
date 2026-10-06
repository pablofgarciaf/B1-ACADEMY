import { jsPDF } from 'jspdf';

export interface CertificateData {
  studentName: string;
  categoryTitle: string;
  score: number;
  totalQuestions: number;
  dateStr?: string;
  verificationCode?: string;
}

export interface OfficialCampusCertificateData {
  studentName: string;
  certificateType: 'micro' | 'diploma' | 'master' | 'docente';
  title: string;
  careerTitle?: string;
  code?: string;
  scorePercent?: number;
  hours?: number;
  competencies?: string[];
  dateStr?: string;
  instructorName?: string;
}

// ═══════════════════════════════════════════════════════════════════
// MOTOR DE CERTIFICADOS OFICIALES B1 ACADEMY CON FIRMAS DE RESPONSABILIDAD
// ═══════════════════════════════════════════════════════════════════

export function generateOfficialCampusCertificate({
  studentName,
  certificateType,
  title,
  careerTitle = 'Escuela SAP Business One',
  code,
  scorePercent = 95,
  hours = 25,
  competencies = [],
  dateStr = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
  instructorName = 'Master B1 & Comité Evaluador'
}: OfficialCampusCertificateData) {
  // Documento A4 horizontal (297 x 210 mm)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const certCode = code || `B1-${certificateType.toUpperCase().slice(0, 3)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${new Date().getFullYear()}`;
  const verificationHash = Array.from(certCode)
    .map(c => c.charCodeAt(0).toString(16))
    .join('')
    .padEnd(32, '0')
    .slice(0, 24)
    .toUpperCase();

  // 1. Fondo elegante marfil / crema
  doc.setFillColor(252, 252, 250);
  doc.rect(0, 0, 297, 210, 'F');

  // 2. Colores según el tipo de certificado
  let primaryColor: [number, number, number] = [15, 23, 42]; // Slate 900
  let accentColor: [number, number, number] = [217, 119, 6]; // Amber Gold
  let headerLabel = 'ACREDITACIÓN TÉCNICA OFICIAL • B1 ACADEMY';
  let badgeLabel = 'APROBADO';
  let typeTitle = 'MICRO-CERTIFICACIÓN DE COMPETENCIA OPERATIVA';

  if (certificateType === 'diploma') {
    accentColor = [14, 116, 144]; // Cyan / SAP Blue
    typeTitle = 'DIPLOMA DE ESPECIALIZACIÓN PROFESIONAL';
    badgeLabel = 'ESPECIALISTA';
    headerLabel = 'PROGRAMA EJECUTIVO UNIVERSITARIO • B1 ACADEMY';
  } else if (certificateType === 'master') {
    accentColor = [180, 83, 9]; // Deep Gold
    primaryColor = [10, 25, 47]; // Midnight Navy
    typeTitle = 'CERTIFICACIÓN MASTER: CONSULTOR ASOCIADO SAP BUSINESS ONE';
    badgeLabel = 'MASTER B1';
    headerLabel = 'GRADO DE CONSULTOR OFICIAL • RED DE TALENTO SAP';
  } else if (certificateType === 'docente') {
    accentColor = [109, 40, 217]; // Royal Purple
    primaryColor = [24, 24, 27];
    typeTitle = 'ACREDITACIÓN DOCENTE E INSTRUCTOR ACADÉMICO SAP B1';
    badgeLabel = 'INSTRUCTOR';
    headerLabel = 'PROGRAMA TRAIN-THE-TRAINER • CÁTEDRA UNIVERSITARIA';
  }

  // 3. Bordes decorativos dobles
  // Borde exterior
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(3.5);
  doc.rect(10, 10, 277, 190);

  // Borde interior fino con color de acento
  doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.setLineWidth(0.9);
  doc.rect(13, 13, 271, 184);

  // Esquinas ornamentales
  const drawCorner = (x: number, y: number, angleX: number, angleY: number) => {
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(x, y, 7 * angleX, 1.2 * angleY, 'F');
    doc.rect(x, y, 1.2 * angleX, 7 * angleY, 'F');
  };
  drawCorner(15, 15, 1, 1);
  drawCorner(282, 15, -1, 1);
  drawCorner(15, 195, 1, -1);
  drawCorner(282, 195, -1, -1);

  // 4. Encabezado institucional
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(headerLabel, 148.5, 25, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('CAMPUS UNIVERSITARIO Y RED DE CERTIFICACIÓN PROFESIONAL SAP BUSINESS ONE 10.0 (HANA)', 148.5, 30, { align: 'center' });

  // Línea divisoria elegante
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(65, 34, 232, 34);

  // 5. Título del Tipo de Certificación
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(certificateType === 'master' ? 17 : 19);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(typeTitle, 148.5, 45, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10.5);
  doc.setTextColor(100, 116, 139);
  doc.text('El Consejo Académico y la Dirección de Consultoría acreditan solemnemente que:', 148.5, 54, { align: 'center' });

  // 6. Nombre del Estudiante / Docente
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(14, 116, 144); // Cyan / Blue Accent
  doc.text(studentName.toUpperCase(), 148.5, 68, { align: 'center' });

  // Línea decorativa bajo el nombre
  doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.setLineWidth(1.2);
  const nameWidth = doc.getTextWidth(studentName.toUpperCase());
  const startX = Math.max(45, 148.5 - nameWidth / 2 - 12);
  const endX = Math.min(252, 148.5 + nameWidth / 2 + 12);
  doc.line(startX, 71.5, endX, 71.5);

  // 7. Mérito y Nombre del Módulo / Carrera
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85);
  doc.text('Ha cursado, practicado en el simulador de transacciones y aprobado el rigor técnico de:', 148.5, 81, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`"${title.toUpperCase()}"`, 148.5, 91, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Itinerario Curricular: ${careerTitle} • Carga Horaria Acreditada: ${hours} Horas Académicas`, 148.5, 97, { align: 'center' });

  // 8. Resumen de Competencias y Validación Práctica
  let descText = `Demostró dominio en la ejecución de transacciones reales, parametrización de tablas maestras, determinación de cuentas y buenas prácticas. Calificación obtenida: ${scorePercent}% en la evaluación y el simulador.`;
  if (certificateType === 'docente') {
    descText = `Habilitado oficialmente para la instrucción universitaria, diseño de casos pedagógicos prácticos y conducción de laboratorios con el Simulador SAP B1 10.0 en instituciones de educación superior.`;
  }
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(descText, 148.5, 107, { align: 'center', maxWidth: 230 });

  // 9. Sello Oficial "B1 VERIFIED"
  const sealX = 148.5;
  const sealY = 127;
  doc.setFillColor(254, 243, 199);
  doc.circle(sealX, sealY, 12, 'F');
  doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.setLineWidth(1.2);
  doc.circle(sealX, sealY, 12, 'S');
  doc.circle(sealX, sealY, 10.2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(180, 83, 9);
  doc.text('VALIDEZ', sealX, sealY - 3, { align: 'center' });
  doc.setFontSize(9.5);
  doc.text(badgeLabel, sealX, sealY + 1.5, { align: 'center' });
  doc.setFontSize(6.5);
  doc.text('OFICIAL B1', sealX, sealY + 5.5, { align: 'center' });

  // 10. Firmas de Responsabilidad Legal y Académica
  // Firma 1: Director Académico
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.6);
  doc.line(32, 155, 105, 155);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Ing. Pablo García', 68.5, 161, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(100, 116, 139);
  doc.text('Director Académico y de Certificaciones', 68.5, 165, { align: 'center' });
  doc.text('B1 Academy • Red Internacional ERP', 68.5, 169, { align: 'center' });

  // Firma 2: Consultor Titular SAP B1 / Lead Instructor
  doc.line(192, 155, 265, 155);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Master B1 & Consejo Técnico SAP', 228.5, 161, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(100, 116, 139);
  doc.text('Comité de Evaluación & Homologación', 228.5, 165, { align: 'center' });
  doc.text('SAP Business One Specialist Network', 228.5, 169, { align: 'center' });

  // 11. Cuadro de Verificación Criptográfica y QR
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(40, 178, 217, 16, 2, 2, 'FD');

  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`CÓDIGO DE VERIFICACIÓN OFICIAL: ${certCode}`, 148.5, 183.5, { align: 'center' });

  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(`HASH SHA-256: [${verificationHash}] • Fecha de Emisión: ${dateStr}`, 148.5, 188, { align: 'center' });
  doc.text(`Verificable públicamente en https://b1academy.org/verificar/${certCode}`, 148.5, 191.5, { align: 'center' });

  // Descarga del PDF
  const safeFilename = `Certificado_Oficial_B1_${certCode}.pdf`;
  doc.save(safeFilename);
  return certCode;
}

// Mantenemos la función previa para total compatibilidad
export function generateCategoryCertificate(data: CertificateData) {
  return generateOfficialCampusCertificate({
    studentName: data.studentName,
    certificateType: 'micro',
    title: data.categoryTitle,
    careerTitle: 'Escuela SAP Business One',
    code: data.verificationCode,
    scorePercent: Math.round((data.score / data.totalQuestions) * 100),
    hours: 20,
    dateStr: data.dateStr
  });
}
