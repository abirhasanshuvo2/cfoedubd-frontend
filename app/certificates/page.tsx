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
  Download,
  AlertCircle,
  Printer,
  X,
  FileCheck,
  Layers,
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

function getExactDownloadUrl(cert: CertificateData): string {
  if (cert.download_url && cert.download_url.trim()) {
    return cert.download_url.trim();
  }
  const serial = String(cert.serial_number ?? cert.registration_id ?? '');
  return `http://127.0.0.1:8000/api/enrollment/certificates/${encodeURIComponent(serial)}/download`;
}

interface CertificateDocumentCardProps {
  cert: CertificateData;
  index: number;
  totalCount: number;
  lang: 'bn' | 'en';
  onDownload: (cert: CertificateData) => void;
  downloadingSerial: string | null;
}

function CertificateDocumentCard({
  cert,
  index,
  totalCount,
  lang,
  onDownload,
  downloadingSerial,
}: CertificateDocumentCardProps) {
  const serial = String(cert.serial_number ?? cert.registration_id ?? index);
  const rawDownloadUrl = getExactDownloadUrl(cert);
  const cleanClassName = (cert.class_name || '').trim();

  // Inline viewer URL state: fetches the exact PDF from cert.download_url as a Blob URL
  // so the browser renders the exact API certificate inline without auto-downloading
  // and NEVER shows any custom-generated design.
  const [viewerSrc, setViewerSrc] = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    let createdObjectUrl: string | null = null;

    async function loadExactApiCertificate() {
      setLoadingPdf(true);

      // 1. Try fetching the exact download_url directly in the browser as a PDF Blob
      try {
        const res = await fetch(rawDownloadUrl, {
          method: 'GET',
          headers: { Accept: 'application/pdf, */*' },
        });
        if (res.ok) {
          const arrayBuffer = await res.arrayBuffer();
          if (arrayBuffer.byteLength > 0 && isMounted) {
            const contentType = res.headers.get('content-type') || 'application/pdf';
            const mime =
              contentType.includes('html')
                ? 'text/html'
                : contentType.includes('image/')
                ? contentType
                : 'application/pdf';
            const blob = new Blob([arrayBuffer], { type: mime });
            createdObjectUrl = URL.createObjectURL(blob);
            setViewerSrc(createdObjectUrl);
            setLoadingPdf(false);
            return;
          }
        }
      } catch {
        // Direct fetch blocked by CORS on binary download response; try inline proxy
      }

      // 2. Fallback to Next.js inline proxy (streams exact bytes from rawDownloadUrl with Content-Disposition: inline)
      if (isMounted) {
        const proxyViewUrl = `/api/enrollment/certificates/${encodeURIComponent(
          serial
        )}/view?url=${encodeURIComponent(rawDownloadUrl)}`;
        setViewerSrc(proxyViewUrl);
        setLoadingPdf(false);
      }
    }

    loadExactApiCertificate();

    return () => {
      isMounted = false;
      if (createdObjectUrl) {
        URL.revokeObjectURL(createdObjectUrl);
      }
    };
  }, [rawDownloadUrl, serial]);

  const isDownloadingThis = downloadingSerial === serial;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden print:shadow-none print:border-0">
      {/* Top Certificate Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 bg-slate-900 text-white border-b border-slate-800 print:hidden">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 text-[#FFC000] flex items-center justify-center shrink-0 font-mono font-black text-xs">
            #{index + 1}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-amber-400/20 text-[#FFC000] border border-amber-400/30">
                Serial #{cert.serial_number}
              </span>
              {cert.registration_id && (
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-800 text-slate-200 border border-slate-700">
                  Reg ID: #{cert.registration_id}
                </span>
              )}
              {cert.grade && (
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-[#FFC000] text-slate-950">
                  {lang === 'bn' ? `গ্রেড: ${cert.grade}` : `Grade: ${cert.grade}`}
                </span>
              )}
              {totalCount > 1 && (
                <span className="text-[11px] text-slate-400 font-mono">
                  ({index + 1} of {totalCount})
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-serif font-black text-white leading-snug">
              {cleanClassName}
            </h3>
            <p className="text-xs text-slate-300">
              {lang === 'bn' ? 'শিক্ষার্থী:' : 'Student:'}{' '}
              <span className="font-bold text-white">{cert.student_name}</span>
              {cert.session_title ? ` • ${cert.session_title}` : ''}
              {cert.issued_at ? ` • Issued: ${cert.issued_at}` : ''}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onDownload(cert)}
            disabled={isDownloadingThis}
            className="px-5 py-2.5 rounded-xl bg-[#FFC000] hover:bg-[#E6AC00] text-slate-950 font-serif font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer border border-amber-300 disabled:opacity-60"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>
              {isDownloadingThis
                ? lang === 'bn'
                  ? 'ডাউনলোড হচ্ছে...'
                  : 'Downloading...'
                : lang === 'bn'
                ? 'পিডিএফ ডাউনলোড করুন'
                : 'Download Certificate'}
            </span>
          </button>
        </div>
      </div>

      {/* Embedded API Certificate Viewer */}
      <div className="w-full relative min-h-[500px] sm:min-h-[680px] bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center">
        {loadingPdf ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-9 h-9 border-3 border-[#C8963E] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              {lang === 'bn'
                ? 'অফিসিয়াল সনদপত্র লোড হচ্ছে...'
                : 'Loading official certificate...'}
            </p>
          </div>
        ) : (
          viewerSrc && (
            <iframe
              key={viewerSrc}
              src={viewerSrc}
              title={`${cleanClassName} - Serial #${cert.serial_number}`}
              className="w-full h-[500px] sm:h-[680px] border-0 bg-white"
            />
          )
        )}

        {/* Sub-bar below viewer */}
        <div className="w-full py-2.5 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2 print:hidden">
          <span>
            {lang === 'bn'
              ? 'অফিসিয়াল সনদপত্র প্রদর্শিত হচ্ছে।'
              : 'Official verified certificate document.'}
          </span>
          <button
            type="button"
            onClick={() => onDownload(cert)}
            className="text-amber-700 dark:text-[#FFC000] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>{lang === 'bn' ? 'সরাসরি মূল পিডিএফ ডাউনলোড' : 'Download Original PDF'}</span>
            <Download className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Certificate Metadata Grid */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-4 print:hidden">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h4 className="text-xs sm:text-sm font-serif font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {lang === 'bn'
                ? `সনদপত্র #${cert.serial_number} এর অফিসিয়াল বিবরণ`
                : `Official Certificate Record — Serial #${cert.serial_number}`}
            </span>
          </h4>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            {lang === 'bn' ? 'যাচাইকৃত রেকর্ড' : 'Verified Record'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="space-y-0.5">
            <span className="text-slate-500 text-[11px]">
              {lang === 'bn' ? 'শিক্ষার্থীর নাম:' : 'Student Name:'}
            </span>
            <p className="font-bold text-slate-900 dark:text-white text-sm">{cert.student_name}</p>
          </div>

          <div className="space-y-0.5 sm:col-span-2">
            <span className="text-slate-500 text-[11px]">
              {lang === 'bn' ? 'কোর্স / প্রোগ্রাম:' : 'Course / Class Name:'}
            </span>
            <p className="font-bold text-slate-900 dark:text-white">{cleanClassName}</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-500 text-[11px]">
              {lang === 'bn' ? 'অর্জিত গ্রেড:' : 'Grade:'}
            </span>
            <p className="font-bold text-amber-600 dark:text-[#FFC000] text-sm">{cert.grade}</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-500 text-[11px]">
              {lang === 'bn' ? 'সিরিয়াল নম্বর:' : 'Serial Number:'}
            </span>
            <p className="font-mono font-bold text-slate-900 dark:text-white">#{cert.serial_number}</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-500 text-[11px]">
              {lang === 'bn' ? 'রেজিস্ট্রেশন আইডি:' : 'Registration ID:'}
            </span>
            <p className="font-mono font-bold text-slate-900 dark:text-white">
              #{cert.registration_id ?? 'N/A'}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-500 text-[11px]">
              {lang === 'bn' ? 'সেশন:' : 'Session Title:'}
            </span>
            <p className="font-bold text-slate-900 dark:text-white">
              {cert.session_title || 'N/A'}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-500 text-[11px]">
              {lang === 'bn' ? 'ইস্যুর তারিখ:' : 'Issued Date:'}
            </span>
            <p className="font-bold text-slate-900 dark:text-white">
              {cert.issued_at || 'N/A'}
            </p>
          </div>

          {(cert.start_date || cert.end_date) && (
            <div className="space-y-0.5 sm:col-span-2">
              <span className="text-slate-500 text-[11px]">
                {lang === 'bn' ? 'কোর্সের মেয়াদ:' : 'Course Duration:'}
              </span>
              <p className="font-bold text-slate-900 dark:text-white">
                {cert.start_date || '—'} – {cert.end_date || '—'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
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
  // 'all' displays all returned certificates stacked on the page so user sees every certificate sent by API
  const [selectedFilter, setSelectedFilter] = useState<'all' | number>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadingSerial, setDownloadingSerial] = useState<string | null>(null);

  const handleSearch = useCallback(
    async (queryToSearch: string) => {
      const q = queryToSearch.trim();
      if (!q) return;

      setIsLoading(true);
      setErrorMessage(null);

      try {
        let matchedData: CertificateData[] | null = null;

        // 1. Direct call to local Laravel backend (always passes ?identifier=... for reg ID, phone, or email)
        try {
          const directUrl = `http://127.0.0.1:8000/api/enrollment/certificates/lookup?identifier=${encodeURIComponent(
            q
          )}`;
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 8000);
          const directRes = await fetch(directUrl, {
            signal: controller.signal,
            headers: { Accept: 'application/json' },
            cache: 'no-store',
          });
          clearTimeout(timeout);

          if (directRes.ok) {
            const directJson = await directRes.json();
            if (directJson && directJson.success) {
              const list = Array.isArray(directJson.data)
                ? directJson.data
                : directJson.data
                ? [directJson.data]
                : [];
              if (list.length > 0) {
                matchedData = list;
              }
            }
          } else if (directRes.status === 404) {
            const errJson = await directRes.json().catch(() => null);
            setCertificates([]);
            setErrorMessage(
              errJson?.message ||
                (lang === 'bn'
                  ? `"${q}" এর বিপরীতে কোনো সনদপত্র পাওয়া যায়নি।`
                  : `No certificate found for "${q}".`)
            );
            return;
          }
        } catch {
          // Direct fetch failed or backend on another host, continue to Next.js API route
        }

        // 2. Fallback to Next.js API proxy route
        if (!matchedData) {
          const res = await fetch(
            `/api/enrollment/certificates/lookup?identifier=${encodeURIComponent(q)}`,
            { cache: 'no-store' }
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
        setSelectedFilter('all');
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

  // Trigger download directly from the exact download_url sent by the API
  const handleDownload = async (cert: CertificateData) => {
    const serial = String(cert.serial_number ?? cert.registration_id ?? 'certificate');
    const targetUrl = getExactDownloadUrl(cert);

    setDownloadingSerial(serial);
    try {
      // Try fetching as blob first so browser downloads cleanly with filename
      const res = await fetch(targetUrl);
      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `certificate-${serial}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
        return;
      }
    } catch {
      // Fallback to direct anchor navigation to targetUrl
    } finally {
      setTimeout(() => setDownloadingSerial(null), 600);
    }

    const link = document.createElement('a');
    link.href = targetUrl;
    link.download = `certificate-${serial}.pdf`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download all certificates when user has multiple
  const handleDownloadAll = () => {
    if (!certificates || certificates.length === 0) return;
    certificates.forEach((cert, idx) => {
      setTimeout(() => {
        handleDownload(cert);
      }, idx * 450);
    });
  };

  const displayedCertificates =
    certificates && certificates.length > 0
      ? selectedFilter === 'all'
        ? certificates
        : [certificates[selectedFilter] || certificates[0]]
      : [];

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
              ? 'আপনার ফোন নম্বর, ইমেইল অথবা রেজিস্ট্রেশন আইডি লিখে সরাসরি সকল সনদপত্র দেখুন এবং মূল পিডিএফ ডাউনলোড করুন।'
              : 'Enter your Phone Number, Email, or Registration ID to view and download all your official certificates.'}
          </p>

          {/* Search Form */}
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
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-8">
        {/* Loading Indicator */}
        {isLoading && (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 border-3 border-[#C8963E] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {lang === 'bn' ? 'সনদপত্রের তথ্য লোড হচ্ছে...' : 'Loading certificate details...'}
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

        {/* Certificates Found & Display */}
        {!isLoading && certificates && certificates.length > 0 && (
          <div className="space-y-8">
            {/* Summary & Multi-Certificate Selector Bar */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 to-white dark:from-slate-900 dark:to-slate-900/90 border-2 border-amber-300 dark:border-amber-400/40 shadow-md print:hidden space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/70 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 dark:text-[#FFC000] flex items-center justify-center shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-serif font-black text-slate-900 dark:text-white">
                      {lang === 'bn'
                        ? `${certificates[0]?.student_name} — মোট ${certificates.length}টি সনদপত্র পাওয়া গেছে`
                        : `${certificates.length} ${
                            certificates.length === 1 ? 'Certificate' : 'Certificates'
                          } Found for ${certificates[0]?.student_name}`}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {lang === 'bn'
                        ? 'নিচে আপনার অর্জিত সকল সনদপত্র প্রদর্শিত হচ্ছে। প্রতিটি সনদপত্র আলাদাভাবে বা একসাথে ডাউনলোড করতে পারবেন।'
                        : 'All your verified certificates are displayed below with direct PDF download.'}
                    </p>
                  </div>
                </div>

                {certificates.length > 1 && (
                  <button
                    type="button"
                    onClick={handleDownloadAll}
                    className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-[#FFC000] hover:bg-[#E6AC00] text-slate-950 font-serif font-black text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer border border-amber-400 shrink-0"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>
                      {lang === 'bn'
                        ? `সবগুলো ডাউনলোড করুন (${certificates.length}টি)`
                        : `Download All (${certificates.length})`}
                    </span>
                  </button>
                )}
              </div>

              {/* Certificate Cards List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {certificates.map((cert, idx) => {
                  const isFocused = selectedFilter === idx;
                  const cleanTitle = (cert.class_name || '').trim();
                  const downloadUrl = getExactDownloadUrl(cert);

                  return (
                    <div
                      key={`${cert.serial_number}-${cert.registration_id}-${idx}`}
                      onClick={() => setSelectedFilter(isFocused ? 'all' : idx)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                        isFocused
                          ? 'bg-[#0A192F] text-white border-amber-400 shadow-md ring-2 ring-amber-400/50'
                          : 'bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:shadow-sm'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded ${
                                isFocused
                                  ? 'bg-amber-400/20 text-[#FFC000] border border-amber-400/30'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              Serial #{cert.serial_number}
                            </span>
                            {cert.registration_id && (
                              <span
                                className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded ${
                                  isFocused
                                    ? 'bg-slate-800 text-slate-200 border border-slate-700'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                }`}
                              >
                                Reg #{cert.registration_id}
                              </span>
                            )}
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                isFocused
                                  ? 'bg-amber-400 text-slate-950 font-black'
                                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-[#FFC000] border border-amber-200 dark:border-amber-800'
                              }`}
                            >
                              {lang === 'bn' ? `গ্রেড: ${cert.grade}` : `Grade: ${cert.grade}`}
                            </span>
                          </div>

                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                            #{idx + 1}
                          </span>
                        </div>

                        <h4
                          className={`text-xs sm:text-sm font-serif font-black pt-0.5 ${
                            isFocused ? 'text-white' : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {cleanTitle}
                        </h4>

                        <p
                          className={`text-[11px] ${
                            isFocused ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {cert.session_title ? `Session: ${cert.session_title}` : ''}
                          {cert.issued_at ? ` • Issued: ${cert.issued_at}` : ''}
                        </p>
                      </div>

                      <div
                        className={`text-[11px] flex items-center justify-between gap-2 pt-2.5 border-t ${
                          isFocused
                            ? 'border-slate-700 text-slate-300'
                            : 'border-slate-100 dark:border-slate-700/60 text-slate-500 dark:text-slate-400'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="truncate">
                          {cert.start_date && cert.end_date
                            ? `${cert.start_date} – ${cert.end_date}`
                            : cert.student_name}
                        </span>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleDownload(cert)}
                            className="px-3 py-1 rounded-lg text-[11px] font-bold bg-[#FFC000] hover:bg-[#E6AC00] text-slate-950 flex items-center gap-1 shadow-sm cursor-pointer"
                          >
                            <Download className="w-3 h-3 stroke-[2.5]" />
                            <span>{lang === 'bn' ? 'ডাউনলোড' : 'Download'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {certificates.length > 1 && selectedFilter !== 'all' && (
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedFilter('all')}
                    className="text-xs font-bold text-amber-800 dark:text-[#FFC000] hover:underline cursor-pointer"
                  >
                    {lang === 'bn'
                      ? `← সবগুলো সনদপত্র একসাথে দেখুন (${certificates.length}টি)`
                      : `← Show All ${certificates.length} Certificates Together`}
                  </button>
                </div>
              )}
            </div>

            {/* Render Every Certificate Document Returned by the API */}
            <div className="space-y-10">
              {displayedCertificates.map((cert, idx) => (
                <CertificateDocumentCard
                  key={`viewer-${cert.serial_number}-${cert.registration_id}-${idx}`}
                  cert={cert}
                  index={selectedFilter === 'all' ? idx : (selectedFilter as number)}
                  totalCount={certificates.length}
                  lang={lang}
                  onDownload={handleDownload}
                  downloadingSerial={downloadingSerial}
                />
              ))}
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
