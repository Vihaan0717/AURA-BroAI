import React, { useState } from 'react';
import { EntertainmentItem } from '@private-browser/shared';
import {
  Film,
  Tv2,
  ExternalLink,
  Flame,
  Popcorn,
  Heart,
  Ban,
  Eye,
  EyeOff,
} from 'lucide-react';

interface EntertainmentViewProps {
  item: EntertainmentItem;
}

export const EntertainmentView: React.FC<EntertainmentViewProps> = ({ item }) => {
  const [showSpoilers, setShowSpoilers] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title & Banner Card */}
      <div className="liquid-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-mono font-medium bg-purple-500/15 text-purple-800 dark:text-purple-300 border border-purple-500/25">
                {item.type.toUpperCase()} • {item.year}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                {item.runtime}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-md liquid-pill text-zinc-700 dark:text-zinc-300">
                {item.releaseStatus === 'released' ? 'Available on Streaming & Theatrical' : item.releaseStatus}
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/25 font-mono">
                {item.ratingsProvenance === 'verified_api' ? 'Verified Live Ratings' : 'Curated Reference Catalog (Unverified Live Ratings)'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              {item.title}
            </h2>

            {/* Genres & Tone Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.genre.map((g) => (
                <span
                  key={g}
                  className="px-2.5 py-0.5 rounded-lg text-xs liquid-pill text-zinc-800 dark:text-zinc-200"
                >
                  {g}
                </span>
              ))}
              <span className="text-zinc-400 text-xs self-center px-1">•</span>
              {item.tone.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-0.5 rounded-lg text-xs bg-purple-500/15 text-purple-800 dark:text-purple-300 border border-purple-500/20"
                >
                  {t}
                </span>
              ))}
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-300 font-mono pt-1">
              Pacing: <span className="text-zinc-900 dark:text-zinc-100 font-medium">{item.pacing}</span>
            </p>
          </div>

          {/* Official Trailer Button */}
          {item.trailers[0] && (
            <a
              href={item.trailers[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl liquid-pill text-zinc-900 dark:text-zinc-100 text-xs font-semibold transition-all self-start flex-shrink-0"
            >
              <Film className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Watch Official Preview</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </a>
          )}
        </div>
      </div>

      {/* Ratings Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Critics Score */}
        <div className="liquid-card rounded-3xl p-6 sm:p-7">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-500" />
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Professional Critics Consensus
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">Tomatometer</span>
          </div>

          <div className="flex items-baseline gap-3 my-2">
            <span className="text-4xl font-extrabold text-red-600 dark:text-red-400 tracking-tight font-mono">
              {item.ratings.tomatometerPercent}%
            </span>
            <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
              Certified Fresh
            </span>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mt-2">
            {item.ratings.criticsScore?.details || 'Based on reviews from verified professional publications.'}
          </p>
        </div>

        {/* Audience Score */}
        <div className="liquid-card rounded-3xl p-6 sm:p-7">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Popcorn className="w-5 h-5 text-amber-500" />
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Verified Audience Sentiment
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">Popcornmeter</span>
          </div>

          <div className="flex items-baseline gap-3 my-2">
            <span className="text-4xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight font-mono">
              {item.ratings.popcornmeterPercent}%
            </span>
            <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
              Verified Ticket Buyers
            </span>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mt-2">
            {item.ratings.audienceScore?.details || 'Aggregated from verified cinema attendees.'}
          </p>
        </div>
      </div>

      {/* Streaming Availability */}
      <div className="liquid-card rounded-3xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2">
          <Tv2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
            Streaming Platforms & Regional Rights
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {item.streamingAvailability.map((stream, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/5 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">
                  {stream.platform}
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono mt-0.5 block">
                  Region: {stream.region}
                </span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md liquid-pill mt-2 self-start">
                {stream.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Audience Match Profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="liquid-card rounded-3xl p-6 sm:p-7 space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <Heart className="w-4 h-4" />
            <h4 className="text-xs font-semibold uppercase tracking-wider">
              Who Will Love This Movie
            </h4>
          </div>
          <ul className="list-disc list-inside space-y-2 text-xs text-zinc-700 dark:text-zinc-300 pl-1 leading-relaxed">
            {item.audienceMatchProfile.whoWillEnjoy.map((enjoy, i) => (
              <li key={i}>{enjoy}</li>
            ))}
          </ul>
        </div>

        <div className="liquid-card rounded-3xl p-6 sm:p-7 space-y-3">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <Ban className="w-4 h-4" />
            <h4 className="text-xs font-semibold uppercase tracking-wider">
              Who Might Dislike It
            </h4>
          </div>
          <ul className="list-disc list-inside space-y-2 text-xs text-zinc-700 dark:text-zinc-300 pl-1 leading-relaxed">
            {item.audienceMatchProfile.whoMightDislike.map((dislike, i) => (
              <li key={i}>{dislike}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Default Spoiler-Free Synopsis with Explicit Spoiler Reveal Container */}
      <div className="liquid-card rounded-3xl p-6 sm:p-7 space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Spoiler-Free Synopsis (Default)
            </h4>
          </div>
          <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
            {item.spoilerFreeSynopsis}
          </p>
        </div>

        {/* Spoilers Container */}
        {item.spoilerContent && (
          <div className="pt-4 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                Substantial Plot Spoilers
              </span>
              <button
                onClick={() => setShowSpoilers(!showSpoilers)}
                className="liquid-pill flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
              >
                {showSpoilers ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide Spoilers</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Reveal Spoilers</span>
                  </>
                )}
              </button>
            </div>

            {showSpoilers ? (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed animate-fade-in">
                {item.spoilerContent}
              </div>
            ) : (
              <div
                onClick={() => setShowSpoilers(true)}
                className="p-5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/5 text-center cursor-pointer hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-colors"
              >
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                  [Spoilers Protected: Click 'Reveal Spoilers' above or click here to confirm you wish to view key plot developments]
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
