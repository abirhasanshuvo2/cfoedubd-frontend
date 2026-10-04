'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ArrowRight,
  X,
  Menu,
  Sun,
  Moon,
  ShieldCheck,
  User,
  GraduationCap,
  BookOpen,
} from 'lucide-react';
import { COURSES, Course } from '@/data/cfo-data';
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
}: NavbarProps) {
  const router = useRouter();
  const { lang, setLang, courses, theme, toggleTheme } = useCfo();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [internalSearchQuery, setInternalSearchQuery] = useState('');

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
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
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

  const handleCourseClick = (course: Course) => {
    setIsSearchOpen(false);
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
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo (COL - Bold and Big) */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link href="/" className="inline-flex items-center gap-2.5 group whitespace-nowrap">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#0A192F] via-[#0D254C] to-[#1E3A8A] flex items-center justify-center shadow-md border border-[#FFC000]/70 relative group-hover:scale-105 transition-transform shrink-0">
              <span className="font-serif font-black text-sm sm:text-base text-[#FFC000] tracking-tight">
                COL
              </span>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#FFC000] rounded-full border border-white dark:border-slate-900" />
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="font-serif font-black text-xl sm:text-2xl tracking-tight text-slate-950 dark:text-white leading-none">
                COL<span className="text-[#FFC000]">.</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hidden sm:inline-block">
                cfoedubd.com
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Clean Nav Links (With Courses, Certificates, Media, About, Contact) */}
        <nav className="hidden md:flex items-center gap-5 xl:gap-7 text-xs font-bold text-slate-700 dark:text-slate-200">
          <Link
            href="/courses"
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{lang === 'bn' ? 'কোর্সসমূহ' : 'Courses'}</span>
          </Link>
          <Link
            href="/certificates"
            className="inline-flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap text-emerald-700 dark:text-emerald-400 font-semibold"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'সনদ যাচাই' : 'Verify Certificate'}</span>
          </Link>
          <Link
            href="/media-news"
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap"
          >
            {lang === 'bn' ? 'মিডিয়া ও সংবাদ' : 'Media & News'}
          </Link>
          <Link
            href="/about"
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap"
          >
            {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
          </Link>
          <Link
            href="/contact"
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap"
          >
            {lang === 'bn' ? 'যোগাযোগ' : 'Contact'}
          </Link>
        </nav>

        {/* Right: Search, Language, Theme, Login, and CTA */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 whitespace-nowrap">
          
          {/* Search Trigger */}
          <div className="relative" ref={searchContainerRef}>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Search Programs"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Quick Search Popover */}
            {isSearchOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="relative flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2 border border-slate-200 dark:border-slate-700">
                  <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    autoFocus
                    value={activeSearchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder={lang === 'bn' ? 'কোর্স খুঁজুন...' : 'Search programs...'}
                    className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
                  />
                  {activeSearchQuery && (
                    <button
                      onClick={() => handleSearchChange('')}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Results preview */}
                {activeSearchQuery.trim() && (
                  <div className="mt-2 space-y-1 max-h-56 overflow-y-auto">
                    {filteredSearchResults.length > 0 ? (
                      filteredSearchResults.map((course) => (
                        <button
                          key={course.id}
                          onClick={() => handleCourseClick(course)}
                          className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors cursor-pointer text-xs"
                        >
                          <span className="font-semibold text-slate-900 dark:text-white truncate pr-2">
                            {lang === 'bn' ? course.title : course.titleEn}
                          </span>
                          <span className="text-[10px] text-amber-600 font-bold shrink-0">
                            {course.price === 0 ? 'Free' : `৳${course.price.toLocaleString()}`}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="text-center text-xs text-slate-400 py-2">
                        {lang === 'bn' ? 'কোনো কোর্স পাওয়া যায়নি' : 'No programs found'}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            title="Switch Language"
          >
            <span className="text-sm leading-none">{lang === 'bn' ? '🇬🇧' : '🇧🇩'}</span>
            <span className="font-mono text-xs">{lang === 'bn' ? 'EN' : 'বাং'}</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Primary CTA: "অনলাইন ভর্তি →" */}
          <Link
            href="/enroll-now?course=Chartered%20Financial%20Officer%20(CFO)"
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg bg-[#FFC000] hover:bg-[#E6AC00] active:scale-95 text-slate-950 font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <span>{lang === 'bn' ? 'অনলাইন ভর্তি' : 'Apply Now'}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.8]" />
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer (Matching cfoedubd.com) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto">
          
          {/* Mobile Search Input */}
          <div className="relative">
            <input
              type="text"
              value={activeSearchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={lang === 'bn' ? 'কোর্স খুঁজুন...' : 'Search programs...'}
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
              className="block px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400"
            >
              {lang === 'bn' ? '📚 কোর্সসমূহ (Courses)' : '📚 Courses'}
            </Link>
            <Link
              href="/certificates"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-emerald-700 dark:text-emerald-400"
            >
              {lang === 'bn' ? '🛡️ সনদ যাচাই (Verify Certificate)' : '🛡️ Verify Certificate'}
            </Link>
            <Link
              href="/media-news"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {lang === 'bn' ? 'মিডিয়া ও সংবাদ' : 'Media & News'}
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

          {/* Quick Actions in Mobile Drawer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={toggleTheme}
              className="w-full py-2.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
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
