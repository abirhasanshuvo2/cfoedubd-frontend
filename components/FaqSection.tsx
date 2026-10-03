'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { FAQS } from '@/data/cfo-data';

interface FaqSectionProps {
  lang: 'bn' | 'en';
}

export default function FaqSection({ lang }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-20 bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-[#966718] dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-bold mb-3 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#C8963E]" />
            <span>{lang === 'bn' ? 'সাধারণ প্রশ্নোত্তর ও অ্যাকাডেমিক নিয়মাবলী' : 'Frequently Asked Questions'}</span>
          </span>

          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 dark:text-white tracking-tight">
            {lang === 'bn' ? 'সচরাচর জিজ্ঞাসিত প্রশ্নসমূহ' : 'Frequently Asked Questions'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            {lang === 'bn'
              ? 'চার্টার্ড অফিসার লিমিটেডের সিএফও প্রোগ্রাম, ক্লাস শিডিউল, কিস্তি সুবিধা ও সনদ সংক্রান্ত প্রয়োজনীয় তথ্য।'
              : 'Key details about CFO credentials, schedule, semester installments, and certifications.'}
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all shadow-2xs ${
                  isOpen
                    ? 'border-[#C8963E] bg-white dark:bg-slate-900 ring-1 ring-[#C8963E]/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span className="font-serif font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    {lang === 'bn' ? faq.question : faq.questionEn}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#C8963E]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    {lang === 'bn' ? faq.answer : faq.answerEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
