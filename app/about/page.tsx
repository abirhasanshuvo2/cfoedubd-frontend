'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCfo } from '@/context/CfoContext';
import {
  Building2,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
} from 'lucide-react';

export default function AboutPage() {
  const { lang, systemInfo, theme } = useCfo();
  const [aboutApiData, setAboutApiData] = useState<any>(null);

  // Fetch dynamic about data from API endpoint
  useEffect(() => {
    let isMounted = true;
    fetch('/api/about')
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json?.data) {
          setAboutApiData(json.data);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Build metrics strictly from dynamic systemInfo (Only if backend sends real numbers)
  const dynamicMetrics: { number: string; label: string }[] = [];

  if (systemInfo.students && Number(systemInfo.students) > 0) {
    dynamicMetrics.push({
      number: `${Number(systemInfo.students).toLocaleString()}+`,
      label: lang === 'bn' ? 'নিবন্ধিত শিক্ষার্থী' : 'Enrolled Students',
    });
  }

  if (systemInfo.graduates && Number(systemInfo.graduates) > 0) {
    const grad = Number(systemInfo.graduates);
    dynamicMetrics.push({
      number: grad <= 100 ? `${grad}%` : `${grad.toLocaleString()}+`,
      label: lang === 'bn' ? 'সফল গ্র্যাজুয়েট' : 'Graduates',
    });
  }

  if (systemInfo.classes && Number(systemInfo.classes) > 0) {
    dynamicMetrics.push({
      number: `${Number(systemInfo.classes).toLocaleString()}+`,
      label: lang === 'bn' ? 'ক্লাস ও ল্যাব' : 'Classes & Labs',
    });
  }

  // Dynamic video embed resolution
  const videoId =
    aboutApiData?.youtubeId ||
    (systemInfo.about_video ? systemInfo.about_video.replace(/.*v=/, '').split('&')[0] : '');

  // Dynamic about text resolution from systemInfo
  const dynamicAboutText =
    systemInfo.about_first_section ||
    systemInfo.description ||
    (lang === 'bn' ? aboutApiData?.story?.foundationBn : aboutApiData?.story?.foundationEn) ||
    '';

  const dynamicSecondSection = systemInfo.about_second_section || '';

  return (
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col font-sans transition-colors ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}
    >
      <Navbar />

      {/* Hero Header */}
      <section className="relative bg-gradient-to-b from-amber-50/90 via-slate-50 to-white dark:from-[#0A192F] dark:via-[#0D254C] dark:to-[#0A192F] dark:bg-[#0A192F] text-slate-900 dark:text-white pt-16 pb-20 overflow-hidden border-b border-slate-200 dark:border-[#1E3A8A] transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(200,150,62,0.18),rgba(10,25,47,0))]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          {systemInfo.tagline && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-[#1E3A8A]/50 border border-amber-300 dark:border-amber-400/40 text-xs font-bold text-amber-950 dark:text-[#FFC000] shadow-2xs">
              <Award className="w-4 h-4 text-amber-700 dark:text-[#FFC000]" />
              <span>{systemInfo.tagline}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black text-slate-950 dark:text-white tracking-tight leading-tight">
            {systemInfo.name || 'Chartered Officer Limited'}
            {systemInfo.motto && (
              <>
                <br className="hidden sm:block" />
                <span className="text-amber-800 dark:text-[#FFC000] text-2xl sm:text-3xl md:text-4xl block pt-2">
                  {systemInfo.motto}
                </span>
              </>
            )}
          </h1>

          {dynamicAboutText && (
            <p className="text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
              {dynamicAboutText}
            </p>
          )}

          {dynamicSecondSection && (
            <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              {dynamicSecondSection}
            </p>
          )}

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/courses"
              className="px-6 py-3 rounded-xl bg-[#FFC000] hover:bg-[#E6AC00] text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all border border-amber-300"
            >
              <span>{lang === 'bn' ? 'সব কোর্স দেখুন' : 'Explore Courses'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.8]" />
            </Link>

            {videoId && (
              <a
                href="#official-video"
                className="px-5 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
              >
                <span>{lang === 'bn' ? 'অফিসিয়াল ভিডিও দেখুন' : 'Watch Video'}</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Dynamic Metrics Banner — ONLY renders if real numbers exist in backend */}
      {dynamicMetrics.length > 0 && (
        <section className="bg-white dark:bg-[#0D254C] text-slate-800 dark:text-white py-12 border-b border-slate-200 dark:border-[#1E3A8A] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`grid grid-cols-1 ${
                dynamicMetrics.length === 1
                  ? 'max-w-md'
                  : dynamicMetrics.length === 2
                  ? 'md:grid-cols-2 max-w-2xl'
                  : 'md:grid-cols-3 max-w-4xl'
              } gap-6 text-center mx-auto`}
            >
              {dynamicMetrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-amber-400 transition-all space-y-1"
                >
                  <p className="text-3xl sm:text-4xl font-serif font-black text-amber-800 dark:text-[#FFC000]">
                    {m.number}
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-16">
        {/* Dynamic Video Section (Only shown if video URL / ID exists in backend) */}
        {videoId && (
          <section id="official-video" className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
            <div className="max-w-2xl mx-auto text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {lang === 'bn' ? 'ভিডিও পরিচিতি' : 'Video Introduction'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-black text-white">
                {systemInfo.name || 'Chartered Officer Limited'}
              </h3>
            </div>

            <div className="relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                title={systemInfo.name || 'Chartered Officer Limited'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </section>
        )}

        {/* Dynamic Campus Location & Contact Details */}
        <section className="bg-white dark:bg-[#0A192F] text-slate-900 dark:text-white rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-[#1E3A8A] shadow-xs transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#FFC000] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-600" />
                {lang === 'bn' ? 'ক্যাম্পাস ও প্রধান কার্যালয়' : 'Campus & Head Office'}
              </span>

              {systemInfo.address && (
                <h3 className="text-2xl sm:text-3xl font-serif font-black text-slate-950 dark:text-white leading-snug">
                  {systemInfo.address}
                </h3>
              )}

              <div className="space-y-2 pt-2 text-xs text-slate-700 dark:text-slate-300 font-mono">
                {systemInfo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      {systemInfo.phone}
                      {systemInfo.mobile && systemInfo.mobile !== systemInfo.phone && ` / ${systemInfo.mobile}`}
                    </span>
                  </div>
                )}
                {systemInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-sans">{systemInfo.email}</span>
                  </div>
                )}
                {systemInfo.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-600 shrink-0" />
                    <a
                      href={systemInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans hover:underline text-amber-700 dark:text-amber-400"
                    >
                      {systemInfo.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
              <div className="space-y-1">
                <h4 className="text-base font-serif font-bold text-slate-900 dark:text-white">
                  {systemInfo.name || 'Chartered Officer Limited'}
                </h4>
                {systemInfo.tagline && (
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {systemInfo.tagline}
                  </p>
                )}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/courses"
                  className="px-5 py-2.5 rounded-xl bg-[#FFC000] hover:bg-[#E6AC00] text-slate-950 font-serif font-black text-xs shadow-md transition-all cursor-pointer border border-amber-300"
                >
                  {lang === 'bn' ? 'সকল কোর্স দেখুন' : 'Explore Courses'}
                </Link>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-serif font-bold text-xs border border-slate-300 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
                >
                  {lang === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
