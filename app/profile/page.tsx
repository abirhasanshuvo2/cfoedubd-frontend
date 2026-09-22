'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCfo } from '@/context/CfoContext';
import { COURSES, CERTIFICATES_DB } from '@/data/cfo-data';
import {
  User,
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  Clock,
  ShieldCheck,
  FileText,
  TrendingUp,
  Settings,
  Flame,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  LogOut
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { lang, user, enrolledCourses, logoutUser } = useCfo();
  const [activeTab, setActiveTab] = useState<'courses' | 'certificates' | 'settings'>('courses');

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  };

  // Fallback demo user if none logged in
  const currentUser = user || {
    name: 'তানভীর হাসান',
    email: 'tanvir.hasan@example.com',
    phone: '+880 1711-223344',
  };

  const userCertificates = CERTIFICATES_DB.slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Profile Header Canvas */}
      <section className="bg-slate-950 text-white border-b border-slate-800 pt-10 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,192,0,0.15),rgba(255,255,255,0))]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-1 shadow-lg">
                  <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-3xl font-black text-[#FFC000]">
                    {currentUser.name.charAt(0)}
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-2 border-slate-950 rounded-full flex items-center justify-center text-white text-xs">
                  ✓
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{currentUser.name}</h1>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-[#FFC000] border border-amber-500/30 text-[10px] font-bold">
                    PRO STUDENT
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">{currentUser.email} • {currentUser.phone}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <strong>৭ দিনের</strong> স্ট্রিক
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                    <strong>{enrolledCourses.length || 1}টি</strong> একটিভ কোর্স
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5">
              <Link
                href="/classroom"
                className="px-4 py-2.5 rounded-xl bg-[#FFC000] hover:bg-[#ffb000] text-slate-950 font-black text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                <span>{lang === 'bn' ? 'আমার ক্লাসরুমে যান' : 'Go to Classroom'}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3.5 py-2.5 rounded-xl border border-slate-800 hover:border-rose-800/80 bg-slate-900/80 hover:bg-rose-950/40 text-rose-400 font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer"
                title="লগআউট করে ওয়েবসাইটে ফিরুন"
              >
                <LogOut className="w-4 h-4" />
                <span>{lang === 'bn' ? 'লগআউট' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Profile Workspace */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'courses'
                ? 'bg-slate-950 text-[#FFC000]'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{lang === 'bn' ? 'এনরোল করা কোর্সসমূহ' : 'My Enrolled Courses'}</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'certificates'
                ? 'bg-slate-950 text-[#FFC000]'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{lang === 'bn' ? 'অর্জিত সার্টিফিকেট' : 'My Certificates'}</span>
          </button>
        </div>

        {/* Tab 1: Enrolled Courses */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(enrolledCourses.length > 0 ? enrolledCourses : [COURSES[0]]).map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                        {course.batchNumber}
                      </span>
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        চলমান ব্যাচ
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 leading-snug">
                      {lang === 'bn' ? course.title : course.titleEn}
                    </h3>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs text-slate-600 font-medium">
                        <span>কোর্স অগ্রগতি</span>
                        <span className="font-bold text-slate-900">৬৫% সমাপ্ত</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-400 to-[#FFC000] w-[65%]" />
                      </div>
                    </div>

                    <div className="pt-2 text-xs text-slate-500 space-y-1">
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>শিডিউল: {course.schedule}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>পরবর্তী লাইভ ক্লাস: আজ রাত ০৯:০০ টা</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/courses/${course.id}`}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      সিলেবাস দেখুন
                    </Link>

                    <Link
                      href="/classroom"
                      className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-[#FFC000] font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <span>লাইভ ক্লাসে যোগ দিন</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Certificates */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                        <Award className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-500">{cert.credentialId}</span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ভেরিফাইড
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-slate-900">{cert.courseTitle}</h4>
                    <p className="text-xs text-slate-500 mt-1">ইস্যু ডেট: {cert.issueDate} • গ্রেড: {cert.grade}</p>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <Link
                      href={`/verify-certificate?id=${cert.credentialId}`}
                      className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-[#C8963E] text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>অনলাইনে যাচাই করুন</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer lang={lang} />
    </div>
  );
}
