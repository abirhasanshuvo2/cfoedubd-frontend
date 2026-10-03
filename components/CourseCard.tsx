'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Clock,
  User,
  GraduationCap,
  Users
} from 'lucide-react';
import { Course } from '@/data/cfo-data';

interface CourseCardProps {
  course: Course;
  lang: 'bn' | 'en';
  onSelectCourse?: (course: Course) => void;
  onEnrollCourse?: (course: Course) => void;
}

export default function CourseCard({
  course,
  lang,
  onSelectCourse,
}: CourseCardProps) {
  const hasDiscount = course.originalPrice > course.price && course.originalPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  const totalSeats = course.totalSeats || 35;
  const seatsLeft = course.seatsLeft !== undefined ? course.seatsLeft : 12;
  const enrolledCount = course.enrolledCount || Math.max(12, totalSeats - seatsLeft);

  const isFree = course.price === 0;

  // Format clean batch number (e.g., if database has 'CLS-CRVNJ2AKP1', show '১৩' or '০১')
  const formatBatchNumber = (batch: string) => {
    if (!batch || batch.startsWith('CLS-') || batch.length > 8) {
      // Pick a clean batch number based on last char or default to 1
      const num = batch ? Math.abs(batch.charCodeAt(batch.length - 1) % 15) + 1 : 1;
      return lang === 'bn' ? `${num}` : `${num}`;
    }
    return batch.replace(/[^0-9]/g, '') || batch;
  };

  // Convert digits to Bengali numerals if language is Bengali
  const toBn = (num: number | string) => {
    if (lang !== 'bn') return num.toString();
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
  };

  // Get dynamic course poster background theme based on title & category
  const getPosterTheme = (cat: string, title: string) => {
    const text = (cat + ' ' + title).toLowerCase();
    if (text.includes('ai') || text.includes('intelligence') || text.includes('agent')) {
      return {
        bg: 'from-[#081226] via-[#0D2149] to-[#0A1832]',
        accent: '#38BDF8',
        tag: 'ARTIFICIAL INTELLIGENCE',
        pattern: 'radial-gradient(#38bdf8_1px,transparent_1px)'
      };
    }
    if (text.includes('flutter') || text.includes('mobile') || text.includes('android')) {
      return {
        bg: 'from-[#022B4A] via-[#044B7F] to-[#02253E]',
        accent: '#0284C7',
        tag: 'MOBILE ENGINEERING',
        pattern: 'radial-gradient(#0284c7_1px,transparent_1px)'
      };
    }
    if (text.includes('cfo') || text.includes('finance') || text.includes('accounting')) {
      return {
        bg: 'from-[#091528] via-[#102A54] to-[#081426]',
        accent: '#F59E0B',
        tag: 'EXECUTIVE CFO TRACK',
        pattern: 'radial-gradient(#f59e0b_1px,transparent_1px)'
      };
    }
    if (text.includes('tax') || text.includes('vat') || text.includes('customs')) {
      return {
        bg: 'from-[#062D24] via-[#0A4D3E] to-[#05261E]',
        accent: '#10B981',
        tag: 'TAX & VAT COMPLIANCE',
        pattern: 'radial-gradient(#10b981_1px,transparent_1px)'
      };
    }
    return {
      bg: 'from-[#0F172A] via-[#1E293B] to-[#0F172A]',
      accent: '#818CF8',
      tag: 'PROFESSIONAL PROGRAM',
      pattern: 'radial-gradient(#818cf8_1px,transparent_1px)'
    };
  };

  const poster = getPosterTheme(course.category || '', course.title || '');
  const courseImage = course.thumbnail || course.image;

  return (
    <article className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
      
      {/* 1. Top 16:10 Thumbnail / Poster (Exact Match to Screenshot) */}
      <Link
        href={`/courses/${course.id}`}
        onClick={(e) => {
          if (onSelectCourse) {
            e.preventDefault();
            onSelectCourse(course);
          }
        }}
        className="block relative aspect-[16/10] w-full overflow-hidden bg-slate-950 group/thumb"
      >
        {courseImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={courseImage}
            alt={course.title}
            className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500"
          />
        ) : (
          /* High-Fidelity Poster Artwork */
          <div className={`w-full h-full bg-gradient-to-br ${poster.bg} p-4 flex flex-col justify-between relative select-none`}>
            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ backgroundImage: poster.pattern, backgroundSize: '12px 12px' }}
            />
            
            {/* Poster Header */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[9px] font-black tracking-widest uppercase text-white/70 bg-white/10 px-2 py-0.5 rounded backdrop-blur-xs">
                {poster.tag}
              </span>
              <span className="text-xs font-black text-amber-400">
                COL
              </span>
            </div>

            {/* Poster Center Headline */}
            <div className="relative z-10 my-auto text-center px-2">
              <p className="text-base sm:text-lg font-black text-white tracking-tight leading-snug drop-shadow-md line-clamp-2">
                {course.title}
              </p>
              <p className="text-[10px] font-bold text-slate-300 mt-1 uppercase tracking-wider">
                {lang === 'bn' ? 'লাইভ বুটক্যাম্প ও ল্যাব' : 'Live Cohort & Labs'}
              </p>
            </div>

            {/* Poster Bottom Bar */}
            <div className="relative z-10 flex items-center justify-between text-[9px] text-white/60">
              <span>RJSC &amp; BTEB Accredited</span>
              <span>cfoedubd.com</span>
            </div>
          </div>
        )}
      </Link>

      {/* 2. Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Learners Count & Class Start Date Row */}
          <div className="flex items-center justify-between gap-2">
            {/* Learners */}
            <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-bold">
              <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
                <User className="w-3 h-3" />
              </div>
              <span>{toBn(enrolledCount)} {lang === 'bn' ? 'লার্নার' : 'learners'}</span>
            </div>

            {/* Start Date Pill */}
            <div className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-[10px] font-bold flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>{lang === 'bn' ? `ক্লাস শুরু ${course.startDate || '৩১ অক্টো'}` : `Starts ${course.startDateEn || 'Oct 31'}`}</span>
            </div>
          </div>

          {/* Course Title */}
          <Link
            href={`/courses/${course.id}`}
            onClick={(e) => {
              if (onSelectCourse) {
                e.preventDefault();
                onSelectCourse(course);
              }
            }}
            className="block group/title mt-2.5"
          >
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover/title:text-amber-600 dark:group-hover/title:text-amber-400 transition-colors line-clamp-2 leading-snug min-h-[2.8rem]">
              {lang === 'bn' ? course.title : course.titleEn}
            </h3>
          </Link>

          {/* Batch & Seats Left Badges (Exact Gray Rounded Pills from Screenshot) */}
          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
              <GraduationCap className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{lang === 'bn' ? `ব্যাচ ${toBn(formatBatchNumber(course.batchNumber))}` : `Batch ${formatBatchNumber(course.batchNumber)}`}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
              <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{toBn(seatsLeft)} {lang === 'bn' ? 'সিট বাকি' : 'seats left'}</span>
            </span>
          </div>
        </div>

        {/* Pricing & Discount Row */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2">
              {isFree ? (
                <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-sans">
                  {lang === 'bn' ? 'সম্পূর্ণ ফ্রি' : 'Free'}
                </span>
              ) : (
                <>
                  <span className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white font-sans">
                    ৳{toBn(course.price.toLocaleString())}
                  </span>
                  {course.originalPrice > course.price && (
                    <span className="text-xs text-slate-400 line-through font-sans">
                      ৳{toBn(course.originalPrice.toLocaleString())}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Discount Badge on Right */}
            {hasDiscount && discountPercent > 0 ? (
              <span className="px-2 py-0.5 rounded-md bg-[#FFC000] text-slate-950 font-black text-xs shrink-0 shadow-2xs">
                {toBn(discountPercent)}% {lang === 'bn' ? 'ছাড়' : 'OFF'}
              </span>
            ) : isFree ? (
              <span className="px-2 py-0.5 rounded-md bg-emerald-400 text-slate-950 font-black text-xs shrink-0 shadow-2xs">
                ১০০% {lang === 'bn' ? 'ফ্রি' : 'FREE'}
              </span>
            ) : null}
          </div>

          {/* Limited Period Offer Strip (Exact Match from Screenshot) */}
          <div className="px-2.5 py-1 rounded-md bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[10px] sm:text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{lang === 'bn' ? 'অফারটি চলবে আর মাত্র ৭ দিন' : 'Special offer ends in 7 days'}</span>
          </div>

          {/* 3. Full-Width Bottom Dark Button: বিস্তারিত দেখি → */}
          <Link
            href={`/courses/${course.id}`}
            onClick={(e) => {
              if (onSelectCourse) {
                e.preventDefault();
                onSelectCourse(course);
              }
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer mt-1"
          >
            <span>{lang === 'bn' ? 'বিস্তারিত দেখি' : 'View Details'}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>

      </div>

    </article>
  );
}
