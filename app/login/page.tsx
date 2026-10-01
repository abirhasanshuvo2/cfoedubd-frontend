'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCfo } from '@/context/CfoContext';
import {
  Phone,
  Lock,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Mail,
  Sparkles,
  ArrowLeft,
  Building2,
  GraduationCap
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { lang, loginUser, loginAsDemo, user, logoutUser } = useCfo();

  const [phoneOrEmail, setPhoneOrEmail] = useState('01894929000');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState('1234');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      loginUser('মোহাম্মদ তানভীর আহমেদ, এফসিএ', phoneOrEmail, 'tanvir.finance@col.edu.bd');
      router.push('/');
    }, 500);
  };

  const handleQuickDemo = () => {
    loginAsDemo();
    router.push('/');
  };

  const handleQuickGoogle = () => {
    loginUser('মোহাম্মদ তানভীর আহমেদ, এফসিএ', '01894929000', 'tanvir.cfo@col.edu.bd');
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-[#0A192F] text-white p-6 border-b border-[#1E3A8A] text-center space-y-2 relative">
            <Link
              href="/"
              className="absolute left-4 top-4 p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-colors"
              title="হোমপেজে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C8963E] to-[#B8860B] text-[#0A192F] font-serif font-black flex items-center justify-center text-xl mx-auto shadow-md border border-[#C8963E]">
              COL
            </div>
            <h2 className="text-xl font-serif font-black text-white">
              {lang === 'bn' ? 'এক্সিকিউটিভ অ্যাকাউন্টে প্রবেশ' : 'Sign in to COL Portal'}
            </h2>
            <p className="text-xs text-slate-300">
              {lang === 'bn'
                ? 'সিএফও লাইভ সেশন, লার্নিং ম্যাটেরিয়াল ও স্টুডেন্ট পোর্টাল অ্যাক্সেস করুন'
                : 'Access your executive sessions, learning portal, and student resources'}
            </p>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {user ? (
              <div className="space-y-4 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase font-mono">
                    সক্রিয় সেশন (Active Session)
                  </span>
                  <h3 className="text-xl font-serif font-black text-slate-900 mt-2">{user.name}</h3>
                  <p className="text-xs font-mono text-slate-600">{user.phone || user.email}</p>
                </div>

                <div className="pt-2 space-y-2.5">
                  <Link
                    href="/classroom"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 font-serif font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span>আমার এক্সিকিউটিভ ক্লাসরুমে যান</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center transition-colors"
                  >
                    ওয়েবসাইট ব্রাউজ করুন (হোমপেজ)
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 px-4 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs cursor-pointer transition-colors"
                  >
                    লগআউট করুন (Logout)
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* 1-Click Fast Demo Login */}
                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="w-full py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#966718] border border-amber-200 font-serif font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#C8963E]" />
                  <span>⚡ ১-ক্লিকে এক্সিকিউটিভ ডেমো লগইন করুন</span>
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-400 font-semibold">অথবা মোবাইল / ইমেইল দিয়ে</span>
                  </div>
                </div>

                {step === 'phone' ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {lang === 'bn' ? 'মোবাইল নম্বর অথবা প্রাতিষ্ঠানিক ইমেইল' : 'Mobile Number or Email'}
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={phoneOrEmail}
                          onChange={(e) => setPhoneOrEmail(e.target.value)}
                          placeholder="01894929000"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#C8963E] focus:ring-2 focus:ring-[#C8963E]/20 text-sm outline-none font-medium text-slate-900"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        একটি ৪ সংখ্যার ওটিপি কোড পাঠানো হবে (ডেমো কোড: ১২৩৪)
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 font-serif font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        'ওটিপি পাঠানো হচ্ছে...'
                      ) : (
                        <>
                          <span>{lang === 'bn' ? 'পরবর্তী ধাপে যান' : 'Continue'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="text-center space-y-1">
                      <p className="text-xs text-slate-500">
                        <strong className="text-slate-800">{phoneOrEmail}</strong> নম্বরে পাঠানো ৪ সংখ্যার কোড লিখুন:
                      </p>
                      <span className="text-[11px] text-[#966718] font-bold font-mono">(ডেমো ওটিপি কোড: 1234)</span>
                    </div>

                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="1234"
                      className="w-full py-3 text-center text-2xl tracking-[0.5em] font-mono font-black rounded-xl border border-slate-300 focus:border-[#C8963E] focus:ring-2 focus:ring-[#C8963E]/20 outline-none"
                    />

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C8963E] to-[#B8860B] hover:from-[#d4af37] hover:to-[#C8963E] text-slate-950 font-serif font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoading ? 'যাচাই করা হচ্ছে...' : 'লগইন নিশ্চিত করুন'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep('phone')}
                      className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                    >
                      ← নম্বর পরিবর্তন করুন
                    </button>
                  </form>
                )}

                <button
                  type="button"
                  onClick={handleQuickGoogle}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-rose-500" />
                  <span>গুগল দিয়ে প্রবেশ করুন (Google)</span>
                </button>

                <div className="text-center pt-2">
                  <Link
                    href="/"
                    className="text-xs font-bold text-[#966718] hover:text-[#C8963E] flex items-center justify-center gap-1"
                  >
                    <span>হোমপেজে ফিরে যান →</span>
                  </Link>
                </div>
              </div>
            )}

            <div className="pt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5 border-t border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>বিটিইবি ও আরজেএসসি নিবন্ধিত সুরক্ষিত পোর্টাল</span>
            </div>
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
