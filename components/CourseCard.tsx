'use client';

import React from 'react';
import Link from 'next/link';
import {
  Clock,
  Calendar,
  Star,
  Award,
  ArrowRight,
  GraduationCap
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
  onEnrollCourse,
}: CourseCardProps) {
  const hasDiscount = course.originalPrice > course.price && course.originalPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  const seatsPercent = Math.min(
    100,
    Math.round(((course.totalSeats - course.seatsLeft) / course.totalSeats) * 100)
  );

  const isFree = course.price === 0;

  return (
    <article className="group executive-card rounded-2xl flex flex-col justify-between overflow-hidden relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all">
      {/* Top Accent Strip for Featured Program */}
      {course.isFeatured && (
        <div className="h-1 w-full bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#0A192F]" />
      )}

      {/* Main Card Body */}
      <div className="p-6 pb-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="font-mono font-bold text-slate-900 dark:text-[#E5A93C] tracking-tight">
                {course.batchNumber}
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-[#966718] dark:text-amber-400 font-semibold">{course.categoryLabel}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200 text-xs">
              <Star className="w-3.5 h-3.5 fill-[#C8963E] text-[#C8963E]" />
              <span>{course.rating.toFixed(2)}</span>
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
            className="block group/title"
          >
            <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 dark:text-white group-hover/title:text-[#C8963E] transition-colors line-clamp-2 leading-snug min-h-[3rem]">
              {lang === 'bn' ? course.title : course.titleEn}
            </h3>
          </Link>

          {/* Schedule & Duration Specs */}
          <div className="mt-3.5 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#C8963E] shrink-0" />
              <span className="truncate font-medium">
                {lang === 'bn' ? course.schedule : course.scheduleEn}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#C8963E] shrink-0" />
              <span>
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                  {lang === 'bn' ? course.duration : course.durationEn}
                </strong>
                {' '}&bull; {course.totalClasses}টি সেশন ও ল্যাব
              </span>
            </div>
          </div>
        </div>

        {/* Mentors Section */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2 overflow-hidden">
              {course.mentors.slice(0, 2).map((mentor, idx) => (
                <div
                  key={idx}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-800 border border-[#C8963E]/40"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mentor.avatar || '/dummy-avatar.svg'}
                    alt={mentor.name}
                    onError={(e) => {
                      e.currentTarget.src = '/dummy-avatar.svg';
                    }}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="text-[11px] leading-tight">
              <p className="font-bold text-slate-950 dark:text-white truncate max-w-[140px]">
                {course.mentors[0]?.name}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                {course.mentors[0]?.company}
              </p>
            </div>
          </div>

          {isFree ? (
            <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900">
              {lang === 'bn' ? 'ফ্রি কোর্স' : 'Free Program'}
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900">
              {lang === 'bn' ? 'কিস্তি প্রযোজ্য' : 'Installments'}
            </span>
          )}
        </div>

        {/* Seat Availability Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              {lang === 'bn'
                ? `মাত্র ${course.seatsLeft}টি আসন খালি`
                : `Only ${course.seatsLeft} seats remaining`}
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">
              {course.totalSeats - course.seatsLeft}/{course.totalSeats} Enrolled
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#A97B28] transition-all duration-300"
              style={{ width: `${seatsPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Footer: Pricing & Action Buttons */}
      <div className="p-5 bg-slate-50/80 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 space-y-3.5">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              {isFree ? (
                <span className="text-2xl font-serif font-black text-emerald-600 dark:text-emerald-400">
                  {lang === 'bn' ? 'সম্পূর্ণ ফ্রি' : 'Free'}
                </span>
              ) : (
                <>
                  <span className="text-2xl font-serif font-black text-slate-900 dark:text-[#E5A93C]">
                    ৳{course.price.toLocaleString()}
                  </span>
                  {course.originalPrice > course.price && (
                    <span className="text-xs text-slate-400 line-through">
                      ৳{course.originalPrice.toLocaleString()}
                    </span>
                  )}
                </>
              )}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
              Professional Executive Certification
            </span>
          </div>

          {hasDiscount && discountPercent > 0 ? (
            <span className="text-xs font-bold text-[#966718] dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-1 rounded border border-amber-200 dark:border-amber-800/80">
              {discountPercent}% OFF
            </span>
          ) : isFree ? (
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800/80">
              100% FREE
            </span>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {onSelectCourse ? (
            <button
              onClick={() => onSelectCourse(course)}
              className="py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer text-center shadow-2xs hover:shadow-xs"
            >
              {lang === 'bn' ? 'সিলেবাস দেখুন' : 'View Syllabus'}
            </button>
          ) : (
            <Link
              href={`/courses/${course.id}`}
              className="py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer text-center shadow-2xs hover:shadow-xs"
            >
              {lang === 'bn' ? 'সিলেবাস দেখুন' : 'View Syllabus'}
            </Link>
          )}

          {onEnrollCourse ? (
            <button
              onClick={() => onEnrollCourse(course)}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#A97B28] hover:brightness-105 text-slate-950 text-xs font-serif font-black shadow-sm hover:shadow transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              <span>{isFree ? (lang === 'bn' ? 'ফ্রি ভর্তি' : 'Join Free') : (lang === 'bn' ? 'অনলাইন ভর্তি' : 'Apply Now')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href={`/enroll-now?course=${encodeURIComponent(course.title)}`}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#A97B28] hover:brightness-105 text-slate-950 text-xs font-serif font-black shadow-sm hover:shadow transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              <span>{isFree ? (lang === 'bn' ? 'ফ্রি ভর্তি' : 'Join Free') : (lang === 'bn' ? 'অনলাইন ভর্তি' : 'Apply Now')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
