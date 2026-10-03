export interface ApiNewsItem {
  id: string | number;
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  source: string | null;
  image: string | null;
  featured?: boolean;
}

// Exactly the 2 records from your Laravel database API response:
export const INITIAL_API_NEWS: ApiNewsItem[] = [
  {
    id: 'a-new-2',
    title: 'A new 2',
    category: 'Press Release',
    date: 'September 22, 2026',
    readTime: '3 min read',
    summary: 'asad',
    source: null,
    image: null,
    featured: false,
  },
  {
    id: 'a-new-one',
    title: 'A new two',
    category: 'Event',
    date: 'September 22, 2026',
    readTime: '3 min read',
    summary: 'this is a new summary',
    source: 'https://www.thedailystar.net/news/bangladesh/news/mymensingh-bears-the-brunt-nations-load-shedding-4279436',
    image: '/api/image-proxy?url=' + encodeURIComponent('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80'),
    featured: false,
  },
];
