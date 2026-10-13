import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const LOCAL_STORAGE_FILE = '/tmp/cfo_submitted_stories.json';

function saveStoryToLocalStorageFile(storyItem: Record<string, any>) {
  try {
    let existing: any[] = [];
    if (fs.existsSync(LOCAL_STORAGE_FILE)) {
      const content = fs.readFileSync(LOCAL_STORAGE_FILE, 'utf-8');
      existing = JSON.parse(content);
      if (!Array.isArray(existing)) existing = [];
    }
    // Prepend new story
    existing.unshift(storyItem);
    // Keep max 50 items
    if (existing.length > 50) existing = existing.slice(0, 50);
    fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(existing, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write story to local storage file:', err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const rawName = body.student_name || body.name || body.full_name || '';
    const email = body.email || '';
    const rawStory = body.story || body.description || body.content || body.message || '';
    const designation = body.designation || body.title || '';
    const company = body.company || body.organization || '';
    const batch = body.batch || '';
    const phone = body.phone || body.mobile || body.phone_number || '';
    const video_url = body.video_url || body.video || '';

    const student_name = String(rawName).trim();
    const story = String(rawStory).trim();

    if (!student_name || !email || !story) {
      return NextResponse.json(
        {
          success: false,
          message: 'Student name, email, and story are required.',
          errors: {
            ...(!student_name ? { name: ['The student name field is required.'] } : {}),
            ...(!email ? { email: ['The email address field is required.'] } : {}),
            ...(!story ? { story: ['The success story content is required.'] } : {}),
          },
        },
        { status: 422 }
      );
    }

    const customHeader = request.headers.get('x-custom-backend-url');
    const backendBaseUrl = (
      customHeader ||
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_BACKEND_API_URL ||
      'http://127.0.0.1:8000'
    ).replace(/\/$/, '');

    // Comprehensive payload satisfying standard Laravel conventions and custom names
    const payload: Record<string, any> = {
      name: student_name,
      student_name: student_name,
      full_name: student_name,
      email: String(email).trim(),
      story: story,
      description: story,
      content: story,
      message: story,
      designation: designation ? String(designation).trim() : null,
      title: designation ? String(designation).trim() : null,
      company: company ? String(company).trim() : null,
      organization: company ? String(company).trim() : null,
      batch: batch ? String(batch).trim() : null,
      phone: phone ? String(phone).trim() : null,
      mobile: phone ? String(phone).trim() : null,
      video_url: video_url ? String(video_url).trim() : null,
      video: video_url ? String(video_url).trim() : null,
      status: 'pending',
    };

    const queryParams = new URLSearchParams();
    queryParams.set('student_name', student_name);
    queryParams.set('name', student_name);
    queryParams.set('email', String(email).trim());
    queryParams.set('story', story);
    if (designation) {
      queryParams.set('designation', String(designation).trim());
      queryParams.set('title', String(designation).trim());
    }
    if (company) {
      queryParams.set('company', String(company).trim());
      queryParams.set('organization', String(company).trim());
    }
    if (batch) queryParams.set('batch', String(batch).trim());
    if (phone) queryParams.set('phone', String(phone).trim());
    if (video_url) queryParams.set('video_url', String(video_url).trim());

    // Candidates: Try both /submit and RESTful /success-stories endpoints
    const endpointCandidates = [
      `${backendBaseUrl}/api/success-stories/submit?${queryParams.toString()}`,
      `${backendBaseUrl}/api/success-stories`,
      `${backendBaseUrl}/api/success-stories/submit`,
      `${backendBaseUrl}/api/stories`,
    ];

    let lastBackendError: any = null;
    let liveSubmissionSucceeded = false;
    let liveResponseJson: any = null;
    let validationErrorObj: any = null;

    for (const targetUrl of endpointCandidates) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const response = await fetch(targetUrl, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          cache: 'no-store',
        });

        clearTimeout(timeoutId);

        const responseText = await response.text();
        let parsed: any = null;
        try {
          parsed = JSON.parse(responseText);
        } catch {
          // not json
        }

        if (response.ok || response.status === 201) {
          liveSubmissionSucceeded = true;
          liveResponseJson = parsed || { success: true };
          break;
        } else if (response.status === 422) {
          // Laravel validation failure - do NOT swallow!
          validationErrorObj = {
            success: false,
            status: 422,
            isLiveBackend: true,
            message: parsed?.message || 'Backend validation rejected submission.',
            errors: parsed?.errors || {},
          };
          break;
        } else if (response.status === 404) {
          // Route not found on backend, try next candidate endpoint
          continue;
        } else {
          lastBackendError = parsed?.message || `HTTP ${response.status}: ${responseText.slice(0, 100)}`;
        }
      } catch (err: any) {
        lastBackendError = err?.message || 'Connection refused or timeout';
      }
    }

    if (validationErrorObj) {
      return NextResponse.json(validationErrorObj, { status: 422 });
    }

    const localSavedStory = {
      id: `story-${Date.now()}`,
      name: student_name,
      student_name: student_name,
      email: String(email).trim(),
      story: story,
      designation: designation ? String(designation).trim() : null,
      company: company ? String(company).trim() : null,
      batch: batch ? String(batch).trim() : null,
      phone: phone ? String(phone).trim() : null,
      video_url: video_url ? String(video_url).trim() : null,
      created_at: new Date().toISOString(),
      is_local: !liveSubmissionSucceeded,
    };

    // Always persist to local cache file so the story is never lost from the UI
    saveStoryToLocalStorageFile(localSavedStory);

    if (liveSubmissionSucceeded) {
      return NextResponse.json({
        success: true,
        isLiveBackend: true,
        message: liveResponseJson?.message || 'Success story saved directly into the database!',
        data: liveResponseJson?.data || localSavedStory,
      });
    }

    // Backend unreachable from server container (e.g. cloud container unable to reach 127.0.0.1:8000 on user host)
    return NextResponse.json({
      success: true,
      isLiveBackend: false,
      savedToLocalCache: true,
      backendAttempted: backendBaseUrl,
      lastError: lastBackendError,
      message: `Your story was safely recorded into app storage! (Notice: Backend database at ${backendBaseUrl} was unreachable from the cloud container)`,
      data: localSavedStory,
    });
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
