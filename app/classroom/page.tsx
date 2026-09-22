'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCfo } from '@/context/CfoContext';
import { COURSES } from '@/data/cfo-data';
import {
  Video,
  PlayCircle,
  FileCheck,
  Award,
  Calendar,
  ExternalLink,
  Clock,
  Download,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Users,
  ShieldCheck,
  ChevronRight,
  GraduationCap,
  Building2,
  FileSpreadsheet
} from 'lucide-react';

export default function ClassroomPage() {
  const { lang, enrolledCourses, user, loginAsDemo } = useCfo();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    enrolledCourses[0]?.id || COURSES[0].id
  );
  const [activeTab, setActiveTab] = useState<'classes' | 'recordings' | 'tasks' | 'certificate'>('classes');

  const activeCourse =
    enrolledCourses.find((c) => c.id === selectedCourseId) ||
    COURSES.find((c) => c.id === selectedCourseId) ||
    COURSES[0];

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />

        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 w-full flex items-center justify-center">
          <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-[#966718] flex items-center justify-center mx-auto shadow-sm">
              <GraduationCap className="w-8 h-8 text-[#C8963E]" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#966718] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                {lang === 'bn' ? 'এক্সিকিউটিভ লার্নিং পোর্টাল ও ক্লাসরুম' : 'Executive LMS Portal'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
                {lang === 'bn' ? 'ক্লাসরুমে প্রবেশ করতে লগইন করুন' : 'Sign in to Executive Classroom'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {lang === 'bn'
                  ? 'লাইভ সেশন লিংক, ফিন্যান্সিয়াল মডেলিং এক্সেল শিট, এনবিআর রিটার্ন ফরম্যাট, ভিডিও রেকর্ডিং ও বিটিইবি একাডেমিক হিস্ট্রি দেখতে আপনার পোর্টালে প্রবেশ করুন।'
                  : 'Access live executive sessions, downloadable corporate financial models, past HD recordings, and BTEB transcript records.'}
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-left max-w-2xl mx-auto">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <Video className="w-5 h-5 text-[#C8963E] mb-2" />
                <h4 className="text-xs font-serif font-bold text-slate-900">{lang === 'bn' ? 'হাইব্রিড ও লাইভ সেশন' : 'Hybrid Live Sittings'}</h4>
                <p className="text-[11px] text-slate-600 mt-1">{lang === 'bn' ? 'সরাসরি সিনিয়র এফসিএ ও সিএফও মেন্টরদের সাথে ইন্টারঅ্যাকশন।' : 'Direct board-level interaction with veteran FCAs.'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600 mb-2" />
                <h4 className="text-xs font-serif font-bold text-slate-900">{lang === 'bn' ? 'কেস স্টাডি ও টাস্ক' : 'Boardroom Case Studies'}</h4>
                <p className="text-[11px] text-slate-600 mt-1">{lang === 'bn' ? 'বাস্তব ডিএসই ও এনবিআর রিটার্ন অডিট সাবমিশন ও রিভিউ।' : 'Real financial statements & corporate tax submissions.'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <ShieldCheck className="w-5 h-5 text-[#0A192F] mb-2" />
                <h4 className="text-xs font-serif font-bold text-slate-900">{lang === 'bn' ? 'বিটিইবি নিবন্ধিত সনদ' : 'BTEB Credential'}</h4>
                <p className="text-[11px] text-slate-600 mt-1">{lang === 'bn' ? 'সমাবর্তনে আনুষ্ঠানিক ডিগ্রি ও ভেরিফাইড সনদপত্র অর্জন।' : 'Official diploma conferring at annual convocation.'}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <button
                onClick={() => loginAsDemo()}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 font-serif font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{lang === 'bn' ? '⚡ ১-ক্লিকে এক্সিকিউটিভ ডেমো প্রিভিউ' : '⚡ 1-Click Executive Demo'}</span>
              </button>

              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0A192F] hover:bg-[#1E3A8A] text-white font-serif font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>{lang === 'bn' ? 'মোবাইল / ইমেইল দিয়ে লগইন' : 'Sign in via Mobile'}</span>
                <ChevronRight className="w-4 h-4 text-[#C8963E]" />
              </Link>
            </div>
          </div>
        </main>

        <Footer lang={lang} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      {/* Top Banner with Student Info */}
      <section className="bg-[#0A192F] text-white py-8 border-b border-[#1E3A8A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#E5A93C] uppercase tracking-wider font-mono">
              COL Executive Student Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-white">
              {lang === 'bn' ? `স্বাগতম, ${user.name}` : `Welcome, ${user.name}`}
            </h1>
            <p className="text-xs text-slate-300">
              নিবন্ধিত আইডি: <span className="font-mono text-[#E5A93C] font-bold">COL-CFO-2026-8819</span> • সিটি সেন্টার মতিঝিল ও অনলাইন ক্লাসরুম
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/verify-certificate"
              className="px-4 py-2 rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/80 text-xs font-bold text-slate-200 border border-slate-700 transition-colors"
            >
              সনদ যাচাই পোর্টাল
            </Link>
            <Link
              href="/courses"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] text-slate-950 font-serif font-black text-xs shadow-xs"
            >
              নতুন প্রোগ্রামে আবেদন
            </Link>
          </div>
        </div>
      </section>

      {/* Course Switcher & Tabs */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Active Course Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#0A192F] text-[#E5A93C] flex items-center justify-center font-serif font-bold text-sm shrink-0 border border-[#C8963E]">
              COL
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                বর্তমান অধ্যয়নরত প্রোগ্রাম ({activeCourse.batchNumber})
              </p>
              <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                {activeCourse.title}
              </h2>
            </div>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => setActiveTab('classes')}
              className={`px-3.5 py-2 rounded-xl text-xs font-serif font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'classes'
                  ? 'bg-[#0A192F] text-[#E5A93C]'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              আজকের সেশন
            </button>
            <button
              onClick={() => setActiveTab('recordings')}
              className={`px-3.5 py-2 rounded-xl text-xs font-serif font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'recordings'
                  ? 'bg-[#0A192F] text-[#E5A93C]'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              রেকর্ডিং আর্কাইভ
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-3.5 py-2 rounded-xl text-xs font-serif font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'tasks'
                  ? 'bg-[#0A192F] text-[#E5A93C]'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              কেস স্টাডি ও ফাইল
            </button>
            <button
              onClick={() => setActiveTab('certificate')}
              className={`px-3.5 py-2 rounded-xl text-xs font-serif font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'certificate'
                  ? 'bg-[#0A192F] text-[#E5A93C]'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              বিটিইবি সনদ
            </button>
          </div>
        </div>

        {/* Tab 1: Today's Live Class */}
        {activeTab === 'classes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Live Class Details Card (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  আজকের এক্সিকিউটিভ সেশন
                </span>
                <span className="text-xs text-slate-500 font-mono">সেশন নং: ১৮/{activeCourse.totalClasses}</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
                  Session 18: Corporate Valuation, DCF Modeling & WACC Sensitivity Analysis
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  ডিএসই তালিকাভুক্ত বৃহৎ কোম্পানির অডিটেড ব্যালান্স শিট থেকে ফ্রি ক্যাশ ফ্লো (FCFF) নির্ধারণ এবং সিনারিও ম্যানেজার দিয়ে ডিসকাউন্টেড ক্যাশ ফ্লো মডেল তৈরি।
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#966718] uppercase">সেশন সময়সূচি:</span>
                  <p className="text-sm font-bold text-slate-900">শুক্রবার, রাত ৮:০০ টা - ১০:৩০ টা</p>
                  <p className="text-xs text-slate-500">ফ্যাকাল্টি: মোহাম্মদ তানভীর আহমেদ, এফসিএ</p>
                </div>

                <a
                  href="https://meet.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 font-serif font-black text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer whitespace-nowrap"
                >
                  <Video className="w-4 h-4" />
                  <span>লাইভ সেশনে যোগ দিন</span>
                </a>
              </div>

              {/* Progress Counters */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-semibold">ক্লাসের সময়:</span>
                  <p className="text-xs font-bold text-slate-900">{activeCourse.schedule}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-semibold">উপস্থিতি:</span>
                  <p className="text-xs font-bold text-slate-900">১৬/{activeCourse.totalClasses} টি</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-semibold">অগ্রগতি:</span>
                  <p className="text-xs font-bold text-emerald-600">৬৫% সম্পন্ন</p>
                </div>
              </div>
            </div>

            {/* Support Desk Card (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  ফ্যাকাল্টি হেল্পডেস্ক সক্রিয়
                </div>
                <h3 className="text-base font-serif font-bold text-slate-900">১:১ এক্সিকিউটিভ ডাউট সলভ</h3>
                <p className="text-xs text-slate-500">
                  এনবিআর রিটার্ন বা ফিন্যান্সিয়াল মডেলে কোনো জটিলতা দেখা দিলে সরাসরি মেন্টরের সাথে আলোচনা করুন।
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-[#966718] space-y-1">
                <span className="font-bold">মতিঝিল ক্যাম্পাস ও ভার্চুয়াল হেল্পলাইন:</span>
                <p>শনিবার ও শুক্রবার: সকাল ১০:০০ টা - সন্ধ্যা ৬:০০ টা</p>
              </div>

              <a
                href="https://meet.google.com"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#0A192F] hover:bg-[#1E3A8A] text-white font-serif font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-[#C8963E]" />
                <span>হেল্পডেস্ক রুমে যুক্ত হোন</span>
              </a>
            </div>
          </div>
        )}

        {/* Tab 2: Class Recordings */}
        {activeTab === 'recordings' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-serif font-bold text-slate-900">
              {activeCourse.title} - ফুল এইচডি ভিডিও আর্কাইভ
            </h3>

            <div className="divide-y divide-slate-100">
              {[
                { title: 'Session 17: Corporate Tax Return Form 82C Computation & Withholding Tax', duration: '2h 15m', date: '3 days ago' },
                { title: 'Session 16: Customs Bonded Warehouse Management & NBR SRO Analysis', duration: '2h 30m', date: '6 days ago' },
                { title: 'Session 15: SAP-FICO General Ledger (FI-GL) & Account Payable (FI-AP) Configurations', duration: '2h 00m', date: '10 days ago' },
                { title: 'Session 14: Budgeting, Variance Reporting & Boardroom PowerBI Presentation', duration: '2h 10m', date: '14 days ago' },
              ].map((rec, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#966718] flex items-center justify-center shrink-0">
                      <PlayCircle className="w-6 h-6 text-[#C8963E]" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900">{rec.title}</p>
                      <p className="text-[11px] text-slate-500">
                        দৈর্ঘ্য: {rec.duration} • আপলোড: {rec.date}
                      </p>
                    </div>
                  </div>

                  <button className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-800 font-bold text-xs cursor-pointer">
                    রেকর্ডিং দেখুন
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Tasks & Files */}
        {activeTab === 'tasks' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-serif font-bold text-slate-900">বোর্ডরুম কেস স্টাডি ও ফাইল জমাদান</h3>

            <div className="space-y-3">
              {[
                { task: 'Case Study #05: Beximco Pharmaceuticals 5-Year Financial Statement Analysis & DCF Model', status: 'Passed', score: '94/100', feedback: 'অসাধারণ ওয়ার্কিং ক্যাপিটাল অ্যাসেসমেন্ট ও ক্যাপেক্স প্রজেকশন।' },
                { task: 'Case Study #04: NBR VAT 9.1 Return Preparation & Mushak 4.3 Input-Output Ratio Submission', status: 'Passed', score: '98/100', feedback: 'ট্যাক্স কম্প্লায়েন্স নিখুঁতভাবে সম্পন্ন হয়েছে।' },
                { task: 'Case Study #06: SAP-FICO Month-End Closing & P&L Extraction Simulation', status: 'Pending Review', score: 'মূল্যায়নাধীন', feedback: 'গতকাল জমাদান সম্পন্ন হয়েছে, রিভিউ প্রসেসে রয়েছে।' },
              ].map((t, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{t.task}</h4>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        t.status === 'Passed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-[#966718]'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong>ফ্যাকাল্টি মূল্যায়ন:</strong> {t.feedback}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Certificate */}
        {activeTab === 'certificate' && (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#0A192F] text-[#E5A93C] flex items-center justify-center mx-auto border border-[#C8963E]">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-serif font-bold text-[#966718] uppercase tracking-wider block">
                BTEB Accredited Official Certificate
              </span>
              <h3 className="text-xl font-serif font-black text-slate-900">{activeCourse.title}</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                সিএফও প্রোগ্রামের ৮০% উপস্থিতি ও বোর্ডরুম ডিফেন্স সম্পন্ন হলে আপনার ডিজিটাল সনদ উন্মুক্ত হবে এবং সমাবর্তনে মূল সনদ প্রদান করা হবে।
              </p>
            </div>

            <Link
              href="/verify-certificate?id=COL-CFO-2025-0101"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] text-slate-950 font-serif font-black text-xs cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>সনদ যাচাইকরণ ও প্রিভিউ দেখুন</span>
            </Link>
          </div>
        )}
      </main>

      <Footer lang={lang} />
    </div>
  );
}
