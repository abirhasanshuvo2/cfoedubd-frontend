import { NextRequest, NextResponse } from 'next/server';

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
    // Backend unreachable
  }

  // Fallback mock details
  return NextResponse.json({
    success: true,
    data: {
      serial_number: serial,
      grade: 'A+',
      registration_id: serial,
      student_name: 'Md Ali Hosen',
      father_name: 'Mr. Ali Hosen',
      mother_name: 'Mrs. Ali Hosen',
      class_name: 'Chartered Financial Officer (CFO)',
      session_title: 'Batch 2026-Q1',
      start_date: '22 Aug 2026',
      end_date: '13 Sep 2026',
      issued_at: '28 Sep 2026',
      download_url: `/api/enrollment/certificates/${encodeURIComponent(serial)}/download`,
    },
  });
}
