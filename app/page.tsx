'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import OstadHeroBanner from '@/components/OstadHeroBanner';
import CategoryPills from '@/components/CategoryPills';
import CourseCard from '@/components/CourseCard';
import CourseDetailsModal from '@/components/CourseDetailsModal';
import EnrollmentModal from '@/components/EnrollmentModal';
import StudentLmsModal from '@/components/StudentLmsModal';
import LearningMethodology from '@/components/LearningMethodology';
import CareerQuizModal from '@/components/CareerQuizModal';
import OfficialWebsiteStats from '@/components/OfficialWebsiteStats';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { COURSES, Course } from '@/data/cfo-data';
import { useCfo } from '@/context/CfoContext';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  RefreshCw
} from 'lucide-react';

export default function Home() {
  const {
    lang,
    setLang,
    theme,
    enrolledCourses,
    enrollInCourse,
    courses,
    isLiveApiConnected,
    coursesLoading,
    refreshCourses,
  } = useCfo();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Modals state (optional fast preview without leaving page)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollingCourse, setEnrollingCourse] = useState<Course | null>(null);
  const [isLmsOpen, setIsLmsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const [userNotification, setUserNotification] = useState<string | null>(null);

  // Filtered and sorted courses
  const filteredCourses = useMemo(() => {
    let list = [...(courses && courses.length > 0 ? courses : [])];

    // Filter by Category
    if (selectedCategory !== 'all') {
      list = list.filter((c) => c.category === selectedCategory);
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.titleEn.toLowerCase().includes(q) ||
          c.categoryLabel.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy, courses]);

  const handleEnrollmentSuccess = (course: Course) => {
    enrollInCourse(course);
    setUserNotification(
      lang === 'bn'
        ? `অভিনন্দন! ${course.title} কোর্সে আপনার ভর্তি সফল হয়েছে।`
        : `Congratulations! Enrolled in ${course.titleEn}`
    );
    setTimeout(() => setUserNotification(null), 5000);
  };

  const handleLoginSuccess = (name: string, phone: string) => {
    setUserNotification(
      lang === 'bn' ? `স্বাগতম ${name}! লগইন সফল হয়েছে।` : `Welcome ${name}! Login successful.`
    );
    setTimeout(() => setUserNotification(null), 4000);
  };

  const scrollToCourses = () => {
    const el = document.getElementById('all-courses-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col transition-colors ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}
    >
      {/* Toast Notification Banner */}
      {userNotification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-950 text-white px-5 py-3 rounded-xl shadow-2xl border border-amber-400/50 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[#FFC000]" />
          <span className="text-xs sm:text-sm font-semibold">{userNotification}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectCategory={(catId) => setSelectedCategory(catId)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Ostad-Style Hero Banner Section (Exact Match to Screenshot) */}
      <OstadHeroBanner onStartLearning={scrollToCourses} />

      {/* Main Courses Catalog Section */}
      <section id="all-courses-section" className="py-14 sm:py-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Clean, Noiseless Section Heading (Exact Match to Screenshot) */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2.5 tracking-tight">
            <span className="text-[#E62E2D] font-mono text-xl sm:text-2xl select-none leading-none animate-pulse">
              ((•))
            </span>
            <span>{lang === 'bn' ? 'আপকামিং লাইভ কোর্স' : 'Upcoming Live Courses'}</span>
          </h2>
        </div>

        {/* Category Pills Filter */}
        <div className="mb-8">
          <CategoryPills
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => setSelectedCategory(catId)}
            lang={lang}
          />
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                lang={lang}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">
              {lang === 'bn'
                ? 'এই ক্যাটাগরিতে কোনো কোর্স পাওয়া যায়নি।'
                : 'No courses found in this category.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-lg bg-[#FFC000] text-slate-950 font-bold text-xs cursor-pointer"
            >
              {lang === 'bn' ? 'সব কোর্স দেখুন' : 'Show All Courses'}
            </button>
          </div>
        )}

        {/* View All Courses CTA Banner */}
        <div className="mt-12 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#A97B28] hover:brightness-110 text-slate-950 font-serif font-black text-sm shadow-md transition-all cursor-pointer border border-[#C8963E]/40 active:scale-95"
          >
            <span>{lang === 'bn' ? 'সকল লাইভ কোর্স ও ক্যারিয়ার ট্র্যাক ক্যাটালগ দেখুন' : 'View Complete Course Catalog'}</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </Link>
        </div>
      </section>

      {/* Official cfoedubd.com Statistics & Guarantees */}
      <OfficialWebsiteStats lang={lang} />

      {/* Learning Methodology (Chartered Officer Limited) */}
      <LearningMethodology
        lang={lang}
        onExploreCourses={scrollToCourses}
      />

      {/* FAQ Section */}
      <FaqSection lang={lang} />

      {/* Footer */}
      <Footer lang={lang} />

      {/* Modals */}
      <CourseDetailsModal
        course={selectedCourse}
        isOpen={Boolean(selectedCourse)}
        onClose={() => setSelectedCourse(null)}
        lang={lang}
        onEnroll={(course) => setEnrollingCourse(course)}
      />

      <EnrollmentModal
        course={enrollingCourse}
        isOpen={Boolean(enrollingCourse)}
        onClose={() => setEnrollingCourse(null)}
        lang={lang}
        onEnrollmentSuccess={handleEnrollmentSuccess}
      />

      <StudentLmsModal
        isOpen={isLmsOpen}
        onClose={() => setIsLmsOpen(false)}
        enrolledCourses={enrolledCourses}
        lang={lang}
      />

      <CareerQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        lang={lang}
        onSelectCourse={(course) => setSelectedCourse(course)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        lang={lang}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
