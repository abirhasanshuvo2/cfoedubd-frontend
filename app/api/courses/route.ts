import { NextResponse } from 'next/server';
import { INITIAL_API_COURSES } from '@/data/cfo-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const backendBaseUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    'http://127.0.0.1:8000';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const targetUrl = `${backendBaseUrl.replace(/\/$/, '')}/api/courses`;
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
      let coursesArray: any[] = [];
      let meta = {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
      };

      if (json && json.data && Array.isArray(json.data.data)) {
        coursesArray = json.data.data;
        meta = {
          current_page: json.data.current_page || 1,
          last_page: json.data.last_page || 1,
          per_page: json.data.per_page || 15,
          total: json.data.total || json.data.data.length,
        };
      } else if (json && Array.isArray(json.data)) {
        coursesArray = json.data;
        meta.total = json.data.length;
      } else if (Array.isArray(json)) {
        coursesArray = json;
        meta.total = json.length;
      }

      if (coursesArray.length > 0) {
        return NextResponse.json({
          success: true,
          data: coursesArray,
          meta,
          isLive: true,
        });
      }
    }
  } catch {
    // If backend is not running or offline, return fallback initial API courses
  }

  // Graceful fallback to the exact provided API course catalog
  return NextResponse.json({
    success: true,
    data: INITIAL_API_COURSES,
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: INITIAL_API_COURSES.length,
    },
    isLive: false,
    fallback: true,
  });
}
