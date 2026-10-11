export interface CertificateRecord {
  id?: number | string;
  serial_number: number | string;
  grade: string;
  registration_id: string;
  student_name: string;
  father_name?: string | null;
  mother_name?: string | null;
  class_name: string;
  session_title: string | null;
  start_date?: string | null;
  end_date?: string | null;
  issued_at: string | null;
  download_url: string;
  view_url?: string;
  // User profile identifiers used for matching when backend is unreachable
  email?: string;
  phone?: string;
}

/**
 * Handles phone variants matching the Laravel controller's phoneVariants implementation:
 * 017..., 88017..., +88017..., with spaces, dashes, or parentheses in the input.
 */
export function getPhoneVariants(input: string): string[] {
  const digits = input.replace(/\D+/g, '');

  // Not phone-like (e.g. short registration ID, email), return as is
  if (digits.length < 10) {
    return [input];
  }

  const local = digits.startsWith('880') ? digits.slice(3) : digits.replace(/^0+/, '');

  return Array.from(
    new Set([input, digits, '0' + local, '880' + local, '+880' + local])
  );
}

/**
 * Exact API certificate records matching the Laravel backend response:
 * GET http://127.0.0.1:8000/api/enrollment/certificates/lookup
 */
export const MOCK_CERTIFICATES: CertificateRecord[] = [
  {
    serial_number: 222,
    grade: 'A+',
    registration_id: '222',
    student_name: 'Md Ali Hosen',
    class_name: 'Diploma in Corporate Business Valuation',
    session_title: '2027-28',
    start_date: '22 Aug 2026',
    end_date: '13 Sep 2026',
    issued_at: '28 Sep 2026',
    download_url: 'http://127.0.0.1:8000/api/enrollment/certificates/222/download',
    email: 'alihose@gmail.com',
    phone: '01712345678',
  },
  {
    serial_number: 2234,
    grade: 'A-',
    registration_id: '1',
    student_name: 'Md Ali Hosen',
    class_name: 'Diploma in Business Innovation and Entrepreneurship Development\n\n',
    session_title: '2027-28',
    start_date: '22 Aug 2026',
    end_date: '13 Sep 2026',
    issued_at: '11 Oct 2026',
    download_url: 'http://127.0.0.1:8000/api/enrollment/certificates/2234/download',
    email: 'alihose@gmail.com',
    phone: '01712345678',
  },
];

/**
 * Transforms certificate record matching Laravel transform($cert, $full)
 * Preserves the exact download_url sent by the API.
 */
export function transformCertificate(cert: CertificateRecord, full = true): Record<string, any> {
  const serial = cert.serial_number;
  const backendDownloadUrl =
    cert.download_url ||
    `http://127.0.0.1:8000/api/enrollment/certificates/${encodeURIComponent(String(serial))}/download`;

  const data: Record<string, any> = {
    serial_number: serial,
    grade: cert.grade,
    registration_id: cert.registration_id || null,
    student_name: cert.student_name,
    class_name: cert.class_name,
    session_title: cert.session_title || null,
    start_date: cert.start_date || null,
    end_date: cert.end_date || null,
    issued_at: cert.issued_at || null,
    download_url: backendDownloadUrl,
  };

  if (full) {
    if (cert.father_name !== undefined) data.father_name = cert.father_name;
    if (cert.mother_name !== undefined) data.mother_name = cert.mother_name;
  }

  return data;
}

/**
 * Searches certificates by identifier (registration_id, serial_number, email, or phone)
 */
export function findCertificatesByIdentifier(identifier: string): Record<string, any>[] {
  const trimmed = identifier.trim();
  const lower = trimmed.toLowerCase();
  const variants = getPhoneVariants(trimmed);

  const matched = MOCK_CERTIFICATES.filter((cert) => {
    // 1. Match registration_id
    if (String(cert.registration_id).toLowerCase() === lower) return true;
    // 2. Match serial_number
    if (String(cert.serial_number).toLowerCase() === lower) return true;
    // 3. Match email
    if (cert.email && cert.email.toLowerCase() === lower) return true;
    // 4. Match phone variants
    if (cert.phone) {
      const itemVariants = getPhoneVariants(cert.phone);
      if (variants.some((v) => itemVariants.includes(v))) return true;
    }
    // 5. Fallback name substring match if length >= 3
    if (lower.length >= 3 && cert.student_name.toLowerCase().includes(lower)) {
      return true;
    }
    return false;
  });

  return matched.map((cert) => transformCertificate(cert, false));
}

/**
 * Finds certificate by serial number with full details
 */
export function findCertificateBySerial(serial: string): Record<string, any> | null {
  const cleanSerial = serial.trim().toLowerCase();
  const cert = MOCK_CERTIFICATES.find(
    (c) =>
      String(c.serial_number).toLowerCase() === cleanSerial ||
      String(c.registration_id).toLowerCase() === cleanSerial
  );

  if (!cert) return null;
  return transformCertificate(cert, true);
}
