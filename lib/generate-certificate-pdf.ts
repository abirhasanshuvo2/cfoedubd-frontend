/**
 * Pure TypeScript Certificate PDF Generator
 * Zero external dependencies — generates a standard PDF 1.4 document directly in memory.
 * Completely immune to "Cannot resolve 'pdf-lib'" build errors.
 */

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
 * Escapes characters for PDF literal strings (parentheses and backslashes)
 * and strips non-ASCII to prevent PDF encoding corruptions.
 */
function escapePdfText(str: string): string {
  if (!str) return '';
  return str
    .replace(/[^\x20-\x7E]/g, ' ') // retain standard printable ASCII
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

/**
 * Builds a standard A4 Landscape (842 x 595 pt) Certificate PDF as a Uint8Array.
 */
export async function generateCertificatePdf(data: CertificatePdfData): Promise<Uint8Array> {
  const serialNo = String(data.serial_number || '222');
  const regId = String(data.registration_id || serialNo);
  const studentName = escapePdfText(data.student_name || 'Md Ali Hosen');
  const className = escapePdfText(data.class_name || 'Diploma in Corporate Business Valuation');
  const grade = escapePdfText(data.grade || 'A+');
  const session = escapePdfText(data.session_title || '2027-28');
  const startDate = escapePdfText(data.start_date || '22 Aug 2026');
  const endDate = escapePdfText(data.end_date || '13 Sep 2026');
  const issuedAt = escapePdfText(data.issued_at || '28 Sep 2026');

  // Stream graphics and text commands
  const streamOps: string[] = [
    // Background - Warm Cream
    '0.988 0.984 0.968 rg',
    '0 0 842 595 re',
    'f',

    // Outer Gold Border
    '0.784 0.588 0.243 RG',
    '3 w',
    '24 24 794 547 re',
    'S',

    // Inner Navy Border
    '0.039 0.098 0.184 RG',
    '1 w',
    '32 32 778 531 re',
    'S',

    // Top Header Banner
    '0.039 0.098 0.184 rg',
    '40 500 762 55 re',
    'f',

    // Institution Title in Banner
    'BT',
    '/F1 20 Tf',
    '1 1 1 rg',
    '190 522 Td',
    '(CHARTERED OFFICER LIMITED) Tj',
    'ET',

    'BT',
    '/F2 8.5 Tf',
    '0.98 0.85 0.35 rg',
    '230 508 Td',
    '(CENTER OF EXCELLENCE FOR PROFESSIONAL FINANCE & LEADERSHIP) Tj',
    'ET',

    // Certificate Title
    'BT',
    '/F3 26 Tf',
    '0.039 0.098 0.184 rg',
    '260 450 Td',
    '(CERTIFICATE OF ACHIEVEMENT) Tj',
    'ET',

    // Gold Accent Bar
    '0.784 0.588 0.243 rg',
    '321 438 200 2.5 re',
    'f',

    // "This is proudly presented to"
    'BT',
    '/F2 11 Tf',
    '0.4 0.45 0.55 rg',
    '330 412 Td',
    '(This is proudly presented to) Tj',
    'ET',

    // Student Name
    'BT',
    '/F1 24 Tf',
    '0.039 0.098 0.184 rg',
    `280 372 Td`,
    `(${studentName}) Tj`,
    'ET',

    // Underline beneath Student Name
    '0.784 0.588 0.243 RG',
    '1 w',
    '200 362 442 0.5 re',
    'S',

    // Achievement Description
    'BT',
    '/F2 10.5 Tf',
    '0.3 0.35 0.45 rg',
    '140 330 Td',
    '(for successfully fulfilling all requirements and demonstrating outstanding performance in) Tj',
    'ET',

    // Program / Course Name
    'BT',
    '/F1 16 Tf',
    '0.72 0.52 0.18 rg',
    `210 295 Td`,
    `(${className}) Tj`,
    'ET',

    // Batch & Session Details
    'BT',
    '/F2 9.5 Tf',
    '0.3 0.35 0.45 rg',
    '220 265 Td',
    `(${escapePdfText(`Academic Session: ${session}   |   Duration: ${startDate} - ${endDate}`)}) Tj`,
    'ET',

    // Verification Box
    '0.95 0.96 0.98 rg',
    '160 170 522 65 re',
    'f',
    '0.85 0.88 0.92 RG',
    '1 w',
    '160 170 522 65 re',
    'S',

    // Data in Verification Box
    'BT',
    '/F2 9 Tf',
    '0.4 0.45 0.55 rg',
    '180 215 Td',
    '(REGISTRATION ID) Tj',
    '140 0 Td',
    '(SERIAL NUMBER) Tj',
    '140 0 Td',
    '(FINAL GRADE) Tj',
    'ET',

    'BT',
    '/F1 12 Tf',
    '0.039 0.098 0.184 rg',
    `180 190 Td`,
    `(${regId}) Tj`,
    '140 0 Td',
    `(#${serialNo}) Tj`,
    '140 0 Td',
    '0.1 0.6 0.25 rg',
    `(${grade}) Tj`,
    'ET',

    // Signatures
    // Left: Academic Director
    '0.5 0.5 0.5 RG',
    '0.8 w',
    '130 95 180 0.5 re',
    'S',
    'BT',
    '/F1 9.5 Tf',
    '0.1 0.15 0.25 rg',
    '170 80 Td',
    '(Academic Director) Tj',
    'ET',
    'BT',
    '/F2 8 Tf',
    '0.45 0.5 0.6 rg',
    '150 67 Td',
    '(Council of Examination) Tj',
    'ET',

    // Center: Official Stamp / Issued Date
    'BT',
    '/F2 8 Tf',
    '0.4 0.45 0.55 rg',
    '385 85 Td',
    '(DATE OF ISSUANCE) Tj',
    'ET',
    'BT',
    '/F1 9 Tf',
    '0.039 0.098 0.184 rg',
    '380 70 Td',
    `(${issuedAt}) Tj`,
    'ET',

    // Right: President & Chairman
    '0.5 0.5 0.5 RG',
    '0.8 w',
    '532 95 180 0.5 re',
    'S',
    'BT',
    '/F1 9.5 Tf',
    '0.1 0.15 0.25 rg',
    '570 80 Td',
    '(President & Chairman) Tj',
    'ET',
    'BT',
    '/F2 8 Tf',
    '0.45 0.5 0.6 rg',
    '542 67 Td',
    '(Board of Executive Governors) Tj',
    'ET',

    // Footer verification text
    'BT',
    '/F2 7 Tf',
    '0.55 0.6 0.65 rg',
    '230 40 Td',
    '(Verify authenticity online at charteredcfo.org/verify with Registration ID) Tj',
    'ET',
  ];

  const streamContent = streamOps.join('\n');
  const streamLength = Buffer.byteLength(streamContent, 'utf-8');

  // Standard PDF 1.4 Objects
  const objects: string[] = [];

  // 1: Catalog
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj');

  // 2: Pages
  objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj');

  // 3: Page (A4 Landscape: [0 0 842 595])
  objects.push(
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> >> /Contents 7 0 R >>\nendobj'
  );

  // 4: Font F1 (Helvetica-Bold)
  objects.push('4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj');

  // 5: Font F2 (Helvetica)
  objects.push('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj');

  // 6: Font F3 (Times-Bold)
  objects.push('6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>\nendobj');

  // 7: Contents Stream
  objects.push(`7 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj`);

  // Build the complete PDF file with correct cross-reference table (xref)
  let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const offsets: number[] = [];

  for (let i = 0; i < objects.length; i++) {
    offsets.push(Buffer.byteLength(pdf, 'utf-8'));
    pdf += objects[i] + '\n';
  }

  const xrefOffset = Buffer.byteLength(pdf, 'utf-8');
  pdf += 'xref\n';
  pdf += `0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';

  for (const offset of offsets) {
    pdf += offset.toString().padStart(10, '0') + ' 00000 n \n';
  }

  pdf += 'trailer\n';
  pdf += `<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += 'startxref\n';
  pdf += `${xrefOffset}\n`;
  pdf += '%%EOF\n';

  return new Uint8Array(Buffer.from(pdf, 'latin1'));
}
