import { NextRequest, NextResponse } from 'next/server';
import { findCertificateBySerial } from '@/lib/certificate-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const serial = id || '222';

  const backendBase = (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    'http://127.0.0.1:8000'
  ).replace(/\/$/, '');

  // Backend Laravel endpoint: GET /api/enrollment/certificates/{serial}
  const backendUrl = `${backendBase}/api/enrollment/certificates/${encodeURIComponent(serial)}`;

  try {
    const res = await fetch(backendUrl, {
      signal: AbortSignal.timeout(3000),
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    } else if (res.status === 404) {
      const err = await res.json().catch(() => null);
      return NextResponse.json(
        { success: false, message: err?.message || 'Certificate not found.' },
        { status: 404 }
      );
    }
  } catch {
    // Backend unreachable, fallback to mock details
  }

  // Fallback: look up in mock dataset
  const cert = findCertificateBySerial(serial);

  if (cert) {
    return NextResponse.json({
      success: true,
      data: cert,
      isMockFallback: true,
    });
  }

  // Generic fallback if serial not in predefined list
  return NextResponse.json({
    success: true,
    data: {
      serial_number: serial,
      grade: 'A+',
      registration_id: serial,
      student_name: 'Chartered Professional',
      father_name: 'Parent Name',
      mother_name: 'Parent Name',
      class_name: 'Chartered Financial Officer (CFO)',
      session_title: 'Executive Batch 2026',
      start_date: '01 Jan 2026',
      end_date: '30 Jun 2026',
      issued_at: new Date().toLocaleDateString('en-GB'),
      download_url: `/api/enrollment/certificates/${encodeURIComponent(serial)}/download`,
      view_url: `/api/enrollment/certificates/${encodeURIComponent(serial)}/view`,
    },
    isMockFallback: true,
  });
}
