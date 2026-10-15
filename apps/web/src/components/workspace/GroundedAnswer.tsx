import React, { useState } from 'react';
import { SearchResultPayload } from '@private-browser/shared';
import { useBrowser } from '../../context/BrowserContext';
import { Bookmark, BookmarkCheck, ArrowUpRight, Sparkles } from 'lucide-react';

interface GroundedAnswerProps {
  result: SearchResultPayload;
  selectedCitationIndex: number | null;
  onSelectCitation: (index: number) => void;
}

export const GroundedAnswer: React.FC<GroundedAnswerProps> = ({
  result,
  selectedCitationIndex,
  onSelectCitation,
}) => {
  const { pinToResearchMemory, performSearch } = useBrowser();
  const [pinned, setPinned] = useState(false);

  const handlePin = () => {
    pinToResearchMemory(result.groundedAnswer.slice(0, 200) + '...', 'research_topic');
    setPinned(true);
    setTimeout(() => setPinned(false), 3000);
  };

  const renderFormattedAnswer = (text: string) => {
    const parts = text.split(/(\[\d+\])/g);
    return parts.map((part, i) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const citationNum = parseInt(match[1], 10);
        const isSelected = selectedCitationIndex === citationNum;
        return (
          <button
            key={i}
            onClick={() => onSelectCitation(citationNum)}
            className={`inline-flex items-center justify-center font-mono font-semibold text-[10px] px-2 py-0.5 mx-0.5 rounded-md transition-all ${
              isSelected
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
                : 'liquid-pill text-emerald-700 dark:text-emerald-300'
            }`}
            title={`Inspect Source [${citationNum}]`}
          >
            [{citationNum}]
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <article className="liquid-card rounded-3xl p-6 sm:p-7">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse-subtle" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Grounded Research Synthesis
          </h2>
          {result.provenance === 'live' && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
              Live Web ({result.citations.length} Sources)
            </span>
          )}
          {result.provenance === 'cached' && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-800 dark:text-blue-300 border border-blue-500/30">
              Cached Snapshot
            </span>
          )}
          {result.provenance === 'mock' && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
              Sample Fixture (Offline)
            </span>
          )}
        </div>

        {/* Pin to Memory Button */}
        <button
          onClick={handlePin}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            pinned
              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
              : 'liquid-pill text-zinc-700 dark:text-zinc-300'
          }`}
          title="Save this grounded insight to your private local research memory"
        >
          {pinned ? (
            <>
              <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Bookmark className="w-3.5 h-3.5" />
              <span>Pin to Memory</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grounded Answer Text */}
      <div className="text-sm sm:text-[15px] text-zinc-900 dark:text-zinc-100 leading-relaxed space-y-4 font-normal">
        {result.groundedAnswer.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="leading-relaxed">
            {renderFormattedAnswer(paragraph)}
          </p>
        ))}
      </div>

      {/* Follow-up Questions */}
      {result.followUpSuggestions && result.followUpSuggestions.length > 0 && (
        <div className="mt-7 pt-5 border-t border-black/5 dark:border-white/5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Follow-up Inquiries</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.followUpSuggestions.map((question, i) => (
              <button
                key={i}
                onClick={() => performSearch(question)}
                className="liquid-pill flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs text-zinc-800 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-300 transition-all text-left group"
              >
                <span>{question}</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
