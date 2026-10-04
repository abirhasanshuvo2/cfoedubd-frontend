'use client';

import React, { useState } from 'react';
import { useCfo } from '@/context/CfoContext';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppFloatingButton() {
  const { systemInfo, lang } = useCfo();
  const [isOpen, setIsOpen] = useState(false);

  // Extract WhatsApp number dynamically from backend systemInfo
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
    <div className="fixed bottom-16 sm:bottom-5 right-3.5 sm:right-5 z-40 flex flex-col items-end print:hidden">
      {/* Quick Chat Bubble Popup */}
      {isOpen && (
        <div className="mb-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800/60 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150">
          {/* Header */}
          <div className="bg-[#075E54] text-white px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500/30 flex items-center justify-center border border-white/20">
                <MessageCircle className="w-3.5 h-3.5 text-white fill-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">
                  {lang === 'bn' ? 'হোয়াটসঅ্যাপ সাপোর্ট' : 'WhatsApp Support'}
                </h4>
                <p className="text-[9px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  {lang === 'bn' ? 'অনলাইন' : 'Online'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close WhatsApp popup"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Body */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-950 space-y-2">
            <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 shadow-2xs leading-relaxed">
              <p className="font-semibold text-slate-900 dark:text-white text-[11px] mb-0.5">
                {systemInfo.name || 'Chartered Officer Limited'}
              </p>
              <p className="text-[10.5px]">
                {lang === 'bn'
                  ? 'কোর্স ও ভর্তি তথ্যে সরাসরি হোয়াটসঅ্যাপে চ্যাট করুন।'
                  : 'Chat directly with our counselor on WhatsApp.'}
              </p>
              <div className="mt-1 text-[10px] text-slate-400 font-mono">
                {rawNumber}
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-1.5 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="w-3 h-3 fill-white" />
              <span>{lang === 'bn' ? 'মেসেজ পাঠান' : 'Start Chat'}</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) - Compact & Elegant (Smaller Size) */}
      <div className="relative flex items-center">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!isOpen && window.innerWidth >= 768) {
              e.preventDefault();
              setIsOpen(true);
            }
          }}
          className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
          aria-label="Chat on WhatsApp"
          title={rawNumber ? `WhatsApp: ${rawNumber}` : 'Chat on WhatsApp'}
        >
          {/* Official WhatsApp SVG Icon - Smaller and Crisp */}
          <svg
            className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
