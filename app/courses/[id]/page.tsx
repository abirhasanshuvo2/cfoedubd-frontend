'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { COURSES, Course } from '@/data/cfo-data';
import { useCfo } from '@/context/CfoContext';
import {
  Calendar,
  Clock,
  Users,
  Star,
  Award,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  Building2,
  Briefcase,
  PlayCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Flame,
  PhoneCall,
  Share2,
  Check,
  GraduationCap
} from 'lucide-react';

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = String(unwrappedParams?.id || '');
  const { lang, courses, theme, systemInfo } = useCfo();

  console.log('[DEBUG CourseDetail] unwrappedParams:', unwrappedParams, 'id:', id);

  // Merge both live backend courses and catalog programs so all links resolve seamlessly
  const combinedCourses = [...(courses || []), ...COURSES];
  const decodedId = decodeURIComponent(id).toLowerCase().trim();
  const course = combinedCourses.find(
    (c) =>
      c.id.toLowerCase() === decodedId ||
      (c.slug && c.slug.toLowerCase() === decodedId) ||
      c.id.replace(/^api-/, '').toLowerCase() === decodedId ||
      c.title.toLowerCase() === decodedId ||
      (c.titleEn && c.titleEn.toLowerCase() === decodedId) ||
      (c.batchNumber && c.batchNumber.toLowerCase() === decodedId)
  );

  console.log('[DEBUG CourseDetail] found course:', course?.title, 'total combined:', combinedCourses.length);

  if (!course) {
    notFound();
  }

  const [activeTab, setActiveTab] = useState<'syllabus' | 'projects' | 'certificate' | 'faq'>('syllabus');
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);
  const [copiedLink, setCopiedLink] = useState(false);

  const hasDiscount = course.originalPrice > course.price && course.originalPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  const seatsPercent = Math.min(
    100,
    Math.round(((course.totalSeats - course.seatsLeft) / course.totalSeats) * 100)
  );

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col transition-colors ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}
    >
      <Navbar />

      {/* Breadcrumb Row */}
      <div className="bg-slate-100 dark:bg-[#0A192F] border-b border-slate-200 dark:border-[#1E3A8A] text-xs py-2.5 px-4 sm:px-8 text-slate-600 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              {lang === 'bn' ? 'হোম' : 'Home'}
            </Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              {lang === 'bn' ? 'প্রোগ্রামসমূহ' : 'Courses'}
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-200 truncate font-semibold">
              {lang === 'bn' ? course.title : course.titleEn}
            </span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">লিংক কপি হয়েছে</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#C8963E]" />
                <span>{lang === 'bn' ? 'শেয়ার করুন' : 'Share'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hero Header Section */}
      <header className="bg-gradient-to-b from-amber-50/90 via-slate-50 to-white dark:from-[#0A192F] dark:via-[#0D254C] dark:to-[#0A192F] dark:bg-[#0A192F] text-slate-900 dark:text-white py-10 sm:py-14 border-b border-slate-200 dark:border-[#1E3A8A] relative overflow-hidden transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(200,150,62,0.18),transparent)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4">
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-[#E5A93C] border border-amber-300 dark:border-amber-500/40 shadow-2xs">
                  <Award className="w-3.5 h-3.5 text-[#C8963E]" />
                  COL EXECUTIVE PROGRAM
                </span>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-[#1E3A8A]/60 text-slate-800 dark:text-white border border-slate-300 dark:border-[#1E3A8A] shadow-2xs">
                  {course.batchNumber}
                </span>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent">
                  {course.categoryLabel}
                </span>

                {course.isPopular && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
                    <Flame className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    {lang === 'bn' ? 'শীর্ষ করপোরেট পছন্দ' : 'Top Enrolled'}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {lang === 'bn' ? course.title : course.titleEn}
              </h1>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                {lang === 'bn' ? course.description : course.descriptionEn}
              </p>

              {/* Ratings and Stats */}
              <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
                  <Star className="w-4 h-4 fill-[#C8963E] text-[#C8963E]" />
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{course.rating.toFixed(1)}</span>
                  <span className="text-slate-500 dark:text-slate-400">({course.enrolledCount * 2} রিভিউ)</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#C8963E]" />
                  <span>{course.enrolledCount} {lang === 'bn' ? 'শিক্ষার্থী ও প্রফেশনাল' : 'Executives Enrolled'}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#C8963E]" />
                  <span>{lang === 'bn' ? course.duration : course.durationEn}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#C8963E]" />
                  <span>{course.totalClasses} {lang === 'bn' ? 'টি ইন্টারঅ্যাক্টিভ সেশন' : 'Executive Sessions'}</span>
                </div>
              </div>
            </div>

            {/* Right Column Header summary preview */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-[#1E3A8A] text-slate-700 dark:text-slate-300 space-y-4 shadow-sm transition-colors">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-[#E5A93C] uppercase tracking-wider">
                    Executive Cohort Schedule
                  </span>
                  <p className="text-base font-serif font-bold text-slate-900 dark:text-white">{course.batchNumber}</p>
                </div>
                <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500 dark:text-slate-400">ব্যাচ শুরু:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{course.startDate}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500 dark:text-slate-400">ক্লাসের সময়:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{course.schedule}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500 dark:text-slate-400">ক্যাম্পাস মাধ্যম:</span>
                    <span className="font-semibold text-amber-800 dark:text-[#E5A93C]">
                      {systemInfo.address ? 'সিটি সেন্টার মতিঝিল / লাইভ' : 'ক্যাম্পাস / অনলাইন লাইভ'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500 dark:text-slate-400">স্বীকৃতি:</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">COL Executive Certificate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Two-Column Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Syllabus, Projects, Certificate, FAQ */}
          <div className="lg:col-span-8 space-y-8">
            {/* Tab Buttons Navigation */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-1.5 shadow-2xs flex items-center gap-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab('syllabus')}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'syllabus'
                    ? 'bg-amber-500 text-slate-950 dark:bg-[#C8963E] dark:text-slate-950 shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {lang === 'bn' ? 'সিলেবাস ও কারিকুলাম' : 'Curriculum'}
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'projects'
                    ? 'bg-amber-500 text-slate-950 dark:bg-[#C8963E] dark:text-slate-950 shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {lang === 'bn' ? 'বোর্ডরুম কেস স্টাডি' : 'Case Studies'}
              </button>

              <button
                onClick={() => setActiveTab('certificate')}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'certificate'
                    ? 'bg-amber-500 text-slate-950 dark:bg-[#C8963E] dark:text-slate-950 shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {lang === 'bn' ? 'সনদ ও স্বীকৃতি' : 'Certificate'}
              </button>

              <button
                onClick={() => setActiveTab('faq')}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'faq'
                    ? 'bg-amber-500 text-slate-950 dark:bg-[#C8963E] dark:text-slate-950 shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {lang === 'bn' ? 'প্রশ্নোত্তর' : 'FAQs'}
              </button>
            </div>

            {/* Tab 1: Syllabus / Curriculum */}
            {activeTab === 'syllabus' && (
              <section className="space-y-6">
                {/* Skills Learned Box */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                  <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C8963E]" />
                    <span>{lang === 'bn' ? 'এই প্রোগ্রামে অর্জিত হবে যেসকল দক্ষতা' : 'Executive Competencies'}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {course.skillsLearned.map((skill, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-medium">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Week by Week Curriculum Accordion */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">
                      {lang === 'bn' ? 'মডিউল ও সেশনভিত্তিক কারিকুলাম' : 'Curriculum Modules'}
                    </h3>
                    <span className="text-xs text-slate-500 font-semibold">
                      {course.syllabus.length} {lang === 'bn' ? 'টি মডিউল' : 'Modules'}
                    </span>
                  </div>

                  {course.syllabus.map((module) => {
                    const isExpanded = expandedWeek === module.week;
                    return (
                      <div
                        key={module.week}
                        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs transition-all"
                      >
                        <button
                          onClick={() => setExpandedWeek(isExpanded ? null : module.week)}
                          className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-[#966718] dark:text-amber-300 font-serif font-bold text-xs flex items-center justify-center shrink-0">
                              M{module.week}
                            </span>
                            <div>
                              <p className="text-[11px] font-bold text-[#C8963E] uppercase tracking-wider">
                                Module {module.week}
                              </p>
                              <h4 className="text-sm sm:text-base font-serif font-bold text-slate-900 dark:text-white">
                                {module.title}
                              </h4>
                            </div>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180 text-[#C8963E]' : ''
                            }`}
                          />
                        </button>

                        {isExpanded && (
                          <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
                            <div className="space-y-2">
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                {lang === 'bn' ? 'ক্লাসের মূল প্রতিপাদ্য ও কেস স্টাডি:' : 'Topics & Practical Labs:'}
                              </p>
                              <ul className="space-y-1.5">
                                {module.topics.map((topic, tIdx) => (
                                  <li key={tIdx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8963E] shrink-0" />
                                    <span>{topic}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Tab 2: Projects */}
            {activeTab === 'projects' && (
              <section className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">
                    {lang === 'bn' ? 'বোর্ডরুম ডিফেন্স ও রিয়েল-লাইফ কেস স্টাডি' : 'Boardroom Case Studies'}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    বাস্তব ডিএসই তালিকাভুক্ত আর্থিক প্রতিবেদন ও এনবিআর রিটার্ন অডিট সমাধান।
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-[#966718] dark:text-amber-300 font-mono font-bold text-xs flex items-center justify-center">
                        #{idx + 1}
                      </div>
                      <h4 className="text-sm font-serif font-bold text-slate-900 dark:text-white leading-snug">{proj}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        লাইভ এসএপি সিস্টেম ও জাতীয় রাজস্ব বোর্ডের পোর্টালে সরাসরি প্রয়োগযোগ্য।
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tab 4: Certificate */}
            {activeTab === 'certificate' && (
              <section className="p-8 rounded-2xl border-2 border-dashed border-[#C8963E]/50 bg-amber-50/30 dark:bg-slate-900/60 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-[#0A192F] text-amber-800 dark:text-[#E5A93C] flex items-center justify-center mx-auto shadow-sm border border-amber-300 dark:border-[#C8963E]">
                  <Award className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-xs font-serif font-bold text-[#966718] dark:text-amber-400 uppercase tracking-widest block">
                    Professional Verifiable Executive Credential
                  </span>
                  <h3 className="text-xl font-serif font-black text-slate-900 dark:text-white mt-1">
                    {lang === 'bn' ? course.title : course.titleEn}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                    কোর্সটি সফলভাবে সম্পন্ন করার পর চার্টার্ড অফিসার লিমিটেড (COL) কর্তৃক আনুষ্ঠানিকভাবে পেশাদার এক্সিকিউটিভ সার্টিফিকেট প্রদান করা হয়।
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800/60 text-xs font-mono text-slate-800 dark:text-slate-200 shadow-2xs">
                  <span>অনলাইন ভেরিফিকেশন আইডি: COL-CFO-2026-{course.id.slice(-4).toUpperCase()}</span>
                </div>
              </section>
            )}

            {/* Tab 5: Course FAQs */}
            {activeTab === 'faq' && (
              <section className="space-y-3">
                {[
                  { q: 'ক্লাসে উপস্থিত না থাকলে কি রেকর্ডিং সুবিধা আছে?', a: 'হ্যাঁ, প্রতিটি সেশনের ফুল এইচডি রেকর্ডিং ও ক্লাস নোট আপনার এলএমএস পোর্টালে সংরক্ষিত থাকবে।' },
                  { q: 'কোর্স ফি কি কিস্তিতে পরিশোধের সুযোগ আছে?', a: 'হ্যাঁ, সিএফও ১ বছর প্রোগ্রামে ৩টি সহজ সেমিস্টার কিস্তিতে ফি পরিশোধের পূর্ণ সুযোগ রয়েছে।' },
                  { q: 'কোর্স শেষে কী ধরনের সার্টিফিকেট পাওয়া যাবে?', a: 'সফলভাবে প্রতিটি মডিউল ও প্রজেক্ট সম্পন্ন করার পর চার্টার্ড অফিসার লিমিটেড (COL) কর্তৃক প্রফেশনাল এক্সিকিউটিভ সার্টিফিকেট প্রদান করা হয়।' },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1.5">
                    <h4 className="text-sm font-serif font-bold text-slate-900 dark:text-white">{item.q}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </section>
            )}
          </div>

          {/* Right Column (4 cols): Sticky Enrollment Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-5">
              {/* Batch Banner */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-serif font-bold text-slate-900 dark:text-white">{course.batchNumber}</span>
                  <p className="text-[11px] text-[#966718] dark:text-amber-300">আসন্ন ব্যাচে ভর্তি চলছে</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                  ADMISSION OPEN
                </span>
              </div>

              {/* Price Row */}
              <div className="space-y-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">কোর্স ফি (এককালীন বা কিস্তিতে):</span>
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-serif font-black text-slate-900 dark:text-white">
                      ৳{course.price.toLocaleString()}
                    </span>
                    {course.originalPrice > course.price && (
                      <span className="text-sm text-slate-400 line-through">
                        ৳{course.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {discountPercent > 0 && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-[#966718] dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Seats Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-rose-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    মাত্র {course.seatsLeft} টি সিট বাকি আছে!
                  </span>
                  <span className="text-slate-500">
                    {course.totalSeats - course.seatsLeft}/{course.totalSeats}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#C8963E] transition-all"
                    style={{ width: `${seatsPercent}%` }}
                  />
                </div>
              </div>

              {/* Enroll Now Direct Link */}
              <Link
                href={`/enroll-now?course=${encodeURIComponent(course.title)}`}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 font-serif font-black text-sm text-center shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{lang === 'bn' ? 'অনলাইন ভর্তি ফর্ম পূরণ করুন' : 'Apply for Admission'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Cohort Schedule Facts */}
              <div className="space-y-2 pt-2 text-xs border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>ব্যাচ ওরিয়েন্টেশন:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{course.startDate}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>ক্লাসের সময়:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{course.schedule}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>মোট সেশন:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{course.totalClasses} টি</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>মেয়াদ:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{course.duration}</span>
                </div>
              </div>

              {/* Admission Helpline */}
              <div className="text-center pt-1">
                <a
                  href={`tel:${(systemInfo.phone || '+880 1713378787').replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#966718] dark:hover:text-[#E5A93C] transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#C8963E]" />
                  <span>
                    {lang === 'bn' ? 'ভর্তি হেল্পলাইন:' : 'Helpline:'}{' '}
                    {systemInfo.phone || '+880 1713378787'}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom Enrollment Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 px-4 flex items-center justify-between shadow-2xl">
        <div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">কোর্স ফি:</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-serif font-black text-slate-950 dark:text-white">৳{course.price.toLocaleString()}</span>
            <span className="text-xs text-slate-400 line-through">৳{course.originalPrice.toLocaleString()}</span>
          </div>
        </div>
        <Link
          href={`/enroll/${course.id}`}
          className="py-2.5 px-6 rounded-xl bg-[#C8963E] text-slate-950 font-serif font-black text-xs shadow-md"
        >
          {lang === 'bn' ? 'অনলাইন ভর্তি' : 'Apply Now'}
        </Link>
      </div>

      <Footer lang={lang} />
    </div>
  );
}
