import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing url query parameter', { status: 400 });
  }

  try {
    const customBackendUrl = request.headers.get('x-custom-backend-url');
    let target = imageUrl;

    // If it's a localhost:8000 URL and running on cloud, translate to local backend if configured
    if (customBackendUrl && target.includes('localhost:8000')) {
      target = target.replace('http://localhost:8000', customBackendUrl.replace(/\/$/, ''));
    }

    const response = await fetch(target, {
      headers: {
        Accept: 'image/*,*/*',
      },
      signal: AbortSignal.timeout(4000),
    });

    if (!response.ok) {
      return new NextResponse('Failed to fetch image from source', { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch {
    return new NextResponse('Image proxy error', { status: 502 });
  }
}
