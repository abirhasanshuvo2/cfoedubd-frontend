'use client';

import React from 'react';
import { CATEGORIES } from '@/data/cfo-data';
import {
  Sparkles,
  Award,
  FileText,
  Cpu,
  TrendingUp,
  Truck,
  Users,
  ShieldCheck
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
  const getIcon = (iconName: string, isSelected: boolean) => {
    const className = `w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-slate-600'}`;
    switch (iconName) {
      case 'Award':
        return <Award className={className} />;
      case 'FileText':
        return <FileText className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      case 'TrendingUp':
        return <TrendingUp className={className} />;
      case 'Truck':
        return <Truck className={className} />;
      case 'Users':
        return <Users className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <nav className="w-full overflow-x-auto pb-1 scrollbar-none" aria-label="Course Categories Filter">
      <div className="flex items-center gap-1.5 min-w-max p-1.5 bg-slate-200/70 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#DFB257] via-[#C8963E] to-[#A97B28] text-slate-950 font-bold shadow-md'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white shadow-2xs border border-slate-200/60 dark:border-slate-700'
              }`}
            >
              {getIcon(category.icon, isSelected)}
              <span>{lang === 'bn' ? category.label : category.labelEn}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
