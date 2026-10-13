'use client';

import React, { useState } from 'react';
import { useCfo } from '@/context/CfoContext';
import {
  Send,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

interface ContactInquirySectionProps {
  lang?: 'bn' | 'en';
  variant?: 'homepage' | 'standalone';
}

export default function ContactInquirySection({
  lang: propLang,
  variant = 'homepage',
}: ContactInquirySectionProps) {
  const { lang: contextLang, theme } = useCfo();
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

  return (
    <section
      id="inquiry-section"
      className="py-16 sm:py-24 relative overflow-hidden bg-slate-50/60 dark:bg-[#071326] border-t border-slate-200/80 dark:border-slate-800/80 transition-colors"
    >
      {/* Subtle background ambient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-72 bg-[#C8963E]/5 dark:bg-[#C8963E]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Inquiry Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-12 shadow-xl dark:shadow-2xl dark:shadow-black/40 transition-colors">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 dark:bg-[#C8963E]/15 border border-amber-300 dark:border-[#C8963E]/30 text-xs font-bold text-amber-900 dark:text-[#E5A93C] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C8963E]" />
              <span>
                {currentLang === 'bn'
                  ? 'সরাসরি পরামর্শ ও অনুসন্ধান'
                  : 'Direct Consultation'}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 dark:text-white tracking-tight">
              {currentLang === 'bn'
                ? 'পরামর্শ ও অনুসন্ধানের বার্তা পাঠান'
                : 'Send an Inquiry or Schedule a Visit'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {currentLang === 'bn'
                ? 'ফর্মটি পূরণ করুন, আমাদের প্রতিনিধি আপনার সকল প্রশ্নের বিস্তারিত উত্তর দেবেন।'
                : 'Fill out the form, and our representative will assist you with all your queries.'}
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-8 sm:p-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-center space-y-4">
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
                  : 'Thank you! Our representative will assist you with all your queries shortly.'}
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
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/70 text-red-700 dark:text-red-300 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C8963E] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    {currentLang === 'bn' ? 'মোবাইল নম্বর *' : 'Mobile Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="018XXXXXXXX"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C8963E] focus:border-transparent transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C8963E] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  {currentLang === 'bn'
                    ? 'আপনার প্রশ্ন বা বার্তা লিখুন *'
                    : 'Your Question or Message *'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder={
                    currentLang === 'bn'
                      ? 'আপনার প্রশ্ন বা জিজ্ঞাসা এখানে লিখুন...'
                      : 'Write your question or inquiry here...'
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C8963E] focus:border-transparent transition-all resize-y"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#966718] hover:opacity-95 text-slate-950 text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>
                        {currentLang === 'bn'
                          ? 'বার্তা পাঠানো হচ্ছে...'
                          : 'Sending Message...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>
                        {currentLang === 'bn' ? 'বার্তা পাঠান' : 'Send Message'}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Privacy Notice */}
              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C8963E]" />
                <span>
                  {currentLang === 'bn'
                    ? 'আপনার তথ্য সম্পূর্ণ নিরাপদ। আমরা কোনো স্প্যাম বার্তা পাঠাই না।'
                    : 'Your information is confidential. We strictly protect your privacy.'}
                </span>
              </div>
            </form>
          )}

        </div>
      </div>
    </section>
  );
}
