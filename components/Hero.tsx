'use client';

import React from 'react';
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
  Building2,
  GraduationCap,
  Calendar
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

  return (
    <section id="hero-section" className="relative overflow-hidden bg-white dark:bg-[#0A192F] text-slate-900 dark:text-white pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Subtle architectural ambient lights */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(200,150,62,0.08),transparent_40%),radial-gradient(circle_at_85%_30%,rgba(30,58,138,0.06),transparent_45%)] dark:bg-[radial-gradient(circle_at_15%_20%,rgba(200,150,62,0.15),transparent_40%),radial-gradient(circle_at_85%_30%,rgba(30,58,138,0.3),transparent_45%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Prestigious Accreditation, Headline, Values, CTAs */}
          <div className="lg:col-span-7 space-y-7">
            
            {/* Accreditation Header Line */}
            <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium tracking-wide">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5A93C] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E5A93C]"></span>
              </span>
              <span className="text-[#966718] dark:text-[#E5A93C] font-bold tracking-wider uppercase text-[11px]">
                {systemInfo.motto || (lang === 'bn' ? 'সিএফও এডুকেশন বাংলাদেশ' : 'CFO Education Bangladesh')}
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
              <span className="text-slate-600 dark:text-slate-400">
                {lang === 'bn' ? 'প্রফেশনাল স্কিল ডেভেলপমেন্ট একাডেমি' : 'Professional Skill Development Academy'}
              </span>
              <ShieldCheck className="w-4 h-4 text-[#C8963E]" />
            </div>

            {/* Main Executive Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight leading-[1.16] text-slate-900 dark:text-white">
              {lang === 'bn' ? (
                <>
                  করপোরেট জগতের শীর্ষ পদ{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#966718] dark:from-[#FFDF79] dark:via-[#E5A93C] dark:to-[#C8963E]">
                    চিফ ফাইন্যান্সিয়াল অফিসার (CFO)
                  </span>{' '}
                  হিসেবে নিজেকে প্রতিষ্ঠিত করুন
                </>
              ) : (
                <>
                  Empower Your Leadership as a Certified{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#966718] dark:from-[#FFDF79] dark:via-[#E5A93C] dark:to-[#C8963E]">
                    Chief Financial Officer
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle / Overview */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
              {systemInfo.description ? (
                <span>{systemInfo.description}</span>
              ) : lang === 'bn' ? (
                'চার্টার্ড অফিসার লিমিটেড (COL) ও দি সিএফও ফাউন্ডেশন অব বাংলাদেশের যৌথ উদ্যোগে পরিচালিত ১-বছর মেয়াদি চার্টার্ড ফাইন্যান্সিয়াল অফিসার (CFO) প্রোগ্রাম, কাস্টমস ভ্যাট ও ট্যাক্সেশন ২০২৩, এসএপি-ফাইকো (SAP-FICO) ইআরপি এবং ফিনান্সিয়াল লিডারশিপের শীর্ষ একাডেমি।'
              ) : (
                'Chartered Officer Limited (COL) in association with The CFO Foundation of Bangladesh provides executive training in boardroom governance, SAP-FICO ERP, New Tax Act 2023, and financial leadership across Bangladesh and multinational firms.'
              )}
            </p>

            {/* Value Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 border-y border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0" />
                <span>{lang === 'bn' ? '১ বছর মেয়াদি ৩ সেমিস্টার' : '1-Year (3 Semesters)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0" />
                <span>{lang === 'bn' ? 'এসএপি-ফাইকো ইআরপি ল্যাব' : 'SAP-FICO ERP Lab'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0" />
                <span>{lang === 'bn' ? 'ট্যাক্স আইন ২০২৩ ও ভ্যাট' : 'Tax Act 2023 & VAT'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0" />
                <span>{lang === 'bn' ? 'এফসিএ ও এফসিএমএ মেন্টর' : 'FCA & FCMA Mentors'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0" />
                <span>{lang === 'bn' ? 'বার্ষিক কনভোকেশন সনদ' : 'Annual Convocation'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0" />
                <span>{lang === 'bn' ? 'সহজ কিস্তি সুবিধা' : 'Flexible Installments'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                href="/enroll-now?course=Chartered%20Financial%20Officer%20(CFO)"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#A97B28] hover:brightness-110 text-slate-950 font-serif font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all transform active:scale-95 cursor-pointer"
              >
                <span>{lang === 'bn' ? 'CFO অনলাইন ভর্তি ফরম' : 'Apply for CFO Program'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={onExploreCourses}
                className="px-5 py-3.5 rounded-xl bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-[#C8963E]/60 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#C8963E]" />
                <span>{lang === 'bn' ? 'সকল লাইভ কোর্স' : 'All Live Batches'}</span>
              </button>

              <Link
                href="/certificates"
                className="px-4 py-3.5 rounded-xl bg-amber-50/70 dark:bg-[#1E3A8A]/30 hover:bg-amber-100/70 dark:hover:bg-[#1E3A8A]/50 text-slate-800 dark:text-slate-200 border border-amber-300/80 dark:border-[#1E3A8A] font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-[#C8963E]" />
                <span>{lang === 'bn' ? 'সনদ যাচাই করুন' : 'Verify Certificate'}</span>
              </Link>
            </div>

            {/* Institutional Live Ticker Stats */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-2xl sm:text-3xl font-serif font-black text-slate-900 dark:text-white">
                  {systemInfo.graduates ? `${systemInfo.graduates}+` : '৩,১০০+'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {lang === 'bn' ? 'নিবন্ধিত শিক্ষার্থী' : 'Enrolled Learners'}
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-serif font-black text-[#966718] dark:text-[#E5A93C]">
                  {systemInfo.classes ? `${systemInfo.classes}+` : '২,০৯০+'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {lang === 'bn' ? 'সমাপ্ত সেশন' : 'Finished Sessions'}
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-serif font-black text-slate-900 dark:text-white">
                  {systemInfo.students ? `${systemInfo.students}+` : '৫০+'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {lang === 'bn' ? 'অনলাইন প্রশিক্ষক' : 'Online Instructors'}
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-serif font-black text-emerald-600 dark:text-emerald-400">৯৫%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {lang === 'bn' ? 'শিক্ষার্থী সন্তুষ্টির হার' : 'Satisfaction Rate'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Program Display */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-700/80 shadow-xl overflow-hidden transition-colors">
              
              {/* Header Badge */}
              <div className="bg-amber-50/80 dark:bg-[#0A192F] p-4 sm:p-5 flex items-center justify-between border-b border-amber-200/70 dark:border-slate-800 transition-colors">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#C8963E]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#966718] dark:text-[#E5A93C]">
                    {featuredCourse.category === 'cfo-flagship'
                      ? (lang === 'bn' ? 'ফ্ল্যাগশিপ চার্টার্ড প্রোগ্রাম' : 'Flagship Chartered Program')
                      : (featuredCourse.badge || (lang === 'bn' ? 'বিশেষায়িত এক্সিকিউটিভ কোর্স' : 'Executive Course'))}
                  </span>
                </div>
                <span className="text-xs bg-white dark:bg-[#1E3A8A]/50 text-slate-800 dark:text-slate-200 border border-amber-300 dark:border-[#C8963E]/40 px-2.5 py-0.5 rounded-full font-mono font-semibold">
                  {featuredCourse.batchNumber}
                </span>
              </div>

              {/* Course Info */}
              <div className="p-6 space-y-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#966718] dark:text-[#E5A93C] mb-1.5">
                    <span>{featuredCourse.categoryLabel}</span>
                    <span className="text-slate-400 dark:text-slate-500">•</span>
                    <span className="text-slate-600 dark:text-slate-400">{featuredCourse.duration}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-white leading-snug">
                    {lang === 'bn' ? featuredCourse.title : featuredCourse.titleEn}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
                    {lang === 'bn' ? featuredCourse.description : featuredCourse.descriptionEn}
                  </p>
                </div>

                {/* Multi-Semester Track OR Course Key Modules (Dynamic) */}
                {featuredCourse.category === 'cfo-flagship' ? (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                      {lang === 'bn' ? '১ বছর মেয়াদি ৩টি সেমিস্টার কারিকুলাম:' : '3-Semester Curriculum Structure:'}
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                        <span className="text-[10px] text-[#966718] dark:text-[#C8963E] font-bold block">সেমিস্টার ১</span>
                        <span className="text-[11px] text-slate-800 dark:text-slate-300 font-semibold truncate block mt-0.5">IFRS ও গভর্ন্যান্স</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                        <span className="text-[10px] text-[#966718] dark:text-[#C8963E] font-bold block">সেমিস্টার ২</span>
                        <span className="text-[11px] text-slate-800 dark:text-slate-300 font-semibold truncate block mt-0.5">SAP-FICO ও ভ্যাট</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                        <span className="text-[10px] text-[#966718] dark:text-[#C8963E] font-bold block">সেমিস্টার ৩</span>
                        <span className="text-[11px] text-slate-800 dark:text-slate-300 font-semibold truncate block mt-0.5">CFO ক্যাপস্টোন</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>{lang === 'bn' ? 'মোট ক্লাস সংখ্যা:' : 'Total Classes:'}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{featuredCourse.totalClasses} টি লাইভ সেশন</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>{lang === 'bn' ? 'ক্লাস শিডিউল:' : 'Schedule:'}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{featuredCourse.schedule}</span>
                    </div>
                  </div>
                )}

                {/* Pricing & Admission CTA */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    {featuredCourse.price === 0 ? (
                      <div>
                        <span className="text-2xl font-serif font-black text-emerald-600 dark:text-emerald-400">
                          {lang === 'bn' ? 'সম্পূর্ণ ফ্রি' : 'Free Enrollment'}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block mt-0.5">
                          {lang === 'bn' ? '১০০% স্কলারশিপ / ফ্রি রেজিস্ট্রেশন' : '100% Free Access'}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-serif font-black text-slate-900 dark:text-[#E5A93C]">
                            ৳{featuredCourse.price.toLocaleString()}
                          </span>
                          {featuredCourse.originalPrice > featuredCourse.price && (
                            <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                              ৳{featuredCourse.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold block">
                          {featuredCourse.category === 'cfo-flagship'
                            ? (lang === 'bn' ? '৩টি সেমিস্টারে কিস্তি সুবিধা প্রাপ্য' : '3-Semester Installments Available')
                            : (lang === 'bn' ? 'অনলাইন পেমেন্ট ও বিকাশ সাপোর্ট' : 'Online Payment & bKash Supported')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/courses"
                      className="px-3.5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer text-center"
                    >
                      {lang === 'bn' ? 'কোর্সের তালিকা' : 'Courses'}
                    </Link>
                    <Link
                      href={`/enroll-now?course=${encodeURIComponent(featuredCourse.titleEn || featuredCourse.title)}`}
                      className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#A97B28] hover:brightness-110 text-slate-950 text-xs font-serif font-black shadow-md transition-all cursor-pointer text-center"
                    >
                      {featuredCourse.price === 0
                        ? (lang === 'bn' ? 'ফ্রি ভর্তি' : 'Join Free')
                        : (lang === 'bn' ? 'অনলাইন ভর্তি' : 'Apply Now')}
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
