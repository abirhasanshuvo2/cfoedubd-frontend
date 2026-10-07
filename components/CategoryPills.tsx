'use client';

import React, { useRef, useMemo } from 'react';
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
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  lang: 'bn' | 'en';
}

interface DynamicCategory {
  id: string;
  label: string;
  labelEn: string;
  icon: string;
  count: number;
}

export default function CategoryPills({
  selectedCategory,
  onSelectCategory,
  lang,
}: CategoryPillsProps) {
  const { courses } = useCfo();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate 100% dynamic categories derived from active API courses
  const dynamicCategories = useMemo<DynamicCategory[]>(() => {
    const list: DynamicCategory[] = [];
    const courseList = Array.isArray(courses) ? courses : [];

    // 1. All Courses Pill (Total count)
    list.push({
      id: 'all',
      label: 'সব কোর্স ও ডিপ্লোমা',
      labelEn: 'All Courses & Diplomas',
      icon: 'Sparkles',
      count: courseList.length,
    });

    if (courseList.length === 0) {
      // Graceful fallback while loading
      return CATEGORIES.map((cat) => ({
        ...cat,
        count: 0,
      }));
    }

    // 2. Count courses per category
    const categoryCounts = new Map<string, { count: number; label: string; labelEn?: string }>();

    courseList.forEach((c) => {
      const catKey = c.category || 'other';
      const existing = categoryCounts.get(catKey);
      if (existing) {
        existing.count += 1;
      } else {
        categoryCounts.set(catKey, {
          count: 1,
          label: c.categoryLabel || c.category || 'Other',
          labelEn: c.category || c.categoryLabel,
        });
      }
    });

    // 3. Match with known catalog definitions or dynamically infer icon & labels
    categoryCounts.forEach((info, catKey) => {
      const known = CATEGORIES.find((item) => item.id === catKey);
      if (known) {
        list.push({
          id: known.id,
          label: known.label,
          labelEn: known.labelEn,
          icon: known.icon,
          count: info.count,
        });
      } else {
        // Smart icon selection based on category slug/name
        let iconName = 'BookOpen';
        const lowerKey = `${catKey} ${info.label}`.toLowerCase();
        if (lowerKey.includes('cfo') || lowerKey.includes('finance') || lowerKey.includes('executive')) {
          iconName = 'Award';
        } else if (lowerKey.includes('tax') || lowerKey.includes('vat') || lowerKey.includes('customs')) {
          iconName = 'FileText';
        } else if (lowerKey.includes('sap') || lowerKey.includes('erp') || lowerKey.includes('fintech')) {
          iconName = 'Cpu';
        } else if (lowerKey.includes('valuation') || lowerKey.includes('fp&a') || lowerKey.includes('market')) {
          iconName = 'TrendingUp';
        } else if (lowerKey.includes('supply') || lowerKey.includes('scm') || lowerKey.includes('logistics')) {
          iconName = 'Truck';
        } else if (lowerKey.includes('hrm') || lowerKey.includes('people') || lowerKey.includes('law')) {
          iconName = 'Users';
        } else if (lowerKey.includes('audit') || lowerKey.includes('ifrs') || lowerKey.includes('compliance')) {
          iconName = 'ShieldCheck';
        } else if (lowerKey.includes('code') || lowerKey.includes('cse') || lowerKey.includes('software') || lowerKey.includes('dev')) {
          iconName = 'Code';
        }

        list.push({
          id: catKey,
          label: info.label,
          labelEn: info.labelEn || info.label,
          icon: iconName,
          count: info.count,
        });
      }
    });

    return list;
  }, [courses]);

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
      case 'BookOpen':
        return <BookOpen className={iconClass} />;
      case 'Layers':
        return <Layers className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
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
        {dynamicCategories.map((category) => {
          const isSelected = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all shrink-0 cursor-pointer border ${
                isSelected
                  ? 'bg-[#111827] dark:bg-[#0F172A] text-white border-[#111827] dark:border-amber-500/50 shadow-sm'
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

              {/* Title & Live Count */}
              <div className="leading-tight">
                <p className={`text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap ${isSelected ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                  {lang === 'bn' ? category.label : category.labelEn}
                </p>
                <p className={`text-[10px] font-medium mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                  • {category.count} {lang === 'bn' ? 'কোর্স' : 'courses'}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Right Scroll Arrow Button */}
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
