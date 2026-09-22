import { NextResponse } from 'next/server';
import { DEFAULT_SYSTEM_INFO, SystemInformation } from '@/data/system-info';

export async function GET() {
  const backendBaseUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    'http://127.0.0.1:8000';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const targetUrl = `${backendBaseUrl.replace(/\/$/, '')}/api/system-information`;
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
      if (json && json.data) {
        return NextResponse.json({
          success: true,
          data: json.data as SystemInformation,
          isLive: true,
        });
      }
    }
  } catch {
    // If backend is not running, offline, or unreachable from container, fallback gracefully
  }

  // Fallback to the real, provided default system info
  return NextResponse.json({
    success: true,
    data: DEFAULT_SYSTEM_INFO,
    isLive: false,
    fallback: true,
  });
}
