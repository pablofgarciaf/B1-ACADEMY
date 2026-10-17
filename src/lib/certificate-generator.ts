import { jsPDF } from 'jspdf';
import { publicUrl } from './site-url';

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
  verified?: boolean;
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
  careerTitle = 'Escuela Finix ERP',
  code,
  verified = false,
  scorePercent,
  hours,
  competencies = [],
  dateStr = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
  instructorName = 'Finix Academy'
}: OfficialCampusCertificateData) {
  // Documento A4 horizontal (297 x 210 mm)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const certCode = verified && code ? code : 'AUTOEVALUACION-SIN-REGISTRO';
  if (verified && !code) throw new Error('Falta el código emitido por el servidor.');

  // 1. Fondo elegante marfil / crema
  doc.setFillColor(252, 252, 250);
  doc.rect(0, 0, 297, 210, 'F');

  // 2. Colores según el tipo de certificado
  let primaryColor: [number, number, number] = [15, 23, 42]; // Slate 900
  let accentColor: [number, number, number] = [217, 119, 6]; // Amber Gold
  let headerLabel = 'CONSTANCIA DE FORMACIÓN • FINIX ACADEMY';
  let badgeLabel = verified ? 'REGISTRO' : 'PRÁCTICA';
  let typeTitle = 'CONSTANCIA DE FORMACIÓN';

  if (certificateType === 'diploma') {
    accentColor = [14, 116, 144]; // Cyan / Finix ERP Blue
    typeTitle = 'CONSTANCIA DE ESPECIALIDAD';
    badgeLabel = 'ESPECIALISTA';
    headerLabel = 'FORMACIÓN CONTINUA • FINIX ACADEMY';
  } else if (certificateType === 'master') {
    accentColor = [180, 83, 9]; // Deep Gold
    primaryColor = [10, 25, 47]; // Midnight Navy
    typeTitle = 'CONSTANCIA DE ITINERARIO INTEGRAL';
    badgeLabel = 'INTEGRAL';
    headerLabel = 'ITINERARIO INTEGRAL • FINIX ACADEMY';
  } else if (certificateType === 'docente') {
    accentColor = [109, 40, 217]; // Royal Purple
    primaryColor = [24, 24, 27];
    typeTitle = 'CONSTANCIA DE FORMACIÓN DOCENTE';
    badgeLabel = 'INSTRUCTOR';
    headerLabel = 'FORMACIÓN DE INSTRUCTORES • FINIX ACADEMY';
  }
  if (!verified) { headerLabel = 'RESULTADO DE AUTOEVALUACIÓN • FINIX ACADEMY'; typeTitle = 'AUTOEVALUACIÓN DE CONOCIMIENTOS'; badgeLabel = 'PRÁCTICA'; }

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
  doc.text('FORMACIÓN CONTINUA INDEPENDIENTE • NO ES TÍTULO OFICIAL NI ACREDITACIÓN DE FABRICANTE', 148.5, 30, { align: 'center' });

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
  doc.text('Finix Academy deja constancia de la formación de:', 148.5, 54, { align: 'center' });

  // 6. Nombre del Estudiante / Docente
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(14, 116, 144); // Cyan / Blue Accent
  doc.setFontSize(Math.min(26, 26 * 220 / Math.max(220, doc.getTextWidth(studentName.toUpperCase()))));
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
  doc.text('Itinerario formativo:', 148.5, 81, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(13);
  doc.text(title.toUpperCase(), 148.5, 88, { align: 'center', maxWidth: 230 });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Itinerario: ${careerTitle}${Number.isFinite(hours) ? ` • Duración estimada: ${hours} horas` : ''}`, 148.5, 97, { align: 'center' });

  // 8. Resumen de Competencias y Validación Práctica
  const descText = verified
    ? `Constancia registrada por la academia. ${Number.isFinite(scorePercent) ? `Calificación de evaluación: ${scorePercent}%. ` : ''}La validez y el titular deben comprobarse en la consulta del código.`
    : 'Resultado de autoevaluación realizado en el navegador. No acredita prácticas verificadas, evaluación supervisada ni una constancia registrada por la academia.';
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
  doc.text('FINIX', sealX, sealY + 5.5, { align: 'center' });

  // 10. Firmas de Responsabilidad Legal y Académica
  // Firma 1: Director Académico
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.6);
  doc.line(32, 155, 105, 155);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Finix Academy', 68.5, 161, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(100, 116, 139);
  doc.text('Emisión electrónica', 68.5, 165, { align: 'center' });
  doc.text('Formación continua', 68.5, 169, { align: 'center' });

  // Firma 2: Consultor Titular Finix ERP / Lead Instructor
  doc.line(192, 155, 265, 155);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Registro de la academia', 228.5, 161, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(100, 116, 139);
  doc.text('Verificación mediante código', 228.5, 165, { align: 'center' });
  doc.text('No requiere firma manuscrita', 228.5, 169, { align: 'center' });

  // 11. Cuadro de Verificación Criptográfica y QR
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(40, 178, 217, 16, 2, 2, 'FD');

  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`REFERENCIA: ${certCode}`, 148.5, 183.5, { align: 'center' });

  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(`Fecha de emisión: ${dateStr}`, 148.5, 188, { align: 'center' });
  doc.text(verified ? `Consulta: ${publicUrl('/verificar/'+encodeURIComponent(certCode))}` : 'Autoevaluación sin código público de verificación', 148.5, 191.5, { align: 'center' });

  // Descarga del PDF
  const safeFilename = `Constancia_Finix_${certCode}.pdf`;
  doc.save(safeFilename);
  return certCode;
}

// Mantenemos la función previa para total compatibilidad
export function generateCategoryCertificate(data: CertificateData) {
  return generateOfficialCampusCertificate({
    studentName: data.studentName,
    certificateType: 'micro',
    title: data.categoryTitle,
    careerTitle: 'Escuela Finix ERP',
    code: data.verificationCode,
    scorePercent: Math.round((data.score / data.totalQuestions) * 100),
    verified: false,
    dateStr: data.dateStr
  });
}
