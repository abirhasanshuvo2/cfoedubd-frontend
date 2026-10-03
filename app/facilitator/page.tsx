'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCfo } from '@/context/CfoContext';
import Link from 'next/link';
import {
  GraduationCap,
  Award,
  BookOpen,
  Briefcase,
  Star,
  CheckCircle2,
  Mail,
  Search,
  ExternalLink,
  Users,
  Code2,
  Building2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface EducatorItem {
  id: number;
  full_name: string;
  email: string;
  username: string;
  title?: string;
  role?: string;
  rating?: number;
  students_count?: number;
  courses?: string[];
}

interface EducatorApiResponse {
  success: boolean;
  data: {
    current_page: number;
    data: EducatorItem[];
    total: number;
    last_page: number;
    links?: { url: string | null; label: string; active: boolean; page: number | null }[];
  };
  isLive?: boolean;
}

export default function FacilitatorPage() {
  const { lang, theme } = useCfo();
  const [educators, setEducators] = useState<EducatorItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const loadEducators = (page: number) => {
    setLoading(true);
    fetch(`/api/people/educators?page=${page}`)
      .then((res) => res.json())
      .then((json: EducatorApiResponse) => {
        if (json && json.data && Array.isArray(json.data.data)) {
          setEducators(json.data.data);
          setIsLiveApi(Boolean(json.isLive));
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/people/educators?page=${currentPage}`)
      .then((res) => res.json())
      .then((json: EducatorApiResponse) => {
        if (isMounted && json && json.data && Array.isArray(json.data.data)) {
          setEducators(json.data.data);
          setIsLiveApi(Boolean(json.isLive));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  const filteredEducators = educators.filter((e) => {
    const query = searchQuery.toLowerCase();
    return (
      e.full_name?.toLowerCase().includes(query) ||
      e.email?.toLowerCase().includes(query) ||
      e.username?.toLowerCase().includes(query) ||
      e.title?.toLowerCase().includes(query) ||
      e.courses?.some((c) => c.toLowerCase().includes(query))
    );
  });

  return (
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col font-sans transition-colors ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}
    >
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-amber-50/90 via-slate-50 to-white dark:bg-[#0A192F] text-slate-900 dark:text-white py-14 sm:py-16 px-4 border-b border-slate-200 dark:border-[#1E3A8A] relative overflow-hidden transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_-10%,rgba(200,150,62,0.18),transparent)]" />
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-[#1E3A8A]/50 border border-amber-300 dark:border-[#C8963E]/40 text-xs font-bold text-amber-900 dark:text-[#E5A93C] shadow-2xs">
            <GraduationCap className="w-4 h-4 text-[#C8963E]" />
            <span>Official Educator & Facilitator Faculty</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-slate-900 dark:text-white">
            Our Respected <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#966718] dark:from-[#FFDF79] dark:via-[#E5A93C] dark:to-[#C8963E]">Facilitators</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Distinguished Faculty, Chartered Professionals &amp; Industry Leaders at Chartered Officer Limited.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search facilitators by name, username, course, or title..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-[#C8963E]/40 text-slate-900 dark:text-white text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#C8963E] shadow-2xs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Facilitator Cards */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {loading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-xs">
            <div className="w-8 h-8 border-3 border-[#C8963E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">Loading facilitators...</p>
          </div>
        ) : filteredEducators.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-700 font-bold text-sm">No facilitators found matching &quot;{searchQuery}&quot;</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-3 px-4 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              Clear Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredEducators.map((educator) => {
              const initials = educator.full_name
                ? educator.full_name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()
                : 'FC';

              return (
                <div
                  key={educator.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-[#C8963E]/50 transition-all flex flex-col justify-between group"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start gap-4">
                      {/* Person Avatar */}
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#C8963E]/40 shrink-0 shadow-xs bg-slate-100 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/dummy-avatar.svg"
                          alt={educator.full_name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-serif font-bold text-slate-900 group-hover:text-[#C8963E] transition-colors truncate">
                            {educator.full_name}
                          </h2>
                          <span title="Verified Educator">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          </span>
                        </div>

                        <p className="text-xs font-mono text-[#C8963E]">@{educator.username}</p>

                        <p className="text-xs font-semibold text-slate-600 mt-1">
                          {educator.title || educator.role || 'Senior Facilitator'}
                        </p>

                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{educator.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Courses Handled / Core Competencies */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-[#C8963E]" />
                        <span>Core Competencies:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(educator.courses && educator.courses.length > 0
                          ? educator.courses
                          : ['Chartered Financial Officer (CFO)', 'Corporate Tax & Financial Modeling']
                        ).map((c, i) => (
                          <Link
                            key={i}
                            href={`/courses?search=${encodeURIComponent(c)}`}
                            className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 border border-slate-200 hover:border-[#C8963E]/40 text-[11px] font-semibold text-slate-700 hover:text-amber-900 shadow-2xs transition-colors"
                            title={`View batches for ${c}`}
                          >
                            {c}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{educator.rating || 4.96}</span>
                      <span className="text-slate-400 font-normal">
                        ({(educator.students_count || 1200).toLocaleString()}+ trained)
                      </span>
                    </div>

                    <Link
                      href={`/courses?facilitator=${encodeURIComponent(educator.full_name)}`}
                      className="font-bold text-[#0A192F] hover:text-[#C8963E] transition-colors flex items-center gap-1 group/btn"
                    >
                      <span>View Batches</span>
                      <span className="transition-transform group-hover/btn:translate-x-0.5">→</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Join Faculty Callout */}
        <section className="mt-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-[#C8963E] mx-auto">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900 dark:text-white">
            Interested in Joining the CFO Faculty Board?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            We actively invite practicing FCAs, FCMAs, tax advocates, and senior technical educators passionate about mentoring the next generation of business leaders.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 font-serif font-black text-xs shadow-md transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4 text-slate-950" />
              <span>Submit Faculty Expression of Interest</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
