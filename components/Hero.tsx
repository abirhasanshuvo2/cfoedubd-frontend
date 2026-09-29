'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  Sparkles,
  CheckCircle2,
  Users,
  ShieldCheck,
  ArrowRight,
  Clock,
  Briefcase,
  FileText,
  Download,
  Building2,
  GraduationCap
} from 'lucide-react';
import { Course } from '@/data/cfo-data';
import { useCfo } from '@/context/CfoContext';

interface HeroProps {
  lang: 'bn' | 'en';
  onExploreCourses: () => void;
  onOpenFreeWorkshops: () => void;
  onOpenCareerQuiz?: () => void;
  featuredCourse: Course;
  onSelectCourse: (course: Course) => void;
  onEnrollCourse: (course: Course) => void;
}

export default function Hero({
  lang,
  onExploreCourses,
  onOpenFreeWorkshops,
  featuredCourse,
}: HeroProps) {
  const { systemInfo } = useCfo();

  // Live countdown timer for the upcoming batch
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 8,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0A192F] via-[#0D254C] to-[#0A192F] text-white pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#1E3A8A]/50">
      {/* Decorative Grid & Glow Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a15_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-80 pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#C8963E]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-[#1E3A8A]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Accreditation, Title, Value Prop, CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Regulatory Accreditation Seal Pill */}
            <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E3A8A]/40 border border-[#C8963E]/50 text-xs font-semibold shadow-md backdrop-blur-md">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8963E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C8963E]"></span>
              </span>
              <span className="text-[#E5A93C] font-bold">
                {systemInfo.motto || (lang === 'bn' ? 'বাংলাদেশ সরকার স্বীকৃত' : 'Building Financial Leaders for Tomorrow')}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300">
                {lang === 'bn' ? 'বিটিইবি (BTEB) ও RJSC (Reg. s-13064/2019)' : 'BTEB & RJSC (Reg. s-13064/2019)'}
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-[#C8963E]" />
            </div>

            {/* Main Executive Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight leading-[1.18] text-white">
              {lang === 'bn' ? (
                <>
                  করপোরেট জগতের শীর্ষ পদ{' '}
                  <span className="relative inline-block text-white">
                    <span className="relative z-10 text-[#E5A93C]">চিফ ফাইন্যান্সিয়াল অফিসার (CFO)</span>
                    <span className="absolute bottom-1 left-0 right-0 h-2 bg-[#C8963E]/30 rounded-sm -z-0" />
                  </span>{' '}
                  হিসেবে নিজেকে প্রতিষ্ঠিত করুন
                </>
              ) : (
                <>
                  Empower Your Leadership as a Certified{' '}
                  <span className="relative inline-block text-white">
                    <span className="relative z-10 text-[#E5A93C]">Chief Financial Officer</span>
                    <span className="absolute bottom-1 left-0 right-0 h-2 bg-[#C8963E]/30 rounded-sm -z-0" />
                  </span>
                </>
              )}
            </h1>

            {/* Tagline Highlight Badge */}
            {systemInfo.tagline && (
              <div className="text-xs sm:text-sm font-serif font-bold text-[#E5A93C] tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C8963E]" />
                <span>{systemInfo.tagline}</span>
              </div>
            )}

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              {systemInfo.description ? (
                <span>{systemInfo.description}</span>
              ) : lang === 'bn' ? (
                'চার্টার্ড অফিসার লিমিটেড (COL) ও দি সিএফও ফাউন্ডেশন অব বাংলাদেশের যৌথ উদ্যোগে ১-বছর মেয়াদি চার্টার্ড ফাইন্যান্সিয়াল অফিসার (CFO) প্রোগ্রাম, কাস্টমস ভ্যাট ও ট্যাক্সেশন, এসএপি-ফাইকো (SAP-FICO) ইআরপি এবং বোর্ডরুম গভর্নেন্সের শীর্ষস্থানীয় প্রফেশনাল এক্সিকিউটিভ একাডেমি।'
              ) : (
                'Chartered Officer Limited (COL) in association with The CFO Foundation of Bangladesh provides executive training in corporate governance, SAP-FICO ERP, New Tax Act 2023, and financial leadership across Bangladesh and multinational firms.'
              )}
            </p>

            {/* Key Value Points */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-1 text-xs font-medium text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C8963E] shrink-0" />
                <span>{lang === 'bn' ? '১ বছর মেয়াদি ৩ সেমিস্টার' : '1-Year (3 Semesters)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C8963E] shrink-0" />
                <span>{lang === 'bn' ? 'এসএপি-ফাইকো ইআরপি ল্যাব' : 'SAP-FICO ERP Lab'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C8963E] shrink-0" />
                <span>{lang === 'bn' ? 'ট্যাক্স আইন ২০২৩ ও ভ্যাট' : 'Tax Act 2023 & VAT'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C8963E] shrink-0" />
                <span>{lang === 'bn' ? 'এফসিএ ও এফসিএমএ মেন্টর' : 'FCA & FCMA Mentors'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C8963E] shrink-0" />
                <span>{lang === 'bn' ? 'বার্ষিক কনভোকেশন সনদ' : 'Annual Convocation'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C8963E] shrink-0" />
                <span>{lang === 'bn' ? 'একাডেমিক কিস্তি সুবিধা' : 'Flexible Installments'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/enroll-now?course=Chartered%20Financial%20Officer%20(CFO)"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 font-serif font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all transform active:scale-95 cursor-pointer"
              >
                <span>{lang === 'bn' ? 'CFO অনলাইন ভর্তি ফরম' : 'Apply for CFO Program'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/courses"
                className="px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm hover:border-[#C8963E]/60 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#C8963E]" />
                <span>{lang === 'bn' ? 'সকল লাইভ কোর্স' : 'All Live Batches'}</span>
              </Link>

              <Link
                href="/certificates"
                className="px-4 py-3.5 rounded-xl bg-[#1E3A8A]/30 hover:bg-[#1E3A8A]/50 text-slate-200 border border-[#1E3A8A] font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-[#C8963E]" />
                <span>{lang === 'bn' ? 'সনদ যাচাই করুন' : 'Verify Certificate'}</span>
              </Link>
            </div>

            {/* Live Ticker Stats */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-2xl sm:text-3xl font-serif font-black text-white">
                  {systemInfo.graduates ? `${systemInfo.graduates}+` : '২৫,০০০+'}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  {lang === 'bn' ? 'গ্র্যাজুয়েট প্রফেশনাল' : 'Graduated Leaders'}
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-serif font-black text-[#E5A93C]">
                  {systemInfo.classes ? `${systemInfo.classes}+` : '১৮তম'}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  {lang === 'bn' ? 'চলমান ব্যাচ ও কোর্স' : 'Live Batches & Classes'}
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-serif font-black text-white">
                  {systemInfo.students ? `${systemInfo.students}+` : '২৫+'}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  {lang === 'bn' ? 'অ্যাক্টিভ শিক্ষার্থী / ফ্যাকাল্টি' : 'Active Students / Mentors'}
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-serif font-black text-emerald-400">১৫০+</p>
                <p className="text-xs text-slate-400 font-medium">
                  {lang === 'bn' ? 'করপোরেট পার্টনার্স' : 'Corporate Partners'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Flagship Program Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 shadow-2xl overflow-hidden">
              {/* Header Badge */}
              <div className="bg-[#0A192F] text-white p-4 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#C8963E]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#E5A93C]">
                    {lang === 'bn' ? 'ফ্ল্যাগশিপ চার্টার্ড প্রোগ্রাম' : 'Flagship Chartered Program'}
                  </span>
                </div>
                <span className="text-xs bg-[#1E3A8A]/50 text-slate-200 border border-[#C8963E]/40 px-2.5 py-0.5 rounded-full font-mono">
                  {featuredCourse.batchNumber}
                </span>
              </div>

              {/* Course Info */}
              <div className="p-6 space-y-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#E5A93C] mb-1">
                    <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30">
                      {featuredCourse.categoryLabel}
                    </span>
                    <span className="text-slate-400">• {featuredCourse.duration}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-white leading-snug">
                    {lang === 'bn' ? featuredCourse.title : featuredCourse.titleEn}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
                    {lang === 'bn' ? featuredCourse.description : featuredCourse.descriptionEn}
                  </p>
                </div>

                {/* 3 Semesters Visual Tracker */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {lang === 'bn' ? '১ বছর মেয়াদি ৩টি সেমিস্টার কারিকুলাম:' : '3-Semester Curriculum Structure:'}
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-[#C8963E] font-bold block">সেমিস্টার ১</span>
                      <span className="text-[11px] text-slate-300 font-semibold truncate block mt-0.5">লিডারশিপ ও IFRS</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-[#C8963E] font-bold block">সেমিস্টার ২</span>
                      <span className="text-[11px] text-slate-300 font-semibold truncate block mt-0.5">SAP-FICO ও ভ্যাট</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-[#C8963E] font-bold block">সেমিস্টার ৩</span>
                      <span className="text-[11px] text-slate-300 font-semibold truncate block mt-0.5">ট্রেজারি ও অডিট</span>
                    </div>
                  </div>
                </div>

                {/* Batch Countdown Box */}
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#C8963E]" />
                      {lang === 'bn' ? 'ক্লাস শুরু হতে বাকি:' : 'Orientation in:'}
                    </span>
                    <span className="font-bold text-rose-400">
                      {lang === 'bn' ? `মাত্র ${featuredCourse.seatsLeft}টি সিট খালি!` : `Only ${featuredCourse.seatsLeft} seats available!`}
                    </span>
                  </div>

                  {/* Countdown Timer Grid */}
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-slate-900 rounded-lg p-2 border border-slate-800">
                      <p className="text-base font-black text-white font-mono">{timeLeft.days}</p>
                      <p className="text-[10px] text-slate-400">{lang === 'bn' ? 'দিন' : 'Days'}</p>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-2 border border-slate-800">
                      <p className="text-base font-black text-white font-mono">{timeLeft.hours}</p>
                      <p className="text-[10px] text-slate-400">{lang === 'bn' ? 'ঘণ্টা' : 'Hours'}</p>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-2 border border-slate-800">
                      <p className="text-base font-black text-white font-mono">{timeLeft.minutes}</p>
                      <p className="text-[10px] text-slate-400">{lang === 'bn' ? 'মিনিট' : 'Mins'}</p>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-2 border border-slate-800">
                      <p className="text-base font-black text-white font-mono">{timeLeft.seconds}</p>
                      <p className="text-[10px] text-slate-400">{lang === 'bn' ? 'সেকেন্ড' : 'Secs'}</p>
                    </div>
                  </div>
                </div>

                {/* Price & Admission Actions */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-serif font-black text-[#E5A93C]">
                        ৳{featuredCourse.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 line-through">
                        ৳{featuredCourse.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-semibold block">
                      {lang === 'bn' ? '৩টি সেমিস্টারে কিস্তি সুবিধা প্রাপ্য' : '3-Semester Installments Available'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/courses"
                      className="px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer text-center"
                    >
                      {lang === 'bn' ? 'কোর্সের তালিকা' : 'Courses'}
                    </Link>
                    <Link
                      href={`/enroll-now?course=${encodeURIComponent(featuredCourse.titleEn || featuredCourse.title)}`}
                      className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 text-xs font-serif font-black shadow-md transition-all cursor-pointer text-center"
                    >
                      {lang === 'bn' ? 'অনলাইন ভর্তি' : 'Apply Now'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
