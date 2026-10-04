'use client';

import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  Users,
  Star,
  ChevronDown,
  Layers,
  Briefcase,
  Laptop,
  Flame,
  ArrowRight,
  ShieldCheck,
  Code
} from 'lucide-react';
import { Course } from '@/data/cfo-data';

interface CourseDetailsModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  lang: 'bn' | 'en';
  onEnroll: (course: Course) => void;
}

export default function CourseDetailsModal({
  course,
  isOpen,
  onClose,
  lang,
  onEnroll,
}: CourseDetailsModalProps) {
  const [openWeek, setOpenWeek] = useState<number>(1);

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col my-auto">
        {/* Modal Header */}
        <div className="bg-slate-950 text-white p-6 sm:p-7 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFC000] text-slate-950">
              {course.batchNumber}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-200">
              {course.categoryLabel}
            </span>
            <span className="flex items-center gap-1 text-xs text-amber-400 font-bold ml-2">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {course.rating} ({course.enrolledCount}+ {lang === 'bn' ? 'শিক্ষার্থী' : 'students'})
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white max-w-2xl leading-tight">
            {lang === 'bn' ? course.title : course.titleEn}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            {lang === 'bn' ? course.description : course.descriptionEn}
          </p>

          {/* Quick Stats Grid */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-xs">
            <div>
              <p className="text-slate-400 font-medium">{lang === 'bn' ? 'ক্লাস সংখ্যা' : 'Total Classes'}</p>
              <p className="text-slate-100 font-bold text-sm mt-0.5">{course.totalClasses}+ লাইভ সেশন</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">{lang === 'bn' ? 'কোর্স সময়কাল' : 'Duration'}</p>
              <p className="text-slate-100 font-bold text-sm mt-0.5">
                {lang === 'bn' ? course.duration : course.durationEn}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">{lang === 'bn' ? 'ব্যাচ শুরু' : 'Batch Starts'}</p>
              <p className="text-slate-100 font-bold text-sm mt-0.5">
                {lang === 'bn' ? course.startDate : course.startDateEn}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">{lang === 'bn' ? 'ক্লাসের সময়সূচী' : 'Schedule'}</p>
              <p className="text-slate-100 font-bold text-sm mt-0.5 truncate">
                {lang === 'bn' ? course.schedule : course.scheduleEn}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          {/* What you will learn */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{lang === 'bn' ? 'এই কোর্সে যা যা শিখবেন' : 'What You Will Learn'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {course.skillsLearned.map((skill, index) => (
                <div key={index} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum / Syllabus Accordion */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-500" />
                <span>{lang === 'bn' ? 'সাপ্তাহিক বিস্তারিত কারিকুলাম' : 'Detailed Syllabus'}</span>
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {course.syllabus.length} {lang === 'bn' ? 'টি মডিউল' : 'Modules'}
              </span>
            </div>

            <div className="space-y-3">
              {course.syllabus.map((mod) => {
                const isOpen = openWeek === mod.week;
                return (
                  <div
                    key={mod.week}
                    className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenWeek(isOpen ? 0 : mod.week)}
                      className="w-full p-4 text-left bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between gap-4 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0">
                          {mod.week}
                        </span>
                        <span className="font-bold text-slate-900 text-sm sm:text-base">
                          {mod.title}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-500 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="p-4 bg-white border-t border-slate-200 space-y-3">
                        <div className="space-y-1.5">
                          {mod.topics.map((topic, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                              <span>{topic}</span>
                            </div>
                          ))}
                        </div>

                        {mod.project && (
                          <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs font-medium text-amber-900 flex items-center gap-2">
                            <Laptop className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>
                              <strong>{lang === 'bn' ? 'মডিউল প্রজেক্ট:' : 'Module Project:'}</strong>{' '}
                              {mod.project}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-World Projects */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <span>{lang === 'bn' ? 'যেসব রিয়েল-লাইফ প্রজেক্ট বিল্ড করবেন' : 'Portfolio Projects You Will Build'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                    {proj}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tools & Prerequisites */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-2.5">
                {lang === 'bn' ? 'ব্যবহৃত সফটওয়্যার ও টুলস' : 'Tools You Will Use'}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {course.tools.map((tool, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-2.5">
                {lang === 'bn' ? 'পূর্বশর্ত (Prerequisites)' : 'Prerequisites'}
              </h4>
              <ul className="space-y-1 text-xs text-slate-600">
                {course.prerequisites.map((req, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Action Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-baseline gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <span className="text-2xl sm:text-3xl font-black text-slate-950">
                ৳{course.price.toLocaleString()}
              </span>
              <span className="text-sm text-slate-600 line-through ml-2">
                ৳{course.originalPrice.toLocaleString()}
              </span>
            </div>
            <span className="text-xs text-rose-600 font-bold sm:hidden">
              {lang === 'bn' ? `মাত্র ${course.seatsLeft}টি সিট বাকি!` : `${course.seatsLeft} seats left!`}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="hidden sm:inline-block text-xs text-rose-600 font-bold">
              {lang === 'bn' ? `মাত্র ${course.seatsLeft}টি সিট বাকি!` : `${course.seatsLeft} seats left!`}
            </span>
            <button
              onClick={() => {
                onClose();
                onEnroll(course);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#FFC000] hover:bg-[#ffb000] text-slate-950 font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{lang === 'bn' ? 'এই ব্যাচে এনরোল করুন' : 'Enroll in this Batch'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
