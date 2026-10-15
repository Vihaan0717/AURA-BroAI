import React, { useState, useEffect } from 'react';
import { SearchComposer } from '../composer/SearchComposer';
import { useBrowser } from '../../context/BrowserContext';
import { SearchMode } from '@private-browser/shared';
import {
  ShieldCheck,
  Cpu,
  Laptop,
  Sparkles,
  Shuffle,
  ArrowRight,
  Zap,
} from 'lucide-react';

// Gen Z rotating words for the headline matching Reference Image 2
const GENZ_WORDS = [
  'answers',
  'receipts',
  'vibes',
  'intel',
  'sauce',
  'facts',
  'truth',
];

// Interactive Daily Questions / Rabbit Holes
interface DailySpark {
  category: string;
  badge: string;
  question: string;
  mode: SearchMode;
}

const DAILY_SPARKS: DailySpark[] = [
  {
    category: 'TECH INTEL',
    badge: '⚡ Gear',
    question: 'Best noise-canceling headphones in India under ₹15,000 with zero bloat?',
    mode: 'shopping',
  },
  {
    category: 'RABBIT HOLE',
    badge: '🌀 Nostalgia',
    question: 'Why are 2000s digicams and iPods skyrocketing in price right now?',
    mode: 'search',
  },
  {
    category: 'CINEMA LORE',
    badge: '🎬 Watchlist',
    question: 'Sci-fi thrillers with mind-bending endings on Netflix or Prime',
    mode: 'entertainment',
  },
  {
    category: 'PRIVACY VIBE',
    badge: '🛡️ Shield',
    question: 'How to block cross-site tracking and search without leaving digital breadcrumbs',
    mode: 'deep_research',
  },
  {
    category: 'DEVICE BRIDGE',
    badge: '💻 Companion',
    question: 'What background tasks are currently running on my Windows laptop?',
    mode: 'companion',
  },
  {
    category: 'AESTHETICS',
    badge: '✨ Design',
    question: 'How did liquid iOS glassmorphism become the peak UI design trend?',
    mode: 'search',
  },
];

export const HomeScreen: React.FC = () => {
  const { setQuery, setMode, performSearch } = useBrowser();
  const [wordIndex, setWordIndex] = useState(0);
  const [sparkIndex, setSparkIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  // Vertical rolling word animation every 2.4s
  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % GENZ_WORDS.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const currentSpark = DAILY_SPARKS[sparkIndex];

  const handleNextSpark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 500);
    setSparkIndex((prev) => (prev + 1) % DAILY_SPARKS.length);
  };

  const handleSelectSpark = (spark: DailySpark) => {
    setQuery(spark.question);
    setMode(spark.mode);
    performSearch(spark.question, spark.mode);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 py-12 sm:py-16">
      {/* Subtle Dot Grid Background Pattern matching Reference Image 2 */}
      <div className="absolute inset-0 dot-grid-pattern pointer-events-none opacity-70 dark:opacity-35" />

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-[860px] mx-auto flex flex-col items-center text-center animate-fade-in">
        {/* Floating Ambient Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-pill text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-6 sm:mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Liquid iOS Engine</span>
          <span className="text-zinc-400 dark:text-zinc-600">•</span>
          <span>Zero Telemetry</span>
          <span className="text-zinc-400 dark:text-zinc-600">•</span>
          <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
            <Zap className="w-3 h-3" /> GenZ Mode
          </span>
        </div>

        {/* Signature Gen Z Headline with Vertical Rolling Word (Reference Image 2 Style) */}
        <div className="mb-8 sm:mb-10 space-y-1 sm:space-y-2 select-none">
          {/* Top Line: Heavy Display Sans (like YEAR-TO-YEAR in Image 2) */}
          <h1 className="font-display font-black tracking-tighter uppercase text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-zinc-900 dark:text-zinc-50 leading-[0.95]">
            RAW SEARCH.
          </h1>

          {/* Bottom Line: Static sentence matching theme with precision baseline alignment */}
          <div className="flex items-center justify-center whitespace-nowrap text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tight leading-none py-1">
            {/* Liquid Gradient Italic Phrase: "pure [word]" matching font family and cap height */}
            <span className="font-display font-black italic text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 inline-flex items-baseline py-1">
              <span>pure&nbsp;</span>
              <span
                key={GENZ_WORDS[wordIndex]}
                className="inline-block animate-word-scroll-up"
              >
                {GENZ_WORDS[wordIndex]}
              </span>
            </span>

            {/* Static Sentence Ending: Heavy Display Sans uppercase */}
            <span className="text-zinc-900 dark:text-zinc-50 uppercase tracking-tight ml-2 sm:ml-3 py-1 inline-block">
              &amp; ZERO CAP.
            </span>
          </div>
        </div>

        {/* Signature Reference Image 4 Liquid Glassmorphic Search Composer */}
        <div className="w-full">
          <SearchComposer />
        </div>

        {/* Upgraded Daily Question / Rabbit Hole Interactive Card */}
        <div className="mt-7 w-full max-w-[620px] mx-auto animate-slide-up">
          <div
            onClick={() => handleSelectSpark(currentSpark)}
            className="liquid-card rounded-2xl p-3.5 sm:p-4 border border-white/70 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer text-left relative overflow-hidden"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleSelectSpark(currentSpark);
              }
            }}
          >
            {/* Top Bar of Card */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase text-purple-700 dark:text-purple-300 bg-purple-500/10 dark:bg-purple-500/20 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Daily Rabbit Hole
                </span>
                <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                  {currentSpark.badge}
                </span>
              </div>

              {/* Shuffle button */}
              <button
                type="button"
                onClick={handleNextSpark}
                aria-label="Next daily question vibe"
                className="liquid-pill flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                title="Shuffle question"
              >
                <Shuffle
                  className={`w-3 h-3 transition-transform duration-500 ${
                    isRotating ? 'rotate-180 text-emerald-500' : ''
                  }`}
                />
                <span className="hidden sm:inline">Next vibe</span>
              </button>
            </div>

            {/* Question Text */}
            <p className="text-zinc-900 dark:text-zinc-100 font-medium text-sm sm:text-base leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors mb-2.5">
              “{currentSpark.question}”
            </p>

            {/* Bottom Action Footer */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-black/5 dark:border-white/5">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Click anywhere to explore with zero tracking
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                Explore <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Trust & Model Badges */}
        <div className="mt-12 pt-6 border-t border-black/5 dark:border-white/5 w-full flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Zero Telemetry</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Local-First Inference</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Laptop className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
            <span>Windows Antigravity Bridge</span>
          </div>
        </div>
      </main>
    </div>
  );
};
