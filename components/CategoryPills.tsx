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
    const className = `w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-slate-500'}`;
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
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#C8963E] to-[#B8860B] text-slate-950 shadow-md font-bold ring-2 ring-amber-300/60'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {getIcon(category.icon, isSelected)}
              <span>{lang === 'bn' ? category.label : category.labelEn}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
