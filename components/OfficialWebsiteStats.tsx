'use client';

import React from 'react';
import {
  Users,
  Video,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  BookOpen,
  HelpCircle,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useCfo } from '@/context/CfoContext';

interface StatsSectionProps {
  lang: 'bn' | 'en';
}

export default function StatsSection({ lang }: StatsSectionProps) {
  const { systemInfo } = useCfo();

  // Dynamic values connected to API / system-information
  const sessionsVal = systemInfo.classes ? `${Number(systemInfo.classes).toLocaleString()}+` : '2,090+';
  const learnersVal = systemInfo.graduates ? `${Number(systemInfo.graduates).toLocaleString()}+` : '3,100+';
  const instructorsVal = systemInfo.students ? `${Number(systemInfo.students).toLocaleString()}+` : '50+';

  const stats = [
    {
      value: sessionsVal,
      label: lang === 'bn' ? 'সমাপ্ত সেশন' : 'Finished Sessions',
      desc: lang === 'bn' ? 'সরাসরি ইন্টারঅ্যাক্টিভ ক্লাস' : 'Live Interactive Classes',
      icon: Video,
    },
    {
      value: learnersVal,
      label: lang === 'bn' ? 'নিবন্ধিত শিক্ষার্থী' : 'Enrolled Learners',
      desc: lang === 'bn' ? 'কর্পোরেট পেশাদার ও গ্র্যাজুয়েট' : 'Professionals & Graduates',
      icon: Users,
    },
    {
      value: instructorsVal,
      label: lang === 'bn' ? 'অনলাইন প্রশিক্ষক' : 'Online Instructors',
      desc: lang === 'bn' ? 'অভিজ্ঞ ইন্ডাস্ট্রি এক্সপার্ট' : 'Practicing Industry Mentors',
      icon: GraduationCap,
    },
    {
      value: '95%',
      label: lang === 'bn' ? 'সন্তুষ্টির হার' : 'Satisfaction Rate',
      desc: lang === 'bn' ? 'শিক্ষার্থীদের ইতিবাচক ফিডব্যাক' : 'Learners Positive Feedback',
      icon: CheckCircle2,
    },
  ];

  const guarantees = [
    {
      tag: 'Industry Mentorship',
      tagBn: 'ইন্ডাস্ট্রি মেন্টরশিপ',
      title: 'Professional Instructors',
      titleBn: 'প্রফেশনাল ইন্সট্রাক্টরস',
      description:
        'Our faculty consists of experts with advanced degrees and real-world experience. They offer personalized mentorship and keep their teaching methods updated, ensuring you stay relevant in the ever-changing financial industry.',
      descriptionBn:
        'আমাদের ফ্যাকাল্টি মেম্বাররা উচ্চতর ডিগ্রিধারী এবং বাস্তব কর্মক্ষেত্রের অভিজ্ঞতাসম্পন্ন এক্সপার্ট। তারা নিয়মিত পাঠদান পদ্ধতি আপডেট রেখে ফাইন্যান্সিয়াল ইন্ডাস্ট্রির সমসাময়িক চাহিদায় শিক্ষার্থীদের প্রস্তুত করেন।',
      icon: GraduationCap,
      assurance: 'Quality Assured',
    },
    {
      tag: 'Concept Clarity',
      tagBn: 'কনসেপ্ট ক্ল্যারিটি',
      title: 'Quality Clarification',
      titleBn: 'কোয়ালিটি ক্ল্যারিফিকেশন',
      description:
        'We simplify complex financial topics into manageable modules. Utilizing multimedia resources, interactive discussions, and prompt query responses, we make sure you understand and can apply key financial concepts confidently.',
      descriptionBn:
        'আমরা জটিল ফাইন্যান্সিয়াল ও অ্যাকাউন্টিং বিষয়গুলোকে সহজ ও বাস্তবসম্মত মডিউলে উপস্থাপন করি। মাল্টিমিডিয়া রিসোর্স, সক্রিয় আলোচনা এবং দ্রুত প্রশ্নোত্তর ফিডব্যাকের মাধ্যমে কনসেপ্ট নিশ্চিত করা হয়।',
      icon: HelpCircle,
      assurance: 'Quality Assured',
    },
    {
      tag: 'Standard Alignment',
      tagBn: 'স্ট্যান্ডার্ড অ্যালাইনমেন্ট',
      title: 'Learn Best Practices',
      titleBn: 'লার্ন বেস্ট প্র্যাকটিসেস',
      description:
        'Our curriculum is aligned with current industry best practices. We frequently invite experts for guest lectures, providing you with practical insights and skills that differentiate you in the competitive financial market.',
      descriptionBn:
        'আমাদের কারিকুলাম বর্তমান আধুনিক গ্লোবাল ও লোকাল ইন্ডাস্ট্রির বেস্ট প্র্যাকটিসের সাথে সামঞ্জস্যপূর্ণ। নিয়মিত গেস্ট লেকচারের মাধ্যমে বাস্তব অন্তর্দৃষ্টি ও দক্ষতা অর্জন করে ক্যারিয়ারে এগিয়ে থাকুন।',
      icon: TrendingUp,
      assurance: 'Quality Assured',
    },
    {
      tag: '24/7 Platform Access',
      tagBn: '২৪/৭ প্ল্যাটফর্ম অ্যাক্সেস',
      title: 'Online Resources',
      titleBn: 'অনলাইন রিসোর্সেস',
      description:
        'Available 24/7, our online platform features a variety of educational materials such as e-books, webinars, and video tutorials. These resources are curated for accuracy and relevance, supporting flexible, self-paced learning.',
      descriptionBn:
        '২৪/৭ সার্বক্ষণিক আমাদের অনলাইন লার্নিং প্ল্যাটফর্মে ই-বুক, ওয়েবিনার ও ভিডিও টিউটোরিয়ালসহ প্রয়োজনীয় স্টাডি মেটেরিয়ালস অ্যাক্সেস করুন, যা নিজস্ব গতিতে শেখার সুবিধা দেয়।',
      icon: FileText,
      assurance: 'Quality Assured',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Real Live Platform Metrics */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-[#966718] dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C8963E]" />
              <span>{lang === 'bn' ? 'আমাদের অর্জনের পরিসংখ্যান' : 'Our Track Record'}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 dark:text-white tracking-tight">
              {lang === 'bn' ? 'লক্ষাধিক ঘণ্টার শিক্ষা ও প্রফেশনাল অগ্রগতি' : 'Empowering Learners Across Bangladesh'}
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850 hover:border-[#C8963E] transition-all text-center space-y-2 group shadow-2xs"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-[#C8963E] group-hover:scale-110 transition-transform shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-3xl sm:text-4xl font-serif font-black text-slate-900 dark:text-[#E5A93C] tracking-tight">
                    {s.value}
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {s.label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why Choose Us? • We Guarantee Section (Exact copy from cfoedubd.com) */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-[#0A192F] text-amber-900 dark:text-[#E5A93C] border border-amber-300 dark:border-[#C8963E]/40 text-xs font-bold mb-3 shadow-2xs">
              <BookOpen className="w-3.5 h-3.5 text-[#C8963E]" />
              <span>{lang === 'bn' ? 'কেন আমরা আলাদা? • আমাদের গ্যারান্টি' : 'Why Choose Us? • We Guarantee'}</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 dark:text-white tracking-tight">
              {lang === 'bn'
                ? 'Commitment to Excellence in Executive Learning'
                : 'Commitment to Excellence in Executive Learning'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              {lang === 'bn'
                ? 'Every course is designed to empower participants with boardroom skills, modern software, and direct applicability.'
                : 'Every course is designed to empower participants with boardroom skills, modern software, and direct applicability.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-[#C8963E] transition-all flex flex-col justify-between group shadow-2xs hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 flex items-center justify-center text-amber-800 dark:text-[#E5A93C] group-hover:bg-amber-100 dark:group-hover:bg-[#0A192F] group-hover:text-amber-900 dark:group-hover:text-[#E5A93C] transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#966718] dark:text-amber-300 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800">
                        {lang === 'bn' ? item.tagBn : item.tag}
                      </span>
                    </div>

                    <h4 className="text-base font-serif font-bold text-slate-900 dark:text-white group-hover:text-[#C8963E] transition-colors">
                      {lang === 'bn' ? item.titleBn : item.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {lang === 'bn' ? item.descriptionBn : item.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{item.assurance}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
