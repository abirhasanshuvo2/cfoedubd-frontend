'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  HelpCircle,
  Search,
  MessageCircleQuestion,
  PhoneCall,
  Sparkles
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Exclusively use dynamic questions provided from systemInfo (loaded via backend/system-information)
  const dynamicFaqs: DynamicFaqItem[] = useMemo(() => {
    const items = systemInfo?.faq?.items;
    if (Array.isArray(items) && items.length > 0) {
      return items.map((it, idx) => ({
        id: it.id ?? idx + 1,
        question: it.question?.trim() || '',
        answer: it.answer?.trim() || '',
      })).filter(it => it.question.length > 0);
    }
    return [];
  }, [systemInfo?.faq?.items]);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  // Filter dynamic FAQs based on search
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return dynamicFaqs;
    const q = searchQuery.toLowerCase().trim();
    return dynamicFaqs.filter((item) => {
      const question = item.question.toLowerCase();
      const answer = item.answer.toLowerCase();
      return question.includes(q) || answer.includes(q);
    });
  }, [dynamicFaqs, searchQuery]);

  // Dynamic titles and subtitles from systemInfo
  const dynamicSectionTitle =
    systemInfo?.faq?.title?.trim() ||
    (lang === 'bn' ? 'সচরাচর জিজ্ঞাসিত প্রশ্নসমূহ' : 'Frequently Asked Questions');

  const dynamicSectionSubtitle =
    systemInfo?.faq?.subtitle?.trim() ||
    (lang === 'bn'
      ? 'প্রয়োজনীয় প্রশ্নোত্তর ও তথ্যাবলী'
      : 'Frequently asked questions and answers.');

  return (
    <section id="faqs" className="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Badge & Dynamic Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-[#966718] dark:text-amber-300 border border-amber-300/80 dark:border-amber-800 text-xs font-bold mb-3 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#C8963E]" />
            <span>
              {lang === 'bn'
                ? 'সচরাচর জিজ্ঞাসিত প্রশ্নসমূহ'
                : 'Frequently Asked Questions'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-black text-slate-900 dark:text-white tracking-tight">
            {dynamicSectionTitle}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2.5 max-w-2xl mx-auto leading-relaxed">
            {dynamicSectionSubtitle}
          </p>
        </div>

        {/* Live Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-lg mx-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'bn'
                  ? 'প্রশ্ন খুঁজুন...'
                  : 'Search questions...'
              }
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer font-bold"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.id || idx}
                  className={`rounded-2xl border transition-all duration-200 shadow-2xs overflow-hidden ${
                    isOpen
                      ? 'border-[#C8963E] bg-white dark:bg-slate-900 ring-1 ring-[#C8963E]/30'
                      : 'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4.5 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-serif font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 dark:text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#C8963E]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-950/20 whitespace-pre-line">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-2">
              <MessageCircleQuestion className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {lang === 'bn' ? 'কোনো প্রশ্ন পাওয়া যায়নি।' : 'No questions found.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-amber-600 dark:text-amber-400 font-bold underline cursor-pointer"
                >
                  {lang === 'bn' ? 'সব প্রশ্ন দেখতে রিসেট করুন' : 'Reset search filter'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Support Contact Card */}
        <div className="mt-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-400/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#C8963E] text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === 'bn' ? 'আরও কোনো প্রশ্ন বা জিজ্ঞাসা আছে?' : 'Still have specific questions?'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {lang === 'bn'
                  ? `আমাদের অ্যাডমিশন ও কাউন্সেলিং টিম সার্বক্ষণিক সহায়তায় প্রস্তুত: ${systemInfo?.phone || '+880 1713378787'}`
                  : `Our team is ready to assist you: ${systemInfo?.phone || '+880 1713378787'}`}
              </p>
            </div>
          </div>
          <a
            href={`tel:${systemInfo?.phone || '+8801713378787'}`}
            className="px-4 py-2.5 rounded-xl bg-[#C8963E] hover:bg-[#b08332] text-slate-950 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-2xs"
          >
            <span>{lang === 'bn' ? 'সরাসরি কল করুন' : 'Call Support'}</span>
            <Sparkles className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
