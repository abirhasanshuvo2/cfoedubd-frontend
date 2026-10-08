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

  // 1. Attempt to query live Laravel backend API if available
  try {
    const backendBase = (
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_BACKEND_API_URL ||
      'http://127.0.0.1:8000'
    ).replace(/\/$/, '');

    // Backend endpoint accepts: GET /api/enrollment/certificates/lookup?identifier=...
    const backendUrl = `${backendBase}/api/enrollment/certificates/lookup?identifier=${encodeURIComponent(
      rawIdentifier
    )}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(backendUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
        // Clean download URLs before sending to client so internal backend URLs are never exposed
        const cleanList = data.data.map((item: any) => {
          const serial = String(item.serial_number || item.registration_id);
          return {
            ...item,
            download_url: `/api/enrollment/certificates/${encodeURIComponent(serial)}/download`,
            view_url: `/api/enrollment/certificates/${encodeURIComponent(serial)}/view`,
          };
        });
        return NextResponse.json({ success: true, data: cleanList });
      }
    } else if (res.status === 404) {
      // Backend returned 404: No certificate found for this identifier
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
    // Backend unreachable, fallback to verified mock records
  }

  // 2. Filter Mock Records by registration_id, serial_number, email, or phoneVariants
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
    isMockFallback: true,
  });
}
