import React, { useState } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { SearchComposer } from '../composer/SearchComposer';
import { QueryRefinementBanner } from './QueryRefinementBanner';
import { GroundedAnswer } from './GroundedAnswer';
import { SourcesRail } from './SourcesRail';
import { EvidenceBar } from './EvidenceBar';
import { ShoppingView } from '../modes/ShoppingView';
import { EntertainmentView } from '../modes/EntertainmentView';
import { ImagesView } from '../modes/ImagesView';
import { ChatView } from '../modes/ChatView';
import { RemoteCompanionView } from '../modes/RemoteCompanionView';
import { PrivacySettingsView } from '../modes/PrivacySettingsView';
import {
  Search,
  Sparkles,
  ShoppingBag,
  Film,
  Image as ImageIcon,
  MessageSquare,
  Laptop,
  ShieldCheck,
} from 'lucide-react';
import { SearchMode } from '@private-browser/shared';

export const ResearchWorkspace: React.FC = () => {
  const {
    mode,
    setMode,
    isLoading,
    searchResult,
    shoppingResult,
    entertainmentResult,
    imageResults,
  } = useBrowser();

  const [selectedCitationIndex, setSelectedCitationIndex] = useState<number | null>(null);

  const modeTabs: { id: SearchMode; label: string; icon: React.ReactNode }[] = [
    { id: 'search', label: 'Search', icon: <Search className="w-3.5 h-3.5" /> },
    { id: 'deep_research', label: 'Deep Research', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'shopping', label: 'Shopping', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { id: 'entertainment', label: 'Entertainment', icon: <Film className="w-3.5 h-3.5" /> },
    { id: 'images', label: 'Images Only', icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { id: 'chat', label: 'AI Chat', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'companion', label: 'Companion', icon: <Laptop className="w-3.5 h-3.5" /> },
    { id: 'privacy', label: 'Privacy', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      {/* Top Controls: Compact Composer & Quick Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
        <div className="flex-1 max-w-2xl">
          <SearchComposer compact />
        </div>

        {/* Quick Mode Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {modeTabs.map((tab) => {
            const isActive = mode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setMode(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40 shadow-sm font-semibold'
                    : 'liquid-pill text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Query Refinement Banner */}
      <QueryRefinementBanner />

      {/* Signature Liquid Glassmorphism Synthesizing Animation (Image 4 / Image 5) */}
      {isLoading ? (
        <div className="space-y-6 animate-fade-in">
          {/* Main Liquid Glass Synthesizer Card */}
          <div className="liquid-card rounded-[32px] p-8 sm:p-10 relative overflow-hidden liquid-searching">
            <div className="relative z-10 space-y-6">
              {/* Header with Liquid Floating Orb */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl liquid-pill flex items-center justify-center animate-liquid-float shadow-lg flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
                      Synthesizing Intelligence
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                      Liquid Privacy Pipeline
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
                    Refracting query with zero telemetry • Grounding verified sources locally
                  </p>
                </div>
              </div>

              {/* Liquid Status Waves / Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="liquid-pill rounded-2xl p-3 flex items-center gap-2.5 text-xs text-zinc-800 dark:text-zinc-200">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <span className="font-medium truncate">Privacy Isolation Active</span>
                </div>
                <div className="liquid-pill rounded-2xl p-3 flex items-center gap-2.5 text-xs text-zinc-800 dark:text-zinc-200">
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-ping shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
                  <span className="font-medium truncate">Synthesizing Verified Data</span>
                </div>
                <div className="liquid-pill rounded-2xl p-3 flex items-center gap-2.5 text-xs text-zinc-500 dark:text-zinc-400 opacity-80">
                  <div className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                  <span className="font-medium truncate">Epistemic Attributions</span>
                </div>
              </div>

              {/* Shimmering Liquid Glass Skeleton Lines */}
              <div className="space-y-3 pt-2">
                <div className="h-4 rounded-xl bg-black/5 dark:bg-white/5 liquid-skeleton-shimmer w-1/3" />
                <div className="h-4 rounded-xl bg-black/5 dark:bg-white/5 liquid-skeleton-shimmer w-full" />
                <div className="h-4 rounded-xl bg-black/5 dark:bg-white/5 liquid-skeleton-shimmer w-5/6" />
                <div className="h-4 rounded-xl bg-black/5 dark:bg-white/5 liquid-skeleton-shimmer w-4/6" />
              </div>
            </div>
          </div>

          {/* Liquid Glass Preview Cards Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-44 liquid-card rounded-[28px] p-5 liquid-skeleton-shimmer flex flex-col justify-between">
              <div className="w-1/2 h-3.5 rounded-lg bg-black/5 dark:bg-white/5" />
              <div className="space-y-2">
                <div className="w-full h-3 rounded bg-black/5 dark:bg-white/5" />
                <div className="w-3/4 h-3 rounded bg-black/5 dark:bg-white/5" />
              </div>
            </div>
            <div className="h-44 liquid-card rounded-[28px] p-5 liquid-skeleton-shimmer flex flex-col justify-between">
              <div className="w-1/2 h-3.5 rounded-lg bg-black/5 dark:bg-white/5" />
              <div className="space-y-2">
                <div className="w-full h-3 rounded bg-black/5 dark:bg-white/5" />
                <div className="w-3/4 h-3 rounded bg-black/5 dark:bg-white/5" />
              </div>
            </div>
            <div className="h-44 liquid-card rounded-[28px] p-5 liquid-skeleton-shimmer flex flex-col justify-between">
              <div className="w-1/2 h-3.5 rounded-lg bg-black/5 dark:bg-white/5" />
              <div className="space-y-2">
                <div className="w-full h-3 rounded bg-black/5 dark:bg-white/5" />
                <div className="w-3/4 h-3 rounded bg-black/5 dark:bg-white/5" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Dynamic Mode Content Rendering */
        <main>
          {mode === 'shopping' && shoppingResult && (
            <ShoppingView data={shoppingResult} />
          )}

          {mode === 'entertainment' && entertainmentResult && (
            <EntertainmentView item={entertainmentResult} />
          )}

          {mode === 'images' && (
            <ImagesView images={imageResults} />
          )}

          {mode === 'chat' && (
            <ChatView />
          )}

          {mode === 'companion' && (
            <RemoteCompanionView />
          )}

          {mode === 'privacy' && (
            <PrivacySettingsView />
          )}

          {(mode === 'search' || mode === 'deep_research') && searchResult && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left 2 Columns: Answer & Epistemic Evidence */}
              <div className="lg:col-span-2 space-y-6">
                <GroundedAnswer
                  result={searchResult}
                  selectedCitationIndex={selectedCitationIndex}
                  onSelectCitation={(idx) => setSelectedCitationIndex(idx)}
                />
                <EvidenceBar
                  evidenceList={searchResult.evidenceList}
                  conflictingFindings={searchResult.conflictingFindings}
                  unverifiedAspects={searchResult.unverifiedAspects}
                />
              </div>

              {/* Right 1 Column: Authoritative Deduplicated Sources Rail */}
              <div className="lg:col-span-1">
                <SourcesRail
                  citations={searchResult.citations}
                  selectedCitationIndex={selectedCitationIndex}
                  onSelectCitation={(idx) => setSelectedCitationIndex(idx)}
                />
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
};
