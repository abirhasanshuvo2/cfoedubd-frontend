'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCfo } from '@/context/CfoContext';
import Link from 'next/link';
import {
  Users,
  Search,
  Building2,
  Award,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  ShieldCheck,
  Filter,
  ExternalLink,
  ArrowRight,
  Star,
  RefreshCw,
  Mail,
  UserCheck,
  Sparkles,
} from 'lucide-react';

interface StudentItem {
  id: number;
  full_name: string;
  email: string;
  username: string;
  status: number;
  program?: string;
  batch?: string;
  organization?: string;
}

interface StudentApiResponse {
  success: boolean;
  data: {
    current_page: number;
    data: StudentItem[];
    total: number;
    last_page: number;
    links?: { url: string | null; label: string; active: boolean; page: number | null }[];
  };
  isLive?: boolean;
}

export default function ParticipantPage() {
  const { lang } = useCfo();
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  const loadStudents = (page: number) => {
    setLoading(true);
    fetch(`/api/people/students?page=${page}`)
      .then((res) => res.json())
      .then((json: StudentApiResponse) => {
        if (json && json.data && Array.isArray(json.data.data)) {
          setStudents(json.data.data);
          setTotalStudents(json.data.total || json.data.data.length);
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
    fetch(`/api/people/students?page=${currentPage}`)
      .then((res) => res.json())
      .then((json: StudentApiResponse) => {
        if (isMounted && json && json.data && Array.isArray(json.data.data)) {
          setStudents(json.data.data);
          setTotalStudents(json.data.total || json.data.data.length);
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

  const filteredStudents = students.filter((s) => {
    const query = searchQuery.toLowerCase();
    return (
      s.full_name?.toLowerCase().includes(query) ||
      s.email?.toLowerCase().includes(query) ||
      s.username?.toLowerCase().includes(query) ||
      s.program?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-[#0A192F] text-white py-16 px-4 border-b border-[#1E3A8A] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_-10%,rgba(200,150,62,0.18),transparent)]" />
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E3A8A]/50 border border-[#C8963E]/40 text-xs font-bold text-[#E5A93C]">
            <Users className="w-4 h-4 text-[#C8963E]" />
            <span>Official Student & Participant Directory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-white">
            Our <span className="text-[#E5A93C]">Participants</span> & Enrolled Students
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Official Enrolled Student &amp; Participant Directory of Chartered Officer Limited.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students by name, email, or username..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-[#C8963E]/40 text-white text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#C8963E]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-2xl sm:text-3xl font-black text-[#0A192F]">
                {totalStudents > 0 ? totalStudents : students.length}
              </div>
              <div className="text-xs text-slate-500 font-semibold mt-1">Enrolled Participants</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-2xl sm:text-3xl font-black text-[#C8963E]">100%</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">Verified Enrollees</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-2xl sm:text-3xl font-black text-[#0A192F]">BTEB &amp; RJSC</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">Accredited Diplomas</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">Active</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">Status Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Student Directory */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {loading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-xs">
            <div className="w-8 h-8 border-3 border-[#C8963E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">Loading participants...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-700 font-bold text-sm">No students found matching &quot;{searchQuery}&quot;</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-3 px-4 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              Clear Search Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => {
              // Generate clean avatar initials
              const initials = student.full_name
                ? student.full_name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()
                : 'ST';

              return (
                <div
                  key={student.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-[#C8963E]/40 transition-all flex flex-col justify-between space-y-4 relative group"
                >
                  <div className="flex items-start gap-4">
                    {/* Initials Avatar */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0A192F] to-[#1E3A8A] text-[#E5A93C] flex items-center justify-center font-bold text-base border-2 border-[#C8963E]/40 shrink-0 shadow-2xs">
                      {initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-bold text-slate-900 truncate">
                          {student.full_name}
                        </h3>
                        {student.status === 1 && (
                          <span title="Active Student">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-mono text-[#C8963E] truncate">@{student.username}</p>

                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{student.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Program / Batch Tag */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Program:</span>
                      <span className="font-semibold text-slate-800 text-right truncate ml-2">
                        {student.program || 'Chartered Financial Officer (CFO)'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Cohort Batch:</span>
                      <span className="font-bold text-[#C8963E]">{student.batch || 'Batch 18'}</span>
                    </div>
                    {student.organization && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Organization:</span>
                        <span className="text-slate-700 font-medium truncate ml-2">{student.organization}</span>
                      </div>
                    )}
                  </div>

                  {/* Student ID & Status Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-400">ID: #{student.id}</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Status: {student.status === 1 ? 'Enrolled & Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Call-to-action to Enroll */}
        <section className="mt-16 bg-gradient-to-r from-[#0A192F] to-[#1E3A8A] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-[#C8963E]/40 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8963E]/20 text-[#E5A93C] text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>Join the Chartered Executive Community</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black">
              Ready to Join Our Next Batch of Participants?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Elevate your financial acumen and technical capabilities with government-accredited credentials from CFO Bangladesh.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/enroll-now?course=Chartered%20Financial%20Officer%20(CFO)"
              className="px-6 py-3 rounded-xl bg-[#C8963E] hover:bg-[#b8860b] text-slate-950 font-bold text-xs shadow-md transition-all text-center"
            >
              Enroll Now
            </Link>
            <Link
              href="/certificates"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all text-center"
            >
              Verify Certificate
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
