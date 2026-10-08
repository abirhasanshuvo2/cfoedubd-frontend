'use client';

import React, { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
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
  User,
  GraduationCap,
  Download,
  Share2,
  AlertCircle,
  ExternalLink,
  Eye,
  FileCheck,
  Check,
  Phone,
  Mail,
  Hash,
  RefreshCw,
  Printer,
  Sparkles,
  X,
  FileText,
  Maximize2,
  Layers,
  FileDown,
  Info,
  Clock,
  BookOpen,
} from 'lucide-react';

export interface CertificateItem {
  id?: number | string;
  serial_number: number | string;
  grade: string;
  registration_id: string;
  student_name: string;
  father_name?: string | null;
  mother_name?: string | null;
  class_name: string;
  session_title: string | null;
  start_date?: string | null;
  end_date?: string | null;
  issued_at: string | null;
  view_url?: string;
  download_url: string;
}

type SearchMode = 'auto' | 'phone' | 'email' | 'id';
type ViewFormat = 'pdf' | 'visual';

function CertificateVerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { lang, systemInfo, theme } = useCfo();

  // Extract initial query from identifier, email, phone, registration_id, or id
  const initialQuery =
    searchParams.get('identifier') ||
    searchParams.get('email') ||
    searchParams.get('phone') ||
    searchParams.get('registration_id') ||
    searchParams.get('id') ||
    '';

  const [inputVal, setInputVal] = useState<string>(initialQuery);
  const [activeMode, setActiveMode] = useState<SearchMode>('auto');
  const [certificates, setCertificates] = useState<CertificateItem[] | null>(null);
  const [selectedCertIndex, setSelectedCertIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [lastSearchedQuery, setLastSearchedQuery] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [previewModalCert, setPreviewModalCert] = useState<CertificateItem | null>(null);
  const [extendedDetails, setExtendedDetails] = useState<Record<string, any>>({});
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [loadingExtended, setLoadingExtended] = useState<boolean>(false);
  const [viewFormat, setViewFormat] = useState<ViewFormat>('visual');

  // Auto-detect input type
  const detectedType = useMemo(() => {
    const val = inputVal.trim();
    if (!val) return null;
    if (val.includes('@')) return 'email';
    const digits = val.replace(/\D/g, '');
    if (digits.length >= 10 && (digits.startsWith('01') || digits.startsWith('8801') || val.startsWith('+880'))) {
      return 'phone';
    }
    return 'id';
  }, [inputVal]);

  const loadFullDetails = useCallback(async (serial: string | number) => {
    const sStr = String(serial);
    if (extendedDetails[sStr]) return;

    setLoadingExtended(true);
    try {
      const res = await fetch(`/api/enrollment/certificates/${encodeURIComponent(sStr)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setExtendedDetails((prev) => ({ ...prev, [sStr]: json.data }));
        }
      }
    } catch {
      // Ignore
    } finally {
      setLoadingExtended(false);
    }
  }, [extendedDetails]);

  const fetchCertificate = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;

      setLoading(true);
      setHasSearched(true);
      setLastSearchedQuery(trimmed);
      setErrorMessage(null);

      try {
        const proxyRes = await fetch(
          `/api/enrollment/certificates/lookup?identifier=${encodeURIComponent(trimmed)}`
        );
        const json = await proxyRes.json();

        if (proxyRes.ok && json.success && Array.isArray(json.data) && json.data.length > 0) {
          setCertificates(json.data);
          setSelectedCertIndex(0);
          setErrorMessage(null);
          // Preload full details for first certificate
          const firstSerial = json.data[0]?.serial_number;
          if (firstSerial) {
            loadFullDetails(firstSerial);
          }
        } else {
          setCertificates([]);
          const msg =
            json.message ||
            (lang === 'bn'
              ? `"${trimmed}" এর বিপরীতে কোনো সনদপত্র পাওয়া যায়নি। ফোন নম্বর, ইমেইল অথবা রেজিস্ট্রেশন আইডি সঠিক কিনা নিশ্চিত করুন।`
              : `No certificate found for "${trimmed}". Please verify your phone number, email, or registration ID.`);
          setErrorMessage(msg);
        }
      } catch {
        setCertificates([]);
        setErrorMessage(
          lang === 'bn'
            ? 'সার্ভারের সাথে সংযোগে সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।'
            : 'Connection error while checking certificate. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    },
    [lang, loadFullDetails]
  );

  // Auto-fetch if query was in URL on initial render
  useEffect(() => {
    if (!initialQuery) return;
    const timer = setTimeout(() => {
      fetchCertificate(initialQuery);
    }, 0);
    return () => clearTimeout(timer);
  }, [initialQuery, fetchCertificate]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    // Push new query into browser history
    router.push(`/certificates?identifier=${encodeURIComponent(trimmed)}`);
    fetchCertificate(trimmed);
  };

  const handleCopyLink = (identifier: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/certificates?identifier=${encodeURIComponent(identifier)}`;
      navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const getPdfViewUrl = (cert: CertificateItem) => {
    const serial = cert.serial_number || cert.registration_id;
    return `/api/enrollment/certificates/${encodeURIComponent(String(serial))}/view`;
  };

  const getPdfDownloadUrl = (cert: CertificateItem) => {
    const serial = cert.serial_number || cert.registration_id;
    return `/api/enrollment/certificates/${encodeURIComponent(String(serial))}/download`;
  };

  const activeCert = certificates && certificates.length > 0 ? certificates[selectedCertIndex] || certificates[0] : null;
  const activeFullInfo = activeCert ? extendedDetails[String(activeCert.serial_number)] : null;

  return (
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      <Navbar />

      {/* Verification Hero Banner */}
      <section className="relative bg-gradient-to-b from-amber-50/90 via-slate-50 to-white dark:from-[#0A192F] dark:via-[#0D254C] dark:to-[#0A192F] dark:bg-[#0A192F] text-slate-900 dark:text-white pt-10 pb-12 px-4 overflow-hidden border-b border-slate-200 dark:border-[#1E3A8A] transition-colors print:hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(200,150,62,0.22),rgba(10,25,47,0))]" />

        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-[#1E3A8A]/60 border border-amber-300 dark:border-amber-400/50 text-xs font-bold text-amber-950 dark:text-[#FFC000] shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-[#FFC000]" />
            <span>
              {lang === 'bn'
                ? 'অনলাইন সার্টিফিকেট অনুসন্ধান ও ডাউনলোড সিস্টেম'
                : 'Official Certificate Lookup & Download System'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-slate-950 dark:text-white tracking-tight">
            {lang === 'bn' ? (
              <>
                ফোন নম্বর, ইমেইল বা আইডি দিয়ে{' '}
                <span className="text-amber-800 dark:text-[#FFC000]">
                  সনদপত্র অনুসন্ধান ও ডাউনলোড
                </span>
              </>
            ) : (
              <>
                Look Up &amp; Download Certificates by{' '}
                <span className="text-amber-800 dark:text-[#FFC000]">
                  Phone, Email or ID
                </span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            {lang === 'bn'
              ? 'শিক্ষার্থী বা নিয়োগকারী প্রতিষ্ঠান যেকোনো সময় মোবাইল নম্বর, ইমেইল বা রেজিস্ট্রেশন আইডি দিয়ে চার্টার্ড অফিসার কর্তৃক ইস্যুকৃত মূল পিডিএফ সনদপত্র দেখতে ও সরাসরি ডাউনলোড করতে পারেন।'
              : 'Students, employers, and verifying authorities can instantly search using Phone Number, Email Address, or Registration ID to view authentic PDF certificates and download high-resolution copies.'}
          </p>

          {/* Search Box Card */}
          <div className="max-w-2xl mx-auto pt-2">
            {/* Search Mode Filter Tabs */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveMode('auto')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMode === 'auto'
                    ? 'bg-[#0A192F] text-[#FFC000] shadow-sm border border-amber-400'
                    : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'স্মার্ট লুকআপ' : 'Smart Search'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode('phone')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMode === 'phone'
                    ? 'bg-[#0A192F] text-[#FFC000] shadow-sm border border-amber-400'
                    : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'ফোন নম্বর' : 'Phone'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode('email')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMode === 'email'
                    ? 'bg-[#0A192F] text-[#FFC000] shadow-sm border border-amber-400'
                    : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'ইমেইল' : 'Email'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode('id')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMode === 'id'
                    ? 'bg-[#0A192F] text-[#FFC000] shadow-sm border border-amber-400'
                    : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Hash className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'রেজিস্ট্রেশন আইডি' : 'Reg ID / Serial'}</span>
              </button>
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row gap-2 bg-white dark:bg-slate-900/95 p-2 rounded-2xl border-2 border-amber-300 dark:border-amber-400/60 shadow-lg backdrop-blur-xs"
            >
              <div className="relative flex-1 flex items-center">
                <div className="pl-3.5 pr-1.5 text-amber-700 dark:text-[#FFC000] shrink-0">
                  {detectedType === 'phone' || activeMode === 'phone' ? (
                    <Phone className="w-4 h-4" />
                  ) : detectedType === 'email' || activeMode === 'email' ? (
                    <Mail className="w-4 h-4" />
                  ) : detectedType === 'id' || activeMode === 'id' ? (
                    <Hash className="w-4 h-4" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </div>

                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={
                    activeMode === 'phone'
                      ? lang === 'bn'
                        ? 'ফোন নম্বর দিন (যেমন: 01712345678, +88017...)'
                        : 'Enter Phone Number (e.g. 01712345678, +88017...)'
                      : activeMode === 'email'
                      ? lang === 'bn'
                        ? 'ইমেইল ঠিকানা দিন (যেমন: ali@gmail.com)'
                        : 'Enter Email Address (e.g. ali@gmail.com)'
                      : activeMode === 'id'
                      ? lang === 'bn'
                        ? 'রেজিস্ট্রেশন বা সিরিয়াল আইডি দিন (যেমন: 222, REG12345)'
                        : 'Enter Reg ID / Serial (e.g. 222, REG12345)'
                      : lang === 'bn'
                      ? 'ফোন নম্বর, ইমেইল অথবা আইডি দিন (যেমন: 01712345678, ali@gmail.com, 222)'
                      : 'Enter Phone, Email, or Reg ID (e.g. 01712345678, ali@gmail.com, 222)'
                  }
                  className="w-full py-3 pr-3 bg-transparent text-slate-900 dark:text-white font-medium text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
                />

                {inputVal && (
                  <button
                    type="button"
                    onClick={() => setInputVal('')}
                    className="p-1.5 mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="Clear"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !inputVal.trim()}
                className="px-6 py-3 bg-[#FFC000] hover:bg-[#E6AC00] text-slate-950 font-serif font-black text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-md disabled:opacity-50 border border-amber-400"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>{lang === 'bn' ? 'অনুসন্ধান হচ্ছে...' : 'Searching...'}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                    <span>{lang === 'bn' ? 'সনদ খুঁজুন ও ডাউনলোড' : 'Find & Download PDF'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Main Results Container */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 border-3 border-[#C8963E] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {lang === 'bn'
                ? 'ডাটাবেজ হতে সার্টিফিকেট অনুসন্ধান ও লোড করা হচ্ছে...'
                : 'Retrieving official certificate records and PDF...'}
            </p>
            <p className="text-xs text-slate-500 font-mono">Identifier: &quot;{inputVal}&quot;</p>
          </div>
        )}

        {/* Error / Not Found Message */}
        {!loading && errorMessage && (
          <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-center space-y-4 shadow-xs">
            <AlertCircle className="w-12 h-12 text-rose-600 dark:text-rose-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-bold text-rose-950 dark:text-rose-200">
                {lang === 'bn' ? 'কোনো সনদপত্র পাওয়া যায়নি' : 'No Certificate Record Found'}
              </h3>
              <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300 max-w-md mx-auto leading-relaxed">
                {errorMessage}
              </p>
            </div>

            <div className="pt-2 text-xs text-slate-600 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-center gap-3">
              <span className="text-slate-500">
                {lang === 'bn'
                  ? 'সহায়তার জন্য অ্যাডমিশন অফিসে যোগাযোগ করুন:'
                  : 'For certificate assistance, contact COL office:'}
              </span>
              <a
                href={`tel:${(systemInfo.mobile || systemInfo.phone || '+8801713378787').replace(/\s+/g, '')}`}
                className="font-mono font-bold text-[#0A192F] dark:text-[#FFC000] hover:text-[#C8963E] inline-flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5 text-[#C8963E]" />
                <span>{systemInfo.phone || '+880 1713378787'}</span>
              </a>
            </div>
          </div>
        )}

        {/* Success Results State */}
        {!loading && certificates && certificates.length > 0 && activeCert && (
          <div className="space-y-6">
            {/* Top Summary & Share Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 shadow-2xs print:hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-serif font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-2 flex-wrap">
                    <span>
                      {lang === 'bn'
                        ? `মোট ${certificates.length}টি সনদপত্র পাওয়া গেছে`
                        : `Found ${certificates.length} Verified Certificate${certificates.length > 1 ? 's' : ''}`}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-700">
                      Live Verified
                    </span>
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300">
                    {lang === 'bn'
                      ? `অনুসন্ধান: "${lastSearchedQuery}" এর বিপরীতে ডাটাবেজে সংরক্ষিত রেকর্ড প্রদর্শন করা হচ্ছে।`
                      : `Displaying authentic certificates matching query "${lastSearchedQuery}".`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyLink(lastSearchedQuery)}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-slate-700 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>
                    {copySuccess
                      ? lang === 'bn'
                        ? 'লিংক কপি হয়েছে!'
                        : 'Copied!'
                      : lang === 'bn'
                      ? 'লিংক শেয়ার'
                      : 'Share Link'}
                  </span>
                </button>
              </div>
            </div>

            {/* Multiple Certificates Selector Cards (When user searched by Phone or Email with multi-programs) */}
            {certificates.length > 1 && (
              <div className="space-y-2.5 print:hidden">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600 dark:text-[#FFC000]" />
                  <span>
                    {lang === 'bn'
                      ? 'একাধিক কোর্সের সনদ রয়েছে — সিলেক্ট করে দেখুন অথবা সরাসরি ডাউনলোড করুন:'
                      : 'Multiple Course Certificates Found — Select to view or download directly:'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {certificates.map((c, idx) => {
                    const isSelected = selectedCertIndex === idx;
                    const cDownloadUrl = getPdfDownloadUrl(c);

                    return (
                      <div
                        key={c.serial_number || idx}
                        onClick={() => {
                          setSelectedCertIndex(idx);
                          loadFullDetails(c.serial_number);
                        }}
                        className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#0A192F] text-white border-amber-400 shadow-md ring-2 ring-amber-400/40'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-amber-300'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                isSelected
                                  ? 'bg-[#FFC000] text-slate-950'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              #{c.registration_id}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                isSelected
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                              }`}
                            >
                              Grade: {c.grade}
                            </span>
                          </div>
                          <h4 className="text-xs font-serif font-black line-clamp-1">{c.class_name}</h4>
                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            {c.session_title || 'Executive Session'}
                          </p>
                        </div>

                        <div className="pt-2 text-[10px] flex items-center justify-between border-t border-slate-200 dark:border-slate-700/60 mt-3">
                          <span className={isSelected ? 'text-slate-300' : 'text-slate-400'}>
                            Issued: {c.issued_at}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <a
                              href={cDownloadUrl}
                              download
                              onClick={(e) => e.stopPropagation()}
                              className="px-2 py-0.5 rounded bg-[#FFC000] text-slate-950 font-bold hover:bg-[#E6AC00] inline-flex items-center gap-1"
                              title="Download PDF"
                            >
                              <Download className="w-2.5 h-2.5 stroke-[2.5]" />
                              <span>PDF</span>
                            </a>
                            <span className="font-bold text-[#FFC000]">
                              {isSelected ? 'Viewing' : 'Select'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Main Certificate Showcase Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#C8963E]/40 shadow-xl overflow-hidden space-y-5">
              {/* Top Details & Action Bar */}
              <div className="bg-[#0A192F] text-white p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#1E3A8A] print:hidden">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-[#FFC000] text-slate-950">
                      ID: #{activeCert.registration_id}
                    </span>
                    <span className="text-xs text-slate-300 font-mono">
                      Serial: #{activeCert.serial_number}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Grade: {activeCert.grade}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-white">
                    {activeCert.student_name}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#FFC000] font-semibold flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#FFC000]" />
                    <span>
                      {activeCert.class_name} {activeCert.session_title ? `(${activeCert.session_title})` : ''}
                    </span>
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  {/* 1. Direct PDF Download */}
                  <a
                    href={getPdfDownloadUrl(activeCert)}
                    download={`Certificate_${activeCert.student_name.replace(/[^a-zA-Z0-9]/g, '_')}_${activeCert.registration_id || activeCert.serial_number}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-[#FFC000] hover:bg-[#E6AC00] text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer border border-amber-300"
                  >
                    <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                    <span>{lang === 'bn' ? 'পিডিএফ ডাউনলোড' : 'Download PDF'}</span>
                  </a>

                  {/* 2. Fullscreen Viewer */}
                  <button
                    type="button"
                    onClick={() => setPreviewModalCert(activeCert)}
                    className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-white/25 shadow-xs"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-[#FFC000]" />
                    <span>{lang === 'bn' ? 'ফুলস্ক্রিন' : 'Fullscreen'}</span>
                  </button>

                  {/* 3. Open in New Tab */}
                  <a
                    href={getPdfViewUrl(activeCert)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-white/25 shadow-xs"
                    title="Open PDF in new window"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#FFC000]" />
                    <span>{lang === 'bn' ? 'নতুন উইন্ডো' : 'New Tab'}</span>
                  </a>

                  {/* 4. Complete Verification Details Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      loadFullDetails(activeCert.serial_number);
                      setShowDetailsModal(true);
                    }}
                    className="px-3 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-[#FFC000] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-amber-400/30 shadow-xs"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'পূর্ণাঙ্গ রেকর্ড' : 'Full Record'}</span>
                  </button>

                  {/* 5. Print Button */}
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-white/25 shadow-xs"
                    title="Print Certificate"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#FFC000]" />
                    <span>{lang === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
                  </button>
                </div>
              </div>

              {/* Summary Attributes Strip */}
              <div className="px-6 py-3 bg-amber-50/70 dark:bg-slate-800/80 border-b border-amber-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-700 dark:text-slate-300 gap-3 print:hidden">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  {activeCert.start_date && activeCert.end_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-[#FFC000]" />
                      <strong className="text-slate-900 dark:text-white">Period:</strong>{' '}
                      {activeCert.start_date} – {activeCert.end_date}
                    </span>
                  )}
                  {activeCert.issued_at && (
                    <span className="flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <strong className="text-slate-900 dark:text-white">Issued:</strong>{' '}
                      {activeCert.issued_at}
                    </span>
                  )}
                  {activeFullInfo?.father_name && (
                    <span>
                      <strong className="text-slate-900 dark:text-white">Father:</strong>{' '}
                      {activeFullInfo.father_name}
                    </span>
                  )}
                  {activeFullInfo?.mother_name && (
                    <span>
                      <strong className="text-slate-900 dark:text-white">Mother:</strong>{' '}
                      {activeFullInfo.mother_name}
                    </span>
                  )}
                </div>

                {/* View Format Switcher */}
                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setViewFormat('visual')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                      viewFormat === 'visual'
                        ? 'bg-[#FFC000] text-slate-950 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>{lang === 'bn' ? 'সার্টিফিকেট ভিউ' : 'Visual Certificate'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewFormat('pdf')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                      viewFormat === 'pdf'
                        ? 'bg-[#FFC000] text-slate-950 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <FileText className="w-3 h-3" />
                    <span>{lang === 'bn' ? 'পিডিএফ প্রিভিউ' : 'PDF Viewer'}</span>
                  </button>
                </div>
              </div>

              {/* CERTIFICATE DISPLAY CONTAINER */}
              <div className="p-3 sm:p-6">
                {viewFormat === 'visual' ? (
                  /* VISUAL HIGH-RESOLUTION CERTIFICATE CANVAS (Always displays beautifully on all mobile & desktop browsers) */
                  <div className="w-full max-w-4xl mx-auto bg-[#FDFBF7] text-slate-900 rounded-2xl border-4 sm:border-8 border-[#C8963E] p-6 sm:p-10 shadow-2xl relative overflow-hidden select-text">
                    {/* Inner Decorative Double Border */}
                    <div className="border border-slate-900/40 p-4 sm:p-8 relative">
                      {/* Corner Accents */}
                      <div className="absolute top-1 left-1 w-3 h-3 bg-[#C8963E]" />
                      <div className="absolute top-1 right-1 w-3 h-3 bg-[#C8963E]" />
                      <div className="absolute bottom-1 left-1 w-3 h-3 bg-[#C8963E]" />
                      <div className="absolute bottom-1 right-1 w-3 h-3 bg-[#C8963E]" />

                      {/* Header Organization Branding */}
                      <div className="text-center space-y-1 mb-6">
                        <h2 className="text-lg sm:text-2xl font-serif font-black tracking-wider text-[#0A192F]">
                          CHARTERED OFFICER LIMITED
                        </h2>
                        <p className="text-[9px] sm:text-[11px] tracking-widest uppercase font-bold text-[#C8963E]">
                          Center of Excellence for Professional Finance &amp; Leadership
                        </p>
                        <div className="w-40 h-0.5 bg-[#C8963E] mx-auto mt-2" />
                      </div>

                      {/* Main Award Title */}
                      <div className="text-center space-y-2 mb-6">
                        <h3 className="text-xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight text-[#0A192F]">
                          CERTIFICATE OF EXCELLENCE
                        </h3>
                        <p className="text-[10px] sm:text-xs font-bold tracking-widest text-slate-500 uppercase">
                          This is proudly presented to
                        </p>
                      </div>

                      {/* Student Name */}
                      <div className="text-center my-6 sm:my-8">
                        <h4 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black text-[#0A192F] underline decoration-[#C8963E] decoration-2 underline-offset-8">
                          {activeCert.student_name}
                        </h4>
                      </div>

                      {/* Award Description */}
                      <div className="text-center max-w-2xl mx-auto space-y-2 mb-6 text-slate-700">
                        <p className="text-xs sm:text-sm font-serif italic text-slate-800">
                          for successfully completing the rigorous executive professional curriculum in
                        </p>
                        <h5 className="text-base sm:text-2xl font-serif font-black text-[#C8963E]">
                          {activeCert.class_name}
                        </h5>
                        <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                          {activeCert.session_title ? `Session: ${activeCert.session_title}` : ''}
                          {activeCert.start_date && activeCert.end_date
                            ? `  |  Period: ${activeCert.start_date} – ${activeCert.end_date}`
                            : ''}
                        </p>
                      </div>

                      {/* Awarded Grade Badge */}
                      <div className="text-center my-5">
                        <span className="inline-block px-4 py-1 rounded bg-[#FBF3DE] border border-[#C8963E] text-xs font-black text-[#0A192F] tracking-wide">
                          AWARDED GRADE: {activeCert.grade}
                        </span>
                      </div>

                      {/* Bottom Signatures and Official Seal Row */}
                      <div className="grid grid-cols-3 items-end pt-8 sm:pt-12 mt-6 border-t border-slate-300/80">
                        {/* Left Signature */}
                        <div className="text-center space-y-1">
                          <div className="w-24 sm:w-36 h-0.5 bg-slate-800 mx-auto mb-1" />
                          <p className="text-[10px] sm:text-xs font-bold text-[#0A192F]">
                            Chief Executive Officer
                          </p>
                          <p className="text-[8px] sm:text-[9px] text-slate-500">Chartered Officer Limited</p>
                        </div>

                        {/* Center Seal */}
                        <div className="text-center flex flex-col items-center justify-center">
                          <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full border-2 border-[#C8963E] bg-[#FEF3C7] flex flex-col items-center justify-center shadow-inner">
                            <span className="text-[7px] sm:text-[8px] font-black tracking-wider text-[#0A192F]">
                              OFFICIAL
                            </span>
                            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8963E] my-0.5" />
                            <span className="text-[7px] sm:text-[8px] font-black tracking-wider text-[#C8963E]">
                              VERIFIED
                            </span>
                          </div>
                        </div>

                        {/* Right Signature */}
                        <div className="text-center space-y-1">
                          <div className="w-24 sm:w-36 h-0.5 bg-slate-800 mx-auto mb-1" />
                          <p className="text-[10px] sm:text-xs font-bold text-[#0A192F]">
                            Academic Controller
                          </p>
                          <p className="text-[8px] sm:text-[9px] text-slate-500">Curriculum &amp; Exam Board</p>
                        </div>
                      </div>

                      {/* Footer Metadata */}
                      <div className="flex items-center justify-between pt-6 mt-4 text-[9px] sm:text-[10px] font-mono text-slate-500 border-t border-slate-200">
                        <span>Serial: #{activeCert.serial_number}</span>
                        <span>Reg ID: #{activeCert.registration_id}</span>
                        <span>Issued: {activeCert.issued_at || 'Verified'}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* EMBEDDED REAL PDF VIEWER CONTAINER */
                  <div className="w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-800 shadow-inner flex flex-col">
                    {/* Viewer Toolbar */}
                    <div className="bg-slate-950 text-slate-300 px-4 py-2.5 text-xs flex items-center justify-between border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#FFC000]" />
                        <span className="font-semibold text-white">
                          {activeCert.student_name} — {activeCert.class_name}.pdf
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="text-emerald-400 hidden sm:inline">
                          ● Authenticated PDF Document
                        </span>
                        <a
                          href={getPdfDownloadUrl(activeCert)}
                          download
                          className="text-[#FFC000] hover:underline font-bold inline-flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          Direct Download
                        </a>
                      </div>
                    </div>

                    {/* Embedded PDF Frame */}
                    <div className="relative w-full h-[650px] sm:h-[750px] md:h-[820px] bg-slate-100 dark:bg-slate-950">
                      <object
                        data={`${getPdfViewUrl(activeCert)}#toolbar=1&navpanes=0`}
                        type="application/pdf"
                        className="w-full h-full"
                      >
                        <iframe
                          src={`${getPdfViewUrl(activeCert)}#toolbar=1&navpanes=0`}
                          title={`Certificate PDF - ${activeCert.student_name}`}
                          className="w-full h-full border-0"
                        >
                          {/* Fallback if browser blocks iframe PDF embedding */}
                          <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-900 text-white space-y-4">
                            <FileCheck className="w-16 h-16 text-[#FFC000]" />
                            <div>
                              <h3 className="text-lg font-bold text-white">Official Certificate PDF</h3>
                              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                                Your browser does not support inline PDF previews. You can view or download the file directly below.
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <a
                                href={getPdfDownloadUrl(activeCert)}
                                download
                                className="px-6 py-2.5 rounded-xl bg-[#FFC000] text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md"
                              >
                                <Download className="w-4 h-4" />
                                Download Certificate
                              </a>
                              <a
                                href={getPdfViewUrl(activeCert)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center gap-2"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Open in New Window
                              </a>
                            </div>
                          </div>
                        </iframe>
                      </object>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Informational Guidelines when no search performed yet */}
        {!hasSearched && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-[#FFC000] flex items-center justify-center mx-auto border border-amber-300 dark:border-amber-800">
                <Phone className="w-6 h-6 text-amber-700 dark:text-[#FFC000]" />
              </div>
              <h3 className="text-sm font-serif font-black text-slate-950 dark:text-white">
                {lang === 'bn' ? 'মোবাইল বা ফোন নম্বর' : 'Phone Number Lookup'}
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {lang === 'bn'
                  ? 'আপনার ভর্তিকৃত ফোন নম্বর (যেমন: 01712345678, +88017...) দিয়ে সার্চ করলেই সনদপত্র পেয়ে যাবেন।'
                  : 'Enter the registered mobile phone number used during enrollment to find all matching certificates.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-300 dark:border-emerald-800">
                <Mail className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
              </div>
              <h3 className="text-sm font-serif font-black text-slate-950 dark:text-white">
                {lang === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address Lookup'}
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {lang === 'bn'
                  ? 'ভর্তির সময় ব্যবহৃত ইমেইল ঠিকানা দিয়ে আপনার সকল কোর্সের সার্টিফিকেট একত্রে অনুসন্ধান করতে পারবেন।'
                  : 'Look up certificates using the student email address registered in the COL portal.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-300 dark:border-blue-800">
                <Download className="w-6 h-6 text-blue-700 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-serif font-black text-slate-950 dark:text-white">
                {lang === 'bn' ? 'আসল পিডিএফ ডাউনলোড' : 'Direct PDF Download'}
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {lang === 'bn'
                  ? 'সার্ভার হতে সরাসরি উচ্চমানের A4 ল্যান্ডস্কেপ ফরম্যাটে অফিশিয়াল সার্টিফিকেট ডাউনলোড ও প্রিন্ট করুন।'
                  : 'Download or print the authentic high-resolution A4 landscape certificate directly from the server.'}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Full Record Details Modal (Reveals Father & Mother name and full academic data from /certificates/{serial}) */}
      {showDetailsModal && activeCert && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden space-y-4">
            <div className="bg-[#0A192F] text-white p-5 flex items-center justify-between border-b border-[#1E3A8A]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFC000] text-slate-950 flex items-center justify-center font-bold text-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-white">
                    {lang === 'bn' ? 'পূর্ণাঙ্গ সনদ রেকর্ড বিবরণ' : 'Full Certificate Record Details'}
                  </h3>
                  <p className="text-[11px] text-slate-300 font-mono">
                    Serial: #{activeCert.serial_number}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {loadingExtended ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-6 h-6 border-2 border-[#C8963E] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-slate-500">Loading complete student profile details...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-slate-500 font-semibold">Student Name:</span>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">
                      {activeFullInfo?.student_name || activeCert.student_name}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 font-semibold">Registration ID:</span>
                    <p className="font-mono font-bold text-slate-900 dark:text-white">
                      #{activeFullInfo?.registration_id || activeCert.registration_id}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 font-semibold">Father&#39;s Name:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {activeFullInfo?.father_name || 'N/A'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 font-semibold">Mother&#39;s Name:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {activeFullInfo?.mother_name || 'N/A'}
                    </p>
                  </div>

                  <div className="col-span-2 space-y-1">
                    <span className="text-slate-500 font-semibold">Program / Class:</span>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {activeFullInfo?.class_name || activeCert.class_name}
                    </p>
                  </div>

                  <div className="col-span-2 space-y-1">
                    <span className="text-slate-500 font-semibold">Academic Session:</span>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {activeFullInfo?.session_title || activeCert.session_title || 'N/A'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 font-semibold">Start Date:</span>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {activeFullInfo?.start_date || activeCert.start_date || 'N/A'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 font-semibold">End Date:</span>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {activeFullInfo?.end_date || activeCert.end_date || 'N/A'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 font-semibold">Grade Awarded:</span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">
                      {activeFullInfo?.grade || activeCert.grade}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 font-semibold">Issued Date:</span>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {activeFullInfo?.issued_at || activeCert.issued_at || 'Verified'}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <a
                  href={getPdfDownloadUrl(activeCert)}
                  download
                  className="px-4 py-2 rounded-xl bg-[#FFC000] text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
                <button
                  type="button"
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Fullscreen Modal (Embeds real PDF) */}
      {previewModalCert && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 overflow-hidden">
          <div className="relative w-full max-w-6xl h-[92vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#0A192F] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#1E3A8A] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFC000] text-slate-950 font-bold flex items-center justify-center text-xs">
                  PDF
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-white">
                    {previewModalCert.student_name} — Certificate PDF
                  </h3>
                  <p className="text-[11px] text-slate-300 font-mono">
                    ID: #{previewModalCert.registration_id} • Serial: #{previewModalCert.serial_number}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={getPdfDownloadUrl(previewModalCert)}
                  download={`Certificate_${previewModalCert.student_name.replace(/[^a-zA-Z0-9]/g, '_')}_${previewModalCert.registration_id || previewModalCert.serial_number}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#FFC000] hover:bg-[#E6AC00] text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md border border-amber-300"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{lang === 'bn' ? 'ডাউনলোড' : 'Download PDF'}</span>
                </a>

                <a
                  href={getPdfViewUrl(previewModalCert)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-white/25 shadow-xs"
                  title="Open in new window"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#FFC000]" />
                  <span>{lang === 'bn' ? 'নতুন উইন্ডো' : 'New Window'}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewModalCert(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-rose-600 text-white transition-colors cursor-pointer border border-white/20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Embedded Real PDF Frame */}
            <div className="flex-1 bg-slate-950 relative w-full h-full overflow-hidden">
              <object
                data={`${getPdfViewUrl(previewModalCert)}#toolbar=1`}
                type="application/pdf"
                className="w-full h-full"
              >
                <iframe
                  src={`${getPdfViewUrl(previewModalCert)}#toolbar=1`}
                  title={`Certificate Fullscreen - ${previewModalCert.student_name}`}
                  className="w-full h-full border-0"
                />
              </object>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function CertificatesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A192F] flex items-center justify-center text-white">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#C8963E] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold">Loading Verification &amp; Download Portal...</p>
          </div>
        </div>
      }
    >
      <CertificateVerificationContent />
    </Suspense>
  );
}
