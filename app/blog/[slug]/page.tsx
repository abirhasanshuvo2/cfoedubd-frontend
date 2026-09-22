'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCfo } from '@/context/CfoContext';
import { BLOG_POSTS, COURSES } from '@/data/cfo-data';
import {
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
  ArrowRight,
  Code2
} from 'lucide-react';

export default function BlogPostDetail() {
  const params = useParams();
  const router = useRouter();
  const { lang } = useCfo();
  const slug = params?.slug as string;

  const post = BLOG_POSTS.find((p) => p.slug === slug) || BLOG_POSTS[0];
  const relatedCourse = COURSES.find((c) => c.id === post?.relatedCourseId) || COURSES[0];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(lang === 'bn' ? 'লিংক কপি হয়েছে!' : 'Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'ব্লগ তালিকায় ফিরুন' : 'Back to All Articles'}</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-4 pb-8 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full">
              {post.categoryLabel}
            </span>
            <span className="text-slate-400">•</span>
            <span className="flex items-center gap-1 text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
            <span className="text-slate-400">•</span>
            <span className="flex items-center gap-1 text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 leading-tight">
            {lang === 'bn' ? post.title : post.titleEn}
          </h1>

          {/* Author bar & actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-300"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">{post.author.name}</p>
                <p className="text-xs text-slate-500">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'শেয়ার' : 'Share'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        <div className="my-8 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-[320px] sm:h-[420px] object-cover"
          />
        </div>

        {/* Key Takeaways Box (High reliability & modern design pattern) */}
        <div className="mb-8 p-6 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-black text-sm uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{lang === 'bn' ? 'মূল বিষয়বস্তু সংক্ষেপে (Key Takeaways)' : 'Executive Summary'}</span>
          </div>
          <ul className="space-y-2">
            {post.keyTakeaways.map((point, index) => (
              <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-amber-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Article Body Content */}
        <div className="prose prose-slate max-w-none text-slate-800 space-y-5 text-sm sm:text-base leading-relaxed">
          {post.content.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}

          <div className="my-6 p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2 text-slate-400">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[#C8963E]" />
                <span>corporate-valuation-standard.ts</span>
              </span>
              <span className="text-[11px] text-[#E5A93C] font-mono">Financial Model</span>
            </div>
            <pre>
{`// Chartered Officer Limited (COL) Boardroom Standard
export function calculateWACC(equityRatio: number, debtRatio: number, ke: number, kd: number, taxRate: number) {
  const costOfEquityPart = equityRatio * ke;
  const costOfDebtPart = debtRatio * kd * (1 - taxRate);
  return (costOfEquityPart + costOfDebtPart).toFixed(2);
}`}
            </pre>
          </div>

          <p>
            {lang === 'bn'
              ? 'নিয়মিত প্র্যাকটিস ও লাইভ বোর্ডরুম সেশনের মাধ্যমে কনসেপ্টগুলোকে পেশাদারভাবে প্রয়োগ করা সম্ভব। চার্টার্ড অফিসার লিমিটেড (COL) প্ল্যাটফর্মে প্রতিটি থিওরিটিক্যাল বিষয়ের পরেই দেওয়া হয় হ্যান্ডস-অন এক্সেল ও ইআরপি টাস্ক, যা সরাসরি সিনিয়র সিএফও ও এফসিএ ফ্যাকাল্টিরা রিভিউ করেন।'
              : 'Consistent practical application via live boardroom sessions is paramount. At Chartered Officer Limited (COL), every theoretical foundation is reinforced with real-world case studies evaluated directly by veteran CFOs.'}
          </p>
        </div>

        {/* Tags */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500">{lang === 'bn' ? 'ট্যাগস:' : 'Tags:'}</span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1 rounded-lg"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Associated Course Card (CFO Direct Learning Action) */}
        {relatedCourse && (
          <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 text-white border border-slate-800 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] uppercase font-bold text-[#FFC000] tracking-wider">
                  {lang === 'bn' ? 'সম্পর্কিত লাইভ ক্যারিয়ার ট্র্যাক' : 'Recommended Live Career Track'}
                </span>
                <h4 className="text-lg font-black text-white">
                  {lang === 'bn' ? relatedCourse.title : relatedCourse.titleEn}
                </h4>
                <p className="text-xs text-slate-400">
                  {lang === 'bn' ? relatedCourse.duration : relatedCourse.durationEn} • {relatedCourse.batchNumber} • শুরু হচ্ছে {relatedCourse.startDate}
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  href={`/courses/${relatedCourse.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFC000] hover:bg-[#ffb000] text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-sm"
                >
                  <span>{lang === 'bn' ? 'কোর্সের বিস্তারিত ও সিলেবাস' : 'View Course & Syllabus'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer lang={lang} />
    </div>
  );
}
