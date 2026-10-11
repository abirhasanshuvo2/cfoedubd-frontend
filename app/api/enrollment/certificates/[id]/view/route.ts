import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const serial = id || '222';
  const { searchParams } = new URL(request.url);
  const customUrl = searchParams.get('url');

  const backendBase = (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    'http://127.0.0.1:8000'
  ).replace(/\/$/, '');

  // Use the exact download_url from the API response or construct from serial_number
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
          'Content-Disposition': `inline; filename="certificate-${serial}.pdf"`,
          'Cache-Control': 'no-cache',
          'X-Frame-Options': 'SAMEORIGIN',
        },
      });
    }
  } catch {
    // If server cannot reach local backend, redirect browser directly to backendUrl
  }

  return NextResponse.redirect(backendUrl);
}
