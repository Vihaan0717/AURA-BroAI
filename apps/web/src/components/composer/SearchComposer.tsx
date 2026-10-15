import React, { useState, useRef, useEffect } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { ToolsMenu } from './ToolsMenu';
import { VoiceInputModal } from './VoiceInputModal';
import {
  Plus,
  SlidersHorizontal,
  ArrowUp,
  X,
  Globe,
  Sparkles,
  ShoppingBag,
  Film,
  Image as ImageIcon,
  MessageSquare,
  Laptop,
} from 'lucide-react';
import { SearchMode } from '@private-browser/shared';
import { analyzeQueryIntent } from '../../services/intentDetector';

interface SearchComposerProps {
  compact?: boolean;
}

export const SearchComposer: React.FC<SearchComposerProps> = ({ compact = false }) => {
  const { query, setQuery, mode, setMode, performSearch, isLoading } = useBrowser();
  const [isFocused, setIsFocused] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isAttachDrawerOpen, setIsAttachDrawerOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'Aura Pro' | 'Gemini 3 Pro' | 'Local NPU'>('Gemini 3 Pro');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Live intent detection
  const liveIntent = query.trim() ? analyzeQueryIntent(query) : null;

  // Show tools, +, normal, gemini only when focused or when query has text (on home screen) or tools open
  const showPills = compact
    ? isFocused || isToolsOpen || isAttachDrawerOpen
    : isFocused || Boolean(query.trim()) || isToolsOpen || isAttachDrawerOpen;

  // Handle click outside to collapse if query is empty
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !target.closest?.('[data-tools-trigger="true"]') &&
        !target.closest?.('[data-attach-trigger="true"]')
      ) {
        if (!query.trim() && !isToolsOpen && !isAttachDrawerOpen) {
          setIsFocused(false);
        }
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [query, isToolsOpen, isAttachDrawerOpen]);

  // Auto-resize textarea smoothly
  useEffect(() => {
    if (textareaRef.current) {
      if (!showPills) {
        textareaRef.current.style.height = '34px';
      } else {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
      }
    }
  }, [query, showPills]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery || isLoading) return;
    performSearch(cleanQuery, mode);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

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
      default:
        return 'Normal';
    }
  };

  return (
    <div className={`w-full relative transition-all duration-300 ${compact ? 'max-w-2xl' : 'max-w-3xl mx-auto'}`}>
      {/* Intent Workflow Indicator (Above Composer) */}
      {liveIntent && !compact && liveIntent.detectedMode !== 'search' && (
        <div className="flex items-center justify-between px-3 py-1 mb-2 animate-fade-in">
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-pill text-zinc-900 dark:text-zinc-100 font-medium text-[11px] shadow-sm">
              {getModeIcon(liveIntent.detectedMode)}
              <span>{getModeLabel(liveIntent.detectedMode)} workflow detected</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsToolsOpen(!isToolsOpen)}
            className="text-[11px] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Change Mode
          </button>
        </div>
      )}

      {/* Signature Reference Image 4 Liquid Glassmorphic Composer with iOS Morphing */}
      <div
        ref={containerRef}
        onClick={() => {
          if (!isFocused) {
            setIsFocused(true);
            setTimeout(() => textareaRef.current?.focus(), 50);
          }
        }}
        className={`liquid-composer cursor-text transition-all duration-300 ease-out relative ${
          showPills
            ? 'rounded-[28px] p-3.5 sm:p-4 shadow-xl'
            : 'rounded-full py-1.5 sm:py-2 px-3 sm:px-4 shadow-md hover:shadow-lg'
        } ${isLoading ? 'liquid-searching' : ''}`}
      >
        <form onSubmit={handleSubmit} className="relative z-10 w-full">
          {!showPills ? (
            /* Minimized Sleek Single-Line Pill (Idle state) */
            <div className="flex items-center justify-between gap-2.5 sm:gap-3 w-full min-h-[38px]">
              <div className="flex-1 min-w-0 flex items-center pl-1.5 sm:pl-2">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={query}
                  onFocus={() => setIsFocused(true)}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (!isFocused) setIsFocused(true);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    mode === 'shopping'
                      ? 'Ask or compare products (INR pricing, durability)...'
                      : mode === 'entertainment'
                      ? 'Ask about movies, streaming availability...'
                      : mode === 'images'
                      ? 'Search web images...'
                      : mode === 'companion'
                      ? 'Google Antigravity command or laptop status...'
                      : 'Ask anything...'
                  }
                  className="w-full bg-transparent resize-none border-0 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 text-sm sm:text-base leading-normal focus:outline-none focus:ring-0 py-1.5 h-[34px] min-h-[34px] max-h-[34px] overflow-hidden"
                />
              </div>

              {/* Minimized Right Action Buttons (Voice + Submit) */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 pr-0.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsVoiceOpen(true);
                  }}
                  aria-label="Start voice search"
                  className="liquid-pill flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  title="Voice input"
                >
                  <span className="flex items-center gap-0.5 h-3">
                    <span className="w-0.5 h-2 bg-current rounded-full" />
                    <span className="w-0.5 h-3 bg-current rounded-full" />
                    <span className="w-0.5 h-1.5 bg-current rounded-full" />
                  </span>
                  <span>Voice</span>
                </button>

                <button
                  type="submit"
                  disabled={!query.trim() || isLoading}
                  aria-label="Submit search query"
                  className="w-8 h-8 rounded-full flex items-center justify-center liquid-submit-btn disabled:opacity-20 disabled:cursor-not-allowed shadow-md flex-shrink-0"
                  title="Search"
                >
                  {isLoading ? (
                    <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                      <span className="absolute inset-0 rounded-full bg-current opacity-30 animate-ping" />
                      <span className="w-2 h-2 rounded-full bg-current opacity-90 animate-pulse" />
                    </div>
                  ) : (
                    <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Expanded Full Composer Card (Focused or active state) */
            <div className="flex flex-col animate-fade-in">
              {/* Top Textarea with clean vertical bar cursor indicator */}
              <div className="flex items-start gap-2 px-1 pt-0.5 pb-1">
                <textarea
                  ref={textareaRef}
                  rows={compact ? 1 : 2}
                  value={query}
                  autoFocus
                  onFocus={() => setIsFocused(true)}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (!isFocused) setIsFocused(true);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    mode === 'shopping'
                      ? 'Ask or compare products (INR pricing, durability, sellers)...'
                      : mode === 'entertainment'
                      ? 'Ask about movies, streaming availability, spoiler-safe reviews...'
                      : mode === 'images'
                      ? 'Search web images with verified source attribution...'
                      : mode === 'companion'
                      ? 'Google Antigravity command or laptop status inquiry...'
                      : 'Ask anything...'
                  }
                  className="w-full bg-transparent resize-none border-0 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 text-base sm:text-[17px] leading-relaxed focus:outline-none focus:ring-0 transition-all duration-200 min-h-[44px]"
                />
                {query.trim() && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuery('');
                    }}
                    aria-label="Clear query"
                    className="p-1 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors mt-1"
                    title="Clear input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Context Attach Drawer */}
              {isAttachDrawerOpen && (
                <div className="mx-2 mb-3 p-3 rounded-2xl liquid-card text-xs text-zinc-800 dark:text-zinc-200 animate-slide-up">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">Attach Search Context</span>
                    <button
                      type="button"
                      onClick={() => setIsAttachDrawerOpen(false)}
                      className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setQuery(query ? `${query} [Focus: Durability & Build]` : 'compare audio build and durability');
                        setIsAttachDrawerOpen(false);
                      }}
                      className="px-2.5 py-1 rounded-lg liquid-pill text-[11px] transition-colors"
                    >
                      + Constraint: Durability & Build
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQuery(query ? `${query} [Location: India, Metro]` : 'deliver in India with INR pricing');
                        setIsAttachDrawerOpen(false);
                      }}
                      className="px-2.5 py-1 rounded-lg liquid-pill text-[11px] transition-colors"
                    >
                      + Regional: India (INR Pricing)
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Bar: Exact Reference Image 4 Pill Controls Row */}
              <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5 mt-1">
                {/* Left Action Buttons: +, Tools, Normal, Model */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap relative animate-fade-in">
                  {/* Plus Circle Button */}
                  <button
                    type="button"
                    data-attach-trigger="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAttachDrawerOpen(!isAttachDrawerOpen);
                    }}
                    aria-label="Add search constraints"
                    className={`w-8 h-8 rounded-full flex items-center justify-center liquid-pill ${
                      isAttachDrawerOpen ? 'ring-2 ring-emerald-500' : ''
                    }`}
                    title="Add context constraint"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {/* Tools Pill Button */}
                  <div className="relative">
                    <button
                      type="button"
                      data-tools-trigger="true"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsToolsOpen(!isToolsOpen);
                      }}
                      aria-expanded={isToolsOpen}
                      aria-haspopup="menu"
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium liquid-pill ${
                        isToolsOpen ? 'ring-2 ring-emerald-500' : ''
                      }`}
                      title="Tools menu"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Tools</span>
                    </button>

                    {/* Floating Tools Popover (Image 4) */}
                    <ToolsMenu
                      isOpen={isToolsOpen}
                      onClose={() => setIsToolsOpen(false)}
                      activeMode={mode}
                      onSelectMode={(selectedMode) => {
                        setMode(selectedMode);
                      }}
                    />
                  </div>

                  {/* Workflow Mode Pill */}
                  <button
                    type="button"
                    data-tools-trigger="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsToolsOpen(!isToolsOpen);
                    }}
                    className="liquid-pill hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium"
                  >
                    {getModeIcon(mode)}
                    <span>{getModeLabel(mode)}</span>
                  </button>

                  {/* Model Pill */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedModel(
                        selectedModel === 'Gemini 3 Pro'
                          ? 'Aura Pro'
                          : selectedModel === 'Aura Pro'
                          ? 'Local NPU'
                          : 'Gemini 3 Pro'
                      );
                    }}
                    className="liquid-pill hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium"
                    title="Click to switch model"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>{selectedModel}</span>
                  </button>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2">
                  {/* Voice Input Pill with waveform bars */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsVoiceOpen(true);
                    }}
                    aria-label="Start voice search"
                    className="liquid-pill flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium"
                    title="Voice input"
                  >
                    <span className="flex items-center gap-0.5 h-3">
                      <span className="w-0.5 h-2 bg-current rounded-full" />
                      <span className="w-0.5 h-3 bg-current rounded-full" />
                      <span className="w-0.5 h-1.5 bg-current rounded-full" />
                    </span>
                    <span>Voice</span>
                  </button>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!query.trim() || isLoading}
                    aria-label="Submit search query"
                    className="w-9 h-9 rounded-full flex items-center justify-center liquid-submit-btn disabled:opacity-20 disabled:cursor-not-allowed shadow-md flex-shrink-0"
                    title="Search"
                  >
                    {isLoading ? (
                      <div className="relative w-4 h-4 flex items-center justify-center">
                        <span className="absolute inset-0 rounded-full bg-current opacity-30 animate-ping" />
                        <span className="w-2.5 h-2.5 rounded-full bg-current opacity-90 animate-pulse" />
                      </div>
                    ) : (
                      <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Voice Input Modal */}
      <VoiceInputModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onTranscriptionComplete={(text) => {
          setQuery(text);
          performSearch(text);
        }}
      />
    </div>
  );
};

