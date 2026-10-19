'use client';

import React, { useState, useMemo } from 'react';

interface BrandLogoProps {
  logo?: string | null;
  secondaryLogo?: string | null;
  icon?: string | null;
  name?: string | null;
  className?: string;
  imageClassName?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

function DynamicLogoImage({
  candidateUrls,
  name,
  className,
  imageClassName,
  onAllFailed,
}: {
  candidateUrls: string[];
  name?: string | null;
  className: string;
  imageClassName: string;
  onAllFailed: () => void;
}) {
  const [candidateIndex, setCandidateIndex] = useState<number>(0);
  const [hasImageLoaded, setHasImageLoaded] = useState<boolean>(false);

  const handleImageError = () => {
    if (candidateIndex + 1 < candidateUrls.length) {
      setCandidateIndex((prev) => prev + 1);
    } else {
      onAllFailed();
    }
  };

  const currentSrc = candidateUrls[candidateIndex];
  if (!currentSrc) return null;

  return (
    <div className={`inline-flex items-center ${className}`}>
      {/* 
        Clean, seamless image rendering with NO box container in both light and dark mode.
        - Dark Mode: original crisp white logo sits directly on the dark navbar (dark:brightness-100).
        - Light Mode: crisp dark silhouette sits directly on the light navbar (brightness-0).
      */}
      <img
        key={currentSrc}
        src={currentSrc}
        alt={name || 'Logo'}
        className={`${imageClassName} transition-all duration-200 brightness-0 dark:brightness-100 ${
          hasImageLoaded ? 'opacity-100' : 'opacity-90'
        }`}
        onError={handleImageError}
        onLoad={() => setHasImageLoaded(true)}
        loading="eager"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export default function BrandLogo({
  logo,
  secondaryLogo,
  icon,
  name = 'Chartered Officer Limited',
  className = '',
  imageClassName = 'h-8 sm:h-9 w-auto max-w-[190px] object-contain',
  showText = true,
  size = 'md',
}: BrandLogoProps) {
  // Construct ordered list of candidate URLs to try
  const candidateUrls = useMemo(() => {
    const list: string[] = [];

    const addSource = (rawUrl?: string | null) => {
      if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) return;
      const clean = rawUrl.trim();

      // If it's a localhost / 127.0.0.1 URL, extract the relative pathname first (e.g. /system-images/logos/...)
      // This allows the browser on HTTPS to fetch the local asset directly without mixed-content or private network blocks
      try {
        if (clean.includes('127.0.0.1') || clean.includes('localhost')) {
          const parsed = new URL(clean);
          list.push(parsed.pathname); // e.g. /system-images/logos/1-...
          list.push(clean);           // direct http://127.0.0.1:8000/...
          list.push(`/api/image-proxy?url=${encodeURIComponent(clean)}`);
          list.push(`https://cfoedubd.com${parsed.pathname}`);
          return;
        }
      } catch {
        // Fall through if not a full URL
      }

      // Direct URL
      list.push(clean);

      // Proxied URL fallback if absolute HTTP/HTTPS
      if (clean.startsWith('http://') || clean.startsWith('https://')) {
        list.push(`/api/image-proxy?url=${encodeURIComponent(clean)}`);
      }
    };

    addSource(logo);
    addSource(secondaryLogo);
    addSource(icon);

    // Guaranteed local static assets from user backend
    list.push('/system-images/logos/1-20261019091913-1918716266-1383413678.png');
    list.push('/system-images/secondary-logos/1-20261019091913-1674967601-379277783.png');
    list.push('/logo.png');
    list.push('/secondary-logo.png');
    list.push('/system-images/logos/col-logo.png');

    // Deduplicate while preserving order
    return Array.from(new Set(list));
  }, [logo, secondaryLogo, icon]);

  const [failedUrlKey, setFailedUrlKey] = useState<string>('');
  const currentKey = candidateUrls.join('|');
  const allCandidatesFailed = candidateUrls.length === 0 || failedUrlKey === currentKey;

  // Render dynamic image if candidate URLs exist and haven't all failed
  if (!allCandidatesFailed && candidateUrls.length > 0) {
    return (
      <DynamicLogoImage
        key={currentKey}
        candidateUrls={candidateUrls}
        name={name}
        className={className}
        imageClassName={imageClassName}
        onAllFailed={() => setFailedUrlKey(currentKey)}
      />
    );
  }

  // Fallback branded monogram badge when no image or all failed
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  return (
    <div className={`inline-flex items-center gap-2.5 group whitespace-nowrap ${className}`}>
      <div
        className={`${
          isLarge ? 'w-11 h-11' : isSmall ? 'w-8 h-8' : 'w-9 h-9 sm:w-10 sm:h-10'
        } rounded-xl bg-gradient-to-br from-[#0A192F] via-[#0D254C] to-[#1E3A8A] flex items-center justify-center shadow-md border border-[#FFC000]/70 relative group-hover:scale-105 transition-transform shrink-0`}
      >
        <span
          className={`font-serif font-black ${
            isLarge ? 'text-base' : isSmall ? 'text-xs' : 'text-sm sm:text-base'
          } text-[#FFC000] tracking-tight`}
        >
          COL
        </span>
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#FFC000] rounded-full border border-white dark:border-slate-900" />
      </div>

      {showText && (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span
            className={`font-serif font-black ${
              isLarge ? 'text-2xl sm:text-3xl' : isSmall ? 'text-lg' : 'text-xl sm:text-2xl'
            } tracking-tight text-slate-950 dark:text-white leading-none`}
          >
            {name ? name.split(' ')[0] : 'COL'}
            <span className="text-[#FFC000]">.</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hidden sm:inline-block">
            cfoedubd.com
          </span>
        </div>
      )}
    </div>
  );
}
