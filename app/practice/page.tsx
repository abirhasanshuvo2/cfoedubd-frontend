'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCfo } from '@/context/CfoContext';
import { PRACTICE_CHALLENGES, PracticeChallenge } from '@/data/cfo-data';
import {
  Code,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Trophy,
  Terminal,
  Sparkles,
  BookOpen,
  Filter,
  Check,
  Clock,
  Layers,
  HelpCircle
} from 'lucide-react';

export default function PracticeArenaPage() {
  const { lang } = useCfo();
  const [selectedChallenge, setSelectedChallenge] = useState<PracticeChallenge>(PRACTICE_CHALLENGES[0]);
  const [code, setCode] = useState<string>(PRACTICE_CHALLENGES[0].starterCode);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[] | null>(null);
  const [activeTab, setActiveTab] = useState<'problem' | 'solution' | 'tests'>('problem');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [streakDays, setStreakDays] = useState<number>(7);

  const categories = ['All', 'JavaScript', 'React', 'Algorithms'];

  const filteredChallenges = PRACTICE_CHALLENGES.filter((c) => {
    if (filterCategory === 'All') return true;
    return c.category === filterCategory;
  });

  const handleSelectChallenge = (ch: PracticeChallenge) => {
    setSelectedChallenge(ch);
    setCode(ch.starterCode);
    setTestResults(null);
    setActiveTab('problem');
  };

  const handleResetCode = () => {
    setCode(selectedChallenge.starterCode);
    setTestResults(null);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      // Simulate test case evaluation
      const results = selectedChallenge.testCases.map((tc, idx) => ({
        passed: true,
        message: `Test Case #${idx + 1} (${tc.input}) => Passed [${tc.expectedOutput || tc.expected}]`,
      }));
      setTestResults(results);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      {/* Top Banner: Executive Header */}
      <section className="bg-slate-900 border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#C8963E] text-slate-950 flex items-center justify-center font-black text-sm">
                &lt;/&gt;
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {lang === 'bn' ? 'চার্টার্ড অফিসার ফিন্যান্স ও করপোরেট ল্যাব' : 'COL Corporate Finance & Tax Lab'}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C8963E]/20 text-[#E5A93C] border border-[#C8963E]/30">
                BOARDROOM SIM
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {lang === 'bn'
                ? 'কেস-বেসড লার্নিং: লাইভ ফিন্যান্সিয়াল মডেলিং, ট্যাক্স রিটার্ন হিসাব ও এসএপি-ফিকো অ্যালগরিদম স্যান্ডবক্স'
                : 'Case-Based Mastery: Solve executive financial models, corporate tax calculations, and ERP algorithms'}
            </p>
          </div>

          {/* Gamified Streak Badge */}
          <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl">
            <Flame className="w-5 h-5 text-amber-500 animate-bounce" />
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Daily Streak</p>
              <p className="text-sm font-black text-white">{streakDays} Days Fire 🔥</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Coding IDE Layout */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Challenge List & Details (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-[#FFC000] text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Challenge Selector Pills */}
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
            {filteredChallenges.map((ch) => (
              <div
                key={ch.id}
                onClick={() => handleSelectChallenge(ch)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  selectedChallenge.id === ch.id
                    ? 'bg-slate-900 border-[#FFC000] text-white shadow-xs'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        ch.difficulty === 'Easy'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : ch.difficulty === 'Medium'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {ch.difficulty}
                    </span>
                    <span className="text-[10px] text-slate-500">{ch.category}</span>
                  </div>
                  <p className="text-xs font-bold truncate">
                    {lang === 'bn' ? ch.title : ch.titleEn}
                  </p>
                </div>
                <span className="text-[11px] text-slate-500 shrink-0">{ch.timeEstimate}</span>
              </div>
            ))}
          </div>

          {/* Problem Details Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex-1 flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('problem')}
                  className={`text-xs font-bold pb-1 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'problem'
                      ? 'border-[#FFC000] text-[#FFC000]'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'bn' ? 'সমস্যার বিবরণ' : 'Problem Description'}
                </button>
                <button
                  onClick={() => setActiveTab('tests')}
                  className={`text-xs font-bold pb-1 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'tests'
                      ? 'border-[#FFC000] text-[#FFC000]'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'bn' ? 'টেস্ট কেস' : 'Test Cases'}
                </button>
              </div>

              <span className="text-xs text-slate-500 font-mono">
                {selectedChallenge.category}
              </span>
            </div>

            {activeTab === 'problem' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed overflow-y-auto max-h-[380px] pr-1">
                <h3 className="text-base font-black text-white">
                  {lang === 'bn' ? selectedChallenge.title : selectedChallenge.titleEn}
                </h3>

                <p>{selectedChallenge.description}</p>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'ইন্ডাস্ট্রি কনটেক্সট' : 'Real-world Context'}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {lang === 'bn'
                      ? 'এই মডেল ও হিসাবটি শীর্ষ করপোরেট গ্রুপ (যেমন Square, Beximco, Unilever, BRAC) এর সিএফও অফিস ও সিনিয়র ফিন্যান্সিয়াল কন্ট্রোলার পজিশনের অ্যাসেসমেন্টে বারবার ব্যবহৃত হয়।'
                      : 'Executive case model evaluated in strategic finance interviews, CFO assessment rounds, and Big 4 valuation audits.'}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">ট্যাগসমূহ:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedChallenge.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tests' && (
              <div className="space-y-3 overflow-y-auto max-h-[380px]">
                {selectedChallenge.testCases.map((tc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                    <p className="text-slate-500 font-bold">Case #{idx + 1}</p>
                    <p className="text-slate-300">
                      <span className="text-amber-400">Input:</span> {tc.input}
                    </p>
                    <p className="text-slate-300">
                      <span className="text-emerald-400">Expected:</span> {tc.expected}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Live Console (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Editor Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col flex-1 shadow-xl">
            <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400 ml-2">solution.js</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetCode}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors cursor-pointer"
                  title="Reset code"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">{lang === 'bn' ? 'রিসেট' : 'Reset'}</span>
                </button>

                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#FFC000] hover:bg-[#ffb000] text-slate-950 font-black text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunning ? (lang === 'bn' ? 'রান হচ্ছে...' : 'Executing...') : lang === 'bn' ? 'কোড রান করুন' : 'Run Tests'}</span>
                </button>
              </div>
            </div>

            {/* Code Input Area */}
            <div className="p-4 bg-slate-950/70 font-mono text-xs sm:text-sm text-amber-100 flex-1 min-h-[300px]">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={14}
                className="w-full h-full bg-transparent resize-none focus:outline-none font-mono leading-relaxed text-slate-200"
                spellCheck={false}
              />
            </div>

            {/* Live Test Console Output */}
            <div className="bg-slate-950 border-t border-slate-800 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-1 border-b border-slate-800">
                <div className="flex items-center gap-1.5 font-bold">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'bn' ? 'কনসোল ও টেস্ট ফলাফল' : 'Output & Verification'}</span>
                </div>
                {testResults && (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> All Tests Passed!
                  </span>
                )}
              </div>

              {testResults ? (
                <div className="space-y-1.5 pt-1">
                  {testResults.map((tr, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-900/50 text-xs font-mono text-emerald-300 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{tr.message}</span>
                    </div>
                  ))}
                  <div className="pt-2 text-right">
                    <button
                      onClick={() => {
                        setStreakDays((prev) => prev + 1);
                        alert(lang === 'bn' ? 'অভিনন্দন! আপনার সাবমিশন সফল হয়েছে এবং ১ দিন স্ট্রিক যুক্ত হয়েছে!' : 'Task submitted successfully! Daily streak +1!');
                      }}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      {lang === 'bn' ? 'ফলাফল সাবমিট করুন' : 'Submit Solution'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-600 font-mono italic py-2">
                  {lang === 'bn'
                    ? 'কোড লিখে উপরে "কোড রান করুন" বাটনে চাপুন টেস্ট কেস যাচাই করতে।'
                    : 'Click "Run Tests" above to execute code against live test cases.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
