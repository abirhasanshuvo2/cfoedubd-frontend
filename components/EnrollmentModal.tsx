'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Tag,
  CreditCard,
  Phone,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  Smartphone,
  Copy,
  ExternalLink,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Course } from '@/data/cfo-data';
import { submitEnrollmentEnquiry } from '@/lib/enrollment-service';

interface EnrollmentModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  lang: 'bn' | 'en';
  onEnrollmentSuccess: (course: Course) => void;
}

export default function EnrollmentModal({
  course,
  isOpen,
  onClose,
  lang,
  onEnrollmentSuccess,
}: EnrollmentModalProps) {
  const [step, setStep] = useState<'info' | 'payment' | 'bkash-pin' | 'success'>('info');
  const [fullName, setFullName] = useState('আবির হাসান');
  const [phone, setPhone] = useState('01711223344');
  const [email, setEmail] = useState('abirhasan7891998@gmail.com');
  const [promoCode, setPromoCode] = useState('CFO2026');
  const [appliedDiscount, setAppliedDiscount] = useState(1000);
  const [promoApplied, setPromoApplied] = useState(true);
  const [promoError, setPromoError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'card'>('bkash');
  const [bkashPin, setBkashPin] = useState('••••');
  const [isProcessing, setIsProcessing] = useState(false);
  const [invoiceId] = useState(() => `CFO-842910`);
  const [studentId, setStudentId] = useState(() => `CFO-784201`);
  const [isLiveBackend, setIsLiveBackend] = useState<boolean | null>(null);

  if (!isOpen || !course) return null;

  const finalPrice = Math.max(0, course.price - appliedDiscount);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'CFO2026' || promoCode.trim().toUpperCase() === 'CFOEDU') {
      setAppliedDiscount(1000);
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError(lang === 'bn' ? 'ভুল প্রোমোকোড। CFO2026 ট্রাই করুন' : 'Invalid code. Try CFO2026');
      setPromoApplied(false);
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email) return;
    setStep('payment');
  };

  const handleStartGateway = () => {
    if (paymentMethod === 'bkash') {
      setStep('bkash-pin');
    } else {
      finalizePayment();
    }
  };

  const finalizePayment = async () => {
    setIsProcessing(true);
    try {
      // POST to Laravel backend API: http://127.0.0.1:8000/api/enrollment/enroll-now
      const res = await submitEnrollmentEnquiry({
        name: fullName,
        email: email,
        phone: phone,
        subject: course.title || 'Chartered Financial Officer (CFO)',
        address: 'Dhaka',
        remarks: `Enrolled via Website Modal. Method: ${paymentMethod}`,
      });
      setIsLiveBackend(res.isLiveBackend ?? false);
      if (res.data?.id) {
        setStudentId(`COL-${res.data.id}`);
      }
    } catch {
      setIsLiveBackend(false);
    } finally {
      setIsProcessing(false);
      setStep('success');
      onEnrollmentSuccess(course);

      // Trigger celebratory confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFC000', '#E11D48', '#10B981', '#3B82F6'],
      });
    }
  };

  const resetAndClose = () => {
    setStep('info');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Modal Top Bar */}
        <div className="bg-[#0A192F] text-white p-5 flex items-center justify-between border-b border-[#1E3A8A]">
          <div>
            <span className="text-[11px] font-bold text-[#E5A93C] uppercase tracking-wider">
              {lang === 'bn' ? 'সিএফও এক্সিকিউটিভ ব্যাচ এনরোলমেন্ট' : 'CFO Executive Cohort Enrollment'}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-xs sm:max-w-sm mt-0.5">
              {lang === 'bn' ? course.title : course.titleEn}
            </h3>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Student Details */}
        {step === 'info' && (
          <form onSubmit={handleProceedToPayment} className="p-6 space-y-5">
            {/* Cohort Summary Snippet */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900">{course.batchNumber} • {course.categoryLabel}</p>
                <p className="text-slate-600">{lang === 'bn' ? course.schedule : course.scheduleEn}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-slate-950">৳{course.price.toLocaleString()}</p>
                <p className="text-[10px] text-emerald-600 font-semibold">{lang === 'bn' ? 'ভর্তি চলছে' : 'Enrolling'}</p>
              </div>
            </div>

            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {lang === 'bn' ? 'শিক্ষার্থীর প্রয়োজনীয় তথ্য' : 'Student Information'}
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Abir Hasan"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'মোবাইল নম্বর (হোয়াটসঅ্যাপ সাপোর্ট পাবে)' : 'Phone Number (For WhatsApp Group)'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'ইমেইল অ্যাড্রেস (LMS লগইন credentials যাবে)' : 'Email Address (For LMS Credentials)'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'প্রোমোকোড বা কুপন (Coupon)' : 'Promo Code'}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="CFO2026"
                    className="w-full pl-9 pr-3 py-2 text-sm font-mono uppercase rounded-lg border border-slate-300 focus:border-amber-400 outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {lang === 'bn' ? 'প্রয়োগ করুন' : 'Apply'}
                </button>
              </div>
              {promoApplied && (
                <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {lang === 'bn' ? '১,০০০৳ ছাড় যুক্ত হয়েছে!' : '৳1,000 discount applied!'}
                </p>
              )}
              {promoError && <p className="text-xs text-rose-500 mt-1">{promoError}</p>}
            </div>

            {/* Summary Price */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">{lang === 'bn' ? 'মোট প্রদেয় ফি' : 'Total Payable'}</p>
                <p className="text-2xl font-black text-slate-950">৳{finalPrice.toLocaleString()}</p>
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#FFC000] hover:bg-[#ffb000] text-slate-950 font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{lang === 'bn' ? 'পরবর্তী ধাপ' : 'Next Step'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Payment Method Choice */}
        {step === 'payment' && (
          <div className="p-6 space-y-6">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-950">
                {lang === 'bn' ? 'পেমেন্ট মাধ্যম নির্বাচন করুন' : 'Select Payment Method'}
              </h4>
              <p className="text-xs text-slate-600">
                {lang === 'bn'
                  ? 'নিরাপদ গেটওয়ের মাধ্যমে সাথে সাথে ইনস্ট্যান্ট কনফার্মেশন পাবেন।'
                  : 'Secured with 256-bit SSL encryption. Instant enrollment verification.'}
              </p>
            </div>

            {/* Payment Options */}
            <div className="space-y-2.5">
              {/* bKash */}
              <div
                onClick={() => setPaymentMethod('bkash')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'bkash'
                    ? 'border-pink-600 bg-pink-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E2136E] text-white font-black text-xs flex items-center justify-center">
                    bKash
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">বিকাশ (bKash Direct Gateway)</p>
                    <p className="text-xs text-slate-600">01711-XXXXXX ও ইনস্ট্যান্ট ভেরিফিকেশন</p>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'bkash' ? 'border-pink-600' : 'border-slate-300'
                  }`}
                >
                  {paymentMethod === 'bkash' && <div className="w-2 h-2 rounded-full bg-pink-600" />}
                </div>
              </div>

              {/* Nagad */}
              <div
                onClick={() => setPaymentMethod('nagad')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'nagad'
                    ? 'border-orange-600 bg-orange-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F7931E] text-white font-black text-xs flex items-center justify-center">
                    নগদ
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">নগদ (Nagad Digital Payment)</p>
                    <p className="text-xs text-slate-600">নগদ অ্যাকাউন্ট পেমেন্ট</p>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'nagad' ? 'border-orange-600' : 'border-slate-300'
                  }`}
                >
                  {paymentMethod === 'nagad' && <div className="w-2 h-2 rounded-full bg-orange-600" />}
                </div>
              </div>

              {/* Cards / NetBanking */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'card'
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Visa / Mastercard / AMEX</p>
                    <p className="text-xs text-slate-600">যেকোনো বাংলাদেশি বা আন্তর্জাতিক কার্ড</p>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'card' ? 'border-slate-900' : 'border-slate-300'
                  }`}
                >
                  {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-slate-900" />}
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>কোর্স ফি:</span>
                <span>৳{course.price.toLocaleString()}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>কুপন ডিসকাউন্ট (CFO2026):</span>
                  <span>-৳{appliedDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-1.5 border-t border-slate-200 flex justify-between text-sm font-black text-slate-950">
                <span>সর্বমোট পরিশোধযোগ্য:</span>
                <span>৳{finalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('info')}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                {lang === 'bn' ? 'পেছনে যান' : 'Back'}
              </button>

              <button
                type="button"
                onClick={handleStartGateway}
                className="flex-1 py-3 px-4 rounded-xl bg-[#C8963E] hover:bg-[#b5832d] text-slate-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{lang === 'bn' ? `৳${finalPrice.toLocaleString()} পে করুন` : `Pay ৳${finalPrice.toLocaleString()}`}</span>
                <Lock className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2.5: Interactive bKash Payment Simulation UI */}
        {step === 'bkash-pin' && (
          <div className="p-6 space-y-5 bg-gradient-to-b from-pink-50/50 to-white">
            <div className="p-4 rounded-xl bg-[#E2136E] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-white text-[#E2136E] font-black text-xs flex items-center justify-center">
                  bKash
                </div>
                <div>
                  <p className="text-xs font-bold">CFO Edu BD / Chartered Officer Merchant</p>
                  <p className="text-[10px] text-pink-100">Invoice: {invoiceId}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-pink-100 font-medium">Amount</p>
                <p className="text-base font-black font-mono">৳{finalPrice.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600 text-center">
                Enter your bKash Mobile Account Number to authorize payment:
              </p>
              <input
                type="text"
                readOnly
                value={phone}
                className="w-full text-center py-2.5 px-3 rounded-lg bg-slate-100 border border-slate-300 font-mono text-sm font-bold text-slate-800"
              />

              <p className="text-xs text-slate-600 text-center pt-1">
                Enter 5-digit secret PIN (Simulator):
              </p>
              <input
                type="password"
                maxLength={5}
                value={bkashPin}
                onChange={(e) => setBkashPin(e.target.value)}
                placeholder="12345"
                className="w-full text-center py-2.5 px-3 tracking-widest text-lg rounded-lg border border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none font-mono font-bold"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('payment')}
                className="w-1/3 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={finalizePayment}
                className="w-2/3 py-2.5 rounded-lg bg-[#E2136E] hover:bg-[#c90f5f] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>ভেরিফাই হচ্ছে...</span>
                ) : (
                  <span>কনফার্ম করুন (Confirm Payment)</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success Confirmation State */}
        {step === 'success' && (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                {lang === 'bn' ? 'অভিনন্দন! আপনার ভর্তি সম্পন্ন হয়েছে' : 'Enrollment Successful!'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                {lang === 'bn' ? 'স্বাগতম চার্টার্ড অফিসার ও সিএফও লার্নিং কমিউনিটিতে' : 'Welcome to CFO Executive Cohort!'}
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                {lang === 'bn'
                  ? `আপনার এনরোলমেন্ট আইডি: ${studentId}। সব তথ্য আপনার ইমেইলে পাঠিয়ে দেওয়া হয়েছে।`
                  : `Your Student ID: ${studentId}. Login details have been sent to your email.`}
              </p>
            </div>

            {/* Batch WhatsApp Group Join Card */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-left flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-emerald-900">
                  {lang === 'bn' ? 'অফিশিয়াল ব্যাচ হোয়াটসঅ্যাপ গ্রুপ' : 'Official WhatsApp Batch Group'}
                </p>
                <p className="text-[11px] text-emerald-700">
                  {lang === 'bn' ? 'ক্লাস লিংক ও মেন্টরদের সাথে সরাসরি কানেক্টেড থাকতে এখনই জয়েন করুন।' : 'Join to get class links & daily updates directly from mentors.'}
                </p>
              </div>
              <button
                onClick={() => alert(lang === 'bn' ? 'হোয়াটসঅ্যাপ গ্রুপ ইনভাইট লিংক কপি করা হয়েছে!' : 'WhatsApp invite link copied!')}
                className="px-3 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs shrink-0 hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                {lang === 'bn' ? 'জয়েন করুন' : 'Join Group'}
              </button>
            </div>

            {/* LMS Access Button */}
            <button
              onClick={resetAndClose}
              className="w-full py-3 rounded-xl bg-[#FFC000] hover:bg-[#ffb000] text-slate-950 font-black text-sm shadow-md transition-all cursor-pointer"
            >
              {lang === 'bn' ? 'আমার ক্লাসরুমে যান (Go to My Classroom)' : 'Go to My Classroom'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
