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

export interface CertificatePdfDoc {
  output(type: 'arraybuffer'): ArrayBuffer;
  output(type: 'blob'): Blob;
  output(type: 'dataurlstring'): string;
  save(filename: string): void;
}

function escapePdf(str: string): string {
  if (!str) return '';
  return str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function drawCircle(cx: number, cy: number, r: number): string {
  const k = r * 0.552284749831;
  const x = cx;
  const y = cy;
  return (
    `${(x + r).toFixed(2)} ${y.toFixed(2)} m ` +
    `${(x + r).toFixed(2)} ${(y + k).toFixed(2)} ${(x + k).toFixed(2)} ${(y + r).toFixed(2)} ${x.toFixed(2)} ${(y + r).toFixed(2)} c ` +
    `${(x - k).toFixed(2)} ${(y + r).toFixed(2)} ${(x - r).toFixed(2)} ${(y + k).toFixed(2)} ${(x - r).toFixed(2)} ${y.toFixed(2)} c ` +
    `${(x - r).toFixed(2)} ${(y - k).toFixed(2)} ${(x - k).toFixed(2)} ${(y - r).toFixed(2)} ${x.toFixed(2)} ${(y - r).toFixed(2)} c ` +
    `${(x + k).toFixed(2)} ${(y - r).toFixed(2)} ${(x + r).toFixed(2)} ${(y - k).toFixed(2)} ${(x + r).toFixed(2)} ${y.toFixed(2)} c s\n`
  );
}

/**
 * Pure Zero-Dependency PDF generator.
 * Produces a 100% compliant PDF 1.4 document containing vector graphics,
 * executive double gold/navy borders, typography, signatures, and verified seals.
 * Works natively in Node.js, Next.js Server Components, API routes, and all browsers.
 */
export function generateCertificatePdfBytes(cert: CertificateData): Uint8Array {
  // A4 Landscape: 841.89 pt x 595.28 pt (297mm x 210mm)
  const width = 841.89;
  const height = 595.28;
  const cx = width / 2;

  let stream = '';

  // 1. Parchment warm background
  stream += '0.99 0.98 0.96 rg\n';
  stream += `0 0 ${width.toFixed(2)} ${height.toFixed(2)} re f\n`;

  // 2. Navy Outer Border (#0A192F)
  stream += '0.04 0.10 0.18 RG 6 w\n';
  stream += `26 26 ${(width - 52).toFixed(2)} ${(height - 52).toFixed(2)} re S\n`;

  // 3. Gold Inner Border (#C8963E)
  stream += '0.78 0.58 0.24 RG 1.5 w\n';
  stream += `34 34 ${(width - 68).toFixed(2)} ${(height - 68).toFixed(2)} re S\n`;

  // 4. Corner Flourishes
  stream += '0.78 0.58 0.24 RG 1 w\n';
  stream += `38 38 m 66 38 l S\n`;
  stream += `38 38 m 38 66 l S\n`;
  stream += `${width - 38} 38 m ${width - 66} 38 l S\n`;
  stream += `${width - 38} 38 m ${width - 38} 66 l S\n`;
  stream += `38 ${height - 38} m 66 ${height - 38} l S\n`;
  stream += `38 ${height - 38} m 38 ${height - 66} l S\n`;
  stream += `${width - 38} ${height - 38} m ${width - 66} ${height - 38} l S\n`;
  stream += `${width - 38} ${height - 38} m ${width - 38} ${height - 66} l S\n`;

  function drawText(
    font: string,
    size: number,
    r: number,
    g: number,
    b: number,
    text: string,
    y: number,
    isCenter = true,
    xPos = 0
  ) {
    const safeText = escapePdf(text);
    const charWidth = (font.includes('Times') ? 0.48 : 0.52) * size;
    const approxWidth = text.length * charWidth;
    const x = isCenter ? cx - approxWidth / 2 : xPos;
    return (
      `BT\n/${font} ${size} Tf\n${r} ${g} ${b} rg\n1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm\n` +
      `(${safeText}) Tj\nET\n`
    );
  }

  // Top registration and serial labels
  stream += drawText('F3', 9, 0.04, 0.10, 0.18, `Reg ID: #${cert.registration_id}`, height - 52, false, 48);
  stream += drawText('F3', 9, 0.04, 0.10, 0.18, `Serial: #${cert.serial_number}`, height - 52, false, width - 120);

  // Institution Affiliation
  stream += drawText(
    'F2',
    9,
    0.40,
    0.45,
    0.52,
    'CHARTERED OFFICER LIMITED  •  AFFILIATED WITH BTEB & RJSC BANGLADESH',
    height - 60
  );

  // Main Institution Title
  stream += drawText('F1', 28, 0.04, 0.10, 0.18, 'Chartered Officer Limited', height - 96);

  // Subtitle
  stream += drawText(
    'F2',
    10.5,
    0.78,
    0.58,
    0.24,
    'CERTIFICATE OF ACHIEVEMENT & PROFESSIONAL EXCELLENCE',
    height - 118
  );

  // Conferred Statement
  stream += drawText(
    'F4',
    12,
    0.35,
    0.40,
    0.48,
    'This official credential is proud and officially conferred upon',
    height - 148
  );

  // Student Name
  const studentName = cert.student_name || 'Honored Graduate';
  stream += drawText('F1', 30, 0.06, 0.09, 0.16, studentName, height - 192);

  // Gold underline below student name
  const nameLen = Math.max(studentName.length * 15, 180);
  const lineStart = cx - nameLen / 2;
  const lineEnd = cx + nameLen / 2;
  stream += `0.78 0.58 0.24 RG 1.5 w\n${lineStart.toFixed(2)} ${height - 200} m ${lineEnd.toFixed(2)} ${height - 200} l S\n`;

  // Parents Info
  let curY = height - 224;
  if (cert.father_name || cert.mother_name) {
    const parentParts = [];
    if (cert.father_name) parentParts.push(`Father: ${cert.father_name}`);
    if (cert.mother_name) parentParts.push(`Mother: ${cert.mother_name}`);
    stream += drawText('F3', 10, 0.40, 0.45, 0.52, parentParts.join('   |   '), curY);
    curY -= 22;
  }

  // Completion statement
  stream += drawText(
    'F4',
    11.5,
    0.35,
    0.40,
    0.48,
    'in recognition of the successful completion of the prescribed curriculum, practical coursework, and requirements for',
    curY
  );
  curY -= 30;

  // Course / Class Name
  stream += drawText('F1', 22, 0.70, 0.35, 0.05, cert.class_name || 'Executive Professional Course', curY);
  curY -= 24;

  // Metadata Badges (Grade, Session, Period, Issue Date)
  const metaParts = [];
  if (cert.grade) metaParts.push(`Grade: ${cert.grade}`);
  if (cert.session_title) metaParts.push(`Session: ${cert.session_title}`);
  if (cert.start_date && cert.end_date) metaParts.push(`Period: ${cert.start_date} – ${cert.end_date}`);
  if (cert.issued_at) metaParts.push(`Issued: ${cert.issued_at}`);
  stream += drawText('F2', 9.5, 0.10, 0.15, 0.25, metaParts.join('     •     '), curY);

  // Signatures Section
  const sigY = 95;

  // Left: Academic Director
  stream += `0.6 0.65 0.7 RG 0.75 w\n70 ${sigY} m 200 ${sigY} l S\n`;
  stream += drawText('F4', 13, 0.04, 0.10, 0.18, 'Dr. M. A. Rahman', sigY + 5, false, 95);
  stream += drawText('F2', 9, 0.30, 0.35, 0.45, 'Academic Director', sigY - 14, false, 100);
  stream += drawText('F3', 8, 0.45, 0.50, 0.55, 'Chartered Officer Ltd.', sigY - 25, false, 95);

  // Center Gold Seal
  stream += '0.78 0.58 0.24 RG 1.5 w\n';
  stream += drawCircle(cx, sigY - 6, 26);
  stream += '0.78 0.58 0.24 RG 0.6 w\n';
  stream += drawCircle(cx, sigY - 6, 22);

  stream += drawText('F2', 7, 0.78, 0.58, 0.24, 'OFFICIAL SEAL', sigY + 4);
  stream += drawText('F2', 9.5, 0.04, 0.10, 0.18, 'VERIFIED', sigY - 7);
  stream += drawText('F3', 6.5, 0.40, 0.45, 0.50, 'COL BD LEDGER', sigY - 17);

  // Right: Controller of Examinations
  stream += `0.6 0.65 0.7 RG 0.75 w\n${width - 200} ${sigY} m ${width - 70} ${sigY} l S\n`;
  stream += drawText('F4', 13, 0.04, 0.10, 0.18, 'K. H. Mahmud, FCA', sigY + 5, false, width - 185);
  stream += drawText('F2', 9, 0.30, 0.35, 0.45, 'Controller of Examinations', sigY - 14, false, width - 195);
  stream += drawText('F3', 8, 0.45, 0.50, 0.55, 'Board of Assessment', sigY - 25, false, width - 185);

  // Online Verification Footer Link
  stream += drawText(
    'F3',
    7.5,
    0.55,
    0.60,
    0.65,
    `Verify Authenticity Online: https://cfoedubd.com/certificates?registration_id=${cert.registration_id}  •  Doc Ref: COL-${cert.registration_id}-${cert.serial_number}`,
    44
  );

  const streamBytes = new TextEncoder().encode(stream);

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj',
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width.toFixed(2)} ${height.toFixed(2)}] /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R /F4 7 0 R >> >> /Contents 8 0 R >>\nendobj`,
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>\nendobj',
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj',
    '6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
    '7 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Times-Italic >>\nendobj',
    `8 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n${stream}\nendstream\nendobj`,
  ];

  let offset = 0;
  let pdf = '%PDF-1.4\n';
  offset = new TextEncoder().encode(pdf).length;

  const xref = ['0000000000 65535 f \n'];
  for (let i = 0; i < objects.length; i++) {
    xref.push(String(offset).padStart(10, '0') + ' 00000 n \n');
    pdf += objects[i] + '\n';
    offset = new TextEncoder().encode(pdf).length;
  }

  const startxref = offset;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  for (const entry of xref) {
    pdf += entry;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${startxref}\n%%EOF`;

  return new TextEncoder().encode(pdf);
}

/**
 * Compatible wrapper adhering to jsPDF-like API for backward compatibility.
 * Requires 0 external npm packages.
 */
export function createCertificatePdfDocument(cert: CertificateData): CertificatePdfDoc {
  const pdfBytes = generateCertificatePdfBytes(cert);

  return {
    output(type: 'arraybuffer' | 'blob' | 'dataurlstring'): any {
      const buffer = pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength) as ArrayBuffer;
      if (type === 'blob') {
        return new Blob([buffer], { type: 'application/pdf' });
      }
      if (type === 'dataurlstring') {
        let binary = '';
        for (let i = 0; i < pdfBytes.length; i++) {
          binary += String.fromCharCode(pdfBytes[i]);
        }
        const base64 = typeof window !== 'undefined' ? btoa(binary) : Buffer.from(pdfBytes).toString('base64');
        return `data:application/pdf;base64,${base64}`;
      }
      return buffer;
    },
    save(filename: string) {
      if (typeof window !== 'undefined') {
        const buffer = pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength) as ArrayBuffer;
        const blob = new Blob([buffer], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    },
  };
}
