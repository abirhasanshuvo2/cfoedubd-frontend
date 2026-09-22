'use client';

import React from 'react';
import { TESTIMONIALS } from '@/data/cfo-data';
import { Star, Quote, Award, CheckCircle2 } from 'lucide-react';

interface TestimonialsProps {
  lang: 'bn' | 'en';
}

export default function Testimonials({ lang }: TestimonialsProps) {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0A192F] text-[#E5A93C] border border-[#C8963E]/40 text-xs font-bold mb-3">
            <Quote className="w-3.5 h-3.5 text-[#C8963E]" />
            <span>{lang === 'bn' ? 'অ্যালামনাই ও সফলতার গল্প' : 'Executive Alumni Testimonials'}</span>
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 tracking-tight">
            {lang === 'bn'
              ? 'সিএফও ও পিজিডি গ্র্যাজুয়েটদের বাস্তব অভিজ্ঞতার প্রতিফলন'
              : 'Real Leadership Outcomes from Our CFO Alumni'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 mt-2.5">
            {lang === 'bn'
              ? 'জেনে নিন কীভাবে চার্টার্ড অফিসারের প্রশিক্ষণ আমাদের শিক্ষার্থীদের সি-স্যুট (C-Suite) লিডারশিপে উত্তীর্ণ করেছে।'
              : 'Discover how Chartered Officer credentials accelerated our graduates into corporate CFO and executive leadership seats.'}
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((test) => (
            <div
              key={test.id}
              className="rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-[#C8963E] p-6 flex flex-col justify-between transition-all duration-300 shadow-2xs hover:shadow-xl"
            >
              <div>
                {/* Rating & Company */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C8963E] text-[#C8963E]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0A192F] text-[#E5A93C] border border-[#C8963E]/30">
                    {test.companyLogoText}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs text-slate-700 leading-relaxed italic mb-6">
                  &ldquo;{lang === 'bn' ? test.comment : test.commentEn}&rdquo;
                </p>
              </div>

              {/* Student Profile and Career Transition */}
              <div className="pt-4 border-t border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-[#C8963E]/40 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={test.avatar}
                      alt={test.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{test.name}</h4>
                    <p className="text-[11px] text-[#966718] font-bold truncate">
                      {test.currentRole}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      পূর্বপদ: {test.previousRole}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
