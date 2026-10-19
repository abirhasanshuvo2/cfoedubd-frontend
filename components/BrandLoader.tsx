'use client';

import React, { useState } from 'react';
import { useCfo } from '@/context/CfoContext';

interface BrandLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  label?: string | null;
  className?: string;
}

export default function BrandLoader({
  size = 'md',
  label,
  className = '',
}: BrandLoaderProps) {
  const { systemInfo, lang } = useCfo();
  const [candidateIdx, setCandidateIdx] = useState(0);
  const [allFailed, setAllFailed] = useState(false);

  // Resolve candidate icon URLs in order of preference
  const rawIcon = systemInfo?.icon;
  const candidates: string[] = [];

  if (rawIcon && typeof rawIcon === 'string' && rawIcon.trim()) {
    const clean = rawIcon.trim();
    try {
      if (clean.includes('127.0.0.1') || clean.includes('localhost')) {
        const parsed = new URL(clean);
        candidates.push(parsed.pathname); // e.g. /system-images/icons/1-20261019091913-1497231613-671002454.png
        candidates.push(clean);           // direct URL
        candidates.push(`/api/image-proxy?url=${encodeURIComponent(clean)}`);
        candidates.push(`https://cfoedubd.com${parsed.pathname}`);
      } else {
        candidates.push(clean);
        if (clean.startsWith('http://') || clean.startsWith('https://')) {
          candidates.push(`/api/image-proxy?url=${encodeURIComponent(clean)}`);
        }
      }
    } catch {
      candidates.push(clean);
    }
  }

  // Pre-cached local static icons from user backend
  candidates.push('/system-images/icons/1-20261019091913-1497231613-671002454.png');
  candidates.push('/icon.png');
  candidates.push('/system-images/icons/col-icon.png');
  candidates.push('/system-images/logos/1-20261019091913-1918716266-1383413678.png');
  candidates.push('/logo.png');

  const currentIconSrc = !allFailed && candidateIdx < candidates.length ? candidates[candidateIdx] : null;

  const handleIconError = () => {
    if (candidateIdx + 1 < candidates.length) {
      setCandidateIdx((prev) => prev + 1);
    } else {
      setAllFailed(true);
    }
  };

  const isFullscreen = size === 'fullscreen';
  const isLarge = size === 'lg' || isFullscreen;
  const isSmall = size === 'sm';

  const containerSizes = isSmall
    ? 'w-10 h-10'
    : isLarge
    ? 'w-20 h-20 sm:w-24 sm:h-24'
    : 'w-14 h-14 sm:w-16 sm:h-16';

  const iconSizes = isSmall
    ? 'w-6 h-6'
    : isLarge
    ? 'w-11 h-11 sm:w-13 sm:h-13'
    : 'w-8 h-8 sm:w-9 sm:h-9';

  const spinnerSizes = isSmall
    ? 'inset-[-4px] border-[2px]'
    : isLarge
    ? 'inset-[-8px] border-[3px]'
    : 'inset-[-6px] border-[2.5px]';

  const defaultLabel =
    label !== undefined
      ? label
      : lang === 'bn'
      ? 'লোড হচ্ছে...'
      : 'Loading...';

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3.5 py-4 ${className}`}>
      {/* Icon with spinning glowing halo */}
      <div className={`relative ${containerSizes} flex items-center justify-center`}>
        {/* Spinning golden ring */}
        <div
          className={`absolute ${spinnerSizes} rounded-full border-[#C8963E] border-t-transparent border-r-transparent animate-spin`}
        />
        {/* Soft pulse ring */}
        <div className="absolute inset-0 rounded-full bg-[#C8963E]/10 animate-ping opacity-60 pointer-events-none" />

        {/* Center Emblem/Icon Canvas with Midnight Navy background so white and colored icons pop prominently in both light and dark mode */}
        <div className="relative z-10 w-full h-full rounded-full bg-[#0A192F] dark:bg-slate-950 border border-[#C8963E]/40 shadow-lg flex items-center justify-center p-2.5 overflow-hidden">
          {currentIconSrc ? (
            <img
              src={currentIconSrc}
              alt="Loading..."
              className={`${iconSizes} object-contain animate-pulse drop-shadow-xs`}
              onError={handleIconError}
              loading="eager"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="font-serif font-black text-xs sm:text-sm text-[#FFC000] tracking-tight animate-pulse">
              COL
            </div>
          )}
        </div>
      </div>

      {defaultLabel && (
        <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 tracking-wide font-sans animate-pulse">
          {defaultLabel}
        </p>
      )}
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
}
