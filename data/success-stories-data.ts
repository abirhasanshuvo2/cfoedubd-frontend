export interface SuccessStoryItem {
  id: number | string;
  name: string;
  designation?: string | null;
  company?: string | null;
  batch?: string | null;
  photo?: string | null;
  story: string;
  video_url?: string | null;
  created_at?: string | null;
  is_local?: boolean;
}

export const INITIAL_SUCCESS_STORIES: SuccessStoryItem[] = [];

