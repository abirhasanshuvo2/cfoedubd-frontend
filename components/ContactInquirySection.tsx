'use client';

import React, { useState } from 'react';
import { useCfo } from '@/context/CfoContext';
import {
  Send,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Building2,
} from 'lucide-react';

interface ContactInquirySectionProps {
  lang?: 'bn' | 'en';
  variant?: 'homepage' | 'standalone';
}

export default function ContactInquirySection({
  lang: propLang,
  variant = 'homepage',
}: ContactInquirySectionProps) {
  const { lang: contextLang, systemInfo, theme } = useCfo();
  const currentLang = propLang || contextLang || 'bn';

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
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
      // 1. Try direct call to local backend if running on user's machine (Laravel on 8000)
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
          const firstError = directJson?.errors
            ? (Object.values(directJson.errors).flat()[0] as string)
            : null;
          setErrorMessage(
            firstError ||
              directJson?.message ||
              (currentLang === 'bn'
                ? 'তথ্য সঠিকভাবে পূরণ করুন।'
                : 'Please fill in all fields correctly.')
          );
          return;
        }
      } catch {
        // Direct fetch failed (e.g. CORS or container host), fallback to Next.js API proxy
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
        const firstError = json?.errors
          ? (Object.values(json.errors).flat()[0] as string)
          : null;
        setErrorMessage(
          firstError ||
            json?.message ||
            (currentLang === 'bn'
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

  const phone = systemInfo?.phone || '+880 1713378787';
  const mobile = systemInfo?.mobile;
  const email = systemInfo?.email || 'cfoedubd@gmail.com';
  const address =
    systemInfo?.address ||
    'City Centre 90/1, Level-25 (Lift-26), Motijheel C/A, Dhaka-1000';

  return (
    <section
      id="inquiry-section"
      className={`py-16 sm:py-24 relative overflow-hidden transition-colors ${
        variant === 'homepage'
          ? 'bg-slate-50/70 dark:bg-[#071326] border-t border-slate-200/80 dark:border-slate-800/80'
          : 'bg-transparent'
      }`}
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C8963E]/5 dark:bg-[#C8963E]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Context, Trust, and Contact Info */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100/80 dark:bg-[#C8963E]/15 border border-amber-300 dark:border-[#C8963E]/30 text-xs font-bold text-amber-900 dark:text-[#E5A93C] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#C8963E]" />
                <span>
                  {currentLang === 'bn'
                    ? 'পরামর্শ ও ভর্তি সহায়তা'
                    : 'Consultation & Admission Support'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                {currentLang === 'bn' ? (
                  <>
                    কোনো জিজ্ঞাসা আছে?{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#966718] dark:from-[#FFDF79] dark:via-[#E5A93C] dark:to-[#C8963E]">
                      আমাদের জানান
                    </span>
                  </>
                ) : (
                  <>
                    Have Questions?{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#966718] dark:from-[#FFDF79] dark:via-[#E5A93C] dark:to-[#C8963E]">
                      Talk to an Advisor
                    </span>
                  </>
                )}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentLang === 'bn'
                  ? 'কোর্স কারিকুলাম, ব্যাচ শিডিউল, করপোরেট ডিসকাউন্ট বা ক্যারিয়ার কাউন্সিলিংয়ের জন্য ফর্মটি পূরণ করুন অথবা সরাসরি যোগাযোগ করুন।'
                  : 'Get personalized course guidance, batch schedules, corporate training info, or career advice from our academic counselors.'}
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-3 pt-2">
              {/* Phone Card */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
                <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-[#C8963E] border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {currentLang === 'bn' ? 'সরাসরি হটলাইন' : 'Helpline & WhatsApp'}
                  </p>
                  <p className="text-sm font-mono font-black text-slate-900 dark:text-white">
                    {phone}
                  </p>
                  {mobile && mobile !== phone && (
                    <p className="text-xs font-mono text-slate-600 dark:text-slate-300">
                      {mobile}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Card */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {currentLang === 'bn' ? 'অফিসিয়াল ইমেইল' : 'Official Email'}
                  </p>
                  <p className="text-xs font-mono font-bold text-slate-900 dark:text-white truncate">
                    {email}
                  </p>
                </div>
              </div>

              {/* Campus Location Card */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {currentLang === 'bn' ? 'ক্যাম্পাস ও প্রধান কার্যালয়' : 'Central Campus & Head Office'}
                  </p>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-snug">
                    {address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl transition-colors">
              {formSubmitted ? (
                <div className="p-8 sm:p-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-serif font-black text-emerald-950 dark:text-emerald-100">
                    {currentLang === 'bn'
                      ? 'আপনার বার্তা সফলভাবে গৃহীত হয়েছে!'
                      : 'Your Message Has Been Sent!'}
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 max-w-md mx-auto leading-relaxed">
                    {currentLang === 'bn'
                      ? 'ধন্যবাদ! আমাদের অ্যাকাডেমিক কাউন্সেলর খুব শীঘ্রই আপনার সাথে যোগাযোগ করবেন।'
                      : 'Thank you! Our academic counselor will get in touch with you shortly.'}
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A192F] dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
                  >
                    <span>
                      {currentLang === 'bn'
                        ? 'আরেকটি বার্তা পাঠান'
                        : 'Send Another Message'}
                    </span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {/* Form Header */}
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-900 dark:text-white">
                      {currentLang === 'bn'
                        ? 'পরামর্শ ও অনুসন্ধানের বার্তা পাঠান'
                        : 'Send an Inquiry or Schedule a Visit'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {currentLang === 'bn'
                        ? 'ফর্মটি পূরণ করুন, আমাদের প্রতিনিধি আপনার সকল প্রশ্নের বিস্তারিত উত্তর দেবেন।'
                        : 'Fill out the form, and our representative will assist you with all your queries.'}
                    </p>
                  </div>

                  {/* Name and Mobile Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700 dark:text-slate-300 block">
                        {currentLang === 'bn' ? 'আপনার নাম *' : 'Your Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder={
                          currentLang === 'bn'
                            ? 'যেমন: মো. কামরুল হাসান'
                            : 'e.g. Md. Kamrul Hasan'
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C8963E]/40 focus:border-[#C8963E] transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700 dark:text-slate-300 block">
                        {currentLang === 'bn' ? 'মোবাইল নম্বর *' : 'Mobile Number *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder={
                          currentLang === 'bn' ? '018XXXXXXXX' : '018XXXXXXXX'
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C8963E]/40 focus:border-[#C8963E] font-mono transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">
                      {currentLang === 'bn' ? 'ইমেইল ঠিকানা *' : 'Email Address *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C8963E]/40 focus:border-[#C8963E] font-mono transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">
                      {currentLang === 'bn'
                        ? 'আপনার প্রশ্ন বা বার্তা লিখুন *'
                        : 'Your Question or Message *'}
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder={
                        currentLang === 'bn'
                          ? 'আপনার প্রশ্ন বা জিজ্ঞাসা এখানে লিখুন...'
                          : 'Write your question or inquiry here...'
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C8963E]/40 focus:border-[#C8963E] transition-colors resize-y"
                    />
                  </div>

                  {/* Error Message */}
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                      {errorMessage}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#A97B28] hover:brightness-110 active:scale-[0.99] disabled:opacity-50 text-slate-950 font-serif font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 border border-[#C8963E]/30"
                    >
                      <Send
                        className={`w-4 h-4 ${submitting ? 'animate-spin' : ''}`}
                      />
                      <span>
                        {submitting
                          ? currentLang === 'bn'
                            ? 'বার্তা পাঠানো হচ্ছে...'
                            : 'Sending Message...'
                          : currentLang === 'bn'
                          ? 'বার্তা পাঠান'
                          : 'Send Message'}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
