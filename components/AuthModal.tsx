'use client';

import React, { useState } from 'react';
import { X, Phone, Lock, ArrowRight, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'bn' | 'en';
  onLoginSuccess: (name: string, phone: string) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  lang,
  onLoginSuccess,
}: AuthModalProps) {
  const [phoneOrEmail, setPhoneOrEmail] = useState('01711223344');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState('1234');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('আবির হাসান', phoneOrEmail);
      onClose();
      setStep('phone');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Top Header */}
        <div className="bg-[#0A192F] text-white p-6 flex items-center justify-between border-b border-[#1E3A8A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C8963E] text-slate-950 font-serif font-black flex items-center justify-center text-xs">
              CFO
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {lang === 'bn' ? 'সিএফও লার্নার অ্যাকাউন্টে প্রবেশ' : 'Login to CFO Edu BD'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'আপনার এক্সিকিউটিভ ড্যাশবোর্ড অ্যাক্সেস করুন' : 'Access your executive learning portal'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {lang === 'bn' ? 'মোবাইল নম্বর অথবা ইমেইল' : 'Mobile Number or Email'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#FFC000] hover:bg-[#ffb000] text-slate-950 font-black text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'ওটিপি পাঠানো হচ্ছে...' : 'ওটিপি কোড পাঠান (Continue)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs text-slate-400 uppercase">
                  <span className="bg-white px-2">অথবা</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onLoginSuccess('আবির হাসান', 'abirhasan7891998@gmail.com');
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="font-bold text-blue-600">G</span>
                <span>Continue with Google</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1 mb-2">
                <p className="text-xs text-slate-600">
                  {phoneOrEmail} নম্বরে ৪ ডিজিটের ভেরিফিকেশন কোড পাঠানো হয়েছে।
                </p>
                <span className="text-[11px] font-bold text-amber-600">ডেমো ওটিপি কোড: 1234</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 text-center mb-1.5">
                  ৪ ডিজিটের OTP কোড লিখুন:
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-center py-2.5 px-3 tracking-[0.5em] text-xl font-bold font-mono rounded-xl border border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#FFC000] hover:bg-[#ffb000] text-slate-950 font-black text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isLoading ? 'যাচাই করা হচ্ছে...' : 'লগইন নিশ্চিত করুন (Verify & Login)'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-center text-xs text-slate-500 hover:underline cursor-pointer"
              >
                ভুল নম্বর? নম্বর পরিবর্তন করুন
              </button>
            </form>
          )}

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>১০০% নিরাপদ ও সুরক্ষিত লগইন</span>
          </div>
        </div>
      </div>
    </div>
  );
}
