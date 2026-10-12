'use client';

import React, { useState, useEffect, useId } from 'react';
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
  Layers,
  ChevronRight,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { SuccessStoryItem } from '@/data/success-stories-data';

interface SuccessStoriesSectionProps {
  lang: 'bn' | 'en';
}

export default function SuccessStoriesSection({ lang }: SuccessStoriesSectionProps) {
  const [stories, setStories] = useState<SuccessStoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
            if (directJson && directJson.success && Array.isArray(directJson.data) && directJson.data.length > 0) {
              if (isMounted) {
                setStories(directJson.data);
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
            }
          }
        }
      } catch {
        // Keep initial fallback stories
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
      // 1. Try direct call to local backend endpoint first:
      // http://127.0.0.1:8000/api/success-stories/submit?student_name=...
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

      // 2. Fallback to Next.js API route
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

      // Reset form
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

      // Close modal after 2.5 seconds
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

  // Helper to extract embeddable video URL (YouTube, Vimeo, etc.)
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

  // Divide stories for futuristic Pyramid layout:
  // Top of pyramid: Apex Featured Story (1st item, largest prominent pedestal)
  // Mid tier: 2 items (Next 2 stories in 2-column wider cards)
  // Base tier: Remaining stories (3-column grid foundation)
  const apexStory = stories[0] || null;
  const midStories = stories.slice(1, 3);
  const baseStories = stories.slice(3);

  return (
    <section id="success-stories" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#060D1A] via-[#0A192F] to-[#040A14] text-white">
      {/* Futuristic Background Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-amber-500/10 via-amber-400/5 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 -right-40 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full" />
        {/* Subtle Futuristic Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-12">
        {/* Header & Call To Action */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-4 border-b border-white/10">
          <div className="text-center lg:text-left space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-400/10 border border-amber-400/40 text-xs font-bold text-[#FFC000]">
              <Trophy className="w-4 h-4 text-[#FFC000] animate-pulse" />
              <span>
                {lang === 'bn' ? 'অ্যালামনাই ও শিক্ষার্থীদের সাফল্যের গল্প' : 'Student & Alumni Success Stories'}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white">
              {lang === 'bn' ? (
                <>
                  আমাদের শিক্ষার্থীদের{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#FFC000] to-[#E6AC00]">
                    সাফল্যের গল্প
                  </span>
                </>
              ) : (
                <>
                  Inspiring{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#FFC000] to-[#E6AC00]">
                    Success Stories
                  </span>
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {lang === 'bn'
                ? 'সিএফও এডুকেশন বিডি থেকে প্রশিক্ষণ নিয়ে শীর্ষস্থানীয় কর্পোরেট কোম্পানি ও পেশাগত জীবনে শিক্ষার্থীদের অসাধারণ অর্জন।'
                : 'Real achievements and transformative career advancements of our graduates across leading corporate enterprises.'}
            </p>
          </div>

          {/* Submit Story Action Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FFC000] via-[#E6AC00] to-[#C8963E] text-slate-950 font-serif font-black text-sm shadow-[0_0_25px_rgba(255,192,0,0.35)] hover:shadow-[0_0_35px_rgba(255,192,0,0.55)] transition-all transform hover:-translate-y-0.5 cursor-pointer border border-amber-300"
            >
              <PlusCircle className="w-4 h-4 text-slate-950 transition-transform group-hover:rotate-90 duration-300" />
              <span>
                {lang === 'bn' ? 'আপনার সাফল্যের গল্প লিখুন' : 'Share Your Success Story'}
              </span>
              <Sparkles className="w-4 h-4 text-slate-950 opacity-75 group-hover:opacity-100" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-20 text-center space-y-4">
            <div className="w-12 h-12 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-300">
              {lang === 'bn' ? 'সাফল্যের গল্পগুলো লোড হচ্ছে...' : 'Loading success stories from API...'}
            </p>
          </div>
        )}

        {/* FUTURISTIC PYRAMID ARCHITECTURE */}
        {!isLoading && stories.length > 0 && (
          <div className="space-y-6 pt-4">
            {/* 1. APEX OF THE PYRAMID (The Prime Featured Story) */}
            {apexStory && (
              <div className="max-w-4xl mx-auto">
                <div className="relative group rounded-3xl bg-gradient-to-b from-[#132A4D]/90 via-[#0D2140]/90 to-[#0A192F]/95 p-6 sm:p-8 border-2 border-amber-400/60 shadow-[0_0_40px_rgba(255,192,0,0.15)] hover:shadow-[0_0_60px_rgba(255,192,0,0.25)] transition-all backdrop-blur-xl">
                  {/* Glowing Top Crown */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 via-[#FFC000] to-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'শীর্ষ সাফল্যের গল্প' : 'Featured Highlight'}</span>
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-2">
                    <div className="flex items-center gap-4">
                      {/* Avatar with Futuristic Holographic Border */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 p-[2px] shrink-0 shadow-lg">
                        <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center overflow-hidden">
                          {apexStory.photo ? (
                            <img
                              src={apexStory.photo}
                              alt={apexStory.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-amber-900/60 to-slate-900 flex items-center justify-center text-amber-300 font-serif font-black text-2xl">
                              {apexStory.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#FFC000] text-slate-950 flex items-center justify-center text-xs font-black shadow-md">
                          ★
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-xl sm:text-2xl font-serif font-black text-white flex items-center gap-2">
                          <span>{apexStory.name}</span>
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-amber-300 font-bold">
                          {apexStory.designation && <span>{apexStory.designation}</span>}
                          {apexStory.company && (
                            <span className="flex items-center gap-1 text-slate-300">
                              <Building2 className="w-3.5 h-3.5 text-amber-400" />
                              {apexStory.company}
                            </span>
                          )}
                          {apexStory.batch && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-[#FFC000] border border-amber-400/30 text-[10px] font-mono font-bold">
                              {apexStory.batch}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Video Action Button if available */}
                    {apexStory.video_url && (
                      <button
                        type="button"
                        onClick={() => setActiveVideoUrl(apexStory.video_url || null)}
                        className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md group/vid shrink-0"
                      >
                        <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center group-hover/vid:scale-110 transition-transform">
                          <Play className="w-3 h-3 fill-white ml-0.5" />
                        </div>
                        <span>{lang === 'bn' ? 'ভিডিও সাক্ষাৎকার দেখুন' : 'Watch Video Story'}</span>
                      </button>
                    )}
                  </div>

                  {/* Story Text Box with Futuristic Quote */}
                  <div className="relative mt-6 pt-5 border-t border-white/10">
                    <Quote className="absolute -top-3 left-4 w-7 h-7 text-amber-400/30 rotate-180" />
                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans pl-6 italic">
                      "{apexStory.story}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. MID-TIER OF THE PYRAMID (2-Column Pillars) */}
            {midStories.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {midStories.map((story) => (
                  <div
                    key={story.id}
                    className="relative rounded-2xl bg-gradient-to-b from-[#0F223D]/90 to-[#0A192F]/90 p-6 border border-amber-400/30 hover:border-amber-400/60 shadow-lg hover:shadow-[0_0_30px_rgba(255,192,0,0.15)] transition-all backdrop-blur-md flex flex-col justify-between gap-4 group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/30 to-slate-800 p-[1.5px] shrink-0">
                            <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-amber-300 font-serif font-black text-lg">
                              {story.name.charAt(0)}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-base font-serif font-black text-white group-hover:text-[#FFC000] transition-colors">
                              {story.name}
                            </h4>
                            <p className="text-xs text-amber-300 font-medium">
                              {story.designation || (lang === 'bn' ? 'প্রফেশনাল গ্র্যাজুয়েট' : 'Professional Graduate')}
                              {story.company ? ` • ${story.company}` : ''}
                            </p>
                          </div>
                        </div>

                        {story.batch && (
                          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300 font-bold shrink-0">
                            {story.batch}
                          </span>
                        )}
                      </div>

                      {/* Story Snippet */}
                      <div className="relative pl-4 border-l-2 border-amber-400/40">
                        <p className="text-xs sm:text-sm text-slate-300 line-clamp-4 leading-relaxed italic">
                          "{story.story}"
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedStory(story)}
                        className="text-xs font-bold text-[#FFC000] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{lang === 'bn' ? 'সম্পূর্ণ গল্প পড়ুন' : 'Read Full Story'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      {story.video_url && (
                        <button
                          type="button"
                          onClick={() => setActiveVideoUrl(story.video_url || null)}
                          className="px-2.5 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Play className="w-2.5 h-2.5 fill-red-400 text-red-400" />
                          <span>{lang === 'bn' ? 'ভিডিও' : 'Video'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. BASE-TIER OF THE PYRAMID (3-Column Foundation Cards) */}
            {baseStories.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto pt-2">
                {baseStories.map((story) => (
                  <div
                    key={story.id}
                    className="rounded-2xl bg-slate-900/80 p-5 border border-white/10 hover:border-amber-400/40 shadow-md hover:shadow-xl transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-lg bg-slate-800 text-amber-400 font-serif font-black flex items-center justify-center text-sm border border-slate-700">
                            {story.name.charAt(0)}
                          </div>
                          <div>
                            <h5 className="text-sm font-serif font-black text-white group-hover:text-[#FFC000] transition-colors line-clamp-1">
                              {story.name}
                            </h5>
                            <p className="text-[11px] text-slate-400 line-clamp-1">
                              {story.designation || 'Alumni'}
                              {story.company ? ` • ${story.company}` : ''}
                            </p>
                          </div>
                        </div>

                        {story.batch && (
                          <span className="text-[10px] font-mono text-amber-400/80 font-bold shrink-0">
                            {story.batch}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed italic">
                        "{story.story}"
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setSelectedStory(story)}
                        className="text-[11px] font-bold text-amber-400 hover:underline cursor-pointer"
                      >
                        {lang === 'bn' ? 'বিস্তারিত' : 'View Details'}
                      </button>

                      {story.video_url && (
                        <button
                          type="button"
                          onClick={() => setActiveVideoUrl(story.video_url || null)}
                          className="text-[11px] font-bold text-red-400 flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <Play className="w-2.5 h-2.5 fill-red-400" />
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
        {!isLoading && stories.length === 0 && (
          <div className="py-16 text-center space-y-3 bg-white/5 rounded-3xl border border-white/10 max-w-xl mx-auto p-6">
            <Trophy className="w-10 h-10 text-amber-400 mx-auto opacity-70" />
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

        {/* Bottom Banner with Verification & Community Stats */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900/60 to-blue-500/10 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-[#FFC000] flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-serif font-black text-white">
                {lang === 'bn' ? 'আপনিও কি সফলতার এই যাত্রায় অংশ নিতে চান?' : 'Ready to build your corporate success story?'}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 text-white rounded-3xl border-2 border-amber-400/60 shadow-[0_0_50px_rgba(255,192,0,0.25)] p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold mb-1.5">
                  <Trophy className="w-3.5 h-3.5 text-[#FFC000]" />
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
                {/* Student Name */}
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
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                {/* Email */}
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
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                {/* Phone */}
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
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                {/* Batch */}
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
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                {/* Designation */}
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
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                {/* Company */}
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
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Video URL */}
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
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Story Details */}
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
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 resize-y"
                />
              </div>

              {/* Submit Buttons */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-slate-900 text-white rounded-3xl border-2 border-amber-400/50 p-6 sm:p-8 space-y-5 shadow-2xl">
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

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 max-h-80 overflow-y-auto">
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
                className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: VIDEO PLAYER MODAL */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-slate-900 rounded-3xl border-2 border-amber-400/50 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-white/10">
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
