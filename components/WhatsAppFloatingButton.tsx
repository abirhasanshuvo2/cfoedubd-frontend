'use client';

import React, { useState } from 'react';
import { useCfo } from '@/context/CfoContext';
import { MessageCircle, X, Sparkles } from 'lucide-react';

export default function WhatsAppFloatingButton() {
  const { systemInfo, lang } = useCfo();
  const [isOpen, setIsOpen] = useState(false);

  // Extract WhatsApp number dynamically from backend systemInfo
  // Checks whatsapp_no, whatsapp, mobile, phone with fallback to official +8801713378787
  const rawNumber =
    (systemInfo as any)?.whatsapp_no ||
    (systemInfo as any)?.whatsapp ||
    (systemInfo as any)?.whatsappNo ||
    systemInfo.mobile ||
    systemInfo.phone ||
    '+8801713378787';

  // Sanitize number: strip spaces, dashes, parentheses and ensure country code format for wa.me URL
  const cleanNumber = String(rawNumber).replace(/[^\d+]/g, '').replace(/^\+/, '');

  // Pre-filled greeting message for executive inquiry
  const defaultMessage =
    lang === 'bn'
      ? 'আসসালামু আলাইকুম, আমি চার্টার্ড অফিসার লিমিটেড (COL)-এর প্রফেশনাল কোর্স ও এক্সিকিউটিভ প্রোগ্রাম সম্পর্কে তথ্য জানতে চাই।'
      : 'Hello, I would like to inquire about the executive professional programs at Chartered Officer Limited (COL).';

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">
      {/* Tooltip / Quick Chat Bubble Popup */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="bg-[#075E54] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-500/30 flex items-center justify-center border border-white/20">
                <MessageCircle className="w-5 h-5 text-emerald-200 fill-emerald-200" />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">
                  {lang === 'bn' ? 'হোয়াটসঅ্যাপ হেল্পডেস্ক' : 'WhatsApp Helpdesk'}
                </h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  {lang === 'bn' ? 'অনলাইন সাপোর্ট' : 'Online Support'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close WhatsApp popup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 space-y-3">
            <div className="bg-white p-3 rounded-xl rounded-tl-none border border-slate-200 text-xs text-slate-700 shadow-2xs leading-relaxed">
              <p className="font-semibold text-slate-900 mb-1">
                {systemInfo.name || 'Chartered Officer Limited'}
              </p>
              <p>
                {lang === 'bn'
                  ? 'স্বাগতম! আমাদের এক্সিকিউটিভ কোর্স ও ক্যারিয়ার অ্যাডমিশন নিয়ে সরাসরি কথা বলতে নিচের বাটনে ক্লিক করুন।'
                  : 'Welcome! Click below to chat directly with our executive admissions counselor on WhatsApp.'}
              </p>
              <div className="mt-2 text-[10px] text-slate-400 font-mono">
                {rawNumber}
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{lang === 'bn' ? 'মেসেজ শুরু করুন' : 'Start WhatsApp Chat'}</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <div className="relative group">
        {/* Pulsing ring indicator */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 group-hover:opacity-60 blur-xs transition-opacity animate-pulse pointer-events-none" />

        <div className="flex items-center gap-2">
          {/* Label visible on hover on larger screens */}
          {!isOpen && (
            <button
              onClick={() => setIsOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-semibold shadow-lg backdrop-blur-xs hover:bg-slate-900 transition-all border border-slate-700/50"
            >
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
              <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে চ্যাট' : 'Chat on WhatsApp'}</span>
            </button>
          )}

          {/* Main Round Floating Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              // On desktop, toggle the mini card if clicked with left mouse, or allow direct navigation
              if (!isOpen && window.innerWidth >= 768) {
                e.preventDefault();
                setIsOpen(true);
              }
            }}
            className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-emerald-300"
            aria-label="Chat on WhatsApp"
            title={rawNumber ? `WhatsApp: ${rawNumber}` : 'Chat on WhatsApp'}
          >
            {/* Official WhatsApp SVG Icon */}
            <svg
              className="w-8 h-8 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>

            {/* Notification Badge */}
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border-2 border-white"></span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
