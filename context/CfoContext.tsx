'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Course,
  COURSES,
  ApiCourse,
  INITIAL_API_COURSES,
  adaptApiCourseToCfoCourse,
} from '@/data/cfo-data';
import { DEFAULT_SYSTEM_INFO, SystemInformation } from '@/data/system-info';

export interface CfoContextType {
  lang: 'bn' | 'en';
  setLang: (lang: 'bn' | 'en') => void;
  enrolledCourses: Course[];
  enrollInCourse: (course: Course) => void;
  user: { name: string; phone: string; email: string } | null;
  loginUser: (name: string, phone: string, email?: string) => void;
  loginAsDemo: () => void;
  logoutUser: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  systemInfo: SystemInformation;
  isLiveApiConnected: boolean;
  refreshSystemInfo: () => Promise<void>;
  courses: Course[];
  apiCourses: ApiCourse[];
  coursesLoading: boolean;
  refreshCourses: () => Promise<void>;
}

const CfoContext = createContext<CfoContextType | undefined>(undefined);

// Generate initial dynamic courses matching backend API catalog
const INITIAL_DYNAMIC_COURSES: Course[] = INITIAL_API_COURSES.map(adaptApiCourseToCfoCourse);

export function CfoProvider({ children }: { children: React.ReactNode }) {
  const [systemInfo, setSystemInfo] = useState<SystemInformation>(DEFAULT_SYSTEM_INFO);
  const [isLiveApiConnected, setIsLiveApiConnected] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Default values set statically for pristine SSR and hydration consistency
  const [lang, setLangState] = useState<'bn' | 'en'>('bn');
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<{ name: string; phone: string; email: string } | null>(null);

  // Live Courses from Backend API - strictly dynamic
  const [courses, setCourses] = useState<Course[]>(INITIAL_DYNAMIC_COURSES);
  const [apiCourses, setApiCourses] = useState<ApiCourse[]>(INITIAL_API_COURSES);
  const [coursesLoading, setCoursesLoading] = useState<boolean>(false);

  // Client-side hydration sync to safely read preferences and clear any legacy mock user sessions
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedLang = localStorage.getItem('cfo_lang') || localStorage.getItem('ostad_lang');
        if (savedLang === 'bn' || savedLang === 'en') {
          setLangState(savedLang);
        }
        // Remove any dark mode classes or storage keys
        localStorage.removeItem('cfo_theme');
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('dark');
        }
        // Explicitly clear any mock logged in user session per user requirement
        localStorage.removeItem('cfo_user');
        localStorage.removeItem('ostad_user');
        setUser(null);
      } catch {
        // ignore
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const setLang = (newLang: 'bn' | 'en') => {
    setLangState(newLang);
    try {
      localStorage.setItem('cfo_lang', newLang);
    } catch {
      // ignore
    }
  };

  const extractCoursesArray = (json: any): any[] => {
    if (!json) return [];
    if (Array.isArray(json)) return json;
    if (json.data && Array.isArray(json.data.data)) return json.data.data;
    if (json.data && Array.isArray(json.data)) return json.data;
    return [];
  };

  const fetchCourses = useCallback(async () => {
    setCoursesLoading(true);
    const directUrl = (process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

    // 1. Try local client-side direct fetch to user's backend http://127.0.0.1:8000/api/courses
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 1800);
      const res = await fetch(`${directUrl}/api/courses`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timer);
      if (res.ok) {
        const json = await res.json();
        const rawList = extractCoursesArray(json);
        if (rawList.length > 0) {
          setApiCourses(rawList);
          const adapted = rawList.map(adaptApiCourseToCfoCourse);
          setCourses(adapted);
          setIsLiveApiConnected(true);
          setCoursesLoading(false);
          return;
        }
      }
    } catch {
      // Fallback to Next.js API proxy route
    }

    // 2. Next.js internal proxy route
    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const json = await res.json();
        const rawList = extractCoursesArray(json);
        if (rawList.length > 0) {
          setApiCourses(rawList);
          const adapted = rawList.map(adaptApiCourseToCfoCourse);
          setCourses(adapted);
          if (json.isLive) {
            setIsLiveApiConnected(true);
          }
        }
      }
    } catch {
      // Keep dynamic courses
    } finally {
      setCoursesLoading(false);
    }
  }, []);

  const fetchSystemInfo = useCallback(async () => {
    const directUrl = (process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${directUrl}/api/system-information`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timer);
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          setSystemInfo(json.data);
          setIsLiveApiConnected(true);
          return;
        }
      }
    } catch {
      // Fallback to internal Next.js proxy
    }

    try {
      const res = await fetch('/api/system-information');
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          setSystemInfo(json.data);
          if (json.isLive) {
            setIsLiveApiConnected(true);
          }
        }
      }
    } catch {
      // keep default system info
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSystemInfo();
      fetchCourses();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchSystemInfo, fetchCourses]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const enrollInCourse = (course: Course) => {
    setEnrolledCourses((prev) => {
      if (prev.some((c) => c.id === course.id)) return prev;
      return [...prev, course];
    });
  };

  const loginUser = (name: string, phone: string, email?: string) => {
    const newUser = { name, phone, email: email || '' };
    setUser(newUser);
  };

  const loginAsDemo = () => {
    // Disabled
  };

  const logoutUser = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('cfo_user');
      } catch {
        // ignore
      }
    }
    showToast(lang === 'bn' ? 'সফলভাবে লগআউট সম্পন্ন হয়েছে!' : 'Successfully logged out!');
  };

  return (
    <CfoContext.Provider
      value={{
        lang,
        setLang,
        enrolledCourses,
        enrollInCourse,
        user,
        loginUser,
        loginAsDemo,
        logoutUser,
        toastMessage,
        showToast,
        systemInfo,
        isLiveApiConnected,
        refreshSystemInfo: fetchSystemInfo,
        courses,
        apiCourses,
        coursesLoading,
        refreshCourses: fetchCourses,
      }}
    >
      {children}
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[9999] max-w-sm animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-[#0A192F] text-white border border-[#C8963E]/60 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#C8963E] animate-ping" />
            <p className="text-xs font-semibold text-slate-100 flex-1">{toastMessage}</p>
          </div>
        </div>
      )}
    </CfoContext.Provider>
  );
}

export function useCfo() {
  const context = useContext(CfoContext);
  if (!context) {
    throw new Error('useCfo must be used within a CfoProvider');
  }
  return context;
}

export const OstadProvider = CfoProvider;
export const useOstad = useCfo;
