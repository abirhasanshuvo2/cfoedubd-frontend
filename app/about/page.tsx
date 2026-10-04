'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCfo } from '@/context/CfoContext';
import {
  Sparkles,
  Award,
  Building2,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Users,
  Compass
} from 'lucide-react';

export default function AboutPage() {
  const { lang, systemInfo, theme } = useCfo();

  const metrics = [
    { 
      number: '২,০০০+', 
      numberEn: '2000+', 
      label: 'নিবন্ধিত শিক্ষার্থী ও কর্পোরেট এক্সিকিউটিভ', 
      labelEn: 'Students' 
    },
    { 
      number: '৯৮%', 
      numberEn: '98%', 
      label: 'সফল গ্র্যাজুয়েট ও ক্যারিয়ার রূপান্তর হার', 
      labelEn: 'Graduates' 
    },
    { 
      number: '৯০+', 
      numberEn: '90+', 
      label: 'বিশেষায়িত প্রফেশনাল ক্লাস ও ল্যাব', 
      labelEn: 'Specialized Classes' 
    }
  ];

  return (
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col font-sans transition-colors ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}
    >
      <Navbar />

      {/* Hero Header */}
      <section className="relative bg-gradient-to-b from-amber-50/90 via-slate-50 to-white dark:from-[#0A192F] dark:via-[#0D254C] dark:to-[#0A192F] dark:bg-[#0A192F] text-slate-900 dark:text-white pt-16 pb-20 overflow-hidden border-b border-slate-200 dark:border-[#1E3A8A] transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(200,150,62,0.18),rgba(10,25,47,0))]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-[#1E3A8A]/50 border border-amber-300 dark:border-amber-400/40 text-xs font-bold text-amber-950 dark:text-[#FFC000] shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-[#FFC000]" />
            <span>
              {lang === 'bn'
                ? 'আরজেএসসি (RJSC) নিবন্ধিত নং: S-13064/2019 • বাণিজ্য মন্ত্রণালয়'
                : 'RJSC Reg. No: S-13064/2019 • Ministry of Commerce'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black text-slate-950 dark:text-white tracking-tight leading-tight">
            {lang === 'bn' ? (
              <>
                চার্টার্ড অফিসার লিমিটেড <br className="hidden sm:block" />
                <span className="text-amber-800 dark:text-[#FFC000]">
                  সিএফও ফাউন্ডেশন অব বাংলাদেশ
                </span>
              </>
            ) : (
              <>
                Chartered Officer Limited <br className="hidden sm:block" />
                <span className="text-amber-800 dark:text-[#FFC000]">
                  CFO Foundation of Bangladesh
                </span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
            {lang === 'bn'
              ? 'সিএফও ফাউন্ডেশন অব বাংলাদেশ (CFO BD) বর্তমান ও ভবিষ্যৎ চিফ ফাইন্যান্সিয়াল অফিসারদের সমন্বয়ে গঠিত একটি অলাভজনক সংগঠন যা সরকারের বাণিজ্য মন্ত্রণালয়ের অধীন আরজেএসসি (RJSC) নিবন্ধিত (রেজি নং: S-13064/2019)। চার্টার্ড অফিসার লিমিটেড (COL) প্রতিষ্ঠিত হয়েছে বাস্তবমুখী জ্ঞান ও প্রায়োগিক দক্ষতা প্রদানের মাধ্যমে পেশাজীবীদের কর্মক্ষেত্রে উৎপাদনশীলতা বৃদ্ধির লক্ষ্যে।'
              : 'The CFO Foundation of Bangladesh (CFO BD) is a non-profit organization comprised of current and future Chief Financial Officers (CFOs) registered with the RJSC, Ministry of Commerce, Government of Bangladesh (Reg: S-13064/2019). Chartered Officer Limited (COL) was established to provide knowledge and skills that considerably strengthen on-the-job productivity.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/courses"
              className="px-6 py-3 rounded-xl bg-[#FFC000] hover:bg-[#E6AC00] text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all border border-amber-300"
            >
              <span>{lang === 'bn' ? 'সব কোর্স দেখুন' : 'Explore Courses'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.8]" />
            </Link>

            <a
              href="#official-video"
              className="px-5 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
            >
              <span>{lang === 'bn' ? 'অফিসিয়াল ভিডিও দেখুন' : 'Watch Intro Video'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Metrics Banner (From cfoedubd.com/about) */}
      <section className="bg-white dark:bg-[#0D254C] text-slate-800 dark:text-white py-12 border-b border-slate-200 dark:border-[#1E3A8A] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              {lang === 'bn' ? 'অফিসিয়াল পরিসংখ্যান' : 'Key Benchmarks'}
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-950 dark:text-white mt-1">
              {lang === 'bn' ? 'cfoedubd.com অর্জন ও মাইলফলক' : 'Official Performance Metrics'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center max-w-4xl mx-auto">
            {metrics.map((m, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-amber-400 transition-all space-y-1"
              >
                <p className="text-3xl sm:text-4xl font-serif font-black text-amber-800 dark:text-[#FFC000]">
                  {lang === 'bn' ? m.number : m.numberEn}
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {lang === 'bn' ? m.label : m.labelEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-16">
        {/* Mission and Vision Grid (Exact from cfoedubd.com/mission) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'bn' ? 'আমাদের ভিশন (Our Vision)' : 'Our Vision'}</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-950 dark:text-white">
              {lang === 'bn' ? 'ইনোভেশন ও প্রায়োগিক ফাইন্যান্স শিক্ষায় শীর্ষস্থান' : 'Top Institute for Finance & FinTech Education'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {lang === 'bn'
                ? 'একটি উদ্ভাবনী, সময়োপযোগী ও বাস্তবমুখী প্রায়োগিক কারিকুলামের মাধ্যমে শিক্ষার্থীদের কর্মক্ষেত্রে সরাসরি উপযোগী ইন্ডাস্ট্রি-রেডি প্রফেশনাল হিসেবে রূপান্তর করে ফাইন্যান্স ও ফিনটেক শিক্ষায় বাংলাদেশের সবচেয়ে নির্ভরযোগ্য ও পছন্দের শীর্ষ প্রশিক্ষণ প্রতিষ্ঠান হিসেবে স্বীকৃতি অর্জন করা।'
                : 'To be the preferred training institute for finance and FinTech education, recognized for transforming students into industry-ready professionals through an innovative, relevant, and practical curriculum.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'bn' ? 'আমাদের মিশন (Our Mission)' : 'Our Mission'}</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-950 dark:text-white">
              {lang === 'bn' ? 'অপারেশনাল শ্রেষ্ঠত্ব ও গ্লোবাল প্রতিযোগিতা সক্ষমতা' : 'Operational Excellence & Competitive Edge'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {lang === 'bn'
                ? 'ফাইন্যান্স এবং ফাইন্যান্সিয়াল টেকনোলজিতে শীর্ষস্থানীয় পেশাদার প্রশিক্ষণ নিশ্চিত করা, যা শিক্ষার্থী ও করপোরেট প্রতিষ্ঠানসমূহকে অপারেশনাল উৎকর্ষ এবং গ্লোবাল মার্কেটপ্লেসে টেকসই প্রতিযোগিতামূলক সুবিধা অর্জনে সক্ষম করে তোলে।'
                : 'To provide top-notch professional training in finance and financial technology that enables individuals and organizations to achieve operational excellence and competitive edge in the global marketplace.'}
            </p>
          </div>
        </div>

        {/* Official Video Section (cfoedubd.com/about) */}
        <section id="official-video" className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {lang === 'bn' ? 'অফিসিয়াল ডকুমেন্টারি' : 'Official Introduction'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-white">
              {lang === 'bn' ? 'চার্টার্ড অফিসার লিমিটেডের ভিডিও পরিচিতি' : 'Chartered Officer Limited In Action'}
            </h3>
            <p className="text-xs text-slate-300">
              {lang === 'bn'
                ? 'সিএফও বাংলাদেশ কীভাবে প্রফেশনাল এক্সিকিউটিভ তৈরিতে ভূমিকা রাখছে তা সরাসরি দেখুন।'
                : 'Watch how we prepare finance and corporate executives for leadership.'}
            </p>
          </div>

          <div className="relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
            <iframe
              src="https://www.youtube.com/embed/-HeZs3qthR8?start=1&rel=0"
              title="Chartered Officer Limited Official Introduction"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </section>

        {/* Campus Location & Head Office */}
        <section className="bg-white dark:bg-[#0A192F] text-slate-900 dark:text-white rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-[#1E3A8A] space-y-8 shadow-xs transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#FFC000] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-600" />
                CAMPUS & HEAD OFFICE
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-black text-slate-950 dark:text-white">
                {systemInfo.address || (lang === 'bn'
                  ? 'সিটি সেন্টার ৯০/১, লেভেল-২৫ (লিফট-২৬), মতিঝিল বা/এ, ঢাকা-১০০০'
                  : 'City Centre 90/1, Level-25(Lift-26), Motijheel C/A, Dhaka-1000.')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {lang === 'bn'
                  ? 'দেশের প্রধান বাণিজ্যিক কেন্দ্র মতিঝিলের সর্বোচ্চ আধুনিক আইকনিক টাওয়ার সিটি সেন্টারে অবস্থিত চার্টার্ড অফিসার লিমিটেডের সেন্ট্রাল ক্যাম্পাস। কর্পোরেট এক্সিকিউটিভ সেমিনার রুম, এসএপি ক্লাউড কম্পিউটার ল্যাব এবং লাইভ হাইব্রিড স্টুডিও।'
                  : 'Located at City Centre Tower (Level 25) in Motijheel Commercial Area, equipped with executive boardroom classrooms, ERP labs, and multimedia streaming studios.'}
              </p>

              <div className="space-y-2 pt-2 text-xs text-slate-700 dark:text-slate-300 font-mono">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-600" />
                  <span>{systemInfo.phone || '+880 1713378787'}{systemInfo.mobile && systemInfo.mobile !== systemInfo.phone && ` / ${systemInfo.mobile}`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-600" />
                  <span className="font-sans">{systemInfo.email || 'cfoedubd@gmail.com'}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-amber-400/40 p-6 space-y-4">
              <h4 className="text-base font-serif font-bold text-amber-800 dark:text-[#FFC000] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                {lang === 'bn' ? 'আমাদের শিক্ষাদান অঙ্গীকার ও স্বীকৃতি' : 'Our Educational Commitment'}
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>অভিজ্ঞ ও উচ্চতর ডিগ্রিধারী প্রফেশনাল ইন্সট্রাক্টরদের সরাসরি মেন্টরশিপ।</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>জটিল বিষয়গুলোর সহজ ও প্রায়োগিক উপস্থাপনা (Hands-on Case Labs)।</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>অনলাইন লার্নিং ও রিসোর্স সাপোর্ট এবং আজীবন অ্যালামনাই নেটওয়ার্ক।</span>
                </li>
              </ul>

              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/courses"
                  className="px-5 py-2.5 rounded-xl bg-[#FFC000] hover:bg-[#E6AC00] text-slate-950 font-serif font-black text-xs shadow-md transition-all cursor-pointer border border-amber-300"
                >
                  {lang === 'bn' ? 'সকল কোর্স দেখুন' : 'Explore Courses'}
                </Link>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-serif font-bold text-xs border border-slate-300 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
                >
                  {lang === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
