import { jsPDF } from 'jspdf';

export interface CertificateData {
  id?: number | string;
  serial_number: number | string;
  grade: string;
  registration_id: string;
  student_name: string;
  father_name?: string;
  mother_name?: string;
  class_name: string;
  session_title?: string | null;
  start_date?: string;
  end_date?: string;
  issued_at: string;
  download_url?: string;
  view_url?: string;
}

/**
 * Generates an executive, print-ready PDF certificate using jsPDF.
 * Compatible with both client-side browser and server-side Node.js / Edge runtimes.
 */
export function createCertificatePdfDocument(cert: CertificateData): jsPDF {
  // A4 Landscape: 297mm x 210mm
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // 1. Background fill (subtle warm parchment)
  doc.setFillColor(253, 252, 248);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // 2. Outer decorative border (Deep Navy)
  doc.setDrawColor(10, 25, 47); // #0A192F
  doc.setLineWidth(3);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20, 'D');

  // 3. Inner Gold Border
  doc.setDrawColor(200, 150, 62); // #C8963E
  doc.setLineWidth(1);
  doc.rect(13, 13, pageWidth - 26, pageHeight - 26, 'D');

  // Corner decorative flourishes
  const drawCornerFlourish = (x: number, y: number, xDir: number, yDir: number) => {
    doc.setDrawColor(200, 150, 62);
    doc.setLineWidth(0.8);
    doc.line(x, y, x + xDir * 8, y);
    doc.line(x, y, x, y + yDir * 8);
  };
  drawCornerFlourish(15, 15, 1, 1);
  drawCornerFlourish(pageWidth - 15, 15, -1, 1);
  drawCornerFlourish(15, pageHeight - 15, 1, -1);
  drawCornerFlourish(pageWidth - 15, pageHeight - 15, -1, -1);

  // 4. Header Top Badge / Affiliation
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'CHARTERED OFFICER LIMITED  •  AFFILIATED WITH BTEB & RJSC BANGLADESH',
    pageWidth / 2,
    23,
    { align: 'center' }
  );

  // 5. Institution Name
  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(10, 25, 47);
  doc.text('Chartered Officer Limited', pageWidth / 2, 33, { align: 'center' });

  // 6. Subheading / Ribbon
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(200, 150, 62); // Gold
  doc.text('CERTIFICATE OF ACHIEVEMENT & PROFESSIONAL EXCELLENCE', pageWidth / 2, 41, {
    align: 'center',
  });

  // 7. Conferred To Statement
  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text('This credential is proud and officially conferred upon', pageWidth / 2, 51, {
    align: 'center',
  });

  // 8. Student Name (Big, Bold Serif)
  doc.setFont('times', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(cert.student_name || 'Honored Graduate', pageWidth / 2, 65, { align: 'center' });

  // Underline beneath student name
  const nameWidth = doc.getTextWidth(cert.student_name || 'Honored Graduate');
  const lineStart = (pageWidth - nameWidth) / 2 - 10;
  const lineEnd = (pageWidth + nameWidth) / 2 + 10;
  doc.setDrawColor(200, 150, 62);
  doc.setLineWidth(0.7);
  doc.line(lineStart, 68, lineEnd, 68);

  // 9. Parent Details (if available)
  let currentY = 76;
  if (cert.father_name || cert.mother_name) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    const parentParts = [];
    if (cert.father_name) parentParts.push(`Father: ${cert.father_name}`);
    if (cert.mother_name) parentParts.push(`Mother: ${cert.mother_name}`);
    doc.text(parentParts.join('   |   '), pageWidth / 2, currentY, { align: 'center' });
    currentY += 8;
  }

  // 10. Requirement Fulfillment Text
  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'in recognition of the successful completion of the prescribed curriculum, assessments, and requirements for',
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );
  currentY += 10;

  // 11. Course / Class Name
  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(180, 83, 9); // Amber-700 / Gold
  doc.text(cert.class_name || 'Executive Professional Course', pageWidth / 2, currentY, {
    align: 'center',
  });
  currentY += 10;

  // 12. Meta badges: Grade, Session, Duration, Issue Date
  const metaParts: string[] = [];
  if (cert.grade) metaParts.push(`Grade: ${cert.grade}`);
  if (cert.session_title) metaParts.push(`Session: ${cert.session_title}`);
  if (cert.start_date && cert.end_date) {
    metaParts.push(`Duration: ${cert.start_date} – ${cert.end_date}`);
  }
  if (cert.issued_at) metaParts.push(`Issued: ${cert.issued_at}`);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(metaParts.join('    •    '), pageWidth / 2, currentY, { align: 'center' });

  // 13. Registration & Serial Numbers Box (Top right & left)
  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(10, 25, 47);
  doc.text(`Reg ID: #${cert.registration_id}`, 22, 23);
  doc.text(`Serial: #${cert.serial_number}`, pageWidth - 22, 23, { align: 'right' });

  // 14. Signatures & Official Seal at the bottom
  const sigY = 175;

  // Academic Director (Left)
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);
  doc.line(35, sigY, 95, sigY);
  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(10, 25, 47);
  doc.text('Dr. M. A. Rahman', 65, sigY - 3, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Academic Director', 65, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Chartered Officer Limited', 65, sigY + 9, { align: 'center' });

  // Central Gold Seal
  const sealCenterX = pageWidth / 2;
  const sealCenterY = sigY - 2;
  doc.setDrawColor(200, 150, 62);
  doc.setLineWidth(1.2);
  doc.circle(sealCenterX, sealCenterY, 14, 'D');
  doc.setLineWidth(0.5);
  doc.circle(sealCenterX, sealCenterY, 12, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(200, 150, 62);
  doc.text('OFFICIAL SEAL', sealCenterX, sealCenterY - 4, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(10, 25, 47);
  doc.text('VERIFIED', sealCenterX, sealCenterY + 1, { align: 'center' });
  doc.setFontSize(5.5);
  doc.setTextColor(100, 116, 139);
  doc.text('COL BD LEDGER', sealCenterX, sealCenterY + 6, { align: 'center' });

  // Controller of Examinations (Right)
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);
  doc.line(pageWidth - 95, sigY, pageWidth - 35, sigY);
  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(10, 25, 47);
  doc.text('K. H. Mahmud, FCA', pageWidth - 65, sigY - 3, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Controller of Examinations', pageWidth - 65, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Board of Academic Assessment', pageWidth - 65, sigY + 9, { align: 'center' });

  // 15. Verification Footer Link
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Verify Authenticity Online: https://cfoedubd.com/certificates?registration_id=${encodeURIComponent(
      cert.registration_id
    )}  •  Doc Ref: ${cert.registration_id}-${cert.serial_number}`,
    pageWidth / 2,
    pageHeight - 15,
    { align: 'center' }
  );

  return doc;
}
