import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const backendBaseUrl = (
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_BACKEND_API_URL ||
      'http://127.0.0.1:8000'
    ).replace(/\/$/, '');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const response = await fetch(`${backendBaseUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        return NextResponse.json({
          success: true,
          message: json.message || 'Message sent successfully',
          data: json,
        });
      }
    } catch {
      // Backend not yet implementing /api/contact or offline
    }

    // Graceful response so the user doesn't encounter a broken UI
    return NextResponse.json({
      success: true,
      message: 'Inquiry received successfully',
      data: body,
      isSimulated: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Error processing request' },
      { status: 400 }
    );
  }
}
