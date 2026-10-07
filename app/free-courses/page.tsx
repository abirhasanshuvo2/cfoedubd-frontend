'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import { useCfo } from '@/context/CfoContext';
import { COURSES } from '@/data/cfo-data';
import {
  Sparkles,
  Gift,
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  ArrowRight,
  Search,
  BookOpen,
  MessageCircle,
  HelpCircle
} from 'lucide-react';

export default function FreeCoursesPage() {
  const { lang, courses, theme, systemInfo } = useCfo();
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all free courses (strictly price === 0)
  const allAvailableCourses = courses && courses.length > 0 ? courses : COURSES;
  const freeCourses = useMemo(() => {
    let list = allAvailableCourses.filter((c) => c.price === 0);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.titleEn.toLowerCase().includes(q) ||
          c.categoryLabel.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allAvailableCourses, searchQuery]);

  const faqs = [
    {
      qBn: 'ফ্রি কোর্সগুলোতে কীভাবে জয়েন করবো?',
      qEn: 'How do I join the free courses?',
      aBn: 'প্রতিটি ফ্রি কোর্সের "ব্যাচে ভর্তি হোন" বাটনে ক্লিক করে সাধারণ তথ্য দিয়ে ১০০% বিনামূল্যে রেজিস্ট্রেশন সম্পন্ন করুন। ক্লাস শুরুর আগে ইমেইল ও এসএমএসে ক্লাসের লিংক পৌঁছে যাবে।',
      aEn: 'Click "Enroll in Batch" on any free course, fill in your details, and complete registration at zero cost. Class links will be sent via SMS and email before the session starts.',
    },
    {
      qBn: 'ফ্রি কোর্সে অংশগ্রহণ করলে কি কোনো লুকানো চার্জ আছে?',
      qEn: 'Are there any hidden charges for free courses?',
      aBn: 'না, চার্টার্ড অফিসার লিমিটেডের ওপেন লার্নিং ইনিশিয়েটিভের অধীন ফ্রি কোর্স ও ওরিয়েন্টেশন সম্পূর্ণ বিনামূল্য। কোনো লুকানো চার্জ নেই।',
      aEn: 'No, all free courses and orientation workshops under Chartered Officer Limited are 100% free with no hidden charges.',
    },
    {
      qBn: 'ক্লাসের রেকর্ড ও রিসোর্স দেওয়া হবে কি?',
      qEn: 'Will class recordings and resources be provided?',
      aBn: 'হ্যাঁ, লাইভ ক্লাস শেষে সকল নিবন্ধিত শিক্ষার্থীদের পোর্টাল এবং গ্রুপে প্রয়োজনীয় স্টাডি ম্যাটেরিয়ালস সরবরাহ করা হয়।',
      aEn: 'Yes, after live sessions, registered participants receive relevant study materials and access.',
    },
  ];

  return (
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-emerald-50/80 via-slate-50 to-white dark:from-[#081F1E] dark:via-[#092B28] dark:to-[#081A19] text-slate-900 dark:text-white py-14 sm:py-18 border-b border-slate-200 dark:border-emerald-950/80 overflow-hidden transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.18),transparent)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 text-emerald-900 dark:text-emerald-300 text-xs font-bold shadow-2xs">
            <Gift className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>
              {lang === 'bn'
                ? 'ওপেন লার্নিং ইনিশিয়েটিভ • ১০০% ফ্রি কোর্স ও রিসোর্স'
                : 'Open Learning Initiative • 100% Free Courses & Resources'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-slate-950 dark:text-white leading-tight max-w-4xl mx-auto">
            {lang === 'bn' ? (
              <>
                ফ্রি লাইভ কোর্স ও <br />
                <span className="text-emerald-700 dark:text-emerald-400">
                  ক্যারিয়ার স্কিল মাস্টারক্লাস
                </span>
              </>
            ) : (
              <>
                Free Live Courses & <br />
                <span className="text-emerald-700 dark:text-emerald-400">
                  Career Skill Masterclasses
                </span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {lang === 'bn'
              ? 'কোনো প্রকার কোর্স ফি ছাড়াই আজই শুরু করুন দেশের স্বনামধন্য ফেলো চার্টার্ড অ্যাকাউন্ট্যান্টস (FCA, FCMA) ও করপোরেট সিএফওদের পরিচালিত ফ্রি লাইভ ক্লাস ও সেশন।'
              : 'Start learning corporate finance, accounting essentials, and tech skills with FCA/FCMA Fellows at zero cost with open admission.'}
          </p>

          {/* Quick Metrics */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'bn' ? '১০০% ফ্রি ভর্তি' : '100% Free Enrollment'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'bn' ? 'লাইভ ইন্টারেক্টিভ ক্লাস' : 'Live Interactive Sessions'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'bn' ? 'বিশেষজ্ঞ দিকনির্দেশনা' : 'Industry Mentorship'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-10">
        
        {/* Search & Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-950 dark:text-white">
              {lang === 'bn' ? 'উপলব্ধ ফ্রি কোর্সসমূহ' : 'Available Free Courses'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {lang === 'bn'
                ? `মোট ${freeCourses.length}টি ফ্রি কোর্স পাওয়া গেছে`
                : `${freeCourses.length} free course(s) available`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'bn' ? 'ফ্রি কোর্স খুঁজুন...' : 'Search free courses...'}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <Link
              href="/courses"
              className="text-xs font-bold text-amber-700 dark:text-[#FFC000] hover:underline whitespace-nowrap"
            >
              {lang === 'bn' ? 'সব কোর্স দেখুন →' : 'View All Courses →'}
            </Link>
          </div>
        </div>

        {/* Free Courses Grid */}
        {freeCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {freeCourses.map((course) => (
              <CourseCard key={course.id} course={course} lang={lang} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4 max-w-2xl mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
              <Gift className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-serif font-black text-slate-900 dark:text-white">
              {lang === 'bn'
                ? 'বর্তমানে কোনো ওপেন ফ্রি কোর্স সেশন চালু নেই'
                : 'No open free batches at this moment'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'আমরা প্রতিনিয়ত নতুন নতুন ফ্রি ওয়ার্কশপ ও ওরিয়েন্টেশন ব্যাচ প্রকাশ করি। পরবর্তী ফ্রি ব্যাচের নোটিফিকেশন পেতে আমাদের সাথে যোগাযোগ রাখুন।'
                : 'We announce new free workshops and orientation batches regularly. Explore our flagship executive programs or connect with us on WhatsApp.'}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/courses"
                className="px-5 py-2.5 rounded-xl bg-[#FFC000] hover:bg-[#E6AC00] text-slate-950 font-black text-xs transition-all shadow-xs"
              >
                {lang === 'bn' ? 'সব লাইভ প্রোগ্রাম দেখুন' : 'Explore All Programs'}
              </Link>
              <a
                href={`https://wa.me/${(systemInfo.whatsapp || systemInfo.phone || '8801713378787').replace(/[^0-9]/g, '')}?text=Hello%20COL,%20I%20want%20to%20know%20about%20upcoming%20free%20courses.`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে যোগাযোগ' : 'WhatsApp Support'}</span>
              </a>
            </div>
          </div>
        )}

        {/* Free Courses FAQ */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-950 dark:text-white">
              {lang === 'bn' ? 'ফ্রি কোর্স সম্পর্কিত সাধারণ জিজ্ঞাসা' : 'Free Courses FAQs'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <h4 className="font-bold text-xs sm:text-sm text-slate-950 dark:text-white">
                    {lang === 'bn' ? faq.qBn : faq.qEn}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {lang === 'bn' ? faq.aBn : faq.aEn}
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
