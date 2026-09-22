'use client';

import React, { useState } from 'react';
import {
  Video,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { WORKSHOPS, Workshop } from '@/data/cfo-data';

interface FreeWorkshopsProps {
  lang: 'bn' | 'en';
}

export default function FreeWorkshops({ lang }: FreeWorkshopsProps) {
  const [registeredWorkshops, setRegisteredWorkshops] = useState<string[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);

  const handleRegister = (ws: Workshop) => {
    if (!registeredWorkshops.includes(ws.id)) {
      setRegisteredWorkshops([...registeredWorkshops, ws.id]);
    }
    setSelectedWorkshop(ws);
  };

  return (
    <section id="executive-webinars" className="py-16 bg-[#0A192F] text-white relative overflow-hidden border-b border-[#1E3A8A]">
      {/* Background Accent glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C8963E]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#1E3A8A]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E3A8A]/50 text-[#E5A93C] border border-[#C8963E]/40 text-xs font-bold mb-3">
              <Award className="w-3.5 h-3.5 text-[#C8963E]" />
              <span>{lang === 'bn' ? 'ফ্রি এক্সিকিউটিভ মাস্টারক্লাস' : 'Executive Finance Masterclasses'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-white tracking-tight">
              {lang === 'bn' ? 'আসন্ন করপোরেট ওয়েবিনার ও নলেজ সেশন' : 'Upcoming Executive Masterclasses & Webinars'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl">
              {lang === 'bn'
                ? 'আয়কর আইন ২০২৩, এসএপি-ফাইকো ইআরপি ও সিএফও ক্যারিয়ার রোডম্যাপ নিয়ে দেশের শীর্ষ ফেলো চার্টার্ড অ্যাকাউন্ট্যান্টদের সাথে সরাসরি সেশন।'
                : 'Join live sessions with leading FCAs and corporate CFOs on new tax laws, SAP-FICO implementation, and boardroom strategy.'}
            </p>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            {lang === 'bn' ? 'জুম ও গুগল মিটে সম্পূর্ণ ফ্রি রেজিস্ট্রেশন' : 'Free registration via Google Meet & Zoom'}
          </div>
        </div>

        {/* Workshop Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WORKSHOPS.map((ws) => {
            const isRegistered = registeredWorkshops.includes(ws.id);
            return (
              <div
                key={ws.id}
                className="rounded-2xl bg-slate-900/90 border border-slate-700/80 p-5 flex flex-col justify-between hover:border-[#C8963E] transition-all duration-300 group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1E3A8A]/40 text-[#E5A93C] border border-[#C8963E]/30 uppercase">
                      {ws.category}
                    </span>

                    {ws.isLiveNow ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white animate-pulse">
                        LIVE NOW
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#C8963E]" />
                        {ws.registeredCount} {lang === 'bn' ? 'নিবন্ধিত' : 'registered'}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-serif font-bold text-white group-hover:text-[#E5A93C] transition-colors leading-snug mb-3">
                    {lang === 'bn' ? ws.title : ws.titleEn}
                  </h3>

                  {/* Instructor */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 mb-4">
                    <p className="text-xs font-bold text-slate-200">{ws.instructor}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {ws.instructorRole} • <span className="text-[#E5A93C] font-medium">{ws.instructorCompany}</span>
                    </p>
                  </div>

                  {/* Date and Time */}
                  <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#C8963E]" />
                      <span>{ws.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#C8963E]" />
                      <span>{ws.time}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => handleRegister(ws)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isRegistered
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 font-serif font-black shadow-md'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{lang === 'bn' ? 'রেজিস্ট্রেশন সফল (সিট বুকড)' : 'Seat Confirmed'}</span>
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4" />
                        <span>{lang === 'bn' ? 'ফ্রি রেজিস্ট্রেশন করুন' : 'Free Registration'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Confirmation Modal alert */}
        {selectedWorkshop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
            <div className="bg-slate-900 border border-[#C8963E]/60 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-4 border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-serif font-bold text-white mb-2">
                {lang === 'bn' ? 'মাস্টারক্লাস রেজিস্ট্রেশন সম্পন্ন!' : 'Masterclass Seat Confirmed!'}
              </h3>

              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                {lang === 'bn'
                  ? `"${selectedWorkshop.title}" এর গুগল মিট লাইভ লিংক আপনার ইমেইল ও এসএমএসে পাঠানো হয়েছে। সেশনের সময়: ${selectedWorkshop.date}, ${selectedWorkshop.time}।`
                  : `Google Meet link for "${selectedWorkshop.titleEn}" has been confirmed for ${selectedWorkshop.date} at ${selectedWorkshop.time}.`}
              </p>

              <button
                onClick={() => setSelectedWorkshop(null)}
                className="w-full py-2.5 rounded-xl bg-[#C8963E] text-slate-950 font-black text-xs cursor-pointer"
              >
                {lang === 'bn' ? 'ধন্যবাদ' : 'Done'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
