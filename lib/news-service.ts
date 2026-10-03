import { ApiNewsItem, INITIAL_API_NEWS } from '@/data/news-data';

export type { ApiNewsItem };

export interface NewsPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  first_page_url?: string;
  last_page_url?: string;
  next_page_url?: string | null;
  prev_page_url?: string | null;
  links?: Array<{
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
  }>;
}

export interface FetchNewsResult {
  items: ApiNewsItem[];
  pagination: NewsPagination;
  isLiveBackend: boolean;
}

// Fallback image if the article has no image uploaded (image: null) or if loading fails
export function getCategoryDummyImage(category?: string): string {
  const lowerCat = (category || '').toLowerCase();
  if (lowerCat.includes('press')) {
    return 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000&h=600&fit=crop';
  }
  if (lowerCat.includes('event')) {
    return 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1000&h=600&fit=crop';
  }
  if (lowerCat.includes('convocation')) {
    return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&h=600&fit=crop';
  }
  return 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1000&h=600&fit=crop';
}

/**
 * Returns the exact image URL from the API response first.
 * If image is null or empty, returns a relevant dummy image.
 */
export function resolveNewsImage(image: string | null | undefined, category?: string): string {
  if (image && typeof image === 'string' && image.trim().length > 0) {
    return image.trim();
  }
  return getCategoryDummyImage(category);
}

export async function fetchNewsArticles(page: number = 1): Promise<FetchNewsResult> {
  // Call Next.js internal API proxy route: /api/news
  try {
    const proxyRes = await fetch(`/api/news?page=${page}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (proxyRes.ok) {
      const json = await proxyRes.json();
      if (json && json.data) {
        const paginated = json.data;
        const items = Array.isArray(paginated.data) ? paginated.data : Array.isArray(paginated) ? paginated : [];
        return {
          items,
          pagination: {
            current_page: paginated.current_page || page,
            last_page: paginated.last_page || 1,
            per_page: paginated.per_page || 12,
            total: paginated.total ?? items.length,
            next_page_url: paginated.next_page_url,
            prev_page_url: paginated.prev_page_url,
            links: paginated.links,
          },
          isLiveBackend: Boolean(json.isLiveBackend),
        };
      }
    }
  } catch {
    // Next.js proxy route failed
  }

  // Fallback to INITIAL_API_NEWS
  return {
    items: INITIAL_API_NEWS,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 12,
      total: INITIAL_API_NEWS.length,
    },
    isLiveBackend: false,
  };
}

export async function fetchNewsArticleById(id: string | number): Promise<ApiNewsItem | null> {
  const result = await fetchNewsArticles(1);
  const found = result.items.find((item) => String(item.id) === String(id));
  if (found) return found;

  // Check fallback items
  const fallback = INITIAL_API_NEWS.find((item) => String(item.id) === String(id));
  return fallback || null;
}
