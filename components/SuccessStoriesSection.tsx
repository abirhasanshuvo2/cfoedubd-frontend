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
  MessageSquare
} from 'lucide-react';
import { SuccessStoryItem } from '@/data/success-stories-data';
import { useCfo } from '@/context/CfoContext';

interface SuccessStoriesSectionProps {
  lang: 'bn' | 'en';
}

// Curated high quality background textures for the coverflow cards
const STORY_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop', // Modern architecture
  'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop', // Executive boardroom
  'https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=1200&auto=format&fit=crop', // Glass corporate building
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop', // Business professional
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop', // Team collaboration
  'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop', // Law and finance
];

export default function SuccessStoriesSection({ lang }: SuccessStoriesSectionProps) {
  const { theme } = useCfo();
  const [stories, setStories] = useState<SuccessStoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);
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

  // Fetch live success stories from API (direct local or proxy fallback)
  useEffect(() => {
    let isMounted = true;

    async function loadStories() {
      setIsLoading(true);
      try {
        // 1. Try local backend direct fetch first if in browser
        try {
          const directRes = await fetch('http://127.0.0.1:8000/api/success-stories', {
            signal: AbortSignal.timeout(2000),
            headers: { Accept: 'application/json' },
          });
          if (directRes.ok) {
            const directJson = await directRes.json();
            if (
              directJson &&
              directJson.success &&
              Array.isArray(directJson.data) &&
              directJson.data.length > 0
            ) {
              if (isMounted) {
                setStories(directJson.data);
                setActiveIndex(0);
                setIsLoading(false);
                return;
              }
            }
          }
        } catch {
          // Direct local backend unreachable or blocked, fallback to internal route
        }

        // 2. Query internal Next.js proxy route
        const res = await fetch('/api/success-stories', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
            if (isMounted) {
              setStories(json.data);
              setActiveIndex(0);
            }
          }
        }
      } catch {
        // Keep empty if API returns nothing
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadStories();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalStories = stories.length;

  const handlePrev = () => {
    if (totalStories === 0) return;
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalStories - 1));
  };

  const handleNext = () => {
    if (totalStories === 0) return;
    setActiveIndex((prev) => (prev < totalStories - 1 ? prev + 1 : 0));
  };

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitModalOpen || selectedStory || activeVideoUrl) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalStories, isSubmitModalOpen, selectedStory, activeVideoUrl]);

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
          : 'Please provide your full name, email, and your success story.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      let submitted = false;
      try {
        const queryParams = new URLSearchParams();
        queryParams.set('student_name', formData.student_name.trim());
        queryParams.set('email', formData.email.trim());
        queryParams.set('story', formData.story.trim());
        if (formData.designation.trim()) queryParams.set('designation', formData.designation.trim());
        if (formData.company.trim()) queryParams.set('company', formData.company.trim());
        if (formData.batch.trim()) queryParams.set('batch', formData.batch.trim());
        if (formData.phone.trim()) queryParams.set('phone', formData.phone.trim());
        if (formData.video_url.trim()) queryParams.set('video_url', formData.video_url.trim());

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
        // Direct local request failed; proceed to proxy
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
          throw new Error(json?.message || 'Failed to submit story');
        }
      }

      setSubmitSuccess(
        lang === 'bn'
          ? 'ধন্যবাদ! আপনার সাফল্যের গল্পটি সফলভাবে জমা হয়েছে। অ্যাডমিন পর্যালোচনা করার পর এটি ওয়েবসাইটে প্রকাশিত হবে।'
          : 'Thank you! Your success story was submitted successfully. Once approved by the administrator, it will be published on the website.'
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

      setTimeout(() => {
        setIsSubmitModalOpen(false);
        setSubmitSuccess(null);
      }, 2500);
    } catch (err: any) {
      setSubmitError(
        err.message ||
          (lang === 'bn'
            ? 'গল্পটি পাঠাতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।'
            : 'Failed to submit your story. Please try again.')
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
      className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-950 dark:bg-black text-white transition-colors"
    >
      {/* Background glow & subtle cinematic lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#C8963E]/10 via-[#FFC000]/5 to-transparent blur-[140px] rounded-full" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-10 sm:space-y-14">
        {/* Section Top Header & Navigation Arrows (Exact Meteor Lighting / Hero Style) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
          <div className="space-y-3 max-w-2xl">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 dark:bg-white/5 border border-white/15 text-[11px] font-mono tracking-widest uppercase text-[#FFC000]">
              <Trophy className="w-3.5 h-3.5 text-[#FFC000]" />
              <span>
                {lang === 'bn' ? 'অ্যালামনাই সাফল্যের গল্প' : 'FEATURED SUCCESS STORIES'}
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white leading-tight">
              {lang === 'bn' ? (
                <>
                  আমাদের শিক্ষার্থীদের{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#FFC000] to-[#E6AC00]">
                    বাস্তব সাফল্য ও অর্জন
                  </span>
                </>
              ) : (
                <>
                  Proven Career Growth for{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#FFC000] to-[#E6AC00]">
                    Executive Leaders
                  </span>
                </>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {lang === 'bn'
                ? 'সিএফও এডুকেশন বিডি থেকে প্রশিক্ষণ সম্পন্ন করে শীর্ষস্থানীয় প্রতিষ্ঠানে কর্মরত পেশাদারদের অনুপ্রেরণাদায়ী অভিজ্ঞতা।'
                : 'Real achievements and transformative career advancements of our graduates across leading corporate enterprises.'}
            </p>
          </div>

          {/* Right Action: Previous / Next Round Arrows + Share Story CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 hover:border-amber-400"
            >
              <PlusCircle className="w-4 h-4 text-[#FFC000]" />
              <span>{lang === 'bn' ? 'গল্প লিখুন' : 'Share Story'}</span>
            </button>

            {totalStories > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous story"
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#FFC000] text-white hover:text-slate-950 border border-white/20 hover:border-[#FFC000] flex items-center justify-center transition-all cursor-pointer shadow-md"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next story"
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#FFC000] text-white hover:text-slate-950 border border-white/20 hover:border-[#FFC000] flex items-center justify-center transition-all cursor-pointer shadow-md"
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
            <p className="text-sm font-bold text-slate-300">
              {lang === 'bn' ? 'সাফল্যের গল্পগুলো লোড হচ্ছে...' : 'Loading success stories from API...'}
            </p>
          </div>
        )}

        {/* METEOR-STYLE 3D COVERFLOW PYRAMID CAROUSEL */}
        {!isLoading && totalStories > 0 && (
          <div className="relative w-full py-4 select-none">
            {/* The Stage */}
            <div className="relative h-[480px] sm:h-[540px] md:h-[580px] w-full flex items-center justify-center overflow-visible">
              {stories.map((story, idx) => {
                // Calculate circular relative offset from activeIndex
                let offset = idx - activeIndex;
                if (offset < -Math.floor(totalStories / 2)) offset += totalStories;
                if (offset > Math.floor(totalStories / 2)) offset -= totalStories;

                const isCenter = offset === 0;
                const isLeft1 = offset === -1;
                const isRight1 = offset === 1;
                const isLeft2 = offset === -2;
                const isRight2 = offset === 2;
                const isHidden = Math.abs(offset) > 2;

                if (isHidden) return null;

                // 3D CSS transform matching the Meteor lighting screenshot:
                // Center card: scale(1.0), translateY(0), zIndex 30
                // Flanking cards: scale(0.85), shifted left/right, opacity 0.65, zIndex 20
                // Outer cards: scale(0.72), shifted further, opacity 0.35, zIndex 10
                let transformClass = 'translate-x-0 scale-100 z-30 opacity-100';
                let cursorClass = 'cursor-default';

                if (isLeft1) {
                  transformClass = '-translate-x-[55%] sm:-translate-x-[62%] scale-[0.84] z-20 opacity-60 hover:opacity-85 brightness-75 hover:brightness-100';
                  cursorClass = 'cursor-pointer';
                } else if (isRight1) {
                  transformClass = 'translate-x-[55%] sm:translate-x-[62%] scale-[0.84] z-20 opacity-60 hover:opacity-85 brightness-75 hover:brightness-100';
                  cursorClass = 'cursor-pointer';
                } else if (isLeft2) {
                  transformClass = '-translate-x-[95%] sm:-translate-x-[110%] scale-[0.70] z-10 opacity-30 hover:opacity-60 brightness-50';
                  cursorClass = 'cursor-pointer';
                } else if (isRight2) {
                  transformClass = 'translate-x-[95%] sm:translate-x-[110%] scale-[0.70] z-10 opacity-30 hover:opacity-60 brightness-50';
                  cursorClass = 'cursor-pointer';
                }

                const bgImage = story.photo || STORY_BACKGROUNDS[idx % STORY_BACKGROUNDS.length];

                return (
                  <div
                    key={story.id}
                    onClick={() => {
                      if (!isCenter) setActiveIndex(idx);
                    }}
                    style={{
                      transition: 'transform 0.55s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.55s ease, filter 0.55s ease',
                    }}
                    className={`absolute w-[86%] sm:w-[540px] md:w-[620px] lg:w-[680px] h-[460px] sm:h-[510px] md:h-[540px] rounded-3xl overflow-hidden shadow-2xl ${transformClass} ${cursorClass}`}
                  >
                    {/* Background Visual Container */}
                    <div className="absolute inset-0 bg-slate-900">
                      <img
                        src={bgImage}
                        alt={story.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Heavy cinematic gradient overlay matching the reference image */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
                      {/* Golden ambient border */}
                      <div
                        className={`absolute inset-0 rounded-3xl pointer-events-none transition-all ${
                          isCenter
                            ? 'border-2 border-amber-400/80 shadow-[0_0_50px_rgba(255,192,0,0.25)]'
                            : 'border border-white/20'
                        }`}
                      />
                    </div>

                    {/* Top Card Badge / Controls */}
                    <div className="relative z-10 p-5 sm:p-7 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {story.batch && (
                          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/50 text-[11px] font-mono font-bold text-[#FFC000]">
                            {story.batch}
                          </span>
                        )}
                        {story.company && (
                          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white flex items-center gap-1.5">
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
                          className="px-3.5 py-1.5 rounded-full bg-red-600/90 hover:bg-red-600 text-white text-xs font-black flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 cursor-pointer backdrop-blur-md"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>Video</span>
                        </button>
                      )}
                    </div>

                    {/* Bottom Card Content: Category Pill, Bold Title, Quote & Author */}
                    <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8 space-y-3 bg-gradient-to-t from-black via-black/85 to-transparent">
                      {/* Designation / Category Tag in gold font matching Meteor's orange category */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] sm:text-xs font-mono font-black tracking-widest uppercase text-[#FFC000]">
                          {story.designation || 'ALUMNI SUCCESS STORY'}
                        </span>
                      </div>

                      {/* Main Title: Student Name & Company */}
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-white tracking-tight uppercase leading-snug">
                        {story.name}
                        {story.company ? `, ${story.company}` : ''}
                      </h3>

                      {/* Story Text Quote (Only fully readable on center active card) */}
                      <div className="relative">
                        <Quote className="absolute -top-1 -left-1 w-5 h-5 text-amber-400/40 rotate-180" />
                        <p
                          className={`text-xs sm:text-sm text-slate-200 pl-5 italic leading-relaxed line-clamp-3 sm:line-clamp-4 ${
                            !isCenter ? 'opacity-80' : ''
                          }`}
                        >
                          "{story.story}"
                        </p>
                      </div>

                      {/* Bottom Footer Action */}
                      {isCenter && (
                        <div className="pt-2 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStory(story);
                            }}
                            className="text-xs font-bold text-[#FFC000] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>{lang === 'bn' ? 'সম্পূর্ণ গল্পটি পড়ুন' : 'Read Full Story'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          <span className="text-[11px] font-mono text-slate-400">
                            {idx + 1} / {totalStories}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Dots Under Carousel */}
            {totalStories > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                {stories.map((_, dotIdx) => (
                  <button
                    key={`dot-${dotIdx}`}
                    type="button"
                    onClick={() => setActiveIndex(dotIdx)}
                    aria-label={`Go to story ${dotIdx + 1}`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      dotIdx === activeIndex
                        ? 'w-8 bg-[#FFC000]'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State when no stories returned from API */}
        {!isLoading && totalStories === 0 && (
          <div className="py-16 text-center space-y-3 bg-white/5 rounded-3xl border border-white/10 max-w-xl mx-auto p-8 shadow-sm">
            <Trophy className="w-10 h-10 text-amber-400 mx-auto opacity-80" />
            <h3 className="text-base font-serif font-black text-white">
              {lang === 'bn' ? 'কোনো সাফল্যের গল্প পাওয়া যায়নি' : 'No Success Stories Yet'}
            </h3>
            <p className="text-xs text-slate-300">
              {lang === 'bn'
                ? 'প্রথম শিক্ষার্থী হিসেবে আপনার সাফল্যের অভিজ্ঞতা এখানে শেয়ার করুন!'
                : 'Be the first graduate to share your transformative journey with us!'}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#FFC000] text-slate-950 font-serif font-black text-xs hover:bg-[#E6AC00] transition-colors cursor-pointer"
              >
                {lang === 'bn' ? 'আপনার সাফল্যের গল্প লিখুন' : 'Submit First Story'}
              </button>
            </div>
          </div>
        )}

        {/* Bottom Banner */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-[#FFC000] flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-serif font-black text-white">
                {lang === 'bn'
                  ? 'আপনিও কি সফলতার এই যাত্রায় অংশ নিতে চান?'
                  : 'Ready to build your corporate success story?'}
              </h4>
              <p className="text-xs text-slate-300">
                {lang === 'bn'
                  ? 'আমাদের কোর্সগুলো সম্পন্ন করে আজই নিজের ক্যারিয়ারকে নতুন উচ্চতায় নিয়ে যান।'
                  : 'Enroll in our practical executive masterclasses and become part of our elite alumni network.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#FFC000]" />
            <span>{lang === 'bn' ? 'গল্প সাবমিট করুন' : 'Submit Story'}</span>
          </button>
        </div>
      </div>

      {/* MODAL 1: SUBMIT SUCCESS STORY FORM */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 text-white rounded-3xl border border-amber-400/40 shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-[#FFC000] text-xs font-bold mb-1.5">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'অ্যালামনাই সাফল্য বিবরণী' : 'Student Success Submission'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-black text-white">
                  {lang === 'bn' ? 'আপনার সাফল্যের গল্প জমা দিন' : 'Share Your Success Story'}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  {lang === 'bn'
                    ? 'আপনার অভিজ্ঞতা ভবিষ্যৎ শিক্ষার্থীদের অনুপ্রাণিত করবে। অ্যাডমিন অনুমোদনের পর এটি হোমপেজে প্রদর্শিত হবে।'
                    : 'Your story will inspire future learners. Submissions are reviewed by the admin team before publication.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Messages */}
            {submitSuccess && (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 flex items-start gap-2.5 text-xs sm:text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{submitSuccess}</span>
              </div>
            )}

            {submitError && (
              <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 flex items-start gap-2.5 text-xs sm:text-sm">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmitStory} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200 flex items-center gap-1.5">
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
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200 flex items-center gap-1.5">
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
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#FFC000]" />
                    <span>{lang === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 01700000000"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#FFC000]" />
                    <span>{lang === 'bn' ? 'ব্যাচ / সেশন' : 'Batch / Session'}</span>
                  </label>
                  <input
                    type="text"
                    name="batch"
                    value={formData.batch}
                    onChange={handleInputChange}
                    placeholder="e.g. Batch 12 or 2026"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#FFC000]" />
                    <span>{lang === 'bn' ? 'পদবী' : 'Designation'}</span>
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="e.g. Finance Manager"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#FFC000]" />
                    <span>{lang === 'bn' ? 'কোম্পানি / প্রতিষ্ঠান' : 'Company / Organization'}</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="e.g. ABC Ltd"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-[#FFC000]" />
                  <span>{lang === 'bn' ? 'ভিডিও লিংক (ঐচ্ছিক)' : 'Video Link (Optional YouTube / Vimeo)'}</span>
                </label>
                <input
                  type="url"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 flex items-center gap-1.5">
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
                      : 'Describe how the course impacted your professional skills, promotions, real-world execution, and career growth...'
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 resize-y"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-slate-900 text-white rounded-3xl border border-amber-400/50 p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center font-serif font-black text-xl text-slate-950">
                  {selectedStory.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-serif font-black text-white">{selectedStory.name}</h3>
                  <p className="text-xs text-amber-300 font-medium">
                    {selectedStory.designation || 'Alumni'}
                    {selectedStory.company ? ` • ${selectedStory.company}` : ''}
                  </p>
                  {selectedStory.batch && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      Batch: {selectedStory.batch}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStory(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 max-h-80 overflow-y-auto">
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line italic">
                "{selectedStory.story}"
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
                  className="px-4 py-2 rounded-xl bg-red-600/20 text-red-300 border border-red-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-red-400 text-red-400" />
                  <span>{lang === 'bn' ? 'ভিডিও দেখুন' : 'Watch Video'}</span>
                </button>
              ) : <div />}

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
                <span>{lang === 'bn' ? 'সাফল্যের ভিডিও সাক্ষাৎকার' : 'Success Story Video Interview'}</span>
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
