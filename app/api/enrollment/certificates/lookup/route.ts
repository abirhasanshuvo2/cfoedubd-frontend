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
  start_date?: string;
  end_date?: string;
  issued_at: string;
  view_url?: string;
  download_url: string;
}

// Clean dataset without any exposed raw API URLs or localhost links
const MOCK_CERTIFICATES: CertificateData[] = [
  {
    id: 1,
    serial_number: 222,
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
    download_url: '/api/enrollment/certificates/222/download',
    view_url: '/api/enrollment/certificates/222/view',
  },
  {
    id: 2,
    serial_number: 2222,
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
    download_url: '/api/enrollment/certificates/5/download',
    view_url: '/api/enrollment/certificates/5/view',
  },
  {
    id: 3,
    serial_number: 2223,
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
    download_url: '/api/enrollment/certificates/8/download',
    view_url: '/api/enrollment/certificates/8/view',
  },
  {
    id: 4,
    serial_number: 2224,
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
    download_url: '/api/enrollment/certificates/COL-CFO-2025-9921/download',
    view_url: '/api/enrollment/certificates/COL-CFO-2025-9921/view',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const registrationId = searchParams.get('registration_id');

  if (!registrationId || !registrationId.trim()) {
    return NextResponse.json(
      { success: false, message: 'registration_id parameter is required' },
      { status: 400 }
    );
  }

  const queryTrimmed = registrationId.trim().toLowerCase();

  // 1. Attempt to query live backend API if available (server-side only, never exposing URL to client)
  try {
    const backendBase =
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_BACKEND_API_URL ||
      'http://127.0.0.1:8000';

    const backendUrl = `${backendBase.replace(/\/$/, '')}/api/enrollment/certificates/lookup?registration_id=${encodeURIComponent(
      registrationId.trim()
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
      if (data && (Array.isArray(data) || Array.isArray(data.data))) {
        const rawList = Array.isArray(data) ? data : data.data;
        // Clean download URLs before sending to client so internal backend URLs are never exposed
        const cleanList = rawList.map((item: CertificateData) => ({
          ...item,
          download_url: `/api/enrollment/certificates/${encodeURIComponent(String(item.registration_id || item.serial_number))}/download`,
          view_url: `/api/enrollment/certificates/${encodeURIComponent(String(item.registration_id || item.serial_number))}/view`,
        }));
        return NextResponse.json({ success: true, data: cleanList });
      }
    }
  } catch {
    // Backend unreachable, fallback to verified mock records
  }

  // 2. Filter Mock Records
  const matched = MOCK_CERTIFICATES.filter(
    (c) =>
      c.registration_id.toLowerCase() === queryTrimmed ||
      String(c.serial_number) === queryTrimmed ||
      c.student_name.toLowerCase().includes(queryTrimmed)
  );

  return NextResponse.json({
    success: true,
    data: matched,
    isMockFallback: true,
  });
}
