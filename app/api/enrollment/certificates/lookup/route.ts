import { NextRequest, NextResponse } from 'next/server';

// Mock certificate lookup dataset adhering to the user's exact API schema
const MOCK_CERTIFICATES = [
  {
    id: 2,
    serial_number: 2222,
    grade: 'A',
    registration_id: '5',
    student_name: 'John Doe',
    class_name: 'Laravel REST API Masterclass',
    session_title: 'Batch 2026-Q1',
    issued_at: '22 Aug 2026',
    view_url: 'http://127.0.0.1:8000/enrollment/certificate/view/eyJpdiI6IlJVWU5ENU1WaC9kQ1psWVFDQ21VaVE9PSIsInZhbHVlIjoidnJyUVY5WThFVkQyd242cVJPb1U3Zz09IiwibWFjIjoiYTkzNGViZTM5ZWQ3ZDY4Mzg3OWVkN2I1YWVkZWUzOTFmZTM3N2IwOTBhMTE3YTk1YzQ3YzhmMTQyNTcwNDJiMCIsInRhZyI6IiJ9',
    download_url: 'http://127.0.0.1:8000/enrollment/certificate/download/eyJpdiI6InB0NnVoMGFqRGgxTDd6V1JpbGZVaFE9PSIsInZhbHVlIjoiZmJrTG5ETGVPVW9aTURBeHArY0xBQT09IiwibWFjIjoiYTZmM2Q1ZThmNmM4OWI2ZWUxZDU1ZTVjNjY4NzA2ZmE1ZWU4YzkxYTcwOTQ1Y2RlZTg0YzY3NDllNTE4MjJjMCIsInRhZyI6IiJ9',
  },
  {
    id: 3,
    serial_number: 2223,
    grade: 'A+',
    registration_id: '8',
    student_name: 'Md. Tariqul Islam',
    class_name: 'Diploma in Corporate Business Valuation',
    session_title: 'Executive Batch 16',
    issued_at: '15 Sep 2026',
    view_url: 'http://127.0.0.1:8000/enrollment/certificate/view/eyJpdiI6IlJVWU5ENU1WaC9kQ1psWVFDQ21VaVE9PSIsInZhbHVlIjoidnJyUVY5WThFVkQyd242cVJPb1U3Zz09IiwibWFjIjoiYTkzNGViZTM5ZWQ3ZDY4Mzg3OWVkN2I1YWVkZWUzOTFmZTM3N2IwOTBhMTE3YTk1YzQ3YzhmMTQyNTcwNDJiMCIsInRhZyI6IiJ9',
    download_url: 'http://127.0.0.1:8000/enrollment/certificate/download/eyJpdiI6InB0NnVoMGFqRGgxTDd6V1JpbGZVaFE9PSIsInZhbHVlIjoiZmJrTG5ETGVPVW9aTURBeHArY0xBQT09IiwibWFjIjoiYTZmM2Q1ZThmNmM4OWI2ZWUxZDU1ZTVjNjY4NzA2ZmE1ZWU4YzkxYTcwOTQ1Y2RlZTg0YzY3NDllNTE4MjJjMCIsInRhZyI6IiJ9',
  },
  {
    id: 4,
    serial_number: 2224,
    grade: 'Distinction',
    registration_id: 'COL-CFO-2025-9921',
    student_name: 'Tanvir Hossain, ACA',
    class_name: 'Chartered Financial Officer (CFO)',
    session_title: 'Batch 18 — Weekend Executive',
    issued_at: '10 Jan 2026',
    view_url: 'http://127.0.0.1:8000/enrollment/certificate/view/demo-cfo',
    download_url: 'http://127.0.0.1:8000/enrollment/certificate/download/demo-cfo',
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const registrationId = searchParams.get('registration_id');

  if (!registrationId) {
    return NextResponse.json({
      success: false,
      message: 'Registration ID is required',
      data: [],
    }, { status: 400 });
  }

  // 1. Attempt to query live backend API if available
  try {
    const backendBase = (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
    const backendUrl = `${backendBase}/api/enrollment/certificates/lookup?registration_id=${encodeURIComponent(registrationId)}`;
    const res = await fetch(backendUrl, {
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(3500),
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Backend fetch failed (e.g. running outside local network); proceed to fallback
  }

  // 2. Fallback matching
  const normalizedQuery = registrationId.trim().toLowerCase();
  const matched = MOCK_CERTIFICATES.filter(
    (c) =>
      c.registration_id.toLowerCase() === normalizedQuery ||
      c.serial_number.toString() === normalizedQuery ||
      c.student_name.toLowerCase().includes(normalizedQuery)
  );

  return NextResponse.json({
    success: true,
    data: matched,
  });
}
