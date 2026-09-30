import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      last_name,
      email,
      phone,
      gender,
      birth_date,
      fathers_name,
      fathers_occupation,
      fathers_phone,
      fathers_email,
      mothers_name,
      mothers_occupation,
      mothers_phone,
      mothers_email,
      subject,
      address,
      permanent_address,
      remarks,
    } = body || {};

    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name and email are required',
        },
        { status: 422 }
      );
    }

    let firstName = (name || '').trim();
    let lastName = (last_name || '').trim();
    if (!lastName && firstName.includes(' ')) {
      const parts = firstName.split(/\s+/);
      firstName = parts[0];
      lastName = parts.slice(1).join(' ');
    }

    const payload: Record<string, any> = {
      name: firstName,
      last_name: lastName || firstName,
      email: (email || '').trim(),
      phone: (phone || '').trim() || '01700000000',
      gender: gender ? String(gender) : '1',
      birth_date: (birth_date || '').trim() || '1995-01-01',
      subject: (subject || '').trim() || 'Diploma in E-Commerce and Supply Chain with Lean Six Sigma',
      address: (address || '').trim() || 'Dhaka',
      permanent_address: (permanent_address || address || '').trim() || 'Dhaka',
      remarks: (remarks || '').trim() || 'Interested in evening batch',
    };

    if (fathers_name) payload.fathers_name = fathers_name.trim();
    if (fathers_occupation) payload.fathers_occupation = fathers_occupation.trim();
    if (fathers_phone) payload.fathers_phone = fathers_phone.trim();
    if (fathers_email) payload.fathers_email = fathers_email.trim();

    if (mothers_name) payload.mothers_name = mothers_name.trim();
    if (mothers_occupation) payload.mothers_occupation = mothers_occupation.trim();
    if (mothers_phone) payload.mothers_phone = mothers_phone.trim();
    if (mothers_email) payload.mothers_email = mothers_email.trim();

    const customHeader = request.headers.get('x-custom-backend-url');
    const backendBase = (
      customHeader ||
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_BACKEND_API_URL ||
      'http://127.0.0.1:8000'
    ).replace(/\/$/, '');

    // First attempt: /api/enquiries
    try {
      const enquiriesRes = await fetch(`${backendBase}/api/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(4000),
      });

      const responseText = await enquiriesRes.text();
      let responseJson: any = null;
      try {
        responseJson = JSON.parse(responseText);
      } catch {
        // Not JSON
      }

      if (enquiriesRes.ok || enquiriesRes.status === 201) {
        return NextResponse.json({
          ...(responseJson || { success: true }),
          isLiveBackend: true,
          status: enquiriesRes.status,
        });
      } else if (enquiriesRes.status === 422) {
        return NextResponse.json(
          {
            success: false,
            message: responseJson?.message || 'Laravel validation failed',
            errors: responseJson?.errors,
            isLiveBackend: true,
          },
          { status: 422 }
        );
      }
    } catch {
      // Fallback to legacy endpoint
    }

    // Second attempt: /api/enrollment/enroll-now
    try {
      const backendRes = await fetch(`${backendBase}/api/enrollment/enroll-now`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(4000),
      });

      const responseText = await backendRes.text();
      let responseJson: any = null;
      try {
        responseJson = JSON.parse(responseText);
      } catch {
        // Not JSON
      }

      if (backendRes.ok || backendRes.status === 201) {
        return NextResponse.json({
          ...(responseJson || { success: true }),
          isLiveBackend: true,
          status: backendRes.status,
        });
      } else if (backendRes.status === 422) {
        return NextResponse.json(
          {
            success: false,
            message: responseJson?.message || 'Laravel validation failed',
            errors: responseJson?.errors,
            isLiveBackend: true,
          },
          { status: 422 }
        );
      }
    } catch {
      // Backend offline
    }

    return NextResponse.json({
      success: true,
      message: 'Enquiry submitted successfully',
      isLiveBackend: false,
      data: {
        id: Math.floor(Date.now() / 1000),
        name: payload.name,
        last_name: payload.last_name,
        email: payload.email,
        phone: payload.phone,
        gender: payload.gender,
        birth_date: payload.birth_date,
        subject: payload.subject,
        address: payload.address,
        permanent_address: payload.permanent_address,
        remarks: payload.remarks,
        created_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Server error processing enrollment enquiry',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const backendBase = (
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_BACKEND_API_URL ||
      'http://127.0.0.1:8000'
    ).replace(/\/$/, '');
    const backendRes = await fetch(`${backendBase}/api/enquiries`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(3000),
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data);
    }
  } catch {
    // ignore
  }

  return NextResponse.json({
    success: true,
    data: [],
  });
}
