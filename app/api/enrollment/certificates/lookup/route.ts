import { NextRequest, NextResponse } from 'next/server';

export interface CertificateData {
  id?: number | string;
  serial_number: number | string;
  grade: string;
  registration_id: string;
  student_name: string;
  father_name?: string;
  mother_name?: string;
  class_name: string;
  session_title: string | null;
  start_date?: string | null;
  end_date?: string | null;
  issued_at: string | null;
  view_url?: string;
  download_url: string;
  // Associated user lookup fields
  email?: string;
  phone?: string;
}

// Phone normalization helper replicating the Laravel controller's phoneVariants
function getPhoneVariants(input: string): string[] {
  const digits = input.replace(/\D+/g, '');
  if (digits.length < 10) {
    return [input];
  }
  const local = digits.startsWith('880') ? digits.slice(3) : digits.replace(/^0+/, '');
  return Array.from(
    new Set([input, digits, '0' + local, '880' + local, '+880' + local])
  );
}

// Clean dataset with phone numbers and emails for local/offline testing
const MOCK_CERTIFICATES: CertificateData[] = [
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
    download_url: '/api/enrollment/certificates/222/download',
    view_url: '/api/enrollment/certificates/222/view',
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
    download_url: '/api/enrollment/certificates/222-TAX/download',
    view_url: '/api/enrollment/certificates/222-TAX/view',
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
    download_url: '/api/enrollment/certificates/2222/download',
    view_url: '/api/enrollment/certificates/2222/view',
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
    download_url: '/api/enrollment/certificates/2223/download',
    view_url: '/api/enrollment/certificates/2223/view',
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
    download_url: '/api/enrollment/certificates/2224/download',
    view_url: '/api/enrollment/certificates/2224/view',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Accept identifier, or fall back to registration_id / email / phone / id
  const identifier =
    searchParams.get('identifier') ||
    searchParams.get('registration_id') ||
    searchParams.get('email') ||
    searchParams.get('phone') ||
    searchParams.get('id');

  if (!identifier || !identifier.trim()) {
    return NextResponse.json(
      {
        success: false,
        message: 'identifier parameter is required (registration_id, email, or phone)',
      },
      { status: 400 }
    );
  }

  const rawIdentifier = identifier.trim();
  const lowerIdentifier = rawIdentifier.toLowerCase();
  const variants = getPhoneVariants(rawIdentifier);

  // 1. Attempt to query live Laravel backend API if available
  try {
    const backendBase =
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_BACKEND_API_URL ||
      'http://127.0.0.1:8000';

    // Backend endpoint accepts: /api/enrollment/certificates/lookup?identifier=...
    const backendUrl = `${backendBase.replace(/\/$/, '')}/api/enrollment/certificates/lookup?identifier=${encodeURIComponent(
      rawIdentifier
    )}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(backendUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
        // Clean download URLs before sending to client so internal backend URLs are never exposed
        const cleanList = data.data.map((item: any) => {
          const serial = String(item.serial_number || item.registration_id);
          return {
            ...item,
            download_url: `/api/enrollment/certificates/${encodeURIComponent(serial)}/download`,
            view_url: `/api/enrollment/certificates/${encodeURIComponent(serial)}/view`,
          };
        });
        return NextResponse.json({ success: true, data: cleanList });
      }
    } else if (res.status === 404) {
      // Backend returned 404: No certificate found for this identifier
      const errData = await res.json().catch(() => null);
      return NextResponse.json(
        {
          success: false,
          message:
            errData?.message ||
            'No certificate found for this registration ID, email, or phone.',
        },
        { status: 404 }
      );
    }
  } catch {
    // Backend unreachable, fallback to verified mock records
  }

  // 2. Filter Mock Records by registration_id, serial_number, email, or phoneVariants
  const matched = MOCK_CERTIFICATES.filter((c) => {
    // Check registration_id
    if (c.registration_id.toLowerCase() === lowerIdentifier) return true;
    // Check serial_number
    if (String(c.serial_number).toLowerCase() === lowerIdentifier) return true;
    // Check email
    if (c.email && c.email.toLowerCase() === lowerIdentifier) return true;
    // Check phone variants
    if (c.phone) {
      const itemPhoneVariants = getPhoneVariants(c.phone);
      if (variants.some((v) => itemPhoneVariants.includes(v))) return true;
    }
    // Check student name substring
    if (rawIdentifier.length >= 3 && c.student_name.toLowerCase().includes(lowerIdentifier)) {
      return true;
    }
    return false;
  }).map((item) => {
    // Hide father_name and mother_name in lookup results as per Laravel controller
    const { father_name, mother_name, email, phone, ...lookupData } = item;
    return lookupData;
  });

  if (matched.length === 0) {
    return NextResponse.json(
      {
        success: false,
        message: 'No certificate found for this registration ID, email, or phone.',
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: matched,
    isMockFallback: true,
  });
}
