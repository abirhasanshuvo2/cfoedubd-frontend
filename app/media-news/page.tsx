'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewsImage from '@/components/NewsImage';
import { useCfo } from '@/context/CfoContext';
import { fetchNewsArticles, NewsPagination } from '@/lib/news-service';
import { ApiNewsItem, INITIAL_API_NEWS } from '@/data/news-data';
import {
  Newspaper,
  Calendar,
  ArrowRight,
  ExternalLink,
  Search,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function MediaNewsPage() {
  const { lang, theme } = useCfo();

  // News state driven strictly by Laravel API http://127.0.0.1:8000/api/settings/news
  const [articles, setArticles] = useState<ApiNewsItem[]>(INITIAL_API_NEWS);
  const [pagination, setPagination] = useState<NewsPagination>({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: INITIAL_API_NEWS.length,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter and search
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    let ignore = false;
    fetchNewsArticles(currentPage)
      .then((res) => {
        if (!ignore) {
          setArticles(res.items);
          setPagination(res.pagination);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [currentPage]);

  // Dynamic categories from API records
  const dynamicCategories = React.useMemo(() => {
    const cats = new Set<string>(['All']);
    articles.forEach((a) => {
      if (a.category && a.category.trim()) {
        cats.add(a.category.trim());
      }
    });
    return Array.from(cats);
  }, [articles]);

  const filteredNews = articles.filter((article) => {
    const matchesCat =
      selectedCategory === 'All' ||
      (article.category || '').toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (article.title || '').toLowerCase().includes(query) ||
      (article.summary || '').toLowerCase().includes(query) ||
      (article.source || '').toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  return (
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col font-sans transition-colors ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}
    >
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-amber-50/90 via-slate-50 to-white dark:bg-[#0A192F] text-slate-900 dark:text-white py-14 sm:py-16 px-4 border-b border-slate-200 dark:border-[#1E3A8A] relative overflow-hidden transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_-10%,rgba(200,150,62,0.18),transparent)]" />
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-[#1E3A8A]/50 border border-amber-300 dark:border-[#C8963E]/40 text-xs font-bold text-amber-900 dark:text-[#E5A93C] shadow-2xs">
            <Newspaper className="w-4 h-4 text-[#C8963E]" />
            <span>Official Media Center &amp; Press Room</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-slate-900 dark:text-white">
            Media &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#966718] dark:from-[#FFDF79] dark:via-[#E5A93C] dark:to-[#C8963E]">News</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Latest press releases, events, and official announcements.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, press releases..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-[#C8963E]/40 text-slate-900 dark:text-white text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#C8963E] shadow-2xs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
          {dynamicCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 dark:bg-[#C8963E] dark:text-slate-950 shadow-md font-black'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-3 border-[#C8963E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-medium">Loading news updates...</p>
          </div>
        )}

        {/* Articles Grid */}
        {!isLoading && filteredNews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-semibold text-sm">No media releases found matching your search.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-[#C8963E] hover:underline font-bold cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          !isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((article) => {
                const articleUrl = `/media-news/${encodeURIComponent(String(article.id))}`;
                const hasExternalLink = Boolean(article.source && article.source.startsWith('http'));

                return (
                  <article
                    key={String(article.id)}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                  >
                    {/* Image Header with Category Badge - Click navigates to full page */}
                    <Link
                      href={articleUrl}
                      className="relative h-48 w-full overflow-hidden bg-slate-100 block"
                    >
                      <NewsImage
                        src={article.image}
                        alt={article.title}
                        category={article.category}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/90 dark:bg-[#0A192F]/90 text-amber-800 dark:text-[#E5A93C] text-[11px] font-bold tracking-wide uppercase border border-amber-300 dark:border-[#C8963E]/40 backdrop-blur-xs shadow-xs">
                        {article.category || 'News'}
                      </div>

                      {article.featured && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-xs">
                          Featured
                        </div>
                      )}
                    </Link>

                    {/* Content Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-[#C8963E]" />
                          <span>{article.date || 'Recent'}</span>
                          {article.readTime && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {article.readTime}
                              </span>
                            </>
                          )}
                        </div>

                        <Link href={articleUrl} className="block">
                          <h2 className="text-base font-bold text-slate-900 group-hover:text-[#C8963E] transition-colors leading-snug">
                            {article.title}
                          </h2>
                        </Link>

                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                          {article.summary || 'No summary available.'}
                        </p>
                      </div>

                      {/* Footer Actions / Source & Read Full Button */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[160px]">
                          {article.source ? (
                            hasExternalLink ? (
                              <a
                                href={article.source}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-[#C8963E] underline truncate inline-block"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Source Reference
                              </a>
                            ) : (
                              article.source
                            )
                          ) : (
                            'COL Official Press'
                          )}
                        </span>

                        <Link
                          href={articleUrl}
                          className="text-xs font-bold text-[#C8963E] hover:text-[#B07D2B] flex items-center gap-1.5 transition-colors py-1 px-2.5 rounded-lg hover:bg-amber-50 group/btn"
                        >
                          <span>Read Full</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )
        )}

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1 || isLoading}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                disabled={isLoading}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  currentPage === pg
                    ? 'bg-amber-500 text-slate-950 border border-amber-600 dark:bg-[#C8963E] dark:border-[#C8963E] shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {pg}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(pagination.last_page, p + 1))}
              disabled={currentPage >= pagination.last_page || isLoading}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
