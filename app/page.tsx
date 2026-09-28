'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CategoryPills from '@/components/CategoryPills';
import CourseCard from '@/components/CourseCard';
import CourseDetailsModal from '@/components/CourseDetailsModal';
import EnrollmentModal from '@/components/EnrollmentModal';
import StudentLmsModal from '@/components/StudentLmsModal';
import LearningMethodology from '@/components/LearningMethodology';
import Testimonials from '@/components/Testimonials';
import CareerQuizModal from '@/components/CareerQuizModal';
import AppDownloadBanner from '@/components/AppDownloadBanner';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { COURSES, Course } from '@/data/cfo-data';
import { useCfo } from '@/context/CfoContext';
import {
  Sparkles,
  ArrowUpDown,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  RefreshCw
} from 'lucide-react';

export default function Home() {
  const {
    lang,
    setLang,
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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
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
      />

      {/* Hero Section */}
      <Hero
        lang={lang}
        onExploreCourses={scrollToCourses}
        onOpenFreeWorkshops={() => {
          const el = document.getElementById('free-workshops');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenCareerQuiz={() => setIsQuizOpen(true)}
        featuredCourse={courses[0] || COURSES[0]}
        onSelectCourse={(course) => setSelectedCourse(course)}
        onEnrollCourse={(course) => setEnrollingCourse(course)}
      />

      {/* Main Courses Catalog Section */}
      <section id="all-courses-section" className="py-14 sm:py-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{lang === 'bn' ? 'লাইভ ক্যারিয়ার ট্র্যাক' : 'Live Career Tracks'}</span>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight">
              {lang === 'bn' ? 'আপকামিং লাইভ ব্যাচসমূহ' : 'Explore Live Batches'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {lang === 'bn'
                ? 'ইন্ডাস্ট্রি এক্সপার্টদের সাথে হাতে-কলমে প্র্যাকটিস ও লাইভ ফিডব্যাক নিয়ে শিখুন।'
                : 'Interactive online cohorts with hands-on practice and real-time mentor code review.'}
            </p>
          </div>

          {/* Sort Control & All Courses Link */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/courses"
              className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-xl border border-amber-200 transition-colors"
            >
              <span>{lang === 'bn' ? 'সব কোর্স পেজ' : 'All Courses Page'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                {lang === 'bn' ? 'সাজান:' : 'Sort by:'}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-semibold py-2 px-3 rounded-xl border border-slate-300 bg-white text-slate-800 outline-none hover:border-amber-400 transition-colors cursor-pointer shadow-2xs"
              >
                <option value="featured">{lang === 'bn' ? 'ফিচার্ড (Featured)' : 'Featured'}</option>
                <option value="rating">{lang === 'bn' ? 'টপ রেটেড (Top Rated)' : 'Top Rated'}</option>
                <option value="price-asc">{lang === 'bn' ? 'ফি: কম থেকে বেশি' : 'Price: Low to High'}</option>
                <option value="price-desc">{lang === 'bn' ? 'ফি: বেশি থেকে কম' : 'Price: High to Low'}</option>
              </select>
            </div>
          </div>
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
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <p className="text-base font-bold text-slate-800">
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
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <span>{lang === 'bn' ? 'সকল লাইভ কোর্স ও ক্যারিয়ার ট্র্যাক ক্যাটালগ দেখুন' : 'View Complete Course Catalog'}</span>
            <ArrowRight className="w-4 h-4 text-[#FFC000]" />
          </Link>
        </div>
      </section>

      {/* Learning Methodology (Why Ostad) */}
      <LearningMethodology
        lang={lang}
        onExploreCourses={scrollToCourses}
      />

      {/* Student Testimonials */}
      <Testimonials lang={lang} />

      {/* Mobile App Download Banner */}
      <AppDownloadBanner lang={lang} />

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
