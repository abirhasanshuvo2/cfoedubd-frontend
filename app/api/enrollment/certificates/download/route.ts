import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const serial =
    searchParams.get('serial_number') ||
    searchParams.get('serial') ||
    searchParams.get('registration_id') ||
    searchParams.get('identifier') ||
    searchParams.get('id') ||
    '222';
  const customUrl = searchParams.get('url');

  const backendBase = (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    'http://127.0.0.1:8000'
  ).replace(/\/$/, '');

  // Backend Laravel route: GET /api/enrollment/certificates/{serial}/download
  const backendUrl =
    customUrl && customUrl.startsWith('http')
      ? customUrl
      : `${backendBase}/api/enrollment/certificates/${encodeURIComponent(serial)}/download`;

  try {
    const res = await fetch(backendUrl, {
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    });

    if (res.ok) {
      const contentType = res.headers.get('content-type') || 'application/pdf';
      const arrayBuffer = await res.arrayBuffer();

      return new NextResponse(arrayBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="certificate-${serial}.pdf"`,
          'Cache-Control': 'no-cache',
        },
      });
    }
  } catch {
    // Redirect client directly to backend download URL
  }

  return NextResponse.redirect(backendUrl);
}
