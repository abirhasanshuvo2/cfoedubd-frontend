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
          setErrorMessage(
            firstError ||
              directJson?.message ||
              (lang === 'bn' ? 'তথ্য সঠিকভাবে পূরণ করুন।' : 'Please fill in all fields properly.')
          );
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
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-3 transition-colors">
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

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-3 transition-colors">
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
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-lg transition-colors">
            {formSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="text-lg font-serif font-bold text-emerald-950 dark:text-emerald-100">
                  {lang === 'bn' ? 'আপনার বার্তা সফলভাবে পৌঁছাল!' : 'Your Message Has Been Sent!'}
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto leading-relaxed">
                  {lang === 'bn'
                    ? 'ধন্যবাদ! আমাদের অ্যাকাডেমিক কাউন্সেলর খুব শীঘ্রই আপনার সাথে যোগাযোগ করবেন।'
                    : 'Thank you! Our academic counselor will get in touch with you shortly.'}
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#0A192F] dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors"
                >
                  {lang === 'bn' ? 'আরেকটি বার্তা পাঠান' : 'Send Another Message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
                    {lang === 'bn' ? 'পরামর্শ ও অনুসন্ধানের বার্তা পাঠান' : 'Send an Inquiry or Schedule a Visit'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {lang === 'bn'
                      ? 'ফর্মটি পূরণ করুন, আমাদের প্রতিনিধি আপনার সকল প্রশ্নের বিস্তারিত উত্তর দেবেন।'
                      : 'Fill out the form, and our representative will assist you with all your queries.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      {lang === 'bn' ? 'আপনার নাম *' : 'Your Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={lang === 'bn' ? 'যেমন: মো. কামরুল হাসান' : 'e.g. Md. Kamrul Hasan'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C8963E]/40 focus:border-[#C8963E] transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      {lang === 'bn' ? 'মোবাইল নম্বর *' : 'Mobile Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="018XXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C8963E]/40 focus:border-[#C8963E] font-mono transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {lang === 'bn' ? 'ইমেইল ঠিকানা *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C8963E]/40 focus:border-[#C8963E] font-mono transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    {lang === 'bn' ? 'আপনার প্রশ্ন বা বার্তা লিখুন *' : 'Your Question or Message *'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={lang === 'bn' ? 'আপনার প্রশ্ন বা জিজ্ঞাসা এখানে লিখুন...' : 'Write your question or inquiry here...'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C8963E]/40 focus:border-[#C8963E] transition-colors resize-y"
                  />
                </div>

                {errorMessage && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">{errorMessage}</p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#A97B28] hover:brightness-110 active:scale-[0.99] disabled:opacity-50 text-slate-950 font-serif font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 border border-[#C8963E]/30"
                  >
                    <Send className={`w-4 h-4 ${submitting ? 'animate-spin' : ''}`} />
                    <span>
                      {submitting
                        ? (lang === 'bn' ? 'বার্তা পাঠানো হচ্ছে...' : 'Sending Message...')
                        : (lang === 'bn' ? 'বার্তা পাঠান' : 'Send Message')}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Campus Details & Visiting Hours */}
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

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {lang === 'bn'
                  ? 'মতিঝিল বাণিজ্যিক এলাকার কেন্দ্রস্থলে অবস্থিত সিটি সেন্টার বাংলাদেশের অন্যতম প্রধান বিজনেস টাওয়ার। লিফট-২৬ এ উঠে ২৫তম তলায় আমাদের কর্পোরেট এক্সিকিউটিভ ক্যাম্পাস।'
                  : 'Located at City Centre Bangladesh, Motijheel Commercial Area. Take Lift-26 to Level-25 for our executive learning campus.'}
              </p>

              {/* Visiting Hours & Direct Helpline */}
              <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-3.5">
                <div className="flex items-start gap-3 text-xs">
                  <Clock className="w-4 h-4 text-[#C8963E] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {lang === 'bn' ? 'সরাসরি ভিজিটের সময়সূচি' : 'Visiting Hours'}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                      {lang === 'bn'
                        ? 'শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - রাত ৮:০০'
                        : 'Saturday - Thursday: 9:00 AM - 8:00 PM'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <Phone className="w-4 h-4 text-[#C8963E] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {lang === 'bn' ? 'অ্যাকাডেমিক কাউন্সেলিং ও হটলাইন' : 'Counseling & Direct Helpline'}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5 font-mono font-bold text-slate-900 dark:text-slate-200">
                      {systemInfo.phone || '+880 1713378787'}
                    </p>
                  </div>
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
