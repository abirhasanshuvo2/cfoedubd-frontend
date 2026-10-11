import { NextRequest, NextResponse } from 'next/server';
import { findCertificatesByIdentifier } from '@/lib/certificate-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Accept identifier, or fall back to registration_id / email / phone / id
  const identifier =
    searchParams.get('identifier') ||
    searchParams.get('registration_id') ||
    searchParams.get('email') ||
    searchParams.get('phone') ||
    searchParams.get('id');

  if (!identifier || !identifier.trim()) {
    return NextResponse.json(
      {
        success: false,
        message: 'identifier parameter is required (registration_id, email, or phone)',
      },
      { status: 400 }
    );
  }

  const rawIdentifier = identifier.trim();
  const backendBase = (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    'http://127.0.0.1:8000'
  ).replace(/\/$/, '');

  // 1. Query live Laravel backend API: GET /api/enrollment/certificates/lookup?identifier=...
  try {
    const backendUrl = `${backendBase}/api/enrollment/certificates/lookup?identifier=${encodeURIComponent(
      rawIdentifier
    )}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(backendUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        const rawList = Array.isArray(data.data)
          ? data.data
          : data.data
          ? [data.data]
          : [];

        // Preserve exact fields and download_url sent by the API
        const normalizedList = rawList.map((item: any) => {
          const serial = item.serial_number ?? item.registration_id;
          return {
            ...item,
            download_url:
              item.download_url ||
              `${backendBase}/api/enrollment/certificates/${encodeURIComponent(String(serial))}/download`,
          };
        });

        return NextResponse.json({
          success: true,
          data: normalizedList,
        });
      }
    } else if (res.status === 404) {
      const errData = await res.json().catch(() => null);
      return NextResponse.json(
        {
          success: false,
          message:
            errData?.message ||
            'No certificate found for this registration ID, email, or phone.',
        },
        { status: 404 }
      );
    }
  } catch {
    // Backend unreachable from server environment, fallback to matching records
  }

  // 2. Fallback when server is hosted remotely and cannot reach 127.0.0.1:8000 directly
  const matched = findCertificatesByIdentifier(rawIdentifier);

  if (matched.length === 0) {
    return NextResponse.json(
      {
        success: false,
        message: 'No certificate found for this registration ID, email, or phone.',
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: matched,
  });
}
