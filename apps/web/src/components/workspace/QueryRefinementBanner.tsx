import React, { useState } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { Sparkles, Sliders, HelpCircle, ChevronUp } from 'lucide-react';

export const QueryRefinementBanner: React.FC = () => {
  const { query, refinedQuery, useRefinedQuery, setUseRefinedQuery, intent } = useBrowser();
  const [showExplanation, setShowExplanation] = useState(false);

  if (!intent || !refinedQuery || refinedQuery === query) return null;

  return (
    <div className="mb-6 p-4 rounded-2xl liquid-card text-xs text-zinc-800 dark:text-zinc-200 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mt-0.5">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">Transparent Query Refinement</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-mono">
                {intent.detectedMode} mode
              </span>
            </div>
            <p className="mt-1 text-zinc-600 dark:text-zinc-300 leading-relaxed font-mono text-[11px]">
              {useRefinedQuery ? refinedQuery : query}
            </p>
          </div>
        </div>

        {/* Toggle between Refined and Original Query */}
        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
          <button
            onClick={() => setUseRefinedQuery(!useRefinedQuery)}
            className="liquid-pill flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
            title="Toggle between refined and original query"
          >
            <Sliders className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>{useRefinedQuery ? 'Use Original Query' : 'Use Refined Query'}</span>
          </button>
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            aria-expanded={showExplanation}
            className="p-1.5 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="Inspect why this query was refined"
          >
            {showExplanation ? <ChevronUp className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Rationale & Preserved Constraints */}
      {showExplanation && (
        <div className="mt-3.5 pt-3 border-t border-black/5 dark:border-white/5 text-[11px] text-zinc-600 dark:text-zinc-300 space-y-2 animate-slide-up">
          <div className="flex items-start gap-2">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">Refinement Rationale:</span>
            <span>{intent.reasoning}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">Preserved Constraints:</span>
            {intent.preservedConstraints.budget && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 font-mono">
                Budget: {intent.preservedConstraints.budget.currency} {intent.preservedConstraints.budget.amount.toLocaleString()}
              </span>
            )}
            {intent.preservedConstraints.brands?.map((b) => (
              <span key={b} className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-zinc-800 dark:text-zinc-200 font-mono">
                Brand: {b}
              </span>
            ))}
            {intent.preservedConstraints.datesOrYear?.map((y) => (
              <span key={y} className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-zinc-800 dark:text-zinc-200 font-mono">
                Year: {y}
              </span>
            ))}
            <span className="text-zinc-500 dark:text-zinc-400 italic text-[10px]">
              No user constraints were altered or dropped.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
