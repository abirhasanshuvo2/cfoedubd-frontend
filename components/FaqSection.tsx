'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  MessageSquareQuote
} from 'lucide-react';
import { useCfo } from '@/context/CfoContext';

interface FaqSectionProps {
  lang: 'bn' | 'en';
}

interface DynamicFaqItem {
  id: string | number;
  question: string;
  answer: string;
}

export default function FaqSection({ lang }: FaqSectionProps) {
  const { systemInfo } = useCfo();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Purely dynamic FAQ items from system information / API
  const dynamicFaqs: DynamicFaqItem[] = useMemo(() => {
    const items = systemInfo?.faq?.items;
    if (Array.isArray(items) && items.length > 0) {
      return items
        .filter((it) => it && (it.question?.trim() || it.answer?.trim()))
        .map((it, idx) => ({
          id: it.id ?? idx + 1,
          question: it.question?.trim() || '',
          answer: it.answer?.trim() || '',
        }));
    }
    return [];
  }, [systemInfo?.faq?.items]);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const phone = systemInfo?.phone || '+880 1713378787';
  const email = systemInfo?.email || 'cfoedubd@gmail.com';
  const address = systemInfo?.address || 'City Centre 90/1, Level-25 (Lift-26), Motijheel C/A, Dhaka-1000';

  return (
    <section
      id="faqs"
      className="py-20 sm:py-28 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-14 xl:gap-20 items-start">
          
          {/* Left Column: Editorial Headline & Executive Support Desk */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 mb-12 lg:mb-0">
            {/* Subtle Unboxed Kicker */}
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-0.5 bg-[#C8963E]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#966718] dark:text-[#DFB257]">
                {lang === 'bn' ? 'সাধারণ জিজ্ঞাসা' : 'CLARITY & DETAILS'}
              </span>
            </div>

            {/* Clean Section Title */}
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-serif font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              {lang === 'bn' ? 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী' : 'Frequently Asked Questions'}
            </h2>

            {/* Executive Subtitle */}
            <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'চার্টার্ড অফিসার লিমিটেডের প্রফেশনাল কারিকুলাম, ক্লাস শিডিউল, সার্টিফিকেশন এবং অ্যাডমিশন সংক্রান্ত প্রয়োজনীয় তথ্যাবলী।'
                : 'Essential information regarding our professional cohorts, executive training modules, corporate prerequisites, and certifications.'}
            </p>

            {/* Support Desk Card */}
            <div className="mt-8 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                <MessageSquareQuote className="w-4 h-4 text-[#C8963E]" />
                <span>{lang === 'bn' ? 'বিশেষ কোনো প্রশ্ন আছে?' : 'Need personalized assistance?'}</span>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === 'bn'
                  ? 'আমাদের অ্যাকাডেমিক অ্যাডভাইজরি টিম সরাসরি আপনার প্রশ্নের উত্তর ও সঠিক কোর্স নির্বাচনে সহায়তায় প্রস্তুত।'
                  : 'Our academic advisory desk is available to assist with batch enrollment, customized corporate training, and syllabus details.'}
              </p>

              {/* Direct Contact Links */}
              <div className="mt-5 space-y-2.5 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-xs">
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-[#966718] dark:hover:text-[#DFB257] transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-[#966718] dark:text-[#DFB257] flex items-center justify-center shrink-0 group-hover:bg-[#C8963E] group-hover:text-slate-950 transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold">{phone}</span>
                </a>

                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-[#966718] dark:hover:text-[#DFB257] transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-[#966718] dark:text-[#DFB257] flex items-center justify-center shrink-0 group-hover:bg-[#C8963E] group-hover:text-slate-950 transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold truncate">{email}</span>
                </a>

                <div className="flex items-start gap-3 text-slate-500 dark:text-slate-400 pt-1">
                  <div className="w-7 h-7 rounded-lg bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-snug text-[11px] sm:text-xs">{address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic FAQ List */}
          <div className="lg:col-span-7">
            {dynamicFaqs.length > 0 ? (
              <div className="space-y-4">
                {dynamicFaqs.map((faq, idx) => {
                  const isOpen = openIndex === idx;
                  return (
                    <div
                      key={faq.id || idx}
                      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isOpen
                          ? 'border-[#C8963E]/70 dark:border-[#C8963E]/60 bg-amber-50/20 dark:bg-slate-900/90 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800/90 bg-white dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full py-5 px-6 text-left flex items-start justify-between gap-4 cursor-pointer transition-colors"
                        aria-expanded={isOpen}
                      >
                        <span className="font-serif font-bold text-slate-900 dark:text-white text-base sm:text-lg leading-snug">
                          {faq.question}
                        </span>

                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-transform duration-200 ${
                            isOpen
                              ? 'bg-[#C8963E] text-slate-950 rotate-180'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-amber-200/40 dark:border-slate-800/80 whitespace-pre-line">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-900/30">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  {lang === 'bn'
                    ? 'কোনো প্রশ্নোত্তর পাওয়া যায়নি।'
                    : 'No dynamic questions found.'}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
