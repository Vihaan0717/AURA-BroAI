import React from 'react';
import { EvidenceSummary, EvidenceType } from '@private-browser/shared';
import { ShieldAlert, Info, AlertTriangle, CheckCircle, Scale } from 'lucide-react';

interface EvidenceBarProps {
  evidenceList: EvidenceSummary[];
  conflictingFindings?: string[];
  unverifiedAspects?: string[];
}

export const EvidenceBar: React.FC<EvidenceBarProps> = ({
  evidenceList,
  conflictingFindings,
  unverifiedAspects,
}) => {
  const getBadgeForType = (type: EvidenceType) => {
    switch (type) {
      case 'fact':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25">
            <CheckCircle className="w-3 h-3" />
            Verified Fact
          </span>
        );
      case 'estimate':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/25">
            <Scale className="w-3 h-3" />
            Empirical Estimate
          </span>
        );
      case 'opinion':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-purple-500/15 text-purple-800 dark:text-purple-300 border border-purple-500/25">
            <Info className="w-3 h-3" />
            Attributed Opinion
          </span>
        );
      case 'inference':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-blue-500/15 text-blue-800 dark:text-blue-300 border border-blue-500/25">
            <Info className="w-3 h-3" />
            AI Synthesis
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Conflicting Findings Alert */}
      {conflictingFindings && conflictingFindings.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs animate-fade-in backdrop-blur-md">
          <div className="flex items-center gap-2 font-semibold mb-1 text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Conflicting Evidence Identified Across Sources</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-amber-800/90 dark:text-amber-200/80 pl-1 text-[11px] leading-relaxed">
            {conflictingFindings.map((conflict, i) => (
              <li key={i}>{conflict}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Unverified Aspects Disclosure */}
      {unverifiedAspects && unverifiedAspects.length > 0 && (
        <div className="p-4 rounded-2xl liquid-card text-xs text-zinc-700 dark:text-zinc-300">
          <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            <ShieldAlert className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Epistemic Boundary: Unverified / Insufficient Data</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-300 text-[11px]">
            {unverifiedAspects.map((unv, i) => (
              <li key={i}>{unv}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Evidence Classification Matrix */}
      <div className="liquid-card rounded-2xl p-4 sm:p-5">
        <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">
          Claim Evidence Verification & Epistemic Status
        </h3>
        <div className="space-y-2">
          {evidenceList.map((ev) => (
            <div
              key={ev.id}
              className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-start gap-2">
                <span className="text-xs text-zinc-900 dark:text-zinc-100 leading-snug">
                  {ev.claim}
                </span>
                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  {ev.citationIndices.map((ci) => `[${ci}]`).join(' ')}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-center">
                {getBadgeForType(ev.type)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
