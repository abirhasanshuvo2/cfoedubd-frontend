'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewsImage from '@/components/NewsImage';
import { useCfo } from '@/context/CfoContext';
import { fetchNewsArticles } from '@/lib/news-service';
import { ApiNewsItem, INITIAL_API_NEWS } from '@/data/news-data';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  ExternalLink,
  CheckCircle2,
  Newspaper,
  ChevronRight,
} from 'lucide-react';

interface NewsDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const resolvedParams = use(params);
  const articleId = decodeURIComponent(resolvedParams.id);
  const { lang } = useCfo();

  const [article, setArticle] = useState<ApiNewsItem | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ApiNewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetchNewsArticles(1);
        if (!isMounted) return;

        const allItems = res.items.length > 0 ? res.items : INITIAL_API_NEWS;
        const current = allItems.find((a) => String(a.id) === articleId);

        if (current) {
          setArticle(current);
          setRelatedArticles(allItems.filter((a) => String(a.id) !== articleId));
        } else {
          const fallback = INITIAL_API_NEWS.find((a) => String(a.id) === articleId);
          if (fallback) {
            setArticle(fallback);
            setRelatedArticles(INITIAL_API_NEWS.filter((a) => String(a.id) !== articleId));
          }
        }
      } catch {
        const fallback = INITIAL_API_NEWS.find((a) => String(a.id) === articleId);
        if (fallback && isMounted) {
          setArticle(fallback);
          setRelatedArticles(INITIAL_API_NEWS.filter((a) => String(a.id) !== articleId));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [articleId]);

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(window.location.href);
          setCopiedLink(true);
          setTimeout(() => setCopiedLink(false), 2500);
        }
      } catch {
        // ignore
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-24">
          <div className="w-10 h-10 border-3 border-[#C8963E] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-semibold text-slate-600">Loading article...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4 flex-1">
          <Newspaper className="w-16 h-16 text-slate-300 mx-auto" />
          <h1 className="text-2xl font-serif font-black text-[#0A192F]">Article Not Found</h1>
          <p className="text-sm text-slate-600">
            The requested media release could not be found.
          </p>
          <div className="pt-4">
            <Link
              href="/media-news"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A192F] text-[#E5A93C] text-xs font-bold hover:bg-[#1E3A8A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Media &amp; News
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const hasExternalLink = Boolean(article.source && article.source.startsWith('http'));

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />

      {/* Breadcrumb & Navigation Topbar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            <Link href="/media-news" className="hover:text-slate-900 transition-colors">
              Media &amp; News
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-md">
              {article.title}
            </span>
          </div>

          <Link
            href="/media-news"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A192F] hover:text-[#C8963E] transition-colors shrink-0 ml-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Articles</span>
          </Link>
        </div>
      </div>

      {/* Article Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-10">
        <article className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-8">
          {/* Header Cover Image - Renders the response image */}
          <div className="relative h-72 sm:h-96 md:h-[460px] w-full bg-slate-900 overflow-hidden">
            <NewsImage
              src={article.image}
              alt={article.title}
              category={article.category}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-6 sm:p-10">
              <div className="space-y-3">
                <span className="inline-block px-3.5 py-1.5 rounded-lg bg-[#C8963E] text-slate-950 text-xs font-black uppercase tracking-wider shadow-md">
                  {article.category || 'News'}
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-white leading-tight drop-shadow-sm max-w-4xl">
                  {article.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Article Meta Strip & Controls */}
          <div className="px-6 sm:px-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5 text-slate-700">
                <Calendar className="w-4 h-4 text-[#C8963E]" />
                {article.date}
              </span>
              {article.readTime && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {article.readTime}
                  </span>
                </>
              )}
              {article.source && (
                <>
                  <span>•</span>
                  <span className="text-[#0A192F] font-semibold">
                    Source: {hasExternalLink ? 'External Link' : article.source}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Share</span>
                  </>
                )}
              </button>

              {hasExternalLink && (
                <a
                  href={article.source!}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0A192F] text-[#E5A93C] text-xs font-bold hover:bg-[#1E3A8A] transition-colors"
                >
                  <span>Visit Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Article Summary / Content directly from API */}
          <div className="px-6 sm:px-10 pb-10 space-y-6">
            <div className="text-base sm:text-lg text-slate-800 leading-relaxed font-normal whitespace-pre-line">
              {article.summary}
            </div>

            {/* Source Reference Link if present */}
            {article.source && (
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Source Reference
                  </span>
                  <p className="text-xs text-slate-700 break-all font-mono">
                    {article.source}
                  </p>
                </div>
                {hasExternalLink && (
                  <a
                    href={article.source}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A192F] text-amber-300 text-xs font-bold hover:bg-[#1E3A8A] transition-colors shrink-0"
                  >
                    <span>Open Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </article>

        {/* Other / Related Articles from API */}
        {relatedArticles.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-black text-[#0A192F]">
                Other Articles
              </h2>
              <Link
                href="/media-news"
                className="text-xs font-bold text-[#C8963E] hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={String(rel.id)}
                  href={`/media-news/${encodeURIComponent(String(rel.id))}`}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-100">
                      <NewsImage
                        src={rel.image}
                        alt={rel.title}
                        category={rel.category}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#0A192F]/90 text-[#E5A93C] text-[10px] font-bold uppercase tracking-wider">
                        {rel.category}
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#C8963E] transition-colors leading-snug">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {rel.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#C8963E] mt-3">
                    <span>Read Article</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
