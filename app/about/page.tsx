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
  const { lang, systemInfo } = useCfo();

  const metrics = [
    { 
      number: systemInfo.graduates ? `${systemInfo.graduates}+` : '৮৪০+', 
      numberEn: systemInfo.graduates ? `${systemInfo.graduates}+` : '840+', 
      label: 'সার্টিফাইড CFO ও PGD প্রফেশনাল', 
      labelEn: 'Certified CFO Graduates' 
    },
    { 
      number: systemInfo.students ? `${systemInfo.students}+` : '২৫+', 
      numberEn: systemInfo.students ? `${systemInfo.students}+` : '25+', 
      label: 'বছর সিনিয়র মেন্টরদের গড় অভিজ্ঞতা', 
      labelEn: 'Years Faculty Experience' 
    },
    { 
      number: systemInfo.classes ? `${systemInfo.classes}+` : '১৫০+', 
      numberEn: systemInfo.classes ? `${systemInfo.classes}+` : '150+', 
      label: 'কর্পোরেট ব্যাচ ও রিক্রুটমেন্ট নেটওয়ার্ক', 
      labelEn: 'Corporate Batches & Network' 
    },
    { number: '১০০%', numberEn: '100%', label: 'বিটিইবি ও আরজেএসসি সরকারি স্বীকৃতি', labelEn: 'BTEB & RJSC Accreditations' },
    { number: '৪.৯২/৫', numberEn: '4.92/5', label: 'গড় শিক্ষার্থী ও কর্পোরেট সন্তুষ্টি', labelEn: 'Executive Satisfaction' }
  ];

  const executivePillars = [
    {
      icon: <Award className="w-6 h-6 text-[#C8963E]" />,
      title: 'বোর্ডরুম ফাইন্যান্স ও স্ট্র্যাটেজিক লিডারশিপ',
      titleEn: 'Boardroom Finance & Strategic Leadership',
      description: 'থিওরি বা অ্যাকাউন্টিং জার্নাল মুখস্থের বাইরে এসে সরাসরি ডিএসই তালিকাভুক্ত কর্পোরেট ভ্যালুয়েশন, ক্যাপিটাল বাজেট ও মার্জার-অ্যাকুইজিশনের মতো সি-স্যুট সিদ্ধান্ত গ্রহণ ফ্রেমওয়ার্ক।',
      descriptionEn: 'Beyond routine bookkeeping. Practical decision-making models for enterprise valuation, treasury, debt financing, and board-level reporting.'
    },
    {
      icon: <Building2 className="w-6 h-6 text-blue-500" />,
      title: 'হ্যান্ডস-অন এসএপি-ফাইকো (SAP-FICO) ও ই-ট্যাক্স ল্যাব',
      titleEn: 'Hands-on SAP-FICO ERP & NBR Portals',
      description: 'লাইভ এসএপি এস/৪ হানা (S/4HANA) ক্লাউড ক্লায়েন্ট ও জাতীয় রাজস্ব বোর্ডের (NBR) ই-ট্যাক্স এবং মুসক ৯.১ অনলাইন পোর্টালে সরাসরি ইনপুট ও অডিট অনুশীলন।',
      descriptionEn: 'Hands-on live configuration in enterprise SAP S/4HANA ERP systems and direct filing on national NBR online tax/VAT portals.'
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-500" />,
      title: 'ফেলো চার্টার্ড অ্যাকাউন্ট্যান্টস (FCA/FCMA) মেন্টরশিপ',
      titleEn: 'Mentorship by Practicing FCAs & FCMAs',
      description: 'আইসিএবি (ICAB) ও আইসিএমএবি (ICMAB)-এর ফেলো সদস্য এবং শীর্ষস্থানীয় বহুজাতিক ও জাতীয় শিল্পগোষ্ঠীর চিফ ফাইন্যান্সিয়াল অফিসারদের সরাসরি ক্লাস ও কেস স্টাডি।',
      descriptionEn: 'Every module is developed and instructed by practicing Fellow Chartered Accountants and corporate CFOs with two decades of executive experience.'
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-purple-500" />,
      title: 'বিটিইবি রেজিস্টার্ড ও বার্ষিক সমাবর্তন (Convocation)',
      titleEn: 'Government Registered & Annual Convocation',
      description: 'বাংলাদেশ কারিগরি শিক্ষা বোর্ড (BTEB) নিবন্ধিত সম্মানজনক প্রফেশনাল ডিপ্লোমা এবং বর্ণাঢ্য বার্ষিক কনভোকেশনে গাউন ও সার্টিফিকেট প্রদান।',
      descriptionEn: 'Official government credentials recognized by public and private employers with verified certificates and grand annual convocation.'
    }
  ];

  const governingCouncil = [
    {
      name: 'মো. শফিকুল আলম, FCA, FCMA',
      role: 'প্রতিষ্ঠাতা ও প্রিন্সিপাল মেন্টর',
      roleEn: 'Founder & Principal Faculty',
      bio: '২৫ বছরেরও বেশি সময় ধরে দেশের শীর্ষস্থানীয় করপোরেট গ্রুপসমূহে প্রধান অর্থ কর্মকর্তা (CFO) ও সিনিয়র পার্টনার হিসেবে দায়িত্ব পালন করেছেন।',
      image: '/dummy-avatar.svg'
    },
    {
      name: 'মোহাম্মদ মনিরুজ্জামান, FCMA',
      role: 'ডিরেক্টর - ট্যাক্স ও রেগুলেটরি অ্যাফেয়ার্স',
      roleEn: 'Director - Tax & Regulatory Affairs',
      bio: 'জাতীয় রাজস্ব বোর্ড (NBR), কাস্টমস, বন্ড অডিট ও আয়কর আইন ২০২৩ এর অন্যতম শীর্ষ বিশেষজ্ঞ পরামর্শক।',
      image: '/dummy-avatar.svg'
    },
    {
      name: 'ফারুক আহমেদ, SAP Certified Solution Architect',
      role: 'হেড অব ফিনটেক ও এন্টারপ্রাইজ ইআরপি',
      roleEn: 'Head of Fintech & Enterprise ERP',
      bio: 'মাল্টিন্যাশনাল কোম্পানিগুলোতে SAP S/4HANA FICO এবং মাইক্রোসফট পাওয়ার বিআই বাস্তবায়নের আন্তর্জাতিক অভিজ্ঞতাসম্পন্ন টেকনোলজি লিডার।',
      image: '/dummy-avatar.svg'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />

      {/* Hero Header */}
      <section className="relative bg-[#0A192F] text-white pt-20 pb-24 overflow-hidden border-b border-[#1E3A8A]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(200,150,62,0.18),rgba(10,25,47,0))]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E3A8A]/50 border border-[#C8963E]/40 text-xs font-bold text-[#E5A93C]">
            <Sparkles className="w-3.5 h-3.5 text-[#C8963E]" />
            <span>{lang === 'bn' ? 'আমাদের পরিচিতি ও রূপকল্প' : 'About Chartered Officer Limited (COL)'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black text-white tracking-tight leading-tight">
            {lang === 'bn' ? (
              <>
                বাংলাদেশের করপোরেট ফিন্যান্স ও সি-স্যুট নেতৃত্বের <br className="hidden sm:block" />
                <span className="text-[#E5A93C]">শীর্ষ পেশাদার অ্যাকাডেমি</span>
              </>
            ) : (
              <>
                The Premier Institute for Corporate Finance <br className="hidden sm:block" />
                <span className="text-[#E5A93C]">& Boardroom CFO Leadership</span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {systemInfo.description || (lang === 'bn'
              ? 'চার্টার্ড অফিসার লিমিটেড (COL) বাংলাদেশ কারিগরি শিক্ষা বোর্ড (BTEB) নিবন্ধিত এবং যৌথ মূলধন কোম্পানি ও ফার্মসমূহের পরিদপ্তর (RJSC Reg. No. s-13064/2019) অনুমোদিত একটি বিশেষায়িত পেশাদার শিক্ষা প্রতিষ্ঠান। আমরা দেশের হিসাবরক্ষণ কর্মকর্তা ও ফাইন্যান্স প্রফেশনালদের আধুনিক সিএফও ও স্ট্র্যাটেজিক লিডার হিসেবে গড়ে তুলতে প্রতিশ্রুতিবদ্ধ।'
              : 'Chartered Officer Limited (COL) is Bangladesh’s leading executive finance academy, registered under RJSC (Reg. No. s-13064/2019, Govt. of Bangladesh) and affiliated with BTEB, shaping tomorrow’s CFOs and corporate leaders.')}
          </p>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="bg-[#0D254C] text-white py-10 border-b border-[#1E3A8A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
            {metrics.map((m, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-2xl sm:text-3xl font-serif font-black text-[#E5A93C]">
                  {lang === 'bn' ? m.number : m.numberEn}
                </p>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  {lang === 'bn' ? m.label : m.labelEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Pillars */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-16">
        {/* Mission and Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-[#966718] border border-amber-200 text-xs font-bold">
              <Compass className="w-3.5 h-3.5 text-[#C8963E]" />
              <span>{lang === 'bn' ? 'আমাদের ভিশন (Vision)' : 'Our Vision'}</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-900">
              {lang === 'bn' ? 'আন্তর্জাতিক মানসম্পন্ন করপোরেট লিডারশিপ তৈরি' : 'Empowering Global Financial Leadership'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {systemInfo.about_first_section || (lang === 'bn'
                ? 'বাংলাদেশের ব্যবসা-বাণিজ্য ও করপোরেট সেক্টরকে আন্তর্জাতিক মানে উন্নীত করতে সক্ষম সিএফও, ট্যাক্স পার্টনার এবং ফাইন্যান্সিয়াল আর্কিটেক্ট গড়ে তোলা, যারা সততা ও বাস্তব অভিজ্ঞতার সমন্বয়ে বোর্ডরুমে সিদ্ধান্ত দেবেন।'
                : 'To be the benchmark center of executive finance learning in South Asia, producing leaders capable of navigating complex macroeconomic, tax, and governance realities.')}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'bn' ? 'আমাদের মিশন (Mission)' : 'Our Mission'}</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-900">
              {lang === 'bn' ? 'তত্ত্ব ও বাস্তব কাজের দূরত্বের অবসান' : 'Bridging Academic Theory with Real Practice'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {systemInfo.about_second_section || (lang === 'bn'
                ? 'বিশ্বমানের কারিকুলাম, সরাসরি এসএপি-ফাইকো ক্লাউড ল্যাব, জাতীয় রাজস্ব বোর্ডের বাস্তব রিটার্ন ফাইলিং এবং আইসিএবি/আইসিএমএবি ফেলোদের সরাসরি মেন্টরশিপের মাধ্যমে পেশাদারদের হাতে-কলমে দক্ষ করা।'
                : 'Delivering hands-on boardroom case study pedagogy, automated tax modeling, and enterprise ERP training backed by recognized government credentials.')}
            </p>
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
              {lang === 'bn' ? 'চার্টার্ড অফিসার লিমিটেডের চার মূল ভিত্তি' : 'The Four Pillars of COL Excellence'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {lang === 'bn'
                ? 'আমাদের প্রতিটি প্রোগ্রাম করপোরেট দুনিয়ার কঠোর চাহিদা মাথায় রেখে ডিজাইন করা হয়েছে।'
                : 'Engineered specifically around accountability, boardroom decisions, and real career transitions.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {executivePillars.map((p, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs hover:border-[#C8963E] hover:shadow-xl transition-all space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  {p.icon}
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900">
                  {lang === 'bn' ? p.title : p.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {lang === 'bn' ? p.description : p.descriptionEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Council */}
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
              {lang === 'bn' ? 'নেতৃত্ব ও একাডেমিক কাউন্সিল' : 'Executive Leadership Council'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {lang === 'bn'
                ? 'আইসিএবি ও আইসিএমএবি ফেলো চার্টার্ড অ্যাকাউন্ট্যান্টস এবং করপোরেট সিএফওদের দিকনির্দেশনা।'
                : 'Guided by senior fellows, corporate directors, and licensed ERP solution architects.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {governingCouncil.map((mentor, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-lg transition-all text-center space-y-4"
              >
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#C8963E] shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-base font-serif font-bold text-slate-900">{mentor.name}</h4>
                  <p className="text-xs font-semibold text-[#966718] mt-1">{mentor.role}</p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{mentor.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Campus Location & Accreditation Card */}
        <section className="bg-[#0A192F] text-white rounded-3xl p-8 sm:p-12 border border-[#1E3A8A] space-y-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E5A93C] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#C8963E]" />
                CAMPUS & HEAD OFFICE
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-black text-white">
                {systemInfo.address || (lang === 'bn'
                  ? 'সিটি সেন্টার, লেভেল-২৫, মতিঝিল বা/এ, ঢাকা'
                  : 'City Centre, Level 25, Motijheel C/A, Dhaka')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {lang === 'bn'
                  ? 'দেশের প্রধান বাণিজ্যিক কেন্দ্র মতিঝিলের সর্বোচ্চ আধুনিক আইকনিক টাওয়ার সিটি সেন্টারে অবস্থিত চার্টার্ড অফিসার লিমিটেডের সেন্ট্রাল ক্যাম্পাস। কর্পোরেট এক্সিকিউটিভ সেমিনার রুম, এসএপি ক্লাউড কম্পিউটার ল্যাব এবং লাইভ হাইব্রিড স্টুডিও।'
                  : 'Located at City Centre Tower (Level 25) in Motijheel Commercial Area, equipped with executive boardroom classrooms, ERP labs, and multimedia streaming studios.'}
              </p>

              <div className="space-y-2 pt-2 text-xs text-slate-300 font-mono">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#C8963E]" />
                  <span>{systemInfo.phone || '+880 1713378787'}{systemInfo.mobile && systemInfo.mobile !== systemInfo.phone && ` / ${systemInfo.mobile}`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#C8963E]" />
                  <span className="font-sans">{systemInfo.email || 'cfoedubd@gmail.com'}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/90 rounded-2xl border border-[#C8963E]/40 p-6 space-y-4">
              <h4 className="text-base font-serif font-bold text-[#E5A93C] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C8963E]" />
                {lang === 'bn' ? 'সরকারি নিবন্ধন ও বৈধানিক স্বীকৃতি' : 'Government Affiliations & Accreditations'}
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>বাংলাদেশ কারিগরি শিক্ষা বোর্ড (BTEB) অনুমোদিত ও নিবন্ধিত প্রতিষ্ঠান।</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>যৌথ মূলধন কোম্পানি ও ফার্মসমূহের পরিদপ্তর (RJSC), বাণিজ্য মন্ত্রণালয় কর্তৃক বিধিবদ্ধ প্রতিষ্ঠান।</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>অনলাইন ২৪/৭ সার্টিফিকেট ভেরিফিকেশন ও ট্রান্সক্রিপ্ট রেকর্ড ডাটাবেস।</span>
                </li>
              </ul>

              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/admission"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 font-serif font-black text-xs shadow-md transition-all"
                >
                  {lang === 'bn' ? 'ভর্তি প্রক্রিয়া দেখুন' : 'Admission Process'}
                </Link>
                <Link
                  href="/verify-certificate"
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-serif font-bold text-xs border border-slate-700 transition-all"
                >
                  {lang === 'bn' ? 'সনদ যাচাই করুন' : 'Verify Certificate'}
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
