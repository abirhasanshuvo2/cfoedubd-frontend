'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy,
  Sparkles,
  Quote,
  Video,
  Building2,
  Calendar,
  Send,
  CheckCircle2,
  AlertCircle,
  Play,
  X,
  PlusCircle,
  TrendingUp,
  User,
  Mail,
  Phone,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Layers,
  Crown,
  Eye,
  RefreshCw,
  Award
} from 'lucide-react';
import { SuccessStoryItem } from '@/data/success-stories-data';
import { useCfo } from '@/context/CfoContext';

interface SuccessStoriesSectionProps {
  lang: 'bn' | 'en';
}

// Curated professional architectural & corporate photo accents
const STORY_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
];

export default function SuccessStoriesSection({ lang }: SuccessStoriesSectionProps) {
  const { theme } = useCfo();
  const isDark = theme === 'dark';

  // Strictly dynamic: no static data
  const [stories, setStories] = useState<SuccessStoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'stage' | 'stack'>('stage');

  // Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<SuccessStoryItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    student_name: '',
    email: '',
    phone: '',
    designation: '',
    company: '',
    batch: '',
    video_url: '',
    story: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchStories = React.useCallback(async () => {
    try {
      // 1. Direct browser fetch to local Laravel backend if running on 127.0.0.1:8000
      try {
        const directRes = await fetch('http://127.0.0.1:8000/api/success-stories', {
          signal: AbortSignal.timeout(2500),
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });
        if (directRes.ok) {
          const directJson = await directRes.json();
          if (
            directJson &&
            directJson.success &&
            Array.isArray(directJson.data) &&
            directJson.data.length > 0
          ) {
            setStories(directJson.data);
            setActiveIndex(0);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Direct local backend unreachable or blocked by CORS, proceed to Next.js proxy
      }

      // 2. Query internal Next.js proxy route
      const proxyRes = await fetch('/api/success-stories', { cache: 'no-store' });
      if (proxyRes.ok) {
        const json = await proxyRes.json();
        if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
          setStories(json.data);
          setActiveIndex(0);
        } else {
          setStories([]);
        }
      } else {
        setStories([]);
      }
    } catch {
      setStories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const run = async () => {
      await fetchStories();
      if (!active) return;
    };
    run();
    return () => {
      active = false;
    };
  }, [fetchStories]);

  const totalStories = stories.length;

  const handlePrev = React.useCallback(() => {
    if (totalStories === 0) return;
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalStories - 1));
  }, [totalStories]);

  const handleNext = React.useCallback(() => {
    if (totalStories === 0) return;
    setActiveIndex((prev) => (prev < totalStories - 1 ? prev + 1 : 0));
  }, [totalStories]);

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitModalOpen || selectedStory || activeVideoUrl) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, isSubmitModalOpen, selectedStory, activeVideoUrl]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!formData.student_name.trim() || !formData.email.trim() || !formData.story.trim()) {
      setSubmitError(
        lang === 'bn'
          ? 'অনুগ্রহ করে আপনার নাম, ইমেইল এবং সাফল্যের গল্পটি লিখুন।'
          : 'Please provide student name, email, and story.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      let submitted = false;
      const queryParams = new URLSearchParams();
      queryParams.set('student_name', formData.student_name.trim());
      queryParams.set('email', formData.email.trim());
      queryParams.set('story', formData.story.trim());
      if (formData.designation.trim()) queryParams.set('designation', formData.designation.trim());
      if (formData.company.trim()) queryParams.set('company', formData.company.trim());
      if (formData.batch.trim()) queryParams.set('batch', formData.batch.trim());
      if (formData.phone.trim()) queryParams.set('phone', formData.phone.trim());
      if (formData.video_url.trim()) queryParams.set('video_url', formData.video_url.trim());

      // 1. Direct fetch to local Laravel backend
      try {
        const directUrl = `http://127.0.0.1:8000/api/success-stories/submit?${queryParams.toString()}`;
        const directRes = await fetch(directUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          signal: AbortSignal.timeout(5000),
        });

        if (directRes.ok) {
          submitted = true;
        }
      } catch {
        // Direct request failed, fallback to server proxy
      }

      // 2. Fallback to proxy route
      if (!submitted) {
        const proxyRes = await fetch('/api/success-stories/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const json = await proxyRes.json().catch(() => null);
        if (!proxyRes.ok && (!json || !json.success)) {
          throw new Error(json?.message || 'Submission failed');
        }
      }

      setSubmitSuccess(
        lang === 'bn'
          ? 'ধন্যবাদ! আপনার সাফল্যের গল্পটি সফলভাবে জমা হয়েছে। অ্যাডমিন অনুমোদনের পর এটি ওয়েবসাইটে প্রদর্শিত হবে।'
          : 'Thank you! Your success story has been submitted successfully and is pending admin review.'
      );

      setFormData({
        student_name: '',
        email: '',
        phone: '',
        designation: '',
        company: '',
        batch: '',
        video_url: '',
        story: '',
      });

      // Refresh stories list to pick up changes
      fetchStories();

      setTimeout(() => {
        setIsSubmitModalOpen(false);
        setSubmitSuccess(null);
      }, 2500);
    } catch (err: any) {
      setSubmitError(
        err.message ||
          (lang === 'bn'
            ? 'গল্পটি পাঠাতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।'
            : 'Failed to submit story. Please try again.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEmbedVideoUrl = (rawUrl?: string | null): string | null => {
    if (!rawUrl) return null;
    const clean = rawUrl.trim();
    if (clean.includes('youtube.com/watch?v=')) {
      const id = clean.split('v=')[1]?.split('&')[0];
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : clean;
    }
    if (clean.includes('youtu.be/')) {
      const id = clean.split('youtu.be/')[1]?.split('?')[0];
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : clean;
    }
    return clean;
  };

  return (
    <section
      id="success-stories"
      className={`relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors ${
        isDark
          ? 'bg-[#030712] text-white border-y border-slate-900'
          : 'bg-gradient-to-b from-[#FAF8F5] via-white to-[#F3F4F6] text-slate-900 border-y border-slate-200/90'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        {isDark ? (
          <>
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#C8963E]/15 via-[#FFC000]/8 to-transparent blur-[140px] rounded-full" />
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-200/35 via-amber-100/20 to-transparent blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-100/60 to-transparent" />
          </>
        )}
      </div>

      <div className="relative max-w-7xl mx-auto space-y-10 sm:space-y-12">
        {/* Section Top Header & Pyramid Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
          <div className="space-y-3 max-w-2xl">
            {/* Pyramid Style Tag */}
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-widest uppercase transition-colors ${
                isDark
                  ? 'bg-white/10 border border-white/15 text-[#FFC000]'
                  : 'bg-amber-100/90 border border-amber-300 text-amber-900 shadow-xs font-semibold'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-[#FFC000] shrink-0" />
              <span>
                {lang === 'bn' ? 'অ্যালামনাই সাফল্য পিরামিড' : 'EXECUTIVE SUCCESS PYRAMID'}
              </span>
            </div>

            {/* Headline */}
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight leading-tight ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              {lang === 'bn' ? (
                <>
                  আমাদের শিক্ষার্থীদের{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-[#C8963E] to-amber-700 dark:from-[#FFE58F] dark:via-[#FFC000] dark:to-[#E6AC00]">
                    বাস্তব সাফল্য ও অর্জন
                  </span>
                </>
              ) : (
                <>
                  Proven Career Growth for{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-[#C8963E] to-amber-700 dark:from-[#FFE58F] dark:via-[#FFC000] dark:to-[#E6AC00]">
                    Executive Leaders
                  </span>
                </>
              )}
            </h2>

            <p
              className={`text-xs sm:text-sm max-w-xl leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {lang === 'bn'
                ? 'সিএফও এডুকেশন বিডি থেকে প্রশিক্ষণ সম্পন্ন করে শীর্ষস্থানীয় কর্পোরেট প্রতিষ্ঠানে পদোন্নতি ও নেতৃত্বের অনুপ্রেরণাদায়ী সাফল্য।'
                : 'Real achievements and leadership transformations of our graduates working across top tier companies.'}
            </p>
          </div>

          {/* Right Action Bar: View Switcher, Write Story CTA, & Round Navigation Arrows */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Pyramid View Switcher (Stage vs Stack) */}
            {totalStories > 1 && (
              <div
                className={`flex items-center p-1 rounded-full border text-xs font-bold ${
                  isDark
                    ? 'bg-slate-900/90 border-slate-800 text-slate-300'
                    : 'bg-white border-slate-300 text-slate-700 shadow-xs'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setViewMode('stage')}
                  className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'stage'
                      ? 'bg-[#FFC000] text-slate-950 font-black shadow-xs'
                      : 'hover:text-amber-500'
                  }`}
                  title="3D Stepped Pyramid Stage"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'পিরামিড স্টেজ' : 'Pyramid Stage'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('stack')}
                  className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'stack'
                      ? 'bg-[#FFC000] text-slate-950 font-black shadow-xs'
                      : 'hover:text-amber-500'
                  }`}
                  title="Pyramid Tier Grid"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'টিয়ার ভিউ' : 'Tier Grid'}</span>
                </button>
              </div>
            )}

            {/* Share Story Button */}
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-amber-400'
                  : 'bg-white hover:bg-amber-50 text-slate-900 border border-slate-300 hover:border-amber-400 shadow-sm'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-[#FFC000]" />
              <span>{lang === 'bn' ? 'গল্প লিখুন' : 'Share Story'}</span>
            </button>

            {/* Carousel Arrows (Active in Stage View) */}
            {viewMode === 'stage' && totalStories > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous story"
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                    isDark
                      ? 'bg-white/10 hover:bg-[#FFC000] text-white hover:text-slate-950 border border-white/20 hover:border-[#FFC000]'
                      : 'bg-white hover:bg-[#FFC000] text-slate-800 hover:text-slate-950 border border-slate-300 hover:border-[#FFC000]'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next story"
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                    isDark
                      ? 'bg-white/10 hover:bg-[#FFC000] text-white hover:text-slate-950 border border-white/20 hover:border-[#FFC000]'
                      : 'bg-white hover:bg-[#FFC000] text-slate-800 hover:text-slate-950 border border-slate-300 hover:border-[#FFC000]'
                  }`}
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p
              className={`text-sm font-bold ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {lang === 'bn'
                ? 'সাফল্যের গল্পগুলো লোড হচ্ছে...'
                : 'Loading success stories from API...'}
            </p>
          </div>
        )}

        {/* 1. 3D STEPPED PYRAMID CAROUSEL STAGE */}
        {!isLoading && totalStories > 0 && viewMode === 'stage' && (
          <div className="relative w-full py-4 select-none">
            {/* The 3D Stage with stepped pyramid elevation */}
            <div className="relative h-[480px] sm:h-[540px] md:h-[590px] w-full flex items-center justify-center overflow-visible">
              {stories.map((story, idx) => {
                let offset = idx - activeIndex;
                if (offset < -Math.floor(totalStories / 2)) offset += totalStories;
                if (offset > Math.floor(totalStories / 2)) offset -= totalStories;

                const isApex = offset === 0;
                const isLeft1 = offset === -1;
                const isRight1 = offset === 1;
                const isLeft2 = offset === -2;
                const isRight2 = offset === 2;
                const isHidden = Math.abs(offset) > 2;

                if (isHidden) return null;

                // Geometrical Pyramid Step Transformation:
                // Apex (Center): scale(1.02), translateY(0), zIndex 30
                // Wing Tier 1: scale(0.85), translateY(28px) down the pyramid slope, zIndex 20
                // Wing Tier 2: scale(0.70), translateY(56px) down the pyramid slope, zIndex 10
                let transformClass = 'translate-x-0 translate-y-0 scale-100 z-30 opacity-100';
                let cursorClass = 'cursor-default';

                if (isLeft1) {
                  transformClass =
                    '-translate-x-[55%] sm:-translate-x-[62%] translate-y-6 sm:translate-y-8 scale-[0.84] z-20 opacity-70 hover:opacity-90';
                  cursorClass = 'cursor-pointer';
                } else if (isRight1) {
                  transformClass =
                    'translate-x-[55%] sm:translate-x-[62%] translate-y-6 sm:translate-y-8 scale-[0.84] z-20 opacity-70 hover:opacity-90';
                  cursorClass = 'cursor-pointer';
                } else if (isLeft2) {
                  transformClass =
                    '-translate-x-[96%] sm:-translate-x-[112%] translate-y-12 sm:translate-y-16 scale-[0.70] z-10 opacity-35 hover:opacity-60';
                  cursorClass = 'cursor-pointer';
                } else if (isRight2) {
                  transformClass =
                    'translate-x-[96%] sm:translate-x-[112%] translate-y-12 sm:translate-y-16 scale-[0.70] z-10 opacity-35 hover:opacity-60';
                  cursorClass = 'cursor-pointer';
                }

                const bgTexture = story.photo || STORY_BACKGROUNDS[idx % STORY_BACKGROUNDS.length];

                return (
                  <div
                    key={story.id}
                    onClick={() => {
                      if (!isApex) setActiveIndex(idx);
                    }}
                    style={{
                      transition:
                        'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.55s ease, box-shadow 0.55s ease',
                    }}
                    className={`absolute w-[88%] sm:w-[540px] md:w-[620px] lg:w-[660px] h-[450px] sm:h-[500px] md:h-[530px] rounded-3xl overflow-hidden ${transformClass} ${cursorClass} ${
                      isDark
                        ? isApex
                          ? 'bg-slate-900 border-2 border-amber-400 shadow-[0_0_50px_rgba(255,192,0,0.3)] ring-2 ring-amber-400/20'
                          : 'bg-slate-950/90 border border-slate-800 shadow-xl'
                        : isApex
                        ? 'bg-white border-2 border-amber-400 shadow-2xl shadow-amber-500/20 ring-2 ring-amber-400/30'
                        : 'bg-white/95 border border-slate-200/90 shadow-xl shadow-slate-200/60'
                    }`}
                  >
                    {/* Visual Header / Cover Texture */}
                    <div className="relative h-44 sm:h-52 w-full overflow-hidden">
                      <img
                        src={bgTexture}
                        alt={story.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Gradient overlay adapting to theme */}
                      <div
                        className={`absolute inset-0 ${
                          isDark
                            ? 'bg-gradient-to-t from-slate-900 via-slate-900/60 to-black/30'
                            : 'bg-gradient-to-t from-white via-white/50 to-black/20'
                        }`}
                      />

                      {/* Top Badges (Apex Crown + Batch / Company) */}
                      <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                        <div className="flex items-center gap-2">
                          {isApex ? (
                            <span className="px-3 py-1 rounded-full bg-[#FFC000] text-slate-950 text-[11px] font-mono font-black flex items-center gap-1.5 shadow-md">
                              <Crown className="w-3.5 h-3.5 fill-slate-950" />
                              <span>{lang === 'bn' ? 'পিরামিড শীর্ষ' : 'PYRAMID APEX'}</span>
                            </span>
                          ) : (
                            <span
                              className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold backdrop-blur-md ${
                                isDark
                                  ? 'bg-black/60 text-slate-300 border border-white/20'
                                  : 'bg-white/90 text-slate-700 border border-slate-300 shadow-xs'
                              }`}
                            >
                              Step {Math.abs(offset)}
                            </span>
                          )}

                          {story.batch && (
                            <span
                              className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold backdrop-blur-md ${
                                isDark
                                  ? 'bg-black/60 text-[#FFC000] border border-amber-400/40'
                                  : 'bg-white/90 text-amber-900 border border-amber-300 shadow-xs'
                              }`}
                            >
                              {story.batch}
                            </span>
                          )}
                        </div>

                        {story.video_url && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveVideoUrl(story.video_url || null);
                            }}
                            className="px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 cursor-pointer backdrop-blur-md"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            <span>Video</span>
                          </button>
                        )}
                      </div>

                      {/* Avatar initial badge positioned at the seam */}
                      <div className="absolute -bottom-6 left-6 z-20">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center font-serif font-black text-2xl shadow-xl border-2 ${
                            isDark
                              ? 'bg-gradient-to-br from-amber-400 to-[#C8963E] text-slate-950 border-slate-900'
                              : 'bg-gradient-to-br from-[#FFC000] to-amber-600 text-white border-white'
                          }`}
                        >
                          {story.name.charAt(0)}
                        </div>
                      </div>
                    </div>

                    {/* Card Body Content */}
                    <div className="p-6 sm:p-7 pt-9 space-y-3.5">
                      {/* Designation & Company Row */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-xs font-mono font-black uppercase tracking-wider ${
                            isDark ? 'text-[#FFC000]' : 'text-amber-800'
                          }`}
                        >
                          {story.designation || (lang === 'bn' ? 'সফল শিক্ষার্থী' : 'Alumni Graduate')}
                        </span>
                        {story.company && (
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
                              isDark
                                ? 'bg-white/10 text-slate-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            <Building2 className="w-3 h-3 text-[#FFC000]" />
                            <span>{story.company}</span>
                          </span>
                        )}
                      </div>

                      {/* Student Full Name */}
                      <h3
                        className={`text-xl sm:text-2xl md:text-3xl font-serif font-black tracking-tight leading-snug ${
                          isDark ? 'text-white' : 'text-slate-950'
                        }`}
                      >
                        {story.name}
                      </h3>

                      {/* Story Quote with quotation icon */}
                      <div className="relative">
                        <Quote
                          className={`absolute -top-1 -left-1 w-5 h-5 rotate-180 ${
                            isDark ? 'text-amber-400/40' : 'text-amber-500/40'
                          }`}
                        />
                        <p
                          className={`text-xs sm:text-sm pl-5 italic leading-relaxed line-clamp-3 sm:line-clamp-4 ${
                            isDark ? 'text-slate-200' : 'text-slate-700'
                          }`}
                        >
                          &ldquo;{story.story}&rdquo;
                        </p>
                      </div>

                      {/* Card Footer Controls (Read story modal trigger) */}
                      {isApex && (
                        <div
                          className={`pt-3 flex items-center justify-between border-t ${
                            isDark ? 'border-slate-800' : 'border-slate-100'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStory(story);
                            }}
                            className={`text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                              isDark
                                ? 'text-[#FFC000] hover:text-amber-300'
                                : 'text-amber-800 hover:text-amber-950'
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{lang === 'bn' ? 'সম্পূর্ণ গল্পটি পড়ুন' : 'Read Full Story'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          <span
                            className={`text-[11px] font-mono ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            {idx + 1} / {totalStories}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Dots Under 3D Pyramid */}
            {totalStories > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                {stories.map((_, dotIdx) => (
                  <button
                    key={`dot-${dotIdx}`}
                    type="button"
                    onClick={() => setActiveIndex(dotIdx)}
                    aria-label={`Go to story ${dotIdx + 1}`}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      dotIdx === activeIndex
                        ? 'w-9 bg-[#FFC000]'
                        : isDark
                        ? 'w-2.5 bg-white/20 hover:bg-white/40'
                        : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. PYRAMID TIER GRID (Alternate Geometric Structure) */}
        {!isLoading && totalStories > 0 && viewMode === 'stack' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Pyramid Apex Tier (Top 1 Highlight) */}
            {stories[0] && (
              <div
                className={`p-6 sm:p-8 rounded-3xl border-2 border-amber-400 relative overflow-hidden transition-all shadow-xl ${
                  isDark
                    ? 'bg-slate-900/90 text-white ring-2 ring-amber-400/20'
                    : 'bg-white text-slate-900 shadow-amber-500/10'
                }`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#FFC000] text-slate-950 text-xs font-mono font-black flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 fill-slate-950" />
                        <span>{lang === 'bn' ? 'পিরামিড চূড়া' : 'PYRAMID APEX TIER'}</span>
                      </span>
                      {stories[0].batch && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-amber-500/15 text-amber-700 dark:text-[#FFC000] font-bold">
                          {stories[0].batch}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif font-black">
                      {stories[0].name}
                    </h3>
                    <p className="text-xs font-mono font-bold text-amber-600 dark:text-[#FFC000]">
                      {stories[0].designation || 'Alumni'}
                      {stories[0].company ? ` • ${stories[0].company}` : ''}
                    </p>

                    <p
                      className={`text-xs sm:text-sm italic leading-relaxed ${
                        isDark ? 'text-slate-200' : 'text-slate-700'
                      }`}
                    >
                      &ldquo;{stories[0].story}&rdquo;
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full sm:w-auto">
                    {stories[0].video_url && (
                      <button
                        type="button"
                        onClick={() => setActiveVideoUrl(stories[0].video_url || null)}
                        className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md cursor-pointer hover:bg-red-700"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Watch Video</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedStory(stories[0])}
                      className="px-4 py-2.5 rounded-xl bg-[#FFC000] text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#E6AC00]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'বিস্তারিত পড়ুন' : 'Full Story'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Pyramid Base Tier (Stories 1..n side-by-side forming the pyramid foundation) */}
            {stories.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {stories.slice(1).map((item, subIdx) => (
                  <div
                    key={item.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isDark
                        ? 'bg-slate-900/60 border-slate-800 text-white hover:border-amber-400/60'
                        : 'bg-white border-slate-200 text-slate-900 hover:border-amber-400 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-[#FFC000] font-bold">
                        {item.designation || 'Graduate'}
                      </span>
                      {item.batch && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {item.batch}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-serif font-black">{item.name}</h4>
                    {item.company && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 pb-2">
                        {item.company}
                      </p>
                    )}

                    <p
                      className={`text-xs italic line-clamp-3 ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      &ldquo;{item.story}&rdquo;
                    </p>

                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setSelectedStory(item)}
                        className="text-xs font-bold text-amber-700 dark:text-[#FFC000] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>{lang === 'bn' ? 'পড়ুন' : 'Read'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>

                      {item.video_url && (
                        <button
                          type="button"
                          onClick={() => setActiveVideoUrl(item.video_url || null)}
                          className="text-[11px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Video</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State when no stories returned from API */}
        {!isLoading && totalStories === 0 && (
          <div
            className={`py-16 text-center space-y-3 rounded-3xl border max-w-xl mx-auto p-8 shadow-sm ${
              isDark
                ? 'bg-slate-900/60 border-slate-800 text-white'
                : 'bg-white border-slate-200 text-slate-900 shadow-md'
            }`}
          >
            <Trophy className="w-10 h-10 text-amber-400 mx-auto opacity-80" />
            <h3 className="text-base font-serif font-black">
              {lang === 'bn' ? 'কোনো সাফল্যের গল্প পাওয়া যায়নি' : 'No Success Stories Yet'}
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {lang === 'bn'
                ? 'প্রথম শিক্ষার্থী হিসেবে আপনার সাফল্যের অভিজ্ঞতা এখানে শেয়ার করুন!'
                : 'Be the first graduate to share your transformative journey with us!'}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#FFC000] text-slate-950 font-serif font-black text-xs hover:bg-[#E6AC00] transition-colors cursor-pointer shadow-sm"
              >
                {lang === 'bn' ? 'আপনার সাফল্যের গল্প লিখুন' : 'Submit First Story'}
              </button>
            </div>
          </div>
        )}

        {/* Bottom Banner */}
        <div
          className={`p-6 rounded-2xl border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left transition-colors ${
            isDark
              ? 'bg-slate-900/50 border-slate-800 text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-[#FFC000] flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-serif font-black">
                {lang === 'bn'
                  ? 'আপনিও কি সফলতার এই যাত্রায় অংশ নিতে চান?'
                  : 'Ready to build your corporate success story?'}
              </h4>
              <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {lang === 'bn'
                  ? 'আমাদের কোর্সগুলো সম্পন্ন করে আজই নিজের ক্যারিয়ারকে নতুন উচ্চতায় নিয়ে যান।'
                  : 'Enroll in our practical executive masterclasses and become part of our alumni network.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              isDark
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 shadow-xs'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#FFC000]" />
            <span>{lang === 'bn' ? 'গল্প সাবমিট করুন' : 'Submit Story'}</span>
          </button>
        </div>
      </div>

      {/* MODAL 1: SUBMIT SUCCESS STORY FORM */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl p-6 sm:p-8 space-y-6 ${
              isDark
                ? 'bg-slate-950 text-white border-amber-400/40 shadow-black'
                : 'bg-white text-slate-900 border-slate-200 shadow-2xl'
            }`}
          >
            {/* Header */}
            <div
              className={`flex items-start justify-between gap-4 pb-4 border-b ${
                isDark ? 'border-slate-800' : 'border-slate-100'
              }`}
            >
              <div>
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-1.5 ${
                    isDark
                      ? 'bg-amber-400/20 border border-amber-400/30 text-[#FFC000]'
                      : 'bg-amber-100 border border-amber-300 text-amber-900'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'bn' ? 'অ্যালামনাই সাফল্য বিবরণী' : 'Student Success Submission'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-black">
                  {lang === 'bn' ? 'আপনার সাফল্যের গল্প জমা দিন' : 'Share Your Success Story'}
                </h3>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {lang === 'bn'
                    ? 'আপনার অভিজ্ঞতা ভবিষ্যৎ শিক্ষার্থীদের অনুপ্রাণিত করবে। অ্যাডমিন অনুমোদনের পর এটি হোমপেজে প্রদর্শিত হবে।'
                    : 'Your story will inspire future learners. Submissions are reviewed by the admin before publication.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Messages */}
            {submitSuccess && (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 flex items-start gap-2.5 text-xs sm:text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{submitSuccess}</span>
              </div>
            )}

            {submitError && (
              <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-800 dark:text-rose-200 flex items-start gap-2.5 text-xs sm:text-sm">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmitStory} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    className={`font-bold flex items-center gap-1.5 ${
                      isDark ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-[#FFC000]" />
                    <span>{lang === 'bn' ? 'শিক্ষার্থীর নাম *' : 'Student Name *'}</span>
                  </label>
                  <input
                    type="text"
                    name="student_name"
                    required
                    value={formData.student_name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahim Uddin"
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-1 transition-colors ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-500 focus:ring-amber-500'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    className={`font-bold flex items-center gap-1.5 ${
                      isDark ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-[#FFC000]" />
                    <span>{lang === 'bn' ? 'ইমেইল অ্যাড্রেস *' : 'Email Address *'}</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. rahim@example.com"
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-1 transition-colors ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-500 focus:ring-amber-500'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    className={`font-bold flex items-center gap-1.5 ${
                      isDark ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5 text-[#FFC000]" />
                    <span>{lang === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 01700000000"
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-1 transition-colors ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-500 focus:ring-amber-500'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    className={`font-bold flex items-center gap-1.5 ${
                      isDark ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#FFC000]" />
                    <span>{lang === 'bn' ? 'ব্যাচ / সেশন' : 'Batch / Session'}</span>
                  </label>
                  <input
                    type="text"
                    name="batch"
                    value={formData.batch}
                    onChange={handleInputChange}
                    placeholder="e.g. Batch 12 or 2026"
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-1 transition-colors ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-500 focus:ring-amber-500'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    className={`font-bold flex items-center gap-1.5 ${
                      isDark ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5 text-[#FFC000]" />
                    <span>{lang === 'bn' ? 'পদবী' : 'Designation'}</span>
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="e.g. Finance Manager"
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-1 transition-colors ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-500 focus:ring-amber-500'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    className={`font-bold flex items-center gap-1.5 ${
                      isDark ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#FFC000]" />
                    <span>{lang === 'bn' ? 'কোম্পানি / প্রতিষ্ঠান' : 'Company / Organization'}</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="e.g. ABC Ltd"
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-1 transition-colors ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-500 focus:ring-amber-500'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  className={`font-bold flex items-center gap-1.5 ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-[#FFC000]" />
                  <span>{lang === 'bn' ? 'ভিডিও লিংক (ঐচ্ছিক)' : 'Video Link (Optional YouTube / Vimeo)'}</span>
                </label>
                <input
                  type="url"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/watch?v=..."
                  className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-1 transition-colors ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-500 focus:ring-amber-500'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className={`font-bold flex items-center gap-1.5 ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  <Quote className="w-3.5 h-3.5 text-[#FFC000]" />
                  <span>{lang === 'bn' ? 'আপনার সাফল্যের গল্প ও অভিজ্ঞতা *' : 'Your Success Story & Experience *'}</span>
                </label>
                <textarea
                  name="story"
                  required
                  rows={4}
                  value={formData.story}
                  onChange={handleInputChange}
                  placeholder={
                    lang === 'bn'
                      ? 'কোর্সটি কিভাবে আপনার ক্যারিয়ারে ভূমিকা রাখল, প্রমোশন, নতুন জ্ঞান ও অভিজ্ঞতা সম্পর্কে বিস্তারিত লিখুন...'
                      : 'Describe how the program helped your skills, promotions, real-world execution, and career growth...'
                  }
                  className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-1 resize-y transition-colors ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-500 focus:ring-amber-500'
                  }`}
                />
              </div>

              <div
                className={`pt-3 flex items-center justify-end gap-3 border-t ${
                  isDark ? 'border-slate-800' : 'border-slate-100'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className={`px-5 py-2.5 rounded-xl font-bold transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-slate-850 hover:bg-slate-800 text-slate-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FFC000] to-[#E6AC00] text-slate-950 font-serif font-black flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>{lang === 'bn' ? 'পাঠানো হচ্ছে...' : 'Submitting...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-slate-950" />
                      <span>{lang === 'bn' ? 'গল্প জমা দিন' : 'Submit Story'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: FULL STORY DETAIL POPUP */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className={`relative w-full max-w-xl rounded-3xl border p-6 sm:p-8 space-y-5 shadow-2xl ${
              isDark
                ? 'bg-slate-950 text-white border-amber-400/50'
                : 'bg-white text-slate-900 border-slate-200 shadow-2xl'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-serif font-black text-xl ${
                    isDark
                      ? 'bg-gradient-to-br from-amber-400 to-amber-700 text-slate-950'
                      : 'bg-gradient-to-br from-[#FFC000] to-amber-600 text-white'
                  }`}
                >
                  {selectedStory.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-serif font-black">{selectedStory.name}</h3>
                  <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                    {selectedStory.designation || 'Alumni'}
                    {selectedStory.company ? ` • ${selectedStory.company}` : ''}
                  </p>
                  {selectedStory.batch && (
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      Batch: {selectedStory.batch}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStory(null)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className={`p-4 rounded-xl border max-h-80 overflow-y-auto ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800 text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line italic">
                &ldquo;{selectedStory.story}&rdquo;
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              {selectedStory.video_url ? (
                <button
                  type="button"
                  onClick={() => {
                    const vid = selectedStory.video_url;
                    setSelectedStory(null);
                    setActiveVideoUrl(vid || null);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600/15 text-red-600 dark:text-red-400 border border-red-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-red-600 hover:text-white transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{lang === 'bn' ? 'ভিডিও দেখুন' : 'Watch Video'}</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={() => setSelectedStory(null)}
                className="px-4 py-2 rounded-xl bg-[#FFC000] hover:bg-[#E6AC00] text-slate-950 font-bold text-xs cursor-pointer shadow-sm"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: VIDEO PLAYER MODAL */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-slate-950 rounded-3xl border border-amber-400/50 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 bg-black border-b border-white/10">
              <span className="text-xs font-serif font-black text-amber-400 flex items-center gap-2">
                <Video className="w-4 h-4" />
                <span>
                  {lang === 'bn'
                    ? 'সাফল্যের ভিডিও সাক্ষাৎকার'
                    : 'Success Story Video Interview'}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setActiveVideoUrl(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              {getEmbedVideoUrl(activeVideoUrl)?.includes('http') ? (
                <iframe
                  src={getEmbedVideoUrl(activeVideoUrl) || ''}
                  title="Success Story Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <p className="text-sm text-slate-300">
                    Video URL: <span className="font-mono text-amber-400">{activeVideoUrl}</span>
                  </p>
                  <a
                    href={activeVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                  >
                    <span>Open External Video Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
