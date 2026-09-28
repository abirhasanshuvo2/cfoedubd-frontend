'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCfo } from '@/context/CfoContext';
import { createCertificatePdfDocument } from '@/lib/certificate-pdf';
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
  const { lang, systemInfo } = useCfo();

  const initialRegId = searchParams.get('registration_id') || '';
  const [regIdInput, setRegIdInput] = useState<string>(initialRegId);
  const [certificates, setCertificates] = useState<CertificateItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
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

        // 1. Try querying the internal Next.js proxy route first (which connects to live backend or returns mock)
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
          // Internal proxy call failed; proceed to direct backend attempt
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

  // Instant high-quality PDF download handler
  const handleDownload = async (cert: CertificateItem) => {
    const regId = String(cert.registration_id);
    setDownloadingId(regId);

    try {
      // 1. Try downloading from the API proxy route (which streams live backend PDF if available)
      const proxyUrl = `/api/enrollment/certificates/${encodeURIComponent(regId)}/download`;
      const res = await fetch(proxyUrl);

      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        const cleanName = cert.student_name ? cert.student_name.replace(/[^a-zA-Z0-9]/g, '_') : 'Student';
        link.download = `Certificate_${cleanName}_${regId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        return;
      }
    } catch {
      // Proxy download failed; fallback to client-side vector jsPDF generation
    }

    // 2. Client-side vector jsPDF fallback
    try {
      const doc = createCertificatePdfDocument(cert);
      const cleanName = cert.student_name ? cert.student_name.replace(/[^a-zA-Z0-9]/g, '_') : 'Student';
      doc.save(`Certificate_${cleanName}_${regId}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePrint = (cert: CertificateItem) => {
    setPreviewModalCert(cert);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const sampleIds = ['222', '5', '8', 'COL-CFO-2025-9921'];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />

      {/* Verification Hero */}
      <section className="relative bg-[#0A192F] text-white pt-12 pb-16 px-4 overflow-hidden border-b border-[#1E3A8A]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(200,150,62,0.22),rgba(10,25,47,0))]" />

        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E3A8A]/60 border border-[#C8963E]/50 text-xs font-bold text-[#E5A93C] shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#C8963E]" />
            <span>
              {lang === 'bn'
                ? 'অফিসিয়াল সার্টিফিকেট যাচাই ও ডাউনলোড পোর্টাল'
                : 'Official Certificate Verification & Download Portal'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-white tracking-tight">
            {lang === 'bn' ? (
              <>
                চার্টার্ড অফিসার <span className="text-[#E5A93C]">সনদপত্র যাচাই ও ডাউনলোড</span>
              </>
            ) : (
              <>
                Verify &amp; Download <span className="text-[#E5A93C]">Official Certificates</span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {lang === 'bn'
              ? 'নিয়োগকারী কর্তৃপক্ষ ও শিক্ষার্থীরা চার্টার্ড অফিসার লিমিটেড (cfoedubd.com) কর্তৃক ইস্যুকৃত সনদপত্রের সত্যতা যাচাই করতে ও অরিজিনাল পিডিএফ ডাউনলোড করতে রেজিস্ট্রেশন আইডি দিন।'
              : 'Enter your Registration ID to instantly verify credentials and download high-resolution authenticated certificates issued by Chartered Officer Limited.'}
          </p>

          {/* Verification Search Form */}
          <div className="max-w-xl mx-auto pt-3">
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row gap-2 bg-slate-900/90 p-2 rounded-2xl border border-[#C8963E]/60 shadow-2xl backdrop-blur-xs"
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
                    <span>{lang === 'bn' ? 'যাচাই ও ডাউনলোড' : 'Verify & Download'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Sample IDs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">
                {lang === 'bn' ? 'টেস্ট আইডি দিয়ে দেখুন:' : 'Test with sample IDs:'}
              </span>
              {sampleIds.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setRegIdInput(id);
                    router.push(`/certificates?registration_id=${encodeURIComponent(id)}`);
                    fetchCertificate(id);
                  }}
                  className={`font-mono text-[11px] px-2.5 py-1 rounded-md transition-colors cursor-pointer border ${
                    id === '222'
                      ? 'bg-[#C8963E]/20 text-[#E5A93C] border-[#C8963E]/50 font-bold hover:bg-[#C8963E] hover:text-slate-950'
                      : 'bg-slate-800 hover:bg-[#C8963E] hover:text-slate-950 text-slate-300 border-slate-700'
                  }`}
                >
                  ID: #{id} {id === '222' ? '⭐ (Md Ali Hosen)' : ''}
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
              {lang === 'bn'
                ? 'অফিসিয়াল ডাটাবেজে সনদপত্র যাচাই করা হচ্ছে...'
                : 'Verifying credential with central academic database...'}
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
                        ? 'সনদপত্রটি ১০০% ভেরিফাইড ও ডাউনলোডযোগ্য'
                        : 'Official Verified & Download-Ready Credential'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900 border border-emerald-300">
                      Active Record
                    </span>
                  </h4>
                  <p className="text-xs text-emerald-800">
                    {lang === 'bn'
                      ? 'বাংলাদেশ কারিগরি শিক্ষা বোর্ড (BTEB) ও চার্টার্ড অফিসার কেন্দ্রীয় ডাটাবেজে স্থায়ীভাবে নথিবদ্ধ'
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

            {/* List of Verified Certificates */}
            {certificates.map((cert) => (
              <div
                key={cert.registration_id}
                className="relative bg-white rounded-3xl p-6 sm:p-10 border-4 border-[#C8963E]/40 shadow-xl overflow-hidden space-y-6"
              >
                {/* Certificate Inner Frame */}
                <div className="border-2 border-dashed border-[#C8963E]/30 rounded-2xl p-6 sm:p-8 text-center space-y-6 relative bg-gradient-to-b from-amber-50/30 via-white to-amber-50/20">
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
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                          Registration ID
                        </span>
                        <span className="font-mono text-sm font-black text-[#0A192F] bg-amber-100/70 border border-amber-300 px-3 py-0.5 rounded-md inline-block">
                          #{cert.registration_id}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Serial: #{cert.serial_number}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Certificate Core Statement */}
                  <div className="py-2 space-y-3">
                    <p className="text-xs font-serif font-bold uppercase tracking-widest text-[#C8963E] flex items-center justify-center gap-2">
                      <Award className="w-4 h-4 text-[#C8963E]" />
                      <span>OFFICIAL PROFESSIONAL CREDENTIAL &amp; TRANSCRIPT</span>
                    </p>

                    <p className="text-xs sm:text-sm text-slate-500">
                      This is officially conferred to certify that
                    </p>

                    <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#0A192F]">
                      {cert.student_name}
                    </h2>

                    {/* Parents Information */}
                    {(cert.father_name || cert.mother_name) && (
                      <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-full">
                        {cert.father_name && (
                          <span>
                            <strong className="text-slate-700">Father:</strong> {cert.father_name}
                          </span>
                        )}
                        {cert.father_name && cert.mother_name && (
                          <span className="text-slate-300">•</span>
                        )}
                        {cert.mother_name && (
                          <span>
                            <strong className="text-slate-700">Mother:</strong> {cert.mother_name}
                          </span>
                        )}
                      </div>
                    )}

                    <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed pt-1">
                      has successfully completed the curriculum, practical coursework, and executive requirements for
                    </p>

                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#966718]">
                      {cert.class_name}
                    </h3>

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-bold text-slate-800 pt-2">
                      <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                        Grade: <span className="text-[#C8963E] font-black">{cert.grade}</span>
                      </span>
                      {cert.session_title && (
                        <span className="px-3 py-1 rounded-full bg-amber-50 text-[#966718] border border-amber-200">
                          Session: {cert.session_title}
                        </span>
                      )}
                      {cert.start_date && cert.end_date && (
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                          Period: {cert.start_date} – {cert.end_date}
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Issued: {cert.issued_at}
                      </span>
                    </div>
                  </div>

                  {/* Signatures & Seal Box */}
                  <div className="pt-6 pb-2 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center border-t border-slate-200">
                    <div className="text-center sm:text-left space-y-1">
                      <p className="font-serif italic font-bold text-slate-800 text-sm">
                        Dr. M. A. Rahman
                      </p>
                      <div className="w-24 h-0.5 bg-slate-300 mx-auto sm:mx-0" />
                      <p className="text-[11px] font-bold text-slate-600">Academic Director</p>
                      <p className="text-[10px] text-slate-400">Chartered Officer Ltd.</p>
                    </div>

                    <div className="text-center space-y-1">
                      <div className="w-14 h-14 rounded-full border-2 border-[#C8963E] bg-amber-50 text-[#966718] flex flex-col items-center justify-center mx-auto shadow-xs">
                        <Award className="w-5 h-5 text-[#C8963E]" />
                        <span className="text-[7px] font-black tracking-widest uppercase">COL SEAL</span>
                      </div>
                      <p className="text-[10px] font-bold text-emerald-700">Digitally Verified Ledger</p>
                    </div>

                    <div className="text-center sm:text-right space-y-1">
                      <p className="font-serif italic font-bold text-slate-800 text-sm">
                        K. H. Mahmud, FCA
                      </p>
                      <div className="w-24 h-0.5 bg-slate-300 mx-auto sm:ml-auto" />
                      <p className="text-[11px] font-bold text-slate-600">Controller of Examinations</p>
                      <p className="text-[10px] text-slate-400">Board of Assessment</p>
                    </div>
                  </div>

                  {/* Action Buttons: Download PDF, Preview, and Print */}
                  <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-center gap-3">
                    {/* 1. Primary Download Certificate Button */}
                    <button
                      type="button"
                      onClick={() => handleDownload(cert)}
                      disabled={downloadingId === String(cert.registration_id)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 font-serif font-black text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {downloadingId === String(cert.registration_id) ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                          <span>{lang === 'bn' ? 'ডাউনলোড হচ্ছে...' : 'Generating Download...'}</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 text-slate-950" />
                          <span>
                            {lang === 'bn'
                              ? 'সনদপত্র ডাউনলোড করুন (Download PDF)'
                              : 'Download Certificate (PDF)'}
                          </span>
                        </>
                      )}
                    </button>

                    {/* 2. Interactive Preview Modal Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewModalCert(cert)}
                      className="px-5 py-3 rounded-xl bg-[#0A192F] hover:bg-[#1E3A8A] text-[#E5A93C] font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{lang === 'bn' ? 'প্রিভিউ দেখুন (Preview)' : 'Preview Certificate'}</span>
                    </button>

                    {/* 3. Direct Print Button */}
                    <button
                      type="button"
                      onClick={() => handlePrint(cert)}
                      className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer border border-slate-200"
                    >
                      <Printer className="w-4 h-4 text-slate-600" />
                      <span>{lang === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
                    </button>

                    {/* 4. If backend provides external view_url */}
                    {cert.view_url && (
                      <a
                        href={cert.view_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        <span>{lang === 'bn' ? 'সরাসরি লিঙ্ক' : 'Direct API Link'}</span>
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
                  ? 'আপনার সনদপত্র বা সাময়িক সনদে উল্লিখিত আইডি নম্বরটি প্রদান করে সার্চ করুন (যেমন: 222)।'
                  : 'Enter the registration ID (e.g., 222) printed on your diploma or enrollment record.'}
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
                  ? 'সিস্টেম সরাসরি সেন্ট্রাল ডাটাবেজ থেকে শিক্ষার্থীর ফলাফল, গ্রেড ও সনদের বৈধতা যাচাই করে।'
                  : 'The system validates student records directly against the central institute ledger.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#0A192F] text-[#E5A93C] flex items-center justify-center mx-auto border border-[#C8963E]/40">
                <Download className="w-6 h-6 text-[#E5A93C]" />
              </div>
              <h3 className="text-sm font-serif font-bold text-slate-900">
                {lang === 'bn' ? '১-ক্লিক ভেরিফাইড ডাউনলোড' : 'Instant Verified Download'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === 'bn'
                  ? 'ভেরিফিকেশন সম্পন্ন হলে সরাসরি অফিসিয়াল হাই-রেজোলিউশন ডিজিটাল সনদপত্র ডাউনলোড ও প্রিন্ট করতে পারবেন।'
                  : 'Instantly download and print the official authenticated digital credential with verified seals.'}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Certificate Fullscreen Preview & Print Modal */}
      {previewModalCert && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-4 border-[#C8963E] overflow-hidden my-auto flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#0A192F] text-white px-6 py-4 flex items-center justify-between border-b border-[#1E3A8A]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#C8963E] text-slate-950 font-serif font-black flex items-center justify-center text-sm">
                  COL
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-white">
                    {lang === 'bn' ? 'অফিসিয়াল সার্টিফিকেট প্রিভিউ' : 'Official Certificate Document'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    ID: #{previewModalCert.registration_id} • Serial: #{previewModalCert.serial_number}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload(previewModalCert)}
                  disabled={downloadingId === String(previewModalCert.registration_id)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'ডাউনলোড' : 'Download PDF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{lang === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewModalCert(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: High Resolution Parchment Certificate */}
            <div className="p-6 sm:p-10 bg-[#FDFCF8] overflow-y-auto max-h-[75vh]">
              <div className="border-4 border-[#0A192F] p-2 rounded-xl">
                <div className="border-2 border-[#C8963E] p-6 sm:p-10 rounded-lg text-center space-y-6 relative bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,1)_0%,rgba(253,252,248,0.9)_100%)]">
                  {/* Top Seal & Affiliation */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Affiliated with Bangladesh Technical Education Board (BTEB) &amp; RJSC
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#0A192F]">
                      Chartered Officer Limited
                    </h2>
                    <p className="text-xs font-bold text-[#C8963E] tracking-widest uppercase">
                      Certificate of Achievement &amp; Excellence
                    </p>
                  </div>

                  <p className="text-xs italic text-slate-600 font-serif">
                    This official credential is conferred upon
                  </p>

                  <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#0A192F] underline decoration-[#C8963E] underline-offset-8">
                    {previewModalCert.student_name}
                  </h1>

                  {/* Parents Info */}
                  {(previewModalCert.father_name || previewModalCert.mother_name) && (
                    <div className="text-xs text-slate-600 font-medium">
                      {previewModalCert.father_name && <span>Father: {previewModalCert.father_name}</span>}
                      {previewModalCert.father_name && previewModalCert.mother_name && <span> | </span>}
                      {previewModalCert.mother_name && <span>Mother: {previewModalCert.mother_name}</span>}
                    </div>
                  )}

                  <p className="text-xs text-slate-600 max-w-lg mx-auto">
                    in recognition of the successful completion of the prescribed curriculum, practical assessments, and professional competencies in
                  </p>

                  <h3 className="text-2xl font-serif font-bold text-[#966718]">
                    {previewModalCert.class_name}
                  </h3>

                  {/* Metas */}
                  <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-800">
                    <span className="px-3 py-1 rounded-md bg-amber-50 border border-amber-300">
                      Grade: {previewModalCert.grade}
                    </span>
                    {previewModalCert.session_title && (
                      <span className="px-3 py-1 rounded-md bg-slate-100 border border-slate-200">
                        Session: {previewModalCert.session_title}
                      </span>
                    )}
                    {previewModalCert.start_date && previewModalCert.end_date && (
                      <span className="px-3 py-1 rounded-md bg-blue-50 border border-blue-200">
                        {previewModalCert.start_date} – {previewModalCert.end_date}
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200">
                      Issued: {previewModalCert.issued_at}
                    </span>
                  </div>

                  {/* Modal Signatures */}
                  <div className="pt-8 grid grid-cols-3 gap-2 items-end border-t border-slate-200">
                    <div className="text-center">
                      <p className="font-serif italic text-xs font-bold text-slate-900">Dr. M. A. Rahman</p>
                      <div className="w-20 h-0.5 bg-slate-300 mx-auto my-1" />
                      <p className="text-[10px] font-bold text-slate-600">Academic Director</p>
                    </div>

                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full border-2 border-[#C8963E] bg-amber-50 text-[#C8963E] flex flex-col items-center justify-center mx-auto">
                        <Award className="w-5 h-5" />
                        <span className="text-[6px] font-bold">SEAL</span>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="font-serif italic text-xs font-bold text-slate-900">K. H. Mahmud, FCA</p>
                      <div className="w-20 h-0.5 bg-slate-300 mx-auto my-1" />
                      <p className="text-[10px] font-bold text-slate-600">Controller of Exams</p>
                    </div>
                  </div>

                  <p className="text-[9px] text-slate-400 font-mono pt-4">
                    Online Authenticated Record: #{previewModalCert.registration_id} • Serial: #{previewModalCert.serial_number}
                  </p>
                </div>
              </div>
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
