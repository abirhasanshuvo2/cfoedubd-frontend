import { NextResponse } from 'next/server';
import { DEFAULT_SYSTEM_INFO } from '@/data/system-info';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get('q') || '').toLowerCase().trim();

  // Purely dynamic FAQ items from system information
  const systemFaq = DEFAULT_SYSTEM_INFO.faq;
  let items = (systemFaq?.items || []).map((it, idx) => ({
    id: it.id ?? idx + 1,
    question: it.question,
    answer: it.answer,
  }));

  if (query) {
    items = items.filter(
      (item) =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    success: true,
    title: systemFaq?.title || 'Frequently Asked Questions',
    subtitle: systemFaq?.subtitle || '',
    count: items.length,
    data: items,
  });
}
