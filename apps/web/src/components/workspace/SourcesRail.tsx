import React from 'react';
import { SourceCitation } from '@private-browser/shared';
import { ExternalLink, CheckCircle2, Clock, Globe } from 'lucide-react';

interface SourcesRailProps {
  citations: SourceCitation[];
  selectedCitationIndex: number | null;
  onSelectCitation: (index: number) => void;
}

export const SourcesRail: React.FC<SourcesRailProps> = ({
  citations,
  selectedCitationIndex,
  onSelectCitation,
}) => {
  return (
    <aside
      aria-label="Authoritative Sources and Citations"
      className="space-y-3"
    >
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
            Sources ({citations.length})
          </h3>
        </div>
        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">Deduplicated</span>
      </div>

      <div className="space-y-2.5">
        {citations.map((source) => {
          const isSelected = selectedCitationIndex === source.index;
          return (
            <div
              key={source.id}
              onClick={() => onSelectCitation(source.index)}
              className={`p-3.5 rounded-2xl liquid-card cursor-pointer transition-all ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30'
                  : ''
              }`}
            >
              {/* Top Row: Index & Domain */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-4 h-4 rounded-md flex items-center justify-center font-mono text-[9px] font-bold ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-black/10 dark:bg-white/10 text-zinc-800 dark:text-zinc-200'
                    }`}
                  >
                    {source.index}
                  </span>
                  <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300 font-mono truncate max-w-[130px]">
                    {source.domain}
                  </span>
                  {source.provenance === 'live' && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25">
                      Live
                    </span>
                  )}
                  {source.provenance === 'cached' && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-blue-500/15 text-blue-800 dark:text-blue-300 border border-blue-500/25">
                      Cached
                    </span>
                  )}
                  {source.provenance === 'mock' && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/25">
                      Fixture
                    </span>
                  )}
                  {source.isVerifiedDomain && (
                    <span title="Verified authoritative domain">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    </span>
                  )}
                </div>

                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  title="Open source URL in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Title */}
              <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">
                {source.title}
              </h4>

              {/* Snippet Excerpt */}
              <p className="mt-1.5 text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-3">
                "{source.snippet}"
              </p>

              {/* Freshness */}
              {source.freshness && (
                <div className="mt-2.5 pt-2 border-t border-black/5 dark:border-white/5 flex items-center gap-1.5 text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{source.freshness}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
