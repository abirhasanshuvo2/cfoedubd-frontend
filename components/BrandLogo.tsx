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
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        key={currentSrc}
        src={currentSrc}
        alt={name || 'Logo'}
        className={`${imageClassName} transition-opacity duration-300 ${hasImageLoaded ? 'opacity-100' : 'opacity-90'}`}
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
  imageClassName = 'h-9 sm:h-10 w-auto max-w-[190px] object-contain',
  showText = true,
  size = 'md',
}: BrandLogoProps) {
  // Construct ordered list of candidate URLs to try
  const candidateUrls = useMemo(() => {
    const list: string[] = [];

    const addSource = (rawUrl?: string | null) => {
      if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) return;
      const clean = rawUrl.trim();
      // 1. Direct URL first
      list.push(clean);
      // 2. Proxied URL fallback if absolute HTTP/HTTPS
      if (clean.startsWith('http://') || clean.startsWith('https://')) {
        list.push(`/api/image-proxy?url=${encodeURIComponent(clean)}`);
      }
    };

    addSource(logo);
    addSource(secondaryLogo);
    addSource(icon);

    return list;
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
