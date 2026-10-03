'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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
  RefreshCw,
  Printer,
  Sparkles,
  X,
  FileText,
  Maximize2,
  FileDown,
} from 'lucide-react';

export interface CertificateItem {
  id?: number | string;
  serial_number: number | string;
  grade: string;
  registration_id: string;
  student_name: string;
  father_name?: string;
  mother_name?: string;
  class_name: string;
  session_title: string | null;
  start_date?: string;
  end_date?: string;
  issued_at: string;
  view_url?: string;
  download_url: string;
}

function CertificateVerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { lang, systemInfo, theme } = useCfo();

  const initialRegId = searchParams.get('registration_id') || '';
  const [regIdInput, setRegIdInput] = useState<string>(initialRegId);
  const [certificates, setCertificates] = useState<CertificateItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [previewModalCert, setPreviewModalCert] = useState<CertificateItem | null>(null);

  const fetchCertificate = useCallback(
    async (searchId: string) => {
      const trimmedId = searchId.trim();
      if (!trimmedId) return;

      setLoading(true);
      setHasSearched(true);
      setErrorMessage(null);

      try {
        let results: CertificateItem[] = [];

        // 1. Try querying the internal Next.js proxy route first
        try {
          const proxyRes = await fetch(
            `/api/enrollment/certificates/lookup?registration_id=${encodeURIComponent(trimmedId)}`
          );
          if (proxyRes.ok) {
            const json = await proxyRes.json();
            if (json.success && Array.isArray(json.data) && json.data.length > 0) {
              results = json.data;
            }
          }
        } catch {
          // Internal proxy call failed
        }

        // 2. Direct browser fetch to local Laravel backend if running locally
        if (results.length === 0) {
          try {
            const directRes = await fetch(
              `http://127.0.0.1:8000/api/enrollment/certificates/lookup?registration_id=${encodeURIComponent(
                trimmedId
              )}`,
              {
                headers: { Accept: 'application/json' },
                signal: AbortSignal.timeout(2000),
              }
            );
            if (directRes.ok) {
              const json = await directRes.json();
              if (json.success && Array.isArray(json.data)) {
                results = json.data;
              }
            }
          } catch {
            // Direct local fetch failed
          }
        }

        if (results.length > 0) {
          setCertificates(results);
          setErrorMessage(null);
        } else {
          setCertificates([]);
          setErrorMessage(
            lang === 'bn'
              ? `রেজিস্ট্রেশন আইডি "${trimmedId}" এর বিপরীতে কোনো সনদপত্র পাওয়া যায়নি।`
              : `No certificate records found for Registration ID "${trimmedId}".`
          );
        }
      } catch (err: any) {
        setCertificates([]);
        setErrorMessage(
          lang === 'bn'
            ? 'সার্টিফিকেট যাচাই করার সময় সংযোগে ত্রুটি হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।'
            : 'Failed to verify certificate. Please try again or contact support.'
        );
      } finally {
        setLoading(false);
      }
    },
    [lang]
  );

  useEffect(() => {
    if (!initialRegId) return;
    const timer = setTimeout(() => {
      fetchCertificate(initialRegId);
    }, 0);
    return () => clearTimeout(timer);
  }, [initialRegId, fetchCertificate]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!regIdInput.trim()) return;

    router.push(`/certificates?registration_id=${encodeURIComponent(regIdInput.trim())}`);
    fetchCertificate(regIdInput.trim());
  };

  const handleCopyLink = (certRegId: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/certificates?registration_id=${encodeURIComponent(certRegId)}`;
      navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  const getPdfViewUrl = (cert: CertificateItem) => {
    // Proxies from server with Content-Disposition: inline to embed directly in browser
    return `/api/enrollment/certificates/${encodeURIComponent(cert.registration_id)}/view`;
  };

  return (
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col font-sans transition-colors ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}
    >
      <Navbar />

      {/* Verification Hero */}
      <section className="relative bg-gradient-to-b from-amber-50/90 via-slate-50 to-white dark:from-[#0A192F] dark:via-[#0D254C] dark:to-[#0A192F] dark:bg-[#0A192F] text-slate-900 dark:text-white pt-12 pb-16 px-4 overflow-hidden border-b border-slate-200 dark:border-[#1E3A8A] transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(200,150,62,0.22),rgba(10,25,47,0))]" />

        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-[#1E3A8A]/60 border border-amber-300 dark:border-[#C8963E]/50 text-xs font-bold text-amber-900 dark:text-[#E5A93C] shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#C8963E]" />
            <span>
              {lang === 'bn'
                ? 'অফিসিয়াল সার্টিফিকেট যাচাই ও ডাউনলোড পোর্টাল'
                : 'Official Certificate Verification & Download Portal'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 dark:text-white tracking-tight">
            {lang === 'bn' ? (
              <>
                চার্টার্ড অফিসার <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#966718] dark:from-[#FFDF79] dark:via-[#E5A93C] dark:to-[#C8963E]">সনদপত্র যাচাই ও ডাউনলোড</span>
              </>
            ) : (
              <>
                Verify &amp; View <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#966718] dark:from-[#FFDF79] dark:via-[#E5A93C] dark:to-[#C8963E]">Official Certificate PDF</span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {lang === 'bn'
              ? 'নিয়োগকারী কর্তৃপক্ষ ও শিক্ষার্থীরা চার্টার্ড অফিসার লিমিটেড কর্তৃক ইস্যুকৃত মূল পিডিএফ সনদপত্র দেখতে ও ডাউনলোড করতে রেজিস্ট্রেশন আইডি দিন।'
              : 'Enter your Registration ID to view the actual authenticated certificate PDF directly on this page and download the original file.'}
          </p>

          {/* Verification Search Form */}
          <div className="max-w-xl mx-auto pt-3">
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row gap-2 bg-white dark:bg-slate-900/90 p-2 rounded-2xl border border-slate-300 dark:border-[#C8963E]/60 shadow-md backdrop-blur-xs"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#C8963E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={regIdInput}
                  onChange={(e) => setRegIdInput(e.target.value)}
                  placeholder={
                    lang === 'bn'
                      ? 'রেজিস্ট্রেশন আইডি দিন (যেমন: 222, 5, 8)'
                      : 'Enter Registration ID (e.g. 222, 5, 8)'
                  }
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-slate-900 dark:text-white font-mono text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-sans focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !regIdInput.trim()}
                className="px-6 py-3 bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 font-serif font-black text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{lang === 'bn' ? 'যাচাই হচ্ছে...' : 'Verifying...'}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'সনদ দেখুন ও ডাউনলোড' : 'View & Download PDF'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Main Results Container */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {loading && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 border-3 border-[#C8963E] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-800">
              {lang === 'bn'
                ? 'অফিসিয়াল ডাটাবেজে সনদপত্র ও পিডিএফ লোড হচ্ছে...'
                : 'Retrieving official certificate PDF from database...'}
            </p>
            <p className="text-xs text-slate-500 font-mono">Registration ID: #{regIdInput}</p>
          </div>
        )}

        {!loading && errorMessage && (
          <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-4 shadow-xs">
            <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-bold text-rose-950">
                {lang === 'bn' ? 'কোনো সনদ রেকর্ড পাওয়া যায়নি' : 'No Credential Record Found'}
              </h3>
              <p className="text-xs sm:text-sm text-rose-700 max-w-md mx-auto leading-relaxed">
                {errorMessage}
              </p>
            </div>

            <div className="pt-2 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-center gap-3">
              <span className="text-slate-500">
                {lang === 'bn'
                  ? 'সহায়তার জন্য অ্যাডমিশন অফিসে যোগাযোগ করুন:'
                  : 'For credential assistance, contact COL office:'}
              </span>
              <a
                href={`tel:${(systemInfo.mobile || systemInfo.phone || '+8801713378787').replace(/\s+/g, '')}`}
                className="font-mono font-bold text-[#0A192F] hover:text-[#C8963E] inline-flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5 text-[#C8963E]" />
                <span>{systemInfo.phone || '+880 1713378787'}</span>
              </a>
            </div>
          </div>
        )}

        {!loading && certificates && certificates.length > 0 && (
          <div className="space-y-8">
            {/* Status Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-serif font-bold text-emerald-950 flex items-center gap-2">
                    <span>
                      {lang === 'bn'
                        ? 'অরিজিনাল সনদপত্র পিডিএফ ভিউয়ার ও ডাউনলোড'
                        : 'Official Certificate PDF Document Loaded'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900 border border-emerald-300">
                      Live PDF
                    </span>
                  </h4>
                  <p className="text-xs text-emerald-800">
                    {lang === 'bn'
                      ? 'সার্ভার হতে প্রাপ্ত অরিজিনাল সনদপত্রটি নিচে প্রদর্শিত হচ্ছে এবং সরাসরি ডাউনলোড করা যাবে।'
                      : 'Displaying the exact authenticated PDF certificate served directly by your backend.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyLink(certificates[0].registration_id)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
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

            {/* Render Each Certificate: Direct PDF Viewer + API Details */}
            {certificates.map((cert) => {
              const pdfUrl = getPdfViewUrl(cert);
              const directDownload = cert.download_url || `/api/enrollment/certificates/${cert.registration_id}/download`;

              return (
                <div
                  key={cert.registration_id}
                  className="bg-white rounded-3xl border-2 border-[#C8963E]/40 shadow-xl overflow-hidden space-y-6"
                >
                  {/* Top Details & Action Bar */}
                  <div className="bg-[#0A192F] text-white p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#1E3A8A]">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-[#C8963E] text-slate-950">
                          ID: #{cert.registration_id}
                        </span>
                        <span className="text-xs text-slate-300 font-mono">
                          Serial: #{cert.serial_number}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Grade: {cert.grade}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-serif font-black text-white">
                        {cert.student_name}
                      </h2>

                      <p className="text-xs text-[#E5A93C] font-semibold">
                        {cert.class_name} {cert.session_title ? `(${cert.session_title})` : ''}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                      {/* 1. Main Download Button linking directly to download_url */}
                      <a
                        href={directDownload}
                        download={`Certificate_${cert.student_name.replace(/[^a-zA-Z0-9]/g, '_')}_${cert.registration_id}.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-slate-950" />
                        <span>{lang === 'bn' ? 'পিডিএফ ডাউনলোড' : 'Download PDF'}</span>
                      </a>

                      {/* 2. Fullscreen Viewer Modal Trigger */}
                      <button
                        type="button"
                        onClick={() => setPreviewModalCert(cert)}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#E5A93C] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{lang === 'bn' ? 'ফুলস্ক্রিন' : 'Fullscreen'}</span>
                      </button>

                      {/* 3. Open Raw in New Tab */}
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                        title="Open PDF in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        <span className="hidden sm:inline">{lang === 'bn' ? 'নতুন ট্যাব' : 'New Tab'}</span>
                      </a>
                    </div>
                  </div>

                  {/* Summary Attributes Strip */}
                  <div className="px-6 py-3 bg-amber-50/50 border-b border-amber-100 flex flex-wrap items-center justify-between text-xs text-slate-700 gap-3">
                    <div className="flex flex-wrap items-center gap-4">
                      {cert.father_name && (
                        <span>
                          <strong className="text-slate-900">Father:</strong> {cert.father_name}
                        </span>
                      )}
                      {cert.mother_name && (
                        <span>
                          <strong className="text-slate-900">Mother:</strong> {cert.mother_name}
                        </span>
                      )}
                      {cert.start_date && cert.end_date && (
                        <span>
                          <strong className="text-slate-900">Period:</strong> {cert.start_date} – {cert.end_date}
                        </span>
                      )}
                      {cert.issued_at && (
                        <span>
                          <strong className="text-slate-900">Issued:</strong> {cert.issued_at}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] font-mono text-slate-500">
                      Source: <span className="text-slate-700 font-semibold">{cert.download_url}</span>
                    </div>
                  </div>

                  {/* ACTUAL PDF VIEWER CONTAINER (Embedded real PDF) */}
                  <div className="p-4 sm:p-6">
                    <div className="w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-300 shadow-inner flex flex-col">
                      {/* Viewer Toolbar */}
                      <div className="bg-slate-950 text-slate-300 px-4 py-2 text-xs flex items-center justify-between border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#C8963E]" />
                          <span className="font-semibold text-white">
                            {cert.student_name} — {cert.class_name}.pdf
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px]">
                          <span className="text-slate-400">Authentic PDF Document</span>
                          <a
                            href={directDownload}
                            download
                            className="text-[#E5A93C] hover:underline font-bold inline-flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            Direct Download
                          </a>
                        </div>
                      </div>

                      {/* Embedded PDF Frame */}
                      <div className="relative w-full h-[650px] sm:h-[750px] md:h-[850px] bg-slate-100">
                        <object
                          data={`${pdfUrl}#toolbar=1&navpanes=0`}
                          type="application/pdf"
                          className="w-full h-full"
                        >
                          <iframe
                            src={`${pdfUrl}#toolbar=1&navpanes=0`}
                            title={`Certificate PDF - ${cert.student_name}`}
                            className="w-full h-full border-0"
                          >
                            {/* Fallback if browser blocks iframe PDF embedding */}
                            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-900 text-white space-y-4">
                              <FileCheck className="w-16 h-16 text-[#C8963E]" />
                              <div>
                                <h3 className="text-lg font-bold text-white">Official Certificate PDF</h3>
                                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                                  Your browser does not support inline PDF previews. You can view or download the file directly below.
                                </p>
                              </div>
                              <div className="flex gap-3">
                                <a
                                  href={directDownload}
                                  download
                                  className="px-6 py-2.5 rounded-xl bg-[#C8963E] text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md"
                                >
                                  <Download className="w-4 h-4" />
                                  Download Certificate
                                </a>
                                <a
                                  href={pdfUrl}
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
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Informational Guidelines when no search performed yet */}
        {!hasSearched && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#C8963E] flex items-center justify-center mx-auto border border-amber-200">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-serif font-bold text-slate-900">
                {lang === 'bn' ? 'রেজিস্ট্রেশন আইডি দিন' : 'Enter Registration ID'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === 'bn'
                  ? 'আপনার সনদপত্র বা সাময়িক সনদে উল্লিখিত আইডি নম্বরটি প্রদান করে সার্চ করুন (যেমন: 222)।'
                  : 'Enter the registration ID (e.g., 222) printed on your diploma or enrollment record.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-serif font-bold text-slate-900">
                {lang === 'bn' ? 'আসল পিডিএফ প্রিভিউ' : 'Real PDF Document Viewer'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === 'bn'
                  ? 'সিস্টেম সরাসরি সার্ভার হতে প্রাপ্ত অরিজিনাল পিডিএফ ফাইলটি স্ক্রিনে প্রদর্শন করবে।'
                  : 'The page embeds and displays the exact authentic PDF file directly on screen.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-[#C8963E] flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800">
                <Download className="w-6 h-6 text-[#C8963E]" />
              </div>
              <h3 className="text-sm font-serif font-bold text-slate-900 dark:text-white">
                {lang === 'bn' ? 'সরাসরি ডাউনলোড' : 'Direct 1-Click Download'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {lang === 'bn'
                  ? 'API হতে প্রাপ্ত ডাউনলোড ইউআরএল (download_url) দিয়ে সরাসরি সনদপত্র ডাউনলোড করতে পারবেন।'
                  : 'Instantly download the certificate file directly via the API download_url.'}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Certificate Fullscreen Modal (Embeds real PDF) */}
      {previewModalCert && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 overflow-hidden">
          <div className="relative w-full max-w-6xl h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#0A192F] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#1E3A8A] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#C8963E] text-slate-950 font-bold flex items-center justify-center text-xs">
                  PDF
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-white">
                    {previewModalCert.student_name} — Certificate PDF
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    ID: #{previewModalCert.registration_id} • Serial: #{previewModalCert.serial_number}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewModalCert.download_url || `/api/enrollment/certificates/${previewModalCert.registration_id}/download`}
                  download={`Certificate_${previewModalCert.student_name.replace(/[^a-zA-Z0-9]/g, '_')}_${previewModalCert.registration_id}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'ডাউনলোড' : 'Download PDF'}</span>
                </a>

                <a
                  href={getPdfViewUrl(previewModalCert)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700"
                  title="Open in new window"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{lang === 'bn' ? 'নতুন উইন্ডো' : 'New Window'}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewModalCert(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
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
