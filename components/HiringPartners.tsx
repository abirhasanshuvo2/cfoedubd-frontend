'use client';

import React from 'react';
import { HIRING_PARTNERS } from '@/data/cfo-data';
import { Building2, Award, Briefcase, TrendingUp, CheckCircle, ShieldCheck } from 'lucide-react';

interface HiringPartnersProps {
  lang: 'bn' | 'en';
}

export default function HiringPartners({ lang }: HiringPartnersProps) {
  return (
    <section id="corporate-alumni" className="py-16 sm:py-20 bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-[#0A192F] text-amber-900 dark:text-[#E5A93C] border border-amber-300 dark:border-[#C8963E]/40 text-xs font-bold mb-3 shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-[#C8963E]" />
            <span>{lang === 'bn' ? 'করপোরেট রিক্রুটমেন্ট ও অ্যালামনাই নেটওয়ার্ক' : 'Corporate Alumni & Employer Network'}</span>
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 dark:text-white tracking-tight">
            {lang === 'bn'
              ? 'শীর্ষস্থানীয় যেসকল গ্রুপ ও করপোরেটে আমাদের সিএফও ও অফিসাররা কর্মরত'
              : 'Where Chartered Officer Alumni Lead Across Bangladesh'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
            {lang === 'bn'
              ? 'বেক্সিমকো, স্কয়ার, ইউনিলিভার, গ্রামীণফোন, ব্র্যাক ব্যাংক ও সিটি ব্যাংকসহ দেশের শীর্ষস্থানীয় মাল্টিন্যাশনাল এবং শিল্পগ্রুপগুলোতে আমাদের গ্র্যাজুয়েটরা সিএফও, হেড অব ট্যাক্স, এফপিএ অ্যানালিস্ট ও অডিট ডিরেক্টর হিসেবে সফলভাবে দায়িত্ব পালন করছেন।'
              : 'Our Chartered Financial Officers and PGD graduates hold critical boardroom, treasury, tax, and SAP ERP roles at premier conglomerates and financial institutions.'}
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {HIRING_PARTNERS.map((partner, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#C8963E] shadow-2xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-[#0A192F] text-amber-900 dark:text-[#E5A93C] group-hover:bg-amber-100 dark:group-hover:bg-[#1E3A8A] flex items-center justify-center font-serif font-black text-sm mb-2 transition-colors border border-amber-200/80 dark:border-[#C8963E]/30">
                {partner.name.slice(0, 2).toUpperCase()}
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate w-full">
                {partner.name}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-full mt-0.5">
                {partner.role}
              </p>
              <span className="mt-2 text-[10px] font-bold text-[#966718] dark:text-amber-300 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800">
                {partner.count}
              </span>
            </div>
          ))}
        </div>

        {/* Career Placement Highlight Banner */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <p className="text-2xl sm:text-3xl font-serif font-black text-slate-900 dark:text-white">১৫০+</p>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
              {lang === 'bn' ? 'শীর্ষস্থানীয় করপোরেট নিয়োগকারী প্রতিষ্ঠান' : 'Corporate Hiring Partners'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <p className="text-2xl sm:text-3xl font-serif font-black text-[#C8963E]">৮৪০+</p>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
              {lang === 'bn' ? 'সার্টিফাইড চার্টার্ড ফাইন্যান্সিয়াল অফিসার' : 'Certified Chartered Financial Officers'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <p className="text-2xl sm:text-3xl font-serif font-black text-emerald-600 dark:text-emerald-400">৯৫%</p>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
              {lang === 'bn' ? 'শিক্ষার্থীদের ইতিবাচক সন্তুষ্টি' : 'Learners Satisfaction Rate'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
