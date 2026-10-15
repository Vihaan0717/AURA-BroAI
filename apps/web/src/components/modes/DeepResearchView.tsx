import React, { useState } from 'react';
import { DeepResearchReport } from '@private-browser/shared';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  HelpCircle,
  GitCompare,
  BookOpen,
} from 'lucide-react';

interface DeepResearchViewProps {
  report: DeepResearchReport;
}

export const DeepResearchView: React.FC<DeepResearchViewProps> = ({ report }) => {
  const [activeTab, setActiveTab] = useState<'synthesis' | 'evidence' | 'gaps' | 'sources'>('synthesis');

  const sources = report.sourcesRetrieved || [];
  const plan = report.plan || report.researchPlan || [];
  const gaps = report.identifiedGaps || report.researchGaps || [];
  const corroborated = report.evidenceMatrix?.corroboratedClaims || [];
  const conflicting = report.evidenceMatrix?.conflictingEvidence || [];
  const topic = report.refinedTopic || report.query;
  const goal = report.researchGoal || 'Synthesize multi-source evidence and resolve conflicting claims.';
  const limitations =
    report.limitationsDisclaimer ||
    'This investigation synthesized verified research sources. Bounded search scope (limit: 12 sources). Does not claim exhaustive internet coverage.';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Research Goal & Executive Header */}
      <div className="liquid-card rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  Deep Research Synthesis
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                  Evidence-Corroborated
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-0.5 font-mono">
                Topic: {topic}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-[11px] font-mono px-3 py-1 rounded-xl liquid-pill text-zinc-700 dark:text-zinc-300">
              {sources.length} Verified Sources Grounded
            </span>
          </div>
        </div>

        {/* Goal Description */}
        <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">Investigation Goal: </strong>
          {goal}
        </p>

        {/* Multi-Step Research Plan Progress */}
        <div className="mt-6 pt-5 border-t border-black/5 dark:border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              Investigation Execution Plan
            </h3>
            <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
              {plan.filter((s) => s.status === 'completed').length} / {plan.length} Steps Completed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {plan.map((step, idx) => {
              const isDone = step.status === 'completed';
              const isInProgress = step.status === 'in_progress';
              return (
                <div
                  key={step.id || `step-${idx}`}
                  className={`p-3 rounded-2xl text-xs transition-all ${
                    isDone
                      ? 'liquid-pill border-emerald-500/30'
                      : isInProgress
                      ? 'liquid-card border-emerald-500/50 bg-emerald-500/10'
                      : 'liquid-pill opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-semibold text-zinc-500 dark:text-zinc-400">
                      Phase {step.stepNumber || idx + 1}
                    </span>
                    {isDone ? (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Done
                      </span>
                    ) : isInProgress ? (
                      <span className="flex items-center gap-1 text-[10px] text-teal-600 dark:text-teal-400 font-semibold animate-pulse">
                        <Clock className="w-3 h-3" /> In Progress
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-400">Pending</span>
                    )}
                  </div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100 text-[11px] leading-snug">
                    {step.question}
                  </p>
                  {step.keyFinding && (
                    <p className="text-[10px] text-zinc-600 dark:text-zinc-400 mt-1 italic line-clamp-2">
                      Finding: {step.keyFinding}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('synthesis')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'synthesis'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'liquid-pill text-zinc-700 dark:text-zinc-300'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Executive Synthesis</span>
        </button>
        <button
          onClick={() => setActiveTab('evidence')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'evidence'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'liquid-pill text-zinc-700 dark:text-zinc-300'
          }`}
        >
          <GitCompare className="w-3.5 h-3.5" />
          <span>Evidence & Conflict Matrix</span>
        </button>
        <button
          onClick={() => setActiveTab('gaps')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'gaps'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'liquid-pill text-zinc-700 dark:text-zinc-300'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Identified Gaps ({gaps.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('sources')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'sources'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'liquid-pill text-zinc-700 dark:text-zinc-300'
          }`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Retrieved Sources ({sources.length})</span>
        </button>
      </div>

      {/* Tab 1: Executive Synthesis */}
      {activeTab === 'synthesis' && (
        <div className="space-y-6 animate-fade-in">
          <div className="liquid-card rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              Structured Synthesis Report
            </h3>
            <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line">
              {report.executiveSummary}
            </div>
          </div>

          {/* Honest Limitations Callout */}
          <div className="liquid-card rounded-2xl p-4 flex items-start gap-3 bg-amber-500/10 border-amber-500/30">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-zinc-700 dark:text-zinc-300">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                Boundaries of Research:{' '}
              </span>
              {limitations}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Evidence & Conflict Matrix */}
      {activeTab === 'evidence' && (
        <div className="space-y-6 animate-fade-in">
          {/* Corroborated Claims */}
          <div className="liquid-card rounded-3xl p-6 sm:p-7 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Corroborated Claims (Multi-Source Verification)
            </h3>
            <div className="space-y-3">
              {corroborated.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl liquid-pill text-xs space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed">
                      {item.claim}
                    </p>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase flex-shrink-0 ${
                        item.confidence === 'established'
                          ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                          : 'bg-blue-500/15 text-blue-800 dark:text-blue-300'
                      }`}
                    >
                      {item.confidence || 'verified'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-zinc-500">Supported by:</span>
                    {item.sources?.map((src, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-[10px] font-mono text-zinc-700 dark:text-zinc-300"
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conflicting Evidence */}
          <div className="liquid-card rounded-3xl p-6 sm:p-7 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Conflicting Evidence & Nuance
            </h3>
            <div className="space-y-4">
              {conflicting.map((conflict, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-3 text-xs"
                >
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">
                    Issue: {conflict.issue}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl liquid-card border-blue-500/25">
                      <span className="text-[10px] font-mono text-blue-700 dark:text-blue-300 font-semibold block mb-1">
                        Perspective A ({conflict.perspectiveA.source})
                      </span>
                      <p className="text-zinc-700 dark:text-zinc-300 text-[11px] leading-relaxed">
                        {conflict.perspectiveA.assertion}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl liquid-card border-amber-500/25">
                      <span className="text-[10px] font-mono text-amber-700 dark:text-amber-300 font-semibold block mb-1">
                        Perspective B ({conflict.perspectiveB.source})
                      </span>
                      <p className="text-zinc-700 dark:text-zinc-300 text-[11px] leading-relaxed">
                        {conflict.perspectiveB.assertion}
                      </p>
                    </div>
                  </div>
                  {conflict.resolutionOrVerdict && (
                    <div className="pt-2 border-t border-black/5 dark:border-white/5 text-[11px] text-zinc-800 dark:text-zinc-200">
                      <strong className="text-emerald-700 dark:text-emerald-400">Synthesis / Resolution: </strong>
                      {conflict.resolutionOrVerdict}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Identified Gaps */}
      {activeTab === 'gaps' && (
        <div className="liquid-card rounded-3xl p-6 sm:p-8 space-y-4 animate-fade-in">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Identified Research Gaps & Unanswered Questions
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-300">
            Aura does not fabricate certainty. These areas require ongoing empirical study or proprietary telemetry data that is not publicly verified:
          </p>
          <ul className="space-y-2.5 pt-2">
            {gaps.map((gap, idx) => (
              <li
                key={idx}
                className="p-3 rounded-xl liquid-pill text-xs text-zinc-800 dark:text-zinc-200 flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[11px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tab 4: Sources Retrieved */}
      {activeTab === 'sources' && (
        <div className="liquid-card rounded-3xl p-6 sm:p-8 space-y-4 animate-fade-in">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
            Deduplicated Primary Evidence Sources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {sources.map((src) => (
              <a
                key={src.id}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl liquid-pill hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                      {src.domain}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-600 transition-colors" />
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {src.title}
                  </h4>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
                    {src.snippet}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>Relevance: {(src.relevanceScore * 100).toFixed(0)}%</span>
                  <span className="text-emerald-600">Verified Citation</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
