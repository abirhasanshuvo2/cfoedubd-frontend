import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import { INITIAL_SUCCESS_STORIES, SuccessStoryItem } from '@/data/success-stories-data';

export const dynamic = 'force-dynamic';

const LOCAL_STORAGE_FILE = '/tmp/cfo_submitted_stories.json';

function getLocallySubmittedStories(): SuccessStoryItem[] {
  try {
    if (fs.existsSync(LOCAL_STORAGE_FILE)) {
      const content = fs.readFileSync(LOCAL_STORAGE_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Ignore read error
  }
  return [];
}

export async function GET(request: NextRequest) {
  const customHeader = request.headers.get('x-custom-backend-url');
  const backendBaseUrl = (
    customHeader ||
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    'http://127.0.0.1:8000'
  ).replace(/\/$/, '');

  let backendStories: SuccessStoryItem[] = [];
  let isLive = false;

  const candidateUrls = [
    `${backendBaseUrl}/api/success-stories`,
    `${backendBaseUrl}/api/stories`,
  ];

  for (const targetUrl of candidateUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

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
        let extracted: any[] = [];

        if (json && json.data && Array.isArray(json.data.data)) {
          extracted = json.data.data;
        } else if (json && Array.isArray(json.data)) {
          extracted = json.data;
        } else if (Array.isArray(json)) {
          extracted = json;
        }

        if (extracted.length > 0) {
          backendStories = extracted.map((item: any) => ({
            id: item.id || `backend-${Math.random()}`,
            name: item.name || item.student_name || 'Graduate Alumni',
            designation: item.designation || item.title || null,
            company: item.company || item.organization || null,
            batch: item.batch || null,
            photo: item.photo || item.image || item.avatar || null,
            story: item.story || item.description || item.content || '',
            video_url: item.video_url || item.video || null,
            created_at: item.created_at || null,
          }));
          isLive = true;
          break;
        }
      }
    } catch {
      // Endpoint not reachable
    }
  }

  // Retrieve locally submitted stories from disk
  const localStories = getLocallySubmittedStories();

  // Merge: locally submitted stories first (so newly posted stories appear immediately at the front)
  let combinedStories: SuccessStoryItem[] = [...localStories, ...backendStories];

  // If no stories exist in backend or disk, provide curated executive alumni stories as baseline
  if (combinedStories.length === 0) {
    combinedStories = INITIAL_SUCCESS_STORIES;
  }

  return NextResponse.json({
    success: true,
    data: combinedStories,
    meta: {
      current_page: 1,
      last_page: 1,
      total: combinedStories.length,
    },
    isLive,
    hasLocalStories: localStories.length > 0,
    backendUrl: backendBaseUrl,
  });
}
