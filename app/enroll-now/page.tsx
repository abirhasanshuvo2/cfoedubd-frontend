'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { COURSES } from '@/data/cfo-data';
import { useCfo } from '@/context/CfoContext';
import { submitEnrollmentEnquiry } from '@/lib/enrollment-service';
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
  Heart,
  AlertCircle,
} from 'lucide-react';

function EnrollNowContent() {
  const searchParams = useSearchParams();
  const { lang, enrollInCourse, courses: contextCourses, systemInfo, theme } = useCfo();

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

  // Completely blank form state for the user to fill in themselves (NO mock auto-fill)
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: '', // '1' | '2' | '3'
    birth_date: '',
    fathers_name: '',
    fathers_occupation: '',
    fathers_phone: '',
    fathers_email: '',
    mothers_name: '',
    mothers_occupation: '',
    mothers_phone: '',
    mothers_email: '',
    subject: queryCourseName || matchedCourse?.title || '',
    address: '',
    permanent_address: '',
    remarks: '',
  });

  // Track if user manually changed the subject text field
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
    last_name: string;
    phone: string;
    email: string;
    gender: string;
    birth_date: string;
    fathers_name: string;
    mothers_name: string;
    address: string;
    permanent_address: string;
    remarks: string;
    isLiveBackend?: boolean;
    submittedAt?: string;
    backendMessage?: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [missingFieldKeys, setMissingFieldKeys] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'subject') {
      setHasManuallyEditedSubject(true);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field from missing keys highlight as user types
    setMissingFieldKeys((prev) => prev.filter((k) => k !== name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setMissingFieldKeys([]);

    // Strict validation: every single field required by the API must be provided
    const requiredCheck: { key: keyof typeof formData; label: string }[] = [
      { key: 'name', label: lang === 'bn' ? 'প্রথম নাম (First Name)' : 'First Name' },
      { key: 'last_name', label: lang === 'bn' ? 'শেষ নাম (Last Name)' : 'Last Name' },
      { key: 'email', label: lang === 'bn' ? 'ইমেইল (Email)' : 'Email' },
      { key: 'phone', label: lang === 'bn' ? 'মোবাইল নম্বর (Phone)' : 'Phone' },
      { key: 'gender', label: lang === 'bn' ? 'লিঙ্গ (Gender)' : 'Gender' },
      { key: 'birth_date', label: lang === 'bn' ? 'জন্মতারিখ (Birth Date)' : 'Birth Date' },
      { key: 'fathers_name', label: lang === 'bn' ? 'পিতার নাম (Father\'s Name)' : "Father's Name" },
      { key: 'fathers_occupation', label: lang === 'bn' ? 'পিতার পেশা (Father\'s Occupation)' : "Father's Occupation" },
      { key: 'fathers_phone', label: lang === 'bn' ? 'পিতার ফোন (Father\'s Phone)' : "Father's Phone" },
      { key: 'fathers_email', label: lang === 'bn' ? 'পিতার ইমেইল (Father\'s Email)' : "Father's Email" },
      { key: 'mothers_name', label: lang === 'bn' ? 'মাতার নাম (Mother\'s Name)' : "Mother's Name" },
      { key: 'mothers_occupation', label: lang === 'bn' ? 'মাতার পেশা (Mother\'s Occupation)' : "Mother's Occupation" },
      { key: 'mothers_phone', label: lang === 'bn' ? 'মাতার ফোন (Mother\'s Phone)' : "Mother's Phone" },
      { key: 'mothers_email', label: lang === 'bn' ? 'মাতার ইমেইল (Mother\'s Email)' : "Mother's Email" },
      { key: 'subject', label: lang === 'bn' ? 'কোর্সের বিষয় (Subject)' : 'Subject' },
      { key: 'address', label: lang === 'bn' ? 'বর্তমান ঠিকানা (Present Address)' : 'Present Address' },
      { key: 'permanent_address', label: lang === 'bn' ? 'স্থায়ী ঠিকানা (Permanent Address)' : 'Permanent Address' },
      { key: 'remarks', label: lang === 'bn' ? 'মন্তব্য (Remarks)' : 'Remarks' },
    ];

    const missingKeys: string[] = [];
    const missingLabels: string[] = [];

    for (const item of requiredCheck) {
      const val = formData[item.key];
      if (!val || !val.trim()) {
        missingKeys.push(item.key);
        missingLabels.push(item.label);
      }
    }

    if (missingKeys.length > 0) {
      setMissingFieldKeys(missingKeys);
      setFormError(
        lang === 'bn'
          ? `ফর্মের সকল তথ্য পূরণ করা বাধ্যতামূলক। অনুগ্রহ করে এই ফিল্ডগুলো পূরণ করুন: ${missingLabels.join(', ')}`
          : `Every field is required to submit to the API. Please fill in: ${missingLabels.join(', ')}`
      );
      // Scroll to error
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      gender: formData.gender.trim(),
      birth_date: formData.birth_date.trim(),
      fathers_name: formData.fathers_name.trim(),
      fathers_occupation: formData.fathers_occupation.trim(),
      fathers_phone: formData.fathers_phone.trim(),
      fathers_email: formData.fathers_email.trim(),
      mothers_name: formData.mothers_name.trim(),
      mothers_occupation: formData.mothers_occupation.trim(),
      mothers_phone: formData.mothers_phone.trim(),
      mothers_email: formData.mothers_email.trim(),
      subject: formData.subject.trim(),
      address: formData.address.trim(),
      permanent_address: formData.permanent_address.trim(),
      remarks: formData.remarks.trim(),
    };

    setIsSubmitting(true);

    try {
      const res = await submitEnrollmentEnquiry(payload);

      if (!res.success && res.errors) {
        const errorMessages = Object.entries(res.errors)
          .map(([key, msgs]) => `${key}: ${msgs.join(', ')}`)
          .join(' | ');
        setFormError(res.message ? `${res.message}: ${errorMessages}` : errorMessages);
        setIsSubmitting(false);
        return;
      }

      if (currentCourse) {
        enrollInCourse(currentCourse);
      }

      setSubmissionResult({
        id: res.data?.id || Math.floor(1000 + Math.random() * 9000),
        name: payload.name,
        last_name: payload.last_name,
        email: payload.email,
        phone: payload.phone,
        gender: payload.gender,
        birth_date: payload.birth_date,
        fathers_name: payload.fathers_name,
        mothers_name: payload.mothers_name,
        subject: payload.subject,
        address: payload.address,
        permanent_address: payload.permanent_address,
        remarks: payload.remarks,
        isLiveBackend: res.isLiveBackend ?? false,
        submittedAt: res.data?.created_at || new Date().toLocaleString(),
        backendMessage: res.message,
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setFormError(err?.message || 'Error communicating with backend API');
      setIsSubmitting(false);
    }
  };

  const isFieldMissing = (key: string) => missingFieldKeys.includes(key);

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
                Official Enquiry Registered (API: /api/enquiries)
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#0A192F]">
                {lang === 'bn'
                  ? 'আপনার ভর্তি অনুসন্ধান ও আবেদন সফলভাবে গৃহীত হয়েছে!'
                  : 'Your Admission Enquiry Has Been Successfully Submitted!'}
              </h1>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {lang === 'bn'
                  ? 'চার্টার্ড অফিসার লিমিটেড (COL)-এর অ্যাকাডেমিক প্রোগ্রামে আগ্রহ প্রকাশের জন্য ধন্যবাদ।'
                  : 'Thank you for your interest in Chartered Officer Limited (COL) executive programs.'}
              </p>
            </div>

            {/* Official Admission Voucher */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-left space-y-4 max-w-xl mx-auto shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-500">
                  {lang === 'bn' ? 'এনকোয়ারি / ট্র্যাকিং আইডি:' : 'Enquiry Tracking ID:'}
                </span>
                <span className="font-mono text-sm font-black text-[#0A192F] bg-amber-100/60 px-2.5 py-0.5 rounded border border-amber-300">
                  #{submissionResult.id}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">{lang === 'bn' ? 'নাম (Name):' : 'Full Name:'}</span>
                  <span className="font-bold text-slate-900">
                    {submissionResult.name} {submissionResult.last_name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">{lang === 'bn' ? 'ইমেইল:' : 'Email Address:'}</span>
                  <span className="font-mono text-slate-800">{submissionResult.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{lang === 'bn' ? 'ফোন (Phone):' : 'Phone / WhatsApp:'}</span>
                  <span className="font-mono font-semibold text-slate-800">{submissionResult.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{lang === 'bn' ? 'জন্মতারিখ:' : 'Birth Date:'}</span>
                  <span className="font-mono text-slate-800">{submissionResult.birth_date}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{lang === 'bn' ? 'পিতার নাম:' : "Father's Name:"}</span>
                  <span className="font-semibold text-slate-800">{submissionResult.fathers_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{lang === 'bn' ? 'মাতার নাম:' : "Mother's Name:"}</span>
                  <span className="font-semibold text-slate-800">{submissionResult.mothers_name}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block">{lang === 'bn' ? 'কোর্স বিষয় (Subject):' : 'Course Subject:'}</span>
                  <span className="font-bold text-[#C8963E] block">{submissionResult.subject}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{lang === 'bn' ? 'বর্তমান ঠিকানা:' : 'Present Address:'}</span>
                  <span className="font-semibold text-slate-800">{submissionResult.address}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{lang === 'bn' ? 'স্থায়ী ঠিকানা:' : 'Permanent Address:'}</span>
                  <span className="font-semibold text-slate-800">{submissionResult.permanent_address}</span>
                </div>
              </div>

              {submissionResult.remarks && (
                <div className="pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-500 block mb-0.5">{lang === 'bn' ? 'মন্তব্য (Remarks):' : 'Remarks:'}</span>
                  <span className="text-slate-800 italic">{submissionResult.remarks}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-xs">
                <span className="text-slate-500">{lang === 'bn' ? 'আবেদনের স্ট্যাটাস:' : 'Submission Status:'}</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {submissionResult.isLiveBackend ? 'Forwarded to Laravel API (:8000)' : 'Saved Successfully'}
                </span>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
                <span className="font-bold block mb-0.5">
                  {lang === 'bn' ? 'পরবর্তী করণীয়:' : 'Next Steps:'}
                </span>
                {lang === 'bn'
                  ? 'আমাদের এক্সিকিউটিভ অ্যাকাডেমিক টিম আপনার আবেদনটি পেয়ে গেছেন এবং খুব শীঘ্রই আপনার নম্বরে সরাসরি যোগাযোগ করে আসন নিশ্চিত করবেন।'
                  : 'Our admissions coordinator has received your enquiry and will contact you via phone/WhatsApp with complete cohort details.'}
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/courses"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#B8860B] hover:from-[#d4af37] text-slate-950 font-serif font-black text-xs shadow-md transition-all text-center cursor-pointer"
              >
                {lang === 'bn' ? 'অন্যান্য কোর্স দেখুন' : 'Explore Other Courses'}
              </Link>
              <Link
                href="/certificates"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-xs transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
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
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col font-sans transition-colors ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}
    >
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-amber-50/90 via-slate-50 to-white dark:from-[#0A192F] dark:via-[#0D254C] dark:to-[#0A192F] dark:bg-[#0A192F] text-slate-900 dark:text-white py-10 sm:py-12 px-4 border-b border-slate-200 dark:border-[#1E3A8A] relative overflow-hidden transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_-10%,rgba(200,150,62,0.18),transparent)]" />
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-3">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs text-amber-800 dark:text-[#E5A93C] hover:underline mb-1 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'সব কোর্সে ফিরে যান' : 'Back to Courses Catalog'}</span>
          </Link>

          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-slate-900 dark:text-white">
            {lang === 'bn' ? (
              <>
                কোর্স ভর্তি ও পরামর্শ অনুসন্ধান <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#966718] dark:from-[#FFDF79] dark:via-[#E5A93C] dark:to-[#C8963E]">(Enquiry Form)</span>
              </>
            ) : (
              <>
                Course Admission &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#966718] dark:from-[#FFDF79] dark:via-[#E5A93C] dark:to-[#C8963E]">Program Enquiry</span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {lang === 'bn'
              ? 'নিচের ফর্মের প্রতিটি প্রয়োজনীয় ফিল্ড পূরণ করে সাবমিট করুন। সকল ফিল্ড পূরণ করা সাপেক্ষে সরাসরি আমাদের ব্যাকএন্ড এপিআই-এ (/api/enquiries) ডাটা জমা হবে।'
              : 'Please complete all required fields. All fields must be fulfilled before submitting to the backend API (http://127.0.0.1:8000/api/enquiries).'}
          </p>
        </div>
      </section>

      {/* Main Form + Course Overview */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {formError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): All enquiry fields */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Course / Subject Selection Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#C8963E]" />
                  <h2 className="text-base font-serif font-bold text-[#0A192F]">
                    {lang === 'bn' ? '১. কোর্স / বিষয় নির্বাচন (Subject) *' : '1. Course / Subject Selection *'}
                  </h2>
                </div>
                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'সরাসরি এপিআই এনকোয়ারি' : 'Direct API Enquiry'}</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  {lang === 'bn' ? 'কোর্সের তালিকা থেকে নির্বাচন করুন' : 'Select from Catalog'}
                </label>
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

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600">
                    {lang === 'bn' ? 'কোর্সের সুনির্দিষ্ট বিষয় / নাম (subject) *' : 'Exact Subject Title (API Field: subject) *'}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Diploma in E-Commerce and Supply Chain with Lean Six Sigma"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-800 focus:outline-none ${
                      isFieldMissing('subject') ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 focus:border-[#C8963E]'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* 2. Applicant Personal Details Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <User className="w-4 h-4 text-[#C8963E]" />
                <h2 className="text-base font-serif font-bold text-[#0A192F]">
                  {lang === 'bn' ? '২. আবেদনকারীর ব্যক্তিগত বিবরণ' : '2. Applicant Personal Information'}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    {lang === 'bn' ? 'প্রথম নাম (First Name) *' : 'First Name (name) *'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter first name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-800 focus:outline-none ${
                      isFieldMissing('name') ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 focus:border-[#C8963E]'
                    }`}
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    {lang === 'bn' ? 'শেষ নাম (Last Name) *' : 'Last Name (last_name) *'}
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    required
                    placeholder="Enter last name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-800 focus:outline-none ${
                      isFieldMissing('last_name') ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 focus:border-[#C8963E]'
                    }`}
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#C8963E]" />
                    <span>{lang === 'bn' ? 'ইমেইল ঠিকানা (Email) *' : 'Email Address (email) *'}</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-800 focus:outline-none ${
                      isFieldMissing('email') ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 focus:border-[#C8963E]'
                    }`}
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#C8963E]" />
                    <span>{lang === 'bn' ? 'মোবাইল নম্বর (Phone) *' : 'Phone Number (phone) *'}</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="01712345678"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-800 focus:outline-none ${
                      isFieldMissing('phone') ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 focus:border-[#C8963E]'
                    }`}
                  />
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    {lang === 'bn' ? 'লিঙ্গ (Gender) *' : 'Gender (gender) *'}
                  </label>
                  <select
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-xs sm:text-sm text-slate-800 focus:outline-none ${
                      isFieldMissing('gender') ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 focus:border-[#C8963E]'
                    }`}
                  >
                    <option value="">{lang === 'bn' ? '-- লিঙ্গ নির্বাচন করুন --' : '-- Select Gender --'}</option>
                    <option value="1">1 - {lang === 'bn' ? 'পুরুষ (Male)' : 'Male'}</option>
                    <option value="2">2 - {lang === 'bn' ? 'নারী (Female)' : 'Female'}</option>
                    <option value="3">3 - {lang === 'bn' ? 'অন্যান্য (Other)' : 'Other'}</option>
                  </select>
                </div>

                {/* Birth Date */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#C8963E]" />
                    <span>{lang === 'bn' ? 'জন্মতারিখ (Birth Date) *' : 'Birth Date (birth_date) *'}</span>
                  </label>
                  <input
                    type="date"
                    name="birth_date"
                    required
                    value={formData.birth_date}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-800 focus:outline-none ${
                      isFieldMissing('birth_date') ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 focus:border-[#C8963E]'
                    }`}
                  />
                </div>

                {/* Present Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C8963E]" />
                    <span>{lang === 'bn' ? 'বর্তমান ঠিকানা (Present Address) *' : 'Present Address (address) *'}</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="e.g. Dhaka, Bangladesh"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-800 focus:outline-none ${
                      isFieldMissing('address') ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 focus:border-[#C8963E]'
                    }`}
                  />
                </div>

                {/* Permanent Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C8963E]" />
                    <span>{lang === 'bn' ? 'স্থায়ী ঠিকানা (Permanent Address) *' : 'Permanent Address (permanent_address) *'}</span>
                  </label>
                  <input
                    type="text"
                    name="permanent_address"
                    required
                    placeholder="e.g. Chittagong, Bangladesh"
                    value={formData.permanent_address}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-800 focus:outline-none ${
                      isFieldMissing('permanent_address') ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 focus:border-[#C8963E]'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* 3. Guardian / Parents Information Card (Father & Mother) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Heart className="w-4 h-4 text-[#C8963E]" />
                <h2 className="text-base font-serif font-bold text-[#0A192F]">
                  {lang === 'bn' ? '৩. পিতামাতার তথ্য (Parents / Guardian Details) *' : '3. Parents / Guardian Details *'}
                </h2>
              </div>

              {/* Father's Info */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg inline-block">
                  {lang === 'bn' ? 'পিতার বিবরণ (Father Details)' : "Father's Information"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {lang === 'bn' ? 'পিতার নাম (Father\'s Name) *' : "Father's Name (fathers_name) *"}
                    </label>
                    <input
                      type="text"
                      name="fathers_name"
                      required
                      placeholder="Enter father's name"
                      value={formData.fathers_name}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none ${
                        isFieldMissing('fathers_name') ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 focus:border-[#C8963E]'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {lang === 'bn' ? 'পিতার পেশা (Occupation) *' : "Father's Occupation (fathers_occupation) *"}
                    </label>
                    <input
                      type="text"
                      name="fathers_occupation"
                      required
                      placeholder="e.g. Engineer / Businessman"
                      value={formData.fathers_occupation}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none ${
                        isFieldMissing('fathers_occupation') ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 focus:border-[#C8963E]'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {lang === 'bn' ? 'পিতার ফোন (Phone) *' : "Father's Phone (fathers_phone) *"}
                    </label>
                    <input
                      type="tel"
                      name="fathers_phone"
                      required
                      placeholder="01711111111"
                      value={formData.fathers_phone}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none ${
                        isFieldMissing('fathers_phone') ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 focus:border-[#C8963E]'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {lang === 'bn' ? 'পিতার ইমেইল (Email) *' : "Father's Email (fathers_email) *"}
                    </label>
                    <input
                      type="email"
                      name="fathers_email"
                      required
                      placeholder="father@example.com"
                      value={formData.fathers_email}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none ${
                        isFieldMissing('fathers_email') ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 focus:border-[#C8963E]'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Mother's Info */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg inline-block">
                  {lang === 'bn' ? 'মাতার বিবরণ (Mother Details)' : "Mother's Information"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {lang === 'bn' ? 'মাতার নাম (Mother\'s Name) *' : "Mother's Name (mothers_name) *"}
                    </label>
                    <input
                      type="text"
                      name="mothers_name"
                      required
                      placeholder="Enter mother's name"
                      value={formData.mothers_name}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none ${
                        isFieldMissing('mothers_name') ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 focus:border-[#C8963E]'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {lang === 'bn' ? 'মাতার পেশা (Occupation) *' : "Mother's Occupation (mothers_occupation) *"}
                    </label>
                    <input
                      type="text"
                      name="mothers_occupation"
                      required
                      placeholder="e.g. Teacher / Homemaker"
                      value={formData.mothers_occupation}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none ${
                        isFieldMissing('mothers_occupation') ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 focus:border-[#C8963E]'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {lang === 'bn' ? 'মাতার ফোন (Phone) *' : "Mother's Phone (mothers_phone) *"}
                    </label>
                    <input
                      type="tel"
                      name="mothers_phone"
                      required
                      placeholder="01722222222"
                      value={formData.mothers_phone}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none ${
                        isFieldMissing('mothers_phone') ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 focus:border-[#C8963E]'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {lang === 'bn' ? 'মাতার ইমেইল (Email) *' : "Mother's Email (mothers_email) *"}
                    </label>
                    <input
                      type="email"
                      name="mothers_email"
                      required
                      placeholder="mother@example.com"
                      value={formData.mothers_email}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none ${
                        isFieldMissing('mothers_email') ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 focus:border-[#C8963E]'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Remarks / Special Requests */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <FileText className="w-4 h-4 text-[#C8963E]" />
                <h2 className="text-base font-serif font-bold text-[#0A192F]">
                  {lang === 'bn' ? '৪. মন্তব্য ও শিডিউল অগ্রাধিকার (Remarks) *' : '4. Remarks & Preferred Schedule (remarks) *'}
                </h2>
              </div>

              <textarea
                name="remarks"
                rows={3}
                required
                placeholder="e.g. Interested in evening batch / Weekend preference"
                value={formData.remarks}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-800 focus:outline-none ${
                  isFieldMissing('remarks') ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 focus:border-[#C8963E]'
                }`}
              />
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
                    {lang === 'bn' ? 'মোট ক্লাস/লেকচার:' : 'Total Classes:'}
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
                  <span className="font-bold text-emerald-700">COL Executive Certified</span>
                </div>
              </div>

              {/* Direct API Endpoint Info */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#0A192F] font-bold">
                  <Info className="w-4 h-4 text-[#C8963E] shrink-0" />
                  <span>{lang === 'bn' ? 'সরাসরি ব্যাকএন্ড সাবমিশন' : 'Direct Backend Submission'}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {lang === 'bn'
                    ? 'সকল ফিল্ড পূরণ করার পর ফর্মটি সরাসরি Laravel /api/enquiries এপিআই-এ পাঠানো হবে।'
                    : 'Submits all required fields to Laravel /api/enquiries without auto-fill.'}
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
                    <span>{lang === 'bn' ? 'আবেদন জমা হচ্ছে...' : 'Submitting to API...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'ভর্তি আবেদন জমা দিন' : 'Submit Enquiry (POST /api/enquiries)'}</span>
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
            <p className="text-sm font-bold">Loading Admission Enquiry Form...</p>
          </div>
        </div>
      }
    >
      <EnrollNowContent />
    </Suspense>
  );
}
