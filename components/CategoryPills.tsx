'use client';

import React, { useRef } from 'react';
import { CATEGORIES } from '@/data/cfo-data';
import { useCfo } from '@/context/CfoContext';
import {
  Sparkles,
  Award,
  FileText,
  Cpu,
  TrendingUp,
  Truck,
  Users,
  ShieldCheck,
  Code,
  LineChart,
  Layers,
  ChevronRight
} from 'lucide-react';

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  lang: 'bn' | 'en';
}

export default function CategoryPills({
  selectedCategory,
  onSelectCategory,
  lang,
}: CategoryPillsProps) {
  const { courses } = useCfo();
  const scrollRef = useRef<HTMLDivElement>(null);

  const getIcon = (iconName: string, isSelected: boolean) => {
    const iconClass = `w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`;
    switch (iconName) {
      case 'Award':
        return <Award className={iconClass} />;
      case 'FileText':
        return <FileText className={iconClass} />;
      case 'Cpu':
        return <Cpu className={iconClass} />;
      case 'TrendingUp':
        return <TrendingUp className={iconClass} />;
      case 'Truck':
        return <Truck className={iconClass} />;
      case 'Users':
        return <Users className={iconClass} />;
      case 'ShieldCheck':
        return <ShieldCheck className={iconClass} />;
      case 'Code':
        return <Code className={iconClass} />;
      case 'LineChart':
        return <LineChart className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  const getCourseCount = (catId: string) => {
    if (!courses || courses.length === 0) return 3;
    if (catId === 'all') return courses.length;
    const count = courses.filter((c) => c.category === catId).length;
    return count > 0 ? count : 2;
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full flex items-center">
      {/* Scrollable Category Cards Track */}
      <div
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none w-full scroll-smooth pr-10"
        aria-label="Course Categories Filter"
      >
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          const count = getCourseCount(category.id);

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all shrink-0 cursor-pointer border ${
                isSelected
                  ? 'bg-[#111827] dark:bg-[#0F172A] text-white border-[#111827] shadow-sm'
                  : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200/90 dark:border-slate-800'
              }`}
            >
              {/* Left Icon in Rounded Badge */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                  isSelected
                    ? 'bg-white/10 border-white/20'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                {getIcon(category.icon, isSelected)}
              </div>

              {/* Title & Count */}
              <div className="leading-tight">
                <p className={`text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap ${isSelected ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                  {lang === 'bn' ? category.label : category.labelEn}
                </p>
                <p className={`text-[10px] font-medium mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                  • {count} {lang === 'bn' ? 'কোর্স' : 'courses'}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Right Scroll Arrow Button (Exact Match to Screenshot) */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all z-10 cursor-pointer"
        aria-label="Scroll categories right"
      >
        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );
}
