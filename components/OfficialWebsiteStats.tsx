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

interface StatsSectionProps {
  lang: 'bn' | 'en';
}

export default function StatsSection({ lang }: StatsSectionProps) {
  const stats = [
    {
      value: '2,090+',
      label: lang === 'bn' ? 'সমাপ্ত সেশন' : 'Finished Sessions',
      desc: lang === 'bn' ? 'সরাসরি ইন্টারঅ্যাক্টিভ ক্লাস' : 'Live Interactive Classes',
      icon: Video,
      color: 'from-amber-500 to-amber-600',
    },
    {
      value: '3,100+',
      label: lang === 'bn' ? 'নিবন্ধিত শিক্ষার্থী' : 'Enrolled Learners',
      desc: lang === 'bn' ? 'কর্পোরেট পেশাদার ও গ্র্যাজুয়েট' : 'Professionals & Graduates',
      icon: Users,
      color: 'from-[#C8963E] to-[#B8860B]',
    },
    {
      value: '50+',
      label: lang === 'bn' ? 'অনলাইন প্রশিক্ষক' : 'Online Instructors',
      desc: lang === 'bn' ? 'অভিজ্ঞ ইন্ডাস্ট্রি এক্সপার্ট' : 'Practicing Industry Mentors',
      icon: GraduationCap,
      color: 'from-blue-600 to-blue-700',
    },
    {
      value: '95%',
      label: lang === 'bn' ? 'সন্তুষ্টির হার' : 'Satisfaction Rate',
      desc: lang === 'bn' ? 'শিক্ষার্থীদের ইতিবাচক ফিডব্যাক' : 'Learners Positive Feedback',
      icon: CheckCircle2,
      color: 'from-emerald-600 to-emerald-700',
    },
  ];

  const guarantees = [
    {
      title: lang === 'bn' ? 'প্রফেশনাল ইন্সট্রাক্টর' : 'Professional Instructors',
      description:
        lang === 'bn'
          ? 'আমাদের ফ্যাকাল্টি মেম্বাররা উচ্চতর ডিগ্রিধারী এবং বাস্তব কর্মক্ষেত্রের অভিজ্ঞতাসম্পন্ন এক্সপার্ট। তারা নিয়মিত পাঠদান পদ্ধতি আপডেট রেখে ফাইন্যান্সিয়াল ইন্ডাস্ট্রির সমসাময়িক চাহিদায় শিক্ষার্থীদের প্রস্তুত করেন।'
          : 'Our faculty consists of experts with advanced degrees and real-world experience. They offer personalized mentorship and keep their teaching methods updated, ensuring you stay relevant in the ever-changing financial industry.',
      icon: GraduationCap,
      tag: lang === 'bn' ? 'ইন্ডাস্ট্রি মেন্টরশিপ' : 'Industry Mentorship'
    },
    {
      title: lang === 'bn' ? 'কোয়ালিটি ক্ল্যারিফিকেশন' : 'Quality Clarification',
      description:
        lang === 'bn'
          ? 'আমরা জটিল ফাইন্যান্সিয়াল ও অ্যাকাউন্টিং বিষয়গুলোকে সহজ ও বাস্তবসম্মত মডিউলে উপস্থাপন করি। মাল্টিমিডিয়া রিসোর্স, সক্রিয় আলোচনা এবং দ্রুত প্রশ্নোত্তর ফিডব্যাকের মাধ্যমে কনসেপ্ট নিশ্চিত করা হয়।'
          : 'We simplify complex financial topics into manageable modules. Utilizing multimedia resources, interactive discussions, and prompt query responses, we make sure you understand and can apply key financial concepts confidently.',
      icon: HelpCircle,
      tag: lang === 'bn' ? 'সহজ উপস্থাপন' : 'Concept Clarity'
    },
    {
      title: lang === 'bn' ? 'লার্ন বেস্ট প্র্যাকটিসেস' : 'Learn Best Practices',
      description:
        lang === 'bn'
          ? 'আমাদের কারিকুলাম বর্তমান আধুনিক গ্লোবাল ও লোকাল ইন্ডাস্ট্রির বেস্ট প্র্যাকটিসের সাথে সামঞ্জস্যপূর্ণ। নিয়মিত গেস্ট লেকচারের মাধ্যমে বাস্তব অন্তর্দৃষ্টি ও দক্ষতা অর্জন করে ক্যারিয়ারে এগিয়ে থাকুন।'
          : 'Our curriculum is aligned with current industry best practices. We frequently invite experts for guest lectures, providing you with practical insights and skills that differentiate you in the competitive financial market.',
      icon: TrendingUp,
      tag: lang === 'bn' ? 'সেরা কর্মপদ্ধতি' : 'Standard Alignment'
    },
    {
      title: lang === 'bn' ? 'অনলাইন রিসোর্সেস' : 'Online Resources',
      description:
        lang === 'bn'
          ? '২৪/৭ সার্বক্ষণিক আমাদের অনলাইন লার্নিং প্ল্যাটফর্মে ই-বুক, ওয়েবিনার ও ভিডিও টিউটোরিয়ালসহ প্রয়োজনীয় স্টাডি মেটেরিয়ালস অ্যাক্সেস করুন, যা নিজস্ব গতিতে শেখার সুবিধা দেয়।'
          : 'Available 24/7, our online platform features a variety of educational materials such as e-books, webinars, and video tutorials. These resources are curated for accuracy and relevance, supporting flexible, self-paced learning.',
      icon: FileText,
      tag: lang === 'bn' ? '২৪/৭ অ্যাক্সেস' : '24/7 Platform Access'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Real Live Platform Metrics */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#966718] border border-amber-200 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C8963E]" />
              <span>{lang === 'bn' ? 'আমাদের অর্জনের পরিসংখ্যান' : 'Our Live Track Record'}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
              {lang === 'bn' ? 'লক্ষাধিক ঘণ্টার শিক্ষা ও প্রফেশনাল অগ্রগতি' : 'Empowering Learners Across Bangladesh'}
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 hover:border-[#C8963E] transition-all text-center space-y-2 group shadow-2xs"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#C8963E] group-hover:scale-110 transition-transform shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-3xl sm:text-4xl font-serif font-black text-[#0A192F] tracking-tight">
                    {s.value}
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {s.label}
                  </p>
                  <p className="text-xs text-slate-500">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why Choose Us / We Guarantee Section from Official cfoedubd.com */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A192F] text-[#E5A93C] border border-[#C8963E]/40 text-xs font-bold mb-3">
              <BookOpen className="w-3.5 h-3.5 text-[#C8963E]" />
              <span>{lang === 'bn' ? 'কেন আমরা আলাদা? • আমাদের প্রতিশ্রুতি' : 'Why Choose Us? • We Guarantee'}</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
              {lang === 'bn'
                ? 'মানসম্মত শিক্ষা ও ক্যারিয়ার উপযোগী প্রফেশনাল প্রস্তুতি'
                : 'Commitment to Excellence in Executive Learning'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              {lang === 'bn'
                ? 'সিএফও এডুকেশন বাংলাদেশের প্রতিটি কোর্স আধুনিক চাহিদা ও বাস্তবমুখী কার্যপদ্ধতি অনুযায়ী পরিচালিত হয়।'
                : 'Every course is designed to empower participants with boardroom skills, modern software, and direct applicability.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#C8963E] transition-all flex flex-col justify-between group shadow-2xs hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0A192F] group-hover:bg-[#0A192F] group-hover:text-[#E5A93C] transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#966718] px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                        {item.tag}
                      </span>
                    </div>

                    <h4 className="text-base font-serif font-bold text-slate-900 group-hover:text-[#C8963E] transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'bn' ? '১০০% নিশ্চিত মান' : 'Quality Assured'}</span>
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
