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
} from 'lucide-react';

export interface CertificateItem {
  id: number;
  serial_number: number | string;
  grade: string;
  registration_id: string;
  student_name: string;
  class_name: string;
  session_title: string | null;
  issued_at: string;
  view_url: string;
  download_url: string;
}

function CertificateVerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { lang, systemInfo } = useCfo();

  const initialRegId = searchParams.get('registration_id') || '';
  const [regIdInput, setRegIdInput] = useState<string>(initialRegId);
  const [certificates, setCertificates] = useState<CertificateItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const fetchCertificate = useCallback(async (searchId: string) => {
    const trimmedId = searchId.trim();
    if (!trimmedId) return;

    setLoading(true);
    setHasSearched(true);
    setErrorMessage(null);

    try {
      let results: CertificateItem[] = [];

      // 1. Try live external backend API directly first (for client-side browser requests to user's local Laravel)
      try {
        const directRes = await fetch(
          `http://127.0.0.1:8000/api/enrollment/certificates/lookup?registration_id=${encodeURIComponent(trimmedId)}`,
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
        // Direct local fetch failed (e.g. CORS or container environment); proceed to Next.js API proxy
      }

      // 2. If direct fetch yielded nothing, use our internal Next.js proxy route
      if (results.length === 0) {
        const proxyRes = await fetch(
          `/api/enrollment/certificates/lookup?registration_id=${encodeURIComponent(trimmedId)}`
        );
        if (proxyRes.ok) {
          const json = await proxyRes.json();
          if (json.success && Array.isArray(json.data)) {
            results = json.data;
          }
        }
      }

      if (results.length > 0) {
        setCertificates(results);
        setErrorMessage(null);
      } else {
        setCertificates([]);
        setErrorMessage(
          lang === 'bn'
            ? `রেজিস্ট্রেশন আইডি "${trimmedId}" এর বিপরীতে কোনো সনদ পাওয়া যায়নি।`
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
  }, [lang]);

  // If page loads with ?registration_id=..., automatically perform search
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

    // Update URL query string without reloading page
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

  const sampleIds = ['5', '8', 'COL-CFO-2025-9921'];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />

      {/* Verification Hero */}
      <section className="relative bg-[#0A192F] text-white pt-14 pb-18 px-4 overflow-hidden border-b border-[#1E3A8A]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(200,150,62,0.18),rgba(10,25,47,0))]" />

        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E3A8A]/50 border border-[#C8963E]/40 text-xs font-bold text-[#E5A93C]">
            <ShieldCheck className="w-4 h-4 text-[#C8963E]" />
            <span>
              {lang === 'bn' ? 'অফিসিয়াল সার্টিফিকেট ও ট্রান্সক্রিপ্ট ভেরিফিকেশন' : 'Official Certificate Verification Portal'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-white tracking-tight">
            {lang === 'bn' ? (
              <>
                চার্টার্ড অফিসার <span className="text-[#E5A93C]">সনদপত্র যাচাইকরণ</span>
              </>
            ) : (
              <>
                Verify Official <span className="text-[#E5A93C]">COL Certificates</span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {lang === 'bn'
              ? 'নিয়োগকারী কর্তৃপক্ষ ও শিক্ষার্থীরা চার্টার্ড অফিসার লিমিটেড (cfoedubd.com) কর্তৃক ইস্যুকৃত সনদপত্রের সত্যতা রেজিস্ট্রেশন আইডি দিয়ে তাৎক্ষণিক যাচাই করতে পারেন।'
              : 'Corporate employers and students can instantly verify the authenticity of official credentials issued by Chartered Officer Limited using their Registration ID.'}
          </p>

          {/* Verification Search Form */}
          <div className="max-w-xl mx-auto pt-4">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 bg-slate-900 p-2 rounded-2xl border border-[#C8963E]/50 shadow-2xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={regIdInput}
                  onChange={(e) => setRegIdInput(e.target.value)}
                  placeholder={lang === 'bn' ? 'রেজিস্ট্রেশন আইডি দিন (যেমন: 5, 8)' : 'Enter Registration ID (e.g. 5, 8)'}
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-white font-mono text-sm placeholder:text-slate-500 placeholder:font-sans focus:outline-none"
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
                    <span>{lang === 'bn' ? 'যাচাই করুন' : 'Verify Now'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Sample IDs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-400">
              <span className="font-semibold">{lang === 'bn' ? 'নমুনা আইডি দিয়ে দেখুন:' : 'Try Sample IDs:'}</span>
              {sampleIds.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setRegIdInput(id);
                    router.push(`/certificates?registration_id=${encodeURIComponent(id)}`);
                    fetchCertificate(id);
                  }}
                  className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-slate-800 hover:bg-[#C8963E] hover:text-slate-950 text-slate-300 transition-colors cursor-pointer border border-slate-700"
                >
                  ID: {id}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Results Container */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {loading && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 border-3 border-[#C8963E] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-800">
              {lang === 'bn' ? 'অফিসিয়াল ডাটাবেজে সনদপত্র যাচাই করা হচ্ছে...' : 'Verifying credential with central academic database...'}
            </p>
            <p className="text-xs text-slate-500 font-mono">
              Registration ID: #{regIdInput}
            </p>
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
                {lang === 'bn' ? 'সহায়তার জন্য অ্যাডমিশন অফিসে যোগাযোগ করুন:' : 'For credential assistance, contact COL office:'}
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
                  <h4 className="text-sm font-serif font-bold text-emerald-950">
                    {lang === 'bn' ? 'সনদপত্রটি ১০০% ভেরিফাইড ও বৈধ' : 'Official Verified & Authenticated Credential'}
                  </h4>
                  <p className="text-xs text-emerald-800">
                    {lang === 'bn'
                      ? 'বাংলাদেশ কারিগরি শিক্ষা বোর্ড (BTEB) ও চার্টার্ড অফিসার কেন্দ্রীয় ডাটাবেজে নথিবদ্ধ'
                      : 'Permanently registered in Chartered Officer Limited Central Academic Ledger'}
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
                      ? (lang === 'bn' ? 'লিংক কপি হয়েছে!' : 'Copied!')
                      : (lang === 'bn' ? 'লিংক শেয়ার' : 'Share Link')}
                  </span>
                </button>
              </div>
            </div>

            {/* List of Verified Certificates */}
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="relative bg-white rounded-3xl p-6 sm:p-10 border-4 border-[#C8963E]/40 shadow-xl overflow-hidden space-y-6"
              >
                {/* Certificate Inner Frame */}
                <div className="border border-slate-200 rounded-2xl p-6 sm:p-8 text-center space-y-6 relative bg-gradient-to-b from-amber-50/20 to-white">
                  {/* Brand Header */}
                  <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-slate-200 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#0A192F] text-[#E5A93C] font-serif font-black flex items-center justify-center text-xl border border-[#C8963E]/40 shadow-sm">
                        COL
                      </div>
                      <div className="text-left">
                        <span className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight block">
                          Chartered Officer Limited
                        </span>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          Affiliated with Bangladesh Technical Education Board (BTEB) &amp; RJSC
                        </p>
                      </div>
                    </div>

                    <div className="text-center sm:text-right space-y-1">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Registration ID</span>
                        <span className="font-mono text-sm font-black text-[#0A192F] bg-amber-100/70 border border-amber-300 px-3 py-0.5 rounded-md inline-block">
                          #{cert.registration_id}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono">Serial: #{cert.serial_number}</span>
                      </div>
                    </div>
                  </div>

                  {/* Certificate Core Statement */}
                  <div className="py-4 space-y-3">
                    <p className="text-xs font-serif font-bold uppercase tracking-widest text-[#C8963E]">
                      OFFICIAL PROFESSIONAL CREDENTIAL TRANSCRIPT
                    </p>

                    <p className="text-xs sm:text-sm text-slate-500">
                      This is officially conferred to certify that
                    </p>

                    <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#0A192F]">
                      {cert.student_name}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed pt-1">
                      has successfully completed the curriculum, practical coursework, and executive requirements for
                    </p>

                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#966718]">
                      {cert.class_name}
                    </h3>

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-bold text-slate-800 pt-2">
                      <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                        Grade: {cert.grade}
                      </span>
                      {cert.session_title && (
                        <span className="px-3 py-1 rounded-full bg-amber-50 text-[#966718] border border-amber-200">
                          {cert.session_title}
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Issued: {cert.issued_at}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons: View & Download URLs from the API */}
                  <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-center gap-3">
                    {cert.view_url && (
                      <a
                        href={cert.view_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-[#0A192F] hover:bg-[#1E3A8A] text-[#E5A93C] font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>{lang === 'bn' ? 'সনদপত্রটি দেখুন (View)' : 'View Certificate'}</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>
                    )}

                    {cert.download_url && (
                      <a
                        href={cert.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 font-serif font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>{lang === 'bn' ? 'ডাউনলোড করুন (PDF)' : 'Download Certificate'}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
                  ? 'আপনার সনদপত্র বা সাময়িক সনদে উল্লিখিত আইডি নম্বরটি প্রদান করে সার্চ করুন।'
                  : 'Enter the registration ID printed on your diploma or transcript.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-serif font-bold text-slate-900">
                {lang === 'bn' ? 'লাইভ ডাটাবেজ ভেরিফিকেশন' : 'Live Ledger Verification'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === 'bn'
                  ? 'সিস্টেম সরাসরি সেন্ট্রাল ডাটাবেজ থেকে শিক্ষার্থীর ফলাফল ও সনদের বৈধতা যাচাই করে।'
                  : 'The system validates student records directly against the central institute ledger.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center mx-auto border border-slate-200">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-serif font-bold text-slate-900">
                {lang === 'bn' ? 'ভিউ এবং ডাউনলোড' : 'View & Download'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === 'bn'
                  ? 'ভেরিফিকেশন সম্পন্ন হলে সরাসরি অফিসিয়াল ডিজিটাল সনদপত্র দেখতে ও ডাউনলোড করতে পারবেন।'
                  : 'Instantly view and download the official authenticated digital credential.'}
              </p>
            </div>
          </div>
        )}
      </main>

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
            <p className="text-sm font-bold">Loading Verification Portal...</p>
          </div>
        </div>
      }
    >
      <CertificateVerificationContent />
    </Suspense>
  );
}
