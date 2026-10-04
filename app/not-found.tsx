import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A192F] text-white flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="inline-block p-4 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-6xl font-serif font-black text-[#E5A93C]">404</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-white">পৃষ্ঠাটি পাওয়া যায়নি (Page Not Found)</h1>
        <p className="text-sm text-slate-300">
          আপনি যে পেজটি খুঁজছেন তা স্থানান্তরিত হয়েছে অথবা লিঙ্কটি ভুল।
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C8963E] hover:bg-[#d6a44c] text-[#0A192F] font-bold text-sm shadow-md transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>হোমে ফিরে যান (Back to Home)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
