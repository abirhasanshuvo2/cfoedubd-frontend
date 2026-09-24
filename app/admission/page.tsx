'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCfo } from '@/context/CfoContext';
import { COURSES } from '@/data/cfo-data';
import {
  GraduationCap,
  CheckCircle2,
  Calendar,
  CreditCard,
  Building2,
  FileCheck,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Phone,
  Mail
} from 'lucide-react';

export default function AdmissionPage() {
  const { lang } = useCfo();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    education: 'Masters/MBA',
    workExperience: '2-5 Years',
    selectedProgram: 'cfo-flagship-1yr',
    paymentPlan: 'installments',
    deliveryMode: 'hybrid',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const randomId = 'COL-ADM-' + Math.floor(100000 + Math.random() * 900000);
    setApplicationId(randomId);

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          subject: `Admission Application: ${formData.selectedProgram} (${randomId})`,
          message: `Education: ${formData.education}, Experience: ${formData.workExperience}, Payment Plan: ${formData.paymentPlan}, Mode: ${formData.deliveryMode}`,
        }),
      });
    } catch {
      // Graceful fallback
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  const steps = [
    {
      step: '০১',
      title: 'অনলাইন আবেদন ফর্ম পূরণ',
      titleEn: 'Fill Online Application',
      desc: 'আপনার অ্যাকাডেমিক ও পেশাগত তথ্যাদি দিয়ে নিচের ফর্মটি পূরণ করুন।'
    },
    {
      step: '০২',
      title: 'প্রোফাইল মূল্যায়ন ও যাচাই',
      titleEn: 'Profile Evaluation',
      desc: 'আমাদের একাডেমিক টিম ২৪ ঘণ্টার মধ্যে আপনার আবেদন মূল্যায়ন করবে।'
    },
    {
      step: '০৩',
      title: 'সিট কনফার্মেশন ও অফার লেটার',
      titleEn: 'Admission Offer Letter',
      desc: 'যোগ্য বিবেচিত হলে আপনার ইমেইলে অফিশিয়াল অফার লেটার পাঠানো হবে।'
    },
    {
      step: '০৪',
      title: 'রেজিস্ট্রেশন ফি পরিশোধ ও ওরিয়েন্টেশন',
      titleEn: 'Fee Payment & LMS Access',
      desc: 'কিস্তি বা এককালীন ফি দিয়ে মতিঝিল ক্যাম্পাসে ওরিয়েন্টেশনে যোগ দিন।'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />

      {/* Hero Header */}
      <section className="relative bg-[#0A192F] text-white pt-16 pb-20 overflow-hidden border-b border-[#1E3A8A]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(200,150,62,0.18),rgba(10,25,47,0))]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E3A8A]/50 border border-[#C8963E]/40 text-xs font-bold text-[#E5A93C]">
            <GraduationCap className="w-4 h-4 text-[#C8963E]" />
            <span>{lang === 'bn' ? 'অনলাইন ভর্তি তথ্য ও আবেদন পোর্টাল' : 'Admission & Application Portal'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-white tracking-tight">
            {lang === 'bn' ? (
              <>
                চার্টার্ড অফিসার প্রোগ্রামে <span className="text-[#E5A93C]">ভর্তি প্রক্রিয়া ও আবেদন</span>
              </>
            ) : (
              <>
                Apply for Executive Programs at <span className="text-[#E5A93C]">Chartered Officer</span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {lang === 'bn'
              ? 'সিএফও ও পিজিডি প্রোগ্রামের আসন্ন ব্যাচে সীমিত আসনে অনলাইনে সরাসরি আবেদন করুন। কিস্তি সুবিধা ও স্কলারশিপের সুযোগ রয়েছে।'
              : 'Direct online admission for upcoming CFO cohorts and professional postgraduate diplomas with flexible semester installment plans.'}
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-16">
        {/* 4-Step Process Bar */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              {lang === 'bn' ? '৪টি সহজ ধাপে ভর্তি প্রক্রিয়া' : '4 Easy Steps to Admission'}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              {lang === 'bn' ? 'আবেদন থেকে শুরু করে ক্যাম্পাস ওরিয়েন্টেশন পর্যন্ত ধারাবাহিক নির্দেশিকা' : 'Simple and transparent admission workflow'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-[#C8963E] transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-serif font-black text-[#C8963E]">{s.step}</span>
                  <h3 className="text-sm font-serif font-bold text-slate-900 mt-2 mb-1.5">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1 text-[11px] font-bold text-[#966718]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ধাপ {idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Form + Fee & Eligibility Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Container */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg">
            {submitted ? (
              <div className="text-center py-10 space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border-2 border-emerald-300">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-serif font-black text-slate-900">
                  {lang === 'bn' ? 'ভর্তি আবেদন সফলভাবে গৃহীত হয়েছে!' : 'Admission Application Received!'}
                </h3>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">আবেদন ট্র্যাকিং আইডি:</span>
                    <span className="font-mono font-bold text-slate-900">{applicationId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">আবেদনকারীর নাম:</span>
                    <span className="font-bold text-slate-900">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">নির্বাচিত প্রোগ্রাম:</span>
                    <span className="font-bold text-slate-900">
                      {COURSES.find(c => c.id === formData.selectedProgram)?.title || formData.selectedProgram}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  {lang === 'bn'
                    ? 'আপনার আবেদনপত্রটি আমাদের ভর্তি মূল্যায়ন টিম পর্যালোচনা করছে। পরবর্তী ২৪ ঘণ্টার মধ্যে অফিশিয়াল অফার লেটার ও পেমেন্ট লিংক আপনার ইমেইল এবং মোবাইল নম্বরে প্রেরণ করা হবে।'
                    : 'Our admission committee will evaluate your profile and contact you within 24 business hours.'}
                </p>

                <div className="pt-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-[#0A192F] hover:bg-[#1E3A8A] text-white text-xs font-bold cursor-pointer"
                  >
                    {lang === 'bn' ? 'আরেকটি আবেদন করুন' : 'Submit Another Application'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif font-bold text-slate-900">
                    {lang === 'bn' ? 'অনলাইন ভর্তি আবেদন ফরম' : 'Online Admission Application Form'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {lang === 'bn'
                      ? 'সকল তথ্য সতর্কতার সাথে পূরণ করুন। কোনো স্টার চিহ্নিত (*) ফিল্ড খালি রাখা যাবে না।'
                      : 'Please provide accurate educational and career details.'}
                  </p>
                </div>

                {/* Full Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">পূর্ণ নাম (Full Name) *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="যেমন: মো. কামরুল হাসান"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#C8963E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">মোবাইল নম্বর (Phone Number) *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="যেমন: 018XXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#C8963E]"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">ইমেইল ঠিকানা (Email Address) *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#C8963E]"
                  />
                </div>

                {/* Program Selector */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">কাঙ্ক্ষিত প্রোগ্রাম নির্বাচন করুন (Desired Program) *</label>
                  <select
                    value={formData.selectedProgram}
                    onChange={(e) => setFormData({ ...formData, selectedProgram: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#C8963E] bg-white cursor-pointer"
                  >
                    {COURSES.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title} — ৳{course.price.toLocaleString()} ({course.duration})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Educational Qualification & Work Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">সর্বোচ্চ শিক্ষাগত যোগ্যতা *</label>
                    <select
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#C8963E] bg-white cursor-pointer"
                    >
                      <option value="Masters/MBA">Masters / MBA / M.Com</option>
                      <option value="BBA/B.Com">BBA / B.Com / Bachelor</option>
                      <option value="CA/CMA Partially Qualified">CA / CMA (Partially Qualified)</option>
                      <option value="Engineering/Science">B.Sc Engineering / IT</option>
                      <option value="Other">অন্যান্য (Other)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">কাজের অভিজ্ঞতা (Work Experience) *</label>
                    <select
                      value={formData.workExperience}
                      onChange={(e) => setFormData({ ...formData, workExperience: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#C8963E] bg-white cursor-pointer"
                    >
                      <option value="Fresh Graduate">ফ্রেশ গ্র্যাজুয়েট (Fresh Graduate)</option>
                      <option value="1-2 Years">১ - ২ বছর (Junior Executive)</option>
                      <option value="2-5 Years">২ - ৫ বছর (Senior Accounts / Finance)</option>
                      <option value="5+ Years">৫+ বছর (Manager / Controller)</option>
                    </select>
                  </div>
                </div>

                {/* Delivery Mode & Payment Plan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">ক্লাসের ধরন (Delivery Mode)</label>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, deliveryMode: 'hybrid' })}
                        className={`py-2 px-3 text-xs rounded-xl border text-center font-bold cursor-pointer transition-all ${
                          formData.deliveryMode === 'hybrid'
                            ? 'bg-[#0A192F] text-[#E5A93C] border-[#0A192F]'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        হাইব্রিড / ক্যাম্পাস
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, deliveryMode: 'online' })}
                        className={`py-2 px-3 text-xs rounded-xl border text-center font-bold cursor-pointer transition-all ${
                          formData.deliveryMode === 'online'
                            ? 'bg-[#0A192F] text-[#E5A93C] border-[#0A192F]'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        ১০০% লাইভ অনলাইন
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">ফি পরিশোধের পরিকল্পনা</label>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentPlan: 'installments' })}
                        className={`py-2 px-3 text-xs rounded-xl border text-center font-bold cursor-pointer transition-all ${
                          formData.paymentPlan === 'installments'
                            ? 'bg-amber-50 text-[#966718] border-[#C8963E]'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        ৩ কিস্তিতে পরিশোধ
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentPlan: 'full' })}
                        className={`py-2 px-3 text-xs rounded-xl border text-center font-bold cursor-pointer transition-all ${
                          formData.paymentPlan === 'full'
                            ? 'bg-amber-50 text-[#966718] border-[#C8963E]'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        এককালীন পরিশোধ
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] disabled:opacity-50 text-slate-950 font-serif font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>
                      {submitting
                        ? (lang === 'bn' ? 'আবেদন জমা হচ্ছে...' : 'Submitting Application...')
                        : (lang === 'bn' ? 'ভর্তি আবেদনপত্র জমা দিন' : 'Submit Admission Application')}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-2">
                    নিরাপদ ও সুরক্ষিত এনক্রিপশন সহ আপনার তথ্য সংরক্ষিত থাকে।
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Fee Structure & Requirements */}
          <div className="lg:col-span-5 space-y-6">
            {/* Installment Plan Card */}
            <div className="bg-[#0A192F] text-white rounded-3xl p-6 sm:p-8 border border-[#1E3A8A] space-y-4 shadow-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E5A93C] flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#C8963E]" />
                FEE STRUCTURE & INSTALLMENT
              </span>

              <h4 className="text-xl font-serif font-bold text-white">
                {lang === 'bn' ? 'CFO ১ বছর প্রোগ্রামের কিস্তি সুবিধা' : 'CFO Program Installment Schedule'}
              </h4>

              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">১ম সেমিস্টার (ভর্তির সময়)</p>
                    <p className="text-[11px] text-slate-400">অ্যাডমিশন, ম্যাটেরিয়াল ও ১ম টার্ম ফি</p>
                  </div>
                  <span className="font-serif font-black text-[#E5A93C] text-sm">৳১৫,০০০</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">২য় সেমিস্টার (৪র্থ মাসে)</p>
                    <p className="text-[11px] text-slate-400">মিড-টার্ম ইভ্যালুয়েশন ও এসএপি ল্যাব</p>
                  </div>
                  <span className="font-serif font-black text-[#E5A93C] text-sm">৳১৫,০০০</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">৩য় সেমিস্টার (৮ম মাসে)</p>
                    <p className="text-[11px] text-slate-400">ক্যাপস্টোন ডিফেন্স ও বিটিইবি সনদ ফি</p>
                  </div>
                  <span className="font-serif font-black text-[#E5A93C] text-sm">৳১৫,০০০</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300">সর্বমোট কোর্স ফি:</span>
                <span className="text-base font-serif font-black text-[#E5A93C]">৳৪৫,০০০</span>
              </div>
            </div>

            {/* Admission Helpline & Address */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
              <h4 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C8963E]" />
                {lang === 'bn' ? 'ভর্তি পরামর্শ ও হেল্পলাইন' : 'Admission Helpline & Assistance'}
              </h4>

              <p className="text-xs text-slate-600 leading-relaxed">
                ভর্তি বিষয়ক যেকোনো প্রয়োজনে সরাসরি আমাদের মতিঝিল ক্যাম্পাসে আসুন অথবা কল করুন।
              </p>

              <div className="space-y-2 text-xs text-slate-800 pt-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">হটলাইন:</span>
                  <span className="font-mono text-[#966718] font-bold">+880 1894-929000, +880 1894-929001</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">ইমেইল:</span>
                  <span className="text-slate-600">admission@cfoedubd.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">ক্যাম্পাস:</span>
                  <span className="text-slate-600">সিটি সেন্টার (লেভেল-২৫), মতিঝিল বা/এ, ঢাকা-১০০০</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
