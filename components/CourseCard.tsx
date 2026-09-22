'use client';

import React from 'react';
import Link from 'next/link';
import {
  Clock,
  Calendar,
  Star,
  Award,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  ArrowRight
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
    <div className="group rounded-2xl bg-white border border-slate-200/90 hover:border-[#C8963E] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Banner Info */}
      <div className="p-5 pb-3">
        {/* Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Batch Badge */}
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0A192F] text-[#E5A93C] border border-[#C8963E]/40">
              {course.batchNumber}
            </span>

            {course.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-[#966718] border border-amber-300">
                <Award className="w-3 h-3 text-[#C8963E]" />
                {lang === 'bn' ? 'ফ্ল্যাগশিপ' : 'Flagship'}
              </span>
            )}
          </div>

          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {course.categoryLabel}
          </span>
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

        {/* Course Schedule & Duration */}
        <div className="mt-3 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#C8963E] shrink-0" />
            <span className="truncate">
              {lang === 'bn' ? course.schedule : course.scheduleEn}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#C8963E] shrink-0" />
            <span>
              {lang === 'bn' ? course.duration : course.durationEn} • {course.totalClasses}টি ক্লাস ও ল্যাব
            </span>
          </div>
        </div>

        {/* Mentors Preview */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2 overflow-hidden">
              {course.mentors.slice(0, 2).map((mentor, idx) => (
                <div
                  key={idx}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white overflow-hidden bg-slate-100 border border-[#C8963E]/30"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="text-[11px] text-slate-700 font-medium leading-tight">
              <p className="font-bold text-slate-950 truncate max-w-[130px]">
                {course.mentors[0]?.name}
              </p>
              <p className="text-[10px] text-slate-500 truncate max-w-[130px]">
                {course.mentors[0]?.company}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs font-bold text-slate-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <Star className="w-3.5 h-3.5 fill-[#C8963E] text-[#C8963E]" />
            <span>{course.rating.toFixed(2)}</span>
          </div>
        </div>

        {/* Seat Availability Bar */}
        <div className="mt-4 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-rose-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              {lang === 'bn'
                ? `মাত্র ${course.seatsLeft}টি আসন খালি!`
                : `Only ${course.seatsLeft} seats left!`}
            </span>
            <span className="text-slate-500 font-medium">
              {course.totalSeats - course.seatsLeft}/{course.totalSeats}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#C8963E] to-[#B8860B] transition-all duration-300"
              style={{ width: `${seatsPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Footer: Pricing and Action Buttons */}
      <div className="p-4 bg-slate-50/90 border-t border-slate-100 mt-2 space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-serif font-black text-[#0A192F]">
                ৳{course.price.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 line-through">
                ৳{course.originalPrice.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              {lang === 'bn' ? 'কিস্তি সুবিধা প্রযোজ্য' : 'Installments Available'}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#0A192F] text-[#E5A93C] border border-[#C8963E]/40">
            {discountPercent}% OFF
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {onSelectCourse ? (
            <button
              onClick={() => onSelectCourse(course)}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer text-center"
            >
              {lang === 'bn' ? 'সিলেবাস দেখুন' : 'View Syllabus'}
            </button>
          ) : (
            <Link
              href={`/courses/${course.id}`}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer text-center"
            >
              {lang === 'bn' ? 'সিলেবাস দেখুন' : 'View Syllabus'}
            </Link>
          )}

          {onEnrollCourse ? (
            <button
              onClick={() => onEnrollCourse(course)}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 text-xs font-serif font-black shadow-xs hover:shadow transition-all cursor-pointer text-center"
            >
              {lang === 'bn' ? 'অনলাইন ভর্তি' : 'Apply Now'}
            </button>
          ) : (
            <Link
              href={`/enroll-now?course=${encodeURIComponent(course.title)}`}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 text-xs font-serif font-black shadow-xs hover:shadow transition-all cursor-pointer text-center"
            >
              {lang === 'bn' ? 'অনলাইন ভর্তি' : 'Apply Now'}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
