'use client';

import React from 'react';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  Cpu,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface LearningMethodologyProps {
  lang: 'bn' | 'en';
  onExploreCourses?: () => void;
}

export default function LearningMethodology({
  lang,
}: LearningMethodologyProps) {
  const pillars = [
    {
      step: '০১',
      tag: 'Boardroom Decisions',
      tagBn: 'বোর্ডরুম ডিসিশনস',
      title: 'Real Corporate Case Studies',
      titleBn: 'রিয়েল কর্পোরেট কেস স্টাডিজ',
      description:
        'Analyze actual financial disclosures, M&A transactions, and board pitch decks from DSE-listed firms and multinationals.',
      descriptionBn:
        'পুঁথিগত বিদ্যা নয়, ডিএসই (DSE) তালিকাভুক্ত শীর্ষ কোম্পানি ও বহুজাতিক প্রতিষ্ঠানের বাস্তব ব্যালেন্স শিট, ভ্যালুয়েশন ও এমঅ্যান্ডএ কেস সরাসরি বিশ্লেষণ।',
      icon: BookOpen,
      badge: '100% Outcome-Driven',
    },
    {
      step: '০২',
      tag: 'Enterprise ERP Lab',
      tagBn: 'এন্টারপ্রাইজ ইআরপি ল্যাব',
      title: 'Hands-on SAP ERP & Tax Lab',
      titleBn: 'হ্যান্ডস-অন এসএপি ইআরপি ও ট্যাক্স ল্যাব',
      description:
        'Hands-on live configuration inside real SAP S/4HANA ERP environments and direct filing on NBR IVAS online tax portals.',
      descriptionBn:
        'প্রতিটি শিক্ষার্থীকে রিয়েল এন্টারপ্রাইজ এসএপি সার্ভার এবং জাতীয় রাজস্ব বোর্ডের (NBR) ই-ট্যাক্স ও মুসক ৯.১ অনলাইন পোর্টালে সরাসরি প্র্যাকটিস করানো হয়।',
      icon: Cpu,
      badge: '100% Outcome-Driven',
    },
    {
      step: '০৩',
      tag: 'Senior Leadership',
      tagBn: 'সিনিয়র লিডারশিপ',
      title: 'FCA & FCMA Fellow Faculty',
      titleBn: 'এফসিএ ও এফসিএমএ ফেলো ফ্যাকাল্টি',
      description:
        'Guided by practicing Fellow Chartered Accountants (FCA) and Cost & Management Accountants (FCMA) with 20+ years executive leadership.',
      descriptionBn:
        'আইসিএবি (ICAB) ও আইসিএমএবি (ICMAB)-এর ফেলো চার্টার্ড অ্যাকাউন্ট্যান্ট এবং দেশের শীর্ষস্থানীয় গ্রুপ সিএফওদের সরাসরি তত্ত্বাবধান ও গাইডেন্স।',
      icon: Award,
      badge: '100% Outcome-Driven',
    },
    {
      step: '০৪',
      tag: 'Executive Certificate',
      tagBn: 'এক্সিকিউটিভ সার্টিফিকেট',
      title: 'Professional Executive Credentials',
      titleBn: 'প্রফেশনাল এক্সিকিউটিভ ক্রেডেনশিয়ালস',
      description:
        'Award-winning professional executive certificates with online transcript verification and corporate recognition.',
      descriptionBn:
        'কোর্স সফলভাবে সম্পন্ন করার পর প্রফেশনাল এক্সিকিউটিভ সনদ প্রদান এবং অনলাইন ট্রান্সক্রিপ্ট ভেরিফিকেশন সুবিধা।',
      icon: GraduationCap,
      badge: '100% Outcome-Driven',
    },
  ];

  return (
    <section id="methodology" className="py-20 sm:py-24 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Exact copy from cfoedubd.com) */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-[#966718] dark:text-amber-400 mb-2">
            Executive Pedagogy & Standards
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 dark:text-white tracking-tight">
            Why Chartered Officer Limited Stands Apart as the Premier Choice
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
            Theory meets high-stakes corporate execution. Meticulously designed cohorts for career escalation into C-suite offices.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between group hover:border-[#C8963E]/60 shadow-2xs hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-serif font-black text-2xl text-[#C8963E] opacity-70 group-hover:opacity-100 transition-opacity">
                      {pillar.step}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      {lang === 'bn' ? pillar.tagBn : pillar.tag}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#C8963E] mb-4 group-hover:scale-105 transition-transform shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white mb-2 leading-snug">
                    {lang === 'bn' ? pillar.titleBn : pillar.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {lang === 'bn' ? pillar.descriptionBn : pillar.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{pillar.badge}</span>
                  </span>
                  <Link
                    href="/courses"
                    className="text-[10px] font-bold text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-0.5"
                  >
                    <span>{lang === 'bn' ? 'কোর্সসমূহ' : 'Courses'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
