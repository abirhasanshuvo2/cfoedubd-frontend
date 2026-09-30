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
  const discountPercent = Math.round(
    ((course.originalPrice - course.price) / course.originalPrice) * 100
  );

  const seatsPercent = Math.min(
    100,
    Math.round(((course.totalSeats - course.seatsLeft) / course.totalSeats) * 100)
  );

  return (
    <article className="group executive-card rounded-2xl flex flex-col justify-between overflow-hidden relative">
      {/* Top Accent Strip for Featured Program */}
      {course.isFeatured && (
        <div className="h-1 w-full bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#0A192F]" />
      )}

      {/* Main Card Body */}
      <div className="p-6 pb-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row: Clean Typographic Separators instead of pill spam */}
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-3 pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="font-mono font-bold text-[#0A192F] tracking-tight">
                {course.batchNumber}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-[#966718] font-semibold">{course.categoryLabel}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 font-bold text-slate-800 text-xs">
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
            <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 group-hover/title:text-[#C8963E] transition-colors line-clamp-2 leading-snug min-h-[3rem]">
              {lang === 'bn' ? course.title : course.titleEn}
            </h3>
          </Link>

          {/* Schedule & Duration Specs */}
          <div className="mt-3.5 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#C8963E] shrink-0" />
              <span className="truncate font-medium">
                {lang === 'bn' ? course.schedule : course.scheduleEn}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#C8963E] shrink-0" />
              <span>
                <strong className="text-slate-900 font-semibold">
                  {lang === 'bn' ? course.duration : course.durationEn}
                </strong>
                {' '}&bull; {course.totalClasses}টি সেশন ও ইআরপি ল্যাব
              </span>
            </div>
          </div>
        </div>

        {/* Mentors Section */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2 overflow-hidden">
              {course.mentors.slice(0, 2).map((mentor, idx) => (
                <div
                  key={idx}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white overflow-hidden bg-slate-100 border border-[#C8963E]/40"
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
              <p className="font-bold text-slate-950 truncate max-w-[140px]">
                {course.mentors[0]?.name}
              </p>
              <p className="text-[10px] text-slate-500 truncate max-w-[140px]">
                {course.mentors[0]?.company}
              </p>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {lang === 'bn' ? 'কিস্তি প্রযোজ্য' : 'Installments'}
          </span>
        </div>

        {/* Seat Availability Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-rose-600 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              {lang === 'bn'
                ? `মাত্র ${course.seatsLeft}টি আসন খালি`
                : `Only ${course.seatsLeft} seats remaining`}
            </span>
            <span className="text-slate-500 font-mono text-[10px]">
              {course.totalSeats - course.seatsLeft}/{course.totalSeats} Enrolled
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#A97B28] transition-all duration-300"
              style={{ width: `${seatsPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Footer: Pricing & Action Buttons */}
      <div className="p-5 bg-slate-50/80 border-t border-slate-100 space-y-3.5">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif font-black text-[#0A192F]">
                ৳{course.price.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 line-through">
                ৳{course.originalPrice.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              BTEB & RJSC Accredited Certification
            </span>
          </div>

          <span className="text-xs font-bold text-[#966718] bg-amber-50 px-2 py-1 rounded border border-amber-200">
            {discountPercent}% OFF
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {onSelectCourse ? (
            <button
              onClick={() => onSelectCourse(course)}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer text-center shadow-2xs hover:shadow-xs"
            >
              {lang === 'bn' ? 'সিলেবাস দেখুন' : 'View Syllabus'}
            </button>
          ) : (
            <Link
              href={`/courses/${course.id}`}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer text-center shadow-2xs hover:shadow-xs"
            >
              {lang === 'bn' ? 'সিলেবাস দেখুন' : 'View Syllabus'}
            </Link>
          )}

          {onEnrollCourse ? (
            <button
              onClick={() => onEnrollCourse(course)}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#A97B28] hover:brightness-105 text-slate-950 text-xs font-serif font-black shadow-sm hover:shadow transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              <span>{lang === 'bn' ? 'অনলাইন ভর্তি' : 'Apply Now'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href={`/enroll-now?course=${encodeURIComponent(course.title)}`}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#A97B28] hover:brightness-105 text-slate-950 text-xs font-serif font-black shadow-sm hover:shadow transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              <span>{lang === 'bn' ? 'অনলাইন ভর্তি' : 'Apply Now'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
