import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const regId = id || '222';

  const backendBase = (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    'http://127.0.0.1:8000'
  ).replace(/\/$/, '');

  const backendUrl = `${backendBase}/api/enrollment/certificates/${encodeURIComponent(regId)}/download`;

  try {
    const res = await fetch(backendUrl, {
      signal: AbortSignal.timeout(3500),
    });

    if (res.ok) {
      const contentType = res.headers.get('content-type') || 'application/pdf';
      const arrayBuffer = await res.arrayBuffer();

      return new NextResponse(arrayBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          // Use inline disposition so browsers display the PDF inside <iframe> and <object>
          'Content-Disposition': `inline; filename="certificate-${regId}.pdf"`,
          'Cache-Control': 'no-cache',
          'X-Frame-Options': 'SAMEORIGIN',
        },
      });
    }
  } catch {
    // If local backend is not reachable from server, redirect to client
  }

  // Redirect to direct backend download url
  return NextResponse.redirect(backendUrl);
}
