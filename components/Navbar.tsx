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
  Briefcase,
  User,
  Sparkles,
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

  const handleAuthTrigger = () => {
    if (onOpenAuth) {
      onOpenAuth();
    } else {
      router.push('/login');
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
        
        {/* Left Side: Brand Logo */}
        <Link href="/" className="inline-flex items-center gap-2 group shrink-0 whitespace-nowrap">
          {systemInfo.logo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={systemInfo.logo}
              alt={systemInfo.name}
              className="h-8 w-auto max-w-[110px] object-contain drop-shadow-xs shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0A192F] via-[#0D254C] to-[#1E3A8A] flex items-center justify-center shadow-xs border border-[#FFC000]/60 relative group-hover:scale-105 transition-transform shrink-0">
              <span className="font-serif font-black text-xs text-[#FFC000] tracking-tighter">
                COL
              </span>
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#FFC000] rounded-full border border-white dark:border-slate-900" />
            </div>
          )}
          <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
            <span className="font-serif font-black text-sm sm:text-base lg:text-lg tracking-tight text-slate-950 dark:text-white leading-tight whitespace-nowrap">
              {systemInfo.name || 'Chartered Officer'}
            </span>
            <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hidden md:inline-block shrink-0 whitespace-nowrap">
              cfoedubd.com
            </span>
          </div>
        </Link>

        {/* Middle Section: Search + Nav Links with Horizontal Scroll support so they never wrap or break */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3 flex-1 min-w-0 overflow-x-auto scrollbar-none py-1 px-1">
          
          {/* Search Pill */}
          <div className="relative shrink-0 w-44 lg:w-56" ref={searchContainerRef}>
            <div className="relative flex items-center rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 px-2.5 py-1 focus-within:border-emerald-500 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
              <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mr-1.5">
                <Search className="w-2.5 h-2.5 stroke-[2.5]" />
              </div>

              <input
                type="text"
                value={activeSearchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder={lang === 'bn' ? 'কোর্স খুঁজুন...' : 'Search...'}
                className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none"
              />

              {activeSearchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Live Search Results Dropdown */}
            {isSearchFocused && activeSearchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {filteredSearchResults.length > 0 ? (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase px-2 py-0.5">
                      {lang === 'bn' ? 'কোর্সসমূহ' : 'Programs'}
                    </p>
                    {filteredSearchResults.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => handleCourseClick(course)}
                        className="w-full text-left p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors cursor-pointer text-xs"
                      >
                        <span className="font-semibold text-slate-900 dark:text-white truncate pr-2">
                          {lang === 'bn' ? course.title : course.titleEn}
                        </span>
                        <span className="text-[10px] text-amber-600 font-bold shrink-0">
                          {course.price === 0 ? 'Free' : `৳${course.price.toLocaleString()}`}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-center text-xs text-slate-500 dark:text-slate-400">
                    {lang === 'bn' ? 'কোনো কোর্স পাওয়া যায়নি' : 'No programs found'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Special Offer Button */}
          <button
            onClick={() => setIsSpecialOfferOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#7B341E] via-[#652918] to-[#4A1D11] hover:brightness-110 active:scale-95 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer shrink-0 whitespace-nowrap border border-amber-900/40"
          >
            <span>🎁</span>
            <span className="whitespace-nowrap">{lang === 'bn' ? 'স্পেশাল অফার' : 'Special Offer'}</span>
          </button>

          {/* জব সাকসেস (Job Success) */}
          <Link
            href="/about#placement"
            className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors shrink-0 whitespace-nowrap"
          >
            <span className="w-3.5 h-3.5 rounded-full bg-rose-600 text-white text-[7px] font-black flex items-center justify-center shadow-2xs">
              NEW
            </span>
            <span className="whitespace-nowrap">{lang === 'bn' ? 'জব সাকসেস' : 'Job Success'}</span>
          </Link>

          {/* সনদ যাচাই (Certificate Verification) */}
          <Link
            href="/certificates"
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 transition-colors shrink-0 whitespace-nowrap"
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">{lang === 'bn' ? 'সনদ যাচাই' : 'Verify Certificate'}</span>
          </Link>

          {/* ফ্রি কোর্সসমূহ */}
          <Link
            href="/courses"
            className="inline-flex items-center px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors shrink-0 whitespace-nowrap"
          >
            <span className="whitespace-nowrap">{lang === 'bn' ? 'ফ্রি কোর্সসমূহ' : 'Free Courses'}</span>
          </Link>

        </div>

        {/* Right Side: Language Switcher + Theme Toggle + Auth + সব কোর্স ⌵ + অনলাইন ভর্তি → */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap">
          
          {/* Mobile Search Icon Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            title="Search"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Language Switcher (Guaranteed single-line, perfectly aligned) */}
          <button
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            title="Switch Language"
          >
            <span className="text-sm leading-none shrink-0">{lang === 'bn' ? '🇬🇧' : '🇧🇩'}</span>
            <span className="font-mono text-xs shrink-0 whitespace-nowrap">{lang === 'bn' ? 'EN' : 'বাং'}</span>
          </button>

          {/* Theme Switcher (Moon/Sun) */}
          <button
            onClick={toggleTheme}
            className="inline-flex items-center justify-center p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 shrink-0" />
            )}
          </button>

          {/* Learner Login */}
          <button
            onClick={handleAuthTrigger}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          >
            <User className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="whitespace-nowrap">{lang === 'bn' ? 'লগইন' : 'Login'}</span>
          </button>

          {/* "সব কোর্স ⌵" Dropdown Button */}
          <div className="relative hidden lg:block shrink-0" ref={coursesMenuRef}>
            <button
              onClick={() => setIsCoursesMenuOpen(!isCoursesMenuOpen)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            >
              <span className="whitespace-nowrap">{lang === 'bn' ? 'সব কোর্স' : 'All Courses'}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-600 dark:text-slate-300 transition-transform duration-200 ${isCoursesMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* All Courses Mega Menu */}
            {isCoursesMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xl border border-slate-200 dark:border-slate-800 p-2.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-2 py-1 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {lang === 'bn' ? 'প্রফেশনাল ট্র্যাক্স' : 'Professional Tracks'}
                  </span>
                  <Link
                    href="/courses"
                    onClick={() => setIsCoursesMenuOpen(false)}
                    className="text-xs font-bold text-amber-600 hover:underline"
                  >
                    {lang === 'bn' ? 'সব দেখুন →' : 'View All →'}
                  </Link>
                </div>
                <div className="py-1.5 space-y-0.5">
                  {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-left transition-colors cursor-pointer text-xs font-bold"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFC000] shrink-0" />
                      <span className="truncate">{lang === 'bn' ? cat.label : cat.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA: "অনলাইন ভর্তি →" */}
          <Link
            href="/enroll-now?course=Chartered%20Financial%20Officer%20(CFO)"
            className="inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-lg bg-[#FFC000] hover:bg-[#E6AC00] active:scale-95 text-slate-950 font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer shrink-0 whitespace-nowrap"
          >
            <span className="hidden xs:inline whitespace-nowrap">{lang === 'bn' ? 'অনলাইন ভর্তি' : 'Apply Now'}</span>
            <span className="xs:hidden whitespace-nowrap">{lang === 'bn' ? 'ভর্তি' : 'Apply'}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.8] shrink-0" />
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
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

      {/* Mobile Drawer (Clean, Accessible, No Overflow) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto">
          
          {/* Mobile Search Input */}
          <div className="relative">
            <input
              type="text"
              value={activeSearchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={lang === 'bn' ? 'কোর্স বা ভ্যাট খুঁজুন...' : 'Search programs...'}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            {activeSearchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Special Offer Banner in Drawer */}
          <div
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsSpecialOfferOpen(true);
            }}
            className="p-3 rounded-xl bg-gradient-to-r from-[#7B341E] via-[#652918] to-[#4A1D11] text-white flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">🎁</span>
              <div>
                <p className="text-xs font-bold text-white leading-tight">
                  {lang === 'bn' ? 'সিএফও স্পেশাল স্কলারশিপ অফার' : 'Special Scholarship Offer'}
                </p>
                <p className="text-[10px] text-amber-200 font-mono">PROMO: CFO2026 (২০% ছাড়)</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </div>

          {/* Navigation Links */}
          <div className="space-y-1 font-bold text-xs text-slate-800 dark:text-slate-200">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {lang === 'bn' ? 'হোম' : 'Home'}
            </Link>
            <Link
              href="/courses"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {lang === 'bn' ? 'সব কোর্স' : 'All Courses'}
            </Link>
            <Link
              href="/about#placement"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-600 dark:text-rose-400 font-extrabold"
            >
              {lang === 'bn' ? '🔴 জব সাকসেস (প্লেসমেন্ট)' : '🔴 Job Success'}
            </Link>
            <Link
              href="/certificates"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-emerald-700 dark:text-emerald-400"
            >
              {lang === 'bn' ? '🛡️ সনদ যাচাই (Verify Certificate)' : '🛡️ Verify Certificate'}
            </Link>
            <Link
              href="/admission"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {lang === 'bn' ? 'ভর্তি তথ্য ও ফি' : 'Admission & Fees'}
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {lang === 'bn' ? 'যোগাযোগ' : 'Contact Us'}
            </Link>
          </div>

          {/* Quick Actions (Theme & Login in Mobile Drawer) */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={handleAuthTrigger}
              className="py-2.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'bn' ? 'স্টুডেন্ট লগইন' : 'Learner Login'}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="py-2.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
              <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
            </button>
          </div>

          {/* Big CTA in Drawer */}
          <div className="pt-1">
            <Link
              href="/enroll-now?course=Chartered%20Financial%20Officer%20(CFO)"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-lg bg-[#FFC000] hover:bg-[#E6AC00] text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>{lang === 'bn' ? 'অনলাইন ভর্তি ফরম' : 'Apply for Admission'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.8]" />
            </Link>
          </div>
        </div>
      )}

    </header>
  );
}
