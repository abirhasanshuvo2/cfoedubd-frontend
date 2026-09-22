'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HiringPartners from '@/components/HiringPartners';
import { useCfo } from '@/context/CfoContext';
import {
  Briefcase,
  Users,
  CheckCircle2,
  TrendingUp,
  Building2,
  ArrowRight,
  ShieldCheck,
  Send,
  Star
} from 'lucide-react';

export default function TalentPoolPage() {
  const { lang } = useCfo();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitRecruiter = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0A192F] text-white py-14 sm:py-20 border-b border-[#1E3A8A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8963E]/20 text-[#E5A93C] border border-[#C8963E]/30 text-xs font-bold mb-4">
            <Briefcase className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>সিএফও করপোরেট ট্যালেন্ট নেটওয়ার্ক ও প্লেসমেন্ট</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-white tracking-tight leading-tight">
            {lang === 'bn'
              ? 'শীর্ষস্থানীয় সার্টিফাইড ফাইন্যান্স, ট্যাক্স ও সি-স্যুট লিডার নিয়োগ দিন'
              : 'Hire Vetted Finance & Tax Leaders from CFO Talent Network'}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
            {lang === 'bn'
              ? 'আমাদের চার্টার্ড অফিসার ও সিএফও গ্র্যাজুয়েটরা বাস্তব করপোরেট ফাইন্যান্স, এসএপি-ফাইকো (SAP-FICO), ভ্যাট-ট্যাক্স অডিট এবং বোর্ডরুম গভর্নেন্সে প্রশিক্ষিত। কোনো রিক্রুটমেন্ট ফি ছাড়াই সরাসরি অভিজ্ঞ ফিন্যান্স পেশাদার ইন্টারভিউ করুন।'
              : 'Zero recruitment fees. Pre-screened candidates thoroughly trained in SAP-FICO ERP, New Tax Act 2023, board governance, and CFO decision frameworks.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <a
              href="#recruiter-form"
              className="px-6 py-3.5 rounded-xl bg-[#FFC000] hover:bg-[#ffb000] text-slate-950 font-black text-sm shadow-md transition-all cursor-pointer"
            >
              রিক্রুটার হিসেবে রেজিস্টার করুন
            </a>
            <Link
              href="/courses"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all"
            >
              ট্যালেন্ট পুলে যুক্ত হতে কোর্স করুন
            </Link>
          </div>
        </div>
      </section>

      {/* Placement Stats */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-slate-950">৮৫%</p>
              <p className="text-xs text-slate-500 font-semibold">গ্র্যাজুয়েটদের জব প্লেসমেন্ট রেট</p>
            </div>
            <div className="p-4 space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-slate-950">১৫০+</p>
              <p className="text-xs text-slate-500 font-semibold">পার্টনার সফটওয়্যার কোম্পানি</p>
            </div>
            <div className="p-4 space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-slate-950">৳৪৫,০০০</p>
              <p className="text-xs text-slate-500 font-semibold">গড় প্রারম্ভিক বেতন (Starting Salary)</p>
            </div>
            <div className="p-4 space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-slate-950">১,২০০+</p>
              <p className="text-xs text-slate-500 font-semibold">সফল নিয়োগ সম্পন্ন</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hiring Partners Carousel */}
      <HiringPartners lang={lang} />

      {/* Recruiter Contact Form */}
      <section id="recruiter-form" className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-md">
          <div className="text-center space-y-2 mb-8">
            <h3 className="text-2xl font-black text-slate-950">
              আপনার কোম্পানির জন্য উপযুক্ত ক্যান্ডিডেট খুঁজুন
            </h3>
            <p className="text-xs text-slate-500">
              নিচের ফর্মটি পূরণ করলে আমাদের ট্যালেন্ট একুইজিশন টিম ২৪ ঘণ্টার মধ্যে শর্টলিস্টেড ক্যান্ডিডেট প্রোফাইল শেয়ার করবে।
            </p>
          </div>

          {submitted ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-lg font-black">রিকোয়েস্ট গৃহীত হয়েছে!</h4>
              <p className="text-xs text-emerald-700">
                আমাদের হায়ার টিম অতি শীঘ্রই আপনার দেওয়া ঠিকানায় যোগাযোগ করবে।
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitRecruiter} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">আপনার নাম*</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. তানভীর রহমান"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-400 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">কোম্পানির নাম*</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brain Station 23 / Pathao"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-400 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">কর্মক্ষেত্রের ইমেইল*</label>
                  <input
                    type="email"
                    required
                    placeholder="hr@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-400 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর*</label>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-400 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">কোন রোলের জন্য হায়ার করতে চান?</label>
                <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-400 text-sm outline-none bg-white">
                  <option>Full Stack MERN / Next.js Developer</option>
                  <option>DevOps & Cloud Engineer (Docker/K8s/AWS)</option>
                  <option>UI/UX Product Designer</option>
                  <option>Data Scientist & AI Engineer</option>
                  <option>Python / Django Backend Engineer</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-[#FFC000] hover:bg-[#ffb000] text-slate-950 font-black text-sm shadow-md transition-all cursor-pointer"
              >
                ক্যান্ডিডেট প্রোফাইল রিকোয়েস্ট সাবমিট করুন
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
