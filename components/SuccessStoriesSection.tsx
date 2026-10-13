'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
import { motion, AnimatePresence } from 'motion/react';

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

  // Custom Backend Configuration State
  const [customBackendUrl, setCustomBackendUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        return (localStorage.getItem('cfo_custom_backend_url') || '').trim();
      } catch {
        // ignore
      }
    }
    return '';
  });
  const [isBackendConfigOpen, setIsBackendConfigOpen] = useState<boolean>(false);
  const [backendTestStatus, setBackendTestStatus] = useState<string | null>(null);
  const [isTestingBackend, setIsTestingBackend] = useState<boolean>(false);

  // Touch Swipe tracking
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Fetch live success stories from API with client-cache merging
  const fetchStories = useCallback(async () => {
    try {
      const savedBackendUrl =
        typeof window !== 'undefined'
          ? (localStorage.getItem('cfo_custom_backend_url') || '').trim()
          : '';

      const headers: Record<string, string> = { Accept: 'application/json' };
      if (savedBackendUrl) {
        headers['x-custom-backend-url'] = savedBackendUrl;
      }

      // Query internal Next.js proxy route which queries backend + /tmp server cache
      const proxyRes = await fetch('/api/success-stories', {
        headers,
        cache: 'no-store',
      });

      let fetchedList: SuccessStoryItem[] = [];
      if (proxyRes.ok) {
        const json = await proxyRes.json();
        if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
          fetchedList = json.data;
        }
      }

      // Also merge any client-cached stories from browser localStorage
      let clientStories: SuccessStoryItem[] = [];
      try {
        const rawClient = localStorage.getItem('cfo_client_stories');
        if (rawClient) {
          const parsed = JSON.parse(rawClient);
          if (Array.isArray(parsed)) clientStories = parsed;
        }
      } catch {
        // ignore
      }

      const existingIds = new Set(fetchedList.map((item) => String(item.id)));
      const uniqueClient = clientStories.filter((item) => !existingIds.has(String(item.id)));
      const combined = [...uniqueClient, ...fetchedList];

      if (combined.length > 0) {
        setStories(combined);
        setActiveIndex(0);
      } else {
        setStories([]);
      }
    } catch {
      // ignore
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

  // Meteor Lighting infinite continuous circular deck setup (at least 6 items)
  const carouselItems = useMemo(() => {
    if (!stories || stories.length === 0) return [];
    if (stories.length === 1) {
      return stories.map((item, idx) => ({
        ...item,
        uniqueKey: `carousel-story-${item.id}-${idx}`,
        originalIndex: 0,
      }));
    }
    let list = [...stories];
    while (list.length > 0 && list.length < 6) {
      list = [...list, ...stories];
    }
    return list.map((item, idx) => ({
      ...item,
      uniqueKey: `carousel-story-${item.id}-${idx}`,
      originalIndex: idx % stories.length,
    }));
  }, [stories]);

  const totalItems = carouselItems.length;

  const handlePrev = useCallback(() => {
    if (totalItems === 0) return;
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  const handleNext = useCallback(() => {
    if (totalItems === 0) return;
    setActiveIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

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

  const handleSaveBackendUrl = (url: string) => {
    const clean = url.trim().replace(/\/$/, '');
    setCustomBackendUrl(clean);
    try {
      if (clean) {
        localStorage.setItem('cfo_custom_backend_url', clean);
      } else {
        localStorage.removeItem('cfo_custom_backend_url');
      }
    } catch {
      // ignore
    }
  };

  const handleTestBackendConnection = async () => {
    setIsTestingBackend(true);
    setBackendTestStatus(null);
    try {
      const urlToTest = customBackendUrl.trim() || 'http://127.0.0.1:8000';
      const res = await fetch('/api/success-stories', {
        headers: { 'x-custom-backend-url': urlToTest },
        cache: 'no-store',
      });
      const data = await res.json().catch(() => null);
      if (data?.isLive) {
        setBackendTestStatus('Connected! Database is reachable and live.');
      } else {
        setBackendTestStatus(
          `Unreachable: Could not connect to ${urlToTest} from cloud. If local, use an ngrok or public URL.`
        );
      }
    } catch {
      setBackendTestStatus('Connection failed. Please verify the URL.');
    } finally {
      setIsTestingBackend(false);
    }
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
      const savedBackendUrl =
        typeof window !== 'undefined'
          ? (localStorage.getItem('cfo_custom_backend_url') || '').trim()
          : '';

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };
      if (savedBackendUrl) {
        headers['x-custom-backend-url'] = savedBackendUrl;
      }

      const proxyRes = await fetch('/api/success-stories/submit', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });

      const json = await proxyRes.json().catch(() => null);

      if (!proxyRes.ok || (json && json.success === false)) {
        if (json?.status === 422 && json?.errors) {
          const firstKey = Object.keys(json.errors)[0];
          const firstErr = json.errors[firstKey];
          const errText = Array.isArray(firstErr) ? firstErr[0] : json.message;
          throw new Error(errText || 'Validation error from database.');
        }
        throw new Error(json?.message || 'Submission failed. Please check database connection.');
      }

      const isLiveBackend = json?.isLiveBackend === true;

      // Create new story item to render immediately in the carousel
      const newStoryItem: SuccessStoryItem = {
        id: json?.data?.id || `story-${Date.now()}`,
        name: formData.student_name.trim(),
        designation: formData.designation.trim() || (lang === 'bn' ? 'সফল শিক্ষার্থী' : 'Alumni Graduate'),
        company: formData.company.trim() || null,
        batch: formData.batch.trim() || null,
        story: formData.story.trim(),
        video_url: formData.video_url.trim() || null,
        created_at: new Date().toISOString(),
        is_local: !isLiveBackend,
      };

      // Cache locally in browser
      try {
        const rawClient = localStorage.getItem('cfo_client_stories');
        const existingList: SuccessStoryItem[] = rawClient ? JSON.parse(rawClient) : [];
        existingList.unshift(newStoryItem);
        localStorage.setItem('cfo_client_stories', JSON.stringify(existingList.slice(0, 30)));
      } catch {
        // ignore
      }

      // Prepend to stories state immediately so user sees their new story right away
      setStories((prev) => [newStoryItem, ...prev]);
      setActiveIndex(0);

      if (isLiveBackend) {
        setSubmitSuccess(
          lang === 'bn'
            ? 'ধন্যবাদ! আপনার সাফল্যের গল্পটি ডেটাবেজে সফলভাবে সংরক্ষিত হয়েছে।'
            : 'Success! Your story has been stored directly into the database.'
        );
      } else {
        setSubmitSuccess(
          lang === 'bn'
            ? 'আপনার গল্পটি সফলভাবে সংরক্ষিত হয়েছে এবং ক্যারোসেলে প্রদর্শিত হচ্ছে! (ক্লাউড পরিবেশ থেকে 127.0.0.1:8000 কানেক্ট করা যায়নি; সরাসরি ডেটাবেজে পাঠাতে নিচে ব্যাকএন্ড API URL কনফিগার করতে পারেন)।'
            : 'Story saved & visible in carousel! (Notice: Remote database at 127.0.0.1:8000 was unreachable from the cloud server. Provide a live backend URL in API Settings below to store directly).'
        );
      }

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

      // Keep success message visible then close
      setTimeout(() => {
        setIsSubmitModalOpen(false);
        setSubmitSuccess(null);
      }, 4000);
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
                  : 'border border-slate-300 bg-white text-slate-800 shadow-xs'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500 dark:text-[#FFC000] shrink-0" />
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
                isDark ? 'text-slate-400' : 'text-slate-700 font-normal'
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
              {carouselItems.map((item, idx) => {
                const d = totalItems;
                const o = (idx - activeIndex + d) % d;
                let position: 'center' | 'right' | 'far-right' | 'left' | 'far-left' | 'hidden' = 'hidden';
                if (o === 0) position = 'center';
                else if (o === 1) position = 'right';
                else if (o === 2) position = 'far-right';
                else if (o === d - 1) position = 'left';
                else if (o === d - 2) position = 'far-left';

                let positionClasses = '';
                if (position === 'center') {
                  positionClasses =
                    'left-1/2 z-30 h-full w-[72vw] sm:w-[56vw] md:w-[42vw] lg:w-[36vw] max-w-[460px] -translate-x-1/2 scale-100 cursor-default';
                } else if (position === 'left') {
                  positionClasses =
                    'left-[5%] z-20 h-[82%] w-[54vw] sm:w-[42vw] md:w-[32vw] lg:w-[28vw] max-w-[380px] translate-x-0 md:left-[12%] cursor-pointer hover:scale-[1.02]';
                } else if (position === 'right') {
                  positionClasses =
                    'left-[95%] z-20 h-[82%] w-[54vw] sm:w-[42vw] md:w-[32vw] lg:w-[28vw] max-w-[380px] -translate-x-full md:left-[88%] cursor-pointer hover:scale-[1.02]';
                } else if (position === 'far-left') {
                  positionClasses =
                    'left-[-10%] z-10 h-[68%] w-[44vw] sm:w-[32vw] md:w-[24vw] lg:w-[20vw] max-w-[260px] translate-x-0 md:left-[-2%] cursor-pointer';
                } else if (position === 'far-right') {
                  positionClasses =
                    'left-[110%] z-10 h-[68%] w-[44vw] sm:w-[32vw] md:w-[24vw] lg:w-[20vw] max-w-[260px] -translate-x-full md:left-[102%] cursor-pointer';
                } else {
                  positionClasses =
                    'pointer-events-none left-1/2 z-0 h-[60%] w-[40vw] -translate-x-1/2 scale-50 opacity-0';
                }

                const bgImage = item.photo || STORY_COVER_IMAGES[item.originalIndex % STORY_COVER_IMAGES.length];

                const cardBorderAndTheme = isDark
                  ? position === 'center'
                    ? 'border-amber-400/80 bg-slate-900 shadow-[0_0_50px_rgba(255,192,0,0.22)] ring-1 ring-amber-400/30'
                    : 'border-slate-800 bg-slate-900 hover:border-amber-400/50'
                  : position === 'center'
                  ? 'border-amber-400 bg-white shadow-2xl shadow-amber-500/15 ring-1 ring-amber-400/30'
                  : 'border-slate-200 bg-white hover:border-amber-400/50 shadow-md';

                return (
                  <div
                    key={item.uniqueKey}
                    onClick={() => {
                      if (position === 'left' || position === 'far-left') {
                        handlePrev();
                      } else if (position === 'right' || position === 'far-right') {
                        handleNext();
                      }
                    }}
                    className={`absolute cursor-pointer overflow-hidden rounded-2xl border shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-auto ${positionClasses} ${cardBorderAndTheme}`}
                  >
                    {/* Meteor Lighting Image Container with smooth zoom on hover */}
                    <div className="group/image relative h-full w-full overflow-hidden">
                      <div
                        className={`absolute inset-0 h-full w-full transition-transform duration-1000 ease-out ${
                          position === 'center' ? 'group-hover/image:scale-105' : ''
                        }`}
                      >
                        <img
                          src={bgImage}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                        {/* Shading overlay adapting to active status & theme - rich gradient ensures 100% text contrast */}
                        <div
                          className={`pointer-events-none absolute -inset-px transition-all duration-700 ${
                            position === 'center'
                              ? 'bg-gradient-to-t from-slate-950 via-slate-950/75 via-45% to-transparent'
                              : 'bg-slate-950/60'
                          }`}
                        />
                      </div>

                      {/* Beside Cards Teaser Preview: Name & Tag clearly visible on flanking images */}
                      <div
                        className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 p-3 sm:p-4 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent text-white transition-opacity duration-300 ${
                          position === 'left' || position === 'right' ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <p className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#FFC000] truncate drop-shadow-sm">
                          {item.designation || (lang === 'bn' ? 'সফল শিক্ষার্থী' : 'Alumni Graduate')}
                        </p>
                        <p className="text-xs sm:text-sm font-bold truncate text-white drop-shadow-md">
                          {item.name}
                        </p>
                      </div>

                      {/* Card Top Pill & Video Action (Active Center Card) */}
                      <div
                        className={`absolute top-0 inset-x-0 z-20 p-4 sm:p-5 flex items-center justify-between transition-opacity duration-300 ${
                          position === 'center' ? 'opacity-100' : 'pointer-events-none opacity-0'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {item.batch && (
                            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold backdrop-blur-md border bg-black/60 border-amber-400/40 text-[#FFC000] shadow-sm">
                              {item.batch}
                            </span>
                          )}
                          {item.company && (
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md border flex items-center gap-1.5 bg-black/60 border-white/20 text-white shadow-sm">
                              <Building2 className="w-3 h-3 text-[#FFC000]" />
                              <span>{item.company}</span>
                            </span>
                          )}
                          {item.is_local && (
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md border flex items-center gap-1.5 bg-emerald-950/80 border-emerald-400/50 text-emerald-300 shadow-sm">
                              <Sparkles className="w-3 h-3 text-emerald-300" />
                              <span>{lang === 'bn' ? 'নতুন জমা দেওয়া' : 'Recent Submission'}</span>
                            </span>
                          )}
                        </div>

                        {item.video_url && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveVideoUrl(item.video_url || null);
                            }}
                            className="px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 cursor-pointer backdrop-blur-md"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            <span>Video</span>
                          </button>
                        )}
                      </div>

                      {/* Card Bottom Content (Meteor Lighting exact text layout with transition) */}
                      <div
                        className={`absolute right-0 bottom-0 left-0 z-10 p-5 sm:p-6 space-y-2 transition-opacity duration-300 ${
                          position === 'center' ? 'opacity-100 delay-100' : 'pointer-events-none opacity-0'
                        }`}
                      >
                        {/* Category / Designation Tag (Meteor Lighting uppercase border-bottom link) */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase border-b text-[#FFC000] border-[#FFC000]/60 hover:border-white hover:text-white transition-colors drop-shadow-sm">
                            {item.designation || (lang === 'bn' ? 'সফল শিক্ষার্থী' : 'Alumni Graduate')}
                          </span>
                        </div>

                        {/* Title: Student Name & Company */}
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-tight text-white group-hover/image:text-[#FFC000] transition-colors duration-300 drop-shadow-md">
                          {item.name}
                          {item.company ? `, ${item.company}` : ''}
                        </h3>

                        {/* Story Quote with quotation styling */}
                        <div className="relative pt-0.5">
                          <Quote className="absolute -top-1 -left-1 w-3.5 h-3.5 rotate-180 text-amber-400 drop-shadow-xs" />
                          <p className="text-xs sm:text-sm pl-4 italic leading-relaxed line-clamp-2 sm:line-clamp-3 text-slate-100 drop-shadow-sm font-medium">
                            &ldquo;{item.story}&rdquo;
                          </p>
                        </div>

                        {/* Bottom Action Footer for Center Card */}
                        <div className="pt-2.5 flex items-center justify-between border-t border-white/20">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStory(item);
                            }}
                            className="text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors text-[#FFC000] hover:text-amber-200 drop-shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>
                              {lang === 'bn' ? 'সম্পূর্ণ গল্পটি পড়ুন' : 'Read Full Story'}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          <span className="text-[11px] font-mono text-slate-300 drop-shadow-xs">
                            {item.originalIndex + 1} / {totalStories}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Meteor Lighting Pagination Bar / Indicators */}
        {!isLoading && totalStories > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            {stories.map((_, dotIdx) => {
              const activeOriginalIndex = carouselItems[activeIndex]?.originalIndex ?? 0;
              return (
                <button
                  key={`dot-${dotIdx}`}
                  type="button"
                  onClick={() => {
                    const target = carouselItems.findIndex(
                      (ci) => ci.originalIndex === dotIdx
                    );
                    if (target >= 0) setActiveIndex(target);
                  }}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    dotIdx === activeOriginalIndex
                      ? isDark
                        ? 'w-10 bg-[#FFC000]'
                        : 'w-10 bg-amber-500 shadow-sm shadow-amber-500/40'
                      : isDark
                      ? 'w-2 bg-white/20 hover:bg-white/40'
                      : 'w-2 bg-slate-300 hover:bg-slate-500'
                  }`}
                />
              );
            })}
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
            <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
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
            className={`group inline-flex items-center gap-2 text-xs font-extrabold tracking-widest uppercase transition-all cursor-pointer ${
              isDark
                ? 'text-white/80 hover:text-[#FFC000]'
                : 'text-slate-900 hover:text-amber-600'
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

            {/* Database / Backend Connection Settings Collapsible */}
            <div
              className={`p-3.5 rounded-2xl border text-xs transition-colors ${
                isDark
                  ? 'bg-slate-900/70 border-slate-800'
                  : 'bg-amber-50/60 border-amber-200/80'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      customBackendUrl ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                  <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {lang === 'bn' ? 'ডাটাবেজ / ব্যাকএন্ড সংযোগ' : 'Database & API Connection'}
                  </span>
                  <span className="text-[11px] opacity-75 font-mono truncate max-w-[180px] sm:max-w-[280px]">
                    ({customBackendUrl || 'http://127.0.0.1:8000'})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBackendConfigOpen((prev) => !prev)}
                  className={`text-[11px] font-bold underline cursor-pointer hover:opacity-80 ${
                    isDark ? 'text-amber-400' : 'text-amber-700'
                  }`}
                >
                  {isBackendConfigOpen
                    ? lang === 'bn'
                      ? 'বন্ধ করুন'
                      : 'Hide'
                    : lang === 'bn'
                    ? 'API পরিবর্তন / পরীক্ষা'
                    : 'Configure / Test'}
                </button>
              </div>

              {isBackendConfigOpen && (
                <div className="mt-3 pt-3 border-t border-slate-700/50 space-y-2.5">
                  <p className="text-[11px] opacity-80 leading-relaxed">
                    {lang === 'bn'
                      ? 'আপনার Laravel বা কাস্টম ব্যাকএন্ড সার্ভার যদি লাইভ ডোমেইনে বা ngrok এ চলে, তবে নিচের বক্সে সম্পূর্ণ URL প্রদান করুন (যেমন: https://your-tunnel.ngrok-free.app বা https://api.cfoedubd.com)।'
                      : 'If your Laravel backend is hosted online or running via ngrok/tunnel, enter the public URL below so stories write directly to your database table:'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      placeholder="e.g. https://your-subdomain.ngrok-free.app"
                      value={customBackendUrl}
                      onChange={(e) => setCustomBackendUrl(e.target.value)}
                      className={`flex-1 px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                        isDark
                          ? 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-600'
                          : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                      }`}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveBackendUrl(customBackendUrl)}
                        className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                      >
                        {lang === 'bn' ? 'সংরক্ষণ' : 'Save'}
                      </button>
                      <button
                        type="button"
                        disabled={isTestingBackend}
                        onClick={handleTestBackendConnection}
                        className={`px-3.5 py-2 rounded-xl font-bold text-xs border transition-colors cursor-pointer ${
                          isDark
                            ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                            : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        {isTestingBackend
                          ? lang === 'bn'
                            ? 'পরীক্ষা হচ্ছে...'
                            : 'Testing...'
                          : lang === 'bn'
                          ? 'টেস্ট'
                          : 'Test Connection'}
                      </button>
                    </div>
                  </div>
                  {backendTestStatus && (
                    <div
                      className={`p-2 rounded-lg text-[11px] font-medium ${
                        backendTestStatus.includes('Connected')
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {backendTestStatus}
                    </div>
                  )}
                </div>
              )}
            </div>

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
