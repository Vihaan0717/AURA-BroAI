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
import { routeUserIntent } from '../../services/intentRouter';

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

  // Live intent detection with current mode context
  const liveIntent = query.trim() ? routeUserIntent(query, { currentMode: mode }) : null;

  // Show expanded toolbar only when focused or when query has text or menu/drawer open
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

  // Tight, non-bloating auto-resize: single-line by default (28px), expands only when text exceeds 1 line
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.max(28, Math.min(textareaRef.current.scrollHeight, 140));
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [query]);

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

      {/* Signature Reference Image 4 Liquid Glassmorphic Composer with Smooth iOS Morphing */}
      <div
        ref={containerRef}
        onClick={() => {
          if (!isFocused) {
            setIsFocused(true);
            textareaRef.current?.focus();
          }
        }}
        className={`liquid-composer cursor-text transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] relative ${
          showPills
            ? 'rounded-[24px] p-3 sm:p-3.5 shadow-xl'
            : 'rounded-full py-1.5 px-3 sm:px-4 shadow-md hover:shadow-lg'
        } ${isLoading ? 'liquid-searching' : ''}`}
      >
        <form onSubmit={handleSubmit} className="relative z-10 w-full flex flex-col">
          {/* Main Input Row: Single Persistent Textarea (No Unmounting!) */}
          <div className="flex items-center gap-2 w-full min-h-[34px]">
            <div className="flex-1 min-w-0 flex items-center pl-1 sm:pl-1.5">
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
                className="w-full bg-transparent resize-none border-0 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 text-sm sm:text-base leading-normal focus:outline-none focus:ring-0 p-0 m-0 min-h-[28px] max-h-[140px] overflow-y-auto"
              />
            </div>

            {/* Clear Button (Visible when typing) */}
            {query.trim() && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setQuery('');
                  textareaRef.current?.focus();
                }}
                aria-label="Clear query"
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors flex-shrink-0"
                title="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Minimized Inline Action Buttons (Visible only in idle state, smoothly hides on focus) */}
            <div
              className={`flex items-center gap-1.5 flex-shrink-0 transition-all duration-200 ease-out ${
                showPills
                  ? 'opacity-0 scale-90 w-0 pointer-events-none overflow-hidden'
                  : 'opacity-100 scale-100 ml-1'
              }`}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVoiceOpen(true);
                }}
                aria-label="Start voice search"
                className="liquid-pill flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
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
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center liquid-submit-btn disabled:opacity-20 disabled:cursor-not-allowed shadow-md flex-shrink-0"
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

          {/* Context Attach Drawer (Inside expanded state) */}
          {isAttachDrawerOpen && showPills && (
            <div className="mx-1 mt-2.5 mb-1 p-3 rounded-2xl liquid-card text-xs text-zinc-800 dark:text-zinc-200 animate-slide-up">
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

          {/* Smooth Bottom Toolbar (Smooth Accordion Slide without unmounting!) */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              showPills
                ? 'max-h-24 opacity-100 mt-2.5 pt-2 border-t border-black/5 dark:border-white/5 pointer-events-auto'
                : 'max-h-0 opacity-0 mt-0 pt-0 border-t-0 pointer-events-none'
            }`}
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              {/* Left Action Buttons: +, Tools, Normal, Model */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap relative">
                {/* Plus Circle Button */}
                <button
                  type="button"
                  data-attach-trigger="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAttachDrawerOpen(!isAttachDrawerOpen);
                  }}
                  aria-label="Add search constraints"
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center liquid-pill ${
                    isAttachDrawerOpen ? 'ring-2 ring-emerald-500' : ''
                  }`}
                  title="Add context constraint"
                >
                  <Plus className="w-3.5 h-3.5" />
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
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium liquid-pill ${
                      isToolsOpen ? 'ring-2 ring-emerald-500' : ''
                    }`}
                    title="Tools menu"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>Tools</span>
                  </button>

                  {/* Floating Tools Popover */}
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
                  className="liquid-pill hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
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
                  className="liquid-pill hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                  title="Click to switch model"
                >
                  <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  <span>{selectedModel}</span>
                </button>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Voice Input Pill */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsVoiceOpen(true);
                  }}
                  aria-label="Start voice search"
                  className="liquid-pill flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
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
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center liquid-submit-btn disabled:opacity-20 disabled:cursor-not-allowed shadow-md flex-shrink-0"
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
          </div>
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
