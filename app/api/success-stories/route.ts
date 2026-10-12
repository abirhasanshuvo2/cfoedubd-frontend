import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const backendBaseUrl = (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    'http://127.0.0.1:8000'
  ).replace(/\/$/, '');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const targetUrl = `${backendBaseUrl}/api/success-stories`;
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      if (json && json.success && Array.isArray(json.data)) {
        return NextResponse.json({
          success: true,
          data: json.data,
          meta: json.meta || {
            current_page: 1,
            last_page: 1,
            total: json.data.length,
          },
          isLive: true,
        });
      }
    }
  } catch {
    // If backend cannot be reached, return empty data
  }

  return NextResponse.json({
    success: true,
    data: [],
    meta: {
      current_page: 1,
      last_page: 1,
      total: 0,
    },
    isLive: false,
  });
}
