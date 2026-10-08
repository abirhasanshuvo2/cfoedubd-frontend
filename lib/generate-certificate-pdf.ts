import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface CertificatePdfData {
  serial_number: string | number;
  grade?: string;
  registration_id?: string;
  student_name: string;
  father_name?: string;
  mother_name?: string;
  class_name: string;
  session_title?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  issued_at?: string | null;
}

/**
 * Generates an authentic A4 landscape certificate PDF using pdf-lib.
 * Dimensions: 841.89 x 595.28 points (Standard A4 Landscape)
 */
export async function generateCertificatePdf(data: CertificatePdfData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  // A4 Landscape: width 842, height 595
  const page = pdfDoc.addPage([841.89, 595.28]);
  const { width, height } = page.getSize();

  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const timesRomanItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Colors
  const navyDark = rgb(10 / 255, 25 / 255, 47 / 255); // #0A192F
  const gold = rgb(200 / 255, 150 / 255, 62 / 255); // #C8963E
  const goldLight = rgb(245 / 255, 230 / 255, 190 / 255);
  const charcoal = rgb(30 / 255, 41 / 255, 59 / 255);
  const mutedText = rgb(100 / 255, 116 / 255, 139 / 255);

  // Background tint
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(253 / 255, 251 / 255, 247 / 255), // warm cream
  });

  // Outer decorative border
  page.drawRectangle({
    x: 24,
    y: 24,
    width: width - 48,
    height: height - 48,
    borderColor: gold,
    borderWidth: 3,
  });

  // Inner thin border
  page.drawRectangle({
    x: 32,
    y: 32,
    width: width - 64,
    height: height - 64,
    borderColor: navyDark,
    borderWidth: 1,
  });

  // Corner decorations
  const drawCorner = (cx: number, cy: number) => {
    page.drawSquare({
      x: cx - 5,
      y: cy - 5,
      size: 10,
      color: gold,
    });
  };
  drawCorner(32, 32);
  drawCorner(width - 32, 32);
  drawCorner(32, height - 32);
  drawCorner(width - 32, height - 32);

  // Top Organization Branding
  const orgName = 'CHARTERED OFFICER LIMITED';
  const orgWidth = timesRomanBold.widthOfTextAtSize(orgName, 18);
  page.drawText(orgName, {
    x: (width - orgWidth) / 2,
    y: height - 72,
    size: 18,
    font: timesRomanBold,
    color: navyDark,
  });

  const orgSub = 'CENTER OF EXCELLENCE FOR PROFESSIONAL FINANCE & LEADERSHIP';
  const subWidth = helvetica.widthOfTextAtSize(orgSub, 8.5);
  page.drawText(orgSub, {
    x: (width - subWidth) / 2,
    y: height - 88,
    size: 8.5,
    font: helvetica,
    color: gold,
  });

  // Divider Line
  page.drawLine({
    start: { x: width / 2 - 140, y: height - 100 },
    end: { x: width / 2 + 140, y: height - 100 },
    thickness: 1.5,
    color: gold,
  });

  // Certificate Title
  const certTitle = 'CERTIFICATE OF EXCELLENCE';
  const certTitleWidth = timesRomanBold.widthOfTextAtSize(certTitle, 26);
  page.drawText(certTitle, {
    x: (width - certTitleWidth) / 2,
    y: height - 145,
    size: 26,
    font: timesRomanBold,
    color: navyDark,
  });

  const certSubText = 'THIS IS PROUDLY PRESENTED TO';
  const certSubWidth = helvetica.widthOfTextAtSize(certSubText, 9.5);
  page.drawText(certSubText, {
    x: (width - certSubWidth) / 2,
    y: height - 175,
    size: 9.5,
    font: helveticaBold,
    color: mutedText,
  });

  // Student Name
  const studentName = (data.student_name || 'Honorable Student').toUpperCase();
  const nameWidth = timesRomanBold.widthOfTextAtSize(studentName, 28);
  page.drawText(studentName, {
    x: (width - nameWidth) / 2,
    y: height - 225,
    size: 28,
    font: timesRomanBold,
    color: navyDark,
  });

  // Decorative underline under name
  page.drawLine({
    start: { x: width / 2 - Math.max(160, nameWidth / 2 + 20), y: height - 235 },
    end: { x: width / 2 + Math.max(160, nameWidth / 2 + 20), y: height - 235 },
    thickness: 1,
    color: gold,
  });

  // Presentation text
  const reasonText = 'for successfully completing the rigorous executive professional curriculum in';
  const reasonWidth = timesRomanItalic.widthOfTextAtSize(reasonText, 13);
  page.drawText(reasonText, {
    x: (width - reasonWidth) / 2,
    y: height - 268,
    size: 13,
    font: timesRomanItalic,
    color: charcoal,
  });

  // Class / Course Name
  const courseName = data.class_name || 'Chartered Financial Officer (CFO)';
  const courseWidth = timesRomanBold.widthOfTextAtSize(courseName, 20);
  page.drawText(courseName, {
    x: (width - courseWidth) / 2,
    y: height - 302,
    size: 20,
    font: timesRomanBold,
    color: gold,
  });

  // Session / Period details
  const sessionText = [
    data.session_title ? `Session: ${data.session_title}` : '',
    data.start_date && data.end_date ? `Period: ${data.start_date} – ${data.end_date}` : '',
  ]
    .filter(Boolean)
    .join('  |  ');

  if (sessionText) {
    const sWidth = helvetica.widthOfTextAtSize(sessionText, 9.5);
    page.drawText(sessionText, {
      x: (width - sWidth) / 2,
      y: height - 326,
      size: 9.5,
      font: helvetica,
      color: mutedText,
    });
  }

  // Grade badge in center bottom
  const gradeText = `AWARDED GRADE: ${data.grade || 'A+'}`;
  const gradeWidth = helveticaBold.widthOfTextAtSize(gradeText, 10);
  page.drawRectangle({
    x: (width - gradeWidth) / 2 - 14,
    y: height - 370,
    width: gradeWidth + 28,
    height: 22,
    color: goldLight,
    borderColor: gold,
    borderWidth: 1,
  });
  page.drawText(gradeText, {
    x: (width - gradeWidth) / 2,
    y: height - 364,
    size: 10,
    font: helveticaBold,
    color: navyDark,
  });

  // Signatures & Verification Row (Bottom)
  const leftX = 80;
  const rightX = width - 240;
  const sigY = 96;

  // Left: Authorized Director Signature line
  page.drawLine({
    start: { x: leftX, y: sigY },
    end: { x: leftX + 160, y: sigY },
    thickness: 1,
    color: charcoal,
  });
  page.drawText('Chief Executive Officer', {
    x: leftX + 18,
    y: sigY - 16,
    size: 9.5,
    font: helveticaBold,
    color: navyDark,
  });
  page.drawText('Chartered Officer Limited', {
    x: leftX + 22,
    y: sigY - 28,
    size: 8,
    font: helvetica,
    color: mutedText,
  });

  // Right: Academic Director Signature line
  page.drawLine({
    start: { x: rightX, y: sigY },
    end: { x: rightX + 160, y: sigY },
    thickness: 1,
    color: charcoal,
  });
  page.drawText('Academic Controller', {
    x: rightX + 24,
    y: sigY - 16,
    size: 9.5,
    font: helveticaBold,
    color: navyDark,
  });
  page.drawText('Curriculum & Examination Board', {
    x: rightX + 8,
    y: sigY - 28,
    size: 8,
    font: helvetica,
    color: mutedText,
  });

  // Center Seal: Official Certificate Seal Circle
  const sealCenterX = width / 2;
  const sealCenterY = 96;
  page.drawCircle({
    x: sealCenterX,
    y: sealCenterY,
    size: 32,
    borderColor: gold,
    borderWidth: 2,
    color: rgb(254 / 255, 243 / 255, 199 / 255),
  });
  const sealText1 = 'OFFICIAL';
  const sealText2 = 'VERIFIED';
  page.drawText(sealText1, {
    x: sealCenterX - helveticaBold.widthOfTextAtSize(sealText1, 7) / 2,
    y: sealCenterY + 4,
    size: 7,
    font: helveticaBold,
    color: navyDark,
  });
  page.drawText(sealText2, {
    x: sealCenterX - helveticaBold.widthOfTextAtSize(sealText2, 7) / 2,
    y: sealCenterY - 7,
    size: 7,
    font: helveticaBold,
    color: gold,
  });

  // Footer Metadata (Serial, Reg ID, Issue Date)
  const metaTextLeft = `Serial: #${data.serial_number}   |   Registration ID: #${data.registration_id || 'N/A'}`;
  page.drawText(metaTextLeft, {
    x: 42,
    y: 40,
    size: 8,
    font: helvetica,
    color: mutedText,
  });

  const issueDateText = `Issued: ${data.issued_at || new Date().toLocaleDateString('en-GB')}`;
  page.drawText(issueDateText, {
    x: width - helvetica.widthOfTextAtSize(issueDateText, 8) - 42,
    y: 40,
    size: 8,
    font: helvetica,
    color: mutedText,
  });

  return await pdfDoc.save();
}
