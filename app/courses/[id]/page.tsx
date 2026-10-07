'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { COURSES, resolveCourseVideo } from '@/data/cfo-data';
import { useCfo } from '@/context/CfoContext';
import {
  Calendar,
  Users,
  CheckCircle2,
  ChevronRight,
  Play,
  Phone,
  Check,
  GraduationCap,
  Radio,
  BookOpen,
  CreditCard,
  X,
  ExternalLink,
  User,
  Globe,
  Layers,
} from 'lucide-react';

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = String(unwrappedParams?.id || '');
  const { lang, courses, refreshCourses, theme, systemInfo } = useCfo();

  const [enrollmentPlan, setEnrollmentPlan] = useState<'personal' | 'group'>('personal');
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [activeSectionTab, setActiveSectionTab] = useState<string>('about');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isPlayingInline, setIsPlayingInline] = useState(false);
  const [promoActive, setPromoActive] = useState(true);

  // Refresh courses on page load to ensure latest backend fields are fetched
  useEffect(() => {
    refreshCourses();
  }, [refreshCourses]);

  // Merge live backend courses from API and fallback catalog courses
  const combinedCourses = [...(courses || []), ...COURSES];
  const decodedId = decodeURIComponent(id).toLowerCase().trim();
  const course = combinedCourses.find(
    (c) =>
      c.id.toLowerCase() === decodedId ||
      (c.slug && c.slug.toLowerCase() === decodedId) ||
      c.title.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/[\s\-_]+/g, '-') === decodedId ||
      (c.titleEn && c.titleEn.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/[\s\-_]+/g, '-') === decodedId) ||
      c.title.toLowerCase() === decodedId ||
      (c.titleEn && c.titleEn.toLowerCase() === decodedId) ||
      c.id.replace(/^api-/, '').toLowerCase() === decodedId ||
      (c.batchNumber && c.batchNumber.toLowerCase() === decodedId) ||
      ((c as any).apiId && String((c as any).apiId) === decodedId.replace(/^api-/, ''))
  );

  if (!course) {
    notFound();
  }

  const isFree = course.price === 0;
  const basePrice = course.price;
  const groupPrice = isFree ? 0 : Math.round(basePrice * 0.88);
  const displayPrice = enrollmentPlan === 'group' ? groupPrice : basePrice;
  const originalPrice =
    course.originalPrice > displayPrice
      ? course.originalPrice
      : isFree
      ? 0
      : Math.round(basePrice * 1.6);

  const hasDiscount = !isFree && originalPrice > displayPrice;
  const promoCode = systemInfo.promo_code || (course.classId ? course.classId.slice(-5).toUpperCase() : 'COL');

  // Extract schedule & fields strictly from API response
  const hasDays = Array.isArray(course.days) && course.days.length > 0;
  const apiDays = hasDays
    ? course.days!.join(', ')
    : lang === 'bn'
    ? 'শিডিউল শীঘ্রই জানানো হবে'
    : 'Flexible Schedule';

  const apiTimeSlot =
    course.timeSlot === 'morning'
      ? 'Morning Shift'
      : course.timeSlot === 'evening'
      ? 'Evening Shift'
      : course.timeSlot || 'Live Shift';

  const educatorName =
    course.educator || course.mentors?.[0]?.name || 'Instructor';

  const totalStudentsCount =
    typeof course.totalStudents === 'number' ? course.totalStudents : course.enrolledCount || 0;

  const hotlinePhone = (systemInfo.mobile || systemInfo.phone || '+8801713378787').trim();

  // Resolve backend course video link (supports vide, video, video_link, video_url)
  const rawCourseVideoLink =
    course.vide ||
    course.video ||
    course.videoLink ||
    course.video_link ||
    course.video_url ||
    null;
  const videoInfo = resolveCourseVideo(rawCourseVideoLink);

  // Strictly dynamic items derived 100% from API fields
  const dynamicCourseHighlights = [
    {
      label: lang === 'bn' ? `ইন্সট্রাক্টর: ${educatorName}` : `Instructor: ${educatorName}`,
    },
    {
      label: lang === 'bn' ? `ক্যাটাগরি: ${course.categoryLabel}` : `Category: ${course.categoryLabel}`,
    },
    ...(course.level
      ? [
          {
            label:
              lang === 'bn'
                ? `লেভেল: ${course.level.toUpperCase()}`
                : `Level: ${course.level.toUpperCase()}`,
          },
        ]
      : []),
    ...(course.language
      ? [
          {
            label:
              lang === 'bn' ? `মিডিয়াম: ${course.language}` : `Language: ${course.language}`,
          },
        ]
      : []),
    {
      label: lang === 'bn' ? `সময়: ${apiTimeSlot}` : `Time: ${apiTimeSlot}`,
    },
    ...(hasDays
      ? [
          {
            label: lang === 'bn' ? `দিনসমূহ: ${apiDays}` : `Days: ${apiDays}`,
          },
        ]
      : []),
    ...(course.startDate && course.startDate !== 'চলতি সেশনে ওপেন'
      ? [
          {
            label:
              lang === 'bn'
                ? `শুরু: ${course.startDate}`
                : `Starts: ${course.startDate}`,
          },
        ]
      : []),
    ...(course.endDate
      ? [
          {
            label: lang === 'bn' ? `শেষ: ${course.endDate}` : `Ends: ${course.endDate}`,
          },
        ]
      : []),
    ...(course.minAge && course.maxAge && (course.minAge > 0 || course.maxAge > 0)
      ? [
          {
            label:
              lang === 'bn'
                ? `বয়সসীমা: ${course.minAge} - ${course.maxAge} বছর`
                : `Age Limit: ${course.minAge} - ${course.maxAge} yrs`,
          },
        ]
      : []),
    {
      label:
        lang === 'bn'
          ? `ভর্তিকৃত শিক্ষার্থী: ${totalStudentsCount}`
          : `Total Students: ${totalStudentsCount}`,
    },
  ];

  const sectionTabs = [
    {
      id: 'about',
      label: lang === 'bn' ? 'কোর্স সম্পর্কে' : 'Course Details',
      icon: BookOpen,
      iconColor: 'text-amber-500',
    },
    {
      id: 'schedule',
      label: lang === 'bn' ? 'ক্লাস শিডিউল ও তথ্য' : 'Schedule & Info',
      icon: Calendar,
      iconColor: 'text-indigo-500',
    },
    {
      id: 'payment',
      label: lang === 'bn' ? 'পেমেন্ট' : 'Payment',
      icon: CreditCard,
      iconColor: 'text-teal-600',
    },
  ];

  const handleTabScroll = (tabId: string) => {
    setActiveSectionTab(tabId);
    const el = document.getElementById(`section-${tabId}`);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col font-sans pb-24 transition-colors ${
        theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-white text-slate-900'
      }`}
    >
      <Navbar />

      {/* =====================================================================
          1. DARK NAVY & EMERALD HERO SECTION (100% API Powered)
         ===================================================================== */}
      <section className="relative bg-gradient-to-br from-[#060D1E] via-[#09172E] to-[#062E2A] text-white pt-8 sm:pt-12 pb-12 lg:pb-16 overflow-visible border-b border-slate-800">
        {/* Ambient Emerald & Blue Glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 right-0 w-[550px] h-[550px] rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="absolute top-1/3 left-10 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* LEFT COLUMN (7 Cols): API Badges, Title, Description, CTA+Price, 4-Col API Info Box */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Top Badges Row: Category, Live Course, Level, Enrolled Students */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#2A2212] border border-amber-500/40 text-[#FFC000] text-xs font-bold shadow-2xs">
                  <GraduationCap className="w-3.5 h-3.5 text-[#FFC000]" />
                  <span>{course.categoryLabel}</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0D2E2C] border border-teal-500/40 text-teal-300 text-xs font-bold shadow-2xs">
                  <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                  <span>{isFree ? 'Free Course' : 'Live Course'}</span>
                </span>

                {course.level && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/90 border border-slate-700 text-slate-200 text-xs font-bold uppercase">
                    {course.level}
                  </span>
                )}

                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 ml-1">
                  <Users className="w-3.5 h-3.5 text-[#FFC000]" />
                  <span>
                    {totalStudentsCount} {lang === 'bn' ? 'জন শিক্ষার্থী' : 'Students'}
                  </span>
                </div>
              </div>

              {/* Main Course Title from API */}
              <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-black text-white tracking-tight leading-tight">
                {lang === 'bn' ? course.title : course.titleEn}
              </h1>

              {/* Dynamic Overview Paragraphs using strictly API fields */}
              <div className="space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
                <p>
                  {lang === 'bn'
                    ? `${course.title} প্রোগ্রামটি ${course.categoryLabel} ক্যাটাগরির অধীনে ${educatorName}-এর সরাসরি তত্ত্বাবধানে পরিচালিত হচ্ছে।`
                    : `${course.titleEn} is offered under the ${course.categoryLabel} category and conducted directly by ${educatorName}.`}
                </p>

                <p>
                  {lang === 'bn'
                    ? `কোর্স লেভেল: ${course.level ? course.level.toUpperCase() : 'N/A'}${
                        course.language ? ` • মিডিয়াম: ${course.language}` : ''
                      }${hasDays ? ` • ক্লাসের দিন: ${apiDays} (${apiTimeSlot})` : ` • শিফট: ${apiTimeSlot}`}${
                        course.minAge && course.maxAge && (course.minAge > 0 || course.maxAge > 0)
                          ? ` • বয়সসীমা: ${course.minAge}-${course.maxAge} বছর`
                          : ''
                      }।`
                    : `Course Level: ${course.level ? course.level.toUpperCase() : 'N/A'}${
                        course.language ? ` • Language: ${course.language}` : ''
                      }${hasDays ? ` • Days: ${apiDays} (${apiTimeSlot})` : ` • Shift: ${apiTimeSlot}`}${
                        course.minAge && course.maxAge && (course.minAge > 0 || course.maxAge > 0)
                          ? ` • Age Limit: ${course.minAge}-${course.maxAge} yrs`
                          : ''
                      }.`}
                </p>
              </div>

              {/* Hero CTA Button + Price + Promo Applied Row */}
              <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-5">
                <Link
                  href={`/enroll-now?course=${encodeURIComponent(course.title)}`}
                  className="px-6 py-3.5 rounded-lg bg-[#FFC000] hover:bg-[#E6AC00] active:scale-95 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <span>{lang === 'bn' ? 'ব্যাচে ভর্তি হোন' : 'Enroll in Batch'}</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </Link>

                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight tabular-nums">
                    {isFree ? (lang === 'bn' ? 'ফ্রি' : 'FREE') : `৳${displayPrice.toLocaleString()}`}
                  </span>

                  {hasDiscount && (
                    <span className="text-base sm:text-lg text-slate-400 line-through font-bold tabular-nums">
                      ৳{originalPrice.toLocaleString()}
                    </span>
                  )}

                  {hasDiscount && promoActive && (
                    <>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Promo Applied</span>
                      </span>

                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/90 border border-slate-700 text-white text-xs font-mono font-bold">
                        <button
                          type="button"
                          onClick={() => setPromoActive(false)}
                          className="hover:text-rose-400 transition-colors cursor-pointer"
                          title="Promo Code"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <span>{promoCode}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* 4-Column API Schedule & Course Info Box (100% API Data) */}
              <div className="pt-3">
                <div className="rounded-xl border border-slate-700/80 bg-[#0B1629]/90 backdrop-blur-md p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-0 sm:divide-x divide-slate-700/70 shadow-xl">
                  
                  {/* Col 1: ব্যাচ শুরু (start_date) */}
                  <div className="sm:pr-4 flex flex-col justify-center">
                    <span className="text-xs font-bold text-slate-300">
                      {lang === 'bn' ? 'ব্যাচ শুরু' : 'Batch Starts'}
                    </span>
                    <div className="mt-2">
                      <span className="inline-block px-3 py-1.5 rounded-md bg-slate-700/80 text-white font-bold text-xs border border-slate-600/60">
                        {course.startDate}
                      </span>
                    </div>
                  </div>

                  {/* Col 2: Live Class Schedule (time & days from API) */}
                  <div className="sm:px-4 flex flex-col justify-center space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-[#FFC000] shrink-0" />
                      <span>Live Class</span>
                    </div>
                    <p className="text-xs font-black text-white leading-snug capitalize">
                      {apiTimeSlot}
                    </p>
                    <p className="text-[11px] font-bold text-slate-300">
                      ({apiDays})
                    </p>
                  </div>

                  {/* Col 3: Educator & Language (from API educator & language) */}
                  <div className="sm:px-4 flex flex-col justify-center space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                      <User className="w-3.5 h-3.5 text-[#FFC000] shrink-0" />
                      <span>{lang === 'bn' ? 'ইন্সট্রাক্টর' : 'Educator'}</span>
                    </div>
                    <p className="text-xs font-black text-white leading-snug truncate">
                      {educatorName}
                    </p>
                    <p className="text-[11px] font-semibold text-amber-300 truncate">
                      {course.language || course.categoryLabel}
                    </p>
                  </div>

                  {/* Col 4: Enrolled Students & Level (from API total_students & level) */}
                  <div className="sm:pl-4 flex flex-col justify-center space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                      <Users className="w-3.5 h-3.5 text-[#FFC000] shrink-0" />
                      <span>{lang === 'bn' ? 'শিক্ষার্থী' : 'Students'}</span>
                    </div>
                    <p className="text-base font-black text-white tabular-nums">
                      {totalStudentsCount}
                    </p>
                    <p className="text-[10px] text-emerald-400 font-semibold uppercase">
                      {course.level ? `${course.level} LEVEL` : 'ACTIVE'}
                    </p>
                  </div>

                </div>
              </div>

            </div>

            {/* RIGHT COLUMN (5 Cols): Sticky Demo Video & Enrollment Card */}
            <div className="lg:col-span-5 lg:relative">
              <div className="lg:sticky lg:top-20 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-slate-200 dark:border-slate-800 p-3 sm:p-4 space-y-4 z-20">
                
                {/* Clean, Full-Visibility Demo Video Player Container */}
                <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 aspect-[16/9] group shadow-sm">
                  {isPlayingInline ? (
                    <div className="relative w-full h-full bg-black flex items-center justify-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPlayingInline(false);
                        }}
                        className="absolute top-2.5 right-2.5 z-30 p-1.5 rounded-full bg-black/75 hover:bg-rose-600 text-white transition-colors cursor-pointer shadow-md"
                        title="Close video"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {videoInfo.isDirectVideoFile && videoInfo.directVideoUrl ? (
                        <video
                          src={videoInfo.directVideoUrl}
                          controls
                          autoPlay
                          className="w-full h-full object-contain bg-black"
                        />
                      ) : (
                        <iframe
                          src={videoInfo.autoplayEmbedUrl}
                          title={`${course.title} Video`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      )}
                    </div>
                  ) : (
                    <div
                      onClick={() => setIsPlayingInline(true)}
                      className="w-full h-full cursor-pointer relative flex items-center justify-center"
                    >
                      {/* Crystal Clear Full-Opacity Thumbnail */}
                      {videoInfo.thumbnailUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={videoInfo.thumbnailUrl}
                          alt={course.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0A192F] via-[#0D254C] to-[#1E3A8A]" />
                      )}

                      {/* Subtle Vignette for Play Button Contrast Only */}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                      {/* Center Glowing Red YouTube-style Play Button */}
                      <div className="relative z-10 flex items-center justify-center">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600/95 group-hover:bg-red-600 group-hover:scale-110 transition-all flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.6)] border-2 border-white/70">
                          <Play className="w-6 h-6 text-white fill-white ml-1" />
                        </div>
                      </div>

                      {/* Bottom-left Pill: Watch Demo */}
                      <div className="absolute bottom-2.5 left-2.5 z-10">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 shadow-md">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          <span>{lang === 'bn' ? 'ডেমো ক্লাস দেখুন' : 'Watch Demo Class'}</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Personal vs একসাথে (Group) Tabs */}
                <div className="grid grid-cols-2 border-b border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold">
                  <button
                    type="button"
                    onClick={() => setEnrollmentPlan('personal')}
                    className={`py-2.5 text-center border-b-2 transition-colors cursor-pointer ${
                      enrollmentPlan === 'personal'
                        ? 'border-slate-900 dark:border-[#FFC000] text-slate-950 dark:text-white font-black'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                    }`}
                  >
                    Personal
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnrollmentPlan('group')}
                    className={`py-2.5 text-center border-b-2 transition-colors cursor-pointer ${
                      enrollmentPlan === 'group'
                        ? 'border-slate-900 dark:border-[#FFC000] text-slate-950 dark:text-white font-black'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                    }`}
                  >
                    একসাথে (Group)
                  </button>
                </div>

                {/* Price & Promo Applied Row inside Card */}
                <div className="px-1 space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tabular-nums">
                        {isFree ? (lang === 'bn' ? 'ফ্রি' : 'FREE') : `৳${displayPrice.toLocaleString()}`}
                      </span>
                      {hasDiscount && (
                        <span className="text-sm sm:text-base text-[#FF5722] line-through font-bold tabular-nums">
                          ৳{originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {hasDiscount && (
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          PROMO APPLIED
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 text-xs font-mono font-bold border border-emerald-200 dark:border-emerald-800">
                          <X className="w-3 h-3" />
                          <span>{promoCode}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Full-width Yellow CTA Button */}
                  <Link
                    href={`/enroll-now?course=${encodeURIComponent(course.title)}`}
                    className="w-full py-3.5 px-5 rounded-lg bg-[#FFC000] hover:bg-[#E6AC00] active:scale-[0.99] text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <span>{lang === 'bn' ? 'ব্যাচে ভর্তি হোন' : 'Enroll in Batch'}</span>
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </Link>
                </div>

                {/* Dynamic API Course Highlights (Strictly API Data Only) */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 px-1 space-y-3">
                  <h4 className="text-sm font-black text-slate-950 dark:text-white">
                    {lang === 'bn' ? 'কোর্সের মূল তথ্য:' : 'Course Information:'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2.5">
                    {dynamicCourseHighlights.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-snug"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 dark:text-amber-400 shrink-0 mt-0.5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          2. SECTION NAVIGATION BAR
         ===================================================================== */}
      <div className="sticky top-16 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md py-3 border-b border-slate-100 dark:border-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl bg-[#FFF6F5] dark:bg-slate-900 border border-[#F5D2CE] dark:border-slate-800 p-2 sm:p-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar shadow-xs">
            {sectionTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSectionTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabScroll(tab.id)}
                  className={`relative px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF512F] to-[#FF7043] text-white shadow-md border border-transparent'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-[#F3C6C1] dark:border-slate-700 hover:border-[#FF5722]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : tab.iconColor
                    }`}
                  />
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-amber-300" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================================
          3. MAIN CONTENT: "কোর্স সম্পর্কে:" & LIVE API METADATA
         ===================================================================== */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12 w-full">
        
        {/* SECTION: কোর্স সম্পর্কে (ABOUT THE COURSE - 100% API Data) */}
        <section id="section-about" className="space-y-4 scroll-mt-28">
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
            {lang === 'bn' ? 'কোর্স সম্পর্কে:' : 'About the Course:'}
          </h2>

          <div className="relative">
            <div
              className={`space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed overflow-hidden transition-all duration-300 ${
                showFullAbout ? 'max-h-[1200px]' : 'max-h-56'
              }`}
            >
              <p>
                {lang === 'bn' ? course.description : course.descriptionEn}
              </p>

              {/* Dynamic API Requirements / Details */}
              <div className="space-y-2 pt-1">
                <h3 className="text-sm sm:text-base font-black text-slate-950 dark:text-white">
                  {lang === 'bn' ? 'কোর্সের শর্তাবলী ও বিবরণ:' : 'Course Specifications:'}
                </h3>
                <ul className="space-y-1.5 pl-1">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-500">-</span>
                    <span>
                      {lang === 'bn'
                        ? `কোর্স ক্যাটাগরি: ${course.categoryLabel}`
                        : `Course Category: ${course.categoryLabel}`}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-500">-</span>
                    <span>
                      {lang === 'bn'
                        ? `কোর্স লেভেল: ${course.level ? course.level.toUpperCase() : 'All Levels'}`
                        : `Course Level: ${course.level ? course.level.toUpperCase() : 'All Levels'}`}
                    </span>
                  </li>
                  {course.language && (
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-slate-500">-</span>
                      <span>
                        {lang === 'bn'
                          ? `ক্লাসের ভাষা: ${course.language}`
                          : `Instruction Language: ${course.language}`}
                      </span>
                    </li>
                  )}
                  {course.minAge !== undefined &&
                    course.maxAge !== undefined &&
                    (course.minAge > 0 || course.maxAge > 0) && (
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-slate-500">-</span>
                        <span>
                          {lang === 'bn'
                            ? `বয়সসীমা: ${course.minAge} থেকে ${course.maxAge} বছর`
                            : `Eligible Age Range: ${course.minAge} to ${course.maxAge} years`}
                        </span>
                      </li>
                    )}
                </ul>
              </div>
            </div>

            {/* Fade Gradient + "আরো দেখুন" Button */}
            <div
              className={`${
                !showFullAbout
                  ? 'bg-gradient-to-t from-slate-100/95 via-slate-50/80 to-transparent dark:from-slate-900 dark:via-slate-950/80 pt-10 -mt-10'
                  : 'pt-3'
              } relative z-10 flex justify-center py-2.5 rounded-b-lg`}
            >
              <button
                type="button"
                onClick={() => setShowFullAbout(!showFullAbout)}
                className="text-xs sm:text-sm font-bold text-[#FF5722] hover:text-[#E64A19] transition-colors cursor-pointer"
              >
                {showFullAbout
                  ? lang === 'bn'
                    ? 'সংক্ষিপ্ত করুন'
                    : 'Show Less'
                  : lang === 'bn'
                  ? 'আরো দেখুন'
                  : 'Show More'}
              </button>
            </div>
          </div>
        </section>

        {/* SECTION: ক্লাস শিডিউল ও তথ্য (100% API METADATA TABLE) */}
        <section id="section-schedule" className="space-y-4 scroll-mt-28">
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
            {lang === 'bn' ? 'ক্লাস শিডিউল ও বিস্তারিত তথ্য' : 'Class Schedule & Course Data'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800">
              <span className="text-slate-500 block mb-1">Educator:</span>
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {educatorName}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800">
              <span className="text-slate-500 block mb-1">Category:</span>
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {course.categoryLabel}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800">
              <span className="text-slate-500 block mb-1">Course Level:</span>
              <span className="font-bold text-sm text-emerald-700 dark:text-emerald-400 uppercase">
                {course.level || 'N/A'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800">
              <span className="text-slate-500 block mb-1">Language:</span>
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {course.language || 'N/A'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800">
              <span className="text-slate-500 block mb-1">Class Days &amp; Shift:</span>
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {hasDays ? `${apiDays} (${apiTimeSlot})` : apiTimeSlot}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800">
              <span className="text-slate-500 block mb-1">Start Date:</span>
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {course.startDate}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800">
              <span className="text-slate-500 block mb-1">End Date:</span>
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {course.endDate || 'N/A'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800">
              <span className="text-slate-500 block mb-1">Total Enrolled Students:</span>
              <span className="font-bold text-sm text-slate-900 dark:text-white tabular-nums">
                {totalStudentsCount}
              </span>
            </div>
          </div>
        </section>

        {/* SECTION: পেমেন্ট (PAYMENT) */}
        <section id="section-payment" className="space-y-5 scroll-mt-28">
          <div className="rounded-2xl bg-gradient-to-r from-[#FFF8F6] via-white to-[#FFF5F0] dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border border-[#F5CFC8] dark:border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF5722]">
                Enrollment &amp; Payment
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                {lang === 'bn' ? 'পেমেন্ট ও ভর্তি প্রক্রিয়া' : 'Payment & Admission'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {lang === 'bn'
                  ? 'ব্যাচে ভর্তি হোন বাটনে ক্লিক করে আপনার তথ্য প্রদান করুন এবং ভর্তি সম্পন্ন করুন।'
                  : 'Click "Enroll in Batch" to complete your registration for this course.'}
              </p>
            </div>

            <Link
              href={`/enroll-now?course=${encodeURIComponent(course.title)}`}
              className="px-7 py-3.5 rounded-xl bg-[#FFC000] hover:bg-[#E6AC00] text-slate-950 font-black text-sm flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
            >
              <span>{lang === 'bn' ? 'ব্যাচে ভর্তি হোন' : 'Enroll in Batch'}</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </Link>
          </div>
        </section>

      </main>

      {/* =====================================================================
          4. FLOATING "📞 Call" BUTTON + FIXED BOTTOM STICKY BAR
         ===================================================================== */}
      <div className="fixed bottom-20 right-4 sm:right-6 z-40 print:hidden">
        <a
          href={`tel:${hotlinePhone.replace(/\s+/g, '')}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2B3445] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xl border border-slate-700 transition-transform hover:scale-105"
        >
          <Phone className="w-4 h-4 text-white fill-white" />
          <span>Call</span>
        </a>
      </div>

      {/* Fixed Bottom Full-Width Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-2.5 sm:py-3 px-4 sm:px-8 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Call Now + Price + Promo Applied */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Call Now:</span>
              <a
                href={`tel:${hotlinePhone.replace(/\s+/g, '')}`}
                className="font-black text-slate-900 dark:text-white hover:text-[#FF5722] transition-colors font-mono"
              >
                {hotlinePhone}
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tabular-nums">
                {isFree ? (lang === 'bn' ? 'ফ্রি' : 'FREE') : `৳${displayPrice.toLocaleString()}`}
              </span>

              {hasDiscount && (
                <span className="text-xs sm:text-sm text-slate-500 line-through font-bold tabular-nums">
                  ৳{originalPrice.toLocaleString()}
                </span>
              )}

              {hasDiscount && (
                <div className="hidden sm:flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    PROMO APPLIED
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 text-xs font-mono font-bold">
                    <X className="w-3 h-3" />
                    <span>{promoCode}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Yellow CTA Button */}
          <Link
            href={`/enroll-now?course=${encodeURIComponent(course.title)}`}
            className="px-6 sm:px-8 py-3 rounded-lg bg-[#FFC000] hover:bg-[#E6AC00] active:scale-95 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
          >
            <span>{lang === 'bn' ? 'ব্যাচে ভর্তি হোন' : 'Enroll in Batch'}</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </Link>

        </div>
      </div>

      {/* =====================================================================
          5. INTERACTIVE DEMO CLASS PREVIEW MODAL (Plays API `vide` Link)
         ===================================================================== */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-slate-900 text-white rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
            <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FF7A45] flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {course.title}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Instructor: {educatorName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDemoModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                {videoInfo.isDirectVideoFile && videoInfo.directVideoUrl ? (
                  <video
                    src={videoInfo.directVideoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <iframe
                    src={videoInfo.autoplayEmbedUrl}
                    title={`${course.title} Demo Class`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-[#FFC000]" />
                  <span>
                    {lang === 'bn' ? 'ক্লাস শিডিউল:' : 'Schedule:'} {apiTimeSlot} ({apiDays})
                  </span>
                </div>

                <Link
                  href={`/enroll-now?course=${encodeURIComponent(course.title)}`}
                  onClick={() => setIsDemoModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg bg-[#FFC000] hover:bg-[#E6AC00] text-slate-950 font-black text-xs flex items-center gap-1.5"
                >
                  <span>{lang === 'bn' ? 'ব্যাচে ভর্তি হোন' : 'Enroll Now'}</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer lang={lang} />
    </div>
  );
}
