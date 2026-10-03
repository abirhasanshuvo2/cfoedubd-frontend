'use client';

import React from 'react';
import { Smartphone, Download, CheckCircle2, QrCode, Star, Bell, WifiOff } from 'lucide-react';

interface AppDownloadBannerProps {
  lang: 'bn' | 'en';
}

export default function AppDownloadBanner({ lang }: AppDownloadBannerProps) {
  return (
    <section className="py-14 bg-gradient-to-r from-amber-50/90 via-slate-50 to-amber-100/60 dark:from-[#0A192F] dark:via-[#0D254C] dark:to-[#1E3A8A] text-slate-900 dark:text-white overflow-hidden relative border-y border-amber-200 dark:border-[#C8963E]/30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-[#C8963E]/20 text-amber-900 dark:text-[#E5A93C] border border-amber-300 dark:border-[#C8963E]/40 text-xs font-bold shadow-xs">
              <Smartphone className="w-3.5 h-3.5 text-[#C8963E]" />
              <span>{lang === 'bn' ? 'সিএফও এক্সিকিউটিভ লার্নার পোর্টাল ও অ্যাপ' : 'CFO Executive Portal & Mobile App'}</span>
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              {lang === 'bn'
                ? 'যেকোনো জায়গা থেকে সুবিধামতো শিখুন সিএফও লার্নার পোর্টালে'
                : 'Learn on the Go with CFO Executive Portal'}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-xl">
              {lang === 'bn'
                ? 'বোর্ডরুম রেকর্ডেড লেকচার, লাইভ ক্লাস অ্যালার্ট, অফলাইনে স্টাডি ম্যাটেরিয়াল ডাউনলোড এবং সরাসরি ফোন থেকে অ্যাসাইনমেন্ট জমা দেওয়ার সব সুবিধা।'
                : 'Get instant live executive session alerts, download financial models for offline review, and track daily boardroom case assignments.'}
            </p>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <div className="flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-[#C8963E]" />
                <span>{lang === 'bn' ? 'অফলাইন ম্যাটেরিয়াল রিড' : 'Offline Case Access'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#C8963E]" />
                <span>{lang === 'bn' ? 'লাইভ সেশন রিমাইন্ডার' : 'Executive Reminders'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-[#C8963E] text-[#C8963E]" />
                <span>{lang === 'bn' ? '৪.৯★ রেটিং (৮৪০+ গ্র্যাজুয়েট)' : '4.9★ by 840+ CFO Alumni'}</span>
              </div>
            </div>

            {/* Store Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {/* Google Play */}
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 text-white flex items-center gap-3 transition-colors cursor-pointer shadow-md"
              >
                <div className="text-left">
                  <p className="text-[9px] uppercase font-semibold text-slate-300">GET IT ON</p>
                  <p className="text-xs font-bold">Google Play</p>
                </div>
              </a>

              {/* App Store */}
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 text-white flex items-center gap-3 transition-colors cursor-pointer shadow-md"
              >
                <div className="text-left">
                  <p className="text-[9px] uppercase font-semibold text-slate-300">Download on the</p>
                  <p className="text-xs font-bold">App Store</p>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: QR Code & Mobile Mockup Preview */}
          <div className="lg:col-span-4 flex items-center justify-center lg:justify-end">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xl border border-amber-300/80 dark:border-amber-400/40 flex items-center gap-4">
              <div className="w-24 h-24 bg-amber-50 dark:bg-slate-950 border border-amber-200/80 dark:border-slate-800 rounded-xl p-2 flex items-center justify-center shrink-0">
                <QrCode className="w-20 h-20 text-amber-700 dark:text-[#FFC000]" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Quick Scan
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {lang === 'bn' ? 'স্ক্যান করে অ্যাপ নিন' : 'Scan to Install'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Android & iOS devices
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
