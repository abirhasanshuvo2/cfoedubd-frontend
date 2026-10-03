'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  ArrowRight,
  Radio,
  CheckCircle2,
  Video,
  User,
  Sparkles,
  ChevronRight,
  X,
  Send,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import { useCfo } from '@/context/CfoContext';
import { Course } from '@/data/cfo-data';

export interface FreeLiveDemoClass {
  id: string;
  category: string;
  categoryEn: string;
  categoryFilter: string;
  trackName: string;
  trackNameEn: string;
  title: string;
  titleEn: string;
  instructor: string;
  instructorRole: string;
  date: string;
  time: string;
  bannerImage: string;
  meetLink?: string;
  courseId?: string;
  isRegistered?: boolean;
}

const DEMO_CLASSES: FreeLiveDemoClass[] = [
  {
    id: 'demo-cfo-1',
    category: 'লিডারশিপ ও সিএফও',
    categoryEn: 'Leadership & CFO',
    categoryFilter: 'cfo',
    trackName: 'Chartered Financial Officer (CFO) Career Track',
    trackNameEn: 'Chartered Financial Officer (CFO) Career Track',
    title: 'একজন সফল সিএফও হতে ইন্ডাস্ট্রিতে কী কী কোর স্কিলসেট প্রয়োজন? ক্যারিয়ার অপরচুনিটিস ও রোডম্যাপ',
    titleEn: 'What Core Skillsets Are Required to Become a CFO? Career Opportunities & Executive Roadmap',
    instructor: 'আবুল কাশেম, এফসিএ, এফসিএমএ',
    instructorRole: 'Ex-Group CFO & Fellow Member of ICAB & ICMAB',
    date: 'Saturday, 10 October',
    time: '08:30 PM',
    bannerImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    meetLink: 'https://meet.google.com/cfo-live-demo',
    courseId: 'cfo-flagship-1yr',
  },
  {
    id: 'demo-vat-2',
    category: 'ভ্যাট ও কর আইন',
    categoryEn: 'VAT & Tax Law',
    categoryFilter: 'tax',
    trackName: 'Advanced Corporate VAT & Income Tax Specialization',
    trackNameEn: 'Advanced Corporate VAT & Income Tax Specialization',
    title: 'নতুন আয়কর ও ভ্যাট আইনে মূসক ৯.১ রিটার্ন তৈরি ও অডিট কমপ্লায়েন্স হ্যান্ডলিং কৌশল',
    titleEn: 'Mushak 9.1 Return Filing & Corporate Tax Audit Compliance Under New Act',
    instructor: 'অ্যাডভোকেট মো. জাহিদুল ইসলাম',
    instructorRole: 'Lead VAT Consultant & High Court Practitioner',
    date: 'Friday, 09 October',
    time: '09:00 PM',
    bannerImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    meetLink: 'https://meet.google.com/vat-tax-demo',
    courseId: 'pgd-vat-tax',
  },
  {
    id: 'demo-fintech-3',
    category: 'ফিনটেক ও অ্যানালিটিক্স',
    categoryEn: 'FinTech & Analytics',
    categoryFilter: 'fintech',
    trackName: 'Executive Financial Modeling & Business Intelligence',
    trackNameEn: 'Executive Financial Modeling & Business Intelligence',
    title: 'পাওয়ার বিআই ও অ্যাডভান্সড এক্সেল ব্যবহার করে ডাইনামিক ফাইন্যান্সিয়াল ড্যাশবোর্ড তৈরি',
    titleEn: 'Building Real-Time Dynamic Financial Dashboards with Power BI & Advanced Excel',
    instructor: 'তানভীর আহমেদ, সিএফএ',
    instructorRole: 'Director, Equity Research & FinTech Architect',
    date: 'Sunday, 11 October',
    time: '08:30 PM',
    bannerImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    meetLink: 'https://meet.google.com/fintech-demo-live',
    courseId: 'fintech-modeling',
  },
  {
    id: 'demo-free-tech-4',
    category: 'ফ্রি কোর্স ও টেকনোলজি',
    categoryEn: 'Free Courses & Tech',
    categoryFilter: 'tech',
    trackName: 'Full Stack App Engineering & Mobile Systems',
    trackNameEn: 'Full Stack App Engineering & Mobile Systems',
    title: 'ফ্রি লাইভ বুটক্যাম্প: আধুনিক ফিনটেক ও এন্টারপ্রাইজ অ্যাপ্লিকেশন ডেভেলপমেন্ট আর্কিটেকচার',
    titleEn: 'Free Live Bootcamp: Modern Enterprise & FinTech Mobile Application Development Architecture',
    instructor: 'Md. Abir Hasan',
    instructorRole: 'Principal Mobile Architect & Senior Full Stack Engineer',
    date: 'Monday, 12 October',
    time: '09:00 PM',
    bannerImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    meetLink: 'https://meet.google.com/tech-free-demo',
    courseId: 'CLS-CRVNJ2AKP1',
  },
];

interface FreeLiveDemoSectionProps {
  lang: 'bn' | 'en';
}

export default function FreeLiveDemoSection({ lang }: FreeLiveDemoSectionProps) {
  const { courses } = useCfo();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [activeModalDemo, setActiveModalDemo] = useState<FreeLiveDemoClass | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false);
  const [regForm, setRegForm] = useState({ name: '', phone: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Identify any free courses in the system (e.g. Flutter Courses price: 0)
  const freeCourses = useMemo(() => {
    return (courses || []).filter((c) => c.price === 0 || (c as any).isFree);
  }, [courses]);

  // Combine static demo classes with any actual free courses from API
  const allDemoClasses = useMemo(() => {
    const list = [...DEMO_CLASSES];

    // If there are free courses in database/context, integrate them as Free Live Demo entries!
    freeCourses.forEach((fc) => {
      if (!list.some((d) => d.courseId === fc.id || d.courseId === fc.slug)) {
        list.push({
          id: `free-course-${fc.id}`,
          category: fc.categoryLabel || 'ফ্রি কোর্স',
          categoryEn: fc.category || 'Free Course',
          categoryFilter: 'tech',
          trackName: fc.titleEn || fc.title,
          trackNameEn: fc.titleEn || fc.title,
          title: `১০০% ফ্রি লাইভ ক্লাস: ${fc.title} - স্পেশাল এনরোলমেন্ট অপরচুনিটি`,
          titleEn: `100% Free Live Class: ${fc.titleEn} - Special Enrollment Opportunity`,
          instructor: fc.educator || fc.mentors?.[0]?.name || 'Lead Technical Faculty',
          instructorRole: 'Professional Technology Instructor',
          date: 'Saturday, 10 October',
          time: '08:00 PM',
          bannerImage: fc.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
          meetLink: 'https://meet.google.com/free-cfo-course',
          courseId: fc.id,
        });
      }
    });

    return list;
  }, [freeCourses]);

  const categories = [
    { id: 'all', labelBn: 'সকল লাইভ ক্লাস', labelEn: 'All' },
    { id: 'cfo', labelBn: 'সিএফও ও লিডারশিপ', labelEn: 'Leadership & CFO' },
    { id: 'tax', labelBn: 'ভ্যাট ও ট্যাক্সেশন', labelEn: 'VAT & Tax Law' },
    { id: 'fintech', labelBn: 'ফিনটেক ও অ্যানালিটিক্স', labelEn: 'FinTech & Analytics' },
    { id: 'tech', labelBn: 'ফ্রি কোর্স ও টেক', labelEn: 'Free Courses & Tech' },
  ];

  const filteredDemos = useMemo(() => {
    if (selectedFilter === 'all') return allDemoClasses;
    return allDemoClasses.filter((item) => item.categoryFilter === selectedFilter);
  }, [selectedFilter, allDemoClasses]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.phone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setRegistrationSuccess(true);
    }, 600);
  };

  const openDemoModal = (demo: FreeLiveDemoClass) => {
    setActiveModalDemo(demo);
    setRegistrationSuccess(false);
  };

  const closeDemoModal = () => {
    setActiveModalDemo(null);
    setRegistrationSuccess(false);
  };

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Container: Dark navy rounded canvas (Exact match to screenshot) */}
      <div className="bg-[#0B1528] rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#C8963E]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header with [🔴 LIVE] pill & Free Live Demo Class Title */}
        <div className="text-center relative z-10 mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center gap-2.5 mb-3">
            {/* Pulsing LIVE badge with rays */}
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-md bg-rose-500 opacity-60" />
              <span className="relative px-2.5 py-1 rounded-md bg-[#E62E2D] text-white font-black text-xs tracking-wider flex items-center gap-1 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                LIVE
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-white tracking-tight">
              {lang === 'bn' ? 'ফ্রি লাইভ ডেমো ক্লাস' : 'Free Live Demo Class'}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {lang === 'bn'
              ? 'ইনস্টিটিউটের শীর্ষ কর্পোরেট লিডার ও সিএফওদের সরাসরি ইন্টারঅ্যাক্টিভ ফ্রি ডেমো সেশনে অংশ নিন এবং লাইভ প্রশ্ন করার সুযোগ উপভোগ করুন।'
              : 'Join real-time interactive demo sessions hosted by industry CFOs and corporate mentors. Zero cost, 100% interactive.'}
          </p>
        </div>

        {/* Category Pills Row (Exact match to screenshot) */}
        <div className="relative z-10 flex items-center justify-between gap-3 mb-8 pb-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {categories.map((cat) => {
              const isActive = selectedFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFilter(cat.id)}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                    isActive
                      ? 'bg-white text-slate-950 shadow-md ring-2 ring-white/50 scale-[1.02]'
                      : 'bg-[#132238] border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-[#1A2E4C]'
                  }`}
                >
                  {lang === 'bn' ? cat.labelBn : cat.labelEn}
                </button>
              );
            })}
          </div>

          {/* Right Chevron Navigation Indicator */}
          <button
            onClick={() => {
              const nextIndex = (categories.findIndex((c) => c.id === selectedFilter) + 1) % categories.length;
              setSelectedFilter(categories[nextIndex].id);
            }}
            className="hidden sm:flex w-9 h-9 rounded-full bg-white text-slate-900 shadow-md items-center justify-center hover:bg-slate-100 transition-colors shrink-0 ml-2 cursor-pointer"
            aria-label="Next Category"
            title="Next Category"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Grid of Free Live Demo Class Cards (Exact match to screenshot) */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDemos.map((demo) => (
            <div
              key={demo.id}
              className="bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 group"
            >
              {/* Card Image Banner */}
              <div>
                <div className="h-44 sm:h-48 w-full relative overflow-hidden bg-slate-950">
                  <Image
                    src={demo.bannerImage}
                    alt={demo.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                  {/* Top-Left: ((•)) Live Pill Badge (Exact Match) */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-xs text-rose-600 font-bold text-[11px] flex items-center gap-1.5 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                      <span>Live</span>
                    </span>
                  </div>

                  {/* Free Tag Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[10px] uppercase tracking-wider shadow-md">
                      100% Free
                    </span>
                  </div>

                  {/* Topic Overlay Banner Text */}
                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-mono font-semibold text-amber-300">
                      {demo.trackName}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 space-y-3">
                  {/* Track category label */}
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider line-clamp-1">
                    {lang === 'bn' ? demo.category : demo.categoryEn}
                  </p>

                  {/* Bengali Title / Key Question (2-line clamp) */}
                  <h3 className="font-serif font-bold text-slate-950 text-sm sm:text-base leading-snug line-clamp-2 min-h-[2.75rem] group-hover:text-[#C8963E] transition-colors">
                    {lang === 'bn' ? demo.title : demo.titleEn}
                  </h3>

                  {/* Instructor name */}
                  <div className="flex items-center gap-2 pt-1 text-xs text-slate-600">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="line-clamp-1 font-medium">{demo.instructor}</span>
                  </div>

                  {/* Date & Time with Red Calendar Icon */}
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-xs pt-1">
                    <Calendar className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>
                      {demo.date} , {demo.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom SEE DETAILS Button (Exact match) */}
              <div className="p-4 sm:p-5 pt-0">
                <button
                  onClick={() => openDemoModal(demo)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-[#C8963E] text-slate-900 hover:text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs hover:shadow-md"
                >
                  <span>{lang === 'bn' ? 'SEE DETAILS' : 'SEE DETAILS'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Helper Bar */}
        <div className="relative z-10 mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>
              {lang === 'bn'
                ? 'সকল ডেমো ক্লাস রিয়েল-টাইম গুগল মিট ও জুমের মাধ্যমে সরাসরি সম্প্রচারিত হয়।'
                : 'All demo classes are broadcast live via interactive Google Meet & Zoom.'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/courses"
              className="text-[#FFC000] hover:underline font-bold inline-flex items-center gap-1"
            >
              <span>{lang === 'bn' ? 'সকল পেইড ও ফ্রি কোর্স দেখুন' : 'Explore All Courses'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* Free Demo Registration / Details Modal */}
      {activeModalDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#0B1528] text-white p-6 relative">
              <button
                onClick={closeDemoModal}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-black text-[10px] tracking-wider uppercase animate-pulse">
                  LIVE DEMO
                </span>
                <span className="text-xs text-amber-300 font-semibold">100% Free Access</span>
              </div>

              <h3 className="font-serif font-black text-lg sm:text-xl text-white leading-snug">
                {lang === 'bn' ? activeModalDemo.title : activeModalDemo.titleEn}
              </h3>

              <p className="text-xs text-slate-300 mt-2">
                {activeModalDemo.trackName} • {activeModalDemo.instructor}
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Session Meta */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-slate-400">তারিখ / Date</span>
                    <span className="font-bold">{activeModalDemo.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <Clock className="w-4 h-4 text-[#C8963E] shrink-0" />
                  <div>
                    <span className="block text-[10px] text-slate-400">সময় / Time</span>
                    <span className="font-bold">{activeModalDemo.time}</span>
                  </div>
                </div>
              </div>

              {registrationSuccess ? (
                /* Success View with Direct Join Link */
                <div className="text-center py-4 space-y-4 animate-in fade-in">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      {lang === 'bn' ? 'রেজিস্ট্রেশন সফল হয়েছে!' : 'Registration Confirmed!'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      {lang === 'bn'
                        ? 'আপনার ফ্রি সিট সংরক্ষিত হয়েছে। নিচের লিংকে ক্লিক করে সরাসরি লাইভ সেশনে যোগ দিন:'
                        : 'Your free seat is reserved. Click below to enter the live demo room:'}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-mono break-all text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {activeModalDemo.meetLink}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <a
                      href={activeModalDemo.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Video className="w-4 h-4" />
                      <span>{lang === 'bn' ? 'সরাসরি ক্লাসে যোগ দিন' : 'Join Live Class Now'}</span>
                    </a>

                    <button
                      onClick={closeDemoModal}
                      className="py-3 px-5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs"
                    >
                      {lang === 'bn' ? 'সম্পন্ন' : 'Done'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Registration Form */
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {lang === 'bn'
                      ? 'ফ্রি লাইভ ক্লাসে অংশ নিতে আপনার তথ্য দিন:'
                      : 'Enter your details to receive instant free access:'}
                  </p>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'bn' ? 'আপনার পুরো নাম *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Md. Tanvir Hasan"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#C8963E] focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'bn' ? 'মোবাইল নম্বর *' : 'Phone Number *'}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="017XXXXXXXX"
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-[#C8963E] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'bn' ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
                      </label>
                      <input
                        type="email"
                        placeholder="you@company.com"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#C8963E] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#A97B28] hover:brightness-110 text-slate-950 font-serif font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>
                        {isSubmitting
                          ? lang === 'bn'
                            ? 'প্রক্রিয়াধীন...'
                            : 'Processing...'
                          : lang === 'bn'
                          ? 'ফ্রি সিট বুক করুন ও লিংক পান'
                          : 'Book Free Seat & Get Live Link'}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
