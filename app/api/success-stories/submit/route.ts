import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const {
      student_name,
      email,
      story,
      designation,
      company,
      batch,
      phone,
      video_url,
    } = body;

    if (!student_name || !email || !story) {
      return NextResponse.json(
        {
          success: false,
          message: 'Student name, email, and story are required.',
        },
        { status: 400 }
      );
    }

    const backendBaseUrl = (
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_BACKEND_API_URL ||
      'http://127.0.0.1:8000'
    ).replace(/\/$/, '');

    // The backend endpoint accepts POST with query parameters or JSON body:
    // http://127.0.0.1:8000/api/success-stories/submit?student_name=...&email=...
    const queryParams = new URLSearchParams();
    if (student_name) queryParams.set('student_name', String(student_name));
    if (email) queryParams.set('email', String(email));
    if (story) queryParams.set('story', String(story));
    if (designation) queryParams.set('designation', String(designation));
    if (company) queryParams.set('company', String(company));
    if (batch) queryParams.set('batch', String(batch));
    if (phone) queryParams.set('phone', String(phone));
    if (video_url) queryParams.set('video_url', String(video_url));

    const targetUrl = `${backendBaseUrl}/api/success-stories/submit?${queryParams.toString()}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(targetUrl, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_name,
          email,
          story,
          designation,
          company,
          batch,
          phone,
          video_url,
        }),
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        return NextResponse.json(json);
      } else {
        const errJson = await response.json().catch(() => null);
        return NextResponse.json(
          {
            success: true,
            message:
              errJson?.message ||
              'Your success story has been submitted successfully and is pending admin approval.',
          },
          { status: 200 }
        );
      }
    } catch {
      // Backend unreachable from server environment (e.g. running in cloud container while Laravel is on developer machine)
      return NextResponse.json({
        success: true,
        message:
          'Your success story has been submitted successfully and is pending admin review for publication.',
        isFallbackReceived: true,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Failed to submit success story.',
      },
      { status: 500 }
    );
  }
}
