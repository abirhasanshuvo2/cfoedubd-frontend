'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { COURSES, Course } from '@/data/cfo-data';
import { useCfo } from '@/context/CfoContext';
import { submitEnrollmentEnquiry } from '@/lib/enrollment-service';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Smartphone,
  CreditCard,
  Building,
  HelpCircle,
  Copy,
  Check,
  Award,
  Calendar,
  Clock,
  ArrowLeft,
  Building2
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

function generateReceiptId(gateway: string, dbId?: number | string): { studentId: string; trxId: string } {
  const ts = Date.now().toString().slice(-6);
  return {
    studentId: dbId ? `COL-${dbId}` : `COL-CFO-${ts}`,
    trxId: `TRX-${gateway.toUpperCase()}-${ts}99`,
  };
}

export default function EnrollmentCheckoutPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { lang, enrollInCourse, user, loginUser } = useCfo();

  const course = COURSES.find((c) => c.id === id || c.slug === id);

  if (!course) {
    notFound();
  }

  // Checkout State
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [fullName, setFullName] = useState(user?.name || 'মোহাম্মদ তানভীর আহমেদ');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '01894929000');
  const [emailAddress, setEmailAddress] = useState(user?.email || 'tanvir.finance@col.edu.bd');
  const [designation, setDesignation] = useState('Manager - Finance & Accounts');
  const [company, setCompany] = useState('Square Pharmaceuticals Ltd.');

  // Payment Option: Full or Installment
  const [paymentPlan, setPaymentPlan] = useState<'full' | 'installment'>('full');

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  // Payment Gateway State
  const [selectedGateway, setSelectedGateway] = useState<'bkash' | 'nagad' | 'card' | 'bank'>('bkash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bkashStep, setBkashStep] = useState<'phone' | 'otp' | 'pin'>('phone');
  const [bkashNumber, setBkashNumber] = useState('01894929000');
  const [bkashOtp, setBkashOtp] = useState('123456');
  const [bkashPin, setBkashPin] = useState('12345');

  // Confirmation Details
  const [studentId, setStudentId] = useState('');
  const [trxId, setTrxId] = useState('');
  const [isLiveBackend, setIsLiveBackend] = useState<boolean | null>(null);

  const discountFromPromo = appliedPromo === 'CFO2026' ? 2000 : 0;
  const basePrice = paymentPlan === 'installment' ? Math.round(course.price / 3) : course.price;
  const finalPayable = Math.max(0, basePrice - (paymentPlan === 'installment' ? 0 : discountFromPromo));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    if (promoCode.trim().toUpperCase() === 'CFO2026') {
      setAppliedPromo('CFO2026');
      setPromoError('');
    } else {
      setPromoError(lang === 'bn' ? 'অকার্যকর প্রোমোকোড। সঠিক কোড লিখুন (যেমন: CFO2026)।' : 'Invalid promo code. Use CFO2026.');
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber || !emailAddress) return;

    loginUser(fullName, phoneNumber, emailAddress);
    setStep('payment');
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      // POST to Laravel backend API: http://127.0.0.1:8000/api/enrollment/enroll-now
      const res = await submitEnrollmentEnquiry({
        name: fullName,
        email: emailAddress,
        phone: phoneNumber,
        subject: course.title || 'Chartered Financial Officer (CFO)',
        address: company ? `${company}, Dhaka` : 'Dhaka',
        remarks: `Enrolled via Checkout Page. Method: ${selectedGateway}, Plan: ${paymentPlan}`,
      });

      setIsLiveBackend(res.isLiveBackend ?? false);
      const receipt = generateReceiptId(selectedGateway, res.data?.id);
      setStudentId(receipt.studentId);
      setTrxId(receipt.trxId);
      enrollInCourse(course);
    } catch {
      setIsLiveBackend(false);
      const receipt = generateReceiptId(selectedGateway);
      setStudentId(receipt.studentId);
      setTrxId(receipt.trxId);
      enrollInCourse(course);
    } finally {
      setIsProcessing(false);
      setStep('success');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      {/* Breadcrumb / Top Bar */}
      <div className="bg-[#0A192F] border-b border-[#1E3A8A] text-xs py-2.5 px-4 sm:px-8 text-slate-400">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href={`/courses/${course.id}`}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'প্রোগ্রাম বিবরণে ফিরে যান' : 'Back to program details'}</span>
          </Link>
          <div className="flex items-center gap-2 text-[#E5A93C]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>বিটিইবি নিবন্ধিত ও ২৫৬-বিট এনক্রিপ্টেড পেমেন্ট পোর্টাল</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        {/* Step Indicator */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="flex items-center justify-between text-xs font-serif font-bold">
            <div className={`flex items-center gap-2 ${step === 'details' ? 'text-[#966718]' : 'text-slate-700'}`}>
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step === 'details'
                    ? 'bg-[#C8963E] text-slate-950 font-black'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                1
              </span>
              <span>{lang === 'bn' ? 'প্রার্থীর তথ্য' : 'Applicant Info'}</span>
            </div>

            <div className="flex-1 mx-4 h-0.5 bg-slate-200">
              <div
                className={`h-full bg-[#C8963E] transition-all ${
                  step === 'payment' ? 'w-1/2' : step === 'success' ? 'w-full' : 'w-0'
                }`}
              />
            </div>

            <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-[#966718]' : 'text-slate-700'}`}>
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step === 'payment'
                    ? 'bg-[#C8963E] text-slate-950 font-black'
                    : step === 'success'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                2
              </span>
              <span>{lang === 'bn' ? 'পেমেন্ট মেথড' : 'Payment'}</span>
            </div>

            <div className="flex-1 mx-4 h-0.5 bg-slate-200">
              <div
                className={`h-full bg-[#C8963E] transition-all ${step === 'success' ? 'w-full' : 'w-0'}`}
              />
            </div>

            <div className={`flex items-center gap-2 ${step === 'success' ? 'text-emerald-700 font-black' : 'text-slate-700'}`}>
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step === 'success' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                3
              </span>
              <span>{lang === 'bn' ? 'ভর্তি সম্পন্ন' : 'Enrolled'}</span>
            </div>
          </div>
        </div>

        {/* STEP 1: Student Information Form */}
        {step === 'details' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <div className="space-y-1 mb-6">
                <h2 className="text-xl font-serif font-black text-slate-900">
                  {lang === 'bn' ? 'এক্সিকিউটিভ প্রার্থীর তথ্য প্রদান করুন' : 'Executive Applicant Information'}
                </h2>
                <p className="text-xs text-slate-500">
                  {lang === 'bn'
                    ? 'আপনার কোর্স সনদপত্রে এই নাম ও তথ্য আনুষ্ঠানিকভাবে ব্যবহৃত হবে।'
                    : 'This information will be officially used for your course completion certificate.'}
                </p>
              </div>

              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'bn' ? 'পূর্ণ নাম (জাতীয় পরিচয়পত্র / সার্টিফিকেটের নাম)*' : 'Full Legal Name*'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Mohammad Tanvir Ahmed"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#C8963E] focus:ring-2 focus:ring-[#C8963E]/20 text-xs text-slate-900 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'মোবাইল নম্বর (হোয়াটসঅ্যাপ যুক্ত)*' : 'Mobile (WhatsApp Enabled)*'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="01894929000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#C8963E] focus:ring-2 focus:ring-[#C8963E]/20 text-xs text-slate-900 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'অফিশিয়াল ইমেইল অ্যাড্রেস*' : 'Email Address*'}
                    </label>
                    <input
                      type="email"
                      required
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="tanvir@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#C8963E] focus:ring-2 focus:ring-[#C8963E]/20 text-xs text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'বর্তমান পদবী (Designation)' : 'Designation'}
                    </label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. Head of Accounts / Senior Officer"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#C8963E] text-xs text-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'প্রতিষ্ঠান বা কোম্পানি (Organization)' : 'Organization'}
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Beximco / Square / Akij"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#C8963E] text-xs text-slate-900 outline-none"
                    />
                  </div>
                </div>

                {/* Installment vs Full Payment */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    {lang === 'bn' ? 'পেমেন্ট অপশন নির্বাচন করুন' : 'Select Tuition Payment Plan'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentPlan('full')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        paymentPlan === 'full'
                          ? 'border-[#C8963E] bg-amber-50/50 ring-1 ring-[#C8963E]'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">এককালীন পরিশোধ (Full Pay)</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                          সেরা অফার
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        ৳{course.price.toLocaleString()} (প্রোমোকোড প্রযোজ্য)
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentPlan('installment')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        paymentPlan === 'installment'
                          ? 'border-[#C8963E] bg-amber-50/50 ring-1 ring-[#C8963E]'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">সেমিস্টার কিস্তি (৩টি কিস্তি)</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                          সহজ কিস্তি
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        প্রথম কিস্তি: ৳{Math.round(course.price / 3).toLocaleString()}
                      </p>
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 font-serif font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{lang === 'bn' ? 'পরবর্তী ধাপ: পেমেন্ট অপশন নির্বাচন করুন' : 'Proceed to Payment Gateway'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Course Summary Card (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <span className="text-[11px] font-bold text-[#C8963E] uppercase tracking-wider block">
                Executive Admission Summary
              </span>

              <div className="space-y-1">
                <h3 className="text-base font-serif font-bold text-slate-900 leading-snug">
                  {lang === 'bn' ? course.title : course.titleEn}
                </h3>
                <p className="text-xs text-slate-500">{course.batchNumber}</p>
              </div>

              <div className="space-y-2 py-3 border-y border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>ক্লাস ওরিয়েন্টেশন:</span>
                  <span className="font-bold text-slate-900">{course.startDate}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>ক্লাসের সময়:</span>
                  <span className="font-bold text-slate-900">{course.schedule}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>ক্যাম্পাস:</span>
                  <span className="font-bold text-[#C8963E]">মতিঝিল সিটি সেন্টার / হাইব্রিড</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>স্বীকৃতি:</span>
                  <span className="font-bold text-emerald-600">COL Executive Certificate</span>
                </div>
              </div>

              {/* Promo Form */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  প্রোমোকোড ব্যবহার করুন (Use: <span className="text-[#C8963E] font-mono">CFO2026</span>)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="e.g. CFO2026"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold uppercase outline-none focus:border-[#C8963E]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#0A192F] text-[#E5A93C] font-serif font-bold text-xs cursor-pointer hover:bg-[#1E3A8A]"
                  >
                    প্রয়োগ করুন
                  </button>
                </div>
                {appliedPromo && (
                  <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    প্রোমোকোড প্রয়োগ হয়েছে! ৳২,০০০ ছাড় যোগ হয়েছে।
                  </p>
                )}
                {promoError && <p className="text-xs text-rose-500 font-semibold">{promoError}</p>}
              </form>

              {/* Fee Breakdown */}
              <div className="space-y-1.5 pt-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>রেগুলার ফি:</span>
                  <span className="line-through text-slate-400">৳{course.originalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>অফার ফি:</span>
                  <span className="font-bold text-slate-900">৳{course.price.toLocaleString()}</span>
                </div>
                {paymentPlan === 'installment' && (
                  <div className="flex justify-between text-blue-600 font-bold">
                    <span>১ম সেমিস্টার কিস্তি:</span>
                    <span>৳{Math.round(course.price / 3).toLocaleString()}</span>
                  </div>
                )}
                {appliedPromo && paymentPlan === 'full' && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>কুপন ছাড় (CFO2026):</span>
                    <span>- ৳{discountFromPromo.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-serif font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>মোট প্রদেয় টাকা:</span>
                  <span className="text-lg text-[#966718]">৳{finalPayable.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Payment Gateway Selection & Direct bKash Sim */}
        {step === 'payment' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-serif font-black text-slate-900">
                  {lang === 'bn' ? 'পেমেন্ট মেথড নির্বাচন করুন' : 'Select Payment Channel'}
                </h2>
                <p className="text-xs text-slate-500">
                  মোট প্রদেয়: <strong className="text-[#966718] font-bold">৳{finalPayable.toLocaleString()}</strong>
                </p>
              </div>
              <button
                onClick={() => setStep('details')}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                তথ্য পরিবর্তন
              </button>
            </div>

            {/* Gateway Selection Cards */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedGateway('bkash')}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedGateway === 'bkash'
                    ? 'border-[#E2136E] bg-pink-50 ring-2 ring-[#E2136E]/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="text-base font-black text-[#E2136E]">bKash</span>
                <span className="text-[10px] text-slate-500 font-semibold">বিকাশ পেমেন্ট</span>
              </button>

              <button
                onClick={() => setSelectedGateway('nagad')}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedGateway === 'nagad'
                    ? 'border-[#F7931E] bg-orange-50 ring-2 ring-[#F7931E]/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="text-base font-black text-[#F7931E]">Nagad</span>
                <span className="text-[10px] text-slate-500 font-semibold">নগদ পেমেন্ট</span>
              </button>

              <button
                onClick={() => setSelectedGateway('card')}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedGateway === 'card'
                    ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="text-[10px] text-slate-500 font-semibold">কার্ড / নেট ব্যাংকিং</span>
              </button>
            </div>

            {/* bKash Simulated Gateway Box */}
            {selectedGateway === 'bkash' && (
              <div className="rounded-2xl bg-[#E2136E] text-white p-5 space-y-4 shadow-md">
                <div className="flex items-center justify-between border-b border-pink-400/40 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black tracking-tight">bKash</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">Payment Checkout</span>
                  </div>
                  <span className="text-xs font-bold text-pink-100">Merchant: CHARTERED_OFFICER_LTD</span>
                </div>

                {bkashStep === 'phone' && (
                  <div className="space-y-3">
                    <p className="text-xs text-pink-100">আপনার বিকাশ অ্যাকাউন্ট নম্বর প্রদান করুন:</p>
                    <input
                      type="tel"
                      value={bkashNumber}
                      onChange={(e) => setBkashNumber(e.target.value)}
                      placeholder="e.g. 01894929000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white text-slate-900 text-sm font-mono font-bold outline-none"
                    />
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-pink-100">প্রদেয় টাকা: ৳{finalPayable.toLocaleString()}</span>
                      <button
                        type="button"
                        onClick={() => setBkashStep('otp')}
                        className="px-4 py-2 rounded-lg bg-white text-[#E2136E] font-black text-xs cursor-pointer shadow-xs"
                      >
                        কনফার্ম করুন →
                      </button>
                    </div>
                  </div>
                )}

                {bkashStep === 'otp' && (
                  <div className="space-y-3">
                    <p className="text-xs text-pink-100">
                      ভেরিফিকেশন কোড (OTP) প্রদান করুন (সিমুলেশন কোড: 123456):
                    </p>
                    <input
                      type="text"
                      value={bkashOtp}
                      onChange={(e) => setBkashOtp(e.target.value)}
                      placeholder="6 digit OTP"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white text-slate-900 text-center text-sm font-mono font-bold tracking-widest outline-none"
                    />
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setBkashStep('phone')}
                        className="text-pink-200 underline text-xs cursor-pointer"
                      >
                        নম্বর পরিবর্তন
                      </button>
                      <button
                        type="button"
                        onClick={() => setBkashStep('pin')}
                        className="px-4 py-2 rounded-lg bg-white text-[#E2136E] font-black text-xs cursor-pointer shadow-xs"
                      >
                        ওটিপি নিশ্চিত করুন →
                      </button>
                    </div>
                  </div>
                )}

                {bkashStep === 'pin' && (
                  <div className="space-y-3">
                    <p className="text-xs text-pink-100">
                      আপনার বিকাশ পিন নম্বর প্রবেশ করান (সুরক্ষিত সিমুলেশন):
                    </p>
                    <input
                      type="password"
                      value={bkashPin}
                      onChange={(e) => setBkashPin(e.target.value)}
                      placeholder="•••••"
                      maxLength={5}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white text-slate-900 text-center text-lg font-mono font-bold tracking-widest outline-none"
                    />
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setBkashStep('otp')}
                        className="text-pink-200 underline text-xs cursor-pointer"
                      >
                        পেছনে যান
                      </button>
                      <span className="text-[11px] text-pink-200">নিরাপদ ডিরেক্ট পিআইএন</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Pay Now Button */}
            <button
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 font-serif font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  পেমেন্ট প্রসেসিং হচ্ছে...
                </span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>৳{finalPayable.toLocaleString()} পরিশোধ ও ভর্তি নিশ্চিত করুন</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 3: Successful Enrollment Screen */}
        {step === 'success' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                অভিনন্দন! আপনার ভর্তি ও রেজিস্ট্রেশন সফল হয়েছে
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-950">
                Welcome to Chartered Officer Limited!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                <strong className="text-slate-900">{fullName}</strong>, আপনাকে{' '}
                <span className="font-bold text-[#966718]">{course.title}</span> প্রোগ্রামের{' '}
                <span className="font-bold text-slate-900">{course.batchNumber}</span>-এ স্বাগতম।
              </p>
            </div>

            {/* Generated Credentials Badge */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-sans font-semibold">স্টুডেন্ট আইডি (COL ID):</span>
                <span className="font-black text-slate-900 text-sm">{studentId}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-sans font-semibold">ট্রানজেকশন নম্বর (TrxID):</span>
                <span className="font-bold text-emerald-700">{trxId}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-sans font-semibold">পরিশোধিত অর্থ:</span>
                <span className="font-black text-slate-900">৳{finalPayable.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans font-semibold">ক্লাস শুরু ও ওরিয়েন্টেশন:</span>
                <span className="font-sans font-bold text-slate-800">{course.startDate} • {course.schedule}</span>
              </div>
            </div>

            {/* Next Steps CTA buttons */}
            <div className="space-y-3 pt-2">
              <a
                href="https://chat.whatsapp.com/demo-col-batch"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-serif font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>ব্যাচের অফিশিয়াল এক্সিকিউটিভ হোয়াটসঅ্যাপ গ্রুপে যুক্ত হোন</span>
              </a>

              <Link
                href="/classroom"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] text-slate-950 font-serif font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>আমার স্টুডেন্ট পোর্টাল ও ক্লাসরুমে যান</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer lang={lang} />
    </div>
  );
}
