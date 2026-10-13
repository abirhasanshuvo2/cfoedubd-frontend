'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronDown,
  HelpCircle,
  Search,
  BookOpen,
  Users,
  MonitorPlay,
  GraduationCap,
  Briefcase,
  Award,
  MessageCircleQuestion,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { FAQS } from '@/data/cfo-data';

interface FaqSectionProps {
  lang: 'bn' | 'en';
}

interface FaqItemData {
  id: string;
  category: string;
  categoryLabelBn: string;
  categoryLabelEn: string;
  question: string;
  questionEn: string;
  answer: string;
  answerEn: string;
}

const FALLBACK_FAQS: FaqItemData[] = [
  {
    id: 'faq-1',
    category: 'courses',
    categoryLabelBn: 'কোর্স ও কারিকুলাম',
    categoryLabelEn: 'Courses & Curriculum',
    question: 'CFOEDUBD-তে কী কী কোর্স অফার করা হয়?',
    questionEn: 'What courses do you offer at CFOEDUBD?',
    answer: 'আমরা চার্টার্ড ফাইন্যান্সিয়াল অফিসার (CFO), ভ্যাট ও ট্যাক্স (VAT & Tax), হিউম্যান রিসোর্স ম্যানেজমেন্ট (HRM), সাপ্লাই চেইন ম্যানেজমেন্ট (SCM) এবং ফাইন্যান্সিয়াল টেকনোলজি (FinTech)-এর মতো প্রফেশনাল ক্যারিয়ার ট্র্যাক ও এক্সিকিউটিভ প্রোগ্রাম অফার করে থাকি।',
    answerEn: 'We offer a range of courses covering traditional and modern corporate topics like Chartered Financial Officer (CFO), VAT & TAX, Human Resource Management (HRM), Supply Chain Management (SCM), and Financial Technology (FinTech).',
  },
  {
    id: 'faq-2',
    category: 'instructors',
    categoryLabelBn: 'প্রশিক্ষক ও মেন্টর',
    categoryLabelEn: 'Instructors & Mentors',
    question: 'প্রশিক্ষক কারা?',
    questionEn: 'Who are the instructors?',
    answer: 'আমাদের প্রশিক্ষকবৃন্দ স্ব-স্ব ক্ষেত্রে ১০+ বছরের অভিজ্ঞতাসম্পন্ন শীর্ষস্থানীয় কর্পোরেট প্রফেশনাল, লিডিং এমএনসি ও ব্যাংকিং এক্সিকিউটিভ। তাঁরা বাস্তব জীবনের কেস স্টাডি, প্র্যাকটিকাল এক্সেল মডেল ও রিয়েল-ওয়ার্ল্ড ট্যাক্স ফাইলিং ক্লাসরুমে তুলে ধরেন।',
    answerEn: 'Our instructors are industry professionals with extensive experience in their respective fields. They bring real-world insights into the classroom, ensuring a practical and relevant learning experience.',
  },
  {
    id: 'faq-3',
    category: 'online',
    categoryLabelBn: 'অনলাইন ও লাইভ ক্লাস',
    categoryLabelEn: 'Online & Live Sessions',
    question: 'আপনারা কি অনলাইন কোর্স পরিচালনা করেন?',
    questionEn: 'Do you offer online courses?',
    answer: 'হ্যাঁ, শিক্ষার্থীদের সুবিধার কথা বিবেচনা করে আমরা সরাসরি ইন্টারেক্টিভ লাইভ অনলাইন ও ইন-পার্সন উভয় মাধ্যমেই ক্লাস পরিচালনা করি। প্রতিটি লাইভ ক্লাসের হাই-ডেফিনিশন রেকর্ডিং ও লেকচার নোটস স্টুডেন্ট এলএমএস পোর্টালে সারাজীবনের জন্য সংরক্ষিত থাকে।',
    answerEn: 'Yes, we offer both in-person and online courses to cater to the diverse needs of our students. Our online platform is interactive and features live sessions, ensuring a comprehensive learning experience.',
  },
  {
    id: 'faq-4',
    category: 'prerequisites',
    categoryLabelBn: 'যোগ্যতা ও পূর্বশর্ত',
    categoryLabelEn: 'Prerequisites & Eligibility',
    question: 'ভর্তির জন্য পূর্বশর্ত কী কী?',
    questionEn: 'What are the prerequisites for enrolling?',
    answer: 'কোর্স ভেদে পূর্বশর্ত কিছুটা ভিন্ন হয় যা প্রতিটি কোর্সের বিস্তারিত পৃষ্ঠায় উল্লেখ থাকে। সাধারণত ফিন্যান্স বা সংশ্লিষ্ট ক্ষেত্রে প্রাথমিক ধারণা থাকলেই অংশগ্রহণ করা যায়। কোনো পূর্ববর্তী কোডিং জ্ঞানের প্রয়োজন নেই।',
    answerEn: 'Prerequisites vary by course and are specified on the course description page. Generally, a foundational understanding of finance or a related field is recommended.',
  },
  {
    id: 'faq-5',
    category: 'corporate',
    categoryLabelBn: 'কর্পোরেট ট্রেনিং',
    categoryLabelEn: 'Corporate Training',
    question: 'আপনারা কি করপোরেট ট্রেনিং প্রদান করেন?',
    questionEn: 'Do you offer corporate training?',
    answer: 'হ্যাঁ, ফিন্যান্স এবং ফিনটেক ক্ষেত্রে কর্মীদের দক্ষতা বৃদ্ধির লক্ষ্যে আমরা বিভিন্ন প্রতিষ্ঠানের জন্য কাস্টমাইজড ট্রেনিং সল্যুশন, অন-সাইট ওয়ার্কশপ এবং কর্পোরেট আপস্কিলিং প্রোগ্রাম প্রদান করে থাকি।',
    answerEn: 'Yes, we provide tailor-made training solutions for organizations looking to upskill their workforce in finance, compliance, and FinTech.',
  },
  {
    id: 'faq-6',
    category: 'certification',
    categoryLabelBn: 'সার্টিফিকেট ও স্বীকৃতি',
    categoryLabelEn: 'Certification',
    question: 'কোর্স সম্পন্ন করার পর কি ভেরিফায়েড সার্টিফিকেট দেওয়া হয়?',
    questionEn: 'Will I receive a verified certificate after completing the course?',
    answer: 'হ্যাঁ, প্রতিটি কোর্স এবং ক্যাপস্টোন প্রজেক্ট শেষ করার পর ডিজিটাল কিউআর কোড এবং ইউনিক ভেরিফিকেশন আইডি সম্বলিত প্রাতিষ্ঠানিক সার্টিফিকেট প্রদান করা হয়, যা লিঙ্কডইন এবং রিজিউমে যুক্ত করার উপযোগী।',
    answerEn: 'Yes, after completing the course modules and capstone projects, students receive a verified digital certificate with a verifiable credential ID and QR code.',
  },
];

const CATEGORIES = [
  { id: 'all', labelBn: 'সব প্রশ্ন', labelEn: 'All Questions', icon: HelpCircle },
  { id: 'courses', labelBn: 'কোর্স ও সিলেবাস', labelEn: 'Courses', icon: BookOpen },
  { id: 'instructors', labelBn: 'প্রশিক্ষকবৃন্দ', labelEn: 'Instructors', icon: Users },
  { id: 'online', labelBn: 'অনলাইন ক্লাস', labelEn: 'Online Classes', icon: MonitorPlay },
  { id: 'prerequisites', labelBn: 'ভর্তির যোগ্যতা', labelEn: 'Prerequisites', icon: GraduationCap },
  { id: 'corporate', labelBn: 'কর্পোরেট ট্রেনিং', labelEn: 'Corporate', icon: Briefcase },
  { id: 'certification', labelBn: 'সার্টিফিকেশন', labelEn: 'Certificates', icon: Award },
];

export default function FaqSection({ lang }: FaqSectionProps) {
  const [faqsList, setFaqsList] = useState<FaqItemData[]>(FALLBACK_FAQS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch dynamic FAQs from the API endpoint
  useEffect(() => {
    let isMounted = true;
    async function loadFaqs() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/faqs');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
            setFaqsList(json.data);
          }
        }
      } catch (err) {
        // Fallback to FALLBACK_FAQS seamlessly
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadFaqs();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  // Filtered FAQs based on dynamic criteria
  const filteredFaqs = useMemo(() => {
    return faqsList.filter((item) => {
      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      if (!matchCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.question.toLowerCase().includes(q) ||
        item.questionEn.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.answerEn.toLowerCase().includes(q)
      );
    });
  }, [faqsList, activeCategory, searchQuery]);

  return (
    <section id="faqs" className="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Badge & Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-[#966718] dark:text-amber-300 border border-amber-300/80 dark:border-amber-800 text-xs font-bold mb-3 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#C8963E]" />
            <span>{lang === 'bn' ? 'সাধারণ প্রশ্নোত্তর ও অ্যাকাডেমিক নিয়মাবলী' : 'Frequently Asked Questions'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-black text-slate-900 dark:text-white tracking-tight">
            {lang === 'bn' ? 'সচরাচর জিজ্ঞাসিত প্রশ্নসমূহ' : 'Frequently Asked Questions'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2.5 max-w-2xl mx-auto leading-relaxed">
            {lang === 'bn'
              ? 'CFOEDUBD-এর কোর্স, প্রশিক্ষক, অনলাইন ক্লাস, পূর্বশর্ত ও করপোরেট ট্রেনিং সংক্রান্ত প্রয়োজনীয় তথ্য।'
              : 'Essential details about CFOEDUBD courses, instructors, online sessions, prerequisites, and corporate training.'}
          </p>
        </div>

        {/* Live Search & Filter Bar */}
        <div className="mb-6 space-y-4">
          <div className="relative max-w-lg mx-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'bn'
                  ? 'প্রশ্ন খুঁজুন (যেমন: কোর্স, প্রশিক্ষক, সার্টিফিকেট, ফি)...'
                  : 'Search question (e.g. courses, instructors, online, fee)...'
              }
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setOpenIndex(0);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C8963E] text-slate-950 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{lang === 'bn' ? cat.labelBn : cat.labelEn}</span>
                </button>
              );
            })}
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
                        {lang === 'bn' ? faq.question : faq.questionEn}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 dark:text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#C8963E]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-950/20">
                      {lang === 'bn' ? faq.answer : faq.answerEn}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-2">
              <MessageCircleQuestion className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {lang === 'bn' ? 'কোনো প্রশ্ন পাওয়া যায়নি।' : 'No matching questions found.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="text-xs text-amber-600 dark:text-amber-400 font-bold underline cursor-pointer"
              >
                {lang === 'bn' ? 'সব প্রশ্ন দেখতে রিসেট করুন' : 'Reset filter'}
              </button>
            </div>
          )}
        </div>

        {/* Dynamic "Still Have Questions?" Support Card */}
        <div className="mt-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-400/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#C8963E] text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === 'bn' ? 'অন্য কোনো প্রশ্ন আছে বা পরামর্শ চান?' : 'Have more questions or need career guidance?'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {lang === 'bn'
                  ? 'আমাদের ক্যারিয়ার কাউন্সিলরদের সাথে সরাসরি কথা বলুন।'
                  : 'Speak directly with our senior admission counselors.'}
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/8801700000000"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity shrink-0 cursor-pointer shadow-xs"
          >
            {lang === 'bn' ? 'কাউন্সিলরের সাথে কথা বলুন' : 'Talk to Counselor'}
          </a>
        </div>
      </div>
    </section>
  );
}
