'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Trophy,
  Video,
  Building2,
  Calendar,
  Send,
  CheckCircle2,
  AlertCircle,
  Play,
  X,
  PlusCircle,
  User,
  Mail,
  Phone,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Eye,
  Quote,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SuccessStoryItem } from '@/data/success-stories-data';
import { useCfo } from '@/context/CfoContext';

interface SuccessStoriesSectionProps {
  lang: 'bn' | 'en';
}

// Curated high-resolution corporate architecture & executive setting photos matching Meteor Lighting's showcase
const STORY_COVER_IMAGES = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop', // Modern commercial skyscraper
  'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop', // Executive boardroom & conference
  'https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=1600&auto=format&fit=crop', // High-ceiling glass corporate center
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop', // Executive finance professional
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop', // Strategic team collaboration
  'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1600&auto=format&fit=crop', // Financial governance & audit
];

export default function SuccessStoriesSection({ lang }: SuccessStoriesSectionProps) {
  const { theme } = useCfo();
  const isDark = theme === 'dark';

  // Strictly dynamic data from API
  const [stories, setStories] = useState<SuccessStoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState<boolean>(false);

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

  // Touch Swipe tracking
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Fetch live success stories from API (direct browser to local backend + Next.js server proxy)
  const fetchStories = useCallback(async () => {
    try {
      // 1. Direct fetch to local Laravel backend if reachable from user's browser
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
        // Direct request unreachable, proceed to proxy
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

  const handlePrev = useCallback(() => {
    if (totalStories === 0) return;
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalStories - 1));
  }, [totalStories]);

  const handleNext = useCallback(() => {
    if (totalStories === 0) return;
    setActiveIndex((prev) => (prev < totalStories - 1 ? prev + 1 : 0));
  }, [totalStories]);

  // Autoplay functionality (pauses on hover)
  useEffect(() => {
    if (totalStories <= 1 || isAutoplayPaused || isSubmitModalOpen || selectedStory || activeVideoUrl) {
      return;
    }
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [totalStories, isAutoplayPaused, handleNext, isSubmitModalOpen, selectedStory, activeVideoUrl]);

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

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      handleNext();
    } else if (distance < -50) {
      handlePrev();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

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
          : 'Please provide your name, email, and story.'
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

      // Direct post to local backend
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
        // Fallback to proxy
      }

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
          ? 'ধন্যবাদ! আপনার সাফল্যের গল্পটি সফলভাবে জমা হয়েছে। অ্যাডমিন পর্যালোচনার পর এটি ওয়েবসাইটে প্রদর্শিত হবে।'
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

      // Refresh stories list to pick up newly approved updates
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
      onMouseEnter={() => setIsAutoplayPaused(true)}
      onMouseLeave={() => setIsAutoplayPaused(false)}
      className={`relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors ${
        isDark
          ? 'bg-[#030712] text-white border-y border-slate-900'
          : 'bg-gradient-to-b from-[#FAF8F5] via-white to-[#F3F4F6] text-slate-900 border-y border-slate-200/90'
      }`}
    >
      {/* Background ambient lighting matching Meteor Lighting's cinematic atmospheric aesthetic */}
      <div className="absolute inset-0 pointer-events-none">
        {isDark ? (
          <>
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-[#C8963E]/15 via-[#FFC000]/8 to-transparent blur-[140px] rounded-full" />
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-amber-200/35 via-amber-100/20 to-transparent blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-100/60 to-transparent" />
          </>
        )}
      </div>

      <div className="relative max-w-7xl mx-auto space-y-10 sm:space-y-12">
        {/* Section Top Header & Navigation Buttons (Meteor Lighting exact header composition) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
          <div className="space-y-3 max-w-2xl">
            {/* Pill Tag (Meteor Lighting style uppercase badge) */}
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-mono font-bold tracking-widest uppercase transition-colors ${
                isDark
                  ? 'border border-white/20 bg-white/5 text-slate-400'
                  : 'border border-slate-300/80 bg-white text-slate-600 shadow-xs'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-[#FFC000] shrink-0" />
              <span>
                {lang === 'bn' ? 'অ্যালামনাই সাফল্যের গল্প' : 'FEATURED SUCCESS STORIES'}
              </span>
            </div>

            {/* Headline */}
            <h2
              className={`text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-snug ${
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
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {lang === 'bn'
                ? 'সিএফও এডুকেশন বিডি থেকে প্রশিক্ষণ সম্পন্ন করে শীর্ষস্থানীয় প্রতিষ্ঠানে কর্মরত পেশাদারদের অনুপ্রেরণাদায়ী অভিজ্ঞতা।'
                : 'Real achievements and transformative career advancements of our graduates across leading corporate enterprises.'}
            </p>
          </div>

          {/* Right Action: Write Story CTA + Meteor Lighting Circular Arrow Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-amber-400'
                  : 'bg-white hover:bg-amber-50 text-slate-900 border border-slate-300 hover:border-amber-400 shadow-xs'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-[#FFC000]" />
              <span>{lang === 'bn' ? 'গল্প লিখুন' : 'Share Story'}</span>
            </button>

            {totalStories > 1 && (
              <div className="flex items-center gap-2.5">
                {/* Previous Button (Meteor Lighting exact style: group, round, backdrop-blur, arrow nudge) */}
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous story"
                  className={`group rounded-full p-3 backdrop-blur transition-all cursor-pointer shadow-sm ${
                    isDark
                      ? 'border border-white/20 bg-white/5 text-white hover:bg-white hover:text-slate-950'
                      : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-950 hover:text-white'
                  }`}
                >
                  <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5 stroke-[2.2]" />
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next story"
                  className={`group rounded-full p-3 backdrop-blur transition-all cursor-pointer shadow-sm ${
                    isDark
                      ? 'border border-white/20 bg-white/5 text-white hover:bg-white hover:text-slate-950'
                      : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-950 hover:text-white'
                  }`}
                >
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 stroke-[2.2]" />
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

        {/* METEOR LIGHTING EXACT 3D COVERFLOW PYRAMID CAROUSEL STAGE */}
        {!isLoading && totalStories > 0 && (
          <div
            className="relative flex h-[42vh] sm:h-[45vh] md:h-[48vh] min-h-[350px] sm:min-h-[380px] md:min-h-[420px] max-h-[480px] w-full items-center justify-center select-none overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative flex h-full w-full items-center justify-center">
              {/* Generate slide slots so left, center, and right beside images ALWAYS display clearly */}
              {(() => {
                const offsets = totalStories >= 4 ? [-2, -1, 0, 1, 2] : totalStories >= 2 ? [-1, 0, 1] : [0];
                return offsets.map((offset) => {
                  const rawIdx = (activeIndex + offset) % totalStories;
                  const itemIdx = rawIdx < 0 ? rawIdx + totalStories : rawIdx;
                  const story = stories[itemIdx];
                  if (!story) return null;

                  const isCenter = offset === 0;
                  const isLeft1 = offset === -1;
                  const isRight1 = offset === 1;
                  const isLeft2 = offset === -2;
                  const isRight2 = offset === 2;

                  let positionClasses = '';
                  let overlayClasses = '';
                  let contentOpacityClasses = 'pointer-events-none opacity-0';

                  if (isCenter) {
                    positionClasses =
                      'left-1/2 z-30 h-full w-[72vw] sm:w-[56vw] md:w-[42vw] lg:w-[35vw] max-w-[460px] -translate-x-1/2 scale-100 cursor-default';
                    contentOpacityClasses = 'opacity-100';
                    overlayClasses = isDark
                      ? 'bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent'
                      : 'bg-gradient-to-t from-white via-white/80 to-transparent';
                  } else if (isRight1) {
                    // Beside Right Card: Visible clearly, showing generous portion of image
                    positionClasses =
                      'left-[84%] sm:left-[80%] md:left-[75%] lg:left-[72%] z-20 h-[88%] w-[54vw] sm:w-[44vw] md:w-[34vw] lg:w-[28vw] max-w-[380px] -translate-x-1/2 cursor-pointer hover:scale-[1.02]';
                    overlayClasses = isDark
                      ? 'bg-slate-950/25 hover:bg-slate-950/10'
                      : 'bg-slate-900/10 hover:bg-transparent';
                  } else if (isRight2) {
                    positionClasses =
                      'left-[102%] sm:left-[98%] md:left-[92%] lg:left-[89%] z-10 h-[74%] w-[42vw] sm:w-[32vw] md:w-[24vw] lg:w-[20vw] max-w-[260px] -translate-x-1/2 cursor-pointer';
                    overlayClasses = isDark ? 'bg-slate-950/60' : 'bg-slate-900/35';
                  } else if (isLeft1) {
                    // Beside Left Card: Visible clearly, showing generous portion of image
                    positionClasses =
                      'left-[16%] sm:left-[20%] md:left-[25%] lg:left-[28%] z-20 h-[88%] w-[54vw] sm:w-[44vw] md:w-[34vw] lg:w-[28vw] max-w-[380px] -translate-x-1/2 cursor-pointer hover:scale-[1.02]';
                    overlayClasses = isDark
                      ? 'bg-slate-950/25 hover:bg-slate-950/10'
                      : 'bg-slate-900/10 hover:bg-transparent';
                  } else if (isLeft2) {
                    positionClasses =
                      'left-[-2%] sm:left-[2%] md:left-[8%] lg:left-[11%] z-10 h-[74%] w-[42vw] sm:w-[32vw] md:w-[24vw] lg:w-[20vw] max-w-[260px] -translate-x-1/2 cursor-pointer';
                    overlayClasses = isDark ? 'bg-slate-950/60' : 'bg-slate-900/35';
                  }

                  const bgImage = story.photo || STORY_COVER_IMAGES[itemIdx % STORY_COVER_IMAGES.length];

                  return (
                    <div
                      key={`slot-${offset}-${story.id}`}
                      onClick={() => {
                        if (!isCenter) setActiveIndex(itemIdx);
                      }}
                      className={`absolute overflow-hidden rounded-2xl border shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-auto ${positionClasses} ${
                        isDark
                          ? isCenter
                            ? 'border-amber-400/80 bg-slate-900 shadow-[0_0_50px_rgba(255,192,0,0.22)]'
                            : 'border-slate-800 bg-slate-900 hover:border-amber-400/50'
                          : isCenter
                          ? 'border-amber-400 bg-white shadow-2xl shadow-amber-500/15'
                          : 'border-slate-200 bg-white hover:border-amber-400/50 shadow-md'
                      }`}
                    >
                      {/* Meteor Lighting Image Container with smooth zoom on hover */}
                      <div className="group/image relative h-full w-full overflow-hidden">
                        <div className="absolute inset-0 h-full w-full transition-transform duration-1000 ease-out group-hover/image:scale-105">
                          <img
                            src={bgImage}
                            alt={story.name}
                            className="h-full w-full object-cover"
                          />
                          {/* Shading overlay adapting to active status & theme */}
                          <div
                            className={`pointer-events-none absolute -inset-px transition-all duration-700 ${overlayClasses}`}
                          />
                        </div>

                        {/* Beside Cards Teaser Preview: Name & Tag clearly visible on flanking images */}
                        {(isLeft1 || isRight1) && (
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-3 sm:p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white transition-opacity duration-300">
                            <p className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-[#FFC000] truncate">
                              {story.designation || (lang === 'bn' ? 'সফল শিক্ষার্থী' : 'Alumni Graduate')}
                            </p>
                            <p className="text-xs sm:text-sm font-bold truncate text-white">
                              {story.name}
                            </p>
                          </div>
                        )}

                        {/* Card Top Pill & Video Action (Active Center Card) */}
                        {isCenter && (
                          <div className="absolute top-0 inset-x-0 z-20 p-4 sm:p-5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {story.batch && (
                                <span
                                  className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold backdrop-blur-md border ${
                                    isDark
                                      ? 'bg-black/60 border-amber-400/40 text-[#FFC000]'
                                      : 'bg-white/90 border-amber-300 text-amber-900 shadow-xs'
                                  }`}
                                >
                                  {story.batch}
                                </span>
                              )}
                              {story.company && (
                                <span
                                  className={`px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md border flex items-center gap-1.5 ${
                                    isDark
                                      ? 'bg-white/10 border-white/20 text-white'
                                      : 'bg-white/90 border-slate-300 text-slate-800 shadow-xs'
                                  }`}
                                >
                                  <Building2 className="w-3 h-3 text-[#FFC000]" />
                                  <span>{story.company}</span>
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
                                className="px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 cursor-pointer backdrop-blur-md"
                              >
                                <Play className="w-3 h-3 fill-white" />
                                <span>Video</span>
                              </button>
                            )}
                          </div>
                        )}

                        {/* Card Bottom Content (Active Center Card text layout) */}
                        <div
                          className={`absolute right-0 bottom-0 left-0 z-10 p-5 sm:p-6 space-y-2 transition-opacity duration-300 ${contentOpacityClasses}`}
                        >
                          {/* Category / Designation Tag (Meteor Lighting uppercase border-bottom link) */}
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase border-b transition-colors ${
                                isDark
                                  ? 'text-[#FFC000] border-[#FFC000]/50 hover:border-white hover:text-white'
                                  : 'text-amber-800 border-amber-600/50 hover:border-slate-900 hover:text-slate-900'
                              }`}
                            >
                              {story.designation || (lang === 'bn' ? 'সফল শিক্ষার্থী' : 'Alumni Graduate')}
                            </span>
                          </div>

                          {/* Title: Student Name & Company */}
                          <h3
                            className={`text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-tight transition-colors duration-300 ${
                              isDark
                                ? 'text-white group-hover/image:text-[#FFC000]'
                                : 'text-slate-950 group-hover/image:text-amber-700'
                            }`}
                          >
                            {story.name}
                            {story.company ? `, ${story.company}` : ''}
                          </h3>

                          {/* Story Quote with quotation styling */}
                          <div className="relative pt-0.5">
                            <Quote
                              className={`absolute -top-1 -left-1 w-3.5 h-3.5 rotate-180 ${
                                isDark ? 'text-amber-400/40' : 'text-amber-500/40'
                              }`}
                            />
                            <p
                              className={`text-xs sm:text-sm pl-4 italic leading-relaxed line-clamp-2 sm:line-clamp-3 ${
                                isDark ? 'text-slate-300' : 'text-slate-700'
                              }`}
                            >
                              &ldquo;{story.story}&rdquo;
                            </p>
                          </div>

                          {/* Bottom Action Footer for Center Card */}
                          {isCenter && (
                            <div
                              className={`pt-2.5 flex items-center justify-between border-t ${
                                isDark ? 'border-white/10' : 'border-slate-200'
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
                                    : 'text-amber-800 hover:text-slate-950'
                                }`}
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>
                                  {lang === 'bn' ? 'সম্পূর্ণ গল্পটি পড়ুন' : 'Read Full Story'}
                                </span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>

                              <span
                                className={`text-[11px] font-mono ${
                                  isDark ? 'text-slate-400' : 'text-slate-500'
                                }`}
                              >
                                {itemIdx + 1} / {totalStories}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* Meteor Lighting Pagination Bar / Indicators */}
        {!isLoading && totalStories > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            {stories.map((_, dotIdx) => (
              <button
                key={`dot-${dotIdx}`}
                type="button"
                onClick={() => setActiveIndex(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  dotIdx === activeIndex
                    ? 'w-10 bg-[#FFC000]'
                    : isDark
                    ? 'w-2 bg-white/20 hover:bg-white/40'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
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

        {/* Meteor Lighting Bottom Footer Action (View All / Share Story banner) */}
        <div className="relative z-10 text-center pt-2">
          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className={`group inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-all cursor-pointer ${
              isDark
                ? 'text-white/80 hover:text-[#FFC000]'
                : 'text-slate-800 hover:text-amber-700'
            }`}
          >
            <span>{lang === 'bn' ? 'আপনার সাফল্যের গল্প জমা দিন' : 'Share Your Success Story'}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
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
