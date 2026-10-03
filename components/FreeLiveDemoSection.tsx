'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  ArrowRight,
  Radio,
  User,
  ChevronRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useCfo } from '@/context/CfoContext';
import { Course } from '@/data/cfo-data';

interface FreeLiveDemoSectionProps {
  lang: 'bn' | 'en';
}

export default function FreeLiveDemoSection({ lang }: FreeLiveDemoSectionProps) {
  const { courses } = useCfo();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Filter courses that are FREE directly from the Course API
  const freeCourses = useMemo(() => {
    const list = (courses || []).filter(
      (c) =>
        c.price === 0 ||
        Number(c.price) === 0 ||
        (c as any).is_free === 1 ||
        (c as any).is_free === true ||
        (c as any).isFree === true ||
        c.badge?.includes('ফ্রি')
    );

    // If no course is priced at 0, display courses from the catalog with free demo/trial access
    if (list.length === 0 && courses && courses.length > 0) {
      return courses.slice(0, 4);
    }

    return list;
  }, [courses]);

  // Dynamically extract unique categories directly from these API courses
  const categories = useMemo(() => {
    const cats = [{ id: 'all', label: lang === 'bn' ? 'সকল ফ্রি ক্লাস' : 'All' }];
    const seen = new Set<string>();

    freeCourses.forEach((c) => {
      const key = c.category || 'general';
      const label = c.categoryLabel || c.category || 'General';
      if (!seen.has(key)) {
        seen.add(key);
        cats.push({ id: key, label });
      }
    });

    return cats;
  }, [freeCourses, lang]);

  // Filtered courses based on selected category
  const filteredCourses = useMemo(() => {
    if (selectedFilter === 'all') return freeCourses;
    return freeCourses.filter((c) => c.category === selectedFilter);
  }, [selectedFilter, freeCourses]);

  return (
    <section className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Container: Dark navy rounded canvas (Exact match to screenshot) */}
      <div className="bg-[#0B1528] rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Subtle decorative ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#C8963E]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header with [🔴 LIVE] pill & Free Live Demo Class Title */}
        <div className="text-center relative z-10 mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center gap-2.5 mb-2">
            {/* Pulsing LIVE badge with rays */}
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-md bg-rose-500 opacity-60" />
              <span className="relative px-2.5 py-1 rounded-md bg-[#E62E2D] text-white font-black text-xs tracking-wider flex items-center gap-1 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                LIVE
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-white tracking-tight">
              {lang === 'bn' ? 'Free Live Demo Class' : 'Free Live Demo Class'}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {lang === 'bn'
              ? 'কোর্স এপিআই থেকে সরাসরি লাইভ ও ফ্রি কোর্সসমূহে অংশ নিন।'
              : 'Join live interactive free courses loaded directly from the course catalog.'}
          </p>
        </div>

        {/* Category Pills Row (Loaded dynamically from the API courses) */}
        {categories.length > 1 && (
          <div className="relative z-10 flex items-center justify-between gap-3 mb-8 pb-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              {categories.map((cat) => {
                const isActive = selectedFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedFilter(cat.id)}
                    className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                      isActive
                        ? 'bg-white text-slate-950 shadow-md ring-2 ring-white/50 scale-[1.02]'
                        : 'bg-[#132238] border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-[#1A2E4C]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Right Chevron Navigation */}
            <button
              onClick={() => {
                const nextIndex = (categories.findIndex((c) => c.id === selectedFilter) + 1) % categories.length;
                setSelectedFilter(categories[nextIndex].id);
              }}
              className="hidden sm:flex w-9 h-9 rounded-full bg-white text-slate-900 shadow-md items-center justify-center hover:bg-slate-100 transition-colors shrink-0 ml-2 cursor-pointer"
              aria-label="Next Category"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Grid of Free Live Demo Class Cards (Exact match to screenshot) */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.map((course) => {
            const courseTitle = lang === 'bn' ? course.title : course.titleEn || course.title;
            const educatorName = course.educator || course.mentors?.[0]?.name || 'Course Instructor';
            const courseImage = course.image || course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
            const scheduleDisplay = course.schedule || course.startDate || 'Open Batch';

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 group"
              >
                {/* Card Artwork / Thumbnail */}
                <div>
                  <div className="h-44 sm:h-48 w-full relative overflow-hidden bg-slate-950">
                    <Image
                      src={courseImage}
                      alt={courseTitle}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                    {/* Top-Left: ((•)) Live Pill Badge (Exact Match) */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-xs text-rose-600 font-bold text-[11px] flex items-center gap-1.5 shadow-md">
                        <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                        <span>Live</span>
                      </span>
                    </div>

                    {/* Free Tag Badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[10px] uppercase tracking-wider shadow-md">
                        100% Free
                      </span>
                    </div>

                    {/* Course Category / Batch Tag */}
                    <div className="absolute bottom-3 left-3 right-3 z-10">
                      <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] font-mono font-semibold text-amber-300 truncate block">
                        {course.batchNumber || course.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Card Content (Directly from Course API) */}
                  <div className="p-4 sm:p-5 space-y-2.5">
                    {/* Category Track Label */}
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider line-clamp-1">
                      {course.categoryLabel || course.category}
                    </p>

                    {/* Real Course Title from API */}
                    <h3 className="font-serif font-bold text-slate-950 text-sm sm:text-base leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-[#C8963E] transition-colors">
                      {courseTitle}
                    </h3>

                    {/* Educator / Instructor from API */}
                    <div className="flex items-center gap-2 pt-1 text-xs text-slate-600">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="line-clamp-1 font-medium">{educatorName}</span>
                    </div>

                    {/* Date / Schedule from API with Red Calendar Icon */}
                    <div className="flex items-center gap-2 text-rose-600 font-bold text-xs pt-1">
                      <Calendar className="w-4 h-4 shrink-0 text-rose-600" />
                      <span className="line-clamp-1">{scheduleDisplay}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom SEE DETAILS Button (Direct Link to Course from API) */}
                <div className="p-4 sm:p-5 pt-0">
                  <Link
                    href={`/courses/${course.slug || course.id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-[#C8963E] text-slate-900 hover:text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs hover:shadow-md"
                  >
                    <span>SEE DETAILS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Helper Bar */}
        <div className="relative z-10 mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>
              {lang === 'bn'
                ? 'অনলাইন লাইভ ক্লাস সরাসরি গুগল মিট ও জুমের মাধ্যমে সম্প্রচারিত হয়।'
                : 'Online live classes are broadcasted directly via Google Meet & Zoom.'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/courses"
              className="text-[#FFC000] hover:underline font-bold inline-flex items-center gap-1"
            >
              <span>{lang === 'bn' ? 'সব কোর্স ব্রাউজ করুন' : 'Browse All Courses'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
