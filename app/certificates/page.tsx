'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCfo } from '@/context/CfoContext';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Award,
  Calendar,
  Download,
  AlertCircle,
  Printer,
  X,
  FileCheck,
  Layers,
  GraduationCap,
  Hash,
  User,
  Clock,
  ExternalLink,
} from 'lucide-react';

export interface CertificateData {
  serial_number: string | number;
  grade: string;
  registration_id: string | null;
  student_name: string;
  father_name?: string | null;
  mother_name?: string | null;
  class_name: string;
  session_title?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  issued_at?: string | null;
  download_url?: string;
  view_url?: string;
}

function CertificateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { lang, theme } = useCfo();

  const initialQuery =
    searchParams.get('identifier') ||
    searchParams.get('email') ||
    searchParams.get('phone') ||
    searchParams.get('registration_id') ||
    searchParams.get('id') ||
    '';

  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [certificates, setCertificates] = useState<CertificateData[] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  // Search API
  const handleSearch = useCallback(
    async (queryToSearch: string) => {
      const q = queryToSearch.trim();
      if (!q) return;

      setIsLoading(true);
      setErrorMessage(null);
      setHasSearched(true);

      try {
        let matchedData: CertificateData[] | null = null;

        // 1. Try direct call to local backend first (if running on user's machine)
        try {
          const paramKey = q.includes('@') ? 'email=' : 'identifier=';
          const directUrl = `http://127.0.0.1:8000/api/enrollment/certificates/lookup?${paramKey}${encodeURIComponent(
            q
          )}`;
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 1200);
          const directRes = await fetch(directUrl, {
            signal: controller.signal,
            headers: { Accept: 'application/json' },
          });
          clearTimeout(timeout);
          if (directRes.ok) {
            const directJson = await directRes.json();
            if (
              directJson.success &&
              Array.isArray(directJson.data) &&
              directJson.data.length > 0
            ) {
              matchedData = directJson.data;
            }
          }
        } catch {
          // Direct fetch failed or CORS, continue to server proxy
        }

        // 2. Query Next.js API endpoint
        if (!matchedData) {
          const res = await fetch(
            `/api/enrollment/certificates/lookup?identifier=${encodeURIComponent(q)}`
          );
          const json = await res.json();

          if (res.ok && json.success && Array.isArray(json.data) && json.data.length > 0) {
            matchedData = json.data;
          } else {
            setCertificates([]);
            setErrorMessage(
              json.message ||
                (lang === 'bn'
                  ? `"${q}" এর বিপরীতে কোনো সনদপত্র পাওয়া যায়নি। ফোন নম্বর, ইমেইল বা আইডি সঠিকভাবে লিখুন।`
                  : `No certificate found for "${q}". Please check your phone number, email, or registration ID.`)
            );
            return;
          }
        }

        setCertificates(matchedData);
        setSelectedIndex(0);
        setErrorMessage(null);
      } catch {
        setCertificates([]);
        setErrorMessage(
          lang === 'bn'
            ? 'সার্ভারে সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
            : 'Unable to connect to certificate service. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [lang]
  );

  // Auto-search on initial load if query in URL
  useEffect(() => {
    if (!initialQuery) return;
    const timer = setTimeout(() => {
      handleSearch(initialQuery);
    }, 0);
    return () => clearTimeout(timer);
  }, [initialQuery, handleSearch]);

  const onSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/certificates?identifier=${encodeURIComponent(q)}`);
    handleSearch(q);
  };

  const activeCert =
    certificates && certificates.length > 0 ? certificates[selectedIndex] || certificates[0] : null;

  // Trigger PDF download directly as-is from API
  const handleDownload = (cert: CertificateData) => {
    const serial = String(cert.serial_number || cert.registration_id || 'certificate');
    const targetUrl =
      cert.download_url || `/api/enrollment/certificates/${encodeURIComponent(serial)}/download`;

    setDownloading(true);
    try {
      const link = document.createElement('a');
      link.href = targetUrl;
      link.download = `certificate-${cert.registration_id || serial}.pdf`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open(targetUrl, '_blank');
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      <Navbar />

      {/* Hero Header & Search Section */}
      <section className="bg-gradient-to-b from-amber-50/80 via-slate-50 to-white dark:from-[#0A192F] dark:via-[#0D254C] dark:to-[#0A192F] text-slate-900 dark:text-white pt-10 pb-10 px-4 border-b border-slate-200 dark:border-[#1E3A8A] print:hidden">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-[#1E3A8A]/80 border border-amber-300 dark:border-amber-400/50 text-xs font-bold text-amber-950 dark:text-[#FFC000]">
            <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-[#FFC000]" />
            <span>
              {lang === 'bn'
                ? 'অনলাইন সার্টিফিকেট অনুসন্ধান ও ডাউনলোড'
                : 'Online Certificate Verification & Download'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-slate-950 dark:text-white">
            {lang === 'bn' ? (
              <>
                সনদপত্র <span className="text-amber-800 dark:text-[#FFC000]">যাচাই ও ডাউনলোড</span>
              </>
            ) : (
              <>
                Find &amp; Download <span className="text-amber-800 dark:text-[#FFC000]">Your Certificate</span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            {lang === 'bn'
              ? 'আপনার ফোন নম্বর, ইমেইল অথবা রেজিস্ট্রেশন আইডি লিখে সরাসরি সনদপত্র দেখুন এবং মূল পিডিএফ ডাউনলোড করুন।'
              : 'Enter your Phone Number, Email, or Registration ID to view and download your official certificate.'}
          </p>

          {/* Clean Search Form */}
          <form
            onSubmit={onSubmit}
            className="pt-2 max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border-2 border-amber-300 dark:border-amber-400/60 shadow-lg"
          >
            <div className="relative flex-1 flex items-center">
              <div className="pl-3.5 pr-2 text-amber-600 dark:text-[#FFC000] shrink-0">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === 'bn'
                    ? 'ফোন নম্বর, ইমেইল অথবা আইডি দিন (যেমন: 017..., alihose@..., 222)'
                    : 'Enter Phone Number, Email, or Reg ID (e.g. 017..., alihose@..., 222)'
                }
                className="w-full py-3 pr-3 bg-transparent text-slate-900 dark:text-white font-medium text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title={lang === 'bn' ? 'মুছুন' : 'Clear'}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !searchQuery.trim()}
              className="px-6 py-3 bg-[#FFC000] hover:bg-[#E6AC00] text-slate-950 font-serif font-black text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-md disabled:opacity-50 border border-amber-400"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>{lang === 'bn' ? 'অনুসন্ধান হচ্ছে...' : 'Searching...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                  <span>{lang === 'bn' ? 'সনদপত্র খুঁজুন' : 'Search Certificate'}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
        {/* Loading Indicator */}
        {isLoading && (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 border-3 border-[#C8963E] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {lang === 'bn' ? 'সনদপত্রের তথ্য লোড হচ্ছে...' : 'Loading certificate details from API...'}
            </p>
          </div>
        )}

        {/* Not Found / Error Banner */}
        {!isLoading && errorMessage && (
          <div className="max-w-xl mx-auto p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-600 dark:text-rose-400 mx-auto" />
            <h3 className="text-base font-serif font-bold text-rose-950 dark:text-rose-200">
              {lang === 'bn' ? 'সনদপত্র পাওয়া যায়নি' : 'No Certificate Found'}
            </h3>
            <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300">{errorMessage}</p>
          </div>
        )}

        {/* Certificate Found & Display */}
        {!isLoading && certificates && certificates.length > 0 && activeCert && (
          <div className="space-y-6">
            {/* Top Selector (when multiple certificates found for same phone/email) */}
            {certificates.length > 1 && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-slate-800 print:hidden space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-600 dark:text-[#FFC000]" />
                  <span>
                    {lang === 'bn'
                      ? `মোট ${certificates.length}টি সনদপত্র পাওয়া গেছে। দেখতে নির্বাচন করুন:`
                      : `Found ${certificates.length} certificates. Select one to view:`}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {certificates.map((cert, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={cert.serial_number || idx}
                        type="button"
                        onClick={() => setSelectedIndex(idx)}
                        className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#0A192F] text-white border-amber-400 shadow-md ring-2 ring-amber-400/40'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-mono font-bold">#{cert.registration_id}</span>
                          <span className="font-bold text-amber-500">
                            {lang === 'bn' ? `গ্রেড: ${cert.grade}` : `Grade: ${cert.grade}`}
                          </span>
                        </div>
                        <div className="text-xs font-serif font-black line-clamp-1">{cert.class_name}</div>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                          <span>{cert.session_title || (lang === 'bn' ? 'এক্সিকিউটিভ সেশন' : 'Executive Session')}</span>
                          <span className="font-bold text-[#FFC000]">
                            {isSelected ? (lang === 'bn' ? 'সক্রিয়' : 'Active') : (lang === 'bn' ? 'দেখুন' : 'View')}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Top Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 text-white shadow-md print:hidden">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{activeCert.student_name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-400 text-slate-950 font-bold">
                      {lang === 'bn' ? `গ্রেড: ${activeCert.grade}` : `Grade: ${activeCert.grade}`}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-300">{activeCert.class_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* PRIMARY DOWNLOAD BUTTON */}
                <button
                  type="button"
                  onClick={() => handleDownload(activeCert)}
                  disabled={downloading}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#FFC000] hover:bg-[#E6AC00] text-slate-950 font-serif font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer border border-amber-300"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    {downloading
                      ? lang === 'bn'
                        ? 'ডাউনলোড হচ্ছে...'
                        : 'Downloading...'
                      : lang === 'bn'
                      ? 'পিডিএফ ডাউনলোড করুন'
                      : 'Download Certificate (PDF)'}
                  </span>
                </button>

                {/* PRINT BUTTON */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
                  title={lang === 'bn' ? 'সনদপত্র প্রিন্ট করুন' : 'Print Certificate'}
                >
                  <Printer className="w-4 h-4 text-[#FFC000]" />
                  <span>{lang === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
                </button>
              </div>
            </div>

            {/* THE ACTUAL CERTIFICATE SHOWCASE (EMBEDDED DOCUMENT AS IT IS) */}
            <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden print:shadow-none print:border-0">
              {/* Top Document Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800 print:hidden">
                <div className="flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-[#FFC000]" />
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <span>{lang === 'bn' ? 'অফিসিয়াল মূল সনদপত্র' : 'Official Certificate Document'}</span>
                      <span className="font-mono text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                        #{activeCert.registration_id || activeCert.serial_number}
                      </span>
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`/api/enrollment/certificates/${encodeURIComponent(
                      String(activeCert.serial_number || activeCert.registration_id)
                    )}/view`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#FFC000]" />
                    <span>{lang === 'bn' ? 'নতুন ট্যাবে খুলুন' : 'Open in New Tab'}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDownload(activeCert)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#FFC000] hover:bg-[#E6AC00] text-slate-950 text-xs font-serif font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'ডাউনলোড' : 'Download'}</span>
                  </button>
                </div>
              </div>

              {/* PDF Document Viewer Frame (inline display - NEVER auto-downloads) */}
              <div className="w-full relative min-h-[520px] sm:min-h-[720px] bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center">
                <iframe
                  src={`/api/enrollment/certificates/${encodeURIComponent(
                    String(activeCert.serial_number || activeCert.registration_id)
                  )}/view`}
                  title={lang === 'bn' ? 'সনদপত্র প্রদর্শন' : 'Official Certificate'}
                  className="w-full h-[520px] sm:h-[720px] border-0 bg-white"
                />

                {/* Sub-bar below viewer */}
                <div className="w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2 print:hidden">
                  <span>
                    {lang === 'bn'
                      ? 'সনদপত্রটি সরাসরি অফিসিয়াল এপিআই থেকে প্রদর্শিত হচ্ছে।'
                      : 'Certificate is streamed directly from official API.'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDownload(activeCert)}
                    className="text-amber-600 dark:text-amber-400 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{lang === 'bn' ? 'সরাসরি মূল পিডিএফ ডাউনলোড' : 'Download Original PDF'}</span>
                    <Download className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Official Information Details Grid */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4 print:hidden">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-serif font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>
                    {lang === 'bn' ? 'সনদপত্রের অফিসিয়াল বিবরণ' : 'Official Certificate Information'}
                  </span>
                </h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {lang === 'bn' ? 'যাচাইকৃত রেকর্ড' : 'Verified Record'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-0.5">
                  <span className="text-slate-500 text-[11px]">
                    {lang === 'bn' ? 'শিক্ষার্থীর নাম:' : 'Student Name:'}
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{activeCert.student_name}</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-slate-500 text-[11px]">
                    {lang === 'bn' ? 'কোর্স / প্রোগ্রাম:' : 'Program / Class:'}
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white">{activeCert.class_name}</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-slate-500 text-[11px]">
                    {lang === 'bn' ? 'অর্জিত গ্রেড:' : 'Achieved Grade:'}
                  </span>
                  <p className="font-bold text-amber-600 dark:text-[#FFC000]">{activeCert.grade}</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-slate-500 text-[11px]">
                    {lang === 'bn' ? 'রেজিস্ট্রেশন নম্বর:' : 'Registration ID:'}
                  </span>
                  <p className="font-mono font-bold text-slate-900 dark:text-white">#{activeCert.registration_id}</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-slate-500 text-[11px]">
                    {lang === 'bn' ? 'সনদপত্র সিরিয়াল:' : 'Certificate Serial:'}
                  </span>
                  <p className="font-mono font-bold text-slate-900 dark:text-white">#{activeCert.serial_number}</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-slate-500 text-[11px]">
                    {lang === 'bn' ? 'ইস্যুর তারিখ:' : 'Issued Date:'}
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {activeCert.issued_at || (lang === 'bn' ? 'অফিসিয়াল রেকর্ড' : 'Official Record')}
                  </p>
                </div>

                {activeCert.session_title && (
                  <div className="space-y-0.5">
                    <span className="text-slate-500 text-[11px]">
                      {lang === 'bn' ? 'সেশন / ব্যাচ:' : 'Session / Batch:'}
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white">{activeCert.session_title}</p>
                  </div>
                )}

                {activeCert.start_date && activeCert.end_date && (
                  <div className="space-y-0.5">
                    <span className="text-slate-500 text-[11px]">
                      {lang === 'bn' ? 'কোর্সের সময়সীমা:' : 'Course Period:'}
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {activeCert.start_date} – {activeCert.end_date}
                    </p>
                  </div>
                )}

                {activeCert.father_name && (
                  <div className="space-y-0.5">
                    <span className="text-slate-500 text-[11px]">
                      {lang === 'bn' ? 'পিতার নাম:' : "Father's Name:"}
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white">{activeCert.father_name}</p>
                  </div>
                )}

                {activeCert.mother_name && (
                  <div className="space-y-0.5">
                    <span className="text-slate-500 text-[11px]">
                      {lang === 'bn' ? 'মাতার নাম:' : "Mother's Name:"}
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white">{activeCert.mother_name}</p>
                  </div>
                )}
              </div>

              {/* Bottom Quick Download CTA */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleDownload(activeCert)}
                  disabled={downloading}
                  className="px-4 py-2 rounded-xl bg-[#FFC000] hover:bg-[#E6AC00] text-slate-950 font-serif font-black text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{lang === 'bn' ? 'পিডিএফ ফাইল ডাউনলোড করুন' : 'Download PDF Certificate'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function CertificatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="w-10 h-10 border-3 border-[#C8963E] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CertificateContent />
    </Suspense>
  );
}
