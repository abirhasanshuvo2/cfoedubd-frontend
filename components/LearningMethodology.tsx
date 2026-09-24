'use client';

import React from 'react';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
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
      color: 'bg-amber-100 text-[#966718]',
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
      color: 'bg-blue-100 text-blue-800',
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
      color: 'bg-emerald-100 text-emerald-800',
      tag: 'Senior Leadership'
    },
    {
      step: '০৪',
      title: 'বিটিইবি রেজিস্টার্ড ও বার্ষিক কনভোকেশন',
      titleEn: 'BTEB Recognized & Convocation',
      description:
        'বাংলাদেশ কারিগরি শিক্ষা বোর্ড (BTEB) নিবন্ধিত প্রফেশনাল ডিপ্লোমা এবং বার্ষিক বর্ণাঢ্য সমাবর্তনে (Convocation) সম্মানজনক সনদ প্রদান।',
      descriptionEn:
        'Government-recognized professional credentials with official transcripts and annual grand convocation ceremony.',
      icon: GraduationCap,
      color: 'bg-purple-100 text-purple-800',
      tag: 'Govt. Accredited'
    }
  ];

  return (
    <section id="methodology" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0A192F] text-[#E5A93C] border border-[#C8963E]/40 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C8963E]" />
            <span>{lang === 'bn' ? 'একাডেমিক উৎকর্ষ ও লার্নিং মেথডোলজি' : 'Executive Pedagogical Framework'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 tracking-tight">
            {lang === 'bn'
              ? 'কেন চার্টার্ড অফিসার লিমিটেডের প্রোগ্রামগুলো দেশে অদ্বিতীয়?'
              : 'Why Chartered Officer Limited Sets the Benchmark in Finance'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
            {lang === 'bn'
              ? 'বাস্তব করপোরেট পরিবেশের উপযোগী সিদ্ধান্ত গ্রহণ ক্ষমতা, এন্টারপ্রাইজ ইআরপি দক্ষতা এবং রেগুলেটরি কমপ্লায়েন্সে পেশাদারদের প্রস্তুত করার সমন্বিত ফ্রেমওয়ার্ক।'
              : 'Engineered specifically for corporate finance managers, controllers, accountants, and aspiring Chief Financial Officers.'}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-[#C8963E] p-6 flex flex-col justify-between transition-all duration-300 shadow-2xs hover:shadow-xl group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-serif font-black text-slate-300 group-hover:text-[#C8963E] transition-colors">
                      {p.step}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                      {p.tag}
                    </span>
                  </div>

                  <div className={`w-12 h-12 rounded-xl ${p.color} flex items-center justify-center mb-4 shadow-2xs`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 mb-2">
                    {lang === 'bn' ? p.title : p.titleEn}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {lang === 'bn' ? p.description : p.descriptionEn}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-bold text-[#966718]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'bn' ? 'সার্টিফাইড এক্সিলেন্স' : 'Certified Excellence'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Executive CTA Card */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0A192F] via-[#0D254C] to-[#0A192F] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-[#1E3A8A]">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-serif font-black text-white">
              {lang === 'bn' ? 'আপনার করপোরেট ক্যারিয়ারকে পরবর্তী ধাপে উন্নীত করুন' : 'Take the Leap into Corporate Boardrooms'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              {lang === 'bn'
                ? 'সিএফও ও পিজিডি ব্যাচসমূহে সীমিত আসনে সরাসরি আবেদন করুন।'
                : 'Limited seats available in upcoming batches. Register your application online.'}
            </p>
          </div>

          <Link
            href="/enroll-now?course=Chartered%20Financial%20Officer%20(CFO)"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 font-serif font-black text-xs sm:text-sm flex items-center gap-2 shrink-0 shadow-md transition-all cursor-pointer"
          >
            <span>{lang === 'bn' ? 'CFO প্রোগ্রাম ও ভর্তি ফর্ম' : 'Apply for CFO Program'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
