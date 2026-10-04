'use client';

import React from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Youtube,
  Linkedin,
  Instagram,
  Globe,
  MessageCircle,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { useCfo } from '@/context/CfoContext';

interface FooterProps {
  lang?: 'bn' | 'en';
}

export default function Footer({ lang: propLang }: FooterProps = {}) {
  const { systemInfo, lang: contextLang } = useCfo();
  const lang = propLang || contextLang || 'bn';

  return (
    <footer className="bg-[#FAF8F5] dark:bg-[#071324] text-slate-800 dark:text-slate-200 pt-16 pb-10 border-t border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid (Exactly matching the design) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14">
          
          {/* Col 1: Brand & Community Socials (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0A192F] via-[#0D254C] to-[#1E3A8A] flex items-center justify-center shadow-md border border-[#C8963E]/60 group-hover:scale-105 transition-transform shrink-0">
                <span className="font-serif font-black text-sm text-[#FFC000] tracking-tight">
                  COL
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-serif font-black tracking-tight text-slate-950 dark:text-white leading-none">
                  {systemInfo.name || 'Chartered Officer'}
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm">
              {lang === 'bn'
                ? 'অনলাইন লাইভ স্কিল ডেভেলপমেন্ট ও প্রফেশনাল এক্সিকিউটিভ লার্নিং প্ল্যাটফর্ম।'
                : 'Online Live Skill Development & Professional Executive Learning Platform.'}
            </p>

            {/* Stay connected with the community */}
            <div className="pt-2 space-y-2.5">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {lang === 'bn' ? 'কমিউনিটির সাথে যুক্ত থাকুন' : 'Stay connected with the community'}
              </p>
              
              <div className="flex items-center gap-2.5">
                {/* Facebook */}
                <a
                  href={systemInfo.facebook || 'https://facebook.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#1877F2] hover:opacity-90 text-white flex items-center justify-center transition-transform hover:scale-105 shadow-xs"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4 fill-white" />
                </a>

                {/* Instagram */}
                <a
                  href={systemInfo.instagram || 'https://instagram.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] hover:opacity-90 text-white flex items-center justify-center transition-transform hover:scale-105 shadow-xs"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                {/* YouTube */}
                <a
                  href={systemInfo.youtube || 'https://youtube.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#FF0000] hover:opacity-90 text-white flex items-center justify-center transition-transform hover:scale-105 shadow-xs"
                  aria-label="YouTube"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4 fill-white" />
                </a>

                {/* LinkedIn */}
                <a
                  href={systemInfo.linked_in || 'https://linkedin.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#0A66C2] hover:opacity-90 text-white flex items-center justify-center transition-transform hover:scale-105 shadow-xs"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4 fill-white" />
                </a>

                {/* WhatsApp (if present) */}
                {((systemInfo as any).whatsapp_no || (systemInfo as any).whatsapp || systemInfo.mobile || systemInfo.phone) && (
                  <a
                    href={`https://wa.me/${String((systemInfo as any).whatsapp_no || (systemInfo as any).whatsapp || systemInfo.mobile || systemInfo.phone).replace(/[^\d+]/g, '').replace(/^\+/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#25D366] hover:opacity-90 text-white flex items-center justify-center transition-transform hover:scale-105 shadow-xs"
                    aria-label="WhatsApp"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Col 2: Quick Link (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              {lang === 'bn' ? 'কুইক লিংক' : 'Quick Link'}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li>
                <Link href="/courses" className="hover:text-[#C8963E] transition-colors block">
                  {lang === 'bn' ? 'আপকামিং লাইভ ব্যাচ' : 'Upcoming Live Batch'}
                </Link>
              </li>
              <li>
                <Link href="/courses?category=all" className="hover:text-[#C8963E] transition-colors block">
                  {lang === 'bn' ? 'ফ্রি রিসোর্স ও কোর্স' : 'Free Courses'}
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-[#C8963E] transition-colors block">
                  {lang === 'bn' ? 'লাইভ ওয়ার্কশপ' : 'Live Workshop'}
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="hover:text-[#C8963E] transition-colors block">
                  {lang === 'bn' ? 'সনদ যাচাই (Certificates)' : 'Verify Certificate'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contacts (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              {lang === 'bn' ? 'যোগাযোগ' : 'Contacts'}
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {/* Email */}
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-slate-800 dark:text-slate-200 shrink-0 mt-0.5" />
                <a
                  href={`mailto:${systemInfo.email || 'cfoedubd@gmail.com'}`}
                  className="hover:text-[#C8963E] transition-colors font-medium break-all"
                >
                  {systemInfo.email || 'cfoedubd@gmail.com'}
                </a>
              </div>

              {/* Phone / Hotline */}
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-slate-800 dark:text-slate-200 shrink-0 mt-0.5" />
                <a
                  href={`tel:${(systemInfo.mobile || systemInfo.phone || '+8801713378787').replace(/\s+/g, '')}`}
                  className="hover:text-[#C8963E] transition-colors font-mono font-medium"
                >
                  {systemInfo.phone || '+880 1713378787'}
                  {systemInfo.mobile && systemInfo.mobile !== systemInfo.phone && ` / ${systemInfo.mobile}`}
                </a>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-800 dark:text-slate-200 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {systemInfo.address || 'সিটি সেন্টার (লেভেল-২৫), মতিঝিল বাণিজ্যিক এলাকা, ঢাকা-১০০০, বাংলাদেশ'}
                </span>
              </div>
            </div>
          </div>

          {/* Col 4: Company (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              {lang === 'bn' ? 'কোম্পানি' : 'Company'}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li>
                <Link href="/about" className="hover:text-[#C8963E] transition-colors block">
                  {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link href="/media-news" className="hover:text-[#C8963E] transition-colors block">
                  {lang === 'bn' ? 'সংবাদ ও মিডিয়া' : 'Media & News'}
                </Link>
              </li>
              <li>
                <Link href="/about#refund-policy" className="hover:text-[#C8963E] transition-colors block">
                  {lang === 'bn' ? 'রিফান্ড পলিসি' : 'Refund Policy'}
                </Link>
              </li>
              <li>
                <Link href="/about#privacy-policy" className="hover:text-[#C8963E] transition-colors block">
                  {lang === 'bn' ? 'প্রাইভেসি পলিসি' : 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link href="/about#terms-conditions" className="hover:text-[#C8963E] transition-colors block">
                  {lang === 'bn' ? 'টার্মস অ্যান্ড কন্ডিশনস' : 'Terms And Conditions'}
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Horizontal Payment Strip (Only the 5 requested gateways) */}
        <div className="pt-6 border-t border-slate-200/90 dark:border-slate-800 space-y-5">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 shrink-0">
              Pay With
            </span>

            {/* 1. VISA */}
            <div className="w-14 h-9 sm:w-16 sm:h-10 rounded-lg bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center p-1 hover:border-slate-300 transition-colors">
              <span className="font-sans font-black text-sm sm:text-base tracking-tighter text-[#1A1F71] italic">
                VISA
              </span>
            </div>

            {/* 2. Mastercard */}
            <div className="w-14 h-9 sm:w-16 sm:h-10 rounded-lg bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center p-1 hover:border-slate-300 transition-colors">
              <div className="relative flex items-center justify-center w-8 h-6">
                <div className="w-5 h-5 rounded-full bg-[#EB001B]" />
                <div className="w-5 h-5 rounded-full bg-[#F79E1B] -ml-2.5 mix-blend-multiply opacity-95" />
              </div>
            </div>

            {/* 3. bKash */}
            <div className="w-14 h-9 sm:w-16 sm:h-10 rounded-lg bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center p-1 hover:border-slate-300 transition-colors">
              <div className="flex items-center tracking-tight">
                <span className="font-serif font-black text-base sm:text-lg text-[#E2136E] leading-none">b</span>
                <span className="font-sans font-bold text-xs sm:text-sm text-slate-900 leading-none">Kash</span>
              </div>
            </div>

            {/* 4. Nagad */}
            <div className="w-14 h-9 sm:w-16 sm:h-10 rounded-lg bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center gap-1 p-1 hover:border-slate-300 transition-colors">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-[#F7931E] border-t-red-600 border-r-red-600 flex items-center justify-center shrink-0">
                <div className="w-1 h-1 rounded-full bg-red-600" />
              </div>
              <span className="font-bold text-xs sm:text-sm text-[#ED1C24] leading-none">
                নগদ
              </span>
            </div>

            {/* 5. Rocket */}
            <div className="w-14 h-9 sm:w-16 sm:h-10 rounded-lg bg-[#8C3494] border border-[#75267D] shadow-2xs flex flex-col items-center justify-center p-0.5 text-white hover:opacity-95 transition-opacity">
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 fill-white shrink-0 rotate-12" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[6px] font-bold tracking-wider uppercase opacity-90">ROCKET</span>
                  <span className="text-[9px] font-black leading-tight">রকেট</span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright & Meta */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <p>
              © {new Date().getFullYear()} {systemInfo.name || 'Chartered Officer'}. All rights reserved. cfoedubd.com
            </p>
            <div className="flex items-center gap-4 text-xs">
              <Link href="/about" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                {lang === 'bn' ? 'পরিচিতি' : 'About'}
              </Link>
              <Link href="/courses" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                {lang === 'bn' ? 'কোর্সসমূহ' : 'Courses'}
              </Link>
              <Link href="/contact" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                {lang === 'bn' ? 'যোগাযোগ' : 'Contact'}
              </Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
