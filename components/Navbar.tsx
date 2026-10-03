'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ChevronDown,
  ArrowRight,
  X,
  Menu,
  Sun,
  Moon,
  Award,
  FileText,
  Download,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { CATEGORIES, COURSES, Course } from '@/data/cfo-data';
import { useCfo } from '@/context/CfoContext';

interface NavbarProps {
  onSelectCourse?: (course: Course) => void;
  onOpenAuth?: () => void;
  onOpenLms?: () => void;
  onEnrollCourse?: (course: Course) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onSelectCategory?: (catId: string) => void;
}

export default function Navbar({
  onSelectCourse,
  onOpenAuth,
  searchQuery: externalSearchQuery,
  setSearchQuery: externalSetSearchQuery,
  onSelectCategory,
}: NavbarProps) {
  const router = useRouter();
  const { lang, setLang, courses, systemInfo, theme, toggleTheme } = useCfo();

  const [isCoursesMenuOpen, setIsCoursesMenuOpen] = useState(false);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSpecialOfferOpen, setIsSpecialOfferOpen] = useState(false);
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [copiedPromo, setCopiedPromo] = useState(false);

  const coursesMenuRef = useRef<HTMLDivElement>(null);
  const downloadMenuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const activeSearchQuery =
    externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;

  const handleSearchChange = (val: string) => {
    if (externalSetSearchQuery) {
      externalSetSearchQuery(val);
    } else {
      setInternalSearchQuery(val);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (coursesMenuRef.current && !coursesMenuRef.current.contains(event.target as Node)) {
        setIsCoursesMenuOpen(false);
      }
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setIsDownloadMenuOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSearchResults = activeSearchQuery.trim()
    ? (courses && courses.length > 0 ? courses : COURSES).filter(
        (c) =>
          c.title.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
          c.titleEn.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
          c.categoryLabel.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
          c.tags.some((t) => t.toLowerCase().includes(activeSearchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const copyPromoCode = () => {
    navigator.clipboard.writeText('CFO2026');
    setCopiedPromo(true);
    setTimeout(() => setCopiedPromo(false), 2500);
  };

  const handleCategoryClick = (catId: string) => {
    setIsCoursesMenuOpen(false);
    setIsMobileMenuOpen(false);
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
    router.push(`/courses?category=${catId}`);
  };

  const handleCourseClick = (course: Course) => {
    setIsSearchFocused(false);
    setIsMobileMenuOpen(false);
    if (onSelectCourse) {
      onSelectCourse(course);
    }
    router.push(`/courses/${course.id}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[70px] flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Left Side: Brand Logo + Search Pill + Special Offer + Nav Links */}
        <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
          
          {/* Logo (Chartered Officer Limited / cfoedubd.com) */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            {systemInfo.logo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={systemInfo.logo}
                alt={systemInfo.name}
                className="h-8 sm:h-9 w-auto max-w-[120px] object-contain drop-shadow-xs"
              />
            ) : (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#0A192F] via-[#0D254C] to-[#1E3A8A] flex items-center justify-center shadow-xs border border-[#FFC000]/60 relative group-hover:scale-105 transition-transform shrink-0">
                <span className="font-serif font-black text-xs sm:text-sm text-[#FFC000] tracking-tighter">
                  COL
                </span>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#FFC000] rounded-full border border-white dark:border-slate-900" />
              </div>
            )}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-black text-sm sm:text-base lg:text-lg tracking-tight text-slate-950 dark:text-white leading-tight">
                  {systemInfo.name || 'Chartered Officer'}
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hidden sm:inline-block">
                  cfoedubd.com
                </span>
              </div>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5 truncate hidden sm:block">
                দি সিএফও ফাউন্ডেশন অব বাংলাদেশ
              </span>
            </div>
          </Link>

          {/* Search Pill (Rounded Pill with Mint-Green Sparkle Search Icon) */}
          <div className="relative flex-1 max-w-[210px] lg:max-w-[260px] hidden sm:block" ref={searchContainerRef}>
            <div className="relative flex items-center rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 px-3 py-1.5 focus-within:border-emerald-500 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
              {/* Mint Circle Search Icon */}
              <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Search className="w-3 h-3 stroke-[2.5]" />
              </div>

              <input
                type="text"
                value={activeSearchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder={lang === 'bn' ? 'কোর্স, ভ্যাট বা এসএপি খুঁজুন...' : 'Search CFO, VAT, SAP...'}
                className="w-full bg-transparent pl-2 pr-1 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none"
              />

              {activeSearchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Live Search Results Dropdown */}
            {isSearchFocused && activeSearchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {filteredSearchResults.length > 0 ? (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1">
                      {lang === 'bn' ? 'প্রাসঙ্গিক প্রোগ্রামসমূহ' : 'Matching Programs'}
                    </p>
                    {filteredSearchResults.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => handleCourseClick(course)}
                        className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {lang === 'bn' ? course.title : course.titleEn}
                          </p>
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                            {course.batchNumber} • {course.price === 0 ? 'Free' : `৳${course.price.toLocaleString()}`}
                          </span>
                        </div>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-semibold shrink-0">
                          {course.categoryLabel}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                    {lang === 'bn' ? 'কোনো কোর্স পাওয়া যায়নি।' : 'No programs found.'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Special Offer Button (Burnt-Orange Festive Card with Gift Box) */}
          <button
            onClick={() => setIsSpecialOfferOpen(true)}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#7B341E] via-[#652918] to-[#4A1D11] hover:brightness-110 active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer shrink-0 border border-amber-900/40 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px] pointer-events-none" />
            <span className="text-sm">🎁</span>
            <span className="font-medium text-white tracking-wide">
              {lang === 'bn' ? 'স্পেশাল অফার' : 'Special Offer'}
            </span>
          </button>

          {/* Navigation Links: জব সাকসেস | ফ্রি কোর্সসমূহ | ডাউনলোড ⌵ | সনদ যাচাই */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-4 text-xs font-bold text-slate-800 dark:text-slate-200 shrink-0">
            {/* জব সাকসেস (Job Success / Placements) */}
            <Link
              href="/about#placement"
              className="inline-flex items-center gap-1.5 hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[8px] font-black flex items-center justify-center shadow-2xs animate-pulse">
                NEW
              </span>
              <span>{lang === 'bn' ? 'জব সাকসেস' : 'Job Success'}</span>
            </Link>

            {/* ফ্রি কোর্সসমূহ */}
            <Link
              href="/courses"
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              {lang === 'bn' ? 'ফ্রি কোর্সসমূহ' : 'Free Courses'}
            </Link>

            {/* সনদ যাচাই (Certificate Verification) */}
            <Link
              href="/certificates"
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'সনদ যাচাই' : 'Verify Certificate'}</span>
            </Link>

            {/* ডাউনলোড ⌵ (Download Dropdown) */}
            <div className="relative" ref={downloadMenuRef}>
              <button
                onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
                className="inline-flex items-center gap-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>{lang === 'bn' ? 'ডাউনলোড' : 'Download'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDownloadMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDownloadMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {lang === 'bn' ? 'সিলেবাস ও ম্যাটেরিয়ালস' : 'Materials & Guides'}
                  </div>
                  <a
                    href="#syllabus"
                    onClick={() => setIsDownloadMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>১-বছর মেয়াদি CFO সিলেবাস (PDF)</span>
                  </a>
                  <a
                    href="#tax-guide"
                    onClick={() => setIsDownloadMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>ট্যাক্স ও ভ্যাট রুলবুক ২০২৩</span>
                  </a>
                  <a
                    href="#sap-roadmap"
                    onClick={() => setIsDownloadMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>এসএপি-ফাইকো ক্যারিয়ার গাইড</span>
                  </a>
                </div>
              )}
            </div>
          </nav>

        </div>

        {/* Right Side: Language Flag + Theme + সব কোর্স ⌵ + অনলাইন ভর্তি → */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Language Switcher (Flag Icon + EN / BN) */}
          <button
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            title="Switch Language"
          >
            <span className="text-base leading-none">
              {lang === 'bn' ? '🇬🇧' : '🇧🇩'}
            </span>
            <span className="font-mono text-xs">{lang === 'bn' ? 'EN' : 'বাংলা'}</span>
          </button>

          {/* Theme Switcher (Moon/Sun) */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* "সব কোর্স ⌵" Dropdown Button */}
          <div className="relative hidden md:block" ref={coursesMenuRef}>
            <button
              onClick={() => setIsCoursesMenuOpen(!isCoursesMenuOpen)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <span>{lang === 'bn' ? 'সব কোর্স' : 'All Courses'}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-600 dark:text-slate-300 transition-transform duration-200 ${isCoursesMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* All Courses Mega Menu */}
            {isCoursesMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {lang === 'bn' ? 'প্রফেশনাল ট্র্যাক্স' : 'Professional Tracks'}
                  </span>
                  <Link
                    href="/courses"
                    onClick={() => setIsCoursesMenuOpen(false)}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    {lang === 'bn' ? 'সব দেখুন →' : 'View All →'}
                  </Link>
                </div>
                <div className="py-2 space-y-1">
                  {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-left transition-colors cursor-pointer text-xs font-bold"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#FFC000]" />
                      <span className="truncate">{lang === 'bn' ? cat.label : cat.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA: "অনলাইন ভর্তি →" (Signature Golden-Yellow Button from Screenshot Design) */}
          <Link
            href="/enroll-now?course=Chartered%20Financial%20Officer%20(CFO)"
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-[#FFC000] hover:bg-[#E6AC00] active:scale-95 text-slate-950 font-black text-xs sm:text-sm shadow-sm transition-all cursor-pointer font-sans shrink-0"
          >
            <span>{lang === 'bn' ? 'অনলাইন ভর্তি' : 'Apply Now'}</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.8]" />
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Special Offer Modal (cfoedubd.com Scholarship & Discounts) */}
      {isSpecialOfferOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-center">
            <button
              onClick={() => setIsSpecialOfferOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7B341E] to-[#4A1D11] text-3xl flex items-center justify-center mx-auto mb-4 shadow-md">
              🎁
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {lang === 'bn' ? 'সিএফও এক্সিকিউটিভ স্কলারশিপ অফার!' : 'CFO Executive Scholarship Offer!'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              {lang === 'bn'
                ? 'চার্টার্ড অফিসার লিমিটেড (COL) এ চার্টার্ড ফাইন্যান্সিয়াল অফিসার (CFO), ভ্যাট ও এসএপি-ফাইকো কোর্সে ২০% পর্যন্ত স্পেশাল ছাড়।'
                : 'Get up to 20% discount on Chartered Financial Officer (CFO), VAT & SAP-FICO courses at Chartered Officer Limited.'}
            </p>
            <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-dashed border-amber-400 flex items-center justify-between">
              <span className="font-mono font-black text-sm text-amber-800 dark:text-amber-300">
                PROMO: CFO2026
              </span>
              <button
                onClick={copyPromoCode}
                className="text-xs font-bold text-slate-950 bg-[#FFC000] hover:bg-[#E6AC00] px-3 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer"
              >
                {copiedPromo ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPromo ? 'কপি হয়েছে' : 'কপি করুন'}</span>
              </button>
            </div>
            <div className="mt-5">
              <Link
                href="/courses"
                onClick={() => setIsSpecialOfferOpen(false)}
                className="w-full py-2.5 rounded-lg bg-[#FFC000] hover:bg-[#E6AC00] font-black text-xs text-slate-950 inline-block shadow-sm"
              >
                {lang === 'bn' ? 'কোর্সগুলো দেখুন' : 'Explore Courses'}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {/* Mobile Search */}
          <div className="relative">
            <input
              type="text"
              value={activeSearchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={lang === 'bn' ? 'কোর্স বা ভ্যাট খুঁজুন...' : 'Search programs...'}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="space-y-1 font-bold text-xs text-slate-800 dark:text-slate-200">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {lang === 'bn' ? 'হোম' : 'Home'}
            </Link>
            <Link
              href="/courses"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {lang === 'bn' ? 'সব কোর্স' : 'All Courses'}
            </Link>
            <Link
              href="/about#placement"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-600 dark:text-rose-400"
            >
              {lang === 'bn' ? '🔴 জব সাকসেস' : '🔴 Job Success'}
            </Link>
            <Link
              href="/certificates"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {lang === 'bn' ? 'সনদ যাচাই' : 'Certificates'}
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/enroll-now?course=Chartered%20Financial%20Officer%20(CFO)"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-lg bg-[#FFC000] hover:bg-[#E6AC00] text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>{lang === 'bn' ? 'অনলাইন ভর্তি ফরম' : 'Apply Now'}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.8]" />
            </Link>
          </div>
        </div>
      )}

    </header>
  );
}
