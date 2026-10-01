'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Video,
  PlayCircle,
  FileCheck,
  Award,
  Calendar,
  ExternalLink,
  Clock,
  Download,
  BookOpen,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Course } from '@/data/cfo-data';

interface StudentLmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrolledCourses: Course[];
  lang: 'bn' | 'en';
}

export default function StudentLmsModal({
  isOpen,
  onClose,
  enrolledCourses,
  lang,
}: StudentLmsModalProps) {
  const [activeTab, setActiveTab] = useState<'classes' | 'recordings' | 'tasks' | 'certificate'>('classes');
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    enrolledCourses[0]?.id || 'course-mern-ai'
  );

  if (!isOpen) return null;

  const currentCourse =
    enrolledCourses.find((c) => c.id === selectedCourseId) || enrolledCourses[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col my-auto">
        {/* Header */}
        <div className="bg-slate-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFC000] text-slate-950 font-black flex items-center justify-center text-lg shadow-sm">
              O
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  {lang === 'bn' ? 'আমার ক্লাসরুম (Student LMS Dashboard)' : 'My Student Classroom'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Active Student
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'লাইভ ক্লাস, রেকর্ডিং এবং প্রজেক্ট সাবমিশন পোর্টাল' : 'Live classes, recordings & project submissions'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('classes')}
            className={`py-3 px-4 border-b-2 font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'classes'
                ? 'border-[#FFC000] text-slate-950 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-4 h-4 text-rose-500" />
            <span>{lang === 'bn' ? 'লাইভ ক্লাস' : 'Live Class'}</span>
          </button>

          <button
            onClick={() => setActiveTab('recordings')}
            className={`py-3 px-4 border-b-2 font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'recordings'
                ? 'border-[#FFC000] text-slate-950 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlayCircle className="w-4 h-4 text-amber-500" />
            <span>{lang === 'bn' ? 'ক্লাস রেকর্ডিং' : 'Recordings'}</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-3 px-4 border-b-2 font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'tasks'
                ? 'border-[#FFC000] text-slate-950 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-4 h-4 text-blue-500" />
            <span>{lang === 'bn' ? 'টাস্ক ও গ্রেডিং' : 'Tasks & Feedback'}</span>
          </button>

          <button
            onClick={() => setActiveTab('certificate')}
            className={`py-3 px-4 border-b-2 font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'certificate'
                ? 'border-[#FFC000] text-slate-950 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-500" />
            <span>{lang === 'bn' ? 'সার্টিফিকেট' : 'Certificate'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Enrolled Course Selector */}
          {enrolledCourses.length > 1 && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">
                {lang === 'bn' ? 'বর্তমান কোর্স:' : 'Selected Track:'}
              </span>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-300 bg-white outline-none"
              >
                {enrolledCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.batchNumber})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Tab 1: Live Class */}
          {activeTab === 'classes' && (
            <div className="space-y-6">
              {/* Today's Live Class Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-orange-50 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                      {lang === 'bn' ? 'আজকের লাইভ সেশন' : "Today's Live Class"}
                    </span>
                    <span className="text-xs bg-slate-900 text-white font-mono px-2 py-0.5 rounded">
                      Class #18
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-950">
                    Next.js 15 Server Actions & Optimistic State Updates
                  </h4>
                  <p className="text-xs text-slate-600 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>রাত ৯:০০ টা - ১১:০০ টা (শুরু হতে ৩০ মিনিট বাকি)</span>
                  </p>
                </div>

                <button
                  onClick={() => alert(lang === 'bn' ? 'ওস্তাদ লাইভ জুম সেশনে যুক্ত হচ্ছেন...' : 'Connecting to Live Zoom room...')}
                  className="px-5 py-3 rounded-xl bg-[#FFC000] hover:bg-[#ffb000] text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Video className="w-4 h-4 text-slate-950" />
                  <span>{lang === 'bn' ? 'লাইভ ক্লাসে জয়েন করুন' : 'Join Zoom Room'}</span>
                </button>
              </div>

              {/* Mentors on Duty */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentCourse.mentors[0]?.avatar || '/dummy-avatar.svg'}
                      alt={currentCourse.mentors[0]?.name}
                      onError={(e) => {
                        e.currentTarget.src = '/dummy-avatar.svg';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{currentCourse.mentors[0]?.name}</p>
                    <p className="text-slate-600">
                      {currentCourse.mentors[0]?.role} @ {currentCourse.mentors[0]?.company}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Support Desk Online
                  </span>
                  <p className="text-[10px] text-slate-500">Google Meet 1:1 Desk</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Recordings */}
          {activeTab === 'recordings' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-slate-900">
                  {lang === 'bn' ? 'পূর্ববর্তী ক্লাসের রেকর্ডিং তালিকা' : 'Past Class Recordings'}
                </h4>
                <span className="text-xs text-slate-500">১৭ টি রেকর্ডিং অ্যাভেইলেবল</span>
              </div>

              {[
                { classNo: 17, title: 'React 19 Server Components Deep Dive', duration: '১ ঘণ্টা ৪২ মিনিট', date: '৮ সেপ্টেম্বর, ২০২৬' },
                { classNo: 16, title: 'Advanced Zustand State Architecture', duration: '১ ঘণ্টা ৫৫ মিনিট', date: '৬ সেপ্টেম্বর, ২০২৬' },
                { classNo: 15, title: 'Tailwind CSS v4 & Modern Layouts', duration: '১ ঘণ্টা ৩৭ মিনিট', date: '৩ সেপ্টেম্বর, ২০২৬' },
                { classNo: 14, title: 'Node.js Event Loop & Performance', duration: '২ ঘণ্টা ০৪ মিনিট', date: '১ সেপ্টেম্বর, ২০২৬' },
              ].map((rec) => (
                <div
                  key={rec.classNo}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-300 transition-colors flex items-center justify-between gap-4 bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center shrink-0">
                      #{rec.classNo}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{rec.title}</p>
                      <p className="text-xs text-slate-500">
                        {rec.duration} • {rec.date}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`ক্লাস #${rec.classNo} এর ভিডিও প্লেয়ার ওপেন হচ্ছে...`)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-900 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>দেখুন</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Tasks & Homework */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-blue-900">
                    {lang === 'bn' ? 'টাস্ক স্ট্যাটাস সামারি' : 'Task Status Summary'}
                  </p>
                  <p className="text-blue-700">১২টি অ্যাসাইনমেন্ট সাবমিট করা হয়েছে • গড় স্কোর ৯২%</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-black text-xs">
                  A+ Grade
                </span>
              </div>

              {[
                { title: 'Assignment 12: Build a Next.js Server Action with Zod validation', status: 'Graded (95/100)', mentorFeedback: 'এক্সিল্যান্ট কোড স্ট্রাকচার! এরর হ্যান্ডলিং খুব ভালো হয়েছে।' },
                { title: 'Assignment 11: Implement MongoDB Aggregation Pipeline for Analytics', status: 'Graded (90/100)', mentorFeedback: 'ভালো কাজ, ইন্ডেক্সিং আরও অপ্টিমাইজ করা সম্ভব।' },
                { title: 'Assignment 13: E-Commerce Cart with Optimistic State', status: 'Pending Review', mentorFeedback: 'মেন্টর রিভিউ প্রক্রিয়াধীন' }
              ].map((task, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-slate-900">{task.title}</p>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      task.status.includes('Graded') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-800">মেন্টর ফিডব্যাক:</span> {task.mentorFeedback}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Certificate Preview */}
          {activeTab === 'certificate' && (
            <div className="p-6 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/40 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#FFC000] text-slate-950 flex items-center justify-center mx-auto shadow-sm">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest">
                  Chartered Officer & CFO Bangladesh Verified Certificate
                </span>
                <h4 className="text-lg font-black text-slate-950 mt-1">
                  Chartered Financial Officer (CFO) Executive Leadership
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                  Awarded to <strong className="text-slate-900">Abir Hasan</strong> upon fulfilling all boardroom simulation cases, financial modelling submissions, and final executive assessment.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 p-2 rounded-lg bg-white border border-amber-200 text-xs text-slate-700 font-mono">
                <span>Certificate ID: CFO-2026-CERT-88412</span>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="/api/enrollment/certificates/222/download"
                  download="Certificate-222.pdf"
                  className="px-5 py-2.5 rounded-xl bg-[#0A192F] hover:bg-[#1E3A8A] text-white font-bold text-xs transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4 text-[#FFC000]" />
                  <span>{lang === 'bn' ? 'সার্টিফিকেট ডাউনলোড করুন (PDF)' : 'Download Verified PDF Certificate'}</span>
                </a>

                <Link
                  href="/certificates?registration_id=222"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer border border-amber-300"
                >
                  <Award className="w-4 h-4 text-amber-700" />
                  <span>{lang === 'bn' ? 'ভেরিফিকেশন পোর্টাল' : 'Open Verification Portal'}</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
