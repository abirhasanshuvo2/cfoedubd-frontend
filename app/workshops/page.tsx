'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { WORKSHOPS, Workshop } from '@/data/cfo-data';
import { useCfo } from '@/context/CfoContext';
import {
  Video,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Share2,
  Bell
} from 'lucide-react';

export default function WorkshopsPage() {
  const { lang } = useCfo();
  const [registeredWorkshops, setRegisteredWorkshops] = useState<string[]>([]);
  const [activeModalWs, setActiveModalWs] = useState<Workshop | null>(null);

  const handleRegister = (ws: Workshop) => {
    if (!registeredWorkshops.includes(ws.id)) {
      setRegisteredWorkshops([...registeredWorkshops, ws.id]);
    }
    setActiveModalWs(ws);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-[#0A192F] text-white py-12 sm:py-16 border-b border-[#1E3A8A] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8963E]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold mb-4">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>{lang === 'bn' ? '১০০% ফ্রি লাইভ এক্সিকিউটিভ সেশন' : '100% Free Live Executive Sessions'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-white tracking-tight">
              {lang === 'bn' ? 'সিএফও এক্সিকিউটিভ ফ্রি লাইভ মাস্টারক্লাস' : 'CFO Executive Free Live Masterclasses'}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
              {lang === 'bn'
                ? 'কর্পোরেট ফিন্যান্স, নতুন আয়কর আইন ২০২৩, এসএপি ইআরপি ও আইএফআরএস নিয়ে প্রখ্যাত সিএফও ও প্র্যাকটিসিং এফসিএ-দের সরাসরি লাইভ সেশন। কোনো রেজিস্ট্রেশন ফি নেই!'
                : 'Join interactive live masterclasses with senior CFOs, FCAs, and corporate strategists from top multinational corporations at zero cost.'}
            </p>
          </div>
        </div>
      </section>

      {/* Workshops Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WORKSHOPS.map((ws) => {
            const isRegistered = registeredWorkshops.includes(ws.id);
            return (
              <div
                key={ws.id}
                className="rounded-2xl bg-white border border-slate-200 hover:border-amber-400 p-6 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all"
              >
                <div className="space-y-4">
                  {/* Category & Status */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
                      <Video className="w-3.5 h-3.5" />
                      লাইভ ওয়েবিনার
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                      ফ্রি সেশন
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {lang === 'bn' ? ws.title : ws.titleEn}
                  </h3>

                  {/* Instructor */}
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 border border-amber-200 font-black text-sm flex items-center justify-center shrink-0">
                      {ws.instructor.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{ws.instructor}</p>
                      <p className="text-[11px] text-slate-500">
                        {ws.instructorRole} @ <strong className="text-slate-800">{ws.instructorCompany}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Meta Details */}
                  <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span>{ws.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{ws.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-amber-500" />
                      <span>{ws.registeredCount} জন রেজিস্ট্রেশন করেছেন</span>
                    </div>
                  </div>
                </div>

                {/* Register Action */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  {isRegistered ? (
                    <div className="py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>রেজিস্ট্রেশন কনফার্মড!</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRegister(ws)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#FFC000] hover:bg-[#ffb000] text-slate-950 font-black text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>ফ্রি রেজিস্ট্রেশন করুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Workshop Registration Success Modal */}
      {activeModalWs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-950">
                মাস্টারক্লাস সিট বুকিং সম্পন্ন!
              </h3>
              <p className="text-xs text-slate-600">
                {activeModalWs.title} সেশনটির জুম লিংক আপনার ইমেইল ও এসএমএস-এ পাঠানো হয়েছে।
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">তারিখ:</span>
                <span className="font-bold text-slate-900">{activeModalWs.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">সময়:</span>
                <span className="font-bold text-slate-900">{activeModalWs.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">মাধ্যম:</span>
                <span className="font-bold text-emerald-600">Zoom Live Webinar</span>
              </div>
            </div>

            <button
              onClick={() => setActiveModalWs(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}

      <Footer lang={lang} />
    </div>
  );
}
