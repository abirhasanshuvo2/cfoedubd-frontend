export interface CertificateRecord {
  id?: number | string;
  serial_number: string;
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
  download_url?: string;
  view_url?: string;
  // User profile identifiers used for matching
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
 * Verified dataset representing student certificates across different programs.
 * Searchable by phone (01712345678, 01812345678, etc.), email, or registration ID.
 */
export const MOCK_CERTIFICATES: CertificateRecord[] = [
  {
    id: 1,
    serial_number: '222',
    grade: 'A+',
    registration_id: '222',
    student_name: 'Md Ali Hosen',
    father_name: 'Mr. Ali Hosen',
    mother_name: 'Mrs. Ali Hosen',
    class_name: 'Chartered Financial Officer (CFO)',
    session_title: 'Batch 2026-Q1',
    start_date: '22 Aug 2026',
    end_date: '13 Sep 2026',
    issued_at: '28 Sep 2026',
    email: 'ali@gmail.com',
    phone: '01712345678',
  },
  {
    id: 101,
    serial_number: '222-TAX',
    grade: 'Distinction',
    registration_id: '222',
    student_name: 'Md Ali Hosen',
    father_name: 'Mr. Ali Hosen',
    mother_name: 'Mrs. Ali Hosen',
    class_name: 'Corporate Tax & VAT Masterclass',
    session_title: 'Executive Batch 12',
    start_date: '05 Jan 2026',
    end_date: '28 Feb 2026',
    issued_at: '10 Mar 2026',
    email: 'ali@gmail.com',
    phone: '01712345678',
  },
  {
    id: 2,
    serial_number: '2222',
    grade: 'A',
    registration_id: '5',
    student_name: 'John Doe',
    father_name: 'Robert Doe',
    mother_name: 'Sarah Doe',
    class_name: 'Corporate Tax & VAT Masterclass',
    session_title: 'Batch 2026-Q1',
    start_date: '01 Jun 2026',
    end_date: '20 Aug 2026',
    issued_at: '22 Aug 2026',
    email: 'john@example.com',
    phone: '01812345678',
  },
  {
    id: 3,
    serial_number: '2223',
    grade: 'A+',
    registration_id: '8',
    student_name: 'Md. Tariqul Islam',
    father_name: 'Md. Rafiqul Islam',
    mother_name: 'Begum Rehana',
    class_name: 'Diploma in Corporate Business Valuation',
    session_title: 'Executive Batch 16',
    start_date: '10 May 2026',
    end_date: '05 Sep 2026',
    issued_at: '15 Sep 2026',
    email: 'tariqul@gmail.com',
    phone: '01912345678',
  },
  {
    id: 4,
    serial_number: '2224',
    grade: 'Distinction',
    registration_id: 'COL-CFO-2025-9921',
    student_name: 'Tanvir Hossain, ACA',
    father_name: 'Khorshed Alam',
    mother_name: 'Fatema Begum',
    class_name: 'Chartered Financial Officer (CFO)',
    session_title: 'Batch 18 — Weekend Executive',
    start_date: '15 Jan 2025',
    end_date: '10 Dec 2025',
    issued_at: '10 Jan 2026',
    email: 'tanvir@cfo.bd',
    phone: '01612345678',
  },
];

/**
 * Transforms certificate record matching Laravel transform($cert, $full)
 */
export function transformCertificate(cert: CertificateRecord, full = true): Record<string, any> {
  const serial = String(cert.serial_number);
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
    download_url: `/api/enrollment/certificates/${encodeURIComponent(serial)}/download`,
    view_url: `/api/enrollment/certificates/${encodeURIComponent(serial)}/view`,
  };

  if (full) {
    data.father_name = cert.father_name ?? null;
    data.mother_name = cert.mother_name ?? null;
  }

  return data;
}

/**
 * Searches certificates by identifier (registration_id, email, or phone)
 */
export function findCertificatesByIdentifier(identifier: string): Record<string, any>[] {
  const trimmed = identifier.trim();
  const lower = trimmed.toLowerCase();
  const variants = getPhoneVariants(trimmed);

  const matched = MOCK_CERTIFICATES.filter((cert) => {
    // 1. Match registration_id
    if (cert.registration_id.toLowerCase() === lower) return true;
    // 2. Match serial_number
    if (cert.serial_number.toLowerCase() === lower) return true;
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

  // Lookup results hide family details as per Laravel controller
  return matched.map((cert) => transformCertificate(cert, false));
}

/**
 * Finds certificate by serial number with full details
 */
export function findCertificateBySerial(serial: string): Record<string, any> | null {
  const cleanSerial = serial.trim().toLowerCase();
  const cert = MOCK_CERTIFICATES.find(
    (c) =>
      c.serial_number.toLowerCase() === cleanSerial ||
      c.registration_id.toLowerCase() === cleanSerial
  );

  if (!cert) return null;
  return transformCertificate(cert, true);
}
