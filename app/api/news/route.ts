import { NextResponse } from 'next/server';
import { ApiNewsItem, INITIAL_API_NEWS } from '@/data/news-data';

export type { ApiNewsItem };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const customBackendUrl = request.headers.get('x-custom-backend-url');

  const backendBaseUrl = (
    customBackendUrl ||
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    'http://127.0.0.1:8000'
  ).replace(/\/$/, '');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const targetUrl = `${backendBaseUrl}/api/settings/news?page=${page}`;
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 15 },
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      return NextResponse.json({
        ...json,
        isLiveBackend: true,
        backendUrl: backendBaseUrl,
      });
    }
  } catch {
    // If local or cloud backend is not reachable, fallback to baseline data
  }

  // Graceful fallback with user's exact initial API items
  return NextResponse.json({
    success: true,
    isLiveBackend: false,
    data: {
      current_page: 1,
      data: INITIAL_API_NEWS,
      first_page_url: `${backendBaseUrl}/api/settings/news?page=1`,
      from: 1,
      last_page: 1,
      last_page_url: `${backendBaseUrl}/api/settings/news?page=1`,
      links: [
        { url: null, label: '&laquo; Previous', page: null, active: false },
        { url: `${backendBaseUrl}/api/settings/news?page=1`, label: '1', page: 1, active: true },
        { url: null, label: 'Next &raquo;', page: null, active: false },
      ],
      next_page_url: null,
      path: `${backendBaseUrl}/api/settings/news`,
      per_page: 12,
      prev_page_url: null,
      to: INITIAL_API_NEWS.length,
      total: INITIAL_API_NEWS.length,
    },
  });
}
