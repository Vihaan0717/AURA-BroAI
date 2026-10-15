import React from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sun,
  Moon,
  ShieldCheck,
  Laptop,
  RotateCcw,
  Lock,
  ChevronLeft,
  ChevronRight,
  Globe,
  ShoppingBag,
  Film,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { SearchMode } from '@private-browser/shared';

export const Navbar: React.FC = () => {
  const { view, mode, setMode, navigateHome, query, remoteState } = useBrowser();
  const { theme, toggleTheme } = useTheme();

  const getModeIcon = (m: SearchMode) => {
    switch (m) {
      case 'shopping':
        return <ShoppingBag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'entertainment':
        return <Film className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
      case 'images':
        return <ImageIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case 'chat':
        return <MessageSquare className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case 'companion':
        return <Laptop className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />;
      case 'deep_research':
        return <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" />;
      case 'privacy':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  const getModeLabel = (m: SearchMode) => {
    switch (m) {
      case 'shopping':
        return 'Shopping';
      case 'entertainment':
        return 'Movies';
      case 'images':
        return 'Images Only';
      case 'chat':
        return 'AI Chat';
      case 'companion':
        return 'Companion';
      case 'deep_research':
        return 'Deep Research';
      case 'privacy':
        return 'Privacy & Memory';
      default:
        return 'Search';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full liquid-header h-[58px] px-3 sm:px-6 flex items-center transition-colors duration-200">
      <div className="w-full flex items-center justify-between gap-3">
        {/* Left Side: Mac Window Dots & Navigation Controls (Reference Image 5) */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Mac Window Dots */}
          <div className="flex items-center gap-1.5 pr-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] inline-block shadow-sm" />
          </div>

          {/* Browser Back / Forward buttons */}
          <div className="hidden sm:flex items-center gap-0.5 text-zinc-600 dark:text-zinc-400">
            <button
              onClick={navigateHome}
              className="p-1 rounded-md hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Back to home"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled
              className="p-1 rounded-md opacity-30 cursor-not-allowed"
              title="Forward"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Brand Logo & Name */}
          <button
            onClick={navigateHome}
            className="flex items-center gap-2 group focus:outline-none rounded-lg p-0.5 ml-1"
            title="Aura Home"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xs">A</span>
            </div>
            <span className="font-semibold text-xs tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Aura
            </span>
          </button>
        </div>

        {/* Center: Sleek Centered Browser URL Capsule (Reference Image 5) */}
        <div className="flex-1 max-w-md mx-auto hidden md:flex items-center justify-center">
          <div className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-full bg-black/[0.06] dark:bg-black/40 border border-black/10 dark:border-white/10 text-xs font-mono text-zinc-700 dark:text-zinc-300 shadow-inner">
            <div className="flex items-center gap-2 truncate">
              <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span className="font-medium truncate text-zinc-900 dark:text-emerald-400">
                {view === 'results'
                  ? `aura://${mode}/${encodeURIComponent(query || 'query')}`
                  : 'aura://private-browser.ai'}
              </span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 p-0.5 ml-2 transition-colors flex-shrink-0"
              title="Reload page"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right Side: Quick Action Metadata & Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {/* Active Mode Pill (When in Results View) */}
          {view === 'results' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium liquid-pill">
              {getModeIcon(mode)}
              <span>{getModeLabel(mode)}</span>
            </span>
          )}

          {/* Discreet Privacy Status */}
          <button
            onClick={() => setMode('privacy')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="Zero telemetry • Confidential local memory"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px]">Zero Telemetry</span>
          </button>

          {/* Antigravity Companion Status */}
          <button
            onClick={() => setMode('companion')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="Google Antigravity & PC Bridge"
          >
            <Laptop className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
            <span className="hidden lg:inline text-[11px]">Companion</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                remoteState.status === 'connected'
                  ? 'bg-emerald-500'
                  : remoteState.status === 'pairing'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-zinc-400/40'
              }`}
            />
          </button>

          {/* Discreet Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-1.5 rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
