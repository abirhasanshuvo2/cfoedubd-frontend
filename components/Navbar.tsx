'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  ChevronDown,
  PhoneCall,
  Globe,
  User,
  GraduationCap,
  Sparkles,
  BookOpen,
  Calendar,
  X,
  Menu,
  ShieldCheck,
  TrendingUp,
  FileText,
  Cpu,
  Truck,
  Users,
  CheckCircle2,
  Copy,
  ExternalLink,
  Briefcase,
  LogOut,
  Bell,
  Award,
  Clock,
  MapPin,
  Mail
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
  searchQuery: externalSearchQuery,
  setSearchQuery: externalSetSearchQuery,
  onSelectCategory,
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { lang, setLang, courses, systemInfo } = useCfo();

  const [isCoursesMenuOpen, setIsCoursesMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [copiedPromo, setCopiedPromo] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const coursesMenuRef = useRef<HTMLDivElement>(null);
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

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award':
        return <Award className="w-4 h-4 text-[#C8963E]" />;
      case 'FileText':
        return <FileText className="w-4 h-4 text-rose-600" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-blue-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'Truck':
        return <Truck className="w-4 h-4 text-indigo-600" />;
      case 'Users':
        return <Users className="w-4 h-4 text-amber-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-cyan-600" />;
      default:
        return <Award className="w-4 h-4 text-[#C8963E]" />;
    }
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
    <header className="sticky top-0 z-40 w-full shadow-md bg-white">
      {/* Top Banner: Chartered Officer Limited Executive Info */}
      <div className="bg-[#0A192F] text-slate-200 text-xs py-2 px-4 border-b border-[#1E3A8A]/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8963E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C8963E]"></span>
            </span>
            <p className="truncate font-medium text-slate-300" suppressHydrationWarning>
              {lang === 'bn' ? (
                <>
                  <strong className="text-[#E5A93C] font-semibold">বিটিইবি (BTEB) ও RJSC নিবন্ধিত:</strong>{' '}
                  <span className="font-bold text-white">চার্টার্ড অফিসার লিমিটেড (COL)</span> এ প্রফেশনাল এক্সিকিউটিভ কোর্সে ভর্তি চলছে!
                </>
              ) : (
                <>
                  <strong className="text-[#E5A93C] font-semibold">Govt. Registered (BTEB & RJSC):</strong>{' '}
                  Admissions open for professional executive certification programs at <span className="font-bold text-white">COL</span>!
                </>
              )}
            </p>
            <button
              onClick={copyPromoCode}
              className="text-[11px] text-[#E5A93C] hover:text-amber-200 underline font-semibold flex items-center gap-1 shrink-0 ml-1 cursor-pointer"
            >
              {copiedPromo ? (
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3 h-3" /> কোড কপি হয়েছে!
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Copy className="w-3 h-3" /> {lang === 'bn' ? 'কুপন: CFO2026' : 'Use: CFO2026'}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <a
              href={`tel:${(systemInfo.mobile || systemInfo.phone || '+8801713378787').replace(/\s+/g, '')}`}
              className="hidden sm:flex items-center gap-1.5 text-slate-300 hover:text-[#E5A93C] transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-[#C8963E]" />
              <span className="font-mono">{systemInfo.mobile || systemInfo.phone || '+880 1713-378787'}</span>
            </a>

            <span className="text-slate-600 hidden md:inline">|</span>

            <div className="hidden lg:flex items-center gap-1.5 text-slate-400 max-w-[240px] truncate" title={systemInfo.address}>
              <MapPin className="w-3 h-3 text-[#C8963E] shrink-0" />
              <span className="truncate">{systemInfo.address ? systemInfo.address.split(',')[0] + ', Motijheel' : 'City Centre, Motijheel, Dhaka'}</span>
            </div>

            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1 px-2 py-0.5 rounded border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle language"
            >
              <Globe className="w-3 h-3 text-[#C8963E]" />
              <span className="font-medium">{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Executive Navigation Bar */}
      <div className="border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-4 lg:gap-6 shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              {systemInfo.logo && !logoError ? (
                // Dynamic logo from local or remote API with fallback handler
                <img
                  src={systemInfo.logo}
                  alt={systemInfo.name}
                  onError={() => setLogoError(true)}
                  className="h-11 w-auto max-w-[140px] object-contain drop-shadow-xs"
                />
              ) : (
                /* Executive COL Crest Logo Fallback */
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0A192F] via-[#0D254C] to-[#1E3A8A] flex items-center justify-center shadow-md border border-[#C8963E]/40 relative group-hover:scale-105 transition-transform">
                  <span className="font-serif font-black text-xl text-[#E5A93C] tracking-tighter">COL</span>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#C8963E] rounded-full border-2 border-white flex items-center justify-center">
                    <span className="w-1 h-1 bg-[#0A192F] rounded-full" />
                  </span>
                </div>
              )}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-xl font-serif font-black tracking-tight text-[#0A192F]">
                    {systemInfo.name || 'Chartered Officer Limited'}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-50 text-[#966718] border border-amber-300 hidden sm:inline-block">
                    CFO BD
                  </span>
                </div>
                <span className="text-[11px] text-slate-600 font-medium -mt-0.5 truncate max-w-[280px]">
                  {systemInfo.motto || (lang === 'bn' ? 'দি সিএফও ফাউন্ডেশন অব বাংলাদেশ (cfoedubd.com)' : 'The CFO Foundation of Bangladesh (cfoedubd.com)')}
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar with Live Suggestions */}
          <div className="relative flex-1 max-w-xs lg:max-w-md hidden md:block" ref={searchContainerRef}>
            <div className="relative flex items-center">
              <input
                type="text"
                value={activeSearchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder={lang === 'bn' ? 'কোর্স, ভ্যাট বা এসএপি খুঁজুন...' : 'Search CFO, VAT, SAP, Valuation...'}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#C8963E] focus:bg-white transition-all shadow-2xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              {activeSearchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Search Dropdown Results */}
            {isSearchFocused && activeSearchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50">
                {filteredSearchResults.length > 0 ? (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1">
                      {lang === 'bn' ? 'প্রাসঙ্গিক কোর্সসমূহ' : 'Relevant Programs'}
                    </p>
                    {filteredSearchResults.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => handleCourseClick(course)}
                        className="w-full text-left p-2 rounded-xl hover:bg-amber-50/70 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {lang === 'bn' ? course.title : course.titleEn}
                          </p>
                          <span className="text-[10px] text-[#C8963E] font-medium">
                            {course.batchNumber} • ৳{course.price.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold shrink-0">
                          {course.categoryLabel}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500">
                    {lang === 'bn' ? 'কোনো কোর্স পাওয়া যায়নি।' : 'No programs found.'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <a
              href={`tel:${(systemInfo.mobile || systemInfo.phone || '+8801713378787').replace(/\s+/g, '')}`}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#C8963E]" />
              <span>{systemInfo.phone || '+880 1713378787'}</span>
            </a>

            <Link
              href="/enroll-now?course=Chartered%20Financial%20Officer%20(CFO)"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 font-black text-xs shadow-sm transition-all transform active:scale-95 cursor-pointer whitespace-nowrap"
            >
              {lang === 'bn' ? 'অনলাইন ভর্তি' : 'Apply Now'}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Dedicated Executive Appbar Navigation Strip */}
      <div className="bg-[#0A192F] text-white border-b border-[#1E3A8A] shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* 8 Appbar Navigation Sections - Always Visible & Horizontal Scroll on Mobile */}
            <nav className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 py-2 overflow-x-auto no-scrollbar w-full lg:w-auto">
              {/* 1. Home */}
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  pathname === '/'
                    ? 'text-[#E5A93C] bg-white/10 shadow-xs'
                    : 'text-slate-200 hover:text-[#E5A93C] hover:bg-white/5'
                }`}
              >
                Home
              </Link>

              {/* 2. About Us */}
              <Link
                href="/about"
                className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  pathname === '/about'
                    ? 'text-[#E5A93C] bg-white/10 shadow-xs'
                    : 'text-slate-200 hover:text-[#E5A93C] hover:bg-white/5'
                }`}
              >
                About Us
              </Link>

              {/* 3. Courses */}
              <Link
                href="/courses"
                className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  pathname.startsWith('/courses')
                    ? 'text-[#E5A93C] bg-white/10 shadow-xs'
                    : 'text-slate-200 hover:text-[#E5A93C] hover:bg-white/5'
                }`}
              >
                Courses
              </Link>

              {/* 4. Media & News */}
              <Link
                href="/media-news"
                className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  pathname === '/media-news' || pathname.startsWith('/media-news')
                    ? 'text-[#E5A93C] bg-white/10 shadow-xs'
                    : 'text-slate-200 hover:text-[#E5A93C] hover:bg-white/5'
                }`}
              >
                Media &amp; News
              </Link>

              {/* 5. Participant */}
              <Link
                href="/participant"
                className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  pathname === '/participant'
                    ? 'text-[#E5A93C] bg-white/10 shadow-xs'
                    : 'text-slate-200 hover:text-[#E5A93C] hover:bg-white/5'
                }`}
              >
                Participant
              </Link>

              {/* 6. Facilitator */}
              <Link
                href="/facilitator"
                className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  pathname === '/facilitator'
                    ? 'text-[#E5A93C] bg-white/10 shadow-xs'
                    : 'text-slate-200 hover:text-[#E5A93C] hover:bg-white/5'
                }`}
              >
                Facilitator
              </Link>

              {/* 7. Contact Us */}
              <Link
                href="/contact"
                className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  pathname === '/contact'
                    ? 'text-[#E5A93C] bg-white/10 shadow-xs'
                    : 'text-slate-200 hover:text-[#E5A93C] hover:bg-white/5'
                }`}
              >
                Contact Us
              </Link>

              {/* 8. Certificates */}
              <Link
                href="/certificates"
                className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  pathname === '/certificates' || pathname === '/verify-certificate'
                    ? 'text-[#E5A93C] bg-white/10 shadow-xs'
                    : 'text-slate-200 hover:text-[#E5A93C] hover:bg-white/5'
                }`}
              >
                Certificates
              </Link>
            </nav>

            {/* Courses Mega Menu Trigger on Appbar */}
            <div className="hidden lg:flex items-center gap-3 shrink-0 py-1.5">
              <div className="relative" ref={coursesMenuRef}>
                <button
                  onClick={() => setIsCoursesMenuOpen(!isCoursesMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1E3A8A]/60 hover:bg-[#1E3A8A] text-[#E5A93C] text-xs font-bold transition-colors cursor-pointer border border-[#C8963E]/40"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>{lang === 'bn' ? 'সকল প্রোগ্রাম ক্যাটালগ' : 'Academic Tracks'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCoursesMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Courses Mega Dropdown Menu */}
                {isCoursesMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-96 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {lang === 'bn' ? 'প্রফেশনাল প্রোগ্রামসমূহ' : 'Academic Tracks'}
                      </span>
                      <Link
                        href="/courses"
                        onClick={() => setIsCoursesMenuOpen(false)}
                        className="text-xs font-bold text-[#C8963E] hover:underline"
                      >
                        {lang === 'bn' ? 'সব প্রোগ্রাম দেখুন →' : 'View All →'}
                      </Link>
                    </div>
                    <div className="py-2 space-y-1">
                      {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryClick(cat.id)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-50/70 text-slate-800 text-left transition-colors group cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-white group-hover:shadow-xs transition-all shrink-0">
                            {getCategoryIcon(cat.icon)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900 group-hover:text-[#0A192F]">
                              {lang === 'bn' ? cat.label : cat.labelEn}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white p-4 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto">
          {/* Mobile Search */}
          <div className="relative">
            <input
              type="text"
              value={activeSearchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={lang === 'bn' ? 'কোর্স খুঁজুন...' : 'Search programs...'}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          {/* Quick Links */}
          <div className="space-y-1 pt-1 font-semibold text-xs text-slate-800">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 whitespace-nowrap"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 whitespace-nowrap"
            >
              About Us
            </Link>
            <Link
              href="/courses"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 whitespace-nowrap"
            >
              Courses
            </Link>
            <Link
              href="/media-news"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 whitespace-nowrap"
            >
              Media &amp; News
            </Link>
            <Link
              href="/participant"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 whitespace-nowrap"
            >
              Participant
            </Link>
            <Link
              href="/facilitator"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 whitespace-nowrap"
            >
              Facilitator
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 whitespace-nowrap"
            >
              Contact Us
            </Link>
            <Link
              href="/certificates"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 whitespace-nowrap"
            >
              Certificates
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/enroll-now?course=Chartered%20Financial%20Officer%20(CFO)"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-[#C8963E] hover:bg-[#b8860b] text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <Award className="w-4 h-4" />
              <span>{lang === 'bn' ? 'অনলাইন ভর্তি ফর্ম পূরণ করুন' : 'Apply for CFO Program'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
