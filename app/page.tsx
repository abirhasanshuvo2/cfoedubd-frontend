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
import FreeWorkshops from '@/components/FreeWorkshops';
import LearningMethodology from '@/components/LearningMethodology';
import HiringPartners from '@/components/HiringPartners';
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
  Code,
  ShieldCheck,
  BookOpen,
  Briefcase,
  Terminal,
  Award,
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

      {/* Free Workshops & Masterclasses */}
      <FreeWorkshops lang={lang} />

      {/* Futuristic Ecosystem: Code Arena, Verified Credentials, Blog, Talent Pool */}
      <section className="bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,192,0,0.12),rgba(0,0,0,0))]" />
        
        <div className="max-w-7xl mx-auto relative z-10 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-semibold text-[#FFC000]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'আধুনিক এডটেক ইকোসিস্টেম' : 'Next-Gen Learning Ecosystem'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
              {lang === 'bn' ? (
                <>
                  শুধু কোর্স নয়, ক্যারিয়ার গঠনের <span className="text-[#FFC000]">পরিপূর্ণ প্ল্যাটফর্ম</span>
                </>
              ) : (
                <>
                  Beyond Lectures: A Complete <span className="text-[#FFC000]">Engineering Foundry</span>
                </>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {lang === 'bn'
                ? 'ইন্টারেক্টিভ ইন-ব্রাউজার কোডিং স্যান্ডবক্স, অফিসিয়াল ভেরিফিকেশন লেজার ও ডিরেক্ট টেক হায়ারিং নেটওয়ার্ক।'
                : 'Interactive in-browser execution sandbox, tamper-proof credential verification, and dedicated talent matching.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Code Arena */}
            <Link
              href="/practice"
              className="group p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/80 transition-all shadow-lg flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">Interactive Sandbox</span>
                  <h3 className="text-base font-black text-white mt-1 group-hover:text-[#FFC000] transition-colors">
                    {lang === 'bn' ? 'ওস্তাদ কোড এরিনা' : 'Code Arena & Sandbox'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {lang === 'bn'
                      ? 'ব্রাউজারে রিয়েল কোড রান করে অ্যালগরিদম ও জব ইন্টারভিউ টাস্ক সল্ভ করুন।'
                      : 'Solve technical interview coding challenges with live test execution directly in-browser.'}
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400">
                <span>{lang === 'bn' ? 'প্র্যাকটিস শুরু করুন' : 'Launch Sandbox'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Verify Certificate */}
            <Link
              href="/verify-certificate"
              className="group p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/80 transition-all shadow-lg flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-500/40 text-[#FFC000] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#FFC000] tracking-wider uppercase">Blockchain Ledger</span>
                  <h3 className="text-base font-black text-white mt-1 group-hover:text-[#FFC000] transition-colors">
                    {lang === 'bn' ? 'সার্টিফিকেট ভেরিফিকেশন' : 'Credential Verification'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {lang === 'bn'
                      ? 'অনন্য ক্রেডেনশিয়াল আইডি দিয়ে শিক্ষার্থীর সত্যতা ও ফলাফল এক ক্লিকে যাচাই করুন।'
                      : 'Recruiters can authenticate student graduation, batch score, and instructor signatures.'}
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400">
                <span>{lang === 'bn' ? 'আইডি যাচাই করুন' : 'Verify Certificate'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: CFO Finance Blog */}
            <Link
              href="/blog"
              className="group p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/80 transition-all shadow-lg flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-purple-400 tracking-wider uppercase">Executive Insights</span>
                  <h3 className="text-base font-black text-white mt-1 group-hover:text-[#FFC000] transition-colors">
                    {lang === 'bn' ? 'সিএফও ফিন্যান্স ও করপোরেট ব্লগ' : 'CFO Finance & Leadership Insights'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {lang === 'bn'
                      ? 'নতুন আয়কর আইন ২০২৩, এসএপি ফাইকো এবং সিএফও স্ট্র্যাটেজি গাইডলাইন পড়ুন।'
                      : 'High-yield technical and financial articles written by practicing CFOs and lead FCAs.'}
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400">
                <span>{lang === 'bn' ? 'ব্লগ পড়ুন' : 'Read Articles'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4: Talent Pool */}
            <Link
              href="/talent-pool"
              className="group p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/80 transition-all shadow-lg flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase">Corporate Placement</span>
                  <h3 className="text-base font-black text-white mt-1 group-hover:text-[#FFC000] transition-colors">
                    {lang === 'bn' ? 'ট্যালেন্ট পুল নেটওয়ার্ক' : 'Talent Pool & Hiring'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {lang === 'bn'
                      ? '১৫০+ পার্টনার টেক ফার্মের রিক্রুটারদের কাছে ভেরিফাইড প্রজেক্ট পোর্টফোলিও শোকেস।'
                      : 'Direct pipeline connecting qualified graduates with top software engineering firms.'}
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400">
                <span>{lang === 'bn' ? 'ট্যালেন্ট পুল এক্সপ্লোর' : 'Explore Talent'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Hiring Partners Network */}
      <HiringPartners lang={lang} />

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
