'use client';

import React, { useState } from 'react';
import {
  X,
  Compass,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
  ChevronRight
} from 'lucide-react';
import { COURSES, Course } from '@/data/cfo-data';

interface CareerQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'bn' | 'en';
  onSelectCourse: (course: Course) => void;
}

export default function CareerQuizModal({
  isOpen,
  onClose,
  lang,
  onSelectCourse,
}: CareerQuizModalProps) {
  const [step, setStep] = useState<number>(1);
  const [background, setBackground] = useState<string>('');
  const [interest, setInterest] = useState<string>('');
  const [timeCommitment, setTimeCommitment] = useState<string>('');

  if (!isOpen) return null;

  const getRecommendedCourse = (): Course => {
    if (interest === 'devops') {
      return COURSES.find((c) => c.id === 'course-devops-ai') || COURSES[0];
    }
    if (interest === 'design') {
      return COURSES.find((c) => c.id === 'course-uiux-ai') || COURSES[0];
    }
    if (interest === 'data') {
      return COURSES.find((c) => c.id === 'course-data-science') || COURSES[0];
    }
    if (interest === 'marketing') {
      return COURSES.find((c) => c.id === 'course-digital-marketing') || COURSES[0];
    }
    return COURSES.find((c) => c.id === 'course-mern-ai') || COURSES[0];
  };

  const recommended = getRecommendedCourse();

  const handleRestart = () => {
    setStep(1);
    setBackground('');
    setInterest('');
    setTimeCommitment('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-slate-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#FFC000]" />
            <h3 className="font-bold text-sm sm:text-base">
              {lang === 'bn' ? 'ক্যারিয়ার ট্র্যাক ফাইন্ডার' : 'Career Track Finder'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-[#FFC000] h-1.5 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Quiz Steps */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  Question 1 of 3
                </span>
                <h4 className="text-lg font-bold text-slate-950">
                  {lang === 'bn' ? 'আপনার বর্তমান ব্যাকগ্রাউন্ড কি?' : 'What is your current background?'}
                </h4>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: 'cse', label: 'সিএসই বা আইটি স্টুডেন্ট / গ্র্যাজুয়েট (CSE / IT)' },
                  { id: 'non-cse', label: 'নন-সিএসই স্টুডেন্ট (ব্যবসা, মানবিক বা অন্যান্য সায়েন্স)' },
                  { id: 'working', label: 'কর্মজীবী প্রফেশনাল (টেক ক্যারিয়ারে সুইচ করতে আগ্রহী)' },
                  { id: 'freelancer', label: 'ফ্রিল্যান্সার (দক্ষতা আরও আপগ্রেড করতে চাই)' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setBackground(opt.id);
                      setStep(2);
                    }}
                    className="w-full p-3.5 text-left rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-xs sm:text-sm font-semibold text-slate-800 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span>{opt.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  Question 2 of 3
                </span>
                <h4 className="text-lg font-bold text-slate-950">
                  {lang === 'bn' ? 'কোন ক্ষেত্রে কাজ করতে সবচেয়ে বেশি ভালো লাগে?' : 'What interests you the most?'}
                </h4>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: 'web', label: 'ওয়েবসাইট ও পূর্ণাঙ্গ ওয়েব অ্যাপ্লিকেশন বিল্ড করা (Web & Full Stack)' },
                  { id: 'devops', label: 'সার্ভার, ক্লাউড অটোমেশন ও কুবারনেটিস (Cloud & DevOps)' },
                  { id: 'design', label: 'অ্যাপ বা ওয়েবসাইটের আকর্ষণীয় ইউজার ইন্টারফেস ডিজাইন (UI/UX)' },
                  { id: 'data', label: 'ডাটা অ্যানালাইসিস ও মেশিন লার্নিং (Data Science & AI)' },
                  { id: 'marketing', label: 'অনলাইন বিজনেস গ্রোথ ও বিজ্ঞাপন ক্যাম্পেইন (Digital Marketing)' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setInterest(opt.id);
                      setStep(3);
                    }}
                    className="w-full p-3.5 text-left rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-xs sm:text-sm font-semibold text-slate-800 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span>{opt.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  Question 3 of 3
                </span>
                <h4 className="text-lg font-bold text-slate-950">
                  {lang === 'bn' ? 'সপ্তাহে কত সময় অনুশীলনের জন্য দিতে পারবেন?' : 'How much weekly time can you commit?'}
                </h4>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: 'part-time', label: 'সপ্তাহে ৮-১০ ঘণ্টা (চাকরি বা পড়ার পাশাপাশি)' },
                  { id: 'full-time', label: 'সপ্তাহে ১৫-২০ ঘণ্টা (পুরো ফোকাস দিয়ে দ্রুত জব রেডি হতে)' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setTimeCommitment(opt.id);
                      setStep(4);
                    }}
                    className="w-full p-3.5 text-left rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-xs sm:text-sm font-semibold text-slate-800 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span>{opt.label}</span>
                    <CheckCircle2 className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Output Recommended Track */}
          {step === 4 && (
            <div className="text-center space-y-5">
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7 text-amber-600" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  {lang === 'bn' ? 'আপনার জন্য সেরা সুপারিশকৃত ট্র্যাক' : 'Your Recommended Career Track'}
                </span>
                <h3 className="text-xl font-black text-slate-950 mt-1">
                  {lang === 'bn' ? recommended.title : recommended.titleEn}
                </h3>
                <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto">
                  {lang === 'bn' ? recommended.description : recommended.descriptionEn}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                <div className="text-left">
                  <p className="font-bold text-slate-900">{recommended.batchNumber} • {recommended.duration}</p>
                  <p className="text-slate-500">{recommended.schedule}</p>
                </div>
                <p className="text-base font-black text-slate-950">৳{recommended.price.toLocaleString()}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleRestart}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  আবার করুন
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onSelectCourse(recommended);
                  }}
                  className="w-2/3 py-2.5 rounded-xl bg-[#FFC000] hover:bg-[#ffb000] text-slate-950 text-xs font-black shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>কোর্সের বিস্তারিত দেখুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
