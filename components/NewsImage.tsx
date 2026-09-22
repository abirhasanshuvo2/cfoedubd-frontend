'use client';

import React, { useState } from 'react';
import { getCategoryDummyImage } from '@/lib/news-service';

interface NewsImageProps {
  src: string | null | undefined;
  alt: string;
  category?: string;
  className?: string;
}

export default function NewsImage({ src, alt, category, className = '' }: NewsImageProps) {
  const [loadState, setLoadState] = useState<'direct' | 'fallback'>('direct');
  const dummyFallback = getCategoryDummyImage(category);

  // If no src is returned by API, render dummy fallback
  if (!src || src.trim().length === 0) {
    return (
      <img
        src={dummyFallback}
        alt={alt}
        className={className}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    );
  }

  const rawUrl = src.trim();

  // Stage 1: Try rendering the raw response image URL directly without replacement
  if (loadState === 'direct') {
    return (
      <img
        src={rawUrl}
        alt={alt}
        className={className}
        referrerPolicy="no-referrer"
        onError={() => {
          // If browser blocked or failed to load the URL, fallback to dummy
          setLoadState('fallback');
        }}
      />
    );
  }

  // Stage 2: Fallback dummy image if the image URL couldn't load
  return (
    <img
      src={dummyFallback}
      alt={alt}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
}
