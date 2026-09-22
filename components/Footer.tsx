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
  ShieldCheck,
  Award,
  GraduationCap,
  Building2
} from 'lucide-react';
import { useCfo } from '@/context/CfoContext';

interface FooterProps {
  lang?: 'bn' | 'en';
}

export default function Footer({ lang: propLang }: FooterProps = {}) {
  const { systemInfo, lang: contextLang } = useCfo();
  const lang = propLang || contextLang || 'bn';

  return (
    <footer className="bg-[#0A192F] text-slate-300 pt-16 pb-12 border-t border-[#1E3A8A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand info & contact */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C8963E] to-[#B8860B] text-[#0A192F] font-serif font-black flex items-center justify-center text-lg shadow-md border border-[#E5A93C]/40">
                COL
              </div>
              <div>
                <span className="text-xl font-serif font-black tracking-tight text-white block">
                  {systemInfo.name || 'Chartered Officer'}<span className="text-[#E5A93C]">.</span>
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">
                  {systemInfo.motto || 'CFO Education Bangladesh'}
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              {systemInfo.description || (lang === 'bn'
                ? 'চার্টার্ড অফিসার লিমিটেড (COL) বাংলাদেশ কারিগরি শিক্ষা বোর্ড (BTEB) অনুমোদিত ও নিবন্ধিত করপোরেট ফিন্যান্স, ট্যাক্স ও সি-স্যুট এক্সিকিউটিভ লিডারশিপ প্রতিষ্ঠান।'
                : "Chartered Officer Limited is Bangladesh's premier executive finance institute affiliated with BTEB, shaping C-suite financial leaders and tax strategists.")}
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C8963E] shrink-0 mt-0.5" />
                <span>{systemInfo.address || 'সিটি সেন্টার (লেভেল-২৫), মতিঝিল বাণিজ্যিক এলাকা, ঢাকা-১০০০, বাংলাদেশ'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C8963E] shrink-0" />
                <a href={`tel:${(systemInfo.mobile || systemInfo.phone || '+8801713378787').replace(/\s+/g, '')}`} className="hover:text-white transition-colors font-mono">
                  হটলাইন: {systemInfo.phone || '+880 1713378787'}
                  {systemInfo.mobile && systemInfo.mobile !== systemInfo.phone && ` / ${systemInfo.mobile}`}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C8963E] shrink-0" />
                <a href={`mailto:${systemInfo.email || 'cfoedubd@gmail.com'}`} className="hover:text-white transition-colors">
                  {systemInfo.email || 'cfoedubd@gmail.com'}
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              {systemInfo.facebook && (
                <a
                  href={systemInfo.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#C8963E] text-slate-300 hover:text-slate-950 flex items-center justify-center transition-colors border border-slate-700"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {systemInfo.youtube && (
                <a
                  href={systemInfo.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#C8963E] text-slate-300 hover:text-slate-950 flex items-center justify-center transition-colors border border-slate-700"
                  aria-label="YouTube"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {systemInfo.linked_in && (
                <a
                  href={systemInfo.linked_in}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#C8963E] text-slate-300 hover:text-slate-950 flex items-center justify-center transition-colors border border-slate-700"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {systemInfo.instagram && systemInfo.instagram !== '#' && (
                <a
                  href={systemInfo.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#C8963E] text-slate-300 hover:text-slate-950 flex items-center justify-center transition-colors border border-slate-700"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {systemInfo.website && (
                <a
                  href={systemInfo.website}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#C8963E] text-slate-300 hover:text-slate-950 flex items-center justify-center transition-colors border border-slate-700"
                  aria-label="Official Website"
                  title="Official Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Top Programs */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5A93C]">
              {lang === 'bn' ? 'ফ্ল্যাগশিপ প্রোগ্রামসমূহ' : 'Flagship Executive Tracks'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/courses/chartered-financial-officer-program" className="hover:text-[#E5A93C] transition-colors">
                  Chartered Financial Officer (CFO) 1-Year
                </Link>
              </li>
              <li>
                <Link href="/courses/pgd-customs-vat-tax" className="hover:text-[#E5A93C] transition-colors">
                  PGD in Customs, VAT, TAX & Trade
                </Link>
              </li>
              <li>
                <Link href="/courses/fintech-sap-fico-powerbi" className="hover:text-[#E5A93C] transition-colors">
                  Advanced Fintech with SAP-FICO ERP
                </Link>
              </li>
              <li>
                <Link href="/courses/fpa-corporate-valuation" className="hover:text-[#E5A93C] transition-colors">
                  FP&A & Corporate Financial Modeling
                </Link>
              </li>
              <li>
                <Link href="/courses/pgd-supply-chain-analytics" className="hover:text-[#E5A93C] transition-colors">
                  Logistics & Supply Chain Analytics
                </Link>
              </li>
              <li>
                <Link href="/courses/hrm-bangladesh-labor-law" className="hover:text-[#E5A93C] transition-colors">
                  Corporate HRM & Bangladesh Labor Law
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic & Portal Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5A93C]">
              {lang === 'bn' ? 'অ্যাকাডেমিক পোর্টাল' : 'Navigation & Portals'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/" className="hover:text-[#E5A93C] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#E5A93C] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-[#E5A93C] transition-colors font-bold text-[#E5A93C]">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/media-news" className="hover:text-[#E5A93C] transition-colors">
                  Media & News
                </Link>
              </li>
              <li>
                <Link href="/participant" className="hover:text-[#E5A93C] transition-colors">
                  Participant
                </Link>
              </li>
              <li>
                <Link href="/facilitator" className="hover:text-[#E5A93C] transition-colors">
                  Facilitator
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#E5A93C] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="hover:text-[#E5A93C] transition-colors">
                  Certificates
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust, Accreditations & Payments */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5A93C]">
              {lang === 'bn' ? 'স্বীকৃতি ও পেমেন্ট গেটওয়ে' : 'Accreditation & Payment'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'বাংলাদেশ কারিগরি শিক্ষা বোর্ড (BTEB) কোডভুক্ত ও আরজেএসসি নিবন্ধিত প্রতিষ্ঠান।'
                : 'Recognized under Ministry of Education (BTEB) and registered with RJSC, Govt. of Bangladesh.'}
            </p>

            {/* Payment Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-center">
                <span className="text-xs font-black text-[#E2136E]">bKash</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-center">
                <span className="text-xs font-black text-[#F7931E]">Nagad</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-center">
                <span className="text-xs font-bold text-blue-400">VISA</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-center">
                <span className="text-xs font-bold text-orange-400">Mastercard</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-center">
                <span className="text-xs font-bold text-sky-400">City Bank</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-center">
                <span className="text-xs font-bold text-emerald-400">BRAC Bank</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-1.5 text-[11px] text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>BTEB & RJSC Accredited Executive Institution</span>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Trade License */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Chartered Officer Limited (COL). All rights reserved. cfoedubd.com
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-white transition-colors">
              {lang === 'bn' ? 'পরিচিতি' : 'About'}
            </Link>
            <Link href="/admission" className="hover:text-white transition-colors">
              {lang === 'bn' ? 'ভর্তি নীতিমালা' : 'Admission'}
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              {lang === 'bn' ? 'যোগাযোগ' : 'Contact'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
