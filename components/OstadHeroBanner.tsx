'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Briefcase,
  Award,
  ShieldCheck,
  Globe,
  Tv
} from 'lucide-react';
import { useCfo } from '@/context/CfoContext';

interface OstadHeroBannerProps {
  onStartLearning?: () => void;
}

export default function OstadHeroBanner({ onStartLearning }: OstadHeroBannerProps) {
  const { lang } = useCfo();

  const handleStartLearning = () => {
    if (onStartLearning) {
      onStartLearning();
    } else {
      const el = document.getElementById('all-courses-section') || document.getElementById('courses-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-2">
      {/* Sleek, Compact Card Container with Soft Mint-Cyan Ambient Gradient */}
      <div className="relative rounded-2xl sm:rounded-3xl border border-[#D5E7DF] dark:border-slate-800 bg-gradient-to-r from-[#EBF7F2] via-[#F4FAF8] to-[#EAF3F9] dark:from-[#0B192C] dark:via-[#0F223D] dark:to-[#0A172A] p-4 sm:p-5 lg:p-6 shadow-sm overflow-hidden transition-colors">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center">
          
          {/* Left Column: Compact Headline, Subtitle and CTAs (No bulky Allies block) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-3.5 sm:space-y-4">
            
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-[11px] font-bold text-emerald-900 dark:text-emerald-300 w-fit shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>
                {lang === 'bn'
                  ? 'চার্টার্ড অফিসার লিমিটেড (COL) • RJSC ও BTEB অনুমোদিত'
                  : 'Chartered Officer Limited (COL) • RJSC & BTEB Registered'}
              </span>
            </div>

            {/* Main Slogan Headline: বাংলাদেশ শিখবে লাইভে 🔴 */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 dark:text-white flex flex-wrap items-center gap-2 leading-tight">
              <span>{lang === 'bn' ? 'বাংলাদেশ শিখবে' : 'Bangladesh Will Learn'}</span>
              <span className="text-[#E62E2D] dark:text-[#FF4D4D] inline-flex items-center gap-1.5">
                <span>{lang === 'bn' ? 'লাইভে' : 'Live'}</span>
                <span className="inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#E62E2D] dark:bg-[#FF4D4D] animate-pulse shadow-sm" />
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-xs sm:text-sm lg:text-base font-bold text-slate-800 dark:text-slate-200 leading-snug">
              {lang === 'bn'
                ? 'সিএফও ও ফাইন্যান্সিয়াল স্কিল শেখার মাধ্যমে বদলে ফেলুন নিজের ভবিষ্যৎ'
                : 'Transform your future by mastering CFO & corporate finance skills live'}
            </p>

            {/* Concise Course Description */}
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              {lang === 'bn'
                ? 'ফেলো চার্টার্ড অ্যাকাউন্ট্যান্টস (FCA, FCMA) ও করপোরেট সিএফওদের সাথে ১-বছর মেয়াদি চার্টার্ড CFO প্রোগ্রাম, ভ্যাট ও ট্যাক্সেশন ২০২৩ এবং SAP-FICO ERP ল্যাব।'
                : '1-Year Chartered Financial Officer (CFO) program, SAP-FICO ERP lab & New Tax Act 2023 with FCA/FCMA Fellows.'}
            </p>

            {/* Action Buttons: Compact & Clean */}
            <div className="pt-1 flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleStartLearning}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg bg-[#FFC000] hover:bg-[#E6AC00] active:scale-95 text-slate-950 font-black text-xs sm:text-sm shadow-sm transition-all cursor-pointer font-sans"
              >
                <span>{lang === 'bn' ? 'শেখা শুরু করুন' : 'Start Learning'}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.8]" />
              </button>

              <Link
                href="/enroll-now?course=Chartered%20Financial%20Officer%20(CFO)"
                className="inline-flex items-center gap-1 px-4 py-2.5 sm:py-3 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold text-xs shadow-2xs transition-all"
              >
                <Award className="w-3.5 h-3.5 text-[#C8963E]" />
                <span>{lang === 'bn' ? 'অনলাইন ভর্তি ফরম' : 'Apply for CFO'}</span>
              </Link>

              <Link
                href="/certificates"
                className="inline-flex items-center gap-1 px-3.5 py-2.5 sm:py-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 font-semibold text-xs transition-all"
              >
                <span>{lang === 'bn' ? 'সনদ যাচাই' : 'Verify'}</span>
              </Link>
            </div>

            {/* In Association with (Compact single row) */}
            <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider shrink-0">
                  {lang === 'bn' ? 'সহযোগিতায় (In Association with):' : 'In Association with:'}
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Bizz Career */}
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-teal-400 transition-colors">
                    <Globe className="w-3 h-3 text-[#0099A8]" />
                    <span className="text-[10px] font-black text-[#0099A8]">Bizz Career</span>
                  </div>

                  {/* BizzNews */}
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-red-400 transition-colors">
                    <span className="text-[10px] font-black text-[#D92525]">BIZZ<span className="text-slate-900 dark:text-white">NEWS</span></span>
                  </div>

                  {/* Daffodil Education Network */}
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-sky-400 transition-colors">
                    <div className="w-2.5 h-2.5 rounded-full border border-emerald-500 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-sky-500" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-800 dark:text-slate-200 font-sans">daffodil edu</span>
                  </div>

                  {/* Edu tv */}
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-orange-400 transition-colors">
                    <Tv className="w-3 h-3 text-orange-500" />
                    <span className="text-[9px] font-black text-slate-900 dark:text-white">Edu <span className="text-orange-500">tv</span></span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Compact Executive CFO Card */}
          <div className="lg:col-span-5 h-full">
            <div className="relative rounded-xl overflow-hidden bg-[#0A0F1D] border border-slate-800/80 shadow-md group min-h-[190px] sm:min-h-[210px] lg:min-h-[220px] flex items-center">
              
              {/* Executive Boardroom Artwork with Mask */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/assets/images/cfo_executive_banner.jpg"
                  alt="Chartered Financial Officer Program - CFO Education Bangladesh"
                  fill
                  className="object-cover object-right opacity-85 transition-transform duration-700 group-hover:scale-105"
                  priority
                  referrerPolicy="no-referrer"
                />
                {/* Gradient overlay for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#070C16] via-[#070C16]/85 to-transparent z-10 w-[70%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070C16]/90 via-transparent to-transparent z-10" />
              </div>

              {/* Text Overlay: Compact & Punchy */}
              <div className="relative z-20 p-4 sm:p-5 flex flex-col justify-center max-w-[72%]">
                
                {/* Compact Orange Badge */}
                <div className="mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FF7A00] text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-sm">
                    <Briefcase className="w-3 h-3 stroke-[2.5]" />
                    CFO Executive
                  </span>
                </div>

                {/* Typography */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 text-base sm:text-lg font-black text-white tracking-tight">
                    <span>{lang === 'bn' ? 'ফাইন্যান্স শিখে' : 'Master Finance'}</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  </div>
                  
                  <div className="text-base sm:text-lg font-black text-white tracking-tight">
                    <span>{lang === 'bn' ? 'ক্যারিয়ার হবে' : 'Career Becomes'}</span>
                  </div>

                  <div className="text-xl sm:text-2xl font-black text-[#FFB800] tracking-tight">
                    <span>{lang === 'bn' ? 'বোর্ডরুম রেডি' : 'Boardroom Ready'}</span>
                  </div>
                </div>

                {/* Compact Supporting Info */}
                <div className="mt-2.5 pt-2 border-t border-slate-700/60 text-[10px] text-slate-300 font-medium leading-tight space-y-0.5">
                  <p className="text-amber-300 font-semibold truncate">
                    {lang === 'bn' ? '১-বছর মেয়াদি চার্টার্ড CFO প্রোগ্রাম' : '1-Year Chartered CFO Program'}
                  </p>
                  <p className="text-slate-400 truncate">
                    {lang === 'bn' ? 'সিটি সেন্টার লেভেল-২৫, মতিঝিল' : 'City Centre Level-25, Motijheel'}
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
