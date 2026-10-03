'use client';

import React from 'react';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  GraduationCap
} from 'lucide-react';

interface LearningMethodologyProps {
  lang: 'bn' | 'en';
  onExploreCourses: () => void;
}

export default function LearningMethodology({
  lang,
}: LearningMethodologyProps) {
  const pillars = [
    {
      step: '০১',
      title: 'প্র্যাকটিক্যাল কর্পোরেট কেস স্টাডি',
      titleEn: 'Real Corporate Case Studies',
      description:
        'পুঁথিগত বিদ্যা নয়, ডিএসই (DSE) তালিকাভুক্ত শীর্ষ কোম্পানি ও বহুজাতিক প্রতিষ্ঠানের বাস্তব ব্যালেন্স শিট, ভ্যালুয়েশন ও এমঅ্যান্ডএ কেস সরাসরি বিশ্লেষণ।',
      descriptionEn:
        'Analyze actual financial disclosures, M&A transactions, and board pitch decks from DSE-listed firms and multinationals.',
      icon: BookOpen,
      tag: 'Boardroom Decisions'
    },
    {
      step: '০২',
      title: 'এসএপি-ফাইকো (SAP-FICO) ও এনবিআর ল্যাব',
      titleEn: 'Hands-on SAP ERP & Tax Lab',
      description:
        'প্রতিটি শিক্ষার্থীকে রিয়েল এন্টারপ্রাইজ এসএপি সার্ভার এবং জাতীয় রাজস্ব বোর্ডের (NBR) ই-ট্যাক্স ও মুসক ৯.১ অনলাইন পোর্টালে সরাসরি প্র্যাকটিস করানো হয়।',
      descriptionEn:
        'Hands-on live configuration inside real SAP S/4HANA ERP environments and direct filing on NBR IVAS online tax portals.',
      icon: Cpu,
      tag: 'Enterprise ERP Lab'
    },
    {
      step: '০৩',
      title: 'এফসিএ ও এফসিএমএ মেন্টরশিপ',
      titleEn: 'FCA & FCMA Fellow Faculty',
      description:
        'আইসিএবি (ICAB) ও আইসিএমএবি (ICMAB)-এর ফেলো চার্টার্ড অ্যাকাউন্ট্যান্ট এবং দেশের শীর্ষস্থানীয় গ্রুপ সিএফওদের সরাসরি তত্ত্বাবধান ও গাইডেন্স।',
      descriptionEn:
        'Guided by practicing Fellow Chartered Accountants (FCA) and Cost & Management Accountants (FCMA) with 20+ years executive leadership.',
      icon: Award,
      tag: 'Senior Leadership'
    },
    {
      step: '০৪',
      title: 'প্রফেশনাল এক্সিকিউটিভ সার্টিফিকেট',
      titleEn: 'Professional Executive Credentials',
      description:
        'কোর্স সফলভাবে সম্পন্ন করার পর প্রফেশনাল এক্সিকিউটিভ সনদ প্রদান এবং অনলাইন ট্রান্সক্রিপ্ট ভেরিফিকেশন সুবিধা।',
      descriptionEn:
        'Award-winning professional executive certificates with online transcript verification and corporate recognition.',
      icon: GraduationCap,
      tag: 'Executive Certificate'
    }
  ];

  return (
    <section id="methodology" className="py-20 sm:py-24 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-[#966718] dark:text-amber-400 mb-2">
            {lang === 'bn' ? 'আমাদের শিক্ষণ পদ্ধতি ও মানদণ্ড' : 'Executive Pedagogy & Standards'}
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 dark:text-white tracking-tight">
            {lang === 'bn'
              ? 'কেন চার্টার্ড অফিসার লিমিটেড দেশের এক নম্বর প্রফেশনাল প্রতিষ্ঠান?'
              : 'Why Chartered Officer Limited Stands Apart as the Premier Choice'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
            {lang === 'bn'
              ? 'তত্ত্ব আর বাস্তব প্রয়োগের নিখুঁত মেলবন্ধন। পেশাদার এক্সিকিউটিভদের কর্মক্ষেত্রের শীর্ষ পদে পদোন্নতির জন্য সুপরিকল্পিত কারিকুলাম।'
              : 'Theory meets high-stakes corporate execution. Meticulously designed cohorts for career escalation into C-suite offices.'}
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
                    <span className="font-mono text-2xl font-black text-slate-300 dark:text-slate-600 group-hover:text-[#C8963E] transition-colors">
                      {pillar.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-slate-800 border border-amber-200/80 dark:border-slate-700 flex items-center justify-center text-amber-800 dark:text-[#E5A93C] group-hover:bg-amber-100 dark:group-hover:bg-[#0A192F] group-hover:text-amber-900 dark:group-hover:text-[#E5A93C] transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-[#966718] dark:text-amber-300 block mb-1">
                    {pillar.tag}
                  </span>

                  <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#C8963E] transition-colors">
                    {lang === 'bn' ? pillar.title : pillar.titleEn}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2.5">
                    {lang === 'bn' ? pillar.description : pillar.descriptionEn}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'bn' ? 'শতভাগ বাস্তবমুখী' : '100% Outcome-Driven'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Corporate Trust Strip */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-50 via-slate-50 to-amber-100/60 dark:from-[#0A192F] dark:via-[#0D254C] dark:to-[#1E3A8A] text-slate-900 dark:text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-200 dark:border-slate-800 shadow-md transition-colors">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#966718] dark:text-[#E5A93C]">
              {lang === 'bn' ? 'অ্যাকাডেমিক ও পেশাগত সনদ স্বীকৃতি' : 'Academic & Executive Credentials'}
            </span>
            <h4 className="text-lg sm:text-xl font-serif font-black text-slate-900 dark:text-white">
              {lang === 'bn'
                ? 'ইন্ডাস্ট্রি-স্বীকৃত প্রফেশনাল এক্সিকিউটিভ প্রোগ্রাম'
                : 'Industry-Recognized Professional Executive Programs'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
              {lang === 'bn'
                ? 'আমাদের প্রতিটি প্রোগ্রামের সনদ দেশ-বিদেশের শীর্ষ বহুজাতিক প্রতিষ্ঠান ও করপোরেট গ্রুপে পদোন্নতির জন্য সরাসরি গ্রহণযোগ্য।'
                : 'Our certificates are valued by leading conglomerates, financial institutions, and corporate employers across Bangladesh.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/certificates"
              className="px-5 py-3 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white font-bold text-xs sm:text-sm transition-all shadow-xs"
            >
              {lang === 'bn' ? 'সনদ যাচাই করুন' : 'Verify Certificate'}
            </Link>
            <Link
              href="/enroll-now"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#A97B28] hover:brightness-110 text-slate-950 font-serif font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
            >
              <span>{lang === 'bn' ? 'ভর্তি আবেদন' : 'Apply for Admission'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
