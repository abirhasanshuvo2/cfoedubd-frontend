import { NextRequest, NextResponse } from 'next/server';

interface ApiEducator {
  id: number;
  full_name: string;
  email: string;
  username: string;
  title?: string;
  role?: string;
  avatar?: string;
  courses?: string[];
  rating?: number;
  students_count?: number;
}

const FALLBACK_EDUCATORS_RESPONSE = {
  success: true,
  data: {
    current_page: 1,
    data: [
      {
        id: 7,
        full_name: 'Md Ali',
        email: 'ali@gmail.com',
        username: 'alihossain',
        title: 'Senior Financial Analyst & Corporate Trainer',
        role: 'Faculty - Corporate Valuation & FP&A',
        rating: 4.95,
        students_count: 1450,
        courses: ['Diploma in Corporate Business Valuation', 'Financial Modeling with Excel & Python'],
      },
      {
        id: 2,
        full_name: 'Md. Abir Hasan',
        email: 'abirhasanshuvo789@gmail.com',
        username: 'abirhasanshuvo',
        title: 'Lead Software Architect & Tech Facilitator',
        role: 'Faculty - CSE, Flutter & Mobile Systems',
        rating: 4.98,
        students_count: 1820,
        courses: ['CSE Courses: Flutter & State Management', 'Laravel Enterprise API Development'],
      },
      {
        id: 3,
        full_name: 'Mr X',
        email: 'mrx@gmail.com',
        username: 'mrx',
        title: 'Fellow Chartered Accountant (FCA)',
        role: 'Lead Mentor - CFO Flagship & Board Governance',
        rating: 4.92,
        students_count: 2200,
        courses: ['Chartered Financial Officer (CFO) Flagship 1-Year', 'Advanced IFRS & Corporate Governance'],
      },
      {
        id: 8,
        full_name: 'Mr Teacher S',
        email: 'mts@gmail.com',
        username: 'mts',
        title: 'National VAT Consultant & Supreme Court Practitioner',
        role: 'Faculty - Tax & VAT Law',
        rating: 4.96,
        students_count: 3100,
        courses: ['PGD in Advanced VAT & Corporate Taxation', 'Customs Bond & Mushak 9.1 Return'],
      },
    ],
    first_page_url: 'http://127.0.0.1:8000/api/people/educators?page=1',
    from: 1,
    last_page: 1,
    last_page_url: 'http://127.0.0.1:8000/api/people/educators?page=1',
    links: [
      {
        url: null,
        label: '&laquo; Previous',
        page: null,
        active: false,
      },
      {
        url: 'http://127.0.0.1:8000/api/people/educators?page=1',
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
    path: 'http://127.0.0.1:8000/api/people/educators',
    per_page: 15,
    prev_page_url: null,
    to: 4,
    total: 4,
  },
  meta: {
    current_page: 1,
    last_page: 1,
    total: 4,
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

    const targetUrl = `${backendBaseUrl.replace(/\/$/, '')}/api/people/educators?page=${page}`;
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
    ...FALLBACK_EDUCATORS_RESPONSE,
    isLive: false,
    fallback: true,
  });
}
