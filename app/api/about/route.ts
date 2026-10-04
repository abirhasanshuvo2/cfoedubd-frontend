import { NextResponse } from 'next/server';
import { OFFICIAL_ABOUT_DATA, AboutData } from '@/data/about-data';

export async function GET() {
  const backendBaseUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    'http://127.0.0.1:8000';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const targetUrl = `${backendBaseUrl.replace(/\/$/, '')}/api/about`;
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 60 },
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      if (json && (json.data || json.about)) {
        return NextResponse.json({
          success: true,
          data: (json.data || json.about) as AboutData,
          isLive: true,
        });
      }
    }
  } catch {
    // Backend offline or not implementing /api/about, use verified official data
  }

  return NextResponse.json({
    success: true,
    data: OFFICIAL_ABOUT_DATA,
    isLive: false,
    source: 'https://cfoedubd.com/about',
  });
}
