'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCfo } from '@/context/CfoContext';
import {
  GraduationCap,
  Award,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Sparkles,
  Camera,
  Download,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function ConvocationPage() {
  const { lang } = useCfo();

  const [registrationSubmitted, setRegistrationSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    alumniName: '',
    credentialId: '',
    batch: 'Batch 18',
    robeSize: 'L (Large)',
    guestCount: '1',
    phone: '',
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationSubmitted(true);
  };

  const galleryImages = [
    {
      title: 'সিএফও গ্র্যাজুয়েটদের ক্যাপ থ্রোয়িং উৎসব',
      titleEn: 'CFO Graduates Cap Throwing Celebration',
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'প্রধান অতিথির নিকট থেকে সম্মানজনক সনদ গ্রহণ',
      titleEn: 'Receiving Credentials from Chief Guest',
      url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'একাডেমিক কাউন্সিল ও ফেলোদের সাথে সমাবর্তন মার্চ',
      titleEn: 'Convocation Procession with Academic Council',
      url: 'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'করপোরেট ফেলো ও স্বর্ণপদক প্রাপ্ত শিক্ষার্থীদের সম্মাননা',
      titleEn: 'Gold Medalists & Corporate Fellowship Awards',
      url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />

      {/* Convocation Hero */}
      <section className="relative bg-[#0A192F] text-white pt-16 pb-24 overflow-hidden border-b border-[#1E3A8A]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(200,150,62,0.22),rgba(10,25,47,0))]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E3A8A]/50 border border-[#C8963E]/40 text-xs font-bold text-[#E5A93C]">
            <GraduationCap className="w-4 h-4 text-[#C8963E]" />
            <span>{lang === 'bn' ? 'বার্ষিক সমাবর্তন ও গ্র্যাজুয়েশন উৎসব' : 'Annual Grand Convocation Ceremony'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black text-white tracking-tight">
            {lang === 'bn' ? (
              <>
                চার্টার্ড অফিসার লিমিটেড <br className="hidden sm:block" />
                <span className="text-[#E5A93C]">বার্ষিক গ্র্যান্ড কনভোকেশন</span>
              </>
            ) : (
              <>
                Chartered Officer Limited <br className="hidden sm:block" />
                <span className="text-[#E5A93C]">Annual Grand Convocation</span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {lang === 'bn'
              ? 'কঠোর অধ্যবসায় ও বোর্ডরুম ডিফেন্স সম্পন্নকারী চার্টার্ড ফাইন্যান্সিয়াল অফিসার (CFO) ও পোস্ট গ্র্যাজুয়েট ডিপ্লোমাধারীদের সম্মাননা ও আনুষ্ঠানিক গাউন পরিয়ে সনদপত্র প্রদান।'
              : 'Celebrating the academic triumphs of our CFO and PGD graduates with state-of-the-art ceremonies, honorary fellows, and gold medal presentations.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-700">
              <Calendar className="w-4 h-4 text-[#C8963E]" />
              <span>১৫ ডিসেম্বর, ২০২৬ (শুক্রবার)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-700">
              <MapPin className="w-4 h-4 text-[#C8963E]" />
              <span>বঙ্গবন্ধু আন্তর্জাতিক সম্মেলন কেন্দ্র (BICC), ঢাকা</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-16">
        {/* Key Highlights Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <p className="text-3xl font-serif font-black text-[#0A192F]">৮৪০+</p>
            <p className="text-xs font-semibold text-slate-600 mt-1">সার্টিফাইড গ্র্যাজুয়েট সমাবর্তন</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <p className="text-3xl font-serif font-black text-[#C8963E]">১২ জন</p>
            <p className="text-xs font-semibold text-slate-600 mt-1">স্বর্ণপদক ও ডিস্টিঙ্কশন অ্যাওয়ার্ড</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <p className="text-3xl font-serif font-black text-[#0A192F]">৫০+</p>
            <p className="text-xs font-semibold text-slate-600 mt-1">শীর্ষ করপোরেট সিএফও ও প্রধান অতিথি</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <p className="text-3xl font-serif font-black text-emerald-600">১০০%</p>
            <p className="text-xs font-semibold text-slate-600 mt-1">বিটিইবি রেজিস্টার্ড সনদের আনুষ্ঠানিক বিতরণ</p>
          </div>
        </div>

        {/* Convocation Photo Gallery */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#966718] flex items-center justify-center gap-1.5 mb-1">
              <Camera className="w-3.5 h-3.5 text-[#C8963E]" />
              PHOTO ARCHIVE
            </span>
            <h2 className="text-2xl font-serif font-black text-slate-900">
              {lang === 'bn' ? 'বিগত সমাবর্তন উৎসবের স্মরণীয় মুহূর্তসমূহ' : 'Moments from Past Convocations'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                className="group rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="h-48 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white text-xs font-semibold">{img.title}</p>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs font-serif font-bold text-slate-900">
                    {lang === 'bn' ? img.title : img.titleEn}
                  </p>
                  <span className="text-[10px] text-slate-500 font-semibold mt-2">বঙ্গবন্ধু আন্তর্জাতিক সম্মেলন কেন্দ্র</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Convocation Registration Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg max-w-3xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#966718] border border-amber-200 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C8963E]" />
              ALUMNI CONVOCATION REGISTRATION
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
              {lang === 'bn' ? 'সমাবর্তন অনুষ্ঠানে অংশগ্রহণের নিবন্ধন' : 'Register for the Upcoming Convocation'}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              {lang === 'bn'
                ? 'যে সকল শিক্ষার্থী সফলভাবে সিএফও বা পিজিডি কোর্স সম্পন্ন করেছেন, তারা গাউন ও সিট বুকিংয়ের জন্য আবেদন করুন।'
                : 'Confirm your graduation gown size and guest passes for the ceremony.'}
            </p>
          </div>

          {registrationSubmitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-lg font-serif font-bold text-emerald-950">
                {lang === 'bn' ? 'সমাবর্তন নিবন্ধন সফল হয়েছে!' : 'Convocation Registration Confirmed!'}
              </h4>
              <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                আপনার গাউন ও সমাবর্তন প্রবেশ পাস মতিঝিল ক্যাম্পাসে নির্ধারিত তারিখে প্রস্তুত থাকবে। বিস্তারিত শিডিউল আপনার মোবাইল ও ইমেইলে প্রেরণ করা হবে।
              </p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">অ্যালামনাই শিক্ষার্থীর নাম *</label>
                  <input
                    type="text"
                    required
                    value={formData.alumniName}
                    onChange={(e) => setFormData({ ...formData, alumniName: e.target.value })}
                    placeholder="যেমন: তানভীর আহমেদ চৌধুরী"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-[#C8963E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">সনদ বা রেজিস্ট্রেশন আইডি *</label>
                  <input
                    type="text"
                    required
                    value={formData.credentialId}
                    onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                    placeholder="যেমন: COL-CFO-2025-9921"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 uppercase font-mono focus:outline-none focus:border-[#C8963E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">গ্র্যাজুয়েটিং ব্যাচ</label>
                  <select
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white"
                  >
                    <option value="Batch 18">CFO ব্যাচ ১৮</option>
                    <option value="Batch 17">CFO ব্যাচ ১৭</option>
                    <option value="PGD VAT 12">PGD VAT ব্যাচ ১২</option>
                    <option value="SAP 09">SAP-FICO ব্যাচ ০৯</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">গাউনের সাইজ (Robe Size)</label>
                  <select
                    value={formData.robeSize}
                    onChange={(e) => setFormData({ ...formData, robeSize: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white"
                  >
                    <option value="M (Medium)">M (Medium - Height 5&apos;3&quot; - 5&apos;7&quot;)</option>
                    <option value="L (Large)">L (Large - Height 5&apos;8&quot; - 6&apos;0&quot;)</option>
                    <option value="XL (Extra Large)">XL (Extra Large - 6&apos;0&quot;+)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">অতিথি সংখ্যা (Guest Passes)</label>
                  <select
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white"
                  >
                    <option value="1">১ জন অতিথি</option>
                    <option value="2">২ জন অতিথি</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">যোগাযোগ মোবাইল নম্বর *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="018XXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-[#C8963E]"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 font-serif font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>সমাবর্তনে অংশগ্রহণ নিশ্চিত করুন</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
