'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import CategoryPills from '@/components/CategoryPills';
import CourseCard from '@/components/CourseCard';
import Footer from '@/components/Footer';
import { COURSES, CATEGORIES, Course } from '@/data/cfo-data';
import { useCfo } from '@/context/CfoContext';
import {
  Sparkles,
  Search,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  Calendar,
  Users,
  Compass,
  ArrowRight,
  GraduationCap,
  Award,
  ShieldCheck,
  Building2,
  RefreshCw
} from 'lucide-react';

function CoursesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const { lang, courses, refreshCourses, coursesLoading, isLiveApiConnected } = useCfo();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'price-asc' | 'price-desc'>('featured');

  const filteredCourses = useMemo(() => {
    let list = [...(courses && courses.length > 0 ? courses : [])];

    // Filter by Category
    if (selectedCategory !== 'all') {
      list = list.filter((c) => c.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.titleEn.toLowerCase().includes(q) ||
          c.categoryLabel.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy, courses]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectCategory={(catId) => setSelectedCategory(catId)}
      />

      {/* Page Header */}
      <section className="bg-[#0A192F] text-white py-14 sm:py-18 border-b border-[#1E3A8A] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(200,150,62,0.18),rgba(10,25,47,0))]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E3A8A]/50 text-[#E5A93C] border border-[#C8963E]/40 text-xs font-bold mb-4">
              <Award className="w-3.5 h-3.5 text-[#C8963E]" />
              <span>{lang === 'bn' ? 'বিটিইবি নিবন্ধিত প্রফেশনাল ডিপ্লোমা ও কারিকুলাম' : 'BTEB Affiliated Executive Diplomas'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-white tracking-tight leading-tight">
              {lang === 'bn' ? (
                <>
                  করপোরেট ফিন্যান্স, ট্যাক্স ও <br />
                  <span className="text-[#E5A93C]">সি-স্যুট এক্সিকিউটিভ প্রোগ্রাম</span>
                </>
              ) : (
                <>
                  Corporate Finance, Tax & <br />
                  <span className="text-[#E5A93C]">Executive C-Suite Programs</span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-300 mt-3 leading-relaxed">
              {lang === 'bn'
                ? 'আইসিএবি ও আইসিএমএবি ফেলোদের সরাসরি মেন্টরশিপে বাস্তব কেস স্টাডি, এনবিআর ই-ট্যাক্স রিটার্ন ও এসএপি-ফাইকো (SAP-FICO) ক্লাউড ল্যাব সম্বলিত ক্যারিয়ার রূপান্তরকারী প্রোগ্রাম।'
                : 'Case-study driven financial modeling, corporate taxation, and enterprise SAP-FICO ERP masterclasses instructed by practicing senior FCAs and corporate CFOs.'}
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-[#1E3A8A] text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#E5A93C]" />
                <span>{COURSES.length} {lang === 'bn' ? 'টি ফ্ল্যাগশিপ ও পিজিডি প্রোগ্রাম' : 'Flagship & PGD Programs'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'bn' ? '১০০% বিটিইবি ও আরজেএসসি সরকারি অনুমোদন' : 'BTEB & RJSC Accreditations'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#E5A93C]" />
                <span>{lang === 'bn' ? 'সিটি সেন্টার মতিঝিল ও অনলাইন হাইব্রিড ক্যাম্পাস' : 'City Centre & Hybrid Studio'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Catalog Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {/* Filters and Search Bar Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === 'bn'
                    ? 'কোর্সের নাম বা কি-ওয়ার্ড দিয়ে খুঁজুন (যেমন: CFO, VAT, SAP, FP&A)...'
                    : 'Search by program or skill (e.g., CFO, VAT, SAP, FP&A)...'
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-[#C8963E] focus:ring-2 focus:ring-[#C8963E]/20 outline-none text-xs text-slate-900 shadow-2xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              {lang === 'bn' ? 'সাজান:' : 'Sort by:'}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold py-2 px-3 rounded-xl border border-slate-300 bg-white text-slate-800 outline-none shadow-2xs cursor-pointer hover:border-[#C8963E]"
            >
              <option value="featured">{lang === 'bn' ? 'ফিচার্ড (Featured)' : 'Featured'}</option>
              <option value="rating">{lang === 'bn' ? 'টপ রেটেড (Top Rated)' : 'Top Rated'}</option>
              <option value="price-asc">{lang === 'bn' ? 'কোর্স ফি: কম থেকে বেশি' : 'Fee: Low to High'}</option>
              <option value="price-desc">{lang === 'bn' ? 'কোর্স ফি: বেশি থেকে কম' : 'Fee: High to Low'}</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mb-8">
          <CategoryPills
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => setSelectedCategory(catId)}
            lang={lang}
          />
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} lang={lang} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
            <Compass className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-serif font-bold text-slate-900">
              {lang === 'bn'
                ? 'আপনার সার্চ অনুযায়ী কোনো প্রোগ্রাম খুঁজে পাওয়া যায়নি'
                : 'No programs found matching your query'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {lang === 'bn'
                ? 'অনুগ্রহ করে অন্য কোনো কি-ওয়ার্ড দিয়ে সার্চ করুন অথবা ফিল্টার রিসেট করুন।'
                : 'Try adjusting your search query or reset the category filters.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] text-slate-950 font-serif font-black text-xs cursor-pointer shadow-xs"
            >
              {lang === 'bn' ? 'সব ফিল্টার রিসেট করুন' : 'Reset All Filters'}
            </button>
          </div>
        )}

        {/* Career Counseling CTA */}
        <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-[#0A192F] text-white border border-[#1E3A8A] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[11px] font-bold text-[#E5A93C] uppercase tracking-wider">
              {lang === 'bn' ? 'এক্সিকিউটিভ অ্যাকাডেমিক কাউন্সেলিং' : 'Executive Academic Counseling'}
            </span>
            <h3 className="text-xl font-serif font-bold text-white">
              {lang === 'bn' ? 'কোন প্রোগ্রামটি আপনার ক্যারিয়ারের জন্য সেরা বুঝতে পারছেন না?' : 'Need guidance selecting the right executive program?'}
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              {lang === 'bn'
                ? 'আমাদের সিনিয়র অ্যাকাডেমিক কাউন্সেলরদের সাথে কথা বলে জেনে নিন আপনার অভিজ্ঞতা ও বর্তমান পদ অনুযায়ী সেরা ক্যারিয়ার পাথ।'
                : 'Speak with our senior fellows and admission counselors to map your progression to the C-suite.'}
            </p>
          </div>

          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 font-serif font-black text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-all shadow-md cursor-pointer"
          >
            <span>{lang === 'bn' ? 'পরামর্শকের সাথে কথা বলুন' : 'Book Consultation'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm font-bold text-slate-600">Loading catalog...</div>}>
      <CoursesContent />
    </Suspense>
  );
}
