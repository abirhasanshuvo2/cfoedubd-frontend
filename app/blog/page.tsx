'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCfo } from '@/context/CfoContext';
import { BLOG_POSTS, COURSES, BlogPost } from '@/data/cfo-data';
import {
  Search,
  BookOpen,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  Tag,
  Flame,
  ChevronRight,
  TrendingUp,
  Share2
} from 'lucide-react';

export default function BlogPage() {
  const { lang } = useCfo();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'সকল আর্টিকেল', labelEn: 'All Articles' },
    { id: 'cfo-finance', label: 'সিএফও ও করপোরেট ফিন্যান্স', labelEn: 'CFO & Corporate Finance' },
    { id: 'tax-vat', label: 'করপোরেট ট্যাক্স ও এনবিআর ভ্যাট', labelEn: 'Corporate Tax & VAT' },
    { id: 'fintech-erp', label: 'এসএপি-ফিকো ও এন্টারপ্রাইজ ইআরপি', labelEn: 'SAP-FICO & Enterprise ERP' },
    { id: 'career', label: 'বোর্ডরুম ক্যারিয়ার ও গভর্নেন্স', labelEn: 'Boardroom Career & Governance' }
  ];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = BLOG_POSTS[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero Header with futuristic executive-accent */}
      <section className="relative bg-[#0A192F] text-white pt-14 pb-16 overflow-hidden border-b border-[#1E3A8A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D254C] border border-[#C8963E]/40 text-xs font-semibold text-[#E5A93C]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'সিএফও ফিন্যান্স ও লিডারশিপ ইনসাইটস' : 'CFO Finance & Leadership Insights'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-white">
              {lang === 'bn' ? (
                <>
                  করপোরেট ফিন্যান্স, ট্যাক্স ও বোর্ডরুম লিডারশিপের{' '}
                  <span className="text-[#C8963E]">আধুনিক গাইড</span>
                </>
              ) : (
                <>
                  Executive Insights in <span className="text-[#C8963E]">CFO & Finance Leadership</span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {lang === 'bn'
                ? 'ইন্ডাস্ট্রি লিডার ও অভিজ্ঞ সফটওয়্যার ইঞ্জিনিয়ারদের সরাসরি আর্টিকেল, ফ্রেমওয়ার্ক তুলনা, স্যালারি ইনসাইটস এবং ইন্টারভিউ প্রস্তুতির পূর্ণাঙ্গ গাইড।'
                : 'Direct insights, architectural deep dives, salary trends, and interview playbooks written by senior software engineers and industry practitioners.'}
            </p>

            {/* Search Bar */}
            <div className="w-full max-w-md pt-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    lang === 'bn'
                      ? 'টপিক বা কীওয়ার্ড দিয়ে খুঁজুন (যেমন: Next.js, DevOps, AI)...'
                      : 'Search topics (e.g. Next.js, DevOps, AI)...'
                  }
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-[#FFC000] focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar border-b border-slate-200">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-950 text-[#FFC000] shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {lang === 'bn' ? cat.label : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Featured Post Spotlight (shown when category is 'all' and no search query) */}
        {selectedCategory === 'all' && !searchQuery.trim() && featuredPost && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900">
                {lang === 'bn' ? 'ফিচার্ড ও মোস্ট রিড আর্টিকেল' : 'Featured Spotlight'}
              </h2>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 relative min-h-[260px] lg:min-h-full">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-xs text-[#FFC000] text-xs font-black px-3 py-1.5 rounded-lg border border-slate-800">
                  FEATURED
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-md">
                      {featuredPost.categoryLabel}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <Link href={`/blog/${featuredPost.slug}`}>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 hover:text-amber-600 transition-colors leading-snug">
                      {lang === 'bn' ? featuredPost.title : featuredPost.titleEn}
                    </h3>
                  </Link>

                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {lang === 'bn' ? featuredPost.excerpt : featuredPost.excerptEn}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {featuredPost.tags.map((tag) => (
                      <span key={tag} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{featuredPost.author.name}</p>
                      <p className="text-[10px] text-slate-500">{featuredPost.author.role}</p>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-amber-600 group"
                  >
                    <span>{lang === 'bn' ? 'পড়ুন' : 'Read Article'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Article Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">
              {lang === 'bn' ? 'সাম্প্রতিক পাবলিকেশন্স' : 'Recent Publications'}
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {lang === 'bn' ? `${filteredPosts.length} টি আর্টিকেল` : `${filteredPosts.length} articles found`}
            </span>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs text-xs font-bold text-[#FFC000] px-2.5 py-1 rounded-md">
                      {post.categoryLabel}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.readTime}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>

                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                          {lang === 'bn' ? post.title : post.titleEn}
                        </h3>
                      </Link>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {lang === 'bn' ? post.excerpt : post.excerptEn}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-xs font-semibold text-slate-800 truncate max-w-[120px]">
                          {post.author.name}
                        </span>
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                      >
                        <span>{lang === 'bn' ? 'বিস্তারিত' : 'Read'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-bold text-slate-800">
                {lang === 'bn' ? 'কোন আর্টিকেল পাওয়া যায়নি' : 'No articles match your search'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'bn' ? 'অন্য কোনো কীওয়ার্ড দিয়ে চেষ্টা করুন' : 'Try clearing filters or search query'}
              </p>
            </div>
          )}
        </div>

        {/* Newsletter Subscription Card */}
        <section className="mt-14 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-8 sm:p-10 text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-2xl font-black text-white">
              {lang === 'bn'
                ? 'সরাসরি ইনবক্সে পান নতুন টেক ইনসাইটস ও জব আপডেট'
                : 'Get Weekly Tech Insights & Hiring Updates'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              {lang === 'bn'
                ? 'সপ্তাহে ১টি কিউরেটেড ইমেইল। কোনো স্প্যাম নেই। ৫০,০০০+ সফটওয়্যার ইঞ্জিনিয়ারদের কমিউনিটিতে যুক্ত হোন।'
                : 'One weekly high-value engineering digest. Join 50,000+ tech professionals.'}
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2 max-w-md">
            <input
              type="email"
              placeholder="name@example.com"
              className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#FFC000]"
            />
            <button
              onClick={() => alert('ধন্যবাদ! আপনি সফলভাবে ওস্তাদ নিউজল্যাটারে যুক্ত হয়েছেন।')}
              className="px-5 py-2.5 rounded-xl bg-[#FFC000] hover:bg-[#ffb000] text-slate-950 font-bold text-sm whitespace-nowrap transition-all cursor-pointer"
            >
              {lang === 'bn' ? 'সাবস্ক্রাইব করুন' : 'Subscribe'}
            </button>
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
