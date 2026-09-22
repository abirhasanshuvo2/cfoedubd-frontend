'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCfo } from '@/context/CfoContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  Building2,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function ContactPage() {
  const { lang, systemInfo } = useCfo();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'CFO Program Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />

      {/* Hero Header */}
      <section className="relative bg-[#0A192F] text-white pt-16 pb-20 overflow-hidden border-b border-[#1E3A8A]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(200,150,62,0.18),rgba(10,25,47,0))]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E3A8A]/50 border border-[#C8963E]/40 text-xs font-bold text-[#E5A93C]">
            <MapPin className="w-4 h-4 text-[#C8963E]" />
            <span>{lang === 'bn' ? 'সরাসরি যোগাযোগ ও ক্যাম্পাস ভিজিট' : 'Contact & Campus Visit'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-white tracking-tight">
            {lang === 'bn' ? (
              <>
                আমাদের সাথে <span className="text-[#E5A93C]">যোগাযোগ করুন</span>
              </>
            ) : (
              <>
                Get in Touch with <span className="text-[#E5A93C]">Chartered Officer</span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {lang === 'bn'
              ? 'কোর্স কারিকুলাম, ভর্তি তথ্য বা করপোরেট ট্রেনিং কনসালটেশনের জন্য সরাসরি মতিঝিল সিটি সেন্টার ক্যাম্পাসে আসুন অথবা কল করুন।'
              : 'Visit our City Centre campus in Motijheel Commercial Area or reach out via hotline for executive consultation.'}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#C8963E] border border-amber-200 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-serif font-bold text-slate-900">
              {lang === 'bn' ? 'প্রধান ক্যাম্পাস ও রেজিস্টার্ড অফিস' : 'Central Campus & Headquarters'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {systemInfo.address || 'সিটি সেন্টার (লেভেল-২৫), মতিঝিল বা/এ, ঢাকা-১০০০, বাংলাদেশ।'}
            </p>
            <span className="text-[11px] font-semibold text-[#966718] block pt-1">
              বাংলাদেশ ব্যাংক ও শাপলা চত্বরের সংলগ্ন • Level-25 (Lift-26)
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-serif font-bold text-slate-900">
              {lang === 'bn' ? 'হটলাইন ও হোয়াটসঅ্যাপ' : 'Direct Helpline & WhatsApp'}
            </h3>
            <div className="space-y-1 text-xs text-slate-700">
              <p className="font-mono font-bold text-slate-900">{systemInfo.phone || '+880 1713378787'}</p>
              {systemInfo.mobile && systemInfo.mobile !== systemInfo.phone && (
                <p className="font-mono font-bold text-slate-900">{systemInfo.mobile}</p>
              )}
              <p className="text-[11px] text-slate-500 font-mono">{systemInfo.email || 'cfoedubd@gmail.com'}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-serif font-bold text-slate-900">
              {lang === 'bn' ? 'অফিস ও কাউন্সেলিং সময়' : 'Office & Counseling Hours'}
            </h3>
            <div className="text-xs text-slate-600 space-y-1">
              <p><span className="font-semibold text-slate-800">শনিবার – বৃহস্পতিবার:</span> সকাল ৯:০০ – রাত ৮:০০</p>
              <p><span className="font-semibold text-slate-800">শুক্রবার:</span> দুপুর ২:৩০ – রাত ৮:৩০ (এক্সিকিউটিভ ক্লাস)</p>
            </div>
          </div>
        </div>

        {/* Message Form & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg">
            {formSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-serif font-bold text-emerald-950">
                  {lang === 'bn' ? 'আপনার বার্তা সফলভাবে পৌঁছাল!' : 'Your Message Has Been Sent!'}
                </h4>
                <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                  ধন্যবাদ! আমাদের অ্যাকাডেমিক কাউন্সেলর খুব শীঘ্রই আপনার সাথে যোগাযোগ করবেন।
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-4 py-2 rounded-xl bg-[#0A192F] text-white text-xs font-bold cursor-pointer"
                >
                  আরেকটি বার্তা পাঠান
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <h3 className="text-xl font-serif font-bold text-slate-900">
                    {lang === 'bn' ? 'পরামর্শ ও অনুসন্ধানের বার্তা পাঠান' : 'Send an Inquiry or Schedule a Visit'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    ফর্মটি পূরণ করুন, আমাদের প্রতিনিধি আপনার সকল প্রশ্নের বিস্তারিত উত্তর দেবেন।
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">আপনার নাম *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="যেমন: মো. কামরুল হাসান"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-[#C8963E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="018XXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-[#C8963E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">ইমেইল ঠিকানা *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-[#C8963E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">অনুসন্ধানের বিষয়</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white"
                    >
                      <option value="CFO Program Inquiry">CFO ফ্ল্যাগশিপ প্রোগ্রাম তথ্য</option>
                      <option value="VAT & Tax PGD">কাস্টমস, ভ্যাট ও ট্যাক্স পিজিডি</option>
                      <option value="SAP FICO">ফিনটেক ও এসএপি-ফাইকো ল্যাব</option>
                      <option value="Corporate Training">কর্পোরেট ইন-হাউস ট্রেনিং</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">আপনার প্রশ্ন বা বার্তা লিখুন *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="আপনার প্রশ্ন বা জিজ্ঞাসা এখানে লিখুন..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-[#C8963E]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 font-serif font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>বার্তা পাঠান</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Location Map & Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0A192F] text-white rounded-3xl p-6 sm:p-8 border border-[#1E3A8A] space-y-4 shadow-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E5A93C] flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#C8963E]" />
                MOTIJHEEL CITY CENTRE
              </span>

              <h4 className="text-xl font-serif font-bold text-white">
                সিটি সেন্টার ক্যাম্পাস
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">
                সিটি সেন্টার ঢাকার মতিঝিলে অবস্থিত দেশের সর্বোচ্চ আইকনিক বাণিজ্যিক ভবন। লেভেল ২৫-এ অবস্থিত আমাদের ক্যাম্পাসে রয়েছে এক্সিকিউটিভ ক্লাসরুম, এসএপি কম্পিউটার ল্যাব ও স্টাডি লাউঞ্জ।
              </p>

              {/* Visual Map Representation */}
              <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#E5A93C]">Google Map Location</span>
                  <span className="text-slate-400 font-mono">23.7289° N, 90.4174° E</span>
                </div>
                <div className="h-40 rounded-xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-center p-4 space-y-2">
                  <MapPin className="w-8 h-8 text-[#C8963E] animate-bounce" />
                  <p className="font-serif font-bold text-xs text-white">City Centre, Level 25</p>
                  <p className="text-[10px] text-slate-400">Motijheel Commercial Area, Dhaka-1000</p>
                  <a
                    href="https://maps.google.com/?q=City+Centre+Motijheel+Dhaka"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#C8963E] text-slate-950 text-[10px] font-bold hover:bg-[#d4af37] transition-colors"
                  >
                    গুগল ম্যাপে খুলুন
                  </a>
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
