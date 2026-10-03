'use client';

import React from 'react';
import {
  Users,
  Video,
  CheckCircle2,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useCfo } from '@/context/CfoContext';

interface StatsSectionProps {
  lang: 'bn' | 'en';
}

export default function StatsSection({ lang }: StatsSectionProps) {
  const { systemInfo } = useCfo();

  // Dynamic values connected to API / system-information with standard fallbacks
  const sessionsVal = systemInfo.classes ? `${Number(systemInfo.classes).toLocaleString()}+` : '2,090+';
  const learnersVal = systemInfo.graduates ? `${Number(systemInfo.graduates).toLocaleString()}+` : '3,100+';
  const instructorsVal = systemInfo.students ? `${Number(systemInfo.students).toLocaleString()}+` : '50+';

  const stats = [
    {
      value: sessionsVal,
      label: lang === 'bn' ? 'Finished Sessions' : 'Finished Sessions',
      desc: lang === 'bn' ? 'Live Interactive Classes' : 'Live Interactive Classes',
      icon: Video,
    },
    {
      value: learnersVal,
      label: lang === 'bn' ? 'Enrolled Learners' : 'Enrolled Learners',
      desc: lang === 'bn' ? 'Professionals & Graduates' : 'Professionals & Graduates',
      icon: Users,
    },
    {
      value: instructorsVal,
      label: lang === 'bn' ? 'Online Instructors' : 'Online Instructors',
      desc: lang === 'bn' ? 'Practicing Industry Mentors' : 'Practicing Industry Mentors',
      icon: GraduationCap,
    },
    {
      value: '95%',
      label: lang === 'bn' ? 'Satisfaction Rate' : 'Satisfaction Rate',
      desc: lang === 'bn' ? 'Learners Positive Feedback' : 'Learners Positive Feedback',
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="py-4 sm:py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full transition-colors">
      {/* Sleek, 1-Row Compact Ribbon Container */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-4 lg:gap-6">
          
          {/* Col 1: Title & Subheading (1-row side block) */}
          <div className="lg:col-span-3 lg:border-r border-slate-200 dark:border-slate-800 lg:pr-5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#C8963E]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'Our Track Record' : 'Our Track Record'}</span>
            </span>
            <h3 className="font-serif font-black text-slate-900 dark:text-white text-sm sm:text-base leading-snug mt-0.5">
              {lang === 'bn' ? 'Empowering Learners Across Bangladesh' : 'Empowering Learners Across Bangladesh'}
            </h3>
          </div>

          {/* Col 2: The 4 Stats in 1 Single Horizontal Row */}
          <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 pt-2 sm:pt-0 ${idx > 0 ? 'sm:pl-4' : ''}`}
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-slate-800/80 border border-amber-200/60 dark:border-slate-700 flex items-center justify-center text-[#C8963E] shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl sm:text-2xl font-serif font-black text-slate-900 dark:text-[#E5A93C] tracking-tight leading-none">
                      {s.value}
                    </p>
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate mt-1">
                      {s.label}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {s.desc}
                    </p>
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
