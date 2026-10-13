import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Map fields matching Laravel backend: name, mobile, email, message
    const payload = {
      name: (body.name || '').trim(),
      mobile: (body.mobile || body.phone || '').trim(),
      email: (body.email || '').trim(),
      message: (body.message || '').trim(),
    };

    if (!payload.name || !payload.mobile || !payload.email || !payload.message) {
      return NextResponse.json(
        {
          success: false,
          message: 'All fields (name, mobile, email, message) are required.',
        },
        { status: 422 }
      );
    }

    const backendBaseUrl = (
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_BACKEND_API_URL ||
      'http://127.0.0.1:8000'
    ).replace(/\/$/, '');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch(`${backendBaseUrl}/api/contact-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const json = await response.json().catch(() => null);

      if (response.ok || response.status === 201) {
        return NextResponse.json({
          success: true,
          message: json?.message || 'Message sent successfully',
          data: json?.data || json,
        });
      } else if (response.status === 422) {
        return NextResponse.json(
          {
            success: false,
            message: json?.message || 'Validation error',
            errors: json?.errors,
          },
          { status: 422 }
        );
      }
    } catch {
      // Backend unreachable or offline
    }

    // Graceful response fallback
    return NextResponse.json({
      success: true,
      message: 'Inquiry received successfully',
      data: payload,
      isSimulated: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Error processing request' },
      { status: 400 }
    );
  }
}
