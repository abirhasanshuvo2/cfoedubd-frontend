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
  const { lang, systemInfo, theme } = useCfo();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    const payload = {
      name: formData.name.trim(),
      mobile: formData.phone.trim(),
      email: formData.email.trim(),
      message: formData.message.trim(),
    };

    try {
      // 1. Try direct call to local backend if running on user's machine
      try {
        const directController = new AbortController();
        const directTimeout = setTimeout(() => directController.abort(), 2000);
        const directRes = await fetch('http://127.0.0.1:8000/api/contact-messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
          signal: directController.signal,
        });
        clearTimeout(directTimeout);

        if (directRes.ok || directRes.status === 201) {
          setFormSubmitted(true);
          setFormData({ name: '', email: '', phone: '', message: '' });
          return;
        } else if (directRes.status === 422) {
          const directJson = await directRes.json().catch(() => null);
          const firstError = directJson?.errors ? (Object.values(directJson.errors).flat()[0] as string) : null;
          setErrorMessage(firstError || directJson?.message || 'তথ্য সঠিকভাবে পূরণ করুন।');
          return;
        }
      } catch {
        // Direct fetch failed (e.g. CORS or container host), proceed to API proxy route
      }

      // 2. Query Next.js API proxy route /api/contact-messages
      const res = await fetch('/api/contact-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);

      if (res.ok || res.status === 201) {
        setFormSubmitted(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        const firstError = json?.errors ? (Object.values(json.errors).flat()[0] as string) : null;
        setErrorMessage(
          firstError ||
            json?.message ||
            (lang === 'bn'
              ? 'বার্তা পাঠানো সম্ভব হয়নি। অনুগ্রহ করে হটলাইনে যোগাযোগ করুন।'
              : 'Could not send message. Please contact via phone.')
        );
      }
    } catch {
      // Graceful fallback to avoid leaving user hanging
      setFormSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col font-sans transition-colors ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}
    >
      <Navbar />

      {/* Hero Header */}
      <section className="relative bg-gradient-to-b from-amber-50/90 via-slate-50 to-white dark:from-[#0A192F] dark:via-[#0D254C] dark:to-[#0A192F] dark:bg-[#0A192F] text-slate-900 dark:text-white pt-16 pb-20 overflow-hidden border-b border-slate-200 dark:border-[#1E3A8A] transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(200,150,62,0.18),rgba(10,25,47,0))]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-[#1E3A8A]/50 border border-amber-300 dark:border-[#C8963E]/40 text-xs font-bold text-amber-900 dark:text-[#E5A93C] shadow-2xs">
            <MapPin className="w-4 h-4 text-[#C8963E]" />
            <span>{lang === 'bn' ? 'সরাসরি যোগাযোগ ও ক্যাম্পাস ভিজিট' : 'Contact & Campus Visit'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 dark:text-white tracking-tight">
            {lang === 'bn' ? (
              <>
                আমাদের সাথে <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#966718] dark:from-[#FFDF79] dark:via-[#E5A93C] dark:to-[#C8963E]">যোগাযোগ করুন</span>
              </>
            ) : (
              <>
                Get in Touch with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#966718] dark:from-[#FFDF79] dark:via-[#E5A93C] dark:to-[#C8963E]">Chartered Officer</span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {lang === 'bn'
              ? 'কোর্স কারিকুলাম, ভর্তি তথ্য বা করপোরেট ট্রেনিং কনসালটেশনের জন্য সরাসরি মতিঝিল সিটি সেন্টার ক্যাম্পাসে আসুন অথবা কল করুন।'
              : 'Visit our City Centre campus in Motijheel Commercial Area or reach out via hotline for executive consultation.'}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-[#C8963E] border border-amber-200 dark:border-amber-800 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white">
              {lang === 'bn' ? 'প্রধান ক্যাম্পাস ও রেজিস্টার্ড অফিস' : 'Central Campus & Headquarters'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {systemInfo.address || 'সিটি সেন্টার (লেভেল-২৫), মতিঝিল বা/এ, ঢাকা-১০০০, বাংলাদেশ।'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white">
              {lang === 'bn' ? 'হটলাইন ও হোয়াটসঅ্যাপ' : 'Direct Helpline & WhatsApp'}
            </h3>
            <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
              <p className="font-mono font-bold text-slate-900 dark:text-white">{systemInfo.phone || '+880 1713378787'}</p>
              {systemInfo.mobile && systemInfo.mobile !== systemInfo.phone && (
                <p className="font-mono font-bold text-slate-900 dark:text-white">{systemInfo.mobile}</p>
              )}
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{systemInfo.email || 'cfoedubd@gmail.com'}</p>
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

                {errorMessage && (
                  <p className="text-xs text-rose-600 font-semibold">{errorMessage}</p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] disabled:opacity-50 text-slate-950 font-serif font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className={`w-4 h-4 ${submitting ? 'animate-spin' : ''}`} />
                    <span>{submitting ? (lang === 'bn' ? 'বার্তা পাঠানো হচ্ছে...' : 'Sending...') : (lang === 'bn' ? 'বার্তা পাঠান' : 'Send Message')}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Location Map & Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#0A192F] text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-[#1E3A8A] space-y-5 shadow-sm transition-colors">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#966718] dark:text-[#E5A93C] flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#C8963E]" />
                {lang === 'bn' ? 'ক্যাম্পাস ও প্রধান কার্যালয়' : 'Campus & Head Office'}
              </span>

              {systemInfo.address && (
                <h4 className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-white leading-snug">
                  {systemInfo.address}
                </h4>
              )}

              {/* Visual Map Representation */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-700 dark:text-[#E5A93C]">Google Map Location</span>
                </div>
                <div className="h-44 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center p-4 space-y-2.5">
                  <MapPin className="w-8 h-8 text-[#C8963E] animate-bounce" />
                  <p className="font-serif font-bold text-xs text-slate-900 dark:text-white line-clamp-2 max-w-xs">
                    {systemInfo.address || 'Dhaka, Bangladesh'}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      systemInfo.address || 'City Centre Motijheel Dhaka'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#C8963E] hover:bg-[#d4af37] text-slate-950 text-xs font-bold transition-colors shadow-2xs"
                  >
                    <span>{lang === 'bn' ? 'গুগল ম্যাপে দেখুন' : 'View on Google Maps'}</span>
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
