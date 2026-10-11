import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const serial = id || '222';
  const { searchParams } = new URL(request.url);
  const isInline = searchParams.get('inline') === '1' || searchParams.get('view') === '1';
  const customUrl = searchParams.get('url');

  const backendBase = (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    'http://127.0.0.1:8000'
  ).replace(/\/$/, '');

  // Backend Laravel endpoint: GET /api/enrollment/certificates/{serial}/download
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
          'Content-Disposition': isInline
            ? `inline; filename="certificate-${serial}.pdf"`
            : `attachment; filename="certificate-${serial}.pdf"`,
          'Cache-Control': 'no-cache',
          'X-Frame-Options': 'SAMEORIGIN',
        },
      });
    }
  } catch {
    // Redirect client browser directly to backend download URL
  }

  return NextResponse.redirect(backendUrl);
}
