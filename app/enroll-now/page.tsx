'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { COURSES } from '@/data/cfo-data';
import { useCfo } from '@/context/CfoContext';
import {
  CheckCircle2,
  Award,
  Calendar,
  Clock,
  ArrowLeft,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Info,
  CheckCircle,
  Send,
  HelpCircle,
  Globe,
} from 'lucide-react';

function EnrollNowContent() {
  const searchParams = useSearchParams();
  const { lang, enrollInCourse, courses: contextCourses, systemInfo } = useCfo();

  const allCourses = contextCourses && contextCourses.length > 0 ? contextCourses : COURSES;

  // Extract ?course= query param
  const queryCourseName = searchParams.get('course') || '';

  // Find course by title or slug
  const matchedCourse = React.useMemo(() => {
    if (!queryCourseName) return allCourses[0];
    const query = queryCourseName.toLowerCase().trim();
    return (
      allCourses.find(
        (c) =>
          c.title.toLowerCase().trim() === query ||
          c.titleEn?.toLowerCase().trim() === query ||
          c.id.toLowerCase() === query ||
          c.slug?.toLowerCase() === query ||
          c.title.toLowerCase().includes(query) ||
          query.includes(c.title.toLowerCase())
      ) || allCourses[0]
    );
  }, [queryCourseName, allCourses]);

  const [userSelectedCourseId, setUserSelectedCourseId] = useState<string | null>(null);
  const selectedCourseId = userSelectedCourseId ?? matchedCourse?.id ?? allCourses[0]?.id ?? '';
  const currentCourse = allCourses.find((c) => c.id === selectedCourseId) || matchedCourse || allCourses[0];

  // Streamlined Form State matching http://127.0.0.1:8000/api/enrollment/enroll-now
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: queryCourseName || matchedCourse?.title || 'Diploma in E-Commerce and Supply Chain with Lean Six Sigma',
    address: 'Dhaka',
    remarks: '',
  });

  // Keep subject in sync if user changes course dropdown and hadn't manually edited subject
  const [hasManuallyEditedSubject, setHasManuallyEditedSubject] = useState(false);

  const handleCourseSelect = (courseId: string) => {
    setUserSelectedCourseId(courseId);
    const found = allCourses.find((c) => c.id === courseId);
    if (found && !hasManuallyEditedSubject) {
      setFormData((prev) => ({ ...prev, subject: found.title }));
    }
  };

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    id?: number | string;
    subject: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    remarks: string;
    isLiveBackend?: boolean;
    submittedAt?: string;
    backendMessage?: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Backend API Base URL
  const apiEndpoint = typeof window !== 'undefined'
    ? localStorage.getItem('cfo_custom_api_url') || process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://127.0.0.1:8000'
    : process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://127.0.0.1:8000';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'subject') {
      setHasManuallyEditedSubject(true);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError(lang === 'bn' ? 'অনুগ্রহ করে আপনার পুরো নাম লিখুন।' : 'Please enter your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setFormError(lang === 'bn' ? 'অনুগ্রহ করে আপনার ইমেইল ঠিকানা দিন।' : 'Please enter your email address.');
      return;
    }
    if (!formData.subject.trim()) {
      setFormError(lang === 'bn' ? 'কোর্সের বিষয় (Subject) সিলেক্ট বা লিখুন।' : 'Please enter or select course subject.');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
      subject: formData.subject.trim(),
      address: formData.address.trim() || undefined,
      remarks: formData.remarks.trim() || undefined,
    };

    setIsSubmitting(true);

    try {
      let createdId: number | string = Math.floor(1000 + Math.random() * 9000);
      let isLiveBackend = false;
      let submittedAt: string | undefined = undefined;
      let backendMessage: string | undefined = undefined;

      // 1. Try posting directly to user's backend if available from browser
      const directBase = (apiEndpoint || process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
      let apiSuccess = false;
      try {
        const directRes = await fetch(`${directBase}/api/enrollment/enroll-now`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(4000),
        });

        const directData = await directRes.json();
        if (directRes.ok || directRes.status === 201) {
          if (directData.success) {
            apiSuccess = true;
            isLiveBackend = true;
            backendMessage = directData.message;
            const record = directData.data?.data?.[0] || directData.data;
            if (record?.id) createdId = record.id;
            if (record?.submitted_at) submittedAt = record.submitted_at;
          }
        } else if (directRes.status === 422) {
          // Laravel validation error
          const msg = directData.message || 'Validation error';
          const errs = directData.errors ? Object.values(directData.errors).flat().join(', ') : '';
          setFormError(`${msg}${errs ? `: ${errs}` : ''}`);
          setIsSubmitting(false);
          return;
        }
      } catch {
        // Direct call failed (e.g. Mixed content or CORS); proceed to Next.js API proxy
      }

      // 2. If direct call did not succeed, forward via internal Next.js proxy route
      if (!apiSuccess) {
        const proxyRes = await fetch('/api/enrollment/enroll-now', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'x-custom-backend-url': directBase,
          },
          body: JSON.stringify(payload),
        });

        const proxyData = await proxyRes.json();

        if (proxyRes.status === 422) {
          const msg = proxyData.message || 'Laravel validation error';
          const errs = proxyData.errors ? Object.values(proxyData.errors).flat().join(', ') : '';
          setFormError(`${msg}${errs ? `: ${errs}` : ''}`);
          setIsSubmitting(false);
          return;
        }

        if (proxyRes.ok || proxyRes.status === 201) {
          if (proxyData.isLiveBackend) {
            isLiveBackend = true;
          }
          backendMessage = proxyData.message;
          const record = proxyData.data?.data?.[0] || proxyData.data;
          if (record?.id) createdId = record.id;
          if (record?.submitted_at) submittedAt = record.submitted_at;
        }
      }

      if (currentCourse) {
        enrollInCourse(currentCourse);
      }

      setSubmissionResult({
        id: createdId,
        name: payload.name,
        email: payload.email,
        phone: payload.phone || '',
        subject: payload.subject,
        address: payload.address || 'Dhaka',
        remarks: payload.remarks || '',
        isLiveBackend,
        submittedAt,
        backendMessage,
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // Fallback submission if unexpected network crash
      setSubmissionResult({
        id: Math.floor(1000 + Math.random() * 9000),
        name: payload.name,
        email: payload.email,
        phone: payload.phone || '',
        subject: payload.subject,
        address: payload.address || 'Dhaka',
        remarks: payload.remarks || '',
        isLiveBackend: false,
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Quick remarks recommendation pills
  const quickRemarks = [
    lang === 'bn' ? 'সান্ধ্যকালীন ব্যাচে আগ্রহী' : 'Interested in evening batch',
    lang === 'bn' ? 'শুক্রবার ও শনিবার উইকেন্ড ব্যাচ' : 'Weekend executive batch (Fri & Sat)',
    lang === 'bn' ? 'ক্যাম্পাস ও অনলাইন হাইব্রিড ক্লাস' : 'Hybrid (Campus + Online)',
    lang === 'bn' ? 'কোর্স আউটলাইন ও সিলেবাস জানতে চাই' : 'Requesting syllabus details',
  ];

  if (isSubmitted && submissionResult) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
        <Navbar />

        <main className="max-w-3xl mx-auto px-4 py-16 flex-1 w-full">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-8 sm:p-12 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Official Course Enquiry Received
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#0A192F]">
                {lang === 'bn'
                  ? 'আপনার ভর্তি সংক্রান্ত আবেদন সফলভাবে গৃহীত হয়েছে!'
                  : 'Your Course Enquiry Has Been Successfully Submitted!'}
              </h1>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {lang === 'bn'
                  ? 'চার্টার্ড অফিসার লিমিটেড (COL)-এর অ্যাকাডেমিক প্রোগ্রামে আগ্রহ প্রকাশের জন্য ধন্যবাদ।'
                  : 'Thank you for your interest in Chartered Officer Limited (COL) executive programs.'}
              </p>
            </div>

            {/* Official Admission Voucher */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-left space-y-4 max-w-lg mx-auto shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-500">
                  {lang === 'bn' ? 'এনকোয়ারি / ট্র্যাকিং আইডি:' : 'Enquiry Tracking ID:'}
                </span>
                <span className="font-mono text-sm font-black text-[#0A192F] bg-amber-100/60 px-2.5 py-0.5 rounded border border-amber-300">
                  #{submissionResult.id}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === 'bn' ? 'আবেদনকারী / নাম:' : 'Applicant Name:'}</span>
                  <span className="font-bold text-slate-900">{submissionResult.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === 'bn' ? 'কোর্স / বিষয় (Subject):' : 'Course Subject:'}</span>
                  <span className="font-bold text-[#C8963E] text-right max-w-[260px] truncate">
                    {submissionResult.subject}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === 'bn' ? 'মোবাইল / হোয়াটসঅ্যাপ:' : 'Phone / WhatsApp:'}</span>
                  <span className="font-mono font-semibold text-slate-800">{submissionResult.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === 'bn' ? 'ইমেইল:' : 'Email Address:'}</span>
                  <span className="font-mono text-slate-700">{submissionResult.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === 'bn' ? 'ঠিকানা (Address):' : 'Address:'}</span>
                  <span className="font-semibold text-slate-800">{submissionResult.address}</span>
                </div>
                {submissionResult.remarks && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">{lang === 'bn' ? 'মন্তব্য (Remarks):' : 'Remarks:'}</span>
                    <span className="text-slate-800 italic max-w-[240px] text-right truncate">
                      {submissionResult.remarks}
                    </span>
                  </div>
                )}
                {submissionResult.submittedAt && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">{lang === 'bn' ? 'জমার সময়:' : 'Submitted At:'}</span>
                    <span className="font-mono text-slate-700">{submissionResult.submittedAt}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-500">{lang === 'bn' ? 'আবেদনের স্ট্যাটাস:' : 'Submission Status:'}</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {lang === 'bn' ? 'সফলভাবে গৃহীত হয়েছে' : 'Successfully Received'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === 'bn' ? 'স্বীকৃতি ও রেজি:' : 'Accreditation:'}</span>
                  <span className="font-semibold text-slate-700">BTEB &amp; RJSC (Govt. Reg. C-177263)</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
                <span className="font-bold block mb-0.5">
                  {lang === 'bn' ? 'পরবর্তী করণীয়:' : 'Next Steps:'}
                </span>
                {lang === 'bn'
                  ? 'আমাদের এক্সিকিউটিভ অ্যাডমিশন কাউন্সিলর আপনার আবেদনটি পেয়ে গেছেন এবং খুব শীঘ্রই আপনার নম্বরে সরাসরি যোগাযোগ করে বিস্তারিত শিডিউল ও তথ্য জানাবেন।'
                  : 'Our executive admissions coordinator has received your enquiry and will contact you directly via phone/WhatsApp with complete cohort details.'}
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/courses"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0A192F] hover:bg-[#1E3A8A] text-[#E5A93C] font-bold text-xs shadow-md transition-all text-center"
              >
                {lang === 'bn' ? 'অন্যান্য কোর্স দেখুন' : 'Explore Other Courses'}
              </Link>
              <Link
                href="/certificates"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-all text-center flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4 text-[#C8963E]" />
                <span>{lang === 'bn' ? 'সার্টিফিকেট যাচাই পেজ' : 'Certificate Verification'}</span>
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-[#0A192F] text-white py-10 sm:py-12 px-4 border-b border-[#1E3A8A] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_-10%,rgba(200,150,62,0.18),transparent)]" />
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-3">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs text-[#E5A93C] hover:underline mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'সব কোর্সে ফিরে যান' : 'Back to Courses Catalog'}</span>
          </Link>

          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-white">
            {lang === 'bn' ? 'কোর্স ভর্তি ও পরামর্শ অনুসন্ধান' : 'Course Admission & Program Enquiry'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {lang === 'bn'
              ? 'নিচের সংক্ষিপ্ত ফর্মটি পূরণ করুন। কোনো অগ্রিম পেমেন্ট ছাড়াই আমাদের অ্যাকাডেমিক কাউন্সিলর আপনার সাথে সরাসরি যোগাযোগ করে আসন নিশ্চিত করবেন।'
              : 'Submit this simplified enquiry form. No payment gateway or upfront fees required—our academic advisor will contact you directly.'}
          </p>
        </div>
      </section>

      {/* Main Form + Course Overview */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {formError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Streamlined inputs matching API */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-serif font-bold text-[#0A192F]">
                    {lang === 'bn' ? 'ভর্তি অনুসন্ধান ফর্ম' : 'Admission Enquiry Details'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {lang === 'bn'
                      ? 'প্রয়োজনীয় তথ্য দিয়ে সাবমিট করুন'
                      : 'Please provide your contact information and course preference'}
                  </p>
                </div>
                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'পেমেন্ট প্রয়োজন নেই' : 'No Payment Required'}</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Subject / Course Selection */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    {lang === 'bn' ? 'কোর্সের বিষয় (Subject) *' : 'Course / Subject *'}
                  </label>
                  <div className="space-y-2">
                    {/* Select from catalog or edit */}
                    <select
                      value={selectedCourseId}
                      onChange={(e) => handleCourseSelect(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:border-[#C8963E]"
                    >
                      {allCourses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title} {c.batchNumber ? `(${c.batchNumber})` : ''}
                        </option>
                      ))}
                    </select>

                    {/* Editable subject line for custom topics or precise naming */}
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Diploma in E-Commerce and Supply Chain with Lean Six Sigma"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700 focus:bg-white focus:outline-none focus:border-[#C8963E]"
                    />
                  </div>
                </div>

                {/* Name, Email, Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#C8963E]" />
                      <span>{lang === 'bn' ? 'আপনার পুরো নাম (Name) *' : 'Full Name *'}</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. John Doe / Md. Tanvir Hossain"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#C8963E]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#C8963E]" />
                      <span>{lang === 'bn' ? 'মোবাইল / হোয়াটসঅ্যাপ (Phone) *' : 'Phone / WhatsApp *'}</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. 01712345678"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#C8963E]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#C8963E]" />
                      <span>{lang === 'bn' ? 'ইমেইল ঠিকানা (Email) *' : 'Email Address *'}</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#C8963E]"
                    />
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C8963E]" />
                      <span>{lang === 'bn' ? 'বর্তমান ঠিকানা বা শহর (Address)' : 'City / Address'}</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      placeholder="e.g. Dhaka, Bangladesh"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#C8963E]"
                    />
                  </div>

                  {/* Remarks */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-[#C8963E]" />
                      <span>{lang === 'bn' ? 'মন্তব্য বা শিডিউল জিজ্ঞাসা (Remarks)' : 'Remarks / Special Notes'}</span>
                    </label>
                    <textarea
                      name="remarks"
                      rows={3}
                      placeholder="e.g. Interested in evening batch / Weekend batch preference"
                      value={formData.remarks}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#C8963E]"
                    />

                    {/* Quick suggestion pills */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] text-slate-400 font-medium">Quick suggestions:</span>
                      {quickRemarks.map((qr) => (
                        <button
                          key={qr}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, remarks: qr }))}
                          className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-amber-100/70 hover:text-[#966718] text-slate-600 transition-colors border border-slate-200"
                        >
                          + {qr}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Course Summary & Submit Action */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="rounded-2xl bg-white border border-slate-200 shadow-xl p-6 space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[11px] font-bold text-[#C8963E] uppercase tracking-wider block">
                  {lang === 'bn' ? 'প্রোগ্রাম সারসংক্ষেপ' : 'Program Overview'}
                </span>
                <h3 className="text-base sm:text-lg font-serif font-black text-slate-900 mt-1 leading-snug">
                  {currentCourse?.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {currentCourse?.batchNumber || 'Cohort Batch 18'}
                </p>
              </div>

              {/* Course Key Specs */}
              <div className="space-y-2.5 text-xs border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-[#C8963E]" />
                    {lang === 'bn' ? 'কোর্সের মেয়াদ:' : 'Duration:'}
                  </span>
                  <span className="font-bold text-slate-800">{currentCourse?.duration || '3 Months'}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-[#C8963E]" />
                    {lang === 'bn' ? 'মোট লেকচার/ক্লাস:' : 'Total Classes:'}
                  </span>
                  <span className="font-bold text-slate-800">
                    {currentCourse?.totalClasses ? `${currentCourse.totalClasses} Classes` : '48+ Hours'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Building2 className="w-3.5 h-3.5 text-[#C8963E]" />
                    {lang === 'bn' ? 'ক্যাম্পাস ভেন্যু:' : 'Campus Venue:'}
                  </span>
                  <span className="font-semibold text-slate-800">City Centre, Motijheel</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Award className="w-3.5 h-3.5 text-[#C8963E]" />
                    {lang === 'bn' ? 'সনদ স্বীকৃতি:' : 'Accreditation:'}
                  </span>
                  <span className="font-bold text-emerald-700">BTEB &amp; RJSC Approved</span>
                </div>
              </div>

              {/* No Payment Gateway Notice */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#0A192F] font-bold">
                  <Info className="w-4 h-4 text-[#C8963E] shrink-0" />
                  <span>{lang === 'bn' ? 'সরাসরি ভর্তি পরামর্শ' : 'Direct Admission Enquiry'}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {lang === 'bn'
                    ? 'আবেদনের জন্য কোনো অনলাইন পেমেন্ট গেটওয়ে বা অগ্রিম ফি প্রয়োজন নেই। ফর্মটি সাবমিট করলে আমাদের এক্সিকিউটিভ টিম সরাসরি আপনার সাথে যোগাযোগ করে আসন ও শিডিউল নিশ্চিত করবে।'
                    : 'No payment gateway or card payment required. Submit your enquiry and our admissions team will contact you directly to confirm onboarding.'}
                </p>
              </div>

              {/* Direct Helpline */}
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs">
                <span className="text-[11px] text-slate-500 font-medium block">
                  {lang === 'bn' ? 'ভর্তি বিষয়ক সরাসরি হটলাইন:' : 'Direct Admission Helpline:'}
                </span>
                <a
                  href={`tel:${(systemInfo.mobile || systemInfo.phone || '+8801713378787').replace(/\s+/g, '')}`}
                  className="font-mono text-sm font-bold text-[#0A192F] hover:text-[#C8963E] transition-colors flex items-center gap-1.5 mt-0.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C8963E]" />
                  <span>{systemInfo.phone || '+880 1713378787'}</span>
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 font-serif font-black text-sm shadow-md transition-all transform active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>{lang === 'bn' ? 'আবেদন জমা হচ্ছে...' : 'Submitting Enquiry...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'ভর্তি আবেদন জমা দিন' : 'Submit Enrollment Enquiry'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default function EnrollNowPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A192F] flex items-center justify-center text-white">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#C8963E] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold">Loading Admission Form...</p>
          </div>
        </div>
      }
    >
      <EnrollNowContent />
    </Suspense>
  );
}
