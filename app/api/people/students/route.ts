import { NextRequest, NextResponse } from 'next/server';

interface ApiStudent {
  id: number;
  full_name: string;
  email: string;
  username: string;
  status: number;
  avatar?: string;
  program?: string;
  batch?: string;
  organization?: string;
}

const FALLBACK_STUDENTS_RESPONSE = {
  success: true,
  data: {
    current_page: 1,
    data: [
      {
        id: 6,
        full_name: 'A Dummy User',
        email: 'dummyuser@gmail.com',
        username: 'dummyuser',
        status: 1,
      },
      {
        id: 4,
        full_name: 'John Doe',
        email: 'john@example.com',
        username: 'johndoe',
        status: 1,
      },
    ],
    first_page_url: '/api/people/students?page=1',
    from: 1,
    last_page: 1,
    last_page_url: '/api/people/students?page=1',
    links: [
      {
        url: null,
        label: '&laquo; Previous',
        page: null,
        active: false,
      },
      {
        url: '/api/people/students?page=1',
        label: '1',
        page: 1,
        active: true,
      },
      {
        url: null,
        label: 'Next &raquo;',
        page: null,
        active: false,
      },
    ],
    next_page_url: null,
    path: '/api/people/students',
    per_page: 15,
    prev_page_url: null,
    to: 2,
    total: 2,
  },
  meta: {
    current_page: 1,
    last_page: 1,
    total: 2,
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';

  const backendBaseUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    'http://127.0.0.1:8000';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const targetUrl = `${backendBaseUrl.replace(/\/$/, '')}/api/people/students?page=${page}`;
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 10 },
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      if (json && json.data) {
        return NextResponse.json({
          ...json,
          isLive: true,
        });
      }
    }
  } catch {
    // Backend offline / unreachable -> fallback gracefully
  }

  return NextResponse.json({
    ...FALLBACK_STUDENTS_RESPONSE,
    isLive: false,
    fallback: true,
  });
}
